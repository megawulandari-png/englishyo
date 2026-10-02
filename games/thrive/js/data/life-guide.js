/* FINAL MISSION — Create Your Life Guide: topic banks (A2). Learners may also write their own goal, materials and steps.
 * world: which world icon represents the topic. */
window.THRIVE = window.THRIVE || {};
THRIVE.lifeGuide = {
  topics: [
    { key: 'health', name: 'Health', world: 1,
      goals: ['How to Wash Your Hands Properly', 'How to Prepare a Healthy Lunch', 'How to Sleep Well Before a Test'],
      materials: ['soap', 'water', 'a clean towel', 'a lunchbox', 'fruit', 'vegetables'],
      steps: ['wet your hands with water.', 'put soap on your hands.', 'rub your hands for twenty seconds.', 'rinse your hands with clean water.', 'dry your hands with a clean towel.',
        'choose fruit and vegetables.', 'put your phone away one hour before bed.', 'go to bed early.'] },
    { key: 'digital', name: 'Digital Life', world: 2,
      goals: ['How to Create a Strong Password', 'How to Check Information Before Sharing It', 'How to Respond to an Unsafe Message'],
      materials: ['a phone', 'a laptop'],
      steps: ['use letters, numbers and symbols.', 'do not use your name or birthday.', 'keep your password secret.', 'read the whole message carefully.',
        'check the information on a trusted website.', 'do not share it if it is not true.', 'block the sender.', 'tell a parent or teacher.'] },
    { key: 'food', name: 'Food', world: 3,
      goals: ['How to Make Wedang Uwuh', 'How to Make Gado-Gado', 'How to Make Fruit Salad'],
      materials: ['hot water', 'spices', 'a glass', 'vegetables', 'peanut sauce', 'a plate', 'fruit', 'a bowl'],
      steps: ['wash your hands.', 'put the spices in a glass.', 'pour hot water carefully.', 'wait five minutes.', 'boil the vegetables.',
        'cut the fruit into small pieces.', 'put the vegetables on a plate.', 'pour the peanut sauce on top.', 'serve it with a smile.'] },
    { key: 'friendship', name: 'Friendship', world: 4,
      goals: ['How to Welcome a New Student', 'How to Be a Good Listener', 'How to Solve a Small Disagreement'],
      materials: [],
      steps: ['smile and say hello.', 'tell them your name.', 'show them the classroom.', 'look at your friend when they speak.', 'do not interrupt.',
        'ask a friendly question.', 'say sorry if you are wrong.', 'find a solution together.'] },
    { key: 'environment', name: 'Environment', world: 5,
      goals: ['How to Save Water at School', 'How to Organise a Clean-Up', 'How to Take Care of a Plant'],
      materials: ['gloves', 'rubbish bags', 'a watering can', 'a plant'],
      steps: ['turn off the tap after you use it.', 'tell an adult about a leaking tap.', 'wear gloves.', 'pick up the rubbish.', 'sort the rubbish into bins.',
        'water the plant in the morning.', 'put the plant in the sun.', 'wash your hands after you finish.'] },
    { key: 'school', name: 'School Life', world: 6,
      goals: ['How to Borrow a Library Book', 'How to Prepare for a Presentation', 'How to Use a Classroom Device'],
      materials: ['a library card', 'a book', 'notes', 'a laptop'],
      steps: ['choose a book.', 'show your library card.', 'return the book on time.', 'practise in front of a mirror.', 'speak slowly and clearly.',
        'look at your audience.', 'ask the teacher before you use it.', 'turn it off after you use it.'] },
    { key: 'safety', name: 'Safety', world: 6,
      goals: ['How to Prepare an Emergency Bag', 'How to Cross the Road Safely', 'What to Do in a Fire Drill'],
      materials: ['a bag', 'water', 'a torch', 'a first-aid kit', 'snacks'],
      steps: ['put water and snacks in the bag.', 'add a torch and a first-aid kit.', 'keep the bag near the door.', 'stop and look left and right.',
        'cross at the zebra crossing.', 'walk, do not run.', 'leave your things.', 'follow the teacher to the meeting point.'] }
  ],
  /* first words accepted for a learner’s own step (imperative verbs + Do not / Don’t) */
  verbs: ['add', 'ask', 'avoid', 'be', 'block', 'boil', 'bring', 'brush', 'call', 'check', 'choose', 'clean', 'close', 'collect', 'cook', 'cover', 'cross', 'cut', 'decide', 'do', "don't",
    'drink', 'dry', 'eat', 'fill', 'find', 'finish', 'fold', 'follow', 'get', 'give', 'go', 'help', 'hold', 'invite', 'keep', 'leave', 'listen', 'look', 'make', 'mix', 'move', 'open',
    'pick', 'place', 'plan', 'pour', 'practise', 'practice', 'prepare', 'press', 'protect', 'put', 'read', 'remember', 'remove', 'respect', 'return', 'rinse', 'roll', 'rub', 'say',
    'scan', 'serve', 'shape', 'share', 'show', 'sit', 'sleep', 'smile', 'sort', 'speak', 'stand', 'start', 'stay', 'stir', 'stop', 'stretch', 'take', 'talk', 'tell', 'thank', 'throw',
    'touch', 'try', 'turn', 'type', 'use', 'wait', 'walk', 'wash', 'watch', 'water', 'wear', 'wet', 'write']
};
