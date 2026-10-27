(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const animate = Boolean(gsap && !reduce.matches);
  if (gsap && ST) gsap.registerPlugin(ST);
  if (animate) root.classList.add('motion-ready');
  const lenis = animate && window.Lenis ? new window.Lenis({lerp:.085,smoothWheel:true,syncTouch:false,anchors:false,respectReducedMotion:true,prevent:node=>node.closest?.('[data-lenis-prevent]')}) : null;
  if (lenis && gsap) {
    if (ST) lenis.on('scroll',ST.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  }

  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.menu-panel');
  const curve = panel?.querySelector('.menu-curve');
  const scrim = document.querySelector('.menu-scrim');
  const background = [...document.querySelectorAll('.site-header,#main,.contact-section')];
  let menuOpen = false, menuTimeline, returnFocus;
  if (animate && panel) gsap.set(panel,{xPercent:115});
  function closeMenu() {
    if (!panel || !menuOpen) return;
    menuOpen = false;
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
    panel.setAttribute('aria-hidden','true');
    panel.inert = true;
    const finish = () => {
      root.classList.remove('menu-open');
      background.forEach(el=>el.inert=false);
      lenis?.start();
      returnFocus?.focus({preventScroll:true});
    };
    menuTimeline?.kill();
    if (animate && !reduce.matches) {
      menuTimeline = gsap.timeline({onComplete:finish}).to(panel,{xPercent:115,duration:.75,ease:'power4.inOut'},0).to(curve,{scaleX:1,duration:.75,ease:'power4.inOut'},0).to(scrim,{opacity:0,duration:.55},.1);
    } else finish();
  }
  function openMenu() {
    if (!panel) return;
    returnFocus = document.activeElement;
    menuOpen = true;
    root.classList.add('menu-open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Close navigation');
    panel.setAttribute('aria-hidden','false');
    panel.inert = false;
    background.forEach(el=>el.inert=true);
    lenis?.stop();
    menuTimeline?.kill();
    if (animate && !reduce.matches) {
      menuTimeline = gsap.timeline({onComplete:()=>panel.querySelector('nav a')?.focus({preventScroll:true})})
        .to(panel,{xPercent:0,duration:.85,ease:'power4.inOut'},0)
        .fromTo(curve,{scaleX:1},{scaleX:0,duration:.9,ease:'power4.inOut'},0)
        .fromTo(panel.querySelectorAll('nav a'),{x:80,rotate:4},{x:0,rotate:0,stagger:.045,duration:.9,ease:'power4.out'},.17)
        .to(scrim,{opacity:1,duration:.5},0);
    } else panel.querySelector('nav a')?.focus({preventScroll:true});
  }
  toggle?.addEventListener('click',()=>menuOpen ? closeMenu() : openMenu());
  scrim?.addEventListener('click',closeMenu);
  panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{
    if (!menuOpen) return;
    if (event.key==='Escape') {closeMenu();return;}
    if (event.key!=='Tab') return;
    const links=[...panel.querySelectorAll('a')],first=links[0],last=links.at(-1);
    if (event.shiftKey && document.activeElement===first) {event.preventDefault();toggle.focus();}
    else if (event.shiftKey && document.activeElement===toggle) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement===last) {event.preventDefault();toggle.focus();}
    else if (!event.shiftKey && document.activeElement===toggle) {event.preventDefault();first.focus();}
  });
  document.querySelector('.print-button')?.addEventListener('click',()=>window.print());

  // One clock controls scrolling, name movement and scroll-linked sections.
  const hero=document.querySelector('.hero');
  const track=document.querySelector('.name-track');
  let direction=1,scrollSpeed=1,position=0,singleWidth=1,heroVisible=true;
  if (animate && track) {
    const measure=()=>singleWidth=track.firstElementChild.getBoundingClientRect().width;
    measure();new ResizeObserver(measure).observe(track.firstElementChild);
    const setX=gsap.quickSetter(track,'x','px');
    const observeScroll=event=>{if(Math.abs(event.velocity)>.04) direction=event.velocity>0?1:-1;scrollSpeed=1+Math.min(Math.abs(event.velocity)*.06,3);};
    lenis?.on('scroll',observeScroll);
    const visible=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;});visible.observe(hero);
    gsap.ticker.add((_time,delta)=>{
      if (!heroVisible || reduce.matches || document.hidden) return;
      position=(position+direction*Math.min(delta,50)*.055*scrollSpeed+singleWidth)%singleWidth;
      setX(-position);scrollSpeed+=(1-scrollSpeed)*.035;
    });
  }
  if (animate && ST) {
    if (hero) {
      ST.create({trigger:hero,start:'top top',end:'42% top',onLeave:()=>root.classList.add('has-scrolled'),onEnterBack:()=>root.classList.remove('has-scrolled')});
      gsap.to('.hero-monogram',{yPercent:-15,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
    }
    if (!hero) ST.create({start:100,onEnter:()=>root.classList.add('has-scrolled'),onLeaveBack:()=>root.classList.remove('has-scrolled')});
    document.querySelectorAll('.reveal').forEach(el=>{
      const text=el.textContent.trim();el.setAttribute('aria-label',text);el.replaceChildren();
      text.split(/\s+/).forEach((word,i)=>{const mask=document.createElement('span');mask.className='word-mask';mask.setAttribute('aria-hidden','true');const span=document.createElement('span');span.textContent=word;mask.append(span);el.append(mask,document.createTextNode(' '));});
      el.classList.add('is-visible');
      gsap.from(el.querySelectorAll('.word-mask span'),{yPercent:110,rotate:3,opacity:0,duration:.75,stagger:.012,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
    });
    gsap.from('.intro-side',{y:70,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.introduction',start:'top 75%',once:true}});
    const footer=document.querySelector('.contact-section');
    if(footer){
      gsap.fromTo('.contact-curve',{scaleY:1},{scaleY:0,ease:'none',scrollTrigger:{trigger:footer,start:'top bottom',end:'top 30%',scrub:1}});
      gsap.from('.contact-inner',{y:85,ease:'none',scrollTrigger:{trigger:footer,start:'top bottom',end:'top 30%',scrub:1}});
    }
    document.fonts?.ready.then(()=>ST.refresh());
  } else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));

  if (animate && fine.matches) {
    document.querySelectorAll('.magnetic').forEach(el=>{
      const text=el.querySelector('span:not(.brand-mark)');
      el.addEventListener('pointermove',event=>{
        if(reduce.matches)return;
        const r=el.getBoundingClientRect(),x=event.clientX-r.left-r.width/2,y=event.clientY-r.top-r.height/2;
        gsap.to(el,{x:x*.22,y:y*.22,duration:.7,ease:'power3.out',overwrite:'auto'});
        if(text)gsap.to(text,{x:x*.1,y:y*.1,duration:.7,ease:'power3.out',overwrite:'auto'});
      });
      el.addEventListener('pointerleave',()=>{
        gsap.to(el,{x:0,y:0,duration:1.25,ease:'elastic.out(1,.3)',overwrite:'auto'});
        if(text)gsap.to(text,{x:0,y:0,duration:1.25,ease:'elastic.out(1,.3)',overwrite:'auto'});
      });
    });
    const preview=document.querySelector('.work-preview'),rail=preview?.querySelector('.preview-rail'),badge=document.querySelector('.work-preview-action');
    if(preview&&rail&&badge){
      gsap.set([preview,badge],{xPercent:-50,yPercent:-50,scale:0});
      const moveX=gsap.quickTo(preview,'x',{duration:.75,ease:'power3.out'}),moveY=gsap.quickTo(preview,'y',{duration:.75,ease:'power3.out'});
      const badgeX=gsap.quickTo(badge,'x',{duration:.4,ease:'power3.out'}),badgeY=gsap.quickTo(badge,'y',{duration:.4,ease:'power3.out'});
      let active=null,hideTimer;
      const hide=()=>{active=null;gsap.to([preview,badge],{scale:0,duration:.4,ease:'power3.inOut',overwrite:'auto'});};
      document.querySelectorAll('.work-row[data-preview]').forEach(row=>{
        row.addEventListener('pointerenter',event=>{
          if(reduce.matches)return;clearTimeout(hideTimer);
          if(!active)gsap.set([preview,badge],{x:event.clientX,y:event.clientY});
          active=row;
          preview.classList.add('is-visible');
          gsap.to(rail,{yPercent:-100*Number(row.dataset.previewIndex),duration:.55,ease:'power3.inOut',overwrite:'auto'});
          gsap.to([preview,badge],{scale:1,duration:.5,ease:'power3.out',overwrite:'auto'});
          gsap.to(row.querySelector('h3'),{x:-24,duration:.65,ease:'power4.out'});
          gsap.to(row.querySelector('p'),{x:20,duration:.65,ease:'power4.out'});
        });
        row.addEventListener('pointermove',event=>{if(reduce.matches)return;moveX(event.clientX);moveY(event.clientY);badgeX(event.clientX);badgeY(event.clientY);});
        row.addEventListener('pointerleave',()=>{hideTimer=setTimeout(hide,70);gsap.to(row.querySelectorAll('h3,p'),{x:0,duration:.7,ease:'power4.out'});});
        row.addEventListener('click',hide);
      });
      window.addEventListener('blur',hide);
    }
  }

  const curtain=document.querySelector('.page-transition');
  let navigating=false;
  if (animate) {
    let internal=false,seen=false;
    try {internal=sessionStorage.getItem('portfolio:transition')==='1';seen=sessionStorage.getItem('portfolio:seen')==='1';sessionStorage.removeItem('portfolio:transition');sessionStorage.setItem('portfolio:seen','1');}catch{}
    if(curtain && (internal || (hero&&!seen&&!location.hash))){
      gsap.set(curtain,{yPercent:0,visibility:'visible'});
      if(internal)curtain.querySelector('span').textContent='';
      gsap.to(curtain,{yPercent:-115,duration:.95,delay:internal ? 0.1 : 0.35,ease:'power4.inOut',onComplete:()=>gsap.set(curtain,{visibility:'hidden'})});
    }
    gsap.from('.site-header',{y:-20,opacity:0,duration:1,ease:'power3.out',delay:.25});
    if(hero){gsap.from('.hero-role,.location',{y:45,opacity:0,duration:1.1,stagger:.08,ease:'power4.out',delay:.45});gsap.from('.name-marquee',{yPercent:85,duration:1.2,ease:'power4.out',delay:.35});}
    else gsap.from('.case-heading',{y:50,opacity:0,duration:1,ease:'power3.out',delay:.15});
  }
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href]');
    if(!a||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
    const url=new URL(a.href,location.href);
    if(url.origin!==location.origin)return;
    const normalized=p=>p.replace(/index\.html$/,'');
    if(url.hash&&normalized(url.pathname)===normalized(location.pathname)){
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;
      event.preventDefault();history.pushState(null,'',url.hash);
      if(lenis&&!reduce.matches)lenis.scrollTo(target,{offset:-70,duration:1.25,force:true});else target.scrollIntoView();
      return;
    }
    if(!animate||reduce.matches||!curtain||navigating)return;
    event.preventDefault();navigating=true;lenis?.stop();
    curtain.querySelector('span').textContent='';
    gsap.set(curtain,{yPercent:115,visibility:'visible'});
    gsap.to(curtain,{yPercent:0,duration:.65,ease:'power4.inOut',onComplete:()=>{try{sessionStorage.setItem('portfolio:transition','1');}catch{}location.href=url.href;}});
  });
  window.addEventListener('pageshow',event=>{if(event.persisted){navigating=false;lenis?.start();if(gsap&&curtain)gsap.set(curtain,{yPercent:-115,visibility:'hidden'});}});
  reduce.addEventListener('change',event=>{
    if(!event.matches||!gsap)return;
    ST?.getAll().forEach(t=>t.kill(true));gsap.killTweensOf('*');root.classList.remove('motion-ready');
    gsap.set('.reveal,.intro-side,.contact-inner,.hero-role,.location,.name-marquee,.case-heading,.site-header,.magnetic,.word-mask span',{clearProps:'transform,opacity'});
    gsap.set('.page-transition,.work-preview,.work-preview-action',{visibility:'hidden'});
  });
})();
