/* ARGUE YO! — CASE 03: HEALTHY CANTEEN  (see case1.js for the data conventions) */
(window.ARGUE_CASES = window.ARGUE_CASES || []).push({
  id: 'canteen', no: 3, title: 'HEALTHY CANTEEN',
  question: 'Should schools limit unhealthy food?',
  emoji: '🥗', prop: null, bg: 'cafeteria', guide: 'sinta',
  brief: "Look at our canteen! Fried snacks and sweet drinks are everywhere. Can we convince the Student Council to change it?",
  textTitle: 'Schools Should Limit Unhealthy Food',
  thesis: {
    issue: 'Many school canteens sell fried snacks, sweet drinks, and candy. These foods have a lot of sugar and fat. Students buy them because they are cheap, tasty, and easy to find.',
    position: 'I think schools should limit unhealthy food in the canteen.'
  },
  args: [
    { conn: 'First', claim: "sweet and fried snacks can harm students' health.",
      detail: 'Many students eat sweet snacks every day, {{gap}} they can get tooth problems and gain too much weight. These problems can continue when they become adults.',
      gap: { answer: 'so', options: ['so', 'because', 'however'], why: "'So' shows a result. Eating sweet snacks every day leads to health problems." },
      why: 'It shows a clear health problem caused by unhealthy food.' },
    { conn: 'Moreover', claim: 'healthy food helps students learn better.',
      detail: 'A student who eats rice, vegetables, and fruit has more energy in class. After a sugary snack, many students feel sleepy and cannot concentrate. Good food helps the brain and the body to work well.',
      why: 'It connects food with learning, which is the main job of a school.' },
    { conn: 'Furthermore', claim: 'school is a good place to learn healthy habits.',
      detail: 'Students eat at school almost every day. If the canteen sells healthy food, they will learn to make better choices, and they may keep these habits at home.',
      why: 'It explains why the school, not only the family, has a role.' }
  ],
  rec: {
    lead: 'Therefore', main: 'schools {{modal}} sell sugary drinks and fried snacks every day.',
    extra: 'Instead, they should offer fruit, vegetables, and water at low prices. Healthy food can be tasty, too, and students will feel better.',
    modal: { answer: 'should not', options: ['should', 'should not', 'can'], why: "'Should not' advises against something. The writer wants schools to limit unhealthy food." }
  },
  distract: [
    { t: 'The canteen is next to the library.', kind: 'irrelevant' },
    { t: 'Many students bring money to school.', kind: 'irrelevant' },
    { t: 'Students are happy when they can buy their favourite snacks.', kind: 'opposite',
      why: 'This may be true, but it supports the other side. The thesis says schools should limit unhealthy food.' },
    { t: 'Food is important for everyone.', kind: 'vague' },
    { t: 'Schools should sell more fruit.', kind: 'rec' }
  ],
  thesisAlt: [
    { t: 'The school canteen sells many kinds of food and drinks.', kind: 'nopos' },
    { t: 'Schools should sell any food that students like.', kind: 'opposite' }
  ],
  detailAlt: [
    'Some canteens have long tables, and others have small tables.',
    'Many canteens open early in the morning.',
    'Food in the canteen is served on plastic plates.'
  ],
  recAlt: [
    { t: 'Therefore, schools should close the canteen on Fridays.', kind: 'irrelevant' },
    { t: 'Students need food to stay alive.', kind: 'arg' }
  ],
  debate: [
    { who: 'arka', says: 'But students like fried snacks. If we limit them, nobody will buy food at the canteen.',
      opts: [
        ['However, healthy food can be tasty, too. Students can still enjoy the canteen, and they will eat better.', "'However' introduces a contrast. The sentence answers Arka's worry: the canteen can stay popular with healthier food."],
        ['Fried snacks are very popular in many countries. People have enjoyed them for many years.', "This supports Arka's side. It does not answer his worry."],
        ['I do not eat at the canteen very often. I usually bring my lunch from home.', 'This is a personal example. It does not give a reason.'],
        ['However, the canteen is always full at break time. Students wait in a long line for their food.', "This uses 'However', but it does not answer the point about limiting snacks."]
      ] },
    { who: 'dika', says: 'Healthy food is more expensive. Many students cannot pay for it.',
      opts: [
        ['That can be a problem. However, schools can choose cheap healthy food, such as bananas, rice, and eggs.', 'It accepts the worry and answers it with a practical idea.'],
        ['Money is very important for students. Many of them have to be careful with their money.', 'This agrees with Dika, but it does not answer his point.'],
        ['Some students get a lot of pocket money. They can buy anything they want at school.', "This does not help students who cannot pay, so it does not answer Dika's point."],
        ['However, healthy food is sold in many supermarkets. You can find it in every big city.', "This uses 'However', but it does not talk about the price."]
      ] },
    { who: 'nadia', says: "Students should choose for themselves. It is not the school's job.",
      opts: [
        ['School also teaches healthy habits. Students can still choose, but all the choices are healthier.', "It answers Nadia's point: the school helps, and students still choose."],
        ['Students never listen to the school anyway. They only do what their friends do.', 'This is not true for everyone, and it does not support the thesis.'],
        ['Parents should cook healthy food for students at home. That is where students learn best.', 'This moves the problem to another place. It does not answer Nadia.'],
        ['However, some students choose to eat nothing at break time. This is also bad for their health.', "This uses 'However', but it is a different problem and does not answer her point."]
      ] }
  ],
  reading: [
    { type: 'purpose', q: 'Why did the writer write this text?',
      opts: [['To persuade schools to sell less unhealthy food', 'The writer gives reasons and advice to persuade.'], ['To describe the writer’s favourite snack and drink', 'The text is not about the writer’s favourite food.'], ['To explain how to cook rice and vegetables', 'The text does not give cooking instructions.'], ['To report a news story about a school canteen', 'The text gives opinions and advice, not news.']] },
    { type: 'mainIdea', q: 'What is the main idea of the text?',
      opts: [['Schools should limit unhealthy food because healthy food is better for students.', 'This is the writer’s position and main reason.'], ['Students should stop eating at school because canteens are not safe.', 'The writer wants healthier food at school, not no food.'], ['Canteens should sell only candy and drinks because students like them.', 'This is the opposite of the writer’s position.'], ['Healthy food is always too expensive, so schools cannot offer it.', 'The writer says schools can offer healthy food at low prices.']] },
    { type: 'inference', q: 'What can we infer from the text?',
      opts: [['Students may eat better at home if they learn healthy habits at school.', 'The writer says students may keep these habits at home.'], ['Students do not like fruit or vegetables, so they never buy them.', 'The text does not say this.'], ['All students in the school already have tooth problems and weight problems.', 'The writer says “can get”, not “all have”.'], ['Teachers choose the food that students eat at home every day.', 'The text does not say this.']] },
    { type: 'reference', q: 'In the second paragraph, “These problems” refers to …',
      opts: [['tooth problems and gaining too much weight', 'These are the problems named in the sentence before.'], ['eating sweet snacks every day at school', 'The snacks are the cause, not the problems.'], ['becoming adults and finding a job later', 'This is when the problems can continue.'], ['learning healthy habits in the classroom', 'This is mentioned in a later paragraph.']] },
    { type: 'evidence', q: 'Which detail supports the argument that healthy food helps students learn better?',
      opts: [['After a sugary snack, many students feel sleepy and cannot concentrate.', 'This shows how food affects learning.'], ['Many students eat sweet snacks every day and gain too much weight.', 'This supports the argument about health.'], ['Students eat at school almost every day, so the canteen matters a lot.', 'This supports the argument about habits.'], ['Healthy habits at school may continue at home when students grow up.', 'This supports the argument about habits.']] },
    { type: 'summary', q: 'Which sentence is the best summary of the text?',
      opts: [['The writer says schools should limit unhealthy food because it harms health, learning, and habits.', 'It includes the position and the three arguments.'], ['The writer says students should bring food from home every day because canteen food is expensive.', 'The text does not say this.'], ['The writer says sweet snacks are good for students because they give energy for class.', 'The writer says sweet snacks make students sleepy.'], ['The writer describes the different foods that students can buy in a school canteen.', 'This is only the beginning of the text.']] },
    { type: 'recommendation', q: 'What should schools offer instead of unhealthy food?',
      opts: [['Fruit, vegetables, and water at low prices', 'This is in the recommendation paragraph.'], ['Bigger plates and longer breaks for eating', 'The text does not suggest this.'], ['Free candy for all students at break time', 'This is the opposite of the recommendation.'], ['Fried snacks with a healthy name on the menu', 'The text does not suggest this.']] }
  ]
});
