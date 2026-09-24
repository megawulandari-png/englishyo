/* ==========================================================
   NARRATIVE QUEST — Game engine (ENGLISH YO!)
   Reads stories from NQ.stories / NQ.CATALOG (see stories/).
   No story content lives in this file.
   ========================================================== */
(function () {
  "use strict";
  const NQ = window.NQ;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const strip = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem("nq:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("nq:" + k, JSON.stringify(v)); } catch (e) {} },
  };

  const CHALLENGES = [
    { key: "word", name: "Word Hunter", icon: "🔮", gem: "Word Gem", gemImg: "img/gem-word.webp", num: "img/n1.webp", badge: "Word Hunter", scoreLabel: "Vocabulary", objective: "Understand vocabulary from context." },
    { key: "structure", name: "Story Detective", icon: "🧩", gem: "Structure Gem", gemImg: "img/gem-structure.webp", num: "img/n2.webp", badge: "Story Detective", scoreLabel: "Story Structure", objective: "Understand narrative structure and conflict." },
    { key: "character", name: "Character Detective", icon: "🎭", gem: "Character Gem", gemImg: "img/gem-character.webp", num: "img/n3.webp", badge: "Character Expert", scoreLabel: "Character", objective: "Describe characters with personality adjectives and prove it with evidence." },
    { key: "grammar", name: "Past Tense Lab", icon: "⏳", gem: "Grammar Gem", gemImg: "img/gem-grammar.webp", num: "img/n4.webp", badge: "Past Tense Master", scoreLabel: "Past Tense", objective: "Recognise and use the simple past tense — the language of narratives." },
  ];
  const FINAL = { key: "final", name: "Master the Story", icon: "🌟", badge: "Narrative Master", scoreLabel: "Final Challenge", gemImg: "img/star-gold.webp", objective: "Use everything you have learned." };
  const chInfo = (k) => (k === "final" ? FINAL : CHALLENGES.find((c) => c.key === k));
  const STRUCT_IMG = { orientation: "img/st-orientation.webp", complication: "img/st-complication.webp", resolution: "img/st-resolution.webp", "ending / coda": "img/st-ending.webp", "main conflict": "img/st-conflict.webp" };

  /* ---------------- state ---------------- */
  const S = {
    name: store.get("name", ""),
    sound: store.get("sound", true),
    genre: null, origin: null, story: null, page: 0, run: null, ch: null, t: null, nameWarned: false,
  };
  function newRun(story) {
    const z = () => ({ word: 0, structure: 0, character: 0, grammar: 0 });
    S.run = { storyId: story.id, read: false, gems: {}, scores: z(), base: z(), max: z(), final: null, streak: 0, bestStreak: 0, unlockShown: false };
  }
  const total = () => { const r = S.run; if (!r) return 0; return Object.values(r.scores).reduce((a, b) => a + b, 0) + (r.final ? r.final.score : 0) + (S.ch ? S.ch.score : 0); };

  /* ---------------- sound effects (Web Audio) ---------------- */
  const SFX = (() => {
    let ctx = null;
    const ac = () => {
      if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    };
    const tone = (f, t0, dur, type = "sine", vol = 0.16) => {
      const c = ac(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
    };
    const P = {
      click: () => tone(660, 0, 0.08, "triangle", 0.1),
      correct: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.32, "triangle", 0.15)),
      wrong: () => { tone(247, 0, 0.18, "sine", 0.14); tone(208, 0.13, 0.28, "sine", 0.12); },
      page: () => { tone(520, 0, 0.06, "triangle", 0.06); tone(780, 0.05, 0.1, "triangle", 0.05); },
      hint: () => { tone(988, 0, 0.18, "sine", 0.1); tone(1319, 0.1, 0.25, "sine", 0.08); },
      gem: () => [784, 988, 1175, 1568, 1976, 2349].forEach((f, i) => tone(f, i * 0.07, 0.6, "sine", 0.12)),
      unlock: () => { [392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.16, 0.5, "triangle", 0.14)); [1047, 1319, 1568].forEach((f) => tone(f, 0.7, 1.2, "sine", 0.09)); },
      place: () => tone(440, 0, 0.07, "triangle", 0.09),
    };
    return (n) => { if (!S.sound) return; try { P[n] && P[n](); } catch (e) {} };
  })();

  /* ---------------- speech (en-GB preferred, no overlap) ---------------- */
  const Speech = (() => {
    const ok = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    let voice = null, token = 0, onStop = null;
    const choose = () => {
      if (!ok) return;
      const vs = speechSynthesis.getVoices(); if (!vs.length) return;
      const en = vs.filter((v) => /^en([-_]|$)/i.test(v.lang));
      const gb = en.filter((v) => /en[-_]GB/i.test(v.lang));
      const prefs = [/Google UK English Female/i, /Sonia|Libby|Serena|Kate|Martha|Stephanie|Hazel/i, /Google UK/i, /Daniel|Arthur|Oliver|Ryan/i];
      let v = null;
      for (const r of prefs) { v = gb.find((x) => r.test(x.name)); if (v) break; }
      voice = v || gb[0] || en.find((x) => /en[-_]US/i.test(x.lang)) || en[0] || null;
    };
    if (ok) { choose(); try { speechSynthesis.addEventListener("voiceschanged", choose); } catch (e) { speechSynthesis.onvoiceschanged = choose; } }
    const ready = () => new Promise((res) => {
      if (!ok) return res();
      if (voice || speechSynthesis.getVoices().length) { choose(); return res(); }
      let done = false; const f = () => { if (done) return; done = true; choose(); res(); };
      try { speechSynthesis.addEventListener("voiceschanged", f, { once: true }); } catch (e) {}
      setTimeout(f, 1500);
    });
    const finish = () => { const f = onStop; onStop = null; if (f) f(); };
    function stop() { token++; if (ok) { try { speechSynthesis.cancel(); } catch (e) {} } finish(); }
    async function speak(text, o = {}) {
      stop();
      if (!ok || !S.sound || !text) { if (o.onEnd) o.onEnd(); if (!ok && o.fromUser) toast("Audio is not available in this browser."); return; }
      const my = ++token; onStop = o.onEnd || null;
      await ready(); if (my !== token) return;
      const parts = Array.isArray(text) ? text : [text];
      let i = 0;
      const next = () => {
        if (my !== token) return;
        if (i >= parts.length) { finish(); return; }
        const u = new SpeechSynthesisUtterance(strip(parts[i]));
        if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = "en-GB";
        u.rate = o.rate || 0.9; u.pitch = 1;
        const idx = i;
        u.onstart = () => { if (my === token && o.onPart) o.onPart(idx); };
        u.onend = () => { i++; next(); };
        u.onerror = () => { if (my === token) { i++; next(); } };
        speechSynthesis.speak(u);
      };
      if (speechSynthesis.speaking || speechSynthesis.pending) setTimeout(next, 120); else next();
    }
    return { speak, stop, ok };
  })();
  const splitSentences = (t) => (t.match(/[^.!?]+[.!?]+[”’"]?\s*/g) || [t]).map((s) => s.trim()).filter(Boolean);

  /* ---------------- helpers: UI ---------------- */
  const layer = $("#layer");
  const live = (m) => { $("#live").textContent = strip(m); };
  function toast(msg) {
    const d = document.createElement("div");
    d.className = "pop"; d.style.left = "50%"; d.style.bottom = "24px"; d.style.transform = "translateX(-50%)";
    d.innerHTML = `<p style="margin:0">${msg}</p>`; document.body.appendChild(d); live(msg);
    setTimeout(() => d.remove(), 2600);
  }
  function overlay(html, cls = "modal", onClose) {
    closeOverlay();
    const ov = document.createElement("div");
    ov.className = "ov"; ov.innerHTML = `<div class="${cls}" role="dialog" aria-modal="true">${html}</div>`;
    ov.addEventListener("click", (e) => {
      if (e.target === ov && cls === "modal") closeOverlay();
      const x = e.target.closest("[data-close]"); if (x) { closeOverlay(); if (onClose) onClose(); }
    });
    layer.appendChild(ov);
    const f = ov.querySelector("button"); if (f) setTimeout(() => f.focus({ preventScroll: true }), 50);
    return ov;
  }
  function closeOverlay() { layer.innerHTML = ""; }
  function confetti(n = 80) {
    const c = document.createElement("div"); c.className = "confetti";
    const cols = ["#f0c35a", "#8150c8", "#3c9a3a", "#2c6ed5", "#ff7a8a", "#fff"];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%"; p.style.background = pick(cols);
      p.style.animationDuration = 2 + Math.random() * 2.5 + "s"; p.style.animationDelay = Math.random() * 0.8 + "s";
      c.appendChild(p);
    }
    document.body.appendChild(c); setTimeout(() => c.remove(), 5200);
  }
  function setTheme(gid) {
    const g = NQ.GENRES.find((x) => x.id === gid); const r = document.documentElement.style;
    if (!g) { r.removeProperty("--wa"); r.removeProperty("--wb"); r.removeProperty("--wglow"); return; }
    r.setProperty("--wa", g.theme.a); r.setProperty("--wb", g.theme.b); r.setProperty("--wglow", g.theme.glow);
  }
  function setCrumb(parts) { $("#crumb").textContent = ["Narrative Quest"].concat(parts || []).join("  ›  "); }
  function updScore() { $("#scoreVal").textContent = total().toLocaleString("en-GB"); }
  function show(id) {
    Speech.stop(); closePop();
    $$(".screen").forEach((s) => s.classList.toggle("active", s.id === id));
    $("#scorePill").hidden = !(id === "s-challenge" || id === "s-hub");
    updScore(); window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }
  function soundUI() {
    $("#soundBtn").classList.toggle("off", !S.sound); $("#soundBtn").setAttribute("aria-pressed", String(S.sound));
    $("#soundBtn2").textContent = S.sound ? "🔊 Sound: ON" : "🔇 Sound: OFF";
  }
  function toggleSound() { S.sound = !S.sound; store.set("sound", S.sound); if (!S.sound) Speech.stop(); soundUI(); SFX("click"); }
  function confirmBox(msg, yes, onYes) {
    const ov = overlay(`<h2>Are you sure?</h2><p style="font-size:1.1rem">${msg}</p><div class="row"><button class="btn green" data-yes>${yes}</button><button class="btn ghost" style="color:var(--ink)" data-close>Stay here</button></div>`);
    $("[data-yes]", ov).onclick = () => { closeOverlay(); onYes(); };
  }

  /* ---------------- vocabulary popover ---------------- */
  let popEl = null;
  function closePop() { if (popEl) { popEl.remove(); popEl = null; } }
  function vocabPop(word, anchor) {
    closePop();
    const v = (S.story.vocabulary || []).find((x) => x.word === word); if (!v) return;
    const d = document.createElement("div"); d.className = "pop"; d.setAttribute("role", "dialog");
    d.innerHTML = `<b>${esc(v.word)}</b><p>${esc(v.meaning)}</p><button class="listen" data-say="${esc(v.word)}"><img src="img/ic-sound.webp" alt="">Listen</button>`;
    document.body.appendChild(d); popEl = d;
    const r = anchor.getBoundingClientRect(), w = d.offsetWidth, h = d.offsetHeight;
    let x = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), innerWidth - w - 12);
    let y = r.bottom + 8; if (y + h > innerHeight - 8) y = r.top - h - 8;
    d.style.left = x + "px"; d.style.top = Math.max(8, y) + "px";
    Speech.speak(v.word);
  }
  document.addEventListener("pointerdown", (e) => { if (popEl && !popEl.contains(e.target) && !e.target.closest(".vword")) closePop(); });

  /* ======================================================
     HOME
     ====================================================== */
  function initHome() {
    const inp = $("#nameIn"); inp.value = S.name || "";
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") startAdventure(); });
  }
  function startAdventure() {
    const inp = $("#nameIn"); const n = inp.value.trim().replace(/\s+/g, " ");
    if (!n && !S.nameWarned) {
      S.nameWarned = true; inp.classList.remove("need"); void inp.offsetWidth; inp.classList.add("need");
      $("#nameMsg").textContent = "Type your name for your results — or press START again to play as Explorer.";
      inp.focus(); return;
    }
    S.name = n || "Explorer"; store.set("name", n); $("#nameMsg").textContent = "";
    SFX("unlock"); goWorlds();
  }
  function howToPlay() {
    overlay(`<button class="x" data-close aria-label="Close"><img src="img/ic-cross.webp" alt=""></button>
      <h2>How to Play</h2>
      <ul class="steps">
        <li><span class="e">🌍</span><span>Choose a <b>story world</b>, then choose <b>Indonesia</b> or <b>Around the World</b> and pick a story.</span></li>
        <li><span class="e">📖</span><span><b>Read the story</b> page by page. Tap the <b style="color:#6a2fb0">purple words</b> to learn them. Press <b>🔊 LISTEN</b> to hear the page.</span></li>
        <li><span class="e">🗺️</span><span>On the <b>Quest Map</b>, finish four challenges: 🔮 Word Hunter, 🧩 Story Detective, 🎭 Character Detective and ⏳ Past Tense Lab. Each one gives you a <b>Story Gem</b>.</span></li>
        <li><span class="e">🌟</span><span>Collect all <b>4 gems</b> to unlock the final challenge: <b>MASTER THE STORY</b>.</span></li>
        <li><span class="e">💡</span><span><b>No game over!</b> If you make a mistake, read the feedback, use a <b>hint</b>, or open the <b>📜 story</b> — then try again.</span></li>
        <li><span class="e">⭐</span><span>Points: <b>+100</b> first try · <b>+70</b> second try · <b>+40</b> after a hint. Answer correctly in a row for a streak: 🔥 ×2, ×3, ×4!</span></li>
        <li><span class="e">👆</span><span>Cards can be <b>dragged</b> — or <b>tap a card, then tap where it goes</b>. Works on phones, tablets and smart boards.</span></li>
      </ul>
      <div class="row"><button class="btn green" data-close>Got it!</button></div>`);
  }

  /* ======================================================
     WORLDS
     ====================================================== */
  function goWorlds() {
    setTheme(null); setCrumb(["Story Worlds"]);
    const box = $("#portals");
    box.innerHTML = NQ.GENRES.map((g) => {
      const all = NQ.CATALOG.filter((c) => c.genre === g.id);
      const ready = all.filter((c) => c.status === "playable").length;
      return `<button class="portal" data-genre="${g.id}" style="--g:${g.theme.glow}">
        <span class="glow"></span><img src="${g.portal}" alt="${esc(g.name)} portal">
        <span class="pdesc">${esc(g.desc)}</span>
        <span class="pcount">${ready ? `✨ ${ready} story ready` : "🔒 coming soon"} · ${all.length} stories</span>
      </button>`;
    }).join("");
    show("s-worlds");
  }
  function enterWorld(gid, el) {
    SFX("unlock");
    if (el) { el.classList.add("entering"); setTimeout(() => goLibrary(gid), 520); } else goLibrary(gid);
  }

  /* ======================================================
     LIBRARY
     ====================================================== */
  function goLibrary(gid) {
    S.genre = gid || S.genre; const g = NQ.GENRES.find((x) => x.id === S.genre);
    setTheme(g.id); setCrumb([g.name]);
    $("#libHead").innerHTML = `<img src="${g.portal}" alt=""><div class="t"><button class="btn ghost sm" data-act="worlds">← All worlds</button>
      <h1 class="title-xl" style="text-align:left;margin-top:8px">${g.icon} ${esc(g.name)}</h1><p>${esc(g.desc)}</p></div>`;
    renderCards(); show("s-library");
  }
  function renderCards() {
    $$(".origin").forEach((b) => b.classList.toggle("on", b.dataset.origin === S.origin));
    $("#originHint").hidden = !!S.origin;
    const box = $("#cards");
    if (!S.origin) { box.innerHTML = ""; return; }
    const done = store.get("done", {});
    const list = NQ.CATALOG.filter((c) => c.genre === S.genre && c.origin === S.origin)
      .sort((a, b) => (a.status === "playable" ? -1 : 0) - (b.status === "playable" ? -1 : 0));
    const gname = NQ.GENRES.find((x) => x.id === S.genre).name;
    box.innerHTML = list.length ? list.map((c, i) => {
      const soon = c.status !== "playable";
      const cover = c.cover ? `style="background-image:url('${c.cover}')"` : `style="background:linear-gradient(135deg,${c.art.from},${c.art.to})"`;
      const best = done[c.id];
      return `<article class="card ${soon ? "soon" : ""}" style="animation-delay:${i * 60}ms">
        ${soon ? `<span class="ribbon">COMING SOON</span>` : ""}${best ? `<span class="done-tag">✓ Best ${best.best.toLocaleString("en-GB")}</span>` : ""}
        <div class="cover" ${cover}>${c.cover ? "" : `<span class="emoji">${c.art.emoji}</span>`}</div>
        <div class="body"><h3>${esc(c.title)}</h3><div class="region">📍 ${esc(c.region)}</div>
          <div class="meta"><span class="chip">${esc(gname)}</span><span class="chip lv">CEFR ${esc(c.level)}</span><span class="chip">⏱ ~${c.minutes} min</span></div>
          <div class="go">${soon ? `<button class="btn ghost sm" disabled style="color:var(--ink2);width:100%">🔒 Coming soon</button>` : `<button class="btn" data-play="${c.id}"><span class="tri"></span>PLAY</button>`}</div>
        </div></article>`;
    }).join("") : `<p class="lead">More stories are coming soon to this world!</p>`;
  }

  /* ======================================================
     STORY MODE
     ====================================================== */
  function playStory(id) {
    const st = NQ.stories[id]; if (!st) return;
    if (S.run && S.run.storyId === id && S.run.read) { S.story = st; return goHub(); }
    S.story = st; newRun(st); S.page = 0; SFX("page"); renderStory();
  }
  function sceneHTML(sc) {
    const fxN = { stars: 18, sparkle: 14, fireflies: 12, rain: 40 };
    let h = sc.fit === "contain"
      ? `<div class="scene fit-contain t-${sc.tone || "day"}"><div class="bg blur" style="background-image:url('${sc.art}')"></div><div class="bg sharp" role="img" aria-label="${esc(sc.alt || "")}" style="background-image:url('${sc.art}')"></div>`
      : `<div class="scene t-${sc.tone || "day"}"><div class="bg" style="background-image:url('${sc.art || sc.bg}')"></div>`;
    if (sc.tone === "storm") h += `<div class="flash"></div>`;
    (sc.fx || []).forEach((f) => {
      if (f === "river") { h += `<div class="fx river"></div>`; return; }
      let dots = ""; const n = fxN[f] || 10;
      for (let i = 0; i < n; i++) dots += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(f === "rain" ? -10 : Math.random() * 70).toFixed(1)}%;animation-delay:${(Math.random() * 3).toFixed(2)}s;animation-duration:${f === "rain" ? (0.6 + Math.random() * 0.5).toFixed(2) + "s" : ""}"></i>`;
      h += `<div class="fx ${f}">${dots}</div>`;
    });
    h += `<div class="shade"></div>`;
    (sc.actors || []).forEach((a, i) => {
      const spots = a.fx === "spots" ? `<div class="spots">${[[36, 44], [58, 47], [47, 58], [30, 66], [64, 70], [52, 80], [40, 88]].map(([x, y], k) => `<i style="left:${x}%;top:${y}%;animation-delay:${k * 0.3}s"></i>`).join("")}</div>` : "";
      h += `<div class="actor ${a.pos} ${a.float ? "float" : ""}" style="height:${a.size || 75}%;animation-delay:${i * 0.25}s"><img src="${a.img}" alt="">${spots}</div>`;
    });
    return h + `</div>`;
  }
  function pageTextHTML(p) {
    const vocab = S.story.vocabulary || [];
    const forms = [];
    (p.vocab || []).forEach((w) => { const v = vocab.find((x) => x.word === w); (v ? v.forms || [v.word] : [w]).forEach((f) => forms.push({ f, w: v ? v.word : w })); });
    const used = new Set();
    return splitSentences(p.text).map((s, si) => {
      let h = esc(s);
      forms.forEach((o, k) => {
        if (used.has(o.w)) return;
        const re = new RegExp("\\b(" + o.f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")\\b", "i");
        if (re.test(h)) { h = h.replace(re, `\u0001${k}\u0002$1\u0003`); used.add(o.w); }
      });
      h = h.replace(/\u0001(\d+)\u0002([^\u0003]*)\u0003/g, (m, k, txt) => `<button class="vword" data-vw="${esc(forms[+k].w)}">${txt}</button>`);
      return `<span class="sent" data-s="${si}">${h}</span>`;
    }).join(" ");
  }
  function renderStory() {
    const st = S.story, n = st.pages.length, box = $("#storyBox");
    setTheme(st.genre); setCrumb([NQ.GENRES.find((g) => g.id === st.genre).name, st.title]);
    if (S.page >= n) {
      S.run.read = true;
      const back = Object.keys(S.run.gems).length > 0;
      box.innerHTML = `<div class="unlocked">
        <img src="img/chest-open.webp" alt="">
        <h2>STORY UNLOCKED!</h2><p>Ready to investigate the story?</p>
        <div class="row"><button class="btn green big" data-act="hub"><span class="tri"></span>${back ? "Back to the Quest Map" : "Start the Quest"}</button></div>
        <div class="row" style="margin-top:14px">
          <button class="listen" data-act="listenAll"><img src="img/ic-sound.webp" alt="">Listen to the whole story</button>
          <button class="btn ghost sm" data-act="reread">📖 Read again</button></div></div>`;
      show("s-story"); confetti(60); SFX("unlock"); return;
    }
    const p = st.pages[S.page];
    box.innerHTML = `
      <div class="row" style="justify-content:space-between;margin-bottom:12px;align-items:center">
        <button class="btn ghost sm" data-act="${S.run.read ? "hub" : "library"}">← ${S.run.read ? "Quest Map" : "Stories"}</button>
        <h1 class="title-xl" style="font-size:clamp(1.2rem,3vw,2rem);margin:0">${esc(st.title)}</h1>
        <span class="pill">📍 ${esc(st.region)}</span>
      </div>
      <div class="book">
        ${sceneHTML(p.scene || {})}
        <div class="page">
          <div class="ptop"><span class="pnum">PAGE ${S.page + 1} OF ${n}</span>
            <button class="listen" data-act="listenPage" id="listenBtn"><img src="img/ic-sound.webp" alt="">LISTEN</button></div>
          <p class="ptext" id="ptext">${pageTextHTML(p)}</p>
          ${(p.vocab || []).length ? `<p class="vocab-tip">💜 Tap the purple words to see their meaning and hear them.</p>` : ""}
          <div class="dots" aria-hidden="true">${st.pages.map((_, i) => `<i class="${i === S.page ? "on" : ""}"></i>`).join("")}</div>
          <div class="pnav">
            <button class="btn purple" data-act="prevPage" ${S.page === 0 ? "disabled" : ""}>◀ Previous</button>
            <button class="btn orange" data-act="nextPage">${S.page === n - 1 ? "Finish ✨" : "Next ▶"}</button>
          </div>
        </div>
      </div>`;
    if (!$("#s-story").classList.contains("active")) show("s-story"); else { Speech.stop(); window.scrollTo({ top: 0 }); }
  }
  function listenPage() {
    const btn = $("#listenBtn"); if (!btn) return;
    if (btn.classList.contains("playing")) { Speech.stop(); return; }
    const sents = splitSentences(S.story.pages[S.page].text);
    const spans = $$("#ptext .sent");
    btn.classList.add("playing"); btn.lastChild.textContent = "STOP";
    Speech.speak(sents, {
      fromUser: true,
      onPart: (i) => spans.forEach((s, k) => s.classList.toggle("reading", k === i)),
      onEnd: () => { spans.forEach((s) => s.classList.remove("reading")); if (btn.isConnected) { btn.classList.remove("playing"); btn.lastChild.textContent = "LISTEN"; } },
    });
  }
  function listenAll(btn) {
    if (btn.classList.contains("playing")) { Speech.stop(); return; }
    btn.classList.add("playing");
    Speech.speak(S.story.pages.flatMap((p) => splitSentences(p.text)), { fromUser: true, onEnd: () => btn.classList.remove("playing") });
  }
  function storyDrawer(ref) {
    Speech.stop();
    const d = overlay(`<button class="x" data-close aria-label="Close"><img src="img/ic-cross.webp" alt=""></button>
      <h2>📜 ${esc(S.story.title)}</h2>
      <div class="row" style="justify-content:flex-start;margin:8px 0 12px"><button class="listen" data-act="listenAll"><img src="img/ic-sound.webp" alt="">Listen to the story</button></div>
      ${S.story.pages.map((p, i) => `<p data-pg="${i + 1}" class="${ref === i + 1 ? "focus" : ""}"><span class="pn">PAGE ${i + 1}</span>${esc(p.text)}</p>`).join("")}`, "drawer");
    d.style.background = "rgba(4,8,24,.5)";
    d.addEventListener("click", (e) => { if (e.target === d) closeOverlay(); });
    if (ref) { const el = $(`[data-pg="${ref}"]`, d); if (el) setTimeout(() => el.scrollIntoView({ block: "center", behavior: "smooth" }), 250); }
  }

  /* ======================================================
     HUB (Quest Map)
     ====================================================== */
  const NODE_POS = [[12, 62], [31, 32], [50, 64], [69, 32], [88, 55]];
  function goHub() {
    const st = S.story, r = S.run; S.ch = null;
    setTheme(st.genre); setCrumb([NQ.GENRES.find((g) => g.id === st.genre).name, st.title, "Quest Map"]);
    const n = Object.keys(r.gems).length, allGems = n === 4;
    const nextKey = (CHALLENGES.find((c) => !r.gems[c.key]) || {}).key;
    const nodes = CHALLENGES.map((c, i) => {
      const done = r.gems[c.key];
      return `<button class="node ${done ? "done" : ""} ${c.key === nextKey ? "pulse" : ""}" data-ch="${c.key}" style="left:${NODE_POS[i][0]}%;top:${NODE_POS[i][1]}%">
        <span class="disc">${c.icon}<img class="num" src="${c.num}" alt=""></span>
        <span class="label">${c.name}</span>
        <span class="state">${done ? `✓ ${r.scores[c.key].toLocaleString("en-GB")} pts · replay` : c.key === nextKey ? "▶ Start here" : `${st.challenges[c.key].length} tasks`}</span>
      </button>`;
    }).join("") + `<button class="node final ${allGems ? (r.final ? "done" : "pulse") : "locked"}" data-ch="final" style="left:${NODE_POS[4][0]}%;top:${NODE_POS[4][1]}%">
        <span class="disc"><img src="img/${r.final ? "chest-open" : "chest"}.webp" alt="">${allGems ? "" : `<img class="lockimg" src="img/lock.webp" alt="">`}</span>
        <span class="label">🌟 Master the Story</span>
        <span class="state">${r.final ? "✓ Completed" : allGems ? "▶ Unlocked!" : "Collect 4 gems"}</span></button>`;
    $("#hubBox").innerHTML = `
      <div class="hub-top">
        <div class="hub-title"><span class="skill">Quest Map · ${esc(S.name)}</span><h2>${esc(st.title)}</h2>
          <p>Complete each challenge to earn a <b>Story Gem</b>. You may play them in any order.</p>
          <div class="row" style="justify-content:flex-start;margin-top:12px">
            <button class="btn ghost sm" data-act="reread">📖 Read the story again</button>
            <button class="btn ghost sm" data-act="drawer">📜 Story text</button>
            ${r.final ? `<button class="btn orange sm" data-act="results">🏆 My results</button>` : ""}
          </div></div>
        <div><div class="gemring">
          <img class="core" src="img/orb.webp" alt="">
          ${CHALLENGES.map((c, i) => `<span class="slot s${i} ${r.gems[c.key] ? "got" : ""}" title="${c.gem}"><img src="${c.gemImg}" alt="${c.gem}${r.gems[c.key] ? " (collected)" : ""}"></span>`).join("")}
        </div><div class="gemcount">🌙 Story Gems: ${n}/4</div></div>
      </div>
      <div class="map">
        <svg viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true">
          <path d="M12 27.3 C20 27 24 14 31 14.1 S43 28.2 50 28.2 S62 14.1 69 14.1 S82 24 88 24.2" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="6" vector-effect="non-scaling-stroke" stroke-linecap="round"/>
          <path d="M12 27.3 C20 27 24 14 31 14.1 S43 28.2 50 28.2 S62 14.1 69 14.1 S82 24 88 24.2" fill="none" stroke="#f0c35a" stroke-width="4" stroke-dasharray="2 10" vector-effect="non-scaling-stroke" stroke-linecap="round"/>
        </svg>${nodes}</div>`;
    show("s-hub");
    if (allGems && !r.unlockShown) { r.unlockShown = true; setTimeout(unlockAnim, 400); }
  }
  function unlockAnim() {
    const d = [["0px", "-140px"], ["140px", "0px"], ["0px", "140px"], ["-140px", "0px"]];
    overlay(`<div class="rays"></div><div class="unlock-ring"><img class="core" src="img/orb.webp" alt="">
      ${CHALLENGES.map((c, i) => `<img class="g" src="${c.gemImg}" alt="" style="--dx:${d[i][0]};--dy:${d[i][1]};animation-delay:${0.2 + i * 0.15}s">`).join("")}</div>
      <div class="moons">🌙🌙🌙🌙</div>
      <h2>THE FINAL STORY CHALLENGE IS UNLOCKED!</h2><p>You collected all four Story Gems. Now prove you can <b>master the story</b>.</p>
      <div class="row"><button class="btn green big" data-go="final"><span class="tri"></span>Master the Story</button><button class="btn ghost" data-close>Later</button></div>`, "award");
    SFX("unlock"); setTimeout(() => SFX("gem"), 1500); setTimeout(() => confetti(100), 1600);
  }

  /* ======================================================
     CHALLENGES
     ====================================================== */
  function startChallenge(key) {
    const r = S.run;
    if (key === "final" && Object.keys(r.gems).length < 4) { SFX("wrong"); toast("🔒 Collect all four Story Gems to unlock <b>Master the Story</b>."); return; }
    const tasks = key === "final" ? S.story.final : S.story.challenges[key];
    S.ch = { key, tasks, idx: -1, score: 0, base: 0, max: 0 };
    const info = chInfo(key);
    setCrumb([S.story.title, info.name]);
    renderBriefing(); show("s-challenge");
  }
  function chTop() {
    const c = S.ch, info = chInfo(c.key), n = c.tasks.length, i = Math.max(0, c.idx);
    const pct = c.idx < 0 ? 0 : Math.round((i / n) * 100);
    return `<div class="ch-top"><div class="ch-name"><img src="${info.gemImg}" alt="">${info.icon} ${info.name}</div>
      <div class="prog" aria-label="Progress"><b style="width:${pct}%"></b><span>${c.idx < 0 ? "Briefing" : `Task ${i + 1} of ${n}`}</span><img src="img/star-gold.webp" alt=""></div>
      ${streakPill()}</div>`;
  }
  const mult = (s) => (s >= 8 ? 4 : s >= 5 ? 3 : s >= 3 ? 2 : 1);
  function streakPill() { const s = S.run.streak, m = mult(s); return `<span class="pill streak ${m > 1 ? "hot" : ""}" id="streak">🔥 ${m > 1 ? "×" + m : "Streak " + s}</span>`; }
  function updStreak(bump) { const el = $("#streak"); if (!el) return; el.outerHTML = streakPill(); if (bump) { const n = $("#streak"); n.classList.remove("hot"); void n.offsetWidth; if (mult(S.run.streak) > 1) n.classList.add("hot"); } }

  function wordBtn(w, meaning) {
    return `<button class="bcard wordbtn" data-say="${esc(w)}"><span class="spk"><img src="img/ic-sound.webp" alt=""></span><span><b>${esc(w)}</b>${meaning ? `<span class="ex" style="font-family:var(--body);font-weight:700">${esc(meaning)}</span>` : ""}</span></button>`;
  }
  function renderBriefing() {
    const c = S.ch, st = S.story, info = chInfo(c.key);
    let body = "";
    if (c.key === "word") {
      body = `<div class="brief-grid">
        <div class="bcard"><b>1 · Read the whole sentence</b>Don't stop at the new word.</div>
        <div class="bcard"><b>2 · Find clues</b>What happens before and after the word?</div>
        <div class="bcard"><b>3 · Think about the story</b>Which meaning makes sense here?</div></div>
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px"><h3 style="color:var(--ink)">📘 Story Vocabulary</h3>
          <button class="listen" data-act="listenVocab"><img src="img/ic-sound.webp" alt="">Listen to vocabulary</button></div>
        <div class="brief-grid">${st.vocabulary.map((v) => wordBtn(v.word, v.meaning)).join("")}</div>`;
    } else if (c.key === "structure") {
      const s = st.structure || {};
      const parts = [["orientation", "Orientation", "Who? Where? When?", s.orientation], ["complication", "Complication", "What problem happened?", s.complication], ["main conflict", "Main Conflict", "What is the central problem?", { summary: st.mainConflict }], ["resolution", "Resolution", "How was the problem solved?", s.resolution], ["ending / coda", "Ending / Coda", "What happened afterward? What is the lesson?", s.coda]];
      body = `<p>A narrative text has a <b>generic structure</b>. Detectives use it to understand the plot.</p><div class="brief-grid">${parts.map(([k, t, q]) => `<div class="bcard"><img src="${STRUCT_IMG[k]}" alt="${t}"><b>${t}</b>${q}</div>`).join("")}</div>
        <p class="obj">🔍 Tip: Words like <b>“But”</b>, <b>“One day”</b> or <b>“something strange happened”</b> often signal a complication.</p>`;
    } else if (c.key === "character") {
      const ch = st.characters.find((x) => x.id === "soldier") || st.characters[1] || st.characters[0];
      body = `<div class="flow"><span>🎭 CHARACTER</span><i>→</i><span>✨ TRAIT</span><i>→</i><span>📜 EVIDENCE</span></div>
        <div class="bcard" style="margin-bottom:14px;display:flex;gap:12px;align-items:center">${ch.img ? `<img src="${ch.img}" alt="" style="width:90px;margin:0;border-radius:12px">` : ""}
          <span><b>Example: ${esc(ch.name)} → ${esc(ch.traits[0])}</b><span class="ex">Evidence: “${esc(ch.evidence)}”</span></span></div>
        <h3 style="color:var(--ink);margin-bottom:8px">Personality adjectives</h3>
        <div class="brief-grid">${(st.traitWords || []).map((v) => wordBtn(v.word, v.meaning)).join("")}</div>`;
    } else if (c.key === "grammar") {
      const g = st.grammarExamples || {};
      body = `<p>Narratives tell about the <b>past</b>, so they use the <b>simple past tense</b>.</p>
        <table class="rules"><tbody>
          <tr><td>Regular verbs (+ed)</td><td>${(g.regular || []).map(esc).join(" · ")}</td></tr>
          <tr><td>Irregular verbs</td><td>${(g.irregular || []).map(esc).join(" · ")}</td></tr>
          <tr><td>was (I / he / she / it)</td><td>${esc(g.was || "")}</td></tr>
          <tr><td>were (you / we / they)</td><td>${esc(g.were || "")}</td></tr>
          <tr><td>Negative: didn’t + base verb</td><td>${esc(g.negative || "")}</td></tr>
          <tr><td>Question: Did + subject + base verb?</td><td>${esc(g.question || "")}</td></tr>
        </tbody></table>`;
    } else {
      body = `<img src="img/chest.webp" alt="" style="width:160px;margin:0 auto 10px">
        <p>This final quest mixes <b>vocabulary</b>, <b>story structure</b>, <b>sequence</b>, <b>characters</b>, <b>evidence</b>, <b>past tense</b>, <b>inference</b> and the <b>moral</b> of the story.</p>
        <p class="obj">⚠️ Questions get harder as you go. Some answers are not written directly in the text — you must <b>infer</b> them. Think like a detective!</p>`;
    }
    $("#chBox").innerHTML = chTop() + `<div class="task brief"><span class="skill">Mission Briefing</span>
      <h2>${info.icon} ${info.name}</h2><p class="obj">🎯 ${esc(info.objective)}</p>${body}</div>
      <div class="actions"><div class="l"><button class="btn ghost sm" data-act="hub">← Quest Map</button></div>
      <div class="r"><button class="btn green big" data-act="nextTask"><span class="tri"></span>Begin (${c.tasks.length} tasks)</button></div></div>`;
  }

  /* ---------- task rendering ---------- */
  function nextTask() {
    const c = S.ch; c.idx++;
    if (c.idx >= c.tasks.length) return finishChallenge();
    const task = c.tasks[c.idx];
    S.t = { task, attempts: 0, hint: false, done: false, handler: null };
    const quote = task.quote ? `<div class="quote"><span class="q">${esc(task.quote)}</span><button class="say" data-say="${esc(task.quote)}" aria-label="Listen"><img src="img/ic-sound.webp" alt=""></button></div>` : "";
    $("#chBox").innerHTML = chTop() + `<div class="task" id="task">
        <span class="qnum">${c.idx + 1} / ${c.tasks.length}</span><span class="skill">${esc(task.skill || "")}</span>
        ${quote}${task.image ? `<img class="qimg" src="${task.image}" alt="">` : ""}
        <div class="prompt">${task.prompt}</div>
        <div id="tbody"></div>
        <div id="fb"></div>
      </div>
      <div class="actions">
        <div class="l"><button class="btn purple sm" data-act="hint" id="hintBtn">💡 Hint</button>
          <button class="btn ghost sm" data-act="drawer">📜 Story</button></div>
        <div class="r"><button class="btn sm" id="checkBtn" data-act="check" hidden disabled>✓ Check</button>
          <button class="btn orange" id="nextBtn" data-act="nextTask" hidden>${c.idx === c.tasks.length - 1 ? "Finish ✨" : "Next ▶"}</button></div>
      </div>`;
    const h = TYPES[task.type]; if (!h) { $("#tbody").textContent = "Unknown task type: " + task.type; return; }
    S.t.handler = h(S.t, $("#tbody"), API) || {};
    if (S.t.handler.check) { $("#checkBtn").hidden = false; }
    window.scrollTo({ top: 0 });
  }
  const PRAISE = { 100: ["Excellent!", "Brilliant!", "Perfect!", "Amazing detective work!", "Superb!"], 70: ["Great job!", "Well done — you got it!", "Nice thinking!"], 40: ["Good job! You found it.", "You did it!", "Well done for not giving up!"] };
  const TRY = ["Read the text again and look for a clue.", "Try again! Think about what happened in the story.", "Look carefully at the words around it.", "Check the story for evidence, then try again."];
  function guideImg(kind) { const g = S.story.guides || {}; return kind === "hint" ? g.hint || S.story.characters.slice(-1)[0].img : g.good || S.story.characters[0].img; }
  function feedback(kind, title, msg, withRef) {
    const t = S.t.task;
    const ref = withRef && t.ref ? `<button class="lnk" data-act="drawer">📜 Look at page ${t.ref} of the story</button>` : "";
    $("#fb").innerHTML = `<div class="fb ${kind}" role="status"><img src="${guideImg(kind)}" alt=""><div class="m">${title ? `<b class="h">${title}</b>` : ""}${msg || ""}${ref ? "<br>" + ref : ""}</div></div>`;
    live((title || "") + " " + (msg || ""));
  }
  const API = {
    setCheck(on) { const b = $("#checkBtn"); if (b) b.disabled = !on; },
    wrong(msg) {
      const T = S.t; if (T.done) return;
      T.attempts++; S.run.streak = 0; updStreak(); SFX("wrong");
      let m = msg || pick(TRY);
      if (T.attempts >= 2 && !T.hint && T.task.hint) { T.hint = true; m += `<br>💡 <b>Hint:</b> ${T.task.hint}`; if (T.handler.onHint) T.handler.onHint(); }
      feedback(T.attempts >= 2 ? "hint" : "try", T.attempts === 1 ? "Not quite." : "Keep going — you can do it!", m, true);
    },
    right() {
      const T = S.t; if (T.done) return; T.done = true;
      const base = !T.hint && T.attempts === 0 ? 100 : !T.hint && T.attempts === 1 ? 70 : 40;
      if (base === 100) S.run.streak++;
      S.run.bestStreak = Math.max(S.run.bestStreak, S.run.streak);
      const m = base === 100 ? mult(S.run.streak) : 1, pts = base * m;
      S.ch.score += pts; S.ch.base += base; S.ch.max += 100;
      SFX("correct"); updStreak(true); updScore();
      const p = document.createElement("div"); p.className = "points"; p.textContent = `+${pts}${m > 1 ? `  🔥×${m}` : ""}`;
      document.body.appendChild(p); setTimeout(() => p.remove(), 1400);
      feedback("good", pick(PRAISE[base]), T.task.explain || "");
      $("#hintBtn").disabled = true; const cb = $("#checkBtn"); if (cb) cb.hidden = true;
      const nb = $("#nextBtn"); nb.hidden = false; setTimeout(() => nb.focus({ preventScroll: true }), 50);
      const pr = $(".prog b"); if (pr) pr.style.width = Math.round(((S.ch.idx + 1) / S.ch.tasks.length) * 100) + "%";
      if (innerWidth < 820) setTimeout(() => $("#fb").scrollIntoView({ block: "center", behavior: "smooth" }), 150);
    },
  };
  function showHint() {
    const T = S.t; if (!T || T.done) return;
    T.hint = true; SFX("hint");
    if (T.handler.onHint) T.handler.onHint();
    feedback("hint", "Look at the text for a clue.", T.task.hint || "Read the story again carefully.", true);
  }

  /* ---------- drag & tap engine ---------- */
  function dragify(el, { onTap, onDrop, can }) {
    let pid = null, sx = 0, sy = 0, dragging = false, ghost = null, hover = null;
    const zoneAt = (x, y) => { const e = document.elementFromPoint(x, y); return e ? e.closest("[data-drop]") : null; };
    el.addEventListener("pointerdown", (e) => {
      if (e.button > 0 || (can && !can())) return;
      pid = e.pointerId; sx = e.clientX; sy = e.clientY; dragging = false;
      try { el.setPointerCapture(pid); } catch (_) {}
    });
    el.addEventListener("pointermove", (e) => {
      if (pid !== e.pointerId) return;
      if (!dragging && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) {
        dragging = true; ghost = el.cloneNode(true); ghost.classList.add("dragghost"); ghost.classList.remove("sel");
        ghost.style.width = el.offsetWidth + "px"; document.body.appendChild(ghost); el.classList.add("ghosted"); closePop();
      }
      if (dragging) {
        e.preventDefault();
        ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px";
        const z = zoneAt(e.clientX, e.clientY);
        if (z !== hover) { if (hover) hover.classList.remove("target"); hover = z; if (z) z.classList.add("target"); }
        if (e.clientY < 70) window.scrollBy(0, -14); else if (e.clientY > innerHeight - 70) window.scrollBy(0, 14);
      }
    });
    const end = (e) => {
      if (pid !== e.pointerId) return; pid = null;
      if (dragging) {
        const z = e.type === "pointercancel" ? null : zoneAt(e.clientX, e.clientY);
        ghost.remove(); ghost = null; el.classList.remove("ghosted"); if (hover) hover.classList.remove("target"); hover = null; dragging = false;
        if (z) onDrop(z);
      } else if (e.type === "pointerup") onTap();
    };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
    el.addEventListener("click", (e) => { if (e.detail === 0) onTap(); }); // keyboard
  }

  /* ---------- task types ---------- */
  const TYPES = {};
  const letters = "ABCDEFGH";

  TYPES.mcq = (T, box, api) => {
    const q = T.task;
    let order = q.options.map((o, i) => i);
    if (!q.structureOptions) order = shuffle(order);
    const cls = q.structureOptions ? "structs" : q.layout === "portraits" ? "portraits" : "";
    box.innerHTML = `<div class="opts ${cls}">${order.map((i, k) => {
      const o = q.options[i];
      let inner;
      if (q.structureOptions) inner = `<img src="${STRUCT_IMG[String(o).toLowerCase()]}" alt=""><span class="t">${esc(o)}</span>`;
      else if (typeof o === "object") inner = `<img src="${o.img}" alt=""><span>${esc(o.text)}</span>`;
      else inner = `<span>${esc(o)}</span>`;
      return `<button class="opt" data-i="${i}"><span class="key">${letters[k]}</span>${inner}</button>`;
    }).join("")}</div>`;
    $$(".opt", box).forEach((b) => b.addEventListener("click", () => {
      if (T.done || b.disabled) return;
      const i = +b.dataset.i;
      if (i === q.answer) { b.classList.add("right"); $$(".opt", box).forEach((x) => (x.disabled = true)); api.right(); }
      else { b.classList.add("wrong"); b.disabled = true; api.wrong(q.feedback && q.feedback[i]); }
    }));
  };

  TYPES.multi = (T, box, api) => {
    const q = T.task, need = q.pick || 2, sel = new Set(), bad = new Set();
    const order = shuffle(q.options.map((_, i) => i));
    box.innerHTML = `<p class="multi-note">✌️ Choose <b>${need}</b> answers, then press <b>CHECK</b>.</p><div class="opts">${order.map((i, k) => `<button class="opt" data-i="${i}"><span class="key">${letters[k]}</span>${esc(q.options[i])}</button>`).join("")}</div>`;
    const sync = () => { $$(".opt", box).forEach((b) => b.classList.toggle("sel", sel.has(+b.dataset.i))); api.setCheck(sel.size === need); };
    $$(".opt", box).forEach((b) => b.addEventListener("click", () => {
      if (T.done) return; const i = +b.dataset.i; if (bad.has(i)) return;
      if (sel.has(i)) sel.delete(i); else { if (sel.size >= need) return toast(`You can choose only ${need}. Tap one again to remove it.`); sel.add(i); }
      SFX("click"); sync();
    }));
    return {
      check() {
        const good = [...sel].filter((i) => q.answer.includes(i));
        if (good.length === need) { $$(".opt", box).forEach((b) => { b.disabled = true; if (sel.has(+b.dataset.i)) b.classList.add("right"); }); return api.right(); }
        [...sel].filter((i) => !q.answer.includes(i)).forEach((i) => { bad.add(i); sel.delete(i); const b = $(`.opt[data-i="${i}"]`, box); b.classList.remove("sel"); b.classList.add("wrong"); b.disabled = true; });
        sync();
        api.wrong(good.length ? `One of your choices is correct — I kept it for you. Find one more.` : `Neither choice is correct. Look for words the text uses to describe the character.`);
      },
    };
  };

  TYPES.sort = (T, box, api) => {
    const q = T.task, cap = q.capacity || 0, layout = q.layout || "";
    const cards = shuffle(q.cards.map((c, i) => ({ ...c, i })));
    const place = {}, locked = {}; let sel = null;
    const binHTML = (b) => `<div class="bin" data-drop="${b.id}" data-bin="${b.id}">
      ${b.kicker ? `<span class="kick">${esc(b.kicker)}</span>` : ""}
      <div class="bh">${b.img ? `<img src="${b.img}" alt="">` : ""}<span>${esc(b.label)}${b.sub ? `<span class="sub">${esc(b.sub)}</span>` : ""}</span></div>
      <div class="blist" data-drop="${b.id}"></div></div>`;
    box.innerHTML = `<div class="tray" data-drop="tray" id="tray"></div><div class="bins ${layout}">${q.bins.map(binHTML).join("")}</div>`;
    const chip = (c) => {
      const b = document.createElement("button");
      b.className = "chipc" + (c.text.split(" ").length <= 2 ? " word" : "") + (locked[c.i] ? " ok" : "") + (sel === c.i ? " sel" : "");
      b.textContent = c.text; b.dataset.i = c.i;
      if (!locked[c.i]) dragify(b, { can: () => !T.done, onTap: () => tap(c.i), onDrop: (z) => drop(c.i, z.dataset.drop) });
      return b;
    };
    function render() {
      const tray = $("#tray", box); tray.innerHTML = "";
      cards.filter((c) => !place[c.i]).forEach((c) => tray.appendChild(chip(c)));
      tray.classList.toggle("empty", !tray.children.length);
      $$(".blist", box).forEach((l) => { l.innerHTML = ""; cards.filter((c) => place[c.i] === l.dataset.drop).forEach((c) => l.appendChild(chip(c))); });
      $$(".bin", box).forEach((b) => b.classList.toggle("armed", sel !== null));
      api.setCheck(cards.every((c) => place[c.i]));
    }
    function tap(i) {
      if (T.done || locked[i]) return;
      if (place[i]) { place[i] = null; sel = null; SFX("place"); }
      else { sel = sel === i ? null : i; SFX("click"); }
      render();
    }
    function put(i, bin) {
      if (bin === "tray") { place[i] = null; sel = null; render(); return; }
      if (cap) {
        const occ = cards.find((c) => place[c.i] === bin && c.i !== i);
        if (occ) { if (locked[occ.i]) { toast("That place is already solved ✓"); return; } place[occ.i] = null; }
      }
      place[i] = bin; sel = null; SFX("place"); render();
    }
    function drop(i, bin) { if (!T.done) put(i, bin); }
    box.addEventListener("click", (e) => {
      if (T.done || sel === null || e.target.closest(".chipc")) return;
      const b = e.target.closest("[data-bin]"); if (b) put(sel, b.dataset.bin);
    });
    render();
    return {
      check() {
        const wrong = [];
        cards.forEach((c) => { if (place[c.i] === c.bin) locked[c.i] = true; else { wrong.push(c.i); place[c.i] = null; } });
        render();
        if (!wrong.length) { api.right(); return; }
        $$(".chipc", $("#tray", box)).forEach((b) => b.classList.add("bad"));
        const n = cards.length - wrong.length;
        api.wrong(`${n} of ${cards.length} ${n === 1 ? "is" : "are"} correct ✓. The others went back to the top — try again!`);
      },
    };
  };

  TYPES.order = (T, box, api) => {
    const q = T.task, n = q.items.length, inline = !!q.inline;
    const pool = shuffle(q.items.concat(q.extras || []).map((t, i) => ({ t, i })));
    let tries = 0; while (!inline && tries++ < 5 && pool.every((p, k) => p.i === k)) pool.reverse();
    const slots = Array(n).fill(null), locked = Array(n).fill(false);
    box.innerHTML = `<div class="slots ${inline ? "inline" : ""}" id="slots"></div><div class="tray" data-drop="tray" id="tray"></div>`;
    const inSlot = (pi) => slots.indexOf(pi);
    const chip = (p, k) => {
      const b = document.createElement("button");
      b.className = "chipc" + (inline ? " word" : "") + (k >= 0 && locked[k] ? " ok" : "");
      b.textContent = p.t;
      if (!(k >= 0 && locked[k])) dragify(b, { can: () => !T.done, onTap: () => tap(p.i), onDrop: (z) => drop(p.i, z.dataset.drop) });
      return b;
    };
    function render() {
      const sb = $("#slots", box); sb.innerHTML = "";
      slots.forEach((pi, k) => {
        const s = document.createElement("div"); s.className = "slot"; s.dataset.drop = "s" + k;
        s.innerHTML = `<span class="sn">${k + 1}</span>`;
        if (pi !== null) s.appendChild(chip(pool.find((p) => p.i === pi), k));
        sb.appendChild(s);
      });
      const tray = $("#tray", box); tray.innerHTML = "";
      pool.filter((p) => inSlot(p.i) < 0).forEach((p) => tray.appendChild(chip(p, -1)));
      tray.classList.toggle("empty", !tray.children.length && !(q.extras || []).length);
      api.setCheck(slots.every((x) => x !== null));
    }
    function tap(pi) {
      if (T.done) return; const k = inSlot(pi);
      if (k >= 0) { if (locked[k]) return; slots[k] = null; }
      else { const e = slots.findIndex((x, j) => x === null && !locked[j]); if (e < 0) return toast("All places are full. Tap a card to take it out."); slots[e] = pi; }
      SFX("place"); render();
    }
    function drop(pi, target) {
      if (T.done) return; const from = inSlot(pi);
      if (target === "tray") { if (from >= 0 && !locked[from]) slots[from] = null; render(); return; }
      const k = +target.slice(1); if (locked[k]) return toast("That step is already correct ✓");
      const occ = slots[k];
      if (from >= 0) { slots[from] = occ; } // swap
      slots[k] = pi; SFX("place"); render();
    }
    render();
    return {
      check() {
        let bad = 0;
        slots.forEach((pi, k) => { if (locked[k]) return; const p = pool.find((x) => x.i === pi); if (p && p.t === q.items[k]) locked[k] = true; else { slots[k] = null; bad++; } });
        render();
        if (!bad) return api.right();
        const good = n - bad;
        api.wrong(inline ? `${good} of ${n} ${good === 1 ? "word is" : "words are"} in the right place ✓. Try the others again.` : `${good} of ${n} ${good === 1 ? "event is" : "events are"} in the right place ✓. The others went back — try again!`);
      },
    };
  };

  TYPES.verbs = (T, box, api) => {
    const q = T.task, ok = {};
    const norm = (s) => s.trim().toLowerCase().replace(/[’`]/g, "'");
    box.innerHTML = `<div class="verbs">${q.verbs.map((v, i) => `<div class="vrow" data-i="${i}"><button class="say" data-say="${esc(v.base)}" aria-label="Listen to ${esc(v.base)}"><img src="img/ic-sound.webp" alt=""></button>
      <span class="base">${esc(v.base)}</span><span class="arrow">→</span>
      <input type="text" inputmode="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Past form of ${esc(v.base)}"></div>`).join("")}</div>`;
    const inputs = $$("input", box);
    const sync = () => api.setCheck(inputs.every((x, i) => ok[i] || x.value.trim()));
    inputs.forEach((x, i) => {
      x.addEventListener("input", sync);
      x.addEventListener("keydown", (e) => { if (e.key === "Enter") { const nx = inputs.slice(i + 1).find((y, k) => !ok[i + 1 + k]); if (nx) nx.focus(); else if (!$("#checkBtn").disabled) this_.check(); } });
    });
    const this_ = {
      check() {
        let bad = 0;
        q.verbs.forEach((v, i) => {
          if (ok[i]) return;
          const row = $(`.vrow[data-i="${i}"]`, box), inp = inputs[i];
          if (norm(inp.value) === v.past) { ok[i] = true; row.classList.add("ok"); inp.readOnly = true; }
          else { bad++; row.classList.remove("bad"); void row.offsetWidth; row.classList.add("bad"); }
        });
        sync();
        if (!bad) return api.right();
        api.wrong(`${q.verbs.length - bad} of ${q.verbs.length} correct ✓. Check the spelling of the others.`);
      },
      onHint() { q.verbs.forEach((v, i) => { if (!ok[i]) inputs[i].placeholder = v.past[0] + " " + "_ ".repeat(v.past.length - 1).trim(); }); },
    };
    return this_;
  };

  TYPES.fix = (T, box, api) => {
    const q = T.task, words = q.sentence.split(" ");
    let stage = 1;
    box.innerHTML = `<div class="fixline">${words.map((w, i) => `<button class="tok" data-i="${i}">${esc(w)}</button>`).join("")}</div><div id="stage2"></div>`;
    $$(".tok", box).forEach((b) => b.addEventListener("click", () => {
      if (T.done || stage !== 1) return;
      const i = +b.dataset.i;
      if (i === q.wrong) {
        stage = 2; b.classList.add("found"); SFX("place");
        feedback("hint", "Good eye! You found the mistake.", "Now choose the correct form.");
        const order = shuffle(q.options.map((_, k) => k));
        $("#stage2", box).innerHTML = `<p class="prompt" style="font-size:1.1rem">${q.stage2 || "Choose the correct form:"}</p><div class="opts">${order.map((k, j) => `<button class="opt" data-k="${k}"><span class="key">${letters[j]}</span>${esc(q.options[k])}</button>`).join("")}</div>`;
        $$(".opt", box).forEach((o) => o.addEventListener("click", () => {
          if (T.done || o.disabled) return; const k = +o.dataset.k;
          if (k === q.answer) {
            o.classList.add("right"); $$(".opt", box).forEach((x) => (x.disabled = true));
            const w = words[q.wrong], punct = (w.match(/[.,!?]+$/) || [""])[0];
            b.textContent = q.options[k] + punct; b.classList.remove("found"); b.classList.add("fixed");
            api.right();
          } else { o.classList.add("wrong"); o.disabled = true; api.wrong((q.feedback2 && q.feedback2[k]) || "Not that form. Try again!"); }
        }));
      } else {
        b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
        setTimeout(() => b.classList.remove("wrong"), 700);
        api.wrong(`“${esc(words[i].replace(/[.,!?]+$/, ""))}” is correct here. Look for another word — check the verbs.`);
      }
    }));
  };

  /* ---------- finishing ---------- */
  function finishChallenge() {
    const c = S.ch, r = S.run, info = chInfo(c.key);
    if (c.key === "final") {
      r.final = { score: c.score, base: c.base, max: c.max };
      S.ch = null; return goResults(true);
    }
    const firstTime = !r.gems[c.key];
    if (firstTime || c.score > r.scores[c.key]) { r.scores[c.key] = c.score; r.base[c.key] = c.base; r.max[c.key] = c.max; }
    r.gems[c.key] = true;
    const got = Object.keys(r.gems).length, score = c.score;
    S.ch = null; updScore();
    overlay(`<div class="rays"></div><img class="gem" src="${info.gemImg}" alt="">
      <h2>${firstTime ? `You earned the ${info.gem}!` : `${info.name} complete!`}</h2>
      <p>${info.icon} ${info.name} · <b>${score.toLocaleString("en-GB")}</b> points<br>🌙 Story Gems: ${got}/4</p>
      <div class="row"><button class="btn green big" data-act="hub"><span class="tri"></span>Back to the Quest Map</button></div>`, "award");
    SFX("gem"); confetti(50);
  }
  function tier(pct) { return pct >= 90 ? { img: "img/badge-excellent.webp", t: "Excellent!" } : pct >= 70 ? { img: "img/badge-great.webp", t: "Great!" } : { img: "img/badge-good.webp", t: "Good job!" }; }
  function goResults(fresh) {
    const r = S.run, st = S.story, tot = total();
    setCrumb([st.title, "Results"]);
    if (fresh) { const d = store.get("done", {}); if (!d[st.id] || d[st.id].best < tot) { d[st.id] = { best: tot }; store.set("done", d); } }
    const rows = CHALLENGES.map((c) => ({ c, s: r.scores[c.key], pct: r.max[c.key] ? Math.round((r.base[c.key] / r.max[c.key]) * 100) : 0, got: !!r.gems[c.key] }))
      .concat([{ c: FINAL, s: r.final ? r.final.score : 0, pct: r.final && r.final.max ? Math.round((r.final.base / r.final.max) * 100) : 0, got: !!r.final }]);
    const g = NQ.GENRES.find((x) => x.id === st.genre);
    $("#resBox").innerHTML = `<div class="results">
      <img class="trophy" src="img/chest-open.webp" alt="">
      <h2>🏆 QUEST COMPLETE!</h2>
      <div class="res-card">
        <div class="res-head">
          <div><small>Student name</small><b>${esc(S.name)}</b></div>
          <div><small>Story completed</small><b>${esc(st.title)}</b></div>
          <div><small>Genre</small><b>${g.icon} ${esc(g.name)}</b></div>
          <div><small>Best streak</small><b>🔥 ${r.bestStreak}</b></div>
        </div>
        <div class="total"><small>TOTAL SCORE</small>${tot.toLocaleString("en-GB")}</div>
        ${rows.map((x) => `<div class="srow"><img src="${x.c.gemImg}" alt=""><div><b>${x.c.scoreLabel} Score</b><div class="bar2"><b data-w="${x.pct}"></b></div></div><span class="sc">${x.s.toLocaleString("en-GB")}</span></div>`).join("")}
        <h3 style="margin:16px 0 4px;color:var(--ink)">Achievement Badges</h3>
        <div class="badges">${rows.map((x, i) => { const t = tier(x.pct); return `<div class="badge ${x.got ? "" : "no"}" style="animation-delay:${0.3 + i * 0.15}s"><img src="${x.got ? t.img : "img/badge-keep.webp"}" alt=""><b>${x.c.icon} ${x.c.badge}</b><small>${x.got ? t.t + " · " + x.pct + "% accuracy" : "Keep trying!"}</small></div>`; }).join("")}</div>
      </div>
      <div class="row">
        <button class="btn green" data-act="library">📚 Play another story</button>
        <button class="btn orange" data-act="tryAgain">↻ Try again</button>
        <button class="btn purple" data-act="worlds">🌍 Back to Story World</button>
      </div>
      <div class="row" style="margin-top:12px"><button class="btn ghost sm" data-act="hub">🗺️ Quest Map</button></div></div>`;
    show("s-results");
    setTimeout(() => $$(".bar2 b").forEach((b) => (b.style.width = b.dataset.w + "%")), 200);
    if (fresh) { SFX("unlock"); confetti(140); }
  }

  /* ======================================================
     EVENTS
     ====================================================== */
  document.addEventListener("click", (e) => {
    const say = e.target.closest("[data-say]");
    if (say) {
      if (say.classList.contains("playing")) { Speech.stop(); return; }
      $$(".say.playing,.listen.playing").forEach((x) => x.classList.remove("playing"));
      say.classList.add("playing");
      Speech.speak(splitSentences(say.dataset.say), { fromUser: true, onEnd: () => say.classList.remove("playing") });
      return;
    }
    const vw = e.target.closest(".vword"); if (vw) { vocabPop(vw.dataset.vw, vw); return; }
    const pl = e.target.closest("[data-play]"); if (pl) { playStory(pl.dataset.play); return; }
    const gn = e.target.closest("[data-genre]"); if (gn) { enterWorld(gn.dataset.genre, gn); return; }
    const og = e.target.closest("[data-origin]"); if (og) { S.origin = og.dataset.origin; SFX("click"); renderCards(); return; }
    const ch = e.target.closest("[data-ch]"); if (ch) { SFX("click"); startChallenge(ch.dataset.ch); return; }
    const go = e.target.closest("[data-go]"); if (go) { closeOverlay(); startChallenge(go.dataset.go); return; }
    const a = e.target.closest("[data-act]"); if (!a) return;
    const act = a.dataset.act;
    switch (act) {
      case "start": startAdventure(); break;
      case "how": SFX("click"); howToPlay(); break;
      case "sound": toggleSound(); break;
      case "worlds": SFX("click"); goWorlds(); break;
      case "library": SFX("click"); if (S.story) { S.genre = S.story.genre; S.origin = S.story.origin; } goLibrary(); break;
      case "prevPage": if (S.page > 0) { S.page--; SFX("page"); renderStory(); } break;
      case "nextPage": S.page++; SFX("page"); renderStory(); break;
      case "listenPage": listenPage(); break;
      case "listenAll": listenAll(a); break;
      case "listenVocab": {
        if (a.classList.contains("playing")) { Speech.stop(); break; }
        a.classList.add("playing");
        Speech.speak(S.story.vocabulary.map((v) => v.word + "."), { fromUser: true, rate: 0.85, onEnd: () => a.classList.remove("playing") });
        break;
      }
      case "reread": closeOverlay(); S.page = 0; SFX("page"); renderStory(); break;
      case "hub": closeOverlay(); SFX("click"); goHub(); break;
      case "drawer": storyDrawer(S.t && !S.t.done ? S.t.task.ref : null); break;
      case "hint": showHint(); break;
      case "check": if (S.t && S.t.handler.check && !a.disabled) S.t.handler.check(); break;
      case "nextTask": SFX("click"); nextTask(); break;
      case "results": goResults(false); break;
      case "tryAgain": { const id = S.story.id; S.run = null; playStory(id); break; }
    }
  });
  $("#soundBtn").addEventListener("click", toggleSound);
  $("#homeBtn").addEventListener("click", () => {
    const go = () => { setTheme(null); setCrumb([]); show("s-home"); };
    if (S.ch && S.ch.idx >= 0) confirmBox("You will leave this challenge. Your progress in <b>this challenge</b> will be lost (your Story Gems are safe).", "Leave", () => { S.ch = null; go(); });
    else go();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closePop(); if (layer.firstChild) closeOverlay(); }
    if ($("#s-story").classList.contains("active") && S.story && S.page < S.story.pages.length && !/input|textarea/i.test(document.activeElement.tagName)) {
      if (e.key === "ArrowRight") { S.page++; SFX("page"); renderStory(); }
      if (e.key === "ArrowLeft" && S.page > 0) { S.page--; SFX("page"); renderStory(); }
    }
  });
  window.addEventListener("pagehide", () => Speech.stop());

  /* ---------- boot ---------- */
  initHome(); soundUI(); setCrumb([]); show("s-home");
  // expose for debugging / teachers
  NQ.engine = { S, goHub, startChallenge, goResults };
})();
