/* ALPHABET ANIMAL RESCUE! — game engine
 * ENGLISH YO! | Developed by Mega Ayu Wulandari
 * Vanilla JS. Content lives in data/animals.js and data/missions.js.
 */
(() => {
'use strict';
const A = window.AAR;
const ASSET = 'assets/';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const modalRoot = $('#modal-root');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.random() * a.length | 0];
const wait = ms => new Promise(r => setTimeout(r, ms));
const img = (p, alt = '', cls = '') => `<img src="${ASSET}${p}" alt="${esc(alt)}" class="${cls}" draggable="false" decoding="async">`;
const SPEAKER_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
const GEAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3h-4l-.4 2.9a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1L11 21h4l.4-2.9a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>';
const BACK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const INFO_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="7.6" r="1.5" fill="currentColor"/><path d="M12 11v6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
const LOCK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" stroke-width="2.6" fill="none"/></svg>';
const RANGERS = { kai: 'Ranger Kai', lina: 'Ranger Lina', rio: 'Ranger Rio', sora: 'Ranger Sora' };
/* Web copies of the high-resolution ranger art (assets/rangers/*.png), trimmed
   to the visible character and resized, so they load fast and fill their space. */
const rangerImg = r => 'rangers/web/' + r + '.png';
const TILE_COLORS = ['#ef3b4a', '#e8408f', '#1e8be0', '#f5a20a', '#e8408f', '#f57c12', '#8b4be0', '#29a83a', '#1e8be0'];
const tileColor = ch => TILE_COLORS[(ch.charCodeAt(0) - 65) % TILE_COLORS.length];
const PRAISE = ['Great job!', 'Well done!', 'Super!', 'Brilliant!', 'You did it!', 'Fantastic!', 'Awesome, Ranger!'];
const ENCOURAGE = ['Try again!', 'Almost! Try again.', 'Not this one. Keep looking!', 'Good try! Have another go.'];

/* Graceful fallback for any missing image: show its name in a soft badge. */
document.addEventListener('error', e => {
  const t = e.target;
  if (t && t.tagName === 'IMG' && !t.dataset.failed) {
    t.dataset.failed = '1';
    const span = document.createElement('span');
    span.className = 'img-fallback ' + t.className;
    span.setAttribute('role', 'img');
    span.setAttribute('aria-label', t.alt || 'image');
    span.textContent = t.alt || '?';
    t.replaceWith(span);
  }
}, true);

/* ───────────────────────── STORE ───────────────────────── */
const KEY = 'aar-progress-v1';
const DEF = () => ({
  v: 1, ranger: null, phase: null, name: '',
  missions: {}, rescued: {}, coins: 0, badges: {}, ach: {},
  stats: { listen: 0, spell: 0 }, masterSeen: false,
  settings: { sound: true, voice: true, sfx: true, ambience: true, volume: 1, rate: 0.9, motion: 'auto', voiceURI: '' }
});
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw), d = Object.assign(DEF(), p);
      d.settings = Object.assign(DEF().settings, p.settings || {});
      d.stats = Object.assign(DEF().stats, p.stats || {});
      return d;
    }
  } catch (e) { /* storage blocked or corrupt — start fresh */ }
  return DEF();
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

const P = () => A.PHASES[S.phase || 'B'];
const missionsOf = w => A.MISSIONS.filter(m => m.world === w);
const isDone = id => !!(S.missions[id] && S.missions[id].stars > 0);
const worldUnlocked = w => w === 0 || !!S.badges[A.WORLDS[w - 1].id];
const bossUnlocked = w => missionsOf(w).filter(m => m.mode !== 'boss').every(m => isDone(m.id));
const worldProgress = w => { const ms = missionsOf(w); return { done: ms.filter(m => isDone(m.id)).length, total: ms.length }; };
const totalStars = () => Object.values(S.missions).reduce((s, m) => s + (m.stars || 0), 0);
const rescuedCount = () => A.LETTERS.filter(l => S.rescued[l]).length;
const worldOfLetter = l => A.WORLDS.findIndex(w => w.letters.includes(l));
const rangerName = () => RANGERS[S.ranger] || 'Ranger';
const animalName = l => A.ANIMALS[l].name;

/* ───────────────────────── SOUND ───────────────────────── */
const Snd = {
  ctx: null, master: null, amb: null, ambNodes: [], ambTimer: null, ambKind: null, _nb: null,
  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { this.ctx = new AC(); this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination); } catch (e) { return null; }
    }
    // 'suspended' (autoplay policy) or 'interrupted' (iOS after a call / lock screen)
    if (this.ctx.state !== 'running') { try { this.ctx.resume().catch(() => {}); } catch (e) {} }
    this.master.gain.value = S.settings.volume;
    return this.ctx;
  },
  /* Call inside a real user gesture: creates/resumes the context and plays one
     silent sample, which is what iOS Safari needs to allow Web Audio. */
  unlock() {
    const c = this.ensure(); if (!c) return;
    try { const b = c.createBuffer(1, 1, 22050), src = c.createBufferSource(); src.buffer = b; src.connect(c.destination); src.start(0); } catch (e) {}
    // iOS 16.4+: play through the ringer/silent switch like a media app.
    try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch (e) {}
  },
  state() { return this.ctx ? this.ctx.state : (window.AudioContext || window.webkitAudioContext ? 'not started yet' : 'not supported'); },
  note(freq, t0, dur, { type = 'sine', vol = 0.2, slide = 0, dest = null } = {}) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(freq * slide, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || this.master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  },
  play(name) {
    if (!S.settings.sound || !S.settings.sfx) return;
    const c = this.ensure(); if (!c) return;
    const t = c.currentTime + 0.01;
    const N = (f, d, dt, o) => this.note(f, t + dt, d, o);
    switch (name) {
      case 'tap': N(720, .07, 0, { vol: .1, type: 'triangle' }); break;
      case 'pick': N(520, .09, 0, { vol: .14, type: 'triangle', slide: 1.5 }); break;
      case 'correct': [523, 659, 784].forEach((f, i) => N(f, .22, i * .09, { type: 'triangle', vol: .2 })); N(1047, .35, .27, { vol: .14 }); break;
      case 'wrong': N(330, .16, 0, { vol: .14, slide: .8 }); N(262, .22, .13, { vol: .12, slide: .85 }); break;
      case 'star': N(1319, .12, 0, { vol: .1 }); N(1760, .18, .06, { vol: .09 }); break;
      case 'coin': N(988, .08, 0, { type: 'square', vol: .05 }); N(1319, .2, .07, { type: 'square', vol: .05 }); break;
      case 'rescue': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => N(f, .26, i * .12, { type: 'triangle', vol: .19 })); N(1568, .7, .75, { vol: .11 }); break;
      case 'world': [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => N(f, .3, i * .14, { type: 'triangle', vol: .19 })); N(1047, .9, 1, { vol: .13 }); N(1319, .9, 1, { vol: .09 }); break;
      case 'welcome': [392, 523, 659, 784].forEach((f, i) => N(f, .3, i * .1, { vol: .16 })); N(1047, .5, .4, { vol: .11 }); break;
      case 'unlock': N(300, .4, 0, { type: 'sawtooth', vol: .04, slide: 3 }); N(1200, .3, .35, { vol: .11 }); break;
      case 'crack': N(180, .12, 0, { type: 'square', vol: .06, slide: .5 }); N(900, .16, .05, { vol: .1, slide: 1.6 }); break;
      case 'flip': N(400, .12, 0, { type: 'triangle', vol: .1, slide: 2 }); break;
    }
  },
  noise() {
    if (this._nb) return this._nb;
    const c = this.ctx, len = c.sampleRate * 2, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    return (this._nb = b);
  },
  startAmbience(kind) {
    if (kind === this.ambKind && this.amb) return;
    this.stopAmbience();
    this.ambKind = kind;
    if (!kind || !S.settings.sound || !S.settings.ambience) return;
    const c = this.ensure(); if (!c) return;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.linearRampToValueAtTime(0.9, c.currentTime + 2);
    g.connect(this.master); this.amb = g;
    const bed = (type, freq, q, vol, lfo) => {
      const s = c.createBufferSource(); s.buffer = this.noise(); s.loop = true;
      const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      const ng = c.createGain(); ng.gain.value = vol;
      s.connect(f); f.connect(ng); ng.connect(g); s.start();
      this.ambNodes.push(s);
      if (lfo) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = lfo; lg.gain.value = vol * 0.8; l.connect(lg); lg.connect(ng.gain); l.start(); this.ambNodes.push(l); }
    };
    const n = (f, d, v, s, ty) => { if (this.amb) this.note(f, c.currentTime + 0.02, d, { vol: v, slide: s, type: ty || 'sine', dest: this.amb }); };
    const chirp = () => { const f = 2400 + Math.random() * 1200; n(f, .09, .025, 1.3); setTimeout(() => n(f * 1.1, .1, .02, 1.25), 140); };
    let ev = () => {};
    switch (kind) {
      case 'forest': bed('lowpass', 500, .5, .045, .08); ev = () => Math.random() < .5 && chirp(); break;
      case 'ocean': bed('lowpass', 650, .7, .09, .12); ev = () => Math.random() < .5 && n(380 + Math.random() * 200, .09, .025, 2.4); break;
      case 'jungle': bed('lowpass', 600, .5, .045, .1); ev = () => { if (Math.random() < .45) chirp(); if (Math.random() < .25) n(170, .18, .03, .9, 'triangle'); }; break;
      case 'savanna': bed('bandpass', 850, .6, .07, .07); ev = () => Math.random() < .3 && n(1700, .25, .02, .7); break;
      case 'frozen': bed('bandpass', 420, 1.6, .1, .05); ev = () => Math.random() < .35 && n(pick([1568, 1760, 2093, 2349]), 1.4, .018); break;
    }
    this.ambTimer = setInterval(ev, 1300);
  },
  stopAmbience() {
    clearInterval(this.ambTimer); this.ambTimer = null;
    const g = this.amb, nodes = this.ambNodes;
    this.amb = null; this.ambNodes = []; this.ambKind = null;
    if (g && this.ctx) {
      try { g.gain.cancelScheduledValues(this.ctx.currentTime); g.gain.setTargetAtTime(0.0001, this.ctx.currentTime, .25); } catch (e) {}
      setTimeout(() => { nodes.forEach(nd => { try { nd.stop(); } catch (e) {} }); try { g.disconnect(); } catch (e) {} }, 900);
    }
  }
};

/* Speech: device voice via SpeechSynthesis, British English preferred.
 * Problems this handles:
 *  - voices load asynchronously (getVoices() is often empty at first)
 *  - cancel() followed by speak() in the same tick can be dropped (Chrome/Safari)
 *  - utterances can be garbage-collected before 'end' fires (Chrome)
 *  - iOS only allows speech after one utterance started inside a user gesture
 *  - network voices (e.g. "Google UK English") can fail silently offline
 *  - some browsers/webviews expose the API but never actually speak
 */
/* Voice ranking. Browsers don't report gender or quality, so names are used
   where they are known; this cannot guarantee a female or child voice. */
const VOICE_FEMALE = /(female|woman|girl|Libby|Sonia|Maisie|Hollie|Abbi|Bella|Mia\b|Olivia|Kate|Serena|Stephanie|Martha|Moira|Tessa|Karen|Samantha|Ava\b|Allison|Susan|Zira|Hazel|Jenny|Aria\b|Ana\b|Emma|Michelle|Sara\b|Catherine|Natasha|Fiona|Victoria|Joanna|Amy\b|Salli|Kimberly|Ivy\b|Nicky|Zoe\b|Google US English$|Google UK English Female)/i;
const VOICE_MALE = /(\bmale\b|Daniel|Arthur|Oliver|Ryan|George|Thomas|Alfie|Elliot|Ethan|Noah|Guy\b|Davis|Tony|Christopher|Eric\b|Alex\b|Aaron|Tom\b|Rishi|Gordon|Lee\b|David|Mark\b|James|Brian|Matthew|Joey|Justin)/i;
const VOICE_ROBOTIC = /(Eddy|Flo\b|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|eloquence|espeak)/i;
const VOICE_NOVELTY = /(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy)/i;
function voiceScore(v) {
  const n = v.name + ' ' + (v.voiceURI || ''), lang = (v.lang || '').replace('_', '-');
  let sc = /^en-GB/i.test(lang) ? 30 : /^en-US/i.test(lang) ? 22 : /^en-(AU|IE|NZ|ZA|CA)/i.test(lang) ? 14 : 8;
  if (/natural|neural/i.test(n)) sc += 40; else if (/premium/i.test(n)) sc += 34; else if (/enhanced/i.test(n)) sc += 28; else if (/^Google /.test(v.name)) sc += 18;
  if (VOICE_FEMALE.test(v.name)) sc += 25; else if (VOICE_MALE.test(v.name)) sc -= 5;
  if (VOICE_ROBOTIC.test(n)) sc -= 60;
  if (VOICE_NOVELTY.test(v.name)) sc -= 200;
  // Online voices (e.g. "Google UK English Female") need a working internet connection.
  // One that stalls was seen to block ALL speech in Chrome until restart, so voices
  // stored on the device come first. Online voices can still be picked in Settings.
  if (!v.localService) sc -= 30;
  return sc;
}
/* Tiny silent WAV, used to "unlock" the clip player inside the first user gesture (iOS). */
function silentWavUrl() {
  const n = 400, buf = new ArrayBuffer(44 + n * 2), d = new DataView(buf);
  const w = (o, t) => [...t].forEach((c, i) => d.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); d.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true);
  d.setUint32(24, 8000, true); d.setUint32(28, 16000, true); d.setUint16(32, 2, true); d.setUint16(34, 16, true); w(36, 'data'); d.setUint32(40, n * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}
const Voice = {
  ok: 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance !== 'undefined',
  voice: null, voices: [], bad: new Set(), cur: null, seq: 0,
  unlocked: false, works: null, misses: 0, captionTimer: 0,
  el: null, clipDone: null, lastSource: '',
  init() {
    if (!this.ok) return;
    const load = () => { const vs = speechSynthesis.getVoices() || []; if (vs.length) { this.voices = vs; this.choose(); } return vs.length; };
    load();
    try { speechSynthesis.addEventListener('voiceschanged', load); } catch (e) { speechSynthesis.onvoiceschanged = load; }
    // Some browsers never fire voiceschanged: poll briefly as well.
    let n = 0; const t = setInterval(() => { if (load() || ++n > 20) clearInterval(t); }, 250);
  },
  /* English voices, best first. */
  ranked() {
    return this.voices.filter(v => /^en([-_]|$)/i.test(v.lang) && !VOICE_NOVELTY.test(v.name))
      .map(v => ({ v, sc: voiceScore(v) })).sort((a, b) => b.sc - a.sc).map(x => x.v);
  },
  choose() {
    const list = this.ranked().filter(v => !this.bad.has(v.voiceURI));
    const picked = S.settings.voiceURI && list.find(v => v.voiceURI === S.settings.voiceURI);
    this.voice = picked || list[0] || null;
  },
  canSpeak() { return this.ok && this.works !== false && S.settings.sound && S.settings.voice; },
  /* Must run inside a user gesture (first tap/click/key). */
  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    try { if (!this.el) { this.el = new Audio(); this.el.preload = 'auto'; } this.el.src = silentWavUrl(); const p = this.el.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
    if (!this.ok) return;
    try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; u.lang = 'en-GB'; this.keep = u; this.rawSpeak(u); } catch (e) {}
  },
  /* Prerecorded clips (data/audio.js) are preferred; speech synthesis is the fallback. */
  clipSrc(key) { const f = key && A.AUDIO_CLIPS && A.AUDIO_CLIPS[key]; return f ? ASSET + 'audio/' + f : null; },
  playClip(src) {
    return new Promise(res => {
      const a = this.el || (this.el = new Audio());
      let fin = false;
      const done = ok => { if (fin) return; fin = true; a.onended = a.onerror = null; this.clipDone = null; res(ok); };
      this.clipDone = done;
      a.onended = () => done(true);
      a.onerror = () => done(false);
      try {
        a.src = src; a.volume = Math.max(0, Math.min(1, S.settings.volume));
        const p = a.play(); if (p && p.catch) p.catch(() => done(false));
      } catch (e) { done(false); }
    });
  },
  stopClip() { if (this.clipDone) this.clipDone(false); if (this.el) try { this.el.pause(); } catch (e) {} },
  speak(raw, opts = {}) {
    const text = forSpeech(raw), shown = forScreen(raw);
    const id = ++this.seq;
    this.stopClip();
    const src = this.clipSrc(opts.clip);
    if (src && S.settings.sound && S.settings.voice) {
      this.cancelSafe();
      return this.playClip(src).then(ok => {
        if (ok) { this.lastSource = 'recorded clip: ' + src; return true; }
        if (id !== this.seq) return false;              // stopped or replaced
        return this.tts(text, shown, opts, id);           // missing/broken file → speech synthesis
      });
    }
    return this.tts(text, shown, opts, id);
  },
  tts(text, shown, opts, id) {
    return new Promise(res => {
      if (!this.canSpeak()) {
        if (this.ok === false || this.works === false) caption(shown);
        res(false); return;
      }
      let done = false, started = false, kicked = false, timer = 0, watch = 0;
      const fin = ok => {
        if (done) return; done = true; clearTimeout(timer); clearTimeout(watch);
        if (this.cur && this.cur._id === id) this.cur = null;
        res(ok);
      };
      const start = (voice, retried) => {
        if (id !== this.seq) return fin(false);           // a newer request replaced this one
        const u = new SpeechSynthesisUtterance(text);
        u._id = id;
        if (voice) { u.voice = voice; u.lang = voice.lang.replace('_', '-'); } else u.lang = 'en-GB';
        u.rate = Math.min(2, Math.max(.5, (opts.rate || 1) * S.settings.rate));   // Normal = 0.9
        u.pitch = 1.1;                                       // friendly, not cartoonish
        u.volume = Math.max(0, Math.min(1, S.settings.volume));
        u.onstart = () => { started = true; this.works = true; this.misses = 0; this.lastSource = 'speech: ' + (voice ? voice.name : 'default voice'); clearTimeout(watch); };
        u.onend = () => fin(true);
        u.onerror = e => {
          const err = e && e.error;
          if (err === 'interrupted' || err === 'canceled') return fin(false);
          if (err === 'not-allowed') { this.unlocked = false; return fin(false); }   // needs a user tap first
          if (voice && !voice.localService) { this.dropOnline(); if (this.voice !== voice) return setTimeout(() => start(this.voice, retried), 90); }
          if (!retried && voice) { this.bad.add(voice.voiceURI); this.choose(); return start(this.voice, true); }
          fin(false);
        };
        this.cur = u;                                       // keep a reference (Chrome GC bug)
        try { if (speechSynthesis.paused) speechSynthesis.resume(); this.rawSpeak(u); } catch (e) { return fin(false); }
        // Watchdog: nothing started (silent engine, blocked, or an online voice that is unreachable).
        clearTimeout(watch);
        watch = setTimeout(() => {
          if (started || done || id !== this.seq) return;
          try { speechSynthesis.cancel(); } catch (e) {}
          // Chrome's speech queue can jam (speaking=true, nothing plays) and cancel() alone
          // doesn't clear it; pause()+resume() does. Kick it once and retry the same line.
          if (!kicked) {
            kicked = true;
            setTimeout(() => { try { speechSynthesis.pause(); } catch (e) {}
              setTimeout(() => { try { speechSynthesis.resume(); } catch (e) {}
                setTimeout(() => start(voice, retried), 100); }, 100); }, 50);
            return;
          }
          // An online voice that doesn't start usually means no/slow internet:
          // skip ALL online voices and use the best voice stored on the device.
          if (voice && !voice.localService) { this.dropOnline(); if (this.voice !== voice) return setTimeout(() => start(this.voice, retried), 90); }
          if (++this.misses >= 2) { this.works = false; speechBroken(); }
          caption(shown);
          fin(false);
        }, voice && !voice.localService ? 2000 : this.works ? 4000 : 2500);
      };
      // Safety net so gameplay never waits forever.
      timer = setTimeout(() => fin(started), 9000 + text.length * 160);
      let busy = false; try { busy = speechSynthesis.speaking || speechSynthesis.pending; } catch (e) {}
      const wait = this.cancelPendingMs();
      if (busy || wait) { this.cancelSafe(); setTimeout(() => start(this.voice), Math.max(90, this.cancelPendingMs() + 40)); }
      else start(this.voice);
    });
  },
  dropOnline() { this.voices.forEach(v => { if (!v.localService) this.bad.add(v.voiceURI); }); this.choose(); },
  stop() { this.seq++; this.stopClip(); this.cancelSafe(); },
  /* Chrome on macOS: speak() followed by cancel() in the same tick jams speech for
     the rest of the session (reproduced in Chrome 154). Every speak goes through
     rawSpeak(), and a cancel within 40 ms of a speak is moved to a later task. */
  lastSpeak: -1e9, cancelTimer: 0, cancelDue: 0,
  rawSpeak(u) { this.lastSpeak = performance.now(); speechSynthesis.speak(u); },
  cancelPendingMs() { return Math.max(0, this.cancelDue - performance.now()); },
  cancelSafe() {
    if (!this.ok) return;
    const dt = performance.now() - this.lastSpeak;
    if (dt < 40) {
      clearTimeout(this.cancelTimer);
      this.cancelDue = performance.now() + (45 - dt);
      this.cancelTimer = setTimeout(() => { this.cancelDue = 0; try { speechSynthesis.cancel(); } catch (e) {} }, 45 - dt);
    } else { try { speechSynthesis.cancel(); } catch (e) {} }
  },
  status() {
    const clips = A.AUDIO_CLIPS ? Object.keys(A.AUDIO_CLIPS).length : 0;
    const clipNote = clips ? ` · ${clips} recorded clip${clips === 1 ? '' : 's'} available (used first)` : ' · no recorded clips installed yet';
    if (!this.ok) return 'Speech is not supported in this browser. Words are shown as text instead.' + clipNote;
    if (this.works === false) return 'This browser has a speech feature, but its voice is not responding. Words are shown as text instead. Try Chrome, Edge or Safari.' + clipNote;
    const v = this.voice;
    const en = this.voices.filter(x => /^en([-_]|$)/i.test(x.lang)).length;
    return (v ? `${v.name} (${v.lang.replace('_', '-')}${v.localService ? ', on this device' : ', online voice'})` : (this.voices.length ? 'Browser default English voice' : 'Voices are still loading…'))
      + ` · ${en} English voice${en === 1 ? '' : 's'} found · ${this.works ? 'working' : 'not tested yet'} · synthetic device voice` + clipNote;
  },
  label() { return this.status(); }
};
const say = (text, opts) => Voice.speak(text, opts);
/* Delayed speech is dropped if the screen, modal or round changed in the meantime,
   so an old line can never cut off or overlap a new instruction. */
let screenSeq = 0;
function sayLater(text, ms, opts) { const k = screenSeq; setTimeout(() => { if (k === screenSeq) say(text, opts); }, ms); }
function sayRoundLater(r) { const k = screenSeq; setTimeout(() => { if (k === screenSeq && M && !M.finished && M.rounds[M.idx] === r) r.say(); }, 350); }
/* When speech can't play, show the words on screen instead. */
function caption(text) {
  if (!text || !text.trim()) return;
  let c = $('#caption');
  if (!c) { c = document.createElement('div'); c.id = 'caption'; c.className = 'caption'; c.setAttribute('aria-live', 'polite'); document.body.appendChild(c); }
  c.innerHTML = `${SPEAKER_SVG}<span>${esc(text)}</span>`;
  c.classList.add('in');
  clearTimeout(Voice.captionTimer);
  Voice.captionTimer = setTimeout(() => c.classList.remove('in'), 2600 + text.length * 60);
}
function speechBroken() {
  toast('The voice in this browser is not responding, so words will be shown as text. For sound, open the game in Chrome, Edge or Safari.', 5200);
}
/* Letter names spelt out so every voice says them the same way (British "zed"). */
/* Each letter is spoken ONCE using the dedicated value in AAR.LETTER_SPEECH
   (data/animals.js) — never by reading the "A a" text shown on a tile. */
const letterSay = l => `[[${l}]]`;
/* "[[T]]" → "tee." for the voice, "T" for on-screen captions. */
const forSpeech = t => t.replace(/\[\[([A-Z])\]\]([.!?,]?)/g, (_, l, p) => (A.LETTER_SPEECH[l] || l) + p);
const forScreen = t => t.replace(/\[\[([A-Z])\]\]/g, '$1');

/* ───────────────────────── FX ───────────────────────── */
const reduceMotion = () => S.settings.motion === 'reduce' || (S.settings.motion === 'auto' && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
function applyMotion() { document.body.classList.toggle('rm', reduceMotion()); }
const FX = {
  cv: $('#fx-canvas'), parts: [], raf: 0,
  confetti(n = 120) {
    if (reduceMotion()) return;
    const cv = this.cv, w = cv.width = innerWidth, h = cv.height = innerHeight;
    const cols = ['#ff4d6d', '#ffd23f', '#3ec300', '#1e8be0', '#a05cff', '#ff8c1a'];
    for (let i = 0; i < n; i++) this.parts.push({ x: w / 2 + (Math.random() - .5) * w * .3, y: h * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 4, r: 5 + Math.random() * 6, c: pick(cols), a: Math.random() * 6, va: (Math.random() - .5) * .4, life: 0 });
    if (!this.raf) this.loop();
  },
  loop() {
    const cv = this.cv, ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    this.parts = this.parts.filter(p => p.life < 170 && p.y < cv.height + 30);
    for (const p of this.parts) {
      p.life++; p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, 1 - p.life / 170); ctx.fillRect(-p.r / 2, -p.r / 3, p.r, p.r * .66); ctx.restore();
    }
    if (this.parts.length) this.raf = requestAnimationFrame(() => this.loop());
    else { this.raf = 0; ctx.clearRect(0, 0, cv.width, cv.height); }
  },
  sparkle(el) {
    if (!el || reduceMotion()) return;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const s = document.createElement('img');
      s.src = ASSET + 'ui/star.png'; s.alt = ''; s.className = 'spark';
      const ang = (i / 8) * Math.PI * 2, dist = 50 + Math.random() * 30;
      s.style.left = (r.left + r.width / 2) + 'px'; s.style.top = (r.top + r.height / 2) + 'px';
      s.style.setProperty('--dx', Math.cos(ang) * dist + 'px'); s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      document.body.appendChild(s); setTimeout(() => s.remove(), 800);
    }
  }
};

/* ───────────────────────── UI HELPERS ───────────────────────── */
function announce(t) { const l = $('#sr-live'); l.textContent = ''; setTimeout(() => { l.textContent = t; }, 30); }
function toast(html, ms = 2600) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; t.setAttribute('role', 'status');
  document.body.appendChild(t); requestAnimationFrame(() => t.classList.add('in'));
  setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 400); }, ms);
}
function show(html, cls) {
  closeModal(true); Voice.stop(); screenSeq++;
  app.innerHTML = `<section class="screen ${cls}">${html}</section>`;
  app.scrollTop = 0; window.scrollTo(0, 0);
  const h = $('h1, h2', app); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}
function modal(html, cls = '', onClose, labelId) {
  const opener = modalRoot.innerHTML ? modalRoot._opener : document.activeElement;
  closeModal(true); screenSeq++;
  modalRoot.innerHTML = `<div class="modal-back" data-act="modal-close-back"><div class="modal ${cls}" role="dialog" aria-modal="true"${labelId ? ` aria-labelledby="${labelId}"` : ''}>${html}</div></div>`;
  modalRoot._onClose = onClose;
  modalRoot._opener = opener;
  const f = $('.modal [autofocus], .modal button', modalRoot); if (f) f.focus({ preventScroll: true });
}
function closeModal(silent) {
  if (!modalRoot.innerHTML) return;
  screenSeq++;
  modalRoot.innerHTML = ''; const cb = modalRoot._onClose; modalRoot._onClose = null;
  // Return keyboard focus to the button that opened the popup.
  const op = modalRoot._opener; modalRoot._opener = null;
  if (!silent && op && op.isConnected && op.focus) op.focus({ preventScroll: true });
  if (!silent && cb) cb();
}
const tileImg = (ch, cls = '') => img('letters/' + ch.toLowerCase() + '.png', ch, 'ltimg ' + cls);
const tileHTML = (ch, cls = '', attrs = '') => `<span class="ltile ${cls}" style="--tc:${tileColor(ch.toUpperCase())}" ${attrs}>${esc(ch)}</span>`;
const starsHTML = (n, max = 3, cls = '') => `<span class="stars ${cls}" aria-label="${n} of ${max} stars">${Array.from({ length: max }, (_, i) => img('ui/star.png', '', i < n ? 'on' : 'off')).join('')}</span>`;
function soundBtn() {
  return `<button class="imgbtn snd ${S.settings.sound ? '' : 'muted'}" data-act="toggle-sound" aria-pressed="${S.settings.sound}" aria-label="Sound ${S.settings.sound ? 'on' : 'off'}" title="Sound on/off">${img('ui/icon-sound.png', '')}</button>`;
}
function topbar({ back = 'home', backLabel = 'Home', title = '', extra = '' } = {}) {
  const backBtn = back === 'home'
    ? `<button class="imgbtn" data-act="go" data-to="home" aria-label="Home" title="Home">${img('ui/icon-home.png', '')}</button>`
    : `<button class="rbtn back" data-act="go" data-to="${back}" aria-label="${esc(backLabel)}">${BACK_SVG}<span>${esc(backLabel)}</span></button>`;
  return `<header class="topbar">
    <div class="tb-left">${backBtn}</div>
    <div class="tb-title">${title}</div>
    <div class="tb-right">${extra}
      <span class="pill coins" title="Paw coins">${img('ui/coin.png', '')}<b>${S.coins}</b><span class="sr-only"> paw coins</span></span>
      <span class="pill starsum" title="Stars">${img('ui/star.png', '')}<b>${totalStars()}</b><span class="sr-only"> stars</span></span>
      ${soundBtn()}
      <button class="imgbtn" data-act="help" aria-label="How to play" title="How to play">${img('ui/icon-help.png', '')}</button>
      <button class="sqbtn purple" data-act="settings" aria-label="Settings" title="Settings">${GEAR_SVG}</button>
    </div></header>`;
}
function fxLayer(kind, n = 14) {
  if (!kind) return '';
  let s = '';
  for (let i = 0; i < n; i++) {
    const st = `--x:${(Math.random() * 100).toFixed(1)}%;--d:${(6 + Math.random() * 8).toFixed(1)}s;--delay:-${(Math.random() * 10).toFixed(1)}s;--s:${(.6 + Math.random() * .8).toFixed(2)}`;
    s += kind === 'leaves' ? `<i style="${st}">${img(i % 2 ? 'effects/leaf-1.png' : 'effects/leaf-2.png')}</i>` : `<i style="${st}"></i>`;
  }
  return `<div class="fx fx-${kind}" aria-hidden="true">${s}</div>`;
}

/* ───────────────────────── SCREENS ───────────────────────── */
let current = 'home';
const go = (to, arg) => {
  current = to;
  if (!['world', 'mission'].includes(to)) Snd.stopAmbience();
  ({ home: screenHome, setup: screenSetup, map: screenMap, world: screenWorld, book: screenBook, final: screenFinal })[to](arg);
};

function screenHome() {
  const has = S.ranger && S.phase;
  const peek = ['L', 'E', 'G', 'M', 'R', 'P'];
  show(`
    <div class="home-sky" aria-hidden="true">
      <div class="sun"></div>
      ${img('effects/cloud.png', '', 'cloud c1')}${img('effects/cloud.png', '', 'cloud c2')}${img('effects/cloud.png', '', 'cloud c3')}
      <div class="hill h1"></div><div class="hill h2"></div>
      ${img('effects/bush.png', '', 'bush b1')}${img('effects/bush.png', '', 'bush b2')}
      ${img('effects/star-small-1.png', '', 'twinkle t1')}${img('effects/star-small-2.png', '', 'twinkle t2')}${img('effects/star-small-1.png', '', 'twinkle t3')}
    </div>
    <div class="home-inner">
      <a class="ey-brand" href="../../index.html" aria-label="ENGLISH YO! home page" title="ENGLISH YO! home page"><img src="../../assets/logo-approved.png" alt="ENGLISH YO! Learn. Play. Grow." width="2139" height="735" draggable="false"></a>
      <h1 class="home-logo"><img src="${ASSET}logo/logo-main.png" alt="Alphabet Animal Rescue! A–Z Wildlife Adventure" draggable="false"></h1>
      <p class="tagline">Explore <i>•</i> Listen <i>•</i> Spell <i>•</i> Rescue</p>
      <div class="home-stage">
        <div class="home-animals" aria-hidden="true">${peek.map((l, i) => `<span class="peek p${i}">${img(A.ANIMALS[l].img, '')}</span>`).join('')}</div>
        <div class="home-rangers">${Object.keys(RANGERS).map((r, i) => `<span class="hr r${i}">${img(rangerImg(r), RANGERS[r])}</span>`).join('')}</div>
      </div>
      <nav class="home-menu" aria-label="Main menu">
        ${has ? `<button class="gbtn green big" data-act="continue">${playIcon()}CONTINUE ADVENTURE</button>
                 <button class="gbtn orange" data-act="go" data-to="setup">${playIcon()}NEW RANGER SETUP</button>`
              : `<button class="gbtn green big" data-act="go" data-to="setup">${playIcon()}START ADVENTURE</button>`}
        <button class="gbtn blue" data-act="go" data-to="book">${img('rewards/book.png', '', 'bi')}MY ANIMAL BOOK</button>
        <div class="home-row">
          <button class="gbtn sky" data-act="help">${img('ui/icon-help.png', '', 'bi')}HOW TO PLAY</button>
          <button class="gbtn purple" data-act="settings"><span class="bi gear">${GEAR_SVG}</span>SETTINGS</button>
          <button class="gbtn ${S.settings.sound ? 'teal' : 'grey'} sndtxt" data-act="toggle-sound" aria-pressed="${S.settings.sound}">${img('ui/icon-sound.png', '', 'bi')}SOUND ${S.settings.sound ? 'ON' : 'OFF'}</button>
        </div>
        <a class="backlink" href="../../games.html">${BACK_SVG}BACK TO GAMES</a>
      </nav>
    </div>
    <footer class="credit"><a class="cr-brand" href="../../index.html">ENGLISH YO!</a><span class="cr-sep" aria-hidden="true">|</span><button class="about-btn" data-act="about" aria-haspopup="dialog">${INFO_SVG}<span>About Developer</span></button></footer>`, 'home');
}
const playIcon = () => '<svg class="bi play" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

let setupDraft = null;
function screenSetup() {
  setupDraft = { ranger: S.ranger, phase: S.phase, name: S.name || '' };
  const ph = k => { const p = A.PHASES[k]; return `
    <button class="phase-card ${k === 'B' ? 'pb' : 'pc'} ${setupDraft.phase === k ? 'sel' : ''}" data-act="pick-phase" data-v="${k}" aria-pressed="${setupDraft.phase === k}">
      <span class="ph-tag">PHASE ${k}</span><span class="ph-title">${p.title}</span>
      <span class="ph-grades">${p.grades} · CEFR ${p.cefr}</span>
      <ul>${p.focus.map(f => `<li>${f}</li>`).join('')}</ul>
      <span class="ph-check" aria-hidden="true">✓</span>
    </button>`; };
  show(`${topbar({ title: '<h2>RANGER SETUP</h2>' })}
    <div class="wrap setup">
      <div class="panel">
        <h3 class="step-h"><span>1</span> Choose your ranger</h3>
        <div class="ranger-grid" role="group" aria-label="Choose your ranger">
          ${Object.keys(RANGERS).map(r => `<button class="ranger-card ${setupDraft.ranger === r ? 'sel' : ''}" data-act="pick-ranger" data-v="${r}" aria-pressed="${setupDraft.ranger === r}">
            ${img(rangerImg(r), '')}<span>${RANGERS[r]}</span></button>`).join('')}
        </div>
        <label class="name-field"><span>Your name <small>(optional)</small></span>
          <input id="pname" type="text" maxlength="16" autocomplete="off" placeholder="Type your name" value="${esc(setupDraft.name)}"></label>
      </div>
      <div class="panel">
        <h3 class="step-h"><span>2</span> Choose your learning phase</h3>
        <div class="phase-grid">${ph('B')}${ph('C')}</div>
      </div>
      <div class="setup-go">
        <p id="setup-msg" class="setup-msg" aria-live="polite"></p>
        <button class="gbtn green big" data-act="setup-done">${playIcon()}LET'S GO, RANGER!</button>
      </div>
    </div>`, 'setup-screen');
  $('#pname').addEventListener('input', e => { setupDraft.name = e.target.value.slice(0, 16); });
}

function screenMap() {
  if (!S.ranger || !S.phase) return go('setup');
  const curW = Math.max(0, A.WORLDS.findIndex((w, i) => worldUnlocked(i) && !S.badges[w.id]));
  const nodes = A.WORLDS.map((w, i) => {
    const un = worldUnlocked(i), pr = worldProgress(i), done = !!S.badges[w.id];
    return `<div class="wnode-wrap">
      <button class="wnode ${un ? '' : 'locked'} ${done ? 'done' : ''}" data-act="${un ? 'open-world' : 'locked-world'}" data-w="${i}"
        aria-label="World ${i + 1}: ${w.name}, letters ${w.letters.split('').join(' ')}. ${un ? `${pr.done} of ${pr.total} missions done` : 'Locked'}">
        <span class="wthumb" style="--wc:${w.color}">${img(w.bg, '')}${un ? '' : `<span class="lock">${LOCK_SVG}</span>`}
          ${i === curW && un ? `<span class="here">${img(rangerImg(S.ranger), '')}</span>` : ''}</span>
        <span class="wsign"><b>${w.name}</b><em>${w.letters[0]}–${w.letters[w.letters.length - 1]}</em></span>
        <span class="wmeta">${img(w.badge, done ? 'Badge earned' : '', 'wbadge ' + (done ? '' : 'dim'))}
          <span class="wbar"><i style="width:${pr.done / pr.total * 100}%"></i></span><small>${pr.done}/${pr.total}</small></span>
      </button></div>`;
  }).join(`<span class="wpath" aria-hidden="true">${img('ui/arrow.png', '')}</span>`);
  show(`${topbar({ title: '<h2>WORLD MAP</h2>', extra: `<button class="imgbtn bookbtn" data-act="go" data-to="book" aria-label="My Animal Book" title="My Animal Book">${img('rewards/book.png', '')}</button>` })}
    <div class="wrap map">
      <div class="guide">${img(rangerImg(S.ranger), '', 'guide-r')}
        <p class="bubble">${S.name ? esc(S.name) + ', choose' : 'Choose'} a world, ${rangerName()}! <small>Phase ${S.phase} · ${P().title} · ${rescuedCount()}/26 animals rescued</small></p></div>
      <div class="world-map">${nodes}</div>
      <p class="note">${img('ui/compass.png', '', 'ni')}<span>The five worlds are adventure zones. Animals from all over the world are hiding in them — open <b>My Animal Book</b> to learn where each animal really lives.</span></p>
    </div>`, 'map-screen');
}

function screenWorld(w) {
  if (w == null) w = lastWorld;
  if (!worldUnlocked(w)) return go('map');
  lastWorld = w;
  const W = A.WORLDS[w], pr = worldProgress(w), bossOpen = bossUnlocked(w);
  const cards = missionsOf(w).map(m => {
    const st = S.missions[m.id]?.stars || 0, mode = A.MODES[m.mode];
    const locked = m.mode === 'boss' && !bossOpen;
    let art, label;
    if (m.mode === 'trail') { art = `<span class="trail-art">${W.letters.split('').map(c => tileImg(c)).join('')}</span>`; label = 'Alphabet Trail'; }
    else {
      const an = A.ANIMALS[m.letter], resc = !!S.rescued[m.letter];
      art = `${img(an.img, '', 'm-ani ' + (resc ? '' : 'sil'))}${tileImg(m.letter, 'm-ltr')}`;
      label = resc ? (m.letter === 'X' ? 'X in FOX' : an.name) : (m.mode === 'boss' ? 'Trapped friend' : 'Missing friend');
    }
    return `<button class="mcard ${m.mode === 'boss' ? 'boss' : ''} ${locked ? 'locked' : ''} ${st ? 'done' : ''}" data-act="${locked ? 'locked-boss' : 'start-mission'}" data-id="${m.id}"
      aria-label="${mode.title}${m.letter ? ', letter ' + m.letter : ''}. ${locked ? 'Locked' : st ? st + ' stars' : 'Not played yet'}">
      <span class="m-mode">${img(mode.icon, '')}<b>${mode.title}</b></span>
      <span class="m-art">${art}${locked ? `<span class="barrier"></span><span class="lock">${LOCK_SVG}</span>` : ''}</span>
      <span class="m-name">${label}</span>
      ${st ? starsHTML(st) : `<span class="m-play">${locked ? 'Finish the other missions first' : 'PLAY'}</span>`}
    </button>`;
  }).join('');
  show(`<div class="world-bg" style="background-image:url('${ASSET}${W.bg}')" aria-hidden="true"></div>${fxLayer(W.fx)}
    ${topbar({ back: 'map', backLabel: 'Map', title: `<h2 class="wtitle">${W.name} <small>${W.letters[0]}–${W.letters[W.letters.length - 1]}</small></h2>` })}
    <div class="wrap world">
      <div class="world-head">
        ${img(W.badge, '', 'whead-badge ' + (S.badges[W.id] ? '' : 'dim'))}
        <div class="whead-prog"><b>World progress: ${pr.done}/${pr.total}</b><span class="wbar big"><i style="width:${pr.done / pr.total * 100}%"></i></span>
        <small>${bossOpen ? (S.badges[W.id] ? 'World badge earned! Replay any mission to win more stars.' : 'The Boss Rescue is open — save the trapped friend!') : 'Complete every mission to open the Boss Rescue.'}</small></div>
      </div>
      <div class="mgrid">${cards}</div>
    </div>`, 'world-screen');
  Snd.startAmbience(W.id);
}
let lastWorld = 0;

/* ───────────────────────── MISSION ENGINE ───────────────────────── */
let M = null;

function reviewLetters(target, w, n, filter = () => true) {
  const before = A.MISSIONS.filter(m => m.letter && m.world <= w).map(m => m.letter);
  let pool = before.filter(l => l !== target && l !== 'X' && filter(l));
  if (S.phase === 'B') { const fam = pool.filter(l => A.FAMILIAR.includes(l)); if (fam.length >= n) pool = fam; }
  const same = shuffle(pool.filter(l => A.WORLDS[w].letters.includes(l)));
  const rest = shuffle(pool.filter(l => !A.WORLDS[w].letters.includes(l)));
  return [...same, ...rest].slice(0, n);
}
function distractors(target, n, { clueSafe = false } = {}) {
  const t = A.ANIMALS[target];
  let pool = A.LETTERS.filter(l => l !== target && l !== 'X' && !(target === 'X' && l === 'F'));
  if (clueSafe) pool = pool.filter(l => !t.conflicts.includes(l) && !A.ANIMALS[l].conflicts.includes(target));
  const w = worldOfLetter(target);
  if (S.phase === 'B') { const fam = pool.filter(l => A.FAMILIAR.includes(l)); if (fam.length >= n) pool = fam; }
  const near = shuffle(pool.filter(l => Math.abs(worldOfLetter(l) - w) <= 1));
  const far = shuffle(pool.filter(l => Math.abs(worldOfLetter(l) - w) > 1));
  return [...near, ...far].slice(0, n);
}
const CONFUSE = { A: 'EIO', B: 'DPR', C: 'KSG', D: 'BTP', E: 'AIO', F: 'VPT', G: 'JQC', H: 'NKM', I: 'EAL', J: 'GYI', K: 'CGH', L: 'ITR', M: 'NWH', N: 'MHU', O: 'UAQ', P: 'BQR', Q: 'OPK', R: 'PLB', S: 'CZX', T: 'LFD', U: 'OVA', V: 'FWU', W: 'VMU', X: 'KZS', Y: 'VJI', Z: 'SXT' };
function letterOptions(L, n) {
  const c = CONFUSE[L].split('');
  const extra = shuffle(A.LETTERS.filter(l => l !== L && !c.includes(l)));
  return shuffle([L, ...[...c, ...extra].slice(0, n - 1)]);
}

function buildRounds(m) {
  const L = m.letter, w = m.world, W = A.WORLDS[w];
  const rv = n => reviewLetters(L, w, n);
  switch (m.mode) {
    case 'find': return [L, ...rv(2)].map(l => ({ type: 'find', letter: l }));
    case 'echo': return [L, ...rv(2)].map(l => ({ type: 'echo', letter: l }));
    case 'who': return [L, ...rv(2)].map(l => ({ type: 'who', letter: l }));
    case 'spell': return [{ type: 'spell', letter: L }, { type: 'spell', letter: reviewLetters(L, w, 1, l => A.ANIMALS[l].name.length <= 5)[0] || 'C' }];
    case 'trail': return S.phase === 'B'
      ? [{ type: 'order' }, { type: 'spotletter', letter: pick(W.letters.split('')) }, { type: 'missing' }]
      : [{ type: 'order' }, { type: 'missing' }, { type: 'nextletter' }];
    case 'xspot': return [{ type: 'xinword' }, S.phase === 'B' ? { type: 'spotletter', letter: 'X' } : { type: 'xposition' }, { type: 'xgap' }];
    case 'boss': return [
      { type: 'echo', letter: L, label: 'ROUND 1 — LISTEN' },
      { type: 'firstletter', letter: L, label: 'ROUND 2 — FIRST LETTER' },
      { type: 'spell', letter: L, label: 'ROUND 3 — SPELL IT' },
      { type: 'who', letter: L, label: 'ROUND 4 — WHO AM I?' }];
  }
  return [];
}

function startMission(id) {
  const m = A.MISSIONS.find(x => x.id === id);
  if (!m) return go('map');
  if (m.mode === 'boss' && !bossUnlocked(m.world)) return;
  current = 'mission'; lastWorld = m.world;
  M = { m, rounds: buildRounds(m), idx: 0, stars: [], busy: false, finished: false, token: {} };
  const W = A.WORLDS[m.world], mode = A.MODES[m.mode];
  const title = m.mode === 'boss' ? 'BOSS RESCUE: WHO IS TRAPPED?' : mode.title;
  show(`<div class="world-bg dim" style="background-image:url('${ASSET}${W.bg}')" aria-hidden="true"></div>${fxLayer(W.fx, 8)}
    <header class="topbar mtop">
      <div class="tb-left"><button class="rbtn back" data-act="leave-mission" aria-label="Back to ${esc(W.name)}">${BACK_SVG}<span>${esc(W.name)}</span></button></div>
      <div class="tb-title"><h2>${title}</h2><span class="learn">Learning: ${mode.learn}</span></div>
      <div class="tb-right">
        <span class="rdots" aria-label="Round progress">${M.rounds.map((_, i) => `<i data-i="${i}"></i>`).join('')}</span>
        <button class="gbtn blue sm replay-top" data-act="replay" aria-label="Replay audio" title="Replay audio">${SPEAKER_SVG}<span>REPLAY AUDIO</span></button>
        ${soundBtn()}
        <button class="imgbtn" data-act="help" aria-label="How to play">${img('ui/icon-help.png', '')}</button>
      </div>
    </header>
    ${m.mode === 'boss' ? `<div class="boss-bar"><div class="boss-cage">${img(A.ANIMALS[m.letter].img, 'Trapped mystery animal', 'boss-ani sil')}<span class="cage-glow"></span>
      <span class="locks">${M.rounds.map((_, i) => `<span class="blk" data-i="${i}">${LOCK_SVG}</span>`).join('')}</span></div>
      <p>A mystery friend is trapped! Win 4 challenges to break the magic barrier.</p></div>` : ''}
    <div class="helper" id="helper">${img(rangerImg(S.ranger), '', 'helper-r')}<p class="bubble" id="hb"></p></div>
    <main class="stage" id="stage"></main>`, 'mission-screen ' + (m.mode === 'boss' ? 'is-boss' : ''));
  Snd.startAmbience(W.id);
  runRound();
}

function setHelper(text, kind = '') {
  const b = $('#hb'); if (!b) return;
  b.className = 'bubble ' + kind; b.innerHTML = text;
}
function updateDots() {
  $$('.rdots i').forEach((d, i) => { d.className = i < M.idx ? 'done' : i === M.idx ? 'now' : ''; });
}

function runRound() {
  const r = M.rounds[M.idx];
  r.wrong = 0; r.hintCap = 3; M.busy = false; M.token = {}; screenSeq++;
  updateDots();
  const stage = $('#stage'); if (!stage) return;
  stage.classList.remove('in'); void stage.offsetWidth; stage.classList.add('in');
  R[r.type](r, stage);
}
/* Speak for the current round only (stops if the round changed). */
function rsay(text, opts) { const tk = M && M.token; return Voice.speak(text, opts).then(v => (M && M.token === tk) ? v : false); }

function wrongAnswer(el, msg) {
  const r = M.rounds[M.idx]; r.wrong++;
  Snd.play('wrong');
  if (el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }
  setHelper(msg || pick(ENCOURAGE), 'oops');
  announce(msg || 'Try again');
}
async function rightAnswer(el, speakText, helperText, clip) {
  if (M.busy) return; M.busy = true;
  const r = M.rounds[M.idx];
  const st = Math.min(r.wrong === 0 ? 3 : r.wrong === 1 ? 2 : 1, r.hintCap);
  M.stars[M.idx] = st;
  Snd.play('correct');
  if (el) { el.classList.add('right'); FX.sparkle(el); }
  const praise = helperText || pick(PRAISE);
  setHelper(`${praise} ${starsHTML(st, 3, 'mini')}`, 'yay');
  announce(praise.replace(/<[^>]+>/g, ''));
  if (r.type === 'echo' || r.type === 'spotletter') S.stats.listen++;
  if (r.type === 'spell') S.stats.spell++;
  if (M.m.mode === 'boss') {
    const lk = $(`.blk[data-i="${M.idx}"]`); if (lk) { lk.classList.add('broken'); Snd.play('crack'); }
  }
  if (speakText) await rsay(speakText, { clip }); else await wait(300);
  await wait(650);
  if (!M || M.finished) return;
  M.idx++;
  if (M.idx < M.rounds.length) runRound(); else finishMission();
}

/* Shared: a Listen button. */
const listenBtn = (label = 'LISTEN AGAIN', act = 'replay') => `<button class="gbtn blue listen" data-act="${act}">${SPEAKER_SVG}<span>${label}</span></button>`;
function noVoiceNote() { return Voice.canSpeak() ? '' : `<p class="novoice">${S.settings.sound && S.settings.voice ? 'Speech is not available on this device, so the words are shown as text.' : 'Sound is off, so the words are shown as text.'}</p>`; }

/* ── Round renderers ── */
const R = {};

R.find = (r, stage) => {
  const p = P(), L = r.letter, an = A.ANIMALS[L];
  const opts = shuffle([L, ...distractors(L, p.findCount - 1)]);
  const shown = S.phase === 'B' ? `${L} ${L.toLowerCase()}` : pick([L, L.toLowerCase()]);
  // Instruction never names the animal; the letter is spoken once from LETTER_SPEECH.
  r.say = () => rsay(`Find the animal that begins with the letter ${letterSay(L)}.`, { clip: 'find-' + L.toLowerCase() });
  r.listen = () => rsay(`${letterSay(L)}.`, { clip: 'letter-' + L.toLowerCase() });
  stage.innerHTML = `
    <div class="prompt-card">${r.label ? `<span class="rlabel">${r.label}</span>` : ''}
      <p class="prompt">Find an animal beginning with</p>${tileHTML(shown, 'big', `role="img" aria-label="Letter ${L}"`)}${listenBtn('LISTEN', 'listen')}</div>
    <div class="scene" style="background-image:url('${ASSET}${A.WORLDS[M.m.world].bg}')">
      ${img('effects/bush.png', '', 'sc-bush l')}${img('effects/bush.png', '', 'sc-bush r')}
      <div class="scene-row n${opts.length}">${opts.map((l, i) => `<button class="critter c${i}" data-act="find-pick" data-l="${l}" aria-label="${p.findLabels ? animalName(l) : 'Animal ' + (i + 1)}">
        ${img(A.ANIMALS[l].img, '')}${p.findLabels ? `<span class="clabel">${animalName(l)}</span>` : ''}</button>`).join('')}</div>
    </div>`;
  setHelper(S.phase === 'B' ? `Tap the animal that begins with <b>${L}</b>!` : 'Tap the right animal. No names this time — think about the first sound!');
  r.say();
};
ACT_ROUND.find = (b) => {
  const r = M.rounds[M.idx], l = b.dataset.l;
  if (l === r.letter) {
    b.classList.add('jump');
    $$('.critter').forEach(c => { if (c !== b) c.classList.add('fade'); });
    if (!P().findLabels) b.insertAdjacentHTML('beforeend', `<span class="clabel">${animalName(l)}</span>`);
    // The animal is named only after the learner has chosen it.
    rightAnswer(b, `Great job! ${animalName(l)} begins with ${letterSay(l)}!`, `Great job! <b>${animalName(l)}</b> begins with <b>${l}</b>!`, 'correct-find-' + l.toLowerCase());
  } else {
    wrongAnswer(b, 'Try again! Listen to the letter.');
    rsay('Try again! Listen to the letter.', { clip: 'try-again-letter' });
    eliminate(b);
  }
};
/* A wrong choice is set aside (dimmed) so no one gets stuck — without
   ever highlighting or saying the right answer. */
function eliminate(b) {
  b.disabled = true; b.classList.add('tried'); b.setAttribute('aria-disabled', 'true');
}

R.echo = (r, stage) => {
  const p = P(), L = r.letter, an = A.ANIMALS[L];
  const opts = shuffle([L, ...distractors(L, p.echoCount - 1)]);
  r.say = () => rsay(an.name, { clip: 'animal-' + an.name.toLowerCase() });
  stage.innerHTML = `
    <div class="prompt-card">${r.label ? `<span class="rlabel">${r.label}</span>` : ''}
      <p class="prompt">Listen and choose the animal.</p>
      <button class="ear" data-act="replay" aria-label="Play the animal name">${SPEAKER_SVG}</button>
      ${Voice.canSpeak() ? '' : `<p class="word-fallback">${esc(an.name)}</p>`}${noVoiceNote()}
      <p class="hint-line" id="hint-line"></p></div>
    <div class="choices pics n${opts.length}">${opts.map((l, i) => `<button class="choice pic" data-act="echo-pick" data-l="${l}" aria-label="Picture ${i + 1}">${img(A.ANIMALS[l].img, '')}<span class="num">${i + 1}</span></button>`).join('')}</div>`;
  setHelper('Listen carefully. Tap the speaker to hear it again — it is free!');
  sayRoundLater(r);
};
ACT_ROUND.echo = (b) => {
  const r = M.rounds[M.idx], l = b.dataset.l;
  if (l === r.letter) {
    b.insertAdjacentHTML('beforeend', `<span class="clabel">${animalName(l)}</span>`);
    rightAnswer(b, animalName(l));
  } else {
    wrongAnswer(b, 'Try again! Tap the speaker to listen again.');
    rsay('Try again!', { clip: 'try-again' });
    if (S.phase === 'B' || r.wrong >= 2) { const h = $('#hint-line'); if (h) h.innerHTML = `Hint: it begins with ${tileHTML(r.letter, 'sm')}`; }
    eliminate(b);
  }
};

R.who = (r, stage) => {
  const p = P(), L = r.letter, an = A.ANIMALS[L], lines = an.clues[S.phase];
  const opts = shuffle([L, ...distractors(L, p.whoCount - 1, { clueSafe: true })]);
  r.say = async () => { for (const [i, t] of lines.entries()) { const li = $(`.clue li[data-i="${i}"]`); li && li.classList.add('reading'); const ok = await rsay(t); li && li.classList.remove('reading'); if (!ok) break; } };
  stage.innerHTML = `
    <div class="clue-card">${r.label ? `<span class="rlabel">${r.label}</span>` : ''}
      <h3>WHO AM I?</h3>
      <ul class="clue">${lines.map((t, i) => `<li data-i="${i}">${esc(t)}</li>`).join('')}</ul>
      <p class="clue-end">I am a …?</p>
      ${listenBtn(p.whoReadAloud ? 'READ AGAIN' : 'READ TO ME')}</div>
    <div class="choices ${p.whoPictures ? 'pics' : 'words'} n${opts.length}">${opts.map((l, i) => p.whoPictures
      ? `<button class="choice pic" data-act="who-pick" data-l="${l}">${img(A.ANIMALS[l].img, '')}<span class="clabel">${animalName(l)}</span></button>`
      : `<button class="choice word" data-act="who-pick" data-l="${l}"><span class="num">${i + 1}</span>${A.ANIMALS[l].full || animalName(l)}</button>`).join('')}</div>`;
  setHelper(S.phase === 'B' ? 'Listen to the clues. Which animal is it?' : 'Read the clues carefully. Which animal is it?');
  if (p.whoReadAloud) sayRoundLater(r);
};
ACT_ROUND.who = (b) => {
  const r = M.rounds[M.idx], l = b.dataset.l;
  if (l === r.letter) rightAnswer(b, `I am a${/^[AEIOU]/.test(animalName(l)) ? 'n' : ''} ${A.ANIMALS[l].full || animalName(l)}!`);
  else { wrongAnswer(b, 'Try again! Read the clues again.'); rsay('Try again!', { clip: 'try-again' }); eliminate(b); }
};

/* LETTER CATCH — tap or drag letters into slots. */
R.spell = (r, stage) => {
  const p = P(), L = r.letter, an = A.ANIMALS[L], word = an.name.toUpperCase();
  const used = new Set(word.split(''));
  const extra = shuffle(A.LETTERS.filter(c => !used.has(c))).slice(0, word.length <= 4 ? Math.min(2, p.spellDistractors) : p.spellDistractors);
  let letters = shuffle([...word.split(''), ...extra]);
  for (let k = 0; k < 5 && letters.join('').startsWith(word); k++) letters = shuffle(letters);
  r.word = word;
  r.tiles = letters.map((ch, i) => ({ id: i, ch, slot: -1 }));
  r.slots = Array(word.length).fill(null);
  r.locked = Array(word.length).fill(false);
  r.hist = []; r.hints = 0;
  r.say = () => rsay(an.name, { clip: 'animal-' + an.name.toLowerCase() });
  stage.innerHTML = `
    <div class="spell-top">${r.label ? `<span class="rlabel">${r.label}</span>` : ''}
      <div class="spell-pic">${img(an.img, S.phase === 'B' ? an.name : 'Mystery animal')}</div>
      <div class="spell-side"><h3>SPELL THE ANIMAL</h3>${listenBtn('LISTEN')}
        ${Voice.canSpeak() || S.phase === 'C' ? '' : `<p class="word-fallback sm">${esc(an.name)}</p>`}</div></div>
    <div class="slots" id="slots" role="group" aria-label="Answer slots">${r.slots.map((_, i) => `<button class="slot" data-i="${i}" aria-label="Slot ${i + 1}, empty"></button>`).join('')}</div>
    <div class="tray" id="tray" role="group" aria-label="Letter tiles">${r.tiles.map(t => `<button class="ltile tt" data-id="${t.id}" style="--tc:${tileColor(t.ch)}" aria-label="Letter ${t.ch}">${t.ch}</button>`).join('')}</div>
    <div class="spell-tools">
      <button class="gbtn orange sm" data-act="sp-undo">UNDO</button>
      <button class="gbtn purple sm" data-act="sp-reset">RESET</button>
      <button class="gbtn sky sm" data-act="sp-hint" id="sp-hint">HINT${p.spellHints < 9 ? ` (${p.spellHints})` : ''}</button>
      <button class="gbtn green sm" data-act="sp-check" id="sp-check" disabled>CHECK</button>
    </div>`;
  setHelper(S.phase === 'B' ? 'Tap or drag the letters to spell the animal. Need help? Tap HINT for the first letter.' : 'Spell it from memory. Watch out — there are extra letters!');
  bindDrag(stage);
  spRender();
  if (p.spellAutoSay) sayRoundLater(r);
};
function spRender() {
  const r = M.rounds[M.idx];
  $$('#slots .slot').forEach((s, i) => {
    const t = r.slots[i] == null ? null : r.tiles[r.slots[i]];
    s.textContent = t ? t.ch : '';
    s.classList.toggle('filled', !!t); s.classList.toggle('locked', r.locked[i]);
    s.style.setProperty('--tc', t ? tileColor(t.ch) : 'transparent');
    s.setAttribute('aria-label', `Slot ${i + 1}, ${t ? t.ch : 'empty'}`);
  });
  $$('#tray .tt').forEach(b => { const t = r.tiles[+b.dataset.id]; b.classList.toggle('used', t.slot >= 0); b.disabled = t.slot >= 0; });
  const full = r.slots.every(x => x != null);
  const ck = $('#sp-check'); if (ck) ck.disabled = !full;
  const hb = $('#sp-hint'); if (hb) hb.disabled = r.hints >= P().spellHints;
}
function spPlace(tileId, slotIdx) {
  const r = M.rounds[M.idx]; if (M.busy) return;
  const t = r.tiles[tileId]; if (!t || t.slot >= 0) return;
  if (slotIdx == null || r.slots[slotIdx] != null) slotIdx = r.slots.findIndex(x => x == null);
  if (slotIdx < 0) return;
  r.slots[slotIdx] = tileId; t.slot = slotIdx; r.hist.push(tileId);
  Snd.play('pick'); spRender();
  const s = $(`#slots .slot[data-i="${slotIdx}"]`); if (s && !reduceMotion()) { s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop'); }
  if (r.slots.every(x => x != null) && S.phase === 'B') setTimeout(() => spCheck(), 350);
}
function spRemove(slotIdx) {
  const r = M.rounds[M.idx]; if (M.busy || r.locked[slotIdx]) return;
  const id = r.slots[slotIdx]; if (id == null) return;
  r.tiles[id].slot = -1; r.slots[slotIdx] = null; r.hist = r.hist.filter(x => x !== id);
  Snd.play('tap'); spRender();
}
function spCheck() {
  const r = M.rounds[M.idx]; if (M.busy || !r.slots.every(x => x != null)) return;
  const got = r.slots.map(id => r.tiles[id].ch).join('');
  if (got === r.word) {
    $$('#slots .slot').forEach(s => s.classList.add('ok'));
    rightAnswer($('#slots'), `${r.word.split('').map(letterSay).join(' ')} ${animalName(M.rounds[M.idx].letter)}!`);
  } else {
    // Return the wrong letters to the tray; keep correct ones in place.
    r.slots.forEach((id, i) => { if (id != null && r.tiles[id].ch !== r.word[i] && !r.locked[i]) { r.tiles[id].slot = -1; r.slots[i] = null; } });
    r.hist = r.hist.filter(id => r.tiles[id].slot >= 0);
    wrongAnswer($('#slots'), S.phase === 'B' ? 'Almost! The green letters are right. Try the rest.' : 'Not quite. Some letters went back to the tray.');
    spRender();
    $$('#slots .slot.filled').forEach(s => s.classList.add('ok'));
    setTimeout(() => $$('#slots .slot').forEach(s => s.classList.remove('ok')), 1400);
  }
}
function spHint() {
  const r = M.rounds[M.idx], p = P(); if (M.busy || r.hints >= p.spellHints) return;
  // Find first slot that is empty or wrong.
  let i = r.slots.findIndex((id, k) => id == null || r.tiles[id].ch !== r.word[k]);
  if (i < 0) return;
  if (r.slots[i] != null) spRemove(i);
  const t = r.tiles.find(t => t.slot < 0 && t.ch === r.word[i]);
  if (!t) { // the needed letter is sitting in a wrong slot — free it
    const k = r.slots.findIndex((id, j) => id != null && r.tiles[id].ch === r.word[i] && r.tiles[id].ch !== r.word[j]);
    if (k >= 0) spRemove(k);
  }
  const t2 = r.tiles.find(t => t.slot < 0 && t.ch === r.word[i]);
  if (!t2) return;
  r.hints++;
  r.hintCap = Math.min(r.hintCap, (S.phase === 'B' && r.hints === 1 && i === 0) ? p.spellHintCap : 1);
  r.locked[i] = true;
  spPlace(t2.id, i);
  setHelper(`Hint: the letter <b>${r.word[i]}</b> goes here.`, 'hint');
}
function bindDrag(stage) {
  let drag = null;
  stage.addEventListener('pointerdown', e => {
    const b = e.target.closest('#tray .tt'); if (!b || b.disabled || M.busy) return;
    drag = { b, id: +b.dataset.id, x: e.clientX, y: e.clientY, moved: false, ghost: null };
    try { b.setPointerCapture(e.pointerId); } catch (er) {}
  });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 8) {
      drag.moved = true;
      const g = drag.b.cloneNode(true); g.classList.add('ghost'); g.removeAttribute('data-id');
      const r = drag.b.getBoundingClientRect(); g.style.width = r.width + 'px'; g.style.height = r.height + 'px';
      document.body.appendChild(g); drag.ghost = g; drag.b.classList.add('lifting');
    }
    if (drag.ghost) {
      drag.ghost.style.left = e.clientX + 'px'; drag.ghost.style.top = e.clientY + 'px';
      $$('#slots .slot').forEach(s => s.classList.remove('over'));
      const over = document.elementsFromPoint(e.clientX, e.clientY).find(el => el.classList && el.classList.contains('slot'));
      if (over) over.classList.add('over');
    }
  });
  const end = e => {
    if (!drag) return;
    const d = drag; drag = null;
    d.b.classList.remove('lifting'); $$('#slots .slot').forEach(s => s.classList.remove('over'));
    if (d.ghost) {
      d.ghost.remove();
      if (e.type === 'pointercancel') return;
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      const slot = els.find(el => el.classList && el.classList.contains('slot'));
      const area = els.find(el => el.id === 'slots');
      if (slot) spPlace(d.id, +slot.dataset.i); else if (area) spPlace(d.id);
    } else if (e.type !== 'pointercancel') spPlace(d.id);
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  // Keyboard users: Enter/Space on a tile places it (pointer events don't fire for keys).
  stage.addEventListener('keydown', e => {
    const b = e.target.closest('#tray .tt');
    if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); spPlace(+b.dataset.id); }
  });
}

R.firstletter = (r, stage) => {
  const L = r.letter, an = A.ANIMALS[L], word = an.name.toUpperCase();
  const opts = letterOptions(L, S.phase === 'B' ? 3 : 4);
  r.say = () => rsay(an.name, { clip: 'animal-' + an.name.toLowerCase() });
  stage.innerHTML = `
    <div class="prompt-card">${r.label ? `<span class="rlabel">${r.label}</span>` : ''}
      <p class="prompt">Which letter is missing?</p>
      <div class="gapword"><span class="gap" id="gap">?</span>${word.slice(1).split('').map(c => `<span class="gl">${c}</span>`).join('')}</div>
      ${listenBtn('LISTEN')}</div>
    <div class="choices letters n${opts.length}">${opts.map(l => `<button class="ltile choice-l" data-act="first-pick" data-l="${l}" style="--tc:${tileColor(l)}" aria-label="Letter ${l}">${l}</button>`).join('')}</div>`;
  setHelper('What is the first letter? Listen to the beginning sound.');
  if (S.phase === 'B') sayRoundLater(r);
};
ACT_ROUND.first = (b) => {
  const r = M.rounds[M.idx], l = b.dataset.l;
  if (l === r.letter) { const g = $('#gap'); g.textContent = l; g.classList.add('fill'); rightAnswer(b, `Great job! ${animalName(l)} begins with ${letterSay(l)}!`, `Great job! <b>${animalName(l)}</b> begins with <b>${l}</b>!`); }
  else { wrongAnswer(b, 'Try again! Listen to the beginning of the word.'); rsay('Try again!', { clip: 'try-again' }); eliminate(b); }
};

/* ALPHABET TRAIL rounds */
R.order = (r, stage) => {
  const W = A.WORLDS[M.m.world], seq = W.letters.split('');
  r.seq = seq; r.pos = 0;
  let mixed = shuffle(seq); for (let k = 0; k < 5 && mixed.join('') === seq.join(''); k++) mixed = shuffle(seq);
  r.say = () => rsay(seq.map(letterSay).join('. ') + '.');
  stage.innerHTML = `
    <div class="prompt-card"><p class="prompt">Fix the trail! Tap the letters in <b>ABC order</b>.</p>
      ${P().trailGuide ? `<div class="abc-guide" aria-label="Alphabet guide">${A.LETTERS.map(c => `<span class="${W.letters.includes(c) ? 'hl' : ''}">${c}</span>`).join('')}</div>` : ''}
      ${P().trailGuide ? listenBtn('HEAR THE LETTERS') : ''}</div>
    <div class="trail-path" id="tpath">${seq.map((_, i) => `<span class="tstone" data-i="${i}"></span>`).join(`<i class="tdot"></i>`)}</div>
    <div class="choices letters n${seq.length}">${mixed.map(c => `<button class="ltile choice-l" data-act="order-pick" data-l="${c}" style="--tc:${tileColor(c)}" aria-label="Letter ${c}">${c}</button>`).join('')}</div>`;
  setHelper(`Which letter comes first? Start with <b>${S.phase === 'B' ? seq[0] : '…'}</b>${S.phase === 'B' ? '!' : ''}`);
};
ACT_ROUND.order = (b) => {
  const r = M.rounds[M.idx], l = b.dataset.l;
  if (M.busy || b.disabled) return;
  if (l === r.seq[r.pos]) {
    const st = $(`.tstone[data-i="${r.pos}"]`); st.innerHTML = tileHTML(l, 'sm'); st.classList.add('set');
    b.disabled = true; b.classList.add('used'); r.pos++;
    Snd.play('pick'); rsay(`${letterSay(l)}.`, { clip: 'letter-' + l.toLowerCase() });
    if (r.pos === r.seq.length) rightAnswer($('#tpath'), r.seq.map(letterSay).join('. ') + '.');
    else setHelper(`Good! What comes after <b>${l}</b>?`);
  } else { wrongAnswer(b, `Not yet! What comes after <b>${r.pos ? r.seq[r.pos - 1] : 'the start'}</b>?`); rsay('Try again!', { clip: 'try-again' }); }
};
R.missing = (r, stage) => {
  const W = A.WORLDS[M.m.world];
  const start = A.LETTERS.indexOf(W.letters[0]);
  const seq = A.LETTERS.slice(Math.max(0, start - (S.phase === 'C' ? 1 : 0)), start + W.letters.length);
  const gi = 1 + (Math.random() * (seq.length - 2) | 0);
  r.answer = seq[gi];
  const opts = shuffle([r.answer, ...shuffle(A.LETTERS.filter(c => c !== r.answer && !seq.includes(c))).slice(0, S.phase === 'B' ? 2 : 3)]);
  r.say = () => rsay(seq.map((c, i) => i === gi ? 'hmm?' : letterSay(c)).join('. ') + '.');
  stage.innerHTML = `
    <div class="prompt-card"><p class="prompt">A letter fell off the trail sign! Which one is missing?</p>
      <div class="gapword trail">${seq.map((c, i) => i === gi ? '<span class="gap" id="gap">?</span>' : `<span class="gl">${c}</span>`).join('')}</div>
      ${listenBtn('LISTEN')}</div>
    <div class="choices letters n${opts.length}">${opts.map(c => `<button class="ltile choice-l" data-act="ans-pick" data-l="${c}" style="--tc:${tileColor(c)}" aria-label="Letter ${c}">${c}</button>`).join('')}</div>`;
  setHelper('Say the alphabet in your head. Which letter is missing?');
};
R.nextletter = (r, stage) => {
  const i = 1 + (Math.random() * 24 | 0), after = Math.random() < .5;
  const base = A.LETTERS[i]; r.answer = after ? A.LETTERS[i + 1] : A.LETTERS[i - 1];
  const opts = shuffle([r.answer, ...shuffle(A.LETTERS.filter(c => c !== r.answer && c !== base)).slice(0, 3)]);
  r.say = () => rsay(`Which letter comes ${after ? 'after' : 'before'} ${letterSay(base)}`);
  stage.innerHTML = `
    <div class="prompt-card"><p class="prompt">Which letter comes <b>${after ? 'AFTER' : 'BEFORE'}</b></p>${tileHTML(base, 'big')}${listenBtn('LISTEN')}</div>
    <div class="choices letters n4">${opts.map(c => `<button class="ltile choice-l" data-act="ans-pick" data-l="${c}" style="--tc:${tileColor(c)}" aria-label="Letter ${c}">${c}</button>`).join('')}</div>`;
  setHelper('Think about the alphabet order.');
};
R.spotletter = (r, stage) => {
  const L = r.letter; r.answer = L;
  const lower = S.phase === 'C';
  const opts = shuffle([L, ...CONFUSE[L].split('').slice(0, 3)]);
  r.say = () => rsay(`Find the letter ${letterSay(L)}.`);
  stage.innerHTML = `
    <div class="prompt-card"><p class="prompt">Tap the letter you hear!</p>
      <button class="ear" data-act="replay" aria-label="Hear the letter">${SPEAKER_SVG}</button>
      ${Voice.canSpeak() ? '' : `<p class="word-fallback">Letter ${L}</p>`}</div>
    <div class="choices letters n4">${opts.map(c => `<button class="ltile choice-l" data-act="ans-pick" data-l="${c}" style="--tc:${tileColor(c)}" aria-label="Letter ${lower ? c.toLowerCase() : c}">${lower ? c.toLowerCase() : c}</button>`).join('')}</div>`;
  setHelper('Listen to the letter name, then tap it.');
  sayRoundLater(r);
};
ACT_ROUND.ans = (b) => {
  const r = M.rounds[M.idx], l = b.dataset.l;
  if (l === r.answer) { const g = $('#gap'); if (g) { g.textContent = l; g.classList.add('fill'); } rightAnswer(b, `Great job! ${letterSay(l)}!`, `Great job! <b>${l}</b>!`); }
  else { wrongAnswer(b, 'Try again!'); rsay('Try again!', { clip: 'try-again' }); eliminate(b); }
};

/* LETTER X — find X inside FOX (X is NOT the first letter of fox). */
R.xinword = (r, stage) => {
  r.say = () => rsay(`Find the letter ${letterSay('X')} in the word fox.`, { clip: 'find-x-in-fox' });
  r.listen = () => rsay(`${letterSay('X')}.`, { clip: 'letter-x' });
  stage.innerHTML = `
    <div class="prompt-card"><span class="rlabel">SPECIAL LETTER</span>
      <p class="prompt">Very few animal names begin with X. But X is hiding in <b>FOX</b>! Tap the X.</p>${listenBtn('LISTEN', 'listen')}</div>
    <div class="xrow">${img(A.ANIMALS.X.img, 'Fox', 'xfox')}
      <div class="choices letters n3">${'FOX'.split('').map(c => `<button class="ltile choice-l huge" data-act="x-pick" data-l="${c}" style="--tc:${tileColor(c)}" aria-label="Letter ${c}">${c}</button>`).join('')}</div></div>`;
  setHelper('Look at the word FOX. Where is the X?');
  sayRoundLater(r);
};
ACT_ROUND.x = (b) => {
  const l = b.dataset.l;
  if (l === 'X') rightAnswer(b, `Great job! ${letterSay('X')} is the last letter in fox!`, 'Great job! <b>X</b> is the last letter in <b>FOX</b>!');
  else { wrongAnswer(b, 'Try again! Listen to the letter.'); rsay('Try again! Listen to the letter.', { clip: 'try-again-letter' }); eliminate(b); }
};
R.xposition = (r, stage) => {
  r.answer = 'last';
  r.say = () => rsay(`Fox. Where is the letter ${letterSay('X')} in fox? First, middle, or last?`);
  stage.innerHTML = `
    <div class="prompt-card"><p class="prompt">Where is the letter <b>X</b> in <b>FOX</b>?</p>
      <div class="gapword">${'FOX'.split('').map(c => `<span class="gl">${c}</span>`).join('')}</div>${listenBtn('LISTEN')}</div>
    <div class="choices words n3">${['first', 'middle', 'last'].map((w, i) => `<button class="choice word" data-act="pos-pick" data-v="${w}"><span class="num">${i + 1}</span>${w.toUpperCase()}</button>`).join('')}</div>`;
  setHelper('Is X at the beginning, the middle, or the end?');
};
ACT_ROUND.pos = (b) => {
  if (b.dataset.v === 'last') rightAnswer(b, `Yes! ${letterSay('X')} is at the end of fox.`);
  else { wrongAnswer(b, 'Try again! Look at the word again.'); rsay('Try again!', { clip: 'try-again' }); eliminate(b); }
};
R.xgap = (r, stage) => {
  r.answer = 'X';
  const opts = shuffle(['X', 'K', 'S', ...(S.phase === 'C' ? ['Z'] : [])]);
  r.say = () => rsay('Fox.');
  stage.innerHTML = `
    <div class="prompt-card"><p class="prompt">Finish the word!</p>
      <div class="xrow sm">${img(A.ANIMALS.X.img, 'Fox', 'xfox')}<div class="gapword"><span class="gl">F</span><span class="gl">O</span><span class="gap" id="gap">?</span></div></div>
      ${listenBtn('LISTEN')}</div>
    <div class="choices letters n${opts.length}">${opts.map(c => `<button class="ltile choice-l" data-act="ans-pick" data-l="${c}" style="--tc:${tileColor(c)}" aria-label="Letter ${c}">${c}</button>`).join('')}</div>`;
  setHelper('Which letter ends the word FOX?');
  if (S.phase === 'B') sayRoundLater(r);
};

/* ───────────────────────── FINISH & REWARDS ───────────────────────── */
function finishMission() {
  if (!M || M.finished) return;
  M.finished = true;
  const m = M.m, W = A.WORLDS[m.world];
  const stars = Math.max(1, Math.round(M.stars.reduce((a, b) => a + b, 0) / M.stars.length));
  const prev = S.missions[m.id]?.stars || 0, first = !prev;
  let coins = 0;
  if (stars > prev) { coins += (stars - prev) * 5; S.missions[m.id] = { stars }; }
  if (first) coins += m.mode === 'boss' ? 25 : 10;
  let newRescue = false;
  if (m.letter) { newRescue = !S.rescued[m.letter]; S.rescued[m.letter] = Math.max(S.rescued[m.letter] || 0, stars); }
  let badge = false;
  if (m.mode === 'boss' && !S.badges[W.id]) { S.badges[W.id] = true; badge = true; }
  S.coins += coins;
  const newAch = [];
  const grant = (id, ok) => { if (ok && !S.ach[id]) { S.ach[id] = Date.now(); newAch.push(A.ACHIEVEMENTS.find(a => a.id === id)); } };
  grant('first', rescuedCount() >= 1);
  grant('listen', S.stats.listen >= 5);
  grant('spell', S.stats.spell >= 5);
  grant('forest', !!S.badges.forest);
  grant('master', rescuedCount() === 26);
  save();
  showReward({ m, W, stars, coins, newRescue, badge, newAch });
}

function nextMissionId(w) {
  const ms = missionsOf(w);
  const todo = ms.find(x => !isDone(x.id) && (x.mode !== 'boss' || bossUnlocked(w)));
  return todo ? todo.id : null;
}

function showReward({ m, W, stars, coins, newRescue, badge, newAch }) {
  Voice.stop();
  const an = m.letter ? A.ANIMALS[m.letter] : null;
  const isTrail = m.mode === 'trail';
  const nextW = m.world + 1;
  const title = isTrail ? 'TRAIL FIXED!' : 'ANIMAL RESCUED!';
  const nextId = nextMissionId(m.world);
  const allDone = rescuedCount() === 26 && !S.masterSeen;
  const html = `
    <div class="reward ${badge ? 'with-badge' : ''}">
      <div class="rw-rays" aria-hidden="true"></div>
      <h2 class="rw-title">${title}</h2>
      ${an ? `<div class="rw-ani">${img(an.img, an.name)}</div>
        <p class="rw-name">${m.letter === 'X' ? 'Letter <b>X</b> found in <b>FO<mark>X</mark></b>!' : `${tileHTML(m.letter, 'sm')} <b>${esc(an.full || an.name)}</b>`}</p>`
        : `<div class="rw-trail">${W.letters.split('').map(c => tileHTML(c)).join('')}</div>`}
      <div class="rw-stars">${[0, 1, 2].map(i => img('ui/star.png', '', 'rs ' + (i < stars ? 'on' : 'off')).replace('<img', `<img style="--i:${i}"`)).join('')}</div>
      ${coins ? `<p class="rw-coins">${img('ui/coin.png', '')} +${coins} paw coins</p>` : `<p class="rw-coins muted">Play again to beat your best stars!</p>`}
      ${newRescue && an ? `<p class="rw-book">${img('rewards/book.png', '')}<span>New card added to <b>My Animal Book</b>!</span></p>` : ''}
      ${badge ? `<div class="rw-badge">${img(W.badge, W.name + ' badge')}<p><b>${W.name.toUpperCase()} COMPLETE!</b>${nextW < 5 ? `<br>${A.WORLDS[nextW].name} is now open!` : ''}</p></div>` : ''}
      ${newAch.map(a => `<div class="rw-ach">${img(a.img, '')}<p><small>ACHIEVEMENT UNLOCKED</small><b>${a.title}</b>${a.desc}</p></div>`).join('')}
      <div class="rw-actions">
        ${allDone ? `<button class="gbtn green big" data-act="go" data-to="final">${img('rewards/crown.png', '', 'bi')}YOU ARE A MASTER RANGER!</button>` : ''}
        ${!allDone && badge && nextW < 5 ? `<button class="gbtn green big" data-act="open-world" data-w="${nextW}">${playIcon()}GO TO ${A.WORLDS[nextW].name.toUpperCase()}</button>` : ''}
        ${!allDone && !badge && nextId ? `<button class="gbtn green big" data-act="start-mission" data-id="${nextId}">${playIcon()}NEXT MISSION</button>` : ''}
        ${an && m.letter ? `<button class="gbtn blue" data-act="book-card" data-l="${m.letter}">${img('rewards/book.png', '', 'bi')}SEE BOOK CARD</button>` : ''}
        <button class="gbtn orange" data-act="start-mission" data-id="${m.id}">PLAY AGAIN</button>
        <button class="gbtn purple" data-act="open-world" data-w="${m.world}">${img('ui/map.png', '', 'bi')}BACK TO ${W.name.toUpperCase()}</button>
      </div>
    </div>`;
  const stage = $('#stage');
  $('#helper') && $('#helper').remove();
  if ($('.boss-bar')) { $('.boss-bar').classList.add('freed'); const ba = $('.boss-ani'); if (ba) { ba.classList.remove('sil'); ba.alt = an ? an.name : ''; } }
  if (stage) { stage.innerHTML = html; stage.classList.add('reward-stage'); }
  $$('.rdots i').forEach(d => { d.className = 'done'; });
  Snd.play(badge ? 'world' : 'rescue');
  FX.confetti(badge ? 200 : 120);
  setTimeout(() => { if (coins) Snd.play('coin'); }, 900);
  if (an) sayLater(m.letter === 'X' ? `You found the letter ${letterSay('X')} in fox!` : `${an.full || an.name} rescued! ${an.fact}`, 700);
  else sayLater('Trail fixed! Great job, ranger!', 700);
  announce(`${title} ${stars} stars.`);
  const h = $('.rw-title'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  window.scrollTo(0, 0); app.scrollTop = 0;
}

/* ───────────────────────── ANIMAL BOOK ───────────────────────── */
let bookFilter = 'all';
function screenBook() {
  const letters = A.LETTERS.filter(l => bookFilter === 'all' || A.WORLDS[+bookFilter].letters.includes(l));
  const cnt = rescuedCount();
  show(`${topbar({ back: S.ranger && S.phase ? 'map' : 'home', backLabel: S.ranger && S.phase ? 'Map' : 'Home', title: '<h2>MY ANIMAL BOOK</h2>' })}
    <div class="wrap book">
      <div class="book-head">${img('rewards/book.png', '', 'book-icon')}
        <div class="bh-prog"><b>${cnt} / 26 animals rescued</b><span class="wbar big"><i style="width:${cnt / 26 * 100}%"></i></span>
          <span class="ach-row">${A.ACHIEVEMENTS.map(a => `<span class="ach ${S.ach[a.id] ? 'on' : ''}" title="${a.title}: ${a.desc}">${img(a.img, '')}<small>${a.title}</small></span>`).join('')}</span></div></div>
      <div class="filters" role="group" aria-label="Filter by world">
        <button class="chip ${bookFilter === 'all' ? 'on' : ''}" data-act="book-filter" data-v="all" aria-pressed="${bookFilter === 'all'}">ALL A–Z</button>
        ${A.WORLDS.map((w, i) => `<button class="chip ${bookFilter === String(i) ? 'on' : ''}" data-act="book-filter" data-v="${i}" aria-pressed="${bookFilter === String(i)}" style="--wc:${w.color}">${img(w.badge, '')}${w.name} <small>${w.letters[0]}–${w.letters[w.letters.length - 1]}</small></button>`).join('')}
      </div>
      <div class="abc-jump" role="group" aria-label="Open a letter">${A.LETTERS.map(l => `<button class="${S.rescued[l] ? 'got' : ''}" data-act="book-card" data-l="${l}" aria-label="Letter ${l}${S.rescued[l] ? ', rescued' : ', not rescued yet'}">${l}</button>`).join('')}</div>
      <div class="bgrid">${letters.map(l => {
        const an = A.ANIMALS[l], got = !!S.rescued[l];
        return `<button class="bcard ${got ? 'got' : 'lockedc'}" data-act="book-card" data-l="${l}" aria-label="${l}: ${got ? an.name + ', rescued' : 'not rescued yet'}">
          ${tileImg(l, 'bl')}${img(an.img, '', got ? '' : 'sil')}
          <span class="bname">${got ? (l === 'X' ? 'FO<mark>X</mark>' : esc(an.name.toUpperCase())) : '???'}</span>
          ${got ? starsHTML(S.rescued[l], 3, 'mini') : `<span class="bq">${A.WORLDS[worldOfLetter(l)].name}</span>`}</button>`;
      }).join('')}</div>
    </div>`, 'book-screen');
}
function bookCard(l) {
  const an = A.ANIMALS[l], got = !!S.rescued[l], w = A.WORLDS[worldOfLetter(l)];
  if (!got) {
    toast(`${img(w.badge, '', 'ti')} Rescue the <b>${l}</b> animal in <b>${w.name}</b> to unlock this card!`);
    Snd.play('tap'); return;
  }
  Snd.play('flip');
  const isX = l === 'X';
  modal(`<button class="imgbtn mclose" data-act="modal-close" aria-label="Close">${img('ui/icon-close.png', '')}</button>
    <div class="flip"><div class="card-face">
      <div class="cf-top">${tileHTML(l, 'big')}<span class="lower">${l.toLowerCase()}</span><span class="stamp">RESCUED!</span></div>
      <div class="cf-img">${img(an.img, an.name)}</div>
      <h3 class="cf-name">${isX ? 'FO<mark>X</mark>' : esc((an.full || an.name).toUpperCase())}</h3>
      ${isX ? '<p class="cf-x">X is the <b>last</b> letter in FOX. Fox begins with F!</p>' : ''}
      <button class="gbtn blue sm" data-act="say" data-t="${esc(isX ? `${letterSay('X')} Fox. ${letterSay('F')} ${letterSay('O')} ${letterSay('X')}` : (an.full || an.name))}">${SPEAKER_SVG}<span>HEAR IT</span></button>
      <p class="cf-fact"><b>Fact:</b> ${esc(an.fact)}</p>
      <p class="cf-home"><b>Real home:</b> ${esc(an.home)}</p>
      <p class="cf-id"><b>Bahasa Indonesia:</b> ${esc(an.id)}</p>
      <div class="cf-foot">${starsHTML(S.rescued[l])}<small>Found in the ${w.name} adventure zone</small></div>
    </div></div>`, 'card-modal');
  sayLater(isX ? `${letterSay('X')} Fox.` : (an.full || an.name), 350);
}

/* ───────────────────────── MODALS: HELP, SETTINGS ───────────────────────── */
function aboutModal() {
  modal(`<button class="imgbtn mclose" data-act="modal-close" aria-label="Close">${img('ui/icon-close.png', '')}</button>
    <div class="about">
      <span class="about-tag">${INFO_SVG}ABOUT THE DEVELOPER</span>
      <img class="about-avatar" src="../../assets/developer-mega.png" alt="Mega Ayu Wulandari" width="128" height="128">
      <h2 id="about-title">Mega Ayu Wulandari</h2>
      <p class="about-role"><span>English Teacher</span><span>Creator of ENGLISH YO!</span></p>
      <p class="about-text"><b>Alphabet Animal Rescue!</b> is part of <b>ENGLISH YO!</b>, an interactive learning platform designed to make English learning more engaging and enjoyable.</p>
      <a class="about-logo" href="../../index.html" aria-label="Visit ENGLISH YO!"><img src="../../assets/logo-approved.png" alt="ENGLISH YO!" width="2139" height="735"></a>
      <button class="gbtn green about-close" data-act="modal-close">CLOSE</button>
    </div>`, 'about-modal', null, 'about-title');
}
function helpModal() {
  const modes = ['find', 'echo', 'spell', 'who', 'boss'].map(k => `<li>${img(A.MODES[k].icon, '')}<b>${A.MODES[k].title}</b> ${{
    find: 'Tap the animal that begins with the letter.',
    echo: 'Listen to the animal name and choose the picture.',
    spell: 'Tap or drag letters to spell the animal name. Use UNDO, RESET and HINT.',
    who: 'Read or listen to the clues and guess the animal.',
    boss: 'Four challenges in a row to break the magic barrier!'
  }[k]}</li>`).join('');
  modal(`<button class="imgbtn mclose" data-act="modal-close" aria-label="Close">${img('ui/icon-close.png', '')}</button>
    <h2>HOW TO PLAY</h2>
    <ol class="howto">
      <li><b>Choose</b> your ranger and your learning phase.</li>
      <li><b>Pick a world</b> on the map. Green Forest is open first.</li>
      <li><b>Play missions</b> to rescue animal friends:<ul class="modes">${modes}</ul>
        Each world also has an <b>Alphabet Trail</b> to practise ABC order.</li>
      <li><b>Finish every mission</b> to open the Boss Rescue. Win it to earn the world badge and open the next world.</li>
      <li>Rescued animals go into <b>My Animal Book</b>. Rescue all 26 to become a <b>Master Wildlife Ranger</b>!</li>
    </ol>
    <div class="starrule">${starsHTML(3)} first try ${starsHTML(2)} second try ${starsHTML(1)} more tries or hints</div>
    <p class="small">No timers and no lives — you can always try again. Tap the speaker button to hear words again as many times as you like.</p>
    <details class="teacher"><summary>Notes for teachers</summary>
      <p><b>Phase B (Young Explorer):</b> 3 choices, animal names shown and spoken, clues read aloud with pictures, spelling with no extra letters and first-letter hints, alphabet guide on the trail.</p>
      <p><b>Phase C (Wildlife Expert):</b> 4–5 choices, no written names in Find Me, listening without written hints, longer clues to read (word answers), spelling from memory with extra letters and only one hint, lowercase letters and before/after questions.</p>
      <p>The worlds are adventure themes only. Each Animal Book card shows the animal's real home. Letter X is taught as the last letter in FOX, not as a first letter. Audio uses the device's built-in synthetic voice (British English when available).</p>
    </details>
    <button class="gbtn green" data-act="modal-close">GOT IT!</button>`, 'help-modal');
}
function settingsModal() {
  const s = S.settings;
  const tog = (k, label) => `<label class="tog"><input type="checkbox" data-set="${k}" ${s[k] ? 'checked' : ''}><span class="sw"></span>${label}</label>`;
  modal(`<button class="imgbtn mclose" data-act="modal-close" aria-label="Close">${img('ui/icon-close.png', '')}</button>
    <h2>SETTINGS</h2>
    <div class="set-grid">
      ${tog('sound', 'All sound')}
      ${tog('voice', 'Voice (word pronunciation)')}
      ${tog('sfx', 'Sound effects')}
      ${tog('ambience', 'World nature sounds')}
      <label class="rng">Volume <input type="range" min="0" max="1" step="0.05" value="${s.volume}" data-set="volume"></label>
      <fieldset class="seg"><legend>Voice speed</legend>
        ${[[0.75, 'Slow'], [0.9, 'Normal'], [1.05, 'Fast']].map(([v, l]) => `<label><input type="radio" name="rate" value="${v}" data-set="rate" ${Math.abs(s.rate - v) < .01 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>
      <fieldset class="seg"><legend>Animations</legend>
        ${[['auto', 'Auto'], ['reduce', 'Reduced'], ['full', 'Full']].map(([v, l]) => `<label><input type="radio" name="motion" value="${v}" data-set="motion" ${s.motion === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>
    </div>
    <label class="voice-pick">Voice
      <select data-set="voiceURI" id="voice-select">${voiceOptions()}</select></label>
    <div class="voice-info" id="audio-diag">${audioDiag()}</div>
    <div class="set-actions">
      <button class="gbtn blue sm" data-act="test-sound">${SPEAKER_SVG}<span>TEST SOUND</span></button>
      <button class="gbtn teal sm" data-act="test-sfx"><span>TEST EFFECTS</span></button>
    </div>
    <div class="set-actions">
      <button class="gbtn orange sm" data-act="go" data-to="setup">CHANGE RANGER / PHASE</button>
      <button class="gbtn red sm" data-act="reset-ask">RESET PROGRESS</button>
    </div>
    ${S.phase ? `<p class="small">Current: ${rangerName()} · Phase ${S.phase} (${P().title})</p>` : ''}`, 'settings-modal');
}
modalRoot.addEventListener('change', e => {
  const k = e.target.dataset.set; if (!k) return;
  const v = e.target.type === 'checkbox' ? e.target.checked : e.target.tagName === 'SELECT' ? e.target.value : e.target.type === 'radio' ? (k === 'rate' ? +e.target.value : e.target.value) : +e.target.value;
  S.settings[k] = v; save();
  if (k === 'motion') applyMotion();
  if (k === 'voiceURI') { Voice.bad.clear(); Voice.works = null; Voice.misses = 0; Voice.choose(); say('Hello! I am your ranger guide.'); }
  if (k === 'volume' && Snd.master) Snd.master.gain.value = v;
  if (['sound', 'ambience'].includes(k)) refreshAmbience();
  if (k === 'sound' || k === 'voice') { if (!v) Voice.stop(); refreshSoundButtons(); }
  if (k === 'sfx' && v) Snd.play('tap');
  refreshDiag();
});
modalRoot.addEventListener('input', e => { if (e.target.dataset.set === 'volume') { S.settings.volume = +e.target.value; if (Snd.master) Snd.master.gain.value = S.settings.volume; } });
function voiceOptions() {
  const list = Voice.ranked();
  if (!list.length) return `<option value="">${Voice.ok ? 'Device default (voices still loading)' : 'Not available in this browser'}</option>`;
  return `<option value="">Automatic (best available)${Voice.voice && !S.settings.voiceURI ? ' — ' + esc(Voice.voice.name) : ''}</option>` +
    list.map(v => `<option value="${esc(v.voiceURI)}" ${S.settings.voiceURI === v.voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang.replace('_', '-'))})</option>`).join('');
}
function audioDiag() {
  return `<p><b>Voice (speech):</b> ${esc(Voice.status())}</p>
    <p><b>Sound effects:</b> ${S.settings.sound && S.settings.sfx ? 'on' : 'off'} · audio engine ${esc(Snd.state())}</p>
    ${S.settings.sound ? '' : '<p class="warn">All sound is OFF. Turn on <b>All sound</b> above.</p>'}`;
}
function refreshDiag() { const d = $('#audio-diag'); if (d) d.innerHTML = audioDiag(); }
async function testSound() {
  if (!S.settings.sound || !S.settings.voice) { toast('Turn on <b>All sound</b> and <b>Voice</b> first.', 2200); return; }
  if (!Voice.ok) { toast('This browser does not support speech. Words are shown as text.', 3000); caption('Hello, Junior Ranger! Welcome to Alphabet Animal Rescue!'); return; }
  Voice.works = null; Voice.misses = 0; Voice.unlock();   // give the voice a fresh chance
  const lines = ['Hello, Junior Ranger! Welcome to Alphabet Animal Rescue!', 'Elephant.', 'Giraffe.', 'Tiger.', 'Penguin.'];
  for (const t of lines) {
    const ok = await say(t);
    if (!ok) { if (!Voice.works && S.settings.sound && S.settings.voice) { Voice.works = false; speechBroken(); } break; }
    refreshDiag(); await wait(250);
  }
  refreshDiag();
}
function testSfx() {
  if (!S.settings.sound || !S.settings.sfx) { toast('Turn on <b>All sound</b> and <b>Sound effects</b> first.', 2200); return; }
  Snd.unlock();
  ['tap', 'correct', 'wrong', 'rescue'].forEach((n, i) => setTimeout(() => { Snd.play(n); refreshDiag(); }, i * 700));
}
function refreshAmbience() {
  const kind = (current === 'world' || current === 'mission') ? A.WORLDS[lastWorld].id : null;
  Snd.stopAmbience(); if (kind) Snd.startAmbience(kind);
}
function refreshSoundButtons() {
  $$('.imgbtn.snd').forEach(b => { b.classList.toggle('muted', !S.settings.sound); b.setAttribute('aria-pressed', S.settings.sound); b.setAttribute('aria-label', 'Sound ' + (S.settings.sound ? 'on' : 'off')); });
  $$('.sndtxt').forEach(b => { b.classList.toggle('teal', S.settings.sound); b.classList.toggle('grey', !S.settings.sound); b.lastChild.textContent = 'SOUND ' + (S.settings.sound ? 'ON' : 'OFF'); b.setAttribute('aria-pressed', S.settings.sound); });
}

function screenFinal() {
  S.masterSeen = true; save();
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  show(`${topbar({ back: 'map', backLabel: 'Map', title: '<h2>MASTER WILDLIFE RANGER</h2>' })}
    <div class="wrap final">
      <div class="cert">
        ${img('rewards/crown.png', '', 'cert-crown')}
        <p class="cert-small">ENGLISH YO! · Alphabet Animal Rescue!</p>
        <h3>MASTER WILDLIFE RANGER</h3>
        <div class="cert-r">${img(rangerImg(S.ranger), rangerName())}${img('ui/achievement.png', 'Trophy', 'cert-trophy')}</div>
        <p class="cert-name">${esc(S.name || rangerName())}</p>
        <p>rescued all <b>26 animal friends</b> from A to Z!</p>
        <p class="cert-stats">${img('ui/star.png', '')} ${totalStars()} stars · ${img('ui/coin.png', '')} ${S.coins} paw coins · Phase ${S.phase}</p>
        <div class="cert-badges">${A.WORLDS.map(w => img(w.badge, w.name)).join('')}</div>
        <p class="cert-date">${date}</p>
      </div>
      <div class="rw-actions">
        <button class="gbtn blue" data-act="go" data-to="book">${img('rewards/book.png', '', 'bi')}MY ANIMAL BOOK</button>
        <button class="gbtn orange" data-act="print">PRINT CERTIFICATE</button>
        <button class="gbtn green" data-act="go" data-to="map">${img('ui/map.png', '', 'bi')}WORLD MAP</button>
      </div>
    </div>`, 'final-screen');
  Snd.play('world'); FX.confetti(220);
  sayLater('Congratulations! You are a Master Wildlife Ranger!', 600);
}

/* ───────────────────────── ACTIONS ───────────────────────── */
function ACT_ROUND(name, b) { if (!M || M.busy || M.finished) return; ACT_ROUND[name](b); }
const ACT = {
  'go': d => { Snd.play('tap'); go(d.to); },
  'continue': () => { Snd.play('tap'); go('map'); },
  'help': () => { Snd.play('tap'); helpModal(); },
  'about': () => { Snd.play('tap'); aboutModal(); },
  'settings': () => { Snd.play('tap'); settingsModal(); },
  'modal-close': () => { Snd.play('tap'); closeModal(); },
  'modal-close-back': (d, b, e) => { if (e.target === b) closeModal(); },
  'toggle-sound': () => {
    S.settings.sound = !S.settings.sound; save();
    if (!S.settings.sound) Voice.stop(); else Snd.play('tap');
    refreshSoundButtons(); refreshAmbience(); refreshDiag();
    toast(S.settings.sound ? 'Sound is ON' : 'Sound is OFF', 1400);
  },
  'pick-ranger': d => {
    setupDraft.ranger = d.v; Snd.play('pick');
    $$('.ranger-card').forEach(c => { const on = c.dataset.v === d.v; c.classList.toggle('sel', on); c.setAttribute('aria-pressed', on); });
    say(`Hello! I am ${RANGERS[d.v]}.`);
  },
  'pick-phase': d => {
    setupDraft.phase = d.v; Snd.play('pick');
    $$('.phase-card').forEach(c => { const on = c.dataset.v === d.v; c.classList.toggle('sel', on); c.setAttribute('aria-pressed', on); });
  },
  'setup-done': () => {
    const msg = $('#setup-msg');
    if (!setupDraft.ranger) { msg.textContent = 'Please choose your ranger first.'; Snd.play('wrong'); return; }
    if (!setupDraft.phase) { msg.textContent = 'Please choose Phase B or Phase C.'; Snd.play('wrong'); return; }
    S.ranger = setupDraft.ranger; S.phase = setupDraft.phase; S.name = (setupDraft.name || '').trim(); save();
    Snd.play('unlock'); go('map');
    say(`Welcome, ${S.name || RANGERS[S.ranger]}! Let's rescue the animals!`);
  },
  'open-world': d => { Snd.play('tap'); go('world', +d.w); },
  'locked-world': d => { Snd.play('wrong'); const w = +d.w; toast(`${LOCK_SVG.replace('<svg', '<svg class="ti"')} Win the Boss Rescue in <b>${A.WORLDS[w - 1].name}</b> to open <b>${A.WORLDS[w].name}</b>.`); },
  'locked-boss': () => { Snd.play('wrong'); toast('Finish all the other missions in this world to open the Boss Rescue!'); },
  'start-mission': d => { Snd.play('tap'); startMission(d.id); },
  'leave-mission': () => {
    if (!M || M.finished) { go('world', lastWorld); return; }
    modal(`<h2>Leave this mission?</h2><p>Your stars for this mission will not be saved yet.</p>
      <div class="set-actions"><button class="gbtn green" data-act="modal-close" autofocus>KEEP PLAYING</button>
      <button class="gbtn orange" data-act="leave-yes">BACK TO WORLD</button></div>`, 'confirm-modal');
  },
  'leave-yes': () => { closeModal(true); M = null; go('world', lastWorld); },
  'replay': () => { const r = M && M.rounds[M.idx]; if (r && r.say && !M.finished) { if (!S.settings.sound || !S.settings.voice) toast('Sound is off. Tap the speaker button to turn it on.', 2000); r.say(); } },
  'say': d => { if (!S.settings.sound || !S.settings.voice) toast('Sound is off. Tap the speaker button to turn it on.', 2000); say(d.t); },
  'listen': () => { const r = M && M.rounds[M.idx]; if (r && !M.finished) { if (!S.settings.sound || !S.settings.voice) toast('Sound is off. Tap the speaker button to turn it on.', 2000); (r.listen || r.say)(); } },
  'test-sound': () => testSound(),
  'test-sfx': () => testSfx(),
  'find-pick': (d, b) => ACT_ROUND('find', b),
  'echo-pick': (d, b) => ACT_ROUND('echo', b),
  'who-pick': (d, b) => ACT_ROUND('who', b),
  'first-pick': (d, b) => ACT_ROUND('first', b),
  'order-pick': (d, b) => ACT_ROUND('order', b),
  'ans-pick': (d, b) => ACT_ROUND('ans', b),
  'x-pick': (d, b) => ACT_ROUND('x', b),
  'pos-pick': (d, b) => ACT_ROUND('pos', b),
  'sp-undo': () => { const r = M && M.rounds[M.idx]; if (!r || M.busy) return; for (let k = r.hist.length - 1; k >= 0; k--) { const t = r.tiles[r.hist[k]]; if (t.slot >= 0 && !r.locked[t.slot]) { spRemove(t.slot); return; } } },
  'sp-reset': () => { const r = M && M.rounds[M.idx]; if (!r || M.busy) return; r.slots.forEach((id, i) => { if (id != null && !r.locked[i]) { r.tiles[id].slot = -1; r.slots[i] = null; } }); r.hist = []; Snd.play('tap'); spRender(); },
  'sp-hint': () => spHint(),
  'sp-check': () => spCheck(),
  'book-filter': d => { bookFilter = d.v; Snd.play('tap'); screenBook(); },
  'book-card': d => bookCard(d.l),
  'reset-ask': () => modal(`<h2>Reset all progress?</h2><p>This deletes every rescued animal, star, coin and badge on this device. This cannot be undone.</p>
    <div class="set-actions"><button class="gbtn green" data-act="settings" autofocus>NO, KEEP IT</button><button class="gbtn red" data-act="reset-yes">YES, RESET</button></div>`, 'confirm-modal'),
  'reset-yes': () => {
    const keep = S.settings; S = DEF(); S.settings = keep;
    try { localStorage.removeItem(KEY); } catch (e) {}
    save(); closeModal(true); M = null; toast('Progress reset. A new adventure begins!'); go('home');
  },
  'print': () => window.print()
};
function onAct(e) {
  const b = e.target.closest('[data-act]');
  if (!b || b.disabled) return;
  const fn = ACT[b.dataset.act]; if (!fn) return;
  fn(b.dataset, b, e);
}
app.addEventListener('click', onAct);
modalRoot.addEventListener('click', onAct);
document.body.addEventListener('click', e => { if (e.target.closest('.toast')) e.target.closest('.toast').remove(); });

/* Spelling slots: tap a filled slot to send the letter back. */
app.addEventListener('click', e => {
  const s = e.target.closest('#slots .slot');
  if (s && M && !M.busy) spRemove(+s.dataset.i);
});

/* Keyboard support */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalRoot.innerHTML) { closeModal(); return; }
  if (e.key === 'Tab' && modalRoot.innerHTML) {   // keep keyboard focus inside the open popup
    const f = $$('.modal button, .modal a[href], .modal input, .modal select, .modal summary', modalRoot).filter(el => !el.disabled && el.offsetParent !== null);
    if (f.length) {
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (i === -1 || i === f.length - 1)) { e.preventDefault(); f[0].focus(); }
    }
    return;
  }
  if (modalRoot.innerHTML || !M || current !== 'mission' || M.finished || e.target.tagName === 'INPUT') return;
  const r = M.rounds[M.idx];
  if (r.type === 'spell') {
    if (/^[a-z]$/i.test(e.key)) { const t = r.tiles.find(t => t.slot < 0 && t.ch === e.key.toUpperCase()); if (t) spPlace(t.id); }
    else if (e.key === 'Backspace') { e.preventDefault(); ACT['sp-undo'](); }
    else if (e.key === 'Enter' && !e.target.closest('button')) spCheck();
    return;
  }
  if (/^[1-6]$/.test(e.key)) { const opts = $$('#stage .choices > button:not(:disabled)'); const b = opts[+e.key - 1]; if (b) b.click(); }
  if (e.key === ' ' && !e.target.closest('button')) { e.preventDefault(); ACT.replay(); }
});

/* Browsers only allow audio after a real user gesture. Every tap/click/key
   re-unlocks Web Audio (iOS can suspend it again) and the first one unlocks speech. */
let welcomed = false;
function unlockAudio(e) {
  if (e.type === 'keydown' && (e.repeat || ['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key))) return;
  Snd.unlock();
  Voice.unlock();
  if (!welcomed) { welcomed = true; if (current === 'home') Snd.play('welcome'); }
}
['pointerdown', 'touchend', 'click', 'keydown'].forEach(t => document.addEventListener(t, unlockAudio, { capture: true, passive: true }));
document.addEventListener('visibilitychange', () => { if (document.hidden) { Voice.stop(); Snd.stopAmbience(); } else refreshAmbience(); });

/* Boot */
Voice.init();
applyMotion();
if (window.matchMedia) try { matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', applyMotion); } catch (e) {}
go('home');
/* Preload every image from the manifest so the game can keep running offline. */
setTimeout(() => {
  const all = Object.values(A.ASSET_MANIFEST || {}).flat();
  let i = 0;
  const next = () => { if (i >= all.length) return; const im = new Image(); im.onload = im.onerror = next; im.src = ASSET + all[i++]; };
  for (let k = 0; k < 4; k++) next();
}, 800);
window.AAR_DEBUG = { get S() { return S; }, get M() { return M; }, go, startMission, finishMission, Snd, Voice };
})();
