// Exposes public contact form configuration to the frontend.
// Optional env vars:
//   HCAPTCHA_SITE_KEY    — hCaptcha site key
exports.handler = async function () {
    const hcaptchaSiteKey = (process.env.HCAPTCHA_SITE_KEY || '').trim();

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            hcaptchaSiteKey,
        }),
    };
};
