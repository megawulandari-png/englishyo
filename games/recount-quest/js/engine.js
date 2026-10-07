/* RECOUNT QUEST — engine: utilities, storage, sound, modal, text-to-speech, visuals, story reader, quiz.
   The engine is generic. Every story feeds it its own data (see data.js and story-*.js). */
(function () {
  "use strict";
  var RQ = window.RQ;
  var U = (RQ.util = {});

  /* ---------------------------------------------------------- utilities */
  U.$ = function (s, r) { return (r || document).querySelector(s); };
  U.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  U.esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); };
  U.rich = function (s) { return U.esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>"); };
  U.shuffle = function (a) {
    var b = a.slice();
    for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; }
    return b;
  };
  U.say = function (m) { var l = document.getElementById("sr-live"); if (l) { l.textContent = ""; setTimeout(function () { l.textContent = m; }, 30); } };
  U.view = function (el) { try { el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) { /* ignore */ } };
  /* artwork helpers: img(key) returns an <img> from RQ.ui (decorative by default) */
  U.src = function (k) { return RQ.ui && RQ.ui[k] ? "img/" + RQ.ui[k] : ""; };
  U.img = function (k, cls, alt) { var p = U.src(k); return p ? '<img class="' + (cls || "ic") + '" src="' + p + '" alt="' + U.esc(alt || "") + '" decoding="async"' + (alt ? "" : ' aria-hidden="true"') + ">" : ""; };
  U.stepIc = function (st, cls) { return U.img(st.img, cls || "ic") || st.icon; };
  U.worldIc = function (w, cls) { return U.img("w-" + w.id, cls || "ic-w") || w.icon; };
  U.face = function (kind) {
    var ok = ["boy-happy", "girl-happy", "boy-laugh", "girl-laugh"], tr = ["boy-thinking", "girl-thinking"], a = kind === "ok" ? ok : tr;
    return '<img class="fb-face" src="img/avatars/' + a[Math.floor(Math.random() * a.length)] + '.png" alt="" aria-hidden="true" decoding="async">';
  };
  U.words = function (paras) { return paras.join(" ").split(/\s+/).length; };

  var TAGS = {
    explicit: ["magnifier", "Find the detail"], sequence: ["clock", "Sequence"], main: ["bulb", "Main idea"], cause: ["signpost", "Cause and effect"], feelings: ["chat", "Feelings"],
    inference: ["binoculars", "Inference"], evidence: ["checklist", "Evidence"], vocab: ["book", "Word in context"], reference: ["pin", "Reference"], signal: ["clock", "Sequence signal"],
    structure: ["pencil", "Text structure"], purpose: ["marker", "Writer’s purpose"], message: ["chat2", "Message"], visual: ["photo", "Reading the picture"], type: ["globe", "Type of recount"],
    compare: ["binoculars", "Compare texts"], tf: ["check", "True or false"], match: ["pencil", "Match"]
  };
  U.tag = function (t) { var x = TAGS[t]; return U.img(x ? x[0] : "bulb", "ic-tag") + " " + U.esc(x ? x[1] : t); };

  var HINTS = {
    explicit: "Go back to the text. The answer is written there. Try “Re-read the story”.",
    sequence: "Think about which event came first. Look for time words.",
    main: "The main idea covers the whole text, not just one paragraph.",
    cause: "Look for words such as because, so and after.",
    feelings: "Look for how the writer felt and the clues that show it.",
    inference: "The answer is not written directly. Which clues in the text point to it?",
    evidence: "Choose the sentence that really proves the idea, not only one that is on the same topic.",
    vocab: "Read the whole sentence again. Which other words help you?",
    reference: "Look at the words just before the pronoun. Who or what is it about?",
    signal: "Look for a word or phrase that tells you when something happened.",
    structure: "Think about the job of each part: Orientation sets the scene, Events tell what happened, Reorientation looks back.",
    purpose: "Ask: why did the writer write this? To tell, to explain, to persuade or to entertain?",
    message: "What lesson does the writer want the reader to remember?",
    visual: "Look carefully at the picture and match it with the text.",
    type: "Is it the writer’s own real experience, a real event about real people, or an imaginary adventure?"
  };

  /* ---------------------------------------------------------- sound (tiny WebAudio tones, only after a tap) */
  var ac = null;
  RQ.sfx = {
    on: true,
    _t: function (notes) {
      if (!RQ.sfx.on) return;
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        var t0 = ac.currentTime;
        notes.forEach(function (n, i) {
          var o = ac.createOscillator(), g = ac.createGain();
          o.type = "sine"; o.frequency.value = n; o.connect(g); g.connect(ac.destination);
          var s = t0 + i * 0.11;
          g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(0.07, s + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, s + 0.16);
          o.start(s); o.stop(s + 0.18);
        });
      } catch (e) { /* audio not available: game still works */ }
    },
    ok: function () { RQ.sfx._t([660, 880]); },
    bad: function () { RQ.sfx._t([300]); },
    win: function () { RQ.sfx._t([523, 659, 784, 1047]); },
    tap: function () { RQ.sfx._t([520]); }
  };

  /* ---------------------------------------------------------- storage (localStorage, safe fallback to memory) */
  var KEY = "ey_recount_quest_v2";
  var mem = null;
  function fresh() { return { v: 2, sound: true, eps: {}, master: { best: 0, done: false, runs: 0 } }; }
  RQ.store = {
    data: null,
    load: function () {
      var d = null;
      try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = mem; }
      if (!d || d.v !== 2) d = fresh();
      d.eps = d.eps || {}; d.master = d.master || { best: 0, done: false, runs: 0 };
      RQ.store.data = d; RQ.sfx.on = d.sound !== false;
      return d;
    },
    save: function () {
      mem = RQ.store.data;
      try { localStorage.setItem(KEY, JSON.stringify(RQ.store.data)); } catch (e) { /* private mode: memory only */ }
    },
    reset: function () { RQ.store.data = fresh(); RQ.sfx.on = true; RQ.store.save(); },
    ep: function (id) {
      var d = RQ.store.data;
      if (!d.eps[id]) d.eps[id] = { completed: false, stars: 0, steps: {}, acc: {} };
      return d.eps[id];
    }
  };

  /* ---------------------------------------------------------- modal */
  RQ.modal = function (o) {
    var root = document.getElementById("modal-root");
    var prev = document.activeElement;
    root.innerHTML = '<div class="modal-back" data-close></div><div class="modal" role="dialog" aria-modal="true" aria-label="' + U.esc(o.title) + '"><h2>' + U.esc(o.title) + '</h2><div class="modal-body">' + o.body + '</div><div class="modal-actions">' +
      (o.actions || [{ label: "Close", cls: "btn-pink" }]).map(function (a, i) { return '<button type="button" class="btn ' + (a.cls || "btn-ghost") + '" data-a="' + i + '">' + a.label + "</button>"; }).join("") + "</div></div>";
    root.classList.add("open");
    function close() { root.classList.remove("open"); root.innerHTML = ""; document.removeEventListener("keydown", key); if (prev && prev.focus) prev.focus(); }
    function key(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", key);
    root.onclick = function (e) {
      if (e.target.hasAttribute("data-close")) return close();
      var b = e.target.closest("[data-a]");
      if (b) { var a = (o.actions || [{}])[+b.dataset.a]; close(); if (a && a.fn) a.fn(); }
    };
    var f = root.querySelector("[data-a]"); if (f) f.focus();
  };
  RQ.peek = function (ep) {
    RQ.modal({ title: ep.title, body: '<div class="peek">' + ep.paras.map(function (p, i) { return '<p><span class="pn" aria-hidden="true">' + (i + 1) + "</span>" + U.esc(p) + "</p>"; }).join("") + "</div>" });
  };

  /* ---------------------------------------------------------- shared bits */
  function fb(kind, html) { return '<div class="fb fb-' + kind + '">' + U.face(kind) + '<div class="fb-txt">' + html + "</div></div>"; }
  function finish(box, label, cb) {
    var slot = box.querySelector(".fb-slot") || box;
    var b = document.createElement("button");
    b.className = "btn btn-pink next-btn"; b.type = "button"; b.innerHTML = label;
    b.addEventListener("click", function () { b.disabled = true; cb(); });
    slot.appendChild(b); U.view(b); b.focus({ preventScroll: true });
  }
  function head(cfg, extra) { return '<h3 class="g-title">' + U.esc(cfg.title) + '</h3><p class="g-prompt">' + U.esc(cfg.prompt || "") + "</p>" + (extra || ""); }

  var A = (RQ.act = {});

  /* ======================================================= TEXT-TO-SPEECH (browser SpeechSynthesis; no audio files) */
  var synth = ("speechSynthesis" in window) ? window.speechSynthesis : null;
  var T = (RQ.tts = { supported: !!(synth && window.SpeechSynthesisUtterance), hasEnglish: true });
  var st = { token: 0, state: "idle", queue: [], idx: 0, rate: 1, soft: false, ui: null };

  function spoken(t) {
    return t.replace(/R\.A\./g, "Raden Ajeng").replace(/B\.J\./g, "B J").replace(/Mr\./g, "Mister").replace(/Mrs\./g, "Missus").replace(/Ms\./g, "Ms")
      .replace(/a\.m\./g, "a m").replace(/p\.m\./g, "p m").replace(/→/g, " to ");
  }
  function sentences(t) {
    var out = [], last = 0, re = /[.!?]+["”’']*(?:\s+|$)/g, m;
    t = spoken(t);
    while ((m = re.exec(t))) { out.push(t.slice(last, m.index + m[0].length).trim()); last = m.index + m[0].length; }
    if (last < t.length) out.push(t.slice(last).trim());
    return out.filter(function (s) { return s; });
  }
  T.build = function (ep) {
    var q = [{ p: -1, text: ep.title }];
    ep.paras.forEach(function (p, i) { sentences(p).forEach(function (s) { q.push({ p: i, text: s }); }); });
    return q;
  };
  function voice() {
    if (!T.supported) return null;
    var vs = synth.getVoices() || [], pick = null, pref = ["en-GB", "en-US", "en-AU", "en-IN"];
    for (var i = 0; i < pref.length && !pick; i++) pick = vs.filter(function (v) { return v.lang && v.lang.replace("_", "-") === pref[i]; })[0] || null;
    if (!pick) pick = vs.filter(function (v) { return v.lang && /^en/i.test(v.lang); })[0] || null;
    T.hasEnglish = !vs.length || !!pick;
    return pick;
  }
  if (T.supported) { try { synth.onvoiceschanged = function () { voice(); if (st.ui) st.ui.state(st.state); }; } catch (e) { /* ignore */ } voice(); }

  function setState(s) { st.state = s; if (st.ui) st.ui.state(s); }
  function mark(p) { if (st.ui) st.ui.mark(p, st.queue[st.idx] ? st.idx : -1); }
  function run(tok) {
    if (tok !== st.token) return;
    if (st.idx >= st.queue.length) { setState("idle"); mark(-2); return; }
    var seg = st.queue[st.idx], u;
    try { u = new SpeechSynthesisUtterance(seg.text); } catch (e) { return fail(); }
    var v = voice(); u.lang = "en-GB"; if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = st.rate; u.pitch = 1;
    u.onstart = function () { if (tok === st.token) mark(seg.p); };
    u.onend = function () { if (tok !== st.token) return; st.idx++; run(tok); };
    u.onerror = function (e) {
      if (tok !== st.token) return;
      var er = e && e.error;
      if (er === "canceled" || er === "interrupted") return;
      if (er === "not-allowed" || er === "synthesis-unavailable" || er === "synthesis-failed" || er === "language-unavailable" || er === "voice-unavailable") return fail();
      st.idx++; run(tok);
    };
    try { synth.speak(u); } catch (e2) { fail(); }
  }
  function fail() { st.token++; try { synth.cancel(); } catch (e) { /* ignore */ } setState("idle"); mark(-2); if (st.ui) st.ui.msg("Audio could not start on this device. You can still read the story."); }
  function speakFrom(i) {
    if (!T.supported) return;
    try { synth.cancel(); } catch (e) { /* ignore */ }
    var tok = ++st.token; st.idx = i; st.soft = false; setState("playing");
    setTimeout(function () { run(tok); }, 60);
  }
  T.bind = function (ep, ui) { T.stop(); st.queue = T.build(ep); st.idx = 0; st.ui = ui; st.state = "idle"; };
  T.listen = function () { if (st.state === "idle") speakFrom(0); };
  T.pause = function () {
    if (st.state !== "playing") return;
    try { synth.pause(); } catch (e) { /* ignore */ }
    setState("paused");
    setTimeout(function () { if (st.state === "paused" && synth && !synth.paused) { st.soft = true; st.token++; try { synth.cancel(); } catch (e) { /* ignore */ } } }, 150);
  };
  T.resume = function () {
    if (st.state !== "paused") return;
    if (st.soft) { speakFrom(st.idx); return; }
    try { synth.resume(); } catch (e) { /* ignore */ }
    setState("playing");
    setTimeout(function () { if (st.state === "playing" && synth && !synth.speaking && !synth.pending) speakFrom(st.idx); }, 250);
  };
  T.stop = function () {
    st.token++; st.soft = false;
    if (T.supported) { try { synth.cancel(); } catch (e) { /* ignore */ } }
    if (st.state !== "idle") { st.state = "idle"; if (st.ui) { st.ui.state("idle"); st.ui.mark(-2, -1); } }
  };
  T.setRate = function (r) {
    st.rate = r;
    if (st.state === "playing") speakFrom(st.idx);
    else if (st.state === "paused") { st.soft = true; st.token++; try { synth.cancel(); } catch (e) { /* ignore */ } }
  };
  T.unbind = function () { T.stop(); st.ui = null; };
  RQ.stopAudio = function () { T.unbind(); };

  /* ======================================================= VISUALS (CSS compositions; a PNG replaces them when listed in RQ.assets) */
  RQ.visualHTML = function (v, compact) {
    var cls = "viz viz-" + v.type + (compact ? " compact" : ""), h;
    if (v.type === "timeline") {
      h = '<div class="' + cls + '">' + (v.title ? '<p class="viz-title">' + U.esc(v.title) + "</p>" : "") + '<ol class="vtl">' +
        v.items.map(function (it, i) { return '<li><span class="tl-n" aria-hidden="true">' + (i + 1) + '</span><span class="tl-e" aria-hidden="true">' + it.e + '</span><b class="tl-y">' + U.esc(it.y) + '</b><span class="tl-l">' + U.esc(it.l) + "</span></li>"; }).join("") + "</ol></div>";
    } else if (v.type === "phone") {
      h = '<div class="' + cls + '"><div class="vphone"><div class="vp-bar"><span>Messages</span><span aria-hidden="true">●●●</span></div>' +
        '<div class="vp-who"><span class="vp-av" aria-hidden="true">?</span><div><b>' + U.esc(v.from) + "</b><small>" + U.esc(v.time || "") + '</small></div></div>' +
        '<div class="vp-bubble">' + U.esc(v.text) + (v.link ? '<br><u class="vp-link">' + U.esc(v.link) + "</u>" : "") + "</div></div></div>";
    } else {
      var labels = v.items.filter(function (it) { return it.l; }).map(function (it) { return it.l; }).join(", ");
      h = '<div class="' + cls + '"><div class="sc sc-' + v.bg + '" role="img" aria-label="' + U.esc("Picture: " + labels) + '">' +
        v.items.map(function (it) { return '<span class="sc-i" style="left:' + it.x + "%;top:" + it.y + "%;font-size:" + it.s + 'em" aria-hidden="true"><span class="sc-e">' + it.e + "</span>" + (it.l ? "<small>" + U.esc(it.l) + "</small>" : "") + "</span>"; }).join("") + "</div>" +
        (v.legend ? '<ol class="sc-legend">' + v.legend.map(function (l) { return "<li>" + U.esc(l) + "</li>"; }).join("") + "</ol>" : "") + "</div>";
    }
    return h;
  };
  RQ.visual = function (ep, compact) {
    var v = ep.visual, key = "visual-" + ep.id, inner;
    if (RQ.assets[key]) inner = '<img class="viz-img" src="img/' + RQ.assets[key] + '" alt="' + U.esc(v.caption || ep.title) + '">';
    else inner = RQ.visualHTML(v, compact);
    return '<figure class="figure' + (compact ? " compact" : "") + '">' + inner + (v.caption && !compact ? "<figcaption>" + U.esc(v.caption) + "</figcaption>" : "") + "</figure>";
  };

  /* ======================================================= STORY READER (whole text on one screen + listen) */
  A.reader = function (box, ep, done) {
    var used = {}, words = U.words(ep.paras), mins = Math.max(1, Math.round(words / 130));
    var vocab = ep.vocab.slice().sort(function (a, b) { return b.w.length - a.w.length; });
    var re = new RegExp("\\b(" + vocab.map(function (v) { return v.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\\b", "gi");
    function mark(t) {
      return U.esc(t).replace(re, function (m) { var k = m.toLowerCase(); if (used[k]) return m; used[k] = 1; return '<button type="button" class="vw" data-w="' + U.esc(k) + '" aria-expanded="false">' + m + "</button>"; });
    }
    function meaning(w) { for (var i = 0; i < ep.vocab.length; i++) if (ep.vocab[i].w.toLowerCase() === w) return ep.vocab[i].m; return ""; }
    var scene = RQ.assets[ep.id + "-card"] ? '<img class="rd-scene" src="img/' + RQ.assets[ep.id + "-card"] + '" alt="" decoding="async">' : "";
    var ttsHtml = T.supported
      ? '<div class="tts" role="group" aria-label="Listen to the story"><button type="button" class="tbtn" data-tts="listen">'+U.img("play","tic")+' Listen</button><button type="button" class="tbtn" data-tts="pause" disabled>'+U.img("pause","tic")+' Pause</button><button type="button" class="tbtn" data-tts="resume" disabled>'+U.img("play","tic")+' Resume</button><button type="button" class="tbtn" data-tts="stop" disabled>'+U.img("stop","tic")+' Stop</button>' +
        '<span class="speed" role="group" aria-label="Reading speed"><button type="button" class="sbtn2" data-rate="0.8" aria-pressed="false">0.8×</button><button type="button" class="sbtn2" data-rate="1" aria-pressed="true">1×</button><button type="button" class="sbtn2" data-rate="1.2" aria-pressed="false">1.2×</button></span></div><p class="tts-status" role="status"></p>'
      : '<p class="tts-status">🔇 Audio is not available in this browser. You can still read the story.</p>';
    box.innerHTML = '<div class="reader">' +
      '<div class="rd-main"><article class="rd-text"><div class="rd-headrow">' + scene + '<div><h2 class="rd-title">' + U.esc(ep.title) + '</h2><p class="rd-meta">' + U.esc(RQ.data.worlds.filter(function (w) { return w.id === ep.world; })[0].kind) + " · " + U.esc(ep.theme) + " · " + words + " words · about " + mins + " min</p></div></div>" + ttsHtml +
      '<div class="paras">' + ep.paras.map(function (p, i) { return '<p class="para" data-p="' + i + '"><span class="pn" aria-hidden="true">' + (i + 1) + '</span><span class="pt">' + mark(p) + "</span></p>"; }).join("") + '</div><div class="rd-end" aria-hidden="true"></div></article><div class="rd-foot"><p class="rd-hint" id="rd-hint" role="status">Read to the end of the story. The button unlocks when you reach it.</p><button type="button" class="btn btn-pink" data-fin disabled>✓ I have finished reading</button></div></div>' +
      '<aside class="rd-side"><div class="rd-vis">' + RQ.visual(ep) + '</div><div class="rd-words"><h3>Word help</h3><p class="g-sub">Tap a <span class="vw demo">highlighted word</span> in the story to see its meaning.</p><dl>' +
      ep.vocab.map(function (v) { return "<dt>" + U.esc(v.w) + "</dt><dd>" + U.esc(v.m) + "</dd>"; }).join("") + "</dl></div></aside></div>";
    var root = box.firstChild, status = root.querySelector(".tts-status"), fin = root.querySelector("[data-fin]");

    /* word help */
    root.addEventListener("click", function (e) {
      var w = e.target.closest(".vw");
      if (w && w.dataset.w) {
        var nx = w.nextElementSibling;
        if (nx && nx.classList.contains("vw-tip")) { nx.remove(); w.setAttribute("aria-expanded", "false"); }
        else { var tip = document.createElement("span"); tip.className = "vw-tip"; tip.textContent = " (= " + meaning(w.dataset.w) + ")"; w.after(tip); w.setAttribute("aria-expanded", "true"); }
        return;
      }
      var b = e.target.closest("[data-tts]");
      if (b && !b.disabled) { var a = b.dataset.tts; if (a === "listen") T.listen(); else if (a === "pause") T.pause(); else if (a === "resume") T.resume(); else if (a === "stop") T.stop(); return; }
      var r = e.target.closest("[data-rate]");
      if (r) { U.$$("[data-rate]", root).forEach(function (x) { x.setAttribute("aria-pressed", x === r ? "true" : "false"); }); T.setRate(+r.dataset.rate); return; }
      if (e.target.closest("[data-fin]") && !fin.disabled) { fin.disabled = true; RQ.stopAudio(); RQ.sfx.ok(); done(null); }
    });

    /* listen bindings */
    if (T.supported) {
      var btn = function (n) { return root.querySelector('[data-tts="' + n + '"]'); };
      T.bind(ep, {
        state: function (s) {
          btn("listen").disabled = s !== "idle"; btn("pause").disabled = s !== "playing"; btn("resume").disabled = s !== "paused"; btn("stop").disabled = s === "idle";
          status.textContent = s === "idle" ? (T.hasEnglish ? "Press Listen to hear the story read aloud." : "Press Listen to hear the story. No English voice was found on this device, so the voice may sound different.") : s === "paused" ? "Paused." : "Reading aloud…";
          if (s !== "playing" && s !== "paused") U.$$(".para.speaking", root).forEach(function (p) { p.classList.remove("speaking"); });
        },
        mark: function (p) {
          U.$$(".para.speaking", root).forEach(function (x) { x.classList.remove("speaking"); });
          if (p >= 0) { var el = root.querySelector('.para[data-p="' + p + '"]'); if (el) { el.classList.add("speaking"); status.textContent = "Reading paragraph " + (p + 1) + " of " + ep.paras.length + "…"; U.view(el); } }
        },
        msg: function (m) { status.textContent = m; }
      });
      status.textContent = T.hasEnglish ? "Press Listen to hear the story read aloud." : "Press Listen to hear the story. No English voice was found on this device, so the voice may sound different.";
    }

    /* unlock: end of story reached AND at least 10 seconds on the page */
    var seenEnd = false, timeOk = false;
    function unlock() { if (seenEnd && timeOk && fin.disabled) { fin.disabled = false; document.getElementById("rd-hint").textContent = "Well done! You can move on to the next mission."; U.say("You can now finish reading."); } }
    setTimeout(function () { timeOk = true; unlock(); }, 10000);
    var sentinel = root.querySelector(".rd-end");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { seenEnd = true; unlock(); io.disconnect(); } }); }, { threshold: 0.1 });
      io.observe(sentinel);
    } else { seenEnd = true; }
  };

  /* ======================================================= ORDER (tap-to-order; Time Track and Master Quest) */
  function lastLabel(o, more) { return o && o.last ? (o.lastText || "Finish ✓") : (more || "Next →"); }

  A.order = function (box, cfg, done, o) {
    o = o || {};
    var evs = cfg.events.map(function (e, i) { return { id: i, t: typeof e === "string" ? e : e.t, clue: e.clue || "" }; });
    var n = evs.length, slots = [], locked = [], pool = U.shuffle(evs.map(function (e) { return e.id; })), checks = 0, firstOk = 0, over = false;
    for (var k = 0; k < n; k++) { slots.push(null); locked.push(false); }
    function render() {
      var full = pool.length === 0;
      box.innerHTML = (o.noHead ? "" : head({ title: cfg.title || "Time Track", prompt: cfg.intro })) +
        '<ol class="slots">' + slots.map(function (id, k) {
          return id === null
            ? '<li class="slot empty"><span class="num">' + (k + 1) + '</span><span class="ph">Step ' + (k + 1) + " — tap a card below</span></li>"
            : '<li class="slot filled' + (locked[k] ? " locked" : "") + '"><span class="num">' + (locked[k] ? "✓" : k + 1) + '</span><button type="button" class="card" data-slot="' + k + '"' + (locked[k] || over ? " disabled" : "") + ' aria-label="' + U.esc(evs[id].t) + '. Step ' + (k + 1) + '. Tap to take back.">' + U.esc(evs[id].t) + "</button></li>";
        }).join("") + "</ol>" +
        (pool.length ? '<div class="pool-label">Event cards</div><div class="pool">' + pool.map(function (id) { return '<button type="button" class="card" data-pool="' + id + '">' + U.esc(evs[id].t) + "</button>"; }).join("") + "</div>" : "") +
        '<div class="fb-slot" role="status">' + (o._msg || "") + "</div>" +
        (over ? "" : '<div class="actions"><button type="button" class="btn btn-pink" data-check ' + (full ? "" : "disabled") + ">Check my order</button></div>");
      if (over) finish(box, lastLabel(o, "Next question →"), function () { done({ ok: firstOk, total: n }); });
    }
    box.onclick = function (e) {
      if (over) return;
      var t;
      if ((t = e.target.closest("[data-pool]"))) {
        var id = +t.dataset.pool, at = slots.indexOf(null);
        if (at < 0) return;
        slots[at] = id; pool.splice(pool.indexOf(id), 1); o._msg = ""; RQ.sfx.tap(); render();
      } else if ((t = e.target.closest("[data-slot]"))) {
        var k = +t.dataset.slot; if (locked[k]) return;
        pool.push(slots[k]); slots[k] = null; o._msg = ""; render();
      } else if (e.target.closest("[data-check]")) {
        var wrong = [];
        for (var k2 = 0; k2 < n; k2++) { if (slots[k2] === k2) locked[k2] = true; else wrong.push(k2); }
        if (checks === 0) firstOk = n - wrong.length;
        checks++;
        if (!wrong.length) {
          over = true; RQ.sfx.win();
          o._msg = fb("ok", "<b>✓ Perfect chronology!</b> " + U.esc(cfg.why || "Every event is in the right place."));
          U.say("Correct order");
        } else {
          RQ.sfx.bad();
          var lines = wrong.slice(0, 2).map(function (k3) {
            var ev = evs[slots[k3]];
            return "“" + U.esc(ev.t) + "” " + (ev.id < k3 ? "happened earlier than step " + (k3 + 1) + "." : "happens later than step " + (k3 + 1) + ".") + (ev.clue ? " <i>Clue: " + U.esc(ev.clue) + "</i>" : "");
          });
          o._msg = fb("try", "<b>" + (n - wrong.length) + " of " + n + " are in the right place.</b> The correct cards stay. Try the others again.<br>" + lines.join("<br>"));
          wrong.forEach(function (k4) { pool.push(slots[k4]); slots[k4] = null; });
          U.say((n - wrong.length) + " of " + n + " correct");
        }
        render(); U.view(box.querySelector(".fb-slot"));
      }
    };
    render();
  };

  /* ======================================================= QUIZ (mcq, tf, mcma, match, sort3, order) */
  var R = {};
  var DEFQ = { sort3: "Which part of the recount does this sentence belong to?" };
  var SORTWHY = { O: "Orientation sets the scene: who, when, where or what the situation was.", E: "Events tell what happened, usually in time order.", R: "Reorientation looks back on the experience: what the writer thinks, feels or does now." };
  var SORTNAME = { O: "Orientation", E: "Events", R: "Reorientation" };

  R.mcq = function (body, it, end) {
    var tries = 0, order = it.fix ? it.o.map(function (_, k) { return k; }) : U.shuffle(it.o.map(function (_, k) { return k; }));
    body.innerHTML = '<div class="opts">' + order.map(function (k, j) { return '<button type="button" class="opt big" data-k="' + k + '"><span class="key">' + "ABCD"[j] + '</span><span class="otxt">' + U.esc(it.o[k]) + "</span></button>"; }).join("") + '</div><div class="fb-slot" role="status"></div>';
    body.onclick = function (e) {
      var b = e.target.closest(".opt"); if (!b || b.disabled) return;
      var slot = body.querySelector(".fb-slot");
      if (+b.dataset.k === it.a) {
        U.$$(".opt", body).forEach(function (x) { x.disabled = true; }); b.classList.add("right"); RQ.sfx.ok();
        slot.innerHTML = fb("ok", "<b>" + (tries === 0 ? "✓ Correct!" : "✓ That’s it!") + "</b> " + U.esc(it.why)); U.say("Correct");
        end(tries === 0);
      } else {
        tries++; b.disabled = true; b.classList.add("wrong"); RQ.sfx.bad();
        slot.innerHTML = fb("try", "<b>Not quite.</b> " + U.esc(it.hint || HINTS[it.tag] || "Go back to the text and look for evidence.")); U.view(slot);
      }
    };
  };

  R.tf = function (body, it, end) {
    body.innerHTML = '<div class="tfbtns"><button type="button" class="btn tfbtn tf-t" data-v="true">'+U.img("check","tic")+' True</button><button type="button" class="btn tfbtn tf-f" data-v="false">'+U.img("cross","tic")+' False</button></div><div class="fb-slot" role="status"></div>';
    body.onclick = function (e) {
      var b = e.target.closest(".tfbtn"); if (!b || b.disabled) return;
      var good = (b.dataset.v === "true") === it.a;
      U.$$(".tfbtn", body).forEach(function (x) { x.disabled = true; x.classList.toggle("right", (x.dataset.v === "true") === it.a); });
      if (!good) b.classList.add("wrong");
      good ? RQ.sfx.ok() : RQ.sfx.bad();
      body.querySelector(".fb-slot").innerHTML = fb(good ? "ok" : "try", "<b>" + (good ? "✓ Correct!" : "Not quite. The statement is " + (it.a ? "TRUE" : "FALSE") + ".") + "</b> " + U.esc(it.why));
      U.say(good ? "Correct" : "Not quite");
      end(good);
    };
  };

  R.mcma = function (body, it, end) {
    var tries = 0, need = it.a.length, order = U.shuffle(it.o.map(function (_, k) { return k; })), sel = {}, lock = {};
    function render(msg) {
      body.innerHTML = '<p class="g-sub">Choose ' + need + ' answers.</p><div class="opts">' + order.map(function (k, j) {
        var cls = lock[k] ? " right" : sel[k] ? " picked" : "";
        return '<button type="button" class="opt big' + cls + '" data-k="' + k + '" aria-pressed="' + (lock[k] || sel[k] ? "true" : "false") + '"' + (lock[k] ? " disabled" : "") + '><span class="key">' + (lock[k] ? "✓" : sel[k] ? "●" : "ABCD"[j]) + '</span><span class="otxt">' + U.esc(it.o[k]) + "</span></button>";
      }).join("") + '</div><div class="fb-slot" role="status">' + (msg || "") + '</div><div class="actions"><button type="button" class="btn btn-pink" data-check ' + (Object.keys(sel).filter(function (k) { return sel[k]; }).length ? "" : "disabled") + '>Check my answers</button></div>';
    }
    body.onclick = function (e) {
      var b = e.target.closest(".opt");
      if (b && !b.disabled) { var k = +b.dataset.k; sel[k] = !sel[k]; RQ.sfx.tap(); render(); var again = body.querySelector('.opt[data-k="' + k + '"]'); if (again) again.focus({ preventScroll: true }); return; }
      if (e.target.closest("[data-check]") && !e.target.closest("[data-check]").disabled) {
        var picked = Object.keys(sel).filter(function (x) { return sel[x]; }).map(Number);
        var right = picked.filter(function (k) { return it.a.indexOf(k) >= 0; });
        if (right.length === need && picked.length === need) {
          U.$$(".opt", body).forEach(function () { /* noop */ });
          picked.forEach(function (k) { lock[k] = 1; }); sel = {}; render(fb("ok", "<b>" + (tries === 0 ? "✓ Correct!" : "✓ That’s it!") + "</b> " + U.esc(it.why)));
          U.$$(".opt", body).forEach(function (x) { x.disabled = true; }); U.$$(".actions", body).forEach(function (x) { x.remove(); });
          RQ.sfx.ok(); U.say("Correct"); end(tries === 0);
        } else {
          tries++; RQ.sfx.bad(); right.forEach(function (k) { lock[k] = 1; }); sel = {};
          var msg = right.length ? "<b>You found " + right.length + " correct answer" + (right.length > 1 ? "s" : "") + ".</b> Those stay. Choose " + (need - right.length) + " more." : "<b>Not quite.</b> None of those is correct. " + (HINTS[it.tag] || "Look at the text again.");
          render(fb("try", msg)); U.view(body.querySelector(".fb-slot"));
        }
      }
    };
    render();
  };

  R.match = function (body, it, end) {
    var tries = 0, left = it.pairs.map(function (p) { return p[0]; }), right = U.shuffle(it.pairs.map(function (p) { return p[1]; })), done = {}, cur = -1, n = it.pairs.length, matched = 0;
    function render(msg) {
      body.innerHTML = '<p class="g-sub">Tap one card on the left, then tap its match on the right.</p><div class="mt-grid"><div class="mt-col" role="group" aria-label="Items">' +
        left.map(function (l, i) { return '<button type="button" class="mt-b mt-l' + (done[i] ? " right" : cur === i ? " picked" : "") + '" data-l="' + i + '" aria-pressed="' + (cur === i) + '"' + (done[i] ? " disabled" : "") + ">" + U.esc(l) + "</button>"; }).join("") +
        '</div><div class="mt-col" role="group" aria-label="Matches">' +
        right.map(function (r, j) { var d = Object.keys(done).some(function (i) { return done[i] === j; }); return '<button type="button" class="mt-b mt-r' + (d ? " right" : "") + '" data-r="' + j + '"' + (d ? " disabled" : "") + ">" + U.esc(r) + "</button>"; }).join("") +
        '</div></div><div class="fb-slot" role="status">' + (msg || "") + "</div>";
    }
    body.onclick = function (e) {
      var l = e.target.closest("[data-l]"), r = e.target.closest("[data-r]");
      if (l && !l.disabled) { cur = cur === +l.dataset.l ? -1 : +l.dataset.l; RQ.sfx.tap(); render(); return; }
      if (r && !r.disabled) {
        if (cur < 0) { render(fb("try", "Tap a card on the left first.")); return; }
        if (it.pairs[cur][1] === right[+r.dataset.r]) {
          done[cur] = +r.dataset.r; cur = -1; matched++; RQ.sfx.ok();
          if (matched === n) { render(fb("ok", "<b>" + (tries === 0 ? "✓ All matched!" : "✓ All matched in the end!") + "</b> " + U.esc(it.why))); U.say("All matched"); end(tries === 0); }
          else render(fb("ok", "<b>✓ A match!</b> " + (n - matched) + " to go."));
        } else { tries++; RQ.sfx.bad(); cur = -1; render(fb("try", "<b>Not a match.</b> Read both cards again and think about the text.")); }
        U.view(body.querySelector(".fb-slot"));
      }
    };
    render();
  };

  R.sort3 = function (body, it, end) {
    var tries = 0;
    body.innerHTML = '<div class="legend"><span class="lg lg-O"><b>Orientation</b> who · when · where</span><span class="lg lg-E"><b>Events</b> what happened</span><span class="lg lg-R"><b>Reorientation</b> looking back</span></div>' +
      '<blockquote class="clue">' + U.esc(it.s) + '</blockquote><div class="sortbtns three"><button type="button" class="btn sbtn s-O" data-k="O">Orientation</button><button type="button" class="btn sbtn s-E" data-k="E">Events</button><button type="button" class="btn sbtn s-R" data-k="R">Reorientation</button></div><div class="fb-slot" role="status"></div>';
    body.onclick = function (e) {
      var b = e.target.closest(".sbtn"); if (!b || b.disabled) return;
      var slot = body.querySelector(".fb-slot");
      if (b.dataset.k === it.a) {
        U.$$(".sbtn", body).forEach(function (x) { x.disabled = true; }); b.classList.add("right"); RQ.sfx.ok();
        slot.innerHTML = fb("ok", "<b>✓ " + SORTNAME[it.a] + ".</b> " + SORTWHY[it.a]); end(tries === 0);
      } else { tries++; b.disabled = true; b.classList.add("wrong"); RQ.sfx.bad(); slot.innerHTML = fb("try", "<b>Not quite.</b> " + HINTS.structure); }
    };
  };

  A.quiz = function (box, items, done, o) {
    o = o || {};
    var i = 0, ok = 0, results = [];
    function show() {
      var it = items[i], kind = it.k || "mcq", last = i === items.length - 1;
      var pre = "";
      if (it.viz && o.ep) pre += '<div class="qviz">' + RQ.visual(o.ep, true) + "</div>";
      if (it.vis) pre += '<div class="qviz">' + RQ.visualHTML(it.vis, true) + "</div>";
      if (it.ext) pre += '<div class="extracts">' + it.ext.map(function (x) { return '<div class="ext"><b>' + U.esc(x.h) + "</b><p>" + U.esc(x.t) + "</p></div>"; }).join("") + "</div>";
      if (it.quote) pre += '<blockquote class="clue">' + U.esc(it.quote) + "</blockquote>";
      var peek = o.ep ? '<button type="button" class="btn-link" data-peek>📖 Re-read the story</button>' : "";
      box.innerHTML = '<div class="qhead"><span class="qcount">Question ' + (i + 1) + " of " + items.length + '</span><i class="bar"><u style="width:' + (i / items.length * 100) + '%"></u></i></div>' +
        '<div class="qtop"><span class="qtag">' + U.tag(it.tag || it.cat) + "</span>" + peek + "</div>" + pre +
        '<p class="qtext">' + U.rich(it.q || DEFQ[kind] || "") + '</p><div class="qbody"></div>';
      box.onclick = function (e) { if (e.target.closest("[data-peek]")) RQ.peek(o.ep); };
      var body = box.querySelector(".qbody");
      function record(first) { if (first) ok++; results.push({ cat: it.cat || it.tag, ok: !!first }); }
      function end(first) { record(first); finish(body, last ? (o.lastLabel || "Finish ✓") : "Next question →", next); }
      if (kind === "order") {
        A.order(body, { events: it.events, why: it.why }, function (st) { record(st.ok === st.total); next(); }, { noHead: true, last: last, lastText: o.lastLabel });
      } else R[kind](body, it, end);
      window.scrollTo({ top: Math.max(0, box.getBoundingClientRect().top + window.pageYOffset - 90), behavior: "auto" });
    }
    function next() { if (i === items.length - 1) done({ ok: ok, total: items.length, results: results }); else { i++; show(); } }
    show();
  };
})();
