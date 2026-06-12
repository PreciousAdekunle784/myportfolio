// ============================================
// PRECIOUS PORTFOLIO — NEXT-GEN INTERACTIONS
// ============================================

// 1. Custom Cursor
const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
const cursorDot = document.createElement('div');
cursorDot.id = 'cursor-dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let cursorX = 0, cursorY = 0, dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';

    // Spotlight
    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
        spotlight.style.opacity = '1';
        spotlight.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124, 58, 237, 0.08), transparent 40%)`;
    }
});

function animateCursor() {
    dotX += (cursorX - dotX) * 0.15;
    dotY += (cursorY - dotY) * 0.15;
    cursor.style.left = dotX + 'px';
    cursor.style.top = dotY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor states on interactive elements
document.querySelectorAll('a, button, .cta-button, .service-card, .framework-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('dot-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('dot-hover');
    });
});

// 2. Scroll Progress Bar
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// 3. Split Text Hero Animation
function splitText(element) {
    const text = element.textContent;
    element.innerHTML = '';
    element.setAttribute('aria-label', text);
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.classList.add('split-char');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${0.6 + i * 0.03}s`;
        element.appendChild(span);
    });
}

// Apply to gradient-text elements in hero
document.querySelectorAll('.hero .gradient-text').forEach(el => splitText(el));

// 4. 3D Tilt Effect on Cards
function initTilt() {
    const cards = document.querySelectorAll('.service-card, .framework-card, .stat-card, .timeline-content');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Dynamic shine
            const shine = card.querySelector('.card-shine') || createShine(card);
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(167,139,250,0.15) 0%, transparent 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
            const shine = card.querySelector('.card-shine');
            if (shine) shine.style.background = 'transparent';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

function createShine(card) {
    const shine = document.createElement('div');
    shine.classList.add('card-shine');
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(shine);
    return shine;
}

initTilt();

// 5. Magnetic Buttons
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    });
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'none';
    });
});

// 6. Parallax Orbs on Scroll
function parallaxOrbs() {
    const orbs = document.querySelectorAll('.hero-orb, .footer-orb');
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.15;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
}
window.addEventListener('scroll', parallaxOrbs);

// 7. Enhanced Scroll Reveal with Stagger
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');

            // Stagger children if it's a grid
            if (entry.target.classList.contains('cards-grid') ||
                entry.target.classList.contains('framework-grid') ||
                entry.target.classList.contains('about-stats-row')) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    setTimeout(() => child.classList.add('show'), i * 120);
                });
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden-up, .hidden-left, .hidden-right, .hidden-scale').forEach(el => {
    observer.observe(el);
});

// 8. Navbar blur on scroll
const nav = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

// 9. Smooth Section Anchor Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 10. Typing Effect for Subheadline
function typeWriter(element, speed = 20) {
    const text = element.textContent;
    const html = element.innerHTML;
    element.style.opacity = '0';

    const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            element.style.opacity = '1';
            element.innerHTML = '';
            let i = 0;
            // Use the plain text for typing
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    // Restore the HTML with formatting
                    element.innerHTML = html;
                }
            }
            type();
            io.disconnect();
        }
    }, { threshold: 0.5 });
    io.observe(element);
}

// 11. Animated counter for any future stat numbers
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const target = parseInt(el.dataset.count);
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target + (el.dataset.suffix || '');
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
                    }
                }, 16);
                io.disconnect();
            }
        }, { threshold: 0.5 });
        io.observe(el);
    });
}
animateCounters();

// 12. Ripple effect on CTA buttons
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// 13. Mobile menu toggle
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
        menuToggle.classList.toggle('menu-active');
    });
}

// ============================================
// 14. ANALYTICS — Bar Chart Animations
// ============================================
function initBarCharts() {
    const bars = document.querySelectorAll('.bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const value = parseFloat(bar.dataset.width);
                const max = parseFloat(bar.dataset.max);
                const percent = (value / max) * 100;
                setTimeout(() => {
                    bar.style.width = percent + '%';
                    bar.classList.add('animated');
                }, 200);
                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => barObserver.observe(bar));
}
initBarCharts();

// 15. ANALYTICS — Circular Gauge Animations
function initGauges() {
    const gauges = document.querySelectorAll('.gauge-fill');
    const circumference = 2 * Math.PI * 52; // r=52

    const gaugeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const percent = parseInt(circle.dataset.percent);
                const offset = circumference - (percent / 100) * circumference;
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 300);
                gaugeObserver.unobserve(circle);
            }
        });
    }, { threshold: 0.3 });

    gauges.forEach(g => gaugeObserver.observe(g));
}
initGauges();

// 16. ANALYTICS — Stat Number Counters
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number, .gauge-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                const isDecimal = target % 1 !== 0;
                let current = 0;
                const duration = 1500;
                const steps = 60;
                const increment = target / steps;
                let step = 0;

                const timer = setInterval(() => {
                    step++;
                    current += increment;
                    if (step >= steps) {
                        el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
                        clearInterval(timer);
                    } else {
                        el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
                    }
                }, duration / steps);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
}
initStatCounters();

// 17. ANALYTICS — Toggle between views
function initAnalyticsToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const views = document.querySelectorAll('.analytics-view');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Switch view
            const targetView = btn.dataset.view;
            views.forEach(view => {
                view.classList.remove('active-view');
                if (view.classList.contains(targetView + '-view')) {
                    view.classList.add('active-view');

                    // Re-trigger gauge animations when switching to gauges
                    if (targetView === 'gauges') {
                        setTimeout(() => {
                            initGauges();
                            initStatCounters();
                        }, 100);
                    }
                    // Re-trigger bar animations
                    if (targetView === 'bars') {
                        const bars = view.querySelectorAll('.bar-fill');
                        bars.forEach(bar => {
                            bar.style.width = '0%';
                            bar.classList.remove('animated');
                        });
                        setTimeout(() => initBarCharts(), 100);
                    }
                }
            });
        });
    });
}
initAnalyticsToggle();
