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

// Sticky Grid Scroll Animation (GSAP + ScrollTrigger)
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    function initStickyGrid() {
        var block = document.querySelector('.sticky-grid-section');
        if (!block) return;

        var wrapper = block.querySelector('.sticky-grid-wrapper');
        var content = block.querySelector('.sticky-grid-content');
        var title = block.querySelector('.sticky-grid-title');
        var desc = block.querySelector('.sticky-grid-desc');
        var btn = block.querySelector('.sticky-grid-btn');
        var grid = block.querySelector('.sticky-grid-list');
        var items = block.querySelectorAll('.sticky-grid-item');

        if (!wrapper || !grid || items.length === 0) return;

        var numColumns = 3;
        var columns = [[], [], []];
        items.forEach(function (item, i) {
            columns[i % numColumns].push(item);
        });

        gsap.set([desc, btn], { opacity: 0, pointerEvents: 'none' });

        var titleOffsetY = 0;
        if (content && title) {
            var dy = (content.offsetHeight - title.offsetHeight) / 2;
            titleOffsetY = (dy / content.offsetHeight) * 100;
            gsap.set(title, { yPercent: titleOffsetY });
        }

        gsap.from(wrapper, {
            yPercent: -100,
            ease: 'none',
            scrollTrigger: {
                trigger: block,
                start: 'top bottom',
                end: 'top top',
                scrub: 1
            }
        });

        gsap.from(title, {
            opacity: 0,
            duration: 0.7,
            ease: 'power1.out',
            scrollTrigger: {
                trigger: block,
                start: 'top 57%',
                toggleActions: 'play none none reset'
            }
        });

        var wh = window.innerHeight;
        var gridDy = wh - (wh - grid.offsetHeight) / 2;

        var mainTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: block,
                start: 'top 25%',
                end: 'bottom bottom',
                scrub: 1
            }
        });

        var revealTl = gsap.timeline();
        columns.forEach(function (column, colIndex) {
            var fromTop = colIndex % 2 === 0;
            revealTl.from(column, {
                y: gridDy * (fromTop ? -1 : 1),
                stagger: { each: 0.06, from: fromTop ? 'end' : 'start' },
                ease: 'power1.inOut'
            }, 'grid-reveal');
        });
        mainTimeline.add(revealTl);

        var zoomTl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } });
        zoomTl.to(grid, { scale: 2.05 });
        zoomTl.to(columns[0], { xPercent: -40 }, '<');
        zoomTl.to(columns[2], { xPercent: 40 }, '<');
        zoomTl.to(columns[1], {
            yPercent: function (index) {
                return (index < Math.floor(columns[1].length / 2) ? -1 : 1) * 40;
            },
            duration: 0.5,
            ease: 'power1.inOut'
        }, '-=0.5');
        mainTimeline.add(zoomTl, '-=0.6');

        mainTimeline.add(function () {
            var isVisible = mainTimeline.scrollTrigger.direction === 1;
            gsap.timeline({ defaults: { overwrite: true } })
                .to(title, {
                    yPercent: isVisible ? 0 : titleOffsetY,
                    duration: 0.7,
                    ease: 'power2.inOut'
                })
                .to([desc, btn], {
                    opacity: isVisible ? 1 : 0,
                    duration: 0.4,
                    ease: isVisible ? 'power1.inOut' : 'power1.out',
                    pointerEvents: isVisible ? 'all' : 'none'
                }, isVisible ? '-=90%' : '<');
        }, '-=0.32');
    }

    function waitForImages(callback) {
        var images = document.querySelectorAll('.sticky-grid-image');
        var loaded = 0;
        var total = images.length;
        if (total === 0) { callback(); return; }
        images.forEach(function (img) {
            if (img.complete) { loaded++; if (loaded === total) callback(); }
            else {
                img.addEventListener('load', function () { loaded++; if (loaded === total) callback(); });
                img.addEventListener('error', function () { loaded++; if (loaded === total) callback(); });
            }
        });
    }

    waitForImages(function () {
        initStickyGrid();
    });
})();

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
