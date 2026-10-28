/* Interior-page content motion; the homepage keeps its original reference layout. */
'use strict';
window.mountPortfolioFlow = ({scope, gsap, ST, reduce, on, cleanup}) => {
  if (!gsap || !ST || scope.dataset.barbaNamespace === 'home') return;
  const $ = selector => scope.querySelector(selector);
  const $$ = selector => [...scope.querySelectorAll(selector)];
  const moving = !reduce.matches;

  if (moving) {
    $$('[data-flow-heading]').forEach(heading => {
      gsap.from(heading.querySelectorAll('.flow-line>span'), {
        yPercent:105, duration:.85, stagger:.055, ease:'power3.out', clearProps:'transform',
        scrollTrigger:{trigger:heading, start:'top 95%', toggleActions:'play none none none'},
      });
    });
    $$('.recognition-note,.discipline-grid article,.about-copy,.education-section>*,.section-heading:not([data-flow-heading]),.case-lead,[data-flow-item]').forEach(item => {
      // The note owns its paragraph's entrance; nested groups must not move twice.
      if (item.matches('[data-flow-item]') && item.closest('.recognition-note')) return;
      gsap.from(item, {
        y:26, opacity:0, duration:.7, ease:'power3.out', clearProps:'transform,opacity',
        scrollTrigger:{trigger:item, start:'top 96%', toggleActions:'play none none none'},
      });
    });
    $$('.achievement').forEach(item => {
      const timeline = gsap.timeline({scrollTrigger:{trigger:item, start:'top 95%', toggleActions:'play none none none'}});
      timeline.from(item.querySelector('.achievement-value>span'), {yPercent:105,duration:.8,ease:'power3.out',clearProps:'transform'},0)
        .from(item.querySelectorAll('h3,p'), {y:16,opacity:0,duration:.65,stagger:.035,ease:'power3.out',clearProps:'transform,opacity'},.1);
    });
    $$('.experience-row,[data-flow-group]').forEach(group => {
      gsap.from(group.children, {
        y:24, opacity:0, duration:.7, stagger:.035, ease:'power3.out', clearProps:'transform,opacity',
        scrollTrigger:{trigger:group, start:'top 96%', toggleActions:'play none none none'},
      });
    });
    $$('.case-image').forEach(image => {
      gsap.from(image, {
        y:32, duration:.8, ease:'power3.out', clearProps:'transform',
        scrollTrigger:{trigger:image, start:'top 98%', toggleActions:'play none none none'},
      });
    });
    const gallery = $('.evidence-gallery');
    if (gallery) {
      const galleryMedia = gsap.matchMedia();
      galleryMedia.add('(min-width: 768px)', () => {
        $$('.evidence-track').forEach((track, index) => {
          gsap.fromTo(track, {x:index % 2 ? '2vw' : '-2vw'}, {
            x:index % 2 ? '-2vw' : '2vw', ease:'none',
            scrollTrigger:{trigger:gallery, start:'top bottom', end:'bottom top', scrub:true},
          });
        });
      });
      cleanup(() => galleryMedia.revert());
      $$('.evidence-tile').forEach(tile => {
        gsap.from(tile, {
          y:32, opacity:0, duration:.8, ease:'power3.out', clearProps:'transform,opacity',
          scrollTrigger:{trigger:tile, start:'top 98%', toggleActions:'play none none none'},
        });
      });
    }
  }

};
