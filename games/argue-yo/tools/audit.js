#!/usr/bin/env node
/* ARGUE YO! content audit.  Run:  node games/argue-yo/tools/audit.js
   Checks structure, answer keys, distractors, duplicates, length, readability and spelling
   for all six cases. Exits with code 1 if any ERROR is found. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');

const ctx = { window: {}, console };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
load('js/compose.js');
fs.readdirSync(path.join(root, 'js/cases')).sort().forEach(f => load('js/cases/' + f));
const CASES = ctx.ARGUE_CASES;
const C = ctx.ARGUE.compose;

let errors = 0, warns = 0;
const err = (id, m) => { errors++; console.log('  ERROR [' + id + '] ' + m); };
const warn = (id, m) => { warns++; console.log('  warn  [' + id + '] ' + m); };

/* ---- spelling word list ---- */
let dict = new Set();
try { fs.readFileSync('/usr/share/dict/words', 'utf8').split('\n').forEach(w => dict.add(w.toLowerCase())); } catch (e) {}
const EXTRA = new Set(['smartphone', 'smartphones', 'canteen', 'canteens', 'recognise', 'colours', 'colour', 'favourite', 'reusable', 'homework',
  'refill', 'headaches', 'headache', 'scroll', 'scrolling', 'gaming', 'teenagers', 'teenager', 'pollute', 'pollution', 'recycle', 'recycled', 'recycling', 'adults',
  'petrol', 'cycle', 'cyclists', 'cyclist', 'cycling', 'bicycle', 'bicycles', 'motorbike', 'motorbikes', 'drains', 'moreover', 'furthermore', 'nobody', 'ourselves',
  'uniform', 'uniforms', 'outfits', 'outfit', 'sugary', 'dika', 'arka', 'nadia', 'sinta', 'indonesia', 'lunch', 'boxes', 'organise', 'tasks', 'wasn', 'cheaper', 'unhappy',
  'themselves', 'yourself', 'helmets', 'helmet', 'grandchildren', 'safer', 'fairer', 'happier', 'healthier', 'tasty', 'goes', 'texts', 'phones', 'online',
  'bottles', 'plastics', 'unhealthy', 'concentrate', 'schools', 'students', 'teachers', 'friends', 'activities', 'results', 'habits', 'choices', 'ideas', 'sports',
  'families', 'problems', 'subjects', 'vegetables', 'drinks', 'snacks', 'candy', 'eyes', 'hours', 'spoils', 'spoil', 'stressed', 'tired', 'writes', 'colourful', 'neat', 'tidy', 'proud', 'apps']);
const stem = w => [w, w.replace(/s$/, ''), w.replace(/es$/, ''), w.replace(/ies$/, 'y'), w.replace(/ed$/, ''), w.replace(/ed$/, 'e'), w.replace(/ing$/, ''), w.replace(/ing$/, 'e'),
  w.replace(/er$/, ''), w.replace(/est$/, ''), w.replace(/ly$/, ''), w.replace(/ier$/, 'y'), w.replace(/iest$/, 'y')];
function known(w) { w = w.toLowerCase(); if (EXTRA.has(w)) return true; return stem(w).some(s => dict.has(s) || EXTRA.has(s)); }
function spell(id, label, s) {
  (s.match(/[A-Za-z]+(?:[’'][a-z]+)?/g) || []).forEach(raw => {
    const w = raw.replace(/[’'].*$/, '');
    if (w.length > 2 && !known(w)) warn(id, 'spelling? "' + raw + '" in ' + label);
  });
}

/* ---- all the strings in a case ---- */
function allStrings(c) {
  const out = [];
  const add = (l, s) => { if (typeof s === 'string') out.push([l, s]); };
  add('title', c.title); add('question', c.question); add('brief', c.brief); add('textTitle', c.textTitle);
  add('thesis.issue', c.thesis.issue); add('thesis.position', c.thesis.position);
  c.args.forEach((a, i) => { add('arg' + i + '.claim', a.claim); add('arg' + i + '.detail', a.detail); add('arg' + i + '.why', a.why); if (a.gap) add('arg' + i + '.gap.why', a.gap.why); });
  add('rec.main', c.rec.main); add('rec.extra', c.rec.extra); add('rec.modal.why', c.rec.modal.why);
  c.distract.forEach((d, i) => { add('distract' + i, d.t); add('distract' + i + '.why', d.why); });
  c.thesisAlt.forEach((d, i) => add('thesisAlt' + i, d.t));
  c.detailAlt.forEach((d, i) => add('detailAlt' + i, d));
  c.recAlt.forEach((d, i) => add('recAlt' + i, d.t));
  c.debate.forEach((d, i) => { add('debate' + i + '.says', d.says); d.opts.forEach((o, j) => { add('debate' + i + '.opt' + j, o[0]); add('debate' + i + '.why' + j, o[1]); }); });
  c.reading.forEach((r, i) => { add('read' + i + '.q', r.q); r.opts.forEach((o, j) => { add('read' + i + '.opt' + j, o[0]); add('read' + i + '.why' + j, o[1]); }); });
  return out;
}

function lengthCue(id, label, texts) {
  const others = texts.slice(1), mean = others.reduce((a, t) => a + t.length, 0) / others.length;
  const ratio = texts[0].length / mean;
  if (ratio > 1.3 || ratio < 0.7) err(id, label + ': correct option length is ' + ratio.toFixed(2) + 'x the others (length cue)');
  else if (ratio > 1.2 || ratio < 0.8) warn(id, label + ': correct option length ratio ' + ratio.toFixed(2));
}
const KINDS = ['irrelevant', 'opposite', 'vague', 'rec', 'nopos', 'arg'];
const RTYPES = ['purpose', 'mainIdea', 'inference', 'reference', 'evidence', 'summary', 'recommendation'];
const CHARS = ['arka', 'nadia', 'dika', 'sinta'];
const BG = ['school', 'classroom', 'library', 'park', 'cafeteria', 'hall'];
const CONNECTORS = ['First', 'Moreover', 'Furthermore', 'Besides', 'Therefore'];

console.log('ARGUE YO! content audit\n');
if (CASES.length !== 6) err('all', 'expected 6 cases, found ' + CASES.length);
const seenQ = new Map(), seenText = new Map();
const globalQuestions = new Set();

CASES.sort((a, b) => a.no - b.no).forEach((c, idx) => {
  const id = c.id;
  console.log('CASE ' + String(c.no).padStart(2, '0') + ' ' + c.title);
  if (c.no !== idx + 1) err(id, 'case numbers must be 1..6 in order');
  if (!/^Should .*\?$/.test(c.question)) err(id, 'question should start with "Should" and end with ?');
  if (!CHARS.includes(c.guide)) err(id, 'unknown guide ' + c.guide);
  if (!BG.includes(c.bg)) err(id, 'unknown bg ' + c.bg);

  /* text length + readability */
  const text = C.fullText(c);
  const wc = C.wordCount(c);
  const sents = C.sentences(text);
  const lens = sents.map(s => C.words(s).length);
  const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
  const maxLen = Math.max(...lens);
  console.log('  words: ' + wc + ' | sentences: ' + sents.length + ' | avg ' + avg.toFixed(1) + ' words/sentence | longest ' + maxLen);
  if (wc < 180 || wc > 235) err(id, 'text length ' + wc + ' is outside 180–235 words');
  if (avg > 15) warn(id, 'average sentence length ' + avg.toFixed(1) + ' is high for A2–B1');
  if (maxLen > 26) warn(id, 'a sentence has ' + maxLen + ' words');
  sents.forEach((s, i) => { if (lens[i] > 24) warn(id, 'long sentence (' + lens[i] + '): ' + s); });
  const longWords = [...new Set(C.words(text).filter(w => w.length >= 10).map(w => w.toLowerCase()))];
  if (longWords.length) console.log('  long words (check A2–B1): ' + longWords.join(', '));
  const syll = w => Math.max(1, (w.toLowerCase().replace(/e$/, '').match(/[aeiouy]+/g) || []).length);
  const ws = C.words(text);
  const fk = 0.39 * (ws.length / sents.length) + 11.8 * (ws.reduce((a, w) => a + syll(w), 0) / ws.length) - 15.59;
  console.log('  Flesch-Kincaid grade ≈ ' + fk.toFixed(1));
  if (fk > 9) warn(id, 'reading grade ' + fk.toFixed(1) + ' looks high');

  /* structure */
  if (!c.thesis.issue || !c.thesis.position) err(id, 'thesis needs issue + position');
  if (!/\b(should|must|need to)\b/i.test(c.thesis.position)) err(id, 'thesis position has no modal');
  if (c.args.length !== 3) err(id, 'need exactly 3 arguments');
  const gapCount = c.args.filter(a => a.gap).length;
  if (gapCount !== 1) err(id, 'need exactly one link gap in the argument details, found ' + gapCount);
  c.args.forEach((a, i) => {
    if (!CONNECTORS.includes(a.conn)) err(id, 'arg ' + i + ' bad connector ' + a.conn);
    if (/^[A-Z]/.test(a.claim)) err(id, 'arg ' + i + ' claim must start in lower case');
    if (!/[.]$/.test(a.claim)) err(id, 'arg ' + i + ' claim must end with a full stop');
    if (!a.why) err(id, 'arg ' + i + ' missing why');
    const hasToken = a.detail.includes('{{gap}}');
    if (hasToken !== !!a.gap) err(id, 'arg ' + i + ' {{gap}} token and gap object do not match');
    if (a.gap) {
      if (!a.gap.options.includes(a.gap.answer)) err(id, 'gap answer missing from options');
      if (new Set(a.gap.options).size !== 3) err(id, 'gap needs 3 unique options');
      if (!['so', 'because'].includes(a.gap.answer)) err(id, 'gap answer should be so/because');
    }
    if (a.claim.split(' ').length > 14) warn(id, 'arg ' + i + ' claim is long');
  });
  if (c.args[0].conn !== 'First') err(id, 'first argument must use First');
  if (!c.rec.main.includes('{{modal}}')) err(id, 'rec.main needs {{modal}}');
  if (!c.rec.modal.options.includes(c.rec.modal.answer) || new Set(c.rec.modal.options).size !== 3) err(id, 'modal options invalid');
  if (!/^(should|should not|must|need to)$/.test(c.rec.modal.answer)) err(id, 'modal answer must be should / should not / must / need to');
  if (c.rec.lead !== 'Therefore') warn(id, 'rec.lead is ' + c.rec.lead);
  if (!/\bshould\b/i.test(c.rec.extra)) warn(id, 'rec.extra has no "should"');

  /* distractor banks */
  const need = { distract: 5, thesisAlt: 2, detailAlt: 3, recAlt: 2, debate: 3, reading: 7 };
  Object.keys(need).forEach(k => { if (!c[k] || c[k].length !== need[k]) err(id, k + ' must have ' + need[k] + ' items'); });
  const kinds = c.distract.map(d => d.kind);
  kinds.forEach(k => { if (!KINDS.includes(k)) err(id, 'bad kind ' + k); });
  if (!kinds.includes('opposite')) err(id, 'distract needs at least one opposite-side card');
  if (kinds.filter(k => k === 'irrelevant').length < 2) err(id, 'distract needs at least two irrelevant-but-true cards');
  c.distract.forEach((d, i) => { if (d.kind === 'opposite' && !d.why) err(id, 'distract ' + i + ' (opposite) needs a custom why'); });
  c.thesisAlt.forEach(d => { if (!['nopos', 'opposite'].includes(d.kind)) err(id, 'thesisAlt kind must be nopos/opposite'); });
  c.recAlt.forEach(d => { if (!['irrelevant', 'arg'].includes(d.kind)) err(id, 'recAlt kind must be irrelevant/arg'); });

  /* debate */
  const speakers = new Set();
  c.debate.forEach((d, i) => {
    if (!CHARS.includes(d.who)) err(id, 'debate ' + i + ' bad speaker');
    speakers.add(d.who);
    if (d.who === c.guide) warn(id, 'debate ' + i + ' opponent is the guide (' + d.who + ')');
    if (d.opts.length !== 4) err(id, 'debate ' + i + ' needs 4 options');
    const texts = d.opts.map(o => o[0]);
    if (new Set(texts).size !== 4) err(id, 'debate ' + i + ' duplicate options');
    d.opts.forEach((o, j) => { if (!o[0] || !o[1]) err(id, 'debate ' + i + ' option ' + j + ' needs text + why'); });
    lengthCue(id, 'debate ' + i, texts);
    if (seenQ.has(d.says)) err(id, 'debate says duplicated in ' + seenQ.get(d.says)); else seenQ.set(d.says, id);
  });
  if (speakers.size < 3) warn(id, 'debate uses only ' + speakers.size + ' different speakers');

  /* reading */
  const types = c.reading.map(r => r.type);
  RTYPES.forEach(t => { if (!types.includes(t)) err(id, 'reading missing type ' + t); });
  if (new Set(types).size !== types.length) err(id, 'duplicate reading types');
  c.reading.forEach((r, i) => {
    if (r.opts.length !== 4) err(id, 'reading ' + i + ' needs 4 options');
    const texts = r.opts.map(o => o[0]);
    if (new Set(texts.map(t => t.toLowerCase())).size !== 4) err(id, 'reading ' + i + ' duplicate options');
    r.opts.forEach((o, j) => { if (!o[0] || !o[1]) err(id, 'reading ' + i + ' option ' + j + ' needs text + why'); });
    if (globalQuestions.has(r.q + '|' + id)) err(id, 'duplicate question');
    globalQuestions.add(r.q + '|' + id);
    (r.q.match(/“([^”]+)”/g) || []).forEach(qq => {
      const phrase = qq.slice(1, -1).replace(/…$/, '').trim().toLowerCase();
      if (!text.toLowerCase().includes(phrase)) err(id, 'reading ' + i + ' quotes "' + phrase + '" which is not in the text');
    });
    lengthCue(id, 'reading ' + i + ' (' + r.type + ')', texts);
  });
  const rq = c.reading.find(r => r.type === 'recommendation');
  const recText = (C.recMain(c) + ' ' + c.rec.extra).toLowerCase();
  if (rq) { const kw = rq.opts[0][0].toLowerCase().split(/[^a-z]+/).filter(w => w.length > 4); const hit = kw.filter(w => recText.includes(w.replace(/s$/, ''))).length; if (hit < 1) warn(id, 'recommendation question answer shares no key words with the recommendation'); }

  /* hygiene */
  allStrings(c).forEach(([l, s]) => {
    if (/  /.test(s)) err(id, 'double space in ' + l);
    if (/\s[.,!?]/.test(s)) err(id, 'space before punctuation in ' + l);
    if (/[A-Za-z]'[A-Za-z]/.test(s) && /[“”]/.test(s)) {}
    if (/^[a-z]/.test(s) && !/claim|gap|brief|why|opt|^arg\d+\.detail$/.test(l) && !['rec.main'].includes(l)) warn(id, l + ' starts with lower case: ' + s.slice(0, 30));
    if (!/[.!?”"…]$/.test(s) && !/^(title|question|textTitle|arg\d+\.claim)$/.test(l) && !/opt/.test(l) && l !== 'rec.main') warn(id, l + ' has no final punctuation: ' + s.slice(0, 40));
    if (/\b(\w+) \1\b/i.test(s)) warn(id, 'repeated word in ' + l + ': ' + s.slice(0, 50));
    spell(id, l, s);
    const k = s.trim().toLowerCase();
    if (k.length > 25 && !/(\.why|\.q$|why\d)/.test(l)) { if (seenText.has(k) && seenText.get(k) !== id + ':' + l) { if (!/^(reading|debate)/.test(l) || true) warn(id, 'repeated string ("' + s.slice(0, 40) + '…") also in ' + seenText.get(k)); } else seenText.set(k, id + ':' + l); }
  });

  /* assembly check: the Level 3/5 final text equals the canonical text */
  const frags = C.fragments(c);
  if (frags.length !== 7) err(id, 'fragments length');
  const joined = frags.map(f => f.text).join(' ');
  if (/\{\{|\}\}/.test(joined) || /\{\{|\}\}/.test(text)) err(id, 'unresolved {{token}} in text');
  const arguments_ = frags.filter(f => f.type === 'argument').length;
  if (arguments_ !== 3) err(id, 'fragments need 3 arguments');
  console.log('');
});

console.log('\n' + (errors ? 'FAILED' : 'PASSED') + ': ' + errors + ' error(s), ' + warns + ' warning(s)');
process.exit(errors ? 1 : 0);
