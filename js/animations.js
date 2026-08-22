(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reduced) {
    document.querySelectorAll('.reveal, .animate-fade-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.fromTo('.hero h1',
    { 
      opacity: 0, 
      y: 50,
      scale: 0.95 
    },
    { 
      opacity: 1, 
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2
    }
  );

  gsap.fromTo('.hero .lede',
    { 
      opacity: 0, 
      y: 30 
    },
    { 
      opacity: 1, 
      y: 0,
      duration: 1,
      ease: 'power2.out',
      delay: 0.5
    }
  );

  gsap.fromTo('.hero .cta-row',
    { 
      opacity: 0, 
      y: 20 
    },
    { 
      opacity: 1, 
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.8
    }
  );

  gsap.utils.toArray('.btn').forEach((btn, i) => {
    gsap.fromTo(btn,
      { 
        opacity: 0, 
        scale: 0.9 
      },
      { 
        opacity: 1, 
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 1 + (i * 0.1)
      }
    );
  });

  gsap.utils.toArray('.reveal').forEach((element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        y: 50,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'top 20%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  gsap.utils.toArray('.achievement-card').forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 60,
        rotateX: -15
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 20%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.1
      }
    );

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.03,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  gsap.utils.toArray('.cover').forEach((cover) => {
    const img = cover.querySelector('img');
    
    if (img) {
      gsap.fromTo(img,
        {
          scale: 1.2
        },
        {
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cover,
            start: 'top 90%',
            end: 'top 20%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    cover.addEventListener('mouseenter', () => {
      if (img) {
        gsap.to(img, {
          scale: 1.08,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    cover.addEventListener('mouseleave', () => {
      if (img) {
        gsap.to(img, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  });

  gsap.utils.toArray('.tele-cell').forEach((cell, i) => {
    gsap.fromTo(cell,
      {
        opacity: 0,
        x: -30
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.telemetry',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.1
      }
    );
  });

  gsap.utils.toArray('.exp-row').forEach((row, i) => {
    gsap.fromTo(row,
      {
        opacity: 0,
        x: -50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.08
      }
    );
  });

  const heroMedia = document.querySelector('.hero-media img');
  if (heroMedia) {
    gsap.fromTo(heroMedia,
      {
        y: 100,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.hero-media',
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );

    ScrollTrigger.create({
      trigger: '.hero-media',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.to(heroMedia, {
          y: progress * -50,
          duration: 0.1
        });
      }
    });
  }

  gsap.utils.toArray('.chip').forEach((chip, i) => {
    gsap.fromTo(chip,
      {
        opacity: 0,
        scale: 0,
        rotation: -180
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.chips',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        delay: i * 0.05
      }
    );
  });

  const contact = document.querySelector('.contact');
  if (contact) {
    gsap.fromTo(contact,
      {
        opacity: 0,
        y: 80
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contact,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: target,
            offsetY: 80
          },
          ease: 'power3.inOut'
        });
      }
    });
  });

  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { 
      className: 'is-scrolled', 
      targets: '.site-nav' 
    }
  });

  console.log('GSAP animations initialized');
})();
