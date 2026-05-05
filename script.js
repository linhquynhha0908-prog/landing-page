// Scroll-triggered reveal animations
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// Nav scroll effect
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// Smooth parallax on hero visual
const heroVisual = document.querySelector('.hero-visual');

window.addEventListener('scroll', () => {
    if (!heroVisual) return;
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    if (scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Stagger reveal for cards within view
const staggerContainers = document.querySelectorAll('.feature-cards, .testimonial-grid, .how-steps');

staggerContainers.forEach(container => {
    const children = container.querySelectorAll('.reveal');
    const containerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                children.forEach((child, i) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, i * 150);
                });
                containerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    containerObserver.observe(container);
});

// Magnetic hover effect on buttons
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translateY(-2px) translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// Cursor follower dot (subtle)
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: rgba(0,0,0,0.15);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease, opacity 0.3s ease;
    opacity: 0;
`;
document.body.appendChild(cursor);

let cursorVisible = false;
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 4 + 'px';
    cursor.style.top = e.clientY - 4 + 'px';
    if (!cursorVisible) {
        cursor.style.opacity = '1';
        cursorVisible = true;
    }
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorVisible = false;
});

// Interactive hover on feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        card.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(240, 235, 229, 0.5), white)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});
