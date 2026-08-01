// Exposes public contact form configuration to the frontend.
// Required env vars:
//   TURNSTILE_SITE_KEY — Cloudflare Turnstile site key (public)
exports.handler = async function () {
    const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY;

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstileSiteKey: turnstileSiteKey || null }),
    };
};
