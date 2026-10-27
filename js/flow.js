/* Content follows one reading rhythm. Scroll stays native; the media follows the reader. */
'use strict';
window.mountPortfolioFlow = ({scope, gsap, ST, reduce, on, cleanup}) => {
  if (!gsap || !ST) return;
  const $ = selector => scope.querySelector(selector);
  const $$ = selector => [...scope.querySelectorAll(selector)];
  const moving = !reduce.matches;

  if (moving) {
    $$('[data-flow-heading]').forEach(heading => {
      gsap.from(heading.querySelectorAll('.flow-line>span'), {
        yPercent:105, duration:.85, stagger:.055, ease:'power3.out', clearProps:'transform',
        scrollTrigger:{trigger:heading, start:'top 95%', once:true},
      });
    });
    $$('.recognition-note,.discipline-grid article,.about-copy,.education-section>*,.section-heading:not([data-flow-heading]),.case-lead,[data-flow-item]').forEach(item => {
      // The note owns its paragraph's entrance; nested groups must not move twice.
      if (item.matches('[data-flow-item]') && item.closest('.recognition-note')) return;
      gsap.from(item, {
        y:26, opacity:0, duration:.7, ease:'power3.out', clearProps:'transform,opacity',
        scrollTrigger:{trigger:item, start:'top 96%', once:true},
      });
    });
    $$('.achievement').forEach(item => {
      const timeline = gsap.timeline({scrollTrigger:{trigger:item, start:'top 95%', once:true}});
      timeline.from(item.querySelector('.achievement-value>span'), {yPercent:105,duration:.8,ease:'power3.out',clearProps:'transform'},0)
        .from(item.querySelectorAll('h3,p'), {y:16,opacity:0,duration:.65,stagger:.035,ease:'power3.out',clearProps:'transform,opacity'},.1);
    });
    $$('.experience-row,[data-flow-group]').forEach(group => {
      gsap.from(group.children, {
        y:24, opacity:0, duration:.7, stagger:.035, ease:'power3.out', clearProps:'transform,opacity',
        scrollTrigger:{trigger:group, start:'top 96%', once:true},
      });
    });
    $$('.case-image').forEach(image => {
      gsap.from(image, {
        y:32, duration:.8, ease:'power3.out', clearProps:'transform',
        scrollTrigger:{trigger:image, start:'top 98%', once:true},
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
          scrollTrigger:{trigger:tile, start:'top 98%', once:true},
        });
      });
    }
  }

  const section = $('.featured-work');
  if (!section) return;
  const rows = [...section.querySelectorAll('.feature-row')];
  const panels = [...section.querySelectorAll('.feature-panel')];
  const images = panels.map(panel => panel.querySelector('img'));
  const load = image => {if (image?.dataset.src && !image.getAttribute('src')) image.src = image.dataset.src;};
  const preload = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    images.forEach(load);preload.disconnect();
  }, {rootMargin:'900px 0px'});
  preload.observe(section);cleanup(() => preload.disconnect());

  const media = gsap.matchMedia();
  media.add('(min-width: 960px)', () => {
    const controller = new AbortController();
    const listen = (element, event, callback) => element.addEventListener(event, callback, {signal:controller.signal});
    const count = section.querySelector('[data-feature-count]');
    const caption = section.querySelector('.feature-stage-label');
    let active = 0, requested = 0, hovered = null, focused = null, transition, destroyed = false;
    gsap.set(panels, {autoAlpha:0,y:0});gsap.set(panels[0], {autoAlpha:1});
    count.textContent='01';caption.textContent=rows[0].dataset.featureLabel;section.dataset.activeFeature='0';
    const show = (index, instant = false) => {
      requested = index;
      rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
      const reveal = () => {
        if (destroyed || requested !== index) return;
        const previous = active;
        active = index;
        count.textContent = String(index + 1).padStart(2,'0');
        caption.textContent = rows[index].dataset.featureLabel;
        section.dataset.activeFeature = String(index);
        panels.forEach((panel, i) => panel.classList.toggle('is-active', i === index));
        if (previous === index) return;
        transition?.kill();
        gsap.set(panels.filter((_, i) => i !== previous && i !== index), {autoAlpha:0,y:0});
        if (!moving || instant) {
          gsap.set(panels, {autoAlpha:0,y:0});gsap.set(panels[index], {autoAlpha:1});return;
        }
        transition = gsap.timeline()
          .to(panels[previous], {autoAlpha:0,y:-18,duration:.3,ease:'power2.out'},0)
          .fromTo(panels[index], {autoAlpha:0,y:18}, {autoAlpha:1,y:0,duration:.45,ease:'power3.out'},0);
      };
      load(images[index]);
      if (images[index].complete && images[index].naturalWidth) reveal();
      else images[index].decode().then(reveal).catch(() => {});
    };
    const followReading = () => {
      if (hovered !== null || focused !== null) return;
      const center = window.innerHeight * .5;
      let nearest = 0, distance = Infinity;
      rows.forEach((row, i) => {
        const rect = row.getBoundingClientRect();
        const next = Math.abs(rect.top + rect.height * .5 - center);
        if (next < distance) {nearest = i;distance = next;}
      });
      if (requested !== nearest) show(nearest);
    };
    rows.forEach((row, i) => {
      listen(row,'pointerenter', event => {if(event.pointerType === 'touch')return;hovered=i;show(i);});
      listen(row,'pointerleave', () => {hovered=null;if(focused===null)followReading();});
      listen(row,'focusin', () => {focused=i;show(i,true);});
      listen(row,'focusout', () => {
        queueMicrotask(() => {
          if (destroyed || rows.some(row => row.contains(document.activeElement))) return;
          focused=null;followReading();
        });
      });
    });
    // Scrolling hands control back to the reading position without hiding the result.
    listen(window,'wheel', () => {hovered=null;focused=null;});
    ST.create({trigger:section,start:'top center',end:'bottom center',onUpdate:followReading,onRefresh:followReading});
    if (moving) gsap.from(section.querySelector('.feature-display'), {
      y:36,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'top 30%',scrub:true},
    });
    followReading();
    return () => {
      destroyed=true;controller.abort();transition?.kill();
      rows.forEach((row, i) => row.classList.toggle('is-active', i===0));
      panels.forEach((panel, i) => panel.classList.toggle('is-active', i===0));
    };
  });
  cleanup(() => media.revert());
};
