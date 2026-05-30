/* ============================================================
   RainCode — three-scene.js  (ULTRA PRO)
   Photorealistic 3D model based on the real product specs.
   Requires THREE (r128) loaded globally.
   Exposes window.initThreeScene(containerId).

   Scale: 1 unit ~= 0.1 m. Base module ~ 1.4 x 1.1 x 2.4 units
   (350mm x 280mm x 600mm HDPE recycled body).
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
    scene.fog = new THREE.Fog(0x080F08, 22, 46);

    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(6, 5, 8);
    camera.lookAt(0, 1.5, 0);

    // ============================================================
    // LIGHTS (6 sources)
    // ============================================================
    scene.add(new THREE.AmbientLight(0x1a3a20, 0.6));

    var sun = new THREE.DirectionalLight(0xfff5e8, 1.4);
    sun.position.set(7, 12, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 50;
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -8;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    var fill = new THREE.DirectionalLight(0x1A3A6A, 0.5);
    fill.position.set(-6, 4, -3);
    scene.add(fill);

    var rim = new THREE.DirectionalLight(0x38CC80, 0.25);
    rim.position.set(-2, 3, -7);
    scene.add(rim);

    var glowGreen = new THREE.PointLight(0x38CC80, 0.8, 12);
    glowGreen.position.set(-2.5, 2.2, 3);
    scene.add(glowGreen);

    var glowBlue = new THREE.PointLight(0x4488ff, 0.5, 10);
    glowBlue.position.set(2.5, 0.5, 3);
    scene.add(glowBlue);

    // ============================================================
    // MATERIALS (based on the real product materials)
    // ============================================================
    var M = {
      hdpe:    new THREE.MeshStandardMaterial({ color: 0x1D5C38, roughness: 0.55, metalness: 0.05 }),
      hdpeDark:new THREE.MeshStandardMaterial({ color: 0x0D2E1C, roughness: 0.7,  metalness: 0.05 }),
      steel:   new THREE.MeshStandardMaterial({ color: 0xC0C8D0, roughness: 0.25, metalness: 0.9 }),
      pvc:     new THREE.MeshStandardMaterial({ color: 0x909898, roughness: 0.6,  metalness: 0.1 }),
      accent:  new THREE.MeshStandardMaterial({ color: 0x38CC80, roughness: 0.35, metalness: 0.2, emissive: 0x1a6640, emissiveIntensity: 0.4 }),
      navy:    new THREE.MeshStandardMaterial({ color: 0x1A3A6A, roughness: 0.5,  metalness: 0.15 }),
      navyDark:new THREE.MeshStandardMaterial({ color: 0x0a1e44, roughness: 0.6,  metalness: 0.15 }),
      water:   new THREE.MeshStandardMaterial({ color: 0x2a7ab8, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.5 }),
      glass:   new THREE.MeshStandardMaterial({ color: 0x3a8ad0, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.4 }),
      ledGreen:new THREE.MeshStandardMaterial({ color: 0x44ff88, emissive: 0x44ff88, emissiveIntensity: 2.0 }),
      ledUV:   new THREE.MeshStandardMaterial({ color: 0xcc88ff, emissive: 0xcc88ff, emissiveIntensity: 1.8 }),
      filterPP:new THREE.MeshStandardMaterial({ color: 0xe8e0d0, roughness: 0.8,  metalness: 0.0 }),
      carbon:  new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95, metalness: 0.05 }),
      epdm:    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.95, metalness: 0.0 }),
      fiber:   new THREE.MeshStandardMaterial({ color: 0x4488dd, roughness: 0.4,  metalness: 0.1, transparent: true, opacity: 0.55 }),
      roof:    new THREE.MeshStandardMaterial({ color: 0x7a4a38, roughness: 0.75, metalness: 0.0 }),
      wall:    new THREE.MeshStandardMaterial({ color: 0xddd5c5, roughness: 0.92, metalness: 0.0 }),
      hose:    new THREE.MeshStandardMaterial({ color: 0x1a4a8a, roughness: 0.55, metalness: 0.1 }),
      ground:  new THREE.MeshStandardMaterial({ color: 0x12160f, roughness: 1.0,  metalness: 0.0 }),
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

    // ============================================================
    // EXTERIOR STRUCTURE — Chilean home wall + gabled tile roof
    // ============================================================
    scene.add(mesh(new THREE.BoxGeometry(7, 8, 0.15), M.wall, { pos: [0, 1.2, -0.9], receive: true }));

    // Gabled roof (two slopes)
    scene.add(mesh(new THREE.BoxGeometry(3.4, 0.14, 2.2), M.roof, { pos: [-1.25, 5.1, -0.4], rot: [0, 0, 0.4], cast: true }));
    scene.add(mesh(new THREE.BoxGeometry(3.4, 0.14, 2.2), M.roof, { pos: [1.25, 5.1, -0.4], rot: [0, 0, -0.4], cast: true }));
    // Ridge cap
    scene.add(mesh(new THREE.BoxGeometry(0.2, 0.16, 2.3), M.pvc, { pos: [0, 5.72, -0.4], cast: true }));
    // Roof side edge details
    scene.add(mesh(new THREE.BoxGeometry(3.5, 0.06, 0.1), M.hdpeDark, { pos: [-1.25, 4.78, 0.7], rot: [0, 0, 0.4] }));
    scene.add(mesh(new THREE.BoxGeometry(3.5, 0.06, 0.1), M.hdpeDark, { pos: [1.25, 4.78, 0.7], rot: [0, 0, -0.4] }));

    // Downpipe: vertical PVC + 45deg elbow into module top
    scene.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.4, 16), M.pvc, { pos: [-1.45, 4.3, 0], cast: true }));
    scene.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.9, 16), M.pvc, { pos: [-0.95, 3.78, 0], rot: [0, 0, 0.7], cast: true }));
    scene.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16), M.pvc, { pos: [-0.45, 3.62, 0], cast: true }));
    // Gutter along the eave
    scene.add(mesh(new THREE.BoxGeometry(2.4, 0.18, 0.4), M.pvc, { pos: [-0.5, 4.55, 0], cast: true }));

    // ============================================================
    // BASE MODULE GROUP
    // ============================================================
    var baseModule = new THREE.Group();
    baseModule.position.set(0, 2.2, 0);

    var W = 1.4, H = 2.4, D = 1.12; // body dims
    baseModule.add(mesh(new THREE.BoxGeometry(W, H, D), M.hdpe, { cast: true, receive: true }));

    // Rounded vertical corner posts
    var cornerX = W / 2, cornerZ = D / 2;
    [[-cornerX, cornerZ], [cornerX, cornerZ], [-cornerX, -cornerZ], [cornerX, -cornerZ]].forEach(function (c) {
      baseModule.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, H, 12), M.hdpeDark, { pos: [c[0], 0, c[1]] }));
    });

    // 3 horizontal stiffening ribs
    [0.65, 0, -0.65].forEach(function (y) {
      baseModule.add(mesh(new THREE.BoxGeometry(W + 0.04, 0.07, D + 0.04), M.hdpeDark, { pos: [0, y, 0] }));
    });

    // Back-face texture grooves (6 lines)
    for (var g = 0; g < 6; g++) {
      baseModule.add(mesh(new THREE.BoxGeometry(W - 0.1, 0.02, 0.02), M.hdpeDark, { pos: [0, -1.0 + g * 0.4, -D / 2 - 0.005] }));
    }

    // Level window: steel frame + tinted glass + visible water
    baseModule.add(mesh(new THREE.BoxGeometry(0.5, 1.5, 0.04), M.steel, { pos: [-0.42, -0.1, D / 2 + 0.005] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.42, 1.42, 0.03), M.glass, { pos: [-0.42, -0.1, D / 2 + 0.02] }));
    var windowWater = mesh(new THREE.BoxGeometry(0.4, 1.0, 0.02), M.water, { pos: [-0.42, -0.38, D / 2 + 0.03] });
    baseModule.add(windowWater);

    // Logo relief panel (upper front)
    baseModule.add(mesh(new THREE.BoxGeometry(0.7, 0.22, 0.025), M.hdpeDark, { pos: [0.18, 0.92, D / 2 + 0.01] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.16, 0.16, 0.03), M.accent, { pos: [-0.05, 0.92, D / 2 + 0.02] }));

    // LED indicator (top-right) + pulsing light
    var ledGreen = mesh(new THREE.SphereGeometry(0.05, 12, 12), M.ledGreen, { pos: [0.55, 0.92, D / 2 + 0.02] });
    baseModule.add(ledGreen);
    var ledGreenLight = new THREE.PointLight(0x44ff88, 0.8, 2);
    ledGreenLight.position.set(0.55, 0.92, D / 2 + 0.1);
    baseModule.add(ledGreenLight);

    // Sensor cap: housing + 2 HC-SR04 "eyes" + BT antenna
    var sensorCap = new THREE.Group();
    sensorCap.position.set(0, H / 2 + 0.08, 0);
    sensorCap.add(mesh(new THREE.BoxGeometry(0.9, 0.16, 0.7), M.hdpeDark, { cast: true }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), M.steel, { pos: [-0.18, 0.08, 0.18], rot: [0, 0, 0] }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16), M.steel, { pos: [0.18, 0.08, 0.18] }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), M.hdpeDark, { pos: [-0.18, 0.13, 0.18] }));
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), M.hdpeDark, { pos: [0.18, 0.13, 0.18] }));
    // BT antenna
    sensorCap.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), M.hdpeDark, { pos: [0.36, 0.24, -0.2] }));
    sensorCap.add(mesh(new THREE.SphereGeometry(0.045, 10, 10), M.accent, { pos: [0.36, 0.4, -0.2] }));
    baseModule.add(sensorCap);

    // Internal filter stack (visible through top, sitting under cap)
    var filterStack = new THREE.Group();
    filterStack.position.set(0.2, 0.55, 0);
    // Stainless mesh — concentric rings (torus)
    filterStack.add(mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 24), M.steel, { pos: [0, 0.32, 0], rot: [Math.PI / 2, 0, 0] }));
    filterStack.add(mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 24), M.steel, { pos: [0, 0.32, 0], rot: [Math.PI / 2, 0, 0] }));
    filterStack.add(mesh(new THREE.TorusGeometry(0.08, 0.02, 8, 24), M.steel, { pos: [0, 0.32, 0], rot: [Math.PI / 2, 0, 0] }));
    // PP sediment cartridge 5µm
    filterStack.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.32, 20), M.filterPP, { pos: [0, 0.05, 0] }));
    // GAC activated carbon
    filterStack.add(mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.34, 20), M.carbon, { pos: [0, -0.32, 0] }));
    baseModule.add(filterStack);

    // Internal water tank (breathing, ~68-70% level)
    var water = mesh(new THREE.BoxGeometry(W - 0.16, 1.0, D - 0.16), M.water, { pos: [0, -0.55, 0] });
    baseModule.add(water);

    // Stackable side connectors (male/female) + green accent
    baseModule.add(mesh(new THREE.BoxGeometry(0.12, 0.5, 0.4), M.hdpeDark, { pos: [-W / 2 - 0.05, 0.2, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.12, 0.5, 0.4), M.hdpeDark, { pos: [W / 2 + 0.05, 0.2, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.04, 0.3, 0.2), M.accent, { pos: [-W / 2 - 0.12, 0.2, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.04, 0.3, 0.2), M.accent, { pos: [W / 2 + 0.12, 0.2, 0] }));

    // 4 M6 stainless bolts with engraved cross
    [[-0.58, 1.04], [0.58, 1.04], [-0.58, -1.04], [0.58, -1.04]].forEach(function (b) {
      baseModule.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 12), M.steel, { pos: [b[0], b[1], D / 2 + 0.01], rot: [Math.PI / 2, 0, 0] }));
      baseModule.add(mesh(new THREE.BoxGeometry(0.06, 0.012, 0.012), M.hdpeDark, { pos: [b[0], b[1], D / 2 + 0.04] }));
      baseModule.add(mesh(new THREE.BoxGeometry(0.012, 0.06, 0.012), M.hdpeDark, { pos: [b[0], b[1], D / 2 + 0.04] }));
    });

    // Outlet valve 3/4" with lever
    baseModule.add(mesh(new THREE.BoxGeometry(0.28, 0.14, 0.28), M.hdpeDark, { pos: [0, -H / 2 + 0.06, 0.2] }));
    baseModule.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16), M.steel, { pos: [0, -H / 2 + 0.06, 0.42], rot: [Math.PI / 2, 0, 0] }));
    baseModule.add(mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), M.accent, { pos: [0, -H / 2 + 0.18, 0.42] }));

    scene.add(baseModule);

    // ============================================================
    // CONNECTOR between base and RC Pure
    // ============================================================
    var connector = new THREE.Group();
    connector.position.set(0, 0.95, 0);
    connector.add(mesh(new THREE.BoxGeometry(0.28, 0.22, 0.28), M.hdpeDark));
    connector.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 16), M.accent));
    connector.add(mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 20), M.epdm, { pos: [0, 0.12, 0], rot: [Math.PI / 2, 0, 0] }));
    connector.add(mesh(new THREE.TorusGeometry(0.15, 0.025, 8, 20), M.epdm, { pos: [0, -0.12, 0], rot: [Math.PI / 2, 0, 0] }));
    scene.add(connector);

    // ============================================================
    // RC PURE MODULE GROUP
    // ============================================================
    var pureModule = new THREE.Group();
    pureModule.position.set(0, 0.4, 0);

    var PW = 1.25, PH = 0.85, PD = 1.05;
    pureModule.add(mesh(new THREE.BoxGeometry(PW, PH, PD), M.navy, { cast: true, receive: true }));
    // 2 horizontal ribs (navy dark)
    pureModule.add(mesh(new THREE.BoxGeometry(PW + 0.03, 0.05, PD + 0.03), M.navyDark, { pos: [0, 0.18, 0] }));
    pureModule.add(mesh(new THREE.BoxGeometry(PW + 0.03, 0.05, PD + 0.03), M.navyDark, { pos: [0, -0.18, 0] }));
    // Front panel + UV-C LED
    pureModule.add(mesh(new THREE.BoxGeometry(0.6, 0.18, 0.02), M.navyDark, { pos: [0, 0.1, PD / 2 + 0.01] }));
    var ledUV = mesh(new THREE.SphereGeometry(0.045, 10, 10), M.ledUV, { pos: [0.46, 0.1, PD / 2 + 0.02] });
    pureModule.add(ledUV);
    var ledUVLight = new THREE.PointLight(0xcc88ff, 0.4, 1.6);
    ledUVLight.position.set(0.46, 0.1, PD / 2 + 0.1);
    pureModule.add(ledUVLight);

    // 14 UF fibers in a row
    for (var fi = 0; fi < 14; fi++) {
      var fx = -0.45 + (0.9 * fi) / 13;
      pureModule.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), M.fiber, { pos: [fx, -0.05, 0.28] }));
    }
    // UV-C housing: navy cylinder with emissive purple core
    pureModule.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16), M.navyDark, { pos: [-0.42, -0.05, -0.15], rot: [0, 0, Math.PI / 2] }));
    pureModule.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.58, 12), M.uvCore, { pos: [-0.42, -0.05, -0.15], rot: [0, 0, Math.PI / 2] }));
    // Bottom connector with steel fitting
    pureModule.add(mesh(new THREE.BoxGeometry(0.24, 0.1, 0.24), M.navyDark, { pos: [0, -PH / 2 - 0.04, 0] }));
    pureModule.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 12), M.steel, { pos: [0, -PH / 2 - 0.12, 0] }));

    scene.add(pureModule);

    // ============================================================
    // OUTLET HOSE — natural curve + 2 steel clamps
    // ============================================================
    var hoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -0.7, 0.42),
      new THREE.Vector3(-0.3, -1.0, 0.5),
      new THREE.Vector3(-0.6, -1.3, 0.35),
      new THREE.Vector3(-0.7, -1.7, 0.1),
      new THREE.Vector3(-0.55, -2.1, -0.1),
      new THREE.Vector3(-0.3, -2.4, 0.0),
      new THREE.Vector3(0.0, -2.6, 0.15)
    ]);
    var hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 32, 0.048, 10, false), M.hose);
    hose.castShadow = true;
    scene.add(hose);
    // Clamps at t=0.25 and t=0.55
    [0.25, 0.55].forEach(function (t) {
      var p = hoseCurve.getPoint(t);
      var tan = hoseCurve.getTangent(t);
      var clamp = mesh(new THREE.TorusGeometry(0.06, 0.018, 8, 16), M.steel, { pos: [p.x, p.y, p.z] });
      clamp.lookAt(p.x + tan.x, p.y + tan.y, p.z + tan.z);
      scene.add(clamp);
    });

    // ============================================================
    // RAIN — 35 drops
    // ============================================================
    var rainMat = new THREE.MeshStandardMaterial({ color: 0x6aaad0, transparent: true, opacity: 0.7, roughness: 0.1 });
    var raindrops = [];
    for (var ri = 0; ri < 35; ri++) {
      var drop = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), rainMat);
      drop.position.set((Math.random() - 0.5) * 5, 3.2 + Math.random() * 4.3, (Math.random() - 0.5) * 2.4);
      drop.scale.y = 2.2; // elongate to look like falling rain
      drop.userData.speed = 0.035 + Math.random() * 0.04;
      drop.userData.drift = (Math.random() - 0.5) * 0.004;
      scene.add(drop);
      raindrops.push(drop);
    }

    // ============================================================
    // GROUND + subtle green reflection
    // ============================================================
    scene.add(mesh(new THREE.PlaneGeometry(18, 18), M.ground, { pos: [0, -2.9, 0], rot: [-Math.PI / 2, 0, 0], receive: true }));
    scene.add(mesh(new THREE.PlaneGeometry(2, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x38CC80, transparent: true, opacity: 0.04 }),
      { pos: [0, -2.88, 1.2], rot: [-Math.PI / 2, 0, 0] }));

    // moduleGlow — soft pulsing point light around base
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
    var target = new THREE.Vector3(0, 1.5, 0);
    var sph = { radius: 10, theta: Math.atan2(8, 6), phi: 1.08 };
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

    // View presets
    var views = {
      frontal:    { theta: Math.PI / 2, phi: Math.PI / 2, radius: 9.5 },
      lateral:    { theta: 0.05,        phi: Math.PI / 2, radius: 9.5 },
      superior:   { theta: Math.PI / 2, phi: 0.22,        radius: 12 },
      isometrica: { theta: Math.atan2(8, 6), phi: 1.08,   radius: 10 }
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
    function animate() {
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      if (autoRotate) sph.theta += 0.003;

      camera.position.x = target.x + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      camera.position.y = target.y + sph.radius * Math.cos(sph.phi);
      camera.position.z = target.z + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      camera.lookAt(target);

      // Rain
      for (var i = 0; i < raindrops.length; i++) {
        var d = raindrops[i];
        d.position.y -= d.userData.speed;
        d.position.x += d.userData.drift;
        if (d.position.y < 3.2) {
          d.position.y = 7.5;
          d.position.x = (Math.random() - 0.5) * 5;
          d.position.z = (Math.random() - 0.5) * 2.4;
        }
      }

      // Water breathing (scale + opacity)
      var ws = 0.68 + Math.sin(t * 0.4) * 0.025;        // 0.655 - 0.705
      water.scale.y = ws;
      water.material.opacity = 0.45 + Math.sin(t * 0.7) * 0.09; // 0.36 - 0.54
      windowWater.scale.y = ws;

      // Green LED pulse
      var lp = (Math.sin(t * 2.5) + 1) / 2;             // 0..1
      ledGreenLight.intensity = 0.4 + lp * 1.0;          // 0.4 - 1.4
      M.ledGreen.emissiveIntensity = 0.7 + lp * 1.6;     // 0.7 - 2.3

      // UV-C LED pulse (slower)
      var up = (Math.sin(t * 1.8 + 1.2) + 1) / 2;
      ledUVLight.intensity = 0.3 + up * 0.6;
      M.ledUV.emissiveIntensity = 1.2 + up * 0.8;

      // Module glow
      moduleGlow.intensity = 0.4 + ((Math.sin(t * 0.9) + 1) / 2) * 0.4; // 0.4 - 0.8

      updateLabels();
      renderer.render(scene, camera);
    }
    animate();

    // Second resize after first paint (robust full-size init).
    requestAnimationFrame(resize);
  }

  window.initThreeScene = initThreeScene;
})();
