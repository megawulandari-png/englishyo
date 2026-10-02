# THRIVE audio

All recorded clips live in this folder. **File names must be lower-case with a lower-case `.mp3` extension** (for example `w2-do-03.mp3`).
Windows/macOS ignore letter case, but web servers such as GitHub Pages do not: `W2-DO-03.MP3` would fail online.

How it works (see `js/data/audio.js`, the single manifest):
- every clip id → `{ src: 'file.mp3', text: 'what it says' }`
- the local file is played when it exists; browser speech synthesis (same `text`) is used only when the file is genuinely missing
- stages name their clips explicitly in `js/data/missions/*.js` (`narration: [...]` for the speech bubble, `clip: ...` for PLAY AUDIO / REPLAY / SLOW)

## Recorded (78 files)
`thrive-opening-01`, `thrive-opening-02`, `thrive-ready`, `ui-welcome`
`w1` … `w6`: `-intro`, `-observe`, `-understand`, `-fix`, `-do-01` … `-do-05`, `-create`, `-complete`
`final-intro`, `final-choose`, `final-goal`, `final-materials`, `final-steps`, `final-check`, `final-present`, `final-complete`

## Not recorded yet (speech synthesis is used)
- decision and tip clips: `tip-w1-safe`, `sit-w1-eyes`, `sit-w1-friend`, `sit-w2-message`, `sit-w3-papeda`, `sit-w4-lunch`, `sit-w5-cleanup`, `sit-w6-scared`
- world welcome lines: `w1-world` … `w6-world`
- single-word audio in Learn and Glossary

To add a recording: save it here with the clip id as the file name (e.g. `sit-w2-message.mp3`) and set that clip's `src` in `js/data/audio.js`.
