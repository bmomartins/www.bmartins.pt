// Handles contact form submissions.
// Required env vars:
//   RESEND_API_KEY      — Resend API key
// Optional env vars:
//   CONTACT_FROM_EMAIL  — From address (default: contact-form@bmartins.pt)
//   CONTACT_TO_EMAIL    — To address (default: bruno@bmartins.pt)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_HUMAN_SUBMIT_MS = 3000;
const ipSubmissions = new Map();

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let name, email, subject, message, website, formStartedAt;
    try {
        const params = new URLSearchParams(event.body);
        name = (params.get('name') || '').trim();
        email = (params.get('email') || '').trim();
        subject = (params.get('subject') || '').trim();
        message = (params.get('message') || '').trim();
        website = (params.get('website') || '').trim();
        formStartedAt = (params.get('form_started_at') || '').trim();
    } catch (err) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
    }

    if (!name || !email || !subject || !message) {
        return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required' }) };
    }

    if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 5000) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid field lengths' }) };
    }

    if (website) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Submission blocked' }) };
    }

    const startedAt = Number(formStartedAt);
    if (!Number.isFinite(startedAt) || startedAt <= 0 || Date.now() - startedAt < MIN_HUMAN_SUBMIT_MS) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Submission blocked' }) };
    }

    const headers = event.headers || {};
    const forwardedFor = headers['x-forwarded-for'] || headers['X-Forwarded-For'] || '';
    const remoteIp = String(forwardedFor).split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const existing = ipSubmissions.get(remoteIp) || [];
    const recent = existing.filter(function (ts) { return now - ts < RATE_LIMIT_WINDOW_MS; });
    recent.push(now);
    ipSubmissions.set(remoteIp, recent);
    if (recent.length > RATE_LIMIT_MAX_REQUESTS) {
        return {
            statusCode: 429,
            headers: { 'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) },
            body: JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        };
    }

    if (ipSubmissions.size > 10000) {
        for (const [ip, timestamps] of ipSubmissions.entries()) {
            const valid = timestamps.filter(function (ts) { return now - ts < RATE_LIMIT_WINDOW_MS; });
            if (valid.length === 0) {
                ipSubmissions.delete(ip);
            } else {
                ipSubmissions.set(ip, valid);
            }
        }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('RESEND_API_KEY is not configured');
        return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    const from = process.env.CONTACT_FROM_EMAIL || 'contact-form@bmartins.pt';
    const to = process.env.CONTACT_TO_EMAIL || 'bruno@bmartins.pt';

    const html = `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr/>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from,
            to,
            reply_to: email,
            subject: '[Contact] ' + subject,
            html,
        }),
    });

    if (!resendRes.ok) {
        const resendBody = await resendRes.text();
        console.error('Resend API error:', resendRes.status, resendBody);
        return { statusCode: 502, body: JSON.stringify({ error: 'Failed to send message. Please try again.' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
};

function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
