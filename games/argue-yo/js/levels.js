/* ARGUE YO! — the five levels, complete text, reading challenge, results. */
(function (root) {
  var A = root.ARGUE, U = A.util, S = A.store, P = A.prog, AU = A.audio, C = A.compose, esc = U.esc, $ = U.$;
  var TYPES = A.TYPES;
  A.levels = {};

  var pad2 = function (n) { return ('0' + n).slice(-2); };
  var tag = function (t) { return '<span class="tag t-' + t + '">' + TYPES[t].icon + ' ' + TYPES[t].label + '</span>'; };
  var LETTERS = ['A', 'B', 'C', 'D'];

  /* ======================================================================
     Level context: frame, feedback, builder panel, stats
     ====================================================================== */
  function makeCtx(c, n) {
    var L = A.LEVELS[n - 1];
    var ctx = { c: c, n: n, L: L, cats: {}, xp: 0, power: 0, token: {} };
    A.CATS.forEach(function (k) { ctx.cats[k.key] = [0, 0]; });
    ctx.rec = function (cat, ok) { ctx.cats[cat][1]++; if (ok) ctx.cats[cat][0]++; };
    ctx.award = function (x) { ctx.xp += x; S.addXp(x); return x; };
    ctx.totals = function () { var c_ = 0, t_ = 0; A.CATS.forEach(function (k) { c_ += ctx.cats[k.key][0]; t_ += ctx.cats[k.key][1]; }); return { c: c_, t: t_ }; };

    ctx.frame = function (o) {
      o = o || {};
      var el = A.render(
        '<header class="lv-head">' +
        '<button class="btn btn-sm b-white" data-act="exit">‹ CASE FILE</button>' +
        '<div class="lv-title"><img src="' + L.badge + '" alt="" /><div><small>CASE ' + pad2(c.no) + ' · ' + esc(c.title) + '</small><b>' + esc(o.title || ('LEVEL ' + n + ' · ' + L.name)) + '</b></div></div>' +
        '<div class="power" role="img" aria-label="Text power 0 percent"><span class="power-l">' + esc(o.powerLabel || 'TEXT POWER') + '</span><span class="bar"><i style="width:0%"></i></span><b class="power-n">0%</b></div>' +
        '<button class="ibtn lv-help" type="button" data-act="lvhelp" aria-label="How to play this level" title="How to play this level">?</button>' +
        '</header>' +
        '<div class="lv-grid' + (o.wide ? ' is-wide' : '') + '">' +
        '<div class="lv-main"><p class="goal"><b>GOAL</b> ' + esc(o.goal || L.goal) + '</p><div id="task"></div><div class="dock"><div id="dock"></div><div id="fb" class="fb-wrap" aria-live="polite"></div></div></div>' +
        (o.noSide ? '' : '<aside class="builder panel" id="builder" aria-label="' + esc(o.sideTitle || 'Text Builder') + '"></aside>') +
        '</div>', 'lv lv-' + n + (o.cls ? ' ' + o.cls : ''));
      el.style.setProperty('--lc', L.color);
      ctx.powerWord = o.powerLabel ? null : 'TEXT POWER';
      ctx.el = el; ctx.task = $('#task', el); ctx.dockEl = $('#dock', el); ctx.fbEl = $('#fb', el); ctx.sideEl = $('#builder', el); ctx.sideTitle = o.sideTitle || '📋 TEXT BUILDER';
      $('[data-act=exit]', el).addEventListener('click', function () { AU.stop(); A.go('#/case/' + c.id); });
      $('[data-act=lvhelp]', el).addEventListener('click', function () {
        A.modal('<h2 class="m-h">' + esc(o.title || ('LEVEL ' + n + ' · ' + L.name)) + '</h2><p class="m-p"><b>Goal:</b> ' + esc(o.goal || L.goal) + '</p><p class="m-p">' + esc(o.how || L.how) + '</p>' +
          '<p class="m-p tiny">Tip: accuracy and good reasoning matter more than speed.</p><div class="m-act"><button class="btn b-green" data-close>OK, LET’S GO!</button></div>');
      });
      ctx.setPower(ctx.power);
      return el;
    };
    ctx.side = function (html) { if (ctx.sideEl) ctx.sideEl.innerHTML = '<h2 class="b-h">' + ctx.sideTitle + '</h2>' + html; };
    ctx.slotEl = function (key) { return ctx.sideEl ? $('[data-slot="' + key + '"]', ctx.sideEl) : null; };
    ctx.setPower = function (p) {
      var prev = ctx.power || 0;
      ctx.power = Math.round(U.clamp(p, 0, 100));
      if (ctx.power > prev) ctx.lastDelta = ctx.power - prev;
      var el = ctx.el; if (!el) return;
      $('.power i', el).style.width = ctx.power + '%'; $('.power-n', el).textContent = ctx.power + '%';
      $('.power', el).setAttribute('aria-label', 'Text power ' + ctx.power + ' percent');
    };
    ctx.clearFb = function () { if (ctx.fbEl) ctx.fbEl.innerHTML = ''; };
    /* feedback bar. o: kind ok|bad|info, title, msg, xp, face, next:{label,fn} */
    ctx.fb = function (o) {
      var face = o.face || (o.kind === 'ok' ? U.pick(['happy', 'proud']) : o.kind === 'bad' ? 'think' : 'wow');
      ctx.fbEl.innerHTML = '<div class="fb fb-' + o.kind + (U.reduced() ? '' : ' pop') + '">' +
        '<img class="fb-face" src="' + A.FACES[face] + '" alt="" />' +
        '<div class="fb-body"><b class="fb-title">' + (o.kind === 'ok' ? '✔ ' : o.kind === 'bad' ? '✖ ' : 'ℹ ') + esc(o.title) + '</b><p>' + esc(o.msg || '') + '</p></div>' +
        (o.kind === 'ok' && ctx.lastDelta && ctx.powerWord ? '<span class="fb-xp pw">' + ctx.powerWord + ' +' + ctx.lastDelta + '%</span>' : '') +
        (o.xp ? '<span class="fb-xp">+' + o.xp + ' XP</span>' : '') +
        (o.next ? '<button class="btn b-yellow fb-next" type="button">' + esc(o.next.label || 'NEXT »') + '</button>' : '') + '</div>';
      ctx.lastDelta = 0;
      U.say(o.title + '. ' + (o.msg || ''));
      if (o.next) { var b = $('.fb-next', ctx.fbEl); b.addEventListener('click', function () { AU.sfx('click'); o.next.fn(); }); try { b.focus({ preventScroll: false }); } catch (e) { b.focus(); } }
      else if (U.reduced()) { /* nothing */ } else { var f = $('.fb', ctx.fbEl); if (f && f.scrollIntoView) { var r = f.getBoundingClientRect(); if (r.bottom > window.innerHeight || r.top < 0) f.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } }
    };
    ctx.finish = function () { finishLevel(ctx); };
    return ctx;
  }

  function startLevel(c, n) {
    A.view = 'level';
    var ctx = makeCtx(c, n);
    A.levels[n](ctx);
  }
  A.startLevel = startLevel;

  /* ======================================================================
     LEVEL 1 — TEXT DETECTIVE
     ====================================================================== */
  A.levels[1] = function (ctx) {
    var c = ctx.c, frags = U.shuffle(C.fragments(c)), got = { thesis: [], argument: [], recommendation: [] };
    var need = { thesis: 2, argument: 3, recommendation: 2 }, i = 0, locked = false, missed = {}, POS = ['BEGINNING', 'MIDDLE', 'END'];
    ctx.frame();

    function builder() {
      var h = '';
      ['thesis', 'argument', 'recommendation'].forEach(function (t) {
        var full = got[t].length === need[t];
        h += '<div class="bslot t-' + t + (full ? ' is-full' : '') + '" data-slot="' + t + '"><div class="bslot-h">' + tag(t) + '<span class="bmark">' + (full ? '✓' : got[t].length + '/' + need[t]) + '</span></div>' +
          (got[t].length ? got[t].map(function (f) { return '<p class="bslot-t">' + esc(f.text) + '</p>'; }).join('') : '<p class="bslot-t is-empty">?</p>') + '</div>';
      });
      ctx.side(h);
    }
    function show() {
      locked = false; var f = frags[i];
      var clue = i < 3 ? '<div class="clue"><span class="clue-h">💡 CLUE</span> This fragment comes from the <b>' + POS[f.pos] + '</b> of the text. <span class="pos" aria-hidden="true">' +
        [0, 1, 2].map(function (k) { return '<i class="' + (k === f.pos ? 'on' : '') + '"></i>'; }).join('') + '</span></div>' : '';
      ctx.task.innerHTML =
        '<div class="step-chip">EVIDENCE ' + (i + 1) + ' / ' + frags.length + '</div>' +
        '<p class="instr">Which part of the text is this?</p>' +
        '<button class="evidence" type="button" id="frag" aria-label="Fragment: ' + esc(f.text) + '"><span class="grip" aria-hidden="true">⠿</span><span class="ev-t">“' + esc(f.text) + '”</span></button>' + clue +
        '<div class="buckets" role="group" aria-label="Choose the text part">' +
        ['thesis', 'argument', 'recommendation'].map(function (t) {
          return '<button class="bucket drop t-' + t + '" type="button" data-type="' + t + '"><span class="b-ico" aria-hidden="true">' + TYPES[t].icon + '</span><b>' + TYPES[t].label + '</b><small>' + TYPES[t].short + '</small></button>';
        }).join('') + '</div>' +
        (i === 0 ? '<p class="tiny">Tip: tap a button, or drag the fragment onto a button.</p>' : '');
      ctx.clearFb();
      U.$$('.bucket', ctx.task).forEach(function (b) { b.addEventListener('click', function () { answer(b.dataset.type, b); }); });
      U.dragify($('#frag', ctx.task), { onDrop: function (t) { answer(t.dataset.type, t); } });
    }
    function answer(type, btn) {
      if (locked) return; var f = frags[i];
      if (btn.disabled) return;
      if (type === f.type) {
        locked = true; ctx.rec('structure', true);
        var xp = ctx.award(missed[f.id] ? 5 : 10);
        AU.sfx('correct');
        var titles = { thesis: 'THESIS FOUND!', argument: 'ARGUMENT COLLECTED!', recommendation: 'RECOMMENDATION FOUND!' };
        btn.classList.add('is-right');
        U.$$('.bucket', ctx.task).forEach(function (b) { b.disabled = true; });
        var doneN = i + 1; got[type].push(f); ctx.setPower(doneN / frags.length * 100);
        U.fly($('#frag', ctx.task), ctx.slotEl(type), f.text, 't-' + type).then(function () {
          builder();
          var s = ctx.slotEl(type); if (s) { s.classList.add('pulse'); }
        });
        ctx.fb({ kind: 'ok', title: titles[type], msg: f.why, xp: xp, next: { label: i === frags.length - 1 ? 'FINISH »' : 'NEXT »', fn: function () { if (i === frags.length - 1) ctx.finish(); else { i++; show(); } } } });
      } else {
        ctx.rec('structure', false); missed[f.id] = 1; AU.sfx('wrong');
        btn.disabled = true; btn.classList.add('is-wrong', 'shake'); setTimeout(function () { btn.classList.remove('shake'); }, 450);
        ctx.fb({ kind: 'bad', title: 'NOT QUITE!', msg: A.TYPE_HINTS[f.type] });
      }
    }
    builder(); show();
  };

  /* ======================================================================
     LEVEL 2 — ARGUMENT HUNTER
     ====================================================================== */
  A.levels[2] = function (ctx) {
    var c = ctx.c, got = [], tried = {};
    var cards = U.shuffle(c.args.map(function (a, i) { return { id: 's' + i, strong: true, i: i, text: C.ucf(a.claim), why: a.why }; })
      .concat(c.distract.map(function (d, i) { return { id: 'd' + i, strong: false, kind: d.kind, text: d.t, why: d.why || A.KINDS[d.kind].why }; })));
    ctx.frame();
    function builder() {
      var h = '<div class="bslot t-thesis is-full" data-slot="thesis"><div class="bslot-h">' + tag('thesis') + '<span class="bmark">✓</span></div><p class="bslot-t">' + esc(c.thesis.position) + '</p></div>';
      for (var k = 0; k < 3; k++) {
        var a = got[k];
        h += '<div class="bslot t-argument' + (a ? ' is-full' : '') + '" data-slot="arg' + k + '"><div class="bslot-h"><span class="tag t-argument">' + TYPES.argument.icon + ' ARGUMENT ' + (k + 1) + '</span><span class="bmark">' + (a ? '✓' : '?') + '</span></div>' +
          '<p class="bslot-t' + (a ? '' : ' is-empty') + '">' + (a ? esc(a.text) : '?') + '</p></div>';
      }
      ctx.side(h);
    }
    function draw() {
      ctx.task.innerHTML =
        '<div class="thesis-box t-thesis"><span class="tag t-thesis">' + TYPES.thesis.icon + ' THESIS</span><p>' + esc(c.thesis.position) + '</p></div>' +
        '<p class="instr">Collect <b>3 strong arguments</b> that support this thesis. <span class="count" id="cnt">' + got.length + ' / 3</span></p>' +
        '<div class="cardgrid" id="cards">' + cards.map(function (k) {
          var st = tried[k.id] || '';
          return '<button type="button" class="opt acard' + (st ? ' is-' + st : '') + '" data-id="' + k.id + '"' + (st ? ' disabled' : '') + '><span class="grip" aria-hidden="true">⠿</span><span class="opt-t">' + esc(k.text) + '</span>' +
            (st === 'got' ? '<span class="opt-mark ok">✔ ARGUMENT</span>' : '') +
            (st === 'weak' || st === 'reveal' ? '<span class="opt-mark no">' + (k.strong ? '' : esc(A.KINDS[k.kind].title)) + '</span>' : '') + '</button>';
        }).join('') + '</div>';
      U.$$('.acard', ctx.task).forEach(function (b) { b.addEventListener('click', function () { pick(b.dataset.id, b); }); });
    }
    function pick(id, btn) {
      var k = cards.filter(function (x) { return x.id === id; })[0];
      if (tried[id] || got.length >= 3) return;
      if (k.strong) {
        tried[id] = 'got'; ctx.rec('arguments', true); var xp = ctx.award(tried._missed ? 8 : 12); AU.sfx('collect');
        btn.classList.add('is-got'); btn.disabled = true;
        var slot = got.length; got.push(k);
        var last = got.length === 3;
        ctx.setPower((1 + got.length) / 4 * 100);
        U.fly(btn, ctx.slotEl('arg' + slot), k.text, 't-argument').then(builder);
        if (last) { cards.forEach(function (x) { if (!tried[x.id]) tried[x.id] = 'reveal'; }); setTimeout(draw, 30); }
        ctx.fb({ kind: 'ok', title: 'ARGUMENT COLLECTED!', msg: k.why, xp: xp, next: last ? { label: 'FINISH »', fn: function () { ctx.finish(); } } : null });
      } else {
        tried[id] = 'weak'; tried._missed = 1; ctx.rec('arguments', false); AU.sfx('wrong');
        btn.classList.add('is-weak', 'shake'); btn.disabled = true;
        ctx.fb({ kind: 'bad', title: A.KINDS[k.kind].title, msg: k.why });
        setTimeout(draw, 380);
      }
    }
    ctx.setPower(25); builder(); draw();
  };

  /* ======================================================================
     LEVEL 3 — TEXT BUILDER  (arrange → evidence → connectors)
     ====================================================================== */
  A.levels[3] = function (ctx) {
    var c = ctx.c, phase = 'A', sel = null, steps = 0, TOTAL;
    var slotArg = [null, null, null];            // which argument sits in each argument slot
    var ev = [false, false, false];              // evidence placed for slot k
    var thesisDone = false, recDone = false;
    var gaps = [], gi = 0, filled = {};
    ctx.frame({ goal: 'Arrange the text, add evidence, then add connectors.' });
    ctx.sideTitle = '📋 TEXT BUILDER';

    var blocks = U.shuffle([{ id: 'thesis', type: 'thesis', text: c.thesis.issue + ' ' + c.thesis.position }]
      .concat(c.args.map(function (a, i) { return { id: 'a' + i, type: 'argument', i: i, text: C.ucf(a.claim) }; }))
      .concat([{ id: 'rec', type: 'recommendation', text: C.ucf(c.rec.main.replace('{{modal}}', '____')) + ' ' + c.rec.extra }]));
    var details = U.shuffle(c.args.map(function (a, i) { return { id: 'e' + i, i: i, text: C.argDetail(c, i, true), ok: true }; })
      .concat([{ id: 'e9', i: -1, text: c.detailAlt[0], ok: false }]));
    var placed = {};

    function power() { ctx.setPower(steps / TOTAL * 100); }
    function gapWord(id, fallback) { return filled[id] ? '<b class="gapfill">' + esc(filled[id]) + '</b>' : '<u class="gap' + (gaps[gi] && gaps[gi].id === id ? ' on' : '') + '">' + (fallback || '____') + '</u>'; }

    /* ---- the document (Text Builder panel) ---- */
    function doc() {
      var h = '';
      var tOK = thesisDone;
      h += '<div class="bslot t-thesis ' + (tOK ? 'is-full' : 'drop') + '" data-slot="thesis"' + (tOK ? '' : ' role="button" tabindex="0"') + '><div class="bslot-h">' + tag('thesis') + '<span class="bmark">' + (tOK ? '✓' : '?') + '</span></div>' +
        '<p class="bslot-t' + (tOK ? '' : ' is-empty') + '">' + (tOK ? esc(c.thesis.issue + ' ' + c.thesis.position) : 'Drop or tap here') + '</p></div>';
      for (var k = 0; k < 3; k++) {
        var ai = slotArg[k], a = ai != null ? c.args[ai] : null;
        var body = '';
        if (a) {
          if (phase === 'C' || phase === 'D') {
            body = gapWord('conn' + k) + ', ' + esc(a.claim) + ' ' + (ev[k] ? detailHTML(ai, k) : '');
          } else {
            body = esc(C.ucf(a.claim)) + (ev[k] ? ' <span class="evtxt">' + esc(C.argDetail(c, ai, true)) + '</span>' : '');
          }
        }
        h += '<div class="bslot t-argument ' + (a ? 'is-full' : 'drop') + '" data-slot="arg' + k + '"' + (a ? '' : ' role="button" tabindex="0"') + '><div class="bslot-h"><span class="tag t-argument">' + TYPES.argument.icon + ' ARGUMENT ' + (k + 1) + '</span><span class="bmark">' + (a ? '✓' : '?') + '</span></div>' +
          '<p class="bslot-t' + (a ? '' : ' is-empty') + '">' + (a ? body : 'Drop or tap here') + '</p>';
        if (a && phase === 'B' && !ev[k]) h += '<div class="evslot drop" data-slot="ev' + k + '" role="button" tabindex="0"><span class="tag t-evidence">' + TYPES.evidence.icon + ' EVIDENCE</span> <em>Drop or tap here</em></div>';
        if (a && ev[k] && phase === 'A') { }
        h += '</div>';
      }
      var rd = recDone;
      var rtext = '';
      if (rd) {
        if (phase === 'C' || phase === 'D') rtext = gapWord('lead') + ', ' + esc(c.rec.main).replace('{{modal}}', gapWord('modal')) + ' ' + esc(c.rec.extra);
        else rtext = esc(C.ucf(c.rec.main.replace('{{modal}}', '____')) + ' ' + c.rec.extra);
      }
      h += '<div class="bslot t-recommendation ' + (rd ? 'is-full' : 'drop') + '" data-slot="rec"' + (rd ? '' : ' role="button" tabindex="0"') + '><div class="bslot-h">' + tag('recommendation') + '<span class="bmark">' + (rd ? '✓' : '?') + '</span></div>' +
        '<p class="bslot-t' + (rd ? '' : ' is-empty') + '">' + (rd ? rtext : 'Drop or tap here') + '</p></div>';
      ctx.side(h);
      U.$$('.drop', ctx.sideEl).forEach(function (d) {
        d.addEventListener('click', function () { if (sel) place(sel, d.dataset.slot); });
        d.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && sel) { e.preventDefault(); place(sel, d.dataset.slot); } });
      });
    }
    function detailHTML(ai, k) {
      var a = c.args[ai], d = a.detail;
      if (!a.gap) return '<span class="evtxt">' + esc(d) + '</span>';
      var parts = d.split('{{gap}}');
      return '<span class="evtxt">' + esc(parts[0]) + gapWord('link' + k) + esc(parts[1]) + '</span>';
    }

    /* ---- Phase A & B: pool + placement bar ---- */
    function pool() {
      var items = phase === 'A' ? blocks.filter(function (b) { return !placed[b.id]; }) : details.filter(function (d) { return !placed[d.id]; });
      var instr = phase === 'A' ? 'Step 1 of 3 · <b>Arrange</b> the blocks. Which one goes where?' : 'Step 2 of 3 · Add <b>evidence</b>. Match each detail to its argument.';
      var bar = '';
      if (phase === 'A') {
        var targets = [['thesis', TYPES.thesis.icon + ' THESIS', thesisDone], ['arg0', TYPES.argument.icon + ' ARGUMENT 1', slotArg[0] != null], ['arg1', TYPES.argument.icon + ' ARGUMENT 2', slotArg[1] != null], ['arg2', TYPES.argument.icon + ' ARGUMENT 3', slotArg[2] != null], ['rec', TYPES.recommendation.icon + ' RECOMMENDATION', recDone]];
        bar = targets.map(function (t) { return '<button type="button" class="btn btn-sm b-white pb" data-slot="' + t[0] + '"' + (t[2] ? ' disabled' : '') + '>' + t[1] + '</button>'; }).join('');
      } else {
        bar = [0, 1, 2].map(function (k) {
          var ai = slotArg[k]; var cl = C.ucf(c.args[ai].claim); cl = cl.length > 34 ? cl.slice(0, 32) + '…' : cl;
          return '<button type="button" class="btn btn-sm b-white pb" data-slot="ev' + k + '"' + (ev[k] ? ' disabled' : '') + '><b>ARG ' + (k + 1) + '</b> ' + esc(cl) + '</button>';
        }).join('');
      }
      ctx.task.innerHTML = '<p class="instr">' + instr + '</p><p class="tiny how">Tap a block, then tap its place. On a computer you can also drag it.</p>' +
        '<div class="pool" id="pool">' + items.map(function (b) {
          return '<button type="button" class="blk' + (sel === b.id ? ' is-sel' : '') + '" data-id="' + b.id + '"><span class="grip" aria-hidden="true">⠿</span><span class="blk-t">' + esc(b.text) + '</span></button>';
        }).join('') + '</div>';
      ctx.dockEl.innerHTML = sel ? '<div class="placebar" id="pbar"><span class="pb-h">Where does it go?</span><div class="pb-btns">' + bar + '</div></div>' : '';
      U.$$('.blk', ctx.task).forEach(function (b) {
        b.addEventListener('click', function () { sel = sel === b.dataset.id ? null : b.dataset.id; AU.sfx('click'); pool(); });
        U.dragify(b, { onStart: function () { sel = b.dataset.id; }, onDrop: function (t) { place(b.dataset.id, t.dataset.slot); } });
      });
      U.$$('.pb', ctx.dockEl).forEach(function (b) { b.addEventListener('click', function () { if (sel) place(sel, b.dataset.slot); }); });
    }

    function place(id, slot) {
      if (phase === 'A') {
        var b = blocks.filter(function (x) { return x.id === id; })[0]; if (!b) return;
        var slotType = slot === 'thesis' ? 'thesis' : slot === 'rec' ? 'recommendation' : slot.indexOf('arg') === 0 ? 'argument' : null;
        if (!slotType) return;
        if ((slot.indexOf('arg') === 0 && slotArg[+slot.slice(3)] != null) || (slot === 'thesis' && thesisDone) || (slot === 'rec' && recDone)) return;
        if (b.type === slotType) {
          ctx.rec('structure', true); var xp = ctx.award(10); AU.sfx('place');
          placed[b.id] = 1; sel = null; steps++;
          if (slot === 'thesis') thesisDone = true; else if (slot === 'rec') recDone = true; else slotArg[+slot.slice(3)] = b.i;
          power(); doc(); pool();
          var ok = { thesis: ['THESIS FOUND!', 'The thesis comes first. It introduces the issue and shows the writer’s position.'], argument: ['ARGUMENT COLLECTED!', 'An argument gives a reason that supports the position.'], recommendation: ['RECOMMENDATION FOUND!', 'The recommendation comes last. It tells readers what to do.'] }[b.type];
          var done = thesisDone && recDone && slotArg.every(function (x) { return x != null; });
          ctx.fb({ kind: 'ok', title: ok[0], msg: ok[1], xp: xp, next: done ? { label: 'NEXT STEP »', fn: toB } : null });
        } else {
          ctx.rec('structure', false); AU.sfx('wrong'); sel = null; pool();
          var m = { thesis: ['CHECK THE THESIS', 'The thesis comes first. It introduces the issue and shows the writer’s position.'], argument: ['NOT QUITE!', 'An argument gives a reason that supports the writer’s position.'], recommendation: ['NOT QUITE!', 'The recommendation comes last. It tells readers what to do.'] }[slotType];
          ctx.fb({ kind: 'bad', title: m[0], msg: m[1] });
          var s = ctx.slotEl(slot); if (s) { s.classList.add('shake'); setTimeout(function () { s.classList.remove('shake'); }, 450); }
        }
      } else if (phase === 'B') {
        var d = details.filter(function (x) { return x.id === id; })[0]; if (!d) return;
        var k = +slot.slice(2); if (ev[k]) return;
        if (d.ok && d.i === slotArg[k]) {
          ctx.rec('evidence', true); var xp2 = ctx.award(10); AU.sfx('place');
          placed[d.id] = 1; ev[k] = true; sel = null; steps++; power(); doc(); pool();
          var all = ev.every(Boolean);
          ctx.fb({ kind: 'ok', title: 'STRONG EVIDENCE!', msg: 'This detail gives a clear fact or example for the argument.', xp: xp2, next: all ? { label: 'NEXT STEP »', fn: toC } : null });
        } else {
          ctx.rec('evidence', false); AU.sfx('wrong'); sel = null; pool();
          ctx.fb({ kind: 'bad', title: A.KINDS[d.ok ? 'mismatch' : 'detail'].title, msg: d.ok ? 'This detail is true, but it supports a different argument. Read the arguments again.' : 'This detail does not give evidence for any of the arguments. Look for a fact, an example or a result.' });
        }
      }
    }
    function toB() { phase = 'B'; sel = null; ctx.clearFb(); doc(); pool(); ctx.fb({ kind: 'info', title: 'EVIDENCE TIME', msg: 'Good arguments need evidence. One detail is not useful: can you find it?' }); }

    /* ---- Phase C: connectors ---- */
    function buildGaps() {
      gaps = [];
      for (var k = 0; k < 3; k++) {
        gaps.push({ id: 'conn' + k, kind: 'conn', answer: c.args[k].conn, slot: k });
        var ai = slotArg[k]; if (c.args[ai].gap) gaps.push({ id: 'link' + k, kind: 'link', answer: c.args[ai].gap.answer, slot: k, ai: ai });
      }
      gaps.push({ id: 'modal', kind: 'modal', answer: c.rec.modal.answer });
      gaps.push({ id: 'lead', kind: 'lead', answer: c.rec.lead });
      TOTAL = 5 + 3 + gaps.length;
    }
    function lastSentence(s) { var m = C.sentences(s); return m.length ? m[m.length - 1] : s; }
    function gapSentence(g) {
      if (g.kind === 'conn') return '____, ' + c.args[slotArg[g.slot]].claim;
      if (g.kind === 'link') { var ss = c.args[g.ai].detail.split(/(?<=[.!?])\s+/); var s = ss.filter(function (x) { return x.indexOf('{{gap}}') >= 0; })[0] || ss[0]; return s.replace('{{gap}}', '____'); }
      if (g.kind === 'modal') return C.ucf(c.rec.main.replace('{{modal}}', '____'));
      return '____, ' + c.rec.main.replace('{{modal}}', c.rec.modal.answer);
    }
    function gapContext(g) {
      if (g.kind === 'conn') { var prev = g.slot === 0 ? c.thesis.position : lastSentence(C.argClaim(c, slotArg[g.slot - 1]) + ' ' + C.argDetail(c, slotArg[g.slot - 1])); return prev; }
      if (g.kind === 'lead') { return lastSentence(C.argClaim(c, slotArg[2]) + ' ' + C.argDetail(c, slotArg[2])); }
      return '';
    }
    function gapOptions(g) {
      if (g.kind === 'conn' || g.kind === 'lead') return U.shuffle([g.answer].concat(A.CONNECTOR_WRONGS[g.answer] || ['However', 'Therefore']));
      if (g.kind === 'link') return U.shuffle(c.args[g.ai].gap.options);
      return U.shuffle(c.rec.modal.options);
    }
    function toC() {
      phase = 'C'; buildGaps(); gi = 0; sel = null; ctx.clearFb(); ctx.dockEl.innerHTML = ''; doc(); gapStep();
    }
    function gapStep() {
      var g = gaps[gi]; if (!g) return complete();
      doc();
      var opts = g.opts = g.opts || gapOptions(g), ctxT = gapContext(g), what = g.kind === 'modal' ? 'the best <b>modal verb</b>' : g.kind === 'link' ? 'the best <b>connector</b> (cause / result / contrast)' : 'the best <b>connector</b>';
      ctx.task.innerHTML = '<p class="instr">Step 3 of 3 · Choose ' + what + '. <span class="count">' + (gi + 1) + ' / ' + gaps.length + '</span></p>' +
        '<div class="gapbox">' + (ctxT ? '<p class="gap-ctx">…' + esc(ctxT) + '</p>' : '') + '<p class="gap-s">' + esc(gapSentence(g)).replace('____', '<u class="gap on">&nbsp;&nbsp;&nbsp;&nbsp;?&nbsp;&nbsp;&nbsp;&nbsp;</u>') + '</p></div>' +
        '<div class="chips" role="group" aria-label="Choices">' + opts.map(function (o) { return '<button type="button" class="chipopt" data-w="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div>';
      U.$$('.chipopt', ctx.task).forEach(function (b) { b.addEventListener('click', function () { chooseGap(g, b.dataset.w, b); }); });
    }
    function chooseGap(g, w, btn) {
      if (w === g.answer) {
        ctx.rec('language', true); var xp = ctx.award(g._miss ? 5 : 10); AU.sfx('correct');
        filled[g.id] = g.kind === 'conn' || g.kind === 'lead' ? w : w; steps++; power(); gi++;
        var msg = g.kind === 'modal' ? c.rec.modal.why : g.kind === 'link' ? c.args[g.ai].gap.why : "'" + w + "' " + A.CONNECTOR_NOTES[w] + '.';
        var last = gi >= gaps.length;
        doc();
        if (!last) gapStep(); else { ctx.task.innerHTML = '<p class="instr">All connectors added!</p>'; }
        ctx.fb({ kind: 'ok', title: 'GOOD THINKING!', msg: msg, xp: xp, next: last ? { label: 'SEE THE TEXT »', fn: complete } : null });
      } else {
        g._miss = 1; ctx.rec('language', false); AU.sfx('wrong'); btn.disabled = true; btn.classList.add('is-wrong', 'shake');
        var notes = g.kind === 'modal' ? A.MODAL_NOTES : A.CONNECTOR_NOTES;
        ctx.fb({ kind: 'bad', title: g.kind === 'modal' ? 'TRY ANOTHER WORD' : 'TRY ANOTHER CONNECTOR', msg: "'" + w + "' " + notes[w] + '. This sentence needs a word that ' + notes[g.answer] + '.' });
      }
    }
    function complete() {
      phase = 'D'; ctx.setPower(100); doc(); AU.sfx('complete'); U.confetti(34);
      ctx.dockEl.innerHTML = '';
      ctx.task.innerHTML = '<div class="complete-banner"><h2>TEXT COMPLETE!</h2><p>You built a full hortatory exposition. Read your text in the Text Builder.</p><button class="btn b-yellow btn-lg" id="l3-fin">FINISH LEVEL »</button></div>';
      $('#l3-fin', ctx.task).addEventListener('click', function () { ctx.finish(); });
      ctx.clearFb();
    }

    TOTAL = 5 + 3 + 6; doc(); pool();
  };

  /* ======================================================================
     LEVEL 4 — ARGUMENT CHALLENGE
     ====================================================================== */
  A.levels[4] = function (ctx) {
    var c = ctx.c, r = 0, won = [], rounds = c.debate.length, ally = A.CHARS[c.guide], locked = false, missed = 0;
    ctx.frame({ sideTitle: '🗣️ DEBATE BOARD', powerLabel: 'COUNCIL SUPPORT', goal: 'Answer each friend with the strongest response.' });

    function board() {
      var h = '';
      for (var k = 0; k < rounds; k++) {
        var d = c.debate[k], who = A.CHARS[d.who], w = won[k];
        h += '<div class="bslot t-argument ' + (w ? 'is-full' : '') + '" data-slot="r' + k + '"><div class="bslot-h"><span class="tag t-argument">💬 ROUND ' + (k + 1) + '</span><span class="bmark">' + (w ? '✓' : k === r ? '▶' : '?') + '</span></div>' +
          '<p class="bslot-t"><b>' + who.name + ':</b> ' + (k <= r ? esc(d.says) : '…') + '</p>' +
          (w ? '<p class="bslot-t mine"><b>You:</b> ' + esc(w) + '</p>' : '') + '</div>';
      }
      ctx.side(h);
    }
    function round() {
      locked = false; missed = 0;
      var d = c.debate[r], opp = A.CHARS[d.who];
      var opts = U.shuffle(d.opts.map(function (o, i) { return { t: o[0], why: o[1], ok: i === 0 }; }));
      ctx.task.innerHTML =
        '<div class="stage" style="background-image:url(assets/backgrounds/hall.png)">' +
        '<div class="support" aria-hidden="true">' + [0, 1, 2].map(function (k) { return '<span class="' + (k < won.length ? 'on' : '') + '">★</span>'; }).join('') + '</div>' +
        '<div class="actor ally"><img src="' + ally.img + '" alt="' + ally.name + '" /><span>' + ally.name + '</span></div>' +
        '<div class="actor opp" id="opp"><img src="' + opp.img + '" alt="' + opp.name + '" /><span>' + opp.name + '</span></div>' +
        '<div class="bubble" id="bub"><b>' + opp.name + ':</b> “' + esc(d.says) + '”</div></div>' +
        '<div class="step-chip">ROUND ' + (r + 1) + ' / ' + rounds + '</div>' +
        '<p class="instr">Choose the <b>strongest response</b>.</p>' +
        '<div class="opts" id="opts">' + opts.map(function (o, i) {
          return '<button type="button" class="opt resp" data-i="' + i + '"><span class="lbl">' + LETTERS[i] + '</span><span class="opt-t">' + esc(o.t) + '</span></button>';
        }).join('') + '</div>';
      ctx.clearFb(); board();
      U.$$('.resp', ctx.task).forEach(function (b) { b.addEventListener('click', function () { choose(opts, +b.dataset.i, b); }); });
    }
    function choose(opts, i, btn) {
      if (locked) return; var o = opts[i];
      if (o.ok) {
        locked = true; ctx.rec('arguments', true); var xp = ctx.award(missed ? 6 : 15); AU.sfx('correct'); U.confetti(14);
        won.push(o.t); btn.classList.add('is-right');
        U.$$('.resp', ctx.task).forEach(function (b) { b.disabled = true; });
        ctx.setPower(won.length / rounds * 100);
        $('#bub', ctx.task).innerHTML = '<b>' + A.CHARS[c.debate[r].who].name + ':</b> “' + esc(U.pick(A.CONCEDE)) + '”';
        board();
        var last = r === rounds - 1;
        ctx.fb({ kind: 'ok', title: 'STRONG RESPONSE!', msg: o.why, xp: xp, face: 'proud', next: { label: last ? 'FINISH »' : 'NEXT ROUND »', fn: function () { if (last) ctx.finish(); else { r++; round(); } } } });
      } else {
        missed++; ctx.rec('arguments', false); AU.sfx('wrong'); btn.disabled = true; btn.classList.add('is-wrong', 'shake');
        ctx.fb({ kind: 'bad', title: 'NOT QUITE!', msg: o.why });
      }
    }
    round();
  };

  /* ======================================================================
     LEVEL 5 — MASTER PERSUADER (build complete text → read → questions)
     ====================================================================== */
  A.levels[5] = function (ctx) {
    var c = ctx.c, step = 0, picks = {}, steps = [];
    ctx.frame({ goal: 'Build a complete hortatory exposition about this issue.' });
    var dAt = [[0, 1], [2, 3], [4, 0]];
    function opt(t, ok, kind) { return { t: t, ok: ok, kind: kind }; }
    steps.push({ key: 'thesis', type: 'thesis', cat: 'structure', label: 'THESIS', ask: 'Choose the sentence that shows the writer’s position.',
      opts: [opt(c.thesis.position, true), opt(c.thesisAlt[0].t, false, 'nopos'), opt(c.thesisAlt[1].t, false, 'thesisOpp')], okTitle: 'THESIS FOUND!', okMsg: 'It shows the writer’s position, so the text can begin.' });
    for (var i = 0; i < 3; i++) {
      (function (i) {
        var a = c.args[i], ds = dAt[i];
        steps.push({ key: 'a' + i, type: 'argument', cat: 'arguments', label: 'ARGUMENT ' + (i + 1), ask: 'Choose a strong argument that supports the thesis.',
          opts: [opt(C.argClaim(c, i), true), opt(a.conn + ', ' + C.lcf(c.distract[ds[0]].t), false, c.distract[ds[0]].kind, c.distract[ds[0]].why), opt(a.conn + ', ' + C.lcf(c.distract[ds[1]].t), false, c.distract[ds[1]].kind, c.distract[ds[1]].why)],
          okTitle: 'ARGUMENT COLLECTED!', okMsg: a.why });
        steps.push({ key: 'd' + i, type: 'evidence', cat: 'evidence', label: 'SUPPORTING DETAIL ' + (i + 1), ask: 'Choose the detail that supports Argument ' + (i + 1) + '.',
          opts: [opt(C.argDetail(c, i), true), opt(C.argDetail(c, (i + 1) % 3), false, 'mismatch'), opt(c.detailAlt[i], false, 'detail')],
          okTitle: 'STRONG EVIDENCE!', okMsg: 'This detail gives a clear fact or example for the argument.' });
      })(i);
    }
    steps.push({ key: 'rec', type: 'recommendation', cat: 'structure', label: 'RECOMMENDATION', ask: 'Choose the best recommendation. What should readers do?',
      opts: [opt(C.recMain(c), true), opt(c.recAlt[0].t, false, 'recIrr'), opt(c.recAlt[1].t, false, 'arg')], okTitle: 'RECOMMENDATION FOUND!', okMsg: 'It tells readers what to do and follows from your arguments.' });

    function side() {
      var h = '';
      var ctxIssue = '<p class="bslot-t issue">' + esc(c.thesis.issue) + '</p>';
      h += '<div class="bslot t-thesis ' + (picks.thesis ? 'is-full' : '') + '" data-slot="thesis"><div class="bslot-h">' + tag('thesis') + '<span class="bmark">' + (picks.thesis ? '✓' : step === 0 ? '▶' : '?') + '</span></div>' + ctxIssue + '<p class="bslot-t' + (picks.thesis ? '' : ' is-empty') + '">' + (picks.thesis ? esc(picks.thesis) : '?') + '</p></div>';
      for (var k = 0; k < 3; k++) {
        var a = picks['a' + k], d = picks['d' + k], here = steps[step] && (steps[step].key === 'a' + k || steps[step].key === 'd' + k);
        h += '<div class="bslot t-argument ' + (a && d ? 'is-full' : '') + '" data-slot="arg' + k + '"><div class="bslot-h"><span class="tag t-argument">' + TYPES.argument.icon + ' ARGUMENT ' + (k + 1) + '</span><span class="bmark">' + (a && d ? '✓' : here ? '▶' : '?') + '</span></div>' +
          '<p class="bslot-t' + (a ? '' : ' is-empty') + '">' + (a ? esc(a) : '?') + '</p>' + (a ? '<p class="bslot-t' + (d ? '' : ' is-empty') + '">' + (d ? esc(d) : '+ supporting detail ?') + '</p>' : '') + '</div>';
      }
      h += '<div class="bslot t-recommendation ' + (picks.rec ? 'is-full' : '') + '" data-slot="rec"><div class="bslot-h">' + tag('recommendation') + '<span class="bmark">' + (picks.rec ? '✓' : step === steps.length - 1 ? '▶' : '?') + '</span></div><p class="bslot-t' + (picks.rec ? '' : ' is-empty') + '">' + (picks.rec ? esc(picks.rec + ' ' + c.rec.extra) : '?') + '</p></div>';
      ctx.side(h);
    }
    function show() {
      var s = steps[step], opts = s.shuf || (s.shuf = U.shuffle(s.opts));
      ctx.task.innerHTML =
        '<div class="issue-banner"><span class="tag t-thesis">📁 THE ISSUE</span><b>' + esc(c.question) + '</b></div>' +
        '<div class="step-chip">PART ' + (step + 1) + ' / ' + steps.length + ' · ' + s.label + '</div>' +
        '<p class="instr">' + esc(s.ask) + '</p>' +
        '<div class="opts" id="opts">' + opts.map(function (o, i) {
          return '<button type="button" class="opt pick" data-i="' + i + '"><span class="lbl">' + LETTERS[i] + '</span><span class="opt-t">' + esc(o.t) + '</span></button>';
        }).join('') + '</div>';
      ctx.clearFb(); side();
      U.$$('.pick', ctx.task).forEach(function (b) { b.addEventListener('click', function () { choose(s, opts, +b.dataset.i, b); }); });
    }
    function choose(s, opts, i, btn) {
      var o = opts[i];
      if (o.ok) {
        ctx.rec(s.cat, true); var xp = ctx.award(s._miss ? 6 : 14); AU.sfx('correct');
        U.$$('.pick', ctx.task).forEach(function (b) { b.disabled = true; }); btn.classList.add('is-right');
        var slotKey = s.key === 'thesis' ? 'thesis' : s.key === 'rec' ? 'rec' : 'arg' + s.key.slice(1);
        picks[s.key] = o.t;
        var last = step === steps.length - 1;
        step++; ctx.setPower(step / steps.length * 100);
        U.fly(btn, ctx.slotEl(slotKey), o.t, 't-' + (s.type === 'evidence' ? 'evidence' : s.type)).then(side);
        ctx.fb({ kind: 'ok', title: s.okTitle, msg: s.okMsg, xp: xp, next: { label: last ? 'TEXT COMPLETE! »' : 'NEXT PART »', fn: function () { if (last) completeText(); else show(); } } });
      } else {
        s._miss = 1; ctx.rec(s.cat, false); AU.sfx('wrong'); btn.disabled = true; btn.classList.add('is-wrong', 'shake');
        var K = A.KINDS[o.kind] || A.KINDS.irrelevant;
        ctx.fb({ kind: 'bad', title: K.title, msg: o.why || K.why });
      }
    }
    function completeText() {
      ctx.setPower(100); AU.sfx('complete'); U.confetti(48);
      showFinalText(ctx, function () { startReading(ctx); });
    }
    side(); show();
  };

  /* ======================================================================
     COMPLETE TEXT (colour-coded structure, toggle, listen)
     ====================================================================== */
  function docHTML(c, hints) {
    return '<article class="doc' + (hints ? '' : ' hints-off') + '" id="doc"><h2 class="doc-title">' + esc(c.textTitle) + '</h2>' +
      C.paragraphs(c).map(function (p) {
        var t = p.type;
        return '<section class="para t-' + t + '"><span class="para-label">' + TYPES[t].icon + ' ' + p.label + '</span><p>' + esc(p.text) + '</p></section>';
      }).join('') + '</article>';
  }
  A.docHTML = docHTML;
  function wireDocControls(root_, c, noPersist) {
    var sw = $('#hint-sw', root_), doc = $('#doc', root_);
    if (sw) sw.addEventListener('click', function () {
      var on = sw.getAttribute('aria-pressed') !== 'true'; sw.setAttribute('aria-pressed', on); $('.sw-t', sw).textContent = on ? 'ON' : 'OFF';
      doc.classList.toggle('hints-off', !on); if (!noPersist) { S.d.set.hints = on; S.save(); } AU.sfx('click');
    });
    wireListen(root_, c);
  }
  /* LISTEN TO TEXT / PAUSE / RESUME / STOP — the student chooses; nothing is read automatically */
  function wireListen(root_, c) {
    var box = $('.listen', root_); if (!box) return;
    var bL = $('[data-l=listen]', box), bP = $('[data-l=pause]', box), bR = $('[data-l=resume]', box), bS = $('[data-l=stop]', box), msg = $('.listen-msg', box);
    function sync(st) {
      st = st || AU.state();
      bL.hidden = st !== 'idle'; bP.hidden = st !== 'playing'; bR.hidden = st !== 'paused'; bS.hidden = st === 'idle';
    }
    function say(t) { msg.textContent = t || ''; }
    bL.addEventListener('click', function () {
      var why = AU.speechBlocked(); if (why) { say(why); AU.sfx('wrong'); return; }
      say(''); AU.unlock();
      AU.speak(c.textTitle + '. ' + C.fullText(c).replace(/\n\n/g, ' '), { onState: sync, onEnd: function () { sync('idle'); } }); sync();
    });
    bP.addEventListener('click', function () { AU.pause(); sync(); }); bR.addEventListener('click', function () { AU.resume(); sync(); });
    bS.addEventListener('click', function () { AU.stop(); sync('idle'); say(''); });
    sync('idle');
  }
  function docControls(forceOn) {
    var on = forceOn == null ? !!S.d.set.hints : forceOn;
    return '<div class="doc-tools"><button class="switch" id="hint-sw" role="switch" aria-pressed="' + on + '" type="button"><span class="knob"></span><span class="sw-lab">STRUCTURE HINTS:</span> <span class="sw-t">' + (on ? 'ON' : 'OFF') + '</span></button>' +
      '<div class="listen" role="group" aria-label="Listen to the text"><button class="btn btn-sm b-blue" data-l="listen" type="button">🔊 LISTEN TO TEXT</button>' +
      '<button class="btn btn-sm b-white" data-l="pause" type="button" hidden>⏸ PAUSE</button><button class="btn btn-sm b-green" data-l="resume" type="button" hidden>▶ RESUME</button>' +
      '<button class="btn btn-sm b-white" data-l="stop" type="button" hidden>⏹ STOP</button><span class="listen-msg" role="status"></span></div></div>';
  }
  function legend() {
    return '<div class="legend">' + ['thesis', 'argument', 'recommendation'].map(tag).join('') + '</div>';
  }

  function showFinalText(ctx, onNext) {
    var c = ctx.c;
    var el = A.render('<div class="final">' +
      '<div class="final-h"><span class="power big"><b>TEXT POWER 100%</b></span><h1>TEXT COMPLETE!</h1><p>This is the text you built. Look at the structure, then read it again with the hints OFF.</p></div>' +
      docControls() + legend() + docHTML(c, !!S.d.set.hints) +
      '<div class="actions"><button class="btn b-yellow btn-lg" id="to-read">START THE READING CHALLENGE »</button></div></div>', 'screen-final');
    wireDocControls(el, c);
    $('#to-read', el).addEventListener('click', function () { AU.stop(); AU.sfx('click'); onNext(); });
  }
  A.showText = function (id) {
    var c = A.ARGUE_CASES_SORTED.filter(function (x) { return x.id === id; })[0]; if (!c) return A.go('#/play');
    var el = A.render('<div class="final"><div class="final-h"><h1>' + esc(c.title) + ' · THE TEXT</h1><p>“' + esc(c.question) + '”</p></div>' + docControls() + legend() + docHTML(c, !!S.d.set.hints) +
      '<div class="actions"><button class="btn b-green" data-go="#/case/' + c.id + '">‹ CASE FILE</button></div></div>', 'screen-final');
    wireDocControls(el, c);
  };

  /* ======================================================================
     FINAL READING CHALLENGE (5 of 7 questions, random)
     ====================================================================== */
  function startReading(ctx) {
    var c = ctx.c, qs = U.shuffle(c.reading).slice(0, 5), qi = 0, missed = 0, locked = false;
    ctx.frame({ title: 'FINAL READING CHALLENGE', powerLabel: 'QUESTIONS', sideTitle: '📄 THE TEXT', goal: 'Read the text, then answer five questions.', how: 'Read the text first. Then choose the best answer for each question. You can turn the colour hints on if you need help. Press LISTEN to hear the text.', cls: 'is-reading' });
    ctx.setPower(0);
    /* the text is shown WITHOUT colours first; the switch can turn the hints on (not saved) */
    ctx.side(docControls(false) + docHTML(c, false));
    wireDocControls(ctx.sideEl, c, true);

    var TL = { purpose: 'PURPOSE', mainIdea: 'MAIN IDEA', inference: 'INFERENCE', reference: 'REFERENCE', evidence: 'ARGUMENT + EVIDENCE', summary: 'SUMMARY', recommendation: 'RECOMMENDATION' };
    function show() {
      locked = false; missed = 0;
      var q = qs[qi], opts = U.shuffle(q.opts.map(function (o, i) { return { t: o[0], why: o[1], ok: i === 0 }; }));
      ctx.task.innerHTML = '<div class="step-chip">QUESTION ' + (qi + 1) + ' / ' + qs.length + ' · ' + TL[q.type] + '</div>' +
        '<h2 class="q-t">' + esc(q.q) + '</h2>' +
        '<div class="opts" id="opts">' + opts.map(function (o, i) {
          return '<button type="button" class="opt rd" data-i="' + i + '"><span class="lbl">' + LETTERS[i] + '</span><span class="opt-t">' + esc(o.t) + '</span></button>';
        }).join('') + '</div>';
      ctx.clearFb();
      U.$$('.rd', ctx.task).forEach(function (b) { b.addEventListener('click', function () { choose(opts, +b.dataset.i, b); }); });
    }
    function choose(opts, i, btn) {
      if (locked) return; var o = opts[i];
      if (o.ok) {
        locked = true; ctx.rec('reading', true); var xp = ctx.award(missed ? 6 : 15); AU.sfx('correct');
        U.$$('.rd', ctx.task).forEach(function (b) { b.disabled = true; }); btn.classList.add('is-right');
        ctx.setPower((qi + 1) / qs.length * 100);
        var last = qi === qs.length - 1;
        ctx.fb({ kind: 'ok', title: 'GOOD THINKING!', msg: o.why, xp: xp, next: { label: last ? 'FINISH »' : 'NEXT QUESTION »', fn: function () { if (last) finishCase(ctx); else { qi++; show(); } } } });
      } else {
        missed++; ctx.rec('reading', false); AU.sfx('wrong'); btn.disabled = true; btn.classList.add('is-wrong', 'shake');
        ctx.fb({ kind: 'bad', title: 'NOT QUITE!', msg: o.why + ' Read the text again and try another answer.' });
      }
    }
    show();
  }

  /* ======================================================================
     RESULTS
     ====================================================================== */
  function finishLevel(ctx) {
    var c = ctx.c, n = ctx.n, tot = ctx.totals();
    ctx.award(30); AU.stop();
    var saved = P.saveLevel(c.id, n, { c: tot.c, t: tot.t, cats: ctx.cats });
    ctx.saved = saved;
    var acc = tot.t ? Math.round(tot.c / tot.t * 100) : 0, L = ctx.L, cs = A.ARGUE_CASES_SORTED;
    AU.sfx(saved.newBadge ? 'badge' : 'complete'); U.confetti(40);
    var nextLabel = n < 5 ? 'NEXT LEVEL »' : '';
    var el = A.render('<div class="result"><div class="res-card panel" style="--lc:' + L.color + '">' +
      '<h1 class="res-h">LEVEL COMPLETE!</h1>' +
      '<img class="res-badge ' + (saved.newBadge ? 'is-new' : '') + '" src="' + L.badge + '" alt="' + esc(L.name) + ' badge" />' +
      '<p class="res-name">' + esc(L.name) + '</p>' +
      (saved.newBadge ? '<p class="res-new">🏅 NEW BADGE UNLOCKED!</p>' : '') +
      '<div class="res-stars" aria-label="' + saved.stars + ' of 3 stars">' + U.stars(saved.stars) + '</div>' +
      '<div class="res-stats"><span>First-try accuracy <b>' + acc + '%</b></span><span>XP earned <b>+' + ctx.xp + '</b></span><span>Text Power <b>100%</b></span></div>' +
      '<p class="res-note">' + (acc >= 90 ? 'Excellent reasoning!' : acc >= 70 ? 'Good work. Keep thinking carefully!' : 'You finished the level. Replay it to build a stronger case!') + '</p>' +
      '<div class="actions"><button class="btn b-green btn-lg" data-go="#/lv/' + c.id + '/' + (n + 1) + '">' + nextLabel + '</button>' +
      '<button class="btn b-white" data-go="#/lv/' + c.id + '/' + n + '">↻ REPLAY</button><button class="btn b-white" data-go="#/case/' + c.id + '">CASE FILE</button></div>' +
      '</div></div>', 'screen-result');
    void el; void cs;
  }

  function finishCase(ctx) {
    var c = ctx.c, tot = ctx.totals(); ctx.award(60); AU.stop();
    var saved = P.saveLevel(c.id, 5, { c: tot.c, t: tot.t, cats: ctx.cats });
    A.closedFresh = { id: c.id, xp: ctx.xp, newBadge: saved.newBadge };
    A.go('#/closed/' + c.id);
  }

  A.showClosed = function (id) {
    var cs = A.ARGUE_CASES_SORTED, idx = cs.findIndex(function (x) { return x.id === id; }), c = cs[idx];
    if (!c || !P.closed(id)) return A.go('#/case/' + id);
    var cats = P.cats(id), power = P.power(id), rank = P.rank(power), fresh = A.closedFresh && A.closedFresh.id === id ? A.closedFresh : null;
    A.closedFresh = null;
    var rows = A.CATS.map(function (k) {
      var st = P.catStars(cats[k.key]);
      return '<div class="score-row"><span>' + k.label + '</span><span class="stars5" aria-label="' + st + ' of 5 stars">' + U.stars(st, 5) + '</span><b>' + Math.round(P.acc(cats[k.key]) * 100) + '%</b></div>';
    }).join('');
    var next = cs[idx + 1], can = P.canUnlockCertificate();
    var el = A.render('<div class="closed"><div class="closed-card panel">' +
      '<div class="stamp' + (U.reduced() ? '' : ' stamp-in') + '" aria-hidden="true">CASE<br>CLOSED!</div>' +
      '<h1 class="sr-only">CASE CLOSED!</h1>' +
      '<p class="closed-case">CASE ' + pad2(c.no) + ' · ' + esc(c.title) + '</p>' +
      '<div class="score-rows">' + rows + '</div>' +
      '<div class="power-big"><small>PERSUASION POWER</small><b>' + power + '%</b></div>' +
      '<p class="rank-pill">' + rank + '</p>' +
      '<div class="res-stars" aria-label="' + P.caseStars(id) + ' of 3 stars">' + U.stars(P.caseStars(id)) + '</div>' +
      (fresh ? '<p class="res-stats one"><span>XP earned this run <b>+' + fresh.xp + '</b></span></p>' : '') +
      (fresh && fresh.newBadge ? '<p class="res-new">🏅 NEW BADGE: MASTER PERSUADER!</p>' : '') +
      '<p class="saved">✔ Progress saved on this device.</p>' +
      (can.casesReady && !can.hasReflection ? '<p class="res-new">🎓 All cases complete! One more step: write your reflection to unlock your certificate.</p>' : '') +
      '<div class="actions">' + (can.casesReady && !can.hasReflection ? '<button class="btn b-yellow btn-lg" data-go="#/reflection">NEXT: MY REFLECTION »</button>' :
        (next ? '<button class="btn b-green btn-lg" data-go="#/case/' + next.id + '">NEXT CASE »</button>' : '<button class="btn b-green btn-lg" data-go="#/scores">SEE ALL SCORES</button>')) +
      (P.hasCertificate() ? '<button class="btn b-yellow" data-go="#/certificate">🎓 MY CERTIFICATE</button>' : '') +
      '<button class="btn b-white" data-go="#/text/' + c.id + '">📄 READ THE TEXT</button><button class="btn b-white" data-go="#/case/' + c.id + '">CASE FILE</button></div>' +
      '</div></div>', 'screen-closed');
    if (fresh) { setTimeout(function () { AU.sfx('stamp'); }, 350); setTimeout(function () { AU.sfx('complete'); U.confetti(64); }, 700); }
    void el;
  };
})(window);
