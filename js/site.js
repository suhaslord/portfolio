(() => {
  'use strict';
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  const animate = Boolean(gsap && !reduce.matches);
  if (gsap && ST) gsap.registerPlugin(ST);
  if (animate) root.classList.add('motion-ready');
  else root.classList.remove('page-cover-ready');
  const lenis = animate && fine.matches && window.Lenis ? new window.Lenis({lerp:.14,smoothWheel:true,syncTouch:false,anchors:false,prevent:node=>node.closest?.('[data-lenis-prevent]')}) : null;
  const scrollFrame=t=>lenis?.raf(t*1000);
  if (lenis && gsap) {
    if (ST) lenis.on('scroll',ST.update);
    gsap.ticker.add(scrollFrame);
    gsap.ticker.lagSmoothing(0);
  }

  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.menu-panel');
  const curve = panel?.querySelector('.menu-curve');
  const scrim = document.querySelector('.menu-scrim');
  const background = [...document.querySelectorAll('.site-header,#main,[data-footer-reveal],body>.site-footer')];
  let menuOpen = false, menuTimeline, returnFocus;
  if (animate && panel) gsap.set(panel,{x:0,xPercent:115});
  function closeMenu({instant=false,restoreFocus=true}={}) {
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
      if(restoreFocus) returnFocus?.focus({preventScroll:true});
    };
    menuTimeline?.kill();
    if (animate && !reduce.matches && !instant) {
      menuTimeline = gsap.timeline({onComplete:finish}).to(panel,{xPercent:115,duration:.34,ease:'power2.inOut'},0).to(curve,{scaleX:1,duration:.34,ease:'power2.inOut'},0).to(scrim,{opacity:0,duration:.24},0);
    } else {
      if(animate){gsap.set(panel,{x:0,xPercent:115});gsap.set(scrim,{opacity:0});}
      finish();
    }
  }
  function openMenu(instant=false) {
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
    if (animate && !reduce.matches && !instant) {
      menuTimeline = gsap.timeline({onComplete:()=>panel.querySelector('nav a')?.focus({preventScroll:true})})
        .to(panel,{xPercent:0,duration:.48,ease:'power3.out'},0)
        .fromTo(curve,{scaleX:1},{scaleX:0,duration:.5,ease:'power3.out'},0)
        .fromTo(panel.querySelectorAll('nav a'),{x:38,rotate:2},{x:0,rotate:0,stagger:.025,duration:.4,ease:'power3.out'},.04)
        .to(scrim,{opacity:1,duration:.24},0);
    } else {
      if(animate){gsap.set(panel,{x:0,xPercent:0});gsap.set(curve,{scaleX:0});gsap.set(scrim,{opacity:1});}
      panel.querySelector('nav a')?.focus({preventScroll:true});
    }
  }
  toggle?.addEventListener('click',event=>menuOpen ? closeMenu({instant:event.detail===0}) : openMenu(event.detail===0));
  scrim?.addEventListener('click',()=>closeMenu());
  panel?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu({restoreFocus:false})));
  document.addEventListener('keydown',event=>{
    if (!menuOpen) return;
    if (event.key==='Escape') {closeMenu({instant:true});return;}
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
  let direction=1,scrollSpeed=1,velocity=1,position=0,singleWidth=1,heroVisible=true;
  if (animate && track) {
    const measure=()=>singleWidth=track.firstElementChild.getBoundingClientRect().width;
    measure();new ResizeObserver(measure).observe(track.firstElementChild);
    const setX=gsap.quickSetter(track,'x','px');
    const observeScroll=event=>{if(Math.abs(event.velocity)>.04) direction=event.velocity>0?1:-1;scrollSpeed=1+Math.min(Math.abs(event.velocity)*.06,3);};
    lenis?.on('scroll',observeScroll);
    const visible=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;hero.classList.toggle('is-offscreen',!heroVisible);});visible.observe(hero);
    gsap.ticker.add((_time,delta)=>{
      if (!heroVisible || reduce.matches || document.hidden) return;
      const dt=Math.min(delta,50);
      velocity+=(direction*scrollSpeed-velocity)*(1-Math.exp(-dt/140));
      position=(position+velocity*dt*.055+singleWidth)%singleWidth;
      setX(-position);scrollSpeed+=(1-scrollSpeed)*(1-Math.exp(-dt/240));
    });
  }
  if (animate && ST) {
    if (hero) {
      ST.create({trigger:hero,start:'top top',end:'42% top',onLeave:()=>root.classList.add('has-scrolled'),onEnterBack:()=>root.classList.remove('has-scrolled')});
      gsap.to('.hero-monogram',{yPercent:-65,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.35}});
    }
    if (!hero) ST.create({start:100,onEnter:()=>root.classList.add('has-scrolled'),onLeaveBack:()=>root.classList.remove('has-scrolled')});
    document.querySelectorAll('.reveal').forEach(el=>{
      const text=el.textContent.trim();el.setAttribute('aria-label',text);el.replaceChildren();
      text.split(/\s+/).forEach((word,i)=>{const mask=document.createElement('span');mask.className='word-mask';mask.setAttribute('aria-hidden','true');const span=document.createElement('span');span.textContent=word;mask.append(span);el.append(mask,document.createTextNode(' '));});
      el.classList.add('is-visible');
      gsap.from(el.querySelectorAll('.word-mask span'),{yPercent:105,rotate:2,opacity:0,duration:.5,stagger:.007,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
    });
    if(document.querySelector('.intro-side')) gsap.from('.intro-side',{y:40,opacity:0,duration:.6,ease:'power3.out',scrollTrigger:{trigger:'.introduction',start:'top 85%',once:true}});
    document.querySelectorAll('[data-footer-reveal]').forEach(footer=>{
      gsap.fromTo(footer.querySelector('.contact-curve'),{scaleY:1},{scaleY:0,ease:'none',scrollTrigger:{trigger:footer,start:'top bottom',end:'top 15%',scrub:.55}});
      gsap.from(footer.querySelector('.footer-content'),{y:fine.matches?-240:-70,ease:'none',scrollTrigger:{trigger:footer,start:'top bottom',end:'bottom bottom',scrub:.55}});
      const cta=footer.querySelector('.contact-cta-wrap');
      if(cta)gsap.from(cta,{x:fine.matches?-55:-20,ease:'none',scrollTrigger:{trigger:footer,start:'top bottom',end:'bottom bottom',scrub:.55}});
    });
    document.querySelectorAll('.discipline-grid article,.about-school>div,.about-copy').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    const aboutImage=document.querySelector('.about-image img');
    if(aboutImage)gsap.fromTo(aboutImage,{yPercent:-4,scale:1.1},{yPercent:4,scale:1.1,ease:'none',scrollTrigger:{trigger:aboutImage.parentElement,start:'top bottom',end:'bottom top',scrub:.55}});
    document.fonts?.ready.then(()=>ST.refresh());
  } else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));

  if (animate && fine.matches) {
    document.querySelectorAll('.magnetic').forEach(el=>{
      const text=el.querySelector('.button-label')||el.querySelector('span:not(.brand-mark):not([aria-hidden])');
      el.addEventListener('pointermove',event=>{
        if(reduce.matches||!fine.matches)return;
        const r=el.getBoundingClientRect(),x=event.clientX-r.left-r.width/2,y=event.clientY-r.top-r.height/2;
        const strength=Number(el.dataset.magnet)||.22;
        gsap.to(el,{x:x*strength,y:y*strength,duration:.32,ease:'power3.out',overwrite:'auto'});
        if(text)gsap.to(text,{x:x*.1,y:y*.1,duration:.18,ease:'power3.out',overwrite:'auto'});
      });
      el.addEventListener('pointerleave',()=>{
        gsap.to(el,{x:0,y:0,duration:.65,ease:'elastic.out(1,.45)',overwrite:'auto'});
        if(text)gsap.to(text,{x:0,y:0,duration:.55,ease:'elastic.out(1,.45)',overwrite:'auto'});
      });
    });
    const preview=document.querySelector('.work-preview'),rail=preview?.querySelector('.preview-rail'),badge=document.querySelector('.work-preview-action');
    if(preview&&rail&&badge){
      gsap.set([preview,badge],{xPercent:-50,yPercent:-50,scale:.82,autoAlpha:0});
      const moveX=gsap.quickTo(preview,'x',{duration:.28,ease:'power3.out'}),moveY=gsap.quickTo(preview,'y',{duration:.28,ease:'power3.out'});
      const badgeX=gsap.quickTo(badge,'x',{duration:.14,ease:'power3.out'}),badgeY=gsap.quickTo(badge,'y',{duration:.14,ease:'power3.out'});
      const tilt=gsap.quickTo(preview,'rotation',{duration:.22,ease:'power2.out'});
      let active=null,hideTimer,lastX=0;
      const hide=()=>{if(!active)return;active=null;gsap.to([preview,badge],{scale:.82,autoAlpha:0,duration:.28,ease:'power2.inOut',overwrite:'auto'});gsap.to(preview,{rotation:0,duration:.3});};
      const images=[...rail.querySelectorAll('img[data-src]')];
      const load=img=>{if(img&&!img.getAttribute('src'))img.src=img.dataset.src;};
      const preload=()=>images.forEach(load);
      if('requestIdleCallback' in window)requestIdleCallback(preload,{timeout:1200});else setTimeout(preload,0);
      document.querySelectorAll('.work-row[data-preview]').forEach(row=>{
        const show=event=>{
          if(reduce.matches||!fine.matches||row.closest('.work-browser.is-grid')||Math.abs(lenis?.velocity||0)>1)return;
          clearTimeout(hideTimer);
          const first=!active,index=Number(row.dataset.previewIndex);
          if(first){gsap.set([preview,badge],{x:event.clientX,y:event.clientY});gsap.set(rail,{yPercent:-100*index});}
          lastX=event.clientX;
          active=row;
          preview.classList.add('is-visible');
          if(!first)gsap.to(rail,{yPercent:-100*index,duration:.4,ease:'power3.inOut',overwrite:'auto'});
          const reveal=()=>{if(active!==row)return;gsap.to(preview,{scale:1,autoAlpha:1,duration:.46,ease:'power3.out',overwrite:'auto'});gsap.to(badge,{scale:1,autoAlpha:1,duration:.36,ease:'power3.out',overwrite:'auto'});};
          const img=images[index];load(img);
          if(!img||img.complete&&img.naturalWidth)reveal();else img.decode().then(reveal).catch(hide);
          gsap.to(row.querySelector('h3'),{x:-20,duration:.3,ease:'power3.out'});
          gsap.to(row.querySelector('p'),{x:16,duration:.3,ease:'power3.out'});
        };
        row.addEventListener('pointerenter',()=>clearTimeout(hideTimer));
        row.addEventListener('pointermove',event=>{if(reduce.matches||!fine.matches)return;if(active!==row)show(event);if(active!==row)return;tilt(Math.max(-2,Math.min(2,(event.clientX-lastX)*.06)));lastX=event.clientX;moveX(event.clientX);moveY(event.clientY);badgeX(event.clientX);badgeY(event.clientY);});
        row.addEventListener('pointerleave',()=>{hideTimer=setTimeout(hide,35);gsap.to(row.querySelectorAll('h3,p'),{x:0,duration:.34,ease:'power3.out'});});
        row.addEventListener('click',hide);
      });
      window.addEventListener('blur',hide);
      window.addEventListener('work:change',hide);
      lenis?.on('scroll',event=>{if(Math.abs(event.velocity)>1)hide();});
    }
  }

  const curtain=document.querySelector('.page-transition');
  let navigating=false,entryTimeline;
  if (animate) {
    let internal=false,transitionTitle='';
    try {internal=sessionStorage.getItem('portfolio:transition')==='1';transitionTitle=sessionStorage.getItem('portfolio:transition-title')||'';sessionStorage.removeItem('portfolio:transition');sessionStorage.removeItem('portfolio:transition-title');}catch{}
    const greetingIntro=Boolean(curtain&&hero&&!internal&&!location.hash);
    const pageIntro=Boolean(curtain&&!hero&&!location.hash);
    const label=curtain?.querySelector('.transition-label');
    const curtainCurve=curtain?.querySelector('.transition-curve-bottom');
    entryTimeline=gsap.timeline();
    let revealAt=0;
    if(curtain && (internal || greetingIntro || pageIntro)){
      gsap.set(curtain,{y:0,yPercent:0,visibility:'visible'});
      root.classList.remove('page-cover-ready');
      if(greetingIntro){
        const greetings=[['Hello','en'],['Bonjour','fr'],['Hola','es'],['Ciao','it'],['Olá','pt'],['Hallo','nl'],['नमस्ते','hi'],['నమస్కారం','te'],['こんにちは','ja'],['안녕하세요','ko'],['你好','zh'],['Hello','en']];
        greetings.forEach(([text,lang],i)=>{
          const at=i===0?0:.2+(i-1)*.12;
          entryTimeline.call(()=>{label.textContent=text;label.lang=lang;},null,at)
            .fromTo(label,{y:5,opacity:.45},{y:0,opacity:1,duration:.09,ease:'power2.out',immediateRender:false},at);
        });
        revealAt=1.62;
        const skip=()=>entryTimeline.progress(1);
        const clean=()=>{window.removeEventListener('wheel',skip);document.removeEventListener('pointerdown',skip);document.removeEventListener('keydown',skip);};
        window.addEventListener('wheel',skip,{passive:true});
        document.addEventListener('pointerdown',skip);
        document.addEventListener('keydown',skip);
        entryTimeline.eventCallback('onComplete',clean);
      }else {label.textContent=transitionTitle||document.body.dataset.pageTitle;revealAt=.1;}
      entryTimeline.to(label,{y:-25,opacity:0,duration:.32,ease:'power2.in'},revealAt)
        .to(curtain,{yPercent:-115,duration:.72,ease:'power4.inOut',onComplete:()=>gsap.set(curtain,{visibility:'hidden'})},revealAt)
        .fromTo(curtainCurve,{scaleY:0},{scaleY:1,duration:.72,ease:'power2.inOut',immediateRender:false},revealAt);
    }
    else root.classList.remove('page-cover-ready');
    const contentAt=curtain&&(internal||greetingIntro||pageIntro)?revealAt+.24:0;
    entryTimeline.from('.site-header',{y:-14,opacity:0,duration:.6,ease:'power3.out'},contentAt);
    if(hero){entryTimeline.from('.hero-role,.location',{y:36,opacity:0,duration:.85,stagger:.04,ease:'power3.out'},contentAt).from('.name-marquee',{yPercent:60,duration:1,ease:'power3.out'},contentAt);}
    else {const heading=document.querySelector('.page-hero,.contact-heading,.case-heading');if(heading)entryTimeline.from(heading,{y:45,opacity:0,duration:.85,ease:'power3.out'},contentAt);}
    const firstSection=document.querySelector('.work-browser,.about-intro,.contact-layout');
    if(firstSection)entryTimeline.from(firstSection,{y:40,opacity:0,duration:.85,ease:'power3.out'},contentAt+.08);
    if(!greetingIntro&&(internal||pageIntro)){
      const skip=()=>entryTimeline.progress(1);
      const clean=()=>{window.removeEventListener('wheel',skip);document.removeEventListener('pointerdown',skip);document.removeEventListener('keydown',skip);};
      window.addEventListener('wheel',skip,{passive:true});document.addEventListener('pointerdown',skip);document.addEventListener('keydown',skip);
      entryTimeline.eventCallback('onComplete',clean);
    }
  }
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[href]');
    if(!a||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
    const url=new URL(a.href,location.href);
    if(url.origin!==location.origin)return;
    const normalized=p=>p.replace(/index\.html$/,'');
    if(!url.hash&&normalized(url.pathname)===normalized(location.pathname)){
      event.preventDefault();
      if(lenis&&!reduce.matches)lenis.scrollTo(0,{duration:.65,immediate:event.detail===0,force:true});else window.scrollTo({top:0,behavior:reduce.matches||event.detail===0?'instant':'smooth'});
      return;
    }
    if(url.hash&&normalized(url.pathname)===normalized(location.pathname)){
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;
      event.preventDefault();history.pushState(null,'',url.hash);
      if(lenis&&!reduce.matches)lenis.scrollTo(target,{offset:-70,duration:.72,immediate:event.detail===0,force:true});else target.scrollIntoView({behavior:'instant'});
      return;
    }
    if(!animate||reduce.matches||event.detail===0||!curtain)return;
    if(navigating){event.preventDefault();return;}
    event.preventDefault();navigating=true;lenis?.stop();
    const title=a.dataset.transitionTitle||({'work.html':'Work','about.html':'About','contact.html':'Contact','resume.html':'Résumé','archive.html':'Archive','index.html':'Home'}[url.pathname.split('/').pop()]||a.textContent.trim());
    const label=curtain.querySelector('.transition-label');label.textContent=title;
    gsap.set(label,{y:12,opacity:0});
    gsap.set(curtain,{y:0,yPercent:115,visibility:'visible'});
    gsap.set(curtain.querySelector('.transition-curve-top'),{scaleY:1});
    gsap.timeline({onComplete:()=>{try{sessionStorage.setItem('portfolio:transition','1');sessionStorage.setItem('portfolio:transition-title',title);}catch{}location.href=url.href;}})
      .to(curtain,{yPercent:0,duration:.48,ease:'power3.inOut'},0)
      .to(curtain.querySelector('.transition-curve-top'),{scaleY:0,duration:.48,ease:'power2.out'},0)
      .to(label,{y:0,opacity:1,duration:.23,ease:'power2.out'},.23);
  });
  window.addEventListener('pageshow',event=>{if(event.persisted){navigating=false;root.classList.remove('page-cover-ready');lenis?.start();if(gsap&&curtain)gsap.set(curtain,{y:0,yPercent:-115,visibility:'hidden'});}});
  reduce.addEventListener('change',event=>{
    if(!event.matches||!gsap)return;
    entryTimeline?.progress(1);lenis?.destroy();gsap.ticker.remove(scrollFrame);
    ST?.getAll().forEach(t=>t.kill(true));gsap.killTweensOf('*');root.classList.remove('motion-ready');
    gsap.set('.reveal,.intro-side,.footer-content,.contact-cta-wrap,.hero-role,.location,.name-marquee,.case-heading,.page-hero,.contact-heading,.work-browser,.about-intro,.contact-layout,.discipline-grid article,.about-school>div,.about-copy,.about-image img,.site-header,.magnetic,.word-mask span',{clearProps:'transform,opacity'});
    gsap.set('.page-transition,.work-preview,.work-preview-action',{visibility:'hidden'});
    gsap.set('.menu-panel,.menu-curve,.menu-scrim',{clearProps:'transform,opacity'});
  });
})();
