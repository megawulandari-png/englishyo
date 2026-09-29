// ENGLISH YO! — CLASS CLASH game engine.
// Extends the lobby in index.html and reuses its globals: db, playerId, currentRoomCode, isHost,
// $, showScreen, detachListeners, resetToLanding, showLandingError, leaveRoom.
//
// Firebase carries only essential state:
//   rooms/{code}/status            "waiting" | "reveal" | "playing" | "results"
//   rooms/{code}/game              { seed, round, phase, phaseEndsAt, roundStartedAt, startedAt, endedAt }
//   rooms/{code}/players/{id}      lobby fields + team, energy, correct, answered, streak, bestStreak,
//                                  fastestMs, lastRound, pu, online   (each device writes only its own node)
//   rooms/{code}/events            tiny feed of team announcements (only the host listens)
// Questions, timers, animations and team totals are computed locally on every device.
(function () {
  "use strict";

  // ---------- topics ----------
  // These two names shadow the global Daily Routine constants on purpose: all existing engine code keeps
  // reading CC_ROUNDS / CC_QUESTIONS, but they now point at the room's chosen topic (see setTopic below).
  let CC_ROUNDS = CC_TOPIC_PACKS[CC_DEFAULT_TOPIC].rounds;
  let CC_QUESTIONS = CC_TOPIC_PACKS[CC_DEFAULT_TOPIC].questions;
  let topicId = CC_DEFAULT_TOPIC;
  let topicReady = false; // becomes true once the room's topicId has been read (renders wait for it)

  const REVEAL_MS = 7000;
  const BREAK_MS = 5000;
  const MIN_ROUND_MS = 1500;
  const POINTS = { correct: 100, speed: 50, speedRound: 80, combo: 150, teamBoost: 200, comboStar: 150 };
  const POWERUP_CHANCE = 0.25;
  const POWERUPS = {
    double: { name: "×2 ENERGY", icon: "assets/ui/pu-double.webp", desc: "Your next correct answer earns double energy." },
    shield: { name: "SHIELD", icon: "assets/ui/pu-shield.webp", desc: "Protects your streak from one mistake." },
    boost: { name: "TEAM BOOST", icon: "assets/ui/pu-boost.webp", desc: "+200 energy for your whole team!" },
    combo: { name: "COMBO BONUS", icon: "assets/ui/pu-combo.webp", desc: "+150 bonus energy!" },
  };

  let roomCode = null;
  let players = {};
  let status = null;
  let game = null;
  let serverOffset = 0;
  let presence = "lobby";
  let onlineArmed = false;
  let listeners = [];
  let tickTimer = null;
  let renderTimer = null;
  let lastHostAction = "";
  let built = "";
  let stageKey = "";
  let rs = null; // this student's state for the current round
  let evQueue = [];
  let evBusy = false;
  let lastLeader = null;
  let resultsKey = "";

  const now = () => Date.now() + serverOffset;
  const me = () => players[playerId] || {};
  const roomRef = () => db.ref("rooms/" + roomCode);
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const fmt = (n) => Number(n || 0).toLocaleString("en-US");
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- local-only visual effects (nothing here touches Firebase) ----------
  const TEAM_LIGHT = { fire: "#ffb199", bolt: "#ffe28a", wave: "#9fd2ff", leaf: "#a6ecc0" };
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const MAX_PARTICLES = 70;
  const INTRO_LEAD = 1500;

  function fxBurst(box, x, y, glyphs, n, spread) {
    if (!box || reduceMotion) return;
    n = Math.min(n, Math.max(0, MAX_PARTICLES - document.querySelectorAll(".fx-p").length));
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "fx-p";
      p.textContent = glyphs[i % glyphs.length];
      const ang = Math.random() * Math.PI * 2;
      const dist = (0.45 + Math.random() * 0.9) * spread;
      p.style.left = x + "%";
      p.style.top = y + "%";
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", Math.sin(ang) * dist - spread * 0.35 + "px");
      p.style.setProperty("--rot", Math.round(Math.random() * 360 - 180) + "deg");
      p.style.animationDelay = (Math.random() * 0.14).toFixed(2) + "s";
      box.appendChild(p);
      setTimeout(() => p.remove(), 1400);
    }
  }
  function restartClass(el, cls, ms) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    clearTimeout(el["_t" + cls]);
    el["_t" + cls] = setTimeout(() => el.classList.remove(cls), ms);
  }
  function tweenNumber(el, to) {
    const from = Number(el.dataset.v || 0);
    el.dataset.v = to;
    cancelAnimationFrame(el._raf);
    if (reduceMotion || from === to || Math.abs(to - from) < 2) {
      el.textContent = fmt(to);
      return;
    }
    const t0 = performance.now();
    const step = (t) => {
      const f = Math.min(1, (t - t0) / 700);
      el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - f, 3))));
      if (f < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  // Round transition ("ROUND 5 · SPEED ROUND"): shown during the last ~1.5s of the existing break /
  // team-reveal countdown, so it never takes time away from the answering timer.
  let introEl = null;
  let introKey = "";
  let introTimer = null;
  function hideIntro(fast) {
    clearTimeout(introTimer);
    const el = introEl;
    introEl = null;
    if (!el) return;
    if (fast) return el.remove();
    el.classList.add("out");
    setTimeout(() => el.remove(), 300);
  }
  function showIntro(round) {
    const key = (game && game.seed) + ":" + round;
    if (introKey === key) return;
    introKey = key;
    const plan = CC_ROUNDS[round - 1];
    if (!plan) return;
    hideIntro(true);
    const el = document.createElement("div");
    el.className = "cc-intro";
    el.setAttribute("role", "status");
    el.innerHTML = `<div class="cc-intro-card"><div class="cc-intro-round">${plan.final ? "FINAL ROUND" : "ROUND " + round}</div><div class="cc-intro-type">${plan.icon} ${plan.label}</div><p class="cc-intro-sub">${plan.seconds} seconds · get ready!</p></div>`;
    document.body.appendChild(el);
    introEl = el;
    introTimer = setTimeout(() => hideIntro(false), 2300);
  }
  function introTick() {
    if (!game || !game.phaseEndsAt) return;
    let next = 0;
    if (status === "reveal") next = 1;
    else if (status === "playing" && game.phase === "break" && game.round < CC_ROUNDS.length) next = game.round + 1;
    if (next) {
      const left = game.phaseEndsAt - now();
      if (left <= INTRO_LEAD && left > -300) showIntro(next);
    } else if (introEl) hideIntro(false);
  }

  // ---------- seeded shuffling (same result on every device, no network needed) ----------
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function seededRandom(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, seedStr) {
    const rnd = seededRandom(hashStr(seedStr));
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function questionFor(round, sub) {
    const plan = CC_ROUNDS[round - 1];
    const pool = CC_QUESTIONS.filter((q) => q.type === plan.pool && (!plan.tier || q.tier === plan.tier));
    let occurrence = sub;
    for (let i = 0; i < round - 1; i++) if (CC_ROUNDS[i].pool === plan.pool && CC_ROUNDS[i].tier === plan.tier) occurrence += CC_ROUNDS[i].count || 1;
    const order = shuffle(pool, game.seed + ":" + playerId + ":" + plan.pool + (plan.tier ? ":t" + plan.tier : ""));
    return order[occurrence % order.length];
  }

  // ---------- team maths (local) ----------
  function studentList() {
    return Object.entries(players)
      .filter(([, p]) => !p.isHost && p.team && CC_TEAMS[p.team])
      .map(([id, p]) => ({ id, ...p }));
  }
  function teamStats() {
    const t = {};
    CC_TEAM_KEYS.forEach((k) => (t[k] = { key: k, raw: 0, size: 0, active: 0, answered: 0, score: 0, members: [] }));
    const round = game ? game.round || 0 : 0;
    studentList().forEach((p) => {
      const s = t[p.team];
      s.raw += p.energy || 0;
      s.size++;
      s.members.push(p);
      if (p.online !== false) {
        s.active++;
        if (round && (p.lastRound || 0) >= round) s.answered++;
      }
    });
    // Balance for uneven team sizes (e.g. 9-9-9-8) so a smaller team isn't disadvantaged.
    const maxSize = Math.max(1, ...CC_TEAM_KEYS.map((k) => t[k].size));
    CC_TEAM_KEYS.forEach((k) => {
      const s = t[k];
      s.score = s.size ? Math.round((s.raw * maxSize) / s.size) : 0;
    });
    return t;
  }
  const ranking = (stats) => CC_TEAM_KEYS.map((k) => stats[k]).filter((s) => s.size).sort((a, b) => b.score - a.score);
  function activeCounts() {
    const studs = studentList().filter((p) => p.online !== false);
    const round = game ? game.round || 0 : 0;
    return { active: studs.length, answered: studs.filter((p) => round && (p.lastRound || 0) >= round).length };
  }

  // ---------- lifecycle ----------
  function listen(ref, ev, cb) {
    ref.on(ev, cb);
    listeners.push([ref, ev, cb]);
  }

  // Switch the engine to a topic pack. Unknown/missing ids (e.g. rooms created before topics existed) → Daily Routine.
  function setTopic(id) {
    const pack = CC_TOPIC_PACKS[id] ? id : CC_DEFAULT_TOPIC;
    topicId = pack;
    CC_ROUNDS = CC_TOPIC_PACKS[pack].rounds;
    CC_QUESTIONS = CC_TOPIC_PACKS[pack].questions;
    if (window.TopicUI) TopicUI.renderLobbyTopic(pack);
  }

  function attach(code) {
    detach();
    roomCode = code;
    // Only the short topic id travels through Firebase; the content itself is already on every device.
    listen(roomRef().child("topicId"), "value", (s) => {
      setTopic(s.val());
      topicReady = true;
      built = stageKey = "";
      queueRender();
    });
    listen(db.ref(".info/serverTimeOffset"), "value", (s) => (serverOffset = s.val() || 0));
    listen(roomRef().child("game"), "value", (s) => {
      const prev = game;
      game = s.val();
      if (isHost) hostGameEvents(prev, game);
      queueRender();
    });
    listen(db.ref(".info/connected"), "value", (s) => {
      if (s.val() === true && presence === "game") {
        onlineArmed = false; // onDisconnect handlers are consumed on disconnect — re-arm them.
        markOnline();
      }
    });
    if (isHost) listen(roomRef().child("events").limitToLast(1), "child_added", (s) => queueEvent(s.val()));
    tickTimer = setInterval(tick, 250);
  }

  function detach() {
    listeners.forEach(([ref, ev, cb]) => ref.off(ev, cb));
    listeners = [];
    clearInterval(tickTimer);
    clearTimeout(renderTimer);
    tickTimer = renderTimer = null;
    roomCode = null;
    players = {};
    status = game = rs = lastLeader = null;
    setTopic(CC_DEFAULT_TOPIC);
    topicReady = false;
    presence = "lobby";
    onlineArmed = evBusy = false;
    built = stageKey = lastHostAction = resultsKey = "";
    evQueue = [];
    introKey = "";
    hideIntro(true);
    document.body.classList.remove("cc-wide");
  }

  function onPlayers(obj) {
    players = obj || {};
    if (!roomCode) return;
    // Our node vanished (e.g. connection dropped while in the lobby) — send the student back to rejoin.
    if (!isHost && Object.keys(players).length && !players[playerId]) {
      const code = roomCode;
      detachListeners();
      resetToLanding();
      $("room-code-input").value = code;
      showLandingError("You were disconnected from room " + code + ". Tap JOIN ROOM to come back.");
      return;
    }
    if (presence === "game" && !onlineArmed && players[playerId]) markOnline();
    queueRender();
  }

  function onStatus(st) {
    const prev = status;
    status = st;
    const inGame = st === "reveal" || st === "playing" || st === "results";
    setPresence(inGame ? "game" : "lobby");
    if (!inGame || st === "results") hideIntro(true);
    if (!inGame) {
      introKey = "";
      built = stageKey = lastHostAction = resultsKey = "";
      rs = lastLeader = null;
      document.body.classList.remove("cc-wide");
      if (prev && prev !== "waiting" && st === "waiting") showScreen("lobby");
      return;
    }
    if (st === "reveal") {
      rs = null;
      stageKey = resultsKey = "";
      lastLeader = null;
    }
    queueRender();
  }

  // In the lobby a dropped connection removes the player (original behaviour). During a game we only
  // mark them offline, so a sleeping phone or refreshed tab keeps its score and can rejoin.
  function setPresence(mode) {
    if (mode === presence || !roomCode) return;
    presence = mode;
    onlineArmed = false;
    const mine = roomRef().child("players/" + playerId);
    mine.onDisconnect().cancel();
    if (isHost) roomRef().onDisconnect().cancel();
    if (mode === "game") {
      if (players[playerId]) markOnline();
    } else {
      mine.onDisconnect().remove();
      if (isHost) roomRef().onDisconnect().remove();
    }
  }
  function markOnline() {
    if (!roomCode || !players[playerId]) return;
    onlineArmed = true;
    const onlineRef = roomRef().child("players/" + playerId + "/online");
    onlineRef.onDisconnect().set(false);
    onlineRef.set(true);
  }

  const isInGame = () => presence === "game";

  // ---------- host: start / advance / finish / reset ----------
  function statFields(id, team) {
    const b = "players/" + id + "/";
    return {
      [b + "team"]: team, [b + "energy"]: team ? 0 : null, [b + "correct"]: team ? 0 : null,
      [b + "answered"]: team ? 0 : null, [b + "streak"]: team ? 0 : null, [b + "bestStreak"]: team ? 0 : null,
      [b + "fastestMs"]: null, [b + "lastRound"]: team ? 0 : null, [b + "pu"]: null,
    };
  }

  async function startGame() {
    const studs = Object.entries(players).filter(([, p]) => !p.isHost);
    if (!studs.length) {
      alert("At least one student needs to join before the game can start.");
      return;
    }
    const ids = shuffle(studs.map(([id]) => id), String(Math.random()));
    const rotate = Math.floor(Math.random() * 4);
    const u = {};
    ids.forEach((id, i) => Object.assign(u, statFields(id, CC_TEAM_KEYS[(i + rotate) % 4])));
    Object.entries(players).filter(([, p]) => p.isHost).forEach(([id]) => Object.assign(u, statFields(id, null)));
    const t = now();
    u.game = { seed: String(Math.floor(Math.random() * 1e9)), round: 0, phase: "reveal", phaseEndsAt: t + REVEAL_MS, startedAt: t, totalRounds: CC_ROUNDS.length };
    u.events = null;
    u.status = "reveal";
    lastHostAction = "";
    await roomRef().update(u);
  }

  // Every phase change goes through one transaction that only succeeds if the game is still in the
  // expected round/phase. The host calls it on time; students call it only if the host is overdue
  // (e.g. the teacher's tab is hidden and its timers are frozen), so the class never gets stuck and
  // exactly one device wins each transition.
  function advance(fromRound, fromPhase) {
    if (!roomCode) return;
    const t = now();
    roomRef()
      .child("game")
      .transaction(
        (g) => {
          if (!g) return g;
          if (g.round !== fromRound || g.phase !== fromPhase) return undefined;
          if (fromPhase === "question") return { ...g, phase: "break", phaseEndsAt: t + BREAK_MS };
          const nextRound = (g.round || 0) + 1;
          if (nextRound > CC_ROUNDS.length) return { ...g, phase: "done", endedAt: t };
          return { ...g, round: nextRound, phase: "question", roundStartedAt: t, phaseEndsAt: t + CC_ROUNDS[nextRound - 1].seconds * 1000 };
        },
        (err, committed, snap) => {
          if (committed && snap.val()) roomRef().child("status").set(snap.val().phase === "done" ? "results" : "playing");
        },
        false
      );
  }
  function finishGame() {
    return roomRef().update({ status: "results", "game/phase": "done", "game/endedAt": now() });
  }

  function hostAdvance() {
    const key = game.round + ":" + game.phase;
    if (lastHostAction === key) return;
    lastHostAction = key;
    advance(game.round, game.phase);
  }
  function hostTick() {
    if (!game || (status !== "reveal" && status !== "playing")) return;
    const t = now();
    if (game.phase === "question") {
      const c = activeCounts();
      const everyone = c.active > 0 && c.answered >= c.active;
      if (t >= game.phaseEndsAt || (everyone && t - game.roundStartedAt > MIN_ROUND_MS)) hostAdvance();
    } else if (t >= game.phaseEndsAt) {
      hostAdvance();
    }
  }

  let fallbackKey = "";
  let fallbackAt = 0;
  function studentFallbackTick() {
    if (!game || !game.phaseEndsAt || (status !== "reveal" && status !== "playing")) return;
    const grace = 3000 + (hashStr(playerId) % 3000);
    if (now() < game.phaseEndsAt + grace) return;
    const key = game.round + ":" + game.phase;
    if (fallbackKey === key && Date.now() - fallbackAt < 5000) return;
    fallbackKey = key;
    fallbackAt = Date.now();
    advance(game.round, game.phase);
  }

  // If a transition's follow-up status write was lost, any device repairs it (after a short delay so
  // the normal write isn't duplicated by every device).
  let mismatchSince = 0;
  function repairStatus() {
    if (!game || !status || status === "waiting") return;
    const want = game.phase === "done" ? "results" : game.round >= 1 ? "playing" : "reveal";
    if (want === status) {
      mismatchSince = 0;
      return;
    }
    if (!mismatchSince) mismatchSince = Date.now();
    else if (Date.now() - mismatchSince > 2500 + (hashStr(playerId) % 1500)) {
      mismatchSince = Date.now();
      roomRef().child("status").set(want);
    }
  }

  // Host-only announcements derived from game changes (so they work whoever advanced the round).
  function hostGameEvents(prev, next) {
    if (!prev || !next) return;
    if (next.phase === "question" && next.round !== prev.round) {
      const plan = CC_ROUNDS[next.round - 1];
      if (plan && plan.final) queueEvent({ text: "🏆 FINAL ROUND — DOUBLE ENERGY!", local: true });
      else if (plan && plan.pool === "speed") queueEvent({ text: "⚡ SPEED ROUND — ANSWER FAST!", local: true });
    }
    if (next.phase === "break" && prev.phase === "question") {
      const leader = ranking(teamStats())[0];
      if (leader && leader.score > 0) {
        if (lastLeader && lastLeader !== leader.key) {
          const team = CC_TEAMS[leader.key];
          queueEvent({ text: `${team.emoji} ${team.name} TAKES THE LEAD!`, local: true });
        }
        lastLeader = leader.key;
      }
    }
  }

  async function playAgain() {
    const u = { status: "waiting", game: null, events: null };
    Object.entries(players).forEach(([id, p]) => {
      // Students who closed their tab during the game are dropped so the next game has only active players.
      if (!p.isHost && p.online === false) {
        u["players/" + id] = null;
        return;
      }
      Object.assign(u, statFields(id, null));
      u["players/" + id + "/online"] = null;
      u["players/" + id + "/ready"] = !!p.isHost;
    });
    await roomRef().update(u);
  }

  // ---------- host event banner ----------
  function queueEvent(ev) {
    if (!ev || !ev.text || !isHost) return;
    if (!ev.local && (!game || (ev.at || 0) < (game.startedAt || 0) - 2000)) return;
    evQueue.push(ev.text);
    if (evQueue.length > 4) evQueue.shift();
    pumpEvents();
  }
  function pumpEvents() {
    const el = $("ar-event");
    if (evBusy || !evQueue.length || !el || status !== "playing") return;
    evBusy = true;
    el.textContent = evQueue.shift();
    el.classList.remove("show");
    void el.offsetWidth;
    el.classList.add("show");
    setTimeout(() => {
      el.classList.remove("show");
      evBusy = false;
      pumpEvents();
    }, 2800);
  }
  function pushEvent(text, team) {
    roomRef().child("events").push({ text, team: team || null, at: firebase.database.ServerValue.TIMESTAMP });
  }

  // ---------- rendering ----------
  function queueRender() {
    if (renderTimer) return;
    renderTimer = setTimeout(() => {
      renderTimer = null;
      render();
    }, 30);
  }
  function render() {
    if (!roomCode || !status || !topicReady) return;
    if (status === "reveal") return isHost ? renderRevealHost() : renderRevealStudent();
    if (status === "playing") return isHost ? renderArena() : renderPlay();
    if (status === "results") return renderResults();
  }
  function secondsLeft() {
    return game && game.phaseEndsAt ? Math.max(0, Math.ceil((game.phaseEndsAt - now()) / 1000)) : 0;
  }
  function avatarImg(p, cls) {
    return `<img class="${cls || "cc-av"}" src="${ccAvatarUrl(p && p.avatar)}" alt="" loading="lazy" />`;
  }

  // ----- team reveal -----
  function renderRevealStudent() {
    showScreen("reveal");
    document.body.classList.remove("cc-wide");
    const p = me();
    const team = CC_TEAMS[p.team];
    const key = "reveal-s:" + (game && game.seed) + ":" + (p.team || "") + ":" + studentList().length;
    if (built !== key) {
      built = key;
      if (!team) {
        $("screen-reveal").innerHTML = `<div class="cc-panel cc-reveal"><p class="cc-kicker">TEAM REVEAL</p><h2>Assigning teams…</h2></div>`;
      } else {
        const mates = studentList().filter((s) => s.team === p.team && s.id !== playerId);
        $("screen-reveal").innerHTML = `
          <div class="cc-panel cc-reveal" style="--tc:${team.color};--ts:${team.soft}">
            <p class="cc-kicker">⚔️ CLASS CLASH · TEAM REVEAL</p>
            <div class="cc-reveal-badge"><img src="${team.badge}" alt="${esc(team.name)}" /></div>
            <h2 class="cc-reveal-title">YOU'RE ON <span>${esc(team.name)}</span>!</h2>
            <div class="cc-reveal-me">${avatarImg(p, "cc-av cc-av--lg")}<b>${esc(p.name)}</b></div>
            <p class="cc-reveal-mates-label">Your teammates (${mates.length})</p>
            <div class="cc-reveal-mates">${mates.slice(0, 14).map((m) => `<span class="cc-mate">${avatarImg(m)}<small>${esc(m.name)}</small></span>`).join("")}${mates.length > 14 ? `<span class="cc-more">+${mates.length - 14}</span>` : ""}</div>
            <p class="cc-countdown">Round 1 starts in <b data-countdown>${secondsLeft()}</b></p>
          </div>`;
      }
    }
  }

  function renderRevealHost() {
    showScreen("reveal");
    document.body.classList.add("cc-wide");
    const stats = teamStats();
    const key = "reveal-h:" + (game && game.seed) + ":" + CC_TEAM_KEYS.map((k) => stats[k].size).join(",");
    if (built === key) return;
    built = key;
    $("screen-reveal").innerHTML = `
      <div class="cc-panel cc-reveal-host">
        <p class="cc-kicker">⚔️ CLASS CLASH · DAILY ROUTINE ADVENTURE</p>
        <h2 class="cc-reveal-host-title">TEAM REVEAL!</h2>
        <div class="cc-reveal-cols">
          ${CC_TEAM_KEYS.map((k, i) => {
            const t = CC_TEAMS[k];
            const s = stats[k];
            return `<div class="cc-reveal-col" style="--tc:${t.color};--ts:${t.soft};--d:${i * 0.18}s">
              <img class="cc-reveal-col-badge" src="${t.badge}" alt="" />
              <h3>${esc(t.name)}</h3>
              <p>${s.size} player${s.size === 1 ? "" : "s"}</p>
              <div class="cc-reveal-col-list">${s.members.map((m) => `<span class="cc-chip-player">${avatarImg(m, "cc-av cc-av--xs")}${esc(m.name)}</span>`).join("")}</div>
            </div>`;
          }).join("")}
        </div>
        <p class="cc-countdown cc-countdown--big">Round 1 starts in <b data-countdown>${secondsLeft()}</b></p>
      </div>`;
  }

  // ----- student gameplay -----
  let hudLast = { score: 0, team: 0 };
  function buildPlay() {
    built = "play";
    hudLast = { score: 0, team: 0 };
    stageKey = "";
    $("screen-play").innerHTML = `
      <div class="cc-play">
        <div class="cc-hud cc-panel">
          <div class="cc-me">
            <img class="cc-av cc-av--md" id="cc-me-av" alt="" />
            <div class="cc-me-info"><b id="cc-me-name"></b><span id="cc-me-team" class="cc-team-chip"></span></div>
            <div class="cc-me-score"><small>MY SCORE</small><b id="cc-score">0</b></div>
          </div>
          <div class="cc-energy">
            <img id="cc-energy-badge" alt="" />
            <div class="cc-energy-main">
              <div class="cc-energy-top"><span id="cc-energy-label">TEAM ENERGY</span><b id="cc-energy-num">0</b></div>
              <div class="cc-energy-bar"><div id="cc-energy-fill"></div></div>
            </div>
          </div>
          <div class="cc-statusrow">
            <span id="cc-round" class="cc-pill"></span>
            <span id="cc-streak" class="cc-pill cc-pill--streak"></span>
            <span id="cc-pu" class="cc-pill cc-pill--pu" hidden></span>
          </div>
          <div class="cc-timer"><div id="cc-timer-fill"></div><span id="cc-timer-num"></span></div>
        </div>
        <div id="cc-host-warning" class="cc-host-warning" hidden>📡 Teacher's screen disconnected — hold on…</div>
        <div id="cc-stage" class="cc-stage"></div>
        <div id="cc-teams-mini" class="cc-teams-mini"></div>
      </div>`;
  }

  function renderPlay() {
    showScreen("play");
    document.body.classList.remove("cc-wide");
    if (built !== "play") buildPlay();
    updateHud();
    updateStage();
  }

  function updateHud() {
    const p = me();
    const team = CC_TEAMS[p.team] || CC_TEAMS.fire;
    const stats = teamStats();
    const top = Math.max(1, ...CC_TEAM_KEYS.map((k) => stats[k].score));
    const mine = stats[p.team] || { score: 0 };
    $("cc-me-av").src = ccAvatarUrl(p.avatar);
    $("cc-me-name").textContent = p.name || "Player";
    $("cc-me-team").textContent = team.emoji + " " + team.name;
    $("screen-play").style.setProperty("--tc", team.color);
    $("screen-play").style.setProperty("--ts", team.soft);
    $("cc-score").textContent = fmt(p.energy);
    $("cc-energy-badge").src = team.badge;
    $("cc-energy-num").textContent = fmt(mine.score);
    // Purely visual: pop the numbers when they go up.
    if ((p.energy || 0) > hudLast.score) restartClass($("cc-score"), "pop", 600);
    if (mine.score > hudLast.team) restartClass($("cc-energy-num"), "pop", 600);
    hudLast = { score: p.energy || 0, team: mine.score };
    $("cc-energy-fill").style.width = (mine.score / top) * 100 + "%";
    const r = game && game.round ? game.round : 0;
    const plan = CC_ROUNDS[r - 1];
    $("cc-round").textContent = plan ? `${plan.final ? "FINAL" : "ROUND " + r}/${CC_ROUNDS.length} · ${plan.icon} ${plan.label}` : "GET READY";
    $("cc-streak").textContent = "🔥 Streak " + (p.streak || 0);
    $("cc-streak").classList.toggle("hot", (p.streak || 0) >= 3);
    const pu = POWERUPS[p.pu];
    $("cc-pu").hidden = !pu;
    if (pu) $("cc-pu").innerHTML = `<img src="${pu.icon}" alt="" />${pu.name} ready`;
    const host = Object.values(players).find((x) => x.isHost);
    $("cc-host-warning").hidden = !(host && host.online === false);
    const ranked = ranking(stats).map((s) => s.key);
    $("cc-teams-mini").innerHTML = CC_TEAM_KEYS.filter((k) => stats[k].size)
      .map((k) => {
        const t = CC_TEAMS[k];
        return `<span class="cc-mini${k === p.team ? " is-mine" : ""}" style="--tc:${t.color};--ts:${t.soft}"><em>#${ranked.indexOf(k) + 1}</em>${t.emoji} ${t.short}<b>${fmt(stats[k].score)}</b></span>`;
      })
      .join("");
  }

  function ensureRoundState() {
    const r = game && game.round;
    if (!r) return null;
    if (!rs || rs.round !== r) rs = { round: r, sub: 0, earned: 0, correctCount: 0, log: [], feedback: null, flash: null, pending: false, done: false };
    return rs;
  }

  function setStage(key, html, after) {
    if (stageKey === key) return false;
    stageKey = key;
    const stage = $("cc-stage");
    stage.innerHTML = html;
    if (after) after(stage);
    return true;
  }

  function updateStage() {
    if (!game || !game.round) {
      setStage("wait-start", `<div class="cc-card cc-waiting"><div class="cc-spinner"></div><p>Get ready…</p></div>`);
      return;
    }
    const s = ensureRoundState();
    const r = s.round;
    const answered = (me().lastRound || 0) >= r || s.done;
    if (game.phase === "question" && !answered) {
      if (s.flash) setStage(`flash:${r}:${s.sub}`, flashHTML(s.flash));
      else setStage(`q:${r}:${s.sub}`, "", (stage) => buildQuestion(stage, r, s.sub));
    } else {
      setStage(`fb:${r}`, feedbackHTML(r), (st) => fbEffects(st, rs && rs.round === r ? rs.feedback : null));
    }
    updateWaitLine();
  }

  function updateWaitLine() {
    const el = $("cc-wait-line");
    if (!el || !game) return;
    if (game.phase === "question") {
      const c = activeCounts();
      el.textContent = `Waiting for classmates… ${c.answered} / ${c.active} answered`;
    } else if (game.phase === "break") {
      el.textContent = game.round >= CC_ROUNDS.length ? "🏆 Calculating final results…" : `Round ${game.round} complete! Next round in ${secondsLeft()}…`;
    }
  }

  function clockSVG(h, m) {
    const hourDeg = ((h % 12) + m / 60) * 30;
    const minDeg = m * 6;
    let marks = "";
    for (let i = 1; i <= 12; i++) {
      const a = (i * 30 * Math.PI) / 180;
      marks += `<text x="${100 + Math.sin(a) * 72}" y="${100 - Math.cos(a) * 72 + 7}" text-anchor="middle">${i}</text>`;
    }
    for (let i = 0; i < 60; i++) {
      const a = (i * 6 * Math.PI) / 180;
      const r1 = i % 5 === 0 ? 84 : 88;
      marks += `<line x1="${100 + Math.sin(a) * r1}" y1="${100 - Math.cos(a) * r1}" x2="${100 + Math.sin(a) * 92}" y2="${100 - Math.cos(a) * 92}" class="${i % 5 === 0 ? "tk5" : "tk"}"/>`;
    }
    return `<svg class="cc-clock" viewBox="0 0 200 200" role="img" aria-label="Analog clock">
      <circle cx="100" cy="100" r="96" class="face"/>${marks}
      <line x1="100" y1="100" x2="100" y2="52" class="hand-h" transform="rotate(${hourDeg} 100 100)"/>
      <line x1="100" y1="100" x2="100" y2="26" class="hand-m" transform="rotate(${minDeg} 100 100)"/>
      <circle cx="100" cy="100" r="6" class="pin"/></svg>`;
  }

  function optionsHTML(options, seedKey, forceList) {
    const opts = shuffle(options, seedKey);
    const list = forceList || opts.some((o) => o.length > 20);
    return `<div class="cc-options ${list ? "cc-options--list" : "cc-options--grid"}">${opts
      .map((o, i) => `<button class="cc-opt" data-v="${esc(o)}"><span class="cc-opt-key">${"ABCD"[i]}</span><span>${esc(o)}</span></button>`)
      .join("")}</div>`;
  }

  function buildQuestion(stage, r, sub) {
    const plan = CC_ROUNDS[r - 1];
    const q = questionFor(r, sub);
    const s = rs;
    s.q = q;
    s.shownAt = performance.now();
    s.pending = false;
    s.open = true;
    const seedKey = game.seed + ":" + playerId + ":" + q.id;
    const head = `<div class="cc-card-top"><span class="cc-kind">${plan.icon} ${plan.label}</span>${plan.count ? `<span class="cc-sub">${sub + 1} / ${plan.count}</span>` : ""}${plan.final ? `<span class="cc-final">×2 ENERGY</span>` : ""}</div>`;
    let body = "";
    if (q.type === "quick") body = `<p class="cc-q">${esc(q.q)}</p>${optionsHTML(q.options, seedKey)}`;
    else if (q.type === "speed") body = `<p class="cc-q cc-q--big">${esc(q.q)}</p>${optionsHTML(q.options, seedKey)}`;
    else if (q.type === "gap")
      body = `<p class="cc-q cc-q--gap">${esc(q.before)} <span class="cc-blank" id="cc-blank">?</span> ${esc(q.after)}</p>${optionsHTML(q.options, seedKey)}`;
    else if (q.type === "time") {
      const hh = String(q.h).padStart(2, "0");
      const mm = String(q.m).padStart(2, "0");
      body = `<div class="cc-time-row">${q.mode === "digital" ? `<div class="cc-digital">${hh}<span>:</span>${mm}</div>` : clockSVG(q.h, q.m)}<div class="cc-time-side"><p class="cc-ctx">${esc(q.ctx)}</p><p class="cc-q">What time is it?</p></div></div>${optionsHTML(q.options, seedKey, true)}`;
    } else if (q.type === "order") {
      let words = shuffle(q.answer.split(" "), seedKey);
      if (words.join(" ") === q.answer) words = words.slice(1).concat(words[0]);
      s.words = words;
      s.placed = [];
      body = `<p class="cc-q">${q.question ? "Make a <b>question</b> with these words:" : "Put the words in the correct order:"}</p>
        <div class="cc-order-line" id="cc-order-line"></div>
        <div class="cc-order-pool" id="cc-order-pool">${words.map((w, i) => `<button class="cc-chip" data-i="${i}">${esc(w)}</button>`).join("")}</div>
        <div class="cc-order-actions"><button class="cc-btn-soft" id="cc-order-reset">↺ Reset</button><button class="cc-btn-go" id="cc-order-check" disabled>✓ CHECK</button></div>`;
    }
    stage.innerHTML = `<div class="cc-card cc-pop">${head}${body}</div>`;

    if (q.type === "order") {
      const refreshOrder = () => {
        $("cc-order-line").innerHTML = s.placed.length
          ? s.placed.map((i, pos) => `<button class="cc-chip cc-chip--placed" data-pos="${pos}">${esc(s.words[i])}</button>`).join("") + (q.question ? `<span class="cc-punct">?</span>` : `<span class="cc-punct">.</span>`)
          : `<span class="cc-order-hint">Tap the words below ↓</span>`;
        stage.querySelectorAll("#cc-order-pool .cc-chip").forEach((b) => (b.disabled = s.placed.includes(Number(b.dataset.i))));
        $("cc-order-check").disabled = s.placed.length !== s.words.length;
      };
      refreshOrder();
      stage.querySelector("#cc-order-pool").addEventListener("click", (e) => {
        const b = e.target.closest(".cc-chip");
        if (!b || b.disabled || s.pending) return;
        s.placed.push(Number(b.dataset.i));
        refreshOrder();
      });
      stage.querySelector("#cc-order-line").addEventListener("click", (e) => {
        const b = e.target.closest(".cc-chip");
        if (!b || s.pending) return;
        s.placed.splice(Number(b.dataset.pos), 1);
        refreshOrder();
      });
      $("cc-order-reset").addEventListener("click", () => {
        if (s.pending) return;
        s.placed = [];
        refreshOrder();
      });
      $("cc-order-check").addEventListener("click", () => {
        if (s.pending) return;
        const norm = (x) => x.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
        const said = s.placed.map((i) => s.words[i]).join(" ");
        const ok = [q.answer].concat(q.alt || []).some((a) => norm(a) === norm(said));
        s.pending = true;
        $("cc-order-line").classList.add(ok ? "is-right" : "is-wrong");
        setTimeout(() => submitAnswer(ok, said), 650);
      });
      return;
    }

    stage.querySelector(".cc-options").addEventListener("click", (e) => {
      const b = e.target.closest(".cc-opt");
      if (!b || s.pending) return;
      s.pending = true;
      const ok = b.dataset.v === q.answer;
      b.classList.add(ok ? "is-right" : "is-wrong");
      if (!ok) stage.querySelectorAll(".cc-opt").forEach((x) => x.dataset.v === q.answer && x.classList.add("is-answer"));
      stage.querySelectorAll(".cc-opt").forEach((x) => (x.disabled = true));
      const blank = $("cc-blank");
      if (blank) {
        blank.textContent = b.dataset.v;
        blank.classList.add(ok ? "is-right" : "is-wrong");
      }
      setTimeout(() => submitAnswer(ok, b.dataset.v), q.type === "speed" ? 350 : 650);
    });
  }

  function computeScore(correct, frac, plan, ms) {
    const p = me();
    const team = CC_TEAMS[p.team] || CC_TEAMS.fire;
    let energy = p.energy || 0;
    let streak = p.streak || 0;
    let best = p.bestStreak || 0;
    let pu = p.pu || null;
    let correctN = p.correct || 0;
    const answeredN = (p.answered || 0) + 1;
    let fastest = p.fastestMs == null ? null : p.fastestMs;
    const parts = [];
    let gained = 0;
    let award = null;
    let event = null;
    let shieldUsed = false;
    if (correct) {
      correctN++;
      streak++;
      best = Math.max(best, streak);
      const speed = Math.round((plan.pool === "speed" ? POINTS.speedRound : POINTS.speed) * frac);
      let pts = POINTS.correct + speed;
      parts.push(["Correct answer", POINTS.correct]);
      if (speed > 0) parts.push(["⚡ Speed bonus", speed]);
      if (pu === "double") {
        parts.push(["×2 Energy power-up", pts]);
        pts *= 2;
        pu = null;
      }
      if (plan.final) {
        parts.push(["🏆 Final round ×2", pts]);
        pts *= 2;
      }
      gained += pts;
      if (streak % 3 === 0) {
        gained += POINTS.combo;
        parts.push([`🔥 ${streak}-answer streak combo`, POINTS.combo]);
      }
      fastest = fastest == null ? ms : Math.min(fastest, ms);
      if (Math.random() < POWERUP_CHANCE) {
        let kind = pick(["double", "shield", "boost", "combo"]);
        if ((kind === "double" || kind === "shield") && pu) kind = "combo";
        award = kind;
        if (kind === "boost") {
          gained += POINTS.teamBoost;
          parts.push(["🚀 Team Boost", POINTS.teamBoost]);
          event = `${team.emoji} ${team.name} ACTIVATED TEAM BOOST!`;
        } else if (kind === "combo") {
          gained += POINTS.comboStar;
          parts.push(["⭐ Combo Bonus", POINTS.comboStar]);
        } else {
          pu = kind;
        }
      }
      if (!event && (streak === 5 || streak === 8)) event = `${team.emoji} ${p.name} is on a ${streak}× STREAK!`;
    } else if (pu === "shield") {
      pu = null;
      shieldUsed = true;
    } else {
      streak = 0;
    }
    energy += gained;
    return { gained, parts, award, event, shieldUsed, team: p.team, stats: { energy, correct: correctN, answered: answeredN, streak, bestStreak: best, fastestMs: fastest, pu } };
  }

  function writeStats(stats, lastRound) {
    if (!players[playerId]) return;
    const u = { ...stats };
    if (lastRound) u.lastRound = lastRound;
    roomRef().child("players/" + playerId).update(u);
  }

  function submitAnswer(correct, given) {
    const s = rs;
    if (!s || !game || s.round !== game.round || s.done) return;
    const r = s.round;
    const plan = CC_ROUNDS[r - 1];
    const q = s.q;
    const ms = Math.round(performance.now() - s.shownAt);
    const frac = clamp01((game.phaseEndsAt - now()) / (plan.seconds * 1000));
    const res = computeScore(correct, frac, plan, ms);
    const last = !plan.count || s.sub + 1 >= plan.count;
    s.open = false;
    if (last) s.done = true;
    writeStats(res.stats, last ? r : null);
    if (res.event) pushEvent(res.event, res.team);
    s.earned += res.gained;
    if (correct) s.correctCount++;
    const fb = {
      correct, gained: res.gained, parts: res.parts, answer: displayAnswer(q), award: res.award, shieldUsed: res.shieldUsed,
      // presentation only — derived from values computeScore already produced
      fast: correct && frac >= 0.6,
      combo: res.parts.some((x) => x[0].includes("streak combo")),
      streak: res.stats.streak,
    };
    reactAvatar(correct ? "yay" : "oops");
    if (plan.count) {
      s.log.push(fb);
      if (!last) {
        s.flash = fb;
        queueRender();
        setTimeout(() => {
          if (rs !== s || s.done) return;
          s.flash = null;
          s.pending = false; // lets the timeout close the round if time ran out during the flash
          if (game && game.round === s.round && game.phase === "question") s.sub++;
          queueRender();
        }, 700);
        return;
      }
      s.feedback = { speed: true, log: s.log, gained: s.earned, correctCount: s.correctCount, total: plan.count };
    } else {
      s.feedback = fb;
    }
    queueRender();
  }

  function submitTimeout() {
    const s = rs;
    if (!s || s.done) return;
    s.done = true;
    const r = s.round;
    const plan = CC_ROUNDS[r - 1];
    if (plan.count && !s.open && s.log.length) {
      // Speed round ended between questions: close the round without counting an unseen question.
      if (players[playerId]) roomRef().child("players/" + playerId).update({ lastRound: r });
      s.feedback = { speed: true, log: s.log, gained: s.earned, correctCount: s.correctCount, total: plan.count };
      queueRender();
      return;
    }
    const q = s.q || questionFor(r, s.sub);
    const res = computeScore(false, 0, plan, 0);
    writeStats(res.stats, r);
    const fb = { correct: false, timeout: true, gained: 0, parts: [], answer: displayAnswer(q), shieldUsed: res.shieldUsed };
    reactAvatar("oops");
    if (plan.count) {
      s.log.push(fb);
      s.feedback = { speed: true, log: s.log, gained: s.earned, correctCount: s.correctCount, total: plan.count };
    } else {
      s.feedback = fb;
    }
    queueRender();
  }

  function displayAnswer(q) {
    if (!q) return "";
    if (q.type === "order") return q.answer + (q.question ? "?" : ".");
    if (q.type === "gap") return `${q.before} ${q.answer} ${q.after}`.trim();
    return q.answer;
  }

  function reactAvatar(kind) {
    restartClass($("cc-me-av"), "react-" + kind, 1100);
  }

  function flashHTML(fb) {
    if (fb.correct) {
      return `<div class="cc-card cc-flash is-right"><div class="cc-flash-icon">${fb.fast ? "⚡" : "✅"}</div><b>${fb.fast ? "LIGHTNING! " : "PERFECT! "}+${fmt(fb.gained)}</b></div>`;
    }
    return `<div class="cc-card cc-flash is-wrong"><div class="cc-flash-icon">💪</div><b>Next one — you've got this!</b></div>`;
  }

  function awardHTML(kind) {
    const pu = POWERUPS[kind];
    if (!pu) return "";
    return `<div class="cc-award"><img src="${pu.icon}" alt="" /><div><small>POWER-UP!</small><b>${pu.name}</b><span>${pu.desc}</span></div></div>`;
  }

  const TRY_TITLES = ["NICE TRY!", "SO CLOSE!", "KEEP GOING!", "YOU'VE GOT THIS!"];

  function feedbackHTML(r) {
    const fb = rs && rs.round === r ? rs.feedback : null;
    const wait = `<p class="cc-wait" id="cc-wait-line"></p>`;
    const av = (mood) => `<div class="cc-fb-avatar ${mood}">${avatarImg(me(), "cc-fb-av")}</div>`;
    if (!fb) return `<div class="cc-card cc-feedback cc-pop">${av("")}<h3>Answer saved!</h3>${wait}</div>`;
    if (fb.speed) {
      return `<div class="cc-card cc-feedback cc-pop ${fb.correctCount ? "is-right" : ""}"><div class="cc-fx" aria-hidden="true"></div>
        ${av(fb.correctCount ? "happy" : "oops")}
        <div class="cc-fb-title ${fb.correctCount ? "is-fast" : "is-try"}">⚡ SPEED ROUND: ${fb.correctCount} / ${fb.total}</div>
        <p class="cc-fb-energy">+${fmt(fb.gained)} <small>ENERGY</small></p>
        <ul class="cc-fb-log">${fb.log.map((l) => `<li class="${l.correct ? "ok" : "no"}">${l.correct ? "✅" : l.timeout ? "⏰" : "💪"} ${esc(l.answer)}${l.correct ? ` <b>+${fmt(l.gained)}</b>` : ""}</li>`).join("")}</ul>
        ${fb.log.map((l) => awardHTML(l.award)).join("")}${wait}</div>`;
    }
    if (fb.correct) {
      const speedPart = (fb.parts.find((x) => x[0].includes("Speed bonus")) || [0, 0])[1];
      return `<div class="cc-card cc-feedback cc-pop is-right"><div class="cc-fx" aria-hidden="true"></div>
        ${av("happy")}
        <div class="cc-fb-title ${fb.fast ? "is-fast" : ""}">${fb.fast ? "LIGHTNING ANSWER!" : "PERFECT!"}</div>
        <p class="cc-fb-energy">+${fmt(fb.gained)} <small>ENERGY ⚡</small></p>
        ${fb.fast && speedPart ? `<p class="cc-fb-speed">⚡ SPEED BONUS +${fmt(speedPart)}</p>` : ""}
        ${fb.combo ? `<div class="cc-combo"><span class="flame">🔥</span> ${fb.streak} ANSWER STREAK! <b>+${POINTS.combo}</b></div>` : fb.streak >= 2 ? `<p class="cc-streak-note">🔥 ${fb.streak} in a row — keep it up!</p>` : ""}
        <ul class="cc-fb-parts">${fb.parts.map(([label, v]) => `<li><span>${esc(label)}</span><b>+${fmt(v)}</b></li>`).join("")}</ul>
        ${awardHTML(fb.award)}${wait}</div>`;
    }
    return `<div class="cc-card cc-feedback cc-pop is-wrong"><div class="cc-fx" aria-hidden="true"></div>
      ${av("oops")}
      <div class="cc-fb-title is-try">${fb.timeout ? "TIME'S UP!" : pick(TRY_TITLES)}</div>
      <p class="cc-fb-sub">${fb.timeout ? "No worries — you'll get the next one! ⏰" : "Every try makes you stronger! 💪"}</p>
      <p class="cc-fb-answer">Correct answer:<br /><b>${esc(fb.answer)}</b></p>
      ${fb.shieldUsed ? `<p class="cc-fb-note">🛡️ Your SHIELD protected your streak!</p>` : ""}
      <p class="cc-fb-note">No energy lost — your team still needs you!</p>${wait}</div>`;
  }

  // Local burst of stars / energy when the feedback card appears.
  function fbEffects(stage, fb) {
    const box = stage.querySelector(".cc-fx");
    if (!box || !fb) return;
    if (fb.speed) {
      if (fb.correctCount) fxBurst(box, 50, 20, ["⚡", "⭐", "✨"], 10, 130);
    } else if (fb.correct) {
      fxBurst(box, 50, 20, ["⭐", "✨", "⚡"], fb.combo ? 22 : fb.fast ? 16 : 11, fb.combo ? 200 : 150);
      if (fb.combo) fxBurst(box, 50, 20, ["🔥"], 8, 180);
    } else {
      fxBurst(box, 50, 20, ["✨", "💪"], 5, 90);
    }
  }

  // ----- host arena -----
  let arenaPrev = null;
  const gainAcc = {};
  const gainTimer = {};

  function buildArena() {
    built = "arena:" + (game && game.seed);
    arenaPrev = null;
    CC_TEAM_KEYS.forEach((k) => {
      gainAcc[k] = 0;
      clearTimeout(gainTimer[k]);
      gainTimer[k] = null;
    });
    $("screen-arena").innerHTML = `
      <div class="arena">
        <div class="arena-head">
          <div class="arena-round"><span id="ar-round-num"></span><b id="ar-round-type"></b></div>
          <div class="arena-timer" id="ar-timer"><span id="ar-timer-num">0</span></div>
          <div class="arena-meta"><span id="ar-active"></span><span id="ar-answered"></span><span>Room <b>${esc(roomCode)}</b></span></div>
        </div>
        <div class="arena-event" id="ar-event" aria-live="polite"></div>
        <div class="arena-lanes" id="ar-teams">
          ${CC_TEAM_KEYS.map((k) => {
            const t = CC_TEAMS[k];
            return `<div class="ar-lane" data-team="${k}" style="--tc:${t.color};--ts:${t.soft};--tl:${TEAM_LIGHT[k]}">
              <div class="ar-rank" data-rank>•</div>
              <img class="ar-badge" src="${t.badge}" alt="${esc(t.name)}" />
              <div class="ar-main">
                <div class="ar-topline"><b class="ar-name">${t.emoji} ${esc(t.name)}</b><span class="ar-sub" data-sub></span></div>
                <div class="ar-track">
                  <div class="ar-fill" data-fill></div>
                  <div class="ar-runners" data-runners></div>
                  <span class="ar-flag" aria-hidden="true">🏁</span>
                  <div class="ar-fx" data-fx aria-hidden="true"></div>
                </div>
              </div>
              <div class="ar-score" data-score>0</div>
            </div>`;
          }).join("")}
        </div>
        <div class="arena-foot">
          <div class="arena-leader"><h3>⭐ Top players</h3><ol id="ar-leader"></ol></div>
          <div class="arena-controls">
            <p class="arena-note">Team energy is balanced for team size.</p>
            <button class="cc-btn-soft" id="ar-skip">Skip ▶</button>
            <button class="cc-btn-danger" id="ar-end">End game</button>
          </div>
        </div>
      </div>`;
    $("ar-skip").addEventListener("click", () => {
      if (game && (game.phase === "question" || game.phase === "break")) advance(game.round, game.phase);
    });
    $("ar-end").addEventListener("click", () => {
      if (confirm("End the game now and show the results?")) finishGame();
    });
  }

  // New team energy arrived from Firebase → a purely local celebration (no animation data is synced).
  // Bursts of small updates are merged so the screen never turns into confetti soup.
  function queueGain(k, delta) {
    gainAcc[k] = (gainAcc[k] || 0) + delta;
    if (gainTimer[k]) return;
    gainTimer[k] = setTimeout(() => {
      const d = gainAcc[k];
      gainAcc[k] = 0;
      gainTimer[k] = null;
      celebrateTeam(k, d);
    }, 450);
  }
  function celebrateTeam(k, d) {
    const lane = document.querySelector(`.ar-lane[data-team="${k}"]`);
    if (!lane || lane.hidden || d <= 0) return;
    restartClass(lane, "gain", 1000);
    restartClass(lane.querySelector("[data-runners]"), "cheer", 900);
    const fx = lane.querySelector("[data-fx]");
    const x = parseFloat(lane.querySelector("[data-fill]").style.width) || 10;
    const plus = document.createElement("span");
    plus.className = "ar-plus";
    plus.textContent = "+" + fmt(d) + " ⚡";
    plus.style.left = x + "%";
    fx.appendChild(plus);
    setTimeout(() => plus.remove(), 1500);
    fxBurst(fx, x, 30, ["⚡", "✨", "⭐", CC_TEAMS[k].emoji], Math.min(18, 6 + Math.floor(d / 70)), 90 + Math.min(120, d / 6));
  }

  function renderArena() {
    showScreen("arena");
    document.body.classList.add("cc-wide");
    if (built !== "arena:" + (game && game.seed)) buildArena();
    const stats = teamStats();
    const ranked = ranking(stats);
    const top = Math.max(1, ...CC_TEAM_KEYS.map((k) => stats[k].score));
    const maxSize = Math.max(1, ...CC_TEAM_KEYS.map((k) => stats[k].size));
    // Fixed-ish scale (grows with the game) so every bar visibly advances instead of the leader always sitting at 100%.
    const cap = Math.max(top * 1.1, maxSize * CC_ROUNDS.length * 130);
    const anyScore = top > 1;
    const r = game && game.round ? game.round : 0;
    const plan = CC_ROUNDS[r - 1];
    const inBreak = game && game.phase === "break";
    const lastRound = r >= CC_ROUNDS.length;
    const lead = ranked[0] && ranked[0].score > 0 ? CC_TEAMS[ranked[0].key] : null;
    const c = activeCounts();
    $("ar-active").textContent = `👥 ${c.active} active`;
    if (inBreak) {
      // Round summary lives in the header so all four lanes stay visible between rounds.
      $("ar-round-num").textContent = `${lastRound ? "FINAL ROUND" : "ROUND " + r} COMPLETE`;
      $("ar-round-type").textContent = lead ? `${lead.emoji} ${lead.name} LEADS!` : "Great effort, everyone!";
      $("ar-answered").innerHTML = `<span data-break-count>${lastRound ? "Results coming up…" : "Next round in " + secondsLeft()}</span>`;
    } else {
      $("ar-round-num").textContent = plan && plan.final ? "FINAL ROUND" : `ROUND ${r} / ${CC_ROUNDS.length}`;
      $("ar-round-type").textContent = plan ? `${plan.icon} ${plan.label}` : "";
      $("ar-answered").textContent = `✅ ${c.answered} / ${c.active} answered`;
    }

    const scores = {};
    CC_TEAM_KEYS.forEach((k) => {
      const lane = document.querySelector(`.ar-lane[data-team="${k}"]`);
      const s = stats[k];
      lane.hidden = !s.size;
      if (!s.size) return;
      scores[k] = s.score;
      const pct = Math.max(12, Math.min(100, (s.score / cap) * 100));
      lane.querySelector("[data-fill]").style.width = pct + "%";
      lane.querySelector("[data-runners]").style.left = pct + "%";
      tweenNumber(lane.querySelector("[data-score]"), s.score);
      lane.querySelector("[data-sub]").textContent = `${s.size} players · ${s.answered}/${s.active} answered`;
      lane.querySelector("[data-rank]").textContent = anyScore ? "#" + (ranked.findIndex((x) => x.key === k) + 1) : "•";
      lane.classList.toggle("is-leader", !!ranked[0] && ranked[0].key === k && s.score > 0);
      // Up to three representative mascots (the team's top scorers) run at the front of the bar.
      const mascots = s.members.slice().sort((a, b) => (b.energy || 0) - (a.energy || 0)).slice(0, 3);
      const mKey = mascots.map((m) => m.id + m.avatar).join("|");
      const runners = lane.querySelector("[data-runners]");
      if (runners.dataset.key !== mKey) {
        runners.dataset.key = mKey;
        runners.innerHTML = mascots.map((m) => `<img class="ar-runner" src="${ccAvatarUrl(m.avatar)}" alt="" />`).join("");
      }
      if (arenaPrev && arenaPrev[k] != null && s.score > arenaPrev[k]) queueGain(k, s.score - arenaPrev[k]);
    });
    arenaPrev = scores;

    const leaders = studentList().sort((a, b) => (b.energy || 0) - (a.energy || 0)).slice(0, 5);
    $("ar-leader").innerHTML = leaders
      .map((p) => `<li style="--tc:${CC_TEAMS[p.team].color}">${avatarImg(p, "cc-av cc-av--xs")}<span>${esc(p.name)}</span><em>${CC_TEAMS[p.team].emoji}</em><b>${fmt(p.energy)}</b></li>`)
      .join("");
    pumpEvents();
  }

  // ----- results -----
  function computeResults() {
    const stats = teamStats();
    const rank = ranking(stats);
    const studs = studentList();
    const acc = (s) => (s.answered ? s.correct / s.answered : 0);
    const totals = studs.reduce((a, s) => ({ c: a.c + (s.correct || 0), n: a.n + (s.answered || 0) }), { c: 0, n: 0 });
    return {
      rank,
      top: studs.slice().sort((a, b) => (b.energy || 0) - (a.energy || 0)).slice(0, 5),
      classAcc: totals.n ? Math.round((totals.c / totals.n) * 100) : 0,
      bestAcc: studs.filter((s) => (s.answered || 0) >= 3).sort((a, b) => acc(b) - acc(a) || (b.correct || 0) - (a.correct || 0))[0],
      bestStreak: studs.slice().sort((a, b) => (b.bestStreak || 0) - (a.bestStreak || 0))[0],
      fastest: studs.filter((s) => s.fastestMs != null).sort((a, b) => a.fastestMs - b.fastestMs)[0],
      acc,
    };
  }

  const POD_HEIGHT = [1, 0.78, 0.62, 0.5];
  const POD_MEDAL = ["🥇", "🥈", "🥉", "⭐"];
  const POD_MSG = ["CHAMPIONS! 🏆", "SO CLOSE — great teamwork!", "AMAZING ENERGY! ⚡", "AWESOME EFFORT! 🌟"];

  function confettiHTML() {
    const colors = ["#ff3e79", "#ffda26", "#4fc9ff", "#22b35e", "#ff8a1f", "#a66bff"];
    let out = "";
    for (let i = 0; i < 28; i++) {
      const dur = (5 + Math.random() * 4).toFixed(1);
      out += `<i style="left:${Math.round(Math.random() * 100)}%;--sx:${Math.round(Math.random() * 120 - 60)}px;background:${colors[i % colors.length]};animation-duration:${dur}s;animation-delay:-${(Math.random() * dur).toFixed(1)}s"></i>`;
    }
    return `<div class="cc-confetti" aria-hidden="true">${out}</div>`;
  }

  // Podium order is 2nd · 1st · 3rd · 4th; the lowest step rises first so the winner is revealed last.
  function podiumHTML(res) {
    const order = [1, 0, 2, 3].filter((i) => res.rank[i]);
    return `<div class="cc-podium">${order
      .map((i) => {
        const s = res.rank[i];
        const t = CC_TEAMS[s.key];
        const mascots = s.members.slice().sort((a, b) => (b.energy || 0) - (a.energy || 0)).slice(0, 3);
        return `<div class="cc-pod${i === 0 ? " is-first" : ""}" style="--tc:${t.color};--tl:${TEAM_LIGHT[s.key]};--k:${POD_HEIGHT[i]};--d:${(3 - i) * 0.35}s">
          <div class="cc-pod-top">
            ${i === 0 ? `<span class="cc-pod-crown">👑</span>` : ""}
            <div class="cc-pod-mascots">${mascots.map((m) => `<img src="${ccAvatarUrl(m.avatar)}" alt="" />`).join("")}</div>
            <img class="cc-pod-badge" src="${t.badge}" alt="${esc(t.name)}" />
            <b class="cc-pod-name">${t.emoji} ${esc(t.short)}</b>
            <span class="cc-pod-msg">${POD_MSG[i]}</span>
          </div>
          <div class="cc-pod-block"><span class="cc-pod-medal">${POD_MEDAL[i]}</span><strong>${fmt(s.score)}</strong></div>
        </div>`;
      })
      .join("")}</div>`;
  }

  function mvpHTML(res) {
    const mvp = res.top[0];
    if (!mvp) return "";
    const t = CC_TEAMS[mvp.team];
    const rest = res.top.slice(1);
    return `<div class="cc-mvp" style="--tc:${t.color}">
        <div class="cc-mvp-av">${avatarImg(mvp, "cc-mvp-img")}</div>
        <div class="cc-mvp-info"><small>⭐ MVP</small><b>${esc(mvp.name)}</b><span>${t.emoji} ${esc(t.name)} · ${fmt(mvp.energy)} energy</span></div>
      </div>
      ${rest.length ? `<ol class="cc-res-top">${rest.map((s, i) => `<li style="--tc:${CC_TEAMS[s.team].color}"><em>${i + 2}</em>${avatarImg(s, "cc-av cc-av--sm")}<span>${esc(s.name)}</span><small>${CC_TEAMS[s.team].emoji}</small><b>${fmt(s.energy)}</b></li>`).join("")}</ol>` : ""}`;
  }

  function renderResults() {
    showScreen("results");
    document.body.classList.toggle("cc-wide", isHost);
    const res = computeResults();
    const key = JSON.stringify([res.rank.map((s) => [s.key, s.score]), res.top.map((p) => [p.id, p.energy]), me().energy]);
    if (resultsKey === key) return;
    resultsKey = key;
    const p = me();
    const nameOf = (s) => (s ? esc(s.name) : "—");
    const highlights = `<div class="cc-res-highlights">
      <div class="cc-hl"><span>🎯</span><small>CLASS ACCURACY</small><b>${res.classAcc}%</b><em>Best: ${nameOf(res.bestAcc)}${res.bestAcc ? ` (${Math.round(res.acc(res.bestAcc) * 100)}%)` : ""}</em></div>
      <div class="cc-hl"><span>🔥</span><small>BEST STREAK</small><b>${res.bestStreak ? res.bestStreak.bestStreak || 0 : 0}×</b><em>${nameOf(res.bestStreak)}</em></div>
      <div class="cc-hl"><span>⚡</span><small>FASTEST ANSWER</small><b>${res.fastest ? (res.fastest.fastestMs / 1000).toFixed(1) + "s" : "—"}</b><em>${nameOf(res.fastest)}</em></div>
    </div>`;
    const winner = res.rank[0] ? CC_TEAMS[res.rank[0].key] : null;
    const head = `<div class="cc-res-head">
      <p class="cc-kicker">⚔️ CLASS CLASH · FINAL RESULTS</p>
      ${winner ? `<img class="cc-res-win-badge" src="${winner.badge}" alt="" />` : ""}
      <h2>${winner ? `${esc(winner.name)} WINS!` : "GAME OVER"}</h2>
      <p class="cc-res-cheer">Every team powered up the arena — great teamwork, class! 🌟</p>
    </div>`;

    if (isHost) {
      $("screen-results").innerHTML = `<div class="cc-panel cc-results cc-results--host">${confettiHTML()}${head}
        <div class="cc-res-grid"><div><h3>🏆 Team podium</h3>${podiumHTML(res)}</div><div><h3>⭐ MVP &amp; top players</h3>${mvpHTML(res)}</div></div>
        ${highlights}
        <div class="cc-res-actions"><button class="btn btn-start" id="cc-play-again">🔁 PLAY AGAIN</button><button class="btn btn-danger" id="cc-close-room">Close room</button></div></div>`;
      $("cc-play-again").addEventListener("click", async (e) => {
        e.target.disabled = true;
        try {
          await playAgain();
        } finally {
          e.target.disabled = false;
        }
      });
      $("cc-close-room").addEventListener("click", () => {
        if (confirm("Close this room for everyone?")) leaveRoom();
      });
    } else {
      const myTeam = CC_TEAMS[p.team];
      const myRank = res.rank.findIndex((s) => s.key === p.team);
      const myAcc = p.answered ? Math.round(((p.correct || 0) / p.answered) * 100) : 0;
      const cheer = myRank === 0
        ? "Your team WON! Thank you for every answer! 🏆"
        : `Great teamwork! Every correct answer powered up ${myTeam ? esc(myTeam.short) : "your team"}. 🌟`;
      $("screen-results").innerHTML = `<div class="cc-panel cc-results">${confettiHTML()}${head}
        ${myTeam ? `<div class="cc-res-me" style="--tc:${myTeam.color};--ts:${myTeam.soft}">
          <div class="cc-res-me-av">${avatarImg(p, "cc-av cc-av--lg")}</div><div><b>${esc(p.name)}</b><span>${myTeam.emoji} ${esc(myTeam.name)} · ${myRank >= 0 ? POD_MEDAL[myRank] + " " + ["1st", "2nd", "3rd", "4th"][myRank] + " place" : ""}</span><em>${cheer}</em></div></div>
        <div class="cc-res-mystats">
          <div><small>MY SCORE</small><b>${fmt(p.energy)}</b></div><div><small>ACCURACY</small><b>${myAcc}%</b></div>
          <div><small>BEST STREAK</small><b>${p.bestStreak || 0}×</b></div><div><small>FASTEST</small><b>${p.fastestMs != null ? (p.fastestMs / 1000).toFixed(1) + "s" : "—"}</b></div>
        </div>` : ""}
        <h3>🏆 Team podium</h3>${podiumHTML(res)}
        <h3>⭐ MVP &amp; top players</h3>${mvpHTML(res)}
        ${highlights}
        <p class="cc-wait">Waiting for your teacher to play again…</p></div>`;
    }
  }

  // ---------- local clock: timers, countdowns, timeouts, host round control ----------
  function tick() {
    if (!roomCode || !game || !topicReady) return;
    const left = secondsLeft();
    document.querySelectorAll("[data-countdown]").forEach((el) => (el.textContent = left));
    const r = game.round || 0;
    const plan = CC_ROUNDS[r - 1];
    if (status === "playing" && plan) {
      const inQ = game.phase === "question";
      const frac = inQ ? clamp01((game.phaseEndsAt - now()) / (plan.seconds * 1000)) : 0;
      if (isHost) {
        const timer = $("ar-timer");
        if (timer) {
          timer.style.setProperty("--p", frac * 100);
          timer.classList.toggle("is-low", inQ && left <= 5);
          $("ar-timer-num").textContent = inQ ? left : "✓";
        }
        const bc = document.querySelector("[data-break-count]");
        if (bc && r < CC_ROUNDS.length) bc.textContent = "Next round in " + left;
      } else {
        const fill = $("cc-timer-fill");
        if (fill) {
          fill.style.width = frac * 100 + "%";
          fill.classList.toggle("is-low", inQ && left <= 5);
          $("cc-timer-num").textContent = inQ ? left + "s" : "";
        }
        updateWaitLine();
        const s = ensureRoundState();
        const answered = (me().lastRound || 0) >= r;
        if (s && me().team && !answered && !s.done && !s.pending && (!inQ || now() >= game.phaseEndsAt)) {
          submitTimeout();
        }
      }
    }
    if (isHost) hostTick();
    else studentFallbackTick();
    repairStatus();
    introTick();
  }

  window.ClassClash = { attach, detach, onPlayers, onStatus, startGame, isInGame };
})();
