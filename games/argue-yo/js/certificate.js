/* ARGUE YO! — MY REFLECTION, certificate unlock, CERTIFICATE OF COMPLETION (preview, PNG, print).
   All certificate data comes from real gameplay (js/engine.js → A.prog); nothing on the certificate can be typed in by the student
   except the reflection sentence, which is the student's own submitted answer. */
(function (root) {
  var A = root.ARGUE, U = A.util, S = A.store, P = A.prog, AU = A.audio, esc = U.esc, $ = U.$, V = A.screens;
  var R = A.REFLECT;

  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.classList.add('out'); }, 2600); setTimeout(function () { t.remove(); }, 3100);
  }
  A.toast = toast;

  /* ======================================================================
     MY REFLECTION
     ====================================================================== */
  function chip(type, name, o, extra) {
    return '<label class="rchip"><input type="' + type + '" name="' + name + '" value="' + o.key + '" />' +
      '<span class="rc-b">' + (o.icon ? '<i aria-hidden="true">' + o.icon + '</i>' : '') + '<span>' + esc(o.label) + '</span><b class="tick" aria-hidden="true">✔</b></span></label>';
  }
  function meaningful(t) {
    var words = t.trim().split(/\s+/).filter(function (w) { return /[A-Za-zÀ-ɏ]/.test(w); });
    return words.length >= 2 && !/(.)\1{4,}/.test(t);
  }

  V.reflection = function () {
    var can = P.canUnlockCertificate();
    if (S.d.reflection && S.d.reflection.remember) return A.go('#/certificate');
    if (!can.casesReady) return A.go('#/certificate');
    var html = '<div class="page-h"><h1>' + R.title + '</h1><p>' + esc(R.intro) + '</p></div>' +
      '<form class="rf panel" id="rf" novalidate>' +
      '<fieldset class="rq"><legend><span class="qn">1</span><span class="lq">' + R.q1 + '</span>' + '<small>' + R.q1hint + '</small></legend>' +
      '<div class="rchips">' + R.learned.map(function (o) { return chip('checkbox', 'learned', o); }).join('') + '</div><p class="rerr" id="e-learned" role="alert" hidden></p></fieldset>' +
      '<fieldset class="rq"><legend><span class="qn">2</span><span class="lq">' + R.q2 + '</span>' + '<small>' + R.q2hint + '</small></legend>' +
      '<div class="rchips">' + R.hardest.map(function (o) { return chip('radio', 'hardest', o); }).join('') + '</div><p class="rerr" id="e-hardest" role="alert" hidden></p></fieldset>' +
      '<fieldset class="rq"><legend><span class="qn">3</span><span class="lq">' + R.q3 + '</span>' + '</legend>' +
      '<div class="rfaces">' + R.confidence.map(function (o) {
        return '<label class="rface"><input type="radio" name="confidence" value="' + o.key + '" /><span class="rf-b"><img src="' + A.FACES[o.face] + '" alt="" />' +
          '<b>' + esc(o.label) + '</b><span class="dots" aria-hidden="true">' + [1, 2, 3, 4].map(function (k) { return '<i class="' + (k <= o.level ? 'on' : '') + '"></i>'; }).join('') + '</span></span></label>';
      }).join('') + '</div><p class="rerr" id="e-confidence" role="alert" hidden></p></fieldset>' +
      '<fieldset class="rq"><legend><span class="qn">4</span><span class="lq">' + R.q4 + '</span></legend>' +
      '<label class="stem" for="rf-remember">“' + esc(R.q4stem) + '”</label>' +
      '<textarea id="rf-remember" class="input ta" rows="3" maxlength="' + R.maxChars + '" placeholder="' + esc(R.q4place) + '" aria-describedby="rf-count e-remember"></textarea>' +
      '<div class="rcount"><span id="rf-count" aria-live="off">0 / ' + R.maxChars + '</span></div><p class="rerr" id="e-remember" role="alert" hidden></p></fieldset>' +
      '<div class="actions"><button class="btn b-green btn-lg" type="submit">' + R.submit + '</button></div></form>';
    A.render(html, 'screen-reflect');
    var form = $('#rf'), ta = $('#rf-remember');
    ta.addEventListener('input', function () { $('#rf-count').textContent = ta.value.length + ' / ' + R.maxChars; });
    form.addEventListener('change', function () { AU.sfx('click'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var learned = U.$$('input[name=learned]:checked', form).map(function (i) { return i.value; });
      var hardest = ($('input[name=hardest]:checked', form) || {}).value || '';
      var conf = ($('input[name=confidence]:checked', form) || {}).value || '';
      var remember = ta.value.replace(/\s+/g, ' ').trim();
      var errs = {};
      if (!learned.length) errs.learned = R.errors.learned;
      if (!hardest) errs.hardest = R.errors.hardest;
      if (!conf) errs.confidence = R.errors.confidence;
      if (remember.length < R.minChars) errs.remember = R.errors.remember; else if (!meaningful(remember)) errs.remember = R.errors.meaningful;
      ['learned', 'hardest', 'confidence', 'remember'].forEach(function (k) { var p = $('#e-' + k); p.hidden = !errs[k]; p.textContent = errs[k] || ''; });
      var first = ['learned', 'hardest', 'confidence', 'remember'].filter(function (k) { return errs[k]; })[0];
      if (first) { AU.sfx('wrong'); var t = $('#e-' + first); t.parentNode.scrollIntoView({ block: 'center', behavior: U.reduced() ? 'auto' : 'smooth' }); U.say(errs[first]); return; }
      P.saveReflection({ learned: learned, hardest: hardest, confidence: conf, remember: remember });
      if (!P.hasCertificate() && P.canUnlockCertificate().ok) P.issueCertificate();
      A.go('#/unlocked');
    });
  };

  /* ======================================================================
     REFLECTION COMPLETE → CERTIFICATE UNLOCKED
     ====================================================================== */
  V.unlocked = function () {
    if (!P.hasCertificate() || !P.certValid()) return A.go('#/certificate');
    A.render('<div class="unlocked"><div class="un-card panel">' +
      '<h1 class="un-1">REFLECTION COMPLETE!</h1>' +
      '<img class="un-badge" src="assets/badges/b5.png" alt="" />' +
      '<h2 class="un-2">CERTIFICATE UNLOCKED!</h2>' +
      '<p class="un-3">Well done, ' + esc(S.d.name) + '! You finished ARGUE YO! and thought about your learning.</p>' +
      '<div class="actions"><button class="btn b-yellow btn-lg" data-go="#/certificate">SEE MY CERTIFICATE »</button></div></div></div>', 'screen-unlocked');
    setTimeout(function () { AU.sfx('complete'); }, 150);
    setTimeout(function () { AU.sfx('cert'); U.confetti(70); }, 900);
  };

  /* ======================================================================
     CERTIFICATE (canvas: one drawing = preview = PNG = print)
     ====================================================================== */
  var W = 1600, H = 1100, SC = 2;
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function star(c, cx, cy, r, fill, stroke) {
    c.beginPath();
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * .46 : r; c[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); }
    c.closePath(); c.fillStyle = fill; c.fill(); c.lineWidth = 3; c.strokeStyle = stroke; c.lineJoin = 'round'; c.stroke();
  }
  function img(src) { return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; }); }
  function wrap(c, text, maxW, maxLines) {
    var words = text.split(' '), lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var t = line ? line + ' ' + words[i] : words[i];
      if (c.measureText(t).width > maxW && line) { lines.push(line); line = words[i]; } else line = t;
    }
    if (line) lines.push(line);
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); var l = lines[maxLines - 1]; while (l.length > 1 && c.measureText(l + '…').width > maxW) l = l.slice(0, -1); lines[maxLines - 1] = l.replace(/[\s.,;:]+$/, '') + '…'; }
    return lines;
  }
  var FD = '"Baloo 2","Arial Rounded MT Bold","Trebuchet MS",Arial,sans-serif', FB = '"Nunito Sans","Segoe UI",Arial,sans-serif';
  function spaced(c, px) { try { c.letterSpacing = px + 'px'; } catch (e) { } }
  function labelOf(list, key) { var o = list.filter(function (x) { return x.key === key; })[0]; return o ? o.label : ''; }

  A.drawCertificate = function (canvas, cert) {
    var fonts = document.fonts && document.fonts.load ? Promise.all([document.fonts.load('800 40px "Baloo 2"'), document.fonts.load('800 24px "Nunito Sans"'), document.fonts.load('700 24px "Nunito Sans"')]).catch(function () { }) : Promise.resolve();
    return Promise.all([fonts, img('assets/logo/argue-yo-logo.png'), img(A.AUDIO.brand.logo), img('assets/badges/b1.png'), img('assets/badges/b2.png'), img('assets/badges/b3.png'), img('assets/badges/b4.png'), img('assets/badges/b5.png')]).then(function (r) {
      var logo = r[1], ey = r[2], badges = r.slice(3);
      canvas.width = W * SC; canvas.height = H * SC;
      var c = canvas.getContext('2d'); c.setTransform(SC, 0, 0, SC, 0, 0); c.textBaseline = 'alphabetic'; c.textAlign = 'left';
      var NAVY = '#0c2a6b', BLUE = '#1f6fe0', NAVY2 = '#274a99', GOLD = '#ffd23a';
      /* paper + sky band + dots */
      c.fillStyle = '#fffdf4'; c.fillRect(0, 0, W, H);
      var g = c.createLinearGradient(0, 0, 0, 420); g.addColorStop(0, '#cde7ff'); g.addColorStop(1, 'rgba(255,253,244,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 420);
      c.fillStyle = 'rgba(31,111,224,.10)'; for (var x = 20; x < W; x += 34) for (var y = 20; y < H; y += 34) { c.beginPath(); c.arc(x, y, 1.8, 0, 7); c.fill(); }
      /* frame */
      c.lineWidth = 10; c.strokeStyle = NAVY; rr(c, 28, 28, W - 56, H - 56, 34); c.stroke();
      c.lineWidth = 7; c.strokeStyle = GOLD; rr(c, 46, 46, W - 92, H - 92, 26); c.stroke();
      c.lineWidth = 2; c.strokeStyle = BLUE; c.setLineDash([10, 8]); rr(c, 58, 58, W - 116, H - 116, 18); c.stroke(); c.setLineDash([]);
      [[72, 72], [W - 72, 72], [72, H - 72], [W - 72, H - 72]].forEach(function (p) { star(c, p[0], p[1], 17, GOLD, NAVY); });
      /* logos + badges */
      if (ey) { var ew = 300, eh = ew * ey.height / ey.width; c.drawImage(ey, 94, 82, ew, eh); }
      if (logo) { var lw = 580, lh = lw * logo.height / logo.width; c.drawImage(logo, (W - lw) / 2, 66, lw, lh); }
      var bh = 86, widths = badges.map(function (b) { return b ? b.width * bh / b.height : 0; });
      var total = widths.reduce(function (a, b) { return a + b; }, 0) + 6 * 4, bx = W - 98 - total;
      badges.forEach(function (b, i) { if (b) { c.drawImage(b, bx, 90, widths[i], bh); bx += widths[i] + 6; } });
      /* ribbon */
      c.font = '800 36px ' + FD; spaced(c, 3); var title = 'CERTIFICATE OF COMPLETION', tw = c.measureText(title).width;
      var rw = tw + 120, rx = (W - rw) / 2; c.fillStyle = NAVY; rr(c, rx + 4, 290, rw, 52, 26); c.fill();
      c.fillStyle = GOLD; rr(c, rx, 284, rw, 52, 26); c.fill(); c.lineWidth = 5; c.strokeStyle = NAVY; c.stroke();
      c.fillStyle = NAVY; c.textAlign = 'center'; c.fillText(title, W / 2, 321); spaced(c, 0);
      /* presented to + name */
      c.font = '700 25px ' + FB; c.fillStyle = NAVY2; c.fillText('This certificate is proudly presented to', W / 2, 374);
      var size = 88, name = cert.name; do { c.font = '800 ' + size + 'px ' + FD; size -= 4; } while (c.measureText(name).width > 1150 && size > 40);
      c.fillStyle = NAVY; c.fillText(name, W / 2, 452);
      var nw = Math.max(c.measureText(name).width / 2 + 70, 300); c.strokeStyle = GOLD; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(W / 2 - nw, 474); c.lineTo(W / 2 + nw, 474); c.stroke();
      c.font = '700 25px ' + FB; c.fillStyle = NAVY2; c.fillText('has successfully completed', W / 2, 514);
      c.font = '800 54px ' + FD; c.fillStyle = BLUE; c.fillText('ARGUE YO!', W / 2, 570);
      c.font = '800 27px ' + FD; c.fillStyle = NAVY2; c.fillText('Hortatory Exposition Game', W / 2, 604);
      /* results row */
      c.strokeStyle = '#c9d6f2'; c.lineWidth = 2; [430, 1170].forEach(function (px) { c.beginPath(); c.moveTo(px, 640); c.lineTo(px, 830); c.stroke(); });
      c.textAlign = 'center'; spaced(c, 2); c.font = '800 20px ' + FD; c.fillStyle = BLUE; c.fillText('PERSUASION POWER', 250, 660); spaced(c, 0);
      c.beginPath(); c.arc(250, 728, 58, 0, 7); c.fillStyle = GOLD; c.fill(); c.lineWidth = 6; c.strokeStyle = NAVY; c.stroke();
      c.font = '800 48px ' + FD; c.fillStyle = NAVY; c.fillText(cert.power + '%', 250, 745);
      c.font = '800 22px ' + FD; var rk = cert.rank, rkw = Math.max(c.measureText(rk).width + 48, 200);
      c.fillStyle = BLUE; rr(c, 250 - rkw / 2, 798, rkw, 34, 17); c.fill(); c.lineWidth = 4; c.strokeStyle = NAVY; c.stroke(); c.fillStyle = '#fff'; c.fillText(rk, 250, 822);
      /* category bars */
      c.textAlign = 'left';
      A.CATS.forEach(function (k, i) {
        var cy = 672 + i * 34, v = cert.cats[k.key] || 0;
        c.font = '800 23px ' + FD; c.fillStyle = NAVY; c.fillText(k.label, 478, cy + 8);
        c.fillStyle = '#dfe9fb'; rr(c, 690, cy - 10, 330, 20, 10); c.fill(); c.lineWidth = 3; c.strokeStyle = NAVY; c.stroke();
        if (v > 0) { var gg = c.createLinearGradient(690, 0, 1020, 0); gg.addColorStop(0, '#4bd277'); gg.addColorStop(1, GOLD); c.fillStyle = gg; rr(c, 692, cy - 8, Math.max(16, 326 * v / 100), 16, 8); c.fill(); }
        c.font = '800 25px ' + FD; c.fillStyle = NAVY; c.fillText(v + '%', 1042, cy + 9);
      });
      /* cases completed */
      c.textAlign = 'center'; spaced(c, 2); c.font = '800 20px ' + FD; c.fillStyle = BLUE; c.fillText('CASES COMPLETED', 1350, 660); spaced(c, 0);
      c.font = '800 76px ' + FD; c.fillStyle = NAVY; c.fillText(cert.cases + '/6', 1350, 750);
      for (var d = 0; d < 6; d++) { c.beginPath(); c.arc(1350 - 85 + d * 34, 792, 11, 0, 7); c.fillStyle = d < cert.cases ? BLUE : '#dfe9fb'; c.fill(); c.lineWidth = 3; c.strokeStyle = NAVY; c.stroke(); }
      /* reflection */
      c.fillStyle = '#ffffff'; rr(c, 90, 856, 1420, 122, 18); c.fill(); c.lineWidth = 4; c.strokeStyle = BLUE; c.stroke();
      c.fillStyle = BLUE; rr(c, 118, 840, 196, 32, 16); c.fill();
      c.textAlign = 'center'; c.font = '800 17px ' + FD; spaced(c, 1.5); c.fillStyle = '#fff'; c.fillText('MY REFLECTION', 216, 862); spaced(c, 0);
      c.textAlign = 'left'; c.font = 'italic 700 21px ' + FB; c.fillStyle = NAVY2; c.fillText('One thing I will remember is…', 120, 902);
      var rf = cert.reflection || {}, meta = 'Most challenging: ' + labelOf(R.hardest, rf.hardest) + '  ·  Confidence: ' + labelOf(R.confidence, rf.confidence);
      c.textAlign = 'right'; c.font = '700 17px ' + FB; c.fillStyle = '#55658a'; c.fillText(meta, 1488, 902);
      c.textAlign = 'left'; c.font = '800 26px ' + FD; c.fillStyle = NAVY;
      wrap(c, '“' + (rf.remember || '') + '”', 1350, 2).forEach(function (ln, i) { c.fillText(ln, 120, 936 + i * 30); });
      /* footer: date, code, credit */
      c.textAlign = 'left'; c.font = '700 15px ' + FB; c.fillStyle = '#55658a'; c.fillText('COMPLETION DATE', 96, 1006); c.font = '800 22px ' + FD; c.fillStyle = NAVY; c.fillText(cert.dateText, 96, 1030);
      c.textAlign = 'center'; c.font = '700 15px ' + FB; c.fillStyle = '#55658a'; c.fillText('COMPLETION CODE', W / 2, 1006); c.font = '800 22px ' + FD; c.fillStyle = NAVY; c.fillText(cert.code, W / 2, 1030);
      c.textAlign = 'right'; c.font = '700 15px ' + FB; c.fillStyle = '#55658a'; c.fillText('Developed by Mega Ayu Wulandari', W - 96, 1006); c.font = '800 22px ' + FD; c.fillStyle = BLUE; c.fillText('ENGLISH YO!', W - 96, 1030);
      return canvas;
    });
  };

  function summaryText(cert) {
    return 'Certificate of Completion. ' + cert.name + ' has successfully completed ARGUE YO! Hortatory Exposition Game. Persuasion Power ' + cert.power + ' percent. ' +
      A.CATS.map(function (k) { return k.label + ' ' + (cert.cats[k.key] || 0) + ' percent'; }).join('. ') + '. Cases completed ' + cert.cases + ' of 6. Final rank ' + cert.rank +
      '. My reflection: one thing I will remember is ' + (cert.reflection && cert.reflection.remember) + '. Completion date ' + cert.dateText + '. Completion code ' + cert.code + '.';
  }

  function lockedView(can) {
    var req = A.CERT.requiredCases, pct = Math.round(can.casesDone / req * 100);
    A.render('<div class="page-h"><h1>MY CERTIFICATE</h1></div><div class="locked panel">' +
      '<div class="lk-ico" aria-hidden="true">🔒</div><h2>CERTIFICATE LOCKED</h2>' +
      '<p class="lk-lead">Finish the learning sequence to unlock your certificate. You do not need a high score.</p>' +
      '<div class="cc-prog lk-prog"><span class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100" aria-label="Cases completed"><i style="width:' + pct + '%"></i></span><b>' + can.casesDone + '/' + req + '</b></div>' +
      '<p class="lk-h">WHAT IS STILL MISSING</p><ul class="lk-list">' + can.missing.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
      '<div class="actions">' + (can.casesReady && !can.hasReflection ? '<button class="btn b-green btn-lg" data-go="#/reflection">WRITE MY REFLECTION »</button>' : '<button class="btn b-green btn-lg" data-go="#/play">GO TO THE CASES »</button>') +
      '<button class="btn b-white" data-go="#/menu">« MENU</button></div></div>', 'screen-locked');
  }

  V.certificate = function () {
    var can = P.canUnlockCertificate();
    if (!P.hasCertificate()) {
      if (can.ok) P.issueCertificate(); else return lockedView(can);
    }
    if (!P.certValid()) {
      if (can.ok) {
        A.render('<div class="page-h"><h1>MY CERTIFICATE</h1></div><div class="locked panel"><div class="lk-ico" aria-hidden="true">⚠️</div><h2>CERTIFICATE NEEDS A CHECK</h2>' +
          '<p class="lk-lead">The saved certificate data does not match your game results. You can make a new certificate from your real results.</p>' +
          '<div class="actions"><button class="btn b-green btn-lg" id="cert-rebuild">MAKE IT AGAIN FROM MY RESULTS</button><button class="btn b-white" data-go="#/menu">« MENU</button></div></div>', 'screen-locked');
        $('#cert-rebuild').addEventListener('click', function () { P.issueCertificate(); A.route(); });
        return;
      }
      S.d.cert = null; S.save(); return lockedView(can);
    }
    var cert = S.d.cert, upd = P.certUpdateAvailable();
    A.render('<div class="page-h"><h1>MY CERTIFICATE</h1><p>Your certificate is saved on this device. You can save it as a picture or print it.</p></div>' +
      (upd ? '<div class="cert-upd panel"><div><b>🎉 You have a better result now!</b><span>Persuasion Power: ' + cert.power + '% → <b>' + upd.power + '%</b> (' + esc(upd.rank) + '). Your old certificate stays until you update it.</span></div><button class="btn b-orange" id="cert-upd">UPDATE CERTIFICATE WITH NEW SCORE</button></div>' : '') +
      '<div class="cert-wrap"><canvas id="cert-canvas" class="cert-canvas" aria-label="' + esc(summaryText(cert)) + '" role="img"></canvas><p class="cert-loading" id="cert-loading">Making your certificate…</p></div>' +
      '<div class="sr-only">' + esc(summaryText(cert)) + '</div>' +
      '<div class="actions cert-actions"><button class="btn b-yellow btn-lg" id="cert-png" type="button">💾 SAVE AS PNG</button>' +
      '<button class="btn b-blue btn-lg" id="cert-printbtn" type="button">🖨 PRINT / SAVE AS PDF</button>' +
      '<button class="btn b-white btn-lg" data-go="#/menu" type="button">⌂ HOME</button></div>' +
      '<p class="tiny cert-note">Tap the certificate to see it bigger. The PNG file contains only the certificate. To make a PDF, choose “Save as PDF” in the print window.</p>', 'screen-cert');
    var cv = $('#cert-canvas'), ready = false;
    A.drawCertificate(cv, cert).then(function () { ready = true; $('#cert-loading').hidden = true; cv.classList.add('is-ready'); });
    $('#cert-png').addEventListener('click', function () {
      if (!ready) return; AU.sfx('click');
      try {
        cv.toBlob(function (blob) {
          if (!blob) { toast('Could not make the picture. Try PRINT / SAVE AS PDF.'); return; }
          var a = document.createElement('a'), url = URL.createObjectURL(blob);
          a.href = url; a.download = 'ARGUE-YO-Certificate-' + cert.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
          toast('Saved! Look in your Downloads folder.');
        }, 'image/png');
      } catch (e) { toast('Could not save here. Please use PRINT / SAVE AS PDF.'); }
    });
    $('#cert-printbtn').addEventListener('click', function () {
      if (!ready) return; AU.sfx('click');
      var holder = document.createElement('div'); holder.id = 'cert-print';
      var im = new Image(); try { im.src = cv.toDataURL('image/png'); } catch (e) { toast('Could not prepare printing here.'); return; }
      im.alt = 'Certificate of Completion'; holder.appendChild(im); document.body.appendChild(holder); document.body.classList.add('printing-cert');
      function done() { document.body.classList.remove('printing-cert'); holder.remove(); window.removeEventListener('afterprint', done); }
      window.addEventListener('afterprint', done);
      var go = function () { try { window.print(); } catch (e) { } setTimeout(function () { if (document.getElementById('cert-print')) done(); }, 1500); };
      if (im.complete) go(); else im.onload = go;
    });
    cv.style.cursor = 'zoom-in';
    cv.addEventListener('click', function () {
      if (!ready) return; var url; try { url = cv.toDataURL('image/png'); } catch (e) { return; }
      A.modal('<div class="cert-zoom"><img src="' + url + '" alt="Certificate of Completion, larger view" /></div><p class="tiny">Scroll to see the whole certificate.</p><div class="m-act"><button class="btn b-green" data-close>CLOSE</button></div>', { cls: 'modal-wide' });
    });
    var ub = $('#cert-upd');
    if (ub) ub.addEventListener('click', function () {
      var m = A.modal('<h2 class="m-h">UPDATE CERTIFICATE?</h2><p class="m-p">Your new results are better:</p>' +
        '<p class="m-p"><b>Persuasion Power ' + cert.power + '% → ' + upd.power + '%</b><br />Cases completed ' + cert.cases + ' → ' + upd.cases + '</p>' +
        '<p class="m-p">Your old certificate will be replaced. Your reflection stays the same.</p>' +
        '<div class="m-act"><button class="btn b-green" id="upd-yes">YES, UPDATE</button><button class="btn b-white" data-close>KEEP MY OLD CERTIFICATE</button></div>');
      $('#upd-yes', m.el).addEventListener('click', function () { m.close(); P.issueCertificate(); AU.sfx('cert'); U.confetti(40); toast('Certificate updated!'); A.route(); });
    });
  };
})(window);
