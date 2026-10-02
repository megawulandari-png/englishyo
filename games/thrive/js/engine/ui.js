/* UI helpers: h(), asset images, mascot, audio buttons, mascot dialogue, toast, confirm dialog */
(function () {
  const T = window.THRIVE;
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const k in props || {}) {
      const v = props[k];
      if (k.startsWith('aria-') && typeof v === 'boolean') { el.setAttribute(k, String(v)); continue; }   // aria-checked/selected/pressed need "true" / "false"
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') { for (const p in v) p.startsWith('--') ? el.style.setProperty(p, v[p]) : (el.style[p] = v[p]); }
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(9).forEach(c => { if (c == null || c === false) return; el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  }
  const $ = (s, r) => (r || document).querySelector(s);
  const asset = p => T.ASSET_BASE + p;

  /* small inline SVG icons for things the sprite sheet does not include */
  const ICONS = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9.5h4.5v-5h3v5H18V10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    eye: '<svg viewBox="0 0 64 64"><path d="M4 32s10-17 28-17 28 17 28 17-10 17-28 17S4 32 4 32z" fill="#fff" stroke="#173a5e" stroke-width="4"/><circle cx="32" cy="32" r="11" fill="#3a8ee6" stroke="#173a5e" stroke-width="3"/><circle cx="32" cy="32" r="5" fill="#173a5e"/><circle cx="36" cy="28" r="2.5" fill="#fff"/><path d="M14 14l4 5M32 9v6M50 14l-4 5" stroke="#173a5e" stroke-width="3.5" stroke-linecap="round"/></svg>'
  };
  const icon = (name, cls) => h('span', { class: 'ico ' + (cls || ''), 'aria-hidden': 'true', html: ICONS[name] });

  function img(src, alt, cls) { return h('img', { src: asset(src), alt: alt || '', class: cls || null, draggable: 'false', decoding: 'async' }); }
  function mascot(state, cls, key) {
    const k = key || T.store.mascot(); const m = T.mascots.find(x => x.key === k);
    return h('img', { src: asset(T.mascotSrc(k, state)), alt: (m ? m.name : 'Mascot') + ' mascot', class: 'mascot ' + (cls || ''), draggable: 'false' });
  }
  /* resolves 'obj:glass' | 'mascot:happy' | 'icon:eye' | 'svg:qr' | 'asset:badges/faith.png' | 'world:3' used in mission data */
  function pic(ref, alt, cls) {
    const [kind, name] = ref.split(':');
    if (kind === 'obj') return img(T.img.obj[name], alt, cls);
    if (kind === 'mascot') return mascot(name, cls);
    if (kind === 'icon') return h('span', { class: 'pic-ico ' + (cls || ''), role: 'img', 'aria-label': alt || name, html: ICONS[name] });
    if (kind === 'svg') return h('span', { class: 'pic-ico ' + (cls || ''), role: 'img', 'aria-label': alt || name, html: T.svg[name] || '' });
    if (kind === 'asset') return img(name, alt, cls);
    if (kind === 'world') return img(T.img.worlds[name], alt, cls);
    return img(ref, alt, cls);
  }

  /* round glossy audio buttons from the sprite sheet: play | replay | slow | sound */
  /* drawn stand-ins in the same glossy style, used only if an icon image cannot be loaded (so a button is never invisible) */
  const ROUND_FALLBACK = (() => {
    const disc = (c1, c2, glyph) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g${c1.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><circle cx="32" cy="32" r="29" fill="url(#g${c1.slice(1)})" stroke="#173a5e" stroke-width="3"/><ellipse cx="32" cy="16" rx="17" ry="8" fill="#fff" opacity=".28"/>${glyph}</svg>`;
    const speakerG = '<path d="M17 27h8l10-8v26l-10-8h-8z" fill="#fff"/><path d="M41 24q6 8 0 16M46 19q10 13 0 26" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>';
    return {
      sound: disc('#4f97ef', '#2f6fd0', speakerG), soundAlt: disc('#ffb83a', '#f08a12', speakerG),
      mute: disc('#ff6a5e', '#d9342b', '<path d="M17 27h8l10-8v26l-10-8h-8z" fill="#fff"/><path d="M41 25l11 14M52 25l-11 14" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>'),
      play: disc('#7ddc4b', '#2f9a1f', '<path d="M25 18l22 14-22 14z" fill="#fff"/>'),
      replay: disc('#4f97ef', '#2f6fd0', '<path d="M44 26a14 14 0 1 0 2 11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M46 16v13H33z" fill="#fff"/>'),
      slow: disc('#a77bff', '#6c4bd6', '<ellipse cx="30" cy="36" rx="13" ry="10" fill="#fff"/><circle cx="46" cy="33" r="5" fill="#fff"/><path d="M20 47h22" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>')
    };
  })();
  function roundIcon(kind) {
    const im = img(T.img.round[kind], '');
    im.addEventListener('error', () => im.replaceWith(h('span', { class: 'round-fallback', 'aria-hidden': 'true', html: ROUND_FALLBACK[kind] || ROUND_FALLBACK.sound })));
    return im;
  }
  function roundBtn(kind, label, onclick, extra) {
    return h('button', { class: 'round-btn ' + (extra || ''), 'aria-label': label, title: label, onclick: e => { e.stopPropagation(); onclick(e.currentTarget); } }, roundIcon(kind));
  }
  const speaker = (label, onplay, extra) => roundBtn('sound', label, onplay, 'round-btn--sm ' + (extra || ''));

  /* READ IT ALOUD / REPLAY / SLOW for text the LEARNER wrote. Always browser speech synthesis (never a recording).
   * getText() is called at the moment of the tap, so the speech always matches the procedure as it is NOW. */
  function learnerSpeechBar(getText) {
    const say = slow => { const t = String(getText() || '').trim(); if (!t) return toast('Build your procedure first.'); T.audio.speakLearnerText(t, { slow }); };
    const col = (kind, aria, label, slow) => h('div', { class: 'audio-bar__btn' }, roundBtn(kind, aria, () => say(slow)), h('span', { class: 'audio-bar__lbl' }, label));
    return h('div', { class: 'audio-bar', 'aria-label': 'Read your procedure aloud' }, col('play', 'Read my procedure aloud', 'READ IT ALOUD', false), col('replay', 'Replay my procedure', 'REPLAY', false), col('slow', 'Read my procedure slowly', 'SLOW', true));
  }

  /* mascot dialogue: mascot image + speech bubble.
   * `narration` = explicit clip ids of THIS stage only: the bubble shows exactly what they say, and REPLAY / SLOW replay only these clips.
   * A bubble without narration is plain text with no audio buttons (a button that does nothing is never shown). */
  function dialogue(state, line, narration) {
    const ids = narration && narration.length ? narration : null;
    const text = ids ? T.audio.textOf(ids) : line;
    const say = slow => T.audio.playNarration(ids, { slow });
    return h('div', { class: 'dialogue' }, mascot(state, 'dialogue__mascot'),
      h('div', { class: 'dialogue__bubble' }, h('p', null, text),
        ids ? h('div', { class: 'dialogue__ctrl' }, roundBtn('replay', 'Replay', () => say(false), 'round-btn--sm'), roundBtn('slow', 'Replay slowly', () => say(true), 'round-btn--sm')) : null));
  }

  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = h('div', { class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  function confirmDialog({ title, text, yes, no }) {
    return new Promise(res => {
      const done = v => { overlay.remove(); res(v); };
      const overlay = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
        h('div', { class: 'modal__box' }, mascot('think', 'modal__mascot'), h('h2', null, title), h('p', null, text),
          h('div', { class: 'row row--center' }, h('button', { class: 'btn btn--ghost', onclick: () => done(false) }, no || 'Cancel'),
            h('button', { class: 'btn btn--danger', onclick: () => done(true) }, yes || 'Yes'))));
      document.body.append(overlay); overlay.querySelector('button').focus();
    });
  }

  /* ENGLISH YO! logo linking back to the main games page */
  const brandLink = cls => h('a', { class: 'brand-link ' + (cls || ''), href: T.GAMES_URL, title: 'Back to ENGLISH YO! games' },
    img(T.img.brand, 'ENGLISH YO! — back to all games'));

  const strip = s => s.replace(/\{\{|\}\}|\[\[|\]\]|\(\(|\)\)/g, '');
  T.ui = { h, $, asset, img, mascot, pic, icon, roundIcon, roundBtn, speaker, learnerSpeechBar, dialogue, toast, confirmDialog, strip, brandLink };
})();
