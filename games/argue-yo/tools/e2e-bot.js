/* ARGUE YO! end-to-end bot. Paste/inject into the game page (e.g. from the browser console):
     eval(await (await fetch('tools/e2e-bot.js')).text());
     await __bot.playCase(0, { wrong: true, drag: true });   // plays Case 1, levels 1-5, with some deliberate mistakes
   It drives the REAL UI (clicks buttons / cards) and throws if any step of the learning loop breaks.
   Read __bot.log for a transcript. */
window.__bot = (function () {
  const A = window.ARGUE, C = A.compose;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const log = []; const L = (...a) => log.push(a.join(' '));
  const norm = s => s.replace(/\s+/g, ' ').trim();
  async function until(fn, label, ms = 3000) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = fn(); if (v) return v; await wait(30); } throw new Error('timeout: ' + label + ' @ ' + location.hash); }
  async function next() { const b = await until(() => $('.fb-next'), 'fb-next'); b.click(); await wait(60); }
  const cs = () => A.ARGUE_CASES_SORTED;

  async function l1(c, wrongFirst) {
    const frags = C.fragments(c);
    for (let i = 0; i < 7; i++) {
      const txt = norm($('#frag .ev-t').textContent.replace(/[“”]/g, ''));
      const f = frags.find(x => norm(x.text) === txt); if (!f) throw new Error('L1 frag not found: ' + txt);
      if (i === 0 && wrongFirst) {
        const wrong = ['thesis', 'argument', 'recommendation'].find(t => t !== f.type);
        $(`.bucket[data-type=${wrong}]`).click(); await wait(50);
        if (!$('.fb-bad')) throw new Error('L1: no bad feedback');
        L('  L1 wrong-click feedback ok:', $('.fb-title').textContent.trim());
      }
      $(`.bucket[data-type=${f.type}]`).click(); await wait(50);
      if (!$('.fb-ok')) throw new Error('L1: no ok feedback');
      await next();
    }
  }
  async function l2(c, wrongFirst) {
    const strong = c.args.map(a => norm(C.ucf(a.claim)));
    const weak = c.distract.map(d => norm(d.t));
    const cards = () => $$('.acard');
    if (wrongFirst) {
      const w = cards().find(b => weak.includes(norm($('.opt-t', b).textContent))); w.click(); await wait(500);
      if (!$('.fb-bad')) throw new Error('L2 no bad fb'); L('  L2 weak card feedback:', $('.fb-title').textContent.trim(), '|', $('.fb-body p').textContent.trim().slice(0, 70));
    }
    for (let k = 0; k < 3; k++) {
      const b = cards().find(b => !b.disabled && strong.includes(norm($('.opt-t', b).textContent))); if (!b) throw new Error('L2 strong card missing');
      b.click(); await wait(80);
      if (!$('.fb-ok')) throw new Error('L2 no ok fb');
    }
    await wait(100); L('  L2 revealed unpicked cards:', $$('.acard.is-reveal').length);
    await next();
  }
  async function l3(c, dragTest) {
    const blocks = () => $$('.blk');
    const typeOf = t => { t = norm(t); if (t === norm(c.thesis.issue + ' ' + c.thesis.position)) return 'thesis'; if (t.startsWith(norm(C.ucf(c.rec.main.replace('{{modal}}', '____'))))) return 'rec'; const i = c.args.findIndex(a => norm(C.ucf(a.claim)) === t); if (i >= 0) return 'arg'; return null; };
    let bl = blocks(); const thesisBlk = bl.find(b => typeOf($('.blk-t', b).textContent) === 'thesis');
    thesisBlk.click(); await wait(30); $('.pb[data-slot=rec]').click(); await wait(50);
    if (!$('.fb-bad')) throw new Error('L3A: no bad fb for wrong placement'); L('  L3A wrong placement:', $('.fb-title').textContent.trim());
    let argSlot = 0;
    for (let n = 0; n < 5; n++) {
      bl = blocks(); let b = bl[0]; const ty = typeOf($('.blk-t', b).textContent);
      const slot = ty === 'thesis' ? 'thesis' : ty === 'rec' ? 'rec' : ('arg' + (argSlot++));
      if (!(dragTest && n === 0)) { b.click(); await wait(30); }
      if (dragTest && n === 0) {
        const target = $(`.bslot[data-slot=${slot}]`); target.scrollIntoView({ block: 'center' }); await wait(50);
        const r1 = b.getBoundingClientRect(), r2 = target.getBoundingClientRect();
        const ev = (type, x, y) => window.dispatchEvent(new PointerEvent(type, { pointerId: 7, pointerType: 'mouse', button: 0, clientX: x, clientY: y, bubbles: true, cancelable: true }));
        b.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 7, pointerType: 'mouse', button: 0, clientX: r1.left + 20, clientY: r1.top + 20, bubbles: true, cancelable: true }));
        ev('pointermove', r1.left + 60, r1.top + 60); ev('pointermove', r2.left + 30, r2.top + 20); ev('pointerup', r2.left + 30, r2.top + 20);
        await wait(80); L('  L3A drag placement worked:', !!$('.fb-ok'));
        if (!$('.fb-ok')) throw new Error('L3A drag failed');
      } else { $(`.pb[data-slot=${slot}]`).click(); await wait(50); }
      if (!$('.fb-ok')) throw new Error('L3A: place failed ' + ty + ' ' + slot);
    }
    await next();
    const dist = $$('.blk').find(b => norm($('.blk-t', b).textContent) === norm(c.detailAlt[0]));
    dist.click(); await wait(30); $('.pb[data-slot=ev0]').click(); await wait(50);
    if (!$('.fb-bad')) throw new Error('L3B no bad fb'); L('  L3B distractor:', $('.fb-title').textContent.trim());
    const slotClaims = [0, 1, 2].map(k => norm($(`.bslot[data-slot=arg${k}] .bslot-t`).textContent));
    for (let n = 0; n < 3; n++) {
      const bs = $$('.blk').filter(b => !norm($('.blk-t', b).textContent).includes(norm(c.detailAlt[0])));
      const b = bs[0]; const t = norm($('.blk-t', b).textContent);
      const ai = c.args.findIndex((a, i) => norm(C.argDetail(c, i, true)) === t); if (ai < 0) throw new Error('detail not found ' + t);
      const k = slotClaims.findIndex(s => s.startsWith(norm(C.ucf(c.args[ai].claim))));
      b.click(); await wait(30); $(`.pb[data-slot=ev${k}]`).click(); await wait(50);
      if (!$('.fb-ok')) throw new Error('L3B place failed');
    }
    await next();
    const order = [0, 1, 2].map(k => c.args.findIndex(a => slotClaims[k].startsWith(norm(C.ucf(a.claim)))));
    const answers = []; for (let k = 0; k < 3; k++) { answers.push(c.args[k].conn); if (c.args[order[k]].gap) answers.push(c.args[order[k]].gap.answer); }
    answers.push(c.rec.modal.answer, c.rec.lead);
    for (let g = 0; g < answers.length; g++) {
      await until(() => $('.chipopt'), 'chip');
      if (g === 1) { const wrong = $$('.chipopt').find(b => b.dataset.w !== answers[g]); wrong.click(); await wait(40); if (!$('.fb-bad')) throw new Error('L3C no bad fb'); L('  L3C wrong connector:', $('.fb-body p').textContent.trim()); }
      const b = $$('.chipopt').find(b => b.dataset.w === answers[g] && !b.disabled); if (!b) throw new Error('chip ' + answers[g] + ' not offered');
      b.click(); await wait(50);
    }
    await next();
    await until(() => $('#l3-fin'), 'l3-fin');
    const docText = norm($$('.bslot').map(s => $('.bslot-t', s).textContent).join(' '));
    L('  L3 final doc has unresolved blanks:', /____/.test(docText));
    if (/____/.test(docText)) throw new Error('blanks remain');
    $('#l3-fin').click(); await wait(80);
  }
  async function l4(c, wrongFirst) {
    for (let r = 0; r < 3; r++) {
      const d = c.debate[r];
      await until(() => $$('.resp').length === 4, 'resp');
      if (r === 0 && wrongFirst) { const w = $$('.resp').find(b => norm($('.opt-t', b).textContent) !== norm(d.opts[0][0])); w.click(); await wait(40); if (!$('.fb-bad')) throw new Error('L4 no bad fb'); L('  L4 wrong response:', $('.fb-body p').textContent.trim().slice(0, 80)); }
      const b = $$('.resp').find(b => !b.disabled && norm($('.opt-t', b).textContent) === norm(d.opts[0][0])); if (!b) throw new Error('L4 correct option missing');
      b.click(); await wait(50); if (!$('.fb-ok')) throw new Error('L4 no ok');
      await next();
    }
  }
  async function l5(c, wrongFirst) {
    const want = [c.thesis.position, C.argClaim(c, 0), C.argDetail(c, 0), C.argClaim(c, 1), C.argDetail(c, 1), C.argClaim(c, 2), C.argDetail(c, 2), C.recMain(c)];
    for (let s = 0; s < 8; s++) {
      await until(() => $$('.pick').length === 3, 'pick');
      if (wrongFirst && (s === 0 || s === 2 || s === 7)) { const w = $$('.pick').find(b => norm($('.opt-t', b).textContent) !== norm(want[s])); w.click(); await wait(40); if (!$('.fb-bad')) throw new Error('L5 no bad'); L('  L5 step', s + 1, 'wrong ->', $('.fb-title').textContent.trim(), '|', $('.fb-body p').textContent.trim().slice(0, 60)); }
      const b = $$('.pick').find(b => !b.disabled && norm($('.opt-t', b).textContent) === norm(want[s])); if (!b) throw new Error('L5 correct option missing step ' + s + ': ' + want[s].slice(0, 40));
      b.click(); await wait(50); if (!$('.fb-ok')) throw new Error('L5 no ok');
      await next();
    }
    await until(() => $('#to-read'), 'to-read'); L('  L5 text complete screen; hints on:', !$('#doc').classList.contains('hints-off'));
    $('#hint-sw').click(); await wait(20); const off = $('#doc').classList.contains('hints-off'); $('#hint-sw').click(); await wait(20);
    L('  structure hints toggle works:', off && !$('#doc').classList.contains('hints-off'));
    $('#to-read').click(); await wait(100);
    for (let q = 0; q < 5; q++) {
      await until(() => $$('.rd').length === 4, 'rd');
      const qt = norm($('.q-t').textContent); const rq = c.reading.find(r => norm(r.q) === qt); if (!rq) throw new Error('reading q not found ' + qt);
      if (q === 0) { const w = $$('.rd').find(b => norm($('.opt-t', b).textContent) !== norm(rq.opts[0][0])); w.click(); await wait(40); if (!$('.fb-bad')) throw new Error('Reading no bad'); L('  Reading wrong answer feedback:', $('.fb-body p').textContent.trim().slice(0, 90)); }
      const b = $$('.rd').find(b => !b.disabled && norm($('.opt-t', b).textContent) === norm(rq.opts[0][0])); b.click(); await wait(40); await next();
    }
    await until(() => $('.stamp'), 'closed stamp', 4000);
  }
  async function playCase(i, o = {}) {
    const c = cs()[i]; L('CASE', c.no, c.title);
    location.hash = '#/case/' + c.id; await wait(150);
    for (let n = 1; n <= 5; n++) {
      const btn = $(`[data-go="#/lv/${c.id}/${n}"]`); if (!btn) throw new Error('level button missing ' + n); btn.click(); await wait(150);
      if (n === 1) await l1(c, o.wrong); if (n === 2) await l2(c, o.wrong); if (n === 3) await l3(c, o.drag); if (n === 4) await l4(c, o.wrong); if (n === 5) await l5(c, o.wrong);
      if (n < 5) {
        await until(() => $('.res-card'), 'result'); L('  level', n, 'result:', norm($('.res-stats').textContent), 'stars', $('.res-stars').textContent);
        const nx = $('.res-card [data-go^="#/lv/"]'); if (!nx || !nx.dataset.go.endsWith('/' + (n + 1))) throw new Error('next level link wrong');
        location.hash = '#/case/' + c.id; await wait(120);
      }
    }
    L('  CASE CLOSED:', norm($('.score-rows').textContent), '| power', $('.power-big b').textContent, '|', $('.rank-pill').textContent);
  }
  return { playCase, log, wait, $, $$, L, cs };
})();
