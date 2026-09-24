/* Narrative Quest story validator.
   Usage:  node tools/validate.js [story-id ...]
   Loads stories/library.js + every stories/*.js file (or only the given ids)
   and checks the data against the rules the engine needs. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const only = process.argv.slice(2);
const ctx = { window: {}, console };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "stories/library.js"), "utf8"), ctx);
const files = fs.readdirSync(path.join(ROOT, "stories")).filter((f) => f.endsWith(".js") && f !== "library.js");
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, "stories", f), "utf8"), ctx, { filename: f }); }
  catch (e) { console.log(`✗ ${f}: SYNTAX/RUNTIME ERROR ${e.message}`); process.exitCode = 1; }
}
const NQ = ctx.NQ;
const exists = (p) => p && fs.existsSync(path.join(ROOT, p));
const strip = (h) => String(h).replace(/<[^>]+>/g, "");
const STRUCT = ["Orientation", "Complication", "Resolution", "Ending / Coda", "Main Conflict"];
const RANGE = { word: [10, 12], structure: [8, 10], character: [10, 12], grammar: [10, 12], final: [10, 12] };
let totalErr = 0;

for (const [id, st] of Object.entries(NQ.stories)) {
  if (only.length && !only.includes(id)) continue;
  const E = [], W = [];
  const err = (m) => E.push(m), warn = (m) => W.push(m);
  for (const k of ["id", "title", "genre", "origin", "region", "country", "level", "minutes", "cover", "pages", "vocabulary", "characters", "traitWords", "structure", "mainConflict", "sequence", "grammarExamples", "guides", "pastVerbs", "challenges", "final"])
    if (st[k] == null) err(`missing field: ${k}`);
  if (!NQ.GENRES.find((g) => g.id === st.genre)) err(`bad genre ${st.genre}`);
  if (!["indonesia", "world"].includes(st.origin)) err(`bad origin ${st.origin}`);
  if (!exists(st.cover)) err(`cover missing: ${st.cover}`);
  const n = (st.pages || []).length;
  if (n < 5 || n > 7) err(`pages: ${n} (need 5–7)`);
  const words = (st.pages || []).map((p) => p.text).join(" ").split(/\s+/).filter(Boolean).length;
  if (id !== "putri-serindang-bulan" && (words < 350 || words > 520)) err(`story length ${words} words (need ~350–500)`);
  const vocab = st.vocabulary || [];
  if (vocab.length < 8 || vocab.length > 14) warn(`vocabulary items: ${vocab.length} (aim 8–12)`);
  const vseen = new Set();
  (st.pages || []).forEach((p, i) => {
    if (!p.text) err(`page ${i + 1} no text`);
    const sc = p.scene || {};
    if (!sc.art && !sc.bg) err(`page ${i + 1} scene has no art/bg`);
    [sc.art, sc.bg].filter(Boolean).forEach((x) => { if (!exists(x)) err(`page ${i + 1} image missing ${x}`); });
    (sc.actors || []).forEach((a) => { if (!exists(a.img)) err(`page ${i + 1} actor missing ${a.img}`); });
    (p.vocab || []).forEach((w) => {
      const v = vocab.find((x) => x.word === w);
      if (!v) return err(`page ${i + 1} vocab "${w}" not in vocabulary list`);
      const forms = v.forms || [v.word];
      const hit = forms.some((f) => new RegExp("\\b" + f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(p.text));
      if (!hit) err(`page ${i + 1} vocab "${w}" not found in page text`);
      vseen.add(w);
    });
  });
  vocab.forEach((v) => { if (!vseen.has(v.word)) err(`vocabulary "${v.word}" is never highlighted on a page`); if (!v.meaning) err(`vocab ${v.word} no meaning`); });
  (st.characters || []).forEach((c) => { if (c.img && !exists(c.img)) err(`character img missing ${c.img}`); });
  const c1 = (st.characters || [])[1];
  if (!c1 || !c1.traits || !c1.evidence) err(`characters[1] (shown in Character briefing) needs traits and evidence`);
  if (c1 && !c1.img) warn(`characters[1] has no img (briefing shows text only)`);
  if (st.guides) Object.values(st.guides).forEach((g) => { if (!exists(g)) err(`guide img missing ${g}`); });
  const ge = st.grammarExamples || {};
  ["regular", "irregular", "was", "were", "negative", "question"].forEach((k) => { if (!ge[k]) err(`grammarExamples.${k} missing`); });
  ["orientation", "complication", "resolution", "coda"].forEach((k) => { if (!st.structure || !st.structure[k]) err(`structure.${k} missing`); });

  const banks = Object.assign({}, st.challenges || {}, { final: st.final || [] });
  const prompts = new Map();
  const counts = {};
  for (const [key, tasks] of Object.entries(banks)) {
    counts[key] = tasks.length;
    const [lo, hi] = RANGE[key] || [0, 99];
    if (tasks.length < lo || tasks.length > hi) err(`${key}: ${tasks.length} tasks (need ${lo}–${hi})`);
    tasks.forEach((t, i) => {
      const L = `${key}#${i + 1} (${t.type})`;
      if (!t.prompt) err(`${L} no prompt`);
      if (!t.hint) err(`${L} no hint`);
      if (!t.explain) err(`${L} no explain`);
      if (!t.skill) warn(`${L} no skill label`);
      if (t.ref && (t.ref < 1 || t.ref > n)) err(`${L} ref ${t.ref} out of range`);
      if (t.image && !exists(t.image)) err(`${L} image missing ${t.image}`);
      const sig = strip(t.prompt) + "|" + (t.quote || "") + "|" + JSON.stringify(t.options || t.items || t.cards || t.verbs || t.sentence);
      if (prompts.has(sig)) err(`${L} duplicates ${prompts.get(sig)}`); else prompts.set(sig, L);
      if (t.type === "mcq") {
        if (!Array.isArray(t.options) || t.options.length < 3) err(`${L} needs 3–4 options`);
        if (!(t.answer >= 0 && t.answer < t.options.length)) err(`${L} answer index invalid`);
        const txt = t.options.map((o) => (typeof o === "object" ? o.text : String(o)));
        if (new Set(txt.map((s) => s.toLowerCase())).size !== txt.length) err(`${L} duplicate options`);
        if (t.structureOptions) txt.forEach((o) => { if (!STRUCT.includes(o)) err(`${L} structure option "${o}" not one of ${STRUCT.join(", ")}`); });
        t.options.forEach((o) => { if (typeof o === "object" && !exists(o.img)) err(`${L} option img missing ${o.img}`); });
        if (t.layout === "portraits") t.options.forEach((o) => { if (typeof o !== "object") err(`${L} portraits layout needs {text,img} options`); });
        if (t.feedback) Object.keys(t.feedback).forEach((k) => { if (+k === t.answer || +k >= t.options.length) err(`${L} feedback key ${k} invalid`); });
        if (!t.structureOptions && txt.length >= 3) {
          const lens = txt.map((s) => s.length), a = lens[t.answer];
          const others = lens.filter((_, k) => k !== t.answer), mx = Math.max(...others), mn = Math.min(...others);
          if (a > 12 && a > mx * 1.3) warn(`${L} correct answer is clearly the LONGEST (${a} vs ${mx}) — answer-length clue?`);
          if (mn > 12 && a < mn * 0.6) warn(`${L} correct answer is clearly the SHORTEST (${a} vs ${mn})`);
        }
      } else if (t.type === "multi") {
        if (!Array.isArray(t.answer) || t.answer.length !== (t.pick || 2)) err(`${L} must have exactly ${t.pick || 2} answers`);
        if ((t.pick || 2) !== 2) err(`${L} pick must be 2`);
        (t.answer || []).forEach((a) => { if (!(a >= 0 && a < t.options.length)) err(`${L} answer ${a} invalid`); });
        if (new Set(t.answer).size !== t.answer.length) err(`${L} duplicate answers`);
      } else if (t.type === "sort") {
        const ids = (t.bins || []).map((b) => b.id);
        if (new Set(ids).size !== ids.length) err(`${L} duplicate bin ids`);
        (t.bins || []).forEach((b) => { if (b.img && !exists(b.img)) err(`${L} bin img missing ${b.img}`); });
        (t.cards || []).forEach((c) => { if (!ids.includes(c.bin)) err(`${L} card "${c.text}" → unknown bin ${c.bin}`); });
        const ct = (t.cards || []).map((c) => c.text); if (new Set(ct).size !== ct.length) err(`${L} duplicate card texts`);
        if (t.capacity === 1) {
          if (t.cards.length !== t.bins.length) err(`${L} capacity 1 needs one card per bin`);
          ids.forEach((b) => { if (t.cards.filter((c) => c.bin === b).length !== 1) err(`${L} bin ${b} needs exactly one card`); });
        } else ids.forEach((b) => { if (!t.cards.some((c) => c.bin === b)) warn(`${L} bin ${b} has no cards`); });
      } else if (t.type === "order") {
        if (!Array.isArray(t.items) || t.items.length < 3 || t.items.length > 7) err(`${L} needs 3–7 items`);
        if (new Set(t.items).size !== t.items.length) err(`${L} duplicate items`);
        (t.extras || []).forEach((x) => { if (t.items.includes(x)) err(`${L} extra "${x}" equals an item`); });
        if (t.inline && !/[.?!]$/.test(t.items[t.items.length - 1])) warn(`${L} sentence builder: last chunk should end with punctuation`);
      } else if (t.type === "fix") {
        const w = (t.sentence || "").split(" ");
        if (!(t.wrong >= 0 && t.wrong < w.length)) err(`${L} wrong index invalid`);
        else if (/^[“"‘'(]/.test(w[t.wrong])) err(`${L} wrong word starts with punctuation — engine drops it`);
        if (!(t.answer >= 0 && t.answer < (t.options || []).length)) err(`${L} answer index invalid`);
        else if (w[t.wrong] && w[t.wrong].replace(/[.,!?]+$/, "").toLowerCase() === t.options[t.answer].toLowerCase()) err(`${L} correct option equals the wrong word`);
        if (!t.stage2) warn(`${L} no stage2 prompt`);
        if (t.feedback2) Object.keys(t.feedback2).forEach((k) => { if (+k === t.answer) err(`${L} feedback2 on correct option`); });
      } else if (t.type === "verbs") {
        if (!Array.isArray(t.verbs) || t.verbs.length < 4) err(`${L} needs ≥4 verbs`);
        (t.verbs || []).forEach((v) => { if (!v.base || !v.past || v.past !== v.past.toLowerCase().trim()) err(`${L} bad verb ${JSON.stringify(v)}`); });
      } else err(`${L} unknown type ${t.type}`);
    });
  }
  totalErr += E.length;
  const tot = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`${E.length ? "✗" : "✓"} ${id}: ${n} pages, ${words} words, ${vocab.length} vocab | word ${counts.word} · structure ${counts.structure} · character ${counts.character} · grammar ${counts.grammar} · final ${counts.final} = ${tot} tasks`);
  E.forEach((m) => console.log("   ERROR " + m));
  W.forEach((m) => console.log("   warn  " + m));
}
const soon = NQ.CATALOG.filter((c) => c.status !== "playable").map((c) => c.id);
const dup = NQ.CATALOG.map((c) => c.id).filter((x, i, a) => a.indexOf(x) !== i);
if (!only.length) console.log(`Catalog: ${NQ.CATALOG.length} cards, playable ${NQ.CATALOG.length - soon.length}, coming soon: ${soon.join(", ") || "none"}${dup.length ? " | DUPLICATE IDS " + dup : ""}`);
if (totalErr) process.exitCode = 1;
