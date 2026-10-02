/* visual asset manifest — every image path lives here, so art can be swapped without touching the engine.
 * Sources (untouched) are in assets/source/; the slices are produced by assets/source/slice_*.py and make_scenes.py. */
window.THRIVE = window.THRIVE || {};
THRIVE.ASSET_BASE = 'assets/';
THRIVE.GAMES_URL = '../../games.html';   // ENGLISH YO! games page (same link as the footer “Back to ENGLISH YO! games”)
THRIVE.img = {
  map: 'worlds/world-map.webp', bg: 'scenes/bg-blur.webp', room: 'scenes/study-room.png',
  worlds: { 1: 'worlds/w1-care.png', 2: 'worlds/w2-click.png', 3: 'worlds/w3-nusantara.png', 4: 'worlds/w4-together.png', 5: 'worlds/w5-place.png', 6: 'worlds/w6-ready.png' },
  btn: { play: 'ui/btn-play.png', learn: 'ui/btn-learn.png', glossary: 'ui/btn-glossary.png', cp: 'ui/btn-cp.png',
    progress: 'ui/btn-progress.png', sound: 'ui/btn-sound.png', sources: 'ui/btn-sources.png', developer: 'ui/btn-developer.png' },
  round: { play: 'ui/round-play.png', replay: 'ui/round-replay.png', slow: 'ui/round-slow.png', sound: 'ui/round-sound.png', soundAlt: 'ui/round-sound-alt.png', mute: 'ui/round-mute.png' },
  brand: 'ui/englishyo-logo.png',          // resized copy of ../../assets/logo-approved.png
  ui: { lock: 'ui/lock.png', unlock: 'ui/unlock.png', panelCheck: 'ui/panel-checklist.png', panelWood: 'ui/panel-wood.png', bubble: 'ui/speech-bubble.png' },
  fb: { star: 'feedback/star.png', starGold: 'feedback/star-gold.png', sparkle: 'feedback/star-sparkle.png', wrong: 'feedback/wrong.png', idea: 'feedback/idea.png' },
  badge: { coin: 'badges/coin-leaf.png' },   // + one per dimension: badges/<key>.png
  obj: { laptop: 'objects/laptop.png', phone: 'objects/phone.png', tablet: 'objects/tablet.png', desk: 'objects/desk.png', chair: 'objects/chair.png',
    glass: 'objects/glass.png', bottle: 'objects/bottle.png', lunchbox: 'objects/lunchbox.png', plant: 'objects/plant.png', clock: 'objects/clock.png',
    notebook: 'objects/notebook.png', pencilCase: 'objects/pencil-case.png' }
};

/* animal mascots — any learner can choose any animal (not gender-based) */
THRIVE.mascots = [
  { key: 'tiger', name: 'Tiger', color: '#f27a1a' }, { key: 'rabbit', name: 'Rabbit', color: '#e8558f' },
  { key: 'cat', name: 'Cat', color: '#8b5cd6' }, { key: 'panda', name: 'Panda', color: '#2fa34a' },
  { key: 'fox', name: 'Fox', color: '#e0412f' }, { key: 'owl', name: 'Owl', color: '#2f78d6' },
  { key: 'turtle', name: 'Turtle', color: '#13a39a' }, { key: 'deer', name: 'Deer', color: '#e59a1c' }
];
THRIVE.mascotSrc = (key, state) => 'mascots/' + key + '-' + (state || 'ready') + '.png';   // state: ready | think | happy
