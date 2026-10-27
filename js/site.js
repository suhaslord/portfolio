(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.menu-panel');
  const scrim = document.querySelector('.menu-scrim');
  let returnFocus = null;
  function closeMenu() {
    root.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
    panel?.setAttribute('aria-hidden', 'true');
    if (panel) panel.inert = true;
    returnFocus?.focus();
  }
  function openMenu() {
    returnFocus = document.activeElement;
    root.classList.add('menu-open');
    toggle?.setAttribute('aria-expanded', 'true');
    toggle?.setAttribute('aria-label', 'Close navigation');
    panel?.setAttribute('aria-hidden', 'false');
    if (panel) panel.inert = false;
    panel?.querySelector('a')?.focus();
  }
  toggle?.addEventListener('click', () => root.classList.contains('menu-open') ? closeMenu() : openMenu());
  scrim?.addEventListener('click', closeMenu);
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (!root.classList.contains('menu-open')) return;
    if (event.key === 'Escape') { closeMenu(); return; }
    if (event.key !== 'Tab') return;
    const links = [...panel.querySelectorAll('a')];
    const first = links[0], last = links[links.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); toggle.focus(); }
    else if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
    else if (!event.shiftKey && document.activeElement === toggle) { event.preventDefault(); first.focus(); }
  });
  document.querySelector('.print-button')?.addEventListener('click', () => window.print());

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .15 });
    reveal.forEach(el => observer.observe(el));
  } else reveal.forEach(el => el.classList.add('is-visible'));

  if (!reduce.matches && fine.matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', event => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * .18;
        const y = (event.clientY - rect.top - rect.height / 2) * .18;
        el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    const preview = document.querySelector('.work-preview');
    const image = preview?.querySelector('img');
    document.querySelectorAll('.work-row[data-preview]').forEach(row => {
      row.addEventListener('pointerenter', () => {
        image.src = row.dataset.preview;
        image.alt = row.dataset.alt || '';
        preview.classList.toggle('is-logo', row.dataset.logo === 'true');
        preview.classList.add('is-visible');
      });
      row.addEventListener('pointermove', event => {
        const x = Math.max(8, Math.min(event.clientX - 165, window.innerWidth - 338));
        const y = Math.max(8, Math.min(event.clientY - 122, window.innerHeight - 253));
        preview.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      row.addEventListener('pointerleave', () => preview.classList.remove('is-visible'));
      row.addEventListener('click', () => preview.classList.remove('is-visible'));
    });
    window.addEventListener('blur', () => preview?.classList.remove('is-visible'));
  }
})();
