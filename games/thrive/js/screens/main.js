/* screens: intro (+ mascot choice), menu, world map, world, learn, glossary */
(function () {
  const T = window.THRIVE, { h, img, icon } = T.ui, S = T.screens = T.screens || {};
  const go = hash => () => { T.audio.sfx('tap'); location.hash = hash; };

  /* mascot picker — reused by the opening and My Progress */
  function mascotPicker(onPick) {
    const grid = h('div', { class: 'mascot-grid', role: 'radiogroup', 'aria-label': 'Choose your mascot' });
    const draw = () => grid.replaceChildren(...T.mascots.map(m => { const on = T.store.get().mascot === m.key;
      return h('button', { class: 'mascot-card' + (on ? ' on' : ''), role: 'radio', 'aria-checked': on, style: { '--c': m.color },
        onclick: () => { T.store.update(s => { s.mascot = m.key; }); T.audio.sfx('pop'); draw(); if (onPick) onPick(m); } },
        T.ui.mascot(on ? 'happy' : 'ready', '', m.key), h('b', null, m.name)); }));
    draw(); return grid;
  }
  S.mascotPicker = mascotPicker;

  /* ---------- OPENING ---------- */
  S.intro = () => {
    let n = 0; const root = h('div', { class: 'intro' });
    const slides = [
      { audio: 'thrive-opening-01', lines: ['Life gives us many challenges.', 'Knowing what to do is a superpower.'] },
      { audio: 'thrive-opening-02', lines: ['Read carefully.', 'Think wisely.', 'Help others.', 'Take care of yourself.', 'And keep moving forward.'] },
      { pick: true }, { ready: true }];
    function show() {
      const s = slides[n]; let box;
      if (s.pick) {
        const nextBtn = h('button', { class: 'btn btn--primary btn--lg', disabled: !T.store.get().mascot, onclick: () => { n++; show(); } }, 'NEXT');
        box = h('div', { class: 'intro__box intro__box--wide fade' }, h('h1', { class: 'intro__title' }, 'Choose your study buddy'),
          h('p', { class: 'lead' }, 'Any learner can choose any animal. You can change it later in My Progress.'),
          mascotPicker(() => { nextBtn.disabled = false; }), nextBtn);
      } else if (s.ready) {
        box = h('div', { class: 'intro__box fade' }, T.ui.mascot('happy', 'intro__mascot'), h('h1', { class: 'intro__ready' }, 'READY TO THRIVE?'),
          h('button', { class: 'btn btn--primary btn--lg', onclick: () => { T.store.update(st => { st.seenIntro = true; }); T.audio.sfx('win'); T.audio.unlock(); location.hash = '#/menu'; setTimeout(() => T.audio.playNarration('ui-welcome', { auto: true }), 300); } }, 'START MY JOURNEY'));
        setTimeout(() => T.audio.playNarration('thrive-ready', { auto: true }), 200);
      } else {
        box = h('div', { class: 'intro__box fade' }, h('div', { class: 'intro__lines' }, s.lines.map((l, i) => h('p', { style: { animationDelay: (i * 0.5) + 's' } }, l))),
          h('div', { class: 'row row--center' }, T.ui.speaker('Listen', () => T.audio.playNarration(s.audio, { sentences: true })),
            h('button', { class: 'btn btn--primary btn--lg', onclick: () => { T.audio.stopAudio(); n++; show(); if (slides[n].audio) T.audio.playNarration(slides[n].audio, { sentences: true, auto: true }); } }, 'NEXT')));
      }
      root.replaceChildren(box);
      if (n < 2) root.append(h('button', { class: 'link-btn intro__skip', onclick: () => { T.audio.stopAudio(); n = 2; show(); } }, 'Skip'));
    }
    show(); return root;
  };

  /* ---------- HOME ---------- */
  const MENU = [['progress', 'My Progress'], ['learn', 'Learn'], ['glossary', 'Glossary'], ['cp', 'Capaian Pembelajaran'], ['sound', 'Sound'], ['sources', 'Sources & Credits'], ['developer', 'Developer']];
  /* sprite-sheet pill (icon art kept intact) with its label underneath */
  const pill = (key, label, cls) => h('button', { class: 'pill ' + (cls || ''), onclick: go('#/' + key) }, img(T.img.btn[key], ''), h('span', null, label));
  /* THRIVE wordmark: one span per letter — colourful, chunky outline, playful entrance, gentle float and a shine wave */
  const wordmark = () => h('h1', { class: 'logo', 'aria-label': 'THRIVE' },
    'THRIVE'.split('').map((c, i) => h('span', { class: 'logo__l', style: { '--i': i }, 'aria-hidden': 'true' }, c)),
    img(T.img.fb.sparkle, '', 'logo__spark'));
  S.menu = () => {
    const m = T.mascots.find(x => x.key === T.store.mascot());
    return h('div', { class: 'home' },
      h('div', { class: 'home__top' }, T.ui.brandLink('brand-link--home')),
      h('header', { class: 'home__brand' },
        h('div', { class: 'home__title' }, wordmark(), h('p', { class: 'subtitle' }, 'The Life Skills Procedure Quest'), h('p', { class: 'tagline' }, 'Learn English. Make Smart Choices. Live Well.')),
        h('button', { class: 'home__buddy', onclick: go('#/progress'), 'aria-label': 'Your mascot: ' + m.name + '. Open My Progress.' }, T.ui.mascot('ready'), h('span', { class: 'home__buddy-say' }, 'Hi! I’m your ' + m.name + '.'))),
      h('nav', { class: 'home__nav', 'aria-label': 'Main menu' }, pill('play', 'PLAY', 'pill--play'), h('div', { class: 'home__grid' }, MENU.map(([k, l]) => pill(k, l)))),
      h('button', { class: 'link-btn', onclick: go('#/intro') }, 'Replay the opening'));
  };

  /* journey strip: six worlds + final mission */
  function journey() {
    const st = T.store, done = st.worldsDone();
    return h('div', { class: 'journey-strip', role: 'img', 'aria-label': 'Journey: ' + done + ' of 6 worlds complete' + (st.get().final.done ? ', final mission complete' : '') },
      T.worlds.map(w => h('span', { class: 'journey-strip__dot' + (st.worldComplete(w) ? ' done' : st.worldUnlocked(w) ? ' open' : ''), style: { '--c': w.color } }, st.worldComplete(w) ? icon('check') : w.id)),
      h('span', { class: 'journey-strip__dot journey-strip__dot--final' + (st.get().final.done ? ' done' : st.finalUnlocked() ? ' open' : '') }, img(T.img.fb.star, '')),
      h('b', null, done + ' / 6 worlds'));
  }

  /* ---------- WORLD MAP ---------- */
  S.play = () => {
    const st = T.store; let sel = st.currentWorld().id; const nodes = [];
    const info = h('aside', { class: 'world-info panel', 'aria-live': 'polite' });
    const map = h('div', { class: 'map' }, img(T.img.map, 'THRIVE world map: a green island path from the forest to the school'));
    function drawInfo() {
      if (sel === 'final') {
        const open = st.finalUnlocked();
        info.replaceChildren(h('div', { class: 'world-info__head' }, img(T.img.fb.sparkle, ''), h('div', null, h('p', { class: 'eyebrow' }, 'FINAL MISSION'), h('h2', null, T.finalMission.title), h('p', { class: 'note' }, 'Write and present your own procedure.'))),
          open ? h('button', { class: 'btn btn--primary btn--lg', onclick: go('#/final') }, st.get().final.done ? 'PLAY AGAIN' : 'START FINAL MISSION')
            : h('p', { class: 'locked-line' }, img(T.img.ui.lock, ''), 'Locked. Complete all six worlds to open it.'));
        return;
      }
      const w = T.worlds[sel - 1], open = st.worldUnlocked(w), mm = T.mainMission(w);
      info.replaceChildren(h('div', { class: 'world-info__head' }, img(T.img.worlds[w.id], ''), h('div', null, h('p', { class: 'eyebrow' }, 'WORLD ' + w.id), h('h2', null, w.name), h('p', { class: 'note' }, w.theme))),
        h('blockquote', null, w.quote),
        ...open ? [h('p', { class: 'note' }, (st.worldComplete(w) ? 'Complete · ' : 'Mission: ') + T.missions[mm.id].title + (st.worldStars(w) ? ' · Stars: ' + st.worldStars(w) : '')),
          h('button', { class: 'btn btn--primary btn--lg', onclick: go('#/world/' + w.id) }, 'ENTER WORLD')]
          : [h('p', { class: 'locked-line' }, img(T.img.ui.lock, ''), 'Locked. Complete World ' + (w.id - 1) + ' to open it.')]);
    }
    const choose = id => () => { sel = id; nodes.forEach(n => n.classList.toggle('sel', n.dataset.id == sel)); drawInfo(); T.audio.sfx('pop'); };
    T.worlds.forEach(w => {
      const open = st.worldUnlocked(w), done = st.worldComplete(w);
      const b = h('button', { class: 'node' + (open ? ' node--open' : ' node--lock') + (done ? ' node--complete' : '') + (sel === w.id ? ' sel' : ''), 'data-id': w.id, style: { left: w.pos[0] + '%', top: w.pos[1] + '%', '--c': w.color },
        'aria-label': 'World ' + w.id + ': ' + w.name + (done ? ', complete' : open ? '' : ', locked'), onclick: choose(w.id) },
        h('span', { class: 'node__art' }, img(T.img.worlds[w.id], ''), open ? null : img(T.img.ui.lock, '', 'node__lock'), done ? h('span', { class: 'node__done' }, icon('check')) : null),
        h('span', { class: 'node__lb' }, h('b', null, w.id), h('span', { class: 'node__name' }, w.name)));
      nodes.push(b); map.append(b);
    });
    const f = T.finalMission, fOpen = st.finalUnlocked();
    const fb = h('button', { class: 'node node--final' + (fOpen ? ' node--open' : ' node--lock') + (st.get().final.done ? ' node--complete' : ''), 'data-id': 'final', style: { left: f.pos[0] + '%', top: f.pos[1] + '%', '--c': '#f39a1e' },
      'aria-label': f.title + (fOpen ? '' : ', locked'), onclick: choose('final') },
      h('span', { class: 'node__art' }, img(T.img.fb.sparkle, ''), fOpen ? null : img(T.img.ui.lock, '', 'node__lock'), st.get().final.done ? h('span', { class: 'node__done' }, icon('check')) : null),
      h('span', { class: 'node__lb' }, h('span', { class: 'node__name' }, f.title)));
    nodes.push(fb); map.append(fb);
    // the mascot stands next to the current world
    const cur = st.currentWorld().pos, east = cur[0] > 70, left = east ? cur[0] - 9.5 : cur[0] + 7.5;
    map.append(h('div', { class: 'map-mascot', style: { left: left + '%', top: (cur[1] + (east ? 9 : 1)) + '%' } }, T.ui.mascot('ready')));
    drawInfo();
    return h('div', { class: 'map-page' }, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Choose a World'), journey()),
      h('div', { class: 'map-layout' }, map, info));
  };

  /* ---------- WORLD INTRO PAGE ---------- */
  S.world = id => {
    const w = T.worlds[(+id || 1) - 1];
    if (!w || !T.store.worldUnlocked(w)) { setTimeout(() => { location.hash = '#/play'; }); return h('div'); }
    const ready = w.missions.filter(m => m.ready && T.missions[m.id]), later = w.missions.filter(m => !m.ready);
    return h('div', null, h('div', { class: 'panel world-banner', style: { '--c': w.color } }, img(T.img.worlds[w.id], ''),
      h('div', null, h('p', { class: 'eyebrow' }, 'WORLD ' + w.id + ' · ' + w.theme), h('h1', null, w.name), h('p', { class: 'world-desc' }, w.desc), h('blockquote', null, w.quote))),
      T.ui.dialogue('happy', null, ['w' + w.id + '-world']),
      h('h2', { class: 'section-title' }, 'Mission'),
      h('div', { class: 'mission-list' }, ready.map(m => { const p = T.store.mission(m.id), M = T.missions[m.id];
        return h('button', { class: 'mission-card', onclick: go('#/mission/' + m.id) },
          img(T.img.worlds[w.id], '', 'mission-card__img'),
          h('span', { class: 'mission-card__txt' }, h('b', null, M.title), h('small', null, (p.done ? 'Completed' : 'Ready to play') + ' · ' + m.type + ' · ' + M.stages.length + ' activities')),
          h('span', { class: 'mission-card__stars', role: 'img', 'aria-label': p.stars + ' of 3 stars' }, [1, 2, 3].map(n => img(T.img.fb.starGold, '', n <= p.stars ? 'on' : 'off')))); })),
      later.length ? h('p', { class: 'note later-line' }, 'More missions later: ' + later.map(m => m.title).join(' · ')) : null);
  };

  /* ---------- LEARN ---------- */
  S.learn = () => {
    const L = T.learn; let n = 0; const root = h('div', { class: 'learn' });
    const reveal = t => h('div', { class: 'reveal', 'aria-live': 'polite' }, t);
    const say = t => { T.audio.speakText(t); T.audio.sfx('pop'); };
    const cards = [
      { t: 'What Is a Procedure Text?', f: () => { const out = reveal('Tap an example to see its steps.');
        return [h('p', { class: 'big' }, 'A procedure text tells us how to do or make something ', h('mark', null, 'step by step'), '.'),
          h('div', { class: 'ex-row' }, L.what.examples.map(e => h('button', { class: 'ex-card', onclick: () => { out.replaceChildren(h('b', null, e.title), h('ol', null, e.steps.map(s => h('li', null, s)))); say(e.title + '. ' + e.steps.join(' ')); } }, img(T.img.obj[e.obj], ''), h('span', null, e.title)))), out]; } },
      { t: 'Purpose', f: () => { const out = reveal('Tap a word.');
        return [h('p', { class: 'big' }, 'To help someone do something ', h('mark', null, 'correctly, safely, and clearly'), '.'),
          h('div', { class: 'row row--center' }, L.purpose.words.map(w => h('button', { class: 'chip-btn', onclick: () => { out.textContent = w.fb; say(w.fb); } }, w.w))), out]; } },
      { t: 'Main Structure', f: () => { let needTools = true; const open = new Set(); const box = h('div', { class: 'struct' });
        const draw = () => box.replaceChildren(...L.structure.map((p, i) => { const off = p.optional && !needTools;
          return h('button', { class: 'struct__part' + (open.has(i) ? ' open' : '') + (off ? ' off' : ''), 'aria-expanded': open.has(i), onclick: () => { open.has(i) ? open.delete(i) : open.add(i); T.audio.sfx('pop'); draw(); } },
            h('span', { class: 'part-tag part-tag--' + ['goal', 'tool', 'steps'][i] }, p.part), h('b', null, p.q), open.has(i) ? h('em', null, off ? 'Not needed here. Example: How to calm down — just breathe.' : 'Example: ' + p.ex) : null); }));
        draw();
        const tog = h('button', { class: 'switch-mini', role: 'switch', 'aria-checked': 'true', onclick: e => { needTools = !needTools; e.currentTarget.setAttribute('aria-checked', needTools); e.currentTarget.lastChild.textContent = needTools ? 'YES' : 'NO'; draw(); } }, 'This procedure needs tools: ', h('b', null, 'YES'));
        return [h('p', { class: 'big' }, 'Tap each part.'), box, tog, h('p', { class: 'note' }, 'Important: materials or tools are not always required.')]; } },
      { t: 'Procedure Text Types', f: () => { let k = 0; const panel = h('div');
        const tabs = h('div', { class: 'tabs', role: 'tablist' });
        const draw = () => { const ty = L.types[k];
          tabs.replaceChildren(...L.types.map((x, i) => h('button', { role: 'tab', 'aria-selected': i === k, class: 'tab' + (i === k ? ' on' : ''), style: { '--c': x.color }, onclick: () => { k = i; draw(); } }, x.name)));
          panel.replaceChildren(h('div', { class: 'type-card', style: { '--c': ty.color } }, img(T.img.worlds[ty.world], ''), h('div', null, h('h3', null, ty.name), h('p', null, ty.desc),
            h('ul', { class: 'type-list' }, ty.examples.map(e => h('li', null, e)))))); };
        draw(); return [h('p', { class: 'big' }, 'Procedure text is ', h('mark', null, 'not only recipes'), '.'), tabs, panel]; } },
      { t: 'Imperative Verbs', f: () => { let q = 0; const hold = h('div'); const out = reveal('');
        const draw = () => { const p = L.practice[q]; out.textContent = '';
          hold.replaceChildren(h('p', { class: 'note' }, 'Practice ' + (q + 1) + ' of ' + L.practice.length), h('p', { class: 'big big--blank' }, p.before + ' ', h('span', { class: 'blank' }, '___'), ' ' + p.after),
            h('div', { class: 'row row--center' }, p.opts.map(o => h('button', { class: 'chip-btn', onclick: e => {
              if (o === p.answer) { hold.querySelector('.blank').textContent = o; e.currentTarget.classList.add('right'); T.audio.sfx('correct'); out.textContent = 'Correct: ' + p.fb; T.audio.speakText(p.fb); if (q < L.practice.length - 1) setTimeout(() => { q++; draw(); }, 1800); else out.textContent += ' Practice complete!'; }
              else { T.audio.sfx('wrong'); out.textContent = 'Mistakes are clues. Which word is an action that fits?'; } } }, o)))); };
        draw();
        return [h('p', { class: 'big' }, 'Steps start with an ', h('mark', null, 'action word'), ' (base verb).'),
          h('div', { class: 'verb-cloud' }, L.verbs.map(v => h('button', { class: 'verb', onclick: () => { T.audio.playWordAudio(v); T.store.discover(v); } }, v))), hold, out]; } },
      { t: 'Sequence Markers', f: () => { let next = 0; const order = ['First', 'Next', 'Then', 'After that', 'Finally']; const placed = h('ol', { class: 'plain-steps' }); const out = reveal('Tap the steps in order. The sequence markers are your clues.');
        const bank = h('div', { class: 'step-bank' }, L.markerGame.map(s => h('button', { class: 'step-tile', onclick: e => {
          if (s.m === order[next]) { next++; e.currentTarget.remove(); placed.append(h('li', null, h('b', null, s.m), ', ' + s.t)); T.audio.sfx('correct'); if (next === order.length) { out.textContent = 'Good thinking — order matters!'; say(order.join(', ')); } }
          else { T.audio.sfx('wrong'); out.textContent = next ? 'Not yet. Which step comes after “' + order[next - 1] + '”?' : 'Not yet. Which step comes first?'; } } }, h('b', null, s.m), ', ' + s.t)));
        return [h('div', { class: 'row row--center' }, L.markers.map(m => h('span', { class: 'marker-chip' }, m))), bank, placed, out]; } },
      { t: 'Adverbs', f: () => [h('p', { class: 'big' }, 'Adverbs tell us ', h('mark', null, 'how'), ' to do the action. Tap a card.'),
        h('div', { class: 'adv-grid' }, L.adverbs.map(a => { const c = h('button', { class: 'adv adv--' + a.w, onclick: () => { c.classList.remove('go'); void c.offsetWidth; c.classList.add('go'); say(a.ex); } },
          h('span', { class: 'adv__dot', 'aria-hidden': 'true' }), h('b', null, a.w), h('small', null, a.id), h('em', null, a.ex)); return c; }))] }
    ];
    function draw() {
      root.replaceChildren(
        h('div', { class: 'learn__tabs', role: 'tablist' }, cards.map((c, i) => h('button', { role: 'tab', 'aria-selected': i === n, class: 'learn__tab' + (i === n ? ' on' : ''), onclick: () => { n = i; draw(); } }, h('b', null, i + 1), h('span', null, c.t)))),
        h('section', { class: 'panel learn__card fade' }, h('h2', null, cards[n].t), cards[n].f()),
        h('div', { class: 'learn__nav' }, h('button', { class: 'btn btn--ghost', disabled: n === 0, onclick: () => { n--; draw(); } }, 'BACK'),
          n < cards.length - 1 ? h('button', { class: 'btn btn--primary', onclick: () => { n++; draw(); } }, 'NEXT') : h('button', { class: 'btn btn--primary', onclick: go('#/play') }, 'PLAY WORLD 1')));
    }
    draw(); return h('div', null, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Learn'), h('p', { class: 'note' }, 'Short interactive cards about procedure text.')), root);
  };

  /* ---------- GLOSSARY ---------- */
  S.glossary = () => {
    let cat = T.glossary[0].key; const grid = h('div', { class: 'gl-grid' }); const count = h('p', { class: 'gl-count' }); const head = h('p', { class: 'note' });
    const tabs = h('div', { class: 'tabs', role: 'tablist' });
    const hl = (ex, w) => { const i = ex.toLowerCase().indexOf(w.toLowerCase()); return i < 0 ? ex : [ex.slice(0, i), h('mark', null, ex.slice(i, i + w.length)), ex.slice(i + w.length)]; };
    function upd() { count.replaceChildren(img(T.img.fb.star, ''), 'Words discovered: ' + T.store.get().glossary.length + ' / ' + T.glossaryTotal()); }
    function draw() {
      const c = T.glossary.find(x => x.key === cat), seen = T.store.get().glossary;
      upd(); head.textContent = c.note;
      tabs.replaceChildren(...T.glossary.map(x => h('button', { role: 'tab', 'aria-selected': x.key === cat, class: 'tab' + (x.key === cat ? ' on' : ''), style: { '--c': x.color }, onclick: () => { cat = x.key; draw(); } }, x.name)));
      grid.replaceChildren(...c.words.map(x => { const card = h('article', { class: 'gl-card' + (seen.includes(x.w) ? ' seen' : ''), style: { '--c': c.color } },
        h('div', { class: 'gl-top' }, h('h3', null, x.w), T.ui.speaker('Hear pronunciation of ' + x.w, () => {
          if (!T.audio.speakGlossaryWord(x.w, x.ex)) return T.ui.toast(T.audio.speechSupported ? 'Voice is OFF. Turn it on in Sound to hear words.' : 'This browser cannot speak words.');
          if (T.store.discover(x.w)) { card.classList.add('seen'); upd(); }       // new word: saved to localStorage, counter updated (a repeated word is never counted twice)
        })),
        h('p', { class: 'gl-id' }, x.id), h('p', { class: 'gl-ex' }, hl(x.ex, x.w)), h('span', { class: 'gl-ctx' }, x.ctx), h('span', { class: 'gl-seen' }, icon('check'), 'discovered'));
        return card; }));
    }
    draw();
    return h('div', null, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Life Words'), count), h('p', { class: 'lead lead--left' }, 'A2 words in context. Tap the speaker to hear a word and discover it.'), tabs, head, grid);
  };
})();
