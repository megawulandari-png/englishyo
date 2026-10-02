/* Mission: How to Make Klepon (World 3 · Taste of Nusantara) — recipe procedure with cultural context */
window.THRIVE = window.THRIVE || {};
THRIVE.missions = THRIVE.missions || {};
THRIVE.missions['klepon'] = {
  id: 'klepon', world: 3, title: 'How to Make Klepon', badge: 'Nusantara Chef',
  intro: 'Klepon is a sweet green snack from Java. Read a recipe, cook it step by step, and share the taste of Nusantara.',
  completeNarration: ['w3-complete'],
  completeText: 'Every recipe tells a story about people, places and culture. You followed a recipe and respected other food cultures.',
  goal: 'Make klepon, a sweet snack from Java.',
  tools: [{ img: 'svg:flour', text: 'rice flour' }, { img: 'obj:glass', text: 'warm water' }, { img: 'svg:palmSugar', text: 'palm sugar' },
    { img: 'svg:coconut', text: 'grated coconut' }, { img: 'svg:bowl', text: 'a bowl' }, { img: 'svg:pot', text: 'a pot' }],
  toolNote: 'A recipe lists the ingredients and tools first. Ask an adult to help you with hot water.',
  steps: [
    { id: 's1', marker: 'First', text: 'prepare the ingredients.' },
    { id: 's2', marker: 'Next', text: 'mix the flour with water.' },
    { id: 's3', marker: 'Then', text: 'shape the dough and add palm sugar inside.' },
    { id: 's4', marker: 'After that', text: 'boil the balls until they float.' },
    { id: 's5', marker: 'Finally', text: 'roll them in grated coconut and serve.' }],
  markedSteps: [
    '{{First}}, [[prepare]] the ingredients.',
    '{{Next}}, [[mix]] the flour with water.',
    '{{Then}}, [[shape]] the dough and [[add]] palm sugar inside.',
    '{{After that}}, [[boil]] the balls until they float.',
    '{{Finally}}, [[roll]] them in grated coconut and [[serve]].'],
  verbInfo: { prepare: 'menyiapkan', mix: 'mencampur', shape: 'membentuk', add: 'menambahkan', boil: 'merebus', roll: 'menggulingkan', serve: 'menyajikan' },
  actions: {
    prepare: { img: 'svg:flour', label: 'prepare the ingredients' }, mix: { img: 'svg:bowl', label: 'mix the flour with water' },
    shape: { img: 'svg:dough', label: 'shape and add palm sugar' }, boil: { img: 'svg:pot', label: 'boil the balls' },
    roll: { img: 'svg:klepon', label: 'roll in coconut and serve' }, fry: { img: 'svg:pan', label: 'fry them in oil' },
    chocolate: { img: 'svg:chocolate', label: 'add chocolate' }
  },
  stages: [
    { id: 'story', type: 'story', phase: 'observe', title: 'A Sweet Surprise', narration: ['w3-intro', 'w3-observe'], mood: 'happy',
      scene: { main: 'svg:klepon', tag: { img: 'svg:pandan', text: 'From Java' } },
      cluePrompt: 'Tap each card to learn about klepon.',
      symptoms: [{ t: 'from Java', d: 'Klepon is a traditional snack from Java, Indonesia.' }, { t: 'a sweet surprise', d: 'Palm sugar melts inside when you bite it.' }, { t: 'green and white', d: 'The green comes from pandan leaves. The white is grated coconut.' }],
      okMsg: 'Now you know klepon! Let’s read the recipe.',
      align: { purpose: 'Learn the cultural context of an Indonesian recipe.', skill: 'Reading – Viewing', competency: 'Understand the context and goal of a recipe', feature: 'Food vocabulary (palm sugar, coconut, pandan)' },
      dims: ['citizenship'] },

    { id: 'observe', type: 'observe', phase: 'observe', title: 'Read the Recipe', mood: 'ready',
      line: 'A recipe is a procedure text too. Find the goal, the ingredients and the steps.',
      prompt: 'Read the recipe. Then tap 6 green action words.', need: 6,
      align: { purpose: 'Read a recipe and find its parts.', skill: 'Reading – Viewing', competency: 'Identify the goal, ingredients/tools and steps', feature: 'Cooking verbs (mix, shape, boil, roll), sequence markers', label: 'Observe the Recipe' },
      dims: ['independence'] },

    { id: 'tools', type: 'toolCheck', phase: 'understand', title: 'Ingredient Check', mood: 'think',
      line: 'Before we cook, let’s check the ingredients.',
      prompt: 'Choose all the ingredients for klepon.',
      items: [
        { img: 'svg:flour', label: 'rice flour', helpful: true, why: 'You mix it with water to make the dough.' },
        { img: 'svg:palmSugar', label: 'palm sugar', helpful: true, why: 'It goes inside each ball.' },
        { img: 'svg:coconut', label: 'grated coconut', helpful: true, why: 'You roll the balls in it.' },
        { img: 'obj:glass', label: 'water', helpful: true, why: 'You mix it with the flour.' },
        { img: 'svg:cheese', label: 'cheese', helpful: false, why: 'Cheese is not in this recipe.' },
        { img: 'svg:chocolate', label: 'chocolate', helpful: false, why: 'Chocolate is not in this recipe.' }],
      insight: 'Check the ingredients before you start. It saves time and food.',
      align: { purpose: 'Identify the ingredients a recipe needs.', skill: 'Reading', competency: 'Identify materials / ingredients', feature: 'Food nouns (rice flour, palm sugar, grated coconut)' },
      dims: ['critical', 'independence'] },

    { id: 'listen', type: 'listenDo', phase: 'understand', title: 'Listen & Do', narration: ['w3-understand'], mood: 'ready',
      prompt: 'Play the audio. Tap the actions in the order you hear them. Be careful: some actions are not in the audio.', clip: ['w3-do-01', 'w3-do-02', 'w3-do-03', 'w3-do-04', 'w3-do-05'],
      tiles: ['prepare', 'fry', 'mix', 'shape', 'chocolate', 'boil', 'roll'], answer: ['prepare', 'mix', 'shape', 'boil', 'roll'],
      align: { purpose: 'Follow spoken recipe steps in the correct order.', skill: 'Listening', competency: 'Follow oral instructions', feature: 'Cooking verbs (imperatives)' },
      dims: ['communication'] },

    { id: 'fix', type: 'fixSteps', phase: 'fix', title: 'Fix the Recipe', narration: ['w3-fix'], mood: 'think',
      prompt: 'Tap the recipe steps in the correct order. The sequence markers are your clues.', order: ['s1', 's2', 's3', 's4', 's5'],
      align: { purpose: 'Put mixed-up recipe steps in order.', skill: 'Reading', competency: 'Arrange steps logically', feature: 'Sequence markers' },
      dims: ['critical'] },

    { id: 'missing', type: 'missing', phase: 'fix', title: 'Missing Step', mood: 'think',
      line: 'Oh no! One step of the recipe is missing.',
      prompt: 'Which step goes in the gap?',
      steps: ['First, prepare the ingredients.', 'Next, mix the flour with water.', null, 'After that, boil the balls until they float.', 'Finally, roll them in grated coconut and serve.'],
      options: [{ text: 'Then, shape the dough and add palm sugar inside.', ok: true },
        { text: 'Then, fry the dough in hot oil.', ok: false, hint: 'Klepon is boiled, not fried.' },
        { text: 'Then, put the dough in the fridge for two days.', ok: false, hint: 'Klepon is quick and fresh.' }],
      okMsg: 'Yes! The palm sugar goes inside before you boil the balls.',
      align: { purpose: 'Complete a recipe with a missing step.', skill: 'Reading', competency: 'Complete missing instructions', feature: 'Sequence markers (then)' },
      dims: ['critical'] },

    { id: 'kitchen', type: 'dragDo', phase: 'do', title: 'Klepon Kitchen', mood: 'happy',
      line: 'Let’s cook! Follow the recipe with your hands.',
      prompt: 'Drag each thing to the right place. Or tap it, then tap where it goes.',
      scene: [
        { id: 'water', img: 'obj:glass', label: 'water', role: 'item' },
        { id: 'bowl', img: 'svg:flour', label: 'flour in a bowl', role: 'both' },
        { id: 'sugar', img: 'svg:palmSugar', label: 'palm sugar', role: 'item' },
        { id: 'pot', img: 'svg:pot', label: 'pot of hot water', role: 'both' },
        { id: 'plate', img: 'svg:coconut', label: 'grated coconut', role: 'target' }],
      steps: [
        { text: 'Mix the water with the flour.', item: 'water', target: 'bowl', done: 'Now you have soft dough.', fx: ['fade:water', 'swap:bowl=svg:bowl', 'label:bowl=soft dough'] },
        { text: 'Add palm sugar inside the dough.', item: 'sugar', target: 'bowl', done: 'Great! Sweet balls are ready.', fx: ['hide:sugar', 'swap:bowl=svg:dough', 'label:bowl=klepon balls'] },
        { text: 'Boil the balls until they float.', item: 'bowl', target: 'pot', done: 'Look! The balls float.', fx: ['hide:bowl', 'label:pot=balls float!'] },
        { text: 'Roll them in grated coconut.', item: 'pot', target: 'plate', done: 'Klepon is ready. Selamat makan!', fx: ['hide:pot', 'swap:plate=svg:klepon', 'label:plate=klepon!'] }],
      okMsg: 'You followed the recipe in the right order. You are a Nusantara chef!',
      align: { purpose: 'Carry out a recipe step by step.', skill: 'Reading', competency: 'Follow written instructions', feature: 'Cooking imperatives (mix, add, boil, roll)' },
      dims: ['creative', 'independence'] },

    { id: 'error', type: 'instructionError', phase: 'do', title: 'Recipe Check', mood: 'think',
      line: 'A friend wrote the recipe card. Can you fix the mistakes?',
      prompt: 'Tap the sentence with a mistake. Then choose the correct sentence.',
      rounds: [
        { lines: ['Prepare the ingredients.', 'Mixes the flour with water.', 'Boil the balls until they float.'], wrong: 1,
          options: [{ t: 'Mix the flour with water.', ok: true }, { t: 'Mixing the flour with water.', ok: false }, { t: 'Mixed the flour with water.', ok: false }],
          rule: 'A recipe step starts with the base verb: Mix.' },
        { lines: ['Shape the dough.', 'You should rolling them in coconut.', 'Serve the klepon.'], wrong: 1,
          options: [{ t: 'Rolls them in coconut.', ok: false }, { t: 'Roll them in coconut.', ok: true }, { t: 'Rolled them in coconut.', ok: false }],
          rule: 'Use the base verb: Roll them in coconut.' }],
      align: { purpose: 'Correct grammar mistakes in a recipe.', skill: 'Writing', competency: 'Detect and correct incorrect instructions', feature: 'Imperative = base verb' },
      dims: ['communication'] },

    { id: 'decide', type: 'decision', phase: 'do', title: 'Real-Life Decision', mood: 'think', clip: 'sit-w3-papeda',
      line: 'Food brings people together. What would you say?',
      situation: 'A new friend from Papua brings papeda to class. Papeda is a sago porridge. It looks different from your food. What do you say?',
      options: [
        { text: '“Wow, what is it? Can you tell me how to make it?”', best: true, fb: 'Every recipe tells a story about people, places and culture.' },
        { text: '“Eww, that looks strange.”', best: false, fb: 'Those words can hurt. Different food is part of our rich culture.' },
        { text: 'Say nothing and move away.', best: false, fb: 'Your friend may feel alone. A friendly question helps.' }],
      align: { purpose: 'Respect food from other Indonesian cultures.', skill: 'Reading / Listening', competency: 'Respond respectfully using polite questions', feature: 'Questions: What is it? Can you tell me…?' },
      dims: ['citizenship', 'faith'] },

    { id: 'build', type: 'build', phase: 'create', title: 'Write a Recipe Card', narration: ['w3-create'], mood: 'happy',
      prompt: 'Choose a goal, pick 3–5 steps in order, then add sequence markers.',
      goals: ['How to Make Klepon', 'How to Fry Klepon', 'How to Make Fried Rice'], goalAnswer: 0,
      goalMsg: 'Check your goal. Which recipe did we cook?', badStepMsg: 'One step is not in the klepon recipe. Remove it and try again.',
      bank: [
        { t: 'wash your hands.', ok: true }, { t: 'prepare the ingredients.', ok: true }, { t: 'mix the flour with water.', ok: true },
        { t: 'shape the dough and add palm sugar inside.', ok: true }, { t: 'boil the balls until they float.', ok: true },
        { t: 'roll them in grated coconut and serve.', ok: true }, { t: 'fry the balls in hot oil.', ok: false }, { t: 'add salt and cheese.', ok: false }],
      align: { purpose: 'Create your own recipe card.', skill: 'Writing', competency: 'Create a procedure text (goal + steps)', feature: 'Goal + cooking imperatives + sequence markers' },
      dims: ['creative', 'citizenship'] },

    { id: 'present', type: 'present', phase: 'create', title: 'Tell Your Recipe', mood: 'happy',
      line: 'Read your recipe aloud. Imagine you are a chef on TV!',
      prompt: 'Listen to your recipe, then read it aloud yourself.',
      checks: ['I read every step aloud.', 'I used sequence markers.', 'I said the food names clearly.'],
      align: { purpose: 'Present a recipe aloud.', skill: 'Speaking', competency: 'Present instructions orally', feature: 'Simple and compound sentences (and)' },
      dims: ['communication'] }
  ]
};
