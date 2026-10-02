/* THRIVE sticker icons (inline SVG) for objects the sprite sheets do not include.
 * Style matches the core asset sheet: chunky navy outline, bright flat fills, small white highlights.
 * Use in mission data as 'svg:<name>'. Keep each icon on a 64×64 viewBox. */
window.THRIVE = window.THRIVE || {};
(function () {
  const S = b => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke="#173a5e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${b}</svg>`;
  const qrMarks = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect width="48" height="48" rx="6" fill="#fff"/><g fill="#173a5e" stroke="none"><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="29" y="5" width="14" height="14" rx="2"/><rect x="5" y="29" width="14" height="14" rx="2"/></g><g fill="#fff" stroke="none"><rect x="8" y="8" width="8" height="8"/><rect x="32" y="8" width="8" height="8"/><rect x="8" y="32" width="8" height="8"/></g><g fill="#173a5e" stroke="none"><rect x="10" y="10" width="4" height="4"/><rect x="34" y="10" width="4" height="4"/><rect x="10" y="34" width="4" height="4"/><rect x="25" y="25" width="5" height="5"/><rect x="32" y="28" width="5" height="5"/><rect x="38" y="36" width="5" height="5"/><rect x="26" y="36" width="5" height="5"/><rect x="32" y="40" width="4" height="4"/></g></g>`;
  const bin = (fill, sym) => S(`<path d="M14 20h36l-4 38H18z" fill="${fill}"/><rect x="9" y="13" width="46" height="8" rx="3" fill="${fill}"/><path d="M26 13V8h12v5"/><circle cx="32" cy="38" r="11" fill="#fff" stroke-width="2.5"/>${sym}<path d="M20 25l2 28" stroke="#fff" stroke-opacity=".6" stroke-width="2.5"/>`);
  THRIVE.svg = {
    /* World 2 — digital safety */
    qr: S(qrMarks(8, 8, 1)),
    poster: S(`<rect x="10" y="5" width="44" height="54" rx="4" fill="#fff6d6"/><circle cx="32" cy="7" r="3.5" fill="#e2443a"/><rect x="16" y="13" width="32" height="7" rx="2" fill="#f39a1e"/>${qrMarks(19, 25, .54)}<path d="M18 54h28" stroke-width="2.5"/>`),
    notice: S(`<path d="M18 50v10M46 50v10"/><rect x="5" y="8" width="54" height="42" rx="4" fill="#c98a4b"/><rect x="10" y="13" width="19" height="15" fill="#fff" stroke-width="2"/><rect x="33" y="13" width="21" height="27" fill="#e9f3ff" stroke-width="2"/><rect x="12" y="32" width="17" height="13" fill="#fff6d6" stroke-width="2"/><g fill="#e2443a" stroke="none"><circle cx="19" cy="13" r="2.5"/><circle cx="43" cy="13" r="2.5"/></g><path d="M37 21h13M37 27h10M14 19h11" stroke-width="2"/>`),
    scan: S(`<rect x="18" y="4" width="28" height="56" rx="6" fill="#2f78d6"/><rect x="22" y="10" width="20" height="40" rx="2" fill="#e9f3ff"/><path d="M25 18v-4h4M39 14h4v4M43 42v4h-4M29 46h-4v-4" stroke="#e2443a"/><path d="M24 30h16" stroke="#3fb52a"/><circle cx="32" cy="55" r="1.5" fill="#fff" stroke="none"/>`),
    linkSafe: S(`<rect x="4" y="16" width="56" height="32" rx="9" fill="#e8f8e0"/><rect x="11" y="29" width="15" height="12" rx="2" fill="#3fb52a"/><path d="M14 29v-4a4.5 4.5 0 0 1 9 0v4" fill="none"/><path d="M33 28h18M33 36h12" stroke="#1f8a3a"/>`),
    linkBad: S(`<rect x="4" y="16" width="56" height="32" rx="9" fill="#fff0ec"/><path d="M19 22l10 18H9z" fill="#ffcf3f"/><path d="M19 28v5"/><circle cx="19" cy="37" r="1" fill="#173a5e"/><path d="M35 28h16M35 36h11" stroke="#e2443a"/>`),
    magnifier: S(`<path d="M39 39l15 15" stroke-width="8"/><path d="M39 39l15 15" stroke="#f39a1e" stroke-width="3.5"/><circle cx="27" cy="27" r="16" fill="#e9f3ff"/><path d="M19 22a9 9 0 0 1 7-6" stroke="#fff" stroke-width="3"/>`),
    key: S(`<path d="M33 32h24M47 32v8M54 32v6" stroke-width="5"/><circle cx="21" cy="32" r="13" fill="#ffcf3f"/><circle cx="21" cy="32" r="4" fill="#fff"/>`),
    share: S(`<path d="M20 32L44 17M20 32l24 15"/><circle cx="18" cy="32" r="8" fill="#7b4fd0"/><circle cx="46" cy="15" r="8" fill="#7b4fd0"/><circle cx="46" cy="49" r="8" fill="#7b4fd0"/>`),
    message: S(`<path d="M8 10h48a5 5 0 0 1 5 5v24a5 5 0 0 1-5 5H28l-12 10V44H8a5 5 0 0 1-5-5V15a5 5 0 0 1 5-5z" fill="#fff"/><circle cx="32" cy="27" r="9" fill="#e2443a"/><path d="M32 22v6" stroke="#fff"/><circle cx="32" cy="32" r="1" fill="#fff" stroke="#fff"/>`),

    /* World 3 — Taste of Nusantara */
    flour: S(`<path d="M16 18l-6 40h44l-6-40z" fill="#fff"/><path d="M16 18c2-6 6-10 10-10h12c4 0 8 4 10 10z" fill="#fff"/><path d="M22 8l4-4h12l4 4" fill="#fff"/><rect x="12" y="30" width="40" height="13" fill="#5fb0f0" stroke="none"/><path d="M19 37h26" stroke="#fff" stroke-width="3"/>`),
    palmSugar: S(`<path d="M6 46V32a12 5 0 0 1 24 0v14a12 5 0 0 1-24 0z" fill="#a55a28"/><ellipse cx="18" cy="32" rx="12" ry="5" fill="#c97a3c"/><path d="M32 50V36a12 5 0 0 1 24 0v14a12 5 0 0 1-24 0z" fill="#8a4b20"/><ellipse cx="44" cy="36" rx="12" ry="5" fill="#b86b30"/>`),
    coconut: S(`<path d="M6 34a26 22 0 0 0 52 0z" fill="#7a4a24"/><path d="M12 34c2-14 38-14 40 0z" fill="#fffdf5"/><g fill="#e6dccb" stroke="none"><circle cx="24" cy="28" r="2"/><circle cx="33" cy="25" r="2"/><circle cx="41" cy="29" r="2"/><circle cx="29" cy="31" r="1.6"/></g><path d="M16 42c6 4 26 4 32 0" stroke="#5a3418" stroke-width="2"/>`),
    pandan: S(`<path d="M32 58C30 40 14 26 8 10c12 8 22 22 24 48z" fill="#3fb52a"/><path d="M32 58c2-20 12-36 24-46-4 16-16 30-24 46z" fill="#2f9a1f"/><path d="M32 58c0-18 2-36 0-52 6 16 6 36 0 52z" fill="#5fd13a"/>`),
    bowl: S(`<path d="M5 28h54a27 24 0 0 1-54 0z" fill="#5fb0f0"/><path d="M11 28c5-9 37-9 42 0" fill="#9be06f"/><path d="M24 56h16"/><path d="M14 36a20 14 0 0 0 10 12" stroke="#fff" stroke-opacity=".7"/>`),
    dough: S(`<circle cx="32" cy="34" r="22" fill="#7ccf4a"/><path d="M32 34a9 9 0 0 1 14-7" fill="none"/><circle cx="39" cy="31" r="7" fill="#8a4b20"/><path d="M19 25a14 14 0 0 1 8-7" stroke="#fff" stroke-width="3"/>`),
    pot: S(`<path d="M10 22h44v20a10 10 0 0 1-10 10H20a10 10 0 0 1-10-10z" fill="#9aa8b8"/><path d="M5 22h54"/><path d="M14 30h36" stroke="#5fb0f0" stroke-width="4"/><circle cx="24" cy="14" r="3.5" fill="#dff1ff"/><circle cx="34" cy="8" r="3" fill="#dff1ff"/><circle cx="43" cy="14" r="2.5" fill="#dff1ff"/><path d="M24 62c-3-4 2-6 1-10 4 2 6 6 4 10M38 62c-3-4 2-6 1-10 4 2 6 6 4 10" fill="#ff8a1f" stroke="#e2443a" stroke-width="2"/>`),
    klepon: S(`<ellipse cx="32" cy="47" rx="28" ry="10" fill="#fff"/><path d="M8 44c8 6 40 6 48 0" stroke="#9ad3f0"/><circle cx="19" cy="38" r="10" fill="#5cbf3a"/><circle cx="45" cy="38" r="10" fill="#5cbf3a"/><circle cx="32" cy="28" r="10" fill="#6fd14a"/><g fill="#fff" stroke="none"><circle cx="16" cy="34" r="1.7"/><circle cx="22" cy="40" r="1.7"/><circle cx="42" cy="34" r="1.7"/><circle cx="48" cy="40" r="1.7"/><circle cx="29" cy="24" r="1.7"/><circle cx="35" cy="30" r="1.7"/><circle cx="33" cy="22" r="1.4"/></g>`),
    pan: S(`<path d="M44 34h16" stroke-width="7"/><circle cx="25" cy="34" r="19" fill="#556677"/><circle cx="25" cy="34" r="12" fill="#ffd34a" stroke-width="2"/><circle cx="25" cy="34" r="5" fill="#ff9a2f" stroke="none"/>`),
    cheese: S(`<path d="M6 44L42 18l16 10v22H6z" fill="#ffd34a"/><path d="M6 44h52"/><g fill="#f0b400" stroke="none"><circle cx="22" cy="49" r="3"/><circle cx="40" cy="38" r="3.5"/><circle cx="50" cy="48" r="2.5"/></g>`),
    chocolate: S(`<rect x="12" y="8" width="40" height="48" rx="4" fill="#7a3f1d"/><path d="M12 24h40M12 40h40M32 8v48" stroke="#5a2a10"/><path d="M17 13h10" stroke="#a8673c"/>`),

    /* World 4 — Better Together */
    talk: S(`<path d="M6 8h30a5 5 0 0 1 5 5v14a5 5 0 0 1-5 5H18l-8 7v-7H6a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z" fill="#e9f3ff"/><path d="M58 24H34a5 5 0 0 0-5 5v13a5 5 0 0 0 5 5h12l8 7v-7h4a5 5 0 0 0 5-5V29a5 5 0 0 0-5-5z" fill="#ffe0ec"/><path d="M44 38c-3-5-9 0-4 4l4 3 4-3c5-4-1-9-4-4z" fill="#e2445c" stroke-width="2"/><path d="M11 18h20M11 24h12" stroke-width="2.5"/>`),
    noTease: S(`<path d="M8 10h40a5 5 0 0 1 5 5v20a5 5 0 0 1-5 5H24l-10 9v-9H8a5 5 0 0 1-5-5V15a5 5 0 0 1 5-5z" fill="#fff3d6"/><text x="28" y="31" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="14" fill="#173a5e" stroke="none">HA HA</text><circle cx="44" cy="44" r="15" fill="#fff" stroke="#e2443a" stroke-width="4"/><path d="M34 54l20-20" stroke="#e2443a" stroke-width="4"/>`),
    support: S(`<circle cx="30" cy="30" r="22" fill="#e9f3ff"/><path d="M23 22a7 7 0 1 1 10 6c-3 2-3 3-3 6" stroke-width="4"/><circle cx="30" cy="42" r="2.4" fill="#173a5e" stroke="none"/><path d="M50 46c-3-5-9 0-4 4l4 3 4-3c5-4-1-9-4-4z" fill="#e2445c" stroke-width="2"/>`),
    laugh: S(`<circle cx="32" cy="32" r="25" fill="#ffd34a"/><path d="M19 25l7-3M45 25l-7-3"/><path d="M17 35h30a15 13 0 0 1-30 0z" fill="#7a2f2f"/><path d="M22 41h20" stroke="#ff8a8a"/>`),
    sunset: S(`<path d="M8 44a24 24 0 0 1 48 0z" fill="#ffb300"/><path d="M2 44h60"/><path d="M32 10v6M14 18l4 4M50 18l-4 4" stroke="#f39a1e"/><path d="M8 52h48M16 58h32" stroke="#e2443a" stroke-width="2.5"/>`),

    /* World 5 — Care for Our Place */
    binPlastic: bin('#ffcf3f', '<path d="M30 30h4v3l2 3v9h-8v-9l2-3z" fill="#5fb0f0" stroke-width="2"/>'),
    binPaper: bin('#4f97ef', '<path d="M27 30h10v15H27z" fill="#fff" stroke-width="2"/><path d="M29 35h6M29 39h6" stroke-width="1.6"/>'),
    binOrganic: bin('#3fb52a', '<path d="M32 46c-8-4-8-13 0-17 8 4 8 13 0 17z" fill="#7ccf4a" stroke-width="2"/><path d="M32 46V32" stroke-width="1.6"/>'),
    cup: S(`<path d="M16 16h32l-5 42H21z" fill="#e6f6ff"/><path d="M14 12h36v6H14z" fill="#9ad3f0"/><path d="M38 12l6-9" stroke-width="3.5"/><path d="M22 26l3 26" stroke="#fff" stroke-width="3"/>`),
    plasticBottle: S(`<path d="M27 4h10v8l5 6v38a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V18l5-6z" fill="#cfeeff"/><rect x="26" y="2" width="12" height="6" rx="2" fill="#3a8ee6"/><path d="M22 30h20v10H22z" fill="#5fb0f0"/><path d="M28 18l-3 8" stroke="#fff"/>`),
    wrapper: S(`<path d="M14 18h36v28H14z" fill="#ff7aa8"/><path d="M14 18l-8-6v40l8-6M50 18l8-6v40l-8-6" fill="#ff9cc0"/><path d="M22 28h20M22 36h14" stroke="#fff"/>`),
    paper: S(`<path d="M12 8h30l12 12v36H12z" fill="#fff"/><path d="M42 8v12h12" fill="#e9f3ff"/><path d="M19 28h26M19 36h26M19 44h18" stroke-width="2.5"/>`),
    box: S(`<path d="M8 22l24-10 24 10v28L32 60 8 50z" fill="#d9a066"/><path d="M8 22l24 10 24-10M32 32v28"/><path d="M20 17l24 10" stroke="#a87038"/>`),
    banana: S(`<path d="M10 14c6 30 22 42 44 40-18-6-30-20-34-40z" fill="#ffd34a"/><path d="M20 14l-4-6" stroke-width="4"/><path d="M28 40c-8-6-12-14-14-22" stroke="#e8a10c" stroke-width="2.5"/><path d="M54 54l4 2" stroke="#7a4a24" stroke-width="4"/>`),
    leaves: S(`<path d="M10 44c4-22 22-30 40-30-2 20-16 34-40 30z" fill="#c98a4b"/><path d="M10 44l30-22" stroke-width="2.5"/><path d="M22 54c8-16 22-20 34-18-4 14-16 22-34 18z" fill="#8bc34a"/>`),
    mess: S(`<path d="M2 54h60" stroke-width="2.5"/><path d="M8 54c2-10 10-12 14-8" fill="none"/><path d="M6 40h14v14H6z" fill="#fff" transform="rotate(-12 13 47)"/><path d="M36 30h7v4l3 4v16h-13V38l3-4z" fill="#cfeeff" transform="rotate(20 40 42)"/><path d="M20 52c4-10 12-12 16-6" fill="#ffd34a"/><path d="M46 46h12v8H46z" fill="#ff7aa8"/>`),
    broom: S(`<path d="M44 4L28 36" stroke-width="5" stroke="#173a5e"/><path d="M44 4L28 36" stroke-width="2" stroke="#c98a4b"/><path d="M24 32l12 6-6 22H8z" fill="#ffcf3f"/><path d="M14 58l8-16M22 59l6-15" stroke-width="2"/>`),
    fire: S(`<path d="M32 4c4 12 16 16 16 32a16 16 0 0 1-32 0c0-8 4-12 6-16 2 6 6 8 6 8 0-10 0-16 4-24z" fill="#ff8a1f"/><path d="M32 30c3 6 8 8 8 14a8 8 0 0 1-16 0c0-5 4-8 8-14z" fill="#ffd34a" stroke-width="2"/>`),
    river: S(`<path d="M2 30q8-6 16 0t16 0 16 0 14 0v30H2z" fill="#5fb0f0"/><path d="M8 44q6-4 12 0M34 50q6-4 12 0" stroke="#fff" stroke-width="2.5"/><path d="M38 12h8v4l3 3v14h-14V19l3-3z" fill="#cfeeff" transform="rotate(30 42 24)"/>`),

    /* World 6 — Ready for Real Life */
    calm: S(`<circle cx="27" cy="32" r="21" fill="#ffe0b8"/><path d="M18 30q3 3 6 0M30 30q3 3 6 0"/><path d="M22 40q5 3 10 0"/><path d="M52 22q7 4 0 9M54 35q7 4 0 9" stroke="#5fb0f0"/>`),
    protect: S(`<path d="M16 60c0-16 32-16 32 0z" fill="#2f78d6"/><circle cx="32" cy="28" r="12" fill="#ffd6a8"/><path d="M14 30c0-18 36-18 36 0" fill="none" stroke-width="7"/><path d="M14 30c0-18 36-18 36 0" fill="none" stroke="#f39a1e" stroke-width="3.5"/><path d="M27 30h2M35 30h2"/>`),
    window: S(`<rect x="10" y="6" width="44" height="50" rx="3" fill="#bfe6ff"/><path d="M32 6v50M10 31h44"/><path d="M41 12l-4 8 6 4-5 6" stroke="#e2443a" stroke-width="2.5"/><path d="M15 12l6-4M15 37l7-5" stroke="#fff" stroke-width="2.5"/>`),
    field: S(`<path d="M2 48q30-10 60 0v12H2z" fill="#7ccf4a"/><path d="M20 48V10"/><path d="M20 10h26l-6 7 6 7H20z" fill="#3fb52a"/><g fill="#2f78d6"><circle cx="38" cy="44" r="4"/><circle cx="48" cy="45" r="4"/></g>`),
    megaphone: S(`<path d="M8 25h10l24-13v38L18 37H8z" fill="#f39a1e"/><path d="M12 37l4 15h8l-4-15"/><path d="M48 23q6 8 0 16M53 17q10 14 0 28" stroke="#2f78d6"/>`),
    lift: S(`<rect x="10" y="6" width="44" height="52" rx="3" fill="#cfd8e3"/><path d="M32 16v42"/><rect x="10" y="6" width="44" height="10" fill="#9aa8b8"/><path d="M22 13l4-4 4 4M34 9l4 4 4-4" stroke-width="2"/>`),
    run: S(`<circle cx="40" cy="10" r="6" fill="#ffd6a8"/><path d="M38 18L30 36l10 8 4 14M30 36l-8 22M34 24l12 6M34 24l-12 2" stroke-width="5"/><path d="M4 30h10M2 40h12" stroke="#9aa8b8"/>`),
    cupboard: S(`<rect x="14" y="4" width="36" height="56" rx="3" fill="#c98a4b"/><path d="M32 4v56M14 32h36"/><path d="M28 18v4M36 18v4" stroke-width="4"/><path d="M50 10l6-2M50 20l7 0" stroke="#e2443a" stroke-width="2.5"/>`),
    bag: S(`<path d="M18 16a14 10 0 0 1 28 0" fill="none" stroke-width="4"/><rect x="10" y="16" width="44" height="42" rx="8" fill="#e2443a"/><rect x="18" y="38" width="28" height="14" rx="3" fill="#c22f27"/><path d="M32 24v12M26 30h12" stroke="#fff" stroke-width="4"/>`)
  };
})();
