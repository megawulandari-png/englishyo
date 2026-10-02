/* Mission: How to Respect a Friend Who Is Fasting (World 4 · Better Together) — social procedure */
window.THRIVE = window.THRIVE || {};
THRIVE.missions = THRIVE.missions || {};
THRIVE.missions['fasting-friend'] = {
  id: 'fasting-friend', world: 4, title: 'How to Respect a Friend Who Is Fasting', badge: 'Kind Friend',
  intro: 'It is lunchtime and your friend is fasting. Learn simple, kind steps to show respect.',
  completeNarration: ['w4-complete'],
  completeText: 'Respect makes differences beautiful. Your kind words and actions help everyone feel welcome.',
  goal: 'Respect a friend who is fasting.',
  tools: [],
  toolNote: 'No materials are needed. You only need kind words and kind actions.',
  steps: [
    { id: 's1', marker: 'First', text: 'speak politely.' },
    { id: 's2', marker: 'Next', text: 'respect your friend’s choice.' },
    { id: 's3', marker: 'Then', text: 'avoid teasing or forcing them.' },
    { id: 's4', marker: 'After that', text: 'ask if they need support.' },
    { id: 's5', marker: 'Finally', text: 'keep being kind and respectful.' }],
  markedSteps: [
    '{{First}}, [[speak]] ((politely)).',
    '{{Next}}, [[respect]] your friend’s choice.',
    '{{Then}}, [[avoid]] teasing or forcing them.',
    '{{After that}}, [[ask]] if they need support.',
    '{{Finally}}, [[keep]] being kind and respectful.'],
  verbInfo: { speak: 'berbicara', respect: 'menghormati', avoid: 'menghindari', ask: 'bertanya', keep: 'tetap / terus', politely: 'dengan sopan' },
  actions: {
    speak: { img: 'svg:talk', label: 'speak politely' }, respect: { img: 'asset:badges/collab.png', label: 'respect their choice' },
    avoid: { img: 'svg:noTease', label: 'avoid teasing' }, ask: { img: 'svg:support', label: 'ask if they need support' },
    keep: { img: 'asset:badges/faith.png', label: 'keep being kind' }, food: { img: 'obj:lunchbox', label: 'offer your snack again' },
    laugh: { img: 'svg:laugh', label: 'laugh at them' }
  },
  stages: [
    { id: 'story', type: 'story', phase: 'observe', title: 'Lunchtime', narration: ['w4-intro', 'w4-observe'], mood: 'think',
      scene: { main: 'obj:lunchbox', tag: { img: 'svg:sunset', text: 'Fasting until sunset' } },
      cluePrompt: 'Tap each card. What is happening?',
      symptoms: [{ t: 'lunchtime', d: 'Many students are eating and drinking.' }, { t: 'your friend is fasting', d: 'They do not eat or drink until sunset.' }, { t: 'someone teases', d: 'A classmate says, “Come on, just one bite!”' }],
      okMsg: 'You noticed how your friend may feel. Let’s learn a kind procedure.',
      align: { purpose: 'Understand a social situation and how a friend may feel.', skill: 'Reading – Viewing', competency: 'Understand the context and goal of a social procedure', feature: 'Present simple to describe a situation' },
      dims: ['faith'] },

    { id: 'observe', type: 'observe', phase: 'observe', title: 'Read the Procedure', mood: 'ready',
      line: 'Social procedures help us act kindly. Find the goal and the steps.',
      prompt: 'Read the procedure. Then tap the 5 green action words.', need: 5,
      align: { purpose: 'Read a social procedure and find its parts.', skill: 'Reading – Viewing', competency: 'Identify the goal and steps (no materials needed)', feature: 'Imperative verbs, adverb (politely)', label: 'Observe the Procedure' },
      dims: ['independence'] },

    { id: 'kind', type: 'safeUnsafe', phase: 'understand', title: 'Kind or Unkind?', narration: ['w4-understand'], mood: 'ready',
      prompt: 'Read each sentence. Is it kind or unkind to a friend who is fasting?', labels: ['Kind', 'Unkind'],
      cards: [
        { text: '“Don’t worry. I can eat my snack outside.”', safe: true, why: 'You think about your friend’s feelings.' },
        { text: '“Just drink a little. Nobody will know.”', safe: false, why: 'This forces your friend. Respect their choice.' },
        { text: '“Do you want to sit with us? You don’t have to eat.”', safe: true, why: 'You include your friend in a kind way.' },
        { text: '“Fasting is silly.”', safe: false, why: 'Teasing hurts. Respect makes differences beautiful.' },
        { text: '“Tell me if you feel tired. I can help.”', safe: true, why: 'Offering support is a kind action.' }],
      okMsg: 'Kind words are powerful actions.',
      align: { purpose: 'Tell kind words from unkind words.', skill: 'Reading', competency: 'Evaluate instructions and responses', feature: 'Polite language (Do you want…? Tell me if…)' },
      dims: ['faith', 'communication'] },

    { id: 'listen', type: 'listenDo', phase: 'understand', title: 'Listen & Do', mood: 'ready',
      line: 'Listen carefully. Some actions are not kind!',
      prompt: 'Play the audio. Tap the actions in the order you hear them. Be careful: some actions are not in the audio.', clip: ['w4-do-01', 'w4-do-02', 'w4-do-03', 'w4-do-04', 'w4-do-05'],
      tiles: ['speak', 'laugh', 'respect', 'avoid', 'food', 'ask', 'keep'], answer: ['speak', 'respect', 'avoid', 'ask', 'keep'],
      align: { purpose: 'Follow spoken social instructions in order.', skill: 'Listening', competency: 'Follow oral instructions', feature: 'Imperative verbs (speak, respect, avoid, ask, keep)' },
      dims: ['communication'] },

    { id: 'fix', type: 'fixSteps', phase: 'fix', title: 'Fix the Steps', narration: ['w4-fix'], mood: 'think',
      prompt: 'Tap the steps in the correct order. The sequence markers are your clues.', order: ['s1', 's2', 's3', 's4', 's5'],
      align: { purpose: 'Put mixed-up steps in a logical order.', skill: 'Reading', competency: 'Arrange steps logically', feature: 'Sequence markers' },
      dims: ['critical'] },

    { id: 'next', type: 'whatNext', phase: 'fix', title: 'What Comes Next?', mood: 'think',
      line: 'Listen to the first two steps. Can you predict step 3?', clip: ['w4-do-01', 'w4-do-02'],
      prompt: 'Which step comes next?',
      steps: ['First, speak politely.', 'Next, respect your friend’s choice.'],
      options: [{ text: 'Then, avoid teasing or forcing them.', ok: true },
        { text: 'Then, eat your snack in front of them and say “Yum!”', ok: false, hint: 'That can make your friend feel bad.' },
        { text: 'Then, tell everyone to stop fasting.', ok: false, hint: 'That does not respect their choice.' }],
      okMsg: 'Yes. After you respect their choice, do not tease or force them.',
      align: { purpose: 'Predict the next logical step.', skill: 'Reading', competency: 'Understand the sequence of steps', feature: 'Sequence markers (first, next, then)' },
      dims: ['critical'] },

    { id: 'error', type: 'instructionError', phase: 'fix', title: 'Instruction Error', mood: 'think',
      line: 'These instructions have a grammar mistake. Find it and fix it.',
      prompt: 'Tap the sentence with a mistake. Then choose the correct sentence.',
      rounds: [
        { lines: ['Speak politely.', 'Respects your friend’s choice.', 'Ask if they need support.'], wrong: 1,
          options: [{ t: 'Respect your friend’s choice.', ok: true }, { t: 'Respecting your friend’s choice.', ok: false }, { t: 'Respected your friend’s choice.', ok: false }],
          rule: 'An instruction starts with the base verb: Respect.' },
        { lines: ['Avoid teasing them.', 'You should asking if they need support.', 'Keep being kind.'], wrong: 1,
          options: [{ t: 'Asks if they need support.', ok: false }, { t: 'Ask if they need support.', ok: true }, { t: 'Asking if they need support.', ok: false }],
          rule: 'Use the base verb for instructions: Ask.' }],
      align: { purpose: 'Find and correct grammar mistakes in instructions.', skill: 'Writing', competency: 'Detect and correct incorrect instructions', feature: 'Imperative = base verb' },
      dims: ['communication'] },

    { id: 'coach', type: 'coach', phase: 'do', title: 'Kindness Coach', mood: 'happy',
      line: 'Let’s practise! Listen to each step, choose the action, then SAY a kind sentence aloud.',
      prompt: 'Listen. Tap the action. Then say a kind sentence aloud.',
      doText: 'Say a kind sentence aloud now!', doneText: 'You practised every kind step!',
      steps: [
        { clip: 'w4-do-01', answer: 'speak', options: ['speak', 'laugh', 'food'], hold: 4, say: '“Hi! How are you today?”' },
        { clip: 'w4-do-02', answer: 'respect', options: ['food', 'respect', 'laugh'], hold: 4, say: '“That’s OK. I respect your choice.”' },
        { clip: 'w4-do-03', answer: 'avoid', options: ['laugh', 'food', 'avoid'], hold: 4, say: '“Please don’t tease our friend.”' },
        { clip: 'w4-do-04', answer: 'ask', options: ['ask', 'laugh', 'speak'], hold: 4, say: '“Do you need anything?”' },
        { clip: 'w4-do-05', answer: 'keep', options: ['food', 'keep', 'laugh'], hold: 4, say: '“See you after school, friend!”' }],
      okMsg: 'Strong friends listen before they speak, and they speak kindly.',
      align: { purpose: 'Practise kind sentences for each step.', skill: 'Listening / Speaking', competency: 'Follow oral instructions and respond aloud', feature: 'Polite sentences and questions' },
      dims: ['collab', 'communication'] },

    { id: 'decide1', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think', clip: 'sit-w4-lunch',
      line: 'Real-life time. What would you do?',
      situation: 'It is lunchtime. Your friend is fasting and sits alone. What do you do?',
      options: [
        { text: '“Can I sit with you? We can talk.”', best: true, fb: 'Kind words are powerful actions.' },
        { text: 'Eat your snack in front of them and say “Yum!”', best: false, fb: 'That can make your friend feel bad.' },
        { text: 'Ignore them.', best: false, fb: 'Your friend may feel alone. A friendly word helps.' }],
      align: { purpose: 'Choose a kind action for a real situation.', skill: 'Reading / Listening', competency: 'Make a respectful choice using the procedure', feature: 'Polite requests (Can I…?)' },
      dims: ['collab', 'faith'] },

    { id: 'decide2', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think',
      line: 'Someone is unkind. What can you say?',
      situation: 'A classmate says, “Fasting is weird.” Your fasting friend looks sad. What do you say?',
      options: [
        { text: '“People have different beliefs. Let’s respect each other.”', best: true, fb: 'Respect makes differences beautiful.' },
        { text: 'Laugh with the classmate.', best: false, fb: 'Laughing makes your friend feel worse.' },
        { text: 'Say nothing.', best: false, fb: 'A calm, kind sentence can help your friend feel safe.' }],
      align: { purpose: 'Stand up for a friend respectfully.', skill: 'Reading / Speaking', competency: 'Use instructions to guide others kindly', feature: 'Let’s + base verb' },
      dims: ['citizenship', 'communication'] },

    { id: 'build', type: 'build', phase: 'create', title: 'Build the Procedure', narration: ['w4-create'], mood: 'happy',
      prompt: 'Choose a goal, pick 3–5 steps in order, then add sequence markers.',
      goals: ['How to Respect a Friend Who Is Fasting', 'How to Make Fun of a Friend', 'How to Eat in Front of a Fasting Friend'], goalAnswer: 0,
      goalMsg: 'Check your goal. Does it show respect?', badStepMsg: 'One step is not respectful. Remove it and try again.',
      bank: [
        { t: 'speak politely.', ok: true }, { t: 'respect your friend’s choice.', ok: true }, { t: 'avoid teasing or forcing them.', ok: true },
        { t: 'ask if they need support.', ok: true }, { t: 'invite them to sit with you.', ok: true }, { t: 'keep being kind and respectful.', ok: true },
        { t: 'offer them food again and again.', ok: false }, { t: 'laugh at their choice.', ok: false }],
      align: { purpose: 'Create your own respect procedure.', skill: 'Writing', competency: 'Create a social procedure text', feature: 'Goal + imperative steps + sequence markers' },
      dims: ['creative'] },

    { id: 'present', type: 'present', phase: 'create', title: 'Tell Your Procedure', mood: 'happy',
      line: 'Share your kind procedure with a friend.',
      prompt: 'Listen to your procedure, then read it aloud yourself.',
      checks: ['I read every step aloud.', 'I used sequence markers.', 'I used a kind and friendly voice.'],
      align: { purpose: 'Present a social procedure aloud.', skill: 'Speaking', competency: 'Present instructions orally', feature: 'Simple sentences with sequence markers' },
      dims: ['communication'] }
  ]
};
