/* ARGUE YO! — CASE 02: PLASTIC WASTE  (see case1.js for the data conventions) */
(window.ARGUE_CASES = window.ARGUE_CASES || []).push({
  id: 'plastic', no: 2, title: 'PLASTIC WASTE',
  question: 'Should schools reduce single-use plastic?',
  emoji: '♻️', prop: 'bottle', bg: 'hall', guide: 'nadia',
  brief: "Our school throws away so much plastic every day. Help me build a case for the Student Council.",
  textTitle: 'Schools Should Reduce Single-Use Plastic',
  thesis: {
    issue: 'Every day, students throw away many plastic bottles, bags, and cups at school. This is called single-use plastic because people use it only once. The waste is growing fast.',
    position: 'I believe schools should reduce single-use plastic.'
  },
  args: [
    { conn: 'First', claim: 'plastic waste can pollute the school environment.',
      detail: 'Bottles and bags often end up on the ground, in the drains, or in the river near the school. They make the place dirty and can be dangerous for animals.',
      why: 'It shows how plastic harms the place where students study.' },
    { conn: 'Moreover', claim: 'plastic stays in nature for a very long time.',
      detail: 'A plastic bottle can stay in the ground for hundreds of years {{gap}} it breaks down very slowly. This means the plastic we throw away today will still be here when our children go to school.',
      gap: { answer: 'because', options: ['because', 'so', 'however'], why: "'Because' gives the reason why the bottle stays for so long." },
      why: 'It gives a long-term reason: plastic does not disappear.' },
    { conn: 'Furthermore', claim: 'reusable bottles and lunch boxes save money.',
      detail: 'A reusable bottle can be used many times, but a student must buy a new plastic bottle every day. After a few weeks, the reusable bottle is cheaper.',
      why: 'It gives a money reason that students and parents care about.' }
  ],
  rec: {
    lead: 'Therefore', main: 'schools {{modal}} encourage students to bring reusable bottles and lunch boxes.',
    extra: 'Schools should also put a water refill station near the canteen. Small actions at school can protect our environment.',
    modal: { answer: 'should', options: ['should', 'should not', 'cannot'], why: "'Should' gives advice. It matches the writer's position." }
  },
  distract: [
    { t: 'Plastic bottles come in many colours.', kind: 'irrelevant' },
    { t: 'Many students like cold drinks at break time.', kind: 'irrelevant' },
    { t: 'Plastic bottles are cheap and easy to buy.', kind: 'opposite',
      why: 'This may be true, but it supports the other side. The thesis says schools should reduce single-use plastic.' },
    { t: 'Plastic is everywhere.', kind: 'vague' },
    { t: 'Students should bring their own bottles.', kind: 'rec' }
  ],
  thesisAlt: [
    { t: 'Students use plastic bottles and bags at school every day.', kind: 'nopos' },
    { t: 'Schools should not change anything about plastic.', kind: 'opposite' }
  ],
  detailAlt: [
    'Some plastic bags have a picture of a flower.',
    'Many shops give a plastic bag for every small thing.',
    'Bottled water comes from many different companies.'
  ],
  recAlt: [
    { t: 'Therefore, schools should paint the canteen walls blue.', kind: 'irrelevant' },
    { t: 'Plastic is a cheap and light material.', kind: 'arg' }
  ],
  debate: [
    { who: 'sinta', says: 'But plastic bottles are cheap and easy to buy.',
      opts: [
        ['However, reusable bottles can be used many times and create less waste. In the end, they save money, too.', "'However' introduces a contrasting idea, and the sentence directly answers Sinta's argument."],
        ['Plastic bottles come in many colours and sizes. Some of them even have pictures of cartoon animals on them.', "This may be true, but it does not answer Sinta's point about price."],
        ['I have a reusable bottle at home. I use it every day, and I take it to school and to sports practice.', "This is a personal example. It does not answer Sinta's argument."],
        ['Many shops sell different kinds of drinks. Some drinks come in glass bottles, and others come in cans or in paper boxes.', "This is not connected to Sinta's point about plastic bottles."]
      ] },
    { who: 'dika', says: 'Reusable bottles are hard to clean. Students will forget them.',
      opts: [
        ['However, washing a bottle takes only a minute. A refill station at school makes it easy to use every day.', 'It answers the cleaning worry (washing is quick) and shows that using a bottle every day can be easy.'],
        ['Plastic bottles are also hard to recycle. Most of them end up as waste in the end.', "This is a new point. It does not answer Dika's worry about cleaning and forgetting."],
        ['Students forget many things at school. Sometimes they forget their books and pens, too.', 'This agrees with Dika. It does not support the thesis.'],
        ['However, some students never drink water at school. They buy sweet drinks instead.', "This uses 'However', but it is not connected to Dika's point."]
      ] },
    { who: 'arka', says: 'Recycling is enough. We can recycle plastic instead of using less.',
      opts: [
        ['Recycling helps, but not all plastic can be recycled. Using less plastic stops the problem at the start.', "It answers Arka's point directly: recycling has limits, and using less solves the problem earlier."],
        ['Recycling bins are usually blue or green. Many schools have two or three different bins.', 'This is true in some places, but it does not answer the point about recycling.'],
        ['Recycling is a good habit. Many people recycle paper and glass at home, too, and they enjoy it.', 'This agrees with Arka. It does not give a reason to use less plastic.'],
        ['However, many schools have no bins at all. Students throw plastic on the ground, and nobody cleans it up.', "This uses 'However', but it is a different problem. It does not answer Arka's idea."]
      ] }
  ],
  reading: [
    { type: 'purpose', q: 'What is the writer’s purpose?',
      opts: [['To persuade schools to use less single-use plastic', 'The writer gives reasons and advice to persuade.'], ['To explain how plastic bottles are made in a factory', 'The text does not explain how plastic is made.'], ['To describe a normal day in a school canteen', 'The text is not a description of the canteen.'], ['To tell readers about a new recycling machine', 'The text does not mention a recycling machine.']] },
    { type: 'mainIdea', q: 'What is the main idea of the text?',
      opts: [['Schools should reduce single-use plastic because it harms the environment and costs money.', 'This combines the position and the main reasons.'], ['Students should stop drinking water at school because bottles make so much waste.', 'The writer wants students to use reusable bottles, not stop drinking.'], ['Recycling is the best way to solve the plastic problem in schools and in cities.', 'The text does not talk about recycling.'], ['Plastic is a very useful material, so schools should buy more of it every year.', 'The writer talks about problems with plastic.']] },
    { type: 'inference', q: 'What can we infer from the text?',
      opts: [['Plastic waste is a problem that will not disappear quickly.', 'The writer says a bottle can stay in the ground for hundreds of years.'], ['Students at the school do not care about the environment at all.', 'The text does not say this.'], ['Reusable bottles are never worth buying because they cost too much.', 'The writer says reusable bottles save money after a few weeks.'], ['The river near the school is clean because students clean it.', 'The writer says plastic makes the place dirty.']] },
    { type: 'reference', q: 'In the second paragraph, “They” in “They make the place dirty” refers to …',
      opts: [['the plastic bottles and bags', '“They” means the plastic bottles and bags that end up on the ground.'], ['the animals near the river', 'Animals are mentioned in the next sentence.'], ['the drains near the school', 'Drains are only one place where plastic goes.'], ['the students at the school', 'The sentence is about the plastic, not the students.']] },
    { type: 'evidence', q: 'Which detail supports the argument that reusable bottles save money?',
      opts: [['After a few weeks, the reusable bottle is cheaper.', 'This compares the cost of the two kinds of bottles.'], ['Bottles and bags often end up on the ground.', 'This supports the argument about pollution.'], ['A plastic bottle can stay in the ground for hundreds of years.', 'This supports the argument about time in nature.'], ['Plastic can be dangerous for animals.', 'This supports the argument about pollution.']] },
    { type: 'summary', q: 'Which sentence is the best summary of the text?',
      opts: [['The writer says schools should reduce single-use plastic because it pollutes, lasts a long time, and costs more.', 'It includes the position and the three arguments.'], ['The writer says plastic is cheap and useful, so schools should use more of it every day and every year.', 'This is the opposite of the writer’s position.'], ['The writer says students should recycle all their plastic at home instead of bringing it to school.', 'The text does not say this.'], ['The writer describes the water refill station in the canteen and how students use it every day at break time.', 'This is only a small detail from the recommendation.']] },
    { type: 'recommendation', q: 'What should schools put near the canteen?',
      opts: [['A water refill station', 'This is in the recommendation paragraph.'], ['More plastic bins', 'The writer does not suggest this.'], ['A shop that sells bottles', 'This is the opposite of the recommendation.'], ['A bicycle parking area', 'This is not mentioned in the text.']] }
  ]
});
