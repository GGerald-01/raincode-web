/* ============================================================
   RainCode — particles.js
   Hero particle network with mouse repulsion.
   Self-contained. Exposes window.initParticles().
   ============================================================ */
(function () {
  'use strict';

  function initParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    var PARTICLE_COUNT = 120;
    var MAX_VEL = 0.15;
    var LINK_DIST = 120;
    var MOUSE_RADIUS = 100;
    var MOUSE_FORCE = 0.8;
    var COLOR = 'rgba(56,204,128,0.4)';
    var LINK_COLOR = 'rgba(56,204,128,0.08)';

    var width = 0, height = 0;
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var rafId = null;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function rand(min, max) { return min + Math.random() * (max - min); }

    function resize() {
      // Read the parent (#hero) dimensions instead of the canvas'
      // own getBoundingClientRect(), which can report stale/zero
      // values before layout has fully painted.
      var parent = canvas.parentElement;
      width = (parent && parent.clientWidth) || window.innerWidth;
      height = (parent && parent.clientHeight) || window.innerHeight;

      // Force the CSS box to fill the hero, then size the backing
      // store with the device pixel ratio.
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: rand(-MAX_VEL, MAX_VEL),
          vy: rand(-MAX_VEL, MAX_VEL),
          r: rand(1.2, 2.2)
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Mouse repulsion
        var dx = p.x - mouse.x;
        var dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0.01) {
          var f = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          p.vx += (dx / dist) * f;
          p.vy += (dy / dist) * f;
        }

        // Damping so repulsion doesn't accumulate forever
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Keep a minimum drift
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < MAX_VEL * 0.4) {
          p.vx += rand(-0.02, 0.02);
          p.vy += rand(-0.02, 0.02);
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLOR;
        ctx.fill();
      }

      // Links
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var p1 = particles[a], p2 = particles[b];
          var ddx = p1.x - p2.x, ddy = p1.y - p2.y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = LINK_COLOR;
            ctx.globalAlpha = 1 - d / LINK_DIST;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function onMouseMove(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() { mouse.x = -9999; mouse.y = -9999; }
    function onTouchMove(e) {
      if (!e.touches || !e.touches.length) return;
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }

    // Immediate sizing so the canvas is never zero-sized.
    resize();
    seed();

    // Recompute on window resize and re-seed across the new area.
    window.addEventListener('resize', function () { resize(); seed(); });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseLeave);

    // Second pass inside rAF: by the time the first animation frame
    // runs, the hero layout is fully painted, so we get the correct
    // full-screen dimensions before the loop starts.
    requestAnimationFrame(function () {
      resize();
      seed();
      if (reduceMotion) {
        // Draw a single static frame, no animation loop.
        step();
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        step();
      }
    });
  }

  window.initParticles = initParticles;
})();
