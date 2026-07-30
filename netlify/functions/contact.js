// Handles contact form submissions.
// Required env vars:
//   RESEND_API_KEY       — Resend API key
//   TURNSTILE_SECRET_KEY — Cloudflare Turnstile secret key
// Optional env vars:
//   RESEND_FROM          — From address (default: contact-form@bmartins.pt)
//   NOTIFICATION_EMAIL   — To address (default: bruno@bmartins.pt)
exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let name, email, subject, message, turnstileToken;
    try {
        const params = new URLSearchParams(event.body);
        name = (params.get('name') || '').trim();
        email = (params.get('email') || '').trim();
        subject = (params.get('subject') || '').trim();
        message = (params.get('message') || '').trim();
        turnstileToken = params.get('cf-turnstile-response') || '';
    } catch (err) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
    }

    if (!name || !email || !subject || !message) {
        return { statusCode: 400, body: JSON.stringify({ error: 'All fields are required' }) };
    }

    // Verify Turnstile CAPTCHA
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: turnstileSecret,
                response: turnstileToken,
                remoteip: event.headers['x-forwarded-for'] || '',
            }).toString(),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
            console.warn('Turnstile verification failed:', verifyData['error-codes']);
            return { statusCode: 400, body: JSON.stringify({ error: 'CAPTCHA verification failed. Please try again.' }) };
        }
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('RESEND_API_KEY is not configured');
        return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    const from = process.env.RESEND_FROM || 'contact-form@bmartins.pt';
    const to = process.env.NOTIFICATION_EMAIL || 'bruno@bmartins.pt';

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
