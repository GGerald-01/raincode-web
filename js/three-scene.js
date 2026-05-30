/* ============================================================
   RainCode — three-scene.js  (CONTEXTUAL PRODUCT STAGING)
   Dark, dramatic product render of the RainCode system mounted
   on a Chilean home wall, in the rain. The MODULE is the hero;
   the wall, gutter and rain are supporting context.
   Requires THREE (r128) loaded globally.
   Exposes window.initThreeScene(containerId).

   Scale: 1 unit ~= 0.1 m. Base module ~ 1.4 x 1.1 x 2.4 units.
   ============================================================ */
(function () {
  'use strict';

  function initThreeScene(containerId) {
    var container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================================
    // RENDERER
    // ============================================================
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.style.display = 'block';
    container.insertBefore(renderer.domElement, container.firstChild);

    // ============================================================
    // SCENE + CAMERA
    // ============================================================
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080F08);
    scene.fog = new THREE.FogExp2(0x080F08, 0.022);

    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);
    camera.lookAt(0, 1.8, 0);

    // ============================================================
    // LIGHTING — product render, not dramatic exterior
    // ============================================================
    scene.add(new THREE.AmbientLight(0x1a2a1a, 0.55));

    // Overcast daylight key — cold
    var key = new THREE.DirectionalLight(0xd0e8ff, 1.4);
    key.position.set(-1, 8, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0002;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 40;
    key.shadow.camera.left = -6;
    key.shadow.camera.right = 6;
    key.shadow.camera.top = 10;
    key.shadow.camera.bottom = -5;
    // Aim the key at the module, NOT the ground (avoids floor hotspot)
    key.target.position.set(0, 1.6, 0.3);
    scene.add(key);
    scene.add(key.target);

    // Soft green rim
    var rim = new THREE.DirectionalLight(0x38CC80, 0.35);
    rim.position.set(4, 2, -4);
    scene.add(rim);

    // Module front glow
    var modLight = new THREE.PointLight(0x38CC80, 1.8, 4.0);
    modLight.position.set(0.5, 2.0, 2.5);
    scene.add(modLight);

    // RC Pure glow
    var pureLight = new THREE.PointLight(0x4466ff, 0.9, 2.5);
    pureLight.position.set(0.5, 0.2, 2.5);
    scene.add(pureLight);

    // ============================================================
    // MATERIALS
    // ============================================================
    var M = {
      hdpe:    new THREE.MeshStandardMaterial({ color: 0x1a5530, roughness: 0.45, metalness: 0.08 }),
      hdpeDark:new THREE.MeshStandardMaterial({ color: 0x0D2E1C, roughness: 0.7,  metalness: 0.05 }),
      steel:   new THREE.MeshStandardMaterial({ color: 0xC0C8D0, roughness: 0.25, metalness: 0.9 }),
      pvc:     new THREE.MeshStandardMaterial({ color: 0x808888, roughness: 0.6,  metalness: 0.1 }),
      accent:  new THREE.MeshStandardMaterial({ color: 0x38CC80, roughness: 0.35, metalness: 0.2, emissive: 0x1a6640, emissiveIntensity: 0.4 }),
      navy:    new THREE.MeshStandardMaterial({ color: 0x1A3A6A, roughness: 0.5,  metalness: 0.15 }),
      navyDark:new THREE.MeshStandardMaterial({ color: 0x0a1e44, roughness: 0.6,  metalness: 0.15 }),
      water:   new THREE.MeshStandardMaterial({ color: 0x2a7ab8, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.5 }),
      waterIn: new THREE.MeshStandardMaterial({ color: 0x2a7ab8, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.65 }),
      glass:   new THREE.MeshStandardMaterial({ color: 0x3a8ad0, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.35 }),
      ledGreen:new THREE.MeshStandardMaterial({ color: 0x44ff88, emissive: 0x44ff88, emissiveIntensity: 3.0 }),
      ledUV:   new THREE.MeshStandardMaterial({ color: 0xcc88ff, emissive: 0xcc88ff, emissiveIntensity: 3.5 }),
      filterPP:new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.8,  metalness: 0.0 }),
      carbon:  new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95, metalness: 0.05 }),
      epdm:    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95, metalness: 0.0 }),
      fiber:   new THREE.MeshStandardMaterial({ color: 0x4488dd, roughness: 0.4,  metalness: 0.1, transparent: true, opacity: 0.55 }),
      wall:    new THREE.MeshStandardMaterial({ color: 0x2a2e28, roughness: 0.95, metalness: 0.0 }),
      wallLine:new THREE.MeshStandardMaterial({ color: 0x1a1e18, roughness: 0.95, metalness: 0.0 }),
      socle:   new THREE.MeshStandardMaterial({ color: 0x1e2218, roughness: 0.95, metalness: 0.0 }),
      bracket: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6,  metalness: 0.3 }),
      hose:    new THREE.MeshStandardMaterial({ color: 0x1a4a8a, roughness: 0.55, metalness: 0.1 }),
      ground:  new THREE.MeshStandardMaterial({ color: 0x0a0f0a, roughness: 0.15, metalness: 0.05 }),
      uvCore:  new THREE.MeshStandardMaterial({ color: 0xcc88ff, emissive: 0x8844cc, emissiveIntensity: 1.2, transparent: true, opacity: 0.7 })
    };

    function mesh(geo, mat, opts) {
      var m = new THREE.Mesh(geo, mat);
      opts = opts || {};
      if (opts.pos) m.position.set(opts.pos[0], opts.pos[1], opts.pos[2]);
      if (opts.rot) m.rotation.set(opts.rot[0] || 0, opts.rot[1] || 0, opts.rot[2] || 0);
      if (opts.cast) m.castShadow = true;
      if (opts.receive) m.receiveShadow = true;
      return m;
    }

    var GROUND_Y = -3.6;

    // ============================================================
    // WALL / CONTEXT — large, dark, the module is anchored to it
    // ============================================================
    scene.add(mesh(new THREE.BoxGeometry(12.0, 10.0, 0.12), M.wall, { pos: [0, 0.5, -0.95], receive: true }));
    // Faux stucco horizontal grain lines (10, every 0.72)
    for (var wl = 0; wl < 10; wl++) {
      scene.add(mesh(new THREE.BoxGeometry(12.0, 0.006, 0.006), M.wallLine, { pos: [0, -3.0 + wl * 0.72, -0.88] }));
    }
    // Base socle
    scene.add(mesh(new THREE.BoxGeometry(12.0, 0.4, 0.22), M.socle, { pos: [0, -3.15, -0.85], receive: true }));

    // ============================================================
    // HORIZONTAL GUTTER — main context element, runs along the wall
    // ============================================================
    // Lying cylinder along the top of the wall
    scene.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.5, 20),
      new THREE.MeshStandardMaterial({ color: 0x7a8288, roughness: 0.55, metalness: 0.3 }),
      { pos: [0, 3.55, -0.55], rot: [0, 0, Math.PI / 2], cast: true }));
    // End caps
    scene.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20),
      new THREE.MeshStandardMaterial({ color: 0x606870, roughness: 0.55, metalness: 0.3 }),
      { pos: [-2.75, 3.55, -0.55], rot: [0, 0, Math.PI / 2] }));
    scene.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20),
      new THREE.MeshStandardMaterial({ color: 0x606870, roughness: 0.55, metalness: 0.3 }),
      { pos: [2.75, 3.55, -0.55], rot: [0, 0, Math.PI / 2] }));
    // Gutter wall brackets — touch the wall
    var gBracketMat = new THREE.MeshStandardMaterial({ color: 0x606870, roughness: 0.55, metalness: 0.3 });
    [-1.8, 0.3, 1.8].forEach(function (gx) {
      scene.add(mesh(new THREE.BoxGeometry(0.06, 0.35, 0.65), gBracketMat, { pos: [gx, 3.55, -0.72] }));
    });
    // Vertical downpipe from the gutter — visible drop to the module
    scene.add(mesh(new THREE.CylinderGeometry(0.085, 0.085, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x8a9098, roughness: 0.55, metalness: 0.2 }),
      { pos: [0.0, 2.65, -0.3], cast: true }));
    // Elbow into the module
    scene.add(mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 12), M.pvc, { pos: [0.0, 1.72, 0.05], rot: [0.55, 0, 0], cast: true }));

    // ============================================================
    // MOUNTING BRACKETS — module is bolted to the wall
    // ============================================================
    var mountMat = new THREE.MeshStandardMaterial({ color: 0x505858, roughness: 0.4, metalness: 0.7 });
    scene.add(mesh(new THREE.BoxGeometry(0.12, 0.08, 0.85), mountMat, { pos: [0, 2.95, -0.45], cast: true }));
    scene.add(mesh(new THREE.BoxGeometry(0.12, 0.08, 0.85), mountMat, { pos: [0, 0.85, -0.45], cast: true }));
    scene.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8), M.steel, { pos: [0, 2.95, -0.88], rot: [Math.PI / 2, 0, 0] }));
    scene.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8), M.steel, { pos: [0, 0.85, -0.88], rot: [Math.PI / 2, 0, 0] }));

    // ============================================================
    // BASE MODULE GROUP
    // ============================================================
    var baseModule = new THREE.Group();
    baseModule.position.set(0, 1.6, 0.45);
    var baseBaseY = 1.6;

    var W = 1.4, H = 2.4, D = 1.12;
    baseModule.add(mesh(new THREE.BoxGeometry(W, H, D), M.hdpe, { cast: true, receive: true }));

    // Rounded vertical corner posts
    var cx = W / 2, cz = D / 2;
    [[-cx, cz], [cx, cz], [-cx, -cz], [cx, -cz]].forEach(function (c) {
      baseModule.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, H, 12), M.hdpeDark, { pos: [c[0], 0, c[1]] }));
    });

    // 3 horizontal stiffening ribs
    [0.65, 0, -0.65].forEach(function (y) {
      baseModule.add(mesh(new THREE.BoxGeometry(W + 0.04, 0.07, D + 0.04), M.hdpeDark, { pos: [0, y, 0] }));
    });

    // Simulated moulding texture — 6 thin ribs on each side face
    for (var s = 0; s < 6; s++) {
      var sy = -1.0 + s * 0.4;
      baseModule.add(mesh(new THREE.BoxGeometry(0.008, 1.9, 0.5), M.hdpeDark, { pos: [-W / 2 - 0.004, sy * 0.1, 0.0] }));
      baseModule.add(mesh(new THREE.BoxGeometry(0.008, 1.9, 0.5), M.hdpeDark, { pos: [W / 2 + 0.004, sy * 0.1, 0.0] }));
    }
    // Back-face grooves
    for (var g = 0; g < 6; g++) {
      baseModule.add(mesh(new THREE.BoxGeometry(W - 0.1, 0.02, 0.02), M.hdpeDark, { pos: [0, -1.0 + g * 0.4, -D / 2 - 0.005] }));
    }

    // Pronounced lateral ribs — the signature dented profile (5 per side)
    [-0.38, -0.19, 0, 0.19, 0.38].forEach(function (rz) {
      baseModule.add(mesh(new THREE.BoxGeometry(0.08, 2.2, 0.18), M.hdpeDark, { pos: [-0.73, 0, rz] }));
      baseModule.add(mesh(new THREE.BoxGeometry(0.08, 2.2, 0.18), M.hdpeDark, { pos: [0.73, 0, rz] }));
    });

    // Wall-mount bolts (4 corners, larger) — anchor the module to the brackets
    [[-0.6, 1.0], [0.6, 1.0], [-0.6, -1.0], [0.6, -1.0]].forEach(function (b) {
      baseModule.add(mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 10), M.steel, { pos: [b[0], b[1], -D / 2 - 0.06], rot: [Math.PI / 2, 0, 0] }));
    });

    // Level window: steel frame + tinted glass + visible water (larger)
    baseModule.add(mesh(new THREE.BoxGeometry(0.66, 0.86, 0.04), M.steel, { pos: [-0.4, -0.1, D / 2 + 0.005] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.58, 0.78, 0.03), M.glass, { pos: [-0.4, -0.1, D / 2 + 0.02] }));
    // Inner, more opaque water plane to clearly read the level
    var windowWater = mesh(new THREE.BoxGeometry(0.54, 0.5, 0.02), M.waterIn, { pos: [-0.4, -0.28, D / 2 + 0.015] });
    baseModule.add(windowWater);

    // Logo relief panel (upper front)
    baseModule.add(mesh(new THREE.BoxGeometry(0.7, 0.22, 0.025), M.hdpeDark, { pos: [0.18, 0.92, D / 2 + 0.01] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.16, 0.16, 0.03), M.accent, { pos: [-0.05, 0.92, D / 2 + 0.02] }));

    // LED indicator + pulsing light (bright)
    var ledGreen = mesh(new THREE.SphereGeometry(0.065, 12, 12), M.ledGreen, { pos: [0.55, 0.92, D / 2 + 0.02] });
    baseModule.add(ledGreen);
    var ledGreenLight = new THREE.PointLight(0x44ff88, 1.0, 2.2);
    ledGreenLight.position.set(0.55, 0.92, D / 2 + 0.1);
    baseModule.add(ledGreenLight);

    // Sensor cap: housing + 2 HC-SR04 "eyes" + BT antenna
    var sensorCap = new THREE.Group();
    sensorCap.position.set(0, H / 2 + 0.08, 0);
    sensorCap.add(mesh(new THREE.BoxGeometry(0.9, 0.16, 0.7), M.hdpeDark, { cast: true }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), M.steel, { pos: [-0.18, 0.08, 0.18] }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), M.steel, { pos: [0.18, 0.08, 0.18] }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), M.hdpeDark, { pos: [-0.18, 0.13, 0.18] }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), M.hdpeDark, { pos: [0.18, 0.13, 0.18] }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), M.hdpeDark, { pos: [0.36, 0.24, -0.2] }));
    sensorCap.add(mesh(new THREE.SphereGeometry(0.045, 10, 10), M.accent, { pos: [0.36, 0.4, -0.2] }));
    baseModule.add(sensorCap);

    // Internal filter stack
    var filterStack = new THREE.Group();
    filterStack.position.set(0.2, 0.55, 0);
    filterStack.add(mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 24), M.steel, { pos: [0, 0.32, 0], rot: [Math.PI / 2, 0, 0] }));
    filterStack.add(mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 24), M.steel, { pos: [0, 0.32, 0], rot: [Math.PI / 2, 0, 0] }));
    filterStack.add(mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 24), M.steel, { pos: [0, 0.32, 0], rot: [Math.PI / 2, 0, 0] }));
    filterStack.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 20), M.filterPP, { pos: [0, 0.05, 0] }));
    filterStack.add(mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.34, 20), M.carbon, { pos: [0, -0.32, 0] }));
    baseModule.add(filterStack);

    // Internal water tank (breathing)
    var water = mesh(new THREE.BoxGeometry(W - 0.16, 1.0, D - 0.16), M.water, { pos: [0, -0.55, 0] });
    baseModule.add(water);

    // Stackable side connectors + accent
    baseModule.add(mesh(new THREE.BoxGeometry(0.12, 0.5, 0.4), M.hdpeDark, { pos: [-W / 2 - 0.05, 0.2, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.12, 0.5, 0.4), M.hdpeDark, { pos: [W / 2 + 0.05, 0.2, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.04, 0.3, 0.2), M.accent, { pos: [-W / 2 - 0.12, 0.2, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.04, 0.3, 0.2), M.accent, { pos: [W / 2 + 0.12, 0.2, 0] }));

    // 4 M6 stainless bolts w/ engraved cross
    [[-0.58, 1.04], [0.58, 1.04], [-0.58, -1.04], [0.58, -1.04]].forEach(function (b) {
      baseModule.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 12), M.steel, { pos: [b[0], b[1], D / 2 + 0.01], rot: [Math.PI / 2, 0, 0] }));
      baseModule.add(mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), M.hdpeDark, { pos: [b[0], b[1], D / 2 + 0.04] }));
      baseModule.add(mesh(new THREE.BoxGeometry(0.012, 0.06, 0.012), M.hdpeDark, { pos: [b[0], b[1], D / 2 + 0.04] }));
    });

    // Outlet faucet-style valve — prominent, front-facing (sketch look)
    baseModule.add(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16), M.steel, { pos: [0, -1.35, 0.45], rot: [Math.PI / 2, 0, 0] }));
    // Faucet handle at 45deg ("closed")
    baseModule.add(mesh(new THREE.BoxGeometry(0.22, 0.055, 0.055), M.accent, { pos: [0, -1.27, 0.52], rot: [0, 0, Math.PI / 4] }));
    // Nozzle
    baseModule.add(mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.12, 12), M.steel, { pos: [0, -1.35, 0.62], rot: [Math.PI / 2, 0, 0] }));

    scene.add(baseModule);

    // ============================================================
    // CONNECTOR — visually bridge base & RC Pure (tight gap)
    // ============================================================
    var connector = new THREE.Group();
    connector.position.set(0, 0.8, 0.45);
    connector.add(mesh(new THREE.BoxGeometry(0.28, 0.22, 0.28), M.hdpeDark));
    connector.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 16), M.accent));
    connector.add(mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 20), M.epdm, { pos: [0, 0.12, 0], rot: [Math.PI / 2, 0, 0] }));
    connector.add(mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 20), M.epdm, { pos: [0, -0.12, 0], rot: [Math.PI / 2, 0, 0] }));
    // Visible steel pipe joining the two modules
    connector.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.42, 16), M.steel, { pos: [0, 0, 0] }));
    scene.add(connector);

    // ============================================================
    // RC PURE MODULE GROUP — pulled up tight against the base
    // ============================================================
    var pureModule = new THREE.Group();
    pureModule.position.set(0, 0.18, 0.45);

    var PW = 1.25, PH = 0.85, PD = 1.05;
    pureModule.add(mesh(new THREE.BoxGeometry(PW, PH, PD), M.navy, { cast: true, receive: true }));
    pureModule.add(mesh(new THREE.BoxGeometry(PW + 0.03, 0.05, PD + 0.03), M.navyDark, { pos: [0, 0.18, 0] }));
    pureModule.add(mesh(new THREE.BoxGeometry(PW + 0.03, 0.05, PD + 0.03), M.navyDark, { pos: [0, -0.18, 0] }));
    pureModule.add(mesh(new THREE.BoxGeometry(0.6, 0.18, 0.02), M.navyDark, { pos: [0, 0.1, PD / 2 + 0.01] }));

    var ledUV = mesh(new THREE.SphereGeometry(0.065, 10, 10), M.ledUV, { pos: [0.46, 0.1, PD / 2 + 0.02] });
    pureModule.add(ledUV);
    var ledUVLight = new THREE.PointLight(0xcc88ff, 0.6, 1.8);
    ledUVLight.position.set(0.46, 0.1, PD / 2 + 0.1);
    pureModule.add(ledUVLight);

    for (var fi = 0; fi < 14; fi++) {
      var fx = -0.45 + (0.9 * fi) / 13;
      pureModule.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), M.fiber, { pos: [fx, -0.05, 0.28] }));
    }
    pureModule.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16), M.navyDark, { pos: [-0.42, -0.05, -0.15], rot: [0, 0, Math.PI / 2] }));
    pureModule.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.58, 12), M.uvCore, { pos: [-0.42, -0.05, -0.15], rot: [0, 0, Math.PI / 2] }));
    pureModule.add(mesh(new THREE.BoxGeometry(0.24, 0.1, 0.24), M.navyDark, { pos: [0, -PH / 2 - 0.04, 0] }));
    pureModule.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 12), M.steel, { pos: [0, -PH / 2 - 0.12, 0] }));

    scene.add(pureModule);

    // ============================================================
    // OUTLET HOSE — reaches the ground + clamps + pool
    // ============================================================
    var hoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, 0.22, 0.85),
      new THREE.Vector3(0.2, -0.1, 0.95),
      new THREE.Vector3(0.5, -0.6, 0.85),
      new THREE.Vector3(0.8, -1.2, 0.65),
      new THREE.Vector3(0.9, -1.9, 0.35),
      new THREE.Vector3(0.7, -2.5, 0.15),
      new THREE.Vector3(0.2, -2.8, 0.25),
      new THREE.Vector3(-0.3, -2.75, 0.55),
      new THREE.Vector3(-0.1, -2.65, 0.8)
    ]);
    var hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 40, 0.065, 10, false), M.hose);
    hose.castShadow = true;
    scene.add(hose);
    [0.25, 0.55].forEach(function (t) {
      var p = hoseCurve.getPoint(t);
      var tan = hoseCurve.getTangent(t);
      var clamp = mesh(new THREE.TorusGeometry(0.07, 0.018, 8, 16), M.steel, { pos: [p.x, p.y, p.z] });
      clamp.lookAt(p.x + tan.x, p.y + tan.y, p.z + tan.z);
      scene.add(clamp);
    });

    // ============================================================
    // RAIN — 60 visible elongated drops
    // ============================================================
    var rainMat = new THREE.MeshStandardMaterial({ color: 0xaaccee, transparent: true, opacity: 0.85, emissive: 0x334455, emissiveIntensity: 0.1 });
    var raindrops = [];
    for (var ri = 0; ri < 80; ri++) {
      var drop = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.004, 0.18, 6), rainMat);
      drop.rotation.z = -0.15; // wind-blown tilt
      drop.position.set((Math.random() - 0.5) * 10, 6 + Math.random() * 4, -0.5 + Math.random() * 2);
      drop.userData.speed = 0.06 + Math.random() * 0.04;
      scene.add(drop);
      raindrops.push(drop);
    }

    // ============================================================
    // GROUND — matte, no specular reflection plane
    // ============================================================
    scene.add(mesh(new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x0d1210, roughness: 0.85, metalness: 0.0 }),
      { pos: [0, GROUND_Y, 0], rot: [-Math.PI / 2, 0, 0], receive: true }));

    // moduleGlow — soft pulsing
    var moduleGlow = new THREE.PointLight(0x38CC80, 0.6, 6);
    moduleGlow.position.set(0, 2.2, 1.5);
    scene.add(moduleGlow);

    // ============================================================
    // 3D LABELS (8)
    // ============================================================
    var overlay = document.getElementById('labels-overlay');
    var labelData = [
      { text: '① Canalón 100mm PVC',                pos: new THREE.Vector3(-1.8, 4.0, 0) },
      { text: '② Sensor ultrasónico BT',            pos: new THREE.Vector3(1.5, 3.2, 0) },
      { text: '③ Módulo base RAINCODE — 50L',       pos: new THREE.Vector3(1.8, 2.5, 0) },
      { text: '④ Filtros: malla + 5µ + carbón GAC', pos: new THREE.Vector3(1.8, 1.8, 0) },
      { text: '⑤ Cuerpo HDPE reciclado',            pos: new THREE.Vector3(-1.8, 1.8, 0) },
      { text: '⑥ RC Pure — UF 0.01µ + UV-C',        pos: new THREE.Vector3(1.8, 0.3, 0) },
      { text: '⑦ Válvula salida 3/4"',              pos: new THREE.Vector3(-1.8, 0.5, 0) },
      { text: '⑧ Manguera uso doméstico',           pos: new THREE.Vector3(-1.8, -1.2, 0) }
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

    // ============================================================
    // CONTROLS (spherical orbit)
    // ============================================================
    var target = new THREE.Vector3(0, 1.8, 0);
    var sph = { radius: 7.2, theta: Math.atan2(5, 3), phi: 1.08 };
    var autoRotate = !reduceMotion;

    var dragging = false, lastX = 0, lastY = 0;
    var canvasEl = renderer.domElement;
    canvasEl.style.cursor = 'grab';

    function onDown(x, y) { dragging = true; lastX = x; lastY = y; autoRotate = false; if (toggleRotate) toggleRotate.checked = false; canvasEl.style.cursor = 'grabbing'; }
    function onMove(x, y) {
      if (!dragging) return;
      var dx = x - lastX, dy = y - lastY;
      lastX = x; lastY = y;
      sph.theta -= dx * 0.008;
      sph.phi -= dy * 0.008;
      sph.phi = Math.max(0.18, Math.min(Math.PI - 0.18, sph.phi));
    }
    function onUp() { dragging = false; canvasEl.style.cursor = 'grab'; }

    canvasEl.addEventListener('mousedown', function (e) { onDown(e.clientX, e.clientY); });
    window.addEventListener('mousemove', function (e) { onMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', onUp);
    canvasEl.addEventListener('touchstart', function (e) {
      if (e.touches.length) onDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    canvasEl.addEventListener('touchmove', function (e) {
      if (e.touches.length) { onMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }
    }, { passive: false });
    canvasEl.addEventListener('touchend', onUp);
    canvasEl.addEventListener('wheel', function (e) {
      e.preventDefault();
      sph.radius += e.deltaY * 0.01;
      sph.radius = Math.max(4, Math.min(18, sph.radius));
    }, { passive: false });

    var views = {
      frontal:    { theta: Math.PI / 2, phi: Math.PI / 2, radius: 6.5 },
      lateral:    { theta: 0.08,        phi: Math.PI / 2, radius: 6.5 },
      superior:   { theta: Math.PI / 2, phi: 0.22,        radius: 12 },
      isometrica: { theta: Math.atan2(5, 3), phi: 1.08,   radius: 7.2 }
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
      // Labels on by default
      labelsVisible = true;
      toggleLabels.checked = true;
      if (overlay) overlay.style.display = 'block';
      toggleLabels.addEventListener('change', function () {
        labelsVisible = toggleLabels.checked;
        if (overlay) overlay.style.display = labelsVisible ? 'block' : 'none';
      });
    }

    // ============================================================
    // RESIZE
    // ============================================================
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

    // ============================================================
    // LABEL PROJECTION
    // ============================================================
    var projV = new THREE.Vector3();
    function updateLabels() {
      if (!overlay || !labelsVisible) return;
      var w = container.clientWidth, h = container.clientHeight;
      for (var i = 0; i < labelData.length; i++) {
        projV.copy(labelData[i].pos).project(camera);
        var el = labelEls[i];
        if (projV.z >= 1) { el.style.opacity = '0'; continue; }
        el.style.left = ((projV.x * 0.5 + 0.5) * w) + 'px';
        el.style.top = ((-projV.y * 0.5 + 0.5) * h) + 'px';
        el.style.opacity = '1';
      }
    }

    // ============================================================
    // ANIMATION LOOP
    // ============================================================
    var clock = new THREE.Clock();
    var nextFlicker = 4 + Math.random() * 2;
    var flickerUntil = 0;

    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      if (autoRotate) sph.theta += 0.003;

      camera.position.x = target.x + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      camera.position.y = target.y + sph.radius * Math.cos(sph.phi);
      camera.position.z = target.z + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      camera.lookAt(target);

      // Rain — falls in front of the wall, gentle wind drift
      for (var i = 0; i < raindrops.length; i++) {
        var d = raindrops[i];
        d.position.y -= d.userData.speed;
        d.position.x += 0.001;
        if (d.position.y < -3.0) {
          d.position.y = 6 + Math.random() * 4;
          d.position.x = (Math.random() - 0.5) * 10;
          d.position.z = -0.5 + Math.random() * 2;
        }
      }

      // Module subtle float
      baseModule.position.y = baseBaseY + Math.sin(t * 0.3) * 0.008;

      // Water breathing (scale + opacity)
      var ws = 0.68 + Math.sin(t * 0.4) * 0.025;
      water.scale.y = ws;
      water.material.opacity = 0.45 + Math.sin(t * 0.7) * 0.09;
      windowWater.scale.y = ws;

      // Green LED pulse + occasional flicker
      var lp = (Math.sin(t * 2.5) + 1) / 2;
      var baseInt = 0.4 + lp * 1.0;
      var baseEmis = 0.7 + lp * 1.6;
      if (t > nextFlicker && flickerUntil === 0) { flickerUntil = t + 0.08; }
      if (flickerUntil > 0) {
        if (t < flickerUntil) { baseInt = 0.1; baseEmis = 0.2; }
        else { flickerUntil = 0; nextFlicker = t + 4 + Math.random() * 2; }
      }
      ledGreenLight.intensity = baseInt;
      M.ledGreen.emissiveIntensity = baseEmis;

      // UV-C LED pulse (slower)
      var up = (Math.sin(t * 1.8 + 1.2) + 1) / 2;
      ledUVLight.intensity = 0.3 + up * 0.6;
      M.ledUV.emissiveIntensity = 1.2 + up * 0.8;

      // Module glow
      moduleGlow.intensity = 0.4 + ((Math.sin(t * 0.9) + 1) / 2) * 0.4;

      updateLabels();
      renderer.render(scene, camera);
    }
    animate();

    requestAnimationFrame(resize);
  }

  window.initThreeScene = initThreeScene;
})();
