
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Language toggle (AR <-> EN) =====
const STORAGE_KEY = 'rl_lang';
const langBtn = document.getElementById('langBtn');
const langLabel = document.getElementById('langLabel');

function applyLang(lang){
  const isAr = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar],[data-en]').forEach(el => {
    const val = el.getAttribute(isAr ? 'data-ar' : 'data-en');
    if (val == null) return;
    if (el.tagName === 'META') el.setAttribute('content', val);
    else if (el.tagName === 'TITLE') document.title = val;
    else el.textContent = val;
  });
  if (langLabel) langLabel.textContent = isAr ? 'EN' : 'ع';
  try { localStorage.setItem(STORAGE_KEY, lang); } catch(_){}
}
const saved = (() => { try { return localStorage.getItem(STORAGE_KEY); } catch(_) { return null; } })();
applyLang(saved || 'ar');
langBtn?.addEventListener('click', () => {
  applyLang(document.documentElement.lang === 'ar' ? 'en' : 'ar');
});

// ===== Mobile menu =====
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const closeMenu = () => {
  navLinks.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
};
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ===== Nav scroll =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== Custom cursor (desktop only) =====
const isCoarse = window.matchMedia('(hover:none),(pointer:coarse)').matches;
if (!isCoarse) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let rx = 0, ry = 0, dx = 0, dy = 0;
  window.addEventListener('mousemove', e => {
    dx = e.clientX; dy = e.clientY;
    dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
    dot.style.opacity = ring.style.opacity = '1';
  });
  const loop = () => {
    rx += (dx - rx) * 0.15;
    ry += (dy - ry) * 0.15;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  };
  loop();
}

// ===== Counter animation =====
const animate = el => {
  const target = +el.dataset.target;
  const dur = 1600, start = performance.now();
  const isPct = target === 98;
  const step = t => {
    const p = Math.min((t - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target) + (isPct ? '%' : '+');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// ===== Reveal on scroll =====
const reveals = document.querySelectorAll('.section, .hero-left, .hero-right, .stat');
reveals.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (e.target.classList.contains('stat')) {
        const n = e.target.querySelector('.stat-n');
        if (n && !n.dataset.done) { n.dataset.done = '1'; animate(n); }
      }
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(el => io.observe(el));

// ===== Smooth offset scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});

// ===== Fix mobile 100vh on iOS =====
const setVH = () => document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
setVH();