/* 音符小勇者 — curriculum: chapters, levels, lessons, question generators */
window.MQ_CONTENT=function(G){
"use strict";
const {L,NN,ART,pick,shuffle,rint,wait,piano,seq,rhythm,wood,speak,$,$$,live}=G;
const SC=["#e63946","#f4842d","#f2c230","#3fae6a","#2a9df4","#7b5ce7","#d25fcf","#e63946"];
const stepName=s=>"CDEFGAB"[((s%7)+7)%7]+(4+Math.floor(s/7));
const BEATS={q:1,e2:1,s4:1,h:2,dh:3,w:4,qr:1,hr:2,wr:4,tie:2};
const SYL={q:"ta",e2:"ti-ti",s4:"ti-ka-ti-ka",tie:"ta-a",h:"ta-a",dh:"ta-a-a",w:"ta-a-a-a",qr:L("休","休"),hr:L("休-休","休-休"),wr:L("休休休休","休休休休")};
const SYMK={q:"quarter",e2:"eighths",s4:"s4",tie:"tie",h:"half",dh:"dhalf",w:"whole",qr:"qrest",hr:"hrest",wr:"wrest"};
const tokName=t=>({s4:L("四粒十六分音符","四個十六分音符"),tie:L("連結線","連結線"),q:L("四分音符","四分音符"),e2:L("兩粒八分音符","兩個八分音符"),h:L("二分音符","二分音符"),dh:L("附點二分音符","附點二分音符"),w:L("全音符","全音符"),qr:L("四分休止符","四分休止符"),hr:L("二分休止符","二分休止符"),wr:L("全休止符","全休止符")})[t];
const rcard=(t,c)=>`<span class="rcard-mini">${ART.noteSym(SYMK[t],c||ART.INK,t==="e2"?60:46)}<small>${SYL[t]}</small></span>`;
const opt=(html,ok,extra={})=>Object.assign({html,ok},extra);
const nameOpt=i=>opt(`<span class="solfa" style="color:${SC[i]}">${NN(i)}</span>`,false,{note:i});
const yes=L("啱","對"),
  big=s=>`<span class="big-txt">${s}</span>`;

/* ---------- chapters: Pre-grade aural foundations, then ABRSM / Trinity Theory Grade 1 in three parts ---------- */
const CHAPTERS=[
 {id:0,name:L("聲音草原","聲音草原"),gradeName:L("預備級","預備級"),color:"#3fae6a",dark:"#2c7d4f",ref:L("未讀譜前嘅聽覺基礎（柯達伊：先聲音、後符號）","讀譜前的聽覺基礎（柯達伊：先聲音、後符號）")},
 {id:1,name:L("五線譜森林","五線譜森林"),gradeName:L("一級 ①","一級 ①"),color:"#1f9e93",dark:"#176e67",ref:L("樂理一級：高音譜號讀音、音符與休止符時值","樂理一級：高音譜號讀音、音符與休止符時值")},
 {id:2,name:L("節拍城堡","節拍城堡"),gradeName:L("一級 ②","一級 ②"),color:"#7a52c7",dark:"#4e3690",ref:L("樂理一級：加線、附點、連結線、十六分音符、拍號、術語","樂理一級：加線、附點、連結線、十六分音符、拍號、術語")},
 {id:3,name:L("和聲星空","和聲星空"),gradeName:L("一級 ③","一級 ③"),color:"#d0587e",dark:"#9c3358",ref:L("樂理一級：低音譜號、升降還原、全音半音、C 大調音階、主三和弦、音程","樂理一級：低音譜號、升降還原、全音半音、C 大調音階、主三和弦、音程")},
 {id:4,name:L("調號王國","調號王國"),gradeName:L("一級 ④","一級 ④"),color:"#d98a1c",dark:"#9a5a06",ref:L("樂理一級：G、D、F 大調音階、調號、主三和弦、五度圈入門；連奏、斷奏、圓滑線、重音、反覆記號、rit.、頑固音型","樂理一級：G、D、F 大調音階、調號、主三和弦、五度圈入門；連奏、斷奏、圓滑線、重音、反覆記號、rit.、頑固音型")}
];
const M=(c,shape,eyes,top,o={})=>Object.assign({c,shape,eyes,top},o);
const LEVELS=[
 {id:"pitch",ch:0,name:L("高低音","高低音"),goal:L("分辨聲音高定低","分辨聲音高還是低"),mon:M("#8fd16a",1,2,"antenna",{c2:"#ffd23f",sym:"♭",belly:1}),mname:L("嗡嗡怪","嗡嗡怪"),hp:6},
 {id:"dyn",ch:0,name:L("大聲細聲","大聲小聲"),goal:L("分辨強同弱","分辨強和弱"),mon:M("#ff9f43",0,2,"ears",{c2:"#ffd6a5",teeth:1}),mname:L("吵吵怪","吵吵怪"),hp:6},
 {id:"tempo",ch:0,name:L("快與慢","快與慢"),goal:L("分辨速度快定慢","分辨速度快還是慢"),mon:M("#8ecae6",3,1,"swirl",{c2:"#fff",spots:1}),mname:L("慢吞怪","慢吞怪"),hp:6},
 {id:"somi",ch:0,name:L("So 同 Mi","Sol 和 Mi"),goal:L("聽出 So–Mi 嘅高低","聽出 Sol–Mi 的高低"),mon:M("#ff7eb6",2,2,"horns",{c2:"#fff3b0",belly:1}),mname:L("雙音怪","雙音怪"),hp:6},
 {id:"order",ch:0,name:L("七色樓梯","七色樓梯"),goal:L("記住 Do Re Mi 嘅次序","記住 Do Re Mi 的次序"),mon:M("#ffd166",1,3,"spikes",{c2:"#ef476f"}),mname:L("亂序怪","亂序怪"),hp:6},
 {id:"boss1",ch:0,boss:true,name:L("噪音龍王","噪音龍王"),goal:L("用晒預備級嘅本領","用上預備級的本領"),mon:M("#e76f51",2,2,"horns",{c2:"#ffd23f",boss:1,teeth:1,cape:"#2a9d8f",sym:"♯"}),mname:L("噪音龍王","噪音龍王"),hp:10,mix:["pitch","dyn","tempo","somi","order"]},

 {id:"staff",ch:1,name:L("線與間","線與間"),goal:L("識數五線譜嘅線同間","會數五線譜的線和間"),mon:M("#4cc9f0",0,2,"leaf",{c2:"#80ed99"}),mname:L("斷線怪","斷線怪"),hp:6},
 {id:"names",ch:1,name:L("高音譜號","高音譜號"),goal:L("讀出 Do 至高音 Do","讀出 Do 到高音 Do"),mon:M("#90be6d",1,1,"antenna",{c2:"#f9c74f",belly:1}),mname:L("迷路怪","迷路怪"),hp:7},
 {id:"beats",ch:1,name:L("音符時值","音符時值"),goal:L("知道每種音符有幾多拍","知道每種音符有幾拍"),mon:M("#f9844a",3,2,"horns",{c2:"#ffe8d6",teeth:1}),mname:L("搶拍怪","搶拍怪"),hp:7},
 {id:"rests",ch:1,name:L("休止符","休止符"),goal:L("認識靜音嘅拍子","認識安靜的拍子"),mon:M("#b5838d",2,2,"ears",{c2:"#ffcdb2"}),mname:L("吵醒怪","吵醒怪"),hp:6},
 {id:"echo",ch:1,name:L("回音鼓","回音鼓"),goal:L("聽完節奏，自己拍返出嚟","聽完節奏，自己打出來"),mon:M("#43aa8b",1,3,"antenna",{c2:"#f9c74f"}),mname:L("回音怪","回音怪"),hp:5},
 {id:"boss2",ch:1,boss:true,name:L("亂拍熊王","亂拍熊王"),goal:L("用晒一級 ① 嘅本領","用上一級 ① 的本領"),mon:M("#6d597a",1,2,"ears",{c2:"#e5c3d1",boss:1,teeth:1,cape:"#e56b6f",sym:"𝄽"}),mname:L("亂拍熊王","亂拍熊王"),hp:10,mix:["staff","names","beats","rests"]},

 {id:"high",ch:2,name:L("加線同高音","加線與高音"),goal:L("讀出加線同五線譜上面嘅音","讀出加線和五線譜上方的音"),mon:M("#ff6b6b",2,2,"spikes",{c2:"#ffd93d",belly:1}),mname:L("爬高怪","爬高怪"),hp:7},
 {id:"dotted",ch:2,name:L("附點與連結線","附點與連結線"),goal:L("附點加長一半；連結線將拍子加埋","附點加長一半；連結線把拍子加起來"),mon:M("#ffbe0b",1,2,"swirl",{c2:"#fb5607",spots:1}),mname:L("點點怪","點點怪"),hp:6},
 {id:"meter",ch:2,name:L("拍號同小節","拍號與小節"),goal:L("2/4、3/4、4/4：每小節要夠拍","2/4、3/4、4/4：每小節要剛好夠拍"),mon:M("#3a86ff",0,2,"horns",{c2:"#bde0fe"}),mname:L("拆格怪","拆格怪"),hp:7},
 {id:"dynmark",ch:2,name:L("速度同強弱術語","速度與強弱術語"),goal:L("識讀 pp 至 ff、Allegro、Andante","會讀 pp 到 ff、Allegro、Andante"),mon:M("#fb5607",3,2,"ears",{c2:"#ffbe0b",teeth:1}),mname:L("忽大忽細怪","忽大忽小怪"),hp:7},
 {id:"contour",ch:2,name:L("旋律山路","旋律山路"),goal:L("聽出旋律向上定向下","聽出旋律往上還是往下"),mon:M("#8338ec",1,1,"swirl",{c2:"#ff006e",belly:1}),mname:L("迷宮怪","迷宮怪"),hp:6},
 {id:"boss3",ch:2,boss:true,name:L("節拍龍王","節拍龍王"),goal:L("用晒一級 ② 嘅本領","用上一級 ② 的本領"),mon:M("#3a86ff",2,2,"horns",{boss:1,img:"boss1",hue:200}),mname:L("節拍龍王","節拍龍王"),hp:10,mix:["high","dotted","meter","dynmark","contour"]},

 {id:"bass",ch:3,name:L("低音譜號","低音譜號"),goal:L("讀出低音譜號上嘅音","讀出低音譜號上的音"),mon:M("#5aa9e6",3,2,"horns",{img:"beats",hue:200}),mname:L("低沉怪","低沉怪"),hp:7},
 {id:"acc",ch:3,name:L("升降還原","升降還原"),goal:L("♯ 升半音、♭ 降半音、♮ 還原","♯ 升半音、♭ 降半音、♮ 還原"),mon:M("#9b5de5",1,3,"spikes",{img:"order",hue:150}),mname:L("升降怪","升降怪"),hp:7},
 {id:"tone",ch:3,name:L("全音同半音","全音與半音"),goal:L("分辨全音同半音","分辨全音和半音"),mon:M("#00bbf9",2,2,"horns",{img:"somi",hue:180}),mname:L("半步怪","半步怪"),hp:6},
 {id:"scale",ch:3,name:L("C 大調音階","C 大調音階"),goal:L("音級 1–8、主音、主三和弦","音級 1–8、主音、主三和弦"),mon:M("#f15bb5",0,2,"ears",{img:"dyn",hue:260}),mname:L("音階怪","音階怪"),hp:7},
 {id:"interval",ch:3,name:L("音程度數","音程度數"),goal:L("數出兩個音相差幾多度","數出兩個音相差幾度"),mon:M("#00f5d4",1,3,"antenna",{img:"echo",hue:90}),mname:L("量尺怪","量尺怪"),hp:7},
 {id:"boss4",ch:3,boss:true,name:L("音階巫師","音階巫師"),goal:L("用晒一級 ③ 嘅本領","用上一級 ③ 的本領"),mon:M("#5b2a86",0,3,"crown",{boss:1,img:"boss2",hue:110}),mname:L("音階巫師","音階巫師"),hp:10,mix:["bass","acc","tone","scale","interval"]},

 {id:"keysig",ch:4,name:L("調號","調號"),goal:L("認出 C、G、D、F 大調嘅調號","認出 C、G、D、F 大調的調號"),mon:M("#f4a259",1,2,"antenna",{img:"pitch",hue:300}),mname:L("調號怪","調號怪"),hp:7},
 {id:"gmaj",ch:4,name:L("G 大調","G 大調"),goal:L("G 大調要升 Fa","G 大調要升 Fa"),mon:M("#90be6d",1,3,"spikes",{img:"dotted",hue:60}),mname:L("升Fa怪","升Fa怪"),hp:7},
 {id:"dmaj",ch:4,name:L("D 大調","D 大調"),goal:L("D 大調要升 Fa 同 Do","D 大調要升 Fa 和 Do"),mon:M("#43aa8b",2,2,"horns",{img:"high",hue:140}),mname:L("雙升怪","雙升怪"),hp:7},
 {id:"fmaj",ch:4,name:L("F 大調","F 大調"),goal:L(`F 大調要降 ${"Ti"}`,`F 大調要降 ${"Si"}`),mon:M("#577590",0,2,"leaf",{img:"staff",hue:230}),mname:L("降Ti怪","降Si怪"),hp:7},
 {id:"terms",ch:4,name:L("演奏記號","演奏記號"),goal:L("連奏、斷奏、重音、反覆、rit.","連奏、斷奏、重音、反覆、rit."),mon:M("#f3722c",3,2,"ears",{img:"tempo",hue:320}),mname:L("記號怪","記號怪"),hp:7},
 {id:"boss5",ch:4,boss:true,name:L("走音魔王","走音魔王"),goal:L("最後決戰！","最後決戰！"),mon:M("#5b2a86",0,3,"crown",{c2:"#ff6fa3",boss:1,teeth:1,cape:"#e63946",sym:"♭",img:"boss3"}),mname:L("走音魔王","走音魔王"),hp:12,mix:["keysig","gmaj","dmaj","fmaj","terms","bass","scale","interval","acc","meter"]}
];
LEVELS.forEach(l=>{l.mon.id=l.id;});
/* ---------- small audio helpers ---------- */
const loud=(v,when=0)=>piano("G4",1,v,when);
async function clicks(n,bpm,my){const b=60/bpm;for(let k=0;k<n;k++){wood(k===0?1:.7,k*b);}await wait(n*b*1000);}


/* ---------- keys (fixed-do names; letter names shown alongside) ---------- */
const LET="CDEFGAB";
const KEYS={C:{t:0,acc:{}},G:{t:4,acc:{3:"#"}},D:{t:1,acc:{3:"#",0:"#"}},F:{t:3,acc:{6:"b"}}};
const FLAT={C:"Db",D:"Eb",F:"Gb",G:"Ab",A:"Bb"};
function sample(step,acc){const n=stepName(step);if(acc==="#")return (FLAT[n[0]]||n[0])+n.slice(1);if(acc==="b")return n[0]+"b"+n.slice(1);return n;}
const accSym=a=>a==="#"?"♯":a==="b"?"♭":"";
function keyScale(k){const K=KEYS[k];return [0,1,2,3,4,5,6,7].map(i=>{const st=K.t+i,ix=((st%7)+7)%7,acc=K.acc[ix];return {step:st,ix,acc,name:NN(ix)+accSym(acc),snd:sample(st,acc)};});}
async function playScale(k,wrong,inner){const my=inner?null:live();const sc=keyScale(k);for(const n of sc){if(my!==null&&!live(my))return;piano(wrong&&n.acc?stepName(n.step):n.snd,.35);await wait(330);}}
const keyName=k=>`${k} ${L("大調","大調")}`;
const TERM={staccato:L("斷奏：短短跳開","斷奏：短短跳開"),slur:L("圓滑線：連住奏","圓滑線：連起來奏"),accent:L("重音：用力啲","重音：用力一點"),repeat:L("反覆記號：再奏一次","反覆記號：再奏一次"),rit:L("rit. 漸慢","rit. 漸慢")};
async function playTerm(t){const ns=["C5","D5","E5","G5"];const my=live();
  if(t==="staccato")ns.forEach((n,i)=>piano(n,.09,.8,i*.32));
  if(t==="slur")ns.forEach((n,i)=>piano(n,.5,.7,i*.32));
  if(t==="accent")ns.forEach((n,i)=>piano(n,.25,i===0||i===2?1.3:.35,i*.32));
  if(t==="repeat"){for(let r=0;r<2;r++)ns.forEach((n,i)=>piano(n,.25,.7,r*1.5+i*.3));}
  if(t==="rit"){let at=0;[.25,.3,.42,.6,.85].forEach((g,i)=>{piano(["C5","D5","E5","F5","G5"][i],g*.9,.7,at);at+=g;});}
}

/* ---------- lessons ---------- */
const LESSONS={
 pitch:{say:L("聲音有高有低。雀仔唱歌高高哋，大熊唱歌低低哋。撳吓佢哋，聽吓有咩唔同！","聲音有高也有低。小鳥唱歌高高的，大熊唱歌低低的。按一按，聽聽看有什麼不同！"),
  html:()=>`<div class="row"><button class="big-choice" id="d1">${ART.animal("bird",84)}<b>${L("高音雀仔","高音小鳥")}</b></button><button class="big-choice" id="d2">${ART.animal("bear",84)}<b>${L("低音大熊","低音大熊")}</b></button></div>`,
  mount(){$("#d1").onclick=()=>{seq(["C6","D6","E6","D6","C6"],.16);G.bounce("#d1");};$("#d2").onclick=()=>{seq(["C2","G2","C2"],.32,.9);G.bounce("#d2");};}},
 dyn:{say:L("聲音有大聲同細聲。大笨象行路好大聲，叫做「強」；老鼠仔瞓覺要細細聲，叫做「弱」。","聲音有大聲和小聲。大象走路很大聲，叫做「強」；小老鼠睡覺要小小聲，叫做「弱」。"),
  html:()=>`<div class="row"><button class="big-choice" id="d1">${ART.animal("elephant",84)}<b>${L("強：大聲","強：大聲")}</b></button><button class="big-choice" id="d2">${ART.animal("mouse",84)}<b>${L("弱：細聲","弱：小聲")}</b></button></div>`,
  mount(){$("#d1").onclick=()=>{seq(["C4","E4","G4"],.3,1.2);G.bounce("#d1");};$("#d2").onclick=()=>{seq(["C4","E4","G4"],.3,.12);G.bounce("#d2");};}},
 tempo:{say:L("音樂有快有慢。兔仔跑得好快，烏龜行得好慢。撳吓佢哋，聽吓速度！","音樂有快也有慢。兔子跑得很快，烏龜走得很慢。按一按，聽聽速度！"),
  html:()=>`<div class="row"><button class="big-choice" id="d1">${ART.animal("rabbit",84)}<b>${L("快","快")}</b></button><button class="big-choice" id="d2">${ART.animal("turtle",84)}<b>${L("慢","慢")}</b></button></div>`,
  mount(){$("#d1").onclick=()=>{seq(["C5","D5","E5","G5","E5","D5","C5","G4"],.15);G.bounce("#d1");};$("#d2").onclick=()=>{seq(["C5","G4","E4","C4"],.75);G.bounce("#d2");};}},
 somi:{say:L("So 同 Mi 係一對好朋友。So 企喺高啲，Mi 企喺低啲。我哋一齊扮布穀鳥：So–Mi！So–Mi！","Sol 和 Mi 是一對好朋友。Sol 站得高一點，Mi 站得低一點。我們一起學布穀鳥叫：Sol–Mi！Sol–Mi！"),
  html:()=>`<div class="stairs two"><button class="step" id="sMi" style="background:${SC[2]};height:70px">Mi</button><button class="step" id="sSo" style="background:${SC[4]};height:116px">${NN(4)}</button></div><button class="btn small ghost" id="cuckoo">${L("扮布穀鳥 ▶","學布穀鳥 ▶")}</button>`,
  mount(){$("#sSo").onclick=()=>{piano("G4",.6);G.flash("#sSo");};$("#sMi").onclick=()=>{piano("E4",.6);G.flash("#sMi");};
   $("#cuckoo").onclick=async()=>{const my=live();for(const [n,id] of [["G4","#sSo"],["E4","#sMi"],["G4","#sSo"],["G4","#sSo"],["E4","#sMi"]]){if(!live(my))return;piano(n,.4);G.flash(id);await wait(420);}};}},
 order:{say:L("音樂有七兄弟：Do、Re、Mi、Fa、So、La、Ti。佢哋一級一級咁企，越上越高！撳樓梯聽吓。","音樂有七兄弟：Do、Re、Mi、Fa、Sol、La、Si。他們一級一級地站，越往上越高！按樓梯聽聽看。"),
  html:()=>`<div class="stairs" id="st">${[0,1,2,3,4,5,6,7].map(i=>`<button class="step" data-i="${i}" style="background:${SC[i]};height:${44+i*13}px">${NN(i)}</button>`).join("")}</div><button class="btn small ghost" id="climb">${L("一齊爬樓梯 ▶","一起爬樓梯 ▶")}</button>`,
  mount(){const st=$$("#st .step");st.forEach(b=>b.onclick=()=>{piano(stepName(+b.dataset.i),.5);G.flash(b);});
   $("#climb").onclick=async()=>{const my=live();for(let i=0;i<8;i++){if(!live(my))return;piano(stepName(i),.4);G.flash(st[i]);await wait(360);}};}},
 staff:{say:L("呢個係五線譜，有五條線。由最低嗰條數上去：第一線、第二線，直到第五線。線同線中間嘅空位叫「間」，一共有四個間。","這是五線譜，有五條線。從最下面往上數：第一線、第二線，一直到第五線。線和線中間的空位叫做「間」，一共有四個間。"),
  html:()=>`${ART.staff({nums:true,spaces:true,clef:false})}<div class="row"><button class="btn small" id="cl">${L("數吓線","數一數線")}</button><button class="btn small ghost" id="cs">${L("數吓間","數一數間")}</button></div>`,
  mount(){const go=async(attr,n,w)=>{const my=live();for(let k=1;k<=n;k++){if(!live(my))return;$$(".staff .hi").forEach(e=>e.classList.remove("hi"));const el=document.querySelector(`.staff [${attr}="${k}"]`);el&&el.classList.add("hi");piano(stepName(attr==="data-ln"?k*2:k*2+1),.3,.5);speak(L(`第${k}${w}`,`第${k}${w}`));await wait(950);}$$(".staff .hi").forEach(e=>e.classList.remove("hi"));};
   $("#cl").onclick=()=>go("data-ln",5,L("線","線"));$("#cs").onclick=()=>go("data-sp",4,L("間","間"));}},
 names:{say:L("音符住喺五線譜度。Do 住喺下面條短線；Mi 坐喺第一線；So 坐喺第二線。住得越高，聲音越高！撳音符聽吓。","音符住在五線譜上。Do 住在下面的小短線；Mi 坐在第一線；Sol 坐在第二線。住得越高，聲音越高！按音符聽聽看。"),
  html:()=>`${ART.staff({notes:[0,1,2,3,4,5,6,7].map(i=>({step:i,color:SC[i],label:NN(i),stem:false})),x0:66})}<button class="btn small ghost" id="sing">${L("一齊唱 ▶","一起唱 ▶")}</button>`,
  mount(){const gs=$$(".staff .nh");gs.forEach(g=>g.onclick=()=>{const i=+g.dataset.i;piano(stepName(i),.6);G.pop(g);speak(NN(i));});
   $("#sing").onclick=async()=>{const my=live();for(let i=0;i<8;i++){if(!live(my))return;piano(stepName(i),.4);G.pop(gs[i]);await wait(400);}};}},
 beats:{say:L("音符有長有短。四分音符一拍，讀 ta；兩粒八分音符拖住手，一共一拍，讀 ti-ti；二分音符兩拍，ta-a；全音符最長，四拍！撳張卡，跟住拍手。","音符有長也有短。四分音符一拍，唸 ta；兩個八分音符手牽手，一共一拍，唸 ti-ti；二分音符兩拍，ta-a；全音符最長，四拍！按卡片，跟著拍手。"),
  html:()=>`<div class="row">${["q","e2","h","w"].map(t=>`<button class="rcard" data-t="${t}">${ART.noteSym(SYMK[t],ART.INK,t==="e2"?72:54)}<b>${tokName(t)}</b><small>${BEATS[t]} ${L("拍","拍")} · ${SYL[t]}</small><div class="beats"></div></button>`).join("")}</div>`,
  mount(){$$(".rcard").forEach(c=>c.onclick=()=>{const my=live();speak(SYL[c.dataset.t]);rhythm([c.dataset.t],{dots:c.querySelector(".beats"),my});});}},
 rests:{say:L("休止符係「靜音嘅拍子」：見到佢就唔好出聲，但係心入面要繼續數拍。四分休止符一拍；二分休止符好似一頂帽，坐喺線上面，兩拍；全休止符好似一個窿，吊喺線下面，四拍。","休止符是「安靜的拍子」：看到它就不要出聲，但是心裡要繼續數拍。四分休止符一拍；二分休止符像一頂帽子，坐在線上面，兩拍；全休止符像一個洞，掛在線下面，四拍。"),
  html:()=>`<div class="row">${["qr","hr","wr"].map(t=>`<div class="rcard static">${ART.noteSym(SYMK[t],ART.INK,60)}<b>${tokName(t)}</b><small>${BEATS[t]} ${L("拍","拍")}${t==="hr"?L(" · 似帽"," · 像帽子"):t==="wr"?L(" · 似窿"," · 像洞"):""}</small></div>`).join("")}</div>
   <div class="pattern" id="pt">${["q","q","qr","q"].map(t=>rcard(t)).join("")}</div><button class="btn small ghost" id="pl">${L("聽吓：ta ta 休 ta ▶","聽聽看：ta ta 休 ta ▶")}</button>`,
  mount(){$("#pl").onclick=()=>{const my=live();rhythm(["q","q","qr","q"],{cards:$$("#pt .rcard-mini"),my,beat:true});};}},
 echo:{say:L("回音鼓遊戲：先聽我打一次節奏，跟住輪到你撳個鼓，打返一模一樣嘅節奏！試吓先撳個鼓。","回音鼓遊戲：先聽我打一次節奏，接著輪到你按鼓，打出一模一樣的節奏！先按鼓試試看。"),
  html:()=>`<button class="drum-btn" id="dr" aria-label="${L("鼓","鼓")}">${ART.drum}</button>`,
  mount(){$("#dr").onclick=()=>{G.taiko();G.bounce("#dr");};}},
 high:{say:L("五線譜上面仲有高音！高音 Do 喺第三間，Re 喺第四線，Mi 喺第四間，Fa 喺第五線，So 坐喺第五線上面。撳吓佢哋。","五線譜上方還有高音！高音 Do 在第三間，Re 在第四線，Mi 在第四間，Fa 在第五線，Sol 坐在第五線上面。按按看。"),
  html:()=>`${ART.staff({notes:[7,8,9,10,11].map(i=>({step:i,color:SC[i%7],label:NN(i),stem:false})),x0:96})}<button class="btn small ghost" id="sing">${L("一齊唱 ▶","一起唱 ▶")}</button>`,
  mount(){const gs=$$(".staff .nh");gs.forEach(g=>g.onclick=()=>{const i=+g.dataset.i+7;piano(stepName(i),.6);G.pop(g);speak(NN(i));});
   $("#sing").onclick=async()=>{const my=live();for(let i=0;i<5;i++){if(!live(my))return;piano(stepName(i+7),.4);G.pop(gs[i]);await wait(400);}};}},
 dotted:{say:L("附點係一個魔法小點：佢會令音符長多一半。二分音符兩拍，加一點，就變成三拍！","附點是一個魔法小點：它會讓音符多長一半。二分音符兩拍，加上一點，就變成三拍！"),
  html:()=>`<div class="eq">${rcard("h")}<span class="op">+</span><span class="dotbig"></span><span class="op">=</span>${rcard("dh")}</div><div class="row"><button class="btn small" id="p1">${L("二分音符 2 拍","二分音符 2 拍")}</button><button class="btn small ghost" id="p2">${L("附點 3 拍","附點 3 拍")}</button></div><div class="beats big" id="bd"></div>`,
  mount(){$("#p1").onclick=()=>{rhythm(["h"],{dots:$("#bd"),my:live()});};$("#p2").onclick=()=>{rhythm(["dh"],{dots:$("#bd"),my:live()});};}},
 meter:{say:L("拍號話我哋知，每個小節有幾多拍。上面嘅數字係拍數：4/4 每小節 4 拍，3/4 每小節 3 拍。小節線將音樂分成一格格。","拍號告訴我們，每個小節有幾拍。上面的數字就是拍數：4/4 每小節 4 拍，3/4 每小節 3 拍。小節線把音樂分成一格一格。"),
  html:()=>`<div class="bar-demo"><div class="tsig"><b>3</b><b>4</b></div><div class="pattern" id="m3">${["h","q"].map(t=>rcard(t)).join("")}</div></div><div class="bar-demo"><div class="tsig"><b>4</b><b>4</b></div><div class="pattern" id="m4">${["q","q","h"].map(t=>rcard(t)).join("")}</div></div><div class="row"><button class="btn small" id="b3">${L("3/4 拍：強弱弱","3/4 拍：強弱弱")}</button><button class="btn small ghost" id="b4">${L("4/4 拍：強弱次強弱","4/4 拍：強弱次強弱")}</button></div>`,
  mount(){$("#b3").onclick=async()=>{const my=live();for(let r=0;r<2;r++)for(let k=0;k<3;k++){if(!live(my))return;wood(k?0.35:1);await wait(560);}};
   $("#b4").onclick=async()=>{const my=live();for(let r=0;r<2;r++)for(let k=0;k<4;k++){if(!live(my))return;wood([1,.35,.7,.35][k]);await wait(560);}};}},
 dynmark:{say:L("樂譜用字母話我哋要幾大聲：f 係強，大聲；p 係弱，細聲；mf 係中強；mp 係中弱。開口嘅符號係漸強，慢慢大聲；收口係漸弱，慢慢細聲。","樂譜用字母告訴我們要多大聲：f 是強，大聲；p 是弱，小聲；mf 是中強；mp 是中弱。張開的符號是漸強，慢慢變大聲；收起來的是漸弱，慢慢變小聲。"),
  html:()=>`<div class="row">${[["f",1.2],["mf",.6],["mp",.3],["p",.1]].map(([m,v])=>`<button class="dcard" data-v="${v}">${ART.dynMark(m,40)}<small>${{f:L("強","強"),mf:L("中強","中強"),mp:L("中弱","中弱"),p:L("弱","弱")}[m]}</small></button>`).join("")}</div>
   <div class="row"><button class="dcard wide" id="cr">${ART.dynMark("cresc",30)}<small>${L("漸強","漸強")}</small></button><button class="dcard wide" id="dm">${ART.dynMark("dim",30)}<small>${L("漸弱","漸弱")}</small></button></div>`,
  mount(){$$(".dcard[data-v]").forEach(b=>b.onclick=()=>{seq(["C4","E4","G4"],.28,+b.dataset.v);G.bounce(b);});
   $("#cr").onclick=()=>{[.08,.25,.55,1.1].forEach((v,k)=>piano("G4",.4,v,k*.38));};$("#dm").onclick=()=>{[1.1,.55,.25,.08].forEach((v,k)=>piano("G4",.4,v,k*.38));};}},
 contour:{say:L("旋律好似行山路：有時向上爬，有時向下行，有時企喺度唔郁。撳吓三條山路聽吓。","旋律像走山路：有時往上爬，有時往下走，有時站著不動。按一按三條山路聽聽看。"),
  html:()=>`<div class="row">${[["up",[0,1,2,3],L("向上","往上")],["down",[3,2,1,0],L("向下","往下")],["same",[2,2,2,2],L("重複","重複")]].map(([k,p,t])=>`<button class="dcard" data-k="${k}">${ART.contour(p)}<small>${t}</small></button>`).join("")}</div>`,
  mount(){const S={up:["C4","E4","G4","C5"],down:["C5","G4","E4","C4"],same:["G4","G4","G4","G4"]};$$(".dcard[data-k]").forEach(b=>b.onclick=()=>{seq(S[b.dataset.k],.36);G.bounce(b);});}},
 keysig:{say:L(`調號寫喺譜號後面，話我哋成首歌有邊啲音要一直升或者降。冇升降就係 C 大調；一個升號 Fa♯ 係 G 大調；兩個升號 Fa♯、Do♯ 係 D 大調；一個降號 ${NN(6)}♭ 係 F 大調。`,`調號寫在譜號後面，告訴我們整首歌有哪些音要一直升或降。沒有升降就是 C 大調；一個升號 Fa♯ 是 G 大調；兩個升號 Fa♯、Do♯ 是 D 大調；一個降號 ${NN(6)}♭ 是 F 大調。`),
  html:()=>`<div class="ks-grid">${["C","G","D","F"].map(k=>`<button class="dcard ks" data-k="${k}">${ART.staff({key:k,notes:[],w:170,max:170})}<b>${k} ${L("大調","大調")}</b></button>`).join("")}</div>`,
  mount(){$$(".ks").forEach(b=>b.onclick=()=>{G.bounce(b);playScale(b.dataset.k);});}},
 gmaj:{lessonKey:"G"},dmaj:{lessonKey:"D"},fmaj:{lessonKey:"F"},
 terms:{say:L("樂譜上仲有好多記號話我哋點樣奏：音符上面一點係斷奏，要短短跳開；弧線係圓滑線，要連住奏；「>」係重音，要用力啲；兩粒點加雙線係反覆記號，要返轉頭再奏一次；rit. 係漸慢。","樂譜上還有很多記號告訴我們怎麼演奏：音符上面一個點是斷奏，要短短地跳開；弧線是圓滑線，要連起來奏；「>」是重音，要用力一點；兩個點加雙線是反覆記號，要回到前面再奏一次；rit. 是漸慢。"),
  html:()=>`<div class="row">${["staccato","slur","accent","repeat","rit"].map(k=>`<button class="dcard" data-t="${k}">${ART.artic(k,80)}<small>${TERM[k]}</small></button>`).join("")}</div>`,
  mount(){$$(".dcard[data-t]").forEach(b=>b.onclick=()=>{G.bounce(b);playTerm(b.dataset.t);});}},
 bass:{say:L(`低音譜號又叫 F 譜號：佢兩粒點夾住第四線，嗰條線就係 Fa。大提琴、低音結他、鋼琴左手都用佢。第一線係 ${NN(4)}，向上一格就係下一個兄弟。撳音符聽吓。`,`低音譜號又叫 F 譜號：它的兩個點夾住第四線，那條線就是 Fa。大提琴、低音吉他、鋼琴左手都用它。第一線是 ${NN(4)}，往上一格就是下一個兄弟。按音符聽聽看。`),
  html:()=>`${ART.staff({clef:"bass",notes:[18,19,20,21,22,23,24,25,26,27,28].map((dn,i)=>({dn,color:SC[dn%7],label:NN(dn%7),stem:false})),x0:70})}<button class="btn small ghost" id="sing">${L("由低唱上去 ▶","從低唱上去 ▶")}</button>`,
  mount(){const gs=$$(".staff .nh");const dns=[18,19,20,21,22,23,24,25,26,27,28];gs.forEach(g=>g.onclick=()=>{const dn=dns[+g.dataset.i];piano(stepName(dn-28),.6);G.pop(g);speak(NN(dn%7));});
   $("#sing").onclick=async()=>{const my=live();for(let i=0;i<dns.length;i++){if(!live(my))return;piano(stepName(dns[i]-28),.4);G.pop(gs[i]);await wait(380);}};}},
 acc:{say:L("升記號 ♯ 令音升高半音；降記號 ♭ 令音降低半音；還原記號 ♮ 取消升降，變返原本個音。半音即係鍵盤上最貼近嘅兩個鍵。撳下面三個掣聽吓。","升記號 ♯ 讓音升高半音；降記號 ♭ 讓音降低半音；還原記號 ♮ 取消升降，變回原本的音。半音就是鍵盤上最靠近的兩個鍵。按下面三個按鈕聽聽看。"),
  html:()=>`<div id="kb">${ART.keyboard({labels:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:NN(4),9:"La",11:NN(6),12:"Do"}})}</div><div class="row"><button class="dcard" id="sh"><span class="dyn" style="font-style:normal">♯</span><small>Fa → Fa♯</small></button><button class="dcard" id="fl"><span class="dyn" style="font-style:normal">♭</span><small>${NN(6)} → ${NN(6)}♭</small></button><button class="dcard" id="na"><span class="dyn" style="font-style:normal">♮</span><small>Fa♯ → Fa</small></button></div>`,
  mount(){const show=h=>{$("#kb").innerHTML=ART.keyboard({hi:h,labels:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:NN(4),9:"La",11:NN(6),12:"Do"}});};
   $("#sh").onclick=()=>{show({5:"#ffd23f",6:"#ff6fa3"});piano("F4",.5);piano("Gb4",.6,.8,.55);};
   $("#fl").onclick=()=>{show({11:"#ffd23f",10:"#3a86ff"});piano("B4",.5);piano("Bb4",.6,.8,.55);};
   $("#na").onclick=()=>{show({6:"#ff6fa3",5:"#6fd08c"});piano("Gb4",.5);piano("F4",.6,.8,.55);};}},
 tone:{say:L(`鍵盤上兩個最貼近嘅鍵（中間冇其他鍵），相差半音；兩個半音加埋，就係一個全音。留意 Mi–Fa 同 ${NN(6)}–Do 中間冇黑鍵，所以佢哋係半音。`,`鍵盤上兩個最靠近的鍵（中間沒有其他鍵），相差半音；兩個半音加起來，就是一個全音。注意 Mi–Fa 和 ${NN(6)}–Do 中間沒有黑鍵，所以它們是半音。`),
  html:()=>`<div id="kb">${ART.keyboard({labels:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:NN(4),9:"La",11:NN(6),12:"Do"}})}</div><div class="row"><button class="btn small" id="t1">${L("全音：Do–Re","全音：Do–Re")}</button><button class="btn small ghost" id="t2">${L("半音：Mi–Fa","半音：Mi–Fa")}</button><button class="btn small ghost" id="t3">${L(`半音：${NN(6)}–Do`,`半音：${NN(6)}–Do`)}</button></div>`,
  mount(){const lab={0:"Do",2:"Re",4:"Mi",5:"Fa",7:NN(4),9:"La",11:NN(6),12:"Do"};const show=h=>{$("#kb").innerHTML=ART.keyboard({hi:h,labels:lab});};
   $("#t1").onclick=()=>{show({0:"#ffd23f",1:"#ccc",2:"#ffd23f"});seq(["C4","D4"],.5);};
   $("#t2").onclick=()=>{show({4:"#6fd08c",5:"#6fd08c"});seq(["E4","F4"],.5);};
   $("#t3").onclick=()=>{show({11:"#6fd08c",12:"#6fd08c"});seq(["B4","C5"],.5);};}},
 scale:{say:L("C 大調音階由 Do 行到高音 Do，一共八級。Mi–Fa 同 Ti–Do 係半音，其他係全音。第 1、3、5 級一齊彈，就係主三和弦。","C 大調音階從 Do 走到高音 Do，一共八級。Mi–Fa 和 Si–Do 是半音，其他是全音。第 1、3、5 級一起彈，就是主三和弦。"),
  html:()=>`<div class="stairs" id="st">${[0,1,2,3,4,5,6,7].map(i=>`<button class="step" data-i="${i}" style="background:${SC[i]};height:${44+i*13}px">${i+1}<br><small style="font-size:12px">${NN(i)}</small></button>`).join("")}</div><div class="ws">${["全","全","半","全","全","全","半"].map(x=>`<span class="${x==="半"?"half":""}">${x}</span>`).join("")}</div><div class="row"><button class="btn small" id="up">${L("音階 ▶","音階 ▶")}</button><button class="btn small ghost" id="tri">${L("主三和弦 ▶","主三和弦 ▶")}</button></div>`,
  mount(){const st=$$("#st .step");st.forEach(b=>b.onclick=()=>{piano(stepName(+b.dataset.i),.5);G.flash(b);});
   $("#up").onclick=async()=>{const my=live();for(let i=0;i<8;i++){if(!live(my))return;piano(stepName(i),.4);G.flash(st[i]);await wait(360);}};
   $("#tri").onclick=async()=>{const my=live();for(const i of [0,2,4]){if(!live(my))return;piano(stepName(i),.6);G.flash(st[i]);await wait(420);}piano("C4",1.2);piano("E4",1.2);piano("G4",1.2);[0,2,4].forEach(i=>G.flash(st[i]));};}},
 interval:{say:L("音程用「度」嚟數，連自己都要數埋。Do 到 Mi：Do、Re、Mi，三個音，就係三度。","音程用「度」來數，連自己也要數進去。Do 到 Mi：Do、Re、Mi，三個音，就是三度。"),
  html:()=>`<div id="iv">${ART.staff({notes:[{step:0,color:SC[0],label:"Do"},{step:2,color:SC[2],label:"Mi"}],x0:150,max:360})}</div><div class="row">${[[2,L("二度","二度")],[3,L("三度","三度")],[5,L("五度","五度")],[8,L("八度","八度")]].map(([n,t])=>`<button class="btn small ghost" data-n="${n}">${t}</button>`).join("")}</div>`,
  mount(){$$(".row [data-n]").forEach(b=>b.onclick=()=>{const n=+b.dataset.n,top=n-1;$("#iv").innerHTML=ART.staff({notes:[{step:0,color:SC[0],label:"Do"},{step:top,color:SC[top%7],label:NN(top)}],x0:150,max:360});piano("C4",.5);piano(stepName(top),.6,.8,.55);});}},
 boss1:{say:L("噪音龍王嚟搗亂！佢將草原所有聲音都搞亂晒。用你學過嘅：高低、強弱、快慢、So Mi 同七色樓梯，打敗佢！","噪音龍王來搗亂了！它把草原的聲音全都弄亂了。用你學過的：高低、強弱、快慢、Sol Mi 和七色樓梯，打敗它！"),html:()=>"",mount(){}},
 boss2:{say:L("亂拍熊王將森林嘅節奏全部打亂！用五線譜、音符名同拍子嘅本領，一齊打敗佢！","亂拍熊王把森林的節奏全都打亂了！用五線譜、音名和拍子的本領，一起打敗它！"),html:()=>"",mount(){}},
 boss3:{say:L("節拍龍王將城堡嘅拍子拆到亂晒！用加線、附點、連結線、拍號同術語嘅本領，打敗佢！","節拍龍王把城堡的拍子拆得亂七八糟！用加線、附點、連結線、拍號和術語的本領，打敗它！"),html:()=>"",mount(){}},
 boss4:{say:L("音階巫師將星空嘅音階打亂咗！用低音譜號、升降記號、全音半音、音階同音程嘅本領，打敗佢！","音階巫師把星空的音階打亂了！用低音譜號、升降記號、全音半音、音階和音程的本領，打敗它！"),html:()=>"",mount(){}},
 boss5:{say:L("終於見到走音魔王！佢偷走咗音樂王國嘅聲音。用晒你學過嘅樂理，最後決戰！","終於見到走音魔王！它偷走了音樂王國的聲音。用上你學過的所有樂理，最後決戰！"),html:()=>"",mount(){}}
};

["G","D","F"].forEach(k=>{const id=k.toLowerCase()+"maj";const sc=()=>keyScale(k);
  const accs=()=>sc().filter(n=>n.acc).map(n=>n.name).filter((v,i,a)=>a.indexOf(v)===i).join(L("、","、"));
  const tri=()=>[0,2,4].map(i=>sc()[i].name).join("、");
  LESSONS[id]={say:L(`${k} 大調由 ${k}（${sc()[0].name}）開始，一樣係「全全半全全全半」。為咗守住呢個規律，要用 ${accs()}。佢嘅主三和弦係 ${tri()}。`,`${k} 大調從 ${k}（${sc()[0].name}）開始，一樣是「全全半全全全半」。為了守住這個規律，要用 ${accs()}。它的主三和弦是 ${tri()}。`),
   html:()=>`${ART.staff({key:k,notes:sc().map(n=>({step:n.step,color:n.acc?"#ff6fa3":SC[n.ix],label:n.name,stem:false})),x0:96})}<div class="row"><button class="btn small" id="up">${L("音階 ▶","音階 ▶")}</button><button class="btn small ghost" id="tri">${L("主三和弦 ▶","主三和弦 ▶")}</button></div>`,
   mount(){const gs=$$(".staff .nh");const s=sc();gs.forEach(g=>g.onclick=()=>{const n=s[+g.dataset.i];piano(n.snd,.6);G.pop(g);});
    $("#up").onclick=async()=>{const my=live();for(let i=0;i<8;i++){if(!live(my))return;piano(s[i].snd,.4);G.pop(gs[i]);await wait(350);}};
    $("#tri").onclick=async()=>{const my=live();for(const i of [0,2,4]){if(!live(my))return;piano(s[i].snd,.6);G.pop(gs[i]);await wait(420);}[0,2,4].forEach(i=>piano(s[i].snd,1.2,.6));};}};
});

/* ---------- generators: (d = 0..1 battle progress) ---------- */
const listenOpts=(firstOk)=>[opt(`<span class="ear">${ART.spk}<b>${L("第 1 個","第 1 個")}</b></span>`,firstOk,{bare:1,ear:0}),opt(`<span class="ear">${ART.spk}<b>${L("第 2 個","第 2 個")}</b></span>`,!firstOk,{bare:1,ear:1})];
const playTwo=(a,b)=>async()=>{const my=live();G.earOn(0);await a();await wait(250);if(!live(my))return;G.earOff(0);await wait(350);if(!live(my))return;G.earOn(1);await b();await wait(250);G.earOff(1);};
const GEN={
 pitch(d){
  if(d<.34||Math.random()<.4){const hi=Math.random()<.5,n=hi?pick(["C6","E6","G6"]):pick(["C2","E2","G2"]);
   const f=()=>piano(n,1,.9);
   return {t:L("呢個聲音係高定低？","這個聲音是高還是低？"),cols:2,auto:f,replay:f,
    hint:hi?L("尖尖細細，好似雀仔。","尖尖細細的，像小鳥。"):L("粗粗沉沉，好似大熊。","粗粗沉沉的，像大熊。"),
    options:[opt(`${ART.animal("bird",62)}${big(L("高","高"))}`,hi),opt(`${ART.animal("bear",62)}${big(L("低","低"))}`,!hi)]};}
  const gap=d<.67?pick([7,8,9]):pick([4,5]);const lo=rint(0,10-gap+2),hi=lo+gap,first=Math.random()<.5;
  const a=stepName(first?hi:lo),b=stepName(first?lo:hi);
  const f=playTwo(async()=>{piano(a,.7);await wait(600);},async()=>{piano(b,.7);await wait(600);});
  return {t:L("仔細聽！邊個聲音高啲？","仔細聽！哪一個聲音比較高？"),cols:2,auto:f,replay:f,hint:L("高嘅聲音尖啲、細啲，好似雀仔。","高的聲音比較尖、比較細，像小鳥。"),options:listenOpts(first)};
 },
 dyn(d){
  if(d<.4||Math.random()<.4){const L1=Math.random()<.5,f=()=>seq(["C4","E4","G4"],.3,L1?1.25:.09);
   return {t:L("呢段音樂係大聲定細聲？","這段音樂是大聲還是小聲？"),cols:2,auto:f,replay:f,hint:L1?L("好似大笨象咁大聲！","像大象一樣大聲！"):L("好似老鼠仔咁細聲。","像小老鼠一樣小聲。"),
    options:[opt(`${ART.animal("elephant",62)}${big(L("強","強"))}`,L1),opt(`${ART.animal("mouse",62)}${big(L("弱","弱"))}`,!L1)]};}
  const first=Math.random()<.5,va=first?1.2:.12,vb=first?.12:1.2;
  const f=playTwo(async()=>{seq(["E4","G4"],.3,va);await wait(700);},async()=>{seq(["E4","G4"],.3,vb);await wait(700);});
  return {t:L("邊一次比較大聲？","哪一次比較大聲？"),cols:2,auto:f,replay:f,hint:L("大聲嘅好似大笨象行路。","大聲的像大象走路。"),options:listenOpts(first)};
 },
 tempo(d){
  const fast=Math.random()<.5;
  if(d<.5||Math.random()<.5){const f=()=>seq(fast?["C5","D5","E5","G5","E5","D5","C5","G4"]:["C5","G4","E4","C4"],fast?.15:.75);
   return {t:L("呢段音樂係快定慢？","這段音樂是快還是慢？"),cols:2,auto:f,replay:f,hint:fast?L("跑得好似兔仔咁快！","跑得像兔子一樣快！"):L("行得好似烏龜咁慢。","走得像烏龜一樣慢。"),
    options:[opt(`${ART.animal("rabbit",62)}${big(L("快","快"))}`,fast),opt(`${ART.animal("turtle",62)}${big(L("慢","慢"))}`,!fast)]};}
  const f=playTwo(async()=>{await clicks(fast?8:3,fast?240:80);},async()=>{await clicks(fast?3:8,fast?80:240);});
  return {t:L("邊一次比較快？","哪一次比較快？"),cols:2,auto:f,replay:f,hint:L("快嘅一次，聲音一下接一下好密。","快的那一次，聲音一下接一下很密。"),options:listenOpts(fast)};
 },
 somi(d){
  const len=d<.34?2:d<.67?3:4;let p;do{p=Array.from({length:len},()=>Math.random()<.5?1:0);}while(len===2&&false);
  const key=p.join("");const pool=new Set([key]);while(pool.size<3){pool.add(Array.from({length:len},()=>Math.random()<.5?1:0).join(""));}
  const f=async()=>{const my=live();for(const v of p){if(!live(my))return;piano(v?"G4":"E4",.45);await wait(480);}};
  return {t:L(`聽吓 So 同 Mi，邊幅圖啱？`,`聽聽 Sol 和 Mi，哪張圖對？`),cols:3,auto:f,replay:f,hint:L("So 高啲（上面），Mi 低啲（下面）。跟住聲音用手指指上指落。","Sol 比較高（上面），Mi 比較低（下面）。跟著聲音用手指上下指。"),
   options:shuffle([...pool]).map(k=>opt(`<span class="sm-grid"><b style="grid-row:1;grid-column:1">${NN(4)}</b><b style="grid-row:2;grid-column:1">Mi</b>${[...k].map((c,j)=>`<i class="${c==="1"?"so":"mi"}" style="grid-row:${c==="1"?1:2};grid-column:${j+2}"></i>`).join("")}</span>`,k===key))};
 },
 order(d){
  const r=Math.random();
  if(r<.4){const t=rint(0,6);return {t:L(`${NN(t)} 喺邊一級？`,`${NN(t)} 在哪一級？`),stairs:true,hint:L("由 Do 開始唱：Do、Re、Mi……","從 Do 開始唱：Do、Re、Mi……"),options:[0,1,2,3,4,5,6].map(i=>opt(NN(i),i===t,{note:i}))};}
  if(r<.75||d<.5){const s=rint(0,3),ans=s+3,others=shuffle([0,1,2,3,4,5,6].filter(i=>i!==ans)).slice(0,2);
   const f=async()=>{const my=live();for(const i of [s,s+1,s+2]){if(!live(my))return;piano(stepName(i),.35);await wait(380);}};
   return {t:L("排隊！下一個係邊個？","排隊！下一個是誰？"),cols:3,auto:f,
    visual:`<div class="stairs mini">${[s,s+1,s+2].map((i,k)=>`<div class="step" style="background:${SC[i]};height:${48+k*16}px">${NN(i)}</div>`).join("")}<div class="step q" style="height:96px">?</div></div>`,
    hint:L("跟住次序唱：Do Re Mi Fa So La Ti。","照順序唱：Do Re Mi Fa Sol La Si。"),options:shuffle([ans,...others]).map(i=>Object.assign(nameOpt(i),{ok:i===ans}))};}
  const a=rint(0,6);let b;do{b=rint(0,6);}while(b===a);const h=a>b?a:b;
  return {t:L(`${NN(a)} 同 ${NN(b)}，邊個企得高啲？`,`${NN(a)} 和 ${NN(b)}，誰站得比較高？`),cols:2,hint:L("喺樓梯越後面嘅，就越高。","在樓梯越後面的，就越高。"),options:[a,b].map(i=>Object.assign(nameOpt(i),{ok:i===h}))};
 },
 staff(d){
  const r=Math.random();
  if(r<.4){const step=rint(2,10),on=step%2===0;
   return {t:L("音符坐喺線上，定係喺間入面？","音符坐在線上，還是在間裡？"),cols:2,visual:ART.staff({notes:[{step,color:"#f4842d",stem:false}],clef:false,max:360}),
    hint:on?L("睇吓，有條線穿過音符個肚。","看看，有一條線穿過音符的肚子。"):L("音符夾喺兩條線中間，冇線穿過佢。","音符夾在兩條線中間，沒有線穿過它。"),
    options:[opt(`<svg viewBox="0 0 70 40" width="70"><line x1="0" x2="70" y1="20" y2="20" stroke="${ART.INK}" stroke-width="3"/><ellipse cx="35" cy="20" rx="11" ry="8" fill="#f4842d" stroke="${ART.INK}" stroke-width="2"/></svg>${big(L("線上","線上"))}`,on),
             opt(`<svg viewBox="0 0 70 40" width="70"><line x1="0" x2="70" y1="5" y2="5" stroke="${ART.INK}" stroke-width="3"/><line x1="0" x2="70" y1="35" y2="35" stroke="${ART.INK}" stroke-width="3"/><ellipse cx="35" cy="20" rx="11" ry="8" fill="#f4842d" stroke="${ART.INK}" stroke-width="2"/></svg>${big(L("間入面","間裡"))}`,!on)]};}
  if(r<.75||d<.4){const ln=rint(1,5);return {t:L("音符坐喺第幾線？","音符坐在第幾線？"),cols:5,visual:ART.staff({notes:[{step:ln*2,color:"#2a9df4",stem:false}],clef:false,max:360}),hint:L("由最低嗰條線開始數：1、2、3……","從最下面那條線開始數：1、2、3……"),options:[1,2,3,4,5].map(k=>opt(big(k),k===ln))};}
  const sp=rint(1,4);return {t:L("音符喺第幾間？","音符在第幾間？"),cols:4,visual:ART.staff({notes:[{step:sp*2+1,color:"#7b5ce7",stem:false}],clef:false,max:360}),hint:L("由最低嗰個空位數起：1、2、3、4。","從最下面的空位開始數：1、2、3、4。"),options:[1,2,3,4].map(k=>opt(big(k),k===sp))};
 },
 names(d){
  const t=rint(0,7),n=d<.5?3:4,ti=t%7;
  const pool=shuffle([0,1,2,3,4,5,6].filter(i=>i!==ti&&Math.abs(i-ti)<=3)).slice(0,n-1);
  return {t:L("呢粒音符叫咩名？","這個音符叫什麼名字？"),cols:n,visual:ART.staff({notes:[{step:t,color:ART.INK,id:"qnote"}],max:380}),
   hint:L("記住三個好朋友：Do 喺下面短線，Mi 喺第一線，So 喺第二線。","記住三個好朋友：Do 在下面短線，Mi 在第一線，Sol 在第二線。"),reveal:t,
   options:shuffle([ti,...pool]).map(i=>Object.assign(nameOpt(i),{ok:i===ti,note:i===ti?t:i}))};
 },
 beats(d){
  const r=Math.random();
  if(r<.45||d<.3){const t=pick(d>.55?["q","e2","s4","h","w"]:["q","e2","h","w"]);
   return {t:L("呢個音符有幾多拍？","這個音符有幾拍？"),cols:3,visual:`<div class="rcard static">${ART.noteSym(SYMK[t],"#c45fd0",t==="e2"?84:t==="s4"?110:64)}<div class="beats" id="qb"></div></div>`,
    hint:{q:L("實心、有條棍，係四分音符：一拍。","實心、有棍子，是四分音符：一拍。"),e2:L("兩粒八分音符拖住手，加埋係一拍。","兩個八分音符手牽手，加起來是一拍。"),s4:L("四粒十六分音符有兩條橫樑，四粒加埋係一拍。","四個十六分音符有兩條橫樑，四個加起來是一拍。"),h:L("空心、有條棍，係二分音符：兩拍。","空心、有棍子，是二分音符：兩拍。"),w:L("空心、冇棍，係全音符：最長，四拍！","空心、沒有棍子，是全音符：最長，四拍！")}[t],
    after:()=>rhythm([t],{dots:$("#qb"),my:live()}),options:[1,2,4].map(b=>opt(big(b+" "+L("拍","拍")),b===BEATS[t]))};}
  if(r<.75){const [a,b]=shuffle(["w","h","q"]).slice(0,2),lg=BEATS[a]>BEATS[b]?a:b;
   return {t:L("邊個音符比較長？","哪個音符比較長？"),cols:2,hint:L("空心嘅比實心長；冇棍嘅全音符最長。","空心的比實心的長；沒有棍子的全音符最長。"),options:[a,b].map(t=>opt(ART.noteSym(SYMK[t],"#c45fd0",56),t===lg,{rh:t}))};}
  const pair=pick([["q","q"],["h","q"],["q","h"],["h","h"],["e2","q"],["e2","h"],["q","e2"]]),sum=BEATS[pair[0]]+BEATS[pair[1]];
  const os=shuffle([...new Set([sum,sum===2?3:sum-1,sum===4?2:sum+1])]);
  return {t:L("加埋一共幾多拍？","加起來一共幾拍？"),cols:3,visual:`<div class="eq">${rcard(pair[0],"#c45fd0")}<span class="op">+</span>${rcard(pair[1],"#c45fd0")}<span class="op">=</span><span class="op">?</span></div>`,
   hint:L(`${tokName(pair[0])} ${BEATS[pair[0]]} 拍，${tokName(pair[1])} ${BEATS[pair[1]]} 拍。`,`${tokName(pair[0])} ${BEATS[pair[0]]} 拍，${tokName(pair[1])} ${BEATS[pair[1]]} 拍。`),after:()=>rhythm(pair,{my:live()}),options:os.map(b=>opt(big(b+" "+L("拍","拍")),b===sum))};
 },
 rests(d){
  const r=Math.random();
  if(r<.35){const rest=pick(["qr","hr","wr"]),others=shuffle(["q","h","w","e2"]).slice(0,2);
   return {t:L("邊個係休止符？（唔使出聲嘅）","哪一個是休止符？（不用出聲的）"),cols:3,hint:L("休止符冇圓圓嘅符頭。","休止符沒有圓圓的符頭。"),options:shuffle([rest,...others]).map(t=>opt(ART.noteSym(SYMK[t],ART.INK,52),t===rest))};}
  if(r<.7||d<.4){const rest=pick(["qr","hr","wr"]);
   return {t:L("呢個休止符要靜幾多拍？","這個休止符要安靜幾拍？"),cols:3,visual:`<div class="rcard static">${ART.noteSym(SYMK[rest],ART.INK,72)}</div>`,
    hint:{qr:L("彎彎曲曲嗰個係四分休止符：一拍。","彎彎曲曲的是四分休止符：一拍。"),hr:L("似一頂帽坐喺線上：二分休止符，兩拍。","像帽子坐在線上：二分休止符，兩拍。"),wr:L("似一個窿吊喺線下：全休止符，四拍。","像一個洞掛在線下：全休止符，四拍。")}[rest],
    options:[1,2,4].map(b=>opt(big(b+" "+L("拍","拍")),b===BEATS[rest]))};}
  const pats=[["q","q","qr","q"],["q","qr","q","q"],["qr","q","q","q"],["q","q","q","qr"]];const ans=pick(pats);const others=shuffle(pats.filter(p=>p!==ans)).slice(0,2);
  const f=()=>rhythm(ans,{my:live(),beat:true});
  return {t:L("聽吓！邊一行先啱？","聽聽看！哪一行才對？"),cols:1,auto:f,replay:f,hint:L("留意邊一拍靜咗。","注意哪一拍是安靜的。"),options:shuffle([ans,...others]).map(p=>opt(`<span class="pattern sm">${p.map(t=>rcard(t)).join("")}</span>`,p===ans))};
 },
 echo(d){
  const E=[["q","q","h"],["h","q","q"],["q","q","q","q"],["q","h","q"]],Mi=[["q","e2","q","q"],["e2","q","e2","q"],["q","q","e2","q"],["e2","e2","q","q"]],H=[["e2","q","q","e2"],["q","e2","h"],["e2","e2","e2","q"],["h","e2","q"]];
  const pat=pick(d<.3?E:d<.7?Mi:H);
  return {t:L("先聽，再撳鼓打返出嚟！","先聽，再按鼓打出來！"),custom:(root,api)=>G.echoGame(root,pat,api),hint:L("一邊讀 ta、ti-ti，一邊撳鼓。","一邊唸 ta、ti-ti，一邊按鼓。")};
 },
 high(d){
  const t=d<.5?rint(7,11):rint(0,11),n=d<.5?3:4,ti=t%7;
  const pool=shuffle([0,1,2,3,4,5,6].filter(i=>i!==ti&&Math.abs(i-ti)<=3)).slice(0,n-1);
  return {t:L("呢粒高音叫咩名？","這個音叫什麼名字？"),cols:n,visual:ART.staff({notes:[{step:t,color:ART.INK,id:"qnote"}],max:380}),
   hint:L("高音 Do 喺第三間；向上一格就係下一個兄弟。","高音 Do 在第三間；往上一格就是下一個兄弟。"),reveal:t,
   options:shuffle([ti,...pool]).map(i=>Object.assign(nameOpt(i),{ok:i===ti,note:i===ti?t:i+7}))};
 },
 dotted(d){
  const r=Math.random();
  if(r<.4){return {t:L("附點二分音符有幾多拍？","附點二分音符有幾拍？"),cols:3,visual:`<div class="rcard static">${ART.noteSym("dhalf","#d25fcf",72)}<div class="beats" id="qb"></div></div>`,hint:L("二分音符 2 拍，個點加多一半，即係多 1 拍。","二分音符 2 拍，小點多加一半，就是多 1 拍。"),after:()=>rhythm(["dh"],{dots:$("#qb"),my:live()}),options:[2,3,4].map(b=>opt(big(b+" "+L("拍","拍")),b===3))};}
  if(r<.55&&d>.3){const pair=pick([["q","q",2],["h","q",3],["h","h",4],["q","h",3]]);
   return {t:L("用連結線連住，一共要唱幾多拍？","用連結線連起來，一共要唱幾拍？"),cols:3,visual:`<div class="eq">${rcard(pair[0],"#d25fcf")}<span class="op">⁀</span>${rcard(pair[1],"#d25fcf")}</div>`,
    hint:L("連結線連住兩粒一樣高嘅音，只唱一次，拍子要加埋。","連結線連住兩個一樣高的音，只唱一次，拍子要加起來。"),after:()=>{piano("G4",pair[2]*.7*.92);},options:[pair[2]-1,pair[2],pair[2]+1].map(b=>opt(big(b+" "+L("拍","拍")),b===pair[2]))};}
  if(r<.75){const t=pick(["dh","h","w"]);return {t:L("邊個音符係 3 拍？","哪個音符是 3 拍？"),cols:3,hint:L("揾有一粒小點嘅音符。","找有一個小點的音符。"),options:shuffle(["dh","h","w"]).map(x=>opt(ART.noteSym(SYMK[x],"#d25fcf",50),x==="dh",{rh:x}))};}
  const pair=pick([["dh","q"],["q","dh"],["dh","qr"]]),sum=4;
  return {t:L("加埋一共幾多拍？","加起來一共幾拍？"),cols:3,visual:`<div class="eq">${rcard(pair[0],"#d25fcf")}<span class="op">+</span>${rcard(pair[1],"#d25fcf")}<span class="op">=</span><span class="op">?</span></div>`,hint:L("附點二分音符 3 拍，再加 1 拍。","附點二分音符 3 拍，再加 1 拍。"),after:()=>rhythm(pair,{my:live()}),options:[3,4,5].map(b=>opt(big(b+" "+L("拍","拍")),b===sum))};
 },
 meter(d){
  if(Math.random()<.35){const m=pick([2,3,4]);return {t:L(`${m}/4 拍，每小節有幾多拍？`,`${m}/4 拍，每小節有幾拍？`),cols:3,visual:`<div class="tsig big"><b>${m}</b><b>4</b></div>`,hint:L("睇上面嗰個數字。","看上面那個數字。"),options:[2,3,4].map(b=>opt(big(b+" "+L("拍","拍")),b===m))};}
  const m=pick(d<.5?[4,3]:[4,3,2]);
  const fills={4:[[["q","q","q"],1],[["h","q"],1],[["q","q"],2],[["h"],2],[["q"],3],[["e2","q","q"],1],[["e2","e2"],2]],3:[[["q","q"],1],[["h"],1],[["q"],2],[["e2","q"],1]],2:[[["q"],1],[["e2"],1]]}[m];
  const [have,miss]=pick(fills);const ansT={1:"q",2:"h",3:"dh"}[miss];
  const choices=shuffle([...new Set([ansT,...shuffle(["q","h","dh","w"].filter(x=>x!==ansT)).slice(0,2)])]);
  return {t:L("呢個小節仲差咩音符先夠拍？","這個小節還差什麼音符才夠拍？"),cols:3,
   visual:`<div class="bar-demo"><div class="tsig"><b>${m}</b><b>4</b></div><div class="pattern">${have.map(t=>rcard(t,"#3a86ff")).join("")}<span class="rcard-mini qbox">?</span></div><span class="barline"></span></div>`,
   hint:L(`${m}/4 拍要夠 ${m} 拍；而家有 ${m-miss} 拍，仲差 ${miss} 拍。`,`${m}/4 拍要有 ${m} 拍；現在有 ${m-miss} 拍，還差 ${miss} 拍。`),options:choices.map(t=>opt(`${ART.noteSym(SYMK[t],"#3a86ff",46)}<small>${BEATS[t]} ${L("拍","拍")}</small>`,t===ansT,{rh:t}))};
 },
 dynmark(d){
  const r=Math.random();
  if(d>.45&&r<.3){const T=[["Allegro",L("快板：輕快","快板：輕快")],["Andante",L("行板：好似行路嘅速度","行板：像走路的速度")],["Moderato",L("中板：中等速度","中板：中等速度")]];const a=pick(T);
   return {t:L(`「${a[0]}」係咩意思？`,`「${a[0]}」是什麼意思？`),cols:1,visual:`<div class="dcard static"><span class="term">${a[0]}</span></div>`,hint:L("Allegro 快，Andante 好似行路，Moderato 中等。","Allegro 快，Andante 像走路，Moderato 中等。"),
    after:()=>seq(["C5","D5","E5","G5"],a[0]==="Allegro"?.17:a[0]==="Andante"?.45:.3),options:shuffle(T).map(x=>opt(big(x[1]),x===a))};}
  if(r<.45){const all=d>.5?["pp","p","mp","mf","f","ff"]:["f","p","mf","mp"];const m=pick(all);const mean={pp:L("極弱（非常細聲）","極弱（非常小聲）"),ff:L("極強（非常大聲）","極強（非常大聲）"),f:L("強（好大聲）","強（很大聲）"),p:L("弱（好細聲）","弱（很小聲）"),mf:L("中強","中強"),mp:L("中弱","中弱")};
   const os=shuffle([m,...shuffle(all.filter(x=>x!==m)).slice(0,2)]);
   return {t:L("呢個記號係咩意思？","這個記號是什麼意思？"),cols:1,visual:`<div class="dcard static">${ART.dynMark(m,64)}</div>`,hint:L("f 係強，p 係弱；前面有 m 就係「中」；兩個字母就係「極」。","f 是強，p 是弱；前面有 m 就是「中」；兩個字母就是「極」。"),options:os.map(x=>opt(big(mean[x]),x===m))};}
  if(r<.7||d<.4){const isF=Math.random()<.5,f=()=>seq(["C4","E4","G4","C5"],.26,isF?1.25:.08);
   return {t:L("聽吓，應該用邊個記號？","聽聽看，應該用哪個記號？"),cols:2,auto:f,replay:f,hint:isF?L("咁大聲，係強。","這麼大聲，是強。"):L("咁細聲，係弱。","這麼小聲，是弱。"),options:[opt(ART.dynMark("f",54),isF),opt(ART.dynMark("p",54),!isF)]};}
  const up=Math.random()<.5,f=()=>{(up?[.06,.2,.5,1.2]:[1.2,.5,.2,.06]).forEach((v,k)=>piano("G4",.4,v,k*.4));};
  return {t:L("聲音慢慢點變？","聲音慢慢怎麼變？"),cols:2,auto:f,replay:f,hint:up?L("越嚟越大聲，個口打開。","越來越大聲，開口張開。"):L("越嚟越細聲，個口收埋。","越來越小聲，開口收起來。"),
   options:[opt(`${ART.dynMark("cresc",30)}<small>${L("漸強","漸強")}</small>`,up),opt(`${ART.dynMark("dim",30)}<small>${L("漸弱","漸弱")}</small>`,!up)]};
 },
 contour(d){
  const T=[["up",[0,1,2,3]],["down",[3,2,1,0]],["same",[2,2,2,2]],["updown",[0,2,3,1]],["downup",[3,1,0,2]]];
  const pool=d<.5?T.slice(0,3):T;const ans=pick(pool),others=shuffle(pool.filter(x=>x!==ans)).slice(0,2);
  const map=[0,2,4,7],f=async()=>{const my=live();for(const v of ans[1]){if(!live(my))return;piano(stepName(map[v]),.4);await wait(440);}};
  return {t:L("聽吓旋律，佢行邊條山路？","聽聽旋律，它走哪條山路？"),cols:3,auto:f,replay:f,hint:L("跟住聲音，用手指喺空中畫出嚟。","跟著聲音，用手指在空中畫出來。"),options:shuffle([ans,...others]).map(x=>opt(ART.contour(x[1],96),x===ans))};
 },
 bass(d){
  if(d<.25&&Math.random()<.5){return {t:L("低音譜號兩粒點夾住嘅線係咩音？","低音譜號兩個點夾住的線是什麼音？"),cols:3,visual:ART.staff({clef:"bass",notes:[],max:360}),hint:L("兩粒點夾住第四線，嗰度係 Fa，所以又叫 F 譜號。","兩個點夾住第四線，那裡是 Fa，所以又叫 F 譜號。"),
    options:shuffle([3,4,0]).map(i=>Object.assign(nameOpt(i),{ok:i===3}))};}
  const dn=rint(d<.5?18:17,d<.5?27:28),ti=dn%7,n=d<.5?3:4;
  const pool=shuffle([0,1,2,3,4,5,6].filter(i=>i!==ti&&Math.abs(i-ti)<=3)).slice(0,n-1);
  return {t:L("低音譜號：呢粒音叫咩名？","低音譜號：這個音叫什麼名字？"),cols:n,visual:ART.staff({clef:"bass",notes:[{dn,color:ART.INK,id:"qnote"}],max:380}),
   hint:L(`第一線係 ${NN(4)}，第四線（兩粒點中間）係 Fa；向上一格就係下一個兄弟。`,`第一線是 ${NN(4)}，第四線（兩個點中間）是 Fa；往上一格就是下一個兄弟。`),revealDn:dn,
   options:shuffle([ti,...pool]).map(i=>Object.assign(nameOpt(i),{ok:i===ti,note:i===ti?dn-28:i-7}))};
 },
 acc(d){
  const r=Math.random();
  if(r<.35){const k=pick(["#","b","n"]);const mean={"#":L("升高半音","升高半音"),b:L("降低半音","降低半音"),n:L("還原（取消升降）","還原（取消升降）")};
   return {t:L("呢個記號係咩意思？","這個記號是什麼意思？"),cols:1,visual:`<div class="dcard static"><span class="term big">${{"#":"♯",b:"♭",n:"♮"}[k]}</span></div>`,
    hint:L("♯ 好似井字，升高；♭ 好似細階 b，降低；♮ 還原。","♯ 像井字，升高；♭ 像小寫 b，降低；♮ 還原。"),options:shuffle(["#","b","n"]).map(x=>opt(big(mean[x]),x===k))};}
  if(r<.7||d<.4){const up=Math.random()<.5,base=up?pick(["C4","F4","G4"]):pick(["E4","A4","B4"]),alt={C4:"Db4",F4:"Gb4",G4:"Ab4",E4:"Eb4",A4:"Ab4",B4:"Bb4"}[base];
   const f=playTwo(async()=>{piano(base,.6);await wait(600);},async()=>{piano(alt,.6);await wait(600);});
   return {t:L("第二個音加咗咩記號？","第二個音加了什麼記號？"),cols:2,auto:f,replay:f,hint:up?L("第二個音高咗少少，即係升。","第二個音高了一點點，就是升。"):L("第二個音低咗少少，即係降。","第二個音低了一點點，就是降。"),
    options:[opt(`<span class="term">♯</span><small>${L("升","升")}</small>`,up),opt(`<span class="term">♭</span><small>${L("降","降")}</small>`,!up)]};}
  const T=[["Do♯",1],["Re♯",3],["Fa♯",6],[NN(4)+"♯",8],["La♯",10],["Re♭",1],["Mi♭",3],[NN(6)+"♭",10],["La♭",8]];const a=pick(T);
  const others=shuffle([1,3,6,8,10].filter(x=>x!==a[1])).slice(0,2);const lab={0:"Do",2:"Re",4:"Mi",5:"Fa",7:NN(4),9:"La",11:NN(6)};
  return {t:L(`${a[0]} 係邊個鍵？`,`${a[0]} 是哪一個鍵？`),cols:1,hint:L("♯ 係右邊（高半音）嘅鍵；♭ 係左邊（低半音）嘅鍵。","♯ 是右邊（高半音）的鍵；♭ 是左邊（低半音）的鍵。"),
   options:shuffle([a[1],...others]).map(s=>opt(ART.keyboard({hi:{[s]:"#ffd23f"},labels:lab,max:260}),s===a[1],{semi:s}))};
 },
 tone(d){
  const P=[[0,2,1],[2,4,1],[4,5,0],[5,7,1],[7,9,1],[9,11,1],[11,12,0],[1,3,1],[6,8,1],[3,4,0],[5,6,0]];
  const pool=d<.4?P.slice(0,7):P;const [a,b,whole]=pick(pool);
  const N=["C4","Db4","D4","Eb4","E4","F4","Gb4","G4","Ab4","A4","Bb4","B4","C5"];
  return {t:L("呢兩個鍵相差全音定半音？","這兩個鍵相差全音還是半音？"),cols:2,visual:ART.keyboard({hi:{[a]:"#6fd08c",[b]:"#6fd08c"},labels:{0:"Do",2:"Re",4:"Mi",5:"Fa",7:NN(4),9:"La",11:NN(6),12:"Do"}}),
   hint:whole?L("佢哋中間仲有一個鍵，所以係全音。","它們中間還有一個鍵，所以是全音。"):L("佢哋貼住，中間冇其他鍵，所以係半音。","它們貼在一起，中間沒有其他鍵，所以是半音。"),
   after:()=>{piano(N[a],.5);piano(N[b],.6,.8,.5);},options:[opt(big(L("全音","全音")),!!whole),opt(big(L("半音","半音")),!whole)]};
 },
 scale(d){
  const r=Math.random();
  if(r<.45){const k=rint(2,8),ans=(k-1)%7;const others=shuffle([0,1,2,3,4,5,6].filter(i=>i!==ans)).slice(0,2);
   return {t:L(`C 大調第 ${k} 級係咩音？`,`C 大調第 ${k} 級是什麼音？`),cols:3,visual:`<div class="stairs mini">${[0,1,2,3,4,5,6,7].map(i=>`<div class="step" style="background:${i===k-1?"#fff":SC[i]};${i===k-1?"color:var(--ink);text-shadow:none;border-style:dashed;":""}height:${40+i*9}px">${i===k-1?"?":i+1}</div>`).join("")}</div>`,
    hint:L("由 Do 開始數：1 Do、2 Re、3 Mi……","從 Do 開始數：1 Do、2 Re、3 Mi……"),options:shuffle([ans,...others]).map(i=>Object.assign(nameOpt(i),{ok:i===ans}))};}
  if(r<.75){const C=[[[0,2,4],1],[[0,1,2],0],[[0,3,5],0],[[1,3,5],0]];
   return {t:L("C 大調主三和弦係邊三個音？","C 大調主三和弦是哪三個音？"),cols:1,hint:L("主三和弦用第 1、3、5 級：隔一級揀一個。","主三和弦用第 1、3、5 級：隔一級選一個。"),
    options:shuffle(C).map(([ns,ok])=>opt(`<span class="solfa">${ns.map(i=>NN(i)).join(" · ")}</span>`,!!ok,{chord:ns}))};}
  const f=()=>{[0,2,4].forEach(i=>piano(stepName(i),1.4,.7));};const g=()=>{[0,1,2].forEach(i=>piano(stepName(i),1.4,.7));};const okFirst=Math.random()<.5;
  const pf=playTwo(async()=>{(okFirst?f:g)();await wait(1300);},async()=>{(okFirst?g:f)();await wait(1300);});
  return {t:L("邊一個係主三和弦（Do Mi So）？","哪一個是主三和弦（Do Mi Sol）？"),cols:2,auto:pf,replay:pf,hint:L("主三和弦聽落好圓滑、好安定。","主三和弦聽起來很圓滑、很安定。"),options:listenOpts(okFirst)};
 },
 interval(d){
  const lo=rint(0,d<.5?3:5),n=rint(2,d<.5?5:8),hi=lo+n-1;
  const os=shuffle([...new Set([n,n===2?3:n-1,n===8?6:n+1])]);
  return {t:L("呢兩粒音相差幾多度？","這兩個音相差幾度？"),cols:3,visual:ART.staff({notes:[{step:lo,color:SC[lo%7]},{step:hi,color:SC[hi%7]}],x0:150,max:380}),
   hint:L("由低嗰粒數起，連自己都要數：線、間、線、間……","從低的那個開始數，連自己也要數：線、間、線、間……"),after:()=>{piano(stepName(lo),.5);piano(stepName(hi),.6,.8,.55);},
   options:os.map(k=>opt(big(k+L(" 度"," 度")),k===n))};
 }
,
 keysig(d){
  const r=Math.random(),ks=["C","G","D","F"];
  if(r<.45){const k=pick(d<.4?["C","G","F"]:ks);return {t:L("睇調號：呢首歌係咩調？","看調號：這首歌是什麼調？"),cols:2,visual:ART.staff({key:k,notes:[],max:300}),
    hint:L(`冇記號＝C；一個 ♯＝G；兩個 ♯＝D；一個 ♭＝F。`,`沒有記號＝C；一個 ♯＝G；兩個 ♯＝D；一個 ♭＝F。`),options:shuffle(ks).map(x=>opt(big(keyName(x)),x===k))};}
  if(r<.75){const k=pick(["G","D","F"]);const ans={G:"Fa♯",D:"Fa♯、Do♯",F:NN(6)+"♭"}[k];const os=shuffle(["Fa♯","Fa♯、Do♯",NN(6)+"♭",L("冇升降","沒有升降")]).slice(0,4);
   return {t:L(`${k} 大調嘅調號有咩？`,`${k} 大調的調號有什麼？`),cols:2,hint:L("G 升 Fa；D 升 Fa 同 Do；F 降 Ti。","G 升 Fa；D 升 Fa 和 Do；F 降 Si。").replace("Ti",NN(6)),options:os.map(x=>opt(big(x),x===ans))};}
  const q=pick([["C","G",L("加一個升號","加一個升號")],["G","D",L("再加一個升號","再加一個升號")],["C","F",L("加一個降號","加一個降號")]]);
  return {t:L(`五度圈：${q[0]} 大調${q[2]}，會變成咩調？`,`五度圈：${q[0]} 大調${q[2]}，會變成什麼調？`),cols:2,hint:L("升號每加一個，主音就向上五度：C → G → D。降號就向下：C → F。","升號每多一個，主音就往上五度：C → G → D。降號就往下：C → F。"),
   options:shuffle(ks.filter(x=>x!==q[0])).map(x=>opt(big(keyName(x)),x===q[1]))};
 },
 terms(d){
  const r=Math.random(),K=["staccato","slur","accent","repeat","rit"];
  if(r<.45){const k=pick(K);const os=shuffle([k,...shuffle(K.filter(x=>x!==k)).slice(0,2)]);
   return {t:L("呢個記號係咩意思？","這個記號是什麼意思？"),cols:1,visual:`<div class="dcard static">${ART.artic(k,120)}</div>`,hint:L("一點＝斷奏；弧線＝連住；「>」＝重音；兩點雙線＝反覆；rit.＝漸慢。","一點＝斷奏；弧線＝連起來；「>」＝重音；兩點雙線＝反覆；rit.＝漸慢。"),
    after:()=>playTerm(k),options:os.map(x=>opt(big(TERM[x]),x===k))};}
  if(r<.8){const st=Math.random()<.5;const f=playTwo(async()=>{playTerm(st?"staccato":"slur");await wait(1400);},async()=>{playTerm(st?"slur":"staccato");await wait(1400);});
   return {t:L("邊一次係斷奏（staccato）？","哪一次是斷奏（staccato）？"),cols:2,auto:f,replay:f,hint:L("斷奏每個音都好短，好似跳跳紮。","斷奏每個音都很短，像在跳。"),options:listenOpts(st)};}
  return {t:L("不斷重複嘅一小段節奏或者旋律，叫做咩？","不斷重複的一小段節奏或旋律，叫做什麼？"),cols:1,hint:L("Ostinato：好似背景一直轉嘅小圈圈。","Ostinato：像背景一直轉的小圈圈。"),
   after:()=>{for(let r=0;r<3;r++)["C4","G4","E4","G4"].forEach((n,i)=>piano(n,.2,.6,r*1.2+i*.3));},
   options:shuffle([[L("頑固音型（ostinato）","頑固音型（ostinato）"),1],[L("漸強（crescendo）","漸強（crescendo）"),0],[L("休止符","休止符"),0]]).map(([t,ok])=>opt(big(t),!!ok))};
 },

 gmaj(d){const k="G";const sc=keyScale(k);const r=Math.random();
  if(r<.3){const an=sc.filter(n=>n.acc).map(n=>n.name).filter((v,i,a)=>a.indexOf(v)===i).join("、");const os=shuffle([...new Set([an,"Fa♯","Fa♯、Do♯",NN(6)+"♭",L("冇升降","沒有升降")])]).filter((x,i,a)=>i<3||x===an).slice(0,4);if(!os.includes(an))os[0]=an;
   return {t:L(`${k} 大調入面，邊啲音要升或者降？`,`${k} 大調裡，哪些音要升或降？`),cols:2,visual:ART.staff({key:k,notes:[],max:300}),hint:L("睇吓譜號後面嘅調號。","看看譜號後面的調號。"),options:shuffle(os).map(x=>opt(big(x),x===an))};}
  if(r<.6){const deg=rint(2,8),ans=sc[deg-1].name;const wrong=shuffle(sc.filter((n,i)=>i!==deg-1).map(n=>n.name)).slice(0,1).concat(sc[deg-1].acc?[NN(sc[deg-1].ix)]:[NN((sc[deg-1].ix+1)%7)]);
   const os=shuffle([...new Set([ans,...wrong])]);
   return {t:L(`${k} 大調第 ${deg} 級係咩音？`,`${k} 大調第 ${deg} 級是什麼音？`),cols:os.length,visual:ART.staff({key:k,notes:sc.map((n,i)=>({step:n.step,color:i===deg-1?"#fff":SC[n.ix],stem:false,label:i===deg-1?"?":String(i+1)})),x0:96,max:420}),
    hint:L(`由主音 ${sc[0].name} 開始數，記住調號嘅升降。`,`從主音 ${sc[0].name} 開始數，記住調號的升降。`),after:()=>piano(sc[deg-1].snd,.6),options:os.map(x=>opt(`<span class="solfa">${x}</span>`,x===ans))};}
  if(r<.8){const tri=[0,2,4].map(i=>sc[i].name).join(" · ");const bad1=[0,1,2].map(i=>sc[i].name).join(" · "),bad2=[0,2,4].map(i=>NN(sc[i].ix)).join(" · "),bad3=[1,3,5].map(i=>sc[i].name).join(" · ");
   const os=shuffle([...new Set([tri,bad1,bad2===tri?bad3:bad2,bad3])]).slice(0,3);if(!os.includes(tri))os[0]=tri;
   return {t:L(`${k} 大調嘅主三和弦係？`,`${k} 大調的主三和弦是？`),cols:1,hint:L("主三和弦＝第 1、3、5 級，記得調號嘅升降。","主三和弦＝第 1、3、5 級，記得調號的升降。"),after:()=>[0,2,4].forEach(i=>piano(sc[i].snd,1.1,.6)),options:shuffle(os).map(x=>opt(`<span class="solfa">${x}</span>`,x===tri))};}
  const okFirst=Math.random()<.5;const f=playTwo(async()=>{await playScale(k,!okFirst,true);},async()=>{await playScale(k,okFirst,true);});
  return {t:L(`邊一個先係正確嘅 ${k} 大調音階？`,`哪一個才是正確的 ${k} 大調音階？`),cols:2,auto:f,replay:f,hint:L("錯嗰個漏咗調號嘅升降，有一個音聽落怪怪哋。","錯的那個漏了調號的升降，有一個音聽起來怪怪的。"),options:listenOpts(okFirst)};
 },
 dmaj(d){const k="D";const sc=keyScale(k);const r=Math.random();
  if(r<.3){const an=sc.filter(n=>n.acc).map(n=>n.name).filter((v,i,a)=>a.indexOf(v)===i).join("、");const os=shuffle([...new Set([an,"Fa♯","Fa♯、Do♯",NN(6)+"♭",L("冇升降","沒有升降")])]).filter((x,i,a)=>i<3||x===an).slice(0,4);if(!os.includes(an))os[0]=an;
   return {t:L(`${k} 大調入面，邊啲音要升或者降？`,`${k} 大調裡，哪些音要升或降？`),cols:2,visual:ART.staff({key:k,notes:[],max:300}),hint:L("睇吓譜號後面嘅調號。","看看譜號後面的調號。"),options:shuffle(os).map(x=>opt(big(x),x===an))};}
  if(r<.6){const deg=rint(2,8),ans=sc[deg-1].name;const wrong=shuffle(sc.filter((n,i)=>i!==deg-1).map(n=>n.name)).slice(0,1).concat(sc[deg-1].acc?[NN(sc[deg-1].ix)]:[NN((sc[deg-1].ix+1)%7)]);
   const os=shuffle([...new Set([ans,...wrong])]);
   return {t:L(`${k} 大調第 ${deg} 級係咩音？`,`${k} 大調第 ${deg} 級是什麼音？`),cols:os.length,visual:ART.staff({key:k,notes:sc.map((n,i)=>({step:n.step,color:i===deg-1?"#fff":SC[n.ix],stem:false,label:i===deg-1?"?":String(i+1)})),x0:96,max:420}),
    hint:L(`由主音 ${sc[0].name} 開始數，記住調號嘅升降。`,`從主音 ${sc[0].name} 開始數，記住調號的升降。`),after:()=>piano(sc[deg-1].snd,.6),options:os.map(x=>opt(`<span class="solfa">${x}</span>`,x===ans))};}
  if(r<.8){const tri=[0,2,4].map(i=>sc[i].name).join(" · ");const bad1=[0,1,2].map(i=>sc[i].name).join(" · "),bad2=[0,2,4].map(i=>NN(sc[i].ix)).join(" · "),bad3=[1,3,5].map(i=>sc[i].name).join(" · ");
   const os=shuffle([...new Set([tri,bad1,bad2===tri?bad3:bad2,bad3])]).slice(0,3);if(!os.includes(tri))os[0]=tri;
   return {t:L(`${k} 大調嘅主三和弦係？`,`${k} 大調的主三和弦是？`),cols:1,hint:L("主三和弦＝第 1、3、5 級，記得調號嘅升降。","主三和弦＝第 1、3、5 級，記得調號的升降。"),after:()=>[0,2,4].forEach(i=>piano(sc[i].snd,1.1,.6)),options:shuffle(os).map(x=>opt(`<span class="solfa">${x}</span>`,x===tri))};}
  const okFirst=Math.random()<.5;const f=playTwo(async()=>{await playScale(k,!okFirst,true);},async()=>{await playScale(k,okFirst,true);});
  return {t:L(`邊一個先係正確嘅 ${k} 大調音階？`,`哪一個才是正確的 ${k} 大調音階？`),cols:2,auto:f,replay:f,hint:L("錯嗰個漏咗調號嘅升降，有一個音聽落怪怪哋。","錯的那個漏了調號的升降，有一個音聽起來怪怪的。"),options:listenOpts(okFirst)};
 },
 fmaj(d){const k="F";const sc=keyScale(k);const r=Math.random();
  if(r<.3){const an=sc.filter(n=>n.acc).map(n=>n.name).filter((v,i,a)=>a.indexOf(v)===i).join("、");const os=shuffle([...new Set([an,"Fa♯","Fa♯、Do♯",NN(6)+"♭",L("冇升降","沒有升降")])]).filter((x,i,a)=>i<3||x===an).slice(0,4);if(!os.includes(an))os[0]=an;
   return {t:L(`${k} 大調入面，邊啲音要升或者降？`,`${k} 大調裡，哪些音要升或降？`),cols:2,visual:ART.staff({key:k,notes:[],max:300}),hint:L("睇吓譜號後面嘅調號。","看看譜號後面的調號。"),options:shuffle(os).map(x=>opt(big(x),x===an))};}
  if(r<.6){const deg=rint(2,8),ans=sc[deg-1].name;const wrong=shuffle(sc.filter((n,i)=>i!==deg-1).map(n=>n.name)).slice(0,1).concat(sc[deg-1].acc?[NN(sc[deg-1].ix)]:[NN((sc[deg-1].ix+1)%7)]);
   const os=shuffle([...new Set([ans,...wrong])]);
   return {t:L(`${k} 大調第 ${deg} 級係咩音？`,`${k} 大調第 ${deg} 級是什麼音？`),cols:os.length,visual:ART.staff({key:k,notes:sc.map((n,i)=>({step:n.step,color:i===deg-1?"#fff":SC[n.ix],stem:false,label:i===deg-1?"?":String(i+1)})),x0:96,max:420}),
    hint:L(`由主音 ${sc[0].name} 開始數，記住調號嘅升降。`,`從主音 ${sc[0].name} 開始數，記住調號的升降。`),after:()=>piano(sc[deg-1].snd,.6),options:os.map(x=>opt(`<span class="solfa">${x}</span>`,x===ans))};}
  if(r<.8){const tri=[0,2,4].map(i=>sc[i].name).join(" · ");const bad1=[0,1,2].map(i=>sc[i].name).join(" · "),bad2=[0,2,4].map(i=>NN(sc[i].ix)).join(" · "),bad3=[1,3,5].map(i=>sc[i].name).join(" · ");
   const os=shuffle([...new Set([tri,bad1,bad2===tri?bad3:bad2,bad3])]).slice(0,3);if(!os.includes(tri))os[0]=tri;
   return {t:L(`${k} 大調嘅主三和弦係？`,`${k} 大調的主三和弦是？`),cols:1,hint:L("主三和弦＝第 1、3、5 級，記得調號嘅升降。","主三和弦＝第 1、3、5 級，記得調號的升降。"),after:()=>[0,2,4].forEach(i=>piano(sc[i].snd,1.1,.6)),options:shuffle(os).map(x=>opt(`<span class="solfa">${x}</span>`,x===tri))};}
  const okFirst=Math.random()<.5;const f=playTwo(async()=>{await playScale(k,!okFirst,true);},async()=>{await playScale(k,okFirst,true);});
  return {t:L(`邊一個先係正確嘅 ${k} 大調音階？`,`哪一個才是正確的 ${k} 大調音階？`),cols:2,auto:f,replay:f,hint:L("錯嗰個漏咗調號嘅升降，有一個音聽落怪怪哋。","錯的那個漏了調號的升降，有一個音聽起來怪怪的。"),options:listenOpts(okFirst)};
 }
};

return {CHAPTERS,LEVELS,LESSONS,GEN,stepName,BEATS,SYMK,SYL,SC};
};
