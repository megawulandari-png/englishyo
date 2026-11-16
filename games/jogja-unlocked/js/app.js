/* JOGJA UNLOCKED — game logic & rendering (vanilla JS). Data lives in content.js, saves in state.js */
(function () {
  'use strict';
  const C = window.JU_CONTENT, S = window.JUState;
  let M = C.MISSIONS[0], F = M.final;
  const SC = C.SCORING;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ui = n => C.ASSETS.ui(n);
  const screenEl = $('#screen');
  let st = S.load();
  const lateInit = () => {};
  const STABLE = ['map', 'recommend', 'reward'];
  let dlg = { idx: 0, lastWho: null };
  let desk = { tab: 'prambanan', cur: 0 };
  const useMission = id => { M = C.MISSIONS.find(m => m.id === id) || C.MISSIONS[0]; F = M.final; desk = { tab: M.tourist.options[0], cur: 0 }; };
  const missionIdx = id => C.MISSIONS.findIndex(m => m.id === id);
  const unlocked = id => { const i = missionIdx(id); return i <= 0 || !!(st.progress.missions[C.MISSIONS[i - 1].id] && st.progress.missions[C.MISSIONS[i - 1].id].completed); };
  const nextMission = () => C.MISSIONS[missionIdx(M.id) + 1] || null;
  const wants = T => T.plural ? 'want' : 'wants';
  const startMission = (id, intro) => { const m = C.MISSIONS.find(x => x.id === id); useMission(id); st.run = S.newRun(id, m.tourist.options); recFb = null; save(); go(intro ? 'intro' : 'arrive'); };
  let recFb = null;       // feedback on recommend screen
  let modal = null;       // { prevFocus, onClose }

  /* ------------------------------------------------------------ helpers */
  const agent = () => C.AGENTS.find(a => a.id === st.profile.agent) || C.AGENTS[0];
  const myName = () => (st.profile.nick && st.profile.nick.trim()) || agent().label;
  const sub = t => t.replace(/\{name\}/g, myName());
  const announce = msg => { const l = $('#live'); l.textContent = ''; setTimeout(() => { l.textContent = msg; }, 30); };
  const letter = i => 'ABCD'[i];
  const rank = () => { let r = C.RANKS[0]; C.RANKS.forEach(x => { if (st.progress.stars >= x.stars) r = x; }); return r; };
  const spriteBtn = (name, label, action, extra) =>
    `<button type="button" class="btn-sprite" data-action="${action}" aria-label="${esc(label)}" ${extra || ''}><img src="${ui(name)}" alt="" height="64"></button>`;
  const place = id => C.PLACES[id];
  const tasksDone = () => M.tasks.filter(t => st.run && st.run.tasks[t.id]).length;
  const allTasksDone = () => st.run && tasksDone() === M.tasks.length;

  function save() { S.save(); }
  function updateHud() {
    const hud = $('#hud'), show = st.screen !== 'title';
    hud.hidden = !show;
    $('#hudRank').textContent = rank().name;
    const av = $('#hudAvatar'); if (st.profile.agent) { av.src = agent().img; av.alt = agent().label; av.hidden = false; } else av.hidden = true;
    $('#hudCoins').textContent = st.progress.coins;
    $('#hudStars').textContent = st.progress.stars;
    $('#hudCoinImg').src = ui('coin'); $('#hudStarImg').src = ui('star');
  }
  function go(name, opts) {
    closeModal(true);
    st.screen = name;
    if (STABLE.includes(name)) save();
    document.body.classList.toggle('is-title', name === 'title');
    updateHud();
    R[name](opts || {});
    window.scrollTo(0, 0);
    const h = $('h1,h2', screenEl);
    if (h && !screenEl.contains(document.activeElement)) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  function confetti() {
    if (reduceMotion) return;
    const box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    const cols = ['#f2b632', '#ff6f91', '#46c06a', '#3b8de0', '#7b5cc4'];
    for (let i = 0; i < 42; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % cols.length];
      p.style.animationDuration = 2.2 + Math.random() * 2 + 's'; p.style.animationDelay = Math.random() * .6 + 's';
      box.appendChild(p);
    }
    document.body.appendChild(box); setTimeout(() => box.remove(), 5200);
  }

  /* ------------------------------------------------------------ agent art (3D PNG characters) */
  const agentImg = (cls, a) => { a = a || agent(); return `<img class="agent-fig ${cls || ''}" src="${a.img}" alt="${esc(a.a11y)}">`; };

  /* ------------------------------------------------------------ modal system */
  function openModal(html, o) {
    o = o || {};
    closeModal(true);
    const root = $('#modalRoot');
    root.innerHTML = `<div class="overlay" data-overlay><div class="modal ${o.cls || ''}" role="dialog" aria-modal="true" aria-labelledby="mTitle">
      <button type="button" class="modal-close" data-action="close" aria-label="Close">✕</button>${html}</div></div>`;
    modal = { prevFocus: document.activeElement, onClose: o.onClose };
    document.body.style.overflow = 'hidden';
    const t = $('#mTitle', root); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }
  function closeModal(silent) {
    const root = $('#modalRoot');
    if (!modal) { root.innerHTML = ''; return; }
    const m = modal; modal = null;
    root.innerHTML = ''; document.body.style.overflow = '';
    if (!silent) {
      if (m.onClose) m.onClose();
      else if (m.prevFocus && document.contains(m.prevFocus)) m.prevFocus.focus();
    }
  }
  function setModalHtml(html, focusSel) {
    const mod = $('.modal'); if (!mod) return;
    const keep = mod.scrollTop;
    mod.innerHTML = `<button type="button" class="modal-close" data-action="close" aria-label="Close">✕</button>` + html;
    mod.scrollTop = keep;
    const f = focusSel && $(focusSel, mod); if (f) { f.setAttribute('tabindex', f.getAttribute('tabindex') || '-1'); f.focus({ preventScroll: false }); }
  }

  /* ------------------------------------------------------------ screens */
  const R = {};

  R.title = function () {
    const has = S.hasSave();
    screenEl.innerHTML = `<section class="screen title-wrap" aria-labelledby="ttl">
      <div class="title-card">
        <img class="title-pin" src="${ui('pin_iso')}" alt="" width="64">
        <div class="presented">English Yo! presents</div>
        <h1 class="logo" id="ttl">JOGJA<br>UNLOCKED</h1>
        <div class="logo-sub">The Travel Agent Challenge</div>
        <p class="tagline">Every traveler has a story. Every destination holds a clue.</p>
        <div class="row center">
          ${spriteBtn('btn_start', has ? 'Continue adventure' : 'Start adventure', has ? 'continue' : 'start')}
        </div>
        <div class="row center" style="margin-top:12px"><button class="btn purple learn-btn" type="button" data-action="openLearn">Learn Before You Play</button></div>
        <p class="save-note" style="margin-top:6px">${st.learn && st.learn.complete ? 'Lesson completed. You can review it any time.' : 'New? Try the quick lesson: Descriptive Text.'}</p>
        ${has ? `<div class="row center" style="margin-top:12px"><button class="btn" type="button" data-action="start">Restart story</button><button class="btn" type="button" data-action="askReset">Reset progress</button></div>
        <p class="save-note">Saved on this device: ${esc(myName())}, ${esc(rank().name)}.</p>` : `<p class="save-note">Your progress is saved on this device.</p>`}
        ${S.storageOk() ? '' : '<p class="save-note">Saving is turned off in this browser. You can still play.</p>'}
      </div></section>`;
  };

  R.agent = function () {
    const sel = st.profile.agent;
    screenEl.innerHTML = `<section class="screen panel agent-screen" aria-labelledby="h">
      <h2 id="h">Choose your travel agent</h2>
      <p class="lead">Who will help the travelers of Jogja today?</p>
      <fieldset class="agent-grid"><legend class="sr">Travel agent</legend>
        ${C.AGENTS.map((a, i) => `<label class="agent-card" style="--d:${i * .5}s"><input type="radio" name="agent" value="${a.id}" data-change="agent" ${sel === a.id ? 'checked' : ''}>
          <span class="card"><span class="badge-sel" aria-hidden="true">\u2713 Your agent</span>
            <span class="fig"><span class="glow" aria-hidden="true"></span>${agentImg('', a)}</span>
            <b>${esc(a.label)}</b><small>${esc(a.desc)}</small></span></label>`).join('')}
      </fieldset>
      <p class="chosen" id="chosen" aria-live="polite">${sel ? esc(agent().label) + ' is ready for the first day!' : 'Tap a character to choose your agent.'}</p>
      <div class="row" style="justify-content:space-between; align-items:flex-end">
        <div class="field"><label for="nick">Nickname (optional)</label>
          <input id="nick" type="text" maxlength="14" autocomplete="off" placeholder="Your agent name" value="${esc(st.profile.nick)}"></div>
        <div class="row">${spriteBtn('btn_start', 'Start your first day', 'agentOk', sel ? '' : 'disabled')}</div>
      </div>
    </section>`;
  };

  /* --- dialogue scenes --- */
  const intro = () => [
    ...M.introLines.slice(0, 3).map(t => ({ who: 'mgr', text: t })),
    { who: 'me', text: 'Thank you, Pak Wijaya! I will read carefully and give a reason for every choice.' },
    { who: 'mgr', text: M.introLines[3] }
  ];
  const arrive = () => [
    ...(M.mgrLine ? [{ who: 'mgr', text: M.mgrLine }] : []),
    ...M.arriveLines.map(t => ({ who: 'tourist', text: t })),
    { who: 'me', text: M.meLine || ('Nice to meet you, ' + M.tourist.name + '! Let me read about some places in Jogja for you.') }
  ];
  function actorFor(who) {
    if (who === 'mgr') return { name: M.manager.name, html: `<img src="${M.manager.sprite}" alt="${esc(M.manager.alt)}">` };
    if (who === 'tourist') return { name: M.tourist.name, html: `<img src="${M.tourist.sprite}" alt="${esc(M.tourist.alt)}">` };
    return { name: myName(), html: agentImg('') };
  }
  function renderDialogue(lines, key, onDone) {
    const l = lines[dlg.idx], a = actorFor(l.who), last = dlg.idx === lines.length - 1;
    const enter = dlg.lastWho !== l.who ? 'enter-left' : '';
    dlg.lastWho = l.who;
    screenEl.innerHTML = `<section class="screen" aria-label="Conversation">
      <div class="scene"><div class="actor ${enter}">${a.html}<div class="shadow"></div></div>
        <div class="bubble"><span class="speaker">${esc(a.name)}</span><h2 class="sr">${esc(a.name)} says</h2>
          <p>${esc(sub(l.text))}</p>
          <div class="row"><div class="dots" aria-hidden="true">${lines.map((_, i) => `<i class="${i <= dlg.idx ? 'on' : ''}"></i>`).join('')}</div>
            <button type="button" class="linklike" data-action="skipDlg">Skip</button>
            ${spriteBtn('btn_next', last ? 'Continue' : 'Next', 'nextDlg')}</div></div></div></section>`;
    screenEl.dataset.dlg = key;
    announce(a.name + ': ' + sub(l.text));
    const nb = $('[data-action=nextDlg]'); if (nb) nb.focus({ preventScroll: true });
    R._dlgDone = onDone; R._dlgLines = lines; R._dlgKey = key;
  }
  R.intro = function () { dlg = { idx: 0, lastWho: null }; renderDialogue(intro(), 'intro', () => go('arrive')); };
  R.arrive = function () { dlg = { idx: 0, lastWho: null }; renderDialogue(arrive(), 'arrive', () => go('brief')); };

  R.brief = function () {
    const T = M.tourist;
    screenEl.innerHTML = `<section class="screen panel" aria-labelledby="h">
      <div class="mission-grid"><div class="portrait duo enter-left">${agentImg('')}<img src="${T.sprite}" alt="${esc(T.alt)}"></div>
        <div><span class="skill">Mission ${M.num || 1} of ${C.MISSIONS.length} &middot; New customer</span><h2 id="h">${esc(M.title)}</h2>
          <dl class="kv"><dt>Traveler</dt><dd>${esc(T.name)}</dd>
            <dt>Loves</dt><dd>${T.loves.map(x => `<span class="tag love">${esc(x)}</span>`).join('')}</dd>
            <dt>Dislikes</dt><dd>${T.dislikes.map(x => `<span class="tag hate">${esc(x)}</span>`).join('')}</dd>
            <dt>Goal</dt><dd>${esc(T.goal)}</dd>
            <dt>Places to compare</dt><dd>${T.options.map(o => `<span class="tag">${esc(place(o).name)}</span>`).join('')}</dd></dl>
          <p class="hint"><b>How to play:</b> open the map, read about both places, finish the ${M.tasks.length} reading tasks, then recommend the best place <i>and</i> give the best reason.</p>
          <p class="hint">New to descriptive texts? <button type="button" class="linklike" data-action="openLearn">${st.learn && st.learn.complete ? 'Review the lesson' : 'Open the quick lesson first'}</button></p>
          <div class="row" style="margin-top:14px">${spriteBtn('btn_start', 'Open the map', 'toMap')}</div></div></div></section>`;
  };

  /* --- map --- */
  function sideHtml() {
    const r = st.run, T = M.tourist, ready = allTasksDone();
    const dest = M.tourist.options.map(id => {
      const p = place(id), rd = r.read[id];
      return `<button type="button" class="dest-btn" data-action="openDest" data-id="${id}"><img src="${p.img}" alt=""><span><b>${esc(p.name)}</b><small>${rd ? 'Read' : 'Not read yet'}</small></span></button>`;
    }).join('') + `<p class="save-note" style="margin:4px 2px 0">Greyed pins are places for other missions.</p>`;
    return `<div class="panel"><div class="mini-tourist"><img class="duo-agent" src="${agent().img}" alt=""><img src="${T.sprite}" alt=""><div><b>${esc(T.name)}</b> ${wants(T)}<br>${T.loves.map(x => `<span class="tag love">${esc(x)}</span>`).join('')}<br>${T.dislikes.map(x => `<span class="tag hate">${esc(x)}</span>`).join('')}</div></div></div>
      <div class="panel"><h3>Your progress</h3><ul class="checklist">
        ${M.tourist.options.map(id => `<li class="${r.read[id] ? 'done' : ''}"><span class="tick" aria-hidden="true">${r.read[id] ? '✓' : ''}</span>Read ${esc(place(id).name)}</li>`).join('')}
        <li class="${ready ? 'done' : ''}"><span class="tick" aria-hidden="true">${ready ? '✓' : ''}</span>Reading tasks: ${tasksDone()} / ${M.tasks.length}</li></ul>
        <div class="row" style="margin-top:12px"><button type="button" class="btn purple" id="btnDesk" data-action="openDesk">Open Research Desk</button><button type="button" class="btn" data-action="openLearn">Review lesson</button></div></div>
      <div class="panel"><h3>Destinations</h3><div class="dest-list">${dest}</div></div>
      <div class="panel"><div class="row" style="justify-content:space-between">${spriteBtn('btn_choose', 'Make a recommendation', 'toRecommend', ready ? '' : 'disabled aria-describedby="recHint"')}</div>
        <p class="hint" id="recHint" style="margin-top:10px">${ready ? 'You are ready! Choose the best place for ' + esc(T.name) + '.' : 'Read both places and finish all ' + M.tasks.length + ' tasks to unlock this.'}</p></div>`;
  }
  R.map = function () {
    const pins = M.tourist.options.map(id => { const p = place(id); return `<button type="button" class="pin active" style="left:${p.pin.x}%;top:${p.pin.y}%" data-action="openDest" data-id="${id}" aria-label="${esc(p.name)}"><img src="${ui('pin_round')}" alt=""><span class="lbl">${esc(p.name)}</span></button>`; }).join('')
      + Object.values(C.PLACES).filter(p => !M.tourist.options.includes(p.id)).map(p => `<button type="button" class="pin locked" style="left:${p.pin.x}%;top:${p.pin.y}%" data-action="openLocked" data-id="${p.id}" aria-label="${esc(p.name)} (not in this mission)"><img src="${ui('pin_round')}" alt=""><span class="lbl">${esc(p.name)}</span></button>`).join('');
    screenEl.innerHTML = `<section class="screen" aria-labelledby="h"><h2 id="h" class="sr">Explore Jogja</h2>
      <div class="map-layout"><div class="map-wrap"><img src="${C.ASSETS.map}" alt="Isometric illustration of Yogyakarta with a monument in the middle, shops, a palace, a water castle, a temple complex, a volcano and a beach">${pins}</div>
        <div class="side" id="mapSide">${sideHtml()}</div></div></section>`;
  };
  function refreshSide() { const s = $('#mapSide'); if (s) s.innerHTML = sideHtml(); }

  function openDest(id) {
    const p = place(id);
    openModal(`<div class="dest-hero"><img src="${p.img}" alt="${esc(p.alt)}"><div>
      <h2 id="mTitle">${esc(p.name)}</h2><p class="lead">${esc(p.teaser)}</p>
      <div>${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <p>${st.run.read[id] ? 'You have already read this text. You can read it again any time.' : 'Read the text carefully. It holds clues for ${esc(st.run.mission && M.tourist.name)}.'}</p>
      <div class="row">${spriteBtn('btn_read', 'Read about ' + p.name, 'openDesk', `data-tab="${id}"`)}</div></div></div>`, { cls: 'sm', onClose: refreshAfterModal });
  }
  function openLocked(id) {
    const p = place(id), mi = C.MISSIONS.findIndex(m => m.stamp === id), done = mi >= 0 && st.progress.missions[C.MISSIONS[mi].id] && st.progress.missions[C.MISSIONS[mi].id].completed;
    const msg = done ? 'You already finished the mission for this place. You can replay it from the Menu (Choose mission).'
      : (mi >= 0 && mi > missionIdx(M.id) ? 'This place is the star of a later mission.' : 'This place is not part of this mission.');
    openModal(`<h2 id="mTitle">${esc(p.name)}</h2><p>${esc(msg)} For now, help ${esc(M.tourist.name)} with <b>${esc(place(M.tourist.options[0]).name)}</b> and <b>${esc(place(M.tourist.options[1]).name)}</b>.</p><div class="row"><button class="btn purple" type="button" data-action="close">OK</button></div>`, { cls: 'sm' });
  }
  function refreshAfterModal() {
    if (st.screen === 'map') { refreshSide(); const b = $('#btnDesk'); if (b) b.focus(); }
  }

  /* --- research desk --- */
  function passageHtml(p) {
    const used = {};
    return p.passage.map(par => {
      let h = esc(par);
      Object.keys(p.glossary).forEach(w => {
        if (used[w]) return;
        const re = new RegExp('\\b(' + w + ')\\b', 'i');
        if (re.test(h)) { used[w] = 1; h = h.replace(re, '<button type="button" class="gloss" data-action="gloss" data-w="$1">$1</button>'); }
      });
      return `<p>${h}</p>`;
    }).join('');
  }
  function taskLocked(t) { return t.needs.some(id => !st.run.read[id]); }
  function deskHtml() {
    const r = st.run, p = place(desk.tab), t = M.tasks[desk.cur], ans = r.tasks[t.id];
    const tabs = M.tourist.options.map(id => `<button type="button" role="tab" id="tab-${id}" class="tab" aria-selected="${desk.tab === id}" aria-controls="passage" data-action="tab" data-id="${id}">${esc(place(id).name)}${r.read[id] ? ' ✓' : ''}</button>`).join('');
    const steps = M.tasks.map((x, i) => {
      const a = r.tasks[x.id], locked = taskLocked(x);
      return `<button type="button" class="step ${a ? (a.correct ? 'done' : 'bad') : ''}" data-action="goTask" data-i="${i}" ${i === desk.cur ? 'aria-current="true"' : ''} ${locked ? 'disabled' : ''}>Task ${i + 1}${a ? (a.correct ? ' ✓' : ' ✕') : ''}</button>`;
    }).join('');
    let body;
    if (taskLocked(t)) {
      const need = t.needs.filter(id => !r.read[id]).map(id => place(id).name).join(' and ');
      body = `<div class="locked-note">Task ${desk.cur + 1} is locked.<br>First read <b>${esc(need)}</b> and press &ldquo;I have read this text&rdquo;.</div>`;
    } else {
      body = `<span class="skill">${esc(t.skill)}</span><fieldset class="q"><legend id="qleg">${esc(t.prompt)}</legend>
        ${t.options.map((o, i) => {
          const cls = ans ? (o.id === t.correct ? 'right' : (o.id === ans.answer ? 'wrong' : '')) : '';
          return `<label class="opt ${cls}"><input type="radio" name="task" value="${o.id}" data-change="task" ${ans ? 'disabled' : ''} ${ans && ans.answer === o.id ? 'checked' : ''}><span data-k="${letter(i)}">${esc(o.text)}</span></label>`;
        }).join('')}</fieldset>`;
      if (ans) {
        body += `<div class="feedback ${ans.correct ? 'ok' : 'no'}" id="fb" tabindex="-1"><b>${ans.correct ? 'Correct!' : 'Not this time.'}</b> ${esc(ans.correct ? t.right : t.wrong)}</div>
          <div class="row" style="margin-top:12px">${desk.cur < M.tasks.length - 1 ? spriteBtn('btn_next', 'Next task', 'nextTask') : ''}</div>`;
      } else {
        body += `<div class="row">${spriteBtn('btn_submit', 'Submit answer', 'submitTask', 'id="btnSubmitTask" disabled')}</div>`;
      }
    }
    const done = allTasksDone();
    const notes = done ? `<div class="notes-card" style="margin-top:12px"><b>Your research notes</b><ul>${M.tasks.map(x => `<li>${esc(x.clue)}</li>`).join('')}</ul>
      <div class="row" style="margin-top:8px"><button type="button" class="btn purple" data-action="deskDone">Back to the map</button></div></div>` : '';
    return `<h2 id="mTitle">Research Desk</h2>
      <div class="desk"><div>
        <div class="tabs" role="tablist" aria-label="Places">${tabs}</div>
        <div class="passage" id="passage" role="tabpanel" aria-labelledby="tab-${desk.tab}">
          <h3><img src="${p.img}" alt="">${esc(p.name)}</h3>${passageHtml(p)}
          <div class="row" style="margin-top:10px">${r.read[desk.tab] ? '<span class="tag love">You have read this text ✓</span>' : '<button type="button" class="btn purple" data-action="markRead">I have read this text</button>'}</div>
          <div class="gloss-bar" id="glossBar" aria-live="polite">Tap a <span class="gloss" style="cursor:default">highlighted word</span> to see its meaning in Indonesian.</div></div></div>
        <div><h3 style="margin-top:0">Reading tasks</h3><div class="stepper">${steps}</div><div id="taskBody">${body}</div>${notes}</div></div>`;
  }
  function openDesk(tab) {
    if (tab && place(tab)) desk.tab = tab;
    if (!M.tasks.some((t, i) => { if (!st.run.tasks[t.id] && !taskLocked(t)) { desk.cur = i; return true; } return false; })) desk.cur = Math.min(desk.cur, M.tasks.length - 1);
    openModal(deskHtml(), { onClose: refreshAfterModal });
  }
  const redrawDesk = f => setModalHtml(deskHtml(), f);

  function submitTask() {
    const t = M.tasks[desk.cur], r = st.run;
    if (r.tasks[t.id] || taskLocked(t)) return;               // never score twice
    const chosen = $('input[name=task]:checked', $('.modal'));
    if (!chosen) return;
    const correct = chosen.value === t.correct;
    r.tasks[t.id] = { answer: chosen.value, correct }; save();
    announce(correct ? 'Correct. ' + t.right : 'Not this time. ' + t.wrong);
    redrawDesk('#fb');
    if (allTasksDone()) announce('All reading tasks complete. Your research notes are ready.');
  }

  /* --- recommendation --- */
  R.recommend = function () {
    if (!allTasksDone()) return go('map');
    const f = st.run.final, T = M.tourist;
    screenEl.innerHTML = `<section class="screen" aria-labelledby="h"><div class="rec-grid">
      <div class="panel"><h2 id="h">Make a recommendation</h2>
        <div class="mini-tourist"><img src="${T.sprite}" alt=""><div><b>${esc(T.name)}</b> loves ${T.loves.map(x => `<span class="tag love">${esc(x)}</span>`).join('')}<br>Dislikes: ${T.dislikes.map(x => `<span class="tag hate">${esc(x)}</span>`).join('')}</div></div>
        <div class="notes-card" style="margin-top:14px"><b>Your research notes</b><ul>${M.tasks.map(x => `<li>${esc(x.clue)}</li>`).join('')}</ul></div>
        <div class="rec-agent">${agentImg('')}<p>${esc(myName())}, use your notes to help ${esc(T.name)}!</p></div>
        <div class="row" style="margin-top:12px"><button class="btn" type="button" data-action="toMap">Back to the map</button><button class="btn" type="button" data-action="openDesk">Reread the texts</button><button class="btn" type="button" data-action="openLearn">Review lesson</button></div></div>
      <div class="panel"><form id="recForm" novalidate>
        <fieldset class="place-pick"><legend style="font-weight:800;font-size:1.15rem;margin-bottom:8px;grid-column:1/-1">1. Which place is best for ${esc(T.name)}?</legend>
          ${T.options.map(id => `<label class="place-opt"><input type="radio" name="place" value="${id}" data-change="place" ${f.place === id ? 'checked' : ''}><span class="pc"><img src="${place(id).img}" alt=""><b>${esc(place(id).name)}</b></span></label>`).join('')}</fieldset>
        <fieldset class="q" style="margin-top:16px"><legend>2. What is the strongest reason?</legend>
          ${F.reasons.map((o, i) => `<label class="opt"><input type="radio" name="reason" value="${o.id}" data-change="reason" ${f.reason === o.id ? 'checked' : ''}><span data-k="${letter(i)}">${esc(o.text)}</span></label>`).join('')}</fieldset>
        <div id="recFb" aria-live="polite">${recFbHtml()}</div>
        <div class="row" style="margin-top:12px">${spriteBtn('btn_submit', 'Submit recommendation', 'submitFinal', `id="btnFinal" ${f.place && f.reason ? '' : 'disabled'}`)}</div>
      </form></div></div></section>`;
  };
  function recFbHtml() {
    if (!recFb) return '';
    return `<div class="emma-react ${recFb.shake ? 'shake' : ''}"><img src="${M.tourist.sprite}" alt="${esc(M.tourist.name)}"><div class="bubble"><span class="speaker">${esc(M.tourist.name)}</span><p>${esc(recFb.text)}</p></div></div>`;
  }
  function submitFinal() {
    const r = st.run, f = r.final;
    if (r.completed || !f.place || !f.reason) return;
    f.submits++;
    const placeOK = f.place === F.correctPlace, reasonOK = f.reason === F.correctReason;
    if (f.submits === 1) { f.placeFirst = placeOK; f.reasonFirst = reasonOK; }
    save();
    if (placeOK && reasonOK) { recFb = null; return finish(); }
    let text;
    if (!placeOK) { text = F.placeWrong[f.place] || 'Hmm, that is not the best fit for me.'; f.place = null; }
    else { text = F.reasonWrongButPlaceRight + ' ' + (F.reasons.find(x => x.id === f.reason).fb); f.reason = null; }
    recFb = { text, shake: !reduceMotion };
    save(); R.recommend();
    announce(M.tourist.name + ' says: ' + text);
    const hh = $('#recFb'); if (hh) hh.scrollIntoView({ block: 'nearest' });
  }

  /* --- scoring & finish --- */
  function finish() {
    const r = st.run, f = r.final, P = st.progress;
    const taskPts = M.tasks.filter(t => r.tasks[t.id] && r.tasks[t.id].correct).length * SC.taskPoint;
    const placePts = f.placeFirst ? SC.firstTryPoints : SC.laterPoints;
    const reasonPts = f.reasonFirst ? SC.firstTryPoints : SC.laterPoints;
    const points = taskPts + placePts + reasonPts;
    let stars = 1; for (const [min, s] of SC.starsFor) { if (points >= min) { stars = s; break; } }
    const coins = points * SC.coinsPerPoint + SC.completionCoins;
    const prev = (P.missions[M.id] && P.missions[M.id].best) || { points: 0, stars: 0, coins: 0 };
    const dCoins = Math.max(0, coins - prev.coins), dStars = Math.max(0, stars - prev.stars);
    const before = rank().name;
    P.coins += dCoins; P.stars += dStars;
    if (!P.stamps.includes(M.stamp)) P.stamps.push(M.stamp);
    P.missions[M.id] = { completed: true, best: { points: Math.max(points, prev.points), stars: Math.max(stars, prev.stars), coins: Math.max(coins, prev.coins) } };
    r.completed = true;
    r.result = { points, stars, coins, dCoins, dStars, taskPts, placePts, reasonPts, tasksRight: taskPts / SC.taskPoint,
      happy: Math.max(1, Math.round(points / SC.maxPoints * 5)), rankBefore: before, rankAfter: rank().name, replay: prev.points > 0 };
    save();
    go('reaction');
  }

  R.reaction = function () {
    const res = st.run && st.run.result; if (!res) return go('map');
    screenEl.innerHTML = `<section class="screen" aria-labelledby="h"><div class="scene">
      <div class="actor duo">${agentImg('')}<img class="bounce" src="${M.tourist.sprite}" alt="${esc(M.tourist.alt)}"><div class="shadow"></div></div>
      <div class="bubble"><span class="speaker">${esc(M.tourist.name)}</span><h2 id="h" class="sr">${esc(M.tourist.name)}: reaction</h2>
        <p>${esc(sub(F.success))}</p>
        <div class="meter"><img src="${ui('smiley')}" alt=""><div class="segs" role="img" aria-label="Tourist happiness ${res.happy} out of 5">${[1, 2, 3, 4, 5].map(i => `<span class="seg" data-on="${i <= res.happy ? 1 : 0}"></span>`).join('')}</div></div>
        <div class="row">${spriteBtn('btn_next', 'See your rewards', 'toReward')}</div></div></div></section>`;
    $$('.seg', screenEl).forEach((s, i) => setTimeout(() => { if (s.dataset.on === '1') s.classList.add('on'); }, reduceMotion ? 0 : 300 + i * 220));
    confetti(); announce(M.tourist.name + (M.tourist.plural ? ' are happy! ' : ' is happy! ') + sub(F.success));
  };

  R.reward = function () {
    const res = st.run && st.run.result; if (!res) return go('map');
    const rankUp = res.rankBefore !== res.rankAfter;
    screenEl.innerHTML = `<section class="screen panel reward" aria-labelledby="h">
      <div class="reward-head">${agentImg('bounce')}<div><h2 id="h">Mission complete!</h2><p class="lead">${esc(M.title)}</p><p>Great work, <b>${esc(myName())}</b>!</p></div></div>
      <div class="stars-row" role="img" aria-label="${res.stars} out of 3 stars">${[1, 2, 3].map(i => `<img src="${ui('star')}" alt="" class="${i <= res.stars ? 'on' : ''}" style="animation-delay:${i * .25}s">`).join('')}</div>
      <div class="reward-top"><span class="coin-count"><img src="${ui('coin')}" alt=""><span id="coinNum">0</span><span class="sr"> coins earned: ${res.dCoins}</span></span>
        <div><img class="stamp-drop" src="${ui('stamp_' + M.stamp)}" alt="${esc(place(M.stamp).name)} passport stamp"></div></div>
      ${rankUp ? `<p><span class="rank-up">New rank: ${esc(res.rankAfter)}!</span></p>` : `<p>Rank: <b>${esc(res.rankAfter)}</b></p>`}
      <table class="score" aria-label="Score breakdown">
        <tr><td>Reading tasks correct (${res.tasksRight} of ${M.tasks.length})</td><td>${res.taskPts}</td></tr>
        <tr><td>Best place ${st.run.final.placeFirst ? '(first try)' : '(after a retry)'}</td><td>${res.placePts}</td></tr>
        <tr><td>Strongest reason ${st.run.final.reasonFirst ? '(first try)' : '(after a retry)'}</td><td>${res.reasonPts}</td></tr>
        <tr><td>Total points</td><td>${res.points} / ${SC.maxPoints}</td></tr></table>
      <p class="save-note">Coins = ${SC.coinsPerPoint} per point + ${SC.completionCoins} for finishing. Stars: 6+ points = 3, 4+ = 2, otherwise 1.${res.replay ? ' Replays only add what beats your personal best.' : ''}</p>
      <div class="row center" style="margin-top:12px">${spriteBtn('btn_next', 'Next', 'toEnd')}<button class="btn" type="button" data-action="openPassport">View passport</button></div></section>`;
    const el = $('#coinNum'), target = res.dCoins;
    if (reduceMotion || !target) el.textContent = target;
    else { const t0 = performance.now(); const tick = n => { const k = Math.min(1, (n - t0) / 900); el.textContent = Math.round(target * k); if (k < 1 && document.contains(el)) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
  };

  R.end = function () {
    const nx = nextMission(), all = C.MISSIONS.every(m => st.progress.missions[m.id] && st.progress.missions[m.id].completed);
    const tot = `<p>You have <b>${st.progress.coins}</b> coins and <b>${st.progress.stars}</b> stars, and your rank is <b>${esc(rank().name)}</b>.</p>`;
    const common = `<button class="btn" type="button" data-action="replay">Replay ${esc('Mission ' + M.num)}</button><button class="btn" type="button" data-action="openMissions">Choose mission</button><button class="btn" type="button" data-action="openPassport">View passport</button><button class="btn" type="button" data-action="toTitle">Title screen</button>`;
    const body = nx
      ? `<span class="skill">Mission ${M.num} of ${C.MISSIONS.length} complete</span><h2 id="h">Nice work, ${esc(myName())}!</h2>
        <p class="lead">A new traveler is on the way: <b>${esc(nx.title.replace(/^Mission \d+: /, ''))}</b>.</p>${tot}
        <div class="row">${spriteBtn('btn_next', 'Meet the next traveler', 'nextMission')}${common}</div>`
      : `<span class="skill">All ${C.MISSIONS.length} missions complete</span><h2 id="h">You are a Jogja travel expert, ${esc(myName())}!</h2>
        <p class="lead">Every traveler went home happy. You read carefully, compared places and gave reasons from the texts.</p>${tot}
        <p>Passport stamps: <b>${st.progress.stamps.length} of ${C.PASSPORT_SLOTS.length}</b>.</p><div class="row">${common}</div>`;
    screenEl.innerHTML = `<section class="screen panel" aria-labelledby="h"><div class="mission-grid">
      <div class="portrait duo">${agentImg('')}${nx ? `<img src="${nx.tourist.sprite}" alt="The next traveler, shown as a dark shadow" style="filter:brightness(0) opacity(.3)">` : `<img src="${M.tourist.sprite}" alt="${esc(M.tourist.alt)}">`}</div>
      <div>${body}</div></div></section>`;
  };

  /* --- passport / menu / about / reset --- */
  function openPassport() {
    openModal(`<h2 id="mTitle">Passport</h2><p>Finish a destination mission to earn its stamp.</p>
      <div class="passport">${C.PASSPORT_SLOTS.map(s => { const got = st.progress.stamps.includes(s.id);
        return `<div class="slot ${got ? 'got' : ''}">${got ? `<div><img src="${s.stamp}" alt="${esc(s.name)} stamp"><small>${esc(s.name)}</small></div>` : `<div>${esc(s.name)}<small>Locked</small></div>`}</div>`; }).join('')}</div>`, { cls: 'sm' });
  }
  function openAbout() {
    openModal(`<div class="info"><h2 id="mTitle">About</h2>
      <p class="lead">JOGJA UNLOCKED: The Travel Agent Challenge</p>
      <div class="info-sec"><p>An original educational game presented by <b>ENGLISH YO!</b> for junior high school students. Read descriptive texts, understand each place, and recommend the best destination with a reason from the text.</p></div>
      <p class="save-note">Prototype v0.2 &middot; Missions 1&ndash;5. Illustrations are stylised and are not real maps. See <b>Sources</b> and <b>Developer</b> in the footer for references and credits.</p>
      <div class="row"><button class="btn purple" type="button" data-action="close">Close</button></div></div>`, { cls: 'info' });
  }
  const extLink = l => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}<span class="sr"> (opens in a new tab)</span> &#8599;</a></li>`;
  function openSources() {
    const X = window.JU_INFO.SOURCES, cp = window.JU_LEARN && window.JU_LEARN.CURRICULUM;
    openModal(`<div class="info"><h2 id="mTitle">Sources &amp; References</h2>
      <p class="lead">Educational references used to develop the learning activities.</p>
      ${X.official.map((o, i) => `<div class="info-sec"><h3>${'AB'[i]}. ${esc(o.title)}</h3><p>${esc(o.by)}</p><ul class="info-links">${o.links.map(extLink).join('')}</ul></div>`).join('')}
      <div class="info-sec"><p>${esc(X.supports)}</p>
        ${cp ? `<p><b>${esc(cp.cpTitle)}</b></p><p lang="id"><i>${esc(cp.cp)}</i></p>` : ''}</div>
      <div class="info-sec"><h3>C. Tourism information</h3><p>${esc(X.tourism.note)}</p>
        ${X.tourism.used.length ? `<ul class="info-links">${X.tourism.used.map(extLink).join('')}</ul>` : ''}
        ${X.tourism.check.length ? `<p><small>Official pages for checking facts. They are not proof of current conditions or opening status:</small></p><ul class="info-links">${X.tourism.check.map(extLink).join('')}</ul>` : ''}</div>
      <div class="info-note">${esc(X.disclaimer)}</div>
      <div class="row"><button class="btn purple" type="button" data-action="close">Close</button></div></div>`, { cls: 'info' });
  }
  function openDeveloper() {
    const D = window.JU_INFO.DEVELOPER;
    openModal(`<div class="info"><h2 id="mTitle">Developer &amp; AI Disclosure</h2>
      <div class="info-sec"><p class="brand-title">${esc(D.title)}</p><p><b>${esc(D.subtitle)}</b></p>
        <dl>${D.credits.map(c => `<dt>${esc(c[0])}</dt><dd>${esc(c[1])}</dd>`).join('')}</dl></div>
      <div class="info-note"><b>AI Transparency Statement</b><br>${esc(D.aiStatement)}<br><b>${esc(D.aiClear)}</b></div>
      <div class="row"><button class="btn purple" type="button" data-action="close">Close</button></div></div>`, { cls: 'info' });
  }
  /* ENGLISH YO! logo: leave to the Games page. Progress is saved on every change; ask first only when it could be lost. */
  function onLogoClick(e) {
    const mid = st.run && !st.run.completed, unsaved = !S.storageOk() && (st.profile.agent || st.progress.coins || (st.learn && Object.keys(st.learn.answers || {}).length));
    if (!mid && !unsaved) { save(); return; }
    e.preventDefault(); save();
    const href = window.JU_INFO.HOME_URL;
    openModal(`<div class="info"><h2 id="mTitle">Leave to the Games page?</h2>
      <p>${unsaved ? 'Saving is turned off in this browser, so your progress in this mission will <b>not</b> be kept if you leave.' : 'Your progress is saved on this device. You can continue this mission later.'}</p>
      <div class="row"><button class="btn purple" type="button" data-action="close">Stay here</button><a class="btn" href="${esc(href)}">Leave</a></div></div>`, { cls: 'info sm' });
  }
  function openMenu() {
    openModal(`<h2 id="mTitle">Menu</h2><div class="row" style="flex-direction:column;align-items:stretch">
      ${st.run && !st.run.completed ? '<button class="btn purple" type="button" data-action="close">Back to the game</button>' : ''}
      <button class="btn" type="button" data-action="openLearn">Learn: Descriptive Text</button>
      <button class="btn" type="button" data-action="openPassport">Passport</button>
      <button class="btn" type="button" data-action="openMissions">Choose mission</button>
      <button class="btn" type="button" data-action="replay">Restart Mission ${M.num}</button>
      <button class="btn" type="button" data-action="toTitle">Title screen</button>
      <button class="btn danger" type="button" data-action="askReset">Reset all progress</button></div>`, { cls: 'sm' });
  }
  function openMissions() {
    openModal(`<h2 id="mTitle">Choose mission</h2><p>Finish a mission to unlock the next one.</p><div class="row" style="flex-direction:column;align-items:stretch">
      ${C.MISSIONS.map(m => { const pm = st.progress.missions[m.id], ok = unlocked(m.id), cur = st.run && st.run.mission === m.id && !st.run.completed;
        return `<button class="btn ${cur ? 'purple' : ''}" type="button" data-action="playMission" data-id="${m.id}" ${ok ? '' : 'disabled'}>${esc(m.title)}${pm && pm.completed ? ' \u2713 ' + '\u2605'.repeat(pm.best.stars) : (ok ? (cur ? ' (in progress)' : '') : ' (locked)')}</button>`; }).join('')}</div>
      <div class="row"><button class="btn" type="button" data-action="close">Close</button></div>`, { cls: 'sm' });
  }
  function askReset() {
    openModal(`<h2 id="mTitle">Reset all progress?</h2><p>This deletes your agent, coins, stars and stamps on this device. It cannot be undone.</p>
      <div class="row"><button class="btn danger" type="button" data-action="doReset">Yes, reset</button><button class="btn" type="button" data-action="close">Cancel</button></div>`, { cls: 'sm' });
  }

  /* --- Learn Before You Play (js/learn.js) --- */
  const LRN = window.JULearn.create({
    screenEl, esc, announce, ui,
    st: () => st, save,
    hasAgent: () => !!st.profile.agent,
    agentImg: () => agent().img,
    managerImg: () => M.manager.sprite,
    myName,
    exit(from) {
      const ok = ['title', 'map', 'recommend', 'reward', 'brief', 'end', 'intro', 'arrive', 'agent'];
      let t = from && ok.includes(from) ? from : (st.run ? 'map' : 'title');
      if (['intro', 'arrive', 'brief'].includes(t) && !st.profile.agent) t = 'title';
      go(t);
    },
    startMission() {
      if (!st.profile.agent) { st.run = null; return go('agent'); }
      if (st.run && !st.run.completed) return go('map');
      if (st.run && st.run.completed) return nextMission() && unlocked(nextMission().id) ? startMission(nextMission().id) : A.replay();
      go('agent');
    }
  });
  R.learn = function (opts) { LRN.render(opts); };

  /* ------------------------------------------------------------ events */
  const A = {
    start() { st.run = null; go('agent'); },
    continue() {
      if (!st.run) return go('agent');
      go(st.run.completed ? 'reward' : (STABLE.includes(st.screen) && st.screen !== 'reward' ? st.screen : 'map'));
    },
    agentOk() {
      if (!st.profile.agent) return;
      st.profile.nick = ($('#nick').value || '').trim().slice(0, 14);
      startMission('m1', true);
    },
    nextDlg() {
      const lines = R._dlgLines;
      if (dlg.idx < lines.length - 1) { dlg.idx++; renderDialogue(lines, R._dlgKey, R._dlgDone); } else R._dlgDone();
    },
    skipDlg() { R._dlgDone(); },
    toMap() { go('map'); },
    openLearn() { const f = st.screen !== 'learn' ? st.screen : null; go('learn', { from: f }); },
    toRecommend() { if (allTasksDone()) go('recommend'); },
    toReward() { go('reward'); },
    toEnd() { go('end'); },
    toTitle() { go('title'); },
    replay() { startMission(M.id); },
    nextMission() { const n = nextMission(); if (n && unlocked(n.id)) startMission(n.id); },
    openMissions() { openMissions(); },
    playMission(t) { const id = t.dataset.id; if (!unlocked(id)) return; if (st.run && st.run.mission === id && !st.run.completed) { closeModal(true); return go('map'); } startMission(id); },
    openDest(t) { openDest(t.dataset.id); },
    openLocked(t) { openLocked(t.dataset.id); },
    openDesk(t) { openDesk(t && t.dataset ? t.dataset.tab : null); },
    openPassport() { openPassport(); },
    askReset() { askReset(); },
    doReset() { S.reset(); st = S.get(); recFb = null; useMission('m1'); go('title'); },
    close() { closeModal(); },
    tab(t) { desk.tab = t.dataset.id; redrawDesk('#tab-' + desk.tab); },
    markRead() { st.run.read[desk.tab] = true; save(); announce(place(desk.tab).name + ' marked as read.'); redrawDesk('#tab-' + desk.tab); },
    gloss(t) {
      const w = t.dataset.w.toLowerCase(), p = place(desk.tab), m = p.glossary[w];
      $('#glossBar').innerHTML = `<b>${esc(t.dataset.w)}</b> = ${esc(m)}`;
    },
    goTask(t) { desk.cur = +t.dataset.i; const tk = M.tasks[desk.cur]; if (tk.focus !== 'both') desk.tab = tk.focus; redrawDesk('#qleg'); },
    submitTask() { submitTask(); },
    nextTask() { desk.cur = Math.min(M.tasks.length - 1, desk.cur + 1); const tk = M.tasks[desk.cur]; if (tk.focus !== 'both') desk.tab = tk.focus; redrawDesk('#qleg'); },
    deskDone() { closeModal(); },
    submitFinal() { submitFinal(); }
  };
  A.deskDone = function () { closeModal(); };

  document.addEventListener('click', e => {
    const ov = e.target.closest('[data-overlay]');
    if (ov && e.target === ov) return closeModal();
    const t = e.target.closest('[data-action]');
    if (!t || t.disabled) return;
    const fn = A[t.dataset.action]; if (fn) fn(t, e);
  });
  document.addEventListener('change', e => {
    const k = e.target.dataset && e.target.dataset.change; if (!k) return;
    if (k === 'agent') {
      st.profile.agent = e.target.value; save();
      const b = $('[data-action=agentOk]'); if (b) b.disabled = false; const ch = $('#chosen'); if (ch) ch.textContent = agent().label + ' is ready for the first day!';
    } else if (k === 'task') {
      const b = $('#btnSubmitTask'); if (b) b.disabled = false;
    } else if (k === 'place' || k === 'reason') {
      st.run.final[k] = e.target.value; save();
      const f = st.run.final, b = $('#btnFinal'); if (b) b.disabled = !(f.place && f.reason);
    }
  });
  document.addEventListener('keydown', e => {
    if (!modal) return;
    if (e.key === 'Escape') { e.preventDefault(); return closeModal(); }
    if (e.key === 'Tab') {
      const mod = $('.modal'); if (!mod) return;
      const f = $$('button:not([disabled]),input:not([disabled]),[href],[tabindex]:not([tabindex="-1"])', mod).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === mod || document.activeElement.id === 'mTitle')) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $('#btnPassport').addEventListener('click', openPassport);
  $('#btnMenu').addEventListener('click', openMenu);
  $('#btnAbout').addEventListener('click', openAbout);
  $('#btnSources').addEventListener('click', openSources);
  $('#btnDeveloper').addEventListener('click', openDeveloper);
  $('#brandLogo').addEventListener('click', onLogoClick);
  { const li = $('#brandLogo img'); const fb = () => { li.replaceWith(Object.assign(document.createElement('span'), { className: 'logo-fb', textContent: 'ENGLISH YO!' })); };
    if (li.complete && li.naturalWidth === 0) fb(); else li.addEventListener('error', fb, { once: true }); }

  /* ------------------------------------------------------------ boot */
  (function boot() {
    const resume = STABLE.includes(st.screen) && st.profile.agent && st.run;
    if (st.run) useMission(st.run.mission); else useMission('m1');
    st.screen = 'title'; updateHud();
    go('title');
    if (resume) { /* title offers Continue; progress restores from saved run */ }
  })();
})();
