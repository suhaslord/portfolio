(() => {
  'use strict';
  const root = document.documentElement;
  const theme = document.querySelector('#theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const links = document.querySelector('#nav-links');
  let redraw = () => {};

  function syncTheme() {
    const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && systemTheme.matches);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#171c20' : '#f3f4f4';
    redraw();
  }
  if (theme) {
    theme.value = root.dataset.theme || 'system';
    theme.addEventListener('change', () => {
      if (theme.value === 'system') delete root.dataset.theme;
      else root.dataset.theme = theme.value;
      try { localStorage.setItem('suhas-theme', theme.value); } catch (_) {}
      syncTheme();
    });
  }
  systemTheme.addEventListener('change', syncTheme);
  syncTheme();

  function closeMenu(returnFocus = false) {
    if (!menu || !links) return;
    menu.setAttribute('aria-expanded', 'false');
    menu.textContent = 'Menu';
    links.classList.remove('is-open');
    if (returnFocus) menu.focus();
  }
  if (menu && links) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Menu';
      links.classList.toggle('is-open', open);
    });
    links.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.nav') && menu.getAttribute('aria-expanded') === 'true') closeMenu();
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', () => closeMenu());
  }
  document.querySelector('.print-button')?.addEventListener('click', () => window.print());

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
