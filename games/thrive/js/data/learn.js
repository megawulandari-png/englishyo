/* LEARN — interactive micro-learning content (rendered by js/screens/main.js → S.learn) */
window.THRIVE = window.THRIVE || {};
THRIVE.learn = {
  what: {
    text: 'A procedure text tells us how to do or make something step by step.',
    examples: [
      { title: 'How to take a screen break', obj: 'tablet', steps: ['First, look away from the screen.', 'Next, stand up.', 'Finally, drink some water.'] },
      { title: 'How to make wedang uwuh', obj: 'glass', steps: ['First, put the spices in a glass.', 'Next, pour hot water.', 'Finally, wait five minutes.'] },
      { title: 'How to welcome a new student', obj: 'pencilCase', steps: ['First, smile and say hello.', 'Next, tell them your name.', 'Finally, show them the classroom.'] }]
  },
  purpose: {
    text: 'To help someone do something correctly, safely, and clearly.',
    words: [
      { w: 'correctly', fb: 'Correctly: “Add two spoons of sugar,” not “Add some sugar.”' },
      { w: 'safely', fb: 'Safely: “Be careful. The water is hot.”' },
      { w: 'clearly', fb: 'Clearly: one action in each short step.' }]
  },
  structure: [
    { part: 'GOAL', q: 'What do you want to do?', ex: 'How to Take a Healthy Screen Break' },
    { part: 'MATERIALS / TOOLS', q: 'What do you need?', ex: 'a glass of water', optional: true },
    { part: 'STEPS', q: 'What should you do?', ex: 'First, look away from the screen. Next, stand up…' }],
  types: [
    { key: 'manual', name: 'How to Do / Manual', color: '#2f78d6', world: 2,
      desc: 'Instructions to use, fix or do something.',
      examples: ['How to Scan a QR Code Safely', 'How to Use a Classroom Device', 'How to Borrow a Library Book', 'How to Sort Waste', 'What to Do During an Earthquake'] },
    { key: 'recipe', name: 'Recipe', color: '#e07a1f', world: 3,
      desc: 'Instructions to make food or drinks. Here: Nusantara recipes.',
      examples: ['Klepon', 'Gado-Gado', 'Papeda', 'Wedang Uwuh', 'Pisang Epe'] },
    { key: 'social', name: 'Social / Well-being', color: '#d63e86', world: 4,
      desc: 'Instructions for kind communication and a healthy mind.',
      examples: ['How to Welcome a New Student', 'How to Be a Good Listener', 'How to Respect a Friend Who Is Fasting', 'How to Support a Nervous Friend', 'How to Calm Yourself Before a Test'] }],
  verbs: ['wash', 'check', 'mix', 'pour', 'open', 'close', 'add', 'stir', 'cut', 'use', 'listen', 'wait', 'help', 'respect'],
  practice: [
    { before: 'First,', after: 'your hands.', opts: ['wash', 'stir', 'scan'], answer: 'wash', fb: 'Wash your hands.' },
    { before: 'Next,', after: 'the link before you open it.', opts: ['pour', 'check', 'cut'], answer: 'check', fb: 'Check the link before you open it.' },
    { before: 'Then,', after: 'to your friend carefully.', opts: ['listen', 'mix', 'close'], answer: 'listen', fb: 'Listen to your friend carefully.' },
    { before: 'Finally,', after: 'the tea gently.', opts: ['stir', 'respect', 'wait'], answer: 'stir', fb: 'Stir the tea gently.' }],
  markers: ['first', 'next', 'then', 'after that', 'finally'],
  markerGame: [   // put in order using the markers as clues
    { m: 'Finally', t: 'drink some water.' }, { m: 'First', t: 'look away from the screen.' }, { m: 'Then', t: 'stretch your arms.' },
    { m: 'Next', t: 'stand up.' }, { m: 'After that', t: 'blink your eyes slowly.' }],
  adverbs: [
    { w: 'carefully', id: 'dengan hati-hati', ex: 'Pour the hot water carefully.' },
    { w: 'slowly', id: 'dengan perlahan', ex: 'Blink your eyes slowly.' },
    { w: 'gently', id: 'dengan lembut', ex: 'Stretch your arms gently.' },
    { w: 'quickly', id: 'dengan cepat', ex: 'Leave the building quickly and calmly.' }]
};
