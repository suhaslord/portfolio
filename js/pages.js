/* Page-local controls. The router disposes listeners, clocks and observers. */
'use strict';
window.mountPortfolioPage=({scope,gsap,ST,reduce,fine,on,cleanup})=>{
  const $=selector=>scope.querySelector(selector),$$=selector=>[...scope.querySelectorAll(selector)];
  const mobile=matchMedia('(max-width: 767px)');
  const canMove=()=>Boolean(gsap&&!reduce.matches);

  if(gsap)$$('.liquid').forEach(button=>{
    const fill=button.querySelector('.button-fill');if(!fill)return;
    const label=button.querySelector('.button-label');
    if(label&&!button.classList.contains('view-button')&&!label.querySelector('.button-label-main')){
      const main=document.createElement('span');main.className='button-label-main';
      while(label.firstChild)main.append(label.firstChild);
      const copy=main.cloneNode(true);copy.className='button-label-copy';copy.setAttribute('aria-hidden','true');
      label.append(main,copy);
    }
    let exit;gsap.set(fill,{y:0,yPercent:110});
    on(button,'pointerenter',()=>{
      if(!canMove()||!fine.matches)return;
      exit?.kill();gsap.to(fill,{yPercent:0,duration:.55,ease:'power3.out',overwrite:'auto'});
    });
    on(button,'pointerleave',()=>{
      if(!canMove()||!fine.matches)return;
      exit=gsap.to(fill,{yPercent:-110,duration:.45,ease:'power2.inOut',overwrite:'auto',onComplete:()=>gsap.set(fill,{yPercent:110})});
    });
    on(button,'focus',()=>{if(button.matches(':focus-visible')){exit?.kill();gsap.set(fill,{y:0,yPercent:0});}});
    on(button,'blur',()=>gsap.set(fill,{yPercent:110}));
  });

  const browser=$('.work-browser:not(.archive-browser)');
  if(browser){
    const collection=browser.querySelector('.project-collection'),items=[...collection.querySelectorAll('.work-item')];
    const filters=$$('[data-work-filter]'),views=$$('[data-work-view]'),status=browser.querySelector('[data-work-status]');
    let filter='all',view='list',change;
    try{view=sessionStorage.getItem('portfolio:work-view')||'list';}catch{}
    const commit=()=>{
      browser.classList.toggle('is-grid',mobile.matches||view==='grid');let count=0;
      items.forEach(item=>{item.hidden=filter!=='all'&&!item.dataset.groups.split(' ').includes(filter);if(!item.hidden)count++;});
      status.textContent=`${count} ${filter==='all'?'':filter+' '}projects`;
      views.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.workView===(mobile.matches?'grid':view))));
      ST?.refresh();
    };
    const update=(motion=true)=>{
      window.dispatchEvent(new Event('work:change'));
      filters.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.workFilter===filter)));
      change?.kill();gsap?.killTweensOf(items);
      if(gsap)gsap.set([collection,...items],{clearProps:'transform,opacity'});
      if(!canMove()||!motion){commit();return;}
      change=gsap.to(collection,{opacity:0,y:-8,duration:.12,ease:'power2.in',overwrite:'auto',onComplete:()=>{
        commit();gsap.set(collection,{opacity:1,y:0});
        gsap.fromTo(items.filter(item=>!item.hidden),{opacity:0,y:22},{opacity:1,y:0,duration:.48,stagger:.025,ease:'power3.out',clearProps:'transform,opacity'});
      }});
    };
    filters.forEach(button=>on(button,'click',event=>{if(filter===button.dataset.workFilter)return;filter=button.dataset.workFilter;update(event.detail!==0);}));
    views.forEach(button=>on(button,'click',event=>{if(view===button.dataset.workView)return;view=button.dataset.workView;try{sessionStorage.setItem('portfolio:work-view',view);}catch{}update(event.detail!==0);}));
    on(mobile,'change',()=>update(false));
    cleanup(()=>change?.kill());commit();
  }

  const badge=$('.cursor-badge');
  if(badge&&canMove()&&fine.matches){
    gsap.set(badge,{xPercent:-50,yPercent:-50,scale:.85,autoAlpha:0});
    const x=gsap.quickTo(badge,'x',{duration:.35,ease:'power3.out'}),y=gsap.quickTo(badge,'y',{duration:.35,ease:'power3.out'});
    let active,known=false,sampleNeeded=false,pointer={x:0,y:0};
    const hide=({instant=false}={})=>{if(!active)return;active=null;if(instant){gsap.killTweensOf(badge);gsap.set(badge,{scale:.85,autoAlpha:0});return;}gsap.to(badge,{scale:.85,autoAlpha:0,duration:.22,ease:'power2.out',overwrite:'auto'});};
    const sample=()=>{
      if(!known)return;
      const hovered=document.elementFromPoint(pointer.x,pointer.y);
      const link=hovered?.closest('[data-cursor-only],.work-browser.is-grid .work-item');
      if(!link||!scope.contains(link)||!canMove()||!fine.matches){hide();return;}
      if(active!==link){const first=!active;active=link;badge.textContent=link.dataset.cursorOnly||'View';if(first)gsap.set(badge,{x:pointer.x,y:pointer.y});gsap.to(badge,{scale:1,autoAlpha:1,duration:.4,ease:'power3.out',overwrite:'auto'});}
      x(pointer.x);y(pointer.y);
    };
    const requestSample=()=>{sampleNeeded=true;};
    on(document,'pointermove',event=>{if(event.pointerType==='touch'){known=false;hide();return;}known=true;pointer={x:event.clientX,y:event.clientY};requestSample();});
    on(window,'scroll',requestSample,{passive:true});on(window,'blur',()=>{known=false;hide();});on(scope,'click',hide);on(window,'work:change',hide);
    on(document,'keydown',()=>{known=false;hide({instant:true});});
    on(document,'pointerout',event=>{if(!event.relatedTarget){known=false;hide();}});
    const follow=()=>{if(sampleNeeded&&!document.hidden){sampleNeeded=false;sample();}};
    gsap.ticker.add(follow);cleanup(()=>gsap.ticker.remove(follow));
  }

  const clocks=$$('[data-local-time]');
  const clockFormat=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',hour:'2-digit',minute:'2-digit',hour12:true,timeZoneName:'short'});
  const tick=()=>{if(document.hidden)return;const now=new Date();clocks.forEach(clock=>{clock.textContent=clockFormat.format(now);clock.dateTime=now.toISOString();});};
  if(clocks.length){tick();const timer=setInterval(tick,30000);cleanup(()=>clearInterval(timer));on(document,'visibilitychange',tick);}
  const globeVisibility=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-offscreen',!entry.isIntersecting)));
  $$('.location-orb,.about-orb').forEach(globe=>globeVisibility.observe(globe));cleanup(()=>globeVisibility.disconnect());

  const form=$('[data-contact-form]');
  if(form)on(form,'submit',event=>{
    event.preventDefault();const fields=new FormData(form),value=key=>String(fields.get(key)||'').trim();
    const subject=value('topic')||'Portfolio inquiry';
    const body=`${value('message')}\n\nFrom: ${value('name')}\nEmail: ${value('email')}${value('organization')?'\nOrganization: '+value('organization'):''}`;
    const href=`mailto:suhas.aug20@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const draft=$('[data-contact-draft]');draft.href=href;draft.hidden=false;$('[data-contact-status]').textContent='Your email draft is ready.';window.location.href=href;
  });
};
