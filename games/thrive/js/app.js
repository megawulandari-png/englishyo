/* router + shell. Routes: #/intro #/menu #/play #/world/1 #/mission/<id> #/learn #/glossary #/cp #/progress #/sound #/sources #/developer */
(function () {
  const T = window.THRIVE, { h, img, icon } = T.ui, S = T.screens;
  const TITLES = { play: 'World Map', world: 'World', mission: 'Mission', final: 'Final Mission', graduation: 'Graduation', learn: 'Learn', glossary: 'Glossary', cp: 'Capaian Pembelajaran', progress: 'My Progress', sound: 'Sound', sources: 'Sources & Credits', developer: 'Developer' };
  const main = document.getElementById('main'), bar = document.getElementById('topbar');
  let leave = [];
  const BRAND_ROUTES = ['play', 'learn', 'glossary', 'cp', 'progress'];   // subtle ENGLISH YO! link in the top bar

  function soundToggle() {
    const on = () => T.store.get().sound.sfx || T.store.get().sound.voice || T.store.get().sound.music;
    const b = h('button', { class: 'round-btn round-btn--sm', 'aria-label': on() ? 'Mute all sound' : 'Turn sound on', onclick: () => {
      const v = !on(); T.store.setSound({ sfx: v, voice: v, music: v ? T.store.get().sound.music : false });
      if (!v) T.audio.stopAudio(); b.replaceChildren(T.ui.roundIcon(on() ? 'sound' : 'mute')); b.setAttribute('aria-label', on() ? 'Mute all sound' : 'Turn sound on'); } },
      T.ui.roundIcon(on() ? 'sound' : 'mute'));
    return b;
  }

  function render() {
    leave.forEach(f => f()); leave = [];
    T.audio.stopAudio();
    const [, route = '', arg] = location.hash.split('/');
    let r = route || 'menu';
    if (!T.store.get().seenIntro && r !== 'intro') { location.hash = '#/intro'; return; }
    if (!S[r] || r === 'mascotPicker') r = 'menu';
    const mw = r === 'mission' && T.missions[arg] ? T.missions[arg].world : 1;
    const back = r === 'mission' ? '#/world/' + mw : (r === 'world' || r === 'final' || r === 'graduation') ? '#/play' : '#/menu';
    document.body.dataset.screen = r;
    bar.hidden = r === 'intro' || r === 'menu';
    const backLabel = r === 'mission' ? 'Back: leave the mission and return to World ' + mw : (r === 'world' || r === 'final' || r === 'graduation') ? 'Back to the world map' : 'Back to the home screen';
    bar.replaceChildren(...[h('button', { class: 'top-btn', 'aria-label': backLabel, title: backLabel, onclick: () => { location.hash = back; } }, icon('back'), h('span', null, 'Back')),
      BRAND_ROUTES.includes(r) ? T.ui.brandLink('brand-link--bar') : null,
      h('span', { class: 'topbar__title' }, r === 'world' ? 'World ' + (arg || 1) : TITLES[r] || ''),
      h('div', { class: 'topbar__right' }, soundToggle(), h('button', { class: 'top-btn top-btn--icon', 'aria-label': 'Home', onclick: () => { location.hash = '#/menu'; } }, icon('home')))].filter(Boolean));
    main.replaceChildren(S[r](arg));
    window.scrollTo({ top: 0 });
  }
  T.app = { render, onLeave: f => leave.push(f) };
  window.addEventListener('hashchange', render);
  document.addEventListener('pointerdown', () => T.audio.unlock(), { once: true });
  render();
})();
