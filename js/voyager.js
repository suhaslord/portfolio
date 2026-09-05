/* A progressive, scroll-directed Voyager scene. The rest of the page never depends on WebGL. */
(() => {
  'use strict';
  const canvas = document.querySelector('#voyagerCanvas');
  const section = document.querySelector('#voyager-scene');
  const viewport = document.querySelector('.voyager-viewport');
  if (!canvas || !section || !viewport) return;

  const loading = document.querySelector('#voyagerLoading');
  const status = document.querySelector('#voyagerStatus');
  const explore = document.querySelector('#voyagerExplore');
  const labels = document.querySelector('#voyagerLabels');
  const reset = document.querySelector('#voyagerReset');
  const annotations = document.querySelector('#voyagerAnnotations');
  const sequenceLabel = document.querySelector('.voyager-sequence-label');
  const sequenceCount = document.querySelector('.voyager-sequence-count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let stopped = false;

  function message(text) {
    if (status) status.textContent = text;
    if (loading) loading.querySelector('span:not(.loader-dot)').textContent = text;
  }

  function fail(text) {
    viewport.classList.add('is-fallback');
    if (loading) loading.hidden = true;
    message(text);
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible && window.__voyagerStop) window.__voyagerStop();
  }, { threshold: 0.02 });
  observer.observe(section);

  /* Dynamic imports keep a CDN failure or a missing WebGL context from blocking the page. */
  Promise.all([
    import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'),
    import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js'),
    import('https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/DRACOLoader.js')
  ]).then(([threeModule, gltfModule, dracoModule]) => boot(threeModule, gltfModule.GLTFLoader, dracoModule.DRACOLoader))
    .catch(() => fail('3D unavailable · static spacecraft view'));

  function boot(THREE, GLTFLoader, DRACOLoader) {
    if (!window.WebGLRenderingContext) { fail('WebGL unavailable · static spacecraft view'); return; }
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch (_) { fail('WebGL unavailable · static spacecraft view'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(canvas.clientWidth || 640, canvas.clientHeight || 540, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101017, 0.018);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0.15, 0.2, 8.5);
    const target = new THREE.Vector3(0, 0, 0);
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const root = new THREE.Group();
    const modelHolder = new THREE.Group();
    scene.add(root);
    root.add(modelHolder);

    scene.add(new THREE.HemisphereLight(0xeee4ff, 0x171420, 1.3));
    const key = new THREE.DirectionalLight(0xffe1bd, 3.8);
    key.position.set(-4, 5, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xa875dc, 8, 18, 2);
    rim.position.set(5, 1, -3);
    scene.add(rim);

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    let seed = 17;
    for (let i = 0; i < 260; i += 1) {
      seed = (seed * 9301 + 49297) % 233280;
      const r = seed / 233280;
      seed = (seed * 9301 + 49297) % 233280;
      const angle = (seed / 233280) * Math.PI * 2;
      const distance = 12 + r * 28;
      starPositions.push(Math.cos(angle) * distance, (r - .5) * 18, Math.sin(angle) * distance - 5);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    root.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: 0xf4eaff, size: .045, transparent: true, opacity: .72, sizeAttenuation: true })));

    const jupiter = new THREE.Mesh(
      new THREE.SphereGeometry(2.35, 48, 32),
      new THREE.MeshStandardMaterial({ color: 0xc9936d, roughness: .92, metalness: 0 })
    );
    jupiter.position.set(4.4, -.25, -5.4);
    jupiter.scale.set(1, .97, 1);
    root.add(jupiter);
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.41, 40, 28),
      new THREE.MeshBasicMaterial({ color: 0xdba87e, transparent: true, opacity: .085, side: THREE.BackSide })
    );
    atmosphere.position.copy(jupiter.position);
    root.add(atmosphere);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/3d/jupiter-map.jpg', texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      jupiter.material.map = texture;
      jupiter.material.needsUpdate = true;
    }, undefined, () => {});

    const pathCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-7, 2.3, -1.2), new THREE.Vector3(-3.5, 1.25, -.6),
      new THREE.Vector3(-.8, .2, -.1), new THREE.Vector3(2.6, -.3, -1.8),
      new THREE.Vector3(6.2, .5, -4.6)
    ]);
    const pathPoints = pathCurve.getPoints(180);
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const path = new THREE.Line(pathGeometry, new THREE.LineBasicMaterial({ color: 0xdfbafa, transparent: true, opacity: .23 }));
    root.add(path);
    const pathDot = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0xdfbafa }));
    root.add(pathDot);

    let model;
    let baseYaw = -.55;
    let manualYaw = 0;
    let manualPitch = .08;
    let exploring = false;
    let dragging = false;
    let lastPointer = { x: 0, y: 0 };
    let progress = 0;
    let targetProgress = 0;
    let frame = 0;
    let lastTime = 0;

    const draco = new DRACOLoader();
    draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.load('assets/3d/voyager-a.glb', gltf => {
      model = gltf.scene;
      const before = new THREE.Box3().setFromObject(model);
      const size = before.getSize(new THREE.Vector3());
      const scale = 4.6 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      const after = new THREE.Box3().setFromObject(model);
      const center = after.getCenter(new THREE.Vector3());
      model.position.sub(center);
      model.traverse(node => {
        if (node.isMesh) {
          node.castShadow = false;
          node.receiveShadow = false;
          if (node.material) {
            node.material.roughness = Math.max(node.material.roughness || .5, .42);
          }
        }
      });
      modelHolder.add(model);
      viewport.classList.add('is-ready');
      if (loading) loading.hidden = true;
      message('NASA model loaded · scroll to reveal');
    }, xhr => {
      if (xhr.total && loading) loading.querySelector('small').textContent = Math.round(xhr.loaded / xhr.total * 100) + '% loaded';
    }, () => fail('Model unavailable · static spacecraft view'));

    function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
    function readProgress() {
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      targetProgress = clamp(-rect.top / travel, 0, 1);
    }
    function updateSequence() {
      const label = targetProgress < .34 ? 'Close inspection' : (targetProgress < .68 ? 'Instrument geometry' : 'Planet + trajectory');
      const count = targetProgress < .34 ? '01' : (targetProgress < .68 ? '02' : '03');
      if (sequenceLabel) sequenceLabel.textContent = label;
      if (sequenceCount) sequenceCount.textContent = count;
    }
    function resize() {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    function draw(time) {
      if (stopped) return;
      const delta = Math.min(40, time - (lastTime || time));
      lastTime = time;
      readProgress();
      progress += (targetProgress - progress) * (reduceMotion.matches ? 1 : .075);
      updateSequence();
      const close = 8.3 - progress * 1.45;
      const side = -.25 + progress * 1.3;
      camera.position.lerp(new THREE.Vector3(side, .12 + progress * .34, close), reduceMotion.matches ? 1 : .08);
      cameraTarget.lerp(new THREE.Vector3(progress * 1.1, progress * -.12, -.25 - progress * .7), reduceMotion.matches ? 1 : .08);
      camera.lookAt(cameraTarget);
      if (model) {
        const auto = reduceMotion.matches || exploring ? 0 : delta * .00016;
        baseYaw += auto;
        modelHolder.rotation.y = baseYaw + manualYaw;
        modelHolder.rotation.x = manualPitch + progress * .06;
        modelHolder.rotation.z = .06 + progress * -.08;
      }
      jupiter.position.x = 4.4 - progress * .9;
      atmosphere.position.copy(jupiter.position);
      const reveal = clamp((progress - .24) * 1.6, 0, 1);
      jupiter.material.opacity = .82 * reveal;
      jupiter.material.transparent = true;
      atmosphere.material.opacity = .085 * reveal;
      path.material.opacity = .13 + reveal * .25;
      pathDot.position.copy(pathCurve.getPointAt(clamp(.12 + progress * .7, 0, 1)));
      if (visible && !document.hidden) {
        renderer.render(scene, camera);
        frame = requestAnimationFrame(draw);
      } else frame = 0;
    }
    function start() { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
    function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; }
    window.__voyagerStop = stop;

    window.addEventListener('scroll', () => { readProgress(); updateSequence(); start(); }, { passive: true });
    window.addEventListener('resize', () => { resize(); start(); }, { passive: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
    new ResizeObserver(() => { resize(); start(); }).observe(viewport);

    explore?.addEventListener('click', () => {
      exploring = !exploring;
      explore.setAttribute('aria-pressed', String(exploring));
      explore.textContent = exploring ? 'Finish exploring' : 'Explore spacecraft';
      canvas.classList.toggle('is-exploring', exploring);
      message(exploring ? 'Exploration mode · drag or use arrow keys' : 'Scroll-directed view restored');
      start();
    });
    labels?.addEventListener('click', () => {
      const on = labels.getAttribute('aria-pressed') !== 'true';
      labels.setAttribute('aria-pressed', String(on));
      annotations.hidden = !on;
      message(on ? 'Labels on · antenna, body, and science boom' : 'Labels off');
    });
    reset?.addEventListener('click', () => {
      manualYaw = 0; manualPitch = .08; baseYaw = -.55;
      message('View reset'); start();
    });
    canvas.addEventListener('keydown', event => {
      if (!exploring) return;
      if (event.key === 'ArrowLeft') manualYaw -= .12;
      else if (event.key === 'ArrowRight') manualYaw += .12;
      else if (event.key === 'ArrowUp') manualPitch = clamp(manualPitch - .1, -.8, .8);
      else if (event.key === 'ArrowDown') manualPitch = clamp(manualPitch + .1, -.8, .8);
      else return;
      event.preventDefault(); start();
    });
    canvas.addEventListener('pointerdown', event => {
      if (!exploring) return;
      dragging = true; lastPointer = { x: event.clientX, y: event.clientY }; canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove', event => {
      if (!dragging) return;
      manualYaw += (event.clientX - lastPointer.x) * .008;
      manualPitch = clamp(manualPitch + (event.clientY - lastPointer.y) * .006, -.8, .8);
      lastPointer = { x: event.clientX, y: event.clientY }; start();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => canvas.addEventListener(type, () => { dragging = false; }));
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); stop(); fail('Graphics context paused · static spacecraft view'); });
    resize();
    if (loading) loading.querySelector('span:last-child').textContent = 'Loading the spacecraft';
    start();
  }
})();
