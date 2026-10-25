/* 音符小勇者 — art: heroes, monsters, mentor, scenes, music symbols (all SVG strings) */
(function(){
"use strict";
const INK="#24305e";
let uid=0;const U=p=>p+"_"+(++uid);

/* ---------------- heroes ---------------- */
const HEROES=[
 {id:0,hk:"小音",tw:"小音",base:"#ffc93c",light:"#fff1b8",cape:"#e63946",hat:"wizard",hatC:"#3a7bd5",acc:"#ffd23f"},
 {id:1,hk:"小拍",tw:"小拍",base:"#ff8a65",light:"#ffd3c2",cape:"#3a7bd5",hat:"cap",hatC:"#ffc93c",acc:"#fff"},
 {id:2,hk:"小調",tw:"小調",base:"#6fd08c",light:"#d4f7de",cape:"#8e5bd8",hat:"band",hatC:"#f4842d",acc:"#e63946"},
 {id:3,hk:"小琴",tw:"小琴",base:"#b49cf5",light:"#ece4ff",cape:"#ff6fa3",hat:"crown",hatC:"#ffc93c",acc:"#ff6fa3"}
];
function hat(h){
  const c=h.hatC;
  if(h.hat==="wizard")return `<path d="M40 50 L63 6 Q66 2 68 8 L80 50z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
   <path d="M63 6 q10 -2 12 8" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
   <path d="M60 30 l2 4 4.5 .6 -3.3 3 .8 4.4 -4-2.1 -4 2.1 .8-4.4 -3.3-3 4.5-.6z" fill="#ffd23f"/>
   <path d="M28 52 Q58 38 92 52 Q60 60 28 52z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if(h.hat==="cap")return `<path d="M30 54 Q30 26 60 24 Q90 26 90 54z" fill="${c}" stroke="${INK}" stroke-width="3.5"/>
   <path d="M86 50 Q106 48 110 56 Q98 60 86 56z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
   <circle cx="60" cy="24" r="4" fill="#e63946" stroke="${INK}" stroke-width="2.5"/>
   <path d="M44 40 q6-8 12 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
  if(h.hat==="band")return `<path d="M30 54 Q60 40 90 54 L89 62 Q60 48 31 62z" fill="${c}" stroke="${INK}" stroke-width="3"/>
   <path d="M84 50 Q102 22 92 8 Q86 30 80 48z" fill="#ffd23f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
   <path d="M86 44 Q93 28 92 14" fill="none" stroke="${INK}" stroke-width="2"/>`;
  return `<path d="M38 46 L42 22 L52 34 L60 16 L68 34 L78 22 L82 46 Q60 40 38 46z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
   <circle cx="60" cy="16" r="3.5" fill="#ff6fa3" stroke="${INK}" stroke-width="2"/><circle cx="42" cy="22" r="3" fill="#6fd08c" stroke="${INK}" stroke-width="2"/><circle cx="78" cy="22" r="3" fill="#3a7bd5" stroke="${INK}" stroke-width="2"/>
   <path d="M24 66 q-10 -10 -2 -16 q8 2 8 12z M24 66 q-12 4 -10 12 q8 2 10 -10z" fill="${h.acc}" stroke="${INK}" stroke-width="2.5"/>`;
}
function hero(v=0,cls=""){
  const h=HEROES[v]||HEROES[0],g=U("hg");
  return `<svg viewBox="0 0 120 120" class="hero-svg ${cls}" aria-hidden="true">
  <defs><radialGradient id="${g}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="${h.light}"/><stop offset=".55" stop-color="${h.base}"/><stop offset="1" stop-color="${h.base}"/></radialGradient></defs>
  <ellipse cx="60" cy="113" rx="32" ry="5" fill="rgba(20,30,70,.18)"/>
  <g class="h-bob">
   <path d="M34 72 Q16 98 28 110 L60 100 L92 110 Q104 98 86 72z" fill="${h.cape}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
   <ellipse cx="47" cy="107" rx="10" ry="5.5" fill="${INK}"/><ellipse cx="73" cy="107" rx="10" ry="5.5" fill="${INK}"/>
   <path d="M88 64 V20" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
   <path d="M88 20 q18 4 20 22 q-7-10-20-11z" fill="${INK}"/>
   <ellipse cx="60" cy="76" rx="31" ry="28" fill="url(#${g})" stroke="${INK}" stroke-width="3.5"/>
   <ellipse cx="48" cy="62" rx="10" ry="5" fill="#fff" opacity=".45" transform="rotate(-25 48 62)"/>
   <g class="h-eyes"><ellipse cx="50" cy="76" rx="5" ry="6.6" fill="${INK}"/><ellipse cx="70" cy="76" rx="5" ry="6.6" fill="${INK}"/>
    <circle cx="51.6" cy="73.6" r="2" fill="#fff"/><circle cx="71.6" cy="73.6" r="2" fill="#fff"/></g>
   <ellipse cx="40" cy="86" rx="5.5" ry="3.2" fill="#ff8fa3" opacity=".75"/><ellipse cx="80" cy="86" rx="5.5" ry="3.2" fill="#ff8fa3" opacity=".75"/>
   <path d="M53 87 q7 7 14 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
   ${hat(h)}
   <g class="h-arm"><path d="M30 84 L14 70" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M12 58 l3.2 6.4 7 1 -5.1 5 1.2 7 -6.3-3.3 -6.3 3.3 1.2-7 -5.1-5 7-1z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></g>
  </g></svg>`;
}

/* ---------------- monsters ---------------- */
const SHAPES=[
 {d:"M18 106 Q8 62 32 38 Q60 16 88 38 Q112 62 102 106 Q92 96 81 106 Q70 96 60 106 Q50 96 39 106 Q28 96 18 106z",ey:62,top:32,mouthY:80},
 {d:"M60 26 C96 26 104 56 102 74 C100 98 84 106 60 106 C36 106 20 98 18 74 C16 56 24 26 60 26z",ey:62,top:28,mouthY:82},
 {d:"M28 106 Q22 36 60 22 Q98 36 92 106 Q60 112 28 106z",ey:58,top:24,mouthY:78},
 {d:"M10 104 Q10 54 60 48 Q110 54 110 104 Q60 114 10 104z",ey:74,top:50,mouthY:90}
];
function tops(t,c,c2,sh){
  const y=sh.top;
  if(t==="horns")return `<path d="M36 ${y+14} Q26 ${y-8} 38 ${y-16} Q40 ${y} 48 ${y+8}z M84 ${y+14} Q94 ${y-8} 82 ${y-16} Q80 ${y} 72 ${y+8}z" fill="${c2}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if(t==="antenna")return `<path d="M50 ${y+4} Q44 ${y-14} 36 ${y-18} M70 ${y+4} Q76 ${y-14} 84 ${y-18}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><circle cx="36" cy="${y-19}" r="6" fill="${c2}" stroke="${INK}" stroke-width="3"/><circle cx="84" cy="${y-19}" r="6" fill="${c2}" stroke="${INK}" stroke-width="3"/>`;
  if(t==="ears")return `<path d="M30 ${y+22} Q18 ${y-6} 34 ${y-4} Q44 ${y+4} 46 ${y+12}z M90 ${y+22} Q102 ${y-6} 86 ${y-4} Q76 ${y+4} 74 ${y+12}z" fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><path d="M33 ${y+12} Q30 ${y+2} 36 ${y+2} M87 ${y+12} Q90 ${y+2} 84 ${y+2}" stroke="${c2}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
  if(t==="spikes")return `<path d="M34 ${y+12} L40 ${y-8} L50 ${y+4} L60 ${y-12} L70 ${y+4} L80 ${y-8} L86 ${y+12}z" fill="${c2}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if(t==="leaf")return `<path d="M60 ${y+4} Q58 ${y-10} 60 ${y-14}" stroke="${INK}" stroke-width="3.5" fill="none"/><path d="M60 ${y-12} Q76 ${y-30} 90 ${y-20} Q78 ${y-4} 60 ${y-12}z" fill="${c2}" stroke="${INK}" stroke-width="3"/>`;
  if(t==="crown")return `<path d="M34 ${y+10} L32 ${y-18} L46 ${y-4} L60 ${y-24} L74 ${y-4} L88 ${y-18} L86 ${y+10}z" fill="#ffd23f" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="60" cy="${y-8}" r="4.5" fill="#e63946" stroke="${INK}" stroke-width="2"/>`;
  if(t==="swirl")return `<path d="M60 ${y+6} q-2 -18 12 -20 q12 0 8 10 q-4 6 -10 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  return "";
}
function eyes(n,ey,mood){
  const xs=n===1?[60]:n===3?[42,60,78]:[46,74], r=n===1?13:n===3?8:10;
  if(mood==="happy")return xs.map(x=>`<path d="M${x-r*.7} ${ey+2} q${r*.7} -${r} ${r*1.4} 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`).join("");
  let s=xs.map((x,i)=>`<circle cx="${x}" cy="${ey}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3"/><circle class="m-pupil" cx="${x-2}" cy="${ey+2}" r="${r*.45}" fill="${INK}"/><circle cx="${x-4}" cy="${ey-1}" r="${r*.16}" fill="#fff"/>`).join("");
  const l=xs[0]-r, rr=xs[xs.length-1]+r;
  s+=`<path d="M${l-2} ${ey-r-8} L${l+r*1.4} ${ey-r-1} M${rr+2} ${ey-r-8} L${rr-r*1.4} ${ey-r-1}" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`;
  return s;
}
function mouth(y,mood,teeth){
  if(mood==="happy")return `<path d="M46 ${y-2} Q60 ${y+14} 74 ${y-2}z" fill="#ff7d8c" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="34" cy="${y-6}" rx="6" ry="3.5" fill="#ff8fa3" opacity=".8"/><ellipse cx="86" cy="${y-6}" rx="6" ry="3.5" fill="#ff8fa3" opacity=".8"/>`;
  if(teeth)return `<path d="M42 ${y} Q60 ${y+16} 78 ${y} Q60 ${y+6} 42 ${y}z" fill="#5a1730" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M48 ${y+3} l4 6 4-5 M64 ${y+4} l4 5 4-6" fill="#fff" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  return `<path d="M44 ${y+4} l8 -6 8 6 8 -6 8 6" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function monster(p,mood="angry",cls=""){
  const sh=SHAPES[p.shape||0],g=U("mg"),c=p.c,c2=p.c2||"#fff";
  const boss=p.boss?`<path d="M14 92 Q4 70 22 54 L30 100z M106 92 Q116 70 98 54 L90 100z" fill="${p.cape||"#5b2a86"}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`:"";
  const happyNote=mood==="happy"?`<g class="m-note"><path d="M98 34 V12 q10 2 12 12" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="94" cy="35" rx="6" ry="4.5" fill="${c}" stroke="${INK}" stroke-width="2.5" transform="rotate(-20 94 35)"/></g>
    <path d="M18 30 l2 5 5 1 -4 3 1 5 -4-3 -4 3 1-5 -4-3 5-1z" fill="#ffd23f"/>`:"";
  const sym=p.sym&&mood!=="happy"?`<text x="96" y="${sh.top+2}" font-size="22" font-weight="700" fill="${INK}" font-family="Noto Music,Georgia,serif" transform="rotate(18 96 ${sh.top})">${p.sym}</text>`:"";
  return `<svg viewBox="0 0 120 120" class="mon-svg ${cls}" aria-hidden="true">
   <defs><radialGradient id="${g}" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>
   <ellipse cx="60" cy="112" rx="38" ry="6" fill="rgba(20,30,70,.2)"/>
   <g class="m-bob">${boss}${tops(p.top,c,c2,sh)}
   <path d="${sh.d}" fill="${c}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
   <path d="${sh.d}" fill="url(#${g})"/>
   ${p.belly?`<ellipse cx="60" cy="${sh.mouthY+12}" rx="20" ry="11" fill="${c2}" opacity=".7"/>`:""}
   ${p.spots?`<circle cx="30" cy="${sh.ey+22}" r="4" fill="${c2}" opacity=".8"/><circle cx="92" cy="${sh.ey+18}" r="5" fill="${c2}" opacity=".8"/><circle cx="86" cy="${sh.ey+32}" r="3" fill="${c2}" opacity=".8"/>`:""}
   ${eyes(p.eyes||2,sh.ey,mood)}${mouth(sh.mouthY,mood,p.teeth)}${sym}${happyNote}</g></svg>`;
}

/* ---------------- mentor owl ---------------- */
function owl(cls=""){
  return `<svg viewBox="0 0 120 120" class="owl-svg ${cls}" aria-hidden="true">
  <ellipse cx="60" cy="113" rx="30" ry="5" fill="rgba(20,30,70,.18)"/>
  <g class="h-bob">
  <path d="M26 60 Q14 86 30 104 L42 80z M94 60 Q106 86 90 104 L78 80z" fill="#8a5a3b" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <ellipse cx="60" cy="72" rx="34" ry="38" fill="#b07a52" stroke="${INK}" stroke-width="3.5"/>
  <ellipse cx="60" cy="84" rx="22" ry="22" fill="#f3d9b5"/>
  <path d="M50 78 q4 4 0 8 M60 80 q4 4 0 8 M70 78 q4 4 0 8" stroke="#c9a77d" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="46" cy="56" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="74" cy="56" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/>
  <g class="h-eyes"><circle cx="47" cy="57" r="5.5" fill="${INK}"/><circle cx="73" cy="57" r="5.5" fill="${INK}"/><circle cx="48.5" cy="55" r="1.8" fill="#fff"/><circle cx="74.5" cy="55" r="1.8" fill="#fff"/></g>
  <path d="M33 56 h-6 M87 56 h6 M59 56 h2" stroke="${INK}" stroke-width="3"/>
  <path d="M55 66 L60 74 L65 66z" fill="#ffb300" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M24 34 L60 22 L96 34 L60 46z" fill="${INK}"/><path d="M40 40 v10 q20 8 40 0 v-10" fill="${INK}"/>
  <path d="M90 34 v18" stroke="#ffd23f" stroke-width="3"/><circle cx="90" cy="54" r="4" fill="#ffd23f"/>
  <ellipse cx="44" cy="110" rx="8" ry="4" fill="#ffb300" stroke="${INK}" stroke-width="2.5"/><ellipse cx="76" cy="110" rx="8" ry="4" fill="#ffb300" stroke="${INK}" stroke-width="2.5"/>
  </g></svg>`;
}

/* ---------------- scenes ---------------- */
function scene(ch){
  const g=U("sk");
  if(ch===0)return `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice" class="scene" aria-hidden="true">
   <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="1" stop-color="#d6f0ff"/></linearGradient></defs>
   <rect width="400" height="220" fill="url(#${g})"/>
   <circle cx="340" cy="44" r="26" fill="#ffe066"/><circle cx="340" cy="44" r="36" fill="#ffe066" opacity=".25"/>
   <g fill="#fff" class="cloud"><ellipse cx="70" cy="46" rx="34" ry="13"/><ellipse cx="90" cy="38" rx="20" ry="14"/><ellipse cx="220" cy="30" rx="28" ry="10"/><ellipse cx="236" cy="24" rx="16" ry="11"/></g>
   <path d="M0 150 Q80 104 170 140 T400 128 V220 H0z" fill="#9be08f"/>
   <path d="M0 176 Q110 140 220 170 T400 160 V220 H0z" fill="#6fcf7c"/>
   <path d="M0 200 Q140 182 260 198 T400 194 V220 H0z" fill="#4fb565"/>
   <g>${[30,64,120,188,250,300,356].map((x,i)=>`<circle cx="${x}" cy="${186+(i%3)*8}" r="4" fill="${["#ff6fa3","#ffd23f","#fff","#ff8a65"][i%4]}"/><circle cx="${x}" cy="${186+(i%3)*8}" r="1.6" fill="#ffb300"/>`).join("")}</g>
   </svg>`;
  if(ch===1)return `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice" class="scene" aria-hidden="true">
   <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fc7c0"/><stop offset="1" stop-color="#cdf3e6"/></linearGradient></defs>
   <rect width="400" height="220" fill="url(#${g})"/>
   ${[0,1,2,3,4].map(k=>`<path d="M0 ${40+k*9} Q100 ${30+k*9} 200 ${44+k*9} T400 ${38+k*9}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".55"/>`).join("")}
   <text x="60" y="66" font-size="22" fill="#fff" opacity=".8" font-family="Noto Music,serif">♪</text><text x="300" y="58" font-size="20" fill="#fff" opacity=".8" font-family="Noto Music,serif">♫</text>
   ${[[20,150,40],[70,140,52],[340,138,54],[385,150,40],[150,156,34],[260,152,38]].map(([x,y,s])=>`<rect x="${x-4}" y="${y}" width="8" height="${s*.7}" fill="#7a5233"/><circle cx="${x}" cy="${y-s*.25}" r="${s*.48}" fill="#2f9e6e"/><circle cx="${x-s*.18}" cy="${y-s*.35}" r="${s*.22}" fill="#45b883"/>`).join("")}
   <path d="M0 176 Q120 160 220 174 T400 168 V220 H0z" fill="#3c9a62"/>
   <path d="M0 200 Q140 188 260 200 T400 196 V220 H0z" fill="#2c7d4f"/>
   ${[[110,190],[200,184],[310,192]].map(([x,y])=>`<rect x="${x-2}" y="${y-8}" width="4" height="9" fill="#fff"/><ellipse cx="${x}" cy="${y-9}" rx="9" ry="6" fill="#e63946"/><circle cx="${x-3}" cy="${y-10}" r="1.6" fill="#fff"/><circle cx="${x+3}" cy="${y-8}" r="1.3" fill="#fff"/>`).join("")}
   </svg>`;
  return `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice" class="scene" aria-hidden="true">
   <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a78"/><stop offset=".6" stop-color="#8e5bd8"/><stop offset="1" stop-color="#ffb3c7"/></linearGradient></defs>
   <rect width="400" height="220" fill="url(#${g})"/>
   ${[[30,24],[90,50],[150,18],[230,40],[300,20],[370,52],[60,80],[340,86]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#fff" class="twinkle"/>`).join("")}
   <circle cx="320" cy="50" r="18" fill="#fff6cf"/><circle cx="328" cy="44" r="16" fill="#5a3f9e" opacity=".55"/>
   <g fill="#4a2f80" stroke="#2a1b52" stroke-width="2">
    <rect x="150" y="96" width="100" height="90"/><rect x="134" y="70" width="30" height="116"/><rect x="236" y="70" width="30" height="116"/><rect x="186" y="56" width="28" height="60"/>
    <path d="M130 70 L149 40 L168 70z M232 70 L251 40 L270 70z M182 56 L200 24 L218 56z"/>
   </g>
   <path d="M186 186 v-30 q14 -16 28 0 v30z" fill="#2a1b52"/>
   ${[[146,92],[248,92],[196,74]].map(([x,y])=>`<rect x="${x}" y="${y}" width="8" height="12" rx="4" fill="#ffd23f"/>`).join("")}
   <path d="M200 24 v-14 l12 4 -12 4" fill="#ff6fa3" stroke="#2a1b52" stroke-width="1.5"/>
   <path d="M0 184 Q120 170 220 182 T400 176 V220 H0z" fill="#6b4fb0"/>
   <path d="M0 204 Q140 194 260 204 T400 200 V220 H0z" fill="#4e3690"/>
   </svg>`;
}

/* ---------------- music symbols ---------------- */
function noteSym(t,c=INK,w=64){
  const head=(cx,cy,fill)=>`<ellipse cx="${cx}" cy="${cy}" rx="13" ry="9.5" transform="rotate(-20 ${cx} ${cy})" fill="${fill?c:"#fff"}" stroke="${c}" stroke-width="4"/>`;
  const stem=x=>`<rect x="${x}" y="12" width="4.5" height="62" rx="1" fill="${c}"/>`;
  let b="",vb="0 0 70 96";
  switch(t){
   case "whole":b=`<ellipse cx="35" cy="62" rx="18" ry="12" fill="#fff" stroke="${c}" stroke-width="6"/>`;break;
   case "half":b=head(30,74,false)+stem(39.5);break;
   case "dhalf":b=head(26,74,false)+stem(35.5)+`<circle cx="52" cy="72" r="5" fill="${c}"/>`;vb="0 0 70 96";break;
   case "quarter":b=head(30,74,true)+stem(39.5);break;
   case "eighth":b=head(26,74,true)+stem(35.5)+`<path d="M38 12 q20 8 18 32 q-4 -14 -18 -16z" fill="${c}"/>`;break;
   case "eighths":vb="0 0 84 96";b=head(18,76,true)+head(58,76,true)+`<rect x="27.5" y="16" width="4.5" height="60" fill="${c}"/><rect x="67.5" y="16" width="4.5" height="60" fill="${c}"/><rect x="27.5" y="14" width="44.5" height="10" fill="${c}"/>`;break;
   case "s4":vb="0 0 120 96";b=[0,1,2,3].map(k=>head(14+k*28,76,true)).join("")+[0,1,2,3].map(k=>`<rect x="${23.5+k*28}" y="16" width="4" height="60" fill="${c}"/>`).join("")+`<rect x="23.5" y="14" width="88" height="8" fill="${c}"/><rect x="23.5" y="27" width="88" height="8" fill="${c}"/>`;break;
   case "tie":vb="0 0 100 96";b=head(24,70,true)+head(70,70,true)+`<rect x="33.5" y="10" width="4.5" height="60" fill="${c}"/><rect x="79.5" y="10" width="4.5" height="60" fill="${c}"/><path d="M26 84 Q47 98 68 84 Q47 92 26 84z" fill="${c}" stroke="${c}" stroke-width="2"/>`;break;
   case "qrest":b=`<path d="M28 14 L44 34 Q34 44 38 54 L48 68 Q36 62 30 70 Q28 80 40 88 Q20 82 22 68 Q26 58 38 60 L26 46 Q36 36 34 28z" fill="${c}"/>`;break;
   case "hrest":vb="0 0 80 96";b=`<line x1="8" x2="72" y1="38" y2="38" stroke="${c}" stroke-width="2.5" opacity=".45"/><line x1="8" x2="72" y1="58" y2="58" stroke="${c}" stroke-width="3"/><rect x="24" y="46" width="32" height="12" fill="${c}"/>`;break;
   case "wrest":vb="0 0 80 96";b=`<line x1="8" x2="72" y1="38" y2="38" stroke="${c}" stroke-width="3"/><line x1="8" x2="72" y1="58" y2="58" stroke="${c}" stroke-width="2.5" opacity=".45"/><rect x="24" y="38" width="32" height="12" fill="${c}"/>`;break;
  }
  return `<svg viewBox="${vb}" width="${w}" style="max-width:100%;height:auto" aria-hidden="true">${b}</svg>`;
}
/* accidentals drawn as paths so they never depend on a font. (x,y) = centre on the note's line/space */
function accPath(t,x,y){
  if(t==="#")return `<g class="accd-p" transform="translate(${x} ${y})"><path d="M-4 -15 V15 M4 -17 V13" stroke="${INK}" stroke-width="2.2"/><path d="M-9 -3 L9 -8 V-4 L-9 1z M-9 7 L9 2 V6 L-9 11z" fill="${INK}"/></g>`;
  if(t==="b")return `<g class="accd-p" transform="translate(${x} ${y})"><path d="M-5 -22 V8" stroke="${INK}" stroke-width="2.4"/><path d="M-5 8 C4 2 9 -4 3 -6 C-1 -7 -4 -4 -5 -2" fill="none" stroke="${INK}" stroke-width="3"/></g>`;
  return `<g class="accd-p" transform="translate(${x} ${y})"><path d="M-5 -16 V7 M5 -7 V16" stroke="${INK}" stroke-width="2.2"/><path d="M-5 -1 L5 -5 V-1 L-5 3z M-5 9 L5 5 V9 L-5 13z" fill="${INK}" transform="translate(0 -4)"/></g>`;
}
/* staff. Notes use step (0 = C4, treble) or dn (diatonic number, C4 = 28). Clef: "treble" (default), "bass" or false (bare lines). */
const GAP=16,BOT=118;
const yOf=s=>BOT-(s-2)*GAP/2;
function staff(o={}){
  const W=o.w||360,x0=o.x0??92,notes=o.notes||[],clef=o.clef===undefined?"treble":o.clef;
  const L1=clef==="bass"?18:30; /* diatonic number of the bottom line: G2 for bass, E4 for treble */
  const Y=dn=>BOT-(dn-L1)*GAP/2;
  let s=`<svg class="staff" viewBox="0 0 ${W} 170" role="img" aria-label="五線譜" style="width:100%;max-width:${o.max||440}px">`;
  if(o.spaces)for(let k=1;k<=4;k++){const y=BOT-k*GAP;s+=`<rect class="sp" data-sp="${k}" x="8" y="${y}" width="${W-16}" height="${GAP}" rx="3"/>`;}
  for(let k=1;k<=5;k++){const y=BOT-(k-1)*GAP;s+=`<line class="ln" data-ln="${k}" x1="8" x2="${W-8}" y1="${y}" y2="${y}"/>`;
    if(o.nums)s+=`<text x="${W-2}" y="${y+5}" font-size="13" text-anchor="end" class="lnum">${k}</text>`;}
  if(o.spaceNums)for(let k=1;k<=4;k++)s+=`<text x="${W-2}" y="${BOT-(k-1)*GAP-GAP/2+5}" font-size="12" text-anchor="end" class="snum">${k}</text>`;
  if(clef==="treble")s+=`<text class="clef" x="10" y="${BOT+20}" font-size="${GAP*6}">𝄞</text>`;
  if(clef==="bass")s+=`<text class="clef" x="12" y="${BOT-GAP*1.1}" font-size="${GAP*4.3}">𝄢</text>`;
  if(o.key){const KS={G:[["#",38,20]],D:[["#",38,18],["#",35,36]],F:[["b",34,20]]},off=clef==="bass"?-14:0;
    (KS[o.key]||[]).forEach(([t,dn,dx])=>{s+=accPath(t,(clef===false?20:62)+dx,Y(dn+off));});}
  if(o.meter)s+=`<text x="64" y="${BOT-GAP*2-2}" class="meter">${o.meter[0]}</text><text x="64" y="${BOT+2}" class="meter">${o.meter[1]}</text>`;
  if(o.bars)o.bars.forEach(x=>s+=`<line x1="${x}" x2="${x}" y1="${BOT-GAP*4}" y2="${BOT}" stroke="${INK}" stroke-width="2.5"/>`);
  const n=notes.length, span=W-x0-28;
  notes.forEach((nt,i)=>{
    const dn=nt.dn??(28+nt.step),x=nt.x??(n===1?x0+span/2:x0+i*(span/(n-1))),y=Y(dn),col=nt.color||INK;
    for(let l=L1-2;l>=dn;l-=2)s+=`<line x1="${x-17}" x2="${x+17}" y1="${Y(l)}" y2="${Y(l)}" stroke="${INK}" stroke-width="2.4"/>`;
    for(let l=L1+10;l<=dn;l+=2)s+=`<line x1="${x-17}" x2="${x+17}" y1="${Y(l)}" y2="${Y(l)}" stroke="${INK}" stroke-width="2.4"/>`;
    s+=`<g class="nh" data-i="${i}" ${nt.id?`id="${nt.id}"`:""}>`;
    if(nt.acc)s+=accPath(nt.acc,x-24,y);
    if(nt.stem!==false){const up=dn<L1+4;s+=up?`<rect x="${x+8}" y="${y-50}" width="3" height="50" fill="${INK}"/>`:`<rect x="${x-11}" y="${y}" width="3" height="50" fill="${INK}"/>`;}
    s+=`<ellipse cx="${x}" cy="${y}" rx="10.5" ry="8" transform="rotate(-20 ${x} ${y})" fill="${col}" stroke="${INK}" stroke-width="2.2"/>`;
    if(nt.label)s+=`<text x="${x}" y="${164}" font-size="15" text-anchor="middle" class="nlabel">${nt.label}</text>`;
    s+=`</g>`;
  });
  return s+`</svg>`;
}
/* one-octave keyboard C..C (13 semitones). hi: {semitone: color}, labels: {semitone: text} */
function keyboard(o={}){
  const hi=o.hi||{},lab=o.labels||{},WW=34,H=110,whites=[0,2,4,5,7,9,11,12],blacks={1:1,3:2,6:4,8:5,10:6};
  let s=`<svg class="kbd" viewBox="0 0 ${WW*8+4} ${H+26}" style="width:100%;max-width:${o.max||320}px" aria-hidden="true">`;
  whites.forEach((st,i)=>{s+=`<rect class="wk" data-s="${st}" x="${2+i*WW}" y="2" width="${WW}" height="${H}" rx="5" fill="${hi[st]||"#fff"}" stroke="${INK}" stroke-width="2.5"/>`;
    if(lab[st])s+=`<text x="${2+i*WW+WW/2}" y="${H+20}" font-size="14" text-anchor="middle" class="nlabel">${lab[st]}</text>`;});
  for(const st in blacks){const i=blacks[st];s+=`<rect class="bk" data-s="${st}" x="${2+i*WW-11}" y="2" width="22" height="${H*.62}" rx="4" fill="${hi[st]||INK}" stroke="${INK}" stroke-width="2"/>`;
    if(lab[st])s+=`<text x="${2+i*WW}" y="${H*.62-6}" font-size="12" text-anchor="middle" fill="#fff" font-weight="700">${lab[st]}</text>`;}
  return s+`</svg>`;
}
function artic(k,w=110){
  const n=(x,y=62,fill=true)=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="8" transform="rotate(-20 ${x} ${y})" fill="${fill?INK:"#fff"}" stroke="${INK}" stroke-width="3"/><rect x="${x+8}" y="${y-48}" width="3.5" height="48" fill="${INK}"/>`;
  let b="";
  if(k==="staccato")b=n(30)+n(80)+`<circle cx="30" cy="82" r="4.5" fill="${INK}"/><circle cx="80" cy="82" r="4.5" fill="${INK}"/>`;
  if(k==="accent")b=n(55)+`<path d="M38 88 L72 80 L38 72" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(k==="slur")b=n(22,66)+n(55,58)+n(88,50)+`<path d="M18 84 Q55 104 92 70" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  if(k==="repeat")b=`<rect x="40" y="20" width="4" height="64" fill="${INK}"/><rect x="52" y="20" width="10" height="64" fill="${INK}"/><circle cx="28" cy="44" r="5" fill="${INK}"/><circle cx="28" cy="60" r="5" fill="${INK}"/>`+[20,36,52,68,84].map(y=>`<line x1="0" x2="70" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="1.5" opacity=".45"/>`).join("");
  if(k==="rit")return `<span class="term">rit.</span>`;
  return `<svg viewBox="0 0 110 100" width="${w}" style="max-width:100%;height:auto" aria-hidden="true">${b}</svg>`;
}
function dynMark(m,size=44){
  if(m==="cresc")return `<svg viewBox="0 0 120 50" width="${size*2.2}" aria-hidden="true"><path d="M10 25 L110 8 M10 25 L110 42" stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`;
  if(m==="dim")return `<svg viewBox="0 0 120 50" width="${size*2.2}" aria-hidden="true"><path d="M110 25 L10 8 M110 25 L10 42" stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`;
  return `<span class="dyn" style="font-size:${size}px">${m}</span>`;
}
function contour(pts,w=110){
  /* pts: array of levels 0..4 */
  const n=pts.length,dx=(w-24)/(n-1);
  let p="",c="";
  pts.forEach((v,i)=>{const x=12+i*dx,y=60-v*11;p+=(i?"L":"M")+x+" "+y;c+=`<circle cx="${x}" cy="${y}" r="7" fill="#ff8a65" stroke="${INK}" stroke-width="2.5"/>`;});
  return `<svg viewBox="0 0 ${w} 72" width="${w}" aria-hidden="true"><path d="${p}" stroke="${INK}" stroke-width="3" fill="none" stroke-dasharray="5 4"/>${c}</svg>`;
}
function animal(kind,w=72){
  const A={
   bird:`<ellipse cx="50" cy="58" rx="28" ry="24" fill="#4fc3f7" stroke="${INK}" stroke-width="3.5"/><path d="M44 56 q-14 -2 -22 10 q14 4 22 -2z" fill="#29a3d9" stroke="${INK}" stroke-width="3"/><circle cx="62" cy="50" r="5" fill="${INK}"/><circle cx="63.5" cy="48.5" r="1.6" fill="#fff"/><path d="M76 54 l14 3 -14 5z" fill="#ffb300" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M44 82 v8 M56 82 v8" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`,
   bear:`<circle cx="26" cy="28" r="12" fill="#9c6b45" stroke="${INK}" stroke-width="3.5"/><circle cx="74" cy="28" r="12" fill="#9c6b45" stroke="${INK}" stroke-width="3.5"/><ellipse cx="50" cy="56" rx="36" ry="34" fill="#b07c52" stroke="${INK}" stroke-width="3.5"/><ellipse cx="50" cy="68" rx="16" ry="12" fill="#e8c39e" stroke="${INK}" stroke-width="3"/><circle cx="37" cy="48" r="4.5" fill="${INK}"/><circle cx="63" cy="48" r="4.5" fill="${INK}"/><ellipse cx="50" cy="63" rx="6" ry="4" fill="${INK}"/>`,
   elephant:`<ellipse cx="22" cy="44" rx="16" ry="20" fill="#a7b4c9" stroke="${INK}" stroke-width="3.5"/><ellipse cx="78" cy="44" rx="16" ry="20" fill="#a7b4c9" stroke="${INK}" stroke-width="3.5"/><ellipse cx="50" cy="50" rx="28" ry="28" fill="#c2cde0" stroke="${INK}" stroke-width="3.5"/><path d="M44 64 Q40 86 54 94 Q60 92 56 86 Q50 80 56 64z" fill="#c2cde0" stroke="${INK}" stroke-width="3.5"/><circle cx="40" cy="46" r="4" fill="${INK}"/><circle cx="60" cy="46" r="4" fill="${INK}"/><path d="M82 18 l6-8 M90 26 l9-3 M86 22 l8-6" stroke="#e63946" stroke-width="3.5" stroke-linecap="round"/>`,
   mouse:`<circle cx="30" cy="40" r="13" fill="#d7d2cc" stroke="${INK}" stroke-width="3"/><circle cx="70" cy="40" r="13" fill="#d7d2cc" stroke="${INK}" stroke-width="3"/><circle cx="30" cy="40" r="6" fill="#ffb3c1"/><circle cx="70" cy="40" r="6" fill="#ffb3c1"/><ellipse cx="50" cy="62" rx="24" ry="20" fill="#e8e4df" stroke="${INK}" stroke-width="3"/><circle cx="42" cy="58" r="3" fill="${INK}"/><circle cx="58" cy="58" r="3" fill="${INK}"/><circle cx="50" cy="68" r="3.5" fill="#ff8fa3"/><path d="M50 72 v4" stroke="${INK}" stroke-width="2"/><text x="78" y="86" font-size="14" fill="${INK}" font-weight="700">zz</text>`,
   rabbit:`<ellipse cx="38" cy="22" rx="8" ry="20" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="62" cy="22" rx="8" ry="20" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="50" cy="60" rx="26" ry="24" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="41" cy="56" r="3.5" fill="${INK}"/><circle cx="59" cy="56" r="3.5" fill="${INK}"/><circle cx="50" cy="65" r="3" fill="#ff8fa3"/><path d="M8 52 h14 M4 62 h16 M8 72 h14" stroke="#3a7bd5" stroke-width="3.5" stroke-linecap="round"/>`,
   turtle:`<ellipse cx="48" cy="62" rx="30" ry="20" fill="#6fcf7c" stroke="${INK}" stroke-width="3.5"/><path d="M30 58 l10-10 h16 l10 10 -10 10 h-16z" fill="#4fb565" stroke="${INK}" stroke-width="2"/><circle cx="86" cy="58" r="10" fill="#a8e6a1" stroke="${INK}" stroke-width="3"/><circle cx="89" cy="55" r="2.5" fill="${INK}"/><ellipse cx="30" cy="80" rx="7" ry="5" fill="#a8e6a1" stroke="${INK}" stroke-width="2.5"/><ellipse cx="66" cy="80" rx="7" ry="5" fill="#a8e6a1" stroke="${INK}" stroke-width="2.5"/>`
  };
  return `<svg viewBox="0 0 100 100" width="${w}" aria-hidden="true">${A[kind]||""}</svg>`;
}
const spk=`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="${INK}"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const drum=`<svg viewBox="0 0 120 100" aria-hidden="true"><ellipse cx="60" cy="74" rx="50" ry="18" fill="#c0392b" stroke="${INK}" stroke-width="4"/><rect x="10" y="34" width="100" height="40" fill="#e74c3c" stroke="${INK}" stroke-width="4"/><path d="M10 34 L30 74 L50 34 L70 74 L90 34 L110 74" stroke="#ffd23f" stroke-width="4" fill="none"/><ellipse cx="60" cy="34" rx="50" ry="18" fill="#fff4e0" stroke="${INK}" stroke-width="4"/></svg>`;

window.ART={INK,HEROES,hero,monster,owl,scene,noteSym,staff,keyboard,artic,yOf,dynMark,contour,animal,spk,drum};
})();
