// 1. Spotlight Mouse Tracking
const spotlight = document.getElementById('spotlight');

document.addEventListener('mousemove', (e) => {
    spotlight.style.opacity = '1';
    spotlight.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(109, 40, 217, 0.12), transparent 40%)`;
});

// 2. Scroll Animation Observer
const observerOptions = { threshold: 0.15 };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Select all elements with hidden classes
const elementsToAnimate = document.querySelectorAll('.hidden-up, .hidden-left, .hidden-right, .hidden-scale');
elementsToAnimate.forEach(el => observer.observe(el));