/* THE BRAVE WAY — 2D top-down maze engine (fixed overhead camera, canvas).
   Maze generation, collision, challengers, question encounters, collectibles, golden key and EXIT gate. */
(function(){
'use strict';
const MZ = window.MZ = {};
let API = null, G = null, cv = null, cx = null, off = null, raf = 0, lastT = 0, ts = 24, ox = 0, oy = 0, dpr = 1, wrapW = 0;
const MG = 0.6;                     // grass margin around the maze (in tiles)
const SPEED = 3.7, RAD = 0.27;       // tiles per second, player half-size
const pressed = [];                  // stack of held directions (last pressed wins)
const IM = {};
function img(n){ if(!IM[n]){ const i=new Image(); i.src='img/'+n+'.png'; IM[n]=i; } return IM[n]; }
const ready = i => i && i.complete && i.naturalWidth > 0;

const t = k => API.u('mz_'+k);

/* ═══════════ maze generation ═══════════ */
function rng(seed){ let s=seed>>>0; return ()=>{ s=(s+0x6D2B79F5)>>>0; let a=s; a=Math.imul(a^a>>>15,a|1); a^=a+Math.imul(a^a>>>7,a|61); return ((a^a>>>14)>>>0)/4294967296; }; }
function bfs(grid,W,H,sx,sy,blocked){
  const dist=new Int16Array(W*H).fill(-1), par=new Int32Array(W*H).fill(-1), q=[sy*W+sx]; dist[sy*W+sx]=0;
  for(let h=0;h<q.length;h++){ const c=q[h], x=c%W, y=(c/W)|0;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx, ny=y+dy; if(nx<0||ny<0||nx>=W||ny>=H) continue; const ni=ny*W+nx;
      if(grid[ni]||dist[ni]>=0||(blocked&&blocked.has(ni))) continue; dist[ni]=dist[c]+1; par[ni]=c; q.push(ni); } }
  return {dist,par};
}
function openNeighbors(grid,W,H,x,y){ let n=0; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<W&&ny<H&&!grid[ny*W+nx]) n++; } return n; }

function generate(level){
  const [n,m]=level.cells, W=2*n+1, H=2*m+1, R=rng(level.seed), need=level.npcs.length;
  let loops=level.loops, out=null;
  for(let attempt=0; attempt<14 && !out; attempt++){
    const grid=new Uint8Array(W*H).fill(1), seen=new Uint8Array(n*m), st=[[0,0]]; seen[0]=1; grid[1*W+1]=0;
    while(st.length){ const [a,b]=st[st.length-1], nb=[];
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const c=a+dx,d=b+dy; if(c>=0&&d>=0&&c<n&&d<m&&!seen[d*n+c]) nb.push([c,d,dx,dy]); }
      if(!nb.length){ st.pop(); continue; }
      const [c,d,dx,dy]=nb[Math.floor(R()*nb.length)]; seen[d*n+c]=1; grid[(2*b+1+dy)*W+(2*a+1+dx)]=0; grid[(2*d+1)*W+(2*c+1)]=0; st.push([c,d]);
    }
    for(let k=0,done=0; k<80 && done<loops; k++){ // add loops (extra openings) for harder mazes
      const a=Math.floor(R()*n), b=Math.floor(R()*m), horiz=R()<.5;
      const exitSide=wi=>wi===(H-2)*W+(W-3)||wi===(H-3)*W+(W-2);   // keep the EXIT a dead end so it can't be crossed by accident
      if(horiz && a<n-1){ const wi=(2*b+1)*W+(2*a+2); if(grid[wi]&&!exitSide(wi)){ grid[wi]=0; done++; } }
      else if(!horiz && b<m-1){ const wi=(2*b+2)*W+(2*a+1); if(grid[wi]&&!exitSide(wi)){ grid[wi]=0; done++; } }
    }
    const sx=1, sy=1, ex=W-2, ey=H-2, si=sy*W+sx, ei=ey*W+ex, base=bfs(grid,W,H,sx,sy);
    if(base.dist[ei]<0) continue;
    const path=[]; for(let c=ei;c!==-1;c=base.par[c]) path.unshift(c);
    const choke=[]; // tiles on the route that every path to the exit must cross
    for(let i=3;i<path.length-2;i++){ const ni=path[i], r=bfs(grid,W,H,sx,sy,new Set([ni])); if(r.dist[ei]<0) choke.push(i); }
    if(choke.length<need){ loops=Math.max(0,loops-1); continue; }
    const picked=[]; // choose evenly spaced chokepoints, preferring junctions
    for(let j=0;j<need;j++){
      const target=Math.round(path.length*(j+1)/(need+1)); let bestI=-1, bestS=1e9;
      for(const i of choke){ if(picked.some(p=>Math.abs(p-i)<4)) continue; const x=path[i]%W, y=(path[i]/W)|0; const s=Math.abs(i-target)-(openNeighbors(grid,W,H,x,y)>=3?2.5:0); if(s<bestS){bestS=s;bestI=i;} }
      if(bestI<0) break; picked.push(bestI);
    }
    if(picked.length<need){ loops=Math.max(0,loops-1); continue; }
    picked.sort((a,b)=>a-b);
    const npcs=picked.map((pi,k)=>({x:path[pi]%W,y:(path[pi]/W)|0,idx:k,pi}));
    const npcSet=new Set(npcs.map(o=>o.y*W+o.x));
    // golden key: a dead end that can only be reached after passing the 2nd challenger
    const behind=bfs(grid,W,H,sx,sy,new Set([npcs[Math.min(1,npcs.length-1)].y*W+npcs[Math.min(1,npcs.length-1)].x]));
    let key=null, bd=-1; const dead=[];
    for(let y=1;y<H-1;y++) for(let x=1;x<W-1;x++){ const i=y*W+x; if(grid[i]||i===si||i===ei||npcSet.has(i)) continue;
      if(openNeighbors(grid,W,H,x,y)===1){ dead.push(i); if(behind.dist[i]<0 && base.dist[i]>bd){bd=base.dist[i];key=i;} } }
    if(key===null){ for(const i of dead) if(base.dist[i]>bd){bd=base.dist[i];key=i;} }
    if(key===null) continue;
    const used=new Set([si,ei,key,...npcSet]), stars=[];
    const pool=dead.filter(i=>!used.has(i)&&base.dist[i]>3).sort(()=>R()-.5);
    const rest=[]; for(let i=0;i<W*H;i++) if(!grid[i]&&!used.has(i)&&base.dist[i]>3&&!dead.includes(i)) rest.push(i);
    rest.sort(()=>R()-.5);
    for(const i of pool.concat(rest)){ if(stars.length>=level.stars) break; if(stars.every(s=>Math.abs((s%W)-(i%W))+Math.abs(((s/W)|0)-((i/W)|0))>2)) stars.push(i); }
    for(const i of rest){ if(stars.length>=level.stars) break; if(!stars.includes(i)) stars.push(i); }
    // grass decoration in the margin
    const deco=[], kinds=['tree','tree','pink','pine','bush','bush','flowers','lamp','cone'];
    const slots=[]; for(let x=0;x<W;x++){ slots.push([x,-MG,0]); slots.push([x,H,1]); } for(let y=0;y<H;y++){ slots.push([-MG,y,2]); slots.push([W,y,3]); }
    slots.forEach(([x,y])=>{ if(R()<.62) deco.push({x:x+R()*.4,y:y+R()*.2,k:kinds[Math.floor(R()*kinds.length)]}); });
    out={W,H,grid,start:{x:sx,y:sy},exit:{x:ex,y:ey},npcs,key:{x:key%W,y:(key/W)|0},stars:stars.map(i=>({x:i%W,y:(i/W)|0})),deco,seed:level.seed,pathLen:path.length};
  }
  return out;
}
MZ.generate = generate;
const cache = {};
MZ.layout = level => cache[level.id] || (cache[level.id]=generate(level));

/* ═══════════ themes ═══════════ */
const THEMES = {
  stone:{wall:'#2f55b0',hi:'#5a82e6',dk:'#1c3b86',path:'#efd8a2',pdk:'#dcbc78',grass:'#72c451',grass2:'#62b345'},
  hedge:{wall:'#2e9b3d',hi:'#5ac55f',dk:'#1c6e2b',path:'#f1dfae',pdk:'#dcc384',grass:'#8ad164',grass2:'#79c255',hedge:true},
  brick:{wall:'#c15a34',hi:'#e8845a',dk:'#8e3a1d',path:'#e5d3b5',pdk:'#cdb892',grass:'#6fbf5a',grass2:'#5fae4b'},
  library:{wall:'#8a5a2f',hi:'#b98350',dk:'#5c3a1b',path:'#f3dfb8',pdk:'#dfc592',grass:'#8cc866',grass2:'#7bb857'},
  festival:{wall:'#b240a0',hi:'#e37bd0',dk:'#7c2a6f',path:'#f8e4b8',pdk:'#e5c98c',grass:'#7fd061',grass2:'#6cc050',confetti:true}
};
const hash = (x,y,s=0)=>{ let h=(x*374761393+y*668265263+s*982451653)|0; h=(h^(h>>>13))*1274126177|0; return ((h^(h>>>16))>>>0)/4294967296; };

/* ═══════════ static layer (grass, paths, walls, decoration) ═══════════ */
function prerender(){
  const L=G.lay, th=THEMES[G.level.theme]||THEMES.stone, cols=L.W+2*MG, rows=L.H+2*MG;
  off=document.createElement('canvas'); off.width=Math.ceil(cols*ts*dpr); off.height=Math.ceil(rows*ts*dpr);
  const c=off.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
  // grass
  c.fillStyle=th.grass; c.fillRect(0,0,cols*ts,rows*ts);
  for(let y=0;y<rows*2;y++) for(let x=0;x<cols*2;x++){ if((x+y)%2===0){ c.fillStyle=th.grass2; c.globalAlpha=.35; c.fillRect(x*ts/2,y*ts/2,ts/2,ts/2); c.globalAlpha=1; } }
  for(let i=0;i<cols*rows*0.9;i++){ const px=hash(i,1,L.seed)*cols*ts, py=hash(i,2,L.seed)*rows*ts; c.fillStyle=['#fff','#ffe36b','#ffb3d1'][i%3]; c.globalAlpha=.8; c.beginPath(); c.arc(px,py,Math.max(1,ts*.05),0,7); c.fill(); c.globalAlpha=1; }
  const X=x=>ox+x*ts, Y=y=>oy+y*ts;
  // paths and walls
  for(let y=0;y<L.H;y++) for(let x=0;x<L.W;x++){
    const wall=L.grid[y*L.W+x];
    if(!wall){
      c.fillStyle=th.path; c.fillRect(X(x),Y(y),ts+.5,ts+.5);
      for(let k=0;k<4;k++){ c.fillStyle=th.pdk; c.globalAlpha=.55; c.beginPath(); c.arc(X(x)+hash(x,y,k)*ts,Y(y)+hash(x,y,k+9)*ts,ts*.035,0,7); c.fill(); c.globalAlpha=1; }
      if(y>0&&L.grid[(y-1)*L.W+x]){ const g=c.createLinearGradient(0,Y(y),0,Y(y)+ts*.28); g.addColorStop(0,'rgba(60,40,10,.28)'); g.addColorStop(1,'rgba(60,40,10,0)'); c.fillStyle=g; c.fillRect(X(x),Y(y),ts,ts*.28); }
      if(x>0&&L.grid[y*L.W+x-1]){ const g=c.createLinearGradient(X(x),0,X(x)+ts*.2,0); g.addColorStop(0,'rgba(60,40,10,.2)'); g.addColorStop(1,'rgba(60,40,10,0)'); c.fillStyle=g; c.fillRect(X(x),Y(y),ts*.2,ts); }
    }
  }
  for(let y=0;y<L.H;y++) for(let x=0;x<L.W;x++) if(L.grid[y*L.W+x]) drawWall(c,th,x,y,X(x),Y(y));
  // margin decoration
  L.deco.forEach(d=>{ const im=img('m-d-'+d.k); const h=ts*(d.k==='tree'||d.k==='pink'||d.k==='pine'?.62:d.k==='lamp'?.6:.4);
    const px=X(d.x), py=Y(d.y);
    if(ready(im)){ const w=h*im.naturalWidth/im.naturalHeight; c.drawImage(im,px,py+MG*ts*.5-h*.4,w,h); } });
  // start marker
  c.font=`${ts*.5}px serif`; c.textAlign='center'; c.textBaseline='middle'; c.globalAlpha=.55; c.fillText('🚩',X(L.start.x)+ts*.5,Y(L.start.y)+ts*.5); c.globalAlpha=1;
}
function drawWall(c,th,x,y,px,py){
  const r=ts*.12; c.fillStyle=th.wall; rr(c,px,py,ts+.5,ts+.5,r*.4); c.fill();
  if(th.hedge){
    for(let k=0;k<7;k++){ const bx=px+hash(x,y,k)*ts, by=py+hash(x,y,k+20)*ts, br=ts*(.2+hash(x,y,k+40)*.14); c.fillStyle=k%2?th.hi:th.dk; c.globalAlpha=.9; c.beginPath(); c.arc(bx,by,br,0,7); c.fill(); }
    c.globalAlpha=1; c.fillStyle=th.wall; c.globalAlpha=.55; c.fillRect(px+ts*.1,py+ts*.1,ts*.8,ts*.8); c.globalAlpha=1;
    for(let k=0;k<3;k++){ c.fillStyle=k%2?'#ff9ec7':'#fff3a0'; c.beginPath(); c.arc(px+hash(x,y,k+60)*ts,py+hash(x,y,k+70)*ts,ts*.04,0,7); c.fill(); }
  } else {
    c.strokeStyle=th.dk; c.lineWidth=Math.max(1,ts*.04);
    const rows=3, bh=ts/rows;
    for(let b=0;b<rows;b++){ const yy=py+b*bh; c.beginPath(); c.moveTo(px,yy); c.lineTo(px+ts,yy); c.stroke();
      const off=(b+x+y)%2? ts*.5 : ts*.25; c.beginPath(); c.moveTo(px+off,yy); c.lineTo(px+off,yy+bh); c.stroke(); if(off<ts*.5){ c.beginPath(); c.moveTo(px+off+ts*.5,yy); c.lineTo(px+off+ts*.5,yy+bh); c.stroke(); } }
    c.fillStyle=th.hi; c.globalAlpha=.5; c.fillRect(px+ts*.04,py+ts*.04,ts*.92,ts*.1); c.globalAlpha=1;
    if(th.confetti){ for(let k=0;k<3;k++){ c.fillStyle=['#ffd23f','#4cc3ff','#fff'][k]; c.beginPath(); c.arc(px+hash(x,y,k+3)*ts,py+hash(x,y,k+30)*ts,ts*.045,0,7); c.fill(); } }
  }
  c.strokeStyle=th.dk; c.lineWidth=Math.max(1,ts*.05); rr(c,px+.5,py+.5,ts-1,ts-1,r*.4); c.stroke();
}
function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }

/* ═══════════ game state ═══════════ */
function fresh(level){
  const lay=MZ.layout(level);
  return {level,lv:level.id,lay,px:lay.start.x+.5,py:lay.start.y+.5,dir:'down',moving:false,walk:0,
    defeated:new Set(),stars:new Set(),key:false,wrong:0,encStars:0,enc:null,paused:false,coolNpc:-1,
    anim:{},parts:[],pops:[],t:0,lastMsg:0,lastSnap:0,hint:{},done:false};
}
function snap(){
  if(!G||G.done) return;
  API.S.mz={lv:G.lv,px:G.px,py:G.py,dir:G.dir,defeated:[...G.defeated],stars:[...G.stars],key:G.key,wrong:G.wrong,encStars:G.encStars,coolNpc:G.coolNpc,hint:G.hint,
    enc:G.enc?{npc:G.enc.npc,qi:G.enc.qi,order:G.enc.order,tries:G.enc.tries,picked:G.enc.picked,done:G.enc.done,hint:G.enc.hint}:null};
  API.save();
}
function restore(level,s){
  G=fresh(level); G.px=s.px; G.py=s.py; G.dir=s.dir||'down'; G.defeated=new Set(s.defeated); G.stars=new Set(s.stars); G.key=s.key; G.wrong=s.wrong||0; G.encStars=s.encStars||0; G.coolNpc=s.coolNpc??-1; G.hint=s.hint||{};
  s.defeated.forEach(i=>{ G.anim[i]={t:9,dx:0,dy:0}; });
  if(s.enc){ G.enc=Object.assign({},s.enc); G.paused=true; }
}
MZ.start = function(levelId,freshStart){
  const level=API.D.levels.find(l=>l.id===levelId), s=API.S.mz;
  if(!freshStart && s && s.lv===levelId) restore(level,s); else { G=fresh(level); API.S.mz=null; snap(); }
};
MZ.has = () => !!G;
MZ.current = () => G ? G.lv : null;

/* ═══════════ collision ═══════════ */
function npcAt(tx,ty){ for(const n of G.lay.npcs) if(n.x===tx&&n.y===ty&&!G.defeated.has(n.idx)) return n; return null; }
function solid(tx,ty){ const L=G.lay; if(tx<0||ty<0||tx>=L.W||ty>=L.H) return true; if(L.grid[ty*L.W+tx]) return true; return !!npcAt(tx,ty); }
function blockedAt(x,y){ for(let ty=Math.floor(y-RAD);ty<=Math.floor(y+RAD);ty++) for(let tx=Math.floor(x-RAD);tx<=Math.floor(x+RAD);tx++) if(solid(tx,ty)) return true; return false; }
function moveBy(dx,dy){
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/0.04));
  for(let i=0;i<steps;i++){
    const sx=dx/steps, sy=dy/steps;
    if(sx&&!blockedAt(G.px+sx,G.py)) G.px+=sx;
    if(sy&&!blockedAt(G.px,G.py+sy)) G.py+=sy;
  }
}
MZ.collides = (x,y) => blockedAt(x,y);   // exposed for tests

/* ═══════════ update ═══════════ */
function heldDir(){ for(let i=pressed.length-1;i>=0;i--) return pressed[i]; return null; }
function update(dt){
  G.t+=dt;
  for(const k in G.anim){ if(G.anim[k].t<9) G.anim[k].t+=dt; }
  G.parts=G.parts.filter(p=>(p.l-=dt)>0); G.parts.forEach(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=3*dt; });
  G.pops=G.pops.filter(p=>(p.l-=dt)>0);
  if(G.paused||G.done) return;
  const d=heldDir(); G.moving=!!d;
  if(d){
    G.dir=d; const vx=d==='left'?-1:d==='right'?1:0, vy=d==='up'?-1:d==='down'?1:0, st=SPEED*dt;
    // glide toward the corridor centre line so turns at junctions feel smooth
    if(vx){ const c=Math.floor(G.py)+.5, dd=c-G.py, s=Math.max(-st,Math.min(st,dd)); if(Math.abs(dd)>.001) moveBy(0,s); }
    if(vy){ const c=Math.floor(G.px)+.5, dd=c-G.px, s=Math.max(-st,Math.min(st,dd)); if(Math.abs(dd)>.001) moveBy(s,0); }
    moveBy(vx*st,vy*st); G.walk+=dt*9;
  }
  // collectibles
  G.lay.stars.forEach((s,i)=>{ if(!G.stars.has(i)&&Math.hypot(G.px-(s.x+.5),G.py-(s.y+.5))<.5){ G.stars.add(i); burst(s.x+.5,s.y+.5,'⭐'); pop(s.x+.5,s.y,'mz_star'); API.sfx.star(); hud(); snap(); } });
  const k=G.lay.key; if(!G.key&&Math.hypot(G.px-(k.x+.5),G.py-(k.y+.5))<.5){ G.key=true; burst(k.x+.5,k.y+.5,'✨'); pop(k.x+.5,k.y,'mz_gotKey'); API.sfx.win(); API.toast(()=>t('gotKey')); hud(); snap(); if(canExit()) API.toast(()=>t('gate')); }
  // challengers: pause and ask. NPC tiles are solid, so they can never be walked through or around.
  if(G.coolNpc>=0){ const n=G.lay.npcs[G.coolNpc]; if(Math.hypot(G.px-(n.x+.5),G.py-(n.y+.5))>1.7) G.coolNpc=-1; }
  for(const n of G.lay.npcs){ if(G.defeated.has(n.idx)||n.idx===G.coolNpc) continue;
    if(Math.hypot(G.px-(n.x+.5),G.py-(n.y+.5))<1.15){ startEnc(n.idx); break; } }
  // exit
  const e=G.lay.exit; if(Math.abs(G.px-(e.x+.5))<.42&&Math.abs(G.py-(e.y+.5))<.42){
    if(canExit()) finish();
    else if(G.t-G.lastMsg>2.4){ G.lastMsg=G.t; const nk=!G.key, ne=G.defeated.size<G.lay.npcs.length; API.toast(()=>t(nk&&ne?'needBoth':nk?'needKey':'needEnc')); API.sfx.no(); }
  }
  if(G.t-G.lastSnap>1.5){ G.lastSnap=G.t; snap(); }
}
const canExit = () => G.key && G.defeated.size===G.lay.npcs.length;
function burst(x,y,ch){ for(let i=0;i<9;i++){ const a=Math.random()*6.28, v=1+Math.random()*2; G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,l:.8+Math.random()*.4,ch}); } }
function pop(x,y,txt){ G.pops.push({x,y,l:1.1,txt}); }   // txt is a translation key (mz_*) or plain text like "+2 ⭐"

/* ═══════════ drawing ═══════════ */
const dirImg = d => d==='up'?'up':d==='down'?'down':'side';
const FACES_RIGHT = {raka:true,dimas:true,maya:false,salsa:true};
function sprite(c,im,cxp,bottom,h,flip,alpha){
  if(!ready(im)) return; const w=h*im.naturalWidth/im.naturalHeight;
  c.save(); c.globalAlpha=alpha==null?1:alpha; c.translate(cxp,bottom); if(flip) c.scale(-1,1); c.drawImage(im,-w/2,-h,w,h); c.restore();
}
function shadow(c,x,y,w){ c.fillStyle='rgba(30,40,20,.28)'; c.beginPath(); c.ellipse(x,y,w,w*.35,0,0,7); c.fill(); }
function drawExit(c,X,Y,open){
  const L=G.lay, px=X(L.exit.x), py=Y(L.exit.y), t=G.t;
  c.save();
  if(open){ const g=c.createRadialGradient(px+ts/2,py+ts/2,ts*.1,px+ts/2,py+ts/2,ts*.9); g.addColorStop(0,'rgba(255,240,120,.85)'); g.addColorStop(1,'rgba(255,240,120,0)'); c.fillStyle=g; c.globalAlpha=.7+.3*Math.sin(t*4); c.fillRect(px-ts*.4,py-ts*.4,ts*1.8,ts*1.8); c.globalAlpha=1; }
  // pillars
  c.fillStyle=open?'#7d8aa6':'#6c7480'; rr(c,px+ts*.04,py+ts*.28,ts*.2,ts*.72,ts*.05); c.fill(); rr(c,px+ts*.76,py+ts*.28,ts*.2,ts*.72,ts*.05); c.fill();
  c.strokeStyle='#2b3550'; c.lineWidth=Math.max(1,ts*.04); rr(c,px+ts*.04,py+ts*.28,ts*.2,ts*.72,ts*.05); c.stroke(); rr(c,px+ts*.76,py+ts*.28,ts*.2,ts*.72,ts*.05); c.stroke();
  // sign
  c.fillStyle=open?'#ffd23f':'#d9a92a'; rr(c,px-ts*.02,py+ts*.02,ts*1.04,ts*.34,ts*.1); c.fill(); c.stroke();
  c.fillStyle='#0a2a66'; c.font=`800 ${ts*.25}px "Baloo 2",Arial,sans-serif`; c.textAlign='center'; c.textBaseline='middle'; c.fillText('EXIT',px+ts/2,py+ts*.2);
  if(open){ c.fillStyle='#2fa84f'; c.font=`${ts*.45}px serif`; c.fillText('➜',px+ts/2+Math.sin(t*6)*ts*.06,py+ts*.68); }
  else { c.font=`${ts*.5}px serif`; c.fillText('🔒',px+ts/2,py+ts*.68); }
  c.restore();
}
function draw(){
  const c=cx, L=G.lay; c.setTransform(dpr,0,0,dpr,0,0);
  c.clearRect(0,0,cv.width,cv.height);
  c.drawImage(off,0,0,off.width/dpr,off.height/dpr);
  const X=x=>ox+x*ts, Y=y=>oy+y*ts, t=G.t;
  drawExit(c,X,Y,canExit());
  // stars
  L.stars.forEach((s,i)=>{ if(G.stars.has(i)) return; const bob=Math.sin(t*3+i)*ts*.05, im=img('m-star'), h=ts*.62*(1+.06*Math.sin(t*5+i));
    shadow(c,X(s.x+.5),Y(s.y+.82),ts*.16); if(ready(im)) sprite(c,im,X(s.x+.5),Y(s.y+.82)+bob,h); else { c.font=`${ts*.5}px serif`; c.textAlign='center'; c.fillText('⭐',X(s.x+.5),Y(s.y+.7)+bob); } });
  // key
  if(!G.key){ const k=L.key, bob=Math.sin(t*3)*ts*.07, im=img('m-key');
    const g=c.createRadialGradient(X(k.x+.5),Y(k.y+.5),ts*.05,X(k.x+.5),Y(k.y+.5),ts*.6); g.addColorStop(0,'rgba(255,230,90,.8)'); g.addColorStop(1,'rgba(255,230,90,0)'); c.fillStyle=g; c.beginPath(); c.arc(X(k.x+.5),Y(k.y+.5),ts*.6,0,7); c.fill();
    shadow(c,X(k.x+.5),Y(k.y+.86),ts*.18); if(ready(im)) sprite(c,im,X(k.x+.5),Y(k.y+.85)+bob,ts*.7); else { c.font=`${ts*.55}px serif`; c.textAlign='center'; c.fillText('🗝️',X(k.x+.5),Y(k.y+.7)+bob); } }
  // challengers + player sorted by y
  const ents=[];
  L.npcs.forEach(n=>{ const a=G.anim[n.idx]; if(G.defeated.has(n.idx)&&(!a||a.t>1.2)) return; ents.push({y:n.y+1,fn:()=>drawNpc(c,n,X,Y)}); });
  ents.push({y:G.py+.5,fn:()=>drawPlayer(c,X,Y)});
  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.fn());
  // particles
  c.textAlign='center'; c.textBaseline='middle';
  G.parts.forEach(p=>{ c.globalAlpha=Math.max(0,Math.min(1,p.l*1.6)); c.font=`${ts*.32}px serif`; c.fillText(p.ch,X(p.x),Y(p.y)); }); c.globalAlpha=1;
  G.pops.forEach(p=>{ const k=1.1-p.l; c.globalAlpha=Math.min(1,p.l*2); c.fillStyle='#fff'; c.strokeStyle='#0a2a66'; c.lineWidth=ts*.06; c.font=`800 ${ts*.34}px "Baloo 2",Arial,sans-serif`; const tx=p.txt.startsWith('mz_')?API.u(p.txt):p.txt; c.strokeText(tx,X(p.x),Y(p.y-k*.9)); c.fillText(tx,X(p.x),Y(p.y-k*.9)); }); c.globalAlpha=1;
}
function drawNpc(c,n,X,Y){
  const a=G.anim[n.idx], im=img('m-npc-'+G.level.npcs[n.idx].type); let ox2=0, oy2=0, al=1, sc=1;
  if(G.defeated.has(n.idx)&&a){ const k=Math.min(1,a.t/1.1); ox2=a.dx*k*ts; oy2=a.dy*k*ts-Math.sin(k*3.14)*ts*.4; al=1-k*k; sc=1-k*.25; }
  const bounce=G.defeated.has(n.idx)?0:Math.abs(Math.sin(G.t*3+n.idx))*ts*.07, cxp=X(n.x+.5)+ox2, bot=Y(n.y+.98)+oy2;
  shadow(c,cxp,bot,ts*.3*al);
  sprite(c,im,cxp,bot-bounce,ts*1.08*sc,false,al);
  if(!G.defeated.has(n.idx)){ const by=bot-ts*1.3-bounce; c.font=`800 ${ts*.4}px "Baloo 2",Arial,sans-serif`; c.textAlign='center'; c.textBaseline='middle';
    c.fillStyle='#fff'; c.strokeStyle='#0a2a66'; c.lineWidth=ts*.07; rr(c,cxp-ts*.2,by-ts*.22,ts*.4,ts*.42,ts*.12); c.fill(); c.stroke(); c.fillStyle='#e0334c'; c.fillText(G.level.npcs[n.idx].type==='final'?'!!':'!',cxp,by); }
}
function drawPlayer(c,X,Y){
  const hero=API.S.hero, d=G.dir, im=img(`m-${hero}-${dirImg(d)}`);
  let flip=false; if(d==='left') flip=FACES_RIGHT[hero]; if(d==='right') flip=!FACES_RIGHT[hero];
  const bob=G.moving?Math.abs(Math.sin(G.walk))*ts*.07:Math.sin(G.t*2)*ts*.012, tilt=G.moving?Math.sin(G.walk)*.07:0, x=X(G.px), bot=Y(G.py+.46);
  shadow(c,x,bot,ts*.27);
  c.save(); c.translate(x,bot-bob); c.rotate(tilt); c.translate(-x,-(bot-bob));
  sprite(c,im,x,bot-bob,ts*1.08,flip); c.restore();
}
function loop(now){
  raf=requestAnimationFrame(loop);
  if(!G||!cv||!document.body.contains(cv)) return;
  const dt=Math.min(.033,(now-lastT)/1000||0); lastT=now;
  update(dt); draw();
}

/* ═══════════ layout / mount ═══════════ */
function fit(){
  if(!cv||!G) return; const wrap=cv.parentElement; wrapW=wrap.clientWidth||320;
  const availH=Math.max(260,window.innerHeight*.66), cols=G.lay.W+2*MG, rows=G.lay.H+2*MG;
  ts=Math.max(12,Math.floor(Math.min(wrapW/cols,availH/rows))); dpr=Math.min(2,window.devicePixelRatio||1);
  const cw=Math.round(ts*cols), ch=Math.round(ts*rows); cv.style.width=cw+'px'; cv.style.height=ch+'px'; cv.width=Math.round(cw*dpr); cv.height=Math.round(ch*dpr);
  ox=MG*ts; oy=MG*ts; prerender();
}
MZ.mount = function(){
  cv=document.getElementById('mzCanvas'); if(!cv||!G) return; cx=cv.getContext('2d');
  ['up','down','left','right'].forEach(()=>0);
  ['m-star','m-key'].forEach(img); ['raka','salsa','maya','dimas'].forEach(h=>['down','up','side'].forEach(s=>img(`m-${h}-${s}`)));
  ['persuader','trickster','stranger','rumor','final'].forEach(n=>img('m-npc-'+n)); ['tree','pink','pine','bush','flowers','lamp','cone'].forEach(k=>img('m-d-'+k));
  fit(); hud(); if(G.enc) renderModal();
  // images may finish loading after the first draw: rebuild the static layer once they do
  [...Object.values(IM)].forEach(i=>{ if(!i.complete) i.addEventListener('load',()=>{ if(cv&&G&&document.body.contains(cv)) prerender(); },{once:true}); });
  cancelAnimationFrame(raf); lastT=performance.now(); raf=requestAnimationFrame(loop);
};
MZ.stop = function(){ cancelAnimationFrame(raf); raf=0; pressed.length=0; if(G&&!G.done) snap(); cv=null; };
window.addEventListener('resize',()=>{ if(cv&&G){ clearTimeout(MZ._rt); MZ._rt=setTimeout(fit,120); } });

/* ═══════════ HUD ═══════════ */
function hud(){
  const set=(id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
  set('mzStars',`${G.stars.size}/${G.lay.stars.length}`); set('mzKey',G.key?'✅':'⬜'); set('mzEnc',`${G.defeated.size}/${G.lay.npcs.length}`);
  const ex=document.getElementById('mzGate'); if(ex) ex.textContent=canExit()?'🚪✅':'🔒';
}

/* ═══════════ input ═══════════ */
function press(d){ const i=pressed.indexOf(d); if(i>=0) pressed.splice(i,1); pressed.push(d); }
function release(d){ const i=pressed.indexOf(d); if(i>=0) pressed.splice(i,1); }
MZ.snapshot=()=>{ try{ snap(); }catch(e){} };
MZ.clearKeys=()=>{ pressed.length=0; }; MZ.press=press; MZ.release=release; MZ.held=()=>pressed.slice();
const KEYMAP={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
document.addEventListener('keydown',e=>{
  if(!cv||!G||API.S.view!=='maze'||document.getElementById('aboutModal')) return; const tag=(e.target.tagName||'').toLowerCase(); if(tag==='input'||tag==='textarea') return;
  if(G.enc){ const n=parseInt(e.key,10); if(n>=1&&n<=4){ pickPos(n-1); e.preventDefault(); } else if(e.key==='Enter'){ const b=document.querySelector('[data-mz=cont]'); if(b) b.click(); } else if(e.key==='Escape') stepBack(); return; }
  const d=KEYMAP[e.key]; if(d){ e.preventDefault(); if(!e.repeat||!pressed.includes(d)) press(d); }
});
document.addEventListener('keyup',e=>{ const d=KEYMAP[e.key]; if(d) release(d); });
window.addEventListener('blur',()=>{ pressed.length=0; });
document.addEventListener('pointerdown',e=>{ const b=e.target.closest('[data-dir]'); if(b&&cv){ e.preventDefault(); press(b.dataset.dir); b.setPointerCapture&&b.setPointerCapture(e.pointerId); } });
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>document.addEventListener(ev,e=>{ const b=e.target.closest&&e.target.closest('[data-dir]'); if(b) release(b.dataset.dir); }));
// swipe / drag on the maze moves the hero too (handy on phones)
(function(){ let sx=0,sy=0,cur=null,id=null;
  document.addEventListener('pointerdown',e=>{ if(e.target===cv&&cv&&!G.enc){ sx=e.clientX;sy=e.clientY;id=e.pointerId; cv.setPointerCapture&&cv.setPointerCapture(id); } });
  document.addEventListener('pointermove',e=>{ if(id!==e.pointerId||!cv) return; const dx=e.clientX-sx, dy=e.clientY-sy; if(Math.hypot(dx,dy)<14) return;
    const d=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'); if(d!==cur){ if(cur) release(cur); cur=d; press(d); } });
  ['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,e=>{ if(id===e.pointerId){ if(cur) release(cur); cur=null; id=null; } }));
})();

/* ═══════════ encounters ═══════════ */
function qDef(){ return G.level.npcs[G.enc.npc].qs[G.enc.qi]; }
function shuffled(n){ const a=[...Array(n).keys()]; for(let i=n-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function startEnc(i){
  pressed.length=0; G.paused=true; G.moving=false;
  G.enc={npc:i,qi:0,order:shuffled(4),tries:0,picked:[],done:false,hint:false};
  API.sfx.click(); renderModal(); snap();
}
function newQ(){ G.enc.order=shuffled(4); G.enc.tries=0; G.enc.picked=[]; G.enc.done=false; G.enc.hint=false; }
function pickPos(pos){ if(!G||!G.enc) return; pick(G.enc.order[pos]); }
function pick(i){
  const e=G.enc; if(!e||e.done||e.picked.includes(i)) return; const q=qDef(); e.picked.push(i);
  if(i===q.ok){
    e.done=true; const pts=e.tries===0?20:10, stars=e.tries===0?2:1; G.encStars+=stars; API.sfx.good();
    API.recordEnc(G.lv,`${e.npc}.${e.qi}`,pts,q.cat,G.level.npcs[e.npc].qs.length>1?0:0);
    e.pts=pts; e.stars=stars; pop(G.lay.npcs[e.npc].x+.5,G.lay.npcs[e.npc].y,`+${stars} ⭐`); G.parts.length<60&&burst(G.lay.npcs[e.npc].x+.5,G.lay.npcs[e.npc].y+.5,'⭐');
  } else { e.tries++; G.wrong++; API.sfx.no(); }
  renderModal(); snap();
}
function stepBack(){ if(!G||!G.enc) return; G.coolNpc=G.enc.npc; G.enc=null; G.paused=false; closeModal(); snap(); }
function cont(){
  const e=G.enc; if(!e||!e.done) return; const n=G.level.npcs[e.npc];
  if(e.qi<n.qs.length-1){ e.qi++; newQ(); API.sfx.click(); renderModal(); snap(); return; }
  const ln=G.lay.npcs[e.npc]; // challenger steps aside into the nearest wall alcove
  let best=null; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const wx=ln.x+dx, wy=ln.y+dy; if(solid(wx,wy)&&!(wx===G.lay.exit.x&&wy===G.lay.exit.y)){ best=[dx,dy]; if(Math.abs(dx)!==Math.abs(Math.round(G.px-(ln.x+.5)))) break; } }
  if(!best){ best=[G.px<ln.x+.5?1:-1,0]; }
  G.defeated.add(ln.idx); G.anim[ln.idx]={t:0,dx:best[0]*.9,dy:best[1]*.9}; burst(ln.x+.5,ln.y+.5,'✨'); burst(ln.x+.5,ln.y+.5,'⭐');
  API.sfx.win(); G.enc=null; G.paused=false; G.coolNpc=-1; closeModal(); hud(); snap();
  if(canExit()) API.toast(()=>t('gate'));
}
function closeModal(){ const m=document.getElementById('mzModal'); if(m){ m.innerHTML=''; m.classList.remove('open'); } }
function hintClick(){
  const e=G.enc; if(!e) return; const key=`${e.npc}.${e.qi}`;
  if(e.hint||G.hint[key]){ e.hint=true; renderModal(); return; }
  if(API.S.shields>0){ API.S.shields--; G.hint[key]=true; e.hint=true; API.sfx.star(); API.achWise(); }
  else { e.noShield=true; API.sfx.no(); }
  renderModal(); snap();
}
function renderModal(){
  const host=document.getElementById('mzModal'); if(!host||!G||!G.enc) return;
  const e=G.enc, npc=G.level.npcs[e.npc], q=qDef(), L=API.L, nq=npc.qs.length, key=`${e.npc}.${e.qi}`;
  const names=API.D.npcNames[npc.type], role=API.D.npcRole[npc.type];
  let h=`<div class="mz-backdrop"><div class="mz-panel" role="dialog" aria-modal="true">
   <div class="mz-npc"><img src="img/m-npc-${npc.type}.png" alt=""><span class="tag">${API.esc(L(names))}</span><small>${API.esc(L(role))}</small></div>
   <div class="mz-main">${nq>1?`<div class="dots">${npc.qs.map((_,i)=>`<i class="${i<e.qi||(i===e.qi&&e.done)?'done':''} ${i===e.qi?'on':''}"></i>`).join('')}</div>`:''}
   <div class="mz-bubble">${API.esc(L(q.say))}</div><h3>🤔 ${API.esc(L(q.q))}</h3><div class="opts">`;
  e.order.forEach((oi,pos)=>{ const picked=e.picked.includes(oi); const right=oi===q.ok; let cls='opt'; if(picked) cls+=right?' good':' soft'; else if(e.done) cls+=' dim';
    h+=`<button class="${cls}" data-mz="opt" data-i="${oi}" ${picked||e.done?'disabled':''}><span class="k">${'ABCD'[pos]}</span><span>${API.esc(L(q.opts[oi]))}</span></button>`; });
  h+='</div>';
  const last=e.picked[e.picked.length-1];
  if(last!==undefined){ const right=last===q.ok; h+=`<div class="fb ${right?'good':'soft'}"><b class="h">${right?'✅ '+t('right'):'💭 '+t('again')}</b>${API.esc(L(q.fb[last]))}${right?`<br><b>+${e.pts} ${API.esc(L(API.catName(q.cat)))} · ${'⭐'.repeat(e.stars)}</b>`:''}</div>`; }
  if(e.hint||G.hint[key]) h+=`<div class="hintbox">💡 <b>${t('hint')}:</b> ${API.esc(L(q.hint))}</div>`;
  if(e.noShield) h+=`<div class="hintbox">🛡️ ${t('noShield')}</div>`;
  h+=`<div class="row">`;
  if(!e.done){ h+=`<button class="btn sm yellow" data-mz="hint">💡 ${e.hint||G.hint[key]?t('hint'):t('useShield')} (🛡️ ${API.S.shields})</button><button class="btn sm teal" data-mz="learn">📚 ${t('learn')}</button><button class="btn sm" data-mz="back">↩ ${t('back')}</button>`; }
  else h+=`<button class="btn big blue" data-mz="cont" autofocus>${e.qi<nq-1?t('nextQ'):t('cont')} ➜</button>`;
  h+='</div></div></div></div>';
  host.innerHTML=h; host.classList.add('open');
  const f=host.querySelector('[data-mz=cont]'); if(f) f.focus({preventScroll:true});
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-mz]'); if(!b||!G) return; const a=b.dataset.mz;
  if(a==='opt') pick(+b.dataset.i); else if(a==='hint') hintClick(); else if(a==='back') stepBack(); else if(a==='cont') cont();
  else if(a==='learn'){ snap(); API.openLearn(qDef().mod||G.level.mod); }
});

/* ═══════════ level complete ═══════════ */
function finish(){
  if(G.done) return; G.done=true; pressed.length=0;
  const res={lv:G.lv,stars:G.stars.size,totalStars:G.lay.stars.length,encStars:G.encStars,wrong:G.wrong,key:true,npcs:G.lay.npcs.length};
  API.S.mz=null; API.completeLevel(res);
}

MZ.init = function(api){ API=api; };
MZ.state = () => G;
MZ._test = { get G(){return G;}, solid, npcAt, update, press, release, pick, pickPos, cont, startEnc, stepBack, canExit, finish, blockedAt };
})();
