// Initialise dark mode — also set inline in <head> per-page to prevent flash
(function () {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else if (saved === 'light') {
        document.documentElement.classList.remove('dark');
    }
}());

window.contactFormTurnstileReady = Boolean(window.turnstile && typeof window.turnstile.render === 'function');
window.onTurnstileLoad = function () {
    window.contactFormTurnstileReady = true;
    if (typeof window.renderContactTurnstile === 'function') {
        window.renderContactTurnstile();
    }
};

document.addEventListener('DOMContentLoaded', async function () {
    // Load header
    const headerResponse = await fetch('/components/header.html');
    const headerContent = await headerResponse.text();
    document.getElementById('header-container').innerHTML = headerContent;

    // Mark active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav-link').forEach(function (link) {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Contact form — AJAX submission to Netlify function
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('submit-btn');
        const formError = document.getElementById('form-error');

        // Turnstile setup: render widget once both the script and site key are ready
        let turnstileSiteKey = null;
        let turnstileReady = window.contactFormTurnstileReady;
        let turnstileWidgetId = null;

        function renderTurnstileWidget() {
            if (turnstileReady && turnstileSiteKey && turnstileWidgetId === null) {
                turnstileWidgetId = window.turnstile.render('#turnstile-container', {
                    sitekey: turnstileSiteKey,
                    callback: function () { submitBtn.disabled = false; },
                    'expired-callback': function () { submitBtn.disabled = true; },
                    'error-callback': function () { submitBtn.disabled = true; },
                });
            }
        }

        window.renderContactTurnstile = function () {
            turnstileReady = true;
            renderTurnstileWidget();
        };

        fetch('/.netlify/functions/contact-config')
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.turnstileSiteKey) {
                    turnstileSiteKey = data.turnstileSiteKey;
                    renderTurnstileWidget();
                } else {
                    submitBtn.disabled = false;
                }
            })
            .catch(function () {
                submitBtn.disabled = false;
            });

        if (turnstileReady) {
            window.renderContactTurnstile();
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Client-side validation
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const subject = contactForm.querySelector('[name="subject"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !subject || !message) {
                formError.textContent = 'Please fill in all fields.';
                formError.classList.remove('hidden');
                return;
            }
            if (!emailPattern.test(email)) {
                formError.textContent = 'Please enter a valid email address.';
                formError.classList.remove('hidden');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            formError.classList.add('hidden');

            try {
                if (turnstileSiteKey && turnstileWidgetId === null) {
                    throw new Error('CAPTCHA is not ready yet. Please wait a moment and try again.');
                }

                const formParams = new URLSearchParams(new FormData(contactForm));
                if (window.turnstile && turnstileWidgetId !== null) {
                    formParams.set('cf-turnstile-response', window.turnstile.getResponse(turnstileWidgetId) || '');
                }

                const response = await fetch('/.netlify/functions/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formParams.toString(),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    document.getElementById('form-container').classList.add('hidden');
                    document.getElementById('success-container').classList.remove('hidden');
                } else {
                    throw new Error(data.error || 'Unexpected error');
                }
            } catch (err) {
                formError.textContent = err.message && err.message !== 'Failed to fetch'
                    ? err.message
                    : 'Something went wrong. Please try again or email me directly.';
                formError.classList.remove('hidden');
                submitBtn.textContent = 'Send Message';
                // Reset Turnstile so user can get a fresh token
                if (window.turnstile && turnstileWidgetId !== null) {
                    window.turnstile.reset(turnstileWidgetId);
                    submitBtn.disabled = true;
                }
            }
        });
    }
});
