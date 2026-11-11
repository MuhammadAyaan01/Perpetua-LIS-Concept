document.documentElement.classList.add('js');
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#primary-nav');
let menuAnimation;
const mobileNavigation=()=>innerWidth<=900;
function labelMenu(open){menu.querySelector('.menu-label').textContent=open?'Close':'Menu';menu.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu')}
function setMenu(open){
  const wasOpen=nav.classList.contains('open');
  const initialOpacity=wasOpen?getComputedStyle(nav).opacity:0;
  menuAnimation?.cancel(); menu.setAttribute('aria-expanded',String(open));labelMenu(open);nav.inert=!open;
  if(!wasOpen&&!open)return;
  nav.classList.add('open');
  if(!nav.animate){nav.classList.toggle('open',open);return}
  const animation=nav.animate([{opacity:initialOpacity,transform:open?'translateY(-8px)':'translateY(0)'},{opacity:open?1:0,transform:open?'translateY(0)':'translateY(-7px)'}],{duration:open?260:190,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
  menuAnimation=animation;
  animation.finished.then(()=>{if(menuAnimation!==animation)return;nav.classList.toggle('open',open);animation.cancel();menuAnimation=null}).catch(()=>{});
}
function closeMenu(){if(!mobileNavigation())return;setMenu(false)}
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
addEventListener('resize',()=>{if(!mobileNavigation()){menuAnimation?.cancel();menuAnimation=null;nav.classList.remove('open');nav.inert=false;menu.setAttribute('aria-expanded','false');labelMenu(false)}});
document.addEventListener('pointerdown',event=>{if(mobileNavigation()&&menu.getAttribute('aria-expanded')==='true'&&!event.target.closest('.header'))closeMenu()});
nav.addEventListener('focusout',()=>requestAnimationFrame(()=>{if(mobileNavigation()&&menu.getAttribute('aria-expanded')==='true'&&!nav.contains(document.activeElement)&&document.activeElement!==menu)closeMenu()}));
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus()}});
const booking=document.querySelector('#booking-dialog');
const dialogOpeners=new WeakMap();
function openDialog(dialog,opener=document.activeElement){if(dialog.open)return;dialogOpeners.set(dialog,opener);dialog.showModal();document.documentElement.classList.add('dialog-open');document.dispatchEvent(new CustomEvent('dialogopened',{detail:{dialog}}))}
function closeDialog(dialog){if(!dialog.open)return;dialog.querySelector('video')?.pause();const request=new CustomEvent('dialogcloserequest',{detail:{dialog},bubbles:true,cancelable:true});if(dialog.dispatchEvent(request))dialog.close()}
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>{closeMenu();openDialog(booking,b)}));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>closeDialog(d));d.addEventListener('cancel',event=>{event.preventDefault();closeDialog(d)});d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.documentElement.classList.remove('dialog-open');const opener=dialogOpeners.get(d);if(opener&&(!opener.getClientRects().length||opener.closest('[inert]')))menu.focus()})});
document.querySelector('[data-close]').addEventListener('click',()=>closeDialog(booking));
const demo=document.querySelector('#demo-dialog'),video=document.querySelector('#product-video');
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>{if(!video.getAttribute('src'))video.setAttribute('src','https://perpetuafoundry.ai/lis-video/PF_LIS_Tech_Fest_Full_Video.mp4');openDialog(demo,b)}));
demo.addEventListener('close',()=>video.pause());
video.addEventListener('error',()=>{document.querySelector('.video-error').hidden=false});
const tabs=[...document.querySelectorAll('[role="tab"]')];
tabs.forEach(tab=>document.getElementById(tab.getAttribute('aria-controls')).hidden=tab.getAttribute('aria-selected')!=='true');
function activateTab(tab,focus=false){const previous=document.querySelector('[role="tab"][aria-selected="true"]');tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected});if(focus)tab.focus();if(previous!==tab)document.dispatchEvent(new CustomEvent('capabilitychange',{detail:{panel:document.getElementById(tab.getAttribute('aria-controls'))}}))}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activateTab(tabs[next],true)}})});


;
(() => {
  const running = new Set();

  const motionAllowed = () => true;
  const motion = (element, frames, options = {}) => {
    if (!element || !motionAllowed() || !element.animate) return;
    const animation = element.animate(frames, { duration: 600, fill: 'backwards', easing: 'cubic-bezier(.2,.75,.25,1)', ...options });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
    return animation;
  };
  const visual = document.querySelector('.hero-visual');
  const phaseLabels = ['Your own material provides the context.', 'AI-assisted workflows shape course content and assessments.', 'A person reviews and publishes before learning is shared.'];
  const source = visual.querySelector('.source-paper');
  const outputs = [...visual.querySelectorAll('.hero-outputs>div')];
  const gate = visual.querySelector('.human-gate');
  const stage = document.createElement('div'); stage.className='workflow-stage'; stage.innerHTML='<span>KNOWLEDGE → LEARNING</span><b><i></i><span>01 / Your context</span></b>'; visual.querySelector('.visual-title').after(stage);
  outputs.forEach((card,i)=>{const preview=document.createElement('div');preview.className='output-preview';preview.setAttribute('aria-hidden','true');preview.innerHTML=i===0?'<i></i><i></i><i></i>':'<span><i></i><b></b></span><span><i></i><b></b></span><span><i></i><b></b></span>';card.append(preview)});
  visual.querySelector('.hero-path').innerHTML = '<p>AI-assisted creation</p><svg class="flow-network" viewBox="0 0 400 52" preserveAspectRatio="none" aria-hidden="true"><path class="flow-rail" d="M200 0V15Q200 23 192 23H110Q98 23 98 35V52"/><path class="flow-rail" d="M200 0V15Q200 23 208 23H290Q302 23 302 35V52"/><path class="flow-trace" d="M200 0V15Q200 23 192 23H110Q98 23 98 35V52"/><path class="flow-trace" d="M200 0V15Q200 23 208 23H290Q302 23 302 35V52"/><circle class="flow-signal" r="3"/><circle class="flow-signal" r="3"/></svg>';
  const progress = document.createElement('div'); progress.className = 'workflow-timeline'; progress.setAttribute('aria-hidden', 'true'); progress.innerHTML = '<i></i>';
  const controls = document.createElement('div');
  controls.className = 'workflow-controls'; controls.setAttribute('role', 'group'); controls.setAttribute('aria-label', 'Explore the illustrated learning workflow');
  controls.innerHTML = '<button type="button" data-phase="0" aria-pressed="true"><span>01</span>Source</button><button type="button" data-phase="1" aria-pressed="false"><span>02</span>Create</button><button type="button" data-phase="2" aria-pressed="false"><span>03</span>Review</button><button type="button" class="workflow-replay" aria-label="Replay the workflow animation">Replay ↻</button>';
  const status = document.createElement('p'); status.className = 'workflow-status'; status.textContent = phaseLabels[0];
  visual.insertBefore(controls, visual.querySelector('.visual-caption')); visual.insertBefore(status, visual.querySelector('.visual-caption'));
  visual.insertBefore(progress, status);
  let workflowRun = 0;
  let userPaused = false, visualVisible = false, cycleCount = 0;
  const heroAnimations = new Set();
  function heroMotion(element, frames, options = {}) {
    const animation = motion(element, frames, { fill: 'both', ...options });
    if (animation) heroAnimations.add(animation);
    return animation;
  }
  function clearHeroMotion(freeze = false) {
    heroAnimations.forEach(animation => freeze ? animation.pause() : animation.cancel());
    if (!freeze) heroAnimations.clear();
  }
  const timers = new Set();
  function updatePlaybackControl() {
    const playing = visual.classList.contains('is-playing');
    const button = controls.querySelector('.workflow-replay');
    button.disabled=!motionAllowed();
    button.textContent = !motionAllowed() ? 'Motion off' : playing ? 'Pause Ⅱ' : 'Play ↻';
    button.setAttribute('aria-label', playing ? 'Pause workflow animation' : 'Play workflow animation');
  }
  function stopWorkflow(freeze = false) { workflowRun++; timers.forEach(clearTimeout); timers.clear(); clearHeroMotion(freeze); visual.classList.remove('is-playing'); updatePlaybackControl(); }
  function selectPhase(index, announce = false) {
    visual.dataset.phase = String(index);
    stage.querySelector('b>span').textContent=['01 / Your context','02 / Assisted creation','03 / Human review'][index];
    controls.querySelectorAll('[data-phase]').forEach(button=>button.classList.toggle('is-complete',Number(button.dataset.phase)<index));
    controls.querySelectorAll('[data-phase]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.phase) === index)));
    if (announce) { status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); }
    else { status.removeAttribute('role'); status.removeAttribute('aria-live'); }
    status.textContent = phaseLabels[index];
    if (index === 0) {
      heroMotion(source, [{ opacity: .88, transform: 'translate(-14px,-8px) rotate(-1.5deg)' }, { opacity: 1, transform: 'translate(0,0) rotate(0deg)' }], { duration: 800 });
      const sheets = [...visual.querySelectorAll('.source-sheets i')];
      heroMotion(sheets[0], [{ transform: 'translate(15px,10px) rotate(0deg)' }, { transform: 'translate(-7px,-4px) rotate(-5deg)' }, { transform: 'translate(0,0) rotate(-4deg)' }], { duration: 1100 });
      heroMotion(sheets[1], [{ transform: 'translate(-10px,8px) rotate(0deg)' }, { transform: 'translate(7px,0) rotate(4deg)' }, { transform: 'translate(0,0) rotate(3deg)' }], { duration: 1100, delay: 90 });
    } else if (index === 1) {
      visual.querySelectorAll('.flow-trace').forEach(path => heroMotion(path, [{ strokeDashoffset: 190, opacity: .5 }, { strokeDashoffset: 0, opacity: 1 }], { duration: 950 }));
      visual.querySelectorAll('.flow-signal').forEach((dot, i) => {
        const x = i === 0 ? 98 : 302, mid = i === 0 ? 110 : 290;
        heroMotion(dot, [{ transform: 'translate(200px,0)', opacity: 0, offset: 0 }, { transform: 'translate(200px,16px)', opacity: 1, offset: .25 }, { transform: `translate(${mid}px,23px)`, opacity: 1, offset: .7 }, { transform: `translate(${x}px,52px)`, opacity: 0, offset: 1 }], { duration: 1100, delay: i * 100 });
      });
      outputs.forEach((card, i) => {
        heroMotion(card, [{ opacity: .85, transform: `translate(${i === 0 ? -12 : 12}px,14px) scale(.96)` }, { opacity: 1, transform: 'translate(0,0) scale(1)' }], { duration: 700, delay: 400 + i * 170 });
        heroMotion(card.querySelector('svg'), [{ transform: 'scale(.75) rotate(-8deg)' }, { transform: 'scale(1.12) rotate(3deg)', offset: .65 }, { transform: 'scale(1) rotate(0)' }], { duration: 600, delay: 650 + i * 170 });
        card.querySelectorAll('.output-preview>i,.output-preview>span').forEach((line,j)=>heroMotion(line,[{opacity:.25,transform:'scaleX(.15)'},{opacity:1,transform:'scaleX(1)'}],{duration:500,delay:700+i*150+j*140}));
      });
    } else {
      heroMotion(gate, [{ opacity: .9, transform: 'translateY(9px) scale(.99)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 650 });
      heroMotion(gate.querySelector('svg'), [{ transform: 'scale(.65)', boxShadow: '0 0 0 0px #286c6d38' }, { transform: 'scale(1.15)', boxShadow: '0 0 0 9px #286c6d08', offset: .55 }, { transform: 'scale(1)', boxShadow: '0 0 0 13px #286c6d00' }], { duration: 1000, delay: 150 });
      heroMotion(gate.querySelector('div'), [{ opacity: .9, transform: 'translateX(-5px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 500, delay: 200 });
    }
  }
  function later(fn, delay) { const timer = setTimeout(() => { timers.delete(timer); fn(); }, delay); timers.add(timer); }
  function playLoop() {
    stopWorkflow();
    if (!motionAllowed() || !visualVisible || document.hidden || userPaused) return;
    const token = workflowRun;
    visual.classList.add('is-playing'); updatePlaybackControl();
    function cycle() {
      if (token !== workflowRun) return;
      clearHeroMotion();
      visual.dataset.cycle = String(++cycleCount); selectPhase(0);
      heroMotion(progress.querySelector('i'), [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 5000, easing: 'linear' });
      later(() => { if (token === workflowRun) selectPhase(1); }, 1300);
      later(() => { if (token === workflowRun) selectPhase(2); }, 2800);
      // Give the review stage time to settle before starting the next cycle.
      later(cycle, 5000);
    }
    cycle();
  }
  controls.querySelectorAll('[data-phase]').forEach(button => button.addEventListener('click', () => { userPaused = true; stopWorkflow(); selectPhase(Number(button.dataset.phase), true); }));
  controls.querySelector('.workflow-replay').addEventListener('click', () => {
    if (visual.classList.contains('is-playing')) { userPaused = true; stopWorkflow(true); return; }
    userPaused = false;
    const rect = visual.getBoundingClientRect(); visualVisible = rect.bottom > 0 && rect.top < innerHeight;
    startMotion();
  });
  selectPhase(0);
  // Animate on re-entry throughout the page without taking over wheel/touch scrolling.
  const revealTargets = [...document.querySelectorAll('.purpose-section>div,.about-grid>div,.evidence-grid>*,.section-heading,.process-grid li,.feature-tabs,.feature-panel:not([hidden]),.solution-grid article,.governance-grid>div,.roadmap-grid article,.faq-grid>div:first-child,.faq-list details,.closing-section>div,.footer-grid>div')];
  const entered = new WeakSet(), revealAnimations = new WeakMap();
  let observer;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) {entered.delete(entry.target);revealAnimations.get(entry.target)?.cancel();return;}
      if(entry.intersectionRatio<.08||entered.has(entry.target))return;
      entered.add(entry.target);
      entry.target.dataset.revealCount=String(Number(entry.target.dataset.revealCount||0)+1);
      const siblings = entry.target.parentElement;
      const staggered = siblings.matches('.process-grid,.solution-grid,.roadmap-grid,.faq-list,.footer-grid');
      const delay = staggered ? Math.min([...siblings.children].indexOf(entry.target)*60,180) : 0;
      const y=entry.boundingClientRect.top<innerHeight*.35?-16:22;
      revealAnimations.get(entry.target)?.cancel();
      revealAnimations.set(entry.target,motion(entry.target, [{ opacity: .86, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'translateY(0)' }], { delay, duration: 650 }));
    }), { threshold: [0,.08] });
    revealTargets.forEach(element => observer.observe(element));
    const workflowObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      visualVisible = entry.isIntersecting;
      if (visualVisible) playLoop(); else stopWorkflow();
    }), { threshold: 0 });
    workflowObserver.observe(visual);
  } else {
    visualVisible = true;
  }
  document.addEventListener('capabilitychange', event => {
    const panel = event.detail.panel;
    motion(panel.querySelector('.feature-copy'), [{ opacity: .45, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 360 });
    motion(panel.querySelector('.feature-diagram'), [{ opacity: .5, transform: 'translateX(14px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 440, delay: 50 });
  });
  const topButton = document.createElement('button'); topButton.className = 'to-top'; topButton.type = 'button'; topButton.setAttribute('aria-label', 'Back to top'); topButton.textContent = '↑'; topButton.hidden = true; document.body.append(topButton);
  topButton.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: motionAllowed() ? 'smooth' : 'instant' }); document.querySelector('.header>a').focus({ preventScroll: true }); });
  const header = document.querySelector('.header'); let scheduled = false;
  const sectionLinks=[...document.querySelectorAll('#primary-nav a[href^="#"]')].map(link=>({link,section:document.getElementById(link.getAttribute('href').slice(1))})).filter(item=>item.section).sort((a,b)=>a.section.offsetTop-b.section.offsetTop);
  function updateScroll() {
    scheduled = false; const range = document.documentElement.scrollHeight - innerHeight;
    header.style.setProperty('--viewport-width', document.documentElement.clientWidth + 'px');
    header.style.setProperty('--page-progress', range > 0 ? Math.min(1, scrollY / range) : 0);
    header.classList.toggle('is-scrolled', scrollY > 34); topButton.hidden = scrollY < 1000;
    const probe=header.getBoundingClientRect().height+Math.min(innerHeight*.2,160);
    let current=null;
    sectionLinks.forEach(item=>{const rect=item.section.getBoundingClientRect();if(rect.top<=probe&&rect.bottom>probe)current=item.link});
    sectionLinks.forEach(({link})=>{const active=link===current;link.classList.toggle('nav-active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  }
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  addEventListener('resize', updateScroll); updateScroll();
  function startMotion() {
    document.documentElement.dataset.motion = motionAllowed() ? 'full' : 'reduced';
    playLoop();
    updatePlaybackControl();
  }
  startMotion();

  document.addEventListener('visibilitychange', () => { if (document.hidden) stopWorkflow(); else playLoop(); });
})();




;
(() => {
  const faqs=[...document.querySelectorAll('.faq-list details')], states=new WeakMap();
  function transitionFAQ(detail,expanded){
    const reduce=false;
    const summary=detail.querySelector('summary'),answer=detail.querySelector('.faq-answer');
    const fromHeight=detail.getBoundingClientRect().height;
    const fromOpacity=detail.open?getComputedStyle(answer).opacity:0;
    const previous=states.get(detail);previous?.height.cancel();previous?.content.cancel();
    detail.open=true;detail.style.height='auto';
    const style=getComputedStyle(detail);
    const closedHeight=summary.getBoundingClientRect().height+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
    const targetHeight=expanded?detail.getBoundingClientRect().height:closedHeight;
    detail.classList.toggle('is-expanded',expanded);summary.setAttribute('aria-expanded',String(expanded));answer.inert=!expanded;
    detail.style.overflow='hidden';
    const height=detail.animate([{height:fromHeight+'px'},{height:targetHeight+'px'}],{duration:reduce?0:expanded?400:320,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'});
    const content=answer.animate([{opacity:fromOpacity,transform:expanded?'translateY(-7px)':'translateY(0)'},{opacity:expanded?1:0,transform:expanded?'translateY(0)':'translateY(-5px)'}],{duration:reduce?0:expanded?300:210,easing:'ease-out',fill:'both'});
    const current={height,content};states.set(detail,current);
    height.finished.then(()=>{if(states.get(detail)!==current)return;detail.open=expanded;detail.style.height='';detail.style.overflow='';height.cancel();content.cancel();states.delete(detail)}).catch(()=>{});
  }
  faqs.forEach(detail=>{
    if(!detail.animate)return;
    detail.removeAttribute('name');
    const summary=detail.querySelector('summary'),answer=document.createElement('div');answer.className='faq-answer';
    [...detail.children].filter(child=>child!==summary).forEach(child=>answer.append(child));detail.append(answer);
    detail.classList.toggle('is-expanded',detail.open);summary.setAttribute('aria-expanded',String(detail.open));answer.inert=!detail.open;
    summary.addEventListener('click',event=>{event.preventDefault();const expanded=!detail.classList.contains('is-expanded');if(expanded)faqs.forEach(other=>{if(other!==detail&&other.classList.contains('is-expanded'))transitionFAQ(other,false)});transitionFAQ(detail,expanded)});
  });
  const dialogAnimations=new WeakMap();
  document.addEventListener('dialogopened',event=>{
    const dialog=event.detail.dialog;if(!dialog.animate)return;dialog.classList.remove('is-closing');dialogAnimations.get(dialog)?.cancel();
    const animation=dialog.animate([{opacity:0,transform:'translateY(18px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});dialogAnimations.set(dialog,animation);
    animation.finished.then(()=>{if(dialogAnimations.get(dialog)===animation)dialogAnimations.delete(dialog)}).catch(()=>{});
  });
  document.addEventListener('dialogcloserequest',event=>{
    const dialog=event.detail.dialog;if(!dialog.animate)return;event.preventDefault();if(dialog.classList.contains('is-closing'))return;
    const style=getComputedStyle(dialog),opacity=style.opacity,transform=style.transform==='none'?'translateY(0) scale(1)':style.transform;
    dialogAnimations.get(dialog)?.cancel();dialog.classList.add('is-closing');
    const animation=dialog.animate([{opacity,transform},{opacity:0,transform:'translateY(12px) scale(.98)'}],{duration:220,easing:'ease-in',fill:'both'});dialogAnimations.set(dialog,animation);
    animation.finished.then(()=>{if(dialogAnimations.get(dialog)!==animation)return;dialog.close();dialog.classList.remove('is-closing');animation.cancel();dialogAnimations.delete(dialog)}).catch(()=>{});
  });
  document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog)}));
})();


;
(() => {
  const diagrams=[...document.querySelectorAll('.feature-diagram')];
  const paused=new WeakSet(), visible=new WeakSet();

  const decorations={
    create:'<div class="cap-pages"><i></i><i></i><i></i></div>',
    assess:'<div class="cap-checks"><span><i></i><b></b></span><span><i></i><b></b></span><span><i></i><b></b></span></div>',
    support:'<div class="cap-conversation"><span><i></i><i></i><i></i></span><b><i></i><i></i></b></div>',
    understand:'<div class="cap-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'
  };
  function update(){document.body.classList.toggle('cap-motion-in-view',diagrams.some(figure=>visible.has(figure)&&!figure.closest('[hidden]')));diagrams.forEach(figure=>{
    const running=visible.has(figure)&&!figure.closest('[hidden]')&&!document.hidden&&!paused.has(figure);
    figure.classList.toggle('cap-running',running);
    const control=figure.querySelector('.cap-play');
    control.disabled=false;
    control.textContent=paused.has(figure)?'Play ↻':'Pause Ⅱ';
    control.setAttribute('aria-label',`${paused.has(figure)?'Play':'Pause'} ${figure.dataset.capability} illustration animation`);
  })}
  diagrams.forEach(figure=>{
    const panel=figure.closest('.feature-panel'),kind=panel.id.replace('panel-','');
    figure.dataset.capability=kind;
    const phases={create:['Source context','Shape the learning','Ready for review'],assess:['Learning objective','Connect the questions','Purpose stays linked'],support:['Course context','A question connects','Grounded support'],understand:['Learning data','Explore the picture','People interpret']}[kind];
    const journey=document.createElement('div');journey.className='cap-journey';journey.setAttribute('aria-hidden','true');journey.innerHTML='<span>01 · Context</span><span>02 · Connect</span><span>03 · People</span><i></i>';figure.querySelector('.diagram-top').after(journey);
    figure.querySelector('.diagram-document').insertAdjacentHTML('beforeend',`<div class="cap-detail" aria-hidden="true">${decorations[kind]}</div>`);
    figure.querySelector('.diagram-path').innerHTML='<span class="cap-track"><i></i></span>';
    figure.querySelector('.diagram-path').setAttribute('aria-hidden','true');
    const result=figure.querySelector('.diagram-result');
    const accent=document.createElement('span');accent.className='cap-result-accent';accent.setAttribute('aria-hidden','true');accent.innerHTML='<i></i><i></i><i></i>';result.append(accent);
    const footer=document.createElement('div');footer.className='cap-motion-footer';footer.innerHTML=`<span class="cap-phase-caption" aria-hidden="true">${phases.map(text=>`<span>${text}</span>`).join('')}</span><button class="cap-play" type="button"></button>`;
    figure.insertBefore(footer,figure.querySelector('figcaption'));
    footer.querySelector('button').addEventListener('click',()=>{if(paused.has(figure))paused.delete(figure);else paused.add(figure);update()});
  });
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target)});update()},{threshold:0});diagrams.forEach(figure=>observer.observe(figure))}else diagrams.forEach(figure=>visible.add(figure));
  document.addEventListener('capabilitychange',update);
  document.addEventListener('visibilitychange',update);

  update();
})();

