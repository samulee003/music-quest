/* 音符小勇者 — engine + screens */
(function(){
"use strict";
const ART=window.ART;
const $=s=>typeof s==="string"?document.querySelector(s):s;
const $$=s=>[...document.querySelectorAll(s)];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const rint=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ================= save ================= */
const KEY="mq3";
const DEF={v:3,profile:null,levels:{},friends:{},settings:{voice:true,music:true,sfx:true},unlockAll:false,playMs:0};
/* several children per device: profile list + one save per child */
const fresh=()=>JSON.parse(JSON.stringify(DEF));
let PROF={cur:null,list:[]};
try{const p=JSON.parse(localStorage.getItem("mq-profiles")||"null");if(p&&Array.isArray(p.list))PROF=p;}catch(e){}
function loadSave(id){let s=fresh();try{const x=JSON.parse(localStorage.getItem(KEY+":"+id)||"null");if(x&&x.v===3)s=Object.assign(s,x,{settings:Object.assign({},DEF.settings,x.settings||{})});}catch(e){}return s;}
try{const old=localStorage.getItem(KEY);if(old&&!PROF.list.length){const x=JSON.parse(old);if(x&&x.profile){const id="p"+Date.now().toString(36);localStorage.setItem(KEY+":"+id,old);PROF={cur:id,list:[{id,name:"",hero:x.profile.hero||0}]};localStorage.setItem("mq-profiles",JSON.stringify(PROF));}}}catch(e){}
let S=PROF.cur&&PROF.list.some(p=>p.id===PROF.cur)?loadSave(PROF.cur):fresh();
const saveProf=()=>{try{localStorage.setItem("mq-profiles",JSON.stringify(PROF));}catch(e){}};
const persist=()=>{if(!PROF.cur)return;try{localStorage.setItem(KEY+":"+PROF.cur,JSON.stringify(S));}catch(e){}const p=PROF.list.find(x=>x.id===PROF.cur);if(p&&S.profile){p.hero=S.profile.hero;if(S.profile.name!==undefined)p.name=S.profile.name;}saveProf();};
const curProf=()=>PROF.list.find(x=>x.id===PROF.cur)||null;
let sessMs=0,restShown=false;const REST_MS=20*60000;
setInterval(()=>{if(document.visibilityState==="visible"&&S.profile){S.playMs+=10000;sessMs+=10000;persist();}},10000);

/* ================= i18n ================= */
let lang=(S.profile&&S.profile.lang)||"hk";
const L=(hk,tw)=>lang==="hk"?hk:tw;
const NN=i=>["Do","Re","Mi","Fa",lang==="hk"?"So":"Sol","La",lang==="hk"?"Ti":"Si"][((i%7)+7)%7];

/* ================= token (cancels stale async) ================= */
let TOK=0;
const live=my=>my===undefined?++TOK:my===TOK;

/* ================= audio ================= */
let AC=null,MASTER=null,SFXBUS=null,BGMBUS=null;const BUF={};let loaded=0,toLoad=0;
function ac(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();MASTER=AC.createGain();MASTER.gain.value=.9;MASTER.connect(AC.destination);
    const comp=AC.createDynamicsCompressor();comp.threshold.value=-10;comp.ratio.value=4;comp.connect(MASTER);
    SFXBUS=AC.createGain();SFXBUS.connect(comp);BGMBUS=AC.createGain();BGMBUS.gain.value=0;BGMBUS.connect(comp);
    window.__MQ_MAIN=comp;}catch(e){}}
  return AC;
}
function b64(s){const bin=atob(s),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u.buffer;}
/* instrument samples (~2 MB) load after first paint so the title appears at once */
function loadSamples(){
  if(!window.MQ_SND){if(loadSamples.req)return;loadSamples.req=1;toLoad=1;const sc=document.createElement("script");sc.src="sounds.js";sc.charset="utf-8";sc.onload=()=>{toLoad=0;loadSamples();};sc.onerror=()=>{loaded=toLoad=1;onLoad();};document.head.appendChild(sc);return;}
  const snd=window.MQ_SND;if(!ac())return;
  const jobs=[];for(const inst in snd)for(const n in snd[inst])jobs.push([inst,n,snd[inst][n]]);
  toLoad=jobs.length;
  jobs.forEach(([inst,n,data])=>{
    try{AC.decodeAudioData(b64(data),buf=>{(BUF[inst]=BUF[inst]||{})[n]=buf;loaded++;onLoad();},()=>{loaded++;onLoad();});}catch(e){loaded++;onLoad();}
  });
}
/* violin samples (~450 KB) load only when a child uses the violin */
function loadVln(){if(BUF.violin||loadVln.req)return;loadVln.req=1;const go=()=>{const v=window.MQ_VLN;if(!v||!ac())return;for(const n in v){try{AC.decodeAudioData(b64(v[n]),buf=>{(BUF.violin=BUF.violin||{})[n]=buf;},()=>{});}catch(e){}}};
  if(window.MQ_VLN)go();else{const sc=document.createElement("script");sc.src="violin.js";sc.charset="utf-8";sc.onload=go;document.head.appendChild(sc);}}
const samplesReady=()=>toLoad>0&&loaded>=toLoad;
function onLoad(){const el=$("#loadbar"),t=$("#loadtxt");const pct=toLoad?Math.round(loaded/toLoad*100):0;
  if(el){el.style.setProperty("--p",pct+"%");el.classList.toggle("wait",!window.MQ_SND);}
  if(t)t.textContent=samplesReady()?L("音效準備好","音效準備好了"):L("準備音效…","準備音效…")+(window.MQ_SND?pct+"%":"");
  if(samplesReady()){el&&el.classList.add("done");t&&t.classList.add("done");}}
const FREQ=n=>{const m={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[n[0]],o=+n.slice(-1);return 440*Math.pow(2,(m+(o+1)*12-69)/12);};
function play(inst,n,dur=.8,vol=.8,when=0,bus){
  const a=ac();if(!a)return;if(a.state==="suspended")a.resume();
  const t=a.currentTime+when+.01,g=a.createGain(),out=bus||SFXBUS;
  const buf=BUF[inst]&&BUF[inst][n];
  if(buf){const s=a.createBufferSource();s.buffer=buf;s.connect(g);
    g.gain.setValueAtTime(vol,t);g.gain.setValueAtTime(vol,t+dur);g.gain.exponentialRampToValueAtTime(.0008,t+dur+.35);
    g.connect(out);s.start(t);s.stop(t+dur+.4);}
  else{const o=a.createOscillator();o.type=inst==="piano"?"triangle":"sine";o.frequency.value=FREQ(n);o.connect(g);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*.4,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+dur+.2);g.connect(out);o.start(t);o.stop(t+dur+.25);}
}
const piano=(n,dur=.8,vol=.8,when=0)=>play("piano",n,dur,Math.min(1.4,vol),when);
const seq=(ns,step=.3,vol=.8)=>ns.forEach((n,i)=>piano(n,step*1.1,vol,i*step));
const wood=(vol=.8,when=0)=>play("wood","C5",.25,vol*.9,when);
const taiko=(vol=1)=>play("taiko","C3",.5,vol);
const SFX={
  tap(){if(S.settings.sfx)play("wood","G5",.1,.18);},
  right(){if(!S.settings.sfx)return;["C5","E5","G5"].forEach((n,i)=>play("marimba",n,.3,.55,i*.07));},
  combo(){if(!S.settings.sfx)return;["C6","E6","G6","C7"].forEach((n,i)=>play("glock",n,.4,.4,i*.07));},
  wrong(){if(!S.settings.sfx)return;play("marimba","E4",.25,.45);play("marimba","C4",.4,.45,.16);},
  hit(){if(S.settings.sfx)play("taiko","G3",.4,.9);},
  star(i){if(S.settings.sfx)play("glock",["C6","E6","G6"][i]||"C7",.5,.5);},
  win(){if(!S.settings.sfx)return;["C5","E5","G5","C6","G5","C6"].forEach((n,i)=>play("marimba",n,.3,.55,i*.12));["C6","E6","G6","C7"].forEach((n,i)=>play("glock",n,.5,.3,.7+i*.1));},
  laugh(){if(!S.settings.sfx)return;["G4","E4","G4","E4"].forEach((n,i)=>play("marimba",n,.12,.3,i*.09));}
};
/* light haptics on phones that support it (Android); silent elsewhere */
const buzz=p=>{if(S.settings.sfx&&navigator.vibrate)try{navigator.vibrate(p);}catch(e){}};
async function rhythm(toks,o={}){
  const b=60/(o.bpm||84),my=o.my;const BE={q:1,e2:1,s4:1,h:2,dh:3,w:4,qr:1,hr:2,wr:4,tie:2};
  const total=toks.reduce((s,t)=>s+BE[t],0);
  if(o.dots)o.dots.innerHTML=Array(total).fill("<i></i>").join("");
  let at=0;
  toks.forEach((t,k)=>{const d=BE[t];
    if(t==="e2"){piano("G4",b*.45,.8,at*b);piano("G4",b*.45,.8,(at+.5)*b);}
    else if(t==="s4"){for(let k=0;k<4;k++)piano("G4",b*.22,.75,(at+k*.25)*b);}
    else if(!t.endsWith("r"))piano("G4",d*b*.92,.85,at*b);
    if(o.beat)for(let x=0;x<d;x++)wood(.35,(at+x)*b);
    at+=d;});
  let beat=0;
  for(let k=0;k<toks.length;k++){
    const d=BE[toks[k]];
    if(o.cards&&o.cards[k])o.cards[k].classList.add("on");
    for(let x=0;x<d;x++){if(my!==undefined&&!live(my))return;if(o.dots&&o.dots.children[beat])o.dots.children[beat].classList.add("on");beat++;await wait(b*1000);}
    if(o.cards&&o.cards[k])o.cards[k].classList.remove("on");
  }
}
/* ---- background music: gentle marimba loop on map/title ---- */
let bgmTimer=null,bgmStep=0,bgmCh=0;
const BGM=[
 [["C5","E5","G5","E5"],["C5","E5","G5","C6"],["G4","C5","E5","C5"],["G4","C5","E5","G5"]],
 [["E5","G5","C6","G5"],["E5","C5","G4","C5"],["G4","C5","E5","G5"],["E5","C5","E5","G4"]],
 [["G5","E5","C5","E5"],["G5","C6","G5","E5"],["C5","E5","G5","C6"],["G5","E5","C5","G4"]]
];
const BGM_FILES=["music/ch0.mp3","music/ch1.mp3","music/ch2.mp3"];const BGMBUF={};let bgmSrc=null,bgmPlaying=-1;
function bgmBuf(i){if(!BGMBUF[i])BGMBUF[i]=fetch(BGM_FILES[i%BGM_FILES.length]).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(b=>new Promise((ok,no)=>AC.decodeAudioData(b,ok,no)));return BGMBUF[i];}
function bgmStart(ch=0){bgmCh=ch;if(!S.settings.music||!AC)return;
  BGMBUS.gain.cancelScheduledValues(AC.currentTime);BGMBUS.gain.setTargetAtTime(.32,AC.currentTime,.6);
  if(bgmPlaying===ch&&(bgmSrc||bgmTimer))return;
  stopBgmSources();bgmPlaying=ch;
  bgmBuf(ch).then(buf=>{if(bgmPlaying!==ch||bgmSrc)return;const s=AC.createBufferSource();s.buffer=buf;s.loop=true;s.connect(BGMBUS);s.start();bgmSrc=s;})
   .catch(()=>{if(bgmPlaying===ch&&!bgmTimer)procBgm();});
}
function stopBgmSources(){if(bgmSrc){try{bgmSrc.stop();}catch(e){}bgmSrc=null;}if(bgmTimer){clearInterval(bgmTimer);bgmTimer=null;}}
function procBgm(){BGMBUS.gain.setTargetAtTime(.22,AC.currentTime,.6);
  const beat=.5;let next=AC.currentTime+.1;
  bgmTimer=setInterval(()=>{while(next<AC.currentTime+1.2){const bar=BGM[bgmCh%BGM.length][Math.floor(bgmStep/4)%4],n=bar[bgmStep%4];
    play("marimba",n,.4,.5,next-AC.currentTime,BGMBUS);if(bgmStep%4===0)play("piano",["C3","A2","F2","G2"][Math.floor(bgmStep/4)%4],1.8,.35,next-AC.currentTime,BGMBUS);
    bgmStep++;next+=beat;}},300);}
function bgmStop(){bgmPlaying=-1;const s=bgmSrc,t=bgmTimer;bgmSrc=null;bgmTimer=null;if(t)clearInterval(t);if(s&&AC){try{s.stop(AC.currentTime+.6);}catch(e){}}if(AC&&BGMBUS){BGMBUS.gain.cancelScheduledValues(AC.currentTime);BGMBUS.gain.setTargetAtTime(0,AC.currentTime,.25);}}

/* ================= speech ================= */
let VOICES=[];
const loadVoices=()=>{try{VOICES=speechSynthesis.getVoices()||[];}catch(e){VOICES=[];}};
const isCanto=v=>{const l=(v.lang||"").toLowerCase().replace("_","-"),n=(v.name||"").toLowerCase();return l==="zh-hk"||l.startsWith("yue")||l==="zh-mo"||/cantonese|粵|廣東|sin-ji|sinji|hiugaai|hiumaan|wanlung|hong kong/.test(n);};
const isMando=v=>{const l=(v.lang||"").toLowerCase().replace("_","-");return (l.startsWith("zh-tw")||l.startsWith("zh-cn")||l==="cmn-hant-tw"||l==="zh")&&!isCanto(v);};
function pickVoice(){if(!VOICES.length)loadVoices();const pool=VOICES.filter(lang==="hk"?isCanto:isMando);
  const sc=v=>(/tw/i.test(v.lang)&&lang==="tw"?2:0)+(/google|premium|enhanced|natural|neural|siri/i.test(v.name)?1:0);
  pool.sort((a,b)=>sc(b)-sc(a));return pool[0]||null;}
/* recorded voice clips (voice/<lang>/<id>.mp3, manifest window.MQ_VOICE) with device TTS fallback */
const VCACHE={};let curSrc=null,speakGen=0;
window.__MQ_SPOKEN=window.__MQ_SPOKEN||{hk:new Set(),tw:new Set()};
function clipUrl(t){const m=window.MQ_VOICE&&window.MQ_VOICE[lang];const id=m&&m[t];return id?`voice/${lang}/${id}.mp3`:null;}
async function clipBuf(url){if(!VCACHE[url])VCACHE[url]=fetch(url).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer();}).then(b=>new Promise((ok,no)=>AC.decodeAudioData(b,ok,no)));return VCACHE[url];}
function ttsOne(text){
  return new Promise(res=>{
    if(!("speechSynthesis" in window)){res();return;}
    try{const u=new SpeechSynthesisUtterance(String(text).replace(/[—…]/g,"，").replace(/ta-a-a-a/g,"ta，啊，啊，啊").replace(/ta-a/g,"ta，啊"));
      const v=pickVoice();if(v){u.voice=v;u.lang=v.lang;}else u.lang=lang==="hk"?"zh-HK":"zh-TW";
      u.rate=lang==="hk"?.95:.92;u.pitch=1.12;let done=false;const fin=()=>{if(!done){done=true;res();}};
      u.onend=fin;u.onerror=fin;setTimeout(fin,Math.min(9000,600+String(text).length*190));speechSynthesis.speak(u);}catch(e){res();}
  });
}
async function speakOne(text,gen){
  window.__MQ_SPOKEN[lang].add(text);
  const url=clipUrl(text);
  if(url&&ac()){try{const buf=await clipBuf(url);if(gen!==speakGen)return;
      await new Promise(res=>{const s=AC.createBufferSource();s.buffer=buf;const g=AC.createGain();g.gain.value=1.15;s.connect(g);g.connect(window.__MQ_MAIN||AC.destination);s.onended=res;curSrc=s;s.start();setTimeout(res,buf.duration*1000+300);});
      return;}catch(e){}}
  if(gen!==speakGen)return;await ttsOne(text);
}
async function speak(parts){
  hush();const gen=++speakGen;
  if(!S.settings.voice||!parts)return;
  const arr=(Array.isArray(parts)?parts:[parts]).filter(Boolean);
  for(const p of arr){if(gen!==speakGen)return;await speakOne(p,gen);}
}
const hush=()=>{try{speechSynthesis.cancel();}catch(e){}try{curSrc&&curSrc.stop();}catch(e){}curSrc=null;};

/* ================= fx: particles ================= */
const fx=document.getElementById("fx"),fxc=fx.getContext("2d");let P=[],raf=0;
function sizeFx(){const dpr=Math.min(2,devicePixelRatio||1);fx.width=innerWidth*dpr;fx.height=innerHeight*dpr;fxc.setTransform(dpr,0,0,dpr,0,0);}
sizeFx();addEventListener("resize",sizeFx);
const COLS=["#e63946","#f4842d","#f2c230","#3fae6a","#2a9df4","#7b5ce7","#ff6fa3","#fff"];
function burst(x,y,o={}){if(RM)return;const n=o.n||16;for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,sp=(o.sp||5)*(.4+Math.random());
  P.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(o.up||2),g:o.g??.18,life:1,dl:.012+Math.random()*.02,s:(o.s||8)*(.6+Math.random()*.8),c:o.c||pick(COLS),k:o.k||pick(["star","note","dot"]),r:Math.random()*6,vr:(Math.random()-.5)*.3});}
  if(!raf)raf=requestAnimationFrame(tickFx);}
function rain(n=60){if(RM)return;for(let i=0;i<n;i++)P.push({x:Math.random()*innerWidth,y:-20-Math.random()*innerHeight*.6,vx:(Math.random()-.5)*1.5,vy:2+Math.random()*2.5,g:.02,life:1,dl:.004,s:8+Math.random()*8,c:pick(COLS),k:pick(["star","note","dot","rect"]),r:Math.random()*6,vr:(Math.random()-.5)*.2});if(!raf)raf=requestAnimationFrame(tickFx);}
function star(c,s){c.beginPath();for(let i=0;i<10;i++){const r=i%2?s*.45:s,a=i*Math.PI/5-Math.PI/2;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();}
function tickFx(){fxc.clearRect(0,0,innerWidth,innerHeight);
  P=P.filter(p=>p.life>0&&p.y<innerHeight+40);
  for(const p of P){p.vy+=p.g;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.life-=p.dl;
    fxc.save();fxc.globalAlpha=Math.max(0,Math.min(1,p.life*1.5));fxc.translate(p.x,p.y);fxc.rotate(p.r);fxc.fillStyle=p.c;fxc.strokeStyle="#24305e";fxc.lineWidth=1.5;
    if(p.k==="star")star(fxc,p.s);else if(p.k==="note"){fxc.beginPath();fxc.ellipse(0,0,p.s*.6,p.s*.45,-.4,0,7);fxc.fill();fxc.fillRect(p.s*.45,-p.s*1.6,p.s*.18,p.s*1.6);}
    else if(p.k==="rect")fxc.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);else{fxc.beginPath();fxc.arc(0,0,p.s*.4,0,7);fxc.fill();}
    fxc.restore();}
  raf=P.length?requestAnimationFrame(tickFx):0;if(!raf)fxc.clearRect(0,0,innerWidth,innerHeight);}
const center=el=>{const r=$(el).getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];};

/* ================= small UI helpers ================= */
const reanim=(el,c)=>{el=$(el);if(!el)return;el.classList.remove(c);void el.getBoundingClientRect();el.classList.add(c);};
const bounce=el=>reanim(el,"bounce");
const flash=el=>{el=$(el);if(!el)return;el.classList.add("lit");setTimeout(()=>el.classList.remove("lit"),320);};
const pop=g=>reanim(g,"pop");
function floatText(x,y,txt,cls=""){const d=document.createElement("div");d.className="float-txt "+cls;d.textContent=txt;d.style.left=x+"px";d.style.top=y+"px";document.body.appendChild(d);setTimeout(()=>d.remove(),1200);}
const screen=$("#screen");
function show(html,cls=""){hush();screen.className="screen "+cls;screen.innerHTML=html;screen.scrollTop=0;scrollTo(0,0);reanim(screen,"enter");}
document.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&!b.disabled&&!b.classList.contains("opt")&&!b.classList.contains("step")&&!b.classList.contains("drum-btn"))SFX.tap();},true);
const icon={
 home:`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>`,
 back:`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 gear:`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
 book:`<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 6.5C9.5 4.8 6.5 4.5 3 5v13.5c3.5-.5 6.5-.2 9 1.5 2.5-1.7 5.5-2 9-1.5V5c-3.5-.5-6.5-.2-9 1.5z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M12 6.5V20" stroke="currentColor" stroke-width="2.4"/><circle cx="7.5" cy="11" r="1.6" fill="currentColor"/><path d="M8.8 11V7.8" stroke="currentColor" stroke-width="1.4"/></svg>`,
 lock:`<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>`,
 castle:`<svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true"><path d="M3 21V9h3v2h2V9h3v2h2V9h3v2h2V9h3v12h-7v-4a2 2 0 0 0-4 0v4z" fill="currentColor"/><path d="M12 2v5l4-1.5L12 4" fill="#ff6fa3"/></svg>`,
 note:`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 17.5V5.5l11-2.5v12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="6.5" cy="17.8" rx="3.2" ry="2.6" fill="currentColor"/><ellipse cx="17.5" cy="15.3" rx="3.2" ry="2.6" fill="currentColor"/></svg>`,
 keys:`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M8 5v14M13 5v14M18 5v14" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 5h3v7h-3zM11.5 5h3v7h-3zM16.5 5h3v7h-3z" fill="currentColor"/></svg>`,
 violin:`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M14.5 3.5l6 6M17 6l-6.5 6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M10.5 9.5c-1.6-1.6-4.2-1-5 .8-.4.9-1.6 1-2.2 1.9-1.2 1.8.6 3.4 1.4 4.2s2.4 2.6 4.2 1.4c.9-.6 1-1.8 1.9-2.2 1.8-.8 2.4-3.4.8-5z" fill="currentColor"/></svg>`,
 stand:`<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M4 4h16v9H4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M7 7.5h10M7 10h10" stroke="currentColor" stroke-width="1.4"/><path d="M12 13v8M8 21h8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
 adult:`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="9" cy="7" r="3.2" fill="currentColor"/><path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6z" fill="currentColor"/><circle cx="17.5" cy="9.5" r="2.4" fill="currentColor" opacity=".7"/><path d="M14.5 20c.3-2.8 1.6-4.6 3.5-4.6 2.2 0 3.5 2 3.5 4.6z" fill="currentColor" opacity=".7"/></svg>`
};
const starRow=(n,max=3)=>`<span class="stars" aria-label="${n}/${max}">${Array.from({length:max},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</span>`;

/* ================= content ================= */
let C=null;
const G={L,NN,ART,pick,shuffle,rint,wait,piano,seq,rhythm,wood,taiko,speak,$,$$,live,bounce,flash,pop,
  earOn:i=>{const e=$$(".ear")[i];e&&e.classList.add("play");},earOff:i=>{const e=$$(".ear")[i];e&&e.classList.remove("play");},
  echoGame:(root,pat,api)=>echoGame(root,pat,api)};
function buildContent(){G.L=L;G.NN=NN;C=window.MQ_CONTENT(G);}
buildContent();
const lvl=id=>C.LEVELS.find(l=>l.id===id);
const chLevels=ch=>C.LEVELS.filter(l=>l.ch===ch);
const rec=id=>S.levels[id]||(S.levels[id]={stars:0,plays:0,first:0,total:0});
/* ---- spaced review: remember which question types each child gets wrong ---- */
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
const dayDiff=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const memo=k=>{S.memo=S.memo||{};return S.memo[k]||(S.memo[k]={w:0,n:0,last:""});};
function markQ(key,ok){if(!key||key==="review")return;const m=memo(key);m.n++;m.last=today();m.w=ok?Math.max(0,m.w-.5):Math.min(6,m.w+1.5);}
const REVIEW_N=8;
function reviewPool(){/* question types from cleared levels; boss levels contribute their mix */
  const keys=new Set();C.LEVELS.forEach(l=>{if(!cleared(l.id))return;(l.mix||[l.id]).forEach(k=>{if(C.GEN[k]&&k!=="echo")keys.add(k);});});return [...keys];}
const reviewReady=()=>reviewPool().length>=2;
function pickReviewKey(used){const pool=reviewPool(),t=today();
  const wt=k=>{const m=(S.memo||{})[k]||{w:0,last:""};const stale=m.last?Math.min(3,dayDiff(m.last,t)/3):2;return (1+m.w*2+stale)/(1+(used[k]||0)*1.5);};
  const tot=pool.reduce((s,k)=>s+wt(k),0);let r=Math.random()*tot;for(const k of pool){r-=wt(k);if(r<=0){used[k]=(used[k]||0)+1;return k;}}const k=pool[0];used[k]=(used[k]||0)+1;return k;}
function reviewLevel(){const fr=C.LEVELS.filter(l=>cleared(l.id)&&!l.boss);const m=fr.length?pick(fr):C.LEVELS[0];let ch=0;C.CHAPTERS.forEach(c=>{if(chUnlocked(c.id))ch=c.id;});
  const used={};return {id:"review",review:true,ch,name:L("每日溫習","每日複習"),mname:L("溫習怪","複習怪"),mon:{...m.mon,id:m.mon.id},hp:REVIEW_N,pickKey:()=>pickReviewKey(used)};}
const weakTopics=()=>Object.entries(S.memo||{}).filter(([k,m])=>m.w>=1.5).sort((a,b)=>b[1].w-a[1].w).map(([k])=>lvl(k)).filter(Boolean);
const cleared=id=>(S.levels[id]&&S.levels[id].stars>0);
function chUnlocked(ch){if(S.unlockAll||ch===0)return true;const b=chLevels(ch-1).find(l=>l.boss);return cleared(b.id);}
function lvUnlocked(l){if(!chUnlocked(l.ch))return false;if(S.unlockAll)return true;const ls=chLevels(l.ch),i=ls.indexOf(l);return i===0||cleared(ls[i-1].id)||cleared(l.id);}
const totalStars=()=>C.LEVELS.reduce((s,l)=>s+((S.levels[l.id]||{}).stars||0),0);
const heroSvg=(cls="")=>ART.hero(S.profile?S.profile.hero:0,cls);

/* ================= TITLE ================= */
function title(){
  TOK++;bgmStop();
  show(`<div class="title-wrap">
   <div class="title-scene">${ART.scene(0)}</div>
   <div class="title-content">
    <h1 class="logo" aria-label="音符小勇者">${[..."音符小勇者"].map((c,i)=>`<span style="--i:${i}">${c}</span>`).join("")}</h1>
    <p class="tagline">${L("由零開始 · 一路學到樂理一級","從零開始 · 一路學到樂理一級")}</p>
    <div class="title-cast"><div class="tc m1">${ART.monster(C.LEVELS[0].mon,"angry")}</div><div class="tc hero">${heroSvg()}</div><div class="tc m2">${ART.monster(C.LEVELS[4].mon,"angry")}</div></div>
    ${PROF.list.length>1?`<p class="who">${L("邊個玩？撳自己個勇者","誰要玩？按自己的勇者")}</p>`:""}
    ${PROF.list.length?`<div class="kids" role="group" aria-label="${L("揀小朋友","選小朋友")}">${PROF.list.map(p=>{const s=loadSave(p.id);const st=C.LEVELS.reduce((a,l)=>a+((s.levels[l.id]||{}).stars||0),0);
      return `<button class="kid ${p.id===PROF.cur?"sel":""}" data-p="${p.id}">${ART.hero(p.hero||0)}<b>${esc(p.name)||L(ART.HEROES[p.hero||0].hk,ART.HEROES[p.hero||0].tw)}</b><small>★ ${st}</small></button>`;}).join("")}
      <button class="kid add" id="addkid"><span class="plus">＋</span><b>${L("新小朋友","新小朋友")}</b></button></div>`:""}
    <button class="btn huge" id="go">${S.profile&&PROF.cur?L("繼續冒險","繼續冒險"):L("開始冒險","開始冒險")}</button>
    ${samplesReady()?"":`<div class="loadbar" id="loadbar"><i></i></div><p class="loadtxt" id="loadtxt">${L("準備音效…","準備音效…")}</p>`}
    <div class="row"><button class="link-btn" id="tlang">${lang==="hk"?"國語 Mandarin":"廣東話 Cantonese"}</button><button class="link-btn" id="tparent">${icon.adult} ${L("家長及老師","家長及老師")}</button></div>
   </div></div>`,"title");
  onLoad();
  const wake=()=>{ac();if(AC&&AC.state==="suspended")AC.resume();};
  $("#go").onclick=()=>{wake();SFX.right();if(!S.profile||!PROF.cur)setup();else map();};
  /* one tap on a child = pick them and jump straight into their map */
  $$(".kid[data-p]").forEach(b=>b.onclick=()=>{wake();SFX.right();if(b.dataset.p!==PROF.cur)switchKid(b.dataset.p);if(S.profile)map();else{title();}});
  const ak=$("#addkid");if(ak)ak.onclick=()=>{ac();persist();PROF.cur=null;S=fresh();curCh=null;map.greeted=0;setup();};
  $("#tlang").onclick=()=>{setLang(lang==="hk"?"tw":"hk");title();};
  $("#tparent").onclick=()=>{ac();parentGate();};
}
function switchKid(id){persist();PROF.cur=id;S=loadSave(id);saveProf();if(S.profile&&S.profile.lang)lang=S.profile.lang;buildContent();curCh=null;map.greeted=0;}
const esc=s=>String(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
function setLang(l){lang=l;if(S.profile){S.profile.lang=l;persist();}buildContent();voiceNotice();}

/* ================= SETUP ================= */
function setup(){
  const draft={lang,hero:0,name:"",inst:null};let step=0;
  const render=()=>{
    const steps=[
     ()=>`<h2>${L("你想聽邊種話？","你想聽哪一種話？")}</h2><div class="choice-row">
        <button class="pick ${draft.lang==="hk"?"sel":""}" data-l="hk"><span class="pick-big">粵</span><b>廣東話</b></button>
        <button class="pick ${draft.lang==="tw"?"sel":""}" data-l="tw"><span class="pick-big">國</span><b>國語</b></button></div>`,
     ()=>`<h2>${L("揀你嘅勇者！","選你的勇者！")}</h2><div class="choice-row heroes">${ART.HEROES.map((h,i)=>`<button class="pick ${draft.hero===i?"sel":""}" data-h="${i}">${ART.hero(i)}<b>${L(h.hk,h.tw)}</b></button>`).join("")}</div>
      <label class="name-field" for="pname">${L("小朋友嘅名（家長可以幫手打，唔填都得）","小朋友的名字（家長可以幫忙打，不填也可以）")}<input id="pname" maxlength="10" autocomplete="off" value="${(draft.name||"").replace(/"/g,"")}" placeholder="${L("例如：小明","例如：小明")}"></label>`,
     ()=>`<h2>${L("你學緊咩樂器？","你在學什麼樂器？")}</h2><div class="choice-row">
        <button class="pick ${draft.inst==="piano"?"sel":""}" data-i="piano"><span class="pick-ic">${icon.keys}</span><b>${L("鋼琴","鋼琴")}</b></button>
        <button class="pick ${draft.inst==="violin"?"sel":""}" data-i="violin"><span class="pick-ic">${icon.violin}</span><b>${L("小提琴","小提琴")}</b></button>
        <button class="pick ${draft.inst==="none"?"sel":""}" data-i="none"><span class="pick-ic">？</span><b>${L("未學／其他","還沒學／其他")}</b></button></div>
      <p class="sub">${L("練習室會教你喺呢件樂器上面點樣讀譜同按。","練習室會教你在這件樂器上怎麼讀譜和按。")}</p>`
    ];
    show(`<div class="setup card">${`<div class="dots">${[0,1,2].map(i=>`<i class="${i<=step?"on":""}"></i>`).join("")}</div>`}${steps[step]()}
      <div class="row"><button class="btn ghost small" id="sb" ${step===0?"hidden":""}>${icon.back} ${L("返回","返回")}</button><button class="btn" id="sn">${step<2?L("下一步","下一步"):L("出發！","出發！")}</button></div></div>`,"setup-s");
    $$(".pick").forEach(b=>b.onclick=()=>{
      if(b.dataset.l){draft.lang=b.dataset.l;lang=draft.lang;buildContent();speak(L("我講廣東話","我說國語"));render();voiceNotice();}
      if(b.dataset.h){draft.hero=+b.dataset.h;speak(L(`我係${ART.HEROES[draft.hero].hk}！`,`我是${ART.HEROES[draft.hero].tw}！`));render();}
      if(b.dataset.i){draft.inst=b.dataset.i;if(draft.inst==="piano")piano("C4",.6);if(draft.inst==="violin"){loadVln();piano("A4",.6);}render();}
    });
    $("#sb").onclick=()=>{step--;render();};
    const pn=$("#pname");if(pn)pn.oninput=()=>{draft.name=pn.value.trim();};
    $("#sn").onclick=()=>{if(step<2){step++;render();}else{const id="p"+Date.now().toString(36);S=fresh();S.profile={...draft,name:draft.name||"",inst:draft.inst==="none"?null:draft.inst};PROF.list.push({id,name:draft.name||"",hero:draft.hero});PROF.cur=id;persist();curCh=null;map.greeted=0;story();}};
    if(step===0)speak(L("你想聽廣東話定國語？","你想聽廣東話還是國語？"));
    if(step===1)speak(L("揀一個勇者陪你冒險！","選一個勇者陪你冒險！"));
    if(step===2)speak(L("你學緊咩樂器？","你在學什麼樂器？"));
  };
  render();
}

/* ================= STORY ================= */
function story(){
  const pages=[
   {art:`<div class="st-art">${ART.owl()}</div>`,t:L("我係咕咕老師！喺音樂王國，每一粒音符都識唱歌。","我是咕咕老師！在音樂王國，每一個音符都會唱歌。")},
   {art:`<div class="st-art row2">${ART.monster(C.LEVELS[17].mon,"angry")}</div>`,t:L("但係走音魔王出現咗！佢將音符變成怪獸，成個王國變得亂晒籠。","可是走音魔王出現了！它把音符變成怪獸，整個王國都亂成一團。")},
   {art:`<div class="st-art row2">${heroSvg()}${ART.owl("sm")}</div>`,t:L("勇者，請你一關一關學本領，幫怪獸變返做音符好朋友！","勇者，請你一關一關學本領，幫怪獸變回音符好朋友！")}
  ];
  let i=0;
  const r=()=>{show(`<div class="story card">${pages[i].art}<p class="story-t">${pages[i].t}</p><div class="dots">${pages.map((_,k)=>`<i class="${k<=i?"on":""}"></i>`).join("")}</div>
    <div class="row"><button class="btn ghost small" id="skip">${L("跳過","跳過")}</button><button class="btn" id="nx">${i<2?L("下一頁","下一頁"):L("去地圖！","去地圖！")}</button></div></div>`,"story-s");
    speak(pages[i].t);$("#skip").onclick=map;$("#nx").onclick=()=>{if(i<2){i++;r();}else map();};};
  r();
}

/* ================= HUD ================= */
const topbar=(extra="")=>`<header class="topbar"><button class="brand-sm" id="tbHome" aria-label="${L("返首頁","回首頁")}">${icon.home}${heroSvg()}<span>音符小勇者</span></button><div class="tb-r">${extra}<span class="pill"><i class="pstar"></i>${totalStars()}</span>
 <button class="icon-btn" id="tbPr" aria-label="${L("練習室","練習室")}">${icon.stand}</button><button class="icon-btn" id="tbBook" aria-label="${L("音符朋友","音符朋友")}">${icon.book}</button><button class="icon-btn" id="tbSet" aria-label="${L("設定","設定")}">${icon.gear}</button></div></header>`;
function bindTop(){const h=$("#tbHome");h&&(h.onclick=title);const pr=$("#tbPr");pr&&(pr.onclick=()=>{ac();PX.open();});const b=$("#tbBook");b&&(b.onclick=collection);const s=$("#tbSet");s&&(s.onclick=settings);}

/* ================= MAP ================= */
let curCh=null;
function currentCh(){if(curCh!==null&&chUnlocked(curCh))return curCh;let c=0;for(let k=0;k<C.CHAPTERS.length;k++)if(chUnlocked(k))c=k;
  for(let k=0;k<C.CHAPTERS.length;k++){if(chUnlocked(k)&&chLevels(k).some(l=>!cleared(l.id))){c=k;break;}}return c;}
function map(){
  TOK++;hush();const ch=curCh=currentCh();const CH=C.CHAPTERS[ch],ls=chLevels(ch);
  if(AC)bgmStart(ch);
  const nextL=ls.find(l=>lvUnlocked(l)&&!cleared(l.id))||null;
  show(`${topbar()}
   <nav class="ch-tabs" aria-label="${L("章節","章節")}">${C.CHAPTERS.map(c=>{const un=chUnlocked(c.id),done=chLevels(c.id).every(l=>cleared(l.id));
     return `<button class="ch-tab ${c.id===ch?"sel":""} ${un?"":"locked"} ${done?"done":""}" data-c="${c.id}" ${un?"":`aria-disabled="true"`} aria-label="${L("第","第")}${c.id+1}${L("章","章")} ${c.name}" style="--cc:${c.color}"><span class="ct-n">${un?c.id+1:icon.lock}</span><small>${c.gradeName.replace(" ","")}</small>${done?`<i class="ct-done"></i>`:""}</button>`;}).join("")}</nav>
   ${reviewReady()?(()=>{const R=S.review||{},done=R.last===today(),wk=weakTopics().slice(0,2);
     return `<button class="rev-card ${done?"done":""}" id="mrev"><span class="rv-ic">${done?"✓":"🔁"}</span><span class="rv-t"><b>${done?L("今日已溫習","今天已複習"):L("每日溫習：8 題","每日複習：8 題")}</b><small>${wk.length?L("專攻：","重點：")+wk.map(l=>l.name).join("、"):L("將學過嘅混埋一齊考","把學過的混在一起考")}</small></span>${R.streak?`<span class="rv-st">🔥 ${R.streak}</span>`:""}</button>`;})():""}
   <section class="ch-banner" style="--cc:${CH.color}">${ART.scene(ch)}<div class="ch-title"><span class="grade">${CH.gradeName}</span><h2>${CH.name}</h2><p>${ls.filter(l=>cleared(l.id)).length} / ${ls.length} ${L("關完成","關完成")}</p></div></section>
   <section class="board" id="board" style="--cc:${CH.color};--cd:${CH.dark}"><svg class="trail" id="trail"></svg>
    ${ls.map((l,i)=>{const r=S.levels[l.id]||{},un=lvUnlocked(l),cur=l===nextL;
      return `<button class="node ${l.boss?"boss":""} ${un?"":"locked"} ${cur?"cur":""} ${cleared(l.id)?"done":""}" data-id="${l.id}" ${un?"":`aria-disabled="true"`} style="--i:${i}">
       <span class="nb">${!un?icon.lock:l.boss?icon.castle:(cleared(l.id)?`<span class="nb-mon">${ART.monster(l.mon,"happy")}</span>`:`<b>${i+1}</b>`)}</span>
       <span class="nl"><b>${l.name}</b><small>${l.goal}</small>${starRow(r.stars||0)}</span></button>`;}).join("")}
    <div class="hero-token" id="tok">${heroSvg()}</div>
   </section>
   <button class="pr-banner" id="mprac"><span class="pb-ic">${S.profile&&S.profile.inst==="violin"?icon.violin:icon.keys}</span><span><b>${L("練習室：正式五線譜","練習室：正式五線譜")}</b><small>${S.profile&&S.profile.inst?L(`讀譜、${S.profile.inst==="violin"?"小提琴指法":"鋼琴按鍵同手指"}、跟住樂譜奏`,`讀譜、${S.profile.inst==="violin"?"小提琴指法":"鋼琴按鍵和手指"}、跟著樂譜奏`):L("鋼琴／小提琴：讀譜、按鍵、指法","鋼琴／小提琴：讀譜、按鍵、指法")}</small></span><span class="pb-go">›</span></button>
   <footer class="map-foot"><button class="link-btn" id="mparent">${icon.adult} ${L("家長及老師","家長及老師")}</button></footer>
   <p class="vnote" id="vnote" hidden></p>`,"map-s");
  bindTop();voiceNotice();
  /* locked things still answer a tap: wobble + tell the child what unlocks them */
  const nope=(el,msg)=>{reanim(el,"nope");SFX.wrong();buzz(25);speak(msg);};
  $$(".ch-tab").forEach(b=>b.onclick=()=>{const c=+b.dataset.c;
    if(!chUnlocked(c)){const boss=chLevels(c-1).find(l=>l.boss);return nope(b,L(`打敗${boss.mname}，就可以去第${c+1}章！`,`打敗${boss.mname}，就可以去第${c+1}章！`));}
    curCh=c;map();});
  $$(".node").forEach(b=>b.onclick=()=>{const l=lvl(b.dataset.id);
    if(!lvUnlocked(l)){const ls=chLevels(l.ch),prev=ls[ls.indexOf(l)-1];return nope(b,prev?L(`先完成「${prev.name}」，呢關就會打開！`,`先完成「${prev.name}」，這關就會打開！`):L("呢關未開喎。","這關還沒開喔。"));}
    ac();lesson(b.dataset.id);});
  $("#mparent").onclick=parentGate;$("#mprac").onclick=()=>{ac();PX.open();};const mr=$("#mrev");mr&&(mr.onclick=()=>{ac();battle("review");});
  layoutBoard(nextL);
  /* bring the next level into view */
  /* bring the next level into view — unless today's review card (at the top) is waiting */
  if(!(reviewReady()&&(S.review||{}).last!==today())){const t=nextL&&$(`.node[data-id="${nextL.id}"]`);if(t){const r=t.getBoundingClientRect();if(r.bottom>innerHeight-20)setTimeout(()=>t.scrollIntoView({block:"center",behavior:RM?"auto":"smooth"}),350);}}
  if(!map.greeted){map.greeted=1;speak(nextL?L(`下一關：${nextL.name}！撳佢開始。`,`下一關：${nextL.name}！按它開始。`):"");}
}
function layoutBoard(nextL){
  const board=$("#board");if(!board)return;const nodes=$$(".node");const W=board.clientWidth;
  const xs=[.26,.74,.3,.72,.28,.62],gap=128;
  nodes.forEach((n,i)=>{const x=xs[i%xs.length]*W,y=112+i*gap;n.style.left=x+"px";n.style.top=y+"px";n.dataset.x=x;n.dataset.y=y;n.classList.toggle("right",xs[i%xs.length]>.5);});
  board.style.height=(112+(nodes.length-1)*gap+100)+"px";
  let d="";nodes.forEach((n,i)=>{const x=+n.dataset.x,y=+n.dataset.y;if(!i)d=`M${x} ${y}`;else{const px=+nodes[i-1].dataset.x,py=+nodes[i-1].dataset.y;d+=` C${px} ${py+gap*.6} ${x} ${y-gap*.6} ${x} ${y}`;}});
  const tr=$("#trail");tr.setAttribute("viewBox",`0 0 ${W} ${board.clientHeight}`);tr.innerHTML=`<path d="${d}" class="trail-bg"/><path d="${d}" class="trail-dash"/>`;
  const tok=$("#tok"),tgt=nextL?board.querySelector(`.node[data-id="${nextL.id}"]`):nodes[nodes.length-1];
  if(tgt){const x=+tgt.dataset.x,y=+tgt.dataset.y,right=tgt.classList.contains("right");tok.style.left=(x+(right?-26:26))+"px";tok.style.top=(y-74)+"px";}
}
addEventListener("resize",()=>{if(screen.classList.contains("map-s")){const id=$(".node.cur");layoutBoard(id?lvl(id.dataset.id):null);}});

/* ================= LESSON ================= */
function lesson(id){
  TOK++;bgmStop();const l=lvl(id),les=C.LESSONS[id],CH=C.CHAPTERS[l.ch];
  const demo=les.html();
  show(`<div class="lesson card" style="--cc:${CH.color}">
    <div class="les-head"><button class="icon-btn" id="lb" aria-label="${L("返地圖","回地圖")}">${icon.back}</button><span class="chip" style="background:${CH.color}">${l.boss?L("魔王關","魔王關"):L("第","第")+(chLevels(l.ch).indexOf(l)+1)+L("關","關")}</span><span class="goal">${L("目標：","目標：")}${l.goal}</span></div>
    <h2>${l.name}</h2>
    <div class="mentor"><div class="mentor-art">${l.boss?ART.monster(l.mon,"angry","bossy"):ART.owl()}</div><div class="bubble-say"><p>${les.say}</p><button class="say-btn" id="rs" aria-label="${L("再聽一次","再聽一次")}">${ART.spk}</button></div></div>
    ${demo?`<div class="demo">${demo}</div><p class="try">${L("撳上面嘅嘢試吓！","按上面的東西試試看！")}</p>`:""}
    <button class="btn huge" id="fight">${l.boss?L("迎戰魔王！","迎戰魔王！"):L("出發打怪！","出發打怪！")}</button></div>`,"lesson-s");
  les.mount();
  $("#lb").onclick=map;$("#rs").onclick=()=>speak(les.say);$("#fight").onclick=()=>battle(id);
  speak(les.say);
}

/* ================= BATTLE ================= */
let B=null;
function battle(id){
  TOK++;bgmStop();const l=id==="review"?reviewLevel():lvl(id),CH=C.CHAPTERS[l.ch];
  B={l,hp:l.hp,max:l.hp,asked:0,first:0,combo:0,maxCombo:0,wrongs:0,qWrong:0,phase:1,busy:false,quitArm:false,missed:[]};
  if(!l.review){rec(id).plays++;persist();}
  show(`<div class="battle" style="--cc:${CH.color}">
    <div class="b-hud"><button class="icon-btn" id="quit" aria-label="${L("離開","離開")}">${icon.back}</button><span class="b-title">${l.name}</span><span class="combo" id="combo" hidden></span></div>
    <div class="arena ${l.boss?"boss-arena":""}" id="arena">${ART.scene(l.ch)}
     <div class="mon-hud"><b>${l.mname}</b><div class="hpbar"><i id="hpfill"></i></div></div>
     <div class="fighter hero" id="hero">${heroSvg()}</div>
     <div class="fighter mon ${l.boss?"bossy":""}" id="mon">${ART.monster(l.mon,"angry")}</div>
    </div>
    <section class="qpanel" id="qp" aria-live="polite"></section></div>`,"battle-s");
  $("#quit").onclick=()=>{if(B.quitArm){map();return;}B.quitArm=true;const q=$("#quit");q.classList.add("armed");q.setAttribute("data-tip",L("再撳一次離開","再按一次離開"));setTimeout(()=>{if(B){B.quitArm=false;q.classList.remove("armed");}},2200);};
  updHP();
  $("#qp").innerHTML=`<div class="appear"><b>${L(`${l.mname}出現咗！`,`${l.mname}出現了！`)}</b></div>`;
  speak(L(`${l.mname}出現咗！`,`${l.mname}出現了！`));
  setTimeout(()=>{if(B&&B.l===l)nextQ();},1300);
}
function updHP(){const f=$("#hpfill");if(f)f.style.width=(B.hp/B.max*100)+"%";}
function genQ(){const l=B.l,d=l.review?.6:1-B.hp/B.max;const key=l.pickKey?l.pickKey():l.mix?pick(l.mix):l.id;const q=C.GEN[key](d);q.key=key;return q;}
async function nextQ(){
  if(!B)return;const my=++TOK;const q=genQ();B.q=q;B.busy=false;B.qWrong=0;
  const qp=$("#qp");if(!qp)return;
  const cols=q.stairs?0:(q.cols||2);
  qp.innerHTML=`<div class="qhead"><button class="say-btn" id="qsay" aria-label="${L("再讀題目","再唸題目")}">${ART.spk}</button><h3>${q.t}</h3></div>
   ${q.visual?`<div class="qvis">${q.visual}</div>`:""}
   ${q.replay?`<button class="replay" id="replay">${icon.note}<span>${L("再聽聲音","再聽聲音")}</span></button>`:""}
   ${q.custom?`<div class="custom" id="custom"></div>`:`<div class="${q.stairs?"stairs ans":"opts"}" id="opts" style="${cols?`--cols:${cols}`:""}">
   ${q.options.map((o,k)=>q.stairs?`<button class="step opt-step" data-k="${k}" style="background:${C.SC[o.note]};height:${48+o.note*12}px">${o.html}</button>`
     :`<button class="opt ${o.bare?"bare":""}" data-k="${k}">${o.html}</button>`).join("")}</div>`}
   <div class="hint" id="hint" hidden></div>`;
  reanim(qp,"qin");
  $("#qsay").onclick=()=>{speak(q.say||q.t).then(()=>{if(live(my)&&q.replay)q.replay();});};
  if(q.replay)$("#replay").onclick=()=>{hush();q.replay();};
  if(q.custom){q.custom($("#custom"),{ok:()=>correct(null,q),bad:h=>wrongCustom(h)});}
  else $$("#opts > button").forEach(b=>b.onclick=()=>answer(b,q.options[+b.dataset.k]));
  await speak(q.say||q.t);
  if(live(my)&&q.auto&&!q.custom)q.auto();
}
function answer(btn,o){
  if(!B||B.busy||btn.disabled)return;
  if(o.note!==undefined)piano(C.stepName(o.note),.5,.7);
  if(o.rh)rhythm([o.rh]);
  if(o.semi!==undefined)piano(["C4","Db4","D4","Eb4","E4","F4","Gb4","G4","Ab4","A4","Bb4","B4","C5"][o.semi],.5,.7);
  if(o.chord)o.chord.forEach(i=>piano(C.stepName(i),1,.55));
  if(o.ok)return correct(btn,B.q);
  if(!B.qWrong){markQ(B.q.key,false);B.missed.push(B.q.key);}
  B.qWrong++;B.wrongs++;B.combo=0;updCombo();SFX.wrong();buzz([30,50,30]);
  btn.classList.add("wrong");btn.disabled=true;
  const m=$("#mon");reanim(m,"taunt");SFX.laugh();
  const opts=$$("#opts > button");const right=opts.find(b=>B.q.options[+b.dataset.k].ok);
  if(B.qWrong>=2&&right){right.classList.add("guide");showHint(L("係呢個！撳佢吓。","是這個！按一下它。"),true);}
  else showHint(B.q.hint);
}
function wrongCustom(h){if(!B.qWrong){markQ(B.q.key,false);B.missed.push(B.q.key);}B.qWrong++;B.wrongs++;B.combo=0;updCombo();SFX.wrong();buzz([30,50,30]);reanim($("#mon"),"taunt");showHint(h||B.q.hint);}
function showHint(t,guide){const h=$("#hint");if(!h)return;h.hidden=false;h.innerHTML=`<span class="hint-owl">${ART.owl()}</span><p>${t}</p>`;reanim(h,"pop-in");try{h.scrollIntoView({block:"nearest",behavior:RM?"auto":"smooth"});}catch(e){}speak(guide?t:[L("唔緊要，再試一次！","沒關係，再試一次！"),t]);}
async function correct(btn,q){
  if(!B||B.busy)return;B.busy=true;hush();
  const firstTry=B.qWrong===0;B.asked++;if(firstTry)markQ(q.key,true);if(firstTry){B.first++;B.combo++;B.maxCombo=Math.max(B.maxCombo,B.combo);}else B.combo=0;
  if(btn){btn.classList.add(btn.classList.contains("step")?"lit":"right");const [x,y]=center(btn);burst(x,y,{n:14,k:"star",c:"#ffd23f"});}
  $$("#opts > button").forEach(b=>b.disabled=true);
  const big=B.combo>=3&&firstTry;
  SFX.right();buzz(big?[15,40,15]:18);if(big)setTimeout(SFX.combo,150);
  updCombo();
  const praise=firstTry?pick(B.combo>=3?[L("連擊！","連擊！"),L("勁呀！","超強！"),L("停唔到手！","停不下來！")]:[L("啱晒！","答對了！"),L("好叻呀！","好厲害！"),L("聽得好仔細！","聽得好仔細！"),L("好眼力！","好眼力！"),L("記得好清楚！","記得很清楚！")]):L("做到喇！","做到了！");
  speak(praise);
  if(q.revealDn!==undefined){const g=document.querySelector("#qnote ellipse");if(g)g.setAttribute("fill",C.SC[q.revealDn%7]);piano(C.stepName(q.revealDn-28),.6);}
  if(q.reveal!==undefined){const g=document.querySelector("#qnote ellipse");if(g)g.setAttribute("fill",C.SC[q.reveal%7]);piano(C.stepName(q.reveal),.6);}
  if(q.after)q.after();
  /* attack */
  const hero=$("#hero"),mon=$("#mon");if(!hero||!mon)return;
  reanim(hero,"attack");
  await wait(220);
  const [hx,hy]=center(hero),[mx,my]=center(mon);
  const shot=document.createElement("div");shot.className="shot"+(big?" big":"");shot.innerHTML=`<svg viewBox="0 0 40 40"><path d="M20 2 l5 11 12 1.5 -9 8 2.6 12 -10.6-6 -10.6 6 2.6-12 -9-8 12-1.5z" fill="${pick(COLS.slice(0,7))}" stroke="#24305e" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(shot);
  const anim=shot.animate([{transform:`translate(${hx-20}px,${hy-30}px) scale(.6) rotate(0)`},{transform:`translate(${(hx+mx)/2-20}px,${Math.min(hy,my)-90}px) scale(${big?1.6:1.1}) rotate(200deg)`},{transform:`translate(${mx-20}px,${my-20}px) scale(${big?1.8:1}) rotate(400deg)`}],{duration:RM?10:480,easing:"ease-in"});
  await anim.finished.catch(()=>{});shot.remove();
  if(!B)return;
  SFX.hit();reanim(mon,"hit");if(big){reanim($("#arena"),"shake");}
  burst(mx,my,{n:big?34:18,sp:big?8:5});
  B.hp=Math.max(0,B.hp-1);updHP();
  floatText(mx,my-60,big?L(`連擊 ×${B.combo}`,`連擊 ×${B.combo}`):"−1",big?"combo-txt":"");
  if(B.l.boss&&B.phase===1&&B.hp<=B.max/2&&B.hp>0){B.phase=2;$("#arena").classList.add("phase2");await wait(500);bubble("#mon",L("你好叻……但我仲未輸！","你很厲害……但我還沒輸！"));speak(L("你好叻……但我仲未輸！","你很厲害……但我還沒輸！"));await wait(1400);}
  await wait(q.after?2300:1000);
  if(!B)return;
  if(B.hp<=0)victory();else nextQ();
}
function updCombo(){const c=$("#combo");if(!c)return;if(B.combo>=2){c.hidden=false;c.textContent=L(`連擊 ${B.combo}`,`連擊 ${B.combo}`);reanim(c,"pop-in");}else c.hidden=true;}
function bubble(sel,t){const el=$(sel);if(!el)return;const b=document.createElement("div");b.className="speech";b.textContent=t;el.appendChild(b);setTimeout(()=>b.remove(),2600);}

/* ---- echo drum mini-game ---- */
function echoGame(root,pat,api){
  const BE={q:1,e2:1,h:2};const on=[];let at=0;pat.forEach(t=>{if(t==="e2"){on.push(at,at+.5);}else on.push(at);at+=BE[t];});
  const bpm=80,b=60/bpm;let taps=[],state="listen",fails=0,timer=0;const my=TOK;
  root.innerHTML=`<div class="pattern" id="ep">${pat.map(t=>`<span class="rcard-mini">${ART.noteSym(C.SYMK[t],ART.INK,t==="e2"?60:46)}<small>${C.SYL[t]}</small></span>`).join("")}</div>
   <p class="echo-st" id="es">${L("聽住……","仔細聽……")}</p>
   <div class="row"><button class="replay" id="el">${icon.note}<span>${L("再聽","再聽")}</span></button></div>
   <button class="drum-btn" id="ed" aria-label="${L("鼓","鼓")}" disabled>${ART.drum}</button>
   <div class="tapdots" id="td">${on.map(()=>"<i></i>").join("")}</div>`;
  const cards=$$("#ep .rcard-mini"),st=$("#es"),drumB=$("#ed"),td=$$("#td i");
  const listen=async()=>{state="listen";drumB.disabled=true;taps=[];td.forEach(i=>i.className="");st.textContent=L("聽住……","仔細聽……");
    for(let k=0;k<4;k++)wood(k?.3:.6,k*b);await wait(4*b*1000);if(!live(my))return;
    await rhythm(pat,{cards,bpm});if(!live(my))return;
    state="play";drumB.disabled=false;st.textContent=L("到你喇！撳個鼓！","輪到你了！按鼓！");reanim(drumB,"bounce");};
  const evaluate=()=>{state="judge";drumB.disabled=true;
    const tol=fails>=2?.3:.16;let ok=taps.length===on.length;
    if(ok&&on.length>1){const span=on[on.length-1]-on[0],ts=taps[taps.length-1]-taps[0];if(ts<=0)ok=false;else for(let i=0;i<on.length;i++){if(Math.abs((on[i]-on[0])/span-(taps[i]-taps[0])/ts)>tol){ok=false;break;}}}
    if(ok){st.textContent=L("一模一樣！","一模一樣！");api.ok();}
    else{fails++;const h=taps.length!==on.length?L(`數吓：要撳 ${on.length} 下，你撳咗 ${taps.length} 下。`,`數一數：要按 ${on.length} 下，你按了 ${taps.length} 下。`):L("次數啱喇！留意 ti-ti 要快啲，ta-a 要等耐啲。","次數對了！注意 ti-ti 要快一點，ta-a 要等久一點。");
      api.bad(h);setTimeout(()=>{if(live(my))listen();},2600);}
  };
  drumB.onpointerdown=e=>{e.preventDefault();if(state!=="play")return;taiko();buzz(10);reanim(drumB,"bounce");const now=performance.now()/1000;taps.push(now);
    const i=taps.length-1;if(td[i])td[i].className="on";if(cards.length){let k=0,acc=0;for(const t of pat){acc+=t==="e2"?2:1;if(i<acc){k=pat.indexOf(t);break;}}}
    clearTimeout(timer);if(taps.length>=on.length){timer=setTimeout(evaluate,350);}else timer=setTimeout(()=>{if(state==="play"&&taps.length)evaluate();},b*2600);};
  $("#el").onclick=()=>{if(state!=="judge")listen();};
  speak(L("先聽，再撳鼓打返出嚟！","先聽，再按鼓打出來！")).then(()=>{if(live(my))listen();});
}

/* ---- daily review result ---- */
async function reviewDone(b){
  const t=today();const R=S.review||(S.review={last:"",streak:0,days:0,total:0});
  if(R.last!==t){R.streak=R.last&&dayDiff(R.last,t)===1?R.streak+1:1;R.days++;R.last=t;}R.total++;persist();
  const mon=$("#mon");mon.classList.add("transform");await wait(450);mon.innerHTML=ART.monster(b.l.mon,"happy");
  const [mx,my]=center(mon);burst(mx,my,{n:40,sp:7,k:"star"});SFX.win();await wait(900);
  const miss=[...new Set(b.missed)].map(k=>lvl(k)).filter(Boolean);
  $("#qp").innerHTML=`<div class="result">
    <div class="streak"><span class="fl">🔥</span><b>${R.streak}</b><small>${L("日連續溫習","天連續複習")}</small></div>
    <h3>${L("今日溫習完成！","今天的複習完成！")}</h3>
    <div class="res-stats"><span><b>${b.first}/${b.asked}</b>${L("一次答啱","一次答對")}</span><span><b>${b.maxCombo}</b>${L("最高連擊","最高連擊")}</span></div>
    ${miss.length?`<p class="res-p">${L("聽日會再考多啲：","明天會再多考：")}${miss.map(l=>`<b>${l.name}</b>`).join("、")}</p>`:`<p class="res-p">${L("全部一次答啱，記得好清楚！","全部一次答對，記得很清楚！")}</p>`}
    <div class="row"><button class="btn ghost small" id="again">${L("再溫一次","再複習一次")}</button><button class="btn" id="cont">${L("返地圖","回地圖")}</button></div></div>`;
  speak([L("今日溫習完成！","今天的複習完成！"),R.streak>1?L(`連續 ${R.streak} 日！`,`連續 ${R.streak} 天！`):""]);
  B=null;$("#again").onclick=()=>battle("review");$("#cont").onclick=map;
}

/* ---- victory ---- */
async function victory(){
  const {l}=B;const b=B;B.busy=true;TOK++;
  if(l.review)return reviewDone(b);
  const ratio=b.first/Math.max(1,b.asked);const stars=ratio>=.85?3:ratio>=.55?2:1;
  const r=rec(l.id);const firstClear=!r.stars;r.stars=Math.max(r.stars,stars);r.first+=b.first;r.total+=b.asked;r.best=Math.max(r.best||0,b.maxCombo);
  const newFriend=!S.friends[l.id];S.friends[l.id]=true;persist();
  const mon=$("#mon");mon.classList.add("transform");await wait(450);
  mon.innerHTML=ART.monster(l.mon,"happy");mon.classList.remove("bossy");$("#arena").classList.remove("phase2");
  const [mx,my]=center(mon);burst(mx,my,{n:40,sp:7,k:"star"});SFX.win();
  bubble("#mon",L("多謝你！我變返好朋友喇！","謝謝你！我變回好朋友了！"));speak(L("多謝你！我變返好朋友喇！","謝謝你！我變回好朋友了！"));
  await wait(1500);
  const praise=ratio>=.85?L("你次次都聽得好仔細，好似真正嘅音樂家！","你每次都聽得很仔細，像真正的音樂家！"):b.wrongs>0&&ratio<.55?L("錯咗都唔放棄，再試就做到——呢個就係勇者！","答錯也不放棄，再試就做到了——這就是勇者！"):L("越打越熟練，繼續加油！","越打越熟練，繼續加油！");
  /* gentle break reminder once per sitting after ~20 minutes of play */
  const rest=!restShown&&sessMs>=REST_MS;if(rest)restShown=true;
  const restTxt=L("你已經玩咗 20 分鐘喇！休息吓對眼、飲啖水，等陣再嚟挑戰。","你已經玩了 20 分鐘了！讓眼睛休息一下、喝口水，等一下再來挑戰。");
  const ls=chLevels(l.ch),idx=ls.indexOf(l),nxt=ls[idx+1];const final=l.id==="boss5";const lastCh=C.CHAPTERS.length-1;
  $("#qp").innerHTML=`<div class="result">
    <div class="res-stars">${[0,1,2].map(i=>`<i class="${i<stars?"on":""}" style="--d:${i}"></i>`).join("")}</div>
    <h3>${l.boss?L("打敗魔王！","打敗魔王！"):L("過關喇！","過關了！")}</h3>
    <p class="res-p">${praise}</p>
    <div class="res-stats"><span><b>${b.first}/${b.asked}</b>${L("一次答啱","一次答對")}</span><span><b>${b.maxCombo}</b>${L("最高連擊","最高連擊")}</span></div>
    ${rest?`<div class="rest-note"><span class="hint-owl">${ART.owl()}</span><p>${restTxt}</p></div>`:""}
    ${newFriend?`<div class="new-friend"><div class="nf-art">${ART.monster(l.mon,"happy")}</div><p><b>${l.mname}</b>${L("變咗你嘅音符朋友！","成為你的音符朋友！")}</p></div>`:""}
    <div class="row"><button class="btn ghost small" id="again">${L("再玩一次","再玩一次")}</button><button class="btn" id="cont">${final?L("領取證書","領取證書"):nxt?L("下一關","下一關"):l.ch<lastCh?L("去下一章","去下一章"):L("返地圖","回地圖")}</button></div></div>`;
  [0,1,2].forEach(i=>{if(i<stars)setTimeout(()=>{SFX.star(i);const s=$$(".res-stars i")[i];if(s){const [x,y]=center(s);burst(x,y,{n:10,k:"star",c:"#ffd23f"});}},300+i*350);});
  speak([l.boss?L("打敗魔王！","打敗魔王！"):L("過關喇！","過關了！"),praise,newFriend?L(`${l.mname}變咗你嘅音符朋友！`,`${l.mname}成為你的音符朋友！`):"",rest?restTxt:""]);
  B=null;
  $("#again").onclick=()=>battle(l.id);
  $("#cont").onclick=()=>{if(final)return ending();if(nxt)return lesson(nxt.id);if(l.ch<C.CHAPTERS.length-1){curCh=l.ch+1;}map();};
  if(firstClear&&l.boss&&l.ch<C.CHAPTERS.length-1)setTimeout(()=>floatText(innerWidth/2,innerHeight*.3,L("新章節解鎖！","新章節解鎖！"),"unlock-txt"),2200);
}

/* ================= ENDING / CERTIFICATE ================= */
function ending(){
  TOK++;if(AC)bgmStart(2);rain(90);SFX.win();
  const name=L(ART.HEROES[S.profile.hero].hk,ART.HEROES[S.profile.hero].tw);
  const d=new Date();const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  show(`<div class="ending card"><h2>${L("音樂王國嘅聲音返嚟喇！","音樂王國的聲音回來了！")}</h2>
   <div class="parade">${C.LEVELS.filter(l=>S.friends[l.id]).map((l,i)=>`<span style="--i:${i}">${ART.monster(l.mon,"happy")}</span>`).join("")}</div>
   <div class="cert"><div class="cert-in"><p class="cert-k">${L("證書","證書")}</p><div class="cert-hero">${heroSvg()}</div><h3>${L("音符小勇者","音符小勇者")}</h3>
    <p>${L(`勇者${name}由預備級一路學到樂理一級，打敗咗走音魔王。`,`勇者${name}從預備級一路學到樂理一級，打敗了走音魔王。`)}</p>
    <p class="cert-s">${starRow(Math.min(3,Math.round(totalStars()/C.LEVELS.length)))} ${totalStars()} / ${C.LEVELS.length*3}</p><p class="cert-d">${ds} · ${L("咕咕老師","咕咕老師")}</p></div></div>
   <p class="sub">${L("可以截圖留念！想攞多啲星星，隨時返去再玩。","可以截圖留念！想拿更多星星，隨時回去再玩。")}</p>
   <button class="btn" id="em">${L("返地圖","回地圖")}</button></div>`,"ending-s");
  speak(L("音樂王國嘅聲音返嚟喇！多謝你，音符小勇者！","音樂王國的聲音回來了！謝謝你，音符小勇者！"));
  $("#em").onclick=map;
}

/* ================= COLLECTION ================= */
function collection(){
  TOK++;const n=C.LEVELS.filter(l=>S.friends[l.id]).length;
  show(`${topbar()}<div class="card coll"><div class="les-head"><button class="icon-btn" id="cb">${icon.back}</button><h2>${L("音符朋友圖鑑","音符朋友圖鑑")}</h2><span class="pill">${n} / ${C.LEVELS.length}</span></div>
   ${C.CHAPTERS.map(ch=>`<h3 class="coll-h" style="color:${ch.dark}">${ch.gradeName} · ${ch.name}</h3><div class="coll-grid">${chLevels(ch.id).map(l=>S.friends[l.id]
     ?`<button class="fcard ${l.boss?"boss":""}" data-id="${l.id}">${ART.monster(l.mon,"happy")}<b>${l.mname}</b><small>${l.name}</small></button>`
     :`<div class="fcard unknown">${ART.monster(l.mon,"angry")}<b>？？？</b><small>${l.name}</small></div>`).join("")}</div>`).join("")}</div>`,"coll-s");
  bindTop();$("#cb").onclick=map;
  $$(".fcard[data-id]").forEach(b=>b.onclick=()=>{bounce(b);seq(pick([["C5","E5","G5"],["G4","C5","E5"],["E5","G5","C6"]]),.15,.7);speak(b.querySelector("b").textContent);const [x,y]=center(b);burst(x,y,{n:10});});
}

/* ================= SETTINGS ================= */
function settings(){
  const ov=document.createElement("div");ov.className="overlay";
  const tg=(k,label)=>`<div class="set-row"><span>${label}</span><button class="toggle ${S.settings[k]?"on":""}" data-k="${k}" aria-pressed="${S.settings[k]}"><i></i></button></div>`;
  ov.innerHTML=`<div class="modal card"><h2>${L("設定","設定")}</h2>
   <div class="set-row"><span>${L("語言","語言")}</span><div class="seg"><button data-l="hk" class="${lang==="hk"?"sel":""}">廣東話</button><button data-l="tw" class="${lang==="tw"?"sel":""}">國語</button></div></div>
   ${tg("voice",L("讀出題目","唸出題目"))}${tg("music",L("背景音樂","背景音樂"))}${tg("sfx",L("音效","音效"))}
   <div class="set-row col"><span>${L("勇者","勇者")}</span><div class="mini-heroes">${ART.HEROES.map((h,i)=>`<button class="mh ${S.profile&&S.profile.hero===i?"sel":""}" data-h="${i}" aria-label="${L(h.hk,h.tw)}">${ART.hero(i)}</button>`).join("")}</div></div>
   <p class="vnote" id="vnote2" hidden></p>
   <button class="btn" id="sx">${L("完成","完成")}</button></div>`;
  document.body.appendChild(ov);
  const close=()=>{ov.remove();if(screen.classList.contains("map-s"))map();};
  ov.onclick=e=>{if(e.target===ov)close();};$("#sx").onclick=close;
  ov.querySelectorAll(".toggle").forEach(b=>b.onclick=()=>{const k=b.dataset.k;S.settings[k]=!S.settings[k];persist();b.classList.toggle("on",S.settings[k]);b.setAttribute("aria-pressed",S.settings[k]);
    if(k==="music"){S.settings.music?bgmStart(curCh||0):bgmStop();}if(k==="voice"&&S.settings.voice)speak(L("我會讀出題目","我會唸出題目"));});
  ov.querySelectorAll(".seg button").forEach(b=>b.onclick=()=>{setLang(b.dataset.l);ov.remove();settings();speak(L("我講廣東話，你聽唔聽到呀？","我說國語，你聽得到嗎？"));});
  ov.querySelectorAll(".mh").forEach(b=>b.onclick=()=>{S.profile.hero=+b.dataset.h;persist();ov.querySelectorAll(".mh").forEach(x=>x.classList.toggle("sel",x===b));});
  voiceNotice("#vnote2");
}
function voiceNotice(sel="#vnote"){
  const el=$(sel);if(!el)return;if(lang!=="hk"||!S.settings.voice){el.hidden=true;return;}
  loadVoices();if(!VOICES.length||pickVoice()){el.hidden=true;return;}
  el.hidden=false;el.innerHTML=`<b>這部裝置未有粵語語音</b>，所以會讀成國語。下載方法：<br>iPhone／iPad：設定 → 輔助使用 → 朗讀內容 → 聲音 → 中文 → 粵語（香港）<br>Android：設定 → 文字轉語音 → 安裝語音數據 → 粵語<br>Mac：系統設定 → 輔助使用 → 朗讀內容 → 系統聲音 → 管理聲音 → 粵語<br>下載後重新打開本頁。`;
}

/* ================= PARENT ZONE ================= */
function parentGate(){
  const ov=document.createElement("div");ov.className="overlay";
  ov.innerHTML=`<div class="modal card gate"><h2>家長及老師</h2><p>請大人<b>按住下面個掣 2 秒</b>進入。</p><button class="hold" id="hold"><i></i><span>按住</span></button><button class="link-btn" id="gx">取消</button></div>`;
  document.body.appendChild(ov);let t=0,raf2=0,st=0;
  const hold=$("#hold");const stop=()=>{cancelAnimationFrame(raf2);hold.style.setProperty("--p","0%");};
  const step=ts=>{const p=Math.min(1,(ts-st)/2000);hold.style.setProperty("--p",(p*100)+"%");if(p>=1){ov.remove();parent();return;}raf2=requestAnimationFrame(step);};
  hold.onpointerdown=e=>{e.preventDefault();st=performance.now();raf2=requestAnimationFrame(step);};
  hold.onpointerup=hold.onpointerleave=hold.onpointercancel=stop;
  $("#gx").onclick=()=>ov.remove();ov.onclick=e=>{if(e.target===ov)ov.remove();};
}
function parent(){
  TOK++;bgmStop();
  const mins=Math.round(S.playMs/60000);
  const TIPS=[
   ["預備級只用耳朵和身體，不讀譜：先建立高低、強弱、快慢的概念（柯達伊、達克羅茲都主張「先聲音、後符號」）。","日常可以玩「我做你猜」：大人用高／低、大聲／小聲哼一句，孩子用手勢回應。","So–Mi 是柯達伊教學法的第一組唱名，像布穀鳥叫或點名的語調。"],
   ["對應樂理一級的「音高」與「節奏」基礎：高音譜號讀音（中央 Do 至高音 Do）、全音符至八分音符及其休止符。","五線譜先記三個錨點：Do（下加一線）、Mi（第一線）、So（第二線）。","拍子用 ta、ti-ti、ta-a 唸，邊唸邊拍手，比先學分數更易明白。"],
   ["對應樂理一級：一條加線範圍、附點二分音符、連結線、十六分音符、2/4 3/4 4/4 拍號與小節、pp 至 ff、漸強漸弱、Allegro／Andante／Moderato。","附點＝加一半；連結線＝兩個音只唱一次，拍子相加。","3/4 拍可以配「強弱弱」身體動作（拍手、拍腿、拍腿）。"],
   ["對應樂理一級：低音譜號、升降還原記號、全音與半音、C 大調音階與音級、主三和弦、音程度數（只數度數）。","全音／半音可在任何鍵盤或結他上找：相鄰兩格＝半音。","數音程時連自己都要數：Do 到 Mi 是三度。"],
   ["對應樂理一級：G、D、F 大調音階、調號與主三和弦（ABRSM 另含 D 大調；Trinity 另含五度圈），以及連奏、斷奏、圓滑線、重音、反覆記號、rit.、頑固音型（ostinato）。","調號口訣：升號依次 Fa、Do；降號 Ti。每多一個升號，主音往上五度（C→G→D）；一個降號是 F 大調。","斷奏／連奏可以用拍手（短促）和揮手（連貫）做身體對照。"]
  ];
  show(`<div class="card parent"><div class="les-head"><button class="icon-btn" id="pb">${icon.back}</button><h2>家長及老師</h2></div>
   ${curProf()?`<p class="ref">目前顯示：<b>${esc(curProf().name)||ART.HEROES[curProf().hero||0].hk}</b> 的進度（在首頁可切換小朋友）</p>`:""}
   ${(()=>{const R=S.review||{};const wk=weakTopics().slice(0,4);return `<p class="ref">每日溫習：連續 <b>${R.streak||0}</b> 日，共 ${R.days||0} 日${R.last?`（最近 ${R.last}）`:""}。${wk.length?`近期較弱：${wk.map(l=>l.name).join("、")}——溫習會自動多出這些題型。`:"暫未發現特別弱的題型。"}</p>`;})()}
   <div class="kpis"><div><b>${totalStars()}</b><span>星星（滿分 ${C.LEVELS.length*3}）</span></div><div><b>${C.LEVELS.filter(l=>cleared(l.id)).length}/${C.LEVELS.length}</b><span>完成關卡</span></div><div><b>${mins}</b><span>遊玩分鐘</span></div></div>
   ${C.CHAPTERS.map((ch,ci)=>`<h3 class="coll-h" style="color:${ch.dark}">${ch.gradeName} · ${ch.name}</h3><p class="ref">${ch.ref}</p>
    <div class="ptable-wrap"><table class="ptable"><thead><tr><th>關卡</th><th>學習目標</th><th>星</th><th>一次答對率</th><th>次數</th></tr></thead><tbody>
    ${chLevels(ci).map(l=>{const r=S.levels[l.id]||{};const acc=r.total?Math.round(r.first/r.total*100):null;
      return `<tr><td><b>${l.name}</b></td><td>${l.goal}</td><td>${starRow(r.stars||0)}</td><td>${acc===null?"—":`<span class="acc ${acc>=85?"good":acc>=55?"mid":"low"}">${acc}%</span>`}</td><td class="num">${r.plays||0}</td></tr>`;}).join("")}
    </tbody></table></div>
    <ul class="tips">${TIPS[ci].map(t=>`<li>${t}</li>`).join("")}</ul>`).join("")}
   ${(()=>{const inst=S.profile&&S.profile.inst;const pr=S.practice||{drills:{},songs:{}};if(!inst)return `<h3 class="coll-h">練習室（樂器）</h3><p class="ref">未選擇樂器。小朋友進入「練習室」時可選鋼琴或小提琴，學習正式五線譜與實際按鍵／指法。</p>`;
     return `<h3 class="coll-h">練習室：${PX.instName(inst)}</h3><p class="ref">${inst==="piano"?"讀譜找琴鍵（右手／左手 C 位置、大譜表、黑鍵），樂曲以正式五線譜顯示並標示手指號碼。":"讀譜找弦與手指（空弦、D 大調高 2、低 2、全指板），樂曲以正式五線譜顯示第一把位指法。"}可勾選「用咪檢查音準」聽孩子用真樂器奏。</p>
     <div class="ptable-wrap"><table class="ptable"><thead><tr><th>項目</th><th>星／成績</th><th>次數</th></tr></thead><tbody>
     ${PX.DRILLS[inst].concat(PX.RHY).map(d=>{const r=pr.drills[d.id]||{};return `<tr><td><b>${d.t}</b></td><td>${starRow(r.stars||0)}</td><td class="num">${r.plays||0}</td></tr>`;}).join("")}
     ${PX.SONGS[inst].concat(PX.customs(inst)).map(sg=>{const r=pr.songs[sg.id]||{};return `<tr><td>${esc(sg.t)}${sg.en?`（${sg.en}）`:"（老師曲目）"}</td><td>${r.best!==undefined?`<span class="acc ${r.best>=85?"good":r.best>=55?"mid":"low"}">音準 ${r.best}%</span>`:"—"}</td><td class="num">${r.plays||0}</td></tr>`;}).join("")}
     </tbody></table></div>`;})()}
   <h3 class="coll-h">小朋友與進度</h3>
   <div class="kid-admin">${PROF.list.map(p=>`<div class="set-row kidrow"><span class="kr-name">${ART.hero(p.hero||0)}<input data-rn="${p.id}" maxlength="10" value="${esc(p.name)}" placeholder="${ART.HEROES[p.hero||0].hk}" aria-label="名字">${p.id===PROF.cur?`<small class="curtag">目前</small>`:""}</span>
     <span class="kr-btns"><button class="btn small ghost" data-ex="${p.id}">進度碼</button><button class="btn small danger" data-del="${p.id}">刪除</button></span></div>`).join("")||"<p>未有小朋友。</p>"}</div>
   <div id="exbox" hidden class="exbox"><p>把這段進度碼貼到另一部裝置的「匯入進度碼」，就可以接續玩：</p><textarea id="extext" readonly rows="3"></textarea><button class="btn small" id="excopy">複製</button></div>
   <div class="set-row col"><span>匯入進度碼（從另一部裝置搬過來，會新增一位小朋友）</span><textarea id="imtext" rows="2" placeholder="貼上進度碼"></textarea><div class="row"><button class="btn small" id="imgo">匯入</button><span id="immsg" class="immsg"></span></div></div>
   <h3 class="coll-h">設定</h3>
   <div class="set-row"><span>開放全部關卡（老師示範用）</span><button class="toggle ${S.unlockAll?"on":""}" id="ua" aria-pressed="${S.unlockAll}"><i></i></button></div>
   <div class="set-row"><span>清除目前小朋友的進度</span><button class="btn small danger" id="rs">清除</button></div>
   <p class="design-note">課程依據：預備級參考柯達伊教學法的聽覺先行次序；之後三章按 ABRSM 及 Trinity 樂理一級（Theory of Music Grade 1）考綱的內容與先後編排，兩者均不分樂器。每章打敗魔王後解鎖下一章。<br>設計原則：答錯不扣血，只會出提示；第二次答錯會直接指出答案，避免挫敗。星星只計「一次答對」的比率，鼓勵細心而非亂撳。每一關的提示都針對該題的概念。</p>
   <p class="credits">進度只存在這部裝置的瀏覽器：清除瀏覽資料會一併清除。換裝置請用「進度碼」。<br>美術：ChatGPT 生成。配音：Gemini 3.8 TTS（粵語／國語）。背景音樂：Flow Music。樂器音色：FluidR3 GM 音色庫（Frank Wen，CC BY 3.0），經 gleitz/midi-js-soundfonts。字體：Chiron GoRound TC、Fredoka、Noto（SIL OFL）。</p>
  </div>`,"parent-s");
  $("#pb").onclick=()=>S.profile?map():title();
  $("#ua").onclick=()=>{S.unlockAll=!S.unlockAll;persist();parent();};
  $$("[data-rn]").forEach(i=>i.onchange=()=>{const p=PROF.list.find(x=>x.id===i.dataset.rn);if(!p)return;p.name=i.value.trim();if(p.id===PROF.cur&&S.profile){S.profile.name=p.name;persist();}else{const s=loadSave(p.id);if(s.profile){s.profile.name=p.name;try{localStorage.setItem(KEY+":"+p.id,JSON.stringify(s));}catch(e){}}saveProf();}});
  $$("[data-ex]").forEach(b=>b.onclick=()=>{const p=PROF.list.find(x=>x.id===b.dataset.ex);const s=p.id===PROF.cur?S:loadSave(p.id);
    const code="MQ1."+btoa(unescape(encodeURIComponent(JSON.stringify({name:p.name,hero:p.hero,save:s}))));$("#exbox").hidden=false;$("#extext").value=code;$("#extext").select();});
  $("#excopy").onclick=()=>{const t=$("#extext");navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t.value).then(()=>{$("#excopy").textContent="已複製";}).catch(()=>{t.select();}):t.select();};
  $$("[data-del]").forEach(b=>b.onclick=()=>{if(!b.dataset.arm){b.dataset.arm=1;b.textContent="確定刪除？";setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent="刪除";}},3000);return;}
    const id=b.dataset.del;PROF.list=PROF.list.filter(x=>x.id!==id);try{localStorage.removeItem(KEY+":"+id);}catch(e){}
    if(PROF.cur===id){PROF.cur=PROF.list[0]?PROF.list[0].id:null;S=PROF.cur?loadSave(PROF.cur):fresh();curCh=null;}saveProf();parent();});
  $("#imgo").onclick=()=>{const m=$("#immsg");try{const raw=$("#imtext").value.trim().replace(/^MQ1\./,"");const o=JSON.parse(decodeURIComponent(escape(atob(raw))));if(!o||!o.save||o.save.v!==3)throw 0;
    const id="p"+Date.now().toString(36);try{localStorage.setItem(KEY+":"+id,JSON.stringify(o.save));}catch(e){}PROF.list.push({id,name:o.name||"",hero:o.hero||0});saveProf();m.textContent="已匯入："+(o.name||"新小朋友");setTimeout(parent,900);}
    catch(e){m.textContent="進度碼不正確，請整段重新複製再貼上。";}};
  const rs=$("#rs");rs.onclick=()=>{if(rs.dataset.arm){const pr=S.profile;S=fresh();S.profile=pr;persist();curCh=null;map.greeted=0;title();return;}rs.dataset.arm=1;rs.textContent="確定清除？再按一次";setTimeout(()=>{if(rs.isConnected){delete rs.dataset.arm;rs.textContent="清除";}},3000);};
}

/* ================= boot ================= */
try{loadVoices();speechSynthesis.onvoiceschanged=()=>{loadVoices();voiceNotice();};}catch(e){}
ac();loadSamples();
document.addEventListener("pointerdown",()=>{if(AC&&AC.state==="suspended")AC.resume();},{passive:true});
document.addEventListener("visibilitychange",()=>{if(document.hidden){bgmStop();hush();}});
const PX=window.MQ_PRACTICE({L,$,$$,show,speak,hush,play,ac,ART,burst,center,reanim,SFX,buzz,wait,RM,starRow,esc,icon,topbar,bindTop,
  getS:()=>S,persist:()=>persist(),map:()=>map(),bgmStop:()=>bgmStop(),wood:(v,w)=>wood(v,w),loadVln,hasVln:()=>!!(BUF.violin&&Object.keys(BUF.violin).length>20),ctx:()=>ac()});
if(S.profile&&S.profile.inst==="violin")setTimeout(loadVln,4000);
window.__MQ={get S(){return S},get B(){return B},C:()=>C,map,battle,lesson,collection,parent,title,ending,practice:()=>PX.open(),PX};
title();
})();
