/* ALPHABET ANIMAL RESCUE! — mission data
 * mode: find | echo | spell | who | trail | xspot | boss
 * Each world: one mission per letter (the last letter is the Boss Rescue)
 * plus an Alphabet Trail mission. The Boss unlocks when every other mission
 * in the world is complete; finishing the Boss unlocks the next world.
 */
window.AAR = window.AAR || {};

AAR.MODES = {
  find:  { title: 'FIND ME!',       icon: 'ui/search.png',     learn: 'Initial letter sounds' },
  echo:  { title: 'ANIMAL ECHO',    icon: 'ui/binoculars.png', learn: 'Listening to animal names' },
  spell: { title: 'LETTER CATCH',   icon: 'ui/chest.png',      learn: 'Spelling animal names' },
  who:   { title: 'WHO AM I?',      icon: 'ui/compass.png',    learn: 'Reading descriptive clues' },
  trail: { title: 'ALPHABET TRAIL', icon: 'ui/map.png',        learn: 'Alphabet order' },
  xspot: { title: 'LETTER SPOTTER', icon: 'ui/search.png',     learn: 'Finding a letter inside a word' },
  boss:  { title: 'RESCUE MISSION', icon: 'ui/achievement.png', learn: 'Listen, letter, spell and read' }
};

AAR.MISSIONS = [
  // World 1 — Green Forest (A–E)
  { id: 'a', world: 0, letter: 'A', mode: 'find' },
  { id: 'b', world: 0, letter: 'B', mode: 'echo' },
  { id: 'c', world: 0, letter: 'C', mode: 'spell' },
  { id: 'd', world: 0, letter: 'D', mode: 'who' },
  { id: 'trail-1', world: 0, mode: 'trail' },
  { id: 'e', world: 0, letter: 'E', mode: 'boss' },
  // World 2 — Blue Ocean (F–J)
  { id: 'f', world: 1, letter: 'F', mode: 'who' },
  { id: 'g', world: 1, letter: 'G', mode: 'find' },
  { id: 'h', world: 1, letter: 'H', mode: 'echo' },
  { id: 'i', world: 1, letter: 'I', mode: 'spell' },
  { id: 'trail-2', world: 1, mode: 'trail' },
  { id: 'j', world: 1, letter: 'J', mode: 'boss' },
  // World 3 — Wild Jungle (K–P)
  { id: 'k', world: 2, letter: 'K', mode: 'find' },
  { id: 'l', world: 2, letter: 'L', mode: 'echo' },
  { id: 'm', world: 2, letter: 'M', mode: 'who' },
  { id: 'n', world: 2, letter: 'N', mode: 'spell' },
  { id: 'o', world: 2, letter: 'O', mode: 'find' },
  { id: 'trail-3', world: 2, mode: 'trail' },
  { id: 'p', world: 2, letter: 'P', mode: 'boss' },
  // World 4 — Sunny Savanna (Q–U)
  { id: 'q', world: 3, letter: 'Q', mode: 'echo' },
  { id: 'r', world: 3, letter: 'R', mode: 'spell' },
  { id: 's', world: 3, letter: 'S', mode: 'find' },
  { id: 't', world: 3, letter: 'T', mode: 'who' },
  { id: 'trail-4', world: 3, mode: 'trail' },
  { id: 'u', world: 3, letter: 'U', mode: 'boss' },
  // World 5 — Frozen Land (V–Z)
  { id: 'v', world: 4, letter: 'V', mode: 'who' },
  { id: 'w', world: 4, letter: 'W', mode: 'echo' },
  { id: 'x', world: 4, letter: 'X', mode: 'xspot' },
  { id: 'y', world: 4, letter: 'Y', mode: 'spell' },
  { id: 'trail-5', world: 4, mode: 'trail' },
  { id: 'z', world: 4, letter: 'Z', mode: 'boss' }
];

/* Phase settings: these change real difficulty, not just labels. */
AAR.PHASES = {
  B: {
    id: 'B', title: 'YOUNG EXPLORER', grades: 'Grades 3–4', cefr: 'Pre-A1–A1',
    focus: ['Recognising letters', 'Matching letters with animals', 'Listening to animal names', 'Short-word spelling', 'Picture identification'],
    findCount: 3,          // animals in the Find Me scene
    findLabels: true,      // names shown under animals
    findSaysName: true,    // prompt audio also says the animal name
    echoCount: 3,
    whoCount: 3, whoPictures: true, whoReadAloud: true,
    spellDistractors: 0, spellFirstLetter: true, spellAutoSay: true, spellHints: 9, spellHintCap: 2,
    trailGuide: true,
    reviewPool: 'familiar' // review rounds prefer short, familiar animals
  },
  C: {
    id: 'C', title: 'WILDLIFE EXPERT', grades: 'Grades 5–6', cefr: 'A1–A2',
    focus: ['Longer animal vocabulary', 'Listening without written hints', 'Spelling from memory', 'Descriptive clues', 'Simple reading comprehension'],
    findCount: 5,
    findLabels: false,
    findSaysName: false,
    echoCount: 4,
    whoCount: 4, whoPictures: false, whoReadAloud: false,
    spellDistractors: 3, spellFirstLetter: false, spellAutoSay: false, spellHints: 1, spellHintCap: 1,
    trailGuide: false,
    reviewPool: 'any'
  }
};

/* Short, familiar animal names used first for Phase B review rounds. */
AAR.FAMILIAR = ['A', 'B', 'C', 'D', 'F', 'H', 'L', 'M', 'R', 'S', 'T', 'Y', 'W', 'Z', 'E', 'G', 'P', 'O'];

AAR.ACHIEVEMENTS = [
  { id: 'first',  title: 'FIRST RESCUE',    desc: 'Rescue your first animal.',        img: 'ui/star.png' },
  { id: 'listen', title: 'SUPER LISTENER',  desc: 'Complete five listening challenges.', img: 'ui/binoculars.png' },
  { id: 'spell',  title: 'SPELLING STAR',   desc: 'Spell five animal names correctly.', img: 'ui/chest.png' },
  { id: 'forest', title: 'FOREST HERO',     desc: 'Complete the Green Forest.',       img: 'rewards/badge-forest.png' },
  { id: 'master', title: 'ALPHABET MASTER', desc: 'Rescue all 26 letters.',           img: 'rewards/crown.png' }
];
