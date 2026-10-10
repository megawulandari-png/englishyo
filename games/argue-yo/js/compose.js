/* ARGUE YO! — text composition helpers (pure functions, no DOM).
   Used by the game AND by the audit script (tools/audit.js). */
(function (root) {
  var A = root.ARGUE = root.ARGUE || {};
  function ucf(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function lcf(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  var C = {
    ucf: ucf, lcf: lcf,
    /* "First, too much screen time makes it hard to sleep well." */
    argClaim: function (c, i) { return c.args[i].conn + ', ' + c.args[i].claim; },
    /* detail with the link-connector blank filled (or shown as ____ when `blank` is true) */
    argDetail: function (c, i, blank) {
      var a = c.args[i];
      return a.gap ? a.detail.replace('{{gap}}', blank ? '____' : a.gap.answer) : a.detail;
    },
    recMain: function (c, blank) {
      return c.rec.lead + ', ' + c.rec.main.replace('{{modal}}', blank ? '____' : c.rec.modal.answer);
    },
    /* canonical paragraphs, in order */
    paragraphs: function (c) {
      var out = [{ type: 'thesis', label: 'THESIS', text: c.thesis.issue + ' ' + c.thesis.position }];
      for (var i = 0; i < c.args.length; i++) {
        out.push({ type: 'argument', n: i + 1, label: 'ARGUMENT ' + (i + 1),
          text: C.argClaim(c, i) + ' ' + C.argDetail(c, i) });
      }
      out.push({ type: 'recommendation', label: 'RECOMMENDATION', text: C.recMain(c) + ' ' + c.rec.extra });
      return out;
    },
    fullText: function (c) { return C.paragraphs(c).map(function (p) { return p.text; }).join('\n\n'); },
    words: function (s) { return (s.match(/[A-Za-z’']+/g) || []); },
    wordCount: function (c) { return C.words(C.fullText(c)).length; },
    sentences: function (s) { return (s.match(/[^.!?]+[.!?]+/g) || []).map(function (x) { return x.trim(); }); },
    /* Level 1 fragments (thesis x2, argument x3, recommendation x2) */
    fragments: function (c) {
      var f = [
        { id: 't1', type: 'thesis', pos: 0, text: c.thesis.issue, why: 'This sentence introduces the issue.' },
        { id: 't2', type: 'thesis', pos: 0, text: c.thesis.position, why: "This sentence shows the writer's position." }
      ];
      for (var i = 0; i < c.args.length; i++) {
        f.push({ id: 'a' + (i + 1), type: 'argument', pos: 1, text: C.argClaim(c, i),
          why: "'" + c.args[i].conn + "' adds a reason. The sentence supports the writer's position." });
      }
      f.push({ id: 'r1', type: 'recommendation', pos: 2, text: C.recMain(c),
        why: "'" + c.rec.lead + "' leads to advice. The sentence tells readers what they " + (c.rec.modal.answer === 'should not' ? 'should not' : 'should') + ' do.' });
      f.push({ id: 'r2', type: 'recommendation', pos: 2, text: c.rec.extra,
        why: 'This sentence gives more advice and closes the text.' });
      return f;
    }
  };
  A.compose = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : globalThis);
