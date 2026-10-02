/* audio system: local MP3/WAV first, browser speech synthesis as fallback.
 * playNarration(id) · playWordAudio(word) · playInstructionAudio(id,{slow}) · stopAudio() · sfx(name) · music
 * Settings: Voice ON/OFF controls AUTOMATIC narration (opts.auto). A speaker / play button the learner taps always plays.
 * Sound effects follow the Sound effects toggle; music follows the Music toggle; everything follows Volume. */
(function () {
  const T = window.THRIVE;
  const cfg = () => T.audioConfig;
  const missing = new Set();                         // files that failed once are not requested again
  let current = null, token = 0, voice = null, ctx = null, musicGain = null, musicTimer = null;
  const keep = [];                                    // keep utterances alive (Safari GC bug)
  const set = () => T.store.get().sound;

  /* English voice choice. pref = a language such as 'en-GB' (preferred when installed); falls back to any good English voice. */
  const voiceCache = {};
  const NOVELTY = /bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|albert|fred|junior|ralph|hysterical|deranged|kathy|princess|agnes/i;
  function pickVoice(pref) {
    if (!('speechSynthesis' in window)) return null;
    const key = pref || 'any'; if (voiceCache[key]) return voiceCache[key];
    const all = speechSynthesis.getVoices().filter(v => !NOVELTY.test(v.name)); if (!all.length) return null;
    const local = all.filter(v => v.localService), vs = local.some(v => /^en/i.test(v.lang)) ? local : all;   // prefer voices installed on the device: network voices (Google …) can fail silently when blocked
    const norm = l => String(l).replace('_', '-').toLowerCase(), good = /samantha|google|karen|daniel|serena|kate|hazel|libby|sonia|female|natural/i;
    let v = pref && (vs.find(x => norm(x.lang) === norm(pref) && good.test(x.name)) || vs.find(x => norm(x.lang) === norm(pref)));
    v = v || vs.find(x => /^en[-_](US|GB|AU)/i.test(x.lang) && good.test(x.name)) || vs.find(x => /^en/i.test(x.lang)) || null;
    if (v) voiceCache[key] = v;
    return v;
  }
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => { Object.keys(voiceCache).forEach(k => delete voiceCache[k]); };

  /* speak one line. Chrome/Edge silently drop a speak() issued in the same moment as cancel(), so speaking starts after a tiny gap
   * (and a resume() un-sticks a paused engine). Some devices never fire "end": a length-based timeout keeps sequences moving. */
  /* Chrome loads its voice list asynchronously: on the very first tap getVoices() can be empty. Wait (briefly) for it. */
  function voicesReady() {
    return new Promise(res => {
      if (!('speechSynthesis' in window) || speechSynthesis.getVoices().length) return res();
      const t = setTimeout(res, 800);
      speechSynthesis.addEventListener('voiceschanged', () => { clearTimeout(t); res(); }, { once: true });
    });
  }
  function speak(text, rate, my, pref, onNoStart) {
    return new Promise(async res => {
      if (!('speechSynthesis' in window)) return res();
      await voicesReady();
      if (my !== undefined && my !== token) return res();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(pref); if (v) u.voice = v;
      u.lang = v ? v.lang : 'en-US'; u.rate = rate; u.pitch = 1; u.volume = set().volume;     // never request a language that has no installed voice
      let started = false; u.onstart = () => { started = true; };
      keep.push(u); if (keep.length > 6) keep.shift();
      let finished = false;
      const done = () => { if (finished) return; finished = true; clearTimeout(guard); res(); };
      const guard = setTimeout(() => { try { speechSynthesis.cancel(); } catch (e) {} done(); }, Math.max(3000, text.length * 95 / rate) + 1500);
      u.onend = u.onerror = done;
      setTimeout(() => {
        if (my !== undefined && my !== token) return done();              // stopped or replaced while waiting
        try { speechSynthesis.resume(); } catch (e) {}
        speechSynthesis.speak(u);
        if (onNoStart) setTimeout(() => { if (!started && !finished && my === token) onNoStart(); }, 2500);   // accepted but never started → tell the learner why
      }, 60);
    });
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* a new <audio> element for every play, so a clip can never inherit the previous playback rate or position */
  function playFile(src, rate, my) {
    return new Promise((resolve, reject) => {
      if (missing.has(src)) return reject(new Error('missing'));
      const a = new Audio(cfg().basePath + src); a.preload = 'auto'; a.volume = set().volume; a.preservesPitch = a.webkitPreservesPitch = true;
      const applyRate = () => { a.defaultPlaybackRate = rate; a.playbackRate = rate; };   // set early AND again once loaded (Safari resets it on load)
      applyRate(); a.addEventListener('loadedmetadata', applyRate); a.addEventListener('playing', applyRate);
      a.__done = resolve;                                   // lets stopAudio() release anyone waiting on this clip
      current = a;
      a.onended = () => resolve();
      a.onerror = () => { if (my === token) missing.add(src); reject(new Error('missing')); };
      a.play().catch(err => { if (my === token) reject(err); else resolve(); });
    });
  }

  /* one clip: the local file if it exists (src), otherwise speech synthesis of the same text. */
  async function playOne(entry, { slow = false, sentences = false } = {}, my) {
    if (!entry) return;
    if (entry.src) { try { await playFile(entry.src, slow ? cfg().slowFile : 1, my); return; } catch (e) { if (my !== token) return; } }
    const rate = slow ? cfg().slowSpeech : cfg().normalSpeech;
    const parts = sentences ? (entry.text.match(/[^.!?]+[.!?]*/g) || [entry.text]).map(s => s.trim()).filter(Boolean) : [entry.text];
    for (const p of parts) { if (my !== token) return; await speak(p, rate, my); if (sentences && my === token) await wait(slow ? cfg().gapMs * 1.6 : cfg().gapMs); }
  }

  /* ONE audio channel: every play first stops whatever is playing (file or speech) and cancels any older queued sequence,
   * then plays its clips in the order given. A newer play / stopAudio() changes `token`, so nothing older can continue or overlap. */
  async function play(entries, opts) {
    stopAudio(); const my = ++token;
    const list = (Array.isArray(entries) ? entries : [entries]).filter(Boolean);
    for (let i = 0; i < list.length; i++) {
      if (my !== token) return;
      await playOne(list[i], opts, my);
      if (i < list.length - 1 && my === token) await wait(cfg().clipGapMs);
    }
  }

  /* browser speech only: speak each line in turn with a pause between (used by the Glossary: word, then example sentence) */
  async function speakLines(lines, { rate = 0.95, pauseMs = 450, lang, onNoStart } = {}) {
    stopAudio(); const my = ++token; let warned = false;
    for (let i = 0; i < lines.length; i++) {
      if (my !== token) return;
      await speak(lines[i], rate, my, lang, i === 0 ? () => { if (!warned) { warned = true; onNoStart && onNoStart(); } } : undefined);
      if (i < lines.length - 1 && my === token) await wait(pauseMs);
    }
  }

  function stopAudio() {
    token++;
    if (current) { const a = current; current = null; try { a.pause(); a.currentTime = 0; } catch (e) {} if (a.__done) a.__done(); }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  /* ids: one clip id or an explicit list of clip ids */
  const entriesOf = ids => [].concat(ids).map(id => { const e = T.audioMap[id]; if (!e) throw new Error('THRIVE audio: unknown clip id "' + id + '"'); return e; });

  function ac() {
    if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, gain) {
    const c = ac(); if (!c) return; const o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.value = freq; o.connect(g); g.connect(c.destination);
    const t = c.currentTime + start; g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  }
  const SFX = {
    tap: [[660, 0, .08]], correct: [[523, 0, .12], [784, .1, .2]], wrong: [[260, 0, .18], [220, .12, .22]],
    pop: [[880, 0, .07]], win: [[523, 0, .14], [659, .13, .14], [784, .26, .14], [1046, .39, .35]], star: [[988, 0, .1], [1319, .09, .25]]
  };
  const CHORDS = [[261.6, 329.6, 392], [220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7]];
  let chordIdx = 0;
  function chord() {
    const c = ac(); if (!c || !musicGain) return;
    CHORDS[chordIdx++ % CHORDS.length].forEach(f => {
      const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(musicGain);
      const t = c.currentTime; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.33, t + 1.4); g.gain.linearRampToValueAtTime(0.0001, t + 4.2);
      o.start(t); o.stop(t + 4.3);
    });
  }
  function startMusic() {
    const c = ac(); if (!c || musicTimer) return;
    musicGain = c.createGain(); musicGain.gain.value = set().volume * 0.07; musicGain.connect(c.destination);
    chord(); musicTimer = setInterval(chord, 4000);
  }
  function stopMusic() { clearInterval(musicTimer); musicTimer = null; if (musicGain) { try { musicGain.disconnect(); } catch (e) {} musicGain = null; } }

  const blocked = opts => opts && opts.auto && !set().voice;   // automatic narration is off
  T.audio = {
    /* ids: a clip id or an explicit list, e.g. ['w1-intro', 'w1-observe'] — played in exactly that order */
    playNarration(ids, opts) { if (blocked(opts)) return Promise.resolve(); return play(entriesOf(ids), opts); },
    speechSupported: 'speechSynthesis' in window,
    /* Glossary: browser speech only (no MP3). Says the word, pauses, then the example sentence. en-GB voice preferred.
     * Returns false (and speaks nothing) when the Voice setting is OFF or the browser has no speech. */
    speakGlossaryWord(word, example) {
      if (!set().voice || !('speechSynthesis' in window)) return false;
      speakLines([word + '.', example], { rate: 0.95, pauseMs: 450, lang: 'en-GB',
        onNoStart: () => T.ui && T.ui.toast('Your browser did not speak. Check the device volume and the browser’s voice settings.') });
      return true;
    },
    playWordAudio(word) { return play(T.audioMap['word.' + word] || { src: null, text: word }); },
    /* listening-task audio: a tap always plays; automatic playback (opts.auto) follows the Voice setting */
    playInstructionAudio(ids, opts) { if (blocked(opts)) return Promise.resolve(); return play(entriesOf(ids), Object.assign({ sentences: true }, opts)); },
    textOf(ids) { return entriesOf(ids).map(e => e.text).join(' '); },
    /* text WRITTEN BY THE LEARNER (procedure cards): always browser speech synthesis, never a recording */
    speakLearnerText(text, opts) { return play({ src: null, text }, Object.assign({ sentences: true }, opts)); },
    speakText(text, opts) { return play({ text }, opts); },
    stopAudio,
    sfx(name) { if (!set().sfx) return; (SFX[name] || []).forEach(n => tone(n[0], n[1], n[2], set().volume * 0.18)); },
    applySettings() {
      if (set().music) startMusic(); else stopMusic();
      if (musicGain) musicGain.gain.value = set().volume * 0.07;
    },
    /* first tap: start music if enabled. (No speech "priming" utterance: a blank utterance never finishes in Chrome and blocks every later speak().) */
    unlock() { if (set().music) startMusic(); }
  };
})();
