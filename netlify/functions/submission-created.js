// Triggered automatically by Netlify whenever a new form submission is received.
// Requires the RESEND_API_KEY environment variable to be set in the Netlify dashboard.
exports.handler = async function (event) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('RESEND_API_KEY is not set — skipping email notification');
        return { statusCode: 200 };
    }

    let payload;
    try {
        payload = JSON.parse(event.body).payload;
    } catch (err) {
        console.error('Failed to parse event body:', err);
        return { statusCode: 200 };
    }

    const { name, email, subject, message } = payload.data || {};

    const html = `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr/>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + apiKey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'contact-form@bmartins.pt',
            to: 'bruno@bmartins.pt',
            reply_to: email,
            subject: `[Contact] ${subject}`,
            html,
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        console.error('Resend API error:', response.status, body);
    }

    return { statusCode: 200 };
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
