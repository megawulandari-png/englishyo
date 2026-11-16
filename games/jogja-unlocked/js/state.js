/* JOGJA UNLOCKED — persistent state (localStorage). */
(function () {
  const KEY = 'englishyo.jogjaUnlocked.v1';
  const fresh = () => ({
    v: 1,
    profile: { agent: null, nick: '' },
    progress: { coins: 0, stars: 0, stamps: [], missions: {} },   // missions[id] = {best:{points,stars,coins}}
    learn: { step: 0, done: {}, answers: {}, complete: false },   // Learn Before You Play (never affects mission scores)
    run: null,       // current mission run
    screen: 'title'
  });
  const newRun = (mission, places) => ({
    mission: mission || 'm1',
    read: (places || ['prambanan', 'malioboro']).reduce((o, id) => { o[id] = false; return o; }, {}),
    tasks: {},                                       // t1: {answer, correct}
    final: { place: null, reason: null, submits: 0, placeFirst: null, reasonFirst: null },
    completed: false,
    result: null
  });

  let state = fresh();
  let storageOk = true;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (p && p.v === 1 && p.profile && p.progress) state = Object.assign(fresh(), p);
      }
    } catch (e) { storageOk = false; }
    return state;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storageOk = false; }
  }
  function reset() {
    state = fresh();
    try { localStorage.removeItem(KEY); } catch (e) { storageOk = false; }
    return state;
  }
  window.JUState = {
    get: () => state, save, load, reset, newRun,
    hasSave: () => !!(state.profile && state.profile.agent),
    storageOk: () => storageOk
  };
})();
