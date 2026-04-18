'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
let current   = 0;
const TOTAL   = 6;
let animating = true;
let menuOpen  = false;

// ─── Service Detail Data ─────────────────────────────────────────────────────
const serviceDetails = {
    0: {
        tag: 'Welcome',
        title: 'Consortium of Excellence',
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80',
        body: 'Founded in 2008, Meganuel Consortium is one of Nigeria\'s most trusted names in construction and infrastructure development. We\'ve delivered over 150 projects across Lagos, Abuja, and the wider West African region — spanning commercial towers, government infrastructure, luxury residences, and renewable energy plants. Our commitment to excellence, safety, and timely delivery sets us apart as Africa\'s premier construction consortium.',
        cta: 'Explore Our Sectors →'
    },
    1: {
        tag: 'Who We Are',
        title: 'A Diversified Conglomerate',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
        body: 'Meganuel operates as a consortium with strategic divisions across construction, real estate, renewable energy, MEP engineering, project management, and interior design. Each division is led by seasoned industry professionals with decades of combined experience. We pride ourselves on end-to-end project delivery — from initial concept design and feasibility studies through to handover and facility management.',
        cta: 'View Our Divisions →'
    },
    2: {
        tag: 'Construction & MEP',
        title: 'Master Builders & MEP Experts',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80',
        body: 'Our construction division delivers world-class general contracting, structural engineering, and MEP (Mechanical, Electrical & Plumbing) systems integration. We build commercial offices, shopping complexes, hospitals, schools, factories, and bespoke luxury homes. Every project is managed with rigorous quality control, adherence to international safety standards (ISO 9001/14001), and a relentless focus on completing on time and within budget.',
        cta: 'Start a Construction Project →'
    },
    3: {
        tag: 'Real Estate',
        title: 'Premium Property Development',
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=900&q=80',
        body: 'From our headquarters at Redemption Close, Lekki Scheme 2, we identify prime land across Lagos and Nigeria for strategic acquisition and development. Our portfolio includes gated residential estates, mixed-use commercial developments, and urban regeneration projects. We create high-yield investment opportunities while building modern communities that drive long-term economic growth and elevate living standards.',
        cta: 'View Our Portfolio →'
    },
    4: {
        tag: 'Renewable Energy',
        title: 'Sustainable Power Solutions',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900&q=80',
        body: 'Nigeria\'s energy challenge demands bold solutions. Our renewable energy division designs, installs, and maintains solar power systems, hybrid energy grids, and green building integrations for commercial and residential clients. We help businesses and communities reduce energy costs by up to 70% while cutting carbon emissions. From 5kW home systems to 5MW industrial solar farms, we power a sustainable African future.',
        cta: 'Get an Energy Quote →'
    }
};

// ─── GSAP Loader (Faster) ────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const tl = gsap.timeline();

    tl.to('.loader-char', {
        y: '0%', opacity: 1, duration: 0.8,
        stagger: 0.05, ease: 'power4.out'
    })
    .to('.loader-bar-fill', {
        width: '100%', duration: 1, ease: 'power2.inOut'
    }, '-=0.4')
    .to('.loader-curtain', {
        scaleY: 1, duration: 0.6, ease: 'power4.inOut'
    })
    .to('#loader', {
        opacity: 0, duration: 0.3,
        onComplete: () => {
            document.getElementById('loader').style.display = 'none';
            initApp();
        }
    });
});

function initApp() {
    const app = document.getElementById('app');
    app.style.visibility = 'visible';
    gsap.to(app, { opacity: 1, duration: 0.4 });

    gsap.from('.header',      { y: -40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
    gsap.from('.navigation',  { y:  40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.2 });
    gsap.from('.footer-info', { opacity: 0, duration: 0.6, delay: 0.3 });

    animating = false;
    animateIn(0);
}

// ─── Clip-Path Slide Transition (Faster & Smoother) ──────────────────────────
function goToSlide(idx) {
    if (animating || idx === current) return;
    animating = true;

    const slides = document.querySelectorAll('.slide');
    const dots   = document.querySelectorAll('.dot');
    const prev   = slides[current];
    const next   = slides[idx];
    const dir    = idx > current ? 1 : -1;

    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    const curEl = document.getElementById('cur');
    if (curEl) curEl.textContent = String(idx + 1).padStart(2, '0');

    const getEls = n => [
        n.querySelector('.slide-label'),
        n.querySelector('.slide-title'),
        n.querySelector('.slide-body'),
        n.querySelector('.slide-cta')
    ].filter(Boolean);

    gsap.set(getEls(next), { y: 40, opacity: 0 });
    gsap.set(next, {
        visibility: 'visible', zIndex: 11,
        clipPath: dir > 0
            ? 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
            : 'polygon(0 0, 0 0, 0 100%, 0 100%)'
    });

    const tl = gsap.timeline({
        onComplete: () => {
            prev.classList.remove('active');
            gsap.set(prev, { visibility: 'hidden', zIndex: 0 });
            next.classList.add('active');
            current = idx;
            animateIn(idx);
        }
    });

    tl.to(next, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.8, ease: 'power4.inOut'
    }, 0);
    tl.to(prev, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
}

function animateIn(idx) {
    const slide = document.querySelectorAll('.slide')[idx];
    const items = [
        slide.querySelector('.slide-label'),
        slide.querySelector('.slide-title'),
        slide.querySelector('.slide-body'),
        slide.querySelector('.slide-cta')
    ].filter(Boolean);

    gsap.to(items, {
        y: 0, opacity: 1, duration: 0.7,
        stagger: 0.08, ease: 'power3.out',
        onComplete: () => { animating = false; }
    });
}

function nextSlide() { if (!animating && current < TOTAL - 1) goToSlide(current + 1); }
function prevSlide() { if (!animating && current > 0)         goToSlide(current - 1); }

// ─── Menu ─────────────────────────────────────────────────────────────────────
function toggleMenu() {
    menuOpen = !menuOpen;
    document.getElementById('fullscreenMenu').classList.toggle('active', menuOpen);
    document.getElementById('menuToggle').classList.toggle('active', menuOpen);
}

function goToSlideFromMenu(idx) {
    if (menuOpen) toggleMenu();
    setTimeout(() => goToSlide(idx), 350);
}

// ─── Contact Popup ────────────────────────────────────────────────────────────
function openContactPopup() {
    document.getElementById('contactPopup').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closePopup() {
    document.getElementById('contactPopup').classList.remove('active');
    document.body.style.overflow = '';
}

// ─── Service Detail Popup ─────────────────────────────────────────────────────
function openServiceDetail(slideIdx) {
    const data = serviceDetails[slideIdx];
    if (!data) return;

    const overlay = document.getElementById('serviceDetailPopup');
    const img     = document.getElementById('sdImage');
    const tag     = document.getElementById('sdTag');
    const title   = document.getElementById('sdTitle');
    const body    = document.getElementById('sdBody');
    const ctaBtn  = document.getElementById('sdCta');

    img.style.backgroundImage = `url('${data.image}')`;
    tag.textContent   = data.tag;
    title.textContent = data.title;
    body.textContent  = data.body;
    ctaBtn.textContent = data.cta;
    ctaBtn.dataset.slideIdx = slideIdx;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeServiceDetail() {
    document.getElementById('serviceDetailPopup').classList.remove('active');
    document.body.style.overflow = '';
}

// ─── WhatsApp Form Sender ─────────────────────────────────────────────────────
function sendToWhatsApp(e) {
    e.preventDefault();
    const f = e.target;

    const required = ['clientName', 'clientPhone', 'projectType', 'projectScale', 'projectLocation', 'projectDesc'];
    let valid = true;
    required.forEach(id => {
        const el = f[id];
        if (!el.value.trim()) {
            el.style.borderColor = '#ef4444';
            if (valid) el.focus();
            valid = false;
        } else {
            el.style.borderColor = '';
        }
    });
    if (!valid) return;

    const clean = s => s.trim().replace(/<[^>]*>/g, '');

    const name     = clean(f.clientName.value);
    const phone    = clean(f.clientPhone.value);
    const email    = f.clientEmail.value.trim() || 'Not provided';
    const type     = f.projectType.value;
    const scale    = f.projectScale.value;
    const location = clean(f.projectLocation.value);
    const timeline = f.projectTimeline.value;
    const desc     = clean(f.projectDesc.value);

    const msg = [
        '🏗 *MEGANUEL CONSORTIUM — PROJECT INQUIRY*',
        '─────────────────────────────────',
        `👤 *Client Name:* ${name}`,
        `📞 *Phone:* ${phone}`,
        `📧 *Email:* ${email}`,
        '─────────────────────────────────',
        `🔧 *Project Type:* ${type}`,
        `📍 *Location:* ${location}`,
        `📏 *Project Scale:* ${scale}`,
        `🗓 *Timeline:* ${timeline}`,
        '─────────────────────────────────',
        `📋 *Description:*\n${desc}`,
        '─────────────────────────────────',
        '_Sent via meganuel.com.ng_'
    ].join('\n');

    const waUrl = `https://wa.me/2348142226539?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    closePopup();
    f.reset();
}

// ─── Wire up all event listeners ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // Navigation dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
        dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToSlide(i); } });
    });

    // Prev / Next nav buttons
    const prevBtn = document.querySelector('.nav-btn.prev-btn');
    const nextBtn = document.querySelector('.nav-btn.next-btn');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); } });
    }

    // Menu links
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const idx = parseInt(link.dataset.slide, 10);
            goToSlideFromMenu(idx);
        });
    });

    // Slide CTAs — open service detail popups or contact popup
    document.querySelectorAll('.slide-cta').forEach(btn => {
        const action = btn.dataset.action;
        if (action === 'detail') {
            btn.addEventListener('click', () => {
                const slideIdx = parseInt(btn.closest('.slide').dataset.slide, 10);
                openServiceDetail(slideIdx);
            });
        }
        if (action === 'contact') {
            btn.addEventListener('click', openContactPopup);
        }
    });

    // Header phone link
    const headerPhone = document.querySelector('.contact-phone');
    if (headerPhone) headerPhone.addEventListener('click', openContactPopup);

    // Close contact popup button
    const closeBtn = document.getElementById('popupCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closePopup);

    // Close service detail popup
    const sdCloseBtn = document.getElementById('sdCloseBtn');
    if (sdCloseBtn) sdCloseBtn.addEventListener('click', closeServiceDetail);

    // Service detail CTA → open contact form
    const sdCta = document.getElementById('sdCta');
    if (sdCta) sdCta.addEventListener('click', () => {
        closeServiceDetail();
        setTimeout(openContactPopup, 300);
    });

    // Contact form submit
    const projectForm = document.getElementById('projectForm');
    if (projectForm) projectForm.addEventListener('submit', sendToWhatsApp);

    // Popup/modal backdrop clicks
    const contactPopup = document.getElementById('contactPopup');
    if (contactPopup) {
        contactPopup.addEventListener('click', e => {
            if (e.target === contactPopup) closePopup();
        });
    }

    const servicePopup = document.getElementById('serviceDetailPopup');
    if (servicePopup) {
        servicePopup.addEventListener('click', e => {
            if (e.target === servicePopup) closeServiceDetail();
        });
    }

    const menu = document.getElementById('fullscreenMenu');
    if (menu) {
        menu.addEventListener('click', e => {
            if (e.target === menu) toggleMenu();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        const contactOpen = document.getElementById('contactPopup').classList.contains('active');
        const serviceOpen = document.getElementById('serviceDetailPopup').classList.contains('active');

        if (e.key === 'Escape') {
            if (serviceOpen) { closeServiceDetail(); return; }
            if (contactOpen) { closePopup(); return; }
            if (menuOpen) { toggleMenu(); return; }
        }
        if (contactOpen || serviceOpen || menuOpen) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextSlide();
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prevSlide();
    });

    // Touch swipe (only when nothing is open)
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    document.addEventListener('touchend', e => {
        const contactOpen = document.getElementById('contactPopup').classList.contains('active');
        const serviceOpen = document.getElementById('serviceDetailPopup').classList.contains('active');
        if (menuOpen || contactOpen || serviceOpen) return;
        const dx = touchStartX - e.changedTouches[0].screenX;
        const dy = touchStartY - e.changedTouches[0].screenY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            dx > 0 ? nextSlide() : prevSlide();
        }
    }, { passive: true });
});
