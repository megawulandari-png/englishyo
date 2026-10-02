/* Mission: How to Take a Healthy Screen Break (World 1 · Take Care of Me)
 * Story: the player has studied on a screen for too long; the mascot notices tired eyes, a stiff body and low concentration.
 * Step markup:  {{marker}}  [[imperative verb]]  ((adverb))
 * Each stage: type (mechanic), phase (OBSERVE→UNDERSTAND→FIX→DO→CREATE), dims (Life Compass points),
 *   narration: EXPLICIT list of clip keys played (in order) when the stage opens — the bubble shows exactly their text.
 *     Mapping by phase: START → story [w1-intro, w1-observe] · first UNDERSTAND stage [w1-understand] · Fix the Steps [w1-fix]
 *     · Coach steps w1-do-01…05 (per step, see `steps[].clip`) · Build [w1-create] · mission end `completeNarration` [w1-complete].
 *   line: bubble text for stages without narration (no autoplay; the speaker button reads it with speech synthesis),
 *   align (teacher/judge metadata, shown only in the Curriculum Map, never during gameplay).
 * Images: 'obj:<key>' → assets/objects, 'mascot:<state>' → the player's mascot, 'icon:<name>' → inline SVG icon. */
window.THRIVE = window.THRIVE || {};
THRIVE.missions = THRIVE.missions || {};
THRIVE.missions['screen-break'] = {
  id: 'screen-break', world: 1, title: 'How to Take a Healthy Screen Break',
  completeNarration: ['w1-complete'], badge: 'Screen Break Hero',
  intro: 'You have studied on a screen for too long. Learn, follow and create a healthy screen-break procedure.',
  completeText: 'Small steps build healthy habits. You followed a procedure, fixed mistakes, made kind choices, and created your own.',
  goal: 'Take a short healthy break from the screen.',
  tools: [{ img: 'obj:glass', text: 'a glass of water' }],
  toolNote: 'Materials are not always required. This procedure needs only water.',
  steps: [
    { id: 's1', marker: 'First', text: 'look away from the screen.' },
    { id: 's2', marker: 'Next', text: 'stand up.' },
    { id: 's3', marker: 'Then', text: 'stretch your arms.' },
    { id: 's4', marker: 'After that', text: 'blink your eyes slowly.' },
    { id: 's5', marker: 'Finally', text: 'drink some water.' }],
  markedSteps: [
    '{{First}}, [[look]] away from the screen.',
    '{{Next}}, [[stand]] up.',
    '{{Then}}, [[stretch]] your arms.',
    '{{After that}}, [[blink]] your eyes ((slowly)).',
    '{{Finally}}, [[drink]] some water.'],
  verbInfo: { look: 'melihat', stand: 'berdiri', stretch: 'meregangkan', blink: 'berkedip', drink: 'minum', slowly: 'dengan perlahan' },
  /* actions used by Listen & Do and the Coach */
  actions: {
    look: { img: 'obj:plant', label: 'look away' }, stand: { img: 'obj:chair', label: 'stand up' },
    stretch: { img: 'mascot:happy', label: 'stretch your arms' }, blink: { img: 'icon:eye', label: 'blink slowly' },
    drink: { img: 'obj:glass', label: 'drink water' }, phone: { img: 'obj:phone', label: 'check messages' },
    snack: { img: 'obj:lunchbox', label: 'eat a snack' }, laptop: { img: 'obj:laptop', label: 'open the laptop' }
  },
  stages: [
    { id: 'story', type: 'story', phase: 'observe', title: 'Too Much Screen Time', narration: ['w1-intro', 'w1-observe'], mood: 'think',
      scene: { room: true, tag: { img: 'obj:clock', text: '2 hours' } }, cluePrompt: 'Tap each sign to check how your body feels.',
      okMsg: 'You noticed the problem. Now let’s find a healthy procedure.',
      symptoms: [{ t: 'tired eyes', d: 'Your eyes feel dry.' }, { t: 'stiff body', d: 'Your back and neck hurt.' }, { t: 'low concentration', d: 'You read the same line again and again.' }],
      align: { purpose: 'Notice the problem that the procedure will solve.', skill: 'Listening / Viewing', competency: 'Understand the context and goal of a procedure', feature: 'Health vocabulary (tired, stiff, eyes)' },
      dims: ['health'] },

    { id: 'observe', type: 'observe', phase: 'observe', title: 'Read the Procedure', mood: 'ready',
      line: 'Now read a healthy procedure. Find the goal, the materials and the steps.',
      prompt: 'Read the procedure. Then tap the 5 green action words.', need: 5,
      align: { purpose: 'Read a model procedure and find its parts.', skill: 'Reading – Viewing', competency: 'Identify the goal, materials and steps', feature: 'Imperative verbs, sequence markers, adverb', label: 'Observe the Procedure' },
      dims: ['independence'] },

    { id: 'listen', type: 'listenDo', phase: 'understand', title: 'Listen & Do', narration: ['w1-understand'], mood: 'ready',
      prompt: 'Play the audio. Tap the actions in the order you hear them. Be careful: some actions are not in the audio.', clip: ['w1-do-01', 'w1-do-02', 'w1-do-03', 'w1-do-04', 'w1-do-05'],
      tiles: ['look', 'phone', 'stand', 'stretch', 'snack', 'blink', 'drink'], answer: ['look', 'stand', 'stretch', 'blink', 'drink'],
      align: { purpose: 'Follow spoken instructions in the correct order.', skill: 'Listening', competency: 'Follow oral instructions', feature: 'Imperative verbs' },
      dims: ['communication'] },

    { id: 'tools', type: 'toolCheck', phase: 'understand', title: 'Tool Check', mood: 'think',
      line: 'Hmm… what do we really need for our five steps?',
      prompt: 'Look at the five steps again. Choose only the thing you really use.',
      items: [
        { img: 'obj:glass', label: 'a glass of water', helpful: true, why: 'You need it for step 5: drink some water.' },
        { img: 'obj:clock', label: 'a clock', helpful: false, why: 'No step uses a clock.' },
        { img: 'obj:phone', label: 'a phone', helpful: false, why: 'No step uses a phone. It is another screen.' },
        { img: 'obj:laptop', label: 'a laptop', helpful: false, why: 'No step uses a laptop. It is another screen.' },
        { img: 'obj:notebook', label: 'a notebook', helpful: false, why: 'No step uses a notebook. A break is not study time.' }],
      insight: 'This procedure needs only one material: a glass of water. Materials are not always required.',
      align: { purpose: 'Decide which materials a procedure really needs.', skill: 'Reading', competency: 'Identify materials / tools (when needed)', feature: 'Nouns for materials (a glass of water)' },
      dims: ['independence'] },

    { id: 'next', type: 'whatNext', phase: 'understand', title: 'What Comes Next?', mood: 'think',
      line: 'Listen to the first two steps. Can you predict step 3?', clip: ['w1-do-01', 'w1-do-02'],
      prompt: 'Which step comes next?',
      steps: ['First, look away from the screen.', 'Next, stand up.'],
      options: [{ text: 'Then, stretch your arms.', ok: true },
        { text: 'Then, sit down and open a game.', ok: false, hint: 'That is more screen time.' },
        { text: 'Then, check your messages.', ok: false, hint: 'Messages are on a screen too.' }],
      okMsg: 'Good thinking — order matters. After you stand up, you can stretch.',
      align: { purpose: 'Predict the next logical step.', skill: 'Listening / Reading', competency: 'Understand the sequence of steps', feature: 'Sequence markers (first, next, then)' },
      dims: ['critical'] },

    { id: 'missing', type: 'missing', phase: 'understand', title: 'Missing Step', mood: 'think',
      line: 'Oh! One step fell out of the procedure.',
      prompt: 'Which step goes in the gap?',
      steps: ['First, look away from the screen.', 'Next, stand up.', 'Then, stretch your arms.', null, 'Finally, drink some water.'],
      options: [{ text: 'After that, blink your eyes slowly.', ok: true },
        { text: 'After that, check your messages.', ok: false, hint: 'Your eyes need a rest from the screen.' },
        { text: 'After that, sleep for two hours.', ok: false, hint: 'A screen break is short.' }],
      okMsg: 'Great! Blinking slowly rests your tired eyes.',
      align: { purpose: 'Complete a procedure with a missing step.', skill: 'Reading', competency: 'Complete missing instructions', feature: 'Sequence markers (after that)' },
      dims: ['critical'] },

    { id: 'fix', type: 'fixSteps', phase: 'fix', title: 'Fix the Steps', narration: ['w1-fix'], mood: 'think',
      prompt: 'Tap the steps in the correct order. The sequence markers are your clues.', order: ['s1', 's2', 's3', 's4', 's5'],
      align: { purpose: 'Put mixed-up steps in a logical order.', skill: 'Reading', competency: 'Arrange steps logically', feature: 'Sequence markers' },
      dims: ['critical'] },

    { id: 'error', type: 'instructionError', phase: 'fix', title: 'Instruction Error', mood: 'think',
      line: 'These instructions have a grammar mistake. Find it and fix it.',
      prompt: 'Tap the sentence with a mistake. Then choose the correct sentence.',
      rounds: [
        { lines: ['Look away from the screen.', 'Stands up.', 'Stretch your arms.'], wrong: 1,
          options: [{ t: 'Stand up.', ok: true }, { t: 'Standing up.', ok: false }, { t: 'Stood up.', ok: false }],
          rule: 'An instruction starts with the base verb: Stand up.' },
        { lines: ['Stretch your arms.', 'You should blinking your eyes slowly.', 'Drink some water.'], wrong: 1,
          options: [{ t: 'Blinks your eyes slowly.', ok: false }, { t: 'Blink your eyes slowly.', ok: true }, { t: 'Blinking your eyes slowly.', ok: false }],
          rule: 'Use the base verb for instructions: Blink your eyes slowly.' }],
      align: { purpose: 'Find and correct grammar mistakes in instructions.', skill: 'Writing', competency: 'Detect and correct incorrect instructions', feature: 'Imperative = base verb (not -s / -ing)' },
      dims: ['communication'] },

    { id: 'safe', type: 'safeUnsafe', phase: 'fix', title: 'Safe or Unsafe?', mood: 'ready', clip: 'tip-w1-safe',
      line: 'Clear instructions help people act safely. Check each one.',
      prompt: 'Is each instruction safe or unsafe?',
      cards: [
        { text: 'Stretch your arms slowly and gently.', safe: true, why: 'Slow stretching is good for your body.' },
        { text: 'Stand up quickly on a wet floor.', safe: false, why: 'You can slip. Stand up carefully.' },
        { text: 'Drink water from a clean glass.', safe: true, why: 'A clean glass keeps you healthy.' },
        { text: 'Look at the sun to rest your eyes.', safe: false, why: 'The sun can hurt your eyes. Look at something far away.' },
        { text: 'Take your break in a safe place.', safe: true, why: 'A safe place keeps you and others safe.' }],
      align: { purpose: 'Judge whether each instruction is safe.', skill: 'Reading – Viewing', competency: 'Identify unsafe procedures', feature: 'Imperatives + adverbs (slowly, quickly), safety vocabulary' },
      dims: ['critical', 'health'] },

    { id: 'coach', type: 'coach', phase: 'do', title: 'Screen Break Coach', mood: 'happy',
      line: 'Now let’s do it for real! Listen to each step, choose the action, and DO it.',
      prompt: 'Listen. Tap the action. Then do it for a few seconds.',
      steps: [
        { clip: 'w1-do-01', answer: 'look', options: ['look', 'phone', 'snack'], hold: 4 },
        { clip: 'w1-do-02', answer: 'stand', options: ['laptop', 'stand', 'phone'], hold: 3 },
        { clip: 'w1-do-03', answer: 'stretch', options: ['snack', 'blink', 'stretch'], hold: 5 },
        { clip: 'w1-do-04', answer: 'blink', options: ['blink', 'look', 'drink'], hold: 5 },
        { clip: 'w1-do-05', answer: 'drink', options: ['phone', 'drink', 'stand'], hold: 3 }],
      doneText: 'You took a real screen break!', okMsg: 'Small steps build healthy habits. How do your eyes feel now?',
      align: { purpose: 'Follow each spoken step and really take a screen break.', skill: 'Listening', competency: 'Follow oral instructions step by step', feature: 'Sequence markers + imperative verbs' },
      dims: ['health', 'communication'] },

    { id: 'drag', type: 'dragDo', phase: 'do', title: 'Drag & Do', mood: 'ready',
      line: 'Water time! Use your hands to follow these three instructions.',
      prompt: 'Drag each thing to the right place. Or tap it, then tap where it goes.',
      scene: [
        { id: 'tablet', img: 'obj:tablet', label: 'tablet', role: 'item' }, { id: 'desk', img: 'obj:desk', label: 'desk', role: 'target' },
        { id: 'bottle', img: 'obj:bottle', label: 'water bottle', role: 'item' }, { id: 'glass', img: 'obj:glass', label: 'empty glass', role: 'both', dim: true },
        { id: 'me', img: 'mascot:ready', label: 'you', role: 'target' }],
      steps: [
        { text: 'Put the tablet on the desk.', item: 'tablet', target: 'desk', done: 'The tablet is on the desk. No screen now!', fx: ['hide:tablet', 'overlay:desk=obj:tablet'] },
        { text: 'Pour some water into the glass.', item: 'bottle', target: 'glass', done: 'The glass is full.', fx: ['undim:glass', 'label:glass=full glass', 'fade:bottle'] },
        { text: 'Drink the water.', item: 'glass', target: 'me', done: 'Ahh, fresh water!', fx: ['hide:glass', 'swap:me=mascot:happy'] }],
      okMsg: 'You followed the instructions in the right order. Doing it yourself is independence!',
      align: { purpose: 'Carry out written instructions by yourself.', skill: 'Reading', competency: 'Follow written instructions', feature: 'Imperative verbs (put, pour, drink)' },
      dims: ['independence', 'health'] },

    { id: 'decide1', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think', clip: 'sit-w1-eyes',
      line: 'It’s real-life time. What would you do?',
      situation: 'You have studied on your tablet for one hour. Your eyes feel tired and dry. What do you do first?',
      options: [
        { text: 'Keep working. I only have a little left.', best: false, fb: 'Tired eyes need a rest. A short break helps you work better.' },
        { text: 'Look away from the screen and take a short break.', best: true, fb: 'Taking care of yourself helps you learn better.' },
        { text: 'Watch a video on my phone.', best: false, fb: 'That is still a screen. Your eyes need a real break.' }],
      align: { purpose: 'Apply the procedure to a real situation.', skill: 'Reading / Listening', competency: 'Make a responsible choice using the procedure', feature: 'Imperatives in a real context' },
      dims: ['independence', 'health'] },

    { id: 'decide2', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think', clip: 'sit-w1-friend',
      line: 'Now your friend needs help. Kind words are powerful actions.',
      situation: 'Your friend has played a game for two hours. Your friend looks tired. What do you say?',
      options: [
        { text: '“Stop playing! You are lazy.”', best: false, fb: 'Those words can hurt. Try a kinder way.' },
        { text: '“Let’s take a short break together. Do you want some water?”', best: true, fb: 'You care for your friend and you invite them kindly.' },
        { text: 'Say nothing. It is not my problem.', best: false, fb: 'A good friend notices. A kind sentence can help.' }],
      align: { purpose: 'Give a kind and respectful suggestion to a friend.', skill: 'Reading / Listening', competency: 'Use instructions politely with others', feature: 'Polite suggestions (Let’s…, Do you want…?)' },
      dims: ['collab', 'faith', 'communication'] },

    { id: 'build', type: 'build', phase: 'create', title: 'Build the Procedure', narration: ['w1-create'], mood: 'happy',
      prompt: 'Choose a goal, pick 3–5 steps in order, then add sequence markers.',
      goals: ['How to Take a Healthy Screen Break', 'How to Play Games All Night', 'How to Charge a Tablet'], goalAnswer: 0,
      goalMsg: 'Check your goal. Does it help you take care of yourself?', badStepMsg: 'One step is not a screen break. Remove it and try again.',
      bank: [
        { t: 'look away from the screen.', ok: true }, { t: 'stand up.', ok: true }, { t: 'stretch your arms.', ok: true },
        { t: 'blink your eyes slowly.', ok: true }, { t: 'drink some water.', ok: true }, { t: 'take a deep breath.', ok: true },
        { t: 'check your messages.', ok: false }, { t: 'play one more game.', ok: false }],
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
