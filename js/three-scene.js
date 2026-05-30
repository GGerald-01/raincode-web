/* ============================================================
   RainCode — three-scene.js
   Interactive 3D model of the RainCode system.
   Requires THREE (r128) loaded globally.
   Exposes window.initThreeScene(containerId).
   ============================================================ */
(function () {
  'use strict';

  function initThreeScene(containerId) {
    var container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Renderer ----------
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    container.insertBefore(renderer.domElement, container.firstChild);

    // ---------- Scene ----------
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080F08);
    scene.fog = new THREE.Fog(0x080F08, 20, 40);

    // ---------- Camera ----------
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(5, 4, 7);
    camera.lookAt(0, 1, 0);

    // ---------- Lights ----------
    scene.add(new THREE.AmbientLight(0x88ffcc, 0.4));

    var dirMain = new THREE.DirectionalLight(0xffffff, 0.8);
    dirMain.position.set(5, 10, 5);
    dirMain.castShadow = true;
    dirMain.shadow.mapSize.set(1024, 1024);
    dirMain.shadow.camera.near = 1;
    dirMain.shadow.camera.far = 40;
    dirMain.shadow.camera.left = -10;
    dirMain.shadow.camera.right = 10;
    dirMain.shadow.camera.top = 10;
    dirMain.shadow.camera.bottom = -10;
    scene.add(dirMain);

    var dirFill = new THREE.DirectionalLight(0x1A3A6A, 0.5);
    dirFill.position.set(-5, 3, -5);
    scene.add(dirFill);

    var pointAccent = new THREE.PointLight(0x38CC80, 0.3, 15);
    pointAccent.position.set(-3, 2, 3);
    scene.add(pointAccent);

    // ---------- Materials ----------
    var matGreen      = new THREE.MeshStandardMaterial({ color: 0x1D6B48, roughness: 0.6, metalness: 0.2 });
    var matGreenDark  = new THREE.MeshStandardMaterial({ color: 0x0F3020, roughness: 0.7, metalness: 0.3 });
    var matAccent     = new THREE.MeshStandardMaterial({ color: 0x38CC80, roughness: 0.4, metalness: 0.3, emissive: 0x1D6B48, emissiveIntensity: 0.2 });
    var matNavy       = new THREE.MeshStandardMaterial({ color: 0x1A3A6A, roughness: 0.6, metalness: 0.2 });
    var matGray       = new THREE.MeshStandardMaterial({ color: 0x4a5560, roughness: 0.7, metalness: 0.4 });
    var matPipe       = new THREE.MeshStandardMaterial({ color: 0x8a9098, roughness: 0.5, metalness: 0.6 });
    var matWater      = new THREE.MeshStandardMaterial({ color: 0x2a78b8, roughness: 0.1, transparent: true, opacity: 0.55 });
    var matLED        = new THREE.MeshStandardMaterial({ color: 0x44ff88, emissive: 0x44ff88, emissiveIntensity: 1.2 });
    var matLEDpurple  = new THREE.MeshStandardMaterial({ color: 0xbb88ff, emissive: 0xbb88ff, emissiveIntensity: 1.0 });
    var matWall       = new THREE.MeshStandardMaterial({ color: 0xd8d3c8, roughness: 0.9 });
    var matRoof       = new THREE.MeshStandardMaterial({ color: 0x8a6050, roughness: 0.8 });

    function mesh(geo, mat, opts) {
      var m = new THREE.Mesh(geo, mat);
      opts = opts || {};
      if (opts.pos) m.position.set(opts.pos[0], opts.pos[1], opts.pos[2]);
      if (opts.rot) m.rotation.set(opts.rot[0] || 0, opts.rot[1] || 0, opts.rot[2] || 0);
      if (opts.cast) m.castShadow = true;
      if (opts.receive) m.receiveShadow = true;
      return m;
    }

    // ---------- Static structure ----------
    scene.add(mesh(new THREE.BoxGeometry(6, 7, 0.2), matWall, { pos: [0, 1, -0.8], receive: true }));
    scene.add(mesh(new THREE.BoxGeometry(3, 0.12, 2), matRoof, { pos: [-1.1, 4.8, -0.5], rot: [0, 0, 0.38], cast: true }));
    scene.add(mesh(new THREE.BoxGeometry(3, 0.12, 2), matRoof, { pos: [1.1, 4.8, -0.5], rot: [0, 0, -0.38], cast: true }));
    scene.add(mesh(new THREE.BoxGeometry(2.2, 0.2, 0.5), matPipe, { pos: [0, 4.38, -0.15], cast: true }));
    scene.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 12), matPipe, { pos: [0, 3.72, 0], cast: true }));

    // ---------- Base module ----------
    var baseModule = new THREE.Group();
    baseModule.position.set(0, 2.2, 0);

    baseModule.add(mesh(new THREE.BoxGeometry(1.4, 2.4, 1.1), matGreen, { cast: true }));
    baseModule.add(mesh(new THREE.BoxGeometry(1.42, 0.06, 1.12), matGreenDark, { pos: [0, 0.6, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(1.42, 0.06, 1.12), matGreenDark, { pos: [0, 0.0, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(1.42, 0.06, 1.12), matGreenDark, { pos: [0, -0.6, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.7, 0.18, 0.02), matGreenDark, { pos: [0, 0.85, 0.56] }));

    var led = mesh(new THREE.SphereGeometry(0.05, 8, 8), matLED, { pos: [0.55, 0.85, 0.56] });
    baseModule.add(led);
    var ledLight = new THREE.PointLight(0x44ff88, 0.6, 1.5);
    ledLight.position.set(0.55, 0.85, 0.56);
    baseModule.add(ledLight);

    baseModule.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16), matGreenDark, { pos: [0, 1.24, 0] }));
    baseModule.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16), matAccent, { pos: [0, 1.26, 0] }));

    baseModule.add(mesh(new THREE.BoxGeometry(0.08, 0.3, 0.15), matGreenDark, { pos: [-0.74, 0, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.08, 0.3, 0.15), matGreenDark, { pos: [0.74, 0, 0] }));

    var boltPos = [[-0.55, 1.0], [0.55, 1.0], [-0.55, -1.0], [0.55, -1.0]];
    boltPos.forEach(function (bp) {
      baseModule.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 8), matGray, { pos: [bp[0], bp[1], 0.56], rot: [Math.PI / 2, 0, 0] }));
    });

    var water = mesh(new THREE.BoxGeometry(1.3, 0.9, 1.0), matWater, { pos: [0, -0.55, 0] });
    baseModule.add(water);

    baseModule.add(mesh(new THREE.BoxGeometry(0.25, 0.12, 0.25), matGreenDark, { pos: [0, -1.26, 0] }));
    baseModule.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15, 8), matAccent, { pos: [0, -1.26, 0.2], rot: [Math.PI / 2, 0, 0] }));

    scene.add(baseModule);

    // ---------- Connector ----------
    scene.add(mesh(new THREE.BoxGeometry(0.22, 0.2, 0.22), matGreenDark, { pos: [0, 1.0, 0] }));

    // ---------- RC Pure module ----------
    var pureModule = new THREE.Group();
    pureModule.position.set(0, 0.5, 0);

    pureModule.add(mesh(new THREE.BoxGeometry(1.2, 0.8, 1.0), matNavy, { cast: true }));
    pureModule.add(mesh(new THREE.BoxGeometry(1.22, 0.05, 1.02),
      new THREE.MeshStandardMaterial({ color: 0x0a2050, roughness: 0.6, metalness: 0.2 }), { pos: [0, 0.1, 0] }));
    pureModule.add(mesh(new THREE.BoxGeometry(0.6, 0.15, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0a1e50, roughness: 0.6 }), { pos: [0, 0.1, 0.51] }));

    var ledPurple = mesh(new THREE.SphereGeometry(0.045, 8, 8), matLEDpurple, { pos: [0.48, 0.15, 0.51] });
    pureModule.add(ledPurple);
    var ledPurpleLight = new THREE.PointLight(0xbb88ff, 0.4, 1.2);
    ledPurpleLight.position.set(0.48, 0.15, 0.51);
    pureModule.add(ledPurpleLight);

    var fiberMat = new THREE.MeshStandardMaterial({ color: 0x4488cc, transparent: true, opacity: 0.5 });
    for (var fi = 0; fi < 12; fi++) {
      var fx = -0.45 + (0.9 * fi) / 11;
      pureModule.add(mesh(new THREE.BoxGeometry(0.02, 0.55, 0.02), fiberMat, { pos: [fx, -0.1, 0.3] }));
    }

    pureModule.add(mesh(new THREE.BoxGeometry(0.22, 0.1, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x0a2050, roughness: 0.6 }), { pos: [0, -0.45, 0] }));

    scene.add(pureModule);

    // ---------- Hose ----------
    var hoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.3, -0.3, 0.2),
      new THREE.Vector3(0.5, -0.8, 0.3),
      new THREE.Vector3(0.4, -1.3, 0.1),
      new THREE.Vector3(0.2, -1.8, 0)
    ]);
    var hoseMat = new THREE.MeshStandardMaterial({ color: 0x1a4a8a, roughness: 0.6 });
    var hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 20, 0.04, 8, false), hoseMat);
    hose.position.set(0, 0.0, 0);
    scene.add(hose);

    // ---------- Raindrops ----------
    var rainMat = new THREE.MeshStandardMaterial({ color: 0x6aaad0, transparent: true, opacity: 0.7 });
    var raindrops = [];
    for (var ri = 0; ri < 20; ri++) {
      var drop = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), rainMat);
      drop.position.set(
        (Math.random() - 0.5) * 4,
        3 + Math.random() * 4,
        (Math.random() - 0.5) * 2
      );
      drop.userData.speed = 0.02 + Math.random() * 0.03;
      scene.add(drop);
      raindrops.push(drop);
    }

    // ---------- Ground ----------
    scene.add(mesh(new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x1a1f1a, roughness: 1 }),
      { pos: [0, -1.6, 0], rot: [-Math.PI / 2, 0, 0], receive: true }));

    // ---------- Labels ----------
    var overlay = document.getElementById('labels-overlay');
    var labelData = [
      { text: '① Canalón 100mm PVC', pos: new THREE.Vector3(-1.2, 4.35, 0) },
      { text: '② Sensor ultrasónico BT', pos: new THREE.Vector3(1.0, 3.45, 0) },
      { text: '③ Módulo RAINCODE — 50L', pos: new THREE.Vector3(1.4, 2.8, 0) },
      { text: '④ HDPE reciclado · 3 filtros', pos: new THREE.Vector3(1.4, 1.8, 0) },
      { text: '⑤ RC Pure — UF 0.01µ + UV', pos: new THREE.Vector3(1.4, 0.5, 0) },
      { text: '⑥ Válvula de salida', pos: new THREE.Vector3(-1.2, 0.9, 0) },
      { text: '⑦ Manguera de uso', pos: new THREE.Vector3(-1.2, -0.8, 0) }
    ];
    var labelEls = [];
    if (overlay) {
      labelData.forEach(function (l) {
        var el = document.createElement('div');
        el.className = 'scene-label';
        el.textContent = l.text;
        overlay.appendChild(el);
        labelEls.push(el);
      });
    }
    var labelsVisible = true;

    // ---------- Controls (spherical orbit) ----------
    var target = new THREE.Vector3(0, 1.5, 0);
    var sph = { radius: Math.sqrt(5 * 5 + (4 - 1.5) * (4 - 1.5) + 7 * 7), theta: Math.atan2(7, 5), phi: Math.acos((4 - 1.5) / Math.sqrt(5 * 5 + (4 - 1.5) * (4 - 1.5) + 7 * 7)) };
    var autoRotate = !reduceMotion;

    var dragging = false, lastX = 0, lastY = 0;

    function onPointerDown(x, y) { dragging = true; lastX = x; lastY = y; }
    function onPointerMove(x, y) {
      if (!dragging) return;
      var dx = x - lastX, dy = y - lastY;
      lastX = x; lastY = y;
      sph.theta -= dx * 0.008;
      sph.phi -= dy * 0.008;
      sph.phi = Math.max(0.2, Math.min(Math.PI - 0.2, sph.phi));
    }
    function onPointerUp() { dragging = false; }

    renderer.domElement.addEventListener('mousedown', function (e) { onPointerDown(e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { onPointerMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', onPointerUp);

    renderer.domElement.addEventListener('touchstart', function (e) {
      if (e.touches.length) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    renderer.domElement.addEventListener('touchmove', function (e) {
      if (e.touches.length) { onPointerMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }
    }, { passive: false });
    renderer.domElement.addEventListener('touchend', onPointerUp);

    renderer.domElement.addEventListener('wheel', function (e) {
      e.preventDefault();
      sph.radius += e.deltaY * 0.01;
      sph.radius = Math.max(4, Math.min(18, sph.radius));
    }, { passive: false });

    // ---------- View presets ----------
    var views = {
      frontal:    { theta: Math.PI / 2, phi: Math.PI / 2, radius: 9 },
      lateral:    { theta: 0,           phi: Math.PI / 2, radius: 9 },
      superior:   { theta: Math.PI / 2, phi: 0.25,        radius: 11 },
      isometrica: { theta: Math.atan2(7, 5), phi: 1.05,   radius: 9.3 }
    };
    function applyView(name) {
      var v = views[name];
      if (!v) return;
      sph.theta = v.theta; sph.phi = v.phi; sph.radius = v.radius;
    }

    var viewButtons = container.querySelectorAll('.view-buttons button');
    viewButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        viewButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyView(btn.getAttribute('data-view'));
      });
    });

    var toggleRotate = document.getElementById('toggle-rotate');
    if (toggleRotate) {
      toggleRotate.checked = autoRotate;
      toggleRotate.addEventListener('change', function () { autoRotate = toggleRotate.checked; });
    }
    var toggleLabels = document.getElementById('toggle-labels');
    if (toggleLabels) {
      toggleLabels.addEventListener('change', function () {
        labelsVisible = toggleLabels.checked;
        if (overlay) overlay.style.display = labelsVisible ? 'block' : 'none';
      });
    }

    // ---------- Resize ----------
    function resize() {
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // ---------- Label projection ----------
    var projV = new THREE.Vector3();
    function updateLabels() {
      if (!overlay || !labelsVisible) return;
      var w = container.clientWidth, h = container.clientHeight;
      for (var i = 0; i < labelData.length; i++) {
        projV.copy(labelData[i].pos).project(camera);
        var visible = projV.z < 1;
        var el = labelEls[i];
        if (!visible) { el.style.opacity = '0'; continue; }
        var sx = (projV.x * 0.5 + 0.5) * w;
        var sy = (-projV.y * 0.5 + 0.5) * h;
        el.style.left = sx + 'px';
        el.style.top = sy + 'px';
        el.style.opacity = '1';
      }
    }

    // ---------- Animation loop ----------
    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      if (autoRotate) sph.theta += 0.004;

      camera.position.x = target.x + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      camera.position.y = target.y + sph.radius * Math.cos(sph.phi);
      camera.position.z = target.z + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      camera.lookAt(target);

      // Raindrops
      for (var i = 0; i < raindrops.length; i++) {
        var d = raindrops[i];
        d.position.y -= d.userData.speed;
        if (d.position.y < 3.0) {
          d.position.y = 7.0;
          d.position.x = (Math.random() - 0.5) * 4;
          d.position.z = (Math.random() - 0.5) * 2;
        }
      }

      // Water breathing
      water.scale.y = 0.68 + Math.sin(t * 0.5) * 0.03;

      // LED pulse
      ledLight.intensity = 0.5 + Math.sin(t * 2) * 0.3;
      ledPurpleLight.intensity = 0.4 + Math.sin(t * 1.5 + 1) * 0.2;

      updateLabels();
      renderer.render(scene, camera);
    }
    animate();
  }

  window.initThreeScene = initThreeScene;
})();
