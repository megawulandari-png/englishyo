/* JOGJA UNLOCKED — Learn Before You Play (UI). Content: js/learn-content.js. Lesson progress lives in state.learn
   and NEVER touches mission coins, stars, ranks or stamps. */
(function () {
  'use strict';
  const LC = window.JU_LEARN;

  window.JULearn = {
    create(api) {
      const { esc } = api;
      const el = api.screenEl;
      let from = null, focusAfter = null;

      const L = () => {
        const st = api.st();
        if (!st.learn || typeof st.learn !== 'object') st.learn = { step: 0, done: {}, answers: {}, complete: false };
        const l = st.learn; l.done = l.done || {}; l.answers = l.answers || {};
        if (!(l.step >= 0 && l.step < LC.STEPS.length)) l.step = 0;
        return l;
      };
      const ans = id => { const l = L(); return l.answers[id] || (l.answers[id] = {}); };
      const score = () => { const l = L(); return LC.SCORED.filter(id => l.answers[id] && l.answers[id].first === true).length; };
      const trainer = () => api.hasAgent() ? { img: api.agentImg(), name: api.myName() } : { img: api.managerImg(), name: 'Pak Wijaya' };

      /* ---------- small builders ---------- */
      const tip = text => { const t = trainer(); return `<aside class="tip"><img class="tip-av" src="${t.img}" alt=""><p><b>Trainer tip.</b> ${text}</p></aside>`; };
      const id = (en, idn) => `<span class="idn" lang="id">${esc(idn)}</span>`;
      const hl = (cls, text) => `<mark class="hl ${cls}">${esc(text)}</mark>`;

      /* A check item (radio options or tappable chips). Answer key is only in JS. */
      function check(it) {
        const a = ans(it.id), shown = a.checked, done = !!a.done;
        const opts = it.chunks ? it.chunks.map((t, i) => ({ id: String(i), text: t })) : it.options;
        const chips = it.display === 'chips';
        const optHtml = opts.map((o, i) => {
          const isChosen = a.choice === o.id;
          let cls = '';
          if (shown && done && o.id === it.correct) cls = 'right';
          else if (shown && !a.correct && isChosen) cls = 'wrong';
          return `<label class="opt ${chips ? 'chip-opt' : ''} ${cls}"><input type="radio" name="${it.id}" value="${esc(o.id)}" data-lx="pick" data-item="${it.id}" ${isChosen ? 'checked' : ''} ${done ? 'disabled' : ''}><span ${chips ? '' : `data-k="${'ABCD'[i] || ''}"`}>${esc(o.text)}</span></label>`;
        }).join('');
        let fb = '';
        if (shown) {
          const txt = a.correct ? it.right : ((it.optFb && it.optFb[a.choice]) ? it.optFb[a.choice] + ' ' : '') + it.wrong;
          fb = `<div class="feedback ${a.correct ? 'ok' : 'no'}" id="fb-${it.id}" tabindex="-1" role="status"><b>${a.correct ? 'Correct!' : 'Not yet.'}</b> ${esc(txt)}${a.correct ? '' : ' Pick another answer and check again.'}</div>`;
        }
        return `<fieldset class="q lq ${chips ? 'chips' : ''}" data-item="${it.id}">
          <legend>${esc(it.skill ? '[' + it.skill + '] ' : '')}${esc(it.prompt)}</legend>
          ${it.context ? `<p class="ctx">“${esc(it.context)}”</p>` : ''}
          ${it.chunks ? `<p class="sr">Sentence parts, choose one.</p>` : ''}
          <div class="${chips ? 'chip-row' : ''}">${optHtml}</div>
          ${done ? '' : `<div class="row"><button type="button" class="btn purple" data-lx="check" data-item="${it.id}" id="chk-${it.id}" ${a.choice ? '' : 'disabled'}>Check answer</button></div>`}
          ${fb}</fieldset>`;
      }
      const findItem = iid => {
        const pools = [LC.STRUCTURE.checks, LC.LANGUAGE.checks, LC.READ.questions];
        for (const p of pools) { const f = p.find(x => x.id === iid); if (f) return f; }
        return null;
      };
      const groupScore = items => { const n = items.filter(x => ans(x.id).first === true).length; return `<p class="mini-score" aria-live="polite">Practice score: <b>${n}</b> / ${items.length} on the first try</p>`; };

      /* ---------- steps ---------- */
      const S = {};

      S.goals = () => {
        const C = LC.CURRICULUM, t = trainer();
        return `<div class="cover">
            <div class="cover-text">
              <span class="chapter">${esc(LC.META.academy)}</span>
              <h2 id="lh" class="cover-title">${esc(LC.META.title)}</h2>
              <p class="cover-sub">${esc(LC.META.subtitle)}</p>
              <p class="lead">Welcome to the academy, ${esc(t.name)}! Before you meet your first traveler, learn how good travel agents read about places.</p>
            </div>
            <div class="cover-art"><img class="cover-pass" src="${api.ui('passport')}" alt=""><img class="cover-fig" src="${t.img}" alt="${api.hasAgent() ? '' : 'Pak Wijaya, the academy manager'}"></div>
          </div>
          <h3>What you will learn</h3>
          <ul class="goal-list">${LC.GOALS.map(g => `<li><span>${esc(g.en)}</span><small lang="id">${esc(g.id)}</small></li>`).join('')}</ul>
          <details class="obj"><summary>Learning Objectives (CP, TP and IKTP)</summary>
            <div class="obj-body" lang="id">
              <h4>${esc(C.cpTitle)}</h4><blockquote>${esc(C.cp)}</blockquote>
              <h4>${esc(C.tpTitle)}</h4><blockquote>${esc(C.tp)}</blockquote>
              <h4>${esc(C.iktpTitle)}</h4><ol>${C.iktp.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
              <p class="note-small">Element: ${esc(LC.META.element)} · ${esc(LC.META.level)}</p>
            </div></details>`;
      };

      S.discover = () => {
        const D = LC.DISCOVER;
        return `<h2 id="lh">What is a descriptive text?</h2>
          <div class="def-card"><p class="def-en">${esc(D.defEn)}</p><p class="idn" lang="id">${esc(D.defId)}</p></div>
          <div class="two-col">
            <div class="mini-card"><h3>Our focus</h3><p>${esc(D.focus)}</p></div>
            <div class="mini-card"><h3>Social function</h3><p>${esc(D.functionEn)}</p><p class="idn" lang="id">${esc(D.functionId)}</p></div>
          </div>
          <h3>Example</h3>
          <p class="example">“${esc(D.example)}”</p>
          <p>${esc(D.exampleNote)}</p><p class="idn" lang="id">${esc(D.exampleNoteId)}</p>
          ${tip('When you read about a place, ask: <i>What is it? Where is it? What is special about it?</i>')}`;
      };

      S.structure = () => {
        const P = LC.STRUCTURE, l = L(), sel = l.structSel || null;
        const part = k => P.parts[k];
        const idCls = sel === 'identification' ? 'on' : '', deCls = sel === 'description' ? 'on' : '';
        return `<h2 id="lh">Text structure</h2>
          <p>A descriptive text has two main parts. Tap a part to see where it appears in the example.</p>
          <div class="struct-btns" role="group" aria-label="Choose a text part">
            <button type="button" class="sbtn ident ${sel === 'identification' ? 'active' : ''}" data-lx="struct" data-k="identification" aria-pressed="${sel === 'identification'}">1. Identification</button>
            <button type="button" class="sbtn desc ${sel === 'description' ? 'active' : ''}" data-lx="struct" data-k="description" aria-pressed="${sel === 'description'}">2. Description</button>
          </div>
          <div class="struct-text">
            <p class="${idCls ? 'hl ident on' : 'hl'}"><span class="tag-lbl ident">Identification</span> ${esc(P.sample.identification)}</p>
            <p class="${deCls ? 'hl desc on' : 'hl'}"><span class="tag-lbl desc">Description</span> ${esc(P.sample.description)}</p>
          </div>
          <div class="struct-explain" id="structExplain" aria-live="polite">${sel ? `<b>${esc(part(sel).label)}</b>: ${esc(part(sel).en)}<br><span class="idn" lang="id">${esc(part(sel).id)}</span><br><i>${esc(part(sel).why)}</i>` : 'Tap Identification or Description to highlight it.'}</div>
          <h3>Check yourself</h3>
          ${P.checks.map(check).join('')}${groupScore(P.checks)}`;
      };

      S.language = () => {
        const G = LC.LANGUAGE, l = L(), tab = l.langTab || 'present';
        const tabs = [['present', 'Simple present'], ['adjectives', 'Adjectives'], ['expressions', 'Descriptive expressions']];
        let body = '';
        if (tab === 'present') {
          const T = G.present;
          body = `<p>${esc(T.intro)}</p><p class="idn" lang="id">${esc(T.introId)}</p>
            <table class="lt"><caption class="sr">Simple present patterns</caption><thead><tr><th scope="col">Pattern</th><th scope="col">Example</th></tr></thead>
            <tbody>${T.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table>
            <p class="note-box">${esc(T.note)}</p>`;
        } else if (tab === 'adjectives') {
          const T = G.adjectives;
          body = `<p>${esc(T.intro)}</p><p class="idn" lang="id">${esc(T.introId)}</p>
            <table class="lt"><caption class="sr">Adjectives and their Indonesian meaning</caption><thead><tr><th scope="col">Adjective</th><th scope="col">Meaning (Indonesia)</th></tr></thead>
            <tbody>${T.rows.map(r => `<tr><td><b>${esc(r[0])}</b></td><td lang="id">${esc(r[1])}</td></tr>`).join('')}</tbody></table>`;
        } else {
          const T = G.expressions;
          body = `<p>${esc(T.intro)}</p><p class="idn" lang="id">${esc(T.introId)}</p>
            <table class="lt"><caption class="sr">Descriptive expressions with examples</caption><thead><tr><th scope="col">Expression</th><th scope="col">Example</th></tr></thead>
            <tbody>${T.rows.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>`;
        }
        return `<h2 id="lh">Language toolkit</h2>
          <div class="tabs" role="tablist" aria-label="Language features">${tabs.map(t => `<button type="button" role="tab" class="tab" id="ltab-${t[0]}" aria-selected="${tab === t[0]}" data-lx="langtab" data-k="${t[0]}">${t[1]}</button>`).join('')}</div>
          <div class="passage" role="tabpanel" aria-labelledby="ltab-${tab}">${body}</div>
          <h3>Check yourself</h3>
          ${G.checks.map(check).join('')}${groupScore(G.checks)}`;
      };

      S.skills = () => {
        const l = L();
        return `<h2 id="lh">Reading detective skills</h2>
          <p>Good readers are detectives. Try each question first, then reveal the model answer.</p>
          <div class="skill-grid">${LC.SKILLS.map((s, i) => {
            const open = !!(l.reveal && l.reveal[s.id]);
            return `<article class="skill-card"><h3><span class="num">${i + 1}</span> ${esc(s.en)} <small lang="id">(${esc(s.idn)})</small></h3>
              <p class="def">${esc(s.def)}</p>
              <blockquote class="sk-text">${esc(s.text)}</blockquote>
              <p><b>Question:</b> ${esc(s.question)}</p>
              <button type="button" class="btn" data-lx="reveal" data-k="${s.id}" aria-expanded="${open}" aria-controls="ans-${s.id}">${open ? 'Hide model answer' : 'Show model answer'}</button>
              <div class="model-ans" id="ans-${s.id}" ${open ? '' : 'hidden'}><b>Model answer:</b> ${esc(s.answer)}</div></article>`;
          }).join('')}</div>
          <div class="flow" role="list" aria-label="Recommendation steps">${LC.SUMMARY.flow.map((f, i) => `<span class="flow-step" role="listitem"><b>${i + 1}</b> ${esc(f)}</span>`).join('<span class="flow-arrow" aria-hidden="true">→</span>')}</div>`;
      };

      S.read = () => {
        const R = LC.READ, l = L(), show = l.labels !== false;
        return `<h2 id="lh">Let’s read: ${esc(R.title)}</h2>
          <div class="read-layout">
            <figure class="read-fig"><img src="${R.img}" alt="${esc(R.alt)}"><figcaption>Illustration (stylised, not a real map)</figcaption></figure>
            <div>
              <button type="button" class="btn" data-lx="labels" aria-pressed="${show}">${show ? 'Hide' : 'Show'} structure labels</button>
              <div class="text-scroll" tabindex="0" role="region" aria-label="Prambanan Temple text">
                ${R.sections.map(s => `<section class="rs ${show ? s.key : ''}">${show ? `<span class="tag-lbl ${s.key === 'identification' ? 'ident' : 'desc'}">${esc(s.label)}</span>` : ''}${s.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}</section>`).join('')}
              </div>
            </div>
          </div>
          <h3>Comprehension questions</h3>
          ${R.questions.map(check).join('')}${groupScore(R.questions)}`;
      };

      S.practice = () => {
        const P = LC.PRACTICE, l = L(), pl = ans('p_place'), rs = ans('p_reason');
        const place = P.places.find(x => x.id === pl.choice), reason = P.reasons.find(x => x.id === rs.choice);
        const done = pl.done && rs.done;
        const checked = pl.checked || rs.checked;
        const sentence = `I recommend <b>${place ? esc(place.name) : '________'}</b> because ${reason ? esc(reason.text) : '________'}`;
        let fb = '';
        if (checked) {
          const okP = !!pl.correct, okR = !!rs.correct;
          fb = `<div class="feedback ${okP && okR ? 'ok' : 'no'}" id="fb-practice" tabindex="-1" role="status">
            <p><b>Place:</b> ${esc(P.placeFb[pl.choice] || '')}</p><p><b>Reason:</b> ${esc(P.reasonFb[rs.choice] || '')}</p>
            ${okP && okR ? `<p><b>${esc(P.success)}</b></p>` : '<p>Change your choice and check again.</p>'}</div>`;
        }
        return `<h2 id="lh">Be a smart travel agent</h2>
          <div class="req-card"><img class="req-fig" src="${P.tourist.img}" alt="${esc(P.tourist.alt)}">
            <div class="req-bubble"><span class="speaker">${esc(P.tourist.name)}</span><p>“${esc(P.request)}”</p></div></div>
          <p><b>${esc(P.instruction)}</b></p>
          <fieldset class="place-pick lp"><legend class="step-legend">1. Which place is best for ${esc(P.tourist.name)}?</legend>
            ${P.places.map(p => `<label class="place-opt"><input type="radio" name="p_place" value="${p.id}" data-lx="pickp" data-item="p_place" ${pl.choice === p.id ? 'checked' : ''} ${done ? 'disabled' : ''}>
              <span class="pc ${pl.checked && pl.choice === p.id ? (pl.correct ? 'right' : 'wrong') : ''}"><img src="${p.img}" alt="${esc(p.alt)}"><b>${esc(p.name)}</b><small>${esc(p.note)}</small></span></label>`).join('')}</fieldset>
          <fieldset class="q lq"><legend>2. Choose the best reason (evidence from the text and the request).</legend>
            ${P.reasons.map((r, i) => `<label class="opt ${rs.checked && rs.choice === r.id ? (rs.correct ? 'right' : 'wrong') : ''}"><input type="radio" name="p_reason" value="${r.id}" data-lx="pickp" data-item="p_reason" ${rs.choice === r.id ? 'checked' : ''} ${done ? 'disabled' : ''}><span data-k="${'ABCD'[i]}">${esc(r.text.charAt(0).toUpperCase() + r.text.slice(1))}</span></label>`).join('')}</fieldset>
          <div class="sentence" aria-live="polite"><span class="sr">Your recommendation: </span>${sentence}</div>
          ${done ? '' : `<div class="row"><button type="button" class="btn purple" data-lx="checkp" id="chk-practice" ${pl.choice && rs.choice ? '' : 'disabled'}>Check my recommendation</button></div>`}
          ${fb}`;
      };

      S.ready = () => {
        const U = LC.SUMMARY, l = L(), total = LC.SCORED.length;
        const st = api.st(), inRun = st.run && !st.run.completed, doneRun = st.run && st.run.completed;
        const cta = inRun ? 'Back to Mission 1' : (doneRun ? 'Replay Mission 1' : U.cta);
        return `<h2 id="lh">Ready to play!</h2>
          <p>After this lesson, you should be able to:</p>
          <ul class="goal-list plain">${U.outcomes.map(o => `<li><span>${esc(o)}</span></li>`).join('')}</ul>
          <blockquote class="final-msg">${esc(U.message)}</blockquote>
          <div class="score-card"><b>Optional lesson score: ${score()} / ${total}</b>
            <span>Counts correct answers on the first try. This is for practice only and does <u>not</u> change your Mission 1 coins, stars or rank.</span></div>
          <div class="row center" style="margin-top:16px"><button type="button" class="btn purple big" data-lx="start" id="startBtn">${esc(cta)}</button></div>
          <p class="note-small" style="text-align:center">You can open this lesson again any time from the Menu or the title screen.</p>`;
      };

      /* ---------- layout ---------- */
      function draw() {
        const l = L(), step = l.step, N = LC.STEPS.length, S0 = LC.STEPS[step];
        const nav = LC.STEPS.map((s, i) => `<li><button type="button" class="lnav-btn ${i === step ? 'current' : ''} ${l.done[s.id] ? 'done' : ''}" data-lx="goto" data-i="${i}" ${i === step ? 'aria-current="step"' : ''}><span class="lnum">${l.done[s.id] && i !== step ? '✓' : i + 1}</span><span>${esc(s.title)}</span></button></li>`).join('');
        const exitLabel = from && from !== 'title' ? 'Back to the game' : 'Back to title';
        const pct = Math.round((Object.keys(l.done).filter(k => l.done[k]).length / N) * 100);
        const y = window.scrollY;
        el.innerHTML = `<section class="screen learn" aria-label="Learn Before You Play">
          <div class="learn-top">
            <button type="button" class="btn" data-lx="exit">← ${exitLabel}</button>
            <div class="learn-prog"><span>Step ${step + 1} of ${N} · ${esc(S0.title)}</span>
              <div class="bar" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div></div>
          </div>
          <div class="learn-grid">
            <nav class="learn-nav" aria-label="Lesson steps"><details ${window.matchMedia('(min-width:901px)').matches ? 'open' : ''}><summary>Lesson menu</summary><ol>${nav}</ol></details></nav>
            <article class="panel guide" aria-labelledby="lh">
              <span class="chapter">Chapter ${step + 1}</span>
              <div class="guide-body">${S[S0.id]()}</div>
              <div class="learn-foot">
                <button type="button" class="btn" data-lx="prev" ${step === 0 ? 'disabled' : ''}>← Back</button>
                ${step < N - 1 ? `<button type="button" class="btn purple" data-lx="next">Next →</button>` : ''}
              </div>
            </article></div></section>`;
        const h = $1('#lh'); if (h) h.setAttribute('tabindex', '-1');
        if (focusAfter) { const f = $1(focusAfter); if (f) { f.setAttribute('tabindex', f.getAttribute('tabindex') || '-1'); f.focus({ preventScroll: true }); } if (focusAfter !== '#lh') window.scrollTo(0, y); }
        focusAfter = null;
      }
      const $1 = s => el.querySelector(s);
      const save = () => api.save();

      /* ---------- events ---------- */
      const H = {
        exit() { api.exit(from); },
        goto(t) { const l = L(); l.step = +t.dataset.i; save(); focusAfter = '#lh'; draw(); window.scrollTo(0, 0); },
        prev() { const l = L(); if (l.step > 0) { l.step--; save(); focusAfter = '#lh'; draw(); window.scrollTo(0, 0); } },
        next() { const l = L(); l.done[LC.STEPS[l.step].id] = true; if (l.step < LC.STEPS.length - 1) l.step++; save(); focusAfter = '#lh'; draw(); window.scrollTo(0, 0); },
        struct(t) { const l = L(); l.structSel = t.dataset.k; save(); focusAfter = `[data-k="${t.dataset.k}"].sbtn`; draw(); },
        langtab(t) { const l = L(); l.langTab = t.dataset.k; save(); focusAfter = '#ltab-' + t.dataset.k; draw(); },
        reveal(t) { const l = L(); l.reveal = l.reveal || {}; l.reveal[t.dataset.k] = !l.reveal[t.dataset.k]; save(); focusAfter = `[data-lx=reveal][data-k="${t.dataset.k}"]`; draw(); },
        labels() { const l = L(); l.labels = l.labels === false; save(); focusAfter = '[data-lx=labels]'; draw(); },
        check(t) {
          const it = findItem(t.dataset.item), a = ans(it.id); if (!a.choice || a.done) return;
          const ok = a.choice === it.correct; if (a.first === undefined) a.first = ok;
          a.checked = true; a.correct = ok; if (ok) a.done = true; save();
          api.announce((ok ? 'Correct. ' : 'Not yet. ') + (ok ? it.right : it.wrong));
          focusAfter = '#fb-' + it.id; draw();
        },
        checkp() {
          const P = LC.PRACTICE, pl = ans('p_place'), rs = ans('p_reason'); if (!pl.choice || !rs.choice) return;
          const okP = pl.choice === P.correctPlace, okR = rs.choice === P.correctReason;
          if (pl.first === undefined) pl.first = okP; if (rs.first === undefined) rs.first = okR;
          pl.checked = rs.checked = true; pl.correct = okP; rs.correct = okR; pl.done = okP; rs.done = okR; save();
          api.announce(okP && okR ? P.success : 'Not quite. Check the feedback and try again.');
          focusAfter = '#fb-practice'; draw();
        },
        start() { const l = L(); l.done.ready = true; l.complete = true; save(); api.startMission(); }
      };
      el.addEventListener('click', e => {
        const t = e.target.closest('[data-lx]'); if (!t || t.disabled || !el.contains(t)) return;
        const f = H[t.dataset.lx]; if (f) f(t);
      });
      el.addEventListener('change', e => {
        const t = e.target; if (!t.dataset || !t.dataset.lx) return;
        if (t.dataset.lx === 'pick') {
          const a = ans(t.dataset.item); a.choice = t.value; if (a.checked && !a.done) { a.checked = false; a.correct = undefined; }
          save(); const b = $1('#chk-' + t.dataset.item); if (b) b.disabled = false;
          const fs = t.closest('fieldset'); if (fs) { $$1('.feedback', fs).forEach(x => x.remove()); $$1('.opt.wrong', fs).forEach(x => x.classList.remove('wrong')); }
        } else if (t.dataset.lx === 'pickp') {
          const a = ans(t.dataset.item); a.choice = t.value; a.checked = false; a.correct = undefined; save();
          const pl = ans('p_place'), rs = ans('p_reason'); const b = $1('#chk-practice'); if (b) b.disabled = !(pl.choice && rs.choice);
          focusAfter = `input[name=${t.dataset.item}][value="${t.value}"]`; draw();
        }
      });
      const $$1 = (s, r) => Array.from((r || el).querySelectorAll(s));

      return {
        render(opts) {
          opts = opts || {};
          if (opts.from !== undefined) from = opts.from;
          if (typeof opts.step === 'number') { L().step = opts.step; }
          focusAfter = '#lh'; draw();
        }
      };
    }
  };
})();
