(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.querySelector('.theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('#nav-links');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero-stage');
  let redraw = () => {};

  // Mark the first paint as ready only after the browser has a frame to compose.
  // Content remains visible without JavaScript and reduced-motion users skip the entrance choreography.
  requestAnimationFrame(() => root.classList.add('page-ready'));

  function syncTheme() {
    const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && systemTheme.matches);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#1d1c1c' : '#ffffff';
    theme?.setAttribute('aria-pressed', String(dark));
    redraw();
  }
  if (theme) {
    theme.hidden = false;
    theme.addEventListener('click', () => {
      const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && systemTheme.matches);
      root.dataset.theme = dark ? 'light' : 'dark';
      try { localStorage.setItem('suhas-theme', root.dataset.theme); } catch (_) {}
      syncTheme();
    });
  }
  systemTheme.addEventListener('change', syncTheme);
  syncTheme();

  function closeMenu(returnFocus = false) {
    if (!menu || !links) return;
    menu.setAttribute('aria-expanded', 'false');
    menu.querySelector('.menu-label').textContent = 'Menu';
    links.classList.remove('is-open');
    if (returnFocus) menu.focus();
  }
  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      menu.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
      links.classList.toggle('is-open', open);
    });
    links.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true); });
    document.addEventListener('click', event => { if (!event.target.closest('.nav-dock') && menu.getAttribute('aria-expanded') === 'true') closeMenu(); });
  }
  if (hero && header) {
    new IntersectionObserver(entries => header.classList.toggle('is-over-hero', entries[0].isIntersecting), {rootMargin:'-80px 0px 0px 0px',threshold:0}).observe(hero);
  }
  document.querySelector('.print-button')?.addEventListener('click', () => window.print());

  const sceneButtons = [...document.querySelectorAll('.scene-button')];
  const credits = {
    earthrise: {label:'Earthrise · Apollo 8 · NASA / Bill Anders ↗',url:'https://science.nasa.gov/resource/apollo-8s-iconic-earthrise/'},
    jupiter: {label:'Jupiter · Voyager 2 · NASA / JPL ↗',url:'https://science.nasa.gov/image-detail/amf-pia01370/'},
    simulation: {label:'My Voyager / Elodin demo · PR #769 ↗',url:'https://github.com/elodin-sys/elodin/pull/769'}
  };
  function selectScene(button) {
    const view = button.dataset.view;
    document.querySelectorAll('.hero-scene').forEach(img => img.classList.toggle('is-active', img.dataset.scene === view));
    sceneButtons.forEach(b => b.setAttribute('aria-pressed',String(b === button)));
    const credit = document.querySelector('#scene-credit');
    if (credit && credits[view]) {credit.textContent = credits[view].label;credit.href = credits[view].url;}
  }
  if (sceneButtons.length) {
    document.querySelector('.scene-picker').hidden = false;
    sceneButtons.forEach((button,index) => {
      button.addEventListener('click', () => selectScene(button));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index+1)%sceneButtons.length;
        if (event.key === 'ArrowLeft') next = (index+sceneButtons.length-1)%sceneButtons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = sceneButtons.length-1;
        if (next !== undefined) {event.preventDefault();selectScene(sceneButtons[next]);sceneButtons[next].focus();}
      });
    });
    selectScene(sceneButtons.find(button => button.getAttribute('aria-pressed') === 'true') || sceneButtons[0]);
  }
  if (!motion.matches && 'IntersectionObserver' in window) {
    const reveals = new IntersectionObserver(entries => entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('is-visible');reveals.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.featured-project,.project,.orbit-copy,.contribution-layout,.about-copy,.systems-heading,.system-card,.work-wall-head,.work-wall-index,.archive-heading,.archive-item,.contact-inner').forEach((el,index) => {el.classList.add('reveal-ready');el.style.setProperty('--reveal-delay', `${Math.min(index,5) * 55}ms`);reveals.observe(el);});
  }

  // A restrained pointer tilt gives the systems cards physicality without hijacking scrolling.
  if (!motion.matches && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.system-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        card.style.setProperty('--tilt-x', `${(-y * 2.3).toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${(x * 2.3).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  // The project wall is a lightweight 3D carousel. The cards remain ordinary
  // links in the DOM; the orbit adds depth, drag-to-rotate, and a slow idle turn.
  const projectWall = document.querySelector('[data-project-wall]');
  if (projectWall) {
    const orbit = projectWall.querySelector('[data-wall-orbit]');
    const cards = [...projectWall.querySelectorAll('[data-wall-card]')];
    const status = projectWall.parentElement?.querySelector('.project-wall-status');
    const prev = projectWall.querySelector('[data-wall-prev]');
    const next = projectWall.querySelector('[data-wall-next]');
    const toggle = projectWall.querySelector('[data-wall-toggle]');
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    const titleFor = card => card.querySelector('strong')?.textContent?.trim() || 'Project';
    const kindFor = card => card.querySelector('.project-object-id')?.textContent?.replace(/^\d+\s*·\s*/, '').trim().toLowerCase() || 'work';
    const angleFor = card => Number.parseFloat(card.style.getPropertyValue('--angle')) || 0;
    let rotation = 0;
    let velocity = 0;
    let raf = 0;
    let lastTime = 0;
    let dragging = false;
    let pointerDown = false;
    let dragStarted = false;
    let suppressClick = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let paused = false;
    let hovering = false;
    let wallVisible = true;

    const defaultStatus = 'Drag to rotate · click a project to open';
    const setStatus = card => {
      if (status && card) status.textContent = `${titleFor(card)} · ${kindFor(card)} · open project ↗`;
    };

    const setRotation = value => {
      rotation = value;
      projectWall.style.setProperty('--orbit-rotation', `${rotation.toFixed(2)}deg`);
    };

    const nearestTarget = angle => {
      const delta = ((-angle - rotation + 540) % 360) - 180;
      return rotation + delta;
    };

    const snapTo = card => {
      if (!card || motion.matches) return;
      paused = true;
      if (toggle) {
        toggle.setAttribute('aria-pressed', 'true');
        toggle.textContent = 'Resume rotation';
      }
      projectWall.classList.add('is-snapping');
      setRotation(nearestTarget(angleFor(card)));
      window.setTimeout(() => projectWall.classList.remove('is-snapping'), 820);
    };

    const setPaused = value => {
      paused = value;
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.textContent = paused ? 'Resume rotation' : 'Pause rotation';
      }
    };

    const stepRotation = delta => {
      setPaused(true);
      projectWall.classList.add('is-snapping');
      setRotation(rotation + delta);
      window.setTimeout(() => projectWall.classList.remove('is-snapping'), 820);
    };

    cards.forEach(card => {
      card.addEventListener('pointerenter', () => { hovering = true; card.classList.add('is-active'); setStatus(card); });
      card.addEventListener('pointerleave', () => { hovering = false; card.classList.remove('is-active'); if (status) status.textContent = defaultStatus; });
      card.addEventListener('focus', () => { hovering = true; card.classList.add('is-active'); setStatus(card); snapTo(card); });
      card.addEventListener('blur', () => { hovering = false; card.classList.remove('is-active'); if (status) status.textContent = defaultStatus; });
    });

    if (orbit && !motion.matches) {
      const tick = time => {
        const delta = Math.min(40, lastTime ? time - lastTime : 16);
        lastTime = time;
        if (wallVisible) {
          if (!paused && !dragging && !hovering) rotation += delta * .0026;
          if (!dragging && Math.abs(velocity) > .01) {
            rotation += velocity * (delta / 16);
            velocity *= Math.pow(.88, delta / 16);
          }
          setRotation(rotation);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      if ('IntersectionObserver' in window) {
        const wallObserver = new IntersectionObserver(entries => { wallVisible = Boolean(entries[0]?.isIntersecting); }, {threshold:.05});
        wallObserver.observe(projectWall);
      }
    }

    if (prev) prev.addEventListener('click', () => stepRotation(60));
    if (next) next.addEventListener('click', () => stepRotation(-60));
    if (toggle) toggle.addEventListener('click', () => setPaused(!paused));

    let pointerX = 0, pointerY = 0, tiltFrame = 0;
    const renderTilt = () => {
      tiltFrame = 0;
      projectWall.style.setProperty('--wall-rx', `${(-pointerY * 6.5).toFixed(2)}deg`);
      projectWall.style.setProperty('--wall-ry', `${(pointerX * 8).toFixed(2)}deg`);
      projectWall.style.setProperty('--wall-shift-x', `${(pointerX * 12).toFixed(1)}px`);
      projectWall.style.setProperty('--wall-shift-y', `${(pointerY * 9).toFixed(1)}px`);
    };
    projectWall.addEventListener('pointermove', event => {
      const box = projectWall.getBoundingClientRect();
      pointerX = (event.clientX - box.left) / box.width - .5;
      pointerY = (event.clientY - box.top) / box.height - .5;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(renderTilt);

      if (!orbit || motion.matches || !pointerDown) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!dragStarted) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.15) { pointerDown = false; return; }
        dragStarted = true;
        dragging = true;
        suppressClick = true;
        projectWall.classList.add('is-dragging');
        try { projectWall.setPointerCapture(event.pointerId); } catch (_) {}
      }
      const deltaX = event.clientX - lastX;
      lastX = event.clientX;
      velocity = deltaX * .34;
      rotation += deltaX * .34;
      setRotation(rotation);
    });
    projectWall.addEventListener('pointerdown', event => {
      if (!orbit || motion.matches || event.target.closest('.project-wall-controls') || (event.pointerType === 'mouse' && event.button !== 0)) return;
      pointerDown = true;
      dragStarted = false;
      startX = lastX = event.clientX;
      startY = event.clientY;
      velocity = 0;
    });
    const endDrag = event => {
      if (!pointerDown && !dragging) return;
      pointerDown = false;
      dragging = false;
      projectWall.classList.remove('is-dragging');
      if (event?.pointerId !== undefined && projectWall.hasPointerCapture?.(event.pointerId)) projectWall.releasePointerCapture(event.pointerId);
    };
    projectWall.addEventListener('pointerup', endDrag);
    projectWall.addEventListener('pointercancel', endDrag);
    projectWall.addEventListener('click', event => {
      if (suppressClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      }
    }, true);
    projectWall.addEventListener('pointerleave', () => {
      pointerX = 0; pointerY = 0;
      hovering = false;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(renderTilt);
    });
  }

  const canvas = document.querySelector('#flybyCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const figure = canvas.closest('.flyby');
  const controls = figure.querySelector('.flyby-controls');
  const range = document.querySelector('#approach');
  const radiusText = document.querySelector('#approachValue');
  const turnText = document.querySelector('#turnValue');
  const play = document.querySelector('#playFlyby');
  const MU = 126686531.9; // JPL Jupiter GM, km^3 / s^2; illustrative model.
  const RADIUS = 71492; // Jupiter reference equatorial radius, km.
  const V_INF = 16; // Chosen illustrative hyperbolic excess speed, km/s.
  let rp = Number(range.value), points = [], phase = .47, playing = false, frame = 0;
  let lastTime = 0, visible = true;

  function geometry() {
    const e = 1 + rp * V_INF * V_INF / MU;
    const p = rp * (1 + e);
    const limit = Math.acos(-1 / e) * .96;
    const rotation = -.50;
    const scale = .00079;
    points = [];
    for (let i = 0; i <= 500; i++) {
      const theta = -limit + 2 * limit * i / 500;
      const r = p / (1 + e * Math.cos(theta));
      const x = r * Math.cos(theta), y = r * Math.sin(theta);
      points.push([260 + scale * (x * Math.cos(rotation) - y * Math.sin(rotation)),
        218 + scale * (x * Math.sin(rotation) + y * Math.cos(rotation))]);
    }
    radiusText.textContent = rp.toLocaleString('en-US') + ' km';
    range.setAttribute('aria-valuetext', rp.toLocaleString('en-US') + ' kilometers from Jupiter’s center');
    turnText.textContent = (2 * Math.asin(1 / e) * 180 / Math.PI).toFixed(1) + '°';
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(canvas.width / 640, 0, 0, canvas.height / 440, 0, 0);
    ctx.clearRect(0, 0, 640, 440);
    const css = getComputedStyle(root);
    const ink = css.getPropertyValue('--muted').trim();
    const line = css.getPropertyValue('--line').trim();
    const accent = css.getPropertyValue('--accent').trim();
    const bg = css.getPropertyValue('--bg').trim();
    const cx = 260, cy = 218, r = RADIUS * .00079;

    // Planet silhouette and projected latitude/longitude curves at the same spatial scale as the path.
    ctx.fillStyle = bg;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = line;
    for (const q of [.25, .55, .82]) {
      ctx.beginPath();ctx.ellipse(cx, cy, r*q, r, 0, 0, Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.ellipse(cx, cy, r, r*q, 0, 0, Math.PI*2);ctx.stroke();
    }
    // Periapsis line indicates the quantity changed by the slider.
    const near = points[250];
    ctx.setLineDash([3, 5]);ctx.strokeStyle = line;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(near[0],near[1]);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle = accent;ctx.lineWidth = 1.8;ctx.beginPath();
    points.forEach((point,i) => { if (!i) ctx.moveTo(...point); else ctx.lineTo(...point); });
    ctx.stroke();
    const marker = points[Math.round(phase * (points.length - 1))];
    ctx.beginPath();ctx.arc(marker[0],marker[1],5,0,2*Math.PI);ctx.fillStyle=accent;ctx.fill();
    ctx.beginPath();ctx.arc(near[0],near[1],3,0,2*Math.PI);ctx.fillStyle=bg;ctx.fill();ctx.stroke();
    ctx.font='12px Space, Arial, sans-serif';ctx.fillStyle=ink;ctx.fillText('Jupiter',cx-r,cy+r+29);
    ctx.font='11px Plex, monospace';ctx.fillStyle=ink;ctx.fillText('v∞ = 16 km/s',25,40);
    ctx.fillText('Closest approach',Math.min(near[0]+12,475),near[1]+24);
  }
  function pause() {
    playing=false;cancelAnimationFrame(frame);frame=0;lastTime=0;
    play.textContent='Play trajectory';play.setAttribute('aria-pressed','false');
  }
  function tick(time) {
    if (!playing || !visible || document.hidden || motion.matches) { pause(); return; }
    if (lastTime) phase += Math.min(time-lastTime,40)/11000;
    lastTime=time;
    if (phase > .89) { phase=.11; }
    draw();frame=requestAnimationFrame(tick);
  }
  range.addEventListener('input', () => { rp=Number(range.value); geometry(); draw(); });
  play.addEventListener('click', () => {
    if (playing) { pause(); return; }
    if (motion.matches) { phase = phase >= .7 ? .25 : phase+.15; draw(); return; }
    playing=true;play.textContent='Pause trajectory';play.setAttribute('aria-pressed','true');lastTime=0;
    frame=requestAnimationFrame(tick);
  });
  function syncMotion() {
    pause();
    if (motion.matches) play.textContent='Step trajectory';
  }
  motion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); syncMotion(); } });
  new IntersectionObserver(entries => {
    visible=entries[0].isIntersecting;
    if (!visible) { pause(); syncMotion(); }
  }, {threshold:0}).observe(figure);
  new ResizeObserver(draw).observe(canvas);
  redraw=draw;geometry();draw();syncMotion();
  controls.hidden=false;figure.classList.add('ready');
})();
