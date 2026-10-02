/* FINAL MISSION — Create Your Life Guide (celebration + assessment) and the graduation ending.
 * Steps: 1 topic · 2 goal · 3 materials (if needed) · 4 steps (3–5, bank or own) · 5 sequence markers · 6 card + read aloud → graduation */
(function () {
  const T = window.THRIVE, { h, img, icon } = T.ui, S = T.screens = T.screens || {};
  const MARKERS = ['First', 'Next', 'Then', 'After that', 'Finally'], MID = ['Next', 'Then', 'After that'];
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  const STEP_NAMES = ['Topic', 'Goal', 'Materials', 'Steps', 'Sequence', 'My Guide'];

  S.final = () => {
    if (!T.store.finalUnlocked()) { setTimeout(() => { location.hash = '#/play'; }); return h('div'); }
    const L = T.lifeGuide, root = h('div', { class: 'final' });
    const saved = T.store.get().final.guide;
    const g = saved ? JSON.parse(JSON.stringify(saved)) : { topic: null, goal: '', materials: [], none: false, steps: [] };
    let step = 0;
    const topic = () => L.topics.find(t => t.key === g.topic);

    function preview() {
      T.audio.stopAudio();
      root.replaceChildren(h('div', { class: 'panel mission-intro' },
        h('div', { class: 'mission-intro__art' }, img(T.img.fb.sparkle, 'Final mission'), T.ui.mascot('happy', 'mission-intro__mascot')),
        h('div', { class: 'mission-intro__txt' }, h('p', { class: 'eyebrow' }, 'FINAL MISSION'), h('h1', null, 'Create Your Life Guide'),
          h('p', { class: 'lead' }, 'You finished six worlds. Now write your own procedure for real life, and present it like a THRIVE graduate!'),
          h('ul', { class: 'phase-preview' }, STEP_NAMES.map(n => h('li', null, n))),
          h('button', { class: 'btn btn--primary btn--lg', onclick: () => { T.audio.sfx('pop'); firstEntry = true; draw(null, true); } }, saved ? 'IMPROVE MY GUIDE' : 'START FINAL MISSION'))));
    }

    /* one wizard page per step; NEXT validates, BACK keeps everything */
    /* narration for each wizard step — explicit clip ids; the first step is preceded by the intro */
    const STEP_AUDIO = [['final-choose'], ['final-goal'], ['final-materials'], ['final-steps'], ['final-check'], ['final-present']];
    let firstEntry = false;
    /* draw(msg, enter): `enter` = the learner just arrived on this step (start, Next, Back, Improve): stop old audio and play the step's narration.
     * Redraws caused by taps inside a step do not touch the audio. */
    function draw(msg, enter) {
      if (enter) T.audio.stopAudio();
      const narration = step === 0 && firstEntry ? ['final-intro'].concat(STEP_AUDIO[0]) : STEP_AUDIO[step];
      if (enter) firstEntry = false;                      // the intro line is only spoken on the very first arrival
      const body = h('div', { class: 'stage__body' }), fb = h('div', { class: 'feedback feedback--no', hidden: !msg, role: 'status' }, T.ui.mascot('think', 'feedback__mascot'), h('div', { class: 'feedback__txt' }, h('p', null, msg || '')));
      PAGES[step](body);
      const nav = h('div', { class: 'stage__foot' },
        step > 0 && step < 5 ? h('button', { class: 'btn btn--ghost btn--lg', onclick: () => { step--; draw(null, true); } }, 'BACK') : null,
        step < 4 ? h('button', { class: 'btn btn--primary btn--lg', onclick: next }, 'NEXT') : null,
        step === 4 ? h('button', { class: 'btn btn--primary btn--lg', onclick: next }, 'SHOW MY PROCEDURE') : null);
      root.replaceChildren(
        h('ol', { class: 'wizard', 'aria-label': 'Final mission steps' }, STEP_NAMES.map((n, i) => h('li', { class: i < step ? 'done' : i === step ? 'now' : '', 'aria-current': i === step ? 'step' : null },
          h('span', null, i < step ? icon('check') : i + 1), h('b', null, n)))),
        T.ui.dialogue(step === 5 ? 'happy' : 'ready', null, narration),
        h('section', { class: 'stage panel' }, h('h2', null, 'Step ' + (step + 1) + ' · ' + STEP_NAMES[step]), body, fb, nav));
      if (enter) { window.scrollTo({ top: 0 }); T.audio.playNarration(narration, { auto: true }); }
    }

    function next() {
      const err = CHECK[step]();
      if (err) { T.audio.sfx('wrong'); return draw(err); }
      T.audio.sfx('correct'); step++; draw(null, true);
    }

    const chip = (label, on, onclick, extra) => h('button', { class: 'step-chip' + (on ? ' on' : '') + (extra ? ' ' + extra : ''), 'aria-pressed': !!on, onclick }, label);
    const own = (placeholder, onAdd, prefix) => { const inp = h('input', { type: 'text', class: 'own-input', placeholder, maxlength: 80, 'aria-label': placeholder });
      return h('div', { class: 'own-row' }, prefix ? h('span', { class: 'own-prefix' }, prefix) : null, inp, h('button', { class: 'btn btn--ghost btn--sm', onclick: () => onAdd(inp.value.trim(), inp) }, 'ADD')); };

    const PAGES = [
      /* 1 topic */
      body => body.append(h('div', { class: 'topic-grid' }, L.topics.map(t => h('button', { class: 'topic-card' + (g.topic === t.key ? ' on' : ''), 'aria-pressed': g.topic === t.key,
        onclick: () => { if (g.topic !== t.key) { g.topic = t.key; g.goal = ''; g.materials = []; g.none = false; g.steps = []; } T.audio.sfx('tap'); draw(); } }, img(T.img.worlds[t.world], ''), h('b', null, t.name))))),
      /* 2 goal */
      body => body.append(h('div', { class: 'choice-list' }, topic().goals.map(x => h('button', { class: 'choice' + (g.goal === x ? ' on' : ''), 'aria-pressed': g.goal === x, onclick: () => { g.goal = x; draw(); } }, x))),
        h('p', { class: 'sub-line' }, 'Or write your own goal:'),
        own('your goal, e.g. make a healthy drink', (v, inp) => { if (v.length < 3) return; g.goal = 'How to ' + v.replace(/^how to /i, '').replace(/[.!?]+$/, ''); inp.value = ''; draw(); }, 'How to'),
        g.goal ? h('p', { class: 'picked' }, icon('check'), 'Your goal: ', h('b', null, g.goal)) : null),
      /* 3 materials */
      body => body.append(h('div', { class: 'chip-bank' }, topic().materials.map(x => chip(x, g.materials.includes(x), () => { g.none = false; g.materials.includes(x) ? g.materials.splice(g.materials.indexOf(x), 1) : g.materials.push(x); draw(); })),
        chip('No materials needed', g.none, () => { g.none = !g.none; if (g.none) g.materials = []; draw(); }, 'step-chip--none')),
        h('p', { class: 'sub-line' }, 'Add your own material:'),
        own('e.g. a bottle of water', (v, inp) => { if (!v) return; g.none = false; if (!g.materials.includes(v)) g.materials.push(v); inp.value = ''; draw(); }),
        g.materials.length ? h('p', { class: 'picked' }, icon('check'), 'Materials: ', h('b', null, g.materials.join(', '))) : null),
      /* 4 steps */
      body => {
        const list = h('ol', { class: 'build-list' }, g.steps.length ? g.steps.map((x, i) => h('li', { class: 'build-line' }, h('span', { class: 'slot__n' }, i + 1), h('span', { class: 'build-line__t' }, cap(x.t)),
          h('button', { class: 'mini-btn mini-btn--move', 'aria-label': 'Move step ' + (i + 1) + ' up', disabled: i === 0, onclick: () => { [g.steps[i - 1], g.steps[i]] = [g.steps[i], g.steps[i - 1]]; draw(); } }, '↑'),
          h('button', { class: 'mini-btn', 'aria-label': 'Remove step ' + (i + 1), onclick: () => { g.steps.splice(i, 1); draw(); } }, '×'))) : [h('li', { class: 'slot-empty' }, 'Tap steps below or write your own (3–5 steps).')]);
        body.append(list, h('h3', { class: 'sub' }, 'Step ideas'),
          h('div', { class: 'chip-bank' }, topic().steps.map(x => chip('+ ' + cap(x), false, () => { if (g.steps.length < 5 && !g.steps.some(s => s.t === x)) { g.steps.push({ t: x, m: '' }); draw(); } }, g.steps.some(s => s.t === x) ? 'used' : ''))),
          h('h3', { class: 'sub' }, 'Write your own step'),
          own('e.g. Drink a glass of water.', (v, inp) => {
            if (!v) return; if (g.steps.length >= 5) return draw('You already have 5 steps. Remove one first.');
            const first = v.toLowerCase().replace(/[^a-z' ]/g, '').split(' ')[0];
            if (!L.verbs.includes(first)) return draw('Start your step with an action word (imperative verb), for example: Wash…, Check…, Help…, Do not…');
            let t = v.charAt(0).toLowerCase() + v.slice(1); if (!/[.!?]$/.test(t)) t += '.';
            g.steps.push({ t, m: '', own: true }); inp.value = ''; draw(); }));
      },
      /* 5 markers */
      body => body.append(h('ol', { class: 'build-list' }, g.steps.map((x, k) => h('li', { class: 'build-line' }, h('span', { class: 'slot__n' }, k + 1),
        h('select', { 'aria-label': 'Sequence marker for step ' + (k + 1), onchange: e => { x.m = e.target.value; } }, h('option', { value: '' }, 'choose…'), MARKERS.map(m => h('option', { value: m, selected: x.m === m }, m))),
        h('span', { class: 'build-line__t' }, ', ' + x.t))))),
      /* 6 the card */
      body => {
        const currentText = () => g.goal + '. ' + (g.materials.length ? 'You need ' + g.materials.join(', ') + '. ' : '') + g.steps.map(x => x.m + ', ' + x.t).join(' ');   // the learner's guide as it is now
        const boxes = ['I read every step aloud.', 'I used sequence markers.', 'I presented my guide clearly to someone.'].map(c => h('label', { class: 'check-row' }, h('input', { type: 'checkbox' }), h('span', null, c)));
        body.append(guideCard(g),
          T.ui.learnerSpeechBar(currentText),
          h('p', { class: 'sub-line' }, 'Now present it aloud yourself. Then tick the boxes.'), h('div', { class: 'checks' }, boxes),
          h('div', { class: 'stage__foot' },
            h('button', { class: 'btn btn--ghost btn--lg', onclick: () => { step = 1; draw(null, true); } }, 'IMPROVE MY PROCEDURE'),
            h('button', { class: 'btn btn--primary btn--lg', onclick: () => {
              if (!boxes.every(b => b.querySelector('input').checked)) return T.ui.toast('Tick all three boxes when you are ready.');
              T.store.update(s => { s.final.guide = JSON.parse(JSON.stringify(g)); s.final.done = true; if (!s.badges.includes('final')) s.badges.push('final'); });
              T.store.awardFinal(T.finalMission.dims); location.hash = '#/graduation'; } }, 'I PRESENTED MY GUIDE')));
      }
    ];

    const CHECK = [
      () => !g.topic && 'Choose a topic first.',
      () => !g.goal && 'Choose or write a goal.',
      () => (!g.materials.length && !g.none) && 'Choose materials, or tap “No materials needed”.',
      () => (g.steps.length < 3 ? 'Choose at least 3 steps.' : g.steps.length > 5 ? 'Use 5 steps or fewer.' : ''),
      () => {
        if (g.steps.some(s => !s.m)) return 'Choose a sequence marker for every step.';
        const ms = g.steps.map(s => s.m), last = ms.length - 1;
        const ok = ms[0] === 'First' && ms[last] === 'Finally' && ms.slice(1, last).every(x => MID.includes(x)) && new Set(ms.slice(1, last)).size === last - 1;
        return ok ? '' : 'Almost there! Start with “First”, end with “Finally”, and use different markers in the middle.';
      }
    ];
    preview(); return root;
  };

  function guideCard(g) {
    return h('div', { class: 'final-card final-card--big guide-card' }, h('span', { class: 'part-tag part-tag--goal' }, 'MY LIFE GUIDE'),
      h('h3', null, g.goal),
      h('p', { class: 'card-tools' }, h('b', null, 'Materials: '), g.materials.length ? g.materials.join(', ') : 'No materials needed.'),
      h('ol', null, g.steps.map(s => h('li', null, s.m + ', ' + s.t))));
  }

  /* ---------- GRADUATION ---------- */
  S.graduation = () => {
    const st = T.store.get();
    if (!st.final.done) { setTimeout(() => { location.hash = '#/play'; }); return h('div'); }
    T.audio.sfx('win'); const gt = setTimeout(() => T.audio.playNarration('final-complete', { auto: true }), 400); T.app.onLeave(() => clearTimeout(gt));
    const can = ['You can take care of yourself.', 'You can think before you act.', 'You can communicate clearly.', 'You can work with others.', 'You respect differences.', 'You make responsible choices.'];
    return h('div', { class: 'graduation' },
      h('div', { class: 'panel grad-hero' }, T.ui.mascot('happy', 'grad-hero__mascot'), h('div', null, h('p', { class: 'eyebrow' }, 'GRADUATION'), h('h1', { class: 'grad-title' }, 'YOU ARE READY TO THRIVE!'),
        h('ul', { class: 'grad-list' }, can.map(c => h('li', null, icon('check'), c))))),
      h('div', { class: 'progress-top' }, h('div', { class: 'panel progress-compass' }, h('h2', null, 'My Life Compass'), S.compass()),
        h('div', { class: 'panel grad-status' }, h('p', { class: 'eyebrow' }, 'WELL-BEING STATUS'), h('p', { class: 'grad-badge' }, img(T.img.fb.sparkle, ''), 'THRIVING LEARNER'),
          st.final.guide ? guideCard(st.final.guide) : null)),
      h('div', { class: 'panel grad-final' }, h('p', { class: 'grad-big' }, 'YOU DIDN’T JUST FINISH A GAME.'), h('p', { class: 'grad-big grad-big--2' }, 'YOU LEARNED HOW TO THRIVE.'),
        h('p', { class: 'tagline' }, 'Learn English. Make Smart Choices. Live Well.'),
        h('div', { class: 'row row--center' }, h('button', { class: 'btn btn--primary', onclick: () => { location.hash = '#/progress'; } }, 'MY PROGRESS'),
          h('button', { class: 'btn btn--ghost', onclick: () => { location.hash = '#/play'; } }, 'BACK TO THE MAP'))));
  };
})();
