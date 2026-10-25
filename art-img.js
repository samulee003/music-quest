/* 音符小勇者 — illustrated art layer (ChatGPT-generated sprites). Overrides the SVG fallbacks in art.js. */
(function(){
"use strict";
const A=window.ART;if(!A)return;
const img=(src,cls,w)=>`<img src="${src}" class="${cls}" alt="" draggable="false" ${w?`width="${w}"`:""} loading="eager" decoding="async">`;
A.hero=(v=0,cls="")=>img(`art/hero${v||0}.webp`,"hero-svg hero-img "+cls);
A.monster=(p,mood="angry",cls="")=>img(`art/mon-${p.img||p.id}-${mood==="happy"?"happy":"angry"}.webp`,"mon-svg mon-img "+(mood==="happy"?"is-happy ":"")+cls).replace("<img ",p.hue?`<img style="filter:hue-rotate(${p.hue}deg)" `:"<img ");
A.owl=(cls="")=>img("art/owl.webp","owl-svg owl-img "+cls);
A.animal=(kind,w=72)=>img(`art/${kind}.webp`,"animal-img",w);
A.drum=img("art/drum.webp","drum-img");
A.scene=ch=>img(`art/scene${ch===3?1:ch===4?0:ch}.webp`,"scene scene-img"+(ch===3?" scene-night":ch===4?" scene-gold":""));
/* preload so screens don't pop in */
window.addEventListener("load",()=>{const list=["hero0","hero1","hero2","hero3","owl","scene0","scene1","scene2","bird","bear","elephant","mouse","rabbit","turtle","drum"];
  list.forEach(n=>{const i=new Image();i.src=`art/${n}.webp`;});});
})();
