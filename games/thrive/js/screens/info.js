/* screens: capaian pembelajaran + curriculum map, progress (life compass), sound, sources, developer */
(function () {
  const T = window.THRIVE, { h, img, icon } = T.ui, S = T.screens = T.screens || {};

  /* ---------- CAPAIAN PEMBELAJARAN ---------- */
  const TBA = () => h('span', { class: 'tba' }, 'SOURCE TO BE ADDED');
  S.cp = () => {
    const C = T.curriculum, O = T.cpOfficial; let tab = 'official'; const body = h('div'); const tabs = h('div', { class: 'tabs', role: 'tablist' });
    function draw() {
      tabs.replaceChildren(...[['official', 'Official Capaian Pembelajaran'], ['support', 'How THRIVE Supports the CP']].map(([k, l]) => h('button', { role: 'tab', 'aria-selected': tab === k, class: 'tab' + (tab === k ? ' on' : ''), onclick: () => { tab = k; draw(); } }, l)));
      body.replaceChildren(tab === 'official'
        ? h('div', null,
            h('div', { class: 'cp-grid' }, O.elements.map(o => h('article', { class: 'cp-card' }, img(T.img.btn[o.icon], '', 'cp-card__pill'), h('h3', null, o.name),
              o.id ? h('p', { class: 'cp-id', lang: 'id' }, o.id) : null, h('p', { lang: 'en' }, o.en)))),
            h('p', { class: 'cp-source' }, 'Source: ', O.source ? O.source : TBA()))
        : h('div', null, h('div', { class: 'cp-grid' }, C.supports.map(x => h('article', { class: 'cp-card' }, h('h3', null, x.skill), h('ul', null, x.items.map(i => h('li', null, i)))))),
          h('h3', { class: 'sub' }, 'Game learning goals'), h('ul', { class: 'goal-list' }, C.goals.map(g => h('li', null, icon('check'), g)))));
    }
    draw();
    const facts = h('div', { class: 'facts' }, C.facts.map(f => h('div', { class: 'fact' }, h('small', null, f.k), h('b', null, f.v))));
    /* rows come straight from each mission's stage data (align + dims), so the map always matches what students play */
    const head = ['Activity', 'Skill', 'Procedure Text Competency', 'Language Feature', 'Graduate Profile Dimension'];
    const rowEl = r => h('div', { class: 'cmap__row', role: 'row' },
      h('span', { role: 'cell', 'data-h': head[0] }, h('b', null, r.activity), r.purpose ? h('small', { class: 'cmap__purpose' }, r.purpose) : null),
      [r.skill, r.competency, r.feature].map((v, i) => h('span', { role: 'cell', 'data-h': head[i + 1] }, v)),
      h('span', { role: 'cell', 'data-h': head[4], class: 'cmap__dims' }, r.dims.map(k => { const d = T.dimByKey[k];
        return h('span', { class: 'cmap__dim' }, img(T.badgeSrc(k), ''), h('span', null, d.id, h('small', null, d.en))); })));
    const table = rows => h('div', { class: 'cmap', role: 'table' }, h('div', { class: 'cmap__row cmap__row--head', role: 'row' }, head.map(x => h('span', { role: 'columnheader' }, x))), rows.map(rowEl));
    const groups = T.worlds.map(w => { const M = T.missions[T.mainMission(w).id];
      const rows = M.stages.map(st => ({ activity: st.align.label || st.title, purpose: st.align.purpose, skill: st.align.skill, competency: st.align.competency, feature: st.align.feature, dims: st.dims }));
      return h('details', { class: 'cmap-group', open: w.id === 1 }, h('summary', null, img(T.img.worlds[w.id], ''), h('span', null, h('b', null, 'World ' + w.id + ' · ' + w.name), h('small', null, M.title + ' · ' + M.stages.length + ' activities'))), table(rows)); });
    groups.push(h('details', { class: 'cmap-group' }, h('summary', null, img(T.img.fb.sparkle, ''), h('span', null, h('b', null, 'Final Mission · Create Your Life Guide'), h('small', null, 'Assessment: an original procedure, presented aloud'))),
      table(C.finalMap)));
    const expand = h('button', { class: 'link-btn', onclick: e => { const open = !groups.every(g => g.open); groups.forEach(g => { g.open = open; }); e.currentTarget.textContent = open ? 'Close all' : 'Open all'; } }, 'Open all');
    /* review mode for teachers and judges */
    const rv = T.store.get().review;
    const review = h('button', { class: 'switch', role: 'switch', 'aria-checked': rv, onclick: () => { T.store.update(s => { s.review = !s.review; }); T.ui.toast(T.store.get().review ? 'Review mode ON: all worlds are open.' : 'Review mode OFF: worlds open in order.'); T.app.render(); } },
      h('span', { class: 'switch__txt' }, h('strong', null, 'Review mode (teachers and judges)'), h('small', null, 'Open all worlds and the final mission without playing in order. The Life Compass does not change.')), h('b', { class: 'switch__state' }, rv ? 'ON' : 'OFF'));
    return h('div', null, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Capaian Pembelajaran')), facts,
      h('p', { class: 'context-note' }, img(T.img.fb.idea, ''), C.contextNote), tabs, body,
      h('div', { class: 'page-head' }, h('h2', { class: 'section-title' }, 'Curriculum Map'), expand),
      h('p', { class: 'note' }, 'For teachers and judges. Activity → Skill → Procedure Text Competency → Language Feature → Graduate Profile Dimension. Every activity is listed in play order.'),
      groups, h('h2', { class: 'section-title' }, 'For Teachers and Judges'), h('div', { class: 'panel settings' }, review));
  };

  /* ---------- MY PROGRESS / LIFE COMPASS ---------- */
  const frac = k => Math.min(1, T.store.points(k) / Math.max(1, T.dimTotal(k)));   // share of the whole game's opportunities
  function compass() {
    const cx = 170, cy = 170, R = 112, n = T.dimensions.length;
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    const val = d => Math.max(6, R * frac(d.key));
    const rings = [.25, .5, .75, 1].map(f => `<polygon points="${T.dimensions.map((_, i) => pt(i, R * f).join(',')).join(' ')}" fill="${f === 1 ? '#fffdf6' : 'none'}" stroke="#d9cdb0" stroke-width="1.5"/>`).join('');
    const spokes = T.dimensions.map((_, i) => `<line x1="${cx}" y1="${cy}" x2="${pt(i, R)[0]}" y2="${pt(i, R)[1]}" stroke="#e6dcc4"/>`).join('');
    const poly = T.dimensions.map((d, i) => pt(i, val(d)).join(',')).join(' ');
    const dots = T.dimensions.map((d, i) => { const [x, y] = pt(i, val(d)); return `<circle cx="${x}" cy="${y}" r="5" fill="${d.color}" stroke="#fff" stroke-width="2"/>`; }).join('');
    const badges = T.dimensions.map((d, i) => { const [x, y] = pt(i, R + 30); return `<image href="${T.ui.asset(T.badgeSrc(d.key))}" x="${x - 19}" y="${y - 21}" width="38" height="42" opacity="${T.store.points(d.key) ? 1 : .45}"/>`; }).join('');
    return h('div', { class: 'compass', role: 'img', 'aria-label': 'Life Compass: ' + T.dimensions.map(d => d.en + ' ' + T.store.tier(d.key) + ' of 3 milestones').join(', '),
      html: `<svg viewBox="0 0 340 340">${rings}${spokes}<polygon points="${poly}" fill="#2fb7a6" fill-opacity=".3" stroke="#14a39a" stroke-width="3" stroke-linejoin="round"/>${dots}${badges}</svg>` });
  }
  S.compass = compass;
  S.progress = () => {
    const st = T.store.get(), store = T.store, m = T.mascots.find(x => x.key === store.mascot());
    const missionsDone = T.worlds.filter(w => store.worldComplete(w)).length;
    const stat = (src, label, value) => h('div', { class: 'stat' }, img(src, ''), h('small', null, label), h('b', null, value));
    const SEG = 12;
    const dimRows = T.dimensions.map(d => { const f = frac(d.key), on = Math.round(f * SEG), tier = store.tier(d.key);
      return h('li', { class: 'dim-row' + (f ? '' : ' empty'), style: { '--c': d.color } }, img(T.badgeSrc(d.key), d.en + ' badge', 'dim-row__badge'),
        h('div', { class: 'dim-row__main' }, h('div', { class: 'dim-row__top' }, h('b', null, d.id), h('small', null, d.en),
          h('span', { class: 'dim-row__stars', role: 'img', 'aria-label': tier + ' of 3 milestones' }, [1, 2, 3].map(k => img(T.img.fb.starGold, '', k <= tier ? 'on' : 'off')))),
          h('div', { class: 'seg', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': SEG, 'aria-valuenow': on, 'aria-label': d.en }, Array.from({ length: SEG }, (_, i) => h('i', { class: (i < on ? 'on' : '') + (T.TIERS.some(t => Math.round(t * SEG) === i + 1) ? ' ms' : '') }))),
          h('small', { class: 'dim-row__what' }, d.what))); });
    const missionRows = T.worlds.map(w => { const mm = T.mainMission(w), p = store.mission(mm.id), open = store.worldUnlocked(w);
      return h('li', { class: 'mrow' + (p.done ? ' done' : open ? '' : ' locked') }, img(T.img.worlds[w.id], ''), h('span', null, h('b', null, 'World ' + w.id + ' · ' + w.name), h('small', null, T.missions[mm.id].title)),
        open ? h('span', { class: 'mission-card__stars', role: 'img', 'aria-label': p.stars + ' of 3 stars' }, [1, 2, 3].map(n => img(T.img.fb.starGold, '', n <= p.stars ? 'on' : 'off'))) : img(T.img.ui.lock, '', 'mrow__lock')); });
    const finalOpen = store.finalUnlocked();
    return h('div', null, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'My Life Compass'), h('p', { class: 'note' }, 'It grows through meaningful choices, not only correct grammar answers.')),
      h('div', { class: 'progress-top' },
        h('div', { class: 'panel progress-me' }, T.ui.mascot('happy', 'progress-me__mascot'), h('h2', null, m.name), h('p', { class: 'note' }, 'Your study buddy'),
          h('div', { class: 'stats stats--4' }, stat(T.img.ui.unlock, 'Worlds completed', missionsDone + ' / 6'), stat(T.img.worlds[1], 'Missions', missionsDone + ' / 6' + (st.final.done ? ' + final' : '')),
            stat(T.img.fb.starGold, 'Stars', store.totalStars() + ' / 18'), stat(T.img.btn.glossary, 'Words', st.glossary.length + ' / ' + T.glossaryTotal()))),
        h('div', { class: 'panel progress-compass' }, compass())),
      h('ul', { class: 'dim-list' }, dimRows),
      h('h2', { class: 'section-title' }, 'My Journey'), h('ul', { class: 'mrows' }, missionRows,
        h('li', { class: 'mrow mrow--final' + (st.final.done ? ' done' : finalOpen ? '' : ' locked') }, img(T.img.fb.sparkle, ''), h('span', null, h('b', null, 'Final Mission · Create Your Life Guide'),
          h('small', null, st.final.done ? 'Complete · Well-being status: THRIVING LEARNER' : finalOpen ? 'Open now!' : 'Locked. Complete all six worlds.')),
          st.final.done ? h('button', { class: 'btn btn--ghost btn--sm', onclick: () => { location.hash = '#/graduation'; } }, 'GRADUATION') : finalOpen ? h('button', { class: 'btn btn--primary btn--sm', onclick: () => { location.hash = '#/final'; } }, 'START') : img(T.img.ui.lock, '', 'mrow__lock'))),
      h('h2', { class: 'section-title' }, 'Badges'), h('div', { class: 'badge-grid' }, T.allBadges().map(b => { const got = store.hasBadge(b);
        return h('div', { class: 'badge' + (got ? ' got' : ''), style: { '--c': b.color } }, h('span', { class: 'badge__art' }, img(b.src, ''), got ? null : img(T.img.ui.lock, '', 'badge__lock')),
          h('b', null, b.name), h('small', null, got ? 'Unlocked' : 'Locked')); })),
      h('h2', { class: 'section-title' }, 'Change your mascot'), S.mascotPicker(() => T.app.render()),
      h('div', { class: 'row row--center' }, h('button', { class: 'btn btn--danger', onclick: async () => { if (await T.ui.confirmDialog({ title: 'Reset all progress?', text: 'Your badges, stars, glossary words, mascot, life guide and Life Compass will be erased on this device. This cannot be undone.', yes: 'Yes, reset', no: 'Keep my progress' })) { T.store.reset(); T.ui.toast('Progress reset.'); location.hash = '#/intro'; } } }, 'RESET PROGRESS')));
  };

  /* ---------- SOUND ---------- */
  S.sound = () => {
    const sd = T.store.get().sound;
    const sw = (key, label, desc) => { const b = h('button', { class: 'switch', role: 'switch', 'aria-checked': sd[key], 'aria-label': label, onclick: () => { const v = !T.store.get().sound[key]; T.store.setSound({ [key]: v }); b.setAttribute('aria-checked', v); b.querySelector('.switch__state').textContent = v ? 'ON' : 'OFF'; if (key === 'music' && v) T.audio.unlock(); T.audio.sfx('pop'); } },
      h('span', { class: 'switch__txt' }, h('strong', null, label), h('small', null, desc)), h('b', { class: 'switch__state' }, sd[key] ? 'ON' : 'OFF')); return b; };
    const vol = h('input', { type: 'range', min: 0, max: 100, value: Math.round(sd.volume * 100), 'aria-label': 'Volume', oninput: e => { T.store.setSound({ volume: e.target.value / 100 }); } });
    return h('div', null, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Sound')), h('div', { class: 'panel settings' },
      sw('music', 'Music', 'Soft background music. Off by default.'), sw('sfx', 'Sound effects', 'Taps, stars and rewards.'), sw('voice', 'Voice / narration', 'Plays the mascot’s lines automatically. Speaker buttons always play when you tap them.'),
      h('label', { class: 'volume' }, img(T.img.round.mute, ''), vol, img(T.img.round.sound, '')),
      h('div', { class: 'row' }, h('button', { class: 'btn btn--ghost', onclick: () => T.audio.playNarration('ui-welcome') }, 'TEST VOICE'), h('button', { class: 'btn btn--ghost', onclick: () => T.audio.sfx('win') }, 'TEST EFFECTS'))));
  };

  /* ---------- SOURCES & CREDITS ---------- */
  S.sources = () => {
    const st = T.store.get(); let editing = false; const aiBox = h('div', { class: 'panel ai' });
    const text = () => st.aiText != null ? st.aiText : T.aiTextDefault;
    function drawAI() {
      if (editing) { const ta = h('textarea', { rows: 7, 'aria-label': 'AI transparency text' }, text());
        aiBox.replaceChildren(h('h3', null, 'About AI Use (editing)'), ta, h('div', { class: 'row' }, h('button', { class: 'btn btn--primary btn--sm', onclick: () => { T.store.update(s => { s.aiText = ta.value; }); editing = false; drawAI(); T.ui.toast('Saved on this device.'); } }, 'SAVE'),
          h('button', { class: 'btn btn--ghost btn--sm', onclick: () => { T.store.update(s => { s.aiText = null; }); editing = false; drawAI(); } }, 'RESTORE DEFAULT'), h('button', { class: 'btn btn--ghost btn--sm', onclick: () => { editing = false; drawAI(); } }, 'CANCEL'))); }
      else aiBox.replaceChildren(h('h3', null, 'About AI Use'), text().split('\n\n').map(p => h('p', null, p)), h('p', { class: 'note' }, 'Visual assets: AI-assisted original assets for THRIVE.'), h('button', { class: 'link-btn', onclick: () => { editing = true; drawAI(); } }, 'Edit this text'));
    }
    drawAI();
    return h('div', null, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Sources & Credits')), h('p', { class: 'lead lead--left' }, 'Only sources actually used in THRIVE are listed. Missing references are marked SOURCE TO BE ADDED.'),
      h('div', { class: 'src-grid' }, T.sources.map(sec => h('section', { class: 'src-sec panel' }, h('h2', null, sec.name),
        sec.items.length ? sec.items.map(i => h('article', { class: 'src' }, h('b', null, i.title), i.by ? h('small', null, i.by) : null, i.note ? h('p', null, i.note) : null,
          i.url ? h('a', { href: i.url, target: '_blank', rel: 'noopener' }, 'Open link') : i.noLink ? null : TBA())) : TBA()))),
      h('section', { class: 'src-sec' }, h('h2', { class: 'section-title' }, 'AI Transparency'), aiBox));
  };

  /* ---------- DEVELOPER ---------- */
  S.developer = () => h('div', null, h('div', { class: 'page-head' }, h('h1', { class: 'page-title' }, 'Meet the Developer')),
    h('div', { class: 'panel dev' }, h('img', { class: 'dev__photo', src: '../../assets/developer-mega.png', alt: 'Mega Ayu Wulandari', onerror: e => { e.target.replaceWith(h('div', { class: 'dev__photo dev__photo--ph' }, 'Photo')); } }),
      h('div', { class: 'dev__txt' }, h('h2', null, 'MEGA AYU WULANDARI'), h('p', { class: 'dev__role' }, 'English Teacher · SMP Negeri 15 Yogyakarta'), h('p', null, 'Creator of ENGLISH YO!'),
        h('ul', { class: 'role-list' }, ['Concept', 'Learning Design', 'Content Development', 'Game Development'].map(r => h('li', null, r))),
        h('blockquote', null, '“I believe English learning should not only help students pass a test. It should help them communicate, think, connect, and grow.”'),
        T.ui.brandLink('dev__logo'))));
})();
