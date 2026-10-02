/* mission runner: story dialogue, phase tracker, stage player, feedback, rewards
 * Navigation: PREVIOUS (mission bar) = one stage back inside the mission; top-bar Back = leave the mission. */
(function () {
  const T = window.THRIVE, { h, img, icon } = T.ui;
  const PHASES = [['observe', 'OBSERVE'], ['understand', 'UNDERSTAND'], ['fix', 'FIX'], ['do', 'DO'], ['create', 'CREATE']];
  const OK = ['Great thinking!', 'Good choice!', 'Well done!', 'Every good choice helps you grow.', 'Small steps build healthy habits.'];
  const NO = ['Mistakes are clues. Try again.', 'Think first. Choose wisely.', 'Almost there!'];
  const pick = a => a[Math.floor(Math.random() * a.length)];

  T.screens = T.screens || {};
  T.screens.mission = function (id) {
    const m = T.missions[id]; if (!m) { setTimeout(() => { location.hash = '#/play'; }); return h('div'); }
    const world = T.worlds[m.world - 1];
    if (!T.store.worldUnlocked(world)) { setTimeout(() => { location.hash = '#/play'; }); return h('div'); }   // locked worlds stay locked
    let i = 0, stageAttempts = 0, cleanups = [];
    let stageStars = [];                              // stars per stage index, recorded once (going back never adds more)
    const root = h('div', { class: 'mission' });
    const clean = () => { cleanups.forEach(f => f()); cleanups = []; };
    T.app.onLeave(clean);

    /* mission preview: silent — nothing autoplays until START MISSION */
    function intro() {
      clean(); T.audio.stopAudio();
      root.replaceChildren(h('div', { class: 'panel mission-intro' },
        h('div', { class: 'mission-intro__art' }, img(T.img.worlds[m.world], world.name), T.ui.mascot('ready', 'mission-intro__mascot')),
        h('div', { class: 'mission-intro__txt' }, h('p', { class: 'eyebrow' }, 'WORLD ' + m.world + ' · ' + world.name.toUpperCase()), h('h1', null, m.title),
          h('p', { class: 'lead' }, m.intro),
          h('ul', { class: 'phase-preview' }, PHASES.map(p => h('li', null, p[1]))),
          h('p', { class: 'note' }, m.stages.length + ' short activities · about 10 minutes'),
          h('button', { class: 'btn btn--primary btn--lg', onclick: () => { T.audio.sfx('pop'); stage(); } }, 'START MISSION'))));
    }

    function tracker(cur) {
      const idx = PHASES.findIndex(p => p[0] === cur);
      return h('ol', { class: 'phases', 'aria-label': 'Mission phases' }, PHASES.map((p, k) => h('li', { class: k < idx ? 'done' : k === idx ? 'now' : '', 'aria-current': k === idx ? 'step' : null },
        h('span', { class: 'phases__dot', 'aria-hidden': 'true' }, k < idx ? icon('check') : k + 1), h('b', null, p[1]))));
    }

    function stage() {
      clean(); T.audio.stopAudio();                 // stop + reset the previous stage's audio before anything new
      const st = m.stages[i]; stageAttempts = 0; let solved = false;
      const revisit = stageStars[i] != null;        // this stage was already solved earlier
      const body = h('div', { class: 'stage__body' }), fb = h('div', { class: 'feedback', hidden: true, role: 'status', 'aria-live': 'polite' }), foot = h('div', { class: 'stage__foot' });
      let checkBtn = null, skipBtn = null;
      const showFb = (kind, text, extra) => {
        fb.hidden = false; fb.className = 'feedback feedback--' + kind;
        fb.replaceChildren(T.ui.mascot(kind === 'ok' ? 'happy' : 'think', 'feedback__mascot'),
          h('div', { class: 'feedback__txt' }, h('strong', null, img(kind === 'ok' ? T.img.fb.star : T.img.fb.idea, '', 'feedback__ic'), kind === 'ok' ? pick(OK) : kind === 'no' ? pick(NO) : 'Tip'), h('p', null, text), extra || null));
      };
      const api = {
        say: (clip, o) => T.audio.playInstructionAudio(clip, o),
        feedback: t => showFb('info', t),
        cleanup: f => cleanups.push(f),
        result(ok, msg) {
          if (solved) return;
          if (!ok) { stageAttempts++; T.audio.sfx('wrong'); showFb('no', msg); return; }
          solved = true; T.audio.sfx('correct');
          if (!revisit) stageStars[i] = stageAttempts === 0 ? 3 : stageAttempts === 1 ? 2 : 1;
          if (skipBtn) skipBtn.remove();
          const award = T.store.awardStage(m.id, st);
          const chips = award.gained.length ? h('p', { class: 'gains' }, award.gained.map(k => { const d = T.dimByKey[k];
            return h('span', { class: 'gain', style: { '--c': d.color } }, img(T.badgeSrc(k), ''), '+1 ' + d.en); })) : null;
          showFb('ok', msg, chips);
          award.badges.forEach(b => { const [k, t] = b.split(':'); setTimeout(() => { T.audio.sfx('star'); T.ui.toast('Badge unlocked: ' + T.dimByKey[k].badge + ' ' + '★'.repeat(+t)); }, 600); });
          if (checkBtn) checkBtn.hidden = true;
          foot.append(h('button', { class: 'btn btn--primary btn--lg', onclick: next }, i < m.stages.length - 1 ? 'CONTINUE' : 'FINISH MISSION'));
          fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      };
      api.check = (label, fn) => { checkBtn = h('button', { class: 'btn btn--primary btn--lg', onclick: () => {
        const r = fn(); if (!r) return; if (r.toast) return T.ui.toast(r.toast);
        api.result(r.ok, r.msg); if (!r.ok && r.reset) r.reset(); } }, label); foot.prepend(checkBtn); };

      const prevBtn = h('button', { class: 'prev-btn', disabled: i === 0, 'aria-label': i === 0 ? 'Previous question (this is the first question)' : 'Previous question: go back to question ' + i, title: 'Previous question', onclick: prev },
        icon('back'), h('span', null, 'Previous'));
      if (revisit) { skipBtn = h('button', { class: 'btn btn--ghost btn--lg', onclick: next }, 'NEXT STAGE'); foot.append(skipBtn); }
      root.replaceChildren(
        h('div', { class: 'mission__bar' }, prevBtn, tracker(st.phase), h('span', { class: 'mission__count' }, (i + 1) + ' / ' + m.stages.length)),
        T.ui.dialogue(st.mood || 'ready', st.line, st.narration),
        h('section', { class: 'stage panel' }, h('h2', null, st.title), st.prompt ? h('p', { class: 'prompt' }, st.prompt) : null, body, fb, foot));
      T.activities[st.type](body, st, api, m);
      if (st.narration) T.audio.playNarration(st.narration, { auto: true });   // explicit keys from the stage data, never an index
      window.scrollTo({ top: 0 });
    }

    function next() { T.audio.stopAudio(); if (++i < m.stages.length) stage(); else finish(); }
    /* previous question: stop audio first, then show the previous stage (its own narration, Replay and Slow) */
    function prev() { if (i === 0) return; T.audio.stopAudio(); T.audio.sfx('tap'); i--; stage(); }

    function finish() {
      clean(); T.audio.stopAudio();
      const stars = m.stages.reduce((n, _, k) => n + (stageStars[k] || 1), 0);
      const ratio = stars / (m.stages.length * 3), got = ratio > 0.85 ? 3 : ratio > 0.6 ? 2 : 1;
      const wasDone = T.store.worldsDone();
      const isNew = T.store.completeMission(m.id, got);
      const nextWorld = T.worlds[m.world];                                  // world after this one (undefined after World 6)
      const opened = T.store.worldsDone() > wasDone; T.audio.sfx('win'); T.audio.playNarration(m.completeNarration, { auto: true });
      const dims = [...new Set(m.stages.flatMap(s => s.dims))];
      const built = T.store.get().built[m.id];
      root.replaceChildren(h('div', { class: 'panel reward' },
        h('div', { class: 'reward__head' }, T.ui.mascot('happy', 'reward__mascot'), h('div', null, h('p', { class: 'eyebrow' }, 'MISSION COMPLETE'), h('h1', null, m.title),
          h('div', { class: 'stars', role: 'img', 'aria-label': got + ' out of 3 stars' }, [1, 2, 3].map(n => img(T.img.fb.starGold, '', n <= got ? 'on' : 'off'))))),
        h('p', { class: 'lead' }, m.completeText),
        built ? h('div', { class: 'final-card' }, h('span', { class: 'part-tag part-tag--goal' }, 'MY PROCEDURE'), h('h3', null, built.goal), h('ol', null, built.steps.map(t => h('li', null, t)))) : null,
        h('h3', { class: 'sub' }, 'Your Life Compass grew in:'),
        h('div', { class: 'gains gains--big' }, dims.map(k => { const d = T.dimByKey[k]; return h('span', { class: 'gain', style: { '--c': d.color } }, img(T.badgeSrc(k), ''), d.en); })),
        isNew ? h('p', { class: 'badge-pop' }, img(T.img.worlds[m.world], ''), 'New badge: ' + m.badge) : null,
        opened && nextWorld ? h('p', { class: 'unlock-pop' }, img(T.img.ui.unlock, ''), 'World ' + nextWorld.id + ' is now open: ' + nextWorld.name + '!') : null,
        opened && !nextWorld ? h('p', { class: 'unlock-pop' }, img(T.img.fb.sparkle, ''), 'The FINAL MISSION is now open: Create Your Life Guide!') : null,
        h('div', { class: 'row row--center' },
          nextWorld && T.store.worldUnlocked(nextWorld) ? h('button', { class: 'btn btn--primary', onclick: () => { location.hash = '#/world/' + nextWorld.id; } }, 'GO TO WORLD ' + nextWorld.id)
            : !nextWorld && T.store.finalUnlocked() ? h('button', { class: 'btn btn--primary', onclick: () => { location.hash = '#/final'; } }, 'FINAL MISSION') : null,
          h('button', { class: nextWorld || T.store.finalUnlocked() ? 'btn btn--ghost' : 'btn btn--primary', onclick: () => { location.hash = '#/play'; } }, 'BACK TO THE MAP'),
          h('button', { class: 'btn btn--ghost', onclick: () => { location.hash = '#/progress'; } }, 'MY LIFE COMPASS'),
          h('button', { class: 'btn btn--ghost', onclick: () => { i = 0; stageStars = []; intro(); } }, 'PLAY AGAIN'))));
      window.scrollTo({ top: 0 });
    }
    intro(); return root;
  };
})();
