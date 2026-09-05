(() => {
  'use strict';
  const canvas = document.querySelector('#aegisCanvas');
  const angle = document.querySelector('#aegisAngle');
  const occlusion = document.querySelector('#aegisOcclusion');
  const angleValue = document.querySelector('#aegisAngleValue');
  const occlusionValue = document.querySelector('#aegisOcclusionValue');
  const explanation = document.querySelector('#aegisExplain');
  const reset = document.querySelector('#aegisReset');
  if (!canvas || !angle || !occlusion || !explanation) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const root = document.documentElement;

  function draw() {
    const a = Number(angle.value);
    const o = Number(occlusion.value);
    angleValue.textContent = a + '°';
    occlusionValue.textContent = o + '%';
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || 720;
    const height = canvas.clientHeight || 480;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(canvas.width / 720, 0, 0, canvas.height / 480, 0, 0);
    const styles = getComputedStyle(root);
    const ink = styles.getPropertyValue('--ink').trim() || '#292929';
    const muted = styles.getPropertyValue('--muted').trim() || '#62605d';
    const line = styles.getPropertyValue('--line').trim() || '#ddd8d3';
    const accent = styles.getPropertyValue('--accent').trim() || '#694183';
    const surface = styles.getPropertyValue('--surface').trim() || '#f5f3f0';
    ctx.clearRect(0, 0, 720, 480);
    ctx.fillStyle = surface; ctx.fillRect(0, 0, 720, 480);
    ctx.strokeStyle = line; ctx.lineWidth = 1;
    for (let y = 55; y < 450; y += 35) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(720, y); ctx.stroke(); }
    for (let x = 20; x < 720; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 480); ctx.stroke(); }

    // A simple oblique landing pad and marker: intentionally an explanation, not a replay of results.
    const centerX = 395, centerY = 285, skew = Math.sin(a * Math.PI / 180) * 90;
    ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(-.08);
    ctx.beginPath(); ctx.ellipse(0, 0, 170, 62, 0, 0, Math.PI * 2); ctx.fillStyle = '#ffffff60'; ctx.fill(); ctx.strokeStyle = muted; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-115, 0); ctx.lineTo(-72, -22); ctx.lineTo(72, -22); ctx.lineTo(115, 0); ctx.lineTo(72, 22); ctx.lineTo(-72, 22); ctx.closePath(); ctx.strokeStyle = accent; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-72, -22); ctx.lineTo(-72 + skew * .32, -35); ctx.lineTo(72 + skew * .32, -35); ctx.lineTo(72, -22); ctx.strokeStyle = accent; ctx.stroke();
    ctx.restore();
    const markerVisible = Math.max(0, 1 - o / 100);
    ctx.save(); ctx.translate(centerX, centerY - 2);
    ctx.globalAlpha = markerVisible;
    ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.setLineDash([8, 5]);
    ctx.beginPath(); ctx.rect(-62, -31, 124, 62); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = 1; ctx.restore();

    // Camera and field of view move with the viewpoint slider.
    const cameraX = 112 - skew * .18, cameraY = 92 + a * .55;
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(cameraX, cameraY, 9, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = muted; ctx.font = '12px Plex, monospace'; ctx.fillText('camera', cameraX - 25, cameraY - 19);
    ctx.strokeStyle = accent; ctx.globalAlpha = .72; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cameraX + 9, cameraY); ctx.lineTo(centerX - 63, centerY - 35); ctx.lineTo(centerX + 63, centerY + 35); ctx.closePath(); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.strokeStyle = muted; ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo(cameraX, cameraY); ctx.lineTo(centerX, centerY); ctx.stroke(); ctx.setLineDash([]);
    if (o > 0) {
      const coverWidth = 124 * o / 100;
      ctx.fillStyle = '#29292938'; ctx.fillRect(centerX + 62 - coverWidth, centerY - 37, coverWidth, 74);
      ctx.fillStyle = muted; ctx.font = '11px Plex, monospace'; ctx.fillText('occluded', centerX + 67 - coverWidth, centerY + 57);
    }
    ctx.fillStyle = muted; ctx.font = '11px Plex, monospace'; ctx.fillText('FIELD OF VIEW', 45, 430); ctx.fillText('MARKER PLANE', 505, 430);
    let text;
    if (a > 52 || o > 58) text = 'Ambiguous view: independent evidence or abstention becomes valuable.';
    else if (a > 30 || o > 30) text = 'Partial view: the outline is less certain, even though it remains visible.';
    else text = 'Mostly visible: the marker outline is easy to interpret.';
    explanation.textContent = text;
  }
  angle.addEventListener('input', draw);
  occlusion.addEventListener('input', draw);
  reset?.addEventListener('click', () => { angle.value = 18; occlusion.value = 12; draw(); });
  window.addEventListener('resize', draw, { passive: true });
  draw();
})();
