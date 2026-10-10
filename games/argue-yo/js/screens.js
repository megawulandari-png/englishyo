/* ARGUE YO! — menu-level screens (welcome, menu, play, case file, learn, CP & TP, scores, settings, about). */
(function (root) {
  var A = root.ARGUE, U = A.util, S = A.store, P = A.prog, AU = A.audio, esc = U.esc;
  var V = A.screens = {};
  var app = function () { return document.getElementById('app'); };

  function render(html, cls) {
    AU.stop();
    var el = app();
    el.innerHTML = '<div class="screen ' + (cls || '') + '">' + html + '</div>';
    el.scrollTop = 0; window.scrollTo(0, 0);
    var h = el.querySelector('h1,h2'); if (h) { h.setAttribute('tabindex', '-1'); }
    return el.firstElementChild;
  }
  A.render = render;

  function go(hash) { if (location.hash === hash) A.route(); else location.hash = hash; }
  A.go = go;

  /* ---------- modal ---------- */
  A.modal = function (html, opts) {
    opts = opts || {};
    var root_ = document.getElementById('modal-root');
    var m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<div class="modal-card ' + (opts.cls || '') + '">' + html + '</div>';
    root_.appendChild(m);
    function close() { m.remove(); document.removeEventListener('keydown', key); if (opts.onClose) opts.onClose(); }
    function key(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', key);
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) close(); });
    var f = m.querySelector('[data-close],button,a'); if (f) f.focus();
    return { el: m, close: close };
  };

  A.helpModal = function () {
    A.modal('<h2 class="m-h">HOW TO PLAY</h2><ul class="help">' + A.HELP.map(function (h) {
      return '<li><span class="help-i" aria-hidden="true">' + h.icon + '</span><div><b>' + esc(h.t) + '</b><p>' + esc(h.d) + '</p></div></li>';
    }).join('') + '</ul><div class="m-act"><button class="btn b-green" data-close>GOT IT!</button></div>');
  };

  function xpChip() { return '<span class="chip"><img src="assets/icons/star.png" alt="" class="chip-i">' + S.d.xp + ' XP</span>'; }

  /* next place to play: first unlocked, unfinished level */
  function nextTarget() {
    var cs = A.ARGUE_CASES_SORTED;
    for (var i = 0; i < cs.length; i++) {
      if (!P.caseUnlocked(i)) break;
      if (P.closed(cs[i].id)) continue;
      for (var n = 1; n <= 5; n++) if (!P.levelDone(cs[i].id, n)) return { c: cs[i], n: n, i: i };
    }
    return null;
  }

  function certButton() {
    var can = P.canUnlockCertificate(), has = P.hasCertificate() && P.certValid();
    if (has) return '<button class="btn b-yellow btn-lg" data-go="#/certificate"><span class="ico">🎓</span> MY CERTIFICATE <small>Unlocked</small></button>';
    var sub = can.casesReady ? 'Write your reflection' : 'Locked · ' + can.casesDone + '/' + can.required + ' cases';
    return '<button class="btn b-slate btn-lg is-locked" data-go="#/certificate" aria-label="My certificate, locked. ' + sub + '"><span class="ico">🔒</span> MY CERTIFICATE <small>' + sub + '</small></button>';
  }

  /* ---------- welcome (first run) ---------- */
  V.welcome = function () {
    var w = A.COPY.welcome;
    render('<div class="welcome">' +
      '<img class="wel-logo" src="assets/logo/argue-yo-logo.png" alt="ARGUE YO! Hortatory Exposition Game" />' +
      '<form class="wel-card panel" id="wel-form" autocomplete="off">' +
      '<h1 class="wel-h">' + esc(w.title) + '</h1>' +
      '<img class="wel-face" src="assets/expressions/arka-happy.png" alt="" />' +
      '<label class="wel-q" for="wel-name">' + esc(w.ask) + '</label>' +
      '<input id="wel-name" class="input" type="text" maxlength="18" placeholder="' + esc(w.placeholder) + '" autocomplete="nickname" />' +
      '<button class="btn b-green btn-lg" type="submit"><span class="ico">▶</span> ' + esc(w.button) + '</button>' +
      '<p class="wel-note">No login needed. Your progress is saved on this device.</p>' +
      '</form></div>', 'screen-welcome');
    var inp = document.getElementById('wel-name'); inp.focus();
    document.getElementById('wel-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = inp.value.replace(/\s+/g, ' ').trim();
      if (!v) { inp.classList.add('shake'); inp.setAttribute('aria-invalid', 'true'); inp.focus(); setTimeout(function () { inp.classList.remove('shake'); }, 500); return; }
      S.d.name = v.slice(0, 18); S.save(); AU.unlock(); AU.sfx('badge'); go('#/menu');
    });
  };

  /* ---------- main menu ---------- */
  V.menu = function () {
    var cont = nextTarget(), hasProg = S.d.xp > 0 || Object.keys(S.d.cases).length;
    var chars = function (ids) { return ids.map(function (k) { return '<img class="mc mc-' + k + '" src="' + A.CHARS[k].img + '" alt="' + A.CHARS[k].name + '" />'; }).join(''); };
    render('<div class="menu-grid">' +
      '<div class="menu-side menu-left" aria-hidden="false">' + chars(['arka', 'nadia']) + '</div>' +
      '<div class="menu-mid">' +
      '<h1 class="sr-only">ARGUE YO! Hortatory Exposition Game</h1>' +
      '<img class="menu-logo" src="assets/logo/argue-yo-logo.png" alt="ARGUE YO! Hortatory Exposition Game" />' +
      '<p class="menu-tag">' + esc(A.TAGLINE) + '</p>' +
      '<p class="menu-hello">Hi, <b>' + esc(S.d.name || 'Persuader') + '</b>! ' + xpChip() + '</p>' +
      '<nav class="menu-btns" aria-label="Main menu">' +
      (hasProg && cont ? '<button class="btn b-yellow btn-lg menu-cont" data-go="#/lv/' + cont.c.id + '/' + cont.n + '"><span class="ico">⏩</span> CONTINUE <small>Case ' + ('0' + cont.c.no).slice(-2) + ' · Level ' + cont.n + '</small></button>' : '') +
      '<button class="btn b-green btn-lg" data-go="#/play"><span class="ico">▶</span> PLAY</button>' +
      '<button class="btn b-blue btn-lg" data-go="#/learn"><img class="ico-i" src="assets/icons/casefile.png" alt="" /> LEARN</button>' +
      '<button class="btn b-purple btn-lg" data-go="#/cptp"><span class="ico">🎯</span> CP &amp; TP</button>' +
      '<button class="btn b-orange btn-lg" data-go="#/scores"><img class="ico-i" src="assets/icons/reward.png" alt="" /> SCORES</button>' +
      certButton() +
      '<button class="btn b-slate btn-lg" data-go="#/settings"><span class="ico">⚙️</span> SETTINGS</button>' +
      '</nav>' +
      '<button class="btn b-white btn-sm" data-go="#/about">ABOUT / DEV</button>' +
      '<p class="credit">' + esc(A.CREDIT) + '<br /><b>' + esc(A.BRAND) + '</b></p>' +
      '</div>' +
      '<div class="menu-side menu-right">' + chars(['dika', 'sinta']) + '</div>' +
      '</div>', 'screen-menu');
  };

  /* ---------- case select ---------- */
  V.play = function () {
    var cs = A.ARGUE_CASES_SORTED;
    var html = '<div class="page-h"><h1>CHOOSE A CASE FILE</h1><p>Six cases. Five levels each. Close a case to open the next one.</p></div><div class="cases">';
    cs.forEach(function (c, i) {
      var unlocked = P.caseUnlocked(i), pct = P.percent(c.id), closed = P.closed(c.id), st = P.caseStars(c.id);
      var state = closed ? 'COMPLETE' : !unlocked ? 'LOCKED' : pct ? pct + '%' : 'NEW';
      var emblem = c.prop ? '<img src="assets/props/' + c.prop + '.png" alt="" />' : '<span class="emo" aria-hidden="true">' + c.emoji + '</span>';
      html += '<' + (unlocked ? 'button data-go="#/case/' + c.id + '"' : 'div') + ' class="case-card' + (unlocked ? '' : ' is-locked') + (closed ? ' is-done' : '') + '"' + (unlocked ? '' : ' aria-disabled="true"') + '>' +
        '<span class="cc-img" style="background-image:url(assets/backgrounds/' + c.bg + '.png)"><span class="cc-emblem">' + emblem + '</span>' + (unlocked ? '' : '<span class="cc-lock" aria-hidden="true">🔒</span>') + '</span>' +
        '<span class="cc-body"><span class="cc-no">CASE ' + ('0' + c.no).slice(-2) + '</span>' +
        '<span class="cc-title">' + esc(c.title) + '</span>' +
        '<span class="cc-q">“' + esc(c.question) + '”</span>' +
        '<span class="cc-prog"><span class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Case progress"><i style="width:' + pct + '%"></i></span><b>' + pct + '%</b></span>' +
        '<span class="cc-foot"><span class="cc-stars" aria-label="' + st + ' of 3 stars">' + U.stars(st) + '</span><span class="cc-state s-' + state.toLowerCase() + '">' + (closed ? '✔ ' : !unlocked ? '🔒 ' : '') + state + '</span></span>' +
        '</span></' + (unlocked ? 'button' : 'div') + '>';
    });
    html += '</div>';
    if (!S.d.set.teacher) html += '<p class="hint-line">Teachers: you can unlock every case in Settings → Teacher mode.</p>';
    render(html, 'screen-play');
  };

  /* ---------- case file ---------- */
  V.caseFile = function (id) {
    var cs = A.ARGUE_CASES_SORTED, idx = cs.findIndex(function (c) { return c.id === id; });
    if (idx < 0 || !P.caseUnlocked(idx)) return go('#/play');
    var c = cs[idx], g = A.CHARS[c.guide], pct = P.percent(c.id), closed = P.closed(c.id);
    var nextN = 0; for (var n = 1; n <= 5; n++) if (!P.levelDone(c.id, n)) { nextN = n; break; }
    var html = '<div class="cf">' +
      '<div class="cf-folder panel"><div class="cf-tab">CASE FILE ' + ('0' + c.no).slice(-2) + '</div>' +
      '<div class="cf-bg" style="background-image:url(assets/backgrounds/' + c.bg + '.png)"></div>' +
      '<h1 class="cf-title">' + esc(c.title) + '</h1>' +
      '<p class="cf-q">“' + esc(c.question) + '”</p>' +
      '<div class="cf-guide"><img src="' + g.img + '" alt="' + g.name + '" /><div class="speech"><b>' + g.name + ':</b> ' + esc(c.brief) + '</div></div>' +
      '<div class="cf-power"><span>TEXT POWER</span><span class="bar"><i style="width:' + pct + '%"></i></span><b>' + pct + '%</b></div>' +
      (P.levelDone(c.id, 3) ? '<button class="btn b-white btn-sm" data-go="#/text/' + c.id + '">📄 READ THE TEXT</button>' : '') +
      '</div>' +
      '<div class="cf-levels"><h2>MISSIONS</h2><ol class="lvl-list">';
    A.LEVELS.forEach(function (L) {
      var done = P.levelDone(c.id, L.n), unlocked = P.levelUnlocked(idx, L.n), rec = S.d.cases[c.id] && S.d.cases[c.id].lv[L.n];
      var cls = done ? 'is-done' : !unlocked ? 'is-locked' : (L.n === nextN ? 'is-next' : '');
      html += '<li><' + (unlocked ? 'button data-go="#/lv/' + c.id + '/' + L.n + '"' : 'div aria-disabled="true"') + ' class="lvl ' + cls + '" style="--lc:' + L.color + '">' +
        '<img class="lvl-badge" src="' + L.badge + '" alt="" />' +
        '<span class="lvl-t"><small>LEVEL ' + L.n + ' · ' + esc(L.skill) + '</small><b>' + esc(L.name) + '</b><em>' + esc(L.goal) + '</em></span>' +
        '<span class="lvl-s">' + (done ? '<span class="cc-stars" aria-label="' + rec.stars + ' stars">' + U.stars(rec.stars) + '</span><i>REPLAY</i>' : unlocked ? '<i class="go">' + (L.n === nextN ? 'PLAY ▶' : 'PLAY') + '</i>' : '<i>🔒 LOCKED</i>') + '</span>' +
        '</' + (unlocked ? 'button' : 'div') + '></li>';
    });
    html += '</ol>' +
      (closed ? '<div class="cf-closed"><button class="btn b-yellow" data-go="#/closed/' + c.id + '">🏆 VIEW CASE SCORE</button>' + (idx < cs.length - 1 ? ' <button class="btn b-green" data-go="#/case/' + cs[idx + 1].id + '">NEXT CASE »</button>' : '') + '</div>' : '') +
      '<div class="cf-back"><button class="btn b-white btn-sm" data-go="#/play">‹ ALL CASES</button></div></div></div>';
    render(html, 'screen-case');
    AU.sfx('open');
    if (!U.reduced()) { var f = app().querySelector('.cf-folder'); f.classList.add('opening'); }
  };

  /* ---------- learn ---------- */
  function typeBlock(t, text) {
    var T = A.TYPES[t];
    return '<div class="lb t-' + t + '"><span class="tag t-' + t + '">' + T.icon + ' ' + T.label + '</span><p>' + esc(text) + '</p></div>';
  }
  V.learn = function () {
    var L = A.LEARN, html = '<div class="page-h"><h1>LEARN</h1><p>A quick guide before you play.</p></div><div class="learn">';
    L.forEach(function (card, i) {
      html += '<section class="lcard" style="--lc:' + card.color + '"><header><span class="lc-ico" aria-hidden="true">' + card.icon + '</span><h2>' + (i + 1) + '. ' + esc(card.title) + '</h2></header><div class="lc-body">';
      if (card.id === 'what') html += '<p class="lc-big">' + esc(card.big) + '</p><div class="lc-sf"><span class="chip">🎯 Social function</span> To persuade readers that something <b>should</b> or <b>should not</b> be done.</div>';
      if (card.id === 'structure') html += card.parts.map(function (p, k) { return '<div class="lc-step">' + typeBlock(p.type, p.text) + (k < 2 ? '<span class="lc-arrow" aria-hidden="true">↓</span>' : '') + '</div>'; }).join('');
      if (card.id === 'language') html += card.groups.map(function (g) {
        return '<div class="lg"><b>' + esc(g.head) + '</b><div class="words">' + g.words.map(function (w) { return '<span class="word">' + esc(w) + '</span>'; }).join('') + '</div></div>';
      }).join('');
      if (card.id === 'example') html += card.ex.map(function (p) { return typeBlock(p.type, p.text); }).join('') + '<button class="btn b-white btn-sm" id="learn-listen">🔊 LISTEN</button>';
      html += '</div></section>';
    });
    html += '</div><div class="actions"><button class="btn b-green btn-lg" data-go="#/play">' + esc(A.COPY.learnDone) + '</button></div>';
    render(html, 'screen-learn');
    var lb = document.getElementById('learn-listen');
    if (lb) lb.addEventListener('click', function () {
      if (AU.speaking) { AU.stop(); return; }
      if (!AU.canSpeak()) { U.say('Speech is not available in this browser.'); return; }
      AU.speak(A.LEARN[3].ex.map(function (x) { return x.text; }).join(' '));
    });
  };

  /* ---------- CP & TP ---------- */
  V.cptp = function () {
    var D = A.CPTP;
    var html = '<div class="cptp"><div class="page-h"><h1>' + esc(D.title) + '</h1><p>' + esc(D.level) + '</p></div>' +
      '<section class="cp-card cp1"><h2>' + esc(D.cpHead) + '</h2><p>' + esc(D.cp) + '</p></section>' +
      '<section class="cp-card cp2"><h2>🎯 ' + esc(D.focusHead) + '</h2><p><b>' + esc(D.focus) + '</b></p></section>' +
      '<section class="cp-card cp3"><h2>' + esc(D.tpHead) + '</h2><p class="tp-intro">' + esc(D.tpIntro) + '</p><ol class="tp-list">';
    D.tp.forEach(function (t, i) { html += '<li><span class="tp-n">' + (i + 1) + '</span><span class="tp-t">' + esc(t.t) + '<small>' + esc(t.lv) + '</small></span></li>'; });
    html += '</ol></section>' +
      '<div class="actions"><button class="btn b-white" id="cp-print">🖨 PRINT</button><button class="btn b-green" data-go="#/menu">« MENU</button></div></div>';
    render(html, 'screen-cptp');
    document.getElementById('cp-print').addEventListener('click', function () { window.print(); });
  };

  /* ---------- scores ---------- */
  V.scores = function () {
    var cs = A.ARGUE_CASES_SORTED, opw = P.overallPower();
    var html = '<div class="page-h"><h1>SCORES</h1><p>Saved on this device only.</p></div>' +
      '<div class="sc-top">' +
      '<div class="panel sc-box"><small>PLAYER</small><b>' + esc(S.d.name || 'Persuader') + '</b></div>' +
      '<div class="panel sc-box"><small>TOTAL XP</small><b>' + S.d.xp + '</b></div>' +
      '<div class="panel sc-box"><small>CASES CLOSED</small><b>' + P.casesClosed() + ' / ' + cs.length + '</b></div>' +
      '<div class="panel sc-box"><small>RANK</small><b>' + (P.casesClosed() ? P.rank(opw) : 'BEGINNING THINKER') + '</b></div></div>' +
      '<h2 class="sec-h">LEVEL BADGES</h2><div class="badges">';
    A.LEVELS.forEach(function (L) {
      var has = S.d.badges['b' + L.n];
      html += '<div class="badge ' + (has ? '' : 'is-locked') + '"><img src="' + L.badge + '" alt="" /><span>' + esc(L.name) + '</span><em>' + (has ? 'UNLOCKED' : '🔒 LOCKED') + '</em></div>';
    });
    html += '</div><h2 class="sec-h">CASE RESULTS</h2><div class="sc-cases">';
    cs.forEach(function (c, i) {
      var closed = P.closed(c.id), pct = P.percent(c.id), cats = P.cats(c.id);
      html += '<div class="panel sc-case ' + (closed ? 'is-done' : '') + '"><div class="sc-case-h"><span class="cc-no">CASE ' + ('0' + c.no).slice(-2) + '</span><b>' + esc(c.title) + '</b>' +
        '<span class="cc-stars" aria-label="' + P.caseStars(c.id) + ' of 3 stars">' + U.stars(P.caseStars(c.id)) + '</span></div>';
      if (!P.caseUnlocked(i)) html += '<p class="muted">🔒 Locked</p>';
      else {
        html += '<div class="cc-prog"><span class="bar"><i style="width:' + pct + '%"></i></span><b>' + pct + '%</b></div>';
        if (pct) {
          html += '<div class="sc-cats">' + A.CATS.map(function (k) {
            var v = cats[k.key]; return '<span class="sc-cat"><em>' + k.label + '</em><b>' + (v[1] ? Math.round(P.acc(v) * 100) + '%' : '–') + '</b></span>';
          }).join('') + '</div>';
          if (closed) html += '<p class="sc-rank">PERSUASION POWER <b>' + P.power(c.id) + '%</b> · ' + P.rank(P.power(c.id)) + '</p>';
        } else html += '<p class="muted">Not started yet.</p>';
      }
      html += '</div>';
    });
    html += '</div><div class="actions"><button class="btn b-green" data-go="#/menu">« MENU</button></div>';
    render(html, 'screen-scores');
  };

  /* ---------- settings ---------- */
  function toggleRow(key, label, desc) {
    var on = !!S.d.set[key];
    return '<div class="set-row"><div><b>' + label + '</b><small>' + desc + '</small></div>' +
      '<button class="switch" role="switch" aria-checked="' + on + '" data-set="' + key + '"><span class="knob"></span><span class="sw-t">' + (on ? 'ON' : 'OFF') + '</span></button></div>';
  }
  V.settings = function () {
    var html = '<div class="page-h"><h1>SETTINGS</h1></div><div class="panel set-card">' +
      toggleRow('sfx', '🔊 Sound', 'Effects, voices and the welcome. Turn it off to mute the whole game.') +
      toggleRow('music', '🎵 Music', 'Soft background music, separate from sound. Off by default.') +
      toggleRow('voice', '🗣️ Read-aloud voice', 'Lets you press LISTEN to hear a text.') +
      toggleRow('slow', '🐢 Slow voice', 'Read the text more slowly.') +
      toggleRow('big', '🔎 Large text', 'Bigger letters for projectors and smart TVs.') +
      toggleRow('hints', '🎨 Structure hints', 'Show the colours and labels in the complete text.') +
      toggleRow('teacher', '🧑‍🏫 Teacher mode', 'Unlock every case and level for demonstrations.') +
      '<div class="set-row"><div><b>👋 ENGLISH YO! welcome</b><small>Hear the ENGLISH YO! welcome and the game opening again.</small></div><button class="btn btn-sm b-blue" id="set-welcome" type="button">REPLAY ENGLISH YO! WELCOME</button></div>' +
      '<div class="set-row"><div><b>🖥️ Full screen</b><small>Best for interactive flat panels.</small></div><button class="btn btn-sm b-blue" id="set-fs">FULL SCREEN</button></div>' +
      '<div class="set-row set-name"><div><b>🙂 Your name</b></div><div class="name-edit"><input class="input" id="set-name" maxlength="18" value="' + esc(S.d.name) + '" aria-label="Your name" /><button class="btn btn-sm b-green" id="set-name-save">SAVE</button></div></div>' +
      '<div class="set-row"><div><b>♻️ Reset progress</b><small>Delete all scores, badges and XP on this device.</small></div><button class="btn btn-sm b-red" id="set-reset">RESET</button></div>' +
      '</div><div class="actions"><button class="btn b-green" data-go="#/menu">« MENU</button></div>';
    render(html, 'screen-settings');
    U.$$('[data-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.set; S.d.set[k] = !S.d.set[k]; S.save();
        b.setAttribute('aria-checked', S.d.set[k]); b.querySelector('.sw-t').textContent = S.d.set[k] ? 'ON' : 'OFF';
        if (k === 'music' || k === 'sfx') { AU.unlock(); AU.applyPrefs(); }
        if (k === 'big') A.applyPrefs();
        if (k === 'voice' && !S.d.set.voice) AU.stop();
        AU.sfx('click');
      });
    });
    document.getElementById('set-fs').addEventListener('click', A.toggleFullscreen);
    document.getElementById('set-welcome').addEventListener('click', function () { AU.unlock(); go('#/open/replay'); });
    document.getElementById('set-name-save').addEventListener('click', function () {
      var v = document.getElementById('set-name').value.replace(/\s+/g, ' ').trim();
      if (v) { S.d.name = v.slice(0, 18); S.save(); U.say('Name saved'); AU.sfx('correct'); this.textContent = 'SAVED ✓'; }
    });
    document.getElementById('set-reset').addEventListener('click', function () {
      var m = A.modal('<h2 class="m-h">RESET ALL PROGRESS?</h2><p class="m-p">This will remove:</p>' +
        '<ul class="m-list"><li>game progress</li><li>scores</li><li>reflection</li><li>certificate</li><li>completion code</li></ul>' +
        '<p class="m-p"><b>This cannot be undone.</b> Your name and sound settings stay.</p>' +
        '<div class="m-act"><button class="btn b-white" data-close type="button">CANCEL</button><button class="btn b-red" id="reset-yes" type="button">YES, RESET EVERYTHING</button></div>');
      document.getElementById('reset-yes').addEventListener('click', function () { m.close(); S.reset(); AU.sfx('wrong'); A.toast('All progress was reset.'); go('#/menu'); });
    });
  };

  /* ---------- about ---------- */
  V.about = function () {
    render('<div class="page-h"><h1>ABOUT / DEV</h1></div><div class="about panel">' +
      '<img class="about-logo" src="assets/logo/argue-yo-logo-sm.png" alt="ARGUE YO!" />' +
      '<p class="about-lead"><b>ARGUE YO!</b> is a game for learning <b>hortatory exposition</b> texts. Build the text, find the best arguments and answer your friends. Level: A2–B1 English, Grade XI / Phase F.</p>' +
      '<ul class="help">' + A.HELP.map(function (h) { return '<li><span class="help-i" aria-hidden="true">' + h.icon + '</span><div><b>' + esc(h.t) + '</b><p>' + esc(h.d) + '</p></div></li>'; }).join('') + '</ul>' +
      '<div class="dev"><img src="assets/characters/council.png" alt="" /><p><b>' + esc(A.CREDIT) + '</b><br />' + esc(A.BRAND) + '<br /><small>Characters: Arka, Nadia, Dika and Sinta.</small></p></div>' +
      '<div class="actions"><a class="btn b-blue" href="../../games.html">‹ BACK TO ENGLISH YO! GAMES</a><button class="btn b-green" data-go="#/menu">« MENU</button></div></div>', 'screen-about');
  };

  /* ---------- global click delegation for [data-go] ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (!b) return;
    AU.unlock(); AU.sfx('click');
    go(b.dataset.go);
  });
})(window);
