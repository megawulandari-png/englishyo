/* ARGUE YO! — UI text, levels, characters, ranks, feedback.  Edit freely; no game logic here. */
(function (root) {
  var A = root.ARGUE = root.ARGUE || {};

  A.TITLE = 'ARGUE YO!';
  A.SUBTITLE = 'Hortatory Exposition Game';
  A.TAGLINE = 'Build Your Case. Make Your Point.';
  A.CREDIT = 'Developed by Mega Ayu Wulandari';
  A.BRAND = 'ENGLISH YO!';

  /* the three text parts (+ evidence). Colour is never the only signal: every part has a label + icon. */
  A.TYPES = {
    thesis:         { label: 'THESIS',         icon: '🎯', short: 'Issue + position',  desc: "Introduces the issue and the writer's position." },
    argument:       { label: 'ARGUMENT',       icon: '💬', short: 'A reason',          desc: "Gives a logical reason that supports the writer's position." },
    recommendation: { label: 'RECOMMENDATION', icon: '📣', short: 'What to do',        desc: 'Tells readers what they should or should not do.' },
    evidence:       { label: 'EVIDENCE',       icon: '🔎', short: 'Fact or example',   desc: 'A detail, fact or example that supports an argument.' }
  };

  A.CHARS = {
    arka:  { name: 'ARKA',  role: 'Friendly and curious',   img: 'assets/characters/arka.png' },
    nadia: { name: 'NADIA', role: 'Calm and well-read',     img: 'assets/characters/nadia.png' },
    dika:  { name: 'DIKA',  role: 'Tech-loving, asks questions', img: 'assets/characters/dika.png' },
    sinta: { name: 'SINTA', role: 'Energetic and confident', img: 'assets/characters/sinta.png' }
  };
  A.FACES = { happy: 'assets/expressions/arka-happy.png', think: 'assets/expressions/arka-thinking.png', wow: 'assets/expressions/arka-surprised.png',
              proud: 'assets/expressions/arka-confident.png', sad: 'assets/expressions/arka-sad.png' };

  A.LEVELS = [
    { n: 1, key: 'detective', name: 'TEXT DETECTIVE',     badge: 'assets/badges/b1.png', color: '#1f9d55', skill: 'Structure',
      goal: 'Find the THESIS, the ARGUMENTS and the RECOMMENDATION.',
      how: 'Read each fragment. Tap a button (or drag the fragment) to say if it is a THESIS, an ARGUMENT or a RECOMMENDATION.' },
    { n: 2, key: 'hunter',    name: 'ARGUMENT HUNTER',    badge: 'assets/badges/b2.png', color: '#2b7de0', skill: 'Relevant arguments',
      goal: 'Collect THREE strong arguments for the thesis.',
      how: 'Read the thesis. Tap the cards that give strong reasons. True information is not always a relevant argument!' },
    { n: 3, key: 'builder',   name: 'TEXT BUILDER',       badge: 'assets/badges/b3.png', color: '#d98a00', skill: 'Organisation + connectors',
      goal: 'Build the text: order it, add evidence, then add connectors.',
      how: 'Pick a block, then tap where it goes (or drag it). Three steps: arrange, add evidence, add connectors.' },
    { n: 4, key: 'challenge', name: 'ARGUMENT CHALLENGE', badge: 'assets/badges/b4.png', color: '#e0415f', skill: 'Counterarguments',
      goal: 'Answer your friends’ counterarguments.',
      how: 'Read what your friend says. Choose the response that answers the point directly and gives a reason.' },
    { n: 5, key: 'master',    name: 'MASTER PERSUADER',   badge: 'assets/badges/b5.png', color: '#8a4fe0', skill: 'Complete text',
      goal: 'Build a complete hortatory exposition, then read it.',
      how: 'Choose the best card for each part of the text. Then read your text and answer five questions.' }
  ];

  A.RANKS = [
    { min: 0,  name: 'BEGINNING THINKER' },
    { min: 50, name: 'CASE EXPLORER' },
    { min: 65, name: 'ARGUMENT BUILDER' },
    { min: 80, name: 'STRONG PERSUADER' },
    { min: 90, name: 'MASTER PERSUADER' }
  ];

  A.CATS = [
    { key: 'structure', label: 'Structure' },
    { key: 'arguments', label: 'Arguments' },
    { key: 'evidence',  label: 'Evidence' },
    { key: 'language',  label: 'Language' },
    { key: 'reading',   label: 'Reading' }
  ];

  /* explanations shown for each kind of weak card */
  A.KINDS = {
    irrelevant: { title: 'WEAK ARGUMENT', why: 'This statement may be true, but it does not support the thesis.' },
    opposite:   { title: 'OTHER SIDE', why: 'This idea supports the opposite position.' },
    vague:      { title: 'TOO GENERAL', why: 'This is too general. It does not give a clear reason.' },
    rec:        { title: 'THAT IS ADVICE', why: 'This tells readers what to do. An argument gives a reason.' },
    nopos:      { title: 'CHECK THE THESIS', why: "This gives information, but it does not show the writer's position." },
    thesisOpp:  { title: 'OTHER SIDE', why: 'This is the opposite position. The arguments in this case would not fit it.' },
    arg:        { title: 'NOT A RECOMMENDATION', why: 'This is a statement, not advice. A recommendation tells readers what to do.' },
    recIrr:     { title: 'DOES THIS FOLLOW FROM YOUR ARGUMENTS?', why: 'This is advice, but it does not follow from the reasons in the text.' },
    mismatch:   { title: 'DOES THIS SUPPORT YOUR IDEA?', why: 'This detail is true, but it supports a different argument.' },
    detail:     { title: 'DOES THIS SUPPORT YOUR IDEA?', why: 'This detail does not give evidence for the argument.' }
  };

  /* Level 1: hint about the REAL type, shown when the player picks the wrong box */
  A.TYPE_HINTS = {
    thesis: 'Look again. A thesis comes at the beginning. It introduces the issue and the writer’s position.',
    argument: 'Look again. An argument gives a reason. Words like First, Moreover and Furthermore often introduce one.',
    recommendation: 'Look again. A recommendation gives advice at the end. Therefore, should and must often appear.'
  };

  A.CONNECTOR_NOTES = {
    First: 'begins the first reason', Moreover: 'adds another reason', Furthermore: 'adds another reason', Besides: 'adds another reason',
    However: 'shows a contrast', Therefore: 'shows a result or a conclusion', So: 'shows a result', so: 'shows a result',
    because: 'gives a reason', Because: 'gives a reason', however: 'shows a contrast'
  };
  A.MODAL_NOTES = { should: 'gives advice', 'should not': 'advises against something', can: 'only shows a possibility', cannot: 'says something is not possible', must: 'shows a strong need' };
  A.CONNECTOR_WRONGS = {
    First: ['However', 'Therefore'], Moreover: ['However', 'So'], Furthermore: ['First', 'Because'],
    Besides: ['However', 'Therefore'], Therefore: ['First', 'However']
  };

  A.CONCEDE = ['Hmm, that is a good point.', 'I did not think about that.', 'OK, you made me think!', 'Fair enough. That makes sense.', 'Good answer. I can see your point.'];
  A.PRAISE = ['Nice work, Persuader!', 'You are building a strong case.', 'That is the way to think!', 'Great reasoning!'];

  A.COPY = {
    welcome: { title: 'Welcome, Young Persuader!', ask: "What's your name?", placeholder: 'Type your name...', button: 'START MY CASE' },
    learnDone: "GOT IT! LET'S PLAY"
  };

  A.LEARN = [
    { id: 'what', icon: '💡', title: 'WHAT IS IT?', color: '#2b7de0',
      big: 'A hortatory exposition is a text that tries to persuade readers that something should or should not be done.',
      list: [] },
    { id: 'structure', icon: '🧩', title: 'TEXT STRUCTURE', color: '#8a4fe0',
      parts: [
        { type: 'thesis', text: "Introduces the issue and the writer's position." },
        { type: 'argument', text: "Gives reasons that support the writer's position." },
        { type: 'recommendation', text: 'Tells readers what they should or should not do.' }
      ] },
    { id: 'language', icon: '🗣️', title: 'USEFUL LANGUAGE', color: '#e8710a',
      groups: [
        { head: 'Giving arguments', words: ['First', 'Moreover', 'Furthermore', 'Besides'] },
        { head: 'Contrast', words: ['However'] },
        { head: 'Cause', words: ['because', 'since'] },
        { head: 'Result', words: ['therefore', 'so'] },
        { head: 'Recommendation', words: ['should', 'should not', 'must', 'need to'] },
        { head: 'Also look for', words: ['Simple Present Tense', 'evaluative words: important, harmful, useful'] }
      ] },
    { id: 'example', icon: '📝', title: 'MINI EXAMPLE', color: '#1f9d55',
      ex: [
        { type: 'thesis', text: 'Students should bring reusable bottles to school.' },
        { type: 'argument', text: 'Plastic bottles create unnecessary waste. Moreover, reusable bottles can be used many times.' },
        { type: 'recommendation', text: 'Therefore, students should start bringing their own reusable bottles.' }
      ] }
  ];

  A.CPTP = {
    title: 'CAPAIAN PEMBELAJARAN & TUJUAN PEMBELAJARAN',
    cpHead: 'CAPAIAN PEMBELAJARAN — FASE F',
    cp: 'Pada akhir Fase F, peserta didik mampu menggunakan bahasa Inggris untuk memahami, menganalisis, dan merespons berbagai jenis teks lisan dan tulisan serta menyampaikan pandangan dan gagasan mengenai isu yang relevan.',
    focusHead: 'FOKUS GAME INI',
    focus: 'Peserta didik memahami dan menghasilkan Hortatory Exposition Text serta menyampaikan argumentasi secara logis dan persuasif.',
    tpHead: 'TUJUAN PEMBELAJARAN',
    tpIntro: 'After completing ARGUE YO!, students should be able to:',
    tp: [
      { t: 'Identify the social function of a hortatory exposition text.', lv: 'Learn · Level 1' },
      { t: 'Identify the generic structure: Thesis – Arguments – Recommendation.', lv: 'Level 1 · Level 3' },
      { t: 'Identify relevant language features, especially Simple Present Tense, modal verbs, connectors, and evaluative words.', lv: 'Learn · Level 3 · Reading' },
      { t: 'Distinguish relevant arguments and supporting details from irrelevant information.', lv: 'Level 2 · Level 5' },
      { t: 'Analyse how arguments support the writer’s position.', lv: 'Level 2 · Level 3 · Reading' },
      { t: 'Arrange ideas into a logical hortatory exposition.', lv: 'Level 3' },
      { t: 'Write/build a simple hortatory exposition about a relevant issue.', lv: 'Level 5' },
      { t: 'Present or express an opinion using clear, logical, and persuasive arguments.', lv: 'Level 4 · Level 5' }
    ],
    level: 'Fase F · Kelas XI · English A2–B1'
  };


  /* ---------- ENGLISH YO! welcome audio (reusable pattern for other games) ----------
     brand.file  = the shared ENGLISH YO! welcome recording (path is relative to this page). Replace the file or change the path freely.
     game.file   = OPTIONAL recording for the game introduction (null = the browser's English voice reads game.text).
     If brand.file is ever missing, brand.fallbackText is read by the browser voice. */
  A.AUDIO = {
    brand: { file: '../../assets/audio/english-yo-welcome.mp3',
             logo: '../../assets/logo-approved.png',
             fallbackText: 'Welcome to ENGLISH YO! Learn English, play, and grow. Are you ready? Let’s go!' },
    game:  { file: null,   /* no recording: the browser's English voice reads `text`. Set a path here only if a file really exists. */
             text: 'Welcome to ARGUE YO! Build your case, make your point, and become a great persuader!' },
    sessionFlag: 'argueyo.welcomeSeen'      /* sessionStorage: the welcome plays once per visit, not every time Home opens */
  };

  /* ---------- Final reflection + certificate ---------- */
  A.CERT = { requiredCases: 6 };            /* how many cases must be completed (all levels + final reading) before the certificate can unlock */
  A.REFLECT = {
    title: 'MY REFLECTION',
    intro: 'This is not a test. Think about your learning and answer honestly.',
    q1: 'WHAT DID YOU LEARN FROM THIS GAME?', q1hint: 'Choose one or more.',
    learned: [
      { key: 'structure', icon: '🧩', label: 'Understanding text structure' },
      { key: 'arguments', icon: '💬', label: 'Building arguments' },
      { key: 'evidence', icon: '🔎', label: 'Choosing supporting evidence' },
      { key: 'connectors', icon: '🔗', label: 'Using connectors' },
      { key: 'recommendation', icon: '📣', label: 'Giving recommendations' }
    ],
    q2: 'WHICH PART WAS MOST CHALLENGING FOR YOU?', q2hint: 'Choose one.',
    hardest: [
      { key: 'thesis', label: 'Thesis' }, { key: 'arguments', label: 'Arguments' }, { key: 'evidence', label: 'Evidence' },
      { key: 'connectors', label: 'Connectors' }, { key: 'recommendation', label: 'Recommendation' }, { key: 'reading', label: 'Final reading challenge' }
    ],
    q3: 'HOW CONFIDENT ARE YOU IN UNDERSTANDING AND WRITING A HORTATORY EXPOSITION NOW?',
    confidence: [
      { key: 'not-yet', label: 'Not yet', face: 'sad', level: 1 },
      { key: 'little', label: 'A little confident', face: 'think', level: 2 },
      { key: 'confident', label: 'Confident', face: 'proud', level: 3 },
      { key: 'very', label: 'Very confident', face: 'happy', level: 4 }
    ],
    q4: 'Complete the sentence:', q4stem: 'One thing I will remember is…', q4place: 'Write one idea in your own words…', minChars: 10, maxChars: 160,
    submit: 'SUBMIT REFLECTION',
    errors: {
      learned: 'Choose at least one thing you learned.', hardest: 'Choose the most challenging part.', confidence: 'Choose how confident you feel.',
      remember: 'Please write at least 10 letters. Use your own words.', meaningful: 'Please write a real idea, with two or more words.'
    }
  };

  A.HELP = [
    { icon: '👆', t: 'Tap or drag', d: 'Everything works with a tap. On a computer you can also drag cards. On a phone, tap a card and then tap where it goes.' },
    { icon: '🧱', t: 'Build the text', d: 'The TEXT BUILDER shows your text growing. TEXT POWER shows how far you are.' },
    { icon: '🧠', t: 'Think, do not rush', d: 'Accuracy and good reasoning matter more than speed. Mistakes are fine: read the feedback and try again.' },
    { icon: '🔊', t: 'Sound', d: 'Use the speaker buttons to turn sound or music on and off. Press LISTEN to hear a text.' }
  ];
})(window);
