/* =====================================================================
   ENGLISH YO! — KNOW YOUR LEVEL!  ·  QUESTION BANK
   ---------------------------------------------------------------------
   Teacher-approved ENGLISH YO! question bank (final).
   This file holds ONLY the question bank and the scoring settings.
   The test engine lives in level-test.html and reads window.KYL_BANK.

   48 items = 8 × A1, 8 × A2, 8 × B1, 8 × B2, 8 × C1, 8 × C2
              (12 items per assessment area)

   ITEM FIELDS
     id            unique text id, e.g. "B1-05"
     level         "A1" | "A2" | "B1" | "B2" | "C1" | "C2"   (CEFR level)
     area          "word-power" | "use-your-english" | "reading" | "listening"
     placeholder   false for every final item
     question      the question / sentence (use ____ for a gap)
     passage       reading text for "reading" items, else null
     audioScript   the listening script for "listening" items, else null
                   (never shown to students — read aloud via audio/TTS only)
     choices       answer options (text)
     correctAnswer zero-based index of the correct choice (A=0, B=1, C=2, D=3)

   Original ENGLISH YO! items only — not reproduced from Cambridge English,
   British Council, Council of Europe or other published tests.
   ===================================================================== */

window.KYL_BANK = {
  version: "final-1 (A1–C2)",

  /* SCORING
     A level is achieved when the student scores at least `passMark`
     of that level's points. Levels are checked in order (A1 → C2) and
     the result is the highest level reached before the first level
     that is not achieved. If A1 is not achieved the result is still A1
     (ENGLISH STARTER), so every student receives a positive result. */
  scoring: {
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    passMark: 0.625,            // 5 of 8 points per level
    order: "by-area"            // "by-area": 4 sections (A1 → C2 inside each) · "by-level": A1 items first … C2 last
  },

  items: [
    {
      id: "A1-01", level: "A1", area: "word-power", placeholder: false,
      question: "My mother's brother is my _____.",
      passage: null,
      audioScript: null,
      choices: ["cousin", "uncle", "nephew", "grandfather"],
      correctAnswer: 1
    },
    {
      id: "A1-02", level: "A1", area: "word-power", placeholder: false,
      question: "It is lunchtime. I am very _____, so I want something to eat.",
      passage: null,
      audioScript: null,
      choices: ["hungry", "thirsty", "sleepy", "cold"],
      correctAnswer: 0
    },
    {
      id: "A1-03", level: "A1", area: "use-your-english", placeholder: false,
      question: "Nadia _____ English every Tuesday.",
      passage: null,
      audioScript: null,
      choices: ["study", "studies", "studying", "studied"],
      correctAnswer: 1
    },
    {
      id: "A1-04", level: "A1", area: "use-your-english", placeholder: false,
      question: "There _____ three pencils on the table.",
      passage: null,
      audioScript: null,
      choices: ["is", "am", "are", "be"],
      correctAnswer: 2
    },
    {
      id: "A1-05", level: "A1", area: "reading", placeholder: false,
      question: "When can a student use the library?",
      passage: "SCHOOL LIBRARY\n\nMonday–Friday\n7:00 a.m.–3:00 p.m.\n\nPlease return books at the front desk.",
      audioScript: null,
      choices: ["Friday at 2:30 p.m.", "Friday at 4:00 p.m.", "Saturday at 10:00 a.m.", "Sunday at 7:00 a.m."],
      correctAnswer: 0
    },
    {
      id: "A1-06", level: "A1", area: "reading", placeholder: false,
      question: "What should Dika bring?",
      passage: "Hi Dika,\nI'm in the science lab with Ms Rani. Please bring my blue notebook from our classroom. It is under my chair.\nThanks,\nSinta",
      audioScript: null,
      choices: ["A chair", "A science book", "A blue notebook", "A school bag"],
      correctAnswer: 2
    },
    {
      id: "A1-07", level: "A1", area: "listening", placeholder: false,
      question: "How does Maya go to school?",
      passage: null,
      audioScript: "Hello, I'm Maya. I live in Yogyakarta with my parents and my younger brother. My school is near my house, so I walk to school every morning.",
      choices: ["By bus", "By bicycle", "By car", "On foot"],
      correctAnswer: 3
    },
    {
      id: "A1-08", level: "A1", area: "listening", placeholder: false,
      question: "What time does the English Club start?",
      passage: null,
      audioScript: "Attention, students. The English Club starts at quarter past three in Room Eight today.",
      choices: ["2:45", "3:00", "3:15", "3:30"],
      correctAnswer: 2
    },
    {
      id: "A2-01", level: "A2", area: "word-power", placeholder: false,
      question: "Can I _____ your dictionary? I'll give it back tomorrow.",
      passage: null,
      audioScript: null,
      choices: ["lend", "borrow", "invite", "carry"],
      correctAnswer: 1
    },
    {
      id: "A2-02", level: "A2", area: "word-power", placeholder: false,
      question: "The market was so _____ that we had to move slowly through all the people.",
      passage: null,
      audioScript: null,
      choices: ["empty", "quiet", "crowded", "private"],
      correctAnswer: 2
    },
    {
      id: "A2-03", level: "A2", area: "use-your-english", placeholder: false,
      question: "We _____ to the museum last Saturday.",
      passage: null,
      audioScript: null,
      choices: ["go", "goes", "went", "going"],
      correctAnswer: 2
    },
    {
      id: "A2-04", level: "A2", area: "use-your-english", placeholder: false,
      question: "This school bag is _____ than mine.",
      passage: null,
      audioScript: null,
      choices: ["light", "lighter", "lightest", "more light"],
      correctAnswer: 1
    },
    {
      id: "A2-05", level: "A2", area: "reading", placeholder: false,
      question: "Why does Reno suggest meeting at 3:00?",
      passage: "Hi Aulia,\nI can't meet you at the café at 2:00 because football practice doesn't finish until 2:30. Can we meet at 3:00 instead? I'll bring the science notes.\n—Reno",
      audioScript: null,
      choices: ["The café opens at 3:00.", "He needs to buy science notes.", "His football practice finishes at 2:30.", "Aulia cannot come before 3:00."],
      correctAnswer: 2
    },
    {
      id: "A2-06", level: "A2", area: "reading", placeholder: false,
      question: "Where is the bank?",
      passage: "From the school gate, turn left. Walk past the pharmacy. The bank is next to the bakery and opposite the park.",
      audioScript: null,
      choices: ["Behind the school", "Next to the bakery", "Inside the park", "Between the school and pharmacy"],
      correctAnswer: 1
    },
    {
      id: "A2-07", level: "A2", area: "listening", placeholder: false,
      question: "What time will the bus now leave?",
      passage: null,
      audioScript: "Attention, passengers. The ten-twenty bus to Solo is delayed by fifteen minutes. Please wait at Platform Four.",
      choices: ["10:15", "10:20", "10:30", "10:35"],
      correctAnswer: 3
    },
    {
      id: "A2-08", level: "A2", area: "listening", placeholder: false,
      question: "What would the girl prefer to eat now?",
      passage: null,
      audioScript: "Boy: Would you like chicken noodles?\nGirl: I'd love some, but I had noodles yesterday. Is there any fried rice?\nBoy: Yes, there is.",
      choices: ["Chicken", "Noodles", "Fried rice", "Nothing"],
      correctAnswer: 2
    },
    {
      id: "B1-01", level: "B1", area: "word-power", placeholder: false,
      question: "Rafi checked the information on two reliable websites before sharing it. What does reliable mean here?",
      passage: null,
      audioScript: null,
      choices: ["Expensive", "Trustworthy", "Popular", "Complicated"],
      correctAnswer: 1
    },
    {
      id: "B1-02", level: "B1", area: "word-power", placeholder: false,
      question: "We had to _____ the meeting until Friday because our teacher was ill.",
      passage: null,
      audioScript: null,
      choices: ["achieve", "prevent", "postpone", "borrow"],
      correctAnswer: 2
    },
    {
      id: "B1-03", level: "B1", area: "use-your-english", placeholder: false,
      question: "If it _____ tomorrow, we'll move the picnic indoors.",
      passage: null,
      audioScript: null,
      choices: ["rains", "rained", "will rain", "raining"],
      correctAnswer: 0
    },
    {
      id: "B1-04", level: "B1", area: "use-your-english", placeholder: false,
      question: "I have known Dimas _____ we were in primary school.",
      passage: null,
      audioScript: null,
      choices: ["for", "since", "during", "until"],
      correctAnswer: 1
    },
    {
      id: "B1-05", level: "B1", area: "reading", placeholder: false,
      question: "What most likely made the campaign more effective?",
      passage: "Our class wanted to reduce plastic waste at school. At first, teachers simply reminded students to bring reusable bottles, but little changed. Then the environmental club collected every plastic cup used by our class for one week and displayed them in a large transparent box near the classroom door. Students were surprised by how quickly the box filled up. During the following week, many more students began bringing their own bottles.",
      audioScript: null,
      choices: ["Students were punished for using plastic cups.", "The environmental club gave everyone free bottles.", "Students could clearly see how much waste they produced.", "Teachers stopped selling drinks at school."],
      correctAnswer: 2
    },
    {
      id: "B1-06", level: "B1", area: "reading", placeholder: false,
      question: "What helped Nia deal with her fear?",
      passage: "Nia wanted to join her school's debating team, but speaking in front of an audience made her nervous. Instead of giving up, she first volunteered to be the team's timekeeper. She watched several practices and gradually began sharing ideas with the team. Two months later, she gave her first short speech in a practice debate.",
      audioScript: null,
      choices: ["Avoiding public speaking completely", "Joining the activity gradually", "Memorising every debate", "Changing to another club"],
      correctAnswer: 1
    },
    {
      id: "B1-07", level: "B1", area: "listening", placeholder: false,
      question: "Why is the speaker taking the bus this week?",
      passage: null,
      audioScript: "I usually cycle to school, but this week the main road near my house is being repaired. Cars and bicycles have to take a much longer route, so I've been taking the bus instead. It isn't as convenient, but at least I arrive on time.",
      choices: ["His bicycle is broken.", "The weather is bad.", "Road repairs make his normal route difficult.", "He wants to travel with his friends."],
      correctAnswer: 2
    },
    {
      id: "B1-08", level: "B1", area: "listening", placeholder: false,
      question: "How does the girl feel at the end?",
      passage: null,
      audioScript: "Girl: I'm thinking about joining the school clean-up on Saturday.\nBoy: I went last month. We started really early, but it was surprisingly fun. I met students from classes I'd never talked to before.\nGirl: That actually sounds better than I expected.",
      choices: ["More interested in joining", "Angry about the early start", "Certain the activity is boring", "Worried about meeting new people"],
      correctAnswer: 0
    },
    {
      id: "B2-01", level: "B2", area: "word-power", placeholder: false,
      question: "The campaign aims to _____ awareness of cyberbullying among teenagers.",
      passage: null,
      audioScript: null,
      choices: ["rise", "raise", "lift up", "grow up"],
      correctAnswer: 1
    },
    {
      id: "B2-02", level: "B2", area: "word-power", placeholder: false,
      question: "His explanation sounded plausible at first, but several details did not _____ with the available evidence.",
      passage: null,
      audioScript: null,
      choices: ["align", "inherit", "persuade", "settle"],
      correctAnswer: 0
    },
    {
      id: "B2-03", level: "B2", area: "use-your-english", placeholder: false,
      question: "If I had known the workshop would fill up so quickly, I _____ earlier.",
      passage: null,
      audioScript: null,
      choices: ["registered", "would register", "would have registered", "had registered"],
      correctAnswer: 2
    },
    {
      id: "B2-04", level: "B2", area: "use-your-english", placeholder: false,
      question: "The new school policy is expected _____ next month.",
      passage: null,
      audioScript: null,
      choices: ["take effect", "taking effect", "to take effect", "took effect"],
      correctAnswer: 2
    },
    {
      id: "B2-05", level: "B2", area: "reading", placeholder: false,
      question: "Which statement best represents the writer's view?",
      passage: "Some schools have introduced complete bans on smartphones during the school day. Supporters argue that removing phones reduces distraction and encourages students to talk to one another. Critics, however, point out that phones can also be useful learning tools and that students need opportunities to develop responsible digital habits. A ban may therefore solve an immediate problem without necessarily teaching young people how to manage technology independently. The more difficult task may be to establish clear boundaries while also giving students increasing responsibility as they become more mature.",
      audioScript: null,
      choices: ["Smartphones should never be used for learning.", "Complete bans are the only effective solution.", "Schools should ignore problems caused by smartphones.", "Managing smartphone use may require both boundaries and responsibility."],
      correctAnswer: 3
    },
    {
      id: "B2-06", level: "B2", area: "reading", placeholder: false,
      question: "What can be inferred from the passage?",
      passage: "A city planted hundreds of trees along several streets where summer temperatures were particularly high. Three years later, measurements showed that shaded pavements were cooler during the afternoon. However, researchers warned that simply counting the number of trees planted could give a misleading impression of success. Young trees need years to provide significant shade, and some species survive urban conditions better than others.",
      audioScript: null,
      choices: ["Planting trees immediately solves urban heat problems.", "The effectiveness of tree-planting depends on more than the number planted.", "Young trees provide more shade than mature trees.", "Researchers believe cities should stop planting trees."],
      correctAnswer: 1
    },
    {
      id: "B2-07", level: "B2", area: "listening", placeholder: false,
      question: "What is the speaker's position?",
      passage: null,
      audioScript: "I understand why the school wants every assignment submitted digitally. It certainly makes storage easier and reduces paper use. Still, I don't think we should assume that every student always has reliable internet access at home. A digital system can be useful, but there needs to be some flexibility.",
      choices: ["Digital submission should be completely abandoned.", "Paper assignments are always better.", "Digital submission has advantages but should allow exceptions.", "All students have reliable internet access."],
      correctAnswer: 2
    },
    {
      id: "B2-08", level: "B2", area: "listening", placeholder: false,
      question: "What does the project leader imply?",
      passage: null,
      audioScript: "Presenter: Your team finished the project two weeks ahead of schedule. Was that because the original plan was especially good?\nProject leader: The plan helped, of course, but I'd be cautious about giving it all the credit. Halfway through, we discovered that one stage wasn't necessary at all. Removing it saved nearly a week.",
      choices: ["The project succeeded exactly as originally planned.", "Adjusting the plan contributed significantly to finishing early.", "The team ignored the original plan completely.", "Finishing early created serious problems."],
      correctAnswer: 1
    },
    {
      id: "C1-01", level: "C1", area: "word-power", placeholder: false,
      question: "The new evidence does not completely disprove the theory, but it does _____ its strongest claim.",
      passage: null,
      audioScript: null,
      choices: ["undermine", "decorate", "compile", "restore"],
      correctAnswer: 0
    },
    {
      id: "C1-02", level: "C1", area: "word-power", placeholder: false,
      question: "The committee's conclusions remain _____ because the available evidence is incomplete.",
      passage: null,
      audioScript: null,
      choices: ["compulsory", "tentative", "accidental", "permanent"],
      correctAnswer: 1
    },
    {
      id: "C1-03", level: "C1", area: "use-your-english", placeholder: false,
      question: "Not until the data were reanalysed _____ the researchers notice the error.",
      passage: null,
      audioScript: null,
      choices: ["the researchers did", "did the researchers", "the researchers had", "had the researchers"],
      correctAnswer: 1
    },
    {
      id: "C1-04", level: "C1", area: "use-your-english", placeholder: false,
      question: "The committee recommended that each applicant _____ two academic references.",
      passage: null,
      audioScript: null,
      choices: ["submits", "submitted", "submit", "submitting"],
      correctAnswer: 2
    },
    {
      id: "C1-05", level: "C1", area: "reading", placeholder: false,
      question: "What is the writer's main concern?",
      passage: "Recommendation algorithms are often described as tools that help users manage an overwhelming abundance of choice. This is certainly one of their functions: few people would willingly examine millions of songs, films or articles one by one. Yet convenience can obscure another effect. A system trained primarily on our previous choices may become exceptionally good at giving us more of what we already know we like. The result is not necessarily a narrow information bubble—users remain capable of seeking alternatives—but discovery may increasingly require deliberate effort. In other words, recommendation systems do not remove choice; they subtly alter the conditions under which choices are made.",
      audioScript: null,
      choices: ["Recommendation systems prevent users from making any choices.", "Users should examine every available option themselves.", "Personalised recommendations may make unfamiliar options less likely to be encountered spontaneously.", "Recommendation algorithms rarely predict users' interests correctly."],
      correctAnswer: 2
    },
    {
      id: "C1-06", level: "C1", area: "reading", placeholder: false,
      question: "Why does the writer put “save time” in quotation marks?",
      passage: "Modern productivity advice frequently promises to help us “save time.” Curiously, however, every minute saved soon seems to acquire a new task. Faster communication has not necessarily produced shorter working days; instead, it has often increased expectations about how quickly we should respond. Efficiency is valuable, but treating every unoccupied moment as unused capacity risks turning time itself into a resource that must constantly justify its existence.",
      audioScript: null,
      choices: ["To indicate that the phrase is grammatically incorrect", "To question the assumption that greater efficiency actually creates more free time", "To quote a particular productivity researcher", "To suggest that technology always reduces work"],
      correctAnswer: 1
    },
    {
      id: "C1-07", level: "C1", area: "listening", placeholder: false,
      question: "What is the speaker warning against?",
      passage: null,
      audioScript: "It's tempting to interpret the fall in library visits as evidence that students are reading less. The figures don't actually tell us that. Digital borrowing has increased substantially over the same period, and many students access journal articles remotely. What we can reasonably conclude is that the way students use the library is changing—not necessarily that the library has become less important.",
      choices: ["Using digital library services", "Comparing different years", "Drawing an overly simple conclusion from one statistic", "Allowing students to study remotely"],
      correctAnswer: 2
    },
    {
      id: "C1-08", level: "C1", area: "listening", placeholder: false,
      question: "What does the designer really recommend?",
      passage: null,
      audioScript: "Manager: Do you think we should launch the new platform next Monday?\nDesigner: Technically, we could. Most of the major bugs have been fixed. But if we're asking whether Monday is the wisest date, that's a slightly different question. I'd rather have another week of user testing than spend the following month apologising for problems we might have caught.",
      choices: ["Cancel the platform permanently.", "Launch it next Monday as planned.", "Delay the launch for additional testing.", "Remove the user-testing stage."],
      correctAnswer: 2
    },
    {
      id: "C2-01", level: "C2", area: "word-power", placeholder: false,
      question: "The spokesperson's answer was deliberately _____, allowing both supporters and critics to interpret it in their own favour.",
      passage: null,
      audioScript: null,
      choices: ["unequivocal", "equivocal", "meticulous", "redundant"],
      correctAnswer: 1
    },
    {
      id: "C2-02", level: "C2", area: "word-power", placeholder: false,
      question: "Her claim that she “had no influence whatsoever” over the decision seemed _____, given that she had chaired every meeting in which it was discussed.",
      passage: null,
      audioScript: null,
      choices: ["disingenuous", "impartial", "spontaneous", "meticulous"],
      correctAnswer: 0
    },
    {
      id: "C2-03", level: "C2", area: "use-your-english", placeholder: false,
      question: "Much as I _____ his concerns, I cannot support the solution he is proposing.",
      passage: null,
      audioScript: null,
      choices: ["appreciate", "am appreciating", "have appreciated to", "would appreciate of"],
      correctAnswer: 0
    },
    {
      id: "C2-04", level: "C2", area: "use-your-english", placeholder: false,
      question: "The first study involved only twelve participants. _____, its findings should be treated cautiously; the wider pattern observed in later studies remains significant.",
      passage: null,
      audioScript: null,
      choices: ["Be that as it may", "By and large", "In the event", "For want of"],
      correctAnswer: 0
    },
    {
      id: "C2-05", level: "C2", area: "reading", placeholder: false,
      question: "Which statement most accurately captures the writer's argument?",
      passage: "Organisations often promise to make decision-making more “data-driven,” as though data and judgment occupied opposite sides of a boundary. In practice, the boundary is difficult to locate. Someone decides what to measure, which observations to exclude, when a difference counts as meaningful and which outcomes deserve attention. None of this makes data useless; quite the contrary. Good evidence can expose assumptions that intuition alone leaves unchallenged. The problem arises when numerical results acquire an authority detached from the choices that produced them. A figure may be perfectly accurate and still answer the wrong question with impressive precision.",
      audioScript: null,
      choices: ["Quantitative data should be replaced by personal judgment.", "Accurate numerical results are automatically useful.", "Data are valuable, but their interpretation depends on human choices about what is measured and why.", "Human judgment is always less reliable than numerical evidence."],
      correctAnswer: 2
    },
    {
      id: "C2-06", level: "C2", area: "reading", placeholder: false,
      question: "What criticism is the writer making?",
      passage: "The town's new cultural centre was announced as a place “for everyone,” an ambition difficult to quarrel with and even harder to define. Its opening programme featured experimental theatre, contemporary sculpture and a lecture series on urban design. All were excellent by their own standards. Yet the residents who had campaigned for rehearsal rooms, affordable classes and somewhere for local teenagers to perform found themselves admiring the building largely from the outside. Nothing about the centre excluded them explicitly. That, perhaps, was precisely the problem: inclusion had been treated as an architectural property rather than an ongoing relationship with the people the building was supposed to serve.",
      audioScript: null,
      choices: ["The building should not contain contemporary art.", "The cultural programme was of poor quality.", "The centre's idea of inclusion did not sufficiently involve the community it claimed to serve.", "Local residents were formally prohibited from entering the centre."],
      correctAnswer: 2
    },
    {
      id: "C2-07", level: "C2", area: "listening", placeholder: false,
      question: "What is the researcher's attitude toward calling the policy a failure?",
      passage: null,
      audioScript: "Interviewer: So would you describe the policy as a failure?\nResearcher: That would make for a wonderfully tidy headline. Unfortunately, reality has declined to cooperate. The policy clearly didn't achieve everything its designers promised, but neither did it do nothing. Participation rose in some groups and fell in others. The interesting question isn't whether it ‘worked’ in the abstract, but for whom, under what conditions, and at what cost.",
      choices: ["She strongly agrees because participation fell everywhere.", "She thinks the label oversimplifies a complex set of outcomes.", "She refuses to discuss the policy.", "She believes cost is irrelevant."],
      correctAnswer: 1
    },
    {
      id: "C2-08", level: "C2", area: "listening", placeholder: false,
      question: "What are the speakers indirectly suggesting?",
      passage: null,
      audioScript: "Colleague 1: The report is certainly comprehensive.\nColleague 2: Comprehensive, yes. Whether anybody will still remember the original question by page two hundred is another matter.\nColleague 1: So perhaps the executive summary could do a little more than tell us that a summary follows?",
      choices: ["The report lacks sufficient evidence.", "The report should be made longer and more detailed.", "Its length and presentation make the central message unnecessarily difficult to identify.", "The executive summary should be removed completely."],
      correctAnswer: 2
    },
  ]
};
