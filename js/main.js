/* ============================================================
   RainCode — main.js
   Navbar, mobile menu, scroll reveal, counters, active nav,
   smooth scroll, and init of particles + 3D scene.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- 1. Navbar scroll ----------
    var navbar = document.getElementById('navbar');
    function onScroll() {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- 2. Mobile menu ----------
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileClose = document.getElementById('mobile-close');

    function openMenu() {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    if (hamburger) hamburger.addEventListener('click', openMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });
    }

    // ---------- 6. Smooth scroll (offset navbar) ----------
    var NAV_OFFSET = 64;
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = anchor.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        var targetEl = document.querySelector(href);
        if (!targetEl) return;
        e.preventDefault();
        var top = targetEl.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    // ---------- 3. Scroll reveal ----------
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      revealEls.forEach(function (el) { revealObs.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // ---------- 4. Counter animation ----------
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function formatNumber(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-target')) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var startTime = null;

      if (reduceMotion) {
        el.textContent = prefix + formatNumber(target) + suffix;
        return;
      }

      function tick(now) {
        if (startTime === null) startTime = now;
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var value = Math.round(target * easeOutQuart(progress));
        el.textContent = prefix + formatNumber(value) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    var counters = document.querySelectorAll('.counter');
    if ('IntersectionObserver' in window) {
      var counterObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterObs.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }

    // ---------- 5. Active nav link ----------
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');
    if ('IntersectionObserver' in window) {
      var navObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { threshold: 0.3 });
      sections.forEach(function (s) { navObs.observe(s); });
    }

    // ---------- 7. Init visual modules ----------
    if (typeof window.initParticles === 'function') {
      window.initParticles();
    }
    if (typeof window.initThreeScene === 'function') {
      window.initThreeScene('model-container');
    }
  });
})();
