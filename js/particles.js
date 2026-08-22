(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let connections = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(47, 74, 60, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  createParticles();
  window.addEventListener('resize', createParticles);

  function connectParticles() {
    connections = [];
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          connections.push({
            p1: particles[i],
            p2: particles[j],
            opacity: (1 - distance / 150) * 0.3
          });
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles();
    connections.forEach(conn => {
      ctx.beginPath();
      ctx.moveTo(conn.p1.x, conn.p1.y);
      ctx.lineTo(conn.p2.x, conn.p2.y);
      ctx.strokeStyle = `rgba(47, 74, 60, ${conn.opacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();

  let mouseParticle = null;
  canvas.addEventListener('mousemove', (e) => {
    mouseParticle = {
      x: e.clientX,
      y: e.clientY
    };

    particles.forEach(particle => {
      const dx = mouseParticle.x - particle.x;
      const dy = mouseParticle.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx -= (dx / distance) * force * 0.1;
        particle.vy -= (dy / distance) * force * 0.1;
      }
    });
  });

  canvas.addEventListener('mouseleave', () => {
    mouseParticle = null;
  });
})();
