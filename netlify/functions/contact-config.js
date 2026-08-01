// Exposes public contact form configuration to the frontend.
exports.handler = async function () {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    };
};
