/* Mission: How to Scan a QR Code Safely (World 2 · Think Before You Click)
 * Same data model as screen-break.js. Audio: narration + clip keys are explicit (see js/data/audio.js). */
window.THRIVE = window.THRIVE || {};
THRIVE.missions = THRIVE.missions || {};
THRIVE.missions['qr-code'] = {
  id: 'qr-code', world: 2, title: 'How to Scan a QR Code Safely', badge: 'Smart Clicker',
  intro: 'A poster at school says “Scan for free game coins!” Is it safe? Learn a smart procedure before you click.',
  completeNarration: ['w2-complete'],
  completeText: 'Smart choices begin with one simple step: think first. You checked, scanned and closed unsafe links like a pro.',
  goal: 'Use a QR code safely.',
  tools: [{ img: 'obj:phone', text: 'a phone or tablet with a camera' }],
  toolNote: 'You need only one tool: a device with a camera.',
  steps: [
    { id: 's1', marker: 'First', text: 'look at the QR code carefully.' },
    { id: 's2', marker: 'Next', text: 'check where it comes from.' },
    { id: 's3', marker: 'Then', text: 'scan it with your device.' },
    { id: 's4', marker: 'After that', text: 'check the link before you open it.' },
    { id: 's5', marker: 'Finally', text: 'close it if it looks unsafe.' }],
  markedSteps: [
    '{{First}}, [[look]] at the QR code ((carefully)).',
    '{{Next}}, [[check]] where it comes from.',
    '{{Then}}, [[scan]] it with your device.',
    '{{After that}}, [[check]] the link before you open it.',
    '{{Finally}}, [[close]] it if it looks unsafe.'],
  verbInfo: { look: 'melihat', check: 'memeriksa', scan: 'memindai', close: 'menutup', carefully: 'dengan teliti' },
  actions: {
    look: { img: 'svg:qr', label: 'look at the QR code' }, source: { img: 'svg:notice', label: 'check where it comes from' },
    scan: { img: 'svg:scan', label: 'scan it' }, link: { img: 'svg:linkSafe', label: 'check the link' },
    close: { img: 'asset:feedback/wrong.png', label: 'close it' }, share: { img: 'svg:share', label: 'share it with everyone' },
    password: { img: 'svg:key', label: 'type your password' }
  },
  stages: [
    { id: 'story', type: 'story', phase: 'observe', title: 'A Strange Poster', narration: ['w2-intro', 'w2-observe'], mood: 'think',
      scene: { main: 'svg:poster', tag: { img: 'svg:qr', text: 'Free coins?' } },
      cluePrompt: 'Tap each clue. Is this QR code safe?',
      symptoms: [{ t: 'a big prize', d: 'It says: “Scan for FREE game coins!”' }, { t: 'no school logo', d: 'You do not know who made it.' }, { t: 'a strange place', d: 'It is a sticker on the toilet door.' }],
      okMsg: 'Good eyes! Something is not right. Let’s learn a safe procedure.',
      align: { purpose: 'Notice warning signs before using a QR code.', skill: 'Reading – Viewing', competency: 'Understand the context and goal of a procedure', feature: 'Digital vocabulary (QR code, link, scan)' },
      dims: ['critical'] },

    { id: 'observe', type: 'observe', phase: 'observe', title: 'Read the Procedure', mood: 'ready',
      line: 'Now read a smart procedure. Find the goal, the tool and the steps.',
      prompt: 'Read the procedure. Then tap the 4 green action words.', need: 4,
      align: { purpose: 'Read a model procedure and find its parts.', skill: 'Reading – Viewing', competency: 'Identify the goal, tools and steps', feature: 'Imperative verbs, sequence markers, adverb (carefully)', label: 'Observe the Procedure' },
      dims: ['independence'] },

    { id: 'listen', type: 'listenDo', phase: 'understand', title: 'Listen & Do', narration: ['w2-understand'], mood: 'ready',
      prompt: 'Play the audio. Tap the actions in the order you hear them. Be careful: some actions are not in the audio.', clip: ['w2-do-01', 'w2-do-02', 'w2-do-03', 'w2-do-04', 'w2-do-05'],
      tiles: ['look', 'share', 'source', 'scan', 'password', 'link', 'close'], answer: ['look', 'source', 'scan', 'link', 'close'],
      align: { purpose: 'Follow spoken instructions in the correct order.', skill: 'Listening', competency: 'Follow oral instructions', feature: 'Imperative verbs' },
      dims: ['communication'] },

    { id: 'links', type: 'safeUnsafe', phase: 'understand', title: 'Link Check', mood: 'think', kind: 'link',
      line: 'Look at each link before you open it. Does it look safe?',
      prompt: 'Read each link. Is it safe to open?', labels: ['Safe to open', 'Do not open'],
      cards: [
        { text: 'https://smpn15yk.sch.id/library', safe: true, why: 'It is our school website. It starts with https.' },
        { text: 'free-coins-game.xyz/claim-now', safe: false, why: 'Free prizes and strange addresses are warning signs.' },
        { text: 'login-verify-your-account.com', safe: false, why: 'It asks for your password. Never type your password here.' },
        { text: 'https://smpn15yk.sch.id/schedule', safe: true, why: 'It is the school website, and a teacher shared it.' },
        { text: 'bit.ly/3xYz9 (from an unknown sticker)', safe: false, why: 'You cannot see where a short link goes. Ask a teacher first.' }],
      okMsg: 'Smart choices begin with one simple step: think first.',
      align: { purpose: 'Decide whether a link is safe to open.', skill: 'Reading – Viewing', competency: 'Evaluate instructions and information', feature: 'Digital safety vocabulary (link, safe, unsafe)' },
      dims: ['critical', 'independence'] },

    { id: 'fix', type: 'fixSteps', phase: 'fix', title: 'Fix the Steps', narration: ['w2-fix'], mood: 'think',
      prompt: 'Tap the steps in the correct order. The sequence markers are your clues.', order: ['s1', 's2', 's3', 's4', 's5'],
      align: { purpose: 'Put mixed-up steps in a logical order.', skill: 'Reading', competency: 'Arrange steps logically', feature: 'Sequence markers' },
      dims: ['critical'] },

    { id: 'error', type: 'instructionError', phase: 'fix', title: 'Instruction Error', mood: 'think',
      line: 'Two instructions have a grammar mistake. Find them and fix them.',
      prompt: 'Tap the sentence with a mistake. Then choose the correct sentence.',
      rounds: [
        { lines: ['Look at the QR code carefully.', 'Scans it with your device.', 'Close it if it looks unsafe.'], wrong: 1,
          options: [{ t: 'Scan it with your device.', ok: true }, { t: 'Scanning it with your device.', ok: false }, { t: 'Scanned it with your device.', ok: false }],
          rule: 'An instruction starts with the base verb: Scan it.' },
        { lines: ['Check where it comes from.', 'Checks the link before you open it.', 'Close it if it looks unsafe.'], wrong: 1,
          options: [{ t: 'Checking the link before you open it.', ok: false }, { t: 'Check the link before you open it.', ok: true }, { t: 'Checked the link before you open it.', ok: false }],
          rule: 'Use the base verb for instructions: Check the link.' }],
      align: { purpose: 'Find and correct grammar mistakes in instructions.', skill: 'Writing', competency: 'Detect and correct incorrect instructions', feature: 'Imperative = base verb (not -s / -ing / -ed)' },
      dims: ['communication'] },

    { id: 'scan', type: 'scanSim', phase: 'do', title: 'Scan Simulator', mood: 'ready',
      line: 'Let’s practise! Check each poster, scan it, then decide: open or close?',
      prompt: 'For each poster: check where it comes from, scan it, then choose OPEN or CLOSE.',
      posters: [
        { title: 'Library opening hours', from: 'School notice board · signed by the librarian', link: 'https://smpn15yk.sch.id/library', safe: true,
          why: 'It comes from the school and the link is the school website.' },
        { title: 'WIN A FREE PHONE!', from: 'Unknown sticker at the bus stop', link: 'free-phone-win.xyz/login', safe: false,
          why: 'Unknown place, a big prize and a strange link. Close it.' },
        { title: 'Class 8 English quiz', from: 'Your English teacher, in class', link: 'https://smpn15yk.sch.id/quiz-8', safe: true,
          why: 'Your teacher shared it and it is the school website.' }],
      okMsg: 'You checked, scanned and decided wisely. That is independence!',
      align: { purpose: 'Carry out the procedure in realistic situations.', skill: 'Reading', competency: 'Follow a procedure and make decisions', feature: 'Imperatives: check, scan, open, close' },
      dims: ['independence', 'critical'] },

    { id: 'decide1', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think', clip: 'sit-w2-message',
      line: 'A message arrives. What would you do?',
      situation: 'A message from an unknown number says: “Scan this QR code to get free data!” What do you do?',
      options: [
        { text: 'Scan it quickly before the offer ends.', best: false, fb: 'Quick clicks can be dangerous. Think first.' },
        { text: 'Do not scan it. Tell a parent or teacher about the message.', best: true, fb: 'Smart choice. Asking an adult is a good habit.' },
        { text: 'Send it to all my friends.', best: false, fb: 'Your friends can be in danger too.' }],
      align: { purpose: 'Apply the procedure to an unsafe message.', skill: 'Reading / Listening', competency: 'Make a responsible choice using the procedure', feature: 'Imperatives in a real context (Do not…, Tell…)' },
      dims: ['independence', 'communication'] },

    { id: 'decide2', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think',
      line: 'Your friend needs a smart tip. What do you say?',
      situation: 'Your friend wants to scan a QR code on a strange sticker. What do you say?',
      options: [
        { text: '“Wait! Let’s check where it comes from first.”', best: true, fb: 'Great teamwork. You help your friend think before they click.' },
        { text: '“Scan it! It looks fun.”', best: false, fb: 'Fun can hide danger. Check first.' },
        { text: 'Say nothing and walk away.', best: false, fb: 'A short, kind tip can protect your friend.' }],
      align: { purpose: 'Give a friend a safety instruction kindly.', skill: 'Reading / Speaking', competency: 'Use instructions politely with others', feature: 'Let’s + base verb' },
      dims: ['collab', 'communication'] },

    { id: 'build', type: 'build', phase: 'create', title: 'Build the Procedure', narration: ['w2-create'], mood: 'happy',
      prompt: 'Choose a goal, pick 3–5 steps in order, then add sequence markers.',
      goals: ['How to Scan a QR Code Safely', 'How to Win Free Coins Online', 'How to Share Every Link'], goalAnswer: 0,
      goalMsg: 'Check your goal. Does it help you stay safe online?', badStepMsg: 'One step is not safe. Remove it and try again.',
      bank: [
        { t: 'look at the QR code carefully.', ok: true }, { t: 'check where it comes from.', ok: true }, { t: 'scan it with your device.', ok: true },
        { t: 'check the link before you open it.', ok: true }, { t: 'close it if it looks unsafe.', ok: true }, { t: 'ask an adult if you are not sure.', ok: true },
        { t: 'type your password on the website.', ok: false }, { t: 'open every link quickly.', ok: false }],
      align: { purpose: 'Create your own short procedure.', skill: 'Writing', competency: 'Create a procedure text (goal + steps)', feature: 'Goal + imperative steps + sequence markers' },
      dims: ['creative'] },

    { id: 'present', type: 'present', phase: 'create', title: 'Tell Your Procedure', mood: 'happy',
      line: 'Show your procedure and read it aloud to a friend.',
      prompt: 'Listen to your procedure, then read it aloud yourself.',
      checks: ['I read every step aloud.', 'I used sequence markers.', 'I spoke clearly and calmly.'],
      align: { purpose: 'Present your procedure aloud.', skill: 'Speaking', competency: 'Present instructions orally', feature: 'Simple sentences with sequence markers' },
      dims: ['communication'] }
  ]
};
