/* ARGUE YO! — CASE 05: SCHOOL UNIFORMS  (see case1.js for the data conventions) */
(window.ARGUE_CASES = window.ARGUE_CASES || []).push({
  id: 'uniform', no: 5, title: 'SCHOOL UNIFORMS',
  question: 'Should students wear school uniforms?',
  emoji: '👔', prop: null, bg: 'school', guide: 'arka',
  brief: "Uniform or no uniform? The Student Council wants clear arguments, not just opinions. Let's open the case!",
  textTitle: 'Students Should Wear School Uniforms',
  thesis: {
    issue: 'In many schools, students wear a uniform every day. Some students like this rule, but others want to wear their own clothes. It is a popular topic for debate, and many students have strong opinions about it.',
    position: 'I believe students should wear school uniforms.'
  },
  args: [
    { conn: 'First', claim: 'uniforms make students feel equal.',
      detail: 'Students wear the same clothes, {{gap}} nobody feels better or worse because of expensive clothes. This makes it easier for students from different families to become friends.',
      gap: { answer: 'so', options: ['so', 'because', 'however'], why: "'So' shows a result. The same clothes lead to feeling equal." },
      why: 'It shows how uniforms help students treat each other as equals.' },
    { conn: 'Moreover', claim: 'uniforms save time and money.',
      detail: 'Students do not need to think about what to wear every morning. Getting ready is faster, and parents do not need to buy many new clothes. This gives students more time for breakfast and study.',
      why: 'It gives practical benefits for students and families.' },
    { conn: 'Furthermore', claim: 'uniforms help students feel part of the school.',
      detail: 'When students wear the same uniform, they feel like one team. Uniforms also show that we belong to the same school, and many students feel proud to wear them on school trips.',
      why: 'It explains how uniforms build a sense of community.' }
  ],
  rec: {
    lead: 'Therefore', main: 'schools {{modal}} keep school uniforms and make them comfortable.',
    extra: 'Students should also give ideas about the colours and the style. A good uniform can make school life easier and fairer, and students will feel proud of their school.',
    modal: { answer: 'should', options: ['should', 'should not', 'cannot'], why: "'Should' gives advice. It matches the writer's position." }
  },
  distract: [
    { t: 'Some uniforms are blue and white.', kind: 'irrelevant' },
    { t: 'Some students have a favourite colour.', kind: 'irrelevant' },
    { t: 'Students can show their personality through their clothes.', kind: 'opposite',
      why: 'This may be true, but it supports the other side. The thesis says students should wear uniforms.' },
    { t: 'Clothes are part of everyday life.', kind: 'vague' },
    { t: 'Schools should ask students about uniform colours.', kind: 'rec' }
  ],
  thesisAlt: [
    { t: 'Many students wear a uniform to school every day.', kind: 'nopos' },
    { t: 'Students should wear any clothes they like to school.', kind: 'opposite' }
  ],
  detailAlt: [
    'Some uniforms have a small badge on the pocket.',
    'Many schools keep their uniforms in a shop near the gate.',
    'Some students wear a hat on sunny days.'
  ],
  recAlt: [
    { t: 'Therefore, schools should have a new gate for every class.', kind: 'irrelevant' },
    { t: 'Clothes are very important for young people.', kind: 'arg' }
  ],
  debate: [
    { who: 'sinta', says: 'But uniforms stop students from showing their personality.',
      opts: [
        ['However, students can still show their personality through their ideas and hobbies. Clothes are not the only way.', "'However' introduces a contrast, and the answer shows other ways to express personality."],
        ['Many uniforms have a school badge on the pocket. The badge shows the name of the school and the year.', 'This is true, but it does not answer her point about personality.'],
        ['Personality is very important for young people. Everyone should be able to be themselves at school.', 'This agrees with Sinta. It does not support the thesis.'],
        ['However, some students do not like the colour of their uniform. They want a new colour every year.', "This uses 'However', but it agrees with Sinta. It does not answer her point."]
      ] },
    { who: 'dika', says: 'Uniforms are expensive. Some families cannot buy them.',
      opts: [
        ['That can be a problem. However, one uniform can be worn many times, and schools can help families who need support.', 'It accepts the worry and answers it with a reason and a solution.'],
        ['Some uniforms are blue and white, and others are brown. Every school chooses its own colours for its students.', "This is true, but it does not answer Dika's point about price."],
        ['Families should always save their money. They can buy only the things that they really need and use.', 'This is advice, not an answer to the problem.'],
        ['Not every family has the same income. Some families have to be very careful with their money.', 'This agrees with Dika. It does not support the thesis.']
      ] },
    { who: 'nadia', says: 'Uniforms are uncomfortable, especially on hot days.',
      opts: [
        ['However, schools can choose light, comfortable clothes for hot weather. Students can also give design ideas.', 'It answers the worry with a clear solution: better design.'],
        ['Hot weather is common in many places. In some countries it is hot for most of the year, even at night.', 'This is true, but it does not answer her point.'],
        ['I feel comfortable in my uniform every day. I wear it from Monday to Friday, and I do not feel hot.', 'This is a personal example. It does not answer her point about comfort in general.'],
        ['However, uniforms are usually clean and neat. Teachers like to see students in a tidy uniform.', "This uses 'However', but it is not connected to comfort on hot days."]
      ] }
  ],
  reading: [
    { type: 'purpose', q: 'Why did the writer write this text?',
      opts: [['To persuade readers that students should wear uniforms', 'The writer gives reasons and advice to persuade.'], ['To describe a school trip and what students saw', 'A school trip is only a small detail.'], ['To explain how to make a school uniform at home', 'The text does not explain how to make clothes.'], ['To compare two famous schools in the country', 'The text does not compare schools.']] },
    { type: 'mainIdea', q: 'What is the main idea of the text?',
      opts: [['Students should wear school uniforms because uniforms bring equality, savings, and team spirit.', 'This is the writer’s position and main reasons.'], ['Students should choose any clothes they like because clothes show personality.', 'This is the opposite of the writer’s position.'], ['Uniforms are useful only on school trips because they help teachers count students.', 'The writer gives many other reasons.'], ['Parents should buy expensive clothes for school because they look better.', 'The writer says uniforms save money.']] },
    { type: 'inference', q: 'What can we infer from the text?',
      opts: [['The writer thinks uniforms can help students from different families get along.', 'The writer says uniforms make it easier to become friends.'], ['The writer thinks all schools in the country must use the same uniform.', 'The text does not say this.'], ['The writer thinks students from rich families dislike uniforms.', 'The text does not say this.'], ['The writer does not want students to give any ideas about the uniform.', 'The writer says students should give ideas.']] },
    { type: 'reference', q: 'In the first paragraph, “this rule” in “Some students like this rule” refers to …',
      opts: [['wearing a uniform every day', 'The sentence before says students wear a uniform every day.'], ['wearing their own clothes to school', 'This is what other students want.'], ['learning about debate in class', 'The debate is mentioned in the next sentence.'], ['going to school every morning', 'The rule is about clothes, not going to school.']] },
    { type: 'evidence', q: 'Which detail supports the argument that uniforms save time and money?',
      opts: [['Getting ready is faster, and parents do not need to buy many new clothes.', 'This gives a time reason and a money reason.'], ['Students wear the same clothes, so nobody feels better or worse.', 'This supports the argument about equality.'], ['When students wear the same uniform, they feel like one team.', 'This supports the argument about belonging.'], ['Uniforms also show that we belong to the same school.', 'This supports the argument about belonging.']] },
    { type: 'summary', q: 'Which sentence is the best summary of the text?',
      opts: [['The writer says students should wear uniforms because they bring equality, save money, and build team spirit.', 'It includes the position and the three arguments.'], ['The writer says uniforms are a bad idea because they are uncomfortable and expensive for families.', 'This is the opposite of the writer’s position.'], ['The writer says students should wear uniforms only on school trips and on special days of the school year.', 'The text does not say this.'], ['The writer describes the colours and styles of uniforms in different schools in the city and in other countries.', 'The text does not describe colours and styles.']] },
    { type: 'recommendation', q: 'What does the writer recommend about the design of the uniform?',
      opts: [['Schools should make it comfortable and ask students for ideas', 'This is in the recommendation paragraph.'], ['Schools should use the most expensive material for the best quality', 'The writer does not say this.'], ['Students should design the new uniform alone without any help', 'The writer says students should give ideas, not decide alone.'], ['Schools should use only one colour for every year and every class', 'The text does not say this.']] }
  ]
});
