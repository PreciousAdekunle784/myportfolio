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

// 13. Mobile menu toggle with enhanced functionality
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.querySelector('.menu-toggle');
const navLinksItems = document.querySelectorAll('.nav-links a');

function closeMenu() {
    if (navLinks && menuToggle) {
        navLinks.classList.remove('nav-open');
        menuToggle.classList.remove('menu-active');
    }
}

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('nav-open');
        menuToggle.classList.toggle('menu-active');
    });
}

// Close menu when clicking on a nav link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const isNavArea = navLinks?.contains(e.target);
    const isToggle = menuToggle?.contains(e.target);
    
    if (!isNavArea && !isToggle && navLinks?.classList.contains('nav-open')) {
        closeMenu();
    }
});

// Close menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

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

// ============================================
// WOW FEATURES — NEXT-LEVEL INTERACTIONS
// ============================================

// 18. PRELOADER
(function initPreloader() {
    document.body.classList.add('loading');
    const preloader = document.getElementById('preloader');
    const barFill = document.querySelector('.preloader-bar-fill');
    if (!preloader || !barFill) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 90) progress = 90;
        barFill.style.width = progress + '%';
    }, 150);

    window.addEventListener('load', () => {
        clearInterval(interval);
        barFill.style.width = '100%';

        setTimeout(() => {
            preloader.classList.add('preloader-done');
            document.body.classList.remove('loading');
        }, 600);

        setTimeout(() => {
            preloader.style.display = 'none';
        }, 2200);
    });
})();


// 19. INTERACTIVE PARTICLE NETWORK
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let mouseX = -1000, mouseY = -1000;
    const PARTICLE_COUNT = 70;
    const CONNECTION_DIST = 140;
    const MOUSE_RADIUS = 180;
    const particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
            this.baseAlpha = Math.random() * 0.4 + 0.1;
        }

        update() {
            // Mouse repulsion
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.vx += (dx / dist) * force * 0.6;
                this.vy += (dy / dist) * force * 0.6;
            }

            // Damping
            this.vx *= 0.98;
            this.vy *= 0.98;

            this.x += this.vx;
            this.y += this.vy;

            // Wrap
            if (this.x < 0) this.x = w;
            if (this.x > w) this.x = 0;
            if (this.y < 0) this.y = h;
            if (this.y > h) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${this.baseAlpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Mouse connections
        particles.forEach(p => {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
                const alpha = (1 - dist / MOUSE_RADIUS) * 0.25;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        });
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(loop);
    }
    loop();
})();


// 20. TEXT SCRAMBLE / DECODE EFFECT on Section Headings
(function initTextScramble() {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function scrambleElement(el) {
        const original = el.textContent;
        const length = original.length;
        let iteration = 0;
        const totalIterations = length * 2;
        const speed = 30;

        el.style.visibility = 'visible';

        const timer = setInterval(() => {
            el.textContent = original
                .split('')
                .map((char, i) => {
                    if (char === ' ') return ' ';
                    if (i < iteration / 2) return original[i];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            iteration++;
            if (iteration >= totalIterations) {
                el.textContent = original;
                clearInterval(timer);
            }
        }, speed);
    }

    // Observe all section h2s (not the hero h1)
    const headings = document.querySelectorAll(
        '.about-section h2, .services-section h2, .analytics-section h2, .process-section h2, .portfolio-section h2, .site-footer h2'
    );

    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => scrambleElement(entry.target), 200);
                scrambleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    headings.forEach(h => scrambleObserver.observe(h));
})();


// 21. SCROLL-DRIVEN TEXT HIGHLIGHTING
(function initScrollHighlight() {
    const elements = document.querySelectorAll('[data-highlight]');

    elements.forEach(el => {
        const text = el.textContent.trim();
        const words = text.split(/\s+/);
        el.innerHTML = words
            .map(word => `<span class="highlight-word">${word}</span>`)
            .join(' ');
    });

    function updateHighlights() {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const viewH = window.innerHeight;
            // Progress from 0 to 1 as element scrolls through viewport
            const progress = Math.max(0, Math.min(1,
                (viewH - rect.top) / (viewH + rect.height)
            ));

            const wordEls = el.querySelectorAll('.highlight-word');
            const total = wordEls.length;
            const litCount = Math.floor(progress * total * 1.8); // 1.8x multiplier so it completes before leaving view

            wordEls.forEach((w, i) => {
                if (i < litCount) {
                    w.classList.add('lit');
                } else {
                    w.classList.remove('lit');
                }
            });
        });
    }

    window.addEventListener('scroll', updateHighlights, { passive: true });
    updateHighlights();
})();


// 22. CARD BORDER GLOW TRAIL
(function initBorderGlow() {
    const cards = document.querySelectorAll('.service-card, .framework-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--glow-x', x + 'px');
            card.style.setProperty('--glow-y', y + 'px');
        });
    });
})();


// 23. SMOOTH COUNTER EASING (enhanced version)
// Already have counters — this adds an elastic easing variant
(function enhanceCounters() {
    // Add a subtle scale pop when counters finish
    document.querySelectorAll('.stat-number, .gauge-number').forEach(el => {
        const origObserver = new MutationObserver((mutations) => {
            mutations.forEach(m => {
                if (el.textContent.includes(el.dataset.count)) {
                    el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    el.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        el.style.transform = 'scale(1)';
                    }, 300);
                    origObserver.disconnect();
                }
            });
        });
        origObserver.observe(el, { childList: true, characterData: true, subtree: true });
    });
})();
