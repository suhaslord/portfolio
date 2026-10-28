(() => {
  'use strict';
  const root=document.documentElement, gsap=window.gsap, ST=window.ScrollTrigger;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
  const curtain=document.querySelector('.page-transition'), label=curtain?.querySelector('.transition-label');
  const topCurve=curtain?.querySelector('.transition-curve-top'), bottomCurve=curtain?.querySelector('.transition-curve-bottom');
  const canMove=()=>Boolean(gsap&&!reduce.matches);
  let lenis,page,entering,requestedURL,transitionURL,changing=false,keyboardRoute=false;
  if(curtain)curtain.dataset.navigationCount='0';
  if(gsap&&ST)gsap.registerPlugin(ST);
  if('scrollRestoration' in history)history.scrollRestoration='manual';

  // One scroll engine and one curtain survive every page change.
  function configureScroll(){
    lenis?.destroy();
    lenis=canMove()&&fine.matches&&window.Lenis?new window.Lenis({lerp:.095,smoothWheel:true,syncTouch:false,anchors:false,prevent:node=>Boolean(node.closest?.('[data-lenis-prevent]'))}):null;
    lenis?.on('scroll',()=>ST?.update());
    root.classList.toggle('motion-ready',canMove());
  }
  configureScroll();
  if(gsap){gsap.ticker.add(t=>lenis?.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  function moveScroll(target=0,immediate=true){
    if(lenis)lenis.scrollTo(target,{immediate,force:true,offset:0,duration:1});
    else if(typeof target==='number')window.scrollTo({top:target,behavior:immediate?'instant':'smooth'});
    else target.scrollIntoView({behavior:immediate?'instant':'smooth'});
  }

  function mount(scope){
    const controller=new AbortController(),disposers=[];
    const $=s=>scope.querySelector(s), $$=s=>[...scope.querySelectorAll(s)];
    const on=(target,event,fn,options={})=>target?.addEventListener(event,fn,{...options,signal:controller.signal});
    const cleanup=fn=>disposers.push(fn);
    let closeMenu=()=>{};
    const setup=()=>{
      const toggle=$('.menu-toggle'),panel=$('.menu-panel'),scrim=$('.menu-scrim'),curve=$('.menu-curve');
      const background=$$('.site-header,#main,[data-footer-reveal],.site-footer');
      let menuOpen=false,menuMotion,returnFocus;
      const menuLinks=panel?.querySelectorAll('nav a');
      if(panel&&canMove()){
        gsap.set(panel,{x:0,xPercent:115});
        gsap.set(curve,{scaleX:1});gsap.set(menuLinks,{x:75,rotate:4});
      }
      closeMenu=({instant=false,restoreFocus=true}={})=>{
        if(!menuOpen)return;
        menuOpen=false;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');
        panel.setAttribute('aria-hidden','true');panel.inert=true;menuMotion?.kill();
        const finish=()=>{root.classList.remove('menu-open');background.forEach(el=>el.inert=false);if(gsap){gsap.set(curve,{scaleX:1});gsap.set(menuLinks,{x:75,rotate:4});}lenis?.start();if(restoreFocus)returnFocus?.focus({preventScroll:true});};
        if(!canMove()||instant){if(gsap){gsap.set(panel,{x:0,xPercent:115});gsap.set(scrim,{opacity:0});}finish();}
        else menuMotion=gsap.timeline({onComplete:finish}).to(panel,{xPercent:115,duration:.5,ease:'power3.inOut'},0).to(curve,{scaleX:1,duration:.5,ease:'power3.inOut'},0).to(scrim,{opacity:0,duration:.3},0);
      };
      const openMenu=instant=>{
        if(!panel)return;
        entering?.progress(1);returnFocus=document.activeElement;menuOpen=true;root.classList.add('menu-open');
        toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close navigation');panel.setAttribute('aria-hidden','false');panel.inert=false;
        background.forEach(el=>el.inert=true);lenis?.stop();menuMotion?.kill();
        const focus=()=>panel.querySelector('nav a')?.focus({preventScroll:true});
        if(!canMove()||instant){if(gsap){gsap.set(panel,{x:0,xPercent:0});gsap.set(curve,{scaleX:0});gsap.set(menuLinks,{x:0,rotate:0});gsap.set(scrim,{opacity:1});}focus();}
        else menuMotion=gsap.timeline({onComplete:focus})
          .to(panel,{xPercent:0,duration:.7,ease:'power4.out'},0)
          .to(curve,{scaleX:0,duration:.75,ease:'power4.out'},0)
          .to(menuLinks,{x:0,rotate:0,duration:.75,stagger:.035,ease:'expo.out'},.04)
          .to(scrim,{opacity:1,duration:.3},0);
      };
      on(toggle,'click',e=>menuOpen?closeMenu({instant:e.detail===0}):openMenu(e.detail===0));
      on(scrim,'click',()=>closeMenu());
      on(document,'keydown',e=>{
        if(!menuOpen)return;
        if(e.key==='Escape'){closeMenu({instant:true});return;}
        if(e.key!=='Tab')return;
        const links=[...panel.querySelectorAll('a')],first=links[0],last=links.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();toggle.focus();}
        else if(e.shiftKey&&document.activeElement===toggle){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();toggle.focus();}
        else if(!e.shiftKey&&document.activeElement===toggle){e.preventDefault();first.focus();}
      });
      on($('.print-button'),'click',()=>window.print());
      cleanup(()=>{menuMotion?.kill();closeMenu({instant:true,restoreFocus:false});});

      const hero=$('.hero'),track=$('.name-track');
      if(canMove()&&track){
        let width=1,position=0,direction=1,speed=1,velocity=1,skew=0,skewTarget=0,visible=true;
        const measure=()=>width=track.firstElementChild.getBoundingClientRect().width;
        measure();const resize=new ResizeObserver(measure);resize.observe(track.firstElementChild);cleanup(()=>resize.disconnect());
        const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;hero.classList.toggle('is-offscreen',!visible);});observer.observe(hero);cleanup(()=>observer.disconnect());
        const scroll=e=>{if(Math.abs(e.velocity)>.04)direction=e.velocity>0?1:-1;speed=1+Math.min(Math.abs(e.velocity)*.04,2);skewTarget=gsap.utils.clamp(-2.5,2.5,e.velocity*-.065);};
        lenis?.on('scroll',scroll);cleanup(()=>lenis?.off('scroll',scroll));
        const setX=gsap.quickSetter(track,'x','px'),setSkew=gsap.quickSetter(track,'skewX','deg');
        const tick=(_time,delta)=>{
          if(!visible||document.hidden||reduce.matches)return;
          const dt=Math.min(delta,50);velocity+=(direction*speed-velocity)*(1-Math.exp(-dt/160));
          position=(position+velocity*dt*.055+width)%width;setX(-position);skew+=(skewTarget-skew)*(1-Math.exp(-dt/180));setSkew(skew);skewTarget*=Math.exp(-dt/220);speed+=(1-speed)*(1-Math.exp(-dt/260));
        };
        gsap.ticker.add(tick);cleanup(()=>gsap.ticker.remove(tick));
      }
      if(canMove()&&ST){
        if(hero){
          ST.create({trigger:hero,start:'top top',end:'42% top',onLeave:()=>root.classList.add('has-scrolled'),onEnterBack:()=>root.classList.remove('has-scrolled')});
          gsap.to($('.hero-monogram'),{yPercent:-65,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:true}});
          gsap.to($('.hero-arrow'),{rotation:90,ease:'none',scrollTrigger:{trigger:hero,start:'bottom bottom',end:'bottom top',scrub:true}});
        }else ST.create({start:100,onEnter:()=>root.classList.add('has-scrolled'),onLeaveBack:()=>root.classList.remove('has-scrolled')});
        if($('.intro-side')){
          gsap.from($('.intro-side'),{y:45,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:$('.introduction'),start:'top 95%',once:true}});
          if(fine.matches)gsap.from($('.intro-circle-wrap'),{y:80,ease:'none',scrollTrigger:{trigger:$('.introduction'),start:'top bottom',end:'bottom top',scrub:true}});
        }
        $$('[data-footer-reveal]').forEach(footer=>{
          const st={trigger:footer,start:'top bottom',end:'bottom bottom',scrub:true};
          gsap.fromTo(footer.querySelector('.contact-curve'),{scaleY:1},{scaleY:0,ease:'none',scrollTrigger:st});
          gsap.from(footer.querySelector('.footer-content'),{y:fine.matches?-240:-65,ease:'none',scrollTrigger:st});
          const cta=footer.querySelector('.contact-cta-wrap'),arrow=footer.querySelector('.contact-arrow');
          if(cta)gsap.from(cta,{x:fine.matches?-55:-20,ease:'none',scrollTrigger:st});
          if(arrow)gsap.from(arrow,{rotation:15,ease:'none',scrollTrigger:st});
        });
        const image=$('.about-image img');
        if(image)gsap.fromTo(image,{yPercent:-5,scale:1.12},{yPercent:5,scale:1.12,ease:'none',scrollTrigger:{trigger:image.parentElement,start:'top bottom',end:'bottom top',scrub:true}});
        if($('.about-disciplines'))gsap.fromTo($('.about-disciplines'),{backgroundColor:'#fff'},{backgroundColor:'#e7e8e9',ease:'none',scrollTrigger:{trigger:$('.about-disciplines'),start:'top bottom',end:'bottom bottom',scrub:true}});
        const orb=$('.about-orb');if(orb)gsap.to(orb,{rotation:90,ease:'none',scrollTrigger:{trigger:$('.about-divider'),start:'top bottom',end:'top top',scrub:true}});

      }else $$('.reveal').forEach(el=>el.classList.add('is-visible'));

      if(canMove()&&fine.matches){
        $$('.magnetic').forEach(el=>{
          const text=el.querySelector('.button-label')||el.querySelector('span:not(.brand-mark)');
          const strength=el.dataset.magnet?Number(el.dataset.magnet)*el.offsetWidth:el.classList.contains('circle-button')?100:28;
          const x=gsap.quickTo(el,'x',{duration:.55,ease:'power3.out'}),y=gsap.quickTo(el,'y',{duration:.55,ease:'power3.out'});
          const tx=text&&gsap.quickTo(text,'x',{duration:.55,ease:'power3.out'}),ty=text&&gsap.quickTo(text,'y',{duration:.55,ease:'power3.out'});
          on(el,'pointermove',e=>{
            if(reduce.matches||!fine.matches)return;
            const r=el.getBoundingClientRect(),px=(e.clientX-r.left+Number(gsap.getProperty(el,'x')))/r.width-.5,py=(e.clientY-r.top+Number(gsap.getProperty(el,'y')))/r.height-.5;
            x(px*strength);y(py*strength);if(text){tx(px*strength*.5);ty(py*strength*.5);}
          });
          on(el,'pointerleave',()=>gsap.to([el,...(text?[text]:[])],{x:0,y:0,duration:.75,ease:'elastic.out(1,.45)',overwrite:true}));
        });
      }
      window.mountPortfolioFlow?.({scope,gsap,ST,reduce,fine,on,cleanup});
      window.PortfolioMotion?.mount({scope,gsap,ST,reduce,fine,on,cleanup,scrollEngine:lenis,canPreview:()=>!changing});
      window.mountPortfolioPage?.({scope,gsap,ST,reduce,fine,on,cleanup});
    };
    let context;
    if(gsap)context=gsap.context(setup,scope);else setup();
    // Fixed hover images cannot change document geometry. Batch actual layout changes.
    let refreshFrame=0;
    const refresh=()=>{
      if(controller.signal.aborted||!scope.isConnected||refreshFrame)return;
      refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;if(scope.isConnected){lenis?.resize();ST?.refresh();}});
    };
    cleanup(()=>cancelAnimationFrame(refreshFrame));
    $$('img').filter(img=>!img.closest('.work-preview')).forEach(img=>on(img,'load',refresh,{once:true}));document.fonts?.ready.then(refresh);
    return {scope,closeMenu,destroy(){controller.abort();disposers.forEach(fn=>fn());context?.revert();gsap?.killTweensOf(scope.querySelectorAll('*'));}};
  }

  function reveal(scope,{initial=false,instant=false}={}){
    entering?.kill();root.classList.remove('page-cover-ready');
    if(!canMove()||instant){if(gsap&&curtain)gsap.set(curtain,{visibility:'hidden',yPercent:-115});lenis?.start();return Promise.resolve();}
    const home=scope.dataset.barbaNamespace==='home',greeting=initial&&home&&!location.hash;
    const covered=curtain&&(changing||initial&&!location.hash);let at=covered ? .08 : 0;
    entering=gsap.timeline();
    if(covered)lenis?.stop();
    if(covered){
      gsap.set(curtain,{y:0,yPercent:0,visibility:'visible'});gsap.set(topCurve,{scaleY:0});gsap.set(bottomCurve,{scaleY:1});
      if(greeting){
        const greetings=[['Hello','en'],['Bonjour','fr'],['Hola','es'],['Ciao','it'],['Olá','pt'],['Hallo','nl'],['नमस्ते','hi'],['నమస్కారం','te'],['こんにちは','ja'],['안녕하세요','ko'],['你好','zh'],['Hello','en']];
        greetings.forEach(([text,lang],i)=>entering.call(()=>{label.textContent=text;label.lang=lang;},null,i===0?0:.22+(i-1)*.12));
        gsap.set(label,{opacity:1,y:0});at=1.65;
      }else{label.textContent=scope.dataset.pageTitle;label.lang='en';gsap.set(label,{opacity:1,y:0});}
      entering.to(label,{opacity:0,y:-45,duration:.5,ease:'power2.inOut'},at)
        .to(curtain,{yPercent:-115,duration:.95,ease:'expo.inOut',onComplete:()=>gsap.set(curtain,{visibility:'hidden'})},at)
        .to(bottomCurve,{scaleY:0,duration:.85,ease:'power3.inOut'},at+.1);
    }
    const contentAt=covered?at+.14:0;
    const primary=scope.querySelectorAll(home?'.hero-role,.location':'.page-hero,.contact-heading,.work-browser,.about-intro,.contact-layout');
    entering.fromTo(primary,{y:home?110:fine.matches?140:70,opacity:1},{y:0,opacity:1,duration:1.3,stagger:.055,ease:'expo.out',clearProps:'transform,opacity'},contentAt)
      .fromTo(scope.querySelector('.site-header'),{y:-18,opacity:0},{y:0,opacity:1,duration:.8,ease:'power3.out',clearProps:'transform,opacity'},contentAt+.1);
    if(home)entering.fromTo(scope.querySelector('.name-marquee'),{y:180},{y:0,duration:1.5,ease:'expo.out',clearProps:'transform'},contentAt+.04);
    entering.call(()=>{if(!root.classList.contains('menu-open'))lenis?.start();},null,contentAt);
    // Navigation unlocks as the curtain clears; the softer content settle can continue.
    return new Promise(resolve=>entering.call(resolve,null,covered ? at+.95 : 0));
  }
  function syncDocument(next){
    const parsed=new DOMParser().parseFromString(next.html,'text/html');document.body.className=next.container.dataset.bodyClass;document.body.dataset.pageTitle=next.container.dataset.pageTitle;document.title=parsed.title;
    for(const selector of ['meta[name="description"]','meta[name="theme-color"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:url"]','link[rel="canonical"]']){
      const source=parsed.querySelector(selector),destination=document.querySelector(selector);if(source&&destination)source.getAttributeNames().forEach(name=>destination.setAttribute(name,source.getAttribute(name)));
    }
    root.classList.remove('has-scrolled','menu-open');
  }
  const shell=document.querySelector('[data-barba="container"]');if(!shell){root.classList.remove('page-cover-ready');return;}
  page=mount(shell);reveal(shell,{initial:true});

  const normalize=path=>path.replace(/index\.html$/,'');
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href]');
    if(!anchor||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||anchor.target==='_blank'||anchor.hasAttribute('download'))return;
    const url=new URL(anchor.href,location.href);if(url.origin!==location.origin)return;keyboardRoute=event.detail===0;
    if(normalize(url.pathname)!==normalize(location.pathname)){requestedURL=url;return;}
    const target=url.hash?document.getElementById(decodeURIComponent(url.hash.slice(1))):0;if(url.hash&&!target)return;
    event.preventDefault();event.stopPropagation();entering?.progress(1);page.closeMenu({instant:true,restoreFocus:false});
    if(url.hash&&location.hash!==url.hash){
      if(window.barba)window.barba.history.add(url.href,anchor,'push');else history.pushState(null,'',url.hash);
    }
    moveScroll(target,!canMove()||keyboardRoute);
    if(keyboardRoute&&target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
  },true);
  window.addEventListener('popstate',()=>{requestedURL=new URL(location.href);},{capture:true});

  if(window.barba)window.barba.init({timeout:8000,preventRunning:true,prevent:({href})=>new URL(href,location.href).pathname.endsWith('/archive.html'),transitions:[{
    name:'continuous-curtain',
    async leave(data){
      transitionURL=requestedURL;requestedURL=null;
      changing=true;root.classList.add('is-transitioning');entering?.progress(1);page.closeMenu({instant:true,restoreFocus:false});lenis?.stop();
      if(canMove()&&!keyboardRoute&&curtain){
        label.textContent=data.trigger?.dataset?.transitionTitle||'Work';label.lang='en';gsap.set(curtain,{y:0,yPercent:115,visibility:'visible'});gsap.set(label,{y:35,opacity:0});gsap.set(topCurve,{scaleY:1});
        await new Promise(resolve=>gsap.timeline({onComplete:resolve}).to(curtain,{yPercent:0,duration:.55,ease:'power3.inOut'},0).to(topCurve,{scaleY:0,duration:.55,ease:'power3.inOut'},0).to(label,{y:0,opacity:1,duration:.35,ease:'power4.out'},.15));
      }
      page.destroy();data.current.container.remove();
    },
    beforeEnter(data){syncDocument(data.next);moveScroll(0,true);lenis?.resize();page=mount(data.next.container);ST?.refresh();},
    async enter(data){await reveal(data.next.container,{instant:keyboardRoute});},
    after(data){
      changing=false;keyboardRoute=false;root.classList.remove('is-transitioning');
      // An XHR response URL omits its fragment. Restore the clicked section target.
      const hash=transitionURL?.hash.slice(1)||data.next.url.hash?.replace(/^#/,'');
      if(hash){
        const destination=new URL(data.next.url.href||location.href);destination.hash=hash;
        window.barba.history.add(destination.href,data.trigger,'replace');
        window.barba.history.update({ns:data.next.namespace});
        data.next.url.hash=hash;data.next.url.href=destination.href;
      }
      const target=hash?document.getElementById(decodeURIComponent(hash)):document.getElementById('main');
      if(hash&&target)moveScroll(target,true);if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
      document.querySelector('[data-page-announcement]').textContent=data.next.container.dataset.pageTitle;
      if(curtain)curtain.dataset.navigationCount=String(Number(curtain.dataset.navigationCount)+1);
      lenis?.resize();ST?.refresh();
      transitionURL=null;
    },
  }]});
  // Validate browser-cached HTML after a deployment, while retaining Barba prefetching.
  window.barba?.headers?.set('Cache-Control','no-cache');
  // Wheel input can hurry the entrance, but never teleports its transforms to the end.
  window.addEventListener('wheel',()=>{if(!changing&&entering?.isActive())entering.timeScale(1.6);},{passive:true});
  document.addEventListener('keydown',event=>{if(!changing&&['Tab','PageDown','PageUp','End','Home','ArrowDown','ArrowUp'].includes(event.key))entering?.progress(1);});
  reduce.addEventListener('change',()=>{entering?.progress(1);page.destroy();configureScroll();page=mount(document.querySelector('[data-barba="container"]'));ST?.refresh();});
  fine.addEventListener('change',()=>{if(changing)return;page.destroy();configureScroll();page=mount(document.querySelector('[data-barba="container"]'));ST?.refresh();});
  window.addEventListener('pageshow',event=>{if(event.persisted){changing=false;root.classList.remove('page-cover-ready','is-transitioning');if(gsap)gsap.set(curtain,{visibility:'hidden',yPercent:-115});lenis?.start();}});
})();
