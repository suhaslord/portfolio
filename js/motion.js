/* Presentation motion. The layout and all result images remain authored content. */
(() => {
  'use strict';
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

  function spring(value=0,stiffness=360,damping=34){
    let position=value,velocity=0;
    return {
      get value(){return position;},
      get velocity(){return velocity;},
      snap(next){position=next;velocity=0;},
      step(target,seconds){
        const time=clamp(seconds,0,.064),steps=Math.max(1,Math.ceil(time*120)),dt=time/steps;
        for(let i=0;i<steps;i++){
          velocity+=((target-position)*stiffness-velocity*damping)*dt;
          position+=velocity*dt;
        }
        if(Math.abs(target-position)<.005&&Math.abs(velocity)<.025){position=target;velocity=0;}
        return position;
      },
    };
  }

  function mount({scope,gsap,ST,reduce,fine,on,cleanup,scrollEngine,canPreview}){
    if(!gsap||!ST||reduce.matches)return;
    const $=selector=>scope.querySelector(selector),$$=selector=>[...scope.querySelectorAll(selector)];
    const home=scope.dataset.barbaNamespace==='home';

    function rule(element){
      const line=document.createElement('span');
      line.className='motion-rule';line.setAttribute('aria-hidden','true');
      element.classList.add('has-motion-rule');element.append(line);
      cleanup(()=>{line.remove();element.classList.remove('has-motion-rule');});
      return line;
    }

    if(home){
      $$('.reveal').forEach(heading=>{
        if(!heading.querySelector('.word-mask')){
          const text=heading.textContent.trim();heading.setAttribute('aria-label',text);heading.replaceChildren();
          text.split(/\s+/).forEach(word=>{
            const mask=document.createElement('span'),inner=document.createElement('span');
            mask.className='word-mask';mask.setAttribute('aria-hidden','true');inner.textContent=word;
            mask.append(inner);heading.append(mask,document.createTextNode(' '));
          });
        }
        heading.classList.add('is-visible');
        const lines=new Map();
        heading.querySelectorAll('.word-mask').forEach(word=>{
          const top=word.offsetTop;if(!lines.has(top))lines.set(top,[]);lines.get(top).push(word.firstElementChild);
        });
        const reveal=gsap.timeline({scrollTrigger:{trigger:heading,start:'top 94%',once:true}});
        [...lines.values()].forEach((words,index)=>reveal.from(words,{yPercent:115,rotation:2,duration:1.1,ease:'expo.out'},index*.105));
      });

      $$('.work-section .work-row').forEach(row=>{
        const title=row.querySelector('h3'),mask=document.createElement('span'),motion=document.createElement('span');
        mask.className='work-title-mask';motion.className='work-title-motion';
        title.replaceWith(mask);motion.append(title);mask.append(motion);
        cleanup(()=>mask.replaceWith(title));
        const line=rule(row);
        // The scroll position owns the reveal, so there is no delayed entrance to wait for.
        const reveal=gsap.timeline({scrollTrigger:{trigger:row,start:'top 98%',end:'top 64%',scrub:true}});
        reveal.fromTo(motion,{yPercent:100},{yPercent:0,ease:'power2.out'},0)
          .fromTo(row.querySelector('p'),{y:18,opacity:.35},{y:0,opacity:1,ease:'power2.out'},0)
          .fromTo(line,{scaleX:.15},{scaleX:1,ease:'none'},0);
        if(!fine.matches){
          const image=row.querySelector('.work-thumb');
          if(image)gsap.from(image,{y:28,opacity:.5,duration:1,ease:'power3.out',scrollTrigger:{trigger:image,start:'top 97%',once:true}});
        }
      });

      const gallery=$('.evidence-gallery');
      $$('.evidence-track').forEach((track,index)=>{
        if(fine.matches)gsap.fromTo(track,{x:index%2?'4vw':'-4vw'},{x:index%2?'-4vw':'4vw',ease:'none',scrollTrigger:{trigger:gallery,start:'top bottom',end:'bottom top',scrub:true}});
        const sequence=gsap.timeline({scrollTrigger:{trigger:track,start:'top 97%',once:true}});
        track.querySelectorAll('.evidence-tile').forEach((tile,i)=>{
          sequence.from(tile.querySelector('.evidence-image'),{y:55,opacity:.35,duration:1.1,ease:'expo.out'},i*.065)
            .from(tile.querySelector('img'),{scale:1.06,duration:1.4,ease:'power3.out'},i*.065)
            .from(tile.querySelector('.evidence-caption'),{y:18,opacity:0,duration:.8,ease:'power3.out'},i*.065+.12);
        });
      });

      const achievements=$('.achievement-grid');
      if(achievements){
        const sequence=gsap.timeline({scrollTrigger:{trigger:achievements,start:'top 94%',once:true}});
        $$('.achievement').forEach((item,index)=>{
          const at=index*.085;
          sequence.from(rule(item),{scaleX:0,duration:1,ease:'power3.out'},at)
            .from(item.querySelector('.achievement-value span'),{yPercent:115,rotation:3,duration:1.15,ease:'expo.out'},at+.04)
            .from(item.querySelectorAll('h3,p'),{y:22,opacity:0,duration:.85,stagger:.045,ease:'power3.out'},at+.15);
        });
      }
      $$('.section-heading').forEach(heading=>{
        const original=heading.innerHTML;
        heading.innerHTML=original.split(/<br\s*\/?>/i).map(line=>`<span class="heading-line"><span>${line}</span></span>`).join('');
        cleanup(()=>{heading.innerHTML=original;});
        gsap.from(heading.querySelectorAll('.heading-line>span'),{yPercent:110,duration:1.15,stagger:.09,ease:'expo.out',scrollTrigger:{trigger:heading,start:'top 95%',once:true}});
      });
    }

    $$('[data-footer-reveal]').forEach(footer=>{
      const lines=footer.querySelectorAll('.contact-title>span');
      if(lines.length)gsap.from(lines,{yPercent:45,stagger:.08,ease:'none',scrollTrigger:{trigger:footer,start:'top 96%',end:'top 36%',scrub:true}});
    });

    // Controls use the same physical follow as the result preview. One clock services
    // only the hovered control and controls that are still returning to rest.
    if(fine.matches){
      const moving=new Set(),controls=[];
      $$('.magnetic').forEach(element=>{
        let surface=element;
        if(element.closest('.menu-panel nav')){
          surface=document.createElement('span');surface.className='menu-link-text';
          while(element.firstChild)surface.append(element.firstChild);
          element.append(surface);
        }
        const text=surface===element?(element.querySelector('.button-label')||element.querySelector('span:not(.brand-mark)')):null;
        const state={element:surface,trigger:element,text,hovered:false,pointer:{x:0,y:0},x:spring(0,600,44),y:spring(0,600,44),tx:spring(0,460,38),ty:spring(0,460,38)};
        state.setX=gsap.quickSetter(surface,'x','px');state.setY=gsap.quickSetter(surface,'y','px');
        if(text){state.setTX=gsap.quickSetter(text,'x','px');state.setTY=gsap.quickSetter(text,'y','px');}
        const aim=event=>{
          if(event.pointerType==='touch')return;
          state.hovered=true;state.pointer.x=event.clientX;state.pointer.y=event.clientY;moving.add(state);
        };
        on(element,'pointerenter',aim);on(element,'pointermove',aim);
        on(element,'pointerleave',()=>{state.hovered=false;moving.add(state);});
        controls.push(state);
      });
      const reset=()=>{
        moving.forEach(state=>{
          state.hovered=false;
          [state.x,state.y,state.tx,state.ty].forEach(axis=>axis.snap(0));
          state.setX(0);state.setY(0);state.setTX?.(0);state.setTY?.(0);
        });
        moving.clear();
      };
      const followControls=(_time,delta)=>{
        if(!moving.size||document.hidden)return;
        const dt=Math.min(delta,64)/1000;
        moving.forEach(state=>{
          let x=0,y=0;
          if(state.hovered){
            if(!state.trigger.matches(':hover'))state.hovered=false;
            else{
              const rect=state.trigger.getBoundingClientRect(),same=state.element===state.trigger;
              const strength=state.trigger.dataset.magnet?Number(state.trigger.dataset.magnet)*rect.width:state.trigger.classList.contains('circle-button')?100:28;
              x=clamp((state.pointer.x-rect.left+(same?state.x.value:0))/rect.width-.5,-.5,.5)*strength;
              y=clamp((state.pointer.y-rect.top+(same?state.y.value:0))/rect.height-.5,-.5,.5)*strength;
            }
          }
          state.setX(state.x.step(x,dt));state.setY(state.y.step(y,dt));
          state.setTX?.(state.tx.step(x*.5,dt));state.setTY?.(state.ty.step(y*.5,dt));
          if(!state.hovered&&[state.x,state.y,state.tx,state.ty].every(axis=>axis.value===0&&axis.velocity===0))moving.delete(state);
        });
      };
      on(document,'keydown',reset);on(window,'blur',reset);
      on(document,'pointerdown',event=>{if(event.pointerType==='touch')reset();});
      gsap.ticker.add(followControls);
      cleanup(()=>{
        gsap.ticker.remove(followControls);moving.clear();
        const elements=controls.flatMap(state=>state.text?[state.element,state.text]:[state.element]);
        gsap.set(elements,{clearProps:'transform'});
        controls.forEach(state=>{if(state.element!==state.trigger)state.trigger.replaceChildren(...state.element.childNodes);});
      });
    }

    const preview=$('.work-preview'),rail=$('.preview-rail'),badge=$('.work-preview-action');
    if(!fine.matches||!preview||!rail||!badge)return;
    const images=[...rail.querySelectorAll('img')];
    images.forEach(image=>{if(!image.getAttribute('src'))image.src=image.dataset.src;});
    gsap.set(preview,{xPercent:-50,yPercent:-50,scale:.9,autoAlpha:0,transformPerspective:1000});
    gsap.set(badge,{xPercent:-50,yPercent:-50,scale:.85,autoAlpha:0});
    let active=null,known=false,dirty=false,rendering=false,disposed=false,halfWidth=180,halfHeight=180;
    const pointer={x:0,y:0};
    const photo={x:spring(),y:spring()},button={x:spring(0,600,44),y:spring(0,600,44)},angle=spring(0,180,25);
    const measure=()=>{halfWidth=preview.offsetWidth/2;halfHeight=preview.offsetHeight/2;};
    measure();const resize=new ResizeObserver(measure);resize.observe(preview);cleanup(()=>resize.disconnect());
    const target=()=>({x:clamp(pointer.x,halfWidth+18,innerWidth-halfWidth-18),y:clamp(pointer.y,halfHeight+18,innerHeight-halfHeight-18)});
    const restore=(row,instant=false)=>{
      const text=row?.querySelectorAll('h3,p');if(!text)return;
      if(instant){gsap.killTweensOf(text,'x');gsap.set(text,{x:0});}
      else gsap.to(text,{x:0,duration:.65,ease:'power3.out',overwrite:'auto'});
    };
    const hide=({instant=false}={})=>{
      if(!active&&(!instant||!rendering))return;
      restore(active,instant);active=null;
      if(instant){rendering=false;gsap.killTweensOf([preview,badge]);gsap.set(preview,{scale:.9,autoAlpha:0,rotation:0});gsap.set(badge,{scale:.85,autoAlpha:0});return;}
      gsap.to(preview,{scale:.94,autoAlpha:0,duration:.28,ease:'power2.out',overwrite:'auto',onComplete:()=>{if(!active)rendering=false;}});
      gsap.to(badge,{scale:.85,autoAlpha:0,duration:.22,ease:'power2.out',overwrite:'auto'});
    };
    const activate=row=>{
      if(!row||row.hidden||row.closest('.work-browser.is-grid')||!scope.contains(row)||!canPreview()){hide();return;}
      if(active===row)return;
      restore(active);active=row;
      const index=Number(row.dataset.previewIndex);
      const reveal=()=>{
        if(disposed||active!==row)return;
        if(!rendering){
          const next=target();photo.x.snap(next.x);photo.y.snap(next.y);button.x.snap(pointer.x);button.y.snap(pointer.y);angle.snap(0);
          gsap.set(preview,{x:next.x,y:next.y,rotation:0,scale:.9});gsap.set(badge,{x:pointer.x,y:pointer.y});
          gsap.set(rail,{yPercent:-100*index});
        }else gsap.to(rail,{yPercent:-100*index,duration:.7,ease:'expo.out',overwrite:'auto'});
        rendering=true;preview.dataset.activePreview=String(index);
        gsap.to(preview,{scale:1,autoAlpha:1,duration:.65,ease:'expo.out',overwrite:'auto'});
        gsap.to(badge,{scale:1,autoAlpha:1,duration:.4,ease:'power3.out',overwrite:'auto'});
      };
      const image=images[index];
      if(!image||image.complete&&image.naturalWidth)reveal();
      else image.decode().then(reveal).catch(()=>{if(!disposed&&active===row)hide();});
      gsap.to(row.querySelector('h3'),{x:-25,duration:.65,ease:'power3.out',overwrite:'auto'});
      gsap.to(row.querySelector('p'),{x:25,duration:.65,ease:'power3.out',overwrite:'auto'});
    };
    const sample=()=>{if(known)activate(document.elementFromPoint(pointer.x,pointer.y)?.closest('.work-row[data-preview]'));};
    const request=()=>{dirty=true;};
    on(document,'pointermove',event=>{if(event.pointerType==='touch'){known=false;hide({instant:true});return;}known=true;pointer.x=event.clientX;pointer.y=event.clientY;request();});
    on(document,'pointerout',event=>{if(!event.relatedTarget){known=false;hide();}});
    on(document,'keydown',()=>{known=false;hide({instant:true});});
    on(window,'scroll',request,{passive:true});on(window,'blur',()=>{known=false;hide();});on(scope,'click',hide);on(window,'work:change',hide);
    scrollEngine?.on('scroll',request);cleanup(()=>scrollEngine?.off('scroll',request));
    const px=gsap.quickSetter(preview,'x','px'),py=gsap.quickSetter(preview,'y','px'),rotation=gsap.quickSetter(preview,'rotation','deg');
    const bx=gsap.quickSetter(badge,'x','px'),by=gsap.quickSetter(badge,'y','px');
    const follow=(_time,delta)=>{
      if(document.hidden)return;
      if(dirty){dirty=false;sample();}
      if(!rendering)return;
      const dt=Math.min(delta,64)/1000,next=target();
      px(photo.x.step(next.x,dt));py(photo.y.step(next.y,dt));
      bx(button.x.step(pointer.x,dt));by(button.y.step(pointer.y,dt));
      rotation(angle.step(clamp(photo.x.velocity*.004,-2.8,2.8),dt));
    };
    gsap.ticker.add(follow);
    cleanup(()=>{disposed=true;rendering=false;gsap.ticker.remove(follow);});
  }

  window.PortfolioMotion={spring,mount};
})();
