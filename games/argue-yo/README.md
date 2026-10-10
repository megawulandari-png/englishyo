# ARGUE YO! — Hortatory Exposition Game

*Build Your Case. Make Your Point.*  
Developed by Mega Ayu Wulandari · ENGLISH YO!  
Target: Senior High School, Grade XI / Phase F · English A2–B1.

Self-contained HTML + CSS + JavaScript (no framework, no login, no server). Progress is saved in `localStorage` (key `argueyo.v1`).
Open `games/argue-yo/index.html` through any static web server (the page links back to `../../games.html`).

## Learning loop

`Home → PLAY → Case File → Level 1–5 → complete text → reading challenge → Case Closed → next case`

| Level | Name | What the student does | Score category |
|---|---|---|---|
| 1 | TEXT DETECTIVE | Classify 7 fragments as THESIS / ARGUMENT / RECOMMENDATION (position clue on the first 3 only) | Structure |
| 2 | ARGUMENT HUNTER | Collect 3 strong arguments from 8 cards (5 distractors: true-but-irrelevant, other side, too general, advice) | Arguments |
| 3 | TEXT BUILDER | (A) arrange blocks, (B) match evidence to arguments, (C) choose connectors / modal | Structure · Evidence · Language |
| 4 | ARGUMENT CHALLENGE | Answer 3 counterarguments from friends (4 plausible responses each) | Arguments |
| 5 | MASTER PERSUADER | Build the text slot by slot (8 parts), read it with/without structure hints, answer 5 of 7 reading questions | Structure · Arguments · Evidence · Reading |

Accuracy is counted on the **first try** of each item; wrong answers are explained and can be retried (no harsh penalty, no timer).
Persuasion Power = average of the five category accuracies. Ranks: BEGINNING THINKER < 50 ≤ CASE EXPLORER < 65 ≤ ARGUMENT BUILDER < 80 ≤ STRONG PERSUADER < 90 ≤ MASTER PERSUADER.
Cases unlock one after another; levels inside a case unlock in order. **Settings → Teacher mode** unlocks everything.

## Folder structure

```
games/argue-yo/
  index.html            page shell
  css/argue.css         all styles (tokens at the top)
  js/
    data-ui.js          UI text, level names, CP & TP, Learn cards, ranks, feedback wording
    cases/case1..6.js   ALL educational content (one file per case) — edit these
    compose.js          pure helpers that build the complete text from a case (also used by the audit)
    engine.js           utilities, storage/progress, audio (WebAudio synth), drag helper, confetti
    screens.js          menu, case select, case file, Learn, CP & TP, Scores, Settings, About
    levels.js           the five levels, complete-text view, reading challenge, results, Case Closed
    opening.js          ENGLISH YO! welcome opening (reusable pattern)
    certificate.js      My Reflection, certificate unlock, certificate canvas (preview / PNG / print)
    app.js              router + boot
  assets/               logo, characters, expressions, backgrounds, props, icons, badges (see below)
  tools/audit.js        content audit (run it after every content edit)
  tools/e2e-bot.js      end-to-end bot that plays the real UI
```

## Editing content (js/cases/caseN.js)

Each case is one object; the game builds Levels 1–5, the complete text and the reading challenge from it.
The header comment of `case1.js` explains the conventions. In short:

* `thesis.issue` + `thesis.position`, three `args` (`conn`, `claim`, `detail`, optional `gap`), `rec` (`lead`, `main` with `{{modal}}`, `extra`).
* `distract` (5 weak cards for Level 2, also reused in Level 5), `thesisAlt`, `detailAlt`, `recAlt` (wrong options for Levels 3 and 5).
* `debate` (3 counterarguments) and `reading` (7 questions, one of each type: purpose, main idea, inference, reference, evidence, summary, recommendation).
  In `debate.opts` and `reading.opts` the **first** option is the correct one — the game shuffles them.
* Target text length is 180–230 words, A2–B1.

Run the audit after any edit:

```bash
node games/argue-yo/tools/audit.js
```

It checks word count, readability, structure, the `{{gap}}` / `{{modal}}` tokens, answer keys, option-length cues, duplicates, quoted reference phrases and spelling, and exits with code 1 on any error.

To play the whole game automatically (useful after code changes), open the game in a browser console and run:

```js
eval(await (await fetch('tools/e2e-bot.js')).text());
await __bot.playCase(0, { wrong: true, drag: true }); __bot.log
```

## Assets

All art was cut from the supplied ARGUE YO! asset sheet (low resolution) and the logo. Buttons, cards, speech bubbles, feedback labels and the Text Builder are drawn in CSS, so
**any image can be replaced by a higher-resolution file with the same name and the game logic does not change**:
`assets/logo/argue-yo-logo.png`, `assets/characters/{arka,nadia,dika,sinta,council}.png`, `assets/expressions/arka-*.png`,
`assets/backgrounds/{school,classroom,library,park,cafeteria,hall}.png`, `assets/badges/b1..b5.png`, `assets/icons/*.png`, `assets/props/*.png` (transparent PNGs for characters/badges/icons).
The game card for the Games page is `assets/games/argue-yo-card.png` (1672×941).

## Audio

Sound effects and the optional background music are synthesised with the Web Audio API (no audio files, nothing autoplays; music is OFF by default).
The LISTEN buttons use the browser's speech synthesis (British/American English voice if available) and respect Settings → Read-aloud voice / Slow voice.

## Accessibility

Every text part has colour + label + icon (THESIS purple, ARGUMENT orange, RECOMMENDATION green); all interactions work by tap/click and drag-and-drop is optional
(mouse: drag the card; touch: tap a card then tap its place, or drag from the ⠿ handle); focus outlines, `aria-live` feedback, reduced-motion support, Large text setting for projectors.


## ENGLISH YO! welcome (opening)

`#/open` plays once per visit (sessionStorage `argueyo.welcomeSeen`), then goes to the name screen (first run) or the menu. Settings → **REPLAY ENGLISH YO! WELCOME** plays it again.
Flow: ENGLISH YO! logo → recorded welcome (`../../assets/audio/english-yo-welcome.mp3`, the shared ENGLISH YO! file; never overwritten) → ARGUE YO! logo reveal + game welcome → name → menu.
If the browser blocks autoplay, a **🔊 START WITH SOUND** button appears. The speaker button in the top bar mutes everything (effects, voices, welcome, music) and is saved.
All paths and the spoken fallback texts are in `js/data-ui.js` → `A.AUDIO`. To use a recorded game welcome, drop a file at `assets/audio/argue-yo-welcome.mp3`
(until then the browser's English voice reads `A.AUDIO.game.text`). To reuse the pattern in another game: copy `js/opening.js`, the `A.AUDIO` block, and the `audio` helpers in `engine.js`.

## Reflection and certificate

* Required learning sequence (one rule, `A.prog.canUnlockCertificate()` in `engine.js`): **all required cases completed** (every level + the final reading; `A.CERT.requiredCases`, default 6) **and the reflection submitted**. No minimum score.
* Results → MY REFLECTION (4 questions; sentence ≥ 10 letters, ≥ 2 words, max 160) → CERTIFICATE UNLOCKED → certificate (`#/certificate`).
* The certificate is **one canvas drawing** (1600×1100 design units, exported at 2×: 3200×2200 px). The preview, SAVE AS PNG and PRINT all use that same canvas, so they always match and contain only the certificate.
* Data comes from real play: category % = first-try correct ÷ first-try attempts across all completed cases; Persuasion Power = average of the five category %; rank from `A.RANKS`.
* Completion code `AY-<cases>C-<power>-<ID4>`; the 4-character ID is created once and kept. A signature detects edited certificate data (the student can then rebuild it from the real results).
* A better later result never replaces the certificate silently: MY CERTIFICATE offers **UPDATE CERTIFICATE WITH NEW SCORE** with a confirmation.
* Settings → Reset progress asks for confirmation and removes progress, scores, reflection, certificate and code (name and sound settings stay).
