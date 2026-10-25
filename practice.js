/* 音符小勇者 — 練習室: formal staff notation + real instrument technique (piano keys & finger numbers, violin strings & fingers).
   Loaded after game.js wiring: window.MQ_PRACTICE(api) returns {open, instName}. */
(function(){
"use strict";
const INK="#24305e";
const LET=["C","D","E","F","G","A","B"],PC={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
const FLAT=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
/* pitch helpers. "F#4" → {l:"F",acc:"#",oct:4,dn,midi} ; dn = diatonic number (C4 = 28) */
function P(p){const m=/^([A-G])(#|b|n)?(\d)$/.exec(p);const l=m[1],acc=m[2]||"",oct=+m[3];
  return {p,l,acc,oct,dn:oct*7+LET.indexOf(l),midi:12*(oct+1)+PC[l]+(acc==="#"?1:acc==="b"?-1:0)};}
const sampleName=midi=>FLAT[midi%12]+(Math.floor(midi/12)-1);
const KEYS={C:{},G:{F:"#"},D:{F:"#",C:"#"},A:{F:"#",C:"#",G:"#"},F:{B:"b"}};
const KSPOS={"#":{F:38,C:35,G:39,D:36,A:33},"b":{B:34,E:37,A:33}};
const KEYNAME={C:["C 大調","C 大調"],G:["G 大調","G 大調"],D:["D 大調","D 大調"],A:["A 大調","A 大調"],F:["F 大調","F 大調"]};
const BEATS={w:4,dh:3,h:2,dq:1.5,q:1,e:.5,qr:1,hr:2,wr:4};

window.MQ_PRACTICE=function(api){
const {L,$,$$,show,speak,hush,play,ac,ART,burst,center,reanim,SFX,buzz,wait,RM,starRow,esc,icon,topbar,bindTop}=api;
const S=()=>api.getS();
const solf=l=>({C:"Do",D:"Re",E:"Mi",F:"Fa",G:L("So","Sol"),A:"La",B:L("Ti","Si")})[l];
const accTxt=a=>a==="#"?"♯":a==="b"?"♭":"";
const nm=p=>{const x=P(p);return solf(x.l)+accTxt(x.acc);};
const nmFull=p=>{const x=P(p);return `${x.l}${accTxt(x.acc)}（${nm(p)}）`;};
let TOKP=0;const liveP=t=>t===TOKP;
const rec=()=>{const s=S();s.practice=s.practice||{drills:{},songs:{}};return s.practice;};

/* ================= notation: formal score renderer ================= */
/* staff geometry inside each system svg */
const G_=10,TOP=50,BOT_=90;
function yOf(dn,clef){const L1=clef==="bass"?18:30;return BOT_-(dn-L1)*G_/2;}
function accGlyph(t,x,y,s=1){
  if(t==="#")return `<g transform="translate(${x} ${y}) scale(${s*.62})"><path d="M-4 -15 V15 M4 -17 V13" stroke="${INK}" stroke-width="2.6"/><path d="M-9 -3 L9 -8 V-4 L-9 1z M-9 7 L9 2 V6 L-9 11z" fill="${INK}"/></g>`;
  if(t==="b")return `<g transform="translate(${x} ${y}) scale(${s*.62})"><path d="M-5 -22 V8" stroke="${INK}" stroke-width="2.8"/><path d="M-5 8 C4 2 9 -4 3 -6 C-1 -7 -4 -4 -5 -2" fill="none" stroke="${INK}" stroke-width="3.4"/></g>`;
  return `<g transform="translate(${x} ${y}) scale(${s*.62})"><path d="M-5 -16 V7 M5 -7 V16" stroke="${INK}" stroke-width="2.6"/><path d="M-5 -1 L5 -5 V-1 L-5 3z M-5 9 L5 5 V9 L-5 13z" fill="${INK}" transform="translate(0 -4)"/></g>`;
}
function clefGlyph(clef){return clef==="bass"?`<text class="clef" x="4" y="${BOT_-G_*1.05}" font-size="${G_*4.2}">𝄢</text>`:`<text class="clef" x="1" y="${BOT_+12}" font-size="${G_*5.8}">𝄞</text>`;}
function keySig(key,clef,x){let s="",n=0;const k=KEYS[key]||{},off=clef==="bass"?-14:0;
  const order=Object.values(k)[0]==="b"?["B","E","A"]:["F","C","G","D","A"];
  for(const l of order)if(k[l]){s+=accGlyph(k[l],x+n*9,yOf(KSPOS[k[l]][l]+off,clef));n++;}
  return {svg:s,w:n*9+(n?6:0)};}

/* o: {clef,key,meter:[4,4],notes:[{p,d,f}],showF,showN,cur,marks:{i:"ok"|"miss"},W} → html (one svg per system) */
function score(o){
  const clef=o.clef||"treble",key=o.key||"C",meter=o.meter||[4,4],W=o.W||360,ks=KEYS[key]||{};
  const perBar=meter[0]*(meter[1]===8?.5:1);
  /* split into bars */
  const bars=[];let cur=[],acc=0;o.notes.forEach((n,i)=>{cur.push({...n,i});acc+=BEATS[n.d];if(acc>=perBar-1e-6){bars.push(cur);cur=[];acc=0;}});if(cur.length)bars.push(cur);
  const unit=o.unit||24;const xAcc=n=>{if(!n.p)return 0;const x=P(n.p);return (x.acc||"")!==(ks[x.l]||"")?7:0;};
  const barW=b=>12+b.reduce((s,n)=>s+Math.max(20,unit*BEATS[n.d])+xAcc(n),0);
  /* pack bars into systems */
  const sys=[];let row=[],rowW=0;const headW=(first)=>42+keySig(key,clef,0).w+(first&&!o.noMeter?22:0);
  bars.forEach(b=>{const w=barW(b),hw=headW(!sys.length&&!row.length);if(row.length&&hw+rowW+w>W-6){sys.push(row);row=[];rowW=0;}row.push(b);rowW+=w;});if(row.length)sys.push(row);
  let html="";
  sys.forEach((row,si)=>{
    const first=si===0,ksg=keySig(key,clef,44);let x=42+ksg.w;
    let s=`<svg class="score-sys" viewBox="0 0 ${W} 136" role="img" aria-label="${L("五線譜","五線譜")}">`;
    for(let k=0;k<5;k++){const y=BOT_-k*G_;s+=`<line x1="2" x2="${W-2}" y1="${y}" y2="${y}" stroke="${INK}" stroke-width="1.3"/>`;}
    s+=`<line x1="2" x2="2" y1="${TOP}" y2="${BOT_}" stroke="${INK}" stroke-width="1.6"/>`;
    s+=clefGlyph(clef)+ksg.svg;
    if(first&&!o.noMeter){s+=`<text x="${x+8}" y="${TOP+19}" class="sc-meter" text-anchor="middle">${meter[0]}</text><text x="${x+8}" y="${BOT_-1}" class="sc-meter" text-anchor="middle">${meter[1]}</text>`;x+=24;}
    const natural=row.reduce((s,b)=>s+barW(b),0),stretch=(W-4-x)/natural;
    row.forEach((bar,bi)=>{
      const shown={};/* accidental memory inside the bar */
      let bx=x+8*stretch;const pos=[];
      bar.forEach(n=>{const isRest=n.d.endsWith("r");const pp=isRest?null:P(n.p);const w=(Math.max(20,unit*BEATS[n.d])+xAcc(n))*stretch;pos.push({n,pp,x:bx+(pp&&needAcc(pp)?7:0),isRest});bx+=w;});
      if(o.center&&pos.length===1)pos[0].x=(x+W-6)/2+(pos[0].pp&&needAcc(pos[0].pp)?7:0);
      function needAcc(pp){const keyAcc=ks[pp.l]||"";const memo=shown[pp.l+pp.oct];const want=pp.acc||"";const prev=memo!==undefined?memo:keyAcc;return want!==prev;}
      /* beams: pair consecutive eighths that share a beat */
      let beat=0;const groups=[];pos.forEach((q,k)=>{q.beat=beat;beat+=BEATS[q.n.d];});
      for(let k=0;k<pos.length;k++){const q=pos[k];if(q.n.d==="e"&&!q.isRest){const nx=pos[k+1];if(nx&&nx.n.d==="e"&&!nx.isRest&&Math.floor(nx.beat+1e-6)===Math.floor(q.beat+1e-6)){groups.push([q,nx]);q.beam=nx.beam=true;k++;}}}
      groups.forEach(g=>{const avg=(g[0].pp.dn+g[1].pp.dn)/2;const up=avg<(clef==="bass"?22:34);g.forEach(q=>q.up=up);});
      pos.forEach(q=>{
        const n=q.n,i=n.i;const cls=["sn"];if(o.cur===i)cls.push("cur");if(o.marks&&o.marks[i])cls.push(o.marks[i]);
        s+=`<g class="${cls.join(" ")}" data-i="${i}">`;
        s+=`<rect class="sn-hit" x="${q.x-13}" y="${TOP-26}" width="26" height="${BOT_-TOP+52}" rx="6"/>`;
        if(q.isRest){const cy=(TOP+BOT_)/2;
          if(n.d==="qr")s+=`<path transform="translate(${q.x-6} ${cy-15}) scale(.5)" d="M10 2 L26 22 Q16 32 20 42 L30 56 Q18 50 12 58 Q10 68 22 76 Q2 70 4 56 Q8 46 20 48 L8 34 Q18 24 16 16z" fill="${INK}"/>`;
          else if(n.d==="hr")s+=`<rect x="${q.x-7}" y="${cy-5}" width="14" height="5" fill="${INK}"/>`;
          else s+=`<rect x="${q.x-7}" y="${TOP+G_}" width="14" height="5" fill="${INK}"/>`;
          s+=`</g>`;return;}
        const pp=q.pp,y=yOf(pp.dn,clef),L1=clef==="bass"?18:30;
        for(let l=L1-2;l>=pp.dn;l-=2)s+=`<line x1="${q.x-11}" x2="${q.x+11}" y1="${yOf(l,clef)}" y2="${yOf(l,clef)}" stroke="${INK}" stroke-width="1.4"/>`;
        for(let l=L1+10;l<=pp.dn;l+=2)s+=`<line x1="${q.x-11}" x2="${q.x+11}" y1="${yOf(l,clef)}" y2="${yOf(l,clef)}" stroke="${INK}" stroke-width="1.4"/>`;
        if(needAcc(pp)){s+=accGlyph(pp.acc||"n",q.x-15,y);}shown[pp.l+pp.oct]=pp.acc||"";
        const open=n.d==="h"||n.d==="dh"||n.d==="w";
        s+=`<ellipse class="sn-head" cx="${q.x}" cy="${y}" rx="${n.d==="w"?7.5:6.4}" ry="4.8" transform="rotate(-20 ${q.x} ${y})" fill="${open?"#fff":INK}" stroke="${INK}" stroke-width="${open?2:1.2}"/>`;
        if(n.d==="dh"||n.d==="dq")s+=`<circle cx="${q.x+10}" cy="${pp.dn%2===(clef==="bass"?18:30)%2?y-3:y}" r="1.9" fill="${INK}"/>`;
        let stemTip=null;
        if(n.d!=="w"){const up=q.up!==undefined?q.up:pp.dn<(clef==="bass"?22:34);
          if(up){s+=`<line x1="${q.x+5.8}" x2="${q.x+5.8}" y1="${y-1}" y2="${y-32}" stroke="${INK}" stroke-width="1.3"/>`;stemTip=[q.x+5.8,y-32];}
          else{s+=`<line x1="${q.x-5.8}" x2="${q.x-5.8}" y1="${y+1}" y2="${y+32}" stroke="${INK}" stroke-width="1.3"/>`;stemTip=[q.x-5.8,y+32];}
          q.tip=stemTip;q.upF=up;
          if(n.d==="e"&&!q.beam)s+=up?`<path d="M${q.x+5.8} ${y-32} q9 6 7 18 q-2 -8 -7 -10z" fill="${INK}"/>`:`<path d="M${q.x-5.8} ${y+32} q9 -6 7 -18 q-2 8 -7 10z" fill="${INK}"/>`;}
        /* finger number above (piano LH below) */
        if(o.showF&&n.f!==undefined&&n.f!==null){const fy=o.fBelow?Math.max(BOT_+18,y+18):Math.min(TOP-8,y-40);s+=`<text x="${q.x}" y="${fy}" class="sc-f" text-anchor="middle">${n.f}</text>`;}
        if(o.showN)s+=`<text x="${q.x}" y="132" class="sc-n" text-anchor="middle">${nm(n.p)}</text>`;
        s+=`</g>`;
      });
      groups.forEach(([a,b])=>{if(!a.tip||!b.tip)return;const up=a.upF;const y1=a.tip[1],y2=b.tip[1];const ym=up?Math.min(y1,y2):Math.max(y1,y2);
        s+=`<path d="M${a.tip[0]} ${ym} L${b.tip[0]} ${ym} L${b.tip[0]} ${ym+(up?4:-4)} L${a.tip[0]} ${ym+(up?4:-4)}z" fill="${INK}"/>`;
        /* extend shorter stem to the beam */
        [a,b].forEach(q=>{if(q.tip[1]!==ym)s+=`<line x1="${q.tip[0]}" x2="${q.tip[0]}" y1="${q.tip[1]}" y2="${ym}" stroke="${INK}" stroke-width="1.3"/>`;});});
      x+=barW(bar)*stretch;
      const last=si===sys.length-1&&bi===row.length-1;
      if(last&&o.noEnd){}
      else if(last)s+=`<line x1="${W-8}" x2="${W-8}" y1="${TOP}" y2="${BOT_}" stroke="${INK}" stroke-width="1.3"/><rect x="${W-5}" y="${TOP}" width="4" height="${BOT_-TOP}" fill="${INK}"/>`;
      else s+=`<line x1="${Math.min(x,W-2)}" x2="${Math.min(x,W-2)}" y1="${TOP}" y2="${BOT_}" stroke="${INK}" stroke-width="1.3"/>`;
    });
    html+=s+`</svg>`;
  });
  return `<div class="score">${html}</div>`;
}

/* ================= instruments ================= */
const INST={
  piano:{hk:"鋼琴",tw:"鋼琴",snd:"piano"},
  violin:{hk:"小提琴",tw:"小提琴",snd:"violin"}
};
function sound(inst,midi,dur=.9,vol=.85,when=0){
  if(inst==="violin"&&api.hasVln())play("violin",sampleName(midi),dur,vol*.95,when);
  else play("piano",sampleName(midi),dur,vol,when);
}
/* piano fingering in the five-finger C position */
const RH_C={60:1,62:2,64:3,65:4,67:5},LH_C={48:5,50:4,52:3,53:2,55:1};
/* violin: strings & finger spots in first position (semitones above the open string) */
const STR=[{n:"G",m:55},{n:"D",m:62},{n:"A",m:69},{n:"E",m:76}];
const SPOTS=[{k:"0",st:0},{k:"1L",st:1,low:1},{k:"1",st:2},{k:"2L",st:3},{k:"2",st:4},{k:"3",st:5},{k:"4",st:7}];
const spotLabel=k=>({"0":L("空弦","空弦"),"1L":L("低1","低1"),"1":"1","2L":L("低2","低2"),"2":L("高2","高2"),"3":"3","4":"4"})[k];
/* standard first-position fingering: highest string whose open note ≤ pitch, preferring the open string over 4th finger */
function vlnFinger(midi){for(let s=3;s>=0;s--){const d=midi-STR[s].m;if(d>=0&&d<=5){const sp=SPOTS.find(x=>x.st===d);return {s,spot:sp?sp.k:String(d),f:sp?sp.k[0]:"?"};}}
  const d=midi-STR[0].m;if(d===6)return {s:0,spot:"3H",f:"3"};return {s:0,spot:"0",f:"0"};}
function vlnSayPos(midi){const v=vlnFinger(midi);return L(`${STR[v.s].n} 弦 ${v.spot==="0"?"空弦":spotLabel(v.spot)+" 指"}`,`${STR[v.s].n} 弦 ${v.spot==="0"?"空弦":spotLabel(v.spot)+" 指"}`);}

/* piano keyboard widget: lo..hi midi (white-key aligned) */
function pianoKbd(lo,hi,o={}){
  const whites=[];for(let m=lo;m<=hi;m++)if([0,2,4,5,7,9,11].includes(m%12))whites.push(m);
  const WW=30,H=124,W=whites.length*WW+4;
  let s=`<svg class="pkbd" viewBox="0 0 ${W} ${H+20}" style="max-width:${Math.min(W*1.25,640)}px">`;
  whites.forEach((m,i)=>{const x=2+i*WW;s+=`<rect class="pk wk" data-m="${m}" x="${x}" y="2" width="${WW}" height="${H}" rx="4"/>`;
    if(m%12===0)s+=`<text x="${x+WW/2}" y="${H-8}" class="pk-c" text-anchor="middle">C${Math.floor(m/12)-1}</text>`;
    if(m===60)s+=`<circle cx="${x+WW/2}" cy="${H-26}" r="4" class="pk-mid"/>`;
    if(o.labels)s+=`<text x="${x+WW/2}" y="${H+16}" class="pk-l" text-anchor="middle">${solf(LET[[0,2,4,5,7,9,11].indexOf(m%12)])}</text>`;});
  whites.forEach((m,i)=>{if([0,2,5,7,9].includes(m%12)&&m+1<=hi){const x=2+(i+1)*WW-9;s+=`<rect class="pk bk" data-m="${m+1}" x="${x}" y="2" width="18" height="${H*.6}" rx="3"/>`;}});
  return s+`</svg>`;
}
/* violin fingerboard widget (player's view, scroll at the top) */
function fingerboard(o={}){
  const W=300,top=56,rowH=46,cols=[60,120,180,240];const spots=SPOTS.filter(x=>o.lowOne||x.k!=="1L");
  const rowY=k=>({"0":top-17,"1L":top+rowH*.5,"1":top+rowH*1,"2L":top+rowH*1.55,"2":top+rowH*2.15,"3":top+rowH*3,"4":top+rowH*4})[k];
  const H=top+rowH*4+30;
  let s=`<svg class="vfb" viewBox="0 0 ${W} ${H}" style="max-width:340px">`;
  s+=`<path d="M40 ${top} L260 ${top} L270 ${H-6} L30 ${H-6}z" class="vfb-board"/>`;
  s+=`<rect x="36" y="${top-6}" width="228" height="7" rx="3" fill="#e9dcc0" stroke="${INK}" stroke-width="2"/>`;
  /* finger tapes like a beginner violin: 1, high 2, 3 */
  [["1",1],["2",2.15],["3",3]].forEach(([t,r])=>{const y=top+rowH*r;s+=`<line x1="38" x2="262" y1="${y}" y2="${y}" class="vfb-tape"/>`;});
  cols.forEach((x,i)=>{s+=`<line x1="${x}" x2="${x+(i-1.5)*6}" y1="${top}" y2="${H-6}" stroke="#cdbb8f" stroke-width="${3.4-i*.6}"/>`;
    s+=`<text x="${x}" y="17" text-anchor="middle" class="vfb-sn">${STR[i].n}</text>`;});
  spots.forEach(sp=>{const y=rowY(sp.k);s+=`<text x="12" y="${y+5}" class="vfb-k" text-anchor="middle">${sp.k==="0"?"0":sp.k.replace("L","").replace(/^(\d)$/,"$1")}${sp.k.endsWith("L")?"↓":sp.k==="2"?"↑":""}</text>`;
    cols.forEach((x,i)=>{const m=STR[i].m+sp.st;const cx=x+(i-1.5)*6*((y-top)/(H-top));
      s+=`<g class="vs ${sp.k==="0"?"open":""} ${sp.k.endsWith("L")?"low":""}" data-m="${m}" data-s="${i}" data-k="${sp.k}"><circle cx="${cx}" cy="${y}" r="${sp.k==="0"?13:11.5}"/>${o.labels?`<text x="${cx}" y="${y+4}" text-anchor="middle">${nm(sampleName(m).replace("b","b"))}</text>`:""}</g>`;});});
  return s+`</svg>`;
}
const pnameFromMidi=(m,pref)=>{const sharp=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][m%12],flat=FLAT[m%12];return (pref==="b"?flat:sharp)+(Math.floor(m/12)-1);};

/* ================= content: drills & songs ================= */
const DRILLS={
 piano:[
  {id:"p1",t:L("右手 C 位置","右手 C 位置"),g:L("中央 C 至 G：Do–So，右手 1–5 指","中央 C 到 G：Do–So，右手 1–5 指"),clef:"treble",pool:["C4","D4","E4","F4","G4"],kb:[60,72],hand:"R"},
  {id:"p2",t:L("高音譜號全白鍵","高音譜號全白鍵"),g:L("中央 C 至高音 A，連加線","中央 C 到高音 A，含加線"),clef:"treble",pool:["C4","D4","E4","F4","G4","A4","B4","C5","D5","E5","F5","G5","A5"],kb:[60,84]},
  {id:"p3",t:L("左手 C 位置（低音譜號）","左手 C 位置（低音譜號）"),g:L("低音 C 至 G：左手 5–1 指","低音 C 到 G：左手 5–1 指"),clef:"bass",pool:["C3","D3","E3","F3","G3"],kb:[48,60],hand:"L"},
  {id:"p4",t:L("大譜表","大譜表"),g:L("高低音譜號混合，C3 至 C5","高低音譜號混合，C3 到 C5"),clef:"both",pool:["C3","D3","E3","F3","G3","A3","B3","C4","D4","E4","F4","G4","A4","B4","C5"],kb:[48,72]},
  {id:"p5",t:L("黑鍵：升降記號","黑鍵：升降記號"),g:L("♯ 按右邊黑鍵，♭ 按左邊黑鍵","♯ 按右邊黑鍵，♭ 按左邊黑鍵"),clef:"treble",pool:["F#4","C#4","G#4","Bb4","Eb4","D#4","Ab4","Db4","F4","C4","B4","E4"],kb:[60,72],acc:true}
 ],
 violin:[
  {id:"v1",t:L("四條空弦","四條空弦"),g:L("G D A E：唔使按手指","G D A E：不用按手指"),clef:"treble",pool:["G3","D4","A4","E5"]},
  {id:"v2",t:L("D 弦同 A 弦","D 弦和 A 弦"),g:L("D 大調手型：0 1 高2 3","D 大調手型：0 1 高2 3"),clef:"treble",key:"D",pool:["D4","E4","F#4","G4","A4","B4","C#5","D5"]},
  {id:"v3",t:L("G 弦同 E 弦","G 弦和 E 弦"),g:L("G 弦：G A B C；E 弦：E F♯ G A","G 弦：G A B C；E 弦：E F♯ G A"),clef:"treble",key:"G",pool:["G3","A3","B3","C4","E5","F#5","G5","A5"]},
  {id:"v4",t:L("低 2 指","低 2 指"),g:L("C 大調：C 同 F 要用低 2","C 大調：C 和 F 要用低 2"),clef:"treble",key:"C",pool:["C4","F4","C5","G5","B3","E4","B4","D5"]},
  {id:"v5",t:L("全指板混合","全指板混合"),g:L("G、D、A 大調，四條弦","G、D、A 大調，四條弦"),clef:"treble",keys:["G","D","A"],pool:null}
 ]
};
/* public-domain traditional melodies, written in standard notation */
const N=(s)=>s.trim().split(/\s+/).map(t=>{const [p,d]=t.split(":");return p==="r"?{d:d||"qr"}:{p,d:d||"q"};});
const SONGS={
 piano:[
  {id:"ps1",t:L("熱十字包","熱十字包"),en:"Hot Cross Buns",key:"C",meter:[4,4],bpm:80,hand:"R",notes:N("E4 D4 C4:h E4 D4 C4:h C4:e C4:e C4:e C4:e D4:e D4:e D4:e D4:e E4 D4 C4:h")},
  {id:"ps2",t:L("瑪莉有隻小綿羊","瑪莉有隻小綿羊"),en:"Mary Had a Little Lamb",key:"C",meter:[4,4],bpm:84,hand:"R",notes:N("E4 D4 C4 D4 E4 E4 E4:h D4 D4 D4:h E4 G4 G4:h E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4:w")},
  {id:"ps3",t:L("月光下","月光下"),en:"Au clair de la lune",key:"C",meter:[4,4],bpm:80,hand:"R",notes:N("C4 C4 C4 D4 E4:h D4:h C4 E4 D4 D4 C4:w C4 C4 C4 D4 E4:h D4:h C4 E4 D4 D4 C4:w")},
  {id:"ps4",t:L("輕輕划","輕輕划"),en:"Lightly Row",key:"C",meter:[4,4],bpm:84,hand:"R",notes:N("G4 E4 E4:h F4 D4 D4:h C4 D4 E4 F4 G4 G4 G4:h G4 E4 E4:h F4 D4 D4:h C4 E4 G4 G4 C4:w")},
  {id:"ps5",t:L("歡樂頌","歡樂頌"),en:"Ode to Joy",key:"C",meter:[4,4],bpm:84,hand:"R",notes:N("E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4:dq D4:e D4:h E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4:dq C4:e C4:h")},
  {id:"ps6",t:L("左手：熱十字包","左手：熱十字包"),en:"Hot Cross Buns (LH)",key:"C",meter:[4,4],bpm:76,hand:"L",clef:"bass",notes:N("E3 D3 C3:h E3 D3 C3:h C3:e C3:e C3:e C3:e D3:e D3:e D3:e D3:e E3 D3 C3:h")}
 ],
 violin:[
  {id:"vs1",t:L("空弦練習","空弦練習"),en:"Open strings",key:"D",meter:[4,4],bpm:72,notes:N("A4 A4 A4 A4 D4 D4 D4 D4 A4 A4 D4 D4 A4:w E5 E5 A4 A4 D4 D4 G3 G3 D4 A4 E5:h")},
  {id:"vs2",t:L("熱十字包","熱十字包"),en:"Hot Cross Buns",key:"A",meter:[4,4],bpm:76,notes:N("C#5 B4 A4:h C#5 B4 A4:h A4:e A4:e A4:e A4:e B4:e B4:e B4:e B4:e C#5 B4 A4:h")},
  {id:"vs3",t:L("小星星","小星星"),en:"Twinkle, Twinkle",key:"A",meter:[4,4],bpm:84,notes:N("A4 A4 E5 E5 F#5 F#5 E5:h D5 D5 C#5 C#5 B4 B4 A4:h E5 E5 D5 D5 C#5 C#5 B4:h E5 E5 D5 D5 C#5 C#5 B4:h A4 A4 E5 E5 F#5 F#5 E5:h D5 D5 C#5 C#5 B4 B4 A4:h")},
  {id:"vs4",t:L("瑪莉有隻小綿羊","瑪莉有隻小綿羊"),en:"Mary Had a Little Lamb",key:"D",meter:[4,4],bpm:84,notes:N("F#4 E4 D4 E4 F#4 F#4 F#4:h E4 E4 E4:h F#4 A4 A4:h F#4 E4 D4 E4 F#4 F#4 F#4 F#4 E4 E4 F#4 E4 D4:w")},
  {id:"vs5",t:L("歡樂頌","歡樂頌"),en:"Ode to Joy",key:"D",meter:[4,4],bpm:84,notes:N("F#4 F#4 G4 A4 A4 G4 F#4 E4 D4 D4 E4 F#4 F#4:dq E4:e E4:h F#4 F#4 G4 A4 A4 G4 F#4 E4 D4 D4 E4 F#4 E4:dq D4:e D4:h")},
  {id:"vs6",t:L("輕輕划","輕輕划"),en:"Lightly Row",key:"D",meter:[4,4],bpm:84,notes:N("A4 F#4 F#4:h G4 E4 E4:h D4 E4 F#4 G4 A4 A4 A4:h A4 F#4 F#4:h G4 E4 E4:h D4 F#4 A4 A4 D4:w")}
 ]
};
function fingerFor(inst,p,hand){const m=P(p).midi;if(inst==="violin")return vlnFinger(m).f;const t=hand==="L"?LH_C:RH_C;return t[m]??null;}


/* ================= technique tips ================= */
const TIPS_PIANO=[
 [L("坐姿","坐姿"),L("坐椅子前半，雙腳踩實地（或者踏腳凳）；手肘同琴鍵差唔多高。","坐在椅子前半，雙腳踩穩地面（或踏腳凳）；手肘和琴鍵差不多高。")],
 [L("手型","手型"),L("手指彎彎，好似輕輕握住一粒波；用指尖彈，指甲要剪短。","手指彎彎，像輕輕握著一顆球；用指尖彈，指甲要剪短。")],
 [L("拇指","拇指"),L("拇指用側邊彈，唔好企直；手腕放鬆，唔好跌落去。","拇指用側邊彈，不要立起來；手腕放鬆，不要塌下去。")],
 [L("慢慢嚟","慢慢來"),L("新曲先分開手、用慢速，彈啱咗先加快。","新曲先分手、用慢速，彈對了再加快。")]];
const TIPS_VIOLIN=[
 [L("拿琴","拿琴"),L("琴放喺左肩，下巴輕輕靠住腮托；唔使用手托住琴頸。","琴放在左肩，下巴輕輕靠著腮托；不需要用手托著琴頸。")],
 [L("左手","左手"),L("手腕保持直；手指彎彎，用指尖垂直按落弦。","手腕保持直；手指彎彎，用指尖垂直按在弦上。")],
 [L("握弓","握弓"),L("拇指彎彎頂住弓桿，尾指彎彎企喺弓桿上面；手要鬆。","拇指彎彎頂著弓桿，小指彎彎立在弓桿上；手要放鬆。")],
 [L("拉弓","拉弓"),L("弓要同琴橋平行，喺琴橋同指板中間拉；先用空弦練長弓。","弓要和琴橋平行，在琴橋與指板中間拉；先用空弦練長弓。")]];
const tips=list=>`<h3 class="coll-h">${L("姿勢小貼士","姿勢小貼士")}<small>${L("以老師教嘅為準","以老師教的為準")}</small></h3><div class="tips-grid">${list.map(([h,t])=>`<div class="tip"><b>${h}</b><p>${t}</p></div>`).join("")}</div>`;

/* ================= rhythm reading: tap along to formal rhythm notation ================= */
const RHY=[
 {id:"r1",t:L("四分同二分音符","四分和二分音符"),g:L("ta（1 拍）、ta-a（2 拍）","ta（1 拍）、ta-a（2 拍）"),meter:[4,4],durs:["q","q","h"]},
 {id:"r2",t:L("全音符同休止符","全音符和休止符"),g:L("加埋全音符（4 拍）同四分休止符","加上全音符（4 拍）和四分休止符"),meter:[4,4],durs:["q","q","h","w","qr"]},
 {id:"r3",t:L("八分音符","八分音符"),g:L("兩粒八分音符 ti-ti = 1 拍","兩個八分音符 ti-ti = 1 拍"),meter:[4,4],durs:["q","q","ee","ee","h"]},
 {id:"r4",t:L("3/4 拍同附點","3/4 拍和附點"),g:L("每小節 3 拍；附點二分音符 3 拍","每小節 3 拍；附點二分音符 3 拍"),meter:[3,4],durs:["q","q","ee","h","dh"]},
 {id:"r5",t:L("混合挑戰","混合挑戰"),g:L("2/4、休止符、八分音符","2/4、休止符、八分音符"),meter:[2,4],durs:["q","q","ee","ee","h","qr"]}
];
function genRhythm(d,bars=2){const per=d.meter[0];const out=[];
  for(let b=0;b<bars;b++){let left=per,tries=0;while(left>0&&tries<50){tries++;const pk=d.durs[Math.floor(Math.random()*d.durs.length)];const len=pk==="ee"?1:BEATS[pk];
      if(len>left)continue;if(pk==="qr"&&(out.length===0||out[out.length-1].d==="qr"))continue;
      if(pk==="ee")out.push({d:"e"},{d:"e"});else out.push({d:pk});left-=len;}
    if(left>0)out.push({d:"q"});}
  if(out.filter(n=>n.d!=="qr").length<3)return genRhythm(d,bars);return out;}
function rhythmDrill(id){
  TOKP++;const my=TOKP;const inst=instOf();const d=RHY.find(x=>x.id===id);
  const pitch=inst==="violin"?"A4":"C4";const total=5;let n=0,first=0,fails=0,notes=[],marks=null,state="idle",taps=[],T0=0;
  const b=()=>60/72;
  const show_=()=>{$("#rsc").innerHTML=score({clef:"treble",key:"C",meter:d.meter,notes:notes.map(x=>x.d==="qr"?x:{p:pitch,d:x.d}),marks,W:Math.max(320,Math.min(560,$("#rsc").clientWidth||340)),unit:30});};
  const onsets=()=>{let at=0;const o=[];notes.forEach((x,i)=>{if(x.d!=="qr")o.push({at,i});at+=BEATS[x.d];});return {o,len:at};};
  const round=()=>{notes=genRhythm(d);marks=null;fails=0;state="idle";window.__MQ_RHY={notes,beat:b()};
    $("#rq").innerHTML=`<div class="qhead"><button class="say-btn" id="rsay">${ART.spk}</button><h3>${L("跟住拍子，拍出呢段節奏","跟著拍子，拍出這段節奏")}</h3><span class="pill">${n+1}/${total}</span></div>
      <div class="sc-wrap" id="rsc"></div>
      <p class="pos" id="rst">${L("先撳「聽示範」，或者直接撳「開始」。","先按「聽示範」，或直接按「開始」。")}</p>
      <div class="row"><button class="btn ghost" id="rdemo">${icon.note} ${L("聽示範","聽示範")}</button><button class="btn" id="rgo">${L("開始","開始")}</button></div>
      <button class="tap-pad" id="pad" disabled>${L("拍","拍")}</button><div class="hint" id="rh" hidden></div>`;
    show_();$("#rdemo").onclick=()=>play_("demo");$("#rgo").onclick=()=>play_("go");
    $("#rsay").onclick=()=>speak(L("跟住拍子，拍出呢段節奏","跟著拍子，拍出這段節奏"));
    const pad=$("#pad");pad.addEventListener("pointerdown",e=>{e.preventDefault();tap();});
    if(n===0)speak(L("跟住拍子，拍出呢段節奏","跟著拍子，拍出這段節奏"));};
  const tap=()=>{if(state!=="go")return;taps.push(performance.now());sound(inst,P(pitch).midi,.25,.7);const p=$("#pad");p.classList.remove("hit");void p.offsetWidth;p.classList.add("hit");buzz(8);};
  const play_=async mode=>{if(state==="demo"||state==="go")return;api.ctx();const my2=++TOKP;state=mode;const bs=b(),per=d.meter[0];const {o,len}=onsets();
    $("#rdemo").disabled=$("#rgo").disabled=true;$("#pad").disabled=mode!=="go";marks=null;show_();
    $("#rst").textContent=L("預備……","預備……");
    for(let k=0;k<per;k++)api.wood(k?.35:.7,k*bs);
    T0=performance.now()+per*bs*1000;taps=[];
    for(let x=0;x<Math.ceil(len);x++)api.wood(x%per===0?.45:.22,per*bs+x*bs);
    if(mode==="demo")o.forEach(e=>sound(inst,P(pitch).midi,Math.min(1.6,bs*.9),.85,per*bs+e.at*bs));
    await wait(per*bs*1000);if(!liveP(my2))return;$("#rst").textContent=mode==="go"?L("拍！","拍！"):L("聽住……","仔細聽……");
    await wait((len+.6)*bs*1000);if(!liveP(my2))return;
    $("#rdemo").disabled=$("#rgo").disabled=false;$("#pad").disabled=true;
    if(mode==="demo"){state="idle";$("#rst").textContent=L("到你喇，撳「開始」。","輪到你了，按「開始」。");return;}
    state="judge";judge(o);};
  const judge=o=>{const bs=b(),tol=fails>=2?.32:.24;const tb=taps.map(t=>(t-T0)/1000/bs);const used=new Set();marks={};let okAll=true;
    o.forEach(e=>{let best=-1,bd=9;tb.forEach((t,k)=>{if(used.has(k))return;const dd=Math.abs(t-e.at);if(dd<bd){bd=dd;best=k;}});
      if(best>=0&&bd<=tol){used.add(best);marks[e.i]="ok";}else{marks[e.i]="miss";okAll=false;}});
    const extra=tb.length-used.size;if(extra>1)okAll=false;show_();
    const h=$("#rh");h.hidden=false;
    if(okAll){if(!fails)first++;h.className="hint good";h.innerHTML=`<p>✓ ${L("拍子好準！","拍子很準！")}</p>`;SFX.right();speak(L("拍子好準！","拍子很準！"));
      setTimeout(()=>{if(!liveP(my))return;n++;if(n>=total)finish();else round();},1600);}
    else{fails++;h.className="hint";const missN=Object.values(marks).filter(v=>v==="miss").length;
      const msg=tb.length<o.length?L(`要拍 ${o.length} 下，你拍咗 ${tb.length} 下。橙色嘅係漏咗。`,`要拍 ${o.length} 下，你拍了 ${tb.length} 下。橘色的是漏掉的。`):extra>1?L("拍多咗！休止符同長音符唔使拍。","拍太多了！休止符和長音符不用拍。"):L(`有 ${missN} 下早咗或者遲咗（橙色）。跟住滴答聲再試。`,`有 ${missN} 下太早或太晚（橘色）。跟著滴答聲再試。`);
      h.innerHTML=`<p>${msg}</p>`;SFX.wrong();speak(msg);state="idle";$("#rst").textContent=L("再試一次：撳「開始」。","再試一次：按「開始」。");}};
  const finish=()=>{const stars=first>=5?3:first>=3?2:1;const r=rec().drills[id]||(rec().drills[id]={stars:0,plays:0});r.stars=Math.max(r.stars,stars);r.plays++;api.persist();SFX.win();
    $("#rq").innerHTML=`<div class="result"><div class="res-stars">${[0,1,2].map(i=>`<i class="${i<stars?"on":""}" style="--d:${i}"></i>`).join("")}</div><h3>${L("節奏練完喇！","節奏練完了！")}</h3><div class="res-stats"><span><b>${first}/${total}</b>${L("一次拍啱","一次拍對")}</span></div>
      <div class="row"><button class="btn ghost small" id="ragain">${L("再練一次","再練一次")}</button><button class="btn" id="rback">${L("返練習室","回練習室")}</button></div></div>`;
    $("#ragain").onclick=()=>rhythmDrill(id);$("#rback").onclick=open;speak(L("節奏練完喇！","節奏練完了！"));};
  show(`${hdr(d.t)}<p class="pr-goal">${d.g} · ${L("用","用")} ${inst==="violin"?L("A 弦空弦","A 弦空弦"):L("右手拇指彈中央 C","右手拇指彈中央 C")} ${L("奏亦得","奏也可以")}</p><section class="pr-q" id="rq" aria-live="polite"></section></div>`,"pr-s");
  bindTop();$("#prb").onclick=()=>{TOKP++;open();};round();
  const key=e=>{if(!document.getElementById("pad")){removeEventListener("keydown",key);return;}if(e.code==="Space"){e.preventDefault();tap();}};addEventListener("keydown",key);
}

/* ================= parent / teacher piece entry ================= */
const customs=inst=>{const pr=rec();pr.custom=pr.custom||{};return pr.custom[inst]||(pr.custom[inst]=[]);};
const allSongs=inst=>SONGS[inst].concat(customs(inst));
const SHARPN=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
function spell(m,key){const flatKey=Object.values(KEYS[key]||{})[0]==="b";return (flatKey?FLAT[m%12]:SHARPN[m%12])+(Math.floor(m/12)-1);}
function editor(id){
  TOKP++;const inst=instOf();const list=customs(inst);const orig=id?list.find(x=>x.id===id):null;
  const ed=orig?JSON.parse(JSON.stringify(orig)):{id:"c"+Date.now().toString(36),t:"",key:"C",meter:[4,4],clef:"treble",hand:"R",bpm:80,notes:[],custom:true};
  let dur="q",sel=-1;
  const DUR=[["w",L("全音符","全音符"),"whole"],["h",L("二分","二分"),"half"],["dh",L("附點二分","附點二分"),"dhalf"],["q",L("四分","四分"),"quarter"],["e",L("八分","八分"),"eighth"],["qr",L("休止","休止"),"qrest"]];
  const widget=()=>inst==="piano"?`<div class="pr-kb" id="kb">${ed.clef==="bass"?pianoKbd(43,64):pianoKbd(60,84)}</div>`:`<div class="pr-fb sm" id="fb">${fingerboard({lowOne:true})}</div>`;
  const preview=()=>{$("#esc").innerHTML=ed.notes.length?score({clef:ed.clef,key:ed.key,meter:ed.meter,notes:ed.notes.map(n=>n.p?{...n,f:n.f!==undefined?n.f:fingerFor(inst,n.p,ed.hand)}:n),showF:true,showN:true,fBelow:ed.hand==="L",W:Math.max(320,Math.min(560,$("#esc").clientWidth||340))}):`<p class="sub">${L("揀音符長短，再撳樂器加音。","選音符長短，再按樂器加音。")}</p>`;
    $$("#esc .sn").forEach(g=>g.addEventListener("click",()=>{sel=+g.dataset.i;const n=ed.notes[sel];if(n&&n.p)sound(inst,P(n.p).midi,.5);markSel();}));markSel();
    const per=ed.meter[0],tot=ed.notes.reduce((s,n)=>s+BEATS[n.d],0),rem=+(tot%per).toFixed(2);
    $("#ebar").textContent=L(`${ed.notes.length} 粒音 · ${Math.floor(tot/per)} 個完整小節`,`${ed.notes.length} 個音 · ${Math.floor(tot/per)} 個完整小節`)+(rem?L(`（最後一小節差 ${+(per-rem).toFixed(2)} 拍）`,`（最後一小節還差 ${+(per-rem).toFixed(2)} 拍）`):"");};
  const markSel=()=>{const i=sel>=0&&sel<ed.notes.length?sel:ed.notes.length-1;$$("#esc .sn").forEach(g=>g.classList.toggle("cur",+g.dataset.i===i));const t=$("#fsel");if(t){const n=ed.notes[i];t.textContent=n&&n.p?L(` · 第 ${i+1} 粒（${nm(n.p)}）`,` · 第 ${i+1} 個（${nm(n.p)}）`):"";}};
  const segs=(name,opts,cur)=>`<div class="seg sm" data-g="${name}">${opts.map(([v,t])=>`<button data-v="${v}" class="${v===cur?"sel":""}">${t}</button>`).join("")}</div>`;
  const render=()=>{
    show(`${hdr(orig?L("修改曲目","修改曲目"):L("加入老師教嘅曲","加入老師教的曲子"))}
      <label class="name-field">${L("曲名","曲名")}<input id="et" maxlength="24" value="${esc(ed.t)}" placeholder="${L("例如：琴書第 12 頁","例如：琴譜第 12 頁")}"></label>
      <div class="ed-row"><span>${L("調號","調號")}</span>${segs("key",[["C","C"],["G","G"],["D","D"],["A","A"],["F","F"]],ed.key)}</div>
      <div class="ed-row"><span>${L("拍號","拍號")}</span>${segs("meter",[["4/4","4/4"],["3/4","3/4"],["2/4","2/4"]],ed.meter.join("/"))}</div>
      ${inst==="piano"?`<div class="ed-row"><span>${L("譜號","譜號")}</span>${segs("clef",[["treble",L("高音（右手）","高音（右手）")],["bass",L("低音（左手）","低音（左手）")]],ed.clef)}</div>`:""}
      <div class="sc-wrap" id="esc"></div><p class="pos" id="ebar"></p>
      ${inst==="piano"?`<div class="ed-row fing"><span>${L("指法","指法")}<small id="fsel"></small></span><div class="seg sm" id="fing">${["1","2","3","4","5"].map(f=>`<button data-f="${f}">${f}</button>`).join("")}<button data-f="">✕</button></div></div>`:""}
      <div class="dur-row" id="durs">${DUR.map(([v,t,sym])=>`<button class="dur ${v===dur?"sel":""}" data-d="${v}">${ART.noteSym(sym,ART.INK,30)}<small>${t}</small></button>`).join("")}</div>
      ${widget()}
      <div class="row"><button class="btn ghost small" id="eundo">⌫ ${L("刪最後一粒","刪最後一個")}</button><button class="btn ghost small" id="eplay">${icon.note} ${L("試聽","試聽")}</button>${orig?`<button class="btn small danger" id="edel">${L("刪除","刪除")}</button>`:""}<button class="btn" id="esave">${L("儲存","儲存")}</button></div>
      <p class="sub">${L("貼士：照住樂譜由左到右逐粒打。升降音會跟調號自動寫好。","提示：照著樂譜由左到右逐個輸入。升降音會依調號自動寫好。")}</p></div>`,"pr-s");
    bindTop();$("#prb").onclick=open;preview();
    $("#et").oninput=e=>{ed.t=e.target.value;};
    $$("[data-g] button").forEach(bt=>bt.onclick=()=>{const g=bt.parentElement.dataset.g,v=bt.dataset.v;
      if(g==="key")ed.key=v;if(g==="meter")ed.meter=v.split("/").map(Number);if(g==="clef"){ed.clef=v;ed.hand=v==="bass"?"L":"R";}
      ed.notes=ed.notes.map(n=>n.p?{...n,p:spell(P(n.p).midi,ed.key)}:n);render();});
    $$("#durs .dur").forEach(bt=>bt.onclick=()=>{const v=bt.dataset.d;if(v==="qr"){ed.notes.push({d:"qr"});preview();return;}dur=v;$$("#durs .dur").forEach(x=>x.classList.toggle("sel",x===bt));});
    const add=m=>{sound(inst,m,.6);ed.notes.push({p:spell(m,ed.key),d:dur});sel=-1;preview();};
    $$("#fing button").forEach(bt=>bt.onclick=()=>{const i=sel>=0&&sel<ed.notes.length?sel:ed.notes.length-1;const n=ed.notes[i];if(!n||!n.p)return;if(bt.dataset.f)n.f=+bt.dataset.f;else n.f=null;preview();});
    $$(".pk").forEach(k=>k.addEventListener("pointerdown",e=>{e.preventDefault();flashKey(k);add(+k.dataset.m);}));
    $$(".vs").forEach(g=>g.addEventListener("pointerdown",e=>{e.preventDefault();flashKey(g);add(+g.dataset.m);}));
    $("#eundo").onclick=()=>{ed.notes.pop();sel=-1;preview();};
    $("#eplay").onclick=async()=>{api.ctx();const my=++TOKP;const bs=60/ed.bpm;let at=0;for(const n of ed.notes){if(n.p)sound(inst,P(n.p).midi,BEATS[n.d]*bs*.95,.85,at*bs);at+=BEATS[n.d];}};
    $("#esave").onclick=()=>{if(!ed.notes.length){$("#ebar").textContent=L("未有音符。","還沒有音符。");return;}if(!ed.t.trim())ed.t=L("老師曲目","老師曲目")+" "+(list.length+1);
      const i=list.findIndex(x=>x.id===ed.id);if(i>=0)list[i]=ed;else list.push(ed);api.persist();song(ed.id);};
    const del=$("#edel");if(del)del.onclick=()=>{if(!del.dataset.arm){del.dataset.arm=1;del.textContent=L("確定刪除？","確定刪除？");return;}const i=list.findIndex(x=>x.id===ed.id);if(i>=0)list.splice(i,1);api.persist();open();};
  };
  render();
}

/* ================= screens ================= */
const instOf=()=>{const s=S();return (s.profile&&s.profile.inst)||null;};
function setInst(k){const s=S();if(s.profile){s.profile.inst=k;api.persist();}if(k==="violin")api.loadVln();}
function hdr(title,back){return `${topbar()}<div class="card pr"><div class="les-head"><button class="icon-btn" id="prb" aria-label="${L("返回","返回")}">${icon.back}</button><h2>${title}</h2></div>`;}

/* room: choose instrument, drills, songs, instrument guide */
function open(){
  TOKP++;hush();api.bgmStop();
  const inst=instOf();
  if(!inst)return chooseInst();
  if(inst==="violin")api.loadVln();
  const pr=rec();
  show(`${hdr(L("練習室","練習室"))}
    <div class="pr-inst"><span>${L("我學緊：","我在學：")}</span><div class="seg" id="instseg">${Object.keys(INST).map(k=>`<button data-k="${k}" class="${k===inst?"sel":""}">${L(INST[k].hk,INST[k].tw)}</button>`).join("")}</div></div>
    <button class="pr-guide" id="guide"><span class="pg-ic">${inst==="piano"?icon.keys:icon.violin}</span><span><b>${inst==="piano"?L("認識鋼琴：手指號碼同中央 C","認識鋼琴：手指號碼和中央 C"):L("認識小提琴：四條弦同手指","認識小提琴：四條弦和手指")}</b><small>${L("先睇呢度，再練習","先看這裡，再練習")}</small></span></button>
    <h3 class="coll-h">${L("讀譜找位置","讀譜找位置")}<small>${inst==="piano"?L("睇五線譜，撳啱個琴鍵","看五線譜，按對琴鍵"):L("睇五線譜，揀啱弦同手指","看五線譜，選對弦和手指")}</small></h3>
    <div class="pr-list">${DRILLS[inst].map((d,i)=>{const r=pr.drills[d.id]||{};return `<button class="pr-item" data-d="${d.id}"><span class="pr-n">${i+1}</span><span class="pr-t"><b>${d.t}</b><small>${d.g}</small></span>${starRow(r.stars||0)}</button>`;}).join("")}</div>
    <h3 class="coll-h">${L("節奏讀譜","節奏讀譜")}<small>${L("睇樂譜嘅節奏，跟住拍子拍出嚟","看樂譜的節奏，跟著拍子拍出來")}</small></h3>
    <div class="pr-list">${RHY.map((d,i)=>{const r=pr.drills[d.id]||{};return `<button class="pr-item" data-r="${d.id}"><span class="pr-n rh">${i+1}</span><span class="pr-t"><b>${d.t}</b><small>${d.g}</small></span>${starRow(r.stars||0)}</button>`;}).join("")}</div>
    <h3 class="coll-h">${L("樂曲視奏","樂曲視奏")}<small>${L("正式樂譜：聽示範，再用真樂器跟住奏","正式樂譜：聽示範，再用真樂器跟著奏")}</small></h3>
    <div class="pr-list">${SONGS[inst].map(sg=>{const r=pr.songs[sg.id]||{};return `<button class="pr-item song" data-s="${sg.id}"><span class="pr-n">${icon.note}</span><span class="pr-t"><b>${sg.t}</b><small>${sg.en} · ${L(...KEYNAME[sg.key])} · ${sg.meter.join("/")}</small></span>${r.plays?`<span class="pr-done">✓ ${r.plays}</span>`:""}</button>`;}).join("")}</div>
    <h3 class="coll-h">${L("老師教緊嘅曲","老師在教的曲子")}<small>${L("家長可以照住琴書打入去，小朋友就可以跟住練","家長可以照著琴譜輸入，孩子就可以跟著練")}</small></h3>
    <div class="pr-list">${customs(inst).map(sg=>{const r=pr.songs[sg.id]||{};return `<div class="pr-row"><button class="pr-item song" data-s="${sg.id}"><span class="pr-n cu">${icon.note}</span><span class="pr-t"><b>${esc(sg.t)}</b><small>${L(...KEYNAME[sg.key])} · ${sg.meter.join("/")} · ${sg.notes.length} ${L("粒音","個音")}</small></span>${r.plays?`<span class="pr-done">✓ ${r.plays}</span>`:""}</button><button class="icon-btn sm" data-e="${sg.id}" aria-label="${L("修改","修改")}">✎</button></div>`;}).join("")}
     <button class="pr-add" id="addsong">＋ ${L("加入一首曲","加入一首曲子")}</button></div>
  </div>`,"pr-s");
  bindTop();$("#prb").onclick=api.map;
  $$("#instseg button").forEach(b=>b.onclick=()=>{setInst(b.dataset.k);open();});
  $("#guide").onclick=guide;
  $$(".pr-item[data-d]").forEach(b=>b.onclick=()=>drill(b.dataset.d));
  $$(".pr-item[data-s]").forEach(b=>b.onclick=()=>song(b.dataset.s));
  $$(".pr-item[data-r]").forEach(b=>b.onclick=()=>rhythmDrill(b.dataset.r));
  $$("[data-e]").forEach(b=>b.onclick=()=>editor(b.dataset.e));
  $("#addsong").onclick=()=>editor(null);
  speak(L("練習室：睇正式五線譜，學識喺樂器上面點樣按。","練習室：看正式五線譜，學會在樂器上怎麼按。"));
}
function chooseInst(){
  show(`${hdr(L("練習室","練習室"))}<p class="pr-q">${L("你學緊邊種樂器？","你在學哪一種樂器？")}</p>
   <div class="choice-row">${Object.keys(INST).map(k=>`<button class="pick" data-k="${k}"><span class="pick-ic">${k==="piano"?icon.keys:icon.violin}</span><b>${L(INST[k].hk,INST[k].tw)}</b></button>`).join("")}</div>
   <p class="sub">${L("之後可以喺練習室上面轉。","之後可以在練習室上方切換。")}</p></div>`,"pr-s");
  bindTop();$("#prb").onclick=api.map;
  $$(".pick[data-k]").forEach(b=>b.onclick=()=>{setInst(b.dataset.k);open();});
  speak(L("你學緊邊種樂器？","你在學哪一種樂器？"));
}

/* ---- instrument guide ---- */
function guide(){
  TOKP++;const inst=instOf();
  if(inst==="piano"){
    show(`${hdr(L("認識鋼琴","認識鋼琴"))}
     <div class="hands">${handSvg("L")}${handSvg("R")}</div>
     <p class="pr-p">${L("兩隻手嘅手指都有號碼：<b>拇指係 1</b>，尾指係 5。樂譜上面細細嘅數字，就係話你用邊隻手指。","兩隻手的手指都有號碼：<b>拇指是 1</b>，小指是 5。樂譜上小小的數字，就是告訴你用哪一根手指。")}</p>
     <div class="pr-kb" id="kb">${pianoKbd(48,72,{labels:true})}</div>
     <p class="pr-p">${L("黑鍵兩粒一組、三粒一組。<b>兩粒黑鍵左邊嘅白鍵就係 C（Do）</b>。有小圓點嗰個係<b>中央 C</b>：右手拇指放喺度，五隻手指就係 C D E F G。左手尾指放喺低一個 C。","黑鍵兩個一組、三個一組。<b>兩個黑鍵左邊的白鍵就是 C（Do）</b>。有小圓點的是<b>中央 C</b>：右手拇指放在這裡，五根手指就是 C D E F G。左手小指放在低一個 C。")}</p>
     ${score({clef:"treble",notes:N("C4 D4 E4 F4 G4:h"),showF:true,showN:true,W:300})}
     ${score({clef:"bass",notes:N("C3 D3 E3 F3 G3:h").map(n=>({...n,f:LH_C[P(n.p).midi]})),showF:true,showN:true,fBelow:true,W:300})}
     <p class="pr-p">${L("右手睇<b>高音譜號</b>，左手睇<b>低音譜號</b>。撳上面啲琴鍵試吓。","右手看<b>高音譜號</b>，左手看<b>低音譜號</b>。按上面的琴鍵試試看。")}</p>
     ${tips(TIPS_PIANO)}</div>`,"pr-s");
  }else{
    show(`${hdr(L("認識小提琴","認識小提琴"))}
     <p class="pr-p">${L("小提琴有四條弦，由低到高係 <b>G D A E</b>。唔按手指拉，叫<b>空弦（0）</b>。","小提琴有四條弦，由低到高是 <b>G D A E</b>。不按手指拉，叫<b>空弦（0）</b>。")}</p>
     ${score({clef:"treble",notes:N("G3:h D4:h A4:h E5:h"),showF:false,showN:true,W:300})}
     <div class="pr-fb" id="fb">${fingerboard({labels:true})}</div>
     <p class="pr-p">${L("左手食指係 <b>1</b>、中指 <b>2</b>、無名指 <b>3</b>、尾指 <b>4</b>（拇指唔計）。<b>高 2</b> 貼近 3 指；<b>低 2</b> 貼近 1 指——樂譜嘅升降記號話你知用邊個。4 指嘅音同下一條空弦一樣。","左手食指是 <b>1</b>、中指 <b>2</b>、無名指 <b>3</b>、小指 <b>4</b>（拇指不算）。<b>高 2</b> 靠近 3 指；<b>低 2</b> 靠近 1 指——樂譜的升降記號告訴你用哪一個。4 指的音和下一條空弦一樣。")}</p>
     ${score({clef:"treble",key:"D",notes:N("D4 E4 F#4 G4 A4 B4 C#5 D5:h").map(n=>({...n,f:vlnFinger(P(n.p).midi).f})),showF:true,showN:true,W:320})}
     <p class="pr-p">${L("D 大調：D 弦同 A 弦都係「0 1 高2 3」。撳指板試吓。","D 大調：D 弦和 A 弦都是「0 1 高2 3」。按指板試試看。")}</p>
     ${tips(TIPS_VIOLIN)}</div>`,"pr-s");
  }
  bindTop();$("#prb").onclick=open;
  $$(".pk").forEach(k=>k.addEventListener("pointerdown",e=>{e.preventDefault();const m=+k.dataset.m;sound("piano",m);flashKey(k);}));
  $$(".vs").forEach(g=>g.addEventListener("pointerdown",e=>{e.preventDefault();sound("violin",+g.dataset.m);flashKey(g);}));
  speak(inst==="piano"?L("認識鋼琴：拇指係 1，尾指係 5。兩粒黑鍵左邊就係 C。","認識鋼琴：拇指是 1，小指是 5。兩個黑鍵左邊就是 C。"):L("小提琴有四條弦：G、D、A、E。食指係 1，尾指係 4。","小提琴有四條弦：G、D、A、E。食指是 1，小指是 4。"));
}
function handSvg(side){
  const R=side==="R",xs=[[26,92],[46,40],[66,30],[86,38],[104,58]];
  const fing=xs.map(([x,y],i)=>{const X=R?x:130-x;return `<g><rect x="${X-9}" y="${y}" width="18" height="${i===0?46:70-y/3}" rx="9" transform="rotate(${i===0?(R?-38:38):(R?-6+i*4:6-i*4)} ${X} ${y+30})" class="hand-f"/><text x="${X+(i===0?(R?-12:12):0)}" y="${y+(i===0?6:-4)}" text-anchor="middle" class="hand-n">${i+1}</text></g>`;}).join("");
  return `<figure class="hand"><svg viewBox="0 0 130 170">${fing}<path d="M${R?20:110} 112 Q${R?16:114} 160 65 164 Q${R?114:16} 160 ${R?112:18} 100 L${R?24:106} 100z" class="hand-p"/></svg><figcaption>${R?L("右手","右手"):L("左手","左手")}</figcaption></figure>`;
}
function flashKey(el){el.classList.add("lit");setTimeout(()=>el.classList.remove("lit"),260);}

/* ---- drill: read the note, find it on the instrument ---- */
function drill(id){
  TOKP++;const my=TOKP;const inst=instOf();const d=DRILLS[inst].find(x=>x.id===id);
  const total=10;let n=0,first=0,tries=0,q=null,prev=null,busy=false;
  const mk=()=>{
    let key=d.key||"C",clef=d.clef,p;
    if(d.keys){key=d.keys[Math.floor(Math.random()*d.keys.length)];const ks=KEYS[key];const base=["G3","A3","B3","C4","D4","E4","F4","G4","A4","B4","C5","D5","E5","F5","G5","A5"];
      p=base[Math.floor(Math.random()*base.length)];const x=P(p);if(ks[x.l])p=x.l+ks[x.l]+x.oct;}
    else{do{p=d.pool[Math.floor(Math.random()*d.pool.length)];}while(p===prev&&d.pool.length>1);}
    prev=p;if(clef==="both")clef=P(p).midi>=60?(P(p).midi===60&&Math.random()<.5?"bass":"treble"):"bass";
    if(d.acc)key="C";
    return {p,key,clef,midi:P(p).midi};
  };
  const render=()=>{
    q=mk();tries=0;busy=false;
    const ans=inst==="piano"?`<div class="pr-kb" id="kb">${pianoKbd(d.kb[0],d.kb[1])}</div>`:`<div class="pr-fb" id="fb">${fingerboard({lowOne:false})}</div>`;
    $("#dq").innerHTML=`<div class="qhead"><button class="say-btn" id="dsay" aria-label="${L("再讀題目","再唸題目")}">${ART.spk}</button><h3>${inst==="piano"?L("呢個音喺邊個琴鍵？","這個音在哪個琴鍵？"):L("呢個音點樣拉？","這個音怎麼拉？")}</h3><span class="pill">${n+1}/${total}</span></div>
      <div class="dr-staff">${score({clef:q.clef,key:q.key,noMeter:true,noEnd:true,center:true,notes:[{p:q.p,d:"w"}],W:200,unit:60})}</div>
      ${ans}<div class="hint" id="dh" hidden></div>`;
    bindAns();
    $("#dsay").onclick=()=>speak(inst==="piano"?L("呢個音喺邊個琴鍵？","這個音在哪個琴鍵？"):L("呢個音點樣拉？","這個音怎麼拉？"));
    if(n===0)speak(d.g);
  };
  const correctTxt=()=>{const nmTxt=nmFull(q.p);
    if(inst==="piano"){const f=d.hand?fingerFor("piano",q.p,d.hand):null;return nmTxt+(f?L(`・${d.hand==="R"?"右":"左"}手 ${f} 指`,`・${d.hand==="R"?"右":"左"}手 ${f} 指`):"");}
    return nmTxt+"・"+vlnSayPos(q.midi);};
  const bindAns=()=>{
    const els=inst==="piano"?$$("#kb .pk"):$$("#fb .vs");
    els.forEach(el=>el.addEventListener("pointerdown",e=>{e.preventDefault();if(busy||!liveP(my))return;const m=+el.dataset.m;sound(inst,m,.8);
      if(m===q.midi){busy=true;if(!tries)first++;el.classList.add("ok");SFX.right();buzz(18);const [x,y]=center(el);burst(x,y,{n:12,k:"star",c:"#ffd23f"});
        const h=$("#dh");h.hidden=false;h.className="hint good";h.innerHTML=`<p>✓ ${correctTxt()}</p>`;speak(correctTxt().replace("・","，"));
        setTimeout(()=>{if(!liveP(my))return;n++;if(n>=total)done();else render();},1500);}
      else{tries++;el.classList.add("no");setTimeout(()=>el.classList.remove("no"),500);SFX.wrong();buzz([30,50,30]);
        const h=$("#dh");h.hidden=false;h.className="hint";
        const near=inst==="piano"?(Math.abs(m-q.midi)<=2?L("好近喇！","很接近了！"):m<q.midi?L("再高啲（向右）","再高一點（往右）"):L("再低啲（向左）","再低一點（往左）")):(vlnFinger(m).s!==vlnFinger(q.midi).s?L(`唔係呢條弦，試吓 ${STR[vlnFinger(q.midi).s].n} 弦`,`不是這條弦，試試 ${STR[vlnFinger(q.midi).s].n} 弦`):L("弦啱喇，換隻手指","弦對了，換一根手指"));
        if(tries>=2){h.innerHTML=`<p>${L("答案：","答案：")}${correctTxt()}</p>`;els.forEach(x=>{if(+x.dataset.m===q.midi)x.classList.add("guide");});}
        else h.innerHTML=`<p>${near}</p>`;speak(tries>=2?L("係呢度，撳一下。","是這裡，按一下。"):near);}
    }));
  };
  const done=()=>{const ratio=first/total,stars=ratio>=.85?3:ratio>=.55?2:1;const r=rec().drills[id]||(rec().drills[id]={stars:0,plays:0});r.stars=Math.max(r.stars,stars);r.plays++;r.best=Math.max(r.best||0,first);api.persist();
    SFX.win();$("#dq").innerHTML=`<div class="result"><div class="res-stars">${[0,1,2].map(i=>`<i class="${i<stars?"on":""}" style="--d:${i}"></i>`).join("")}</div><h3>${L("練完喇！","練完了！")}</h3><div class="res-stats"><span><b>${first}/${total}</b>${L("一次答啱","一次答對")}</span></div>
      <div class="row"><button class="btn ghost small" id="dagain">${L("再練一次","再練一次")}</button><button class="btn" id="dback">${L("返練習室","回練習室")}</button></div></div>`;
    speak(L(`練完喇！${first} 題一次答啱。`,`練完了！${first} 題一次答對。`));
    $("#dagain").onclick=()=>drill(id);$("#dback").onclick=open;};
  show(`${hdr(d.t)}<p class="pr-goal">${d.g}</p>${d.hand?`<div class="hands one">${handSvg(d.hand)}</div>`:""}<section class="pr-q" id="dq" aria-live="polite"></section></div>`,"pr-s");
  bindTop();$("#prb").onclick=open;render();
}

/* ---- song: formal score, demo playback, play-along with metronome, optional mic check ---- */
function song(id){
  TOKP++;const inst=instOf();const sg=allSongs(inst).find(x=>x.id===id);if(!sg)return open();
  const clef=sg.clef||"treble";
  const notes=sg.notes.map(n=>n.p?{...n,f:n.f!==undefined?n.f:fingerFor(inst,n.p,sg.hand)}:n);
  const pref=(()=>{try{return JSON.parse(localStorage.getItem("mq-score-view")||"{}");}catch(e){return {};}})();
  const view={f:pref.f!==false,n:!!pref.n,bpm:sg.bpm,mic:false};
  let cur=-1,marks=null,playing=0;
  const draw=()=>{$("#sc").innerHTML=score({clef,key:sg.key,meter:sg.meter,notes,showF:view.f,showN:view.n,cur,marks,fBelow:sg.hand==="L",W:Math.max(340,Math.min(600,$("#sc").clientWidth||340))});
    $$("#sc .sn").forEach(g=>g.addEventListener("click",()=>{const i=+g.dataset.i;const n=notes[i];if(n.p){sound(inst,P(n.p).midi,.8);showPos(n.p);}}));};
  const widget=inst==="piano"?`<div class="pr-kb" id="kb">${pianoKbd(clef==="bass"?48:60,clef==="bass"?60:72)}</div>`:`<div class="pr-fb sm" id="fb">${fingerboard({})}</div>`;
  function showPos(p){$$(".pk.on,.vs.on").forEach(x=>x.classList.remove("on"));if(!p)return;const m=P(p).midi;
    if(inst==="piano"){const k=$(`#kb .pk[data-m="${m}"]`);k&&k.classList.add("on");}
    else{const v=vlnFinger(m);const g=$(`#fb .vs[data-m="${m}"][data-s="${v.s}"]`);g&&g.classList.add("on");}
    const t=$("#pos");if(t)t.textContent=inst==="piano"?`${nmFull(p)}${sg.hand?`・${sg.hand==="R"?L("右","右"):L("左","左")}手 ${fingerFor("piano",p,sg.hand)} 指`:""}`:`${nmFull(p)}・${vlnSayPos(m)}`;}
  show(`${hdr(esc(sg.t))}<p class="pr-goal">${sg.custom?L("老師曲目","老師曲目"):sg.en} · ${L(...KEYNAME[sg.key])} · ${sg.meter.join("/")} ${L("拍","拍")} · ${inst==="piano"?(sg.hand==="L"?L("左手","左手"):L("右手","右手")):L("第一把位","第一把位")}</p>
    <div class="sc-wrap" id="sc"></div>
    <div class="sc-tools">
     <button class="chipbtn ${view.f?"on":""}" id="tf">${L("指法","指法")}</button><button class="chipbtn ${view.n?"on":""}" id="tn">${L("唱名","唱名")}</button>
     <div class="seg sm" id="tempo">${[[.75,L("慢","慢")],[1,L("中","中")],[1.2,L("快","快")]].map(([k,t])=>`<button data-k="${k}" class="${k===1?"sel":""}">${t}</button>`).join("")}</div>
    </div>
    <div class="row sc-play"><button class="btn" id="demo">${icon.note} ${L("聽示範","聽示範")}</button><button class="btn ghost" id="along">${L("我自己奏","我自己奏")}</button><button class="btn ghost small" id="stop" hidden>■ ${L("停","停")}</button></div>
    <label class="mic-row" id="microw"><input type="checkbox" id="mic"> ${L("用咪聽我奏，檢查音準（要允許用咪）","用麥克風聽我奏，檢查音準（要允許使用麥克風）")}</label>
    <p class="pos" id="pos">${L("撳樂譜上嘅音符，睇吓喺樂器邊度。","按樂譜上的音符，看看在樂器的哪裡。")}</p>
    ${widget}
    <p class="sub" id="sres"></p></div>`,"pr-s");
  bindTop();$("#prb").onclick=()=>{stop();open();};
  draw();
  const savePref=()=>{try{localStorage.setItem("mq-score-view",JSON.stringify({f:view.f,n:view.n}));}catch(e){}};
  $("#tf").onclick=()=>{view.f=!view.f;$("#tf").classList.toggle("on",view.f);savePref();draw();};
  $("#tn").onclick=()=>{view.n=!view.n;$("#tn").classList.toggle("on",view.n);savePref();draw();};
  $$("#tempo button").forEach(b=>b.onclick=()=>{view.bpm=Math.round(sg.bpm*+b.dataset.k);$$("#tempo button").forEach(x=>x.classList.toggle("sel",x===b));});
  $$(".pk").forEach(k=>k.addEventListener("pointerdown",e=>{e.preventDefault();sound(inst,+k.dataset.m);flashKey(k);}));
  $$(".vs").forEach(g=>g.addEventListener("pointerdown",e=>{e.preventDefault();sound(inst,+g.dataset.m);flashKey(g);}));
  const mic=$("#mic");if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia))$("#microw").hidden=true;
  mic.onchange=async()=>{if(mic.checked){const ok=await Pitch.start();if(!ok){mic.checked=false;$("#microw").innerHTML=`<span class="sub">${L("呢度用唔到咪（瀏覽器冇允許）。可以照樣跟住拍子奏。","這裡無法使用麥克風（瀏覽器未允許）。可以照樣跟著拍子奏。")}</span>`;}}else Pitch.stop();view.mic=mic.checked;};
  function stop(){playing=0;TOKP++;hush();$("#stop").hidden=true;$("#demo").disabled=$("#along").disabled=false;showPos(null);cur=-1;draw();}
  $("#stop").onclick=stop;
  async function run(mode){
    ac();TOKP++;const my=TOKP;playing=1;marks=mode==="along"&&view.mic?{}:null;cur=-1;draw();
    $("#stop").hidden=false;$("#demo").disabled=$("#along").disabled=true;$("#sres").textContent="";
    const b=60/view.bpm;
    /* count-in: one bar of clicks */
    for(let k=0;k<sg.meter[0];k++){api.wood(k?.35:.7,k*b);}
    await wait(sg.meter[0]*b*1000);if(!liveP(my))return;
    let t0=performance.now(),at=0;const res=[];
    for(let i=0;i<notes.length;i++){const n=notes[i],d=BEATS[n.d];
      cur=i;draw();showPos(n.p||null);
      if(mode==="along"){for(let x=Math.ceil(at);x<at+d;x++)api.wood(x%sg.meter[0]===0?.45:.25,(x-at)*b);}
      if(n.p&&mode==="demo")sound(inst,P(n.p).midi,d*b*.95,.85);
      if(n.p&&marks)Pitch.window(i);
      const target=t0+(at+d)*b*1000;const w=target-performance.now();if(w>0)await wait(w);if(!liveP(my))return;
      if(n.p&&marks){const got=Pitch.result(i);const diff=got===null?99:got-P(n.p).midi;const ok=Math.abs(diff-12*Math.round(diff/12))<.6&&Math.abs(diff)<13;marks[i]=ok?"ok":"miss";res.push(ok);}
      at+=d;}
    playing=0;cur=-1;showPos(null);draw();$("#stop").hidden=true;$("#demo").disabled=$("#along").disabled=false;
    const r=rec().songs[id]||(rec().songs[id]={plays:0});r.plays++;api.persist();
    if(marks&&res.length){const okN=res.filter(Boolean).length;r.best=Math.max(r.best||0,Math.round(okN/res.length*100));api.persist();
      $("#sres").textContent=L(`收到 ${okN}/${res.length} 個準確嘅音（綠色）。橙色嗰啲再慢慢練。`,`聽到 ${okN}/${res.length} 個準確的音（綠色）。橘色的再慢慢練。`);
      speak(okN/res.length>=.8?L("好準呀！","好準喔！"):L("唔錯！橙色嗰啲再練吓。","不錯！橘色的再練練。"));}
    else if(mode==="along")speak(L("奏完喇！可以轉快啲再試。","奏完了！可以換快一點再試。"));
  }
  $("#demo").onclick=()=>run("demo");$("#along").onclick=()=>run("along");
  speak(L(`${sg.t}。先撳「聽示範」，再用你嘅${INST[inst].hk}跟住奏。`,`${sg.t}。先按「聽示範」，再用你的${INST[inst].tw}跟著奏。`));
}

/* ---- microphone pitch detection (autocorrelation); optional, only after the child ticks the box ---- */
const Pitch=(()=>{let stream=null,an=null,buf=null,raf=0,curWin=-1;const wins={};
  function detect(){an.getFloatTimeDomainData(buf);const n=buf.length;let rms=0;for(let i=0;i<n;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/n);if(rms<.015)return null;
    /* YIN: cumulative-mean-normalised difference, first dip under the threshold */
    const sr=api.ctx().sampleRate,maxL=Math.min(Math.floor(sr/150),n>>1),d=new Float32Array(maxL+1);let run=0,tau=-1;d[0]=1;
    for(let l=1;l<=maxL;l++){let s=0;for(let i=0;i<maxL;i++){const x=buf[i]-buf[i+l];s+=x*x;}run+=s;d[l]=s*l/(run||1);}
    for(let l=Math.floor(sr/1400);l<=maxL;l++){if(d[l]<.15){while(l+1<=maxL&&d[l+1]<d[l])l++;tau=l;break;}}
    if(tau<1)return null;const a=d[tau-1]??d[tau],b=d[tau],c=d[tau+1]??d[tau];const shift=(a-c)/(2*(a-2*b+c)||1);
    const f=sr/(tau+(isFinite(shift)?shift:0));return 69+12*Math.log2(f/440);}
  function loop(){const m=detect();if(m!==null&&curWin>=0)(wins[curWin]=wins[curWin]||[]).push(m);raf=requestAnimationFrame(loop);}
  return {
    async start(){try{const ctx=api.ctx();stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      const src=ctx.createMediaStreamSource(stream);an=ctx.createAnalyser();an.fftSize=2048;buf=new Float32Array(an.fftSize);src.connect(an);loop();return true;}catch(e){return false;}},
    stop(){cancelAnimationFrame(raf);if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;},
    window(i){curWin=i;wins[i]=[];},
    result(i){const a=wins[i]||[];if(a.length<3)return null;
      /* octave errors are common with autocorrelation: fold to the nearest of m, m±12 later by caller; here take the median */
      const s=a.slice().sort((x,y)=>x-y);return s[Math.floor(s.length/2)];}
  };})();

return {open,instName:k=>L(INST[k].hk,INST[k].tw),INST,score,P,DRILLS,SONGS,RHY,customs:k=>customs(k)};
};
})();
