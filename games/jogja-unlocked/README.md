# JOGJA UNLOCKED: The Travel Agent Challenge
ENGLISH YO! original educational game. **Prototype v0.2: Missions 1–5** (all five destination missions, plus the optional Learn Before You Play lesson).

## Run locally
No build step. Open `index.html` directly, or serve the folder:

    # run from the ENGLISH YO! site root so the logo and Games link resolve:
    python3 -m http.server 8000   # then open http://localhost:8000/games/jogja-unlocked/

## Files
- `index.html`, `css/style.css`
- `js/content.js` passages, questions, mission, scoring constants (edit content here)
- `js/state.js` localStorage save/load/reset (key `englishyo.jogjaUnlocked.v1`)
- `js/app.js` screens, interactions, scoring
- `assets/background|destinations|characters|ui/` the **untouched originals** (not loaded by the game; safe to leave out when deploying)
- `assets/derived/` optimized WebP sprites actually used by the game

## Footer: About · Sources · Developer, and the logo
- Text for the Sources and Developer panels, the logo path and the Games link are in `js/info-content.js`.
- The ENGLISH YO! logo is the site's existing `assets/logo-approved.png` (loaded as `../../assets/logo-approved.png`, not copied). Clicking it goes to `../../games.html` (the site's Games page). If the logo file is missing, the text "ENGLISH YO!" is shown instead.
- Progress is saved automatically, so leaving never erases it. A "Leave to the Games page?" confirmation appears only while a mission is in progress or when saving is turned off in the browser.
- Tourism sources: the project did not record specific websites for the place texts, so none are cited. Add real ones to `SOURCES.tourism.used` in `info-content.js` once you verify them.
- Opening the game folder alone (without the site around it) will not find the logo or `games.html`.

## Learn Before You Play (pre-game lesson)
Entry points: title screen button, Mission 1 brief screen, Menu ("Learn: Descriptive Text"), map and recommendation screens ("Review lesson").
Eight freely navigable steps (goals, discover, structure, language toolkit, reading detective skills, Prambanan text + 3 questions, Sophia practice, ready).
- Teachers edit everything in `js/learn-content.js` (CP/TP/IKTP wording, passages, questions, answer keys, feedback). UI is in `js/learn.js`, styles in `css/learn.css`.
- Lesson progress is stored separately in `state.learn`; the optional lesson score (first-try correct, 12 items) never changes mission coins, stars, rank or stamps.
- Answer keys exist only in JS; the page shows no correct/incorrect marks until the student presses Check. Wrong answers can be retried.
- Reset all progress also clears lesson progress.
- The lesson's Prambanan model text (from the brief) is separate from the shorter Prambanan text used in Mission 1.

## Missions 1–5
| # | Traveler | Compare | Best place | Skills practised |
|---|----------|---------|-----------|------------------|
| 1 | Emma (history lover) | Prambanan vs Malioboro | Prambanan | detail, comparison, evidence |
| 2 | Arthur (culture seeker) | Keraton vs Malioboro | Keraton | main idea, comparison, evidence |
| 3 | Mia (photographer) | Taman Sari vs Prambanan | Taman Sari | detail, vocabulary in context, inference |
| 4 | The Miller family | Parangtritis vs Taman Sari | Parangtritis | text structure (Identification), safe visitor choices, evidence |
| 5 | Leo (backpacker) | Merapi/Kaliurang vs Parangtritis | Merapi/Kaliurang | descriptive vocabulary, comparison, applying an inference |
- Missions unlock in order (finish one to open the next). Menu > Choose mission replays any unlocked mission.
- Each mission uses the same scoring (max 7 points, 1–3 stars, coins = 10/point + 10). Replays only add what beats your best. Total possible: 15 stars (rank Jogja Expert at 14).
- Each completed mission adds a passport stamp (5 stamps; Malioboro is a "wrong answer" place and has no mission of its own, so it has no stamp). New stamps are `assets/derived/ui/stamp_*.webp`, made from the destination art (script not delivered).
- Content for Missions 2–5 and the four new place texts: `js/missions-content.js` (Mission 1: `js/content.js`). Passages are 104–125 words. They state no prices, hours or travel times. A teacher should still read each text once and check facts before class.

## Academic revision of Missions 2–5 (2026-11-17)
Files changed: `js/missions-content.js`, `js/info-content.js`, `js/app.js` (one sentence in the Sources panel), `README.md`. Mission 1, scoring, saving, IDs (`m2`–`m5`, `t1`–`t3`, `r1`–`r4`) and the 5 stamps are unchanged.
- **M2 Task 3** now asks for evidence for BOTH of Arthur's interests (Javanese culture and royal history). Options unchanged and checked as verbatim quotations.
- **M3 Task 3** replaced by an inference question (why Taman Sari suits Mia better). Taman Sari text: "round stairs" became "a circular underground building with stairs" so it matches descriptions of Sumur Gumuling as a circular underground mosque.
- **M4**: Parangtritis paragraph 3 rewritten (waves and currents can be very strong; visitors should not swim; follow warning signs and safety officers). Task 1 now tests Identification vs Description. Task 2 and Task 3 wording and feedback updated, reason `r3` rewritten, and the wrong reason `r4` is now a "swim all day" distractor with feedback that says swimming is not recommended.
- **M5 Task 3** replaced: Leo's viewpoint is in a restricted area, so the agent should check official updates and choose a permitted area. Success message no longer implies every Merapi location is open.

| Mission | Task 1 | Task 2 | Task 3 | Destination / reason |
|---|---|---|---|---|
| M2 | c | b | d | keraton / r3 |
| M3 | a | d | b | tamansari / r1 |
| M4 | c | b | a | parangtritis / r3 |
| M5 | b | d | c | merapi / r2 |

Coverage after revision: main idea (M2 T1), explicit detail (M3 T1), comparison (M2 T2, M5 T2), best evidence (M2 T3, M4 T3), adjectives/contextual vocabulary (M3 T2, M5 T1), inference (M3 T3, M5 T3), Identification vs Description (M4 T1), destination plus reason (all missions).
Simple present and descriptive expressions are practised in Learn Before You Play, not assessed in the missions. Follow-up idea: short non-scored highlights of these in the reading desk. The current reading desk has no such highlight feature, so none was added.

Official references (listed in the Sources panel as pages for checking facts): the Yogyakarta Tourism Portal Parangtritis article, the Keraton Yogyakarta Tamansari page and the BPPTKG portal. In the session that made this revision these three exact URLs could NOT be opened (the tool refused them), so their wording was not verified directly. The safety advice was cross-checked only against search-result excerpts from other sources (Indonesia.Travel on strong Parangtritis waves and currents, an Antara report on drownings there, Sonobudoyo (Pemda DIY) and a detik.com article quoting kratonjogja.id on Sumur Gumuling, and a news report that BPPTKG asks the public to follow its official information about Merapi). A teacher should open the three pages and confirm before class. Volcano status changes, so the game states no alert level, distance, closure or opening hours.

## Mission 1 flow
Title -> choose agent (female / hijab / male) + nickname -> manager intro -> Emma arrives -> mission card -> map -> Research Desk
(read both texts, 3 tasks) -> recommendation (place + strongest reason, retry allowed) -> Emma's reaction -> rewards -> end screen.
The reading tasks gate the recommendation and feed a "research notes" list shown while deciding.

## Scoring (shown to the player on the reward card)
Tasks: 1 point each (3). Best place: 2 points first try, 1 after a retry. Strongest reason: same. Max 7.
Stars: 6+ = 3, 4+ = 2, else 1. Coins: 10 per point + 10. Rereading is unlimited and never costs points.
Replays only add what beats the personal best (no farming). Ranks: Intern 0, Junior Agent 2, Consultant 5, Senior 9, Expert 14 stars.

## Fact check (passages)
Verified against public sources on 2026-11-16: Prambanan is a 9th-century Hindu temple complex dedicated to Shiva, Vishnu and Brahma;
the Shiva temple is about 47 m tall; Ramayana reliefs; UNESCO World Heritage Site (1991). Malioboro: main shopping street, batik and
souvenirs, gudeg (young jackfruit), becak and andong, street musicians in the evening, near Tugu station.
No prices, opening hours, travel times or safety claims are made. Passage lengths: Prambanan 125 words, Malioboro 122 words.
A teacher should still read both passages once before classroom use.

## Asset report
Used (all converted to WebP, transparent edges cleaned): map background, Prambanan + Malioboro illustrations (other 4 destination
illustrations are optimized in `derived/` but not shown yet), agent sprites (Sari, Aisyah, Raka), tourist sprites (Emma, Pak Wijaya, mystery silhouette), UI sprites
(passport, Prambanan stamp, coin, star, smiley, round pin, iso pin, Start/Read/Choose/Submit/Next buttons).
Not yet used: chest, trophy, badge, book, photo card, dialog panel, star bar and happiness bar (rebuilt in CSS), other tourist sprites.

### Known asset problems
1. Agent art: Sari, Aisyah and Raka are the supplied 3D PNGs (`assets/characters/agent-*.png` originals, `assets/derived/characters/agent-*.webp` used by the game, ~37 KB each). The earlier vector placeholders were removed. Agent ids (`f`, `fh`, `m`) are unchanged so older saves still work.
2. The sheets had near-transparent noisy halos (alpha 1-4 across the background). They were cleaned (alpha<24 -> 0, ramp to 255 by 200) in the derivatives only.
3. Pak Wijaya (manager) reuses the elderly batik tourist sprite. Dialogue panel sprite was not used (it stretches badly); a CSS bubble matches its look.
4. Button sprites contain baked-in English text (Start, Read, Choose, Submit, Next); each has an `aria-label` for screen readers.

## Tests run (headless Chrome, desktop 1366x800 and phone 390x780)
Full playthrough incl. wrong-answer paths: pass. No console errors / failed requests: pass. Save, reload+Continue, reset: pass.
Double-scoring guard and replay-best logic: pass. All three agent types selectable: pass. Not tested: real touch devices, screen readers, Safari/Firefox.

## Next priorities
True/False and matching task types; sound; teacher view/export; more travelers.
