/* Mission: What to Do During an Earthquake (World 6 · Ready for Real Life) — calm, practical safety procedure
 * Step 4 says “when the shaking stops” so learners do not move during shaking. */
window.THRIVE = window.THRIVE || {};
THRIVE.missions = THRIVE.missions || {};
THRIVE.missions['earthquake'] = {
  id: 'earthquake', world: 6, title: 'What to Do During an Earthquake', badge: 'Safety Star',
  intro: 'Indonesia has many earthquakes. When we practise, we stay calm and safe. Let’s learn the steps together.',
  completeNarration: ['w6-complete'],
  completeText: 'Being prepared helps us stay calm and make better decisions. You know what to do, and you help others too.',
  goal: 'Stay safe during an earthquake.',
  tools: [],
  toolNote: 'No materials are needed. Stay calm and listen to your teacher.',
  steps: [
    { id: 's1', marker: 'First', text: 'stay calm.' },
    { id: 's2', marker: 'Next', text: 'protect your head.' },
    { id: 's3', marker: 'Then', text: 'move away from windows.' },
    { id: 's4', marker: 'After that', text: 'go to a safe place when the shaking stops.' },
    { id: 's5', marker: 'Finally', text: 'follow instructions from adults or teachers.' }],
  markedSteps: [
    '{{First}}, [[stay]] calm.',
    '{{Next}}, [[protect]] your head.',
    '{{Then}}, [[move]] away from windows.',
    '{{After that}}, [[go]] to a safe place when the shaking stops.',
    '{{Finally}}, [[follow]] instructions from adults or teachers.'],
  verbInfo: { stay: 'tetap', protect: 'melindungi', move: 'bergerak / menjauh', go: 'pergi', follow: 'mengikuti' },
  actions: {
    calm: { img: 'svg:calm', label: 'stay calm' }, protect: { img: 'svg:protect', label: 'protect your head' },
    away: { img: 'svg:window', label: 'move away from windows' }, safe: { img: 'svg:field', label: 'go to a safe place' },
    follow: { img: 'svg:megaphone', label: 'follow your teacher' }, lift: { img: 'svg:lift', label: 'use the lift' },
    run: { img: 'svg:run', label: 'run and push' }
  },
  stages: [
    { id: 'story', type: 'story', phase: 'observe', title: 'The Floor Is Shaking', narration: ['w6-intro', 'w6-observe'], mood: 'think',
      scene: { main: 'svg:window', tag: { img: 'obj:desk', text: 'Earthquake drill' } },
      cluePrompt: 'Tap each card. What do you notice?',
      symptoms: [{ t: 'the lamp is moving', d: 'The ground is shaking a little.' }, { t: 'big windows', d: 'Glass can break during an earthquake.' }, { t: 'your teacher', d: 'Your teacher is ready to help you.' }],
      okMsg: 'You noticed the important things. Let’s learn what to do.',
      align: { purpose: 'Notice dangers and helpers in an emergency.', skill: 'Reading – Viewing', competency: 'Understand the context and goal of a safety procedure', feature: 'Safety vocabulary (shake, window, safe)' },
      dims: ['health'] },

    { id: 'observe', type: 'observe', phase: 'observe', title: 'Read the Procedure', mood: 'ready',
      line: 'A safety procedure must be very clear. Find the goal and the steps.',
      prompt: 'Read the procedure. Then tap the 5 green action words.', need: 5,
      align: { purpose: 'Read a safety procedure and find its parts.', skill: 'Reading – Viewing', competency: 'Identify the goal and steps (no materials needed)', feature: 'Imperative verbs, time clause (when the shaking stops)', label: 'Observe the Procedure' },
      dims: ['independence'] },

    { id: 'listen', type: 'listenDo', phase: 'understand', title: 'Listen & Do', narration: ['w6-understand'], mood: 'ready',
      prompt: 'Play the audio. Tap the actions in the order you hear them. Be careful: some actions are not in the audio.', clip: ['w6-do-01', 'w6-do-02', 'w6-do-03', 'w6-do-04', 'w6-do-05'],
      tiles: ['calm', 'run', 'protect', 'away', 'lift', 'safe', 'follow'], answer: ['calm', 'protect', 'away', 'safe', 'follow'],
      align: { purpose: 'Follow spoken safety instructions in order.', skill: 'Listening', competency: 'Follow oral instructions', feature: 'Imperative verbs' },
      dims: ['communication'] },

    { id: 'spots', type: 'toolCheck', phase: 'understand', title: 'Safe Spot Check', mood: 'think',
      line: 'Where is it safe? Think about glass and heavy things.',
      prompt: 'Choose only the SAFE places.',
      items: [
        { img: 'obj:desk', label: 'under a strong desk', helpful: true, why: 'A strong desk protects your head.' },
        { img: 'svg:field', label: 'the open field, after the shaking', helpful: true, why: 'Nothing can fall on you there.' },
        { img: 'svg:window', label: 'next to a big window', helpful: false, why: 'Glass can break.' },
        { img: 'svg:cupboard', label: 'next to a tall cupboard', helpful: false, why: 'It can fall on you.' },
        { img: 'svg:lift', label: 'in the lift', helpful: false, why: 'Lifts can stop. Use the stairs after the shaking.' }],
      insight: 'Stay away from glass and heavy things. Protect your head.',
      align: { purpose: 'Decide which places are safe.', skill: 'Reading – Viewing', competency: 'Identify safe and unsafe choices in a procedure', feature: 'Prepositions of place (under, next to, in)' },
      dims: ['critical', 'health'] },

    { id: 'fix', type: 'fixSteps', phase: 'fix', title: 'Fix the Steps', narration: ['w6-fix'], mood: 'think',
      prompt: 'Tap the steps in the correct order. The sequence markers are your clues.', order: ['s1', 's2', 's3', 's4', 's5'],
      align: { purpose: 'Put mixed-up safety steps in order.', skill: 'Reading', competency: 'Arrange steps logically', feature: 'Sequence markers' },
      dims: ['critical'] },

    { id: 'next', type: 'whatNext', phase: 'fix', title: 'What Comes Next?', mood: 'think',
      line: 'Listen to the first three steps. What comes next?', clip: ['w6-do-01', 'w6-do-02', 'w6-do-03'],
      prompt: 'Which step comes next?',
      steps: ['First, stay calm.', 'Next, protect your head.', 'Then, move away from windows.'],
      options: [{ text: 'After that, go to a safe place when the shaking stops.', ok: true },
        { text: 'After that, run out and push your friends.', ok: false, hint: 'Pushing can hurt people.' },
        { text: 'After that, go back for your phone.', ok: false, hint: 'Things are not important. You are important.' }],
      okMsg: 'Yes. When the shaking stops, go to the safe meeting place.',
      align: { purpose: 'Predict the next logical step.', skill: 'Reading', competency: 'Understand the sequence of steps', feature: 'Sequence markers (after that)' },
      dims: ['critical'] },

    { id: 'drill', type: 'coach', phase: 'do', title: 'Earthquake Drill', mood: 'happy',
      line: 'Let’s practise a drill! Listen to each step, choose the action, then DO it calmly.',
      prompt: 'Listen. Tap the action. Then do it for a few seconds.',
      doText: 'Do it now, calmly!', doneText: 'Great drill! You know what to do.',
      steps: [
        { clip: 'w6-do-01', answer: 'calm', options: ['calm', 'run', 'lift'], hold: 3 },
        { clip: 'w6-do-02', answer: 'protect', options: ['lift', 'protect', 'run'], hold: 4 },
        { clip: 'w6-do-03', answer: 'away', options: ['run', 'lift', 'away'], hold: 3 },
        { clip: 'w6-do-04', answer: 'safe', options: ['safe', 'lift', 'run'], hold: 3 },
        { clip: 'w6-do-05', answer: 'follow', options: ['run', 'follow', 'lift'], hold: 3 }],
      okMsg: 'Being prepared helps us stay calm and make better decisions.',
      align: { purpose: 'Practise the safety procedure as a drill.', skill: 'Listening', competency: 'Follow oral instructions step by step', feature: 'Sequence markers + imperative verbs' },
      dims: ['health', 'independence'] },

    { id: 'safe', type: 'safeUnsafe', phase: 'do', title: 'Safe or Unsafe?', mood: 'ready',
      line: 'Clear instructions help people act safely. Check each one.',
      prompt: 'Is each instruction safe or unsafe?', labels: ['Safe', 'Unsafe'],
      cards: [
        { text: 'Stay under a strong desk and hold on.', safe: true, why: 'The desk protects your head.' },
        { text: 'Use the lift to go down quickly.', safe: false, why: 'Lifts can stop. Use the stairs after the shaking.' },
        { text: 'Walk calmly with your class to the meeting point.', safe: true, why: 'Walking calmly keeps everyone safe.' },
        { text: 'Stand next to the windows to watch.', safe: false, why: 'Glass can break.' },
        { text: 'Push your friends to get out first.', safe: false, why: 'Pushing can make people fall.' }],
      okMsg: 'You can spot unsafe steps. That keeps you and your friends safe.',
      align: { purpose: 'Judge whether each instruction is safe.', skill: 'Reading – Viewing', competency: 'Identify unsafe procedures', feature: 'Imperatives + adverbs (calmly, quickly)' },
      dims: ['critical', 'health'] },

    { id: 'decide', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think', clip: 'sit-w6-scared',
      line: 'Your friend is scared. How can you help responsibly?',
      situation: 'The shaking has stopped. Your friend is scared and crying. What do you do?',
      options: [
        { text: '“Hold my hand. Let’s walk with the teacher.”', best: true, fb: 'You help someone responsibly and calmly.' },
        { text: 'Run away alone.', best: false, fb: 'Stay with your class. Together is safer.' },
        { text: 'Laugh because they are scared.', best: false, fb: 'Being scared is normal. Kind words help.' }],
      align: { purpose: 'Help someone responsibly after an emergency.', skill: 'Reading / Listening', competency: 'Give calm instructions to others', feature: 'Imperatives + Let’s…' },
      dims: ['collab', 'faith'] },

    { id: 'error', type: 'instructionError', phase: 'create', title: 'Instruction Error', mood: 'think',
      line: 'Safety signs must be correct. Fix the mistakes.',
      prompt: 'Tap the sentence with a mistake. Then choose the correct sentence.',
      rounds: [
        { lines: ['Stay calm.', 'Protects your head.', 'Follow your teacher.'], wrong: 1,
          options: [{ t: 'Protect your head.', ok: true }, { t: 'Protecting your head.', ok: false }, { t: 'Protected your head.', ok: false }],
          rule: 'An instruction starts with the base verb: Protect.' },
        { lines: ['Move away from windows.', 'You should going to a safe place.', 'Follow instructions.'], wrong: 1,
          options: [{ t: 'Goes to a safe place.', ok: false }, { t: 'Go to a safe place.', ok: true }, { t: 'Going to a safe place.', ok: false }],
          rule: 'Use the base verb for instructions: Go.' }],
      align: { purpose: 'Find and correct grammar mistakes in safety instructions.', skill: 'Writing', competency: 'Detect and correct incorrect instructions', feature: 'Imperative = base verb' },
      dims: ['communication'] },

    { id: 'build', type: 'build', phase: 'create', title: 'Make a Safety Card', narration: ['w6-create'], mood: 'happy',
      prompt: 'Choose a goal, pick 3–5 steps in order, then add sequence markers.',
      goals: ['What to Do During an Earthquake', 'How to Watch an Earthquake', 'How to Take Photos During an Earthquake'], goalAnswer: 0,
      goalMsg: 'Check your goal. Does it keep people safe?', badStepMsg: 'One step is not safe. Remove it and try again.',
      bank: [
        { t: 'stay calm.', ok: true }, { t: 'protect your head.', ok: true }, { t: 'hold on to a strong desk.', ok: true },
        { t: 'move away from windows.', ok: true }, { t: 'go to a safe place when the shaking stops.', ok: true },
        { t: 'follow instructions from adults or teachers.', ok: true }, { t: 'use the lift.', ok: false }, { t: 'go back for your bag.', ok: false }],
      align: { purpose: 'Create a safety card for your class.', skill: 'Writing', competency: 'Create a procedure text (goal + steps)', feature: 'Goal + imperative steps + sequence markers' },
      dims: ['creative', 'independence'] },

    { id: 'present', type: 'present', phase: 'create', title: 'Tell Your Procedure', mood: 'happy',
      line: 'Read your safety card aloud, calmly and clearly.',
      prompt: 'Listen to your safety card, then read it aloud yourself.',
      checks: ['I read every step aloud.', 'I used sequence markers.', 'I spoke calmly and clearly.'],
      align: { purpose: 'Present safety instructions aloud.', skill: 'Speaking', competency: 'Present instructions orally', feature: 'Simple sentences with sequence markers' },
      dims: ['communication'] }
  ]
};
