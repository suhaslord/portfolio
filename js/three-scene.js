(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (window.innerWidth < 768) {
    return;
  }

  const container = document.getElementById('hero-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initThreeScene();
        observer.disconnect();
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);

  function initThreeScene() {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  camera.position.z = 15;

  const satelliteGroup = new THREE.Group();

  const bodyGeometry = new THREE.BoxGeometry(2, 1, 1);
  const bodyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x2f4a3c,
    shininess: 80,
    specular: 0x555555
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  satelliteGroup.add(body);

  const panelGeometry = new THREE.BoxGeometry(4, 0.1, 1.5);
  const panelMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x1a4d6d,
    emissive: 0x0a2a3d,
    shininess: 100
  });
  
  const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  leftPanel.position.set(-3, 0, 0);
  satelliteGroup.add(leftPanel);

  const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial);
  rightPanel.position.set(3, 0, 0);
  satelliteGroup.add(rightPanel);

  const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
  const antennaMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xa67c4e,
    shininess: 90
  });
  const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
  antenna.position.set(0, 1.5, 0);
  satelliteGroup.add(antenna);

  const dishGeometry = new THREE.ConeGeometry(0.4, 0.6, 16);
  const dishMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xebe4d6,
    shininess: 70
  });
  const dish = new THREE.Mesh(dishGeometry, dishMaterial);
  dish.position.set(1.2, 0, 0);
  dish.rotation.z = Math.PI / 2;
  satelliteGroup.add(dish);

  const orbitGeometry = new THREE.TorusGeometry(8, 0.03, 16, 100);
  const orbitMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x2f4a3c,
    transparent: true,
    opacity: 0.2
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  const starsGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < 200; i++) {
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 50;
    starVertices.push(x, y, z);
  }
  starsGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const starsMaterial = new THREE.PointsMaterial({ 
    color: 0x2f4a3c,
    size: 0.1,
    transparent: true,
    opacity: 0.6
  });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  scene.add(satelliteGroup);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xa67c4e, 0.5, 50);
  pointLight.position.set(-10, 5, 5);
  scene.add(pointLight);

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    targetX += (mouseX * 0.3 - targetX) * 0.05;
    targetY += (mouseY * 0.3 - targetY) * 0.05;

    satelliteGroup.rotation.y = time * 0.3 + targetX;
    satelliteGroup.rotation.x = Math.sin(time * 0.2) * 0.1 + targetY * 0.5;
    satelliteGroup.rotation.z = Math.cos(time * 0.15) * 0.05;

    stars.rotation.y = time * 0.05;
    stars.rotation.x = time * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', handleResize);

  setTimeout(() => {
    container.style.opacity = '0.7';
  }, 100);
  }
})();
