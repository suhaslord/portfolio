// Print-tech / Paper ledger style - minimal interactions
(function() {
  'use strict';

  // Smooth scroll behavior is handled by CSS scroll-behavior: smooth
  
  // Nav scroll state
  const nav = document.getElementById('siteNav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }
})();
