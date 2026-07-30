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

    // Load footer
    const footerResponse = await fetch('/components/footer.html');
    const footerContent = await footerResponse.text();
    document.getElementById('footer-container').innerHTML = footerContent;

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

    // Contact form — AJAX submission to Netlify
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            const formError = document.getElementById('form-error');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            formError.classList.add('hidden');

            try {
                const submissionUrl = contactForm.getAttribute('action') || window.location.pathname || '/contact.html';
                const response = await fetch(submissionUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(new FormData(contactForm)).toString(),
                });

                if (response.ok) {
                    document.getElementById('form-container').classList.add('hidden');
                    document.getElementById('success-container').classList.remove('hidden');
                } else {
                    throw new Error('Server returned ' + response.status);
                }
            } catch (err) {
                formError.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
});