/* ARGUE YO! — ENGLISH YO! branded opening (reusable pattern for other ENGLISH YO! games).
   Flow: ENGLISH YO! logo → welcome audio → game logo reveal (+ game welcome voice) → student name → menu.
   - Plays ONCE per visit (sessionStorage flag), never every time Home opens. Settings → REPLAY ENGLISH YO! WELCOME plays it again.
   - Autoplay restrictions are respected: if the browser blocks sound, a big "START WITH SOUND" button appears.
   - Nothing plays when the master sound switch is OFF.
   Audio paths live in js/data-ui.js (A.AUDIO). */
(function (root) {
  var A = root.ARGUE, U = A.util, S = A.store, AU = A.audio, esc = U.esc, $ = U.$;

  A.welcome = {
    seen: function () { try { return sessionStorage.getItem(A.AUDIO.sessionFlag) === '1'; } catch (e) { return false; } },
    markSeen: function () {
      try { sessionStorage.setItem(A.AUDIO.sessionFlag, '1'); } catch (e) { }
      S.d.welcome = { heard: true, at: new Date().toISOString() }; S.save();
    }
  };

  A.screens.opening = function (replay) {
    var cfg = A.AUDIO, finished = false, stage = 'brand', timers = [], armed = false;
    var el = A.render(
      '<div class="opening" data-stage="brand">' +
      '<div class="op-stage op-brand">' +
      '<img class="op-ey" src="' + esc(cfg.brand.logo) + '" alt="ENGLISH YO! Learn. Play. Grow." />' +
      '<p class="op-line" id="op-line">Welcome to ENGLISH YO!</p>' +
      '<div class="op-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '</div>' +
      '<div class="op-stage op-game" hidden>' +
      '<img class="op-logo" src="assets/logo/argue-yo-logo.png" alt="ARGUE YO! Hortatory Exposition Game" />' +
      '<p class="op-line">Welcome to ARGUE YO!</p>' +
      '<p class="op-sub">Build your case, make your point, and become a great persuader!</p>' +
      '<p class="op-ready">Are you ready? Let’s go!</p>' +
      '</div>' +
      '<div class="op-ctl">' +
      '<button class="btn b-yellow btn-lg" id="op-start" type="button" hidden>🔊 START WITH SOUND</button>' +
      '<p class="op-status" id="op-status" role="status"></p>' +
      '<div class="op-links"><button class="btn btn-sm b-white" id="op-silent" type="button" hidden>CONTINUE WITHOUT SOUND</button>' +
      '<button class="btn btn-sm b-white" id="op-skip" type="button">SKIP ›</button></div>' +
      '</div></div>', 'screen-opening');

    var $start = $('#op-start', el), $status = $('#op-status', el), $silent = $('#op-silent', el), $skip = $('#op-skip', el);
    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
    function status(t) { $status.textContent = t || ''; }
    function cleanup() {
      timers.forEach(clearTimeout); timers = []; AU.stopFile(); AU.stop();
      window.removeEventListener('argue:sound', onSound); document.removeEventListener('pointerdown', onFirstTap, true);
    }
    function finish() {
      if (finished) return; finished = true; cleanup(); A.welcome.markSeen();
      A.go(replay ? '#/settings' : (S.d.name ? '#/menu' : '#/welcome'));
    }
    function wave(on) { el.querySelector('.op-wave').classList.toggle('is-on', !!on); }
    function needTap() {
      wave(false); $start.hidden = false; $silent.hidden = false; $skip.hidden = true;
      status('Your browser needs a tap before it can play sound.');
      try { $start.focus({ preventScroll: true }); } catch (e) { }
    }
    function tapped() { $start.hidden = true; $silent.hidden = true; $skip.hidden = false; status(''); }

    /* ---------- stage 1: ENGLISH YO! welcome (recorded audio) ---------- */
    function brandSpeechFallback() {
      if (finished || stage !== 'brand') return;
      var ok = AU.speak(cfg.brand.fallbackText, { onEnd: function () { later(toGame, 500); } });
      if (ok) { wave(true); status('🔊 Welcome to ENGLISH YO!'); later(function () { if (stage === 'brand') toGame(); }, 14000); } else later(toGame, 2200);
    }
    function playBrand() {
      if (finished) return;
      if (!AU.isOn()) { wave(false); status('🔇 Sound is OFF'); later(toGame, 2400); return; }
      AU.unlock();
      var a = AU.playFile(cfg.brand.file, { onEnd: function () { wave(false); later(toGame, 600); }, onError: brandSpeechFallback });
      var p; try { p = a.play(); } catch (e) { p = null; }
      if (p && p.then) {
        p.then(function () { tapped(); wave(true); status('🔊 Welcome to ENGLISH YO!'); later(function () { if (stage === 'brand') toGame(); }, 12000); })
          .catch(function (err) {
            if (AU.file === a) AU.file = null;
            if (finished || stage !== 'brand') return;
            if (err && err.name === 'NotAllowedError') needTap(); else brandSpeechFallback();
          });
      }
    }

    /* ---------- stage 2: ARGUE YO! logo reveal + game welcome ---------- */
    function gameSpeech() {
      if (finished) return;
      var ok = AU.speak(cfg.game.text, { onEnd: function () { later(finish, 900); } });
      if (ok) { status('🔊 Welcome to ARGUE YO!'); later(finish, 15000); } else later(finish, 3600);
    }
    function toGame() {
      if (finished || stage === 'game') return;
      stage = 'game'; AU.stopFile(); AU.stop(); wave(false); tapped();
      el.firstElementChild.setAttribute('data-stage', 'game');
      $('.op-brand', el).hidden = true; $('.op-game', el).hidden = false;
      $skip.textContent = 'CONTINUE ›'; status('');
      if (!AU.isOn()) { status('🔇 Sound is OFF'); later(finish, 3400); return; }
      var a = AU.playFile(cfg.game.file, { onEnd: function () { later(finish, 900); }, onError: gameSpeech });
      var p; try { p = a.play(); } catch (e) { p = null; }
      if (p && p.then) {
        p.then(function () { status('🔊 Welcome to ARGUE YO!'); later(finish, 20000); })
          .catch(function (err) { if (AU.file === a) AU.file = null; if (finished) return; if (err && err.name === 'NotAllowedError') { needTap(); } else gameSpeech(); });
      }
    }

    /* ---------- controls ---------- */
    function startWithSound() {
      AU.unlock(); AU.sfx('start'); tapped();
      if (!AU.isOn()) { S.d.set.sfx = true; S.save(); AU.applyPrefs(); }
      if (stage === 'brand') playBrand(); else toGameAgain();
    }
    function toGameAgain() { stage = 'brand'; toGame(); }
    $start.addEventListener('click', startWithSound);
    $silent.addEventListener('click', function () { tapped(); AU.stopFile(); AU.stop(); if (stage === 'brand') { status('Continuing without sound…'); later(toGame, 900); } else finish(); });
    $skip.addEventListener('click', finish);
    function onFirstTap(e) { if (e.target.closest('#op-silent,#op-skip,.ibtn')) return; if (!$start.hidden) { e.preventDefault(); startWithSound(); } }
    document.addEventListener('pointerdown', onFirstTap, true); armed = true;
    /* the student can mute at any time: stop speaking and move on */
    function onSound() { if (!AU.isOn() && !finished) { AU.stopFile(); AU.stop(); wave(false); $start.hidden = true; $silent.hidden = true; $skip.hidden = false; status('🔇 Sound is OFF'); if (stage === 'brand') { stage = 'brand'; later(toGame, 1200); } else later(finish, 1800); } }
    window.addEventListener('argue:sound', onSound);

    playBrand();
    void armed;
  };
})(window);
