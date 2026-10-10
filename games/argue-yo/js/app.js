/* ARGUE YO! — router + boot. */
(function (root) {
  var A = root.ARGUE, S = A.store, P = A.prog, AU = A.audio, U = A.util, V = A.screens;

  A.applyPrefs = function () { document.documentElement.classList.toggle('big', !!S.d.set.big); };
  A.toggleFullscreen = function () {
    var d = document, el = d.documentElement;
    if (!d.fullscreenElement && !d.webkitFullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen || function () { U.say('Full screen is not available here.'); }).call(el); }
    else { (d.exitFullscreen || d.webkitExitFullscreen).call(d); }
  };

  function syncTopbar(route) {
    var home = document.getElementById('tb-home'), back = document.getElementById('tb-back');
    var atMenu = route === 'menu' || route === 'welcome' || route === 'open';
    home.hidden = atMenu; back.hidden = !atMenu;
    var sfx = document.getElementById('tb-sfx'), mu = document.getElementById('tb-music');
    sfx.setAttribute('aria-pressed', !!S.d.set.sfx); sfx.textContent = S.d.set.sfx ? '🔊' : '🔇'; sfx.title = S.d.set.sfx ? 'Sound: on (tap to mute)' : 'Sound: off (tap to turn on)'; sfx.setAttribute('aria-label', S.d.set.sfx ? 'Sound is on. Tap to mute.' : 'Sound is off. Tap to turn on.');
    mu.setAttribute('aria-pressed', !!S.d.set.music); mu.classList.toggle('is-off', !S.d.set.music || !S.d.set.sfx); mu.title = S.d.set.music ? 'Music: on' : 'Music: off';
    document.body.dataset.route = route;
  }

  A.route = function () {
    var parts = location.hash.replace(/^#\/?/, '').split('/'), r = parts[0] || 'menu';
    A.view = r; AU.stop();
    var mr = document.getElementById('modal-root'); if (mr) mr.innerHTML = '';   /* dialogs never stay open on a new page */
    var cs = A.ARGUE_CASES_SORTED;
    if (!S.d.name && r !== 'about' && r !== 'open') r = 'welcome';
    /* the ENGLISH YO! welcome plays once per visit, before the name screen / menu — never every time Home opens */
    if ((r === 'welcome' || r === 'menu') && !A.welcome.seen()) { A.go('#/open'); return; }
    var c = parts[1] && cs.filter(function (x) { return x.id === parts[1]; })[0];
    document.title = 'ARGUE YO! — ENGLISH YO!';
    switch (r) {
      case 'open': if (parts[1] !== 'replay' && A.welcome.seen()) { A.go('#/menu'); return; } V.opening(parts[1] === 'replay'); break;
      case 'welcome': V.welcome(); break;
      case 'reflection': V.reflection(); break;
      case 'unlocked': V.unlocked(); break;
      case 'certificate': V.certificate(); break;
      case 'play': V.play(); break;
      case 'case': c ? V.caseFile(c.id) : A.go('#/play'); break;
      case 'lv': {
        var n = parseInt(parts[2], 10);
        if (!c || !(n >= 1 && n <= 5)) { A.go('#/play'); r = 'play'; break; }
        var idx = cs.indexOf(c);
        if (!P.levelUnlocked(idx, n)) { A.go('#/case/' + c.id); r = 'case'; break; }
        A.startLevel(c, n); break;
      }
      case 'text': c ? A.showText(c.id) : A.go('#/play'); break;
      case 'closed': c ? A.showClosed(c.id) : A.go('#/play'); break;
      case 'learn': V.learn(); break;
      case 'cptp': V.cptp(); break;
      case 'scores': V.scores(); break;
      case 'settings': V.settings(); break;
      case 'about': V.about(); break;
      default: V.menu(); r = 'menu';
    }
    syncTopbar(r);
    var main = document.getElementById('app'); if (main) { try { main.focus({ preventScroll: true }); } catch (e) { } }
  };

  function boot() {
    S.load(); A.initCases(); A.applyPrefs();
    document.getElementById('tb-sfx').addEventListener('click', function () { S.d.set.sfx = !S.d.set.sfx; S.save(); AU.unlock(); AU.applyPrefs(); if (S.d.set.sfx) AU.sfx('click'); syncTopbar(A.view); });
    document.getElementById('tb-music').addEventListener('click', function () { S.d.set.music = !S.d.set.music; S.save(); AU.unlock(); AU.applyPrefs(); syncTopbar(A.view); });
    window.addEventListener('argue:sound', function () { syncTopbar(A.view); });
    document.getElementById('tb-fs').addEventListener('click', A.toggleFullscreen);
    document.getElementById('tb-help').addEventListener('click', A.helpModal);
    window.addEventListener('hashchange', A.route);
    /* browsers only allow audio after a gesture: start music (if the player turned it on) at the first tap */
    var once = function () { window.removeEventListener('pointerdown', once); if (S.d.set.music && S.d.set.sfx) { AU.unlock(); AU.music(true); } };
    window.addEventListener('pointerdown', once);
    window.addEventListener('pagehide', AU.stop);
    A.route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window);
