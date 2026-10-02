/* progress data — all saved in localStorage, no login */
(function () {
  const T = window.THRIVE;
  const KEY = 'thrive.progress.v2';
  const defaults = () => ({
    seenIntro: false, mascot: null,
    missions: {},            // id -> { done, stars, awarded: {stageId:true} }
    dims: {},                // key -> points
    badges: [],              // badge ids ('dim:tier', 'mission:<id>', 'final')
    glossary: [],            // discovered words
    built: {},               // missionId -> the player's own procedure card
    final: { done: false, guide: null },   // Create Your Life Guide
    review: false,           // teacher / judge review mode: all worlds open (does not change the Life Compass)
    sound: { music: false, sfx: true, voice: true, volume: 0.8 },
    aiText: null
  });
  try { localStorage.removeItem('thrive.progress.v1'); } catch (e) {}   // legacy prototype save
  let state = load();

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY));
      if (raw) {
        if (raw.built && raw.built.goal) raw.built = { 'screen-break': raw.built };   // older single-card format
        return Object.assign(defaults(), raw, { sound: Object.assign(defaults().sound, raw.sound), final: Object.assign(defaults().final, raw.final), built: raw.built || {} });
      }
    } catch (e) {}
    return defaults();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* Life Compass scale: the whole game's available points per dimension (all missions + final mission) */
  T.dimTotal = key => Object.values(T.missions).reduce((n, m) => n + m.stages.filter(s => s.dims.includes(key)).length, 0) + ((T.finalMission.dims || []).includes(key) ? 1 : 0);
  T.TIERS = [0.2, 0.5, 0.85];                 // share of available points for ★, ★★, ★★★
  const tierOf = (key, pts) => { const tot = Math.max(1, T.dimTotal(key)); return T.TIERS.filter(f => pts / tot >= f - 1e-9).length; };

  T.mainMission = w => w.missions.find(m => m.ready);
  T.allBadges = () => {
    const list = T.dimensions.map(d => ({ id: d.key, dim: d.key, name: d.badge, color: d.color, src: T.badgeSrc(d.key) }));
    T.worlds.forEach(w => w.missions.filter(m => m.ready && T.missions[m.id]).forEach(m => list.push({ id: 'mission:' + m.id, mission: m.id, name: T.missions[m.id].badge, color: w.color, src: T.img.worlds[w.id] })));
    list.push({ id: 'final', final: true, name: 'Thriving Learner', color: '#f39a1e', src: T.img.fb.sparkle });
    return list;
  };
  T.glossaryTotal = () => new Set(T.glossary.flatMap(c => c.words.map(x => x.w))).size;

  T.store = {
    get: () => state,
    save,
    update(fn) { fn(state); save(); },
    mascot: () => state.mascot || 'tiger',
    mission(id) { return state.missions[id] || { done: false, stars: 0, awarded: {} }; },
    points(key) { return state.dims[key] || 0; },
    tier(key) { return tierOf(key, state.dims[key] || 0); },
    /* award one point per dimension, once per stage; returns { gained:[dims], badges:[newBadgeIds] } */
    awardStage(missionId, stage) {
      const m = state.missions[missionId] = state.missions[missionId] || { done: false, stars: 0, awarded: {} };
      if (m.awarded[stage.id] || !stage.dims.length) return { gained: [], badges: [] };
      m.awarded[stage.id] = true;
      const badges = [];
      stage.dims.forEach(k => {
        const before = tierOf(k, state.dims[k] || 0); state.dims[k] = (state.dims[k] || 0) + 1; const after = tierOf(k, state.dims[k]);
        if (after > before) { const id = k + ':' + after; if (!state.badges.includes(id)) { state.badges.push(id); badges.push(id); } }
      });
      save();
      return { gained: stage.dims.slice(), badges };
    },
    hasBadge(b) { return b.final ? state.final.done : b.mission ? state.badges.includes('mission:' + b.mission) : this.tier(b.dim) > 0; },
    completeMission(id, stars) {
      const m = state.missions[id] = state.missions[id] || { done: false, stars: 0, awarded: {} };
      m.done = true; m.stars = Math.max(m.stars || 0, stars);
      const bid = 'mission:' + id; const isNew = !state.badges.includes(bid);
      if (isNew) state.badges.push(bid);
      save(); return isNew;
    },
    /* journey: World 1 is open; each next world opens when the previous world's main mission is done */
    worldComplete(w) { const mm = T.mainMission(w); return !!mm && this.mission(mm.id).done; },
    worldUnlocked(w) { return state.review || w.id === 1 || this.worldComplete(T.worlds[w.id - 2]); },
    worldsDone() { return T.worlds.filter(w => this.worldComplete(w)).length; },
    finalUnlocked() { return state.review || this.worldsDone() === T.worlds.length; },
    currentWorld() { return T.worlds.find(w => this.worldUnlocked(w) && !this.worldComplete(w)) || T.worlds[T.worlds.length - 1]; },
    totalStars() { return Object.values(state.missions).reduce((n, m) => n + (m.stars || 0), 0); },
    awardFinal(dims) {
      if (state.final.awarded) return [];
      state.final.awarded = true; dims.forEach(k => { state.dims[k] = (state.dims[k] || 0) + 1; }); save(); return dims;
    },
    discover(word) { if (!state.glossary.includes(word)) { state.glossary.push(word); save(); return true; } return false; },
    setSound(patch) { Object.assign(state.sound, patch); save(); T.audio && T.audio.applySettings(); },
    reset() { const keepSound = state.sound; state = defaults(); state.sound = keepSound; save(); T.audio && T.audio.applySettings(); },
    worldStars(world) { return world.missions.reduce((n, m) => n + (this.mission(m.id).stars || 0), 0); },
    worldDone(world) { const ready = world.missions.filter(m => m.ready); return { done: ready.filter(m => this.mission(m.id).done).length, total: ready.length }; }
  };
})();
