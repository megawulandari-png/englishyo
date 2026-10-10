/* ARGUE YO! — CASE 06: GREEN TRAVEL  (see case1.js for the data conventions) */
(window.ARGUE_CASES = window.ARGUE_CASES || []).push({
  id: 'travel', no: 6, title: 'GREEN TRAVEL',
  question: 'Should students cycle or use greener transport to school?',
  emoji: '🚲', prop: null, bg: 'park', guide: 'nadia',
  brief: "Every morning the road to school is full of cars. Can we show a greener way? Build the case with me, then face the final debate.",
  textTitle: 'Students Should Use Greener Transport to School',
  thesis: {
    issue: 'Every morning, many students go to school by car or motorbike. The road in front of the school is full of traffic, and the air smells of smoke.',
    position: 'In my opinion, students should use greener transport, such as walking, cycling, or the bus, when they can.'
  },
  args: [
    { conn: 'First', claim: 'greener transport reduces air pollution.',
      detail: 'The air near the school is dirty in the morning {{gap}} many cars and motorbikes produce smoke. Breathing dirty air is bad for everyone, especially for young people.',
      gap: { answer: 'because', options: ['because', 'so', 'however'], why: "'Because' gives the reason why the air is dirty." },
      why: 'It shows a clear problem that the school community can reduce.' },
    { conn: 'Moreover', claim: 'walking and cycling are good exercise.',
      detail: 'Students who walk or cycle get some exercise before class. They often feel more awake and ready to learn.',
      why: 'It shows a health and learning benefit for each student.' },
    { conn: 'Furthermore', claim: 'greener transport can save money.',
      detail: 'Petrol costs money every week, but a bicycle needs very little after you buy it. Walking is free, and the bus is often cheaper than going by car. Saving money is important for many families.',
      why: 'It gives a money reason that families care about.' }
  ],
  rec: {
    lead: 'Therefore', main: 'students {{modal}} choose greener transport when they can, for example when the distance is short and the road is safe.',
    extra: 'Schools should also provide safe bicycle parking. Every short trip without a car or motorbike can help make our city cleaner.',
    modal: { answer: 'should', options: ['should', 'should not', 'cannot'], why: "'Should' gives advice. It matches the writer's position." }
  },
  distract: [
    { t: 'Some bicycles are red and blue.', kind: 'irrelevant' },
    { t: 'Many students listen to music on the way to school.', kind: 'irrelevant' },
    { t: 'Cars are faster and more comfortable on hot days.', kind: 'opposite',
      why: 'This may be true, but it supports the other side. The thesis says students should use greener transport.' },
    { t: 'Transport is important in a big city.', kind: 'vague' },
    { t: 'Schools should build bicycle parking.', kind: 'rec' }
  ],
  thesisAlt: [
    { t: 'Students use different kinds of transport to get to school.', kind: 'nopos' },
    { t: 'Students should always go to school by car.', kind: 'opposite' }
  ],
  detailAlt: [
    'The school gate opens at six thirty every morning.',
    'Some buses have pictures of cartoon animals.',
    'Many students carry heavy bags to school.'
  ],
  recAlt: [
    { t: 'Therefore, schools should change the colour of the school gate.', kind: 'irrelevant' },
    { t: 'Many families own a car or a motorbike.', kind: 'arg' }
  ],
  debate: [
    { who: 'dika', says: 'But my house is far from school. I cannot cycle for an hour.',
      opts: [
        ['That is true for long distances. However, students who live near the school can walk or cycle, and others can use the bus.', 'It accepts the problem and answers it: the recommendation is for short trips and public transport.'],
        ['Some students live very far from school. For them the journey takes more than an hour, even by motorbike.', 'This agrees with Dika. It does not support the thesis.'],
        ['Buses are sometimes late in the morning. Many students wait a long time at the bus stop every day.', "This supports Dika's worry. It does not answer it."],
        ['However, I like to walk in the park near my house. It is quiet, the air is fresh in the morning, and I often walk with my friends.', "This uses 'However', but it is a personal example. It does not answer the problem of long distances."]
      ] },
    { who: 'sinta', says: 'The roads are dangerous for cyclists. I prefer to go by car.',
      opts: [
        ['Safety is important. However, cyclists can wear helmets, and schools can ask for safe bike paths.', "It takes Sinta's worry seriously and gives practical solutions."],
        ['Roads are busy in many cities. Some roads have a lot of cars and trucks in the morning.', 'This is true, but it does not answer the safety problem.'],
        ['Helmets are available in many colours. Some helmets are cheap, and others are expensive.', 'This is true, but it does not answer the safety problem.'],
        ['However, many people have a car at home. It is normal for students to go to school in a car.', "This uses 'However', but it does not answer Sinta's point about safety."]
      ] },
    { who: 'arka', says: 'One student on a bicycle will not change anything.',
      opts: [
        ['However, small actions can grow. If many students choose greener transport, the air can improve.', "'However' introduces a contrast, and the answer explains how many small actions can change a lot."],
        ['Students cannot change the world. Only governments and big companies can do that, so we should not try.', 'This agrees with Arka. It does not support the thesis.'],
        ['Bicycles are quiet and easy to park. They do not make any noise on the road, and they are small.', 'This is true, but it does not answer his point about change.'],
        ['I cycle to school every day. It takes me only ten minutes to arrive, and I enjoy it.', 'This is a personal example. It does not give a reason that answers his point.']
      ] }
  ],
  reading: [
    { type: 'purpose', q: 'Why did the writer write this text?',
      opts: [['To persuade students to use greener transport', 'The writer gives reasons and advice to persuade.'], ['To describe a bicycle and its different parts', 'The text is not a description of a bicycle.'], ['To tell a story about a traffic accident near school', 'The text does not tell a story.'], ['To explain how a bus engine works in a city', 'The text does not explain how engines work.']] },
    { type: 'mainIdea', q: 'What is the main idea of the text?',
      opts: [['Students should walk, cycle, or use the bus when they can because it is better for everyone.', 'This is the writer’s position and main reasons.'], ['Students should never go to school by car because cars are always dangerous and noisy.', 'The writer says “when they can”, not “never”.'], ['The bus is the only good way to travel because it is cheap, fast, and safe for everyone.', 'The writer also talks about walking and cycling.'], ['Petrol is cheap for most families, so students should go by motorbike every day.', 'The writer says petrol costs money every week.']] },
    { type: 'inference', q: 'What can we infer from the text?',
      opts: [['Fewer cars near the school could make the morning air cleaner.', 'The writer says cars and motorbikes produce smoke.'], ['Students who cycle to school are always late for the first lesson.', 'The text does not say this.'], ['The writer thinks every trip should be made by bicycle, even long ones.', 'The writer says students should choose greener transport only “when they can”.'], ['Children do not mind breathing dirty air in the morning.', 'The writer says dirty air is bad, especially for children.']] },
    { type: 'reference', q: 'In the third paragraph, “They” in “They often feel more awake” refers to …',
      opts: [['students who walk or cycle', '“They” means the students in the sentence before.'], ['the bodies of the students', 'Bodies do not feel awake in this sentence.'], ['the cars and motorbikes', 'The vehicles are in the second paragraph.'], ['the teachers at school', 'Teachers are not mentioned.']] },
    { type: 'evidence', q: 'Which detail supports the argument that greener transport can save money?',
      opts: [['A bicycle needs very little after you buy it, and walking is free.', 'This compares the costs of different ways to travel.'], ['Many cars and motorbikes produce smoke near the school gate.', 'This supports the argument about air pollution.'], ['They often feel more awake and ready to learn in class.', 'This supports the argument about exercise.'], ['Breathing dirty air is bad for everyone, especially for children.', 'This supports the argument about air pollution.']] },
    { type: 'summary', q: 'Which sentence is the best summary of the text?',
      opts: [['The writer says students should use greener transport because it cleans the air, helps health, and saves money.', 'It includes the position and the three arguments.'], ['The writer says students should buy a car because roads near the school are dangerous for children.', 'This is the opposite of the writer’s position.'], ['The writer says the roads near the school are too busy, so the school should build a bigger car park.', 'The text does not say this.'], ['The writer describes the traffic in front of a school and how the air smells in the morning.', 'This is only the beginning of the text.']] },
    { type: 'recommendation', q: 'What should schools also provide?',
      opts: [['Safe bicycle parking', 'This is in the recommendation paragraph.'], ['Free petrol for parents', 'This is the opposite of the recommendation.'], ['A new road for cars', 'This is not what the writer recommends.'], ['Longer school days', 'This is not mentioned in the text.']] }
  ]
});
