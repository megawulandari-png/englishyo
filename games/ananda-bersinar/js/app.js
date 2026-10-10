/* THE BRAVE WAY — Every Choice Matters. · game engine
   Developed by Mega Ayu Wulandari — ENGLISH YO! */
(function(){
'use strict';
const D = window.AB, UI = D.ui;
const KEY = 'ananda-bersinar-v2';
const HEROES = {raka:{n:'Raka',img:'p-raka.png'},salsa:{n:'Salsa',img:'p-salsa.png'},maya:{n:'Maya',img:'p-maya.png'},dimas:{n:'Dimas',img:'p-dimas.png'}};
const PORT = {nia:['s-baik.png','Nia'],bayu:['s-pengajak.png','Bayu'],dito:['s-ragu.png','Dito'],guru:['s-guru.png','Bu Rina'],konselor:['s-konselor.png','Bu Dewi'],ortu:['s-ortu.png',D.sp2.ortu],satpam:['s-satpam.png','Pak Anto'],petugas:['s-petugas.png','Pak Agus']};
const EMO = {phone:'📱',unk:'📱',game:'🎮'};
const CATS = ['safety','voice','empathy'];
const CATEMO = {safety:'🛡️',voice:'📣',empathy:'💛'};
const BGNAME = {sekolah:['Halaman sekolah','Schoolyard'],kelas:['Ruang kelas','Classroom'],koridor:['Koridor sekolah','School corridor'],perpus:['Perpustakaan','Library'],konseling:['Ruang konseling','Counseling room'],lapangan:['Lapangan olahraga','Sports field'],rumah:['Rumah','Home'],kampanye:['Kampanye sekolah','School campaign']};

/* ───────── state ───────── */
const blank = () => ({lang:'id',sound:true,hero:'raka',scores:{},mods:{},shields:0,hints:{},bonus:0,ach:{},certName:'',refl:['','',''],view:'home',cm:1,cur:null,mod:null,sur:null,compM:null,player:'',lv:{},mz:null,lvres:null,cl:1});
let S = blank();
let aboutOpen = false;
if(S.lang!=='id'&&S.lang!=='en') S.lang='id';
try{ const raw = sessionStorage.getItem(KEY); if(raw) S = Object.assign(blank(), JSON.parse(raw)); }catch(e){}
function save(){ try{ sessionStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

/* ───────── helpers ───────── */
const $ = (s,r=document) => r.querySelector(s);
const L = p => Array.isArray(p) ? p[S.lang==='id'?0:1] : p;
const u = k => L(UI[k]);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const perm = n => { const a=Array.from({length:n},(_,i)=>i); for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const mission = id => D.missions.find(m=>m.id===id);
const sceneDef = (m,i) => mission(m).scenes[i];
const key = (m,i) => m+'-'+i;
const badgeImg = b => `img/b-${b}.png`;
const heroName = () => HEROES[S.hero].n;

/* ───────── sound ───────── */
let AC = null;
function tone(f,d=.12,t=0,type='sine',v=.07){
  if(!S.sound) return;
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(), g=AC.createGain(), s=AC.currentTime+t;
    o.type=type; o.frequency.value=f; g.gain.setValueAtTime(v,s); g.gain.exponentialRampToValueAtTime(.001,s+d);
    o.connect(g); g.connect(AC.destination); o.start(s); o.stop(s+d+.02);
  }catch(e){}
}
const sfx = {
  click:()=>tone(520,.07,0,'triangle',.05),
  ok:()=>{tone(660,.1);tone(880,.14,.09)},
  good:()=>{tone(523,.1);tone(659,.1,.09);tone(784,.16,.18)},
  no:()=>{tone(300,.16,0,'triangle',.06);tone(240,.18,.12,'triangle',.05)},
  star:()=>{tone(988,.08);tone(1318,.16,.07)},
  win:()=>{[523,659,784,1046,1318].forEach((f,i)=>tone(f,.2,i*.11,'triangle',.08))}
};
function confetti(){
  const c=document.createElement('div'); c.className='confetti';
  const em=['⭐','🌟','✨','🎉','💙','💛'];
  for(let i=0;i<34;i++){const e=document.createElement('i');e.textContent=em[i%em.length];e.style.left=Math.random()*100+'%';e.style.animationDuration=(2+Math.random()*2.2)+'s';e.style.animationDelay=Math.random()*.6+'s';c.appendChild(e);}
  document.body.appendChild(c); setTimeout(()=>c.remove(),5000);
}
const toasts = [];   // each toast keeps a text function so it re-translates if the language changes while it is visible
function toast(msg){
  const fn = typeof msg==='function' ? msg : ()=>msg;
  const el=document.createElement('div'); el.className='toast'; el.textContent=fn(); document.body.appendChild(el);
  const rec={el,fn}; toasts.push(rec);
  setTimeout(()=>{ el.remove(); const i=toasts.indexOf(rec); if(i>=0) toasts.splice(i,1); },3200);
}
function refreshToasts(){ toasts.forEach(t=>{ t.el.textContent=t.fn(); }); }

/* ───────── scoring ───────── */
const LV = D.levels;
const lvDone = id => !!(S.lv[id] && S.lv[id].done);
const levelsDone = () => LV.filter(l=>lvDone(l.id)).length;
const allLevels = () => levelsDone()===LV.length;
const lvUnlocked = id => id===1 || lvDone(id-1);
const badgeOwned = l => lvDone(l.id) && (l.badge!=='champion' || allLevels());
const lvMax = id => LV.find(l=>l.id===id).npcs.reduce((a,n)=>a+n.qs.length*20,0);
const levelPts = id => S.lv[id] ? Object.values(S.lv[id].enc).reduce((a,e)=>a+e.pts,0) : 0;
const missionDone = id => mission(id).scenes.every((_,i)=>S.scores[key(id,i)]);
const missionPts = id => mission(id).scenes.reduce((a,_,i)=>a+((S.scores[key(id,i)]||{}).pts||0),0);
const bonusDone = () => D.missions.filter(m=>missionDone(m.id)).length;
const ratioToPts = r => r>=.8?20:r>=.5?10:0;
function totals(){
  const m={safety:0,voice:0,empathy:0}, b={safety:0,voice:0,empathy:0}, mx={safety:0,voice:0,empathy:0}, bmx={safety:0,voice:0,empathy:0};
  Object.values(S.lv).forEach(r=>Object.values(r.enc).forEach(e=>{ m[e.cat]+=e.pts; }));
  LV.forEach(l=>l.npcs.forEach(n=>n.qs.forEach(q=>{ mx[q.cat]+=20; })));
  D.missions.forEach(ms=>ms.scenes.forEach((sc,i)=>{ bmx[sc.cat]+=20; const r=S.scores[key(ms.id,i)]; if(r) b[sc.cat]+=r.pts; }));
  const t={}; CATS.forEach(c=>{ t[c]=m[c]+b[c]; });
  return {t,m,b,mx,bmx};
}
const starCount = () => Object.values(S.lv).reduce((a,r)=>a+(r.mapStars||0)+(r.encStars||0),0) + Object.values(S.scores).reduce((a,r)=>a+Math.floor(r.pts/10),0) + S.bonus;
function checkAch(){
  const A=S.ach, before=Object.keys(A).length, ids=[];
  const set=id=>{ if(!A[id]){A[id]=true;ids.push(id);} };
  if(Object.keys(S.scores).length || Object.values(S.lv).some(r=>Object.keys(r.enc).length)) set('first');
  const mc=Object.keys(S.mods).length; if(mc>=1) set('learner'); if(mc>=5) set('scholar');
  D.missions.forEach(m=>{ if(m.scenes.every((_,i)=>(S.scores[key(m.id,i)]||{}).pts===20)) set('perfect'); });
  Object.values(S.lv).forEach(r=>{ if(r.done&&r.perfect) set('nowrong'); if(r.done&&r.allStars) set('allstars'); });
  if(levelsDone()>=1) set('escape1'); if(allLevels()) set('master');
  if(starCount()>=25) set('stars');
  ids.forEach(id=>{ const a=D.extraAch.find(x=>x.id===id); if(a) setTimeout(()=>toast(()=>'🏅 '+L(a.t)),400); });
  return Object.keys(A).length>before;
}

/* ═════════════════════ ENGINES ═════════════════════ */
const ptsCls = p => p>=20?'good':p>=10?'ok':'soft';
const E = {};

/* choice (with optional branching step) */
const stepDef = (def,st) => st.step===0 ? def : def.opts[st.picks[0]].next;
E.choice = {
  init:def=>({step:0,picks:[],sel:null,order:perm(def.opts.length)}),
  lines:(def,st)=> st.step===0 ? def.lines : def.lines.concat(stepDef(def,st).lines),
  q:(def,st)=> L(stepDef(def,st).q),
  html(def,st){
    const sd=stepDef(def,st); let h='<div class="opts">';
    st.order.forEach((oi,n)=>{
      const o=sd.opts[oi]; let cls='opt';
      if(st.sel!==null) cls += oi===st.sel ? ' '+ptsCls(o.pts) : ' dim';
      h+=`<button class="${cls}" data-act="e" data-a="ch" data-i="${oi}" ${st.sel!==null?'disabled':''}><span class="k">${'ABCD'[n]}</span><span>${esc(L(o.t))}</span></button>`;
    });
    h+='</div>';
    if(st.sel!==null){
      const o=sd.opts[st.sel], c=ptsCls(o.pts);
      h+=`<div class="fb ${c}"><b class="h">${o.pts>=20?'✅ '+u('right'):o.pts>=10?'👍 '+u('oops'):'💭 '+u('notYet')}</b>${esc(L(o.fb))}</div>`;
      if(o.next && st.step===0) h+=`<div class="row"><button class="btn orange" data-act="e" data-a="cont">${u('contStory')} ➜</button></div>`;
    }
    return h;
  },
  act(def,st,a,i){
    if(a==='ch' && st.sel===null){ st.sel=+i; st.picks[st.step]=+i; const p=stepDef(def,st).opts[+i].pts; p>=20?sfx.good():p>=10?sfx.ok():sfx.no(); }
    if(a==='cont'){ st.step=1; st.sel=null; st.order=perm(stepDef(def,st).opts.length); sfx.click(); }
  },
  status(def,st){
    if(st.sel===null) return null;
    const o=stepDef(def,st).opts[st.sel];
    if(st.step===0 && o.next) return null;
    return {pts: st.step===0 ? o.pts : Math.round((def.opts[st.picks[0]].pts+o.pts)/2)};
  }
};

/* select (red flags / pick all that apply) */
E.select = {
  init:def=>({order:perm(def.items.length),on:[],checked:false}),
  html(def,st){
    const chat = def.style==='chat';
    let h = chat ? `<div class="chat"><small>📱 ${esc(L(def.from))}</small>` : '<div class="chips">';
    st.order.forEach(i=>{
      const it=def.items[i], on=st.on.includes(i); let cls = chat ? 'cb' : 'chipbtn';
      if(st.checked){ if(on&&it.ok) cls+=' right'; else if(on&&!it.ok) cls+=' wrong'; else if(!on&&it.ok) cls+=' miss'; }
      else if(on) cls+=' on';
      const mark = chat ? (on?'🚩 ':'') : (st.checked ? (on&&it.ok?'✅ ':on?'❔ ':it.ok?'➕ ':'') : (on?'☑️ ':'⬜ '));
      h+=`<button class="${cls}" data-act="e" data-a="tg" data-i="${i}" ${st.checked?'disabled':''}>${mark}${esc(L(it.t))}</button>`;
    });
    h += '</div>';
    if(!st.checked) h += `<p class="disc" style="margin-top:10px">${u('chooseAll')}</p><div class="row"><button class="btn teal" data-act="e" data-a="chk">✔ ${u('check')}</button></div>`;
    else{
      const r=E.select.ratio(def,st), oks=def.items.filter(x=>x.ok).length, hits=def.items.filter((x,i)=>x.ok&&st.on.includes(i)).length;
      h += `<div class="fb ${r>=.8?'good':r>=.5?'ok':'soft'}"><b class="h">${hits}/${oks} ✔</b>` + def.items.map((it,i)=>{
        const on=st.on.includes(i); if(!it.why) return '';
        if(it.ok && !on) return `<span class="why">➕ ${esc(L(it.t))} — ${esc(L(it.why))}</span>`;
        if(!it.ok && on) return `<span class="why">❔ ${esc(L(it.t))} — ${esc(L(it.why))}</span>`;
        if(it.ok && on) return `<span class="why">✅ ${esc(L(it.why))}</span>`;
        return '';
      }).join('') + '</div>';
    }
    return h;
  },
  ratio(def,st){
    const oks=def.items.filter(x=>x.ok).length;
    const hits=def.items.filter((x,i)=>x.ok&&st.on.includes(i)).length, wr=def.items.filter((x,i)=>!x.ok&&st.on.includes(i)).length;
    return Math.max(0,(hits-wr)/oks);
  },
  act(def,st,a,i){
    if(st.checked) return;
    if(a==='tg'){ i=+i; const k=st.on.indexOf(i); k>=0?st.on.splice(k,1):st.on.push(i); sfx.click(); }
    if(a==='chk'){ st.checked=true; const r=E.select.ratio(def,st); r>=.8?sfx.good():r>=.5?sfx.ok():sfx.no(); }
  },
  status:(def,st)=> st.checked ? {ratio:E.select.ratio(def,st)} : null
};

/* sort (drag & drop or tap) */
E.sort = {
  init:def=>({order:perm(def.items.length),placed:{},sel:null,mist:0,msg:null}),
  html(def,st){
    const un=st.order.filter(i=>st.placed[i]===undefined);
    let h='';
    if(un.length) h+='<div class="tray">'+un.map(i=>`<button class="dcard ${st.sel===i?'sel':''}" draggable="true" data-act="e" data-a="sel" data-i="${i}">${esc(L(def.items[i].t))}</button>`).join('')+'</div>';
    h+='<div class="sbins">'+def.bins.map((b,bi)=>`<button class="bin b${bi}" data-act="e" data-a="bin" data-b="${bi}"><h4>${bi===0?'✅':'⚠️'} ${esc(L(b))}</h4>${st.order.filter(i=>st.placed[i]===bi).map(i=>`<span class="dcard placed">${esc(L(def.items[i].t))}</span>`).join('')}</button>`).join('')+'</div>';
    if(st.msg) h+=`<div class="fb soft"><b class="h">💭 ${u('notYet')}</b>${esc(st.msg)}</div>`;
    else if(un.length) h+=`<p class="disc" style="margin-top:10px">👆 ${u('placeIt')}</p>`;
    return h;
  },
  act(def,st,a,i,b){
    if(a==='sel'){ i=+i; st.sel = st.sel===i ? null : i; st.msg=null; sfx.click(); return; }
    if(a==='bin'){
      const idx = (i!==undefined && i!==null && i!=='') ? +i : st.sel; if(idx===null||idx===undefined||isNaN(idx)||st.placed[idx]!==undefined) return;
      const it=def.items[idx];
      if(it.bin===+b){ st.placed[idx]=+b; st.sel=null; st.msg=null; sfx.ok(); }
      else { st.mist++; st.msg = (it.why?L(it.why):u('sortNo')); sfx.no(); }
    }
  },
  status(def,st){ const n=def.items.length; return Object.keys(st.placed).length===n ? {ratio:n/(n+st.mist)} : null; }
};

/* match */
E.match = {
  init:def=>({rorder:perm(def.pairs.length),selL:null,done:{},mist:0,msg:null,shake:null}),
  html(def,st){
    let h='<div class="mgrid"><div class="mcol">';
    def.pairs.forEach((p,i)=>{ h+=`<button class="mbtn ${st.done[i]?'ok':''} ${st.selL===i?'sel':''}" data-act="e" data-a="ml" data-i="${i}" ${st.done[i]?'disabled':''}>${st.done[i]?'✅ ':''}${esc(L(p.a))}</button>`; });
    h+='</div><div class="mcol">';
    st.rorder.forEach(j=>{ h+=`<button class="mbtn ${st.done[j]?'ok':''} ${st.shake===j?'shake':''}" data-act="e" data-a="mr" data-i="${j}" ${st.done[j]?'disabled':''}>${esc(L(def.pairs[j].b))}</button>`; });
    h+='</div></div>';
    if(st.msg) h+=`<div class="fb soft"><b class="h">💭 ${u('notYet')}</b>${esc(st.msg)}</div>`;
    else h+=`<p class="disc" style="margin-top:10px">${u('tapPick')}</p>`;
    return h;
  },
  act(def,st,a,i){
    i=+i; st.shake=null;
    if(a==='ml' && !st.done[i]){ st.selL=i; st.msg=null; sfx.click(); }
    if(a==='mr' && !st.done[i]){
      if(st.selL===null){ st.msg = u('matchFirst'); return; }
      if(st.selL===i){ st.done[i]=true; st.selL=null; st.msg=null; sfx.ok(); }
      else { st.mist++; st.shake=i; st.msg = u('matchWrong'); sfx.no(); }
    }
  },
  status(def,st){ const n=def.pairs.length; return Object.keys(st.done).length===n ? {ratio:n/(n+st.mist)} : null; }
};

/* build (dialogue builder) */
E.build = {
  init:def=>({step:0,picks:[],mist:0,msg:null,orders:def.steps.map(s=>perm(s.opts.length))}),
  html(def,st){
    const n=def.steps.length;
    let h=`<div class="sentence"><b>${u('yourReply')}</b> ${st.picks.length?st.picks.map((k,s)=>esc(L(def.steps[s].opts[k].t))).join(' '):'<i>…</i>'}</div>`;
    if(st.step<n){
      const stp=def.steps[st.step];
      h+=`<p style="margin-bottom:8px"><b>${esc(L(stp.label))}</b></p><div class="opts">`+st.orders[st.step].map((k,x)=>`<button class="opt" data-act="e" data-a="bd" data-i="${k}"><span class="k">${'ABCD'[x]}</span><span>${esc(L(stp.opts[k].t))}</span></button>`).join('')+'</div>';
      if(st.msg) h+=`<div class="fb ${st.msg.ok?'good':'soft'}"><b class="h">${st.msg.ok?'✅ '+u('right'):'💭 '+u('oops')}</b>${esc(st.msg.t||'')}</div>`;
    } else h+=`<div class="fb good"><b class="h">✅ ${u('right')}</b>${u('buildOk')}</div>`;
    return h;
  },
  act(def,st,a,i){
    if(a!=='bd'||st.step>=def.steps.length) return;
    const o=def.steps[st.step].opts[+i];
    if(o.ok){ st.picks.push(+i); st.step++; st.msg=null; sfx.ok(); }
    else { st.mist++; st.msg={ok:false,t:L(o.why||['','']) }; sfx.no(); }
  },
  status(def,st){ const n=def.steps.length; return st.step>=n ? {ratio:n/(n+st.mist)} : null; }
};

/* mcq (myth/fact, quick quiz) */
E.mcq = {
  init:def=>({i:0,ans:[],correct:0,orders:def.items.map(it=>it.opts.length===2?[0,1]:perm(it.opts.length))}),
  html(def,st){
    const n=def.items.length;
    if(st.i>=n) return `<div class="fb good"><b class="h">✅ ${st.correct}/${n}</b></div>`;
    const it=def.items[st.i], a=st.ans[st.i];
    let h=`<div class="progress"><i style="width:${st.i/n*100}%"></i></div><p style="margin-bottom:10px;font-size:1.1em"><span class="tag">${st.i+1}/${n}</span> ${esc(L(it.q))}</p><div class="opts">`;
    st.orders[st.i].forEach((k,x)=>{
      let cls='opt'; if(a!==undefined){ cls += k===it.ok?' good':(k===a?' soft':' dim'); }
      h+=`<button class="${cls}" data-act="e" data-a="mc" data-i="${k}" ${a!==undefined?'disabled':''}><span class="k">${it.opts.length===2?(k===0?'✗':'✓'):'ABCD'[x]}</span><span>${esc(L(it.opts[k]))}</span></button>`;
    });
    h+='</div>';
    if(a!==undefined){
      h+=`<div class="fb ${a===it.ok?'good':'soft'}"><b class="h">${a===it.ok?'✅ '+u('right'):'💭 '+u('notYet')}</b>${esc(L(it.why))}</div><div class="row"><button class="btn orange" data-act="e" data-a="mn">${st.i===n-1?'✔':u('next')} ➜</button></div>`;
    }
    return h;
  },
  act(def,st,a,i){
    if(a==='mc' && st.ans[st.i]===undefined){ st.ans[st.i]=+i; if(+i===def.items[st.i].ok){st.correct++;sfx.good();} else sfx.no(); }
    if(a==='mn' && st.ans[st.i]!==undefined){ st.i++; sfx.click(); }
  },
  status:(def,st)=> st.i>=def.items.length ? {ratio:st.correct/def.items.length} : null
};

/* ═════════════════════ RENDER ═════════════════════ */
const app = $('#app');

function avHtml(sp){
  if(sp==='me') return `<div class="av"><img src="img/${HEROES[S.hero].img}" alt=""></div>`;
  if(PORT[sp]) return `<div class="av"><img src="img/${PORT[sp][0]}" alt=""></div>`;
  if(EMO[sp]) return `<div class="av">${EMO[sp]}</div>`;
  return '';
}
function nameOf(sp){ if(sp==='me') return heroName(); if(PORT[sp]) return L(PORT[sp][1]); if(UI.sp[sp]) return L(UI.sp[sp]); return ''; }
function linesHtml(lines){
  return lines.map(([sp,t])=>{
    if(sp==='nar') return `<div class="nar">${esc(L(t))}</div>`;
    const role = UI.role[sp] ? ` · ${esc(L(UI.role[sp]))}` : '';
    return `<div class="line ${sp==='me'?'me':''} ${sp==='phone'?'phone':''} ${sp==='unk'||sp==='game'?'unk':''}">${avHtml(sp)}<div class="bub"><b>${esc(nameOf(sp))}${role}</b>${esc(L(t))}</div></div>`;
  }).join('');
}
function castOf(def,lines){
  const out=[]; const add=sp=>{ if(sp&&sp!=='me'&&sp!=='nar'&&!out.includes(sp)&&(PORT[sp]||EMO[sp])) out.push(sp); };
  (def.cast||[]).forEach(add); lines.forEach(l=>add(l[0]));
  return out.slice(0,3);
}
function sceneHtml(def,lines){
  const last=lines[lines.length-1][0], cast=castOf(def,lines);
  const bg=BGNAME[def.bg]||['',''];
  return `<div class="scene" style="background-image:url(img/bg-${def.bg}.jpg)"><span class="place">📍 ${esc(L(bg))}</span>
    <div class="cast">${cast.map(sp=> PORT[sp] ? `<div class="cpt ${last===sp?'talk':''}"><img src="img/${PORT[sp][0]}" alt=""><em>${esc(L(PORT[sp][1]))}</em></div>` : `<div class="cpt emo ${last===sp?'talk':''}">${EMO[sp]}</div>`).join('')}</div>
    <div class="player ${last==='me'?'talk':''}"><img src="img/${HEROES[S.hero].img}" alt="${esc(heroName())}"></div></div>
    <div class="dlg">${linesHtml(lines)}</div>`;
}
function score3(){
  const {t}=totals();
  return '<div class="score3">'+CATS.map(c=>`<span class="chip" title="${esc(u(c))}">${CATEMO[c]} <b>${t[c]}</b></span>`).join('')+`<span class="chip" title="${esc(u('shields'))}">🛡️✨ <b>${S.shields}</b></span><span class="chip" title="${esc(u('stars'))}">⭐ <b>${starCount()}</b></span></div>`;
}
function langSwitch(){
  const on=l=>S.lang===l;
  return `<div class="langsw" role="group" aria-label="${esc(u('langLabel'))}"><button class="btn sm ${on('id')?'on':''}" type="button" data-act="lang" data-l="id" aria-pressed="${on('id')}">🇮🇩 Indonesia</button><button class="btn sm ${on('en')?'on':''}" type="button" data-act="lang" data-l="en" aria-pressed="${on('en')}">🇬🇧 English</button></div>`;
}
/* ───── Back to Games (ENGLISH YO! gallery) ─────
   A plain link: it navigates immediately. It leaves a one-time flag so games.html can play the welcome audio
   (assets/audio/english-yo-welcome.mp3) as the student arrives. Nothing here plays sound or delays navigation. */
const GAMES_URL = 'https://englishyo.my.id/games.html';
const WELCOME_FLAG = 'eyWelcomePending';
function backGamesBtn(){
  return `<a class="btn sm backgames" href="${GAMES_URL}" data-act="backGames">🎮 ${u('backGames')}</a>`;
}

function bar(){
  return `<div class="bar">${S.view!=='home'?`<button class="btn sm" data-act="go" data-v="home">🏠 ${u('home')}</button>${backGamesBtn()}<span class="brandmini">${u('gameTitle')}</span>`:''}<span class="grow"></span>
    ${langSwitch()}
    <button class="btn sm" data-act="snd" aria-label="${S.sound?u('soundOn'):u('soundOff')}">${S.sound?'🔊':'🔇'}</button></div>`;
}
function foot(){
  return `<footer class="foot"><button class="aboutlink" type="button" data-act="about">${u('about')}</button></footer>`;
}
/* About popup: lives on <body>, so it survives re-renders and re-translates on language change */
function aboutHtml(){
  return `<div class="about-card"><button class="about-x" type="button" data-act="aboutClose" aria-label="${esc(u('aboutClose'))}">✕</button>
    <h2 id="aboutTitle">${u('about')}</h2>
    <p class="aboutgame">${u('gameTitle')}</p><p><i>${u('tagline')}</i></p>
    <p><b>${u('dev')}</b></p><p class="aboutbrand">ENGLISH YO!</p><p>${u('refBnn')}</p><p class="disc">${u('disc')}</p></div>`;
}
function syncAbout(){
  let m=document.getElementById('aboutModal');
  if(!aboutOpen){ if(m) m.remove(); return; }
  if(!m){ m=document.createElement('div'); m.id='aboutModal'; m.className='about-backdrop'; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-labelledby','aboutTitle'); document.body.appendChild(m); }
  m.innerHTML=aboutHtml();
}
function openAbout(){ aboutOpen=true; MZ.clearKeys(); syncAbout(); const x=document.querySelector('#aboutModal .about-x'); if(x) x.focus(); }
function closeAbout(){ aboutOpen=false; syncAbout(); }

/* ───── Home ───── */
function viewHome(){
  return `<div class="view">
  <div class="bar">${backGamesBtn()}</div>
  <div class="brand-row"><img class="logo-ey" src="img/logo-englishyo.png" alt="ENGLISH YO!"><div class="logo-tile"><img src="img/logo-bnn.png" alt="Badan Narkotika Nasional Republik Indonesia (BNN RI)"></div></div>
  <section class="hero">
    <h1 class="title"><span class="a">THE</span><span class="b">BRAVE WAY</span></h1>
    <div class="subtitle">${u('tagline')}</div>
    <label class="namebox"><span>👤 ${u('nameLabel')}</span><input id="playerName" class="field" maxlength="24" autocomplete="off" value="${esc(S.player)}" placeholder="${esc(u('namePh2'))}"></label>
    <p id="nameMsg" class="fb soft namemsg" hidden>💭 ${u('nameNeed')}</p>
    <p class="pick-label">${u('pickHero')}</p>
    <div class="heroes">${Object.keys(HEROES).map(h=>`<button class="hero-pick ${S.hero===h?'on':''}" data-act="hero" data-h="${h}" aria-label="${HEROES[h].n}"><img src="img/${HEROES[h].img}" alt=""><span>${HEROES[h].n}</span></button>`).join('')}</div>
    <div class="main-btns"><button class="btn big blue" data-act="play">🎮 ${u('play')}</button><button class="btn big yellow" data-act="go" data-v="learn">📚 ${u('learn')}</button></div>
    <div class="sub-btns"><button class="btn sm" data-act="go" data-v="ach">🏆 ${u('ach')}</button><button class="btn sm" data-act="go" data-v="how">❓ ${u('how')}</button>${langSwitch()}<button class="btn sm" data-act="snd">${S.sound?'🔊 '+u('soundOn'):'🔇 '+u('soundOff')}</button></div>
  </section>${foot()}</div>`;
}

/* ───── Levels (PLAY GAME) ───── */
function viewLevels(){
  const nodes=LV.map(l=>{
    const done=lvDone(l.id), un=lvUnlocked(l.id), r=S.lv[l.id];
    return `<button class="node ${done?'done':''} ${un?'':'lockd'}" data-act="lvi" data-id="${l.id}" ${un?'':'disabled'}><span class="num">${l.id}</span><span><h3>${esc(L(l.title))}</h3><small>${esc(L(l.focus))}</small><small class="stars">${done?`✅ ${levelPts(l.id)}/${lvMax(l.id)} · ⭐ ${(r.mapStars||0)+(r.encStars||0)}`:un?(S.mz&&S.mz.lv===l.id?'▶ '+u('cont'):'▶ '+u('start')):'🔒 '+u('lockedLevel')}</small></span><img src="${badgeImg(l.badge)}" alt="" style="${badgeOwned(l)?'':'filter:grayscale(1);opacity:.45'}"></button>`;
  }).join('');
  return `<div class="view">${bar()}
  <div class="mapwrap"><div class="maptitle"><h2>🗺️ ${u('gameTitle')}</h2><p><b>${u('tagline')}</b> ${u('levelsHint')}</p></div>
  <div class="mapgrid"><svg class="mapsvg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 80 C14 40 26 36 34 44 S52 76 58 70 S80 36 88 40 S94 66 92 82" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 2.2" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:6px"/></svg>${nodes}</div>
  <div class="mapfoot">${score3()}<button class="btn" data-act="go" data-v="map">⭐ ${u('bonus')} (${bonusDone()}/5)</button><button class="btn yellow" data-act="go" data-v="learn">📚 ${u('learn')}</button>${allLevels()?`<button class="btn big green" data-act="go" data-v="final">🏆 ${u('seeFinal')}</button>`:''}</div></div>${foot()}</div>`;
}
function viewLvIntro(){
  const l=LV.find(x=>x.id===S.cl), resume=S.mz&&S.mz.lv===l.id, done=lvDone(l.id);
  return `<div class="view">${bar()}<div class="card" style="margin-bottom:14px"><span class="tag">${u('level')} ${l.id}/5</span><h2 style="font-size:clamp(1.7rem,4vw,2.6rem);color:var(--royal);margin:8px 0">${esc(L(l.title))}</h2>
  <p style="font-size:1.1em"><b>🎯 ${u('objective')}:</b> ${esc(L(l.obj))}</p><p style="margin-top:6px"><b>📘</b> ${esc(L(l.focus))}</p>
  <div class="how3"><div>🗝️ <b>1.</b> ${u('win1')}</div><div>👾 <b>2.</b> ${u('win2')}</div><div>🚪 <b>3.</b> ${u('win3')}</div></div>
  <p class="disc" style="margin-top:8px">🎮 ${u('controls')}</p></div>
  <div class="card" style="margin-bottom:14px"><h3 style="margin-bottom:8px">👾 ${u('meetNpc')}</h3><div class="npc-row">${l.npcs.map(n=>`<div class="npc-card"><img src="img/m-npc-${n.type}.png" alt=""><b>${esc(L(D.npcNames[n.type]))}</b><small>${esc(L(D.npcRole[n.type]))}</small></div>`).join('')}</div></div>
  <div class="row" style="justify-content:center"><button class="btn big blue" data-act="lvs" data-id="${l.id}" ${resume?'':'data-fresh="1"'}>${resume?'▶ '+u('cont'):done?'🔁 '+u('replayLevel'):'▶ '+u('start')}</button>${resume?`<button class="btn" data-act="lvs" data-id="${l.id}" data-fresh="1">🔁 ${u('startOver')}</button>`:''}<button class="btn teal" data-act="learnMod" data-id="${l.mod}">📚 ${u('openLearn')}</button><button class="btn" data-act="go" data-v="levels">🗺️ ${u('levelsBtn')}</button></div>${foot()}</div>`;
}
function viewMaze(){
  const l=LV.find(x=>x.id===(S.mz?S.mz.lv:S.cl)) || LV[0];
  return `<div class="view">${bar()}
  <div class="hud"><button class="btn sm" data-act="go" data-v="levels">🗺️ ${u('levelsBtn')}</button><span class="chip">👤 ${esc(S.player||heroName())}</span><span class="chip">🧭 ${u('level')} ${l.id}: ${esc(L(l.title))}</span><span class="grow"></span>
   <span class="chip" title="${u('stars')}">⭐ <b id="mzStars">0/0</b></span><span class="chip" title="${u('keyT')}">🗝️ <b id="mzKey">⬜</b></span><span class="chip" title="${u('npcT')}">👾 <b id="mzEnc">0/0</b></span><span class="chip" title="EXIT">🚪 <b id="mzGate">🔒</b></span><span class="chip" title="${u('shields')}">🛡️✨ <b>${S.shields}</b></span></div>
  <p class="objbar">🎯 ${esc(L(l.obj))}</p>
  <div class="mzwrap"><canvas id="mzCanvas" aria-label="${u('mazeLabel')}"></canvas></div>
  <div class="dpad" aria-label="${u('dpad')}"><button class="dir up" data-dir="up" aria-label="↑">▲</button><button class="dir left" data-dir="left" aria-label="←">◀</button><button class="dir down" data-dir="down" aria-label="↓">▼</button><button class="dir right" data-dir="right" aria-label="→">▶</button></div>
  <p class="disc center">🎮 ${u('controls')}</p>
  <div id="mzModal"></div>${foot()}</div>`;
}
function viewLvDone(){
  const r=S.lvres, l=LV.find(x=>x.id===r.lv), own=badgeOwned(l), nextL=LV.find(x=>x.id===l.id+1);
  return `<div class="view">${bar()}<div class="card center" style="max-width:780px;margin:12px auto"><h2 style="font-size:clamp(2rem,5vw,3rem);color:var(--green)">🎉 ${u('levelDone')}</h2>
  <p style="font-size:1.2rem">${u('level')} ${l.id}: ${esc(L(l.title))}</p>
  <div style="margin:10px 0"><img class="bigbadge" src="${badgeImg(l.badge)}" alt="" style="${own?'':'filter:grayscale(1);opacity:.5'}"></div>
  <h3>${own?'🏅 '+u('badgeUnlocked'):'🔒 '+u('badgeLocked')}</h3><p><b>${esc(L(D.badgeNames[l.badge]))}</b></p>
  <div class="stat3" style="margin:14px 0"><div class="card"><b>⭐ ${r.stars}/${r.totalStars}</b>${u('starsMap')}</div><div class="card"><b>👾 ${r.npcs}/${r.npcs}</b>${u('npcT')}</div><div class="card"><b>🗝️ ✅</b>${u('keyT')}</div></div>
  <p style="font-size:1.2rem">${u('mazePts')}: <b>${levelPts(l.id)}/${lvMax(l.id)}</b> · ⭐ ${r.encStars} · ${u('slips')}: ${r.wrong}</p>
  <div class="row" style="justify-content:center"><button class="btn" data-act="go" data-v="levels">🗺️ ${u('levelsBtn')}</button><button class="btn" data-act="lvs" data-id="${l.id}" data-fresh="1">🔁 ${u('replayLevel')}</button>
  ${allLevels()?`<button class="btn big green" data-act="go" data-v="final">🏆 ${u('seeFinal')}</button>`:nextL?`<button class="btn big blue" data-act="lvi" data-id="${nextL.id}">${u('nextLevel')} ➜</button>`:''}</div></div>${foot()}</div>`;
}

/* ───── Bonus challenges (the 25 story scenarios) ───── */
function viewMap(){
  const nodes=D.missions.map(m=>{
    const done=missionDone(m.id), pts=missionPts(m.id), n=Object.keys(S.scores).filter(k=>k.startsWith(m.id+'-')).length;
    return `<button class="node ${done?'done':''}" data-act="om" data-m="${m.id}"><span class="num">${m.id}</span><span><h3>${m.icon} ${esc(L(m.title))}</h3><small>${esc(L(m.place))}</small><small class="stars">${done?'✅ '+pts+'/100':n+'/5'}</small></span></button>`;
  }).join('');
  return `<div class="view">${bar()}
  <div class="mapwrap"><div class="maptitle"><h2>⭐ ${u('mapTitle')}</h2><p>${u('mapHint')}</p></div>
  <div class="mapgrid"><svg class="mapsvg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 80 C14 40 26 36 34 44 S52 76 58 70 S80 36 88 40 S94 66 92 82" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="3 2.2" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:6px"/></svg>${nodes}</div>
  <div class="mapfoot">${score3()}<button class="btn big blue" data-act="go" data-v="levels">🗺️ ${u('levelsBtn')}</button></div></div>${foot()}</div>`;
}

/* ───── Bonus mission intro ───── */
function viewIntro(){
  const m=mission(S.cm), done=missionDone(m.id), started=Object.keys(S.scores).some(k=>k.startsWith(m.id+'-'));
  return `<div class="view">${bar()}<div class="intro">
   <div class="pic" style="background-image:url(img/bg-${m.bg}.jpg)"><div class="player" style="position:absolute;right:10px;bottom:0;height:88%"><img src="img/${HEROES[S.hero].img}" alt="" style="height:100%"></div></div>
   <div class="card"><span class="tag">⭐ ${u('bonus')} · ${u('mission')} ${m.id}/5</span><h2 style="font-size:clamp(1.7rem,4vw,2.5rem);margin:8px 0;color:var(--royal)">${m.icon} ${esc(L(m.title))}</h2>
   <p>${esc(L(m.intro))}</p><p style="margin-top:8px"><b>📍 ${u('setting')}:</b> ${esc(L(m.place))}</p>
   <p style="margin:8px 0"><b>🎮 ${u('howPlayed')}:</b> ${m.mech.map(x=>`<span class="tag">${esc(L(x))}</span>`).join(' ')}</p>
   <div class="row"><button class="btn big blue" data-act="ms" data-m="${m.id}">${done?'🔁 '+u('replayMission'):started?'▶ '+u('cont'):'▶ '+u('start')}</button><button class="btn teal" data-act="learnMod" data-id="${m.mod}">📚 ${u('openLearn')}</button><button class="btn" data-act="go" data-v="map">⭐ ${u('map')}</button></div></div></div>${foot()}</div>`;
}

/* ───── Scene ───── */
function curDef(){ return sceneDef(S.cur.m,S.cur.i); }
function viewScene(){
  const c=S.cur, m=mission(c.m), def=curDef(), eng=E[def.type], st=c.st, k=key(c.m,c.i);
  const lines = eng.lines ? eng.lines(def,st) : def.lines;
  const q = eng.q ? eng.q(def,st) : L(def.q);
  const dots = m.scenes.map((_,i)=>`<i class="${S.scores[key(m.id,i)]?'done':''} ${i===c.i?'on':''}"></i>`).join('');
  const res = c.res;
  const modTitle = L(D.modules.find(x=>x.id===(def.mod||m.mod)).title);
  let h=`<div class="view">${bar()}
  <div class="hud"><button class="btn sm" data-act="go" data-v="map">🗺️ ${u('map')}</button><span class="chip">${m.icon} ${u('mission')} ${m.id}</span><div class="dots" aria-label="${u('scenario')} ${c.i+1}/5">${dots}</div><span class="grow"></span>${score3()}</div>
  <h2 style="font-size:clamp(1.3rem,3vw,1.9rem);margin:0 0 8px;color:var(--royal)">${esc(L(m.title))} · ${u('scenario')} ${c.i+1}/5: ${esc(L(def.title))}</h2>
  ${sceneHtml(def,lines)}
  <div class="card decide"><h3>🤔 ${esc(q)}</h3><div id="interact">${eng.html(def,st)}</div></div>`;
  h+=`<div class="tools"><button class="btn sm yellow" data-act="hint">💡 ${S.hints[k]?u('hintShown'):u('hint')} (🛡️ ${S.shields})</button><button class="btn sm teal" data-act="learnMod" data-id="${def.mod||m.mod}">📚 ${u('openLearn')}: ${esc(modTitle)}</button></div>`;
  if(S.hints[k]) h+=`<div class="hintbox">💡 <b>${u('hintShown')}:</b> ${esc(L(def.hint))}</div>`;
  if(c.noShield) h+=`<div class="hintbox">🛡️ ${u('noShield')}</div>`;
  if(res){
    const cat=def.cat, stars=Math.floor(res.eff/10);
    h+=`<div class="result"><div class="big-pts">+${res.eff} ${esc(u(cat))}</div><div class="starz">${'⭐'.repeat(stars)}${'☆'.repeat(2-stars)}</div>
    <p><b>${res.eff>=20?u('goodJob'):res.eff>=10?u('goodJob'):u('niceTry')}</b></p>${c.attempt>0?`<p class="disc">${u('tryNote')}</p>`:''}
    <div class="note">💡 <b>${u('takeaway')}:</b> ${esc(L(def.note))}</div>
    <div class="row" style="justify-content:center">${res.eff<20?`<button class="btn orange" data-act="retry">🔄 ${u('retry')}</button>`:''}<button class="btn big blue" data-act="nx">${u('next')} ➜</button></div></div>`;
  }
  return h+foot()+'</div>';
}
function newScene(m,i){
  const def=sceneDef(m,i);
  S.cur={m,i,st:E[def.type].init(def),attempt:0,res:null,noShield:false};
  S.view='scene';
}
function afterAct(){
  const c=S.cur, def=curDef(); if(c.res) return;
  const r=E[def.type].status(def,c.st); if(!r) return;
  const pts = r.pts!==undefined ? r.pts : ratioToPts(r.ratio);
  const eff = c.attempt>0 ? Math.min(pts,10) : pts;
  c.res={pts,eff};
  const k=key(c.m,c.i), prev=S.scores[k];
  if(!prev || eff>prev.pts) S.scores[k]={pts:eff,cat:def.cat};
  if(eff>=10) setTimeout(sfx.star,350);
  checkAch();
}

/* ───── Surprise challenge ───── */
function startSurprise(m,next){
  S.sur={m,next,list:perm(D.surprise.length).slice(0,3),idx:0,ans:null,ok:0}; S.view='surprise';
}
function viewSurprise(){
  const s=S.sur, n=s.list.length;
  let h=`<div class="view">${bar()}<div class="card center" style="max-width:720px;margin:20px auto"><h2 style="color:var(--orange);font-size:2rem">⚡ ${u('surpriseT')}</h2>`;
  if(s.idx>=n){
    h+=`<p style="font-size:1.3rem;margin:12px 0">${u('surpriseDone')}: <b>+${s.ok}</b> ⭐</p><div class="row" style="justify-content:center"><button class="btn big blue" data-act="snext">${u('next')} ➜</button></div>`;
  } else {
    const it=D.surprise[s.list[s.idx]];
    h+=`<div class="progress"><i style="width:${s.idx/n*100}%"></i></div><p class="tag">${s.idx+1}/${n}</p><p style="font-size:clamp(1.2rem,3vw,1.7rem);margin:14px 0">${esc(L(it[0]))}</p><p style="margin-bottom:12px">${u('surpriseQ')}</p>`;
    if(s.ans===null) h+=`<div class="main-btns"><button class="btn big green" data-act="sans" data-v="1">${u('safe')}</button><button class="btn big orange" data-act="sans" data-v="0">${u('unsafe')}</button></div><button class="btn sm" data-act="snext">${u('skip')} ➜</button>`;
    else { const ok=(s.ans===1)===it[1]; h+=`<div class="fb ${ok?'good':'soft'}"><b class="h">${ok?'✅ '+u('right'):'💭 '+u('oops')}</b>${it[1]?u('safe'):u('unsafe')}</div><div class="row" style="justify-content:center"><button class="btn big blue" data-act="sstep">${u('next')} ➜</button></div>`; }
  }
  return h+'</div>'+foot()+'</div>';
}

/* ───── Bonus mission complete ───── */
function viewComplete(){
  const m=mission(S.compM), pts=missionPts(m.id);
  const nextM = D.missions.find(x=>x.id>m.id && !missionDone(x.id)) || D.missions.find(x=>!missionDone(x.id));
  return `<div class="view">${bar()}<div class="card center" style="max-width:760px;margin:12px auto"><h2 style="font-size:clamp(2rem,5vw,3rem);color:var(--green)">🎉 ${u('missionDone')}</h2>
  <p style="font-size:1.2rem">${m.icon} ${esc(L(m.title))}</p><div style="font-size:4.5rem;margin:6px 0">🌟</div>
  <p style="margin:10px 0;font-size:1.3rem">${u('missionPts')}: <b>${pts}/100</b></p>
  <div class="row" style="justify-content:center"><button class="btn" data-act="go" data-v="map">⭐ ${u('map')}</button><button class="btn" data-act="go" data-v="levels">🗺️ ${u('levelsBtn')}</button>
  ${nextM?`<button class="btn big blue" data-act="om" data-m="${nextM.id}">${u('nextMission')} ➜</button>`:''}</div></div>${foot()}</div>`;
}

/* ───── Learn: menu ───── */
function viewLearn(){
  return `<div class="view">${bar()}<div class="card" style="margin-bottom:14px"><h2 style="font-size:clamp(1.7rem,4vw,2.6rem);color:var(--royal)">📚 ${u('learnTitle')}</h2><p style="margin:6px 0 10px">${u('learnIntro')}</p>${score3()}</div>
  <div class="lgrid">${D.modules.map(m=>`<button class="mcard ${S.mods[m.id]?'done':''}" data-act="learnMod" data-id="${m.id}" data-from="menu"><span class="em">${m.icon}</span><span class="tag">${u('module')} ${m.id}</span><h3>${esc(L(m.title))}</h3><p>${esc(L(m.blurb))}</p><b>${S.mods[m.id]?'✅ '+u('done'):'🛡️✨ +2'}</b></button>`).join('')}
  <button class="mcard" data-act="go" data-v="corner"><span class="em">🌿</span><span class="tag">LEARN YO!</span><h3>${esc(L(D.corner.title))}</h3><p><b>${D.corner.theme}</b><br>${esc(L(D.corner.themeGloss))}</p><p>${u('cornerCard')}</p><b>${u('cornerOpen')} ➜</b></button></div>${foot()}</div>`;
}

/* ───── Cocurricular Corner ───── */
const projOpen = new Set();
function viewCorner(){
  const C=D.corner;
  const proj=C.projects.map((p,pi)=>`<details class="card proj" data-proj="${pi}" ${projOpen.has(pi)?'open':''}><summary><span class="em">${p.e}</span> <b>${esc(L(p.t))}</b><small>${esc(L(p.d))}</small></summary>
    <h4>${esc(L(C.stepsLabel))}</h4><ol>${p.steps.map(x=>`<li>${esc(L(x))}</li>`).join('')}</ol>
    <h4>${esc(L(C.checkLabel))}</h4><ul class="checklist">${p.check.map(x=>`<li>☐ ${esc(L(x))}</li>`).join('')}</ul></details>`).join('');
  const rub=`<div class="rubwrap"><table class="rubric"><thead><tr><th>${esc(L(C.rubricCrit))}</th>${C.levels.map(l=>`<th>${esc(L(l))}</th>`).join('')}</tr></thead><tbody>${C.rubric.map(r=>`<tr><th scope="row">${esc(L(r.c))}</th>${r.lv.map(x=>`<td>${esc(L(x))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  return `<div class="view">${bar()}
  <div class="hud"><button class="btn sm" data-act="go" data-v="learn">↩ ${u('backToLearn')}</button></div>
  <div class="card" style="margin-bottom:14px"><span class="tag">📚 LEARN YO!</span><h2 style="font-size:clamp(1.7rem,4vw,2.6rem);color:var(--royal);margin:8px 0 2px">🌿 ${esc(L(C.title))}</h2>
   <p class="themeline">${C.theme}</p><p class="disc">${esc(L(C.themeGloss))}</p><p style="margin-top:8px">${esc(L(C.intro))}</p></div>
  <h3 class="sech">${esc(L(C.linksTitle))}</h3>
  <div class="lgrid">${C.links.map(l=>`<div class="mcard"><span class="em">${l.e}</span><h3>${esc(L(l.t))}</h3><p>${esc(L(l.d))}</p><button class="btn sm teal" data-act="learnMod" data-id="${l.mod}">📚 ${u('openLearn')}</button></div>`).join('')}</div>
  <h3 class="sech">🎓 ${esc(L(C.dplTitle))}</h3><p style="margin-bottom:10px">${esc(L(C.dplIntro))}</p>
  <div class="lgrid">${C.dpl.map(x=>`<div class="mcard"><span class="em">${x.e}</span><h3>${esc(L(x.n))}</h3><p>${esc(L(x.d))}</p></div>`).join('')}</div>
  <h3 class="sech">🚀 ${esc(L(C.projTitle))}</h3><p style="margin-bottom:8px">${esc(L(C.projIntro))}</p><p class="note">🔒 ${esc(L(C.privacy))}</p>
  <div class="projlist">${proj}</div>
  <div class="card" style="margin-top:12px"><h4>📝 ${esc(L(C.reflectTitle))}</h4><ol>${C.reflect.map(x=>`<li>${esc(L(x))}</li>`).join('')}</ol></div>
  <h3 class="sech">👩‍🏫 ${esc(L(C.rubricTitle))}</h3><p class="disc" style="margin-bottom:8px">${esc(L(C.rubricNote))}</p>${rub}
  ${foot()}</div>`;
}

/* ───── Learn: module ───── */
function modDef(){ return D.modules.find(x=>x.id===S.mod.id); }
function openModule(id,from){ S.mod={id,from,phase:'goals',card:0,a:0,st:null,ratios:[]}; S.view='module'; }
function viewModule(){
  const md=S.mod, m=modDef(), nC=m.cards.length, nA=m.acts.length;
  const back = md.from==='scene' ? `<button class="btn sm orange" data-act="mback">↩ ${u('backToScene')}</button>` : md.from==='maze' ? `<button class="btn sm orange" data-act="mback">↩ ${u('backToMaze')}</button>` : md.from==='corner' ? `<button class="btn sm orange" data-act="mback">↩ ${u('backToCorner')}</button>` : `<button class="btn sm" data-act="mback">↩ ${u('backToMenu')}</button>`;
  let body='';
  const head=`<div class="hud">${back}<span class="chip">${m.icon} ${u('module')} ${m.id}</span><span class="grow"></span>${score3()}</div><h2 style="font-size:clamp(1.4rem,3.2vw,2.1rem);color:var(--royal);margin-bottom:8px">${esc(L(m.title))}</h2>`;
  if(md.phase==='goals'){
    body=`<div class="card"><h3 style="margin-bottom:8px">🎯 ${u('objectives')}</h3><ul class="sum">${m.goals.map(g=>`<li>${esc(L(g))}</li>`).join('')}</ul><div class="row"><button class="btn big blue" data-act="mstart">${u('start')} ➜</button></div></div>`;
  } else if(md.phase==='cards'){
    const c=m.cards[md.card];
    let inner=`<span class="em">${c.e}</span><h3>${esc(L(c.t))}</h3><p>${esc(L(c.d))}</p>`;
    if(c.phrases) inner+=`<div class="phr">${m.phrases.map(p=>`<div>🗨️ <b>${esc(L(p[0]))}</b></div>`).join('')}</div>`;
    else if(c.x) inner+=`<div class="example"><small>💡 ${u('example')}</small>${esc(L(c.x))}</div>`;
    body=`<div class="progress"><i style="width:${(md.card+1)/nC*100}%"></i></div><div class="card lcard">${inner}</div>
    <div class="row" style="justify-content:space-between"><button class="btn" data-act="mcard" data-d="-1" ${md.card===0?'disabled':''}>⬅ ${u('prevCard')}</button><span class="tag">${u('card')} ${md.card+1}/${nC}</span>${md.card<nC-1?`<button class="btn blue" data-act="mcard" data-d="1">${u('nextCard')} ➡</button>`:`<button class="btn green" data-act="mact">${u('toActivity')} ➜</button>`}</div>`;
  } else if(md.phase==='act'){
    const act=m.acts[md.a], eng=E[act.type];
    const r=eng.status(act,md.st);
    body=`<div class="card"><span class="tag">${u('activity')} ${md.a+1}/${nA}</span><h3 style="margin:8px 0">${esc(L(act.title))}</h3>
      ${act.lines?`<div class="dlg" style="border:var(--line);border-radius:18px;margin-bottom:12px">${linesHtml(act.lines)}</div>`:''}
      ${act.q?`<p style="margin-bottom:10px"><b>${esc(L(act.q))}</b></p>`:''}
      <div id="interact">${eng.html(act,md.st)}</div>
      ${r?`<div class="row" style="justify-content:center">${(r.ratio!==undefined&&r.ratio<1)?`<button class="btn orange" data-act="mretry">🔄 ${u('retry')}</button>`:''}<button class="btn big blue" data-act="mnext">${md.a<nA-1?u('nextAct'):u('summary')} ➜</button></div>`:''}</div>`;
  } else {
    const first = !!md.earned;
    const rel = D.missions.find(x=>x.mod===m.id)||D.missions[0];
    body=`<div class="card center"><div style="font-size:3.4rem">🎉</div><h3 style="font-size:1.8rem;color:var(--green)">${u('summary')}</h3><ul class="sum" style="text-align:left;max-width:640px;margin:10px auto">${m.sum.map(s=>`<li>${esc(L(s))}</li>`).join('')}</ul>
    <p class="note" style="text-align:center">🛡️✨ <b>${first?u('earned'):u('alreadyEarned')}</b></p>
    <div class="row" style="justify-content:center">${back.replace('btn sm','btn')}<button class="btn blue" data-act="play">🎮 ${u('toMission')}</button><button class="btn" data-act="mrestart">🔁 ${u('replay')}</button></div></div>`;
  }
  return `<div class="view">${bar()}${head}${body}${foot()}</div>`;
}
function afterModAct(){
  const md=S.mod, act=modDef().acts[md.a], r=E[act.type].status(act,md.st);
  if(r && md.ratios[md.a]===undefined) md.ratios[md.a]=r.ratio;
}

/* ───── Achievements ───── */
function viewAch(){
  return `<div class="view">${bar()}<div class="card" style="margin-bottom:14px"><h2 style="font-size:clamp(1.7rem,4vw,2.6rem);color:var(--royal)">🏆 ${u('achTitle')}</h2>${score3()}</div>
  <h3 style="margin:10px 0">${u('badges')}</h3><div class="agrid">${LV.map(l=>{const own=badgeOwned(l);return `<div class="ach ${own?'':'lock'}"><img src="${badgeImg(l.badge)}" alt=""><h4>${esc(L(D.badgeNames[l.badge]))}</h4><small>${u('level')} ${l.id}: ${esc(L(l.title))}</small><small>${own?'✅ '+u('unlocked'):'🔒 '+u('locked')}</small>${lvUnlocked(l.id)?`<button class="btn sm" style="margin-top:6px" data-act="lvi" data-id="${l.id}">${lvDone(l.id)?'🔁 '+u('replayLevel'):'▶ '+u('start')}</button>`:''}</div>`}).join('')}</div>
  <h3 style="margin:14px 0 10px">${u('extras')}</h3><div class="agrid">${D.extraAch.map(a=>`<div class="ach ${S.ach[a.id]?'':'lock'}"><div class="em">${a.e}</div><h4>${esc(L(a.t))}</h4><small>${esc(L(a.d))}</small></div>`).join('')}</div>
  <div class="row" style="justify-content:center;margin-top:18px"><button class="btn" data-act="reset">🗑️ ${u('reset')}</button></div>${foot()}</div>`;
}

/* ───── How to play ───── */
function viewHow(){
  return `<div class="view">${bar()}<div class="card" style="margin-bottom:14px"><h2 style="font-size:clamp(1.7rem,4vw,2.6rem);color:var(--royal)">❓ ${u('howTitle')}</h2><p>${u('savedNote')}</p></div>
  <div class="how">${D.howSteps.map((s,i)=>`<div class="card"><span class="n">${i+1}</span><span class="em">${s[0]}</span><span>${esc(L(s[1]))}</span></div>`).join('')}</div>
  <div class="row" style="justify-content:center;margin-top:16px"><button class="btn big blue" data-act="play">🎮 ${u('play')}</button><button class="btn big yellow" data-act="go" data-v="learn">📚 ${u('learn')}</button></div>${foot()}</div>`;
}

/* ───── Final ───── */
function certHtml(){
  const {t}=totals(), tot=t.safety+t.voice+t.empathy;
  const nm = (S.certName||S.player||'').trim();
  return `<div class="cert" id="certbox"><img class="cl" src="img/logo-englishyo.png" alt="ENGLISH YO!"><p class="certgame">${u('gameTitle')} · ${u('tagline')}</p><h2>${u('certTitle')}</h2><p>${u('certPre')}</p><div class="nm" id="certName">${esc(nm)||'&nbsp;'}</div>
  <p class="certfor">${u('certFor')}</p><p><b>${u('champ')}</b></p><div class="bs">${LV.map(l=>`<img src="${badgeImg(l.badge)}" alt="">`).join('')}</div>
  <p>🛡️ ${t.safety} · 📣 ${t.voice} · 💛 ${t.empathy} · <b>${u('total')}: ${tot}</b> · ⭐ ${starCount()}</p>
  <div class="dpl"><b class="dplh">${u('dplHead')}</b><span class="dplsub">${u('dplSub')}</span><div class="dplchips">${D.dplCert.map(x=>`<span>${esc(L(x))}</span>`).join('')}</div><span class="dpltheme">${u('dplTheme')}</span></div>
  <p class="disc" style="margin-top:8px">${u('certNote')}</p>
  <p class="disc" style="margin-top:8px">${u('dev')} — ENGLISH YO! · ${u('refBnn')}</p></div>`;
}
function viewFinal(){
  const {t,m,b,mx,bmx}=totals(), tot=t.safety+t.voice+t.empathy;
  const bonusT=b.safety+b.voice+b.empathy, bonusM=bmx.safety+bmx.voice+bmx.empathy;
  const bar3=c=>`<div class="card"><span style="font-size:1.6rem">${CATEMO[c]}</span><b>${m[c]}<small style="font-size:.9rem">/${mx[c]}</small></b>${esc(u(c))}<div class="meter"><i style="width:${m[c]/mx[c]*100}%;background:${c==='safety'?'#1456d8':c==='voice'?'#ff8a1f':'#ff5c93'}"></i></div></div>`;
  return `<div class="view">${bar()}<div class="card center" style="margin-bottom:14px"><img class="bigbadge" src="${badgeImg('champion')}" alt=""><h1 style="font-size:clamp(2.2rem,6vw,4rem);color:var(--orange)">${u('finalTitle')}</h1><h2 style="font-size:clamp(1.3rem,3.4vw,2.2rem);color:var(--royal)">${u('finalSub')}</h2>
  <p style="margin-top:6px"><b>👤 ${esc(S.player||heroName())}</b></p>
  <div class="stat3">${CATS.map(bar3).join('')}</div>
  <p style="font-size:1.1rem">${u('mazePts')}: <b>${m.safety+m.voice+m.empathy}/${mx.safety+mx.voice+mx.empathy}</b> · ${u('bonusPts')}: <b>${bonusT}/${bonusM}</b></p>
  <p style="font-size:1.2rem">${u('total')}: <b>${tot}</b> · ⭐ ${starCount()} · ${u('completed')}: ${levelsDone()}/5</p>
  <p style="margin:8px 0"><b>${u('badgesGot')}:</b></p><div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap">${LV.map(l=>`<img src="${badgeImg(l.badge)}" alt="${esc(L(D.badgeNames[l.badge]))}" style="height:64px;${badgeOwned(l)?'':'filter:grayscale(1);opacity:.4'}">`).join('')}</div></div>
  <div class="card" style="margin-bottom:14px"><label><b>${u('certName')}</b><input id="nameInput" class="field" maxlength="40" value="${esc(S.certName||S.player)}" placeholder="${u('namePh')}" style="margin-top:6px"></label></div>
  ${certHtml()}
  <div class="row" style="justify-content:center"><button class="btn big blue" data-act="dl">⬇️ ${u('download')}</button><button class="btn big yellow" data-act="pr">🖨️ ${u('print')}</button></div>
  <div class="card refl" style="margin-top:16px"><h3>📝 ${u('reflect')}</h3>${[1,2,3].map(n=>`<label>${n}. ${u('r'+n)}<textarea class="field" data-refl="${n-1}">${esc(S.refl[n-1]||'')}</textarea></label>`).join('')}</div>
  <div class="card center" style="margin-top:16px;background:linear-gradient(135deg,#1456d8,#0c3ba6);color:#fff"><h2 style="font-size:clamp(1.3rem,3.4vw,2.2rem)">“${u('finalMsg')}”</h2></div>
  <div class="row" style="justify-content:center"><button class="btn" data-act="go" data-v="levels">🗺️ ${u('levelsBtn')}</button><button class="btn" data-act="go" data-v="map">⭐ ${u('bonus')}</button><button class="btn orange" data-act="reset">🔁 ${u('playAgain')}</button></div>${foot()}</div>`;
}
function downloadCert(){
  const W=1600, cv=document.createElement('canvas'); cv.width=W; cv.height=2200; let g=cv.getContext('2d');
  const {t}=totals(), tot=t.safety+t.voice+t.empathy;
  const load=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src;});
  const F1='"Baloo 2",Trebuchet MS,sans-serif', F2='Nunito,Segoe UI,sans-serif';
  const wrap=(txt,font,maxW)=>{ g.font=font; const out=[]; let line=''; txt.split(' ').forEach(w=>{ const tt=line?line+' '+w:w; if(g.measureText(tt).width>maxW&&line){ out.push(line); line=w; } else line=tt; }); if(line) out.push(line); return out; };
  Promise.all([load('img/logo-englishyo.png'),...LV.map(l=>load(badgeImg(l.badge)))]).then(([logo,...bs])=>{
    // layout pass: the certificate grows downward to make room for the DPL section
    const forLines=wrap(u('certFor'),'700 34px '+F2,1180), forEnd=585+(forLines.length-1)*46;
    const champY=forEnd+72, badgesTop=champY+36, scoreY=badgesTop+130+75, dplTop=scoreY+45, dplBottom=dplTop+275;
    const noteY=dplBottom+62, devY=noteY+52, refY=devY+40, H=refY+78;
    cv.height=H; g=cv.getContext('2d');
    const gr=g.createLinearGradient(0,0,W,H); gr.addColorStop(0,'#fffdf0'); gr.addColorStop(1,'#e2f3ff'); g.fillStyle=gr; g.fillRect(0,0,W,H);
    g.strokeStyle='#0c3ba6'; g.lineWidth=14; g.strokeRect(36,36,W-72,H-72); g.lineWidth=4; g.strokeRect(62,62,W-124,H-124);
    const ctr=(txt,y,font,col)=>{g.font=font;g.fillStyle=col;g.textAlign='center';g.fillText(txt,W/2,y)};
    if(logo){ const h=130,w=logo.width/logo.height*h; g.drawImage(logo,W/2-w/2,95,w,h); }
    ctr(u('gameTitle')+'  ·  '+u('tagline'),272,'800 38px '+F1,'#1456d8');
    ctr(u('certTitle').toUpperCase(),335,'800 72px '+F1,'#0c3ba6');
    ctr(u('certPre'),392,'700 36px '+F2,'#0a2a66');
    ctr((S.certName||S.player||'').trim()||'________________',500,'800 104px '+F1,'#ff8a1f');
    g.fillStyle='#0a2a66'; g.fillRect(W/2-420,520,840,4);
    forLines.forEach((ln,i)=>ctr(ln,585+i*46,'700 34px '+F2,'#0a2a66'));
    ctr(u('champ'),champY,'800 62px '+F1,'#1456d8');
    const bw=120, gap=26, tw=bs.length*bw+(bs.length-1)*gap; bs.forEach((b,i)=>{ if(b){ const hh=bw*b.height/b.width; g.drawImage(b,W/2-tw/2+i*(bw+gap),badgesTop+(130-hh)/2,bw,hh);} });
    ctr(`🛡 ${t.safety}    📣 ${t.voice}    ♥ ${t.empathy}    ·    ${u('total')}: ${tot}    ·    ★ ${starCount()}`,scoreY,'800 44px '+F2,'#0a2a66');
    // DPL section
    const px=110, pw=W-220; g.fillStyle='rgba(255,255,255,.78)'; g.strokeStyle='#0c3ba6'; g.lineWidth=4; g.beginPath(); g.roundRect?g.roundRect(px,dplTop,pw,dplBottom-dplTop,28):g.rect(px,dplTop,pw,dplBottom-dplTop); g.fill(); g.stroke();
    ctr(u('dplHead'),dplTop+64,'800 46px '+F1,'#0c3ba6');
    ctr(u('dplSub'),dplTop+108,'700 30px '+F2,'#27497f');
    const names=AB.dplCert.map(x=>L(x)); let fs=30, pad=26, gp=16, widths;
    const measure=()=>{ g.font='800 '+fs+'px '+F2; widths=names.map(n=>g.measureText(n).width+pad*2); return widths.reduce((a,b)=>a+b,0)+gp*(names.length-1); };
    while(measure()>pw-60&&fs>18){ fs--; pad=Math.max(14,pad-1); }
    let cx=W/2-measure()/2; const cy=dplTop+132, chh=64;
    names.forEach((n,i)=>{ g.fillStyle=['#dff4ff','#fff3c4','#e5fbea','#ffe9d4','#f1e4ff'][i]; g.strokeStyle='#0a2a66'; g.lineWidth=3; g.beginPath(); g.roundRect?g.roundRect(cx,cy,widths[i],chh,32):g.rect(cx,cy,widths[i],chh); g.fill(); g.stroke(); g.font='800 '+fs+'px '+F2; g.fillStyle='#0a2a66'; g.textAlign='center'; g.fillText(n,cx+widths[i]/2,cy+chh/2+fs*0.35); cx+=widths[i]+gp; });
    ctr(u('dplTheme'),dplTop+245,'800 32px '+F2,'#1456d8');
    ctr(u('certNote'),noteY,'600 24px '+F2,'#27497f');
    ctr(`${u('dev')} — ENGLISH YO!`,devY,'700 30px '+F2,'#27497f');
    ctr(u('refBnn'),refY,'600 24px '+F2,'#27497f');
    try{
      cv.toBlob(b=>{ if(!b){toast(()=>u('dlFail'));return;} const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='the-brave-way-certificate.png'; document.body.appendChild(a); a.click(); a.remove(); });
    }catch(e){ toast(()=>u('dlFail')); }
  });
}

/* ═════════════════════ ROUTER ═════════════════════ */
function render(){
  document.documentElement.lang=S.lang; document.title=u('docTitle');
  const v=S.view; let h;
  if(v==='scene' && !S.cur) S.view='levels';
  if(v==='module' && !S.mod) S.view='learn';
  if(v==='surprise' && !S.sur) S.view='levels';
  if(v==='complete' && !S.compM) S.view='levels';
  if(v==='final' && !allLevels()) S.view='levels';
  if(v==='lvdone' && !S.lvres) S.view='levels';
  if(v==='maze' && !MZ.has()){ if(S.mz) MZ.start(S.mz.lv,false); else S.view='levels'; }
  if(S.view!=='maze') MZ.stop();
  switch(S.view){
    case 'home':h=viewHome();break; case 'map':h=viewMap();break; case 'intro':h=viewIntro();break; case 'scene':h=viewScene();break;
    case 'surprise':h=viewSurprise();break; case 'complete':h=viewComplete();break; case 'learn':h=viewLearn();break;
    case 'module':h=viewModule();break; case 'ach':h=viewAch();break; case 'how':h=viewHow();break; case 'final':h=viewFinal();break; case 'corner':h=viewCorner();break; case 'levels':h=viewLevels();break; case 'lvintro':h=viewLvIntro();break; case 'maze':h=viewMaze();break; case 'lvdone':h=viewLvDone();break; default:h=viewHome();
  }
  app.innerHTML=h; save();
  if(S.view==='maze') MZ.mount();
  syncAbout(); refreshToasts();
}
function go(v,noTop){ S.view=v; render(); if(!noTop) window.scrollTo({top:0}); }

/* ═════════════════════ ACTIONS ═════════════════════ */
function engCtx(){
  if(S.view==='scene') return {def:curDef(),st:S.cur.st,after:afterAct};
  if(S.view==='module' && S.mod.phase==='act') return {def:modDef().acts[S.mod.a],st:S.mod.st,after:afterModAct};
  return null;
}
function startMissionScene(id,fresh){
  const m=mission(id); let i=0;
  if(!fresh){ const f=m.scenes.findIndex((_,k)=>!S.scores[key(id,k)]); i = f<0?0:f; }
  newScene(id,i); render(); window.scrollTo({top:0});
}
const ACT = {
  go:d=>{ sfx.click(); go(d.v); },
  backGames:()=>{ try{ if(S.sound) sessionStorage.setItem(WELCOME_FLAG,'1'); }catch(x){} MZ.snapshot(); },
  about:()=>{ sfx.click(); openAbout(); },
  aboutClose:()=>{ sfx.click(); closeAbout(); },
  lang:d=>{ const l=d&&d.l; if(l!=='id'&&l!=='en') return; if(S.lang!==l){ S.lang=l; sfx.click(); render(); } },
  snd:()=>{ S.sound=!S.sound; if(S.sound) sfx.click(); render(); },
  hero:d=>{ S.hero=d.h; sfx.star(); render(); },
  om:d=>{ S.cm=+d.m; sfx.click(); go('intro'); },
  ms:d=>{ sfx.click(); startMissionScene(+d.m,!!d.fresh || missionDone(+d.m)); },
  e:(d,el)=>{ const c=engCtx(); if(!c) return; E[c.def.type].act(c.def,c.st,d.a,d.i,d.b); c.after(); render(); },
  retry:()=>{ const c=S.cur,def=curDef(); c.st=E[def.type].init(def); c.res=null; c.attempt++; sfx.click(); render(); },
  nx:()=>{
    const c=S.cur; sfx.click();
    if(c.i<4){ if(c.i===1||c.i===3) startSurprise(c.m,c.i+1); else newScene(c.m,c.i+1); }
    else { S.compM=c.m; S.view='complete'; sfx.win(); confetti(); }
    render(); window.scrollTo({top:0});
  },
  hint:()=>{
    const c=S.cur,k=key(c.m,c.i);
    if(S.hints[k]) return;
    if(S.shields>0){ S.shields--; S.hints[k]=true; c.noShield=false; if(!S.ach.wise){S.ach.wise=true;setTimeout(()=>toast(()=>'🏅 '+L(D.extraAch.find(a=>a.id==='wise').t)),300);} sfx.star(); toast(()=>u('hintUsed')); }
    else { c.noShield=true; sfx.no(); }
    render();
  },
  learnMod:d=>{ const from = S.view==='scene'?'scene':S.view==='corner'?'corner':'menu'; openModule(+d.id,from); sfx.click(); render(); window.scrollTo({top:0}); },
  mback:()=>{ sfx.click(); if(S.mod.from==='scene' && S.cur){ S.view='scene'; } else if(S.mod.from==='maze' && S.mz){ S.view='maze'; } else if(S.mod.from==='corner'){ S.view='corner'; } else S.view='learn'; render(); window.scrollTo({top:0}); },
  play:()=>{ const inp=document.getElementById('playerName'); const v=((inp?inp.value:S.player)||'').trim();
    if(!v){ if(S.view!=='home') go('home'); const i2=document.getElementById('playerName'), m2=document.getElementById('nameMsg'); if(m2) m2.hidden=false; if(i2){ i2.classList.remove('shake'); void i2.offsetWidth; i2.classList.add('shake'); i2.focus(); } sfx.no(); return; }
    S.player=v; if(!S.certName) S.certName=v; sfx.click(); go('levels'); },
  lvi:d=>{ S.cl=+d.id; sfx.click(); go('lvintro'); },
  lvs:d=>{ const id=+d.id; S.cl=id; MZ.start(id,!!d.fresh); S.view='maze'; sfx.click(); render(); window.scrollTo({top:0}); },
  mstart:()=>{ S.mod.phase='cards'; S.mod.card=0; sfx.click(); render(); },
  mcard:d=>{ S.mod.card=Math.max(0,Math.min(modDef().cards.length-1,S.mod.card+(+d.d))); sfx.click(); render(); },
  mact:()=>{ S.mod.phase='act'; S.mod.a=0; S.mod.st=E[modDef().acts[0].type].init(modDef().acts[0]); sfx.click(); render(); },
  mretry:()=>{ const a=modDef().acts[S.mod.a]; S.mod.st=E[a.type].init(a); sfx.click(); render(); },
  mnext:()=>{
    const m=modDef(); sfx.click();
    if(S.mod.a<m.acts.length-1){ S.mod.a++; S.mod.st=E[m.acts[S.mod.a].type].init(m.acts[S.mod.a]); }
    else{
      S.mod.phase='sum';
      if(!S.mods[m.id]){ S.mods[m.id]=true; S.mod.earned=true; S.shields+=2; sfx.win(); confetti(); checkAch(); }
    }
    render(); window.scrollTo({top:0});
  },
  mrestart:()=>{ S.mod.phase='goals'; S.mod.card=0; S.mod.a=0; sfx.click(); render(); window.scrollTo({top:0}); },
  sans:d=>{ const s=S.sur, it=D.surprise[s.list[s.idx]]; s.ans=+d.v; if((s.ans===1)===it[1]){ s.ok++; sfx.good(); } else sfx.no(); render(); },
  sstep:()=>{ S.sur.idx++; S.sur.ans=null; sfx.click(); render(); },
  snext:()=>{
    const s=S.sur; S.bonus+=s.ok; if(s.ok===s.list.length && s.idx>=s.list.length && !S.ach.surprise){ S.ach.surprise=true; setTimeout(()=>toast(()=>'🏅 '+L(D.extraAch.find(a=>a.id==='surprise').t)),300); }
    const m=s.m,n=s.next; S.sur=null; checkAch(); newScene(m,n); sfx.click(); render(); window.scrollTo({top:0});
  },
  dl:()=>downloadCert(),
  pr:()=>{ sfx.click(); window.print(); },
  reset:()=>{ if(confirm(u('confirmReset'))){ MZ.stop(); const k={lang:S.lang,sound:S.sound,hero:S.hero,player:S.player}; S=Object.assign(blank(),k); sfx.click(); go('home'); } }
};

document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&aboutOpen){ e.preventDefault(); closeAbout(); } });
document.addEventListener('click',e=>{
  if(aboutOpen&&e.target.id==='aboutModal'){ closeAbout(); return; }
  const el=e.target.closest('[data-act]'); if(!el||el.disabled) return;
  const fn=ACT[el.dataset.act]; if(fn) fn(el.dataset,el,e);
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='playerName'){ S.player=t.value; const m2=document.getElementById('nameMsg'); if(m2&&t.value.trim()) m2.hidden=true; save(); }
  if(t.id==='nameInput'){ S.certName=t.value; const n=$('#certName'); if(n) n.textContent=t.value.trim()||' '; save(); }
  if(t.dataset && t.dataset.refl!==undefined){ S.refl[+t.dataset.refl]=t.value; save(); }
});
document.addEventListener('toggle',e=>{ const d=e.target; if(d&&d.dataset&&d.dataset.proj!==undefined){ d.open?projOpen.add(+d.dataset.proj):projOpen.delete(+d.dataset.proj); } },true);
/* drag & drop for sort cards (tap-to-place also works) */
let dragI=null;
document.addEventListener('dragstart',e=>{ const c=e.target.closest('.dcard[data-i]'); if(!c) return; dragI=c.dataset.i; try{e.dataTransfer.setData('text/plain',dragI);e.dataTransfer.effectAllowed='move';}catch(x){} });
document.addEventListener('dragover',e=>{ const b=e.target.closest('.bin'); if(b){ e.preventDefault(); b.classList.add('hot'); } });
document.addEventListener('dragleave',e=>{ const b=e.target.closest('.bin'); if(b) b.classList.remove('hot'); });
document.addEventListener('drop',e=>{
  const b=e.target.closest('.bin'); if(!b) return; e.preventDefault(); b.classList.remove('hot');
  const c=engCtx(); if(!c||c.def.type!=='sort'||dragI===null) return;
  E.sort.act(c.def,c.st,'bin',dragI,b.dataset.b); dragI=null; c.after(); render();
});

/* maze engine bridge */
MZ.init({
  get S(){ return S; }, D, L, u, esc, sfx, toast, save,
  catName:c=>UI[c+'S'],
  recordEnc(lv,k,pts,cat){ const r=S.lv[lv]||(S.lv[lv]={enc:{},mapStars:0,encStars:0,done:false}); const o=r.enc[k]; if(!o||pts>o.pts) r.enc[k]={pts,cat}; save(); checkAch(); },
  completeLevel(res){
    const r=S.lv[res.lv]||(S.lv[res.lv]={enc:{},mapStars:0,encStars:0,done:false});
    r.done=true; r.mapStars=Math.max(r.mapStars||0,res.stars); r.encStars=Math.max(r.encStars||0,res.encStars);
    if(res.wrong===0) r.perfect=true; if(res.stars===res.totalStars) r.allStars=true;
    S.lvres=res; S.view='lvdone'; sfx.win(); confetti(); checkAch(); render(); window.scrollTo({top:0});
  },
  openLearn(id){ openModule(id,'maze'); sfx.click(); render(); window.scrollTo({top:0}); },
  achWise(){ if(!S.ach.wise){ S.ach.wise=true; setTimeout(()=>toast(()=>'🏅 '+L(D.extraAch.find(a=>a.id==='wise').t)),300); } toast(()=>u('hintUsed')); }
});

/* sparkle decor */
(function(){ const d=document.createElement('div'); d.className='sparkles'; d.setAttribute('aria-hidden','true');
  d.innerHTML=[[6,8,'✦',26],[90,14,'★',30],[12,62,'★',22],[84,70,'✦',34],[48,4,'✦',20],[70,90,'★',24],[30,88,'✦',22]].map(([x,y,c,s],i)=>`<i style="left:${x}%;top:${y}%;font-size:${s}px;animation-delay:${-i*.6}s">${c}</i>`).join('');
  document.body.prepend(d); })();

render();
})();
