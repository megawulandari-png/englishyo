/* mechanics registry: THRIVE.activities[type](body, stage, api, mission)
 * api: { check(label, fn), result(ok, msg), feedback(msg), say(clipId, opts) }
 *   check fn returns undefined (do nothing), { toast } (not ready yet) or { ok, msg, reset }.
 * To add a mechanic, register a new type here — missions only reference it by name. */
(function () {
  const T = window.THRIVE, { h, pic, img, icon } = T.ui;
  const A = T.activities = {};
  const sfx = n => T.audio.sfx(n);

  function shuffle(a) { let b; do { b = a.slice().sort(() => Math.random() - 0.5); } while (a.length > 1 && b.every((x, i) => x === a[i])); return b; }
  /* correct / not-correct marks never rely on colour alone */
  const mark = (el, ok) => el.append(h('span', { class: 'mark ' + (ok ? 'mark--ok' : 'mark--no'), role: 'img', 'aria-label': ok ? 'correct' : 'not correct' }, ok ? icon('check') : img(T.img.fb.wrong, '')));
  const note = t => h('p', { class: 'note' }, t);
  const action = (m, key) => m.actions[key];

  /* PLAY / REPLAY / SLOW controls for listening clips. No transcript is shown before the task is solved. */
  function audioBar(clip, api, onPlay) {
    let played = false;
    const lbl = h('span', { class: 'audio-bar__lbl' }, 'PLAY AUDIO');
    const go = slow => { played = true; if (onPlay) onPlay(); api.say(clip, { slow }); };
    const bar = h('div', { class: 'audio-bar' },
      h('div', { class: 'audio-bar__btn' }, T.ui.roundBtn('play', 'Play audio', () => go(false)), lbl),
      h('div', { class: 'audio-bar__btn' }, T.ui.roundBtn('replay', 'Replay', () => go(false)), h('span', { class: 'audio-bar__lbl' }, 'REPLAY')),
      h('div', { class: 'audio-bar__btn' }, T.ui.roundBtn('slow', 'Play slowly', () => go(true)), h('span', { class: 'audio-bar__lbl' }, 'SLOW')));
    bar.played = () => played;
    return bar;
  }

  /* ---------- STORY: the context of the mission (scene + clue cards) ---------- */
  A.story = (body, st, api, m) => {
    const seen = new Set(), sc = st.scene || {};
    const chips = st.symptoms.map((s, i) => h('button', { class: 'symptom', 'aria-pressed': 'false', onclick: e => {
      seen.add(i); e.currentTarget.classList.add('on'); e.currentTarget.setAttribute('aria-pressed', 'true'); sfx('pop'); T.audio.speakText(s.t + '. ' + s.d);
      if (seen.size === st.symptoms.length) api.result(true, st.okMsg || 'Well noticed! Now let’s learn the procedure.');
    } }, h('b', null, s.t), h('small', null, s.d)));
    const tag = sc.tag ? h('span', { class: 'story-scene__clock' }, pic(sc.tag.img, ''), h('b', null, sc.tag.text)) : null;
    const scene = sc.room
      ? h('div', { class: 'story-scene' }, img(T.img.room, 'A study room with a desk, a laptop and a chair'), T.ui.mascot('think', 'story-scene__mascot'), tag)
      : h('div', { class: 'story-scene story-scene--card' }, img(T.img.worlds[m.world], '', 'story-scene__world'), pic(sc.main, '', 'story-scene__main'), T.ui.mascot(st.mood || 'think', 'story-scene__mascot'), tag);
    body.append(scene, h('p', { class: 'sub-line' }, st.cluePrompt || 'Tap each card.'), h('div', { class: 'symptoms' }, chips));
  };

  /* ---------- OBSERVE: read the procedure, discover the action words ---------- */
  A.observe = (body, st, api, m) => {
    const found = new Set(); let done = false;
    const info = h('p', { class: 'info-bubble', 'aria-live': 'polite' }, 'Tap the green words.');
    const counter = h('strong', null, '0');
    const line = (s, i) => h('li', { class: 'proc-step' }, h('span', { class: 'proc-num' }, i + 1),
      h('span', { class: 'proc-text' }, s.split(/(\{\{.*?\}\}|\[\[.*?\]\]|\(\(.*?\)\))/).filter(Boolean).map(p => {
        const t = p.slice(2, -2), kind = p.startsWith('[[') ? 'verb' : p.startsWith('{{') ? 'marker' : p.startsWith('((') ? 'adverb' : '';
        if (!kind) return p;
        const b = h('button', { class: 'tok tok--' + kind, onclick: () => {
          T.audio.playWordAudio(t.toLowerCase()); sfx('pop');
          const label = kind === 'verb' ? 'action word (imperative verb)' : kind === 'marker' ? 'sequence marker' : 'adverb: how to do it';
          const id = m.verbInfo[t.toLowerCase()];
          info.replaceChildren(h('strong', null, t), ' · ' + label + (id ? ' · ' + id : ''));
          if (kind === 'verb') { found.add(t.toLowerCase()); T.store.discover(t.toLowerCase()); b.classList.add('found'); counter.textContent = found.size;
            if (found.size >= st.need && !done) { done = true; api.result(true, 'Every step starts with an action word. That is how instructions work!'); } }
        } }, t);
        return b;
      })));
    body.append(
      h('div', { class: 'proc-card' },
        h('div', { class: 'proc-part' }, h('span', { class: 'part-tag part-tag--goal' }, 'GOAL'), h('h3', null, m.title), h('p', { class: 'proc-goal' }, m.goal)),
        h('div', { class: 'proc-part proc-part--tools' }, h('span', { class: 'part-tag part-tag--tool' }, 'MATERIALS / TOOLS'),
          m.tools.length ? h('div', { class: 'tool-row' }, m.tools.map(t => h('span', { class: 'tool' }, pic(t.img, ''), t.text))) : h('p', { class: 'tool-none' }, 'No materials needed.'), note(m.toolNote)),
        h('div', { class: 'proc-part' }, h('span', { class: 'part-tag part-tag--steps' }, 'STEPS'), h('ol', { class: 'proc-steps' }, m.markedSteps.map(line)))),
      info, h('p', { class: 'counter' }, 'Action words found: ', counter, ' / ' + st.need),
      h('p', { class: 'legend' }, h('span', { class: 'tok tok--verb' }, 'action word'), h('span', { class: 'tok tok--marker' }, 'sequence marker'), h('span', { class: 'tok tok--adverb' }, 'adverb')));
  };

  /* ---------- LISTEN & DO ---------- */
  A.listenDo = (body, st, api, m) => {
    const picked = [];
    const bar = audioBar(st.clip, api);
    const slots = h('ol', { class: 'slots', 'aria-label': 'Your actions in order' });
    const tilesEl = h('div', { class: 'tiles' });
    const transcript = h('p', { class: 'transcript', hidden: true });
    function draw() {
      slots.replaceChildren(...st.answer.map((_, i) => { const id = picked[i]; const a = id && action(m, id);
        return h('li', { class: 'slot' + (id ? ' filled' : '') }, h('span', { class: 'slot__n' }, i + 1),
          id ? h('button', { class: 'slot__item', 'aria-label': (i + 1) + ': ' + a.label + '. Tap to remove.', onclick: () => { picked.splice(i, 1); draw(); sfx('tap'); } }, pic(a.img, '', 'slot__img'), a.label) : h('span', { class: 'slot__empty' }, '?')); }));
      tilesEl.replaceChildren(...st.tiles.map(k => { const a = action(m, k);
        return h('button', { class: 'tile', disabled: picked.includes(k) || picked.length >= st.answer.length, onclick: () => { picked.push(k); draw(); sfx('tap'); } }, pic(a.img, '', 'tile__img'), h('span', null, a.label)); }));
    }
    draw();
    body.append(bar, h('h3', { class: 'sub' }, 'Actions'), tilesEl, h('h3', { class: 'sub' }, 'Your order'), slots, transcript);
    api.check('CHECK', () => {
      if (!bar.played()) return { toast: 'Press PLAY AUDIO first.' };
      if (picked.length < st.answer.length) return { toast: 'Choose ' + st.answer.length + ' actions.' };
      const ok = picked.every((x, i) => x === st.answer[i]);
      if (ok) { transcript.hidden = false; transcript.textContent = 'Transcript: ' + T.audio.textOf(st.clip); }
      const extra = picked.some(x => !st.answer.includes(x));
      return { ok, msg: ok ? 'Good listening! Now you can read the transcript.' : extra ? 'Listen again. One action is not in the audio.' : 'Good thinking — order matters. Listen again.', reset: () => { picked.length = 0; draw(); } };
    });
  };

  /* ---------- TOOL CHECK ---------- */
  A.toolCheck = (body, st, api, m) => {
    const sel = new Set(); const cards = [];
    const grid = h('div', { class: 'tiles' }, st.items.map((it, i) => cards[i] = h('button', { class: 'tile', 'aria-pressed': 'false', onclick: e => {
      sel.has(i) ? sel.delete(i) : sel.add(i); e.currentTarget.setAttribute('aria-pressed', sel.has(i)); e.currentTarget.classList.toggle('on', sel.has(i)); sfx('tap'); } },
      pic(it.img, '', 'tile__img'), h('span', null, it.label))));
    body.append(h('p', { class: 'sub-line' }, h('span', { class: 'part-tag part-tag--goal' }, 'GOAL'), ' ' + m.goal), grid);
    api.check('CHECK', () => {
      const ok = st.items.every((it, i) => sel.has(i) === it.helpful);
      if (ok) { st.items.forEach((it, i) => { const c = cards[i]; c.disabled = true; c.append(h('small', { class: 'why' }, it.why)); mark(c, it.helpful); });
        body.append(h('p', { class: 'insight' }, img(T.img.fb.idea, ''), st.insight)); }
      return { ok, msg: ok ? (st.okMsg || 'Good choice! You picked only what the procedure needs.') : (st.noMsg || 'Think again. Read the procedure. Which ones do you really need?') };
    });
  };

  /* ---------- WHAT COMES NEXT? / MISSING STEP (shared choice-into-gap mechanic) ---------- */
  function gapChoice(body, st, api, okMsg) {
    const gap = h('li', { class: 'gap' }, '?');
    const steps = st.type === 'whatNext' ? st.steps.concat([null]) : st.steps;
    if (st.clip) body.append(audioBar(st.clip, api));
    body.append(h('ol', { class: 'plain-steps' }, steps.map(s => s ? h('li', null, s) : gap)),
      h('div', { class: 'choice-list' }, shuffle(st.options).map(o => h('button', { class: 'choice', onclick: e => {
        if (o.ok) { gap.textContent = o.text; gap.classList.add('filled'); mark(gap, true); body.querySelectorAll('.choice').forEach(b => b.disabled = true); e.currentTarget.classList.add('right'); api.result(true, okMsg); }
        else api.result(false, (o.hint ? o.hint + ' ' : '') + 'Think about the goal of the procedure.'); } }, o.text))));
  }
  A.whatNext = (body, st, api) => gapChoice(body, st, api, st.okMsg || 'Good thinking — order matters.');
  A.missing = (body, st, api) => gapChoice(body, st, api, st.okMsg || 'Great! The procedure is complete again.');

  /* ---------- FIX THE STEPS ---------- */
  A.fixSteps = (body, st, api, m) => {
    const byId = Object.fromEntries(m.steps.map(s => [s.id, s]));
    let bank = shuffle(st.order.slice()), ans = [];
    const bankEl = h('div', { class: 'step-bank' }), ansEl = h('ol', { class: 'step-ans', 'aria-label': 'Your order' });
    const txt = id => byId[id].marker + ', ' + byId[id].text;
    function draw(showMarks) {
      bankEl.replaceChildren(...bank.map(id => h('button', { class: 'step-tile', onclick: () => { bank.splice(bank.indexOf(id), 1); ans.push(id); sfx('tap'); draw(); } }, txt(id))));
      if (!bank.length) bankEl.append(h('p', { class: 'note' }, 'All steps placed. Tap a step below to move it back.'));
      ansEl.replaceChildren(...st.order.map((_, i) => { const id = ans[i];
        const li = h('li', { class: 'step-slot' + (id ? ' filled' : '') }, h('span', { class: 'slot__n' }, i + 1));
        if (!id) { li.append(h('span', { class: 'slot-hint' }, 'empty')); return li; }
        const b = h('button', { class: 'step-tile placed', 'aria-label': 'Step ' + (i + 1) + ': ' + txt(id) + '. Tap to remove.', onclick: () => { ans.splice(i, 1); bank.push(id); draw(); } }, txt(id));
        if (showMarks) mark(b, id === st.order[i]); li.append(b); return li; }));
    }
    draw(); body.append(h('h3', { class: 'sub' }, 'Mixed-up steps'), bankEl, h('h3', { class: 'sub' }, 'Correct order'), ansEl);
    api.check('CHECK ORDER', () => {
      if (ans.length < st.order.length) return { toast: 'Place all the steps first.' };
      const ok = ans.every((id, i) => id === st.order[i]); draw(true);
      if (!ok) return { ok, msg: 'Almost there! Look at the sequence markers: First, Next, Then, After that, Finally.', reset: () => setTimeout(() => { bank = shuffle(st.order.slice()); ans = []; draw(); }, 1800) };
      return { ok, msg: 'Clear instructions make difficult things easier.' };
    });
  };

  /* ---------- INSTRUCTION ERROR ---------- */
  A.instructionError = (body, st, api) => {
    let r = 0; const holder = h('div');
    function round() {
      const R = st.rounds[r]; let found = false; holder.replaceChildren();
      const fixBox = h('div', { class: 'choice-list', hidden: true });
      const fixHead = h('p', { class: 'sub-line', hidden: true }, 'Which sentence fixes it?');
      holder.append(h('p', { class: 'round-tag' }, 'Round ' + (r + 1) + ' of ' + st.rounds.length),
        h('div', { class: 'choice-list' }, R.lines.map((l, i) => h('button', { class: 'choice', onclick: e => {
          if (found) return;
          if (i !== R.wrong) return api.result(false, 'That sentence is correct. Look for a verb with -s or -ing.');
          found = true; e.currentTarget.classList.add('flagged'); mark(e.currentTarget, false); fixBox.hidden = false; fixHead.hidden = false; api.feedback('Good eye! Now choose the correct sentence.'); sfx('pop'); } }, l))),
        fixHead, fixBox);
      shuffle(R.options).forEach(o => fixBox.append(h('button', { class: 'choice', onclick: e => {
        if (!o.ok) return api.result(false, 'Mistakes are clues. Try again. ' + R.rule);
        fixBox.querySelectorAll('button').forEach(b => b.disabled = true); e.currentTarget.classList.add('right'); mark(e.currentTarget, true);
        if (r < st.rounds.length - 1) { api.feedback('Correct! ' + R.rule); sfx('correct'); setTimeout(() => { r++; round(); }, 1600); }
        else api.result(true, R.rule); } }, o.t)));
    }
    round(); body.append(holder);
  };

  /* ---------- SAFE OR UNSAFE? (labels can change: Kind / Unkind, Responsible / Not responsible, Safe to open / Do not open) ---------- */
  A.safeUnsafe = (body, st, api) => {
    let left = st.cards.length; const [yes, no] = st.labels || ['Safe', 'Unsafe'];
    if (st.clip) body.append(h('p', { class: 'sub-line' }, 'Listen to a tip first:'), audioBar(st.clip, api));
    body.append(h('div', { class: 'su-list' }, st.cards.map(c => {
      const card = h('div', { class: 'su-card' + (st.kind === 'link' ? ' su-card--link' : '') }); const why = h('p', { class: 'why-line', hidden: true }, c.why);
      const btn = safe => h('button', { class: 'su-btn su-btn--' + (safe ? 'safe' : 'unsafe'), onclick: () => {
        if (safe === c.safe) { card.querySelectorAll('button').forEach(b => b.disabled = true); card.classList.add(c.safe ? 'is-safe' : 'is-unsafe'); why.hidden = false;
          card.prepend(h('span', { class: 'su-badge' }, (c.safe ? yes : no).toUpperCase())); mark(card.firstChild, true); sfx('correct');
          if (!--left) api.result(true, st.okMsg || 'You can spot unsafe steps. Clear instructions help people act safely.'); else api.feedback(c.why);
        } else api.result(false, 'Think first. Is it really “' + (safe ? yes : no) + '”?'); } }, safe ? yes : no);
      card.append(h('p', { class: 'su-text' }, c.text), h('div', { class: 'su-btns' }, btn(true), btn(false)), why); return card; })));
  };

  /* ---------- SCREEN BREAK COACH: hear a step, choose it, then really do it ---------- */
  A.coach = (body, st, api, m) => {
    let n = 0;
    const progress = h('ol', { class: 'coach-dots', 'aria-label': 'Coach steps' });
    const stage = h('div', { class: 'coach' });
    function dots() { progress.replaceChildren(...st.steps.map((_, i) => h('li', { class: i < n ? 'done' : i === n ? 'now' : '' }, i < n ? icon('check') : i + 1))); }
    function step() {
      dots(); const s = st.steps[n]; let heard = false;
      const play = auto => { if (auto && !T.store.get().sound.voice) return; heard = true; T.audio.playInstructionAudio(s.clip, { auto }); };
      stage.replaceChildren(h('div', { class: 'coach__top' }, T.ui.roundBtn('play', 'Play step ' + (n + 1), () => play(false)), h('p', null, h('b', null, 'Step ' + (n + 1) + ' of ' + st.steps.length), h('br'), 'Listen, then tap the action you hear.'), T.ui.roundBtn('slow', 'Play slowly', () => { heard = true; T.audio.playInstructionAudio(s.clip, { slow: true }); }, 'round-btn--sm')),
        h('div', { class: 'tiles tiles--3' }, s.options.map(k => { const a = action(m, k);
          return h('button', { class: 'tile', onclick: e => {
            if (!heard) return T.ui.toast('Press PLAY first.');
            if (k !== s.answer) { e.currentTarget.classList.add('shake'); setTimeout(() => e.currentTarget.classList.remove('shake'), 500); return api.result(false, 'Listen again. Which action did you hear?'); }
            sfx('correct'); doIt(a, s);
          } }, pic(a.img, '', 'tile__img'), h('span', null, a.label)); })));
      const t = setTimeout(() => play(true), 350); api.cleanup(() => clearTimeout(t));
    }
    function doIt(a, s) {
      const text = T.audioMap[s.clip].text; let left = s.hold;
      const count = h('b', { class: 'coach__count' }, left);
      stage.replaceChildren(h('div', { class: 'coach__do' }, pic(a.img, a.label, 'coach__img'), h('p', { class: 'coach__say' }, text), s.say ? h('p', { class: 'coach__line' }, s.say) : null, h('p', null, st.doText || 'Do it now!'), count));
      const t = setInterval(() => { left--; count.textContent = left; if (left <= 0) { clearInterval(t); sfx('pop'); n++; if (n < st.steps.length) step(); else { dots(); stage.replaceChildren(h('div', { class: 'coach__do' }, T.ui.mascot('happy', 'coach__img'), h('p', { class: 'coach__say' }, st.doneText || 'You did every step!'))); api.result(true, st.okMsg || 'Great practice!'); } } }, 1000);
      api.cleanup(() => clearInterval(t));
    }
    body.append(progress, stage); step();
  };

  /* shared drag + tap-to-place input: drag with pointer/touch, or tap an item then tap a target (also Enter/Space) */
  function dragTap(scene, drop) {
    let sel = null;
    const mark = () => scene.querySelectorAll('.dd-item').forEach(n => n.classList.toggle('sel', n.dataset.id === sel));
    function tapSelect(node) {
      if (sel && sel !== node.dataset.id && node.classList.contains('dd-target')) { const s = sel; sel = null; mark(); return drop(s, node.dataset.id); }
      sel = sel === node.dataset.id ? null : node.dataset.id; mark(); sfx('tap');
    }
    scene.querySelectorAll('.dd-item').forEach(node => {
      let sx, sy, moved = false;
      node.addEventListener('pointerdown', e => { if (node.classList.contains('placed')) return; sx = e.clientX; sy = e.clientY; moved = false; node.setPointerCapture(e.pointerId); node.classList.add('drag'); });
      node.addEventListener('pointermove', e => { if (!node.hasPointerCapture(e.pointerId)) return; const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) + Math.abs(dy) > 8) moved = true; node.style.transform = `translate(${dx}px,${dy}px)`; });
      node.addEventListener('pointerup', e => {
        node.classList.remove('drag'); node.style.transform = '';
        if (moved) { const t = document.elementsFromPoint(e.clientX, e.clientY).map(x => x.closest('.dd-target')).find(x => x && x !== node); sel = null; mark(); if (t) drop(node.dataset.id, t.dataset.id); }
        else tapSelect(node); });
      node.addEventListener('pointercancel', () => { node.classList.remove('drag'); node.style.transform = ''; });
      node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapSelect(node); } });
    });
    scene.querySelectorAll('.dd-target').forEach(node => {
      if (node.classList.contains('dd-item')) return;   // items that are also targets handle their own taps
      const go = () => { if (sel) { const s = sel; sel = null; mark(); drop(s, node.dataset.id); } };
      node.addEventListener('click', go); node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
  }

  /* ---------- DRAG & DO: data-driven scene. fx: hide:id · fade:id · undim:id · label:id=text · swap:id=img · overlay:id=img ---------- */
  A.dragDo = (body, st, api) => {
    const steps = st.steps; let n = 0; const el = {};
    const prog = h('ol', { class: 'dd-steps' }, steps.map(s => h('li', null, s.text)));
    const scene = h('div', { class: 'dd-scene', style: { '--cols': st.scene.length } }, st.scene.map(o => el[o.id] = h('div', {
      class: 'dd' + (o.role !== 'target' ? ' dd-item' : '') + (o.role !== 'item' ? ' dd-target' : '') + (o.dim ? ' dd-dim' : ''),
      'data-id': o.id, tabindex: 0, role: 'button', 'aria-label': o.label }, pic(o.img, ''), h('small', null, o.label))));
    const say = h('p', { class: 'info-bubble', 'aria-live': 'polite' }, 'Step 1: ' + steps[0].text);
    function refresh() {
      Object.values(el).forEach(e => e.classList.remove('active'));
      if (n < steps.length) { el[steps[n].item].classList.add('active'); el[steps[n].target].classList.add('active'); }
      [...prog.children].forEach((li, i) => li.classList.toggle('done', i < n));
    }
    function fx(f) {
      const [k, rest] = f.split(':'); const [id, val] = rest.split('='); const e = el[id];
      if (k === 'hide') e.classList.add('placed'); else if (k === 'fade') e.classList.add('used'); else if (k === 'undim') e.classList.remove('dd-dim');
      else if (k === 'label') e.querySelector('small').textContent = val;
      else if (k === 'swap') e.replaceChild(pic(val, ''), e.firstChild);
      else if (k === 'overlay') e.append(pic(val, '', 'dd-overlay'));
    }
    function drop(id, targetId) {
      if (n >= steps.length || id === targetId) return;
      const s = steps[n];
      if (id === s.item && targetId === s.target) {
        sfx('correct'); n++; (s.fx || []).forEach(fx);
        say.textContent = s.done + (n < steps.length ? ' Step ' + (n + 1) + ': ' + steps[n].text : '');
        refresh();
        if (n === steps.length) api.result(true, st.okMsg || 'You followed the instructions in the right order!');
      } else { sfx('wrong'); refresh(); api.result(false, 'Not yet. Follow the steps in order: ' + s.text); }
    }
    dragTap(scene, drop);
    body.append(prog, say, scene, note('Drag with your finger or mouse — or tap a thing, then tap where it goes.')); refresh();
  };

  /* ---------- SORT IT! (new): drag or tap each item into the correct bin ---------- */
  A.sortBins = (body, st, api) => {
    let left = st.items.length, wrong = 0;
    const pile = h('div', { class: 'sort-pile' }, shuffle(st.items).map(it => h('div', { class: 'dd dd-item sort-item', 'data-id': it.id, tabindex: 0, role: 'button', 'aria-label': it.label }, pic(it.img, ''), h('small', null, it.label))));
    const bins = h('div', { class: 'sort-bins' }, st.bins.map(b => h('div', { class: 'dd dd-target sort-bin', 'data-id': b.id, tabindex: 0, role: 'button', 'aria-label': b.label + ' bin' },
      pic(b.img, ''), h('b', null, b.label), h('span', { class: 'sort-count' }, '0'))));
    const say = h('p', { class: 'info-bubble', 'aria-live': 'polite' }, 'Choose an item, then a bin.');
    body.append(say, pile, bins);
    dragTap(body, (itemId, binId) => {
      const it = st.items.find(x => x.id === itemId); if (!it) return;
      const node = pile.querySelector('[data-id="' + itemId + '"]');
      if (it.bin === binId) {
        sfx('correct'); node.classList.add('placed'); const c = bins.querySelector('[data-id="' + binId + '"] .sort-count'); c.textContent = +c.textContent + 1;
        say.textContent = 'Yes! The ' + it.label + ' goes in the ' + binId + ' bin.';
        if (!--left) api.result(true, st.okMsg || 'Everything is in the correct bin!');
      } else { sfx('wrong'); wrong++; api.result(false, 'Think again. Is the ' + it.label + ' plastic, paper or organic?'); }
    });
    body.querySelectorAll('.sort-item').forEach(n => n.classList.add('active'));
  };

  /* ---------- SCAN SIMULATOR (new): check the source, scan, then OPEN or CLOSE the link ---------- */
  A.scanSim = (body, st, api) => {
    let k = 0, mistakes = 0; const holder = h('div', { class: 'scan-sim' });
    const dots = h('ol', { class: 'coach-dots' });
    const drawDots = () => dots.replaceChildren(...st.posters.map((_, i) => h('li', { class: i < k ? 'done' : i === k ? 'now' : '' }, i < k ? icon('check') : i + 1)));
    function poster() {
      drawDots(); const p = st.posters[k]; let checked = false;
      const result = h('div', { class: 'scan-result', hidden: true });
      const scanBtn = h('button', { class: 'btn btn--ghost', disabled: true, onclick: () => {
        sfx('pop'); scanBtn.disabled = true; phone.classList.add('scanning');
        setTimeout(() => { phone.classList.remove('scanning'); result.hidden = false; result.replaceChildren(
          h('p', { class: 'sub-line' }, 'The link is:'), h('p', { class: 'link-text' }, p.link),
          h('div', { class: 'su-btns' }, decide(true), decide(false))); }, 900); } }, 'SCAN IT');
      const checkBtn = h('button', { class: 'btn btn--ghost', onclick: () => { checked = true; from.hidden = false; checkBtn.disabled = true; scanBtn.disabled = false; sfx('pop'); } }, 'CHECK WHERE IT COMES FROM');
      const from = h('p', { class: 'scan-from', hidden: true }, img(T.img.fb.idea, ''), 'From: ' + p.from);
      const decide = open => h('button', { class: 'su-btn su-btn--' + (open ? 'safe' : 'unsafe'), onclick: () => {
        if (open === p.safe) {
          sfx('correct'); result.append(h('p', { class: 'why-line' }, (open ? 'Opened safely. ' : 'Closed. ') + p.why));
          result.querySelectorAll('button').forEach(b => b.disabled = true);
          if (++k < st.posters.length) setTimeout(poster, 1700); else { drawDots(); api.result(true, st.okMsg || 'You used QR codes safely!'); }
        } else { mistakes++; api.result(false, open ? 'Careful! Check the place and the link again.' : 'This one is safe. Look at where it comes from.'); }
      } }, open ? 'OPEN' : 'CLOSE');
      const phone = pic('svg:scan', '', 'scan-phone');
      holder.replaceChildren(h('div', { class: 'scan-card' }, pic('svg:poster', '', 'scan-poster'), h('div', null, h('p', { class: 'round-tag' }, 'Poster ' + (k + 1) + ' of ' + st.posters.length), h('h3', null, p.title), from,
        h('div', { class: 'row' }, checkBtn, scanBtn)), phone), result);
    }
    body.append(dots, holder); poster();
  };

  /* ---------- REAL-LIFE DECISION ---------- */
  A.decision = (body, st, api) => {
    body.append(h('div', { class: 'scenario' }, h('p', null, st.situation), st.clip ? T.ui.speaker('Listen to the situation', () => api.say(st.clip)) : null),
      h('div', { class: 'choice-list' }, shuffle(st.options).map(o => h('button', { class: 'choice', onclick: e => {
        if (o.best) { body.querySelectorAll('.choice').forEach(b => b.disabled = true); e.currentTarget.classList.add('right'); mark(e.currentTarget, true); api.result(true, o.fb); }
        else api.result(false, o.fb + ' Try another answer.'); } }, o.text))));
  };

  /* ---------- BUILD THE PROCEDURE: goal + 3–5 steps + sequence markers ---------- */
  const MID = ['Next', 'Then', 'After that'];
  A.build = (body, st, api, m) => {
    let goal = null; let chosen = [];
    const goalBtns = st.goals.map((g, i) => h('button', { class: 'choice', 'aria-pressed': 'false', onclick: () => { goal = i; goalBtns.forEach((b, j) => { b.classList.toggle('on', i === j); b.setAttribute('aria-pressed', i === j); }); sfx('tap'); renderCard(); } }, g));
    const bankEl = h('div', { class: 'chip-bank' }), listEl = h('ol', { class: 'build-list' });
    const card = h('div', { class: 'final-card', hidden: true });
    const speech = T.ui.learnerSpeechBar(() => cardText()); speech.hidden = true;
    let shown = false;                                   // the card appears after SHOW MY PROCEDURE and then follows every edit
    const stepLine = c => (c.m ? c.m + ', ' : '') + st.bank[c.i].t;
    const cardText = () => (goal == null ? '' : st.goals[goal] + '. ') + chosen.map(stepLine).join(' ');   // exactly what is on the card now
    function renderCard() {
      if (!shown) return;
      card.replaceChildren(h('span', { class: 'part-tag part-tag--goal' }, 'MY PROCEDURE'), h('h3', null, goal == null ? '…' : st.goals[goal]), h('ol', null, chosen.map(c => h('li', null, stepLine(c)))));
      const ms = chosen.map(c => c.m), last = ms.length - 1;     // keep the saved card equal to the edited one while it is still valid
      if (goal === st.goalAnswer && chosen.length >= 3 && chosen.every(c => c.m && st.bank[c.i].ok) && ms[0] === 'First' && ms[last] === 'Finally' && ms.slice(1, last).every(x => MID.includes(x)) && new Set(ms.slice(1, last)).size === last - 1)
        T.store.update(s => { s.built[m.id] = { goal: st.goals[goal], steps: chosen.map(stepLine) }; });
    }
    function draw() {
      bankEl.replaceChildren(...st.bank.map((b, i) => h('button', { class: 'step-chip', disabled: chosen.some(c => c.i === i) || chosen.length >= 5, onclick: () => { chosen.push({ i, m: '' }); sfx('tap'); draw(); } }, '+ ' + b.t[0].toUpperCase() + b.t.slice(1))));
      listEl.replaceChildren(...(chosen.length ? chosen.map((c, k) => {
        const s = h('select', { 'aria-label': 'Sequence marker for step ' + (k + 1), onchange: e => { c.m = e.target.value; renderCard(); } }, h('option', { value: '' }, 'choose…'), ['First'].concat(MID, ['Finally']).map(x => h('option', { value: x, selected: c.m === x }, x)));
        return h('li', { class: 'build-line' }, h('span', { class: 'slot__n' }, k + 1), s, h('span', { class: 'build-line__t' }, ', ' + st.bank[c.i].t),
          h('button', { class: 'mini-btn', 'aria-label': 'Remove step ' + (k + 1), onclick: () => { chosen.splice(k, 1); draw(); } }, '×'));
      }) : [h('li', { class: 'slot-empty' }, 'Tap steps above to add them here (3–5 steps).')]));
      renderCard();
    }
    draw();
    body.append(h('h3', { class: 'sub' }, '1 · Choose your goal'), h('div', { class: 'choice-list' }, goalBtns),
      h('h3', { class: 'sub' }, '2 · Choose 3–5 steps, in order'), bankEl,
      h('h3', { class: 'sub' }, '3 · Add sequence markers'), listEl, card, speech);
    api.check('SHOW MY PROCEDURE', () => {
      if (goal == null) return { toast: 'Choose a goal first.' };
      if (chosen.length < 3) return { toast: 'Choose at least 3 steps.' };
      if (chosen.some(c => !c.m)) return { toast: 'Choose a sequence marker for every step.' };
      if (goal !== st.goalAnswer) return { ok: false, msg: st.goalMsg || 'Check your goal. Does it match the procedure?' };
      if (chosen.some(c => !st.bank[c.i].ok)) return { ok: false, msg: st.badStepMsg || 'One step does not belong. Remove it and try again.' };
      const ms = chosen.map(c => c.m), last = ms.length - 1;
      const good = ms[0] === 'First' && ms[last] === 'Finally' && ms.slice(1, last).every(x => MID.includes(x)) && new Set(ms.slice(1, last)).size === last - 1;
      if (!good) return { ok: false, msg: 'Almost there! Start with “First”, end with “Finally”, and use different words in the middle.' };
      shown = true; card.hidden = false; speech.hidden = false; renderCard();       // READ IT ALOUD / REPLAY / SLOW read this card, even after edits
      return { ok: true, msg: 'Wonderful! Your procedure card is ready. You are a creator!' };
    });
  };

  /* ---------- TELL YOUR PROCEDURE ---------- */
  A.present = (body, st, api, m) => {
    const built = T.store.get().built[m.id] || { goal: m.title, steps: m.steps.map(s => s.marker + ', ' + s.text) };
    const currentText = () => { const b = T.store.get().built[m.id] || built; return b.goal + '. ' + b.steps.join(' '); };
    const boxes = st.checks.map(c => h('label', { class: 'check-row' }, h('input', { type: 'checkbox' }), h('span', null, c)));
    body.append(h('div', { class: 'final-card final-card--big' }, h('span', { class: 'part-tag part-tag--goal' }, 'MY PROCEDURE'), h('h3', null, built.goal), h('ol', null, built.steps.map(t => h('li', null, t)))),
      T.ui.learnerSpeechBar(currentText),
      h('p', { class: 'sub-line' }, 'Now read it aloud yourself. Then tick the boxes.'), h('div', { class: 'checks' }, boxes));
    api.check('I TOLD MY PROCEDURE', () => boxes.every(b => b.querySelector('input').checked) ? { ok: true, msg: 'Clear instructions help other people. You are a communicator!' } : { toast: 'Tick all three boxes when you are ready.' });
  };

})();
