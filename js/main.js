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

document.addEventListener('DOMContentLoaded', async function () {
    // Load header
    const headerResponse = await fetch('/components/header.html');
    const headerContent = await headerResponse.text();
    document.getElementById('header-container').innerHTML = headerContent;

    // Apply translations (header + page content)
    if (window.i18n) {
        window.i18n.apply();
    }

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

    // Language toggle
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle && window.i18n) {
        langToggle.addEventListener('click', function () {
            const newLang = window.i18n.getLang() === 'en' ? 'pt' : 'en';
            window.i18n.setLang(newLang);
        });
    }

    // Contact form — AJAX submission to Netlify function
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('submit-btn');
        const formError = document.getElementById('form-error');
        const formContainer = document.getElementById('form-container');
        const successContainer = document.getElementById('success-container');
        const sendAnotherBtn = document.getElementById('send-another-btn');
        const formStartedAt = document.getElementById('form-started-at');
        const hcaptchaWidget = document.getElementById('hcaptcha-widget');
        let hcaptchaWidgetId = null;

        function stampFormStart() {
            if (formStartedAt) {
                formStartedAt.value = String(Date.now());
            }
        }

        function resetHcaptcha() {
            if (window.hcaptcha && hcaptchaWidgetId !== null) {
                window.hcaptcha.reset(hcaptchaWidgetId);
            }
        }

        async function waitForHcaptcha(timeoutMs) {
            if (window.hcaptcha && typeof window.hcaptcha.render === 'function') {
                return;
            }
            if (!window._hcaptchaReady) {
                throw new Error('hCaptcha script did not load');
            }
            await Promise.race([
                window._hcaptchaReady,
                new Promise(function (_, reject) {
                    setTimeout(function () { reject(new Error('hCaptcha script did not load')); }, timeoutMs);
                }),
            ]);
        }

        async function setupHcaptcha() {
            if (!hcaptchaWidget) {
                return;
            }

            const configResponse = await fetch('/.netlify/functions/contact-config');
            if (!configResponse.ok) {
                throw new Error('Failed to load contact form configuration');
            }

            const config = await configResponse.json();
            if (!config.hcaptchaSiteKey) {
                throw new Error('Captcha is not configured');
            }

            await waitForHcaptcha(5000);
            hcaptchaWidgetId = window.hcaptcha.render('hcaptcha-widget', {
                sitekey: config.hcaptchaSiteKey,
            });
        }

        function resetContactFormState() {
            contactForm.reset();
            stampFormStart();
            resetHcaptcha();
            formError.classList.add('hidden');
            submitBtn.textContent = window.i18n ? window.i18n.t('contact.submit') : 'Send Message';
            submitBtn.disabled = false;
        };

        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', function () {
                successContainer.classList.add('hidden');
                formContainer.classList.remove('hidden');
                resetContactFormState();
            });
        }

        try {
            await setupHcaptcha();
        } catch (err) {
            formError.textContent = window.i18n ? window.i18n.t('contact.error.generic') : 'Something went wrong. Please try again or email me directly.';
            formError.classList.remove('hidden');
            submitBtn.disabled = true;
        }

        stampFormStart();

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Client-side validation
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const subject = contactForm.querySelector('[name="subject"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();
            const hcaptchaInput = contactForm.querySelector('[name="h-captcha-response"]');
            const hcaptchaToken = hcaptchaInput ? hcaptchaInput.value.trim() : '';
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !subject || !message) {
                formError.textContent = window.i18n ? window.i18n.t('contact.error.required') : 'Please fill in all fields.';
                formError.classList.remove('hidden');
                return;
            }
            if (!emailPattern.test(email)) {
                formError.textContent = window.i18n ? window.i18n.t('contact.error.email') : 'Please enter a valid email address.';
                formError.classList.remove('hidden');
                return;
            }
            if (!hcaptchaToken) {
                formError.textContent = window.i18n ? window.i18n.t('contact.error.captcha') : 'Please complete the captcha challenge.';
                formError.classList.remove('hidden');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = window.i18n ? window.i18n.t('contact.submitting') : 'Sending\u2026';
            formError.classList.add('hidden');

            try {
                const formParams = new URLSearchParams(new FormData(contactForm));

                const response = await fetch('/.netlify/functions/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formParams.toString(),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    formContainer.classList.add('hidden');
                    successContainer.classList.remove('hidden');
                    resetContactFormState();
                } else {
                    throw new Error(data.error || 'Unexpected error');
                }
            } catch (err) {
                resetHcaptcha();
                formError.textContent = err.message && err.message !== 'Failed to fetch'
                    ? err.message
                    : (window.i18n ? window.i18n.t('contact.error.generic') : 'Something went wrong. Please try again or email me directly.');
                formError.classList.remove('hidden');
                submitBtn.textContent = window.i18n ? window.i18n.t('contact.submit') : 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }
});
