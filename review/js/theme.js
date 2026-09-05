/* Apply a stored preference before paint; storage may be unavailable. */
(() => {
  document.documentElement.classList.add('js');
  try {
    const saved = localStorage.getItem('suhas-theme');
    if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
  } catch (_) { /* System theme remains usable without storage. */ }
})();
