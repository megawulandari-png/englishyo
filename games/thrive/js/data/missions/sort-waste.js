/* Mission: How to Sort Waste at School (World 5 · Care for Our Place) */
window.THRIVE = window.THRIVE || {};
THRIVE.missions = THRIVE.missions || {};
THRIVE.missions['sort-waste'] = {
  id: 'sort-waste', world: 5, title: 'How to Sort Waste at School', badge: 'Eco Hero',
  intro: 'After break time, the schoolyard is messy. Learn how to sort waste and keep our place clean.',
  completeNarration: ['w5-complete'],
  completeText: 'Small actions can make a big difference. You sorted waste and helped your team keep the school clean.',
  goal: 'Put school rubbish in the correct bins.',
  tools: [{ img: 'svg:binPlastic', text: 'a plastic bin' }, { img: 'svg:binPaper', text: 'a paper bin' }, { img: 'svg:binOrganic', text: 'an organic bin' }],
  toolNote: 'Look at the colour and the picture on each bin.',
  steps: [
    { id: 's1', marker: 'First', text: 'look at the rubbish.' },
    { id: 's2', marker: 'Next', text: 'decide what type it is.' },
    { id: 's3', marker: 'Then', text: 'put plastic in the correct bin.' },
    { id: 's4', marker: 'After that', text: 'put paper in the correct bin.' },
    { id: 's5', marker: 'Finally', text: 'keep the area clean.' }],
  markedSteps: [
    '{{First}}, [[look]] at the rubbish.',
    '{{Next}}, [[decide]] what type it is.',
    '{{Then}}, [[put]] plastic in the correct bin.',
    '{{After that}}, [[put]] paper in the correct bin.',
    '{{Finally}}, [[keep]] the area clean.'],
  verbInfo: { look: 'melihat', decide: 'memutuskan', put: 'meletakkan / memasukkan', keep: 'menjaga' },
  actions: {
    look: { img: 'svg:mess', label: 'look at the rubbish' }, decide: { img: 'mascot:think', label: 'decide the type' },
    plastic: { img: 'svg:binPlastic', label: 'plastic in the plastic bin' }, paper: { img: 'svg:binPaper', label: 'paper in the paper bin' },
    clean: { img: 'svg:broom', label: 'keep the area clean' }, burn: { img: 'svg:fire', label: 'burn the rubbish' },
    river: { img: 'svg:river', label: 'throw it in the river' }
  },
  stages: [
    { id: 'story', type: 'story', phase: 'observe', title: 'After Break Time', narration: ['w5-intro', 'w5-observe'], mood: 'think',
      scene: { main: 'svg:mess', tag: { img: 'svg:binOrganic', text: 'One bin for everything?' } },
      cluePrompt: 'Tap each card. What is the problem?',
      symptoms: [{ t: 'rubbish on the ground', d: 'Plastic cups and paper are everywhere.' }, { t: 'one mixed bin', d: 'Someone put all the rubbish in one bin.' }, { t: 'a bad smell', d: 'Food waste makes a bad smell.' }],
      okMsg: 'You found the problem. Let’s learn how to sort waste.',
      align: { purpose: 'Notice an environmental problem at school.', skill: 'Reading – Viewing', competency: 'Understand the context and goal of a procedure', feature: 'Environment vocabulary (rubbish, bin, plastic, paper)' },
      dims: ['health'] },

    { id: 'observe', type: 'observe', phase: 'observe', title: 'Read the Procedure', mood: 'ready',
      line: 'Now read the procedure. Find the goal, the tools and the steps.',
      prompt: 'Read the procedure. Then tap the 4 green action words.', need: 4,
      align: { purpose: 'Read a school procedure and find its parts.', skill: 'Reading – Viewing', competency: 'Identify the goal, tools and steps', feature: 'Imperative verbs, sequence markers', label: 'Observe the Procedure' },
      dims: ['independence'] },

    { id: 'listen', type: 'listenDo', phase: 'understand', title: 'Listen & Do', narration: ['w5-understand'], mood: 'ready',
      prompt: 'Play the audio. Tap the actions in the order you hear them. Be careful: some actions are not in the audio.', clip: ['w5-do-01', 'w5-do-02', 'w5-do-03', 'w5-do-04', 'w5-do-05'],
      tiles: ['look', 'burn', 'decide', 'plastic', 'river', 'paper', 'clean'], answer: ['look', 'decide', 'plastic', 'paper', 'clean'],
      align: { purpose: 'Follow spoken instructions in the correct order.', skill: 'Listening', competency: 'Follow oral instructions', feature: 'Imperative verbs (look, decide, put, keep)' },
      dims: ['communication'] },

    { id: 'sort', type: 'sortBins', phase: 'understand', title: 'Sort It!', mood: 'happy',
      line: 'Time to sort! Put each piece of rubbish in the correct bin.',
      prompt: 'Drag each item to a bin. Or tap the item, then tap the bin.',
      bins: [{ id: 'plastic', img: 'svg:binPlastic', label: 'plastic' }, { id: 'paper', img: 'svg:binPaper', label: 'paper' }, { id: 'organic', img: 'svg:binOrganic', label: 'organic' }],
      items: [
        { id: 'cup', img: 'svg:cup', label: 'plastic cup', bin: 'plastic' }, { id: 'bottle', img: 'svg:plasticBottle', label: 'plastic bottle', bin: 'plastic' },
        { id: 'wrapper', img: 'svg:wrapper', label: 'snack wrapper', bin: 'plastic' }, { id: 'paper', img: 'svg:paper', label: 'old paper', bin: 'paper' },
        { id: 'box', img: 'svg:box', label: 'paper box', bin: 'paper' }, { id: 'banana', img: 'svg:banana', label: 'banana peel', bin: 'organic' },
        { id: 'leaves', img: 'svg:leaves', label: 'dry leaves', bin: 'organic' }],
      okMsg: 'Small actions can make a big difference. Now plastic and paper can be recycled.',
      align: { purpose: 'Categorise waste into the correct bins.', skill: 'Reading – Viewing', competency: 'Carry out a step: decide the type and act', feature: 'Nouns for materials (plastic, paper, organic)' },
      dims: ['critical', 'health'] },

    { id: 'fix', type: 'fixSteps', phase: 'fix', title: 'Fix the Steps', narration: ['w5-fix'], mood: 'think',
      prompt: 'Tap the steps in the correct order. The sequence markers are your clues.', order: ['s1', 's2', 's3', 's4', 's5'],
      align: { purpose: 'Put mixed-up steps in a logical order.', skill: 'Reading', competency: 'Arrange steps logically', feature: 'Sequence markers' },
      dims: ['critical'] },

    { id: 'missing', type: 'missing', phase: 'fix', title: 'Missing Step', mood: 'think',
      line: 'Hmm… one step is missing.',
      prompt: 'Which step goes in the gap?',
      steps: ['First, look at the rubbish.', 'Next, decide what type it is.', 'Then, put plastic in the correct bin.', null, 'Finally, keep the area clean.'],
      options: [{ text: 'After that, put paper in the correct bin.', ok: true },
        { text: 'After that, put everything in one bin.', ok: false, hint: 'Mixed rubbish cannot be recycled.' },
        { text: 'After that, leave the paper on the floor.', ok: false, hint: 'Paper on the floor makes the school dirty.' }],
      okMsg: 'Right! Plastic first, then paper — each in its own bin.',
      align: { purpose: 'Complete a procedure with a missing step.', skill: 'Reading', competency: 'Complete missing instructions', feature: 'Sequence markers (after that)' },
      dims: ['critical'] },

    { id: 'resp', type: 'safeUnsafe', phase: 'fix', title: 'Responsible or Not?', mood: 'ready',
      line: 'Some actions help our school. Some actions do not.',
      prompt: 'Read each action. Is it responsible?', labels: ['Responsible', 'Not responsible'],
      cards: [
        { text: 'Put the banana peel in the organic bin.', safe: true, why: 'Food waste goes in the organic bin.' },
        { text: 'Throw the plastic bottle out of the window.', safe: false, why: 'Rubbish outside the bin makes our school dirty.' },
        { text: 'Fold the paper box before you put it in the bin.', safe: true, why: 'It saves space in the bin.' },
        { text: 'Burn the plastic behind the school.', safe: false, why: 'Smoke from plastic is bad for our health.' },
        { text: 'Wash your hands after you clean up.', safe: true, why: 'Clean hands keep you healthy.' }],
      okMsg: 'You can tell responsible actions from careless ones.',
      align: { purpose: 'Judge whether actions are responsible.', skill: 'Reading', competency: 'Evaluate instructions', feature: 'Imperatives + responsibility vocabulary' },
      dims: ['health', 'independence'] },

    { id: 'error', type: 'instructionError', phase: 'do', title: 'Instruction Error', mood: 'think',
      line: 'The class poster has mistakes. Can you fix them?',
      prompt: 'Tap the sentence with a mistake. Then choose the correct sentence.',
      rounds: [
        { lines: ['Look at the rubbish.', 'Decides what type it is.', 'Keep the area clean.'], wrong: 1,
          options: [{ t: 'Decide what type it is.', ok: true }, { t: 'Deciding what type it is.', ok: false }, { t: 'Decided what type it is.', ok: false }],
          rule: 'An instruction starts with the base verb: Decide.' },
        { lines: ['Put plastic in the plastic bin.', 'You should putting paper in the paper bin.', 'Keep the area clean.'], wrong: 1,
          options: [{ t: 'Puts paper in the paper bin.', ok: false }, { t: 'Put paper in the paper bin.', ok: true }, { t: 'Putting paper in the paper bin.', ok: false }],
          rule: 'Use the base verb for instructions: Put.' }],
      align: { purpose: 'Find and correct grammar mistakes in instructions.', skill: 'Writing', competency: 'Detect and correct incorrect instructions', feature: 'Imperative = base verb' },
      dims: ['communication'] },

    { id: 'decide', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think', clip: 'sit-w5-cleanup',
      line: 'Clean-up day! How can your class work together?',
      situation: 'Your class has a clean-up day. Some friends just play and do not help. What do you say?',
      options: [
        { text: '“Let’s work in teams. You collect plastic, and we collect paper.”', best: true, fb: 'Strong teams share the work.' },
        { text: '“I will do everything alone.”', best: false, fb: 'That is kind, but a team is faster and fairer.' },
        { text: '“You are lazy!”', best: false, fb: 'Those words can hurt. Invite them to help instead.' }],
      align: { purpose: 'Organise a team with clear instructions.', skill: 'Reading / Listening', competency: 'Give instructions to share roles', feature: 'Compound sentence with and; Let’s…' },
      dims: ['collab', 'citizenship'] },

    { id: 'build', type: 'build', phase: 'create', title: 'Build the Procedure', narration: ['w5-create'], mood: 'happy',
      prompt: 'Choose a goal, pick 3–5 steps in order, then add sequence markers.',
      goals: ['How to Sort Waste at School', 'How to Throw Rubbish Anywhere', 'How to Burn Plastic'], goalAnswer: 0,
      goalMsg: 'Check your goal. Does it take care of our school?', badStepMsg: 'One step is not responsible. Remove it and try again.',
      bank: [
        { t: 'look at the rubbish.', ok: true }, { t: 'decide what type it is.', ok: true }, { t: 'put plastic in the correct bin.', ok: true },
        { t: 'put paper in the correct bin.', ok: true }, { t: 'put food waste in the organic bin.', ok: true }, { t: 'keep the area clean.', ok: true },
        { t: 'put everything in one bin.', ok: false }, { t: 'throw rubbish in the river.', ok: false }],
      align: { purpose: 'Create a waste-sorting procedure for your class.', skill: 'Writing', competency: 'Create a procedure text (goal + steps)', feature: 'Goal + imperative steps + sequence markers' },
      dims: ['creative', 'citizenship'] },

    { id: 'present', type: 'present', phase: 'create', title: 'Tell Your Procedure', mood: 'happy',
      line: 'Read your procedure aloud, like an announcement for the whole school!',
      prompt: 'Listen to your procedure, then read it aloud yourself.',
      checks: ['I read every step aloud.', 'I used sequence markers.', 'I spoke clearly, like an announcer.'],
      align: { purpose: 'Present a procedure aloud.', skill: 'Speaking', competency: 'Present instructions orally', feature: 'Simple sentences with sequence markers' },
      dims: ['communication'] }
  ]
};
