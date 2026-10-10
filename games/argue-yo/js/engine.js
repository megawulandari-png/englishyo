/* ARGUE YO! — engine: utilities, storage/progress, audio, drag helper, effects. */
(function (root) {
  var A = root.ARGUE = root.ARGUE || {};

  /* ============ utilities ============ */
  var U = A.util = {
    $: function (s, r) { return (r || document).querySelector(s); },
    $$: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    shuffle: function (arr) { var a = arr.slice(), i, j, t; for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } return a; },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    clamp: function (n, a, b) { return Math.max(a, Math.min(b, n)); },
    sleep: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
    reduced: function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); },
    html: function (s) { var t = document.createElement('template'); t.innerHTML = s.trim(); return t.content.firstElementChild; },
    stars: function (n, max) { max = max || 3; var s = ''; for (var i = 0; i < max; i++) s += i < n ? '★' : '☆'; return s; },
    /* live-region announcement for screen readers */
    say: function (msg) { var l = document.getElementById('sr-live'); if (l) { l.textContent = ''; setTimeout(function () { l.textContent = msg; }, 30); } },

    /* fly a small chip from one element to another (card -> Text Builder). Always resolves. */
    fly: function (fromEl, toEl, text, cls) {
      return new Promise(function (resolve) {
        if (!fromEl || !toEl || U.reduced()) return resolve();
        var a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
        if (!a.width || !b.width) return resolve();
        var g = document.createElement('div');
        g.className = 'fly ' + (cls || '');
        g.textContent = (text || '').length > 46 ? text.slice(0, 44) + '…' : (text || '');
        g.style.left = a.left + 'px'; g.style.top = a.top + 'px'; g.style.width = Math.min(a.width, 280) + 'px';
        document.body.appendChild(g);
        var dx = b.left + 12 - a.left, dy = b.top + Math.min(b.height / 2, 24) - a.top;
        var done = false;
        function end() { if (done) return; done = true; g.remove(); resolve(); }
        requestAnimationFrame(function () {
          g.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(.45)'; g.style.opacity = '.15';
        });
        g.addEventListener('transitionend', end);
        setTimeout(end, 700);
      });
    },

    confetti: function (n) {
      if (U.reduced()) return;
      var host = document.createElement('div'); host.className = 'confetti'; host.setAttribute('aria-hidden', 'true');
      var cols = ['#ffd23a', '#2f7fe8', '#ff5d8f', '#2fb44f', '#8a4fe0', '#ff9d1c'];
      n = n || 46;
      for (var i = 0; i < n; i++) {
        var p = document.createElement('i');
        p.style.left = Math.random() * 100 + '%';
        p.style.background = cols[i % cols.length];
        p.style.animationDelay = (Math.random() * .5) + 's';
        p.style.animationDuration = (1.3 + Math.random() * 1.1) + 's';
        p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
        p.style.width = (6 + Math.random() * 7) + 'px'; p.style.height = (9 + Math.random() * 8) + 'px';
        host.appendChild(p);
      }
      document.body.appendChild(host);
      setTimeout(function () { host.remove(); }, 2900);
    },

    /* Pointer-based drag & drop. Mouse/pen: drag the whole card. Touch: drag by the ".grip" handle only
       (so the page can still scroll) — and every drag target also has a tap alternative in the UI. */
    dragify: function (el, opts) {
      el.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (e.pointerType === 'touch' && !e.target.closest('.grip')) return;
        if (el.disabled || el.classList.contains('is-locked')) return;
        var sx = e.clientX, sy = e.clientY, dragging = false, ghost = null, over = null, offX = 0, offY = 0;
        function targetAt(x, y) {
          var t = document.elementFromPoint(x, y);
          t = t && t.closest ? t.closest('.drop') : null;
          return t && !t.classList.contains('is-full') && !t.disabled ? t : null;
        }
        function move(ev) {
          if (ev.pointerId !== e.pointerId) return;
          if (!dragging) {
            if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
            dragging = true;
            var r = el.getBoundingClientRect(); offX = sx - r.left; offY = sy - r.top;
            ghost = el.cloneNode(true); ghost.classList.add('drag-ghost'); ghost.removeAttribute('id');
            ghost.style.width = r.width + 'px'; ghost.style.left = '0'; ghost.style.top = '0';
            document.body.appendChild(ghost); el.classList.add('is-dragging');
            document.body.classList.add('is-dragging-now');
            if (opts.onStart) opts.onStart(el);
          }
          ev.preventDefault();
          ghost.style.transform = 'translate(' + (ev.clientX - offX) + 'px,' + (ev.clientY - offY) + 'px) rotate(-2deg)';
          ghost.style.pointerEvents = 'none';
          var t = targetAt(ev.clientX, ev.clientY);
          if (t !== over) { if (over) over.classList.remove('is-over'); over = t; if (over) over.classList.add('is-over'); }
        }
        function up(ev) {
          if (ev.pointerId !== e.pointerId) return;
          window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
          if (!dragging) return;
          if (ghost) ghost.remove();
          el.classList.remove('is-dragging'); document.body.classList.remove('is-dragging-now');
          U.$$('.drop.is-over').forEach(function (d) { d.classList.remove('is-over'); });
          el._suppressClick = true; setTimeout(function () { el._suppressClick = false; }, 0);
          if (opts.onEnd) opts.onEnd(el);
          if (over && ev.type === 'pointerup') opts.onDrop(over, el);
        }
        window.addEventListener('pointermove', move, { passive: false });
        window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      });
      el.addEventListener('click', function (e) { if (el._suppressClick) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    }
  };

  /* ============ storage + progress ============ */
  var KEY = 'argueyo.v1';
  function defaults() {
    return { v: 1, name: '', xp: 0, plays: 0, cases: {}, badges: {},
      reflection: null, cert: null, certId: '', welcome: { heard: false, at: '' },
      set: { sfx: true, music: false, voice: true, big: false, teacher: false, hints: true, slow: false } };
  }
  var S = A.store = {
    d: defaults(),
    load: function () {
      try {
        var raw = localStorage.getItem(KEY);
        if (raw) { var p = JSON.parse(raw); var d = defaults(); S.d = Object.assign(d, p); S.d.set = Object.assign(d.set, p.set || {}); }
      } catch (e) { S.d = defaults(); }
    },
    save: function () { try { localStorage.setItem(KEY, JSON.stringify(S.d)); } catch (e) { /* private mode: keep playing without saving */ } },
    /* removes game progress, scores, reflection, certificate and completion code. Keeps the student name, audio/display settings and the welcome flag. */
    reset: function () { var n = S.d.name, s = S.d.set, w = S.d.welcome; S.d = defaults(); S.d.name = n; S.d.set = s; S.d.welcome = w; S.save(); },
    cs: function (id) { var c = S.d.cases[id]; if (!c) c = S.d.cases[id] = { lv: {}, closed: false }; return c; },
    addXp: function (n) { S.d.xp += n; S.save(); }
  };

  var P = A.prog = {
    levelDone: function (id, n) { var c = S.d.cases[id]; return !!(c && c.lv[n] && c.lv[n].done); },
    levelsDone: function (id) { var k = 0; for (var n = 1; n <= 5; n++) if (P.levelDone(id, n)) k++; return k; },
    percent: function (id) { return P.levelsDone(id) * 20; },
    closed: function (id) { return P.levelDone(id, 5); },
    caseUnlocked: function (idx) {
      if (S.d.set.teacher || idx === 0) return true;
      return P.closed(A.ARGUE_CASES_SORTED[idx - 1].id);
    },
    levelUnlocked: function (idx, n) {
      if (S.d.set.teacher) return true;
      if (!P.caseUnlocked(idx)) return false;
      return n === 1 || P.levelDone(A.ARGUE_CASES_SORTED[idx].id, n - 1);
    },
    /* sum of first-try accuracy per category across the best result of each level */
    cats: function (id) {
      var out = {}, c = S.d.cases[id];
      A.CATS.forEach(function (k) { out[k.key] = [0, 0]; });
      if (!c) return out;
      for (var n = 1; n <= 5; n++) {
        var r = c.lv[n]; if (!r || !r.cats) continue;
        A.CATS.forEach(function (k) { var v = r.cats[k.key]; if (v) { out[k.key][0] += v[0]; out[k.key][1] += v[1]; } });
      }
      return out;
    },
    acc: function (v) { return v[1] ? v[0] / v[1] : 0; },
    catStars: function (v) { return v[1] ? U.clamp(Math.round(v[0] / v[1] * 5), 1, 5) : 0; },
    power: function (id) {
      var cats = P.cats(id), sum = 0, n = 0;
      A.CATS.forEach(function (k) { if (cats[k.key][1]) { sum += P.acc(cats[k.key]); n++; } });
      return n ? Math.round(sum / n * 100) : 0;
    },
    rank: function (power) { var r = A.RANKS[0]; A.RANKS.forEach(function (x) { if (power >= x.min) r = x; }); return r.name; },
    caseStars: function (id) { if (!P.closed(id)) return 0; var p = P.power(id); return p >= 85 ? 3 : p >= 65 ? 2 : 1; },
    levelStars: function (c, t) { var a = t ? c / t : 0; return a >= .9 ? 3 : a >= .7 ? 2 : 1; },
    /* Overall results across every COMPLETED case: category accuracy = all first-try correct / all first-try attempts. */
    overallCats: function () {
      var out = {}; A.CATS.forEach(function (k) { out[k.key] = [0, 0]; });
      (A.ARGUE_CASES_SORTED || []).forEach(function (c) {
        if (!P.closed(c.id)) return; var v = P.cats(c.id);
        A.CATS.forEach(function (k) { out[k.key][0] += v[k.key][0]; out[k.key][1] += v[k.key][1]; });
      });
      return out;
    },
    overall: function () {
      var raw = P.overallCats(), cats = {}, sum = 0, n = 0;
      A.CATS.forEach(function (k) { var v = raw[k.key]; cats[k.key] = v[1] ? Math.round(v[0] / v[1] * 100) : 0; if (v[1]) { sum += cats[k.key]; n++; } });
      return { cats: cats, power: n ? Math.round(sum / n) : 0, cases: P.casesClosed() };
    },
    overallPower: function () { return P.overall().power; },
    casesClosed: function () { return (A.ARGUE_CASES_SORTED || []).filter(function (c) { return P.closed(c.id); }).length; },
    /* store a finished level; keeps the better attempt. Returns {newBadge, stars, first} */
    saveLevel: function (id, n, res) {
      var c = S.cs(id), prev = c.lv[n], first = !prev || !prev.done;
      var stars = P.levelStars(res.c, res.t);
      var better = !prev || !prev.done || (res.t ? res.c / res.t : 0) >= (prev.t ? prev.c / prev.t : 0);
      if (better) c.lv[n] = { done: true, c: res.c, t: res.t, stars: stars, cats: res.cats };
      else if (prev) { prev.stars = Math.max(prev.stars, stars); }
      var bk = 'b' + n, newBadge = !S.d.badges[bk];
      S.d.badges[bk] = true;
      if (n === 5) { c.closed = true; }
      S.save();
      return { newBadge: newBadge, stars: stars, first: first };
    }
  };


  /* ============ reflection + certificate ============ */
  function fnv(str) { var h = 0x811c9dc5, i; for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; } return ('00000000' + h.toString(16)).slice(-8); }
  function sigOf(c) { return fnv('ARGUEYO|1|' + [c.name, c.power, JSON.stringify(c.cats), c.cases, c.rank, c.dateISO, c.code, c.id, JSON.stringify(c.reflection)].join('|')); }
  P.certSig = sigOf;
  P.dateText = function (d) { try { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return d.toDateString(); } };
  P.makeCode = function (cases, power, id) {
    var pp = power >= 100 ? '100' : ('0' + power).slice(-2);
    return 'AY-' + cases + 'C-' + pp + '-' + id;
  };
  P.newCertId = function () { var cs = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', o = '', i; for (i = 0; i < 4; i++) o += cs.charAt(Math.floor(Math.random() * cs.length)); return o; };
  /* ONE clear rule: all required cases genuinely completed (every level + the final reading) AND the reflection submitted. No minimum score. */
  P.canUnlockCertificate = function () {
    var req = A.CERT.requiredCases, done = P.casesClosed(), hasRef = !!(S.d.reflection && S.d.reflection.remember), missing = [];
    if (done < req) missing.push('Complete ' + (req - done) + ' more case' + (req - done === 1 ? '' : 's') + ' (' + done + ' of ' + req + ' done).');
    if (!hasRef) missing.push('Write and submit MY REFLECTION.');
    return { ok: done >= req && hasRef, casesDone: done, required: req, casesReady: done >= req, hasReflection: hasRef, missing: missing };
  };
  P.saveReflection = function (r) { S.d.reflection = { learned: r.learned, hardest: r.hardest, confidence: r.confidence, remember: r.remember, at: new Date().toISOString() }; S.save(); };
  P.buildCertificate = function () {
    var o = P.overall(), now = new Date(), id = S.d.certId || (S.d.certId = P.newCertId());
    var c = { v: 1, name: S.d.name, power: o.power, cats: o.cats, cases: o.cases, required: A.CERT.requiredCases, rank: P.rank(o.power),
      dateISO: now.toISOString(), dateText: P.dateText(now), id: id, code: P.makeCode(o.cases, o.power, id), reflection: JSON.parse(JSON.stringify(S.d.reflection)) };
    c.sig = sigOf(c); return c;
  };
  /* creates (first time) or replaces (after the student confirmed) the stored certificate */
  P.issueCertificate = function () {
    if (!P.canUnlockCertificate().ok) return null;
    S.d.cert = P.buildCertificate(); S.save(); return S.d.cert;
  };
  P.certValid = function () { var c = S.d.cert; return !!(c && c.sig && c.sig === sigOf(c)); };
  P.hasCertificate = function () { return !!S.d.cert; };
  /* a better result than the saved certificate (never replaced silently) */
  P.certUpdateAvailable = function () {
    if (!P.certValid() || !P.canUnlockCertificate().ok) return null;
    var o = P.overall(), c = S.d.cert;
    return (o.power > c.power || o.cases > c.cases) ? { power: o.power, cases: o.cases, cats: o.cats, rank: P.rank(o.power) } : null;
  };

  /* ============ audio (WebAudio synth + speech; nothing autoplays loudly) ============ */
  var ac = null, musicTimer = null, musicStep = 0, master = null, musicBus = null;
  function ensure() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!ac && AC) {
      try {
        ac = new AC(); master = ac.createGain(); master.gain.value = 1; master.connect(ac.destination);
        musicBus = ac.createGain(); musicBus.gain.value = .55; musicBus.connect(ac.destination);
      } catch (e) { ac = null; }
    }
    if (ac && ac.state === 'suspended') { try { ac.resume(); } catch (e) { } }
    return ac;
  }
  function tone(f, t0, d, type, vol, dest) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    var t = ac.currentTime + t0;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .12, t + .015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + d + .03);
  }
  /* short sounds only: never longer than ~0.8 s */
  var SFX = {
    click:   [[620, 0, .06, 'triangle', .09]],
    open:    [[392, 0, .08, 'triangle', .09], [523, .08, .08, 'triangle', .09], [659, .16, .14, 'triangle', .09]],
    correct: [[523, 0, .09, 'triangle'], [659, .09, .09, 'triangle'], [784, .18, .18, 'triangle']],
    wrong:   [[260, 0, .13, 'sine', .1], [196, .12, .2, 'sine', .1]],
    collect: [[880, 0, .07, 'triangle'], [1175, .07, .12, 'triangle']],
    place:   [[440, 0, .06, 'triangle', .09], [587, .06, .1, 'triangle', .09]],
    badge:   [[523, 0, .1], [659, .1, .1], [784, .2, .1], [1047, .3, .1], [784, .4, .08], [1047, .48, .3]],
    complete:[[523, 0, .12], [659, .12, .12], [784, .24, .12], [1047, .36, .14], [1319, .5, .35]],
    stamp:   [[110, 0, .12, 'square', .12], [82, .02, .2, 'square', .1]],
    cert:    [[659, 0, .1], [784, .1, .1], [988, .2, .1], [1319, .3, .12], [1568, .42, .4]],
    start:   [[523, 0, .08, 'triangle', .1], [784, .08, .14, 'triangle', .1]]
  };
  var sp = { token: 0, chunks: [], idx: 0, state: 'idle', onEnd: null, onState: null };
  function setSpState(st) { sp.state = st; AU.speaking = st === 'playing'; AU.paused = st === 'paused'; if (sp.onState) sp.onState(st); }
  function splitSentences(t) { var m = String(t).replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]+["”’]?|[^.!?]+$/g) || []; return m.map(function (x) { return x.trim(); }).filter(Boolean); }
  var AU = A.audio = {
    speaking: false, paused: false, file: null,
    unlock: function () { ensure(); },
    /* master sound switch (topbar speaker): when OFF nothing plays — effects, voice, welcome, music */
    isOn: function () { return !!S.d.set.sfx; },
    sfx: function (name) {
      if (!S.d.set.sfx || !ensure()) return;
      (SFX[name] || []).forEach(function (n) { tone(n[0], n[1], n[2], n[3], n[4]); });
    },
    /* subtle background music: only when SOUND is on AND MUSIC is on; ducks (goes silent) while a voice is speaking */
    music: function (on) {
      if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
      if (!on || !S.d.set.sfx || !ensure()) return;
      var mel = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 880, 784, 659, 587];
      var bass = [131, 131, 175, 175, 196, 196, 131, 131];
      musicStep = 0;
      musicTimer = setInterval(function () {
        if (document.hidden || AU.speaking || AU.file) return;
        var i = musicStep++;
        tone(mel[i % mel.length], 0, .22, 'triangle', .03, musicBus);
        if (i % 2 === 0) tone(bass[(i / 2) % bass.length | 0], 0, .4, 'sine', .04, musicBus);
      }, 260);
    },
    /* call after the sound / music settings change */
    applyPrefs: function () {
      if (!S.d.set.sfx) { AU.stop(); AU.stopFile(); AU.music(false); } else AU.music(S.d.set.music);
      window.dispatchEvent(new CustomEvent('argue:sound'));
    },
    /* a recorded file (e.g. the ENGLISH YO! welcome). Returns the HTMLAudioElement. */
    playFile: function (url, h) {
      AU.stopFile(); h = h || {};
      var a = new Audio(url); a.preload = 'auto'; a.volume = 1; AU.file = a;
      a.addEventListener('ended', function () { if (AU.file === a) AU.file = null; if (h.onEnd) h.onEnd(); });
      a.addEventListener('error', function () { if (AU.file === a) AU.file = null; if (h.onError) h.onError(); });
      return a;
    },
    stopFile: function () { if (AU.file) { try { AU.file.pause(); } catch (e) { } AU.file = null; } },
    /* prefer a natural English voice (en-GB first); avoid novelty voices */
    pickVoice: function () {
      var vs = window.speechSynthesis ? window.speechSynthesis.getVoices() : [], best = null, bs = -1e9;
      var FEM = /female|woman|libby|sonia|maisie|hazel|kate|serena|susan|martha|fiona|moira|karen|samantha|zira|aria|jenny|emma|amy|joanna|salli|tessa|victoria|allison|ava|nicky|shelley|flo\b|sandy|kathy/i;
      var NOV = /grandma|grandpa|bad news|good news|bahh|bells|boing|bubbles|cellos|jester|organ|superstar|trinoids|whisper|wobble|zarvox|hysterical|deranged|bruce|princess|agnes/i;
      vs.forEach(function (v) {
        var lang = (v.lang || '').replace('_', '-'); if (!/^en/i.test(lang)) return;
        var sc = /^en-GB$/i.test(lang) ? 10 : /^en-US$/i.test(lang) ? 8 : 4;
        if (FEM.test(v.name || '')) sc += 3; if (NOV.test(v.name || '')) sc -= 30; if (v.localService) sc += 1; if (/natural|premium|enhanced/i.test(v.name || '')) sc += 2;
        if (sc > bs) { bs = sc; best = v; }
      });
      return bs < 0 ? null : best;
    },
    canSpeak: function () { return !!(window.speechSynthesis && window.SpeechSynthesisUtterance); },
    /* Why can the student NOT hear speech right now? null = ok */
    speechBlocked: function () {
      if (!AU.canSpeak()) return 'Read-aloud is not available in this browser.';
      if (!S.d.set.sfx) return 'Sound is OFF. Turn the speaker button on to listen.';
      if (!S.d.set.voice) return 'Read-aloud voice is OFF in Settings.';
      return null;
    },
    /* speak text sentence by sentence (long texts are not cut off). opts: {onEnd, onState, force} */
    speak: function (text, opts) {
      opts = opts || {}; if (typeof opts === 'function') opts = { onEnd: opts };
      if (!AU.canSpeak() || !S.d.set.sfx || (!S.d.set.voice && !opts.force)) { if (opts.onEnd) opts.onEnd(false); return false; }
      AU.stop();
      sp.token++; sp.chunks = splitSentences(text); sp.idx = 0; sp.onEnd = opts.onEnd || null; sp.onState = opts.onState || null;
      if (!sp.chunks.length) { if (opts.onEnd) opts.onEnd(false); return false; }
      setSpState('playing'); runChunk(sp.token); return true;
    },
    pause: function () { if (sp.state !== 'playing') return; sp.token++; try { window.speechSynthesis.cancel(); } catch (e) { } setSpState('paused'); },
    resume: function () { if (sp.state !== 'paused') return; sp.token++; setSpState('playing'); runChunk(sp.token); },
    stop: function () {
      sp.token++; if (AU.canSpeak()) { try { window.speechSynthesis.cancel(); } catch (e) { } }
      if (sp.state !== 'idle') { sp.idx = 0; setSpState('idle'); }
      sp.onEnd = null;
    },
    state: function () { return sp.state; }
  };
  function runChunk(tok) {
    if (tok !== sp.token) return;
    if (sp.idx >= sp.chunks.length) { var cb = sp.onEnd; sp.idx = 0; setSpState('idle'); if (cb) cb(true); return; }
    var u = new SpeechSynthesisUtterance(sp.chunks[sp.idx]);
    var v = AU.pickVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
    u.rate = S.d.set.slow ? .75 : .95; u.pitch = 1.03; u.volume = 1;
    var advanced = false;
    function next() { if (advanced || tok !== sp.token) return; advanced = true; sp.idx++; runChunk(tok); }
    u.onend = next; u.onerror = function (e) { if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; next(); };
    try { window.speechSynthesis.speak(u); } catch (e) { next(); }
    /* some browsers never fire onend for silent voices: do not hang */
    setTimeout(function () { if (!advanced && tok === sp.token && !window.speechSynthesis.speaking) next(); }, Math.max(2500, sp.chunks[sp.idx].length * 120));
  }
  if (window.speechSynthesis && window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener('voiceschanged', function () {});

  /* sorted cases helper (data files may load in any order) */
  A.initCases = function () { A.ARGUE_CASES_SORTED = (root.ARGUE_CASES || []).slice().sort(function (a, b) { return a.no - b.no; }); };
})(window);
