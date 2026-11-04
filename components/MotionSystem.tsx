'use client';
import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
export default function MotionSystem() {
 const [paused,setPaused]=useState(false);
 useEffect(()=>{setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches)},[]);
 useEffect(()=>{
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.dataset.motion=paused?'reduced':'full';
  if(paused) return;
  const mm=gsap.matchMedia();
  mm.add('(min-width: 1000px) and (prefers-reduced-motion: no-preference)',()=>{
   document.documentElement.dataset.cinematic='true';
   const lenis = new Lenis({duration:.75, smoothWheel:true, syncTouch:false, anchors:true});
   lenis.on('scroll',ScrollTrigger.update);
   const tick=(time:number)=>lenis.raf(time*1000);gsap.ticker.add(tick);
   const hero=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=850',pin:true,scrub:1,invalidateOnRefresh:true}});
   hero.to('.hero-title',{scale:1.42,xPercent:-8,yPercent:-12,ease:'none'},0)
    .to('.hero-orb',{y:-100,rotation:24,ease:'none'},0)
    .to('.hero',{backgroundColor:'#101010',color:'#F1F0EC',ease:'none'},.15)
    .to('.hero-title .dot',{color:'#E8B8D0'},.15)
    .to('.hero-bottom',{y:-20,ease:'none'},0);
   gsap.fromTo('.identity-statement',{x:36},{x:0,scrollTrigger:{trigger:'#about',start:'top 85%',end:'top 25%',scrub:1}});
   gsap.utils.toArray<HTMLElement>('.achievement-row').forEach(row=>{gsap.fromTo(row.querySelector('.achievement-rank'),{y:28},{y:0,scrollTrigger:{trigger:row,start:'top 90%',end:'top 45%',scrub:.7}})});
   const track=document.querySelector<HTMLElement>('.project-track'); const viewport=document.querySelector<HTMLElement>('.project-viewport');
   if(track && viewport){
    const distance=()=>Math.max(0,track.scrollWidth-viewport.clientWidth);
    gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{id:'project-gallery',trigger:'.project-scene',start:'top 70px',end:()=>`+=${distance()}`,pin:true,scrub:.8,invalidateOnRefresh:true}});
   }
   gsap.fromTo('.contact-title',{xPercent:-4},{xPercent:0,scrollTrigger:{trigger:'#contact',start:'top bottom',end:'top 25%',scrub:1}});
   const onAnchor=(event:MouseEvent)=>{
    const anchor=(event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]');
    if(!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const hash=anchor.hash; const target=hash ? document.getElementById(hash.slice(1)):null;
    if(target){event.preventDefault(); lenis.scrollTo(target,{offset:-80,onComplete:()=>{history.replaceState(null,'',hash);target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}})}
   };
   document.addEventListener('click',onAnchor);
   const focusProject=(e:FocusEvent)=>{
    const panel=(e.target as HTMLElement).closest<HTMLElement>('.project-panel');
    const trigger=ScrollTrigger.getById('project-gallery');
    if(panel&&trigger){const panels=Array.from(track?.children??[]);const index=panels.indexOf(panel);const ratio=index/Math.max(1,panels.length-1); lenis.scrollTo(trigger.start+(trigger.end-trigger.start)*ratio,{immediate:true})}
   };
   track?.addEventListener('focusin',focusProject);
   document.fonts.ready.then(()=>ScrollTrigger.refresh());
   return ()=>{delete document.documentElement.dataset.cinematic;document.removeEventListener('click',onAnchor);track?.removeEventListener('focusin',focusProject);gsap.ticker.remove(tick);lenis.destroy()};
  });
  return ()=>mm.revert();
 },[paused]);
 return <button className="motion-toggle mono" aria-pressed={paused} onClick={()=>setPaused(!paused)} title="Toggle cinematic motion" aria-label="Toggle cinematic motion">{paused?<Play size={12}/>:<Pause size={12}/>}<span>{paused?'MOTION OFF':'MOTION ON'}</span></button>
}
