/*! Pandi Regun — Script v3.0 */
(() => {
  'use strict';

  /* ===== Theme Toggle ===== */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ===== Scroll handlers (progress + nav + back-to-top) ===== */
  const nav = document.getElementById('nav');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrollY = window.scrollY;
    nav?.classList.toggle('scrolled', scrollY > 20);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH > 0) {
      scrollProgress.style.width = (scrollY / docH) * 100 + '%';
    }

    backToTop?.classList.toggle('visible', scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== Mobile menu ===== */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  navToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    document.body.style.overflow = mobileMenu?.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ===== Reveal on scroll (IntersectionObserver) ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
  });

  /* ===== Animated counters ===== */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (isNaN(target)) return;

      const start = performance.now();
      const duration = 1200;
      const animate = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
        if (p < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ===== Smooth scroll for anchors ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== Auto-update "now" date ===== */
  const nowDate = document.querySelector('.now-date');
  if (nowDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    nowDate.textContent = `Update ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

})();
