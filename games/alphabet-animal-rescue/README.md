# Alphabet Animal Rescue! — A–Z Wildlife Adventure

ENGLISH YO! game · Category: Alphabet & Animals · Phase B–C · Mobile • Desktop • Tablet • IFP
Developed by Mega Ayu Wulandari

Open `index.html`. It uses vanilla HTML/CSS/JS, needs no build step, no login and no backend. Progress is saved in `localStorage` (`aar-progress-v1`).

## Files

| Path | What it holds |
|---|---|
| `index.html` | Page shell |
| `style.css` | All styling, responsive rules, reduced-motion and print rules |
| `game.js` | State and storage, sound and speech, every screen and game mode |
| `data/animals.js` | A–Z vocabulary, Phase B and C clues, facts, real homes, Indonesian words, clue conflicts, worlds |
| `data/missions.js` | The 31 missions, modes, Phase B/C difficulty settings, achievements |
| `data/assets.js` | Central asset manifest, preloaded so the game keeps working offline |
| `assets/` | Sprites cut from the asset sheet: `logo/ rangers/ animals/ worlds/ ui/ letters/ rewards/ effects/` |

## Structure

- 5 worlds: A–E, F–J, K–P, Q–U, V–Z. Each world has one mission per letter, plus an Alphabet Trail.
  The world's last letter is the **Boss Rescue**, which has 4 rounds (Listen → First letter → Spell → Who am I?).
- The Boss Rescue opens once every other mission in its world is done. Winning it gives the world badge and opens the next world.
- Modes: Find Me!, Animal Echo, Letter Catch, Who Am I?, Alphabet Trail, Letter Spotter (X) and Rescue Mission.
- **X** is taught as the *last* letter of FOX ("Find the X in FOX"), never as the first letter.
- The worlds are adventure themes only. Each Animal Book card shows the animal's **real home**.

## Phase B vs Phase C

| | Phase B: Young Explorer | Phase C: Wildlife Expert |
|---|---|---|
| Find Me! | 3 animals, names shown, name spoken | 5 animals, no names, upper- or lowercase letter |
| Animal Echo | 3 pictures, first-letter hint after a mistake | 4 pictures, hint only after 2 mistakes |
| Who Am I? | Short clues read aloud, picture answers | Longer clues to read, word-only answers, 4 choices |
| Letter Catch | No extra letters, auto-check, unlimited hints | 2–3 extra letters, no auto-play of the word, 1 hint |
| Alphabet Trail | A–Z guide strip, "tap the letter you hear" | No guide, missing letter, before/after questions |

## Asset notes

- `worlds/*.jpg` are only about 120 px in the sheet. They were upscaled 4× and are used blurred, as backgrounds.
  A higher-resolution background art set would look sharper on large screens.
- The sheet labels the X slot as "Fish". That sprite is not used, because X is taught through FOX.
- The UI text buttons (START, CONTINUE…) have their words baked in, so the game builds CSS buttons in the same style instead (it needs labels such as "START ADVENTURE" and "HOW TO PLAY").
- Audio is synthesised: sound effects and ambience use Web Audio, and words use the device's SpeechSynthesis voice (British English when available).
  No recorded or native-speaker audio is included. If speech is unavailable or sound is off, the words are shown as text.

## Audio

- **Two separate systems:**
  - Words use recorded clips first (`data/audio.js` and `assets/audio/`), then the device's speech voice (`Voice` in `game.js`).
  - Sound effects and nature sounds use Web Audio (`Snd`).
- **Letters:** a letter is spoken once, from `AAR.LETTER_SPEECH` in `data/animals.js`, never from the "A a" tile text.
  A plain capital letter was checked with the macOS Daniel (en-GB) and Samantha (en-US) voices: A = /eɪ/, I = "eye", Z = "zed"/"zee".
- **Find Me:**
  - The instruction is "Find the animal that begins with the letter A."
  - LISTEN says only "A."
  - REPLAY AUDIO repeats the instruction.
  - A wrong tap says "Try again! Listen to the letter." and sets that animal aside.
  - The animal is named only after it is chosen: "Great job! Ant begins with A!"
- **No mode reveals the answer before the learner chooses it.** Wrong choices are dimmed, not the right one highlighted.
- **Voice choice:** the best voice stored on the device is picked automatically, preferring natural or female English voices: en-GB, then en-US, then others.
  Robotic and novelty voices are skipped.
  Online voices are used only if nothing better is installed, because a stalled online voice can block all speech in Chrome.
  Any English voice can be chosen in Settings.
  Speech settings: rate 0.9 (Normal), pitch 1.1, volume from the slider.
  Browsers cannot guarantee a female or child voice. For consistent quality, add recorded clips (see `data/audio.js`).
- **Chrome on Mac:** calling `speak()` then `cancel()` in the same instant jams speech for the rest of the session. Reproduced in Chrome 154.
  All speech goes through `Voice.rawSpeak` / `Voice.cancelSafe`, which never cancel within 40 ms of a speak.
- Audio unlocks on the first tap or key press (iOS needs this).
  If the voice never starts, the words are shown as captions.
- **Settings tools:** TEST SOUND, TEST EFFECTS, a voice chooser and a status line.

## Rangers

`assets/rangers/*.png` are the original high-resolution files. The game does not load them, and they are kept out of Git (see `.gitignore`).
The game uses `assets/rangers/web/*.png`: the same art trimmed to the character and resized to 1000 px tall, about 0.6 MB each instead of 6 MB.
If you replace an original, regenerate its web copy, or the old art keeps showing.

## Homepage branding

- **Logo:** the official ENGLISH YO! logo is the shared site file `../../assets/logo-approved.png`, used unaltered. It links to `../../index.html`, top-right on desktop and above the game logo on phones and tablets.
- **Footer:** shows only "ENGLISH YO! | (i) About Developer".
- **About Developer:** the developer details and the site's `assets/developer-mega.png` avatar appear only in this popup. It closes with the X, CLOSE or Escape, keeps keyboard focus inside while open, and returns focus to the button.

