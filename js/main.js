document.addEventListener('DOMContentLoaded', async function() {
    // Load header
    const headerResponse = await fetch('/components/header.html');
    const headerContent = await headerResponse.text();
    document.getElementById('header-container').innerHTML = headerContent;

    // Load footer
    const footerResponse = await fetch('/components/footer.html');
    const footerContent = await footerResponse.text();
    document.getElementById('footer-container').innerHTML = footerContent;

    // Update active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});