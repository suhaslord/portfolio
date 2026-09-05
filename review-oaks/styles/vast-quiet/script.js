// Vast quiet cinematic - minimal interactions
(function() {
  'use strict';

  // Nav state
  const nav = document.getElementById('siteNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 100) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }
})();
