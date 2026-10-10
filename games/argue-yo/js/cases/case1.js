/* ARGUE YO! — CASE 01: SCREEN TIME
   Data only. Edit text here; the engine builds all five levels + the reading challenge from it.
   Conventions:
   - claim / detail: claim starts in lower case (connector + comma is added before it).
   - {{gap}} in a detail = the "link" connector blank (Level 3).  {{modal}} in rec.main = the modal blank.
   - distract / thesisAlt / recAlt: kind = irrelevant | opposite | vague | rec | nopos | arg
   - debate.opts and reading.opts: the FIRST option is the correct one (the game shuffles them).  [text, why] */
(window.ARGUE_CASES = window.ARGUE_CASES || []).push({
  id: 'screen', no: 1, title: 'SCREEN TIME',
  question: 'Should teenagers limit their screen time?',
  emoji: '📱', prop: 'phone', bg: 'classroom', guide: 'arka',
  brief: "The Student Council needs your help! Many students stay on their phones all day. Let's build a strong case together.",
  textTitle: 'Teenagers Should Limit Their Screen Time',
  thesis: {
    issue: 'Many teenagers spend hours on their phones every day. They watch videos, play games, and chat with friends. Phones are useful, but too much screen time can cause problems.',
    position: 'In my opinion, teenagers should limit their screen time.'
  },
  args: [
    { conn: 'First', claim: 'too much screen time makes it hard to sleep well.',
      detail: 'Many teenagers use their phones late at night, {{gap}} they go to bed late and feel tired the next day. Tired students cannot pay attention in class, and they often feel unhappy.',
      gap: { answer: 'so', options: ['so', 'because', 'however'], why: "'So' shows a result. Using the phone late causes going to bed late." },
      why: 'It shows a real problem that too much screen time causes.' },
    { conn: 'Moreover', claim: 'screen time takes time away from other important activities.',
      detail: 'Students who scroll for hours have less time for homework, sports, and family. A balanced day helps them stay healthy and happy, and it also helps them study better.',
      why: 'It explains what students lose when they spend too long on screens.' },
    { conn: 'Furthermore', claim: "looking at a screen for too long can hurt students' eyes.",
      detail: 'Many students have tired eyes and headaches after hours of gaming or scrolling. Our eyes need rest, but many students look at a screen for hours without a break.',
      why: 'It gives a health reason for limiting screen time.' }
  ],
  rec: {
    lead: 'Therefore', main: 'teenagers {{modal}} set a daily time limit for their phones.',
    extra: 'They should also put their phones away one hour before bed. Small changes like these can improve sleep, study, and health.',
    modal: { answer: 'should', options: ['should', 'should not', 'cannot'], why: "'Should' gives advice. It matches the writer's position." }
  },
  distract: [
    { t: 'Many phones have a very good camera.', kind: 'irrelevant' },
    { t: 'Some teenagers have two phones.', kind: 'irrelevant' },
    { t: 'Phones help students find information quickly.', kind: 'opposite',
      why: 'This is a good point, but it supports the opposite position. The thesis says teenagers should limit screen time.' },
    { t: 'Phones are everywhere today.', kind: 'vague' },
    { t: 'Teenagers should turn off their phones at night.', kind: 'rec' }
  ],
  thesisAlt: [
    { t: 'Many teenagers have a smartphone and use it every day.', kind: 'nopos' },
    { t: 'Teenagers do not need any limit on their screen time.', kind: 'opposite' }
  ],
  detailAlt: [
    'Some phones are black, and some phones are white.',
    'Many students bring a phone charger to school.',
    'New phones come out every year.'
  ],
  recAlt: [
    { t: 'Therefore, schools should buy a new phone for every student.', kind: 'irrelevant' },
    { t: 'Phones are an important part of modern life.', kind: 'arg' }
  ],
  debate: [
    { who: 'dika', says: 'But phones are useful. Teenagers need them for school and for talking to friends.',
      opts: [
        ['However, we can still use phones for useful things with a time limit. A limit does not stop good use.', "'However' introduces a contrast, and the sentence answers Dika's point: a limit does not stop useful use."],
        ['However, too much screen time is bad for teenagers. It can cause many different problems.', "This repeats the thesis with 'However', but it does not answer Dika's point about useful phones."],
        ['Teenagers should never use phones at all. Phones are not good for young people, and they only cause problems.', "This goes too far. The thesis says 'limit', not 'stop'."],
        ['Phones can be very expensive. Many families cannot buy a new phone every year, and repairs are expensive, too.', "This is a new point. It does not answer Dika's idea that phones are useful."]
      ] },
    { who: 'sinta', says: 'I use my phone to relax after school. Why should I stop?',
      opts: [
        ['However, a long time on a screen can make you more tired. A walk or some music can help you relax, too.', "It answers Sinta's point: there are other ways to relax that do not make you tired."],
        ['Everyone likes to relax after school. Many students enjoy watching videos with their friends.', 'This agrees with Sinta. It does not give a reason to limit screen time.'],
        ['My sister never uses her phone after school. She reads books and goes to bed early.', 'This is a personal example. It does not give a reason that supports the thesis.'],
        ['You should go to bed earlier every night. Sleep is more important than watching videos.', "This is advice, not an answer. It does not respond to Sinta's question about relaxing."]
      ] },
    { who: 'nadia', says: 'Limits are not fair. Teenagers can decide for themselves.',
      opts: [
        ['That is true, but many teenagers find it hard to stop. A daily limit can help them make better choices.', "It accepts Nadia's idea and then answers it: a limit can help students decide well."],
        ['Rules are always boring for young people. Nobody wants to follow too many rules at home or at school.', 'This agrees that limits are bad. It does not support the thesis.'],
        ['However, parents decide everything for teenagers. Teenagers do not have any freedom at home.', "This uses 'However', but it is not true for everyone and it does not answer Nadia's point."],
        ['Some limits are too strict for students. A limit of one hour a day is much too short.', 'This is a different point. The thesis is about having a limit, not about how long it is.']
      ] }
  ],
  reading: [
    { type: 'purpose', q: 'Why did the writer write this text?',
      opts: [['To persuade teenagers to limit their screen time', 'The writer gives reasons and advice, so the purpose is to persuade.'], ['To explain to readers how smartphones and apps work', 'The text does not explain how phones work.'], ['To tell a funny story about a teenager’s night', 'The text has reasons and advice, not a story.'], ['To compare the prices of different phones for teens', 'The text does not compare phones.']] },
    { type: 'mainIdea', q: 'What is the main idea of the text?',
      opts: [['Teenagers should use screens less because too much screen time causes problems.', 'This is the writer’s position in the first paragraph.'], ['Teenagers must never use phones because phones are dangerous for health.', 'The writer says “limit”, not “never use”.'], ['Teenagers need better phones so that they can study and sleep well.', 'The writer does not talk about buying better phones.'], ['Sleep is the most important thing for teenagers, more than study.', 'The writer talks about sleep, time, and eyes, not about which is most important.']] },
    { type: 'inference', q: 'What can we infer from the text?',
      opts: [['Better sleep could help students do better at school.', 'The writer says tired students cannot pay attention in class.'], ['Students who play games every day always get bad marks.', 'The text does not say “always”.'], ['Teachers want to take away all the phones in the school.', 'The text does not talk about teachers.'], ['Parents are the main reason why teenagers use phones.', 'The text does not blame parents.']] },
    { type: 'reference', q: 'In the second paragraph, “they” in “so they go to bed late” refers to …',
      opts: [['many teenagers', '“They” means the teenagers who use their phones late at night.'], ['their phones', 'Phones do not go to bed.'], ['tired students', 'This comes after the sentence.'], ['the next day', 'A day cannot go to bed.']] },
    { type: 'evidence', q: 'Which detail supports the argument that screens can hurt students’ eyes?',
      opts: [['Many students have tired eyes and headaches after hours of gaming or scrolling.', 'This is a fact about eyes and screens.'], ['Tired students cannot pay attention in class, and they often feel unhappy.', 'This supports the argument about sleep.'], ['Students who scroll for hours have less time for homework, sports, and family.', 'This supports the argument about time.'], ['Many teenagers use their phones late at night and go to bed late.', 'This supports the argument about sleep.']] },
    { type: 'summary', q: 'Which sentence is the best summary of the text?',
      opts: [['The writer says teenagers should limit their screen time because it affects sleep, free time, and eyes.', 'It includes the position and the main arguments.'], ['The writer says teenagers should stop using phones completely because they are dangerous for the body.', 'The writer does not say phones are dangerous or that teenagers should stop completely.'], ['The writer describes what teenagers do on their phones late at night and why they like it.', 'This is only a small detail.'], ['The writer says phones are useful for sleep, study, and health, so teenagers should use them more.', 'The writer says the opposite about sleep and health.']] },
    { type: 'recommendation', q: 'What does the writer recommend?',
      opts: [['Set a daily time limit and put phones away before bed', 'This is the recommendation in the last paragraph.'], ['Buy a new phone with a timer for school work', 'The writer does not recommend this.'], ['Stop using phones forever and talk to friends', 'The writer says “limit”, not “stop”.'], ['Use phones only at school and never at home', 'The writer does not say this.']] }
  ]
});
