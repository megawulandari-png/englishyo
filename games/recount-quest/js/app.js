/* RECOUNT QUEST — screens, router, progress, Recount Passport, Master Quest */
(function () {
  "use strict";
  var RQ = window.RQ, U = RQ.util, D = RQ.data, S = RQ.store, A = RQ.act, esc = U.esc;
  var app, STEP_IDS = ["story", "timetrack", "details", "detective", "deeper", "challenge"], SCORED = ["timetrack", "details", "detective", "deeper", "challenge"];
  var MASTER_PASS = 7, MASTER_LEN = 10;

  /* ------------------------------------------------------------ lookups & progress */
  function world(id) { return D.worlds.filter(function (w) { return w.id === id; })[0]; }
  function ep(id) { return D.episodes.filter(function (e) { return e.id === id; })[0]; }
  function eps(wid) { return D.episodes.filter(function (e) { return e.world === wid; }); }
  function stepInfo(id) { return D.steps.filter(function (s) { return s.id === id; })[0]; }
  function doneCount(id) { var E = S.ep(id); return STEP_IDS.filter(function (s) { return E.steps[s]; }).length; }
  function worldDone(wid) { return eps(wid).filter(function (e) { return S.ep(e.id).completed; }).length; }
  function totalDone() { return D.worlds.reduce(function (n, w) { return n + worldDone(w.id); }, 0); }
  function masterUnlocked() { return D.worlds.every(function (w) { return worldDone(w.id) >= 1; }); }
  function nextStep(id) { var E = S.ep(id); return STEP_IDS.filter(function (s) { return !E.steps[s]; })[0] || null; }
  function starStr(n) { return "★★★".slice(0, n) + "☆☆☆".slice(0, 3 - n); }
  function pct(st) { return st && st.total ? Math.round(st.ok / st.total * 100) : null; }

  function markDone(id, step, stat) {
    var E = S.ep(id); E.steps[step] = true; if (stat && stat.total) E.acc[step] = { ok: stat.ok, total: stat.total };
    var all = STEP_IDS.every(function (s) { return E.steps[s]; });
    if (all) {
      var ok = 0, tot = 0; SCORED.forEach(function (s) { if (E.acc[s]) { ok += E.acc[s].ok; tot += E.acc[s].total; } });
      var r = tot ? ok / tot : 1, stars = r >= 0.85 ? 3 : r >= 0.6 ? 2 : 1;
      E.completed = true; E.stars = Math.max(E.stars || 0, stars); E.lastStars = stars;
    }
    S.save(); return all;
  }

  function go(h) { if (location.hash === h) route(); else location.hash = h; }

  /* ------------------------------------------------------------ small view helpers */
  function art(kind, id, emoji) {
    var key = kind === "world" ? "world-" + id : id + "-card", f = RQ.assets[key];
    return '<div class="cover cover-' + id + (f ? " has-img" : "") + '" aria-hidden="true">' + (f ? '<img class="cv-img cv-' + kind + '" src="img/' + f + '" alt="" loading="lazy" decoding="async">' : '<span class="cv-main">' + emoji + "</span>") + '<i class="cv-a"></i><i class="cv-b"></i><i class="cv-c"></i></div>';
  }
  function appbar(crumbs) {
    return '<nav class="appbar" aria-label="Breadcrumb">' + crumbs.map(function (c, i) { return c.h ? '<a href="' + c.h + '">' + (i === 0 ? "← " : "") + esc(c.t) + "</a>" : "<span>" + esc(c.t) + "</span>"; }).join('<i aria-hidden="true">/</i>') + "</nav>";
  }
  /* a note when the learner played an earlier version of a story that has since been revised */
  function legacyNote(E) {
    var L = E && E.legacy;
    if (!L || !(L.completed || L.stars)) return "";
    return '<p class="legacy-note">You played an earlier version of this story' + (L.stars ? " (" + starStr(L.stars) + ")" : "") + ". This version is new, so your progress here starts again. Your old result is kept in your Passport.</p>";
  }
  /* quiet “Sources and learn more” box (closed by default) for factual and biographical stories */
  function sourcesBox(e) {
    var list = RQ.sources && RQ.sources[e.id];
    if (!list || !list.length) return "";
    return '<details class="sources"><summary>Sources and learn more</summary><p class="src-lead">This recount is based on the sources below. You can read them to learn more. The links open in a new tab and leave the game.</p><ul class="src-list">' +
      list.map(function (x) { return '<li><a href="' + esc(x.u) + '" target="_blank" rel="noopener noreferrer">' + esc(x.t) + '</a><span class="src-meta"> — ' + esc(x.p) + ' <span class="src-lang" title="' + (x.l === "ID" ? "Written in Indonesian" : "Written in English") + '">' + esc(x.l) + "</span></span></li>"; }).join("") +
      '</ul><p class="src-note">Pictures in this game are drawings, not photographs. Where sources disagree, the story says only what they all support.</p></details>';
  }
  function setWorld(w) { document.body.setAttribute("data-world", w || "home"); }
  function show(html, focusSel) {
    RQ.stopAudio(); app.innerHTML = html; window.scrollTo(0, 0);
    var h = app.querySelector(focusSel || "h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  /* ------------------------------------------------------------ HOME */
  function home() {
    setWorld("home");
    var tot = totalDone(), unlocked = masterUnlocked(), M = S.data.master;
    show(
      '<section class="hero"><div class="hero-text"><p class="eyebrow">ENGLISH YO! · A story adventure</p>' +
      '<h1 class="logo-h1"><img class="logo" src="img/' + RQ.ui.logo + '" alt="Recount Quest. Past Moments. Powerful Stories." decoding="async"></h1>' +
      '<p class="lead">A recount tells past events in the order they happened. Read nine stories in three worlds, listen to them, solve reading missions and become a Recount Master.</p><p class="hero-cta"><a class="btn btn-yellow" href="#/learn">Learn first</a></p></div>' +
      '<div class="hero-art" aria-hidden="true">' + U.img("boy", "ha-boy") + U.img("explorer", "ha-girl") + U.img("star", "ha-star") + U.img("rocket", "ha-rocket") + '</div></section>' +
      '<a class="learncard" href="#/learn"><span class="mi">' + U.img("book", "ic-lg") + '</span><div><h3>LEARN</h3><p>What is a recount? Your learning goals and the three kinds of recount, in two minutes.</p></div><span class="mgo">Open →</span></a>' +
      '<h2 class="sec">Choose your world</h2><div class="worlds">' +
      D.worlds.map(function (w) {
        var d = worldDone(w.id);
        return '<a class="wcard w-' + w.id + '" href="#/world/' + w.id + '"><div class="wart">' + art("world", w.id, w.icon) + '</div><div class="wbody"><span class="wkind">' + esc(w.kind) + "</span><h3>" + esc(w.name) + "</h3><p>" + esc(w.blurb) + '</p><div class="wfoot"><span class="pill">3 stories</span><span class="pips" aria-label="' + d + ' of 3 completed">' + [0, 1, 2].map(function (k) { return '<i class="' + (k < d ? "on" : "") + '"></i>'; }).join("") + '</span></div><span class="wgo">Enter world →</span></div></a>';
      }).join("") + "</div>" +
      '<div class="home-row">' +
      '<a class="mcard ' + (unlocked ? "open" : "locked") + '" href="#/master"><span class="mi">' + U.img("trophy", "ic-lg") + '</span><div><h3>RECOUNT MASTER QUEST</h3><p>' + (unlocked ? "Unlocked! Test what you know across all three worlds." + (M.best ? " Best: " + M.best + "/" + MASTER_LEN : "") : "Finish one story in each world to unlock it.") + '</p></div><span class="mgo">' + (unlocked ? "Start →" : U.img("lock", "ic-sm")) + "</span></a>" +
      '<a class="pcard" href="#/passport"><span class="mi">' + U.img("passport", "ic-lg") + '</span><div><h3>RECOUNT PASSPORT</h3><p><b>' + tot + " / 9 Stories</b> completed</p></div><span class=\"mgo\">Open →</span></a></div>" +
      '<p class="resetrow"><button type="button" class="btn-link" data-reset>Reset progress</button></p>'
    );
  }

  /* ------------------------------------------------------------ WORLD */
  function worldScreen(id) {
    var w = world(id); if (!w) return go("#/");
    setWorld(id);
    show(
      appbar([{ t: "All worlds", h: "#/" }, { t: w.name }]) +
      '<header class="whead">' + U.img("bg-" + id, "whead-bg") + '<p class="eyebrow">' + esc(w.kind) + '</p><h1>' + U.worldIc(w, "ic-h1") + " " + esc(w.name) + '</h1><div class="wdef"><p>' + esc(w.what) + '</p>' + (w.note ? '<p class="wnote">' + esc(w.note) + '</p>' : '') + '<ul class="cluechips">' + w.clues.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div></header>" +
      '<h2 class="sec">Choose a story</h2><div class="eps">' +
      eps(id).map(function (e, i) {
        var E = S.ep(e.id), n = doneCount(e.id);
        var state = E.completed ? '<span class="state done">✓ Completed</span>' : n ? '<span class="state prog">' + n + " / 6 missions</span>" : '<span class="state new">New</span>';
        return '<a class="ecard" href="#/ep/' + e.id + '"><div class="eart">' + art("ep", e.id, e.icon) + '</div><div class="ebody"><span class="enum">Episode ' + (i + 1) + (e.model ? " · Model Story" : "") + "</span><h3>" + esc(e.title) + '</h3><p class="etheme">' + esc(e.theme) + '</p><div class="efoot">' + state + '<span class="stars" aria-label="' + (E.stars || 0) + ' of 3 stars">' + starStr(E.stars || 0) + '</span></div><span class="btn btn-pink">' + (E.completed ? "Play again ▶" : n ? "Continue ▶" : "Play ▶") + "</span></div></a>";
      }).join("") + "</div>"
    );
  }

  /* ------------------------------------------------------------ EPISODE MAP */
  function epScreen(id) {
    var e = ep(id); if (!e) return go("#/");
    var w = world(e.world), E = S.ep(id), nx = nextStep(id);
    setWorld(e.world);
    show(
      appbar([{ t: w.name, h: "#/world/" + w.id }, { t: e.title }]) +
      '<header class="ehead">' + '<p class="eyebrow">' + esc(w.kind) + " · " + esc(e.theme) + (e.model ? " · Model Story" : "") + '</p><h1>' + esc(e.title) + '</h1><ul class="cluechips">' + e.focus.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" + legacyNote(E) + "</header>" +
      '<div class="mapwrap"><ol class="map">' + D.steps.map(function (s, i) {
        var isLast = s.id === "complete", dn = isLast ? E.completed : !!E.steps[s.id], cur = !isLast && s.id === nx;
        var open = !isLast || E.completed;
        var st = dn ? '<span class="ms ms-done">✓</span>' : cur ? '<span class="ms ms-cur">▶</span>' : '<span class="ms">' + (i + 1) + "</span>";
        var sub = isLast ? (E.completed ? starStr(E.stars) + " · " + esc(e.badge.name) : s.desc) : (E.acc[s.id] ? pct(E.acc[s.id]) + "% first try" : s.desc);
        var body = st + '<span class="mi2" aria-hidden="true">' + U.stepIc(s, "ic-step") + '</span><span class="mt"><b>' + esc(s.name) + "</b><small>" + sub + "</small></span>";
        return '<li>' + (open ? '<a class="mstep' + (dn ? " done" : "") + (cur ? " cur" : "") + '" href="#/ep/' + id + "/" + s.id + '">' + body + "</a>" : '<div class="mstep off">' + body + "</div>") + "</li>";
      }).join("") + "</ol>" +
      '<aside class="vocab info-card"><div class="info-card-content"><div class="info-vocab"><h2>Words you may meet</h2><ul class="vocab-list">' + e.vocab.map(function (v) { return "<li>" + esc(v.w) + "</li>"; }).join("") + '</ul></div>' + (RQ.assets[e.id + "-card"] ? '<img class="info-scene" src="img/' + RQ.assets[e.id + "-card"] + '" alt="" decoding="async">' : "") + '</div><div class="mapcta">' +
      (nx ? '<a class="btn btn-pink" href="#/ep/' + id + "/" + nx + '">' + (doneCount(id) ? "Continue: " : "Start: ") + esc(stepInfo(nx).name) + "</a>" : '<a class="btn btn-pink" href="#/ep/' + id + '/complete">See my result</a><button type="button" class="btn btn-ghost" data-replay="' + id + '">↺ Play again</button>') +
      "</div></aside></div>" + sourcesBox(e)
    );
  }

  /* ------------------------------------------------------------ STEP */
  function stepScreen(id, step) {
    var e = ep(id); if (!e) return go("#/");
    if (step === "complete") return completeScreen(e);
    if (STEP_IDS.indexOf(step) < 0) return go("#/ep/" + id);
    var w = world(e.world), E = S.ep(id), info = stepInfo(step);
    setWorld(e.world);
    show(
      appbar([{ t: w.name, h: "#/world/" + w.id }, { t: e.title, h: "#/ep/" + id }, { t: info.name }]) +
      '<div class="strip" role="group" aria-label="Story missions">' + STEP_IDS.map(function (s) { var si = stepInfo(s); return '<a class="sp' + (E.steps[s] ? " done" : "") + (s === step ? " cur" : "") + '" href="#/ep/' + id + "/" + s + '" title="' + esc(si.name) + '" aria-label="' + esc(si.name) + (E.steps[s] ? " (done)" : "") + '">' + (E.steps[s] ? "✓" : U.stepIc(si, "ic-strip")) + "</a>"; }).join("") + "</div>" +
      '<header class="shead"><h1>' + U.stepIc(info, "ic-h1") + " " + esc(info.name) + '</h1><p>' + esc(info.desc) + " · " + esc(e.title) + "</p></header>" +
      '<section class="panel" id="act" aria-live="off"></section>'
    );
    var box = document.getElementById("act");
    function fin(stat) { stepDone(e, step, box, stat); }
    var intro = info.intro ? '<p class="step-intro">' + esc(info.intro) + "</p>" : "";
    if (step === "story") A.reader(box, e, fin);
    else if (step === "timetrack") A.order(box, { title: "Time Track", intro: e.track.intro, events: e.track.events, why: e.track.why }, fin, { last: true });
    else { box.insertAdjacentHTML("beforebegin", intro); A.quiz(box, e[step], fin, { ep: e, lastLabel: step === "challenge" ? "Finish mission ✓" : "Finish ✓" }); }
  }

  function stepDone(e, step, box, stat) {
    var all = markDone(e.id, step, stat), info = stepInfo(step), p = pct(stat);
    if (all) return go("#/ep/" + e.id + "/complete");
    var nx = nextStep(e.id), ni = stepInfo(nx);
    RQ.sfx.win();
    box.innerHTML = '<div class="stepdone"><div class="bigcheck" aria-hidden="true">' + U.img("check", "bigcheck-img") + '</div><h2>' + esc(info.name) + ' complete!</h2>' + (p !== null ? '<p class="acc">First-try accuracy: <b>' + p + "%</b></p>" : "<p class=\"acc\">You finished reading the story. Now show what you understood!</p>") + '<p class="muted">' + (p !== null && p < 70 ? "Mistakes help you learn. You can replay any mission from the mission map." : "Keep going — you are building a strong understanding of this recount.") + '</p><div class="actions"><a class="btn btn-pink" href="#/ep/' + e.id + "/" + nx + '">Next: ' + esc(ni.name) + ' →</a><a class="btn btn-ghost" href="#/ep/' + e.id + '">Mission map</a></div></div>';
    U.say(info.name + " complete"); var h = app.querySelector("h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
  }

  /* ------------------------------------------------------------ COMPLETE */
  function completeScreen(e) {
    var E = S.ep(e.id);
    if (!E.completed) return go("#/ep/" + e.id);
    var w = world(e.world); setWorld(e.world);
    var unl = masterUnlocked(), s = E.lastStars || E.stars;
    show(
      appbar([{ t: w.name, h: "#/world/" + w.id }, { t: e.title, h: "#/ep/" + e.id }, { t: "Story complete" }]) +
      '<section class="complete">' + U.img(s === 3 ? "girl" : "boy", "cmp-av") + '<p class="eyebrow">Story complete</p><h1>' + esc(e.title) + '</h1><div class="bigstars" aria-label="' + s + ' of 3 stars">' + [1, 2, 3].map(function (k) { return '<span class="bs' + (k <= s ? " on" : "") + '" style="animation-delay:' + (k * 0.18) + 's">★</span>'; }).join("") + "</div>" +
      '<div class="badgebox"><span class="bimg" aria-hidden="true">' + U.img("medal", "ic-badge") + '</span><div><small>Badge earned</small><b>' + esc(e.badge.name) + "</b></div></div>" +
      '<ul class="accs">' + SCORED.filter(function (x) { return E.acc[x]; }).map(function (x) { var si = stepInfo(x); return "<li><span>" + U.stepIc(si, "ic-sm") + " " + esc(si.name) + "</span><b>" + pct(E.acc[x]) + "%</b></li>"; }).join("") + "</ul>" +
      '<p class="muted">Stars show your first-try accuracy: 3 stars from 85%, 2 stars from 60%. Your best result is saved.</p>' +
      (unl ? '<div class="unlock">' + U.img("trophy", "ic-sm") + ' <b>Recount Master Quest is unlocked!</b> You have finished a story in every world.</div>' : '<div class="unlock soft">Finish one story in each world to unlock the Recount Master Quest. Worlds finished: <b>' + D.worlds.filter(function (x) { return worldDone(x.id) >= 1; }).length + " / 3</b></div>") +
      '<div class="actions"><a class="btn btn-pink" href="#/world/' + w.id + '">More stories in this world</a>' + (unl ? '<a class="btn btn-yellow" href="#/master">Master Quest</a>' : "") + '<a class="btn btn-ghost" href="#/passport">Passport</a><button type="button" class="btn btn-ghost" data-replay="' + e.id + '">↺ Play again</button></div></section>'
    );
    RQ.sfx.win();
  }

  /* ------------------------------------------------------------ LEARN */
  function learn() {
    setWorld("home"); var L = D.learn;
    show(
      appbar([{ t: "Home", h: "#/" }, { t: "Learn" }]) +
      '<section class="learn"><p class="eyebrow">LEARN</p><h1>Learn about Recount Texts</h1>' +
      '<div class="cp-card"><span class="cp-label">Capaian Pembelajaran</span><p>' + esc(L.cp) + "</p></div>" +
      '<h2 class="sec">Tujuan Pembelajaran</h2><p class="g-sub">By the end of Recount Quest, you can do these ten things.</p><div class="tp-grid">' +
      L.tp.map(function (t, i) { return '<div class="tp-card"><span class="tp-i" aria-hidden="true">' + (U.img(t.im, "ic-tp") || t.i) + '</span><div><b><span class="tp-n">' + (i + 1) + ".</span> " + esc(t.t) + "</b><p>" + esc(t.d) + "</p></div></div>"; }).join("") + "</div>" +
      '<h2 class="sec">What is a Recount?</h2><div class="what"><p><b>A recount tells past events or experiences in the order they happened.</b></p></div>' +
      '<div class="types">' + D.worlds.map(function (w) { return '<div class="type-card t-' + w.id + '"><span class="ty-i" aria-hidden="true">' + U.worldIc(w, "ic-w") + "</span><h3>" + esc(w.kind) + "</h3><p>" + esc(w.what) + '</p><ul class="cluechips">' + w.clues.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>" +
      '<p class="what compare-line"><b>How to tell them apart:</b> a <b>Personal</b> recount is about the writer’s own experience, a <b>Factual</b> recount reports one real event, and a <b>Biographical</b> recount tells the life of one real person.</p>' +
      '<h2 class="sec">How a recount is built</h2><ol class="oer"><li class="o1"><span class="oer-n">1</span><b>Orientation</b><p>Sets the scene: who, when, where.</p></li><li class="arrow" aria-hidden="true">→</li><li class="o2"><span class="oer-n">2</span><b>Events</b><p>What happened, in time order.</p></li><li class="arrow" aria-hidden="true">→</li><li class="o3"><span class="oer-n">3</span><b>Reorientation</b><p>Looks back: a feeling, lesson or ending.</p></li></ol>' +
      '<div class="actions"><a class="btn btn-pink" href="#/">Choose a world →</a></div></section>'
    );
  }

  /* ------------------------------------------------------------ PASSPORT */
  function passport() {
    setWorld("home");
    var tot = totalDone(), M = S.data.master;
    var badges = D.episodes.map(function (e) { return { icon: e.badge.icon, name: e.badge.name, got: S.ep(e.id).completed, hint: "Finish “" + e.title + "”" }; });
    badges.push({ icon: "T", name0: 1, name: "Recount Master", got: !!M.done, hint: "Score " + MASTER_PASS + "/" + MASTER_LEN + " in the Master Quest" });
    if (M.legacy && M.legacy.done) badges.push({ icon: "T", name0: 1, name: "Recount Master (original)", got: true, hint: "Earned in the first version" });
    show(
      appbar([{ t: "Home", h: "#/" }, { t: "Passport" }]) +
      '<section class="passport"><header class="pphead"><div class="pp-title">' + U.img("passport", "pp-art") + '<div><p class="eyebrow">ENGLISH YO!</p><h1>RECOUNT PASSPORT</h1></div></div><div class="ppcount"><b>' + tot + " / 9</b><span>Stories</span></div></header>" +
      '<div class="ppbar"><i style="width:' + (tot / 9 * 100) + '%"></i></div>' +
      D.worlds.map(function (w) {
        var d = worldDone(w.id);
        return '<div class="pprow"><div class="pphd"><span>' + U.worldIc(w, "ic-sm") + " " + esc(w.name) + "<small>" + esc(w.kind) + '</small></span><span class="stars big" aria-label="' + d + ' of 3 stories">' + starStr(d) + "</span></div><ul>" +
          eps(w.id).map(function (e) { var E = S.ep(e.id); return "<li><span>" + esc(e.title) + "</span><em>" + (E.completed ? "✓ " + starStr(E.stars) : doneCount(e.id) ? doneCount(e.id) + "/6 missions" : "Not started") + "</em></li>"; }).join("") + "</ul></div>";
      }).join("") + earlierRows() +
      '<h2 class="sec">Badges</h2><div class="badges">' + badges.map(function (b) { return '<div class="bdg' + (b.got ? " got" : "") + '"><span class="bi" aria-hidden="true">' + (b.got ? U.img(b.name0 ? "trophy" : "medal", "ic-badge") : U.img("lock", "ic-badge dim")) + "</span><b>" + esc(b.name) + "</b><small>" + (b.got ? "Earned" : esc(b.hint)) + "</small></div>"; }).join("") + "</div>" +
      '<div class="actions"><a class="btn btn-pink" href="#/">Back to worlds</a>' + (masterUnlocked() ? '<a class="btn btn-yellow" href="#/master">Master Quest</a>' : "") + "</div></section>"
    );
  }

  /* “Earlier versions”: scores from stories that were revised or retired. They are kept for the learner but never counted. */
  function earlierRows() {
    var rows = [];
    D.episodes.forEach(function (e) {
      var L = S.ep(e.id).legacy;
      if (L && (L.completed || L.stars)) rows.push("<li><span>" + esc(e.title) + "</span><em>" + (L.completed ? starStr(L.stars || L.lastStars || 1) : "started") + " · earlier version</em></li>");
    });
    var R = S.data.retired || {}, names = D.retired || {};
    Object.keys(R).forEach(function (id) {
      if (R[id] && (R[id].completed || R[id].stars)) rows.push("<li><span>" + esc(names[id] || "Earlier story") + "</span><em>" + starStr(R[id].stars || 1) + " · retired</em></li>");
    });
    if (!rows.length) return "";
    return '<div class="pprow earlier"><div class="pphd"><span>Earlier versions<small>Kept for you, but not counted in the new Passport</small></span></div><ul>' + rows.join("") + "</ul></div>";
  }

  /* ------------------------------------------------------------ MASTER QUEST */
  function masterScreen() {
    setWorld("home");
    var unl = masterUnlocked(), M = S.data.master;
    show(
      appbar([{ t: "Home", h: "#/" }, { t: "Master Quest" }]) +
      '<section class="master"><p class="eyebrow">The final challenge</p><h1>' + U.img("trophy", "ic-h1") + ' RECOUNT MASTER QUEST</h1>' +
      '<p class="lead">' + MASTER_LEN + " reading questions from all three worlds. You will tell Personal, Factual and Biographical recounts apart, compare short texts, find evidence, make inferences, find the writer’s purpose, identify structure, arrange events and read a picture with its text.</p>" +
      (M.legacy && (M.legacy.runs || M.legacy.done) ? '<p class="legacy-note">Your result from the first version (best ' + M.legacy.best + " / " + MASTER_LEN + ") is kept in your Passport. The questions are new, so this quest starts again.</p>" : "") +
      '<ul class="req">' + D.worlds.map(function (w) { var d = worldDone(w.id) >= 1; return "<li class=\"" + (d ? "ok" : "") + "\"><span>" + (d ? "✓" : "○") + "</span> " + U.worldIc(w, "ic-sm") + " Finish one story in <b>" + esc(w.name) + "</b>" + (d ? "" : ' — <a href="#/world/' + w.id + '">go</a>') + "</li>"; }).join("") + "</ul>" +
      (unl ? '<p class="muted">' + (M.runs ? "Best score: <b>" + M.best + " / " + MASTER_LEN + "</b>. " : "") + "Score " + MASTER_PASS + " or more to earn the Recount Master badge. You can try as many times as you like.</p><div class=\"actions\"><a class=\"btn btn-pink\" href=\"#/master/play\">" + (M.runs ? "Try again" : "Start the quest") + " →</a></div>" : '<div class="unlock soft">🔒 Locked. Complete the three missions above to unlock.</div>') + "</section>"
    );
  }

  function pickMaster() {
    var by = {}; D.master.forEach(function (q) { (by[q.cat] = by[q.cat] || []).push(q); });
    var chosen = [], rest = [];
    Object.keys(by).forEach(function (c) { var sh = U.shuffle(by[c]); chosen.push(sh[0]); rest = rest.concat(sh.slice(1)); });
    chosen = chosen.concat(U.shuffle(rest).slice(0, MASTER_LEN - chosen.length));
    return U.shuffle(chosen);
  }

  function masterPlay() {
    if (!masterUnlocked()) return go("#/master");
    setWorld("home");
    show(appbar([{ t: "Master Quest", h: "#/master" }, { t: "Playing" }]) + '<header class="shead"><h1>' + U.img("trophy", "ic-h1") + ' Master Quest</h1><p>Answer all ' + MASTER_LEN + " questions</p></header>" + '<section class="panel" id="act"></section>');
    var box = document.getElementById("act");
    A.quiz(box, pickMaster(), function (st) {
      var M = S.data.master; M.runs = (M.runs || 0) + 1; M.best = Math.max(M.best || 0, st.ok); if (st.ok >= MASTER_PASS) M.done = true; S.save();
      var cats = {}; st.results.forEach(function (r) { cats[r.cat] = cats[r.cat] || { ok: 0, n: 0 }; cats[r.cat].n++; if (r.ok) cats[r.cat].ok++; });
      var msg = st.ok === MASTER_LEN ? "Perfect! You are a true Recount Master." : st.ok >= MASTER_PASS ? "Excellent! You are a Recount Master." : "Good effort! Review the stories and try again.";
      RQ.sfx.win();
      box.innerHTML = '<div class="complete"><p class="eyebrow">Master Quest result</p><div class="mscore"><b>' + st.ok + "</b> / " + MASTER_LEN + '</div><h2>' + msg + "</h2>" + (st.ok >= MASTER_PASS ? '<div class="badgebox"><span class="bimg" aria-hidden="true">' + U.img("trophy", "ic-badge") + '</span><div><small>Badge earned</small><b>Recount Master</b></div></div>' : "") +
        '<ul class="accs">' + Object.keys(cats).map(function (c) { return "<li><span>" + esc(c) + "</span><b>" + cats[c].ok + "/" + cats[c].n + "</b></li>"; }).join("") + '</ul><div class="actions"><a class="btn btn-pink" href="#/master">Back</a><button type="button" class="btn btn-ghost" data-again>↺ Try again</button><a class="btn btn-ghost" href="#/passport">Passport</a></div></div>';
      var h = box.querySelector("h2"); h.setAttribute("tabindex", "-1"); h.focus();
    }, { lastLabel: "See my result ✓" });
  }

  /* ------------------------------------------------------------ router & global events */
  function route() {
    var p = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    if (!p.length) return home();
    switch (p[0]) {
      case "world": return worldScreen(p[1]);
      case "ep": return p[2] ? stepScreen(p[1], p[2]) : epScreen(p[1]);
      case "learn": return learn();
      case "passport": return passport();
      case "master": return p[1] === "play" ? masterPlay() : masterScreen();
      default: return home();
    }
  }

  function soundLabel() { var b = document.getElementById("btn-sound"); b.setAttribute("aria-pressed", RQ.sfx.on); document.getElementById("sound-label").textContent = RQ.sfx.on ? "Sound on" : "Sound off"; document.getElementById("sound-ico").textContent = RQ.sfx.on ? "🔊" : "🔇"; }

  function init() {
    app = document.getElementById("app");
    S.load(); soundLabel();
    document.getElementById("btn-sound").addEventListener("click", function () { RQ.sfx.on = !RQ.sfx.on; S.data.sound = RQ.sfx.on; S.save(); soundLabel(); if (RQ.sfx.on) RQ.sfx.tap(); });
    document.addEventListener("click", function (e) {
      var t;
      if ((t = e.target.closest("[data-reset]"))) {
        RQ.modal({ title: "Reset progress?", body: "<p>This will remove all your stars, badges and finished stories on this device. This cannot be undone.</p>", actions: [{ label: "Keep my progress", cls: "btn-ghost" }, { label: "Yes, reset", cls: "btn-pink", fn: function () { S.reset(); soundLabel(); go("#/"); route(); } }] });
      } else if ((t = e.target.closest("[data-replay]"))) {
        var E = S.ep(t.dataset.replay); E.steps = {}; E.acc = {}; S.save(); go("#/ep/" + t.dataset.replay);
      } else if (e.target.closest("[data-again]")) { route(); }
    });
    window.addEventListener("hashchange", route);
    window.addEventListener("pagehide", RQ.stopAudio);
    route();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
