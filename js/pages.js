(() => {
  'use strict';
  const gsap = window.gsap;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
  const mobile = matchMedia('(max-width: 767px)');
  const canMove = () => Boolean(gsap && !reduce.matches);

  // Fills travel through the button, with their text on a separate magnetic layer.
  if (gsap) document.querySelectorAll('.liquid').forEach(button => {
    const fill = button.querySelector('.button-fill');
    if (!fill) return;
    let exit;
    gsap.set(fill, {yPercent:110});
    button.addEventListener('pointerenter', () => {
      if (!canMove() || !desktop.matches) return;
      exit?.kill();
      gsap.to(fill, {yPercent:0, duration:.5, ease:'power3.out', overwrite:'auto'});
    });
    button.addEventListener('pointerleave', () => {
      if (!canMove() || !desktop.matches) return;
      exit = gsap.to(fill, {yPercent:-110, duration:.45, ease:'power3.inOut', overwrite:'auto', onComplete:() => gsap.set(fill, {yPercent:110})});
    });
    button.addEventListener('focus', () => {
      if (button.matches(':focus-visible')) {exit?.kill();gsap.set(fill, {yPercent:0});}
    });
    button.addEventListener('blur', () => gsap.set(fill, {yPercent:110}));
  });

  const browser = document.querySelector('.work-browser:not(.archive-browser)');
  if (browser) {
    const collection = browser.querySelector('.project-collection');
    const items = [...collection.querySelectorAll('.work-item')];
    const filters = [...document.querySelectorAll('[data-work-filter]')];
    const views = [...document.querySelectorAll('[data-work-view]')];
    const status = browser.querySelector('[data-work-status]');
    let filter = 'all', view = 'list', change;
    try {view = sessionStorage.getItem('portfolio:work-view') || 'list';} catch {}

    const commit = () => {
      browser.classList.toggle('is-grid', mobile.matches || view === 'grid');
      let count = 0;
      items.forEach(item => {
        item.hidden = filter !== 'all' && !item.dataset.groups.split(' ').includes(filter);
        if (!item.hidden) count++;
      });
      status.textContent = `${count} ${filter === 'all' ? '' : filter + ' '}projects`;
      views.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.workView === (mobile.matches ? 'grid' : view))));
      window.ScrollTrigger?.refresh();
    };
    const update = (motion = true) => {
      window.dispatchEvent(new Event('work:change'));
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.workFilter === filter)));
      change?.kill();
      if (!canMove() || !motion) {if(gsap)gsap.set([collection,...items],{clearProps:'transform,opacity'});commit();return;}
      gsap.killTweensOf(items);
      gsap.set(items, {clearProps:'transform,opacity'});
      change = gsap.to(collection, {opacity:0, y:12, duration:.16, ease:'power2.in', overwrite:'auto', onComplete:() => {
        commit();
        gsap.set(collection, {opacity:1, y:0});
        gsap.fromTo(items.filter(item => !item.hidden), {opacity:0, y:28}, {opacity:1, y:0, duration:.55, stagger:.035, ease:'power3.out', clearProps:'transform,opacity'});
      }});
    };
    filters.forEach(button => button.addEventListener('click', event => {filter = button.dataset.workFilter;update(event.detail !== 0);}));
    views.forEach(button => button.addEventListener('click', event => {
      view = button.dataset.workView;
      try {sessionStorage.setItem('portfolio:work-view', view);} catch {}
      update(event.detail !== 0);
    }));
    mobile.addEventListener('change', () => update(false));
    reduce.addEventListener('change', () => {
      change?.kill();commit();
      if(gsap){gsap.killTweensOf(items);gsap.set([collection,...items], {clearProps:'transform,opacity'});}
    });
    commit();
  }

  const badge = document.querySelector('.cursor-badge');
  if (badge && gsap) {
    gsap.set(badge, {xPercent:-50, yPercent:-50, scale:.82, autoAlpha:0});
    const x = gsap.quickTo(badge, 'x', {duration:.22, ease:'power3.out'});
    const y = gsap.quickTo(badge, 'y', {duration:.22, ease:'power3.out'});
    let active;
    const hide = () => {active=null;gsap.to(badge, {scale:.82, autoAlpha:0, duration:.25, overwrite:'auto'});};
    document.querySelectorAll('[data-cursor-only]').forEach(link => {
      link.addEventListener('pointermove', event => {
        if (!canMove() || !desktop.matches) return;
        if (active !== link) {
          active = link;badge.textContent = link.dataset.cursorOnly;
          gsap.set(badge, {x:event.clientX, y:event.clientY});
          gsap.to(badge, {scale:1, autoAlpha:1, duration:.4, ease:'power3.out', overwrite:'auto'});
        }
        x(event.clientX);y(event.clientY);
      });
      link.addEventListener('pointerleave', hide);
      link.addEventListener('click', hide);
    });
    window.addEventListener('blur', hide);
    window.addEventListener('scroll', hide, {passive:true});
  }

  // California is the portfolio owner's local time, independent of visitor location.
  const clocks = [...document.querySelectorAll('[data-local-time]')];
  const clockFormat = new Intl.DateTimeFormat('en-US', {timeZone:'America/Los_Angeles',hour:'2-digit',minute:'2-digit',hour12:true,timeZoneName:'short'});
  const tick = () => {if(document.hidden)return;const now=new Date();clocks.forEach(clock=>{clock.textContent=clockFormat.format(now);clock.dateTime=now.toISOString();});};
  if(clocks.length){tick();setInterval(tick,30000);document.addEventListener('visibilitychange',tick);}

  const globes = document.querySelectorAll('.location-orb,.about-orb');
  const globeVisibility = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-offscreen',!entry.isIntersecting)));
  globes.forEach(globe => globeVisibility.observe(globe));

  const form = document.querySelector('[data-contact-form]');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(form);
    const value = key => String(fields.get(key)||'').trim();
    const subject = value('topic') || 'Portfolio inquiry';
    const body = `${value('message')}\n\nFrom: ${value('name')}\nEmail: ${value('email')}${value('organization') ? '\nOrganization: '+value('organization') : ''}`;
    const href = `mailto:suhas.aug20@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const draft = document.querySelector('[data-contact-draft]');
    draft.href = href;draft.hidden = false;
    document.querySelector('[data-contact-status]').textContent = 'Your email draft is ready.';
    window.location.href = href;
  });
})();
