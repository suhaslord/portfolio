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

  // The project wall is a small spatial index: native links stay in the DOM,
  // while a pointer moves the scene just enough to reveal its depth.
  const projectWall = document.querySelector('[data-project-wall]');
  if (projectWall) {
    const cards = [...projectWall.querySelectorAll('[data-wall-card]')];
    const status = projectWall.parentElement?.querySelector('.project-wall-status');
    const finePointer = window.matchMedia('(pointer:fine)').matches;
    const titleFor = card => card.querySelector('strong')?.textContent?.trim() || 'Project';
    const kindFor = card => card.querySelector('.project-object-id')?.textContent?.replace(/^\d+\s*·\s*/, '').trim().toLowerCase() || 'work';
    const setStatus = card => {
      if (status && card) status.textContent = `${titleFor(card)} · ${kindFor(card)} · open case study ↗`;
    };
    cards.forEach(card => {
      card.addEventListener('pointerenter', () => { card.classList.add('is-active'); setStatus(card); });
      card.addEventListener('pointerleave', () => { card.classList.remove('is-active'); if (status) status.textContent = 'Hover a project to bring it forward.'; });
      card.addEventListener('focus', () => { card.classList.add('is-active'); setStatus(card); });
      card.addEventListener('blur', () => { card.classList.remove('is-active'); if (status) status.textContent = 'Hover a project to bring it forward.'; });
    });
    if (!motion.matches && finePointer) {
      let pointerX = 0, pointerY = 0, frame = 0;
      const renderWall = () => {
        frame = 0;
        projectWall.style.setProperty('--wall-rx', `${(-pointerY * 3.3).toFixed(2)}deg`);
        projectWall.style.setProperty('--wall-ry', `${(pointerX * 4.2).toFixed(2)}deg`);
        projectWall.style.setProperty('--wall-shift-x', `${(pointerX * 9).toFixed(1)}px`);
        projectWall.style.setProperty('--wall-shift-y', `${(pointerY * 7).toFixed(1)}px`);
      };
      projectWall.addEventListener('pointermove', event => {
        const box = projectWall.getBoundingClientRect();
        pointerX = (event.clientX - box.left) / box.width - .5;
        pointerY = (event.clientY - box.top) / box.height - .5;
        if (!frame) frame = requestAnimationFrame(renderWall);
      });
      projectWall.addEventListener('pointerleave', () => {
        pointerX = 0; pointerY = 0;
        if (!frame) frame = requestAnimationFrame(renderWall);
      });
    }
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
