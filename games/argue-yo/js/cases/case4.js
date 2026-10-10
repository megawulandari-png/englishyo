/* ARGUE YO! — CASE 04: HOMEWORK  (see case1.js for the data conventions) */
(window.ARGUE_CASES = window.ARGUE_CASES || []).push({
  id: 'homework', no: 4, title: 'HOMEWORK',
  question: 'Should students have less homework?',
  emoji: '📚', prop: 'books', bg: 'library', guide: 'dika',
  brief: "Homework every day, in every subject. Some of us finish after ten at night! Let's make a strong case for less homework.",
  textTitle: 'Students Should Have Less Homework',
  thesis: {
    issue: 'Many students get homework from several subjects every day. Some students work on their tasks until late at night. Others do not have time to rest or relax.',
    position: 'In my opinion, students should have less homework.'
  },
  args: [
    { conn: 'First', claim: 'too much homework makes students tired and stressed.',
      detail: 'Students often feel tired in class {{gap}} they finish their homework late at night. Stress and tiredness make it difficult to concentrate and to enjoy school.',
      gap: { answer: 'because', options: ['because', 'so', 'however'], why: "'Because' gives the reason why students feel tired in class." },
      why: 'It shows how homework affects students’ health and energy.' },
    { conn: 'Moreover', claim: 'students need time for other activities.',
      detail: 'After school, students can play sports, learn a new skill, or spend time with their family. These activities are also important for growing up, and they help students feel happy.',
      why: 'It shows that life outside school also teaches students important things.' },
    { conn: 'Furthermore', claim: 'too much homework can make students dislike learning.',
      detail: 'When homework takes hours, students only want to finish it quickly. Some of them copy answers from friends. After a time, they feel bored and do not enjoy learning.',
      why: 'It explains how too much homework can harm learning itself.' }
  ],
  rec: {
    lead: 'Therefore', main: 'teachers {{modal}} give less homework and choose tasks that are useful.',
    extra: 'Teachers should also talk together so that students do not receive too many tasks on the same day. A better balance can help students learn more and feel happier.',
    modal: { answer: 'should', options: ['should', 'should not', 'cannot'], why: "'Should' gives advice. It matches the writer's position." }
  },
  distract: [
    { t: 'Many teachers use a red pen to check homework.', kind: 'irrelevant' },
    { t: 'Some students write their homework in a blue notebook.', kind: 'irrelevant' },
    { t: 'Homework helps students remember the lesson.', kind: 'opposite',
      why: 'This may be true, but it supports the other side. The thesis says students should have less homework.' },
    { t: 'School is important for everyone.', kind: 'vague' },
    { t: 'Students should plan their time well.', kind: 'rec' }
  ],
  thesisAlt: [
    { t: 'Students get homework from their teachers every week.', kind: 'nopos' },
    { t: 'Students should have more homework every day.', kind: 'opposite' }
  ],
  detailAlt: [
    'Some homework books have a colourful cover.',
    'Many teachers write the homework on the board.',
    'Some students keep their books in a blue bag.'
  ],
  recAlt: [
    { t: 'Therefore, schools should stop all lessons on Mondays.', kind: 'irrelevant' },
    { t: 'Homework is one part of school life.', kind: 'arg' }
  ],
  debate: [
    { who: 'sinta', says: 'But homework helps us remember the lesson. Without it, we will forget.',
      opts: [
        ['However, a small amount of useful homework can do the same job. Too much homework only makes students tired.', "It answers Sinta's point: useful homework can stay, but too much is the problem."],
        ['Students forget many things after a lesson. Their memory is not always very good, especially when they are tired.', 'This agrees with Sinta. It does not support the thesis.'],
        ['Teachers give homework in almost every subject. Some students get five or six tasks a day.', 'This is true, but it does not answer her point about remembering.'],
        ['However, I always finish my homework early. It only takes me a short time every day.', "This uses 'However', but it is a personal example. It does not answer her point."]
      ] },
    { who: 'nadia', says: 'Students in other countries have a lot of homework, and they get good results.',
      opts: [
        ['Good results do not come only from more homework. Rest and good sleep also help students learn.', "It answers Nadia's point: results depend on more than homework."],
        ['Many countries have good schools. Some schools have big libraries and new computers.', 'This is true, but it does not answer the point about homework and results.'],
        ['Good results are very important for students. Everybody wants to do well at school.', 'This agrees with Nadia. It does not answer her point.'],
        ['However, homework is usually boring for most students. They do not enjoy doing it at home.', "This uses 'However', but it is an opinion. It does not answer the point about good results."]
      ] },
    { who: 'arka', says: 'If students have less homework, they will play games all evening.',
      opts: [
        ['However, free time can be used for sports, reading, or family time. Students can choose healthy activities.', "It answers Arka's worry directly with other good ways to use free time."],
        ['Many students play games with their friends. Some games are very popular at the moment.', 'This agrees with Arka. It does not answer his worry.'],
        ['Games are not allowed at school during lessons. Teachers ask students to keep phones in their bags.', 'This is a different topic. It does not answer his worry.'],
        ['Students do not have enough free time at the moment. Many of them are tired every day.', 'This repeats an earlier argument, but it does not answer his worry about wasting free time.']
      ] }
  ],
  reading: [
    { type: 'purpose', q: 'What is the writer’s purpose?',
      opts: [['To persuade teachers to give students less homework', 'The writer gives reasons and advice to persuade.'], ['To explain how to finish homework very quickly', 'The text does not teach a method.'], ['To tell a story about a student’s difficult exam', 'The text does not tell a story.'], ['To describe the books in a school library', 'The text is not a description.']] },
    { type: 'mainIdea', q: 'What is the main idea of the text?',
      opts: [['Students should have less homework because too much homework causes problems.', 'This is the writer’s position and main reason.'], ['Students should never do any homework because lessons are long enough.', 'The writer asks for less homework, not no homework.'], ['Teachers should give homework only on Fridays so students can rest.', 'The text does not say this.'], ['Homework is the best way to learn, so teachers should give more.', 'The writer does not say this.']] },
    { type: 'inference', q: 'What can we infer from the text?',
      opts: [['Students may learn better when they have enough time to rest and sleep.', 'The writer says tired, stressed students find it difficult to concentrate.'], ['Students who play sports never finish their homework on time.', 'The text does not say this.'], ['All students copy answers from their friends when they have homework.', 'The writer says “some”, not “all”.'], ['Students learn best when they have homework every single day.', 'The writer says the opposite.']] },
    { type: 'reference', q: 'In the third paragraph, “These activities” refers to …',
      opts: [['playing sports, learning a skill, and spending time with family', 'These are the activities named in the sentence before.'], ['finishing homework late at night and then going to bed early', 'The sentence before is not about homework.'], ['going to school every day and meeting friends in class', 'The sentence is about time after school.'], ['writing answers in a notebook for the teacher to check', 'This is not mentioned.']] },
    { type: 'evidence', q: 'Which detail supports the argument that homework can make students dislike learning?',
      opts: [['Some of them copy answers from friends, and after a time they feel bored.', 'This shows students stop enjoying learning when they have too much homework.'], ['Students often feel tired in class because they finish homework late.', 'This supports the argument about tiredness.'], ['Students can play sports, learn a new skill, or spend time with their family.', 'This supports the argument about other activities.'], ['These activities are important for growing up and help students feel happy.', 'This supports the argument about other activities.']] },
    { type: 'summary', q: 'Which sentence is the best summary of the text?',
      opts: [['The writer says students need less homework because it causes stress, takes free time, and harms learning.', 'It includes the position and the three arguments.'], ['The writer says homework makes students happy and gives them more energy for school and for their free time.', 'The writer says the opposite.'], ['The writer says teachers should stop teaching and let students learn at home alone without any lessons.', 'The text does not say this.'], ['The writer describes what students do after school and why they enjoy sports and family.', 'This is only one small part of the text.']] },
    { type: 'recommendation', q: 'What should teachers do, according to the writer?',
      opts: [['Give less homework and talk together about tasks', 'This is in the recommendation paragraph.'], ['Give more tasks on the weekend so students can plan', 'The writer does not say this.'], ['Stop checking homework and let students check it', 'The text does not say this.'], ['Give homework only to students who need extra practice', 'The text does not say this.']] }
  ]
});
