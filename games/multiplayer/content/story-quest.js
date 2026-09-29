// ENGLISH YO! — CLASS CLASH content pack: STORY QUEST  (CEFR A2–B1, junior high)
// Focus: reading narrative texts — characters, setting, sequence, problem, resolution, cause & effect,
// vocabulary in context, simple inference, motivation and moral value.
// This pack tests UNDERSTANDING of short stories, not grammar rules.
//
// Same schema and round shape as content/family-friends.js and content/past-adventures.js:
//   quick  { q, options[4], answer }               multiple choice
//   gap    { before, after, options[4], answer }   sentence = before + [blank] + after
//   order  { answer, alt?, question? }             tap the words into the right order
//   speed  { q, options[2], answer }               short two-option challenge (SPEED ROUND)
// `tier` (1 easy → 2 medium → 3 challenge) makes a session get more thoughtful round by round while the
// 30-question bank still varies between players and replays.
//
// Reading load: every question is self-contained — the story is shown right in the question, so nobody
// needs to know Timun Mas, Malin Kundang, Lake Toba or Roro Jonggrang beforehand. Passages stay at 20–55
// words; a "❓" separates the mini-story from the question so it is easy to spot on a phone. Round timers
// are a little longer than in the grammar packs (30–35 s) because students read before they answer.
//
// Every question has exactly one defensible answer, supported by the text shown. Distractors are plausible
// misreadings, never nonsense. Stories are original, simplified adaptations.

const CC_PACK_STORY = {
  // 10 rounds — same structure as the other packs. Each player sees 12 of the 30 questions per session.
  rounds: [
    { pool: "quick", tier: 1, label: "STORY START", icon: "📖", seconds: 30 },
    { pool: "order", tier: 1, label: "STORY ORDER", icon: "🧩", seconds: 30 },
    { pool: "gap", tier: 1, label: "CHARACTER CHECK", icon: "👤", seconds: 30 },
    { pool: "quick", tier: 2, label: "PROBLEM & SOLUTION", icon: "⚠️", seconds: 35 },
    { pool: "gap", tier: 2, label: "THE ENDING", icon: "✨", seconds: 30 },
    { pool: "order", tier: 2, label: "STORY ORDER", icon: "🧩", seconds: 30 },
    { pool: "quick", tier: 3, label: "STORY DETECTIVE", icon: "🔎", seconds: 35 },
    { pool: "order", tier: 3, label: "STORY ORDER", icon: "🧩", seconds: 30 },
    { pool: "speed", label: "QUICK TALE", icon: "⚡", seconds: 20, count: 3 },
    { pool: "gap", tier: 3, label: "FINAL QUEST", icon: "🏆", seconds: 30, final: true },
  ],

  questions: [
    // ---------- QUICK CHOICE · tier 1 (STORY START) — explicit information: setting, character, event ----------
    // skill: setting
    { id: "sq1", type: "quick", tier: 1, q: "Rani lives in a small fishing village near the sea. Every morning, she helps her father carry fish to the market. ❓ Where does Rani live?", options: ["In a fishing village", "In a big city", "In the mountains", "On a farm"], answer: "In a fishing village" },
    // skill: character
    { id: "sq2", type: "quick", tier: 1, q: "One hot day, a clever mouse deer named Kancil wanted to cross a wide river. The river was full of hungry crocodiles. ❓ Which character wanted to cross the river?", options: ["Kancil", "The crocodiles", "A fisherman", "A farmer"], answer: "Kancil" },
    // skill: story detail / event
    { id: "sq3", type: "quick", tier: 1, q: "Malin was a poor boy who lived with his mother in a small village. He wanted a better life, so he left on a big ship to find work. ❓ What did Malin do to find work?", options: ["He left on a ship", "He asked for money", "He built a boat", "He worked on a farm"], answer: "He left on a ship" },

    // ---------- QUICK CHOICE · tier 2 (PROBLEM & SOLUTION) — complication, cause & effect, resolution ----------
    // skill: complication
    { id: "sq4", type: "quick", tier: 2, q: "The hot season was very long, and the village well became dry. The villagers had no water to drink or cook with. The children walked for two hours to the river every day. ❓ What was the main problem in the village?", options: ["The well was dry", "The river was dirty", "It was too cold", "There was a fire"], answer: "The well was dry" },
    // skill: cause & effect
    { id: "sq5", type: "quick", tier: 2, q: "The old wooden bridge had a sign: DANGER! Do not cross! Dimas was late for school, so he ignored the sign and ran across. The bridge broke, and he fell into the shallow river. ❓ What happened because Dimas ignored the warning sign?", options: ["He fell in the river", "He came early", "He found a new road", "He won a prize"], answer: "He fell in the river" },
    // skill: resolution
    { id: "sq6", type: "quick", tier: 2, q: "Kancil wanted to cross a river full of crocodiles. He shouted, \"The king wants me to count you!\" The crocodiles lined up. Kancil jumped on their backs, counting one by one, and reached the other side. ❓ How did Kancil solve his problem?", options: ["He tricked them", "He swam fast", "He built a raft", "He waited all night"], answer: "He tricked them" },

    // ---------- QUICK CHOICE · tier 3 (STORY DETECTIVE) — motivation, inference, connecting details, moral ----------
    // skill: motivation
    { id: "sq7", type: "quick", tier: 3, q: "A hungry mouse saw some cheese near a sleeping cat. He was afraid to go closer. The mouse rolled a small ball across the floor. The noise woke the cat, and it followed the ball. The mouse took the cheese and ran away. ❓ Why did the mouse roll the ball?", options: ["To distract the cat", "To play a game", "To wake his family", "To make a new friend"], answer: "To distract the cat" },
    // skill: inference
    { id: "sq8", type: "quick", tier: 3, q: "Nina found a wallet on the school field. There was a lot of money and a student card inside. She did not take anything. She went to the teacher and returned the wallet. ❓ What can we infer about Nina?", options: ["She is honest.", "She is careless.", "She is impatient.", "She is frightened."], answer: "She is honest." },
    // skill: connecting two details (motivation)
    { id: "sq9", type: "quick", tier: 3, q: "A tiny mouse ran across a sleeping lion. The lion woke up but let the mouse go. Later, hunters caught the lion in a net. The mouse chewed the ropes and freed him. ❓ Why did the mouse free the lion?", options: ["The lion let him go", "Hunters asked him", "He wanted the net", "He feared the lion"], answer: "The lion let him go" },
    // skill: moral value
    { id: "sq10", type: "quick", tier: 3, q: "Malin became rich, but he was ashamed of his poor mother. He said, \"You are not my mother!\" and sailed away. His mother cried and prayed. Then a terrible storm came, and Malin's ship turned into stone. ❓ What is the lesson of this story?", options: ["Respect your parents", "Never travel by ship", "Work hard for money", "Fear the storm"], answer: "Respect your parents" },

    // ---------- FILL THE GAP · tier 1 (CHARACTER CHECK) — objects, characters, explicit details ----------
    // skill: story detail (object)
    { id: "sg1", type: "gap", tier: 1, before: "In the story, a giant chased Timun Mas through the forest. She threw a handful of cucumber", after: "behind her, and a huge cucumber field grew to stop him.", options: ["seeds", "stones", "sticks", "leaves"], answer: "seeds" },
    // skill: character / setting detail
    { id: "sg2", type: "gap", tier: 1, before: "Long ago, a poor fisherman lived beside a big lake in Sumatra. One day, he caught a golden", after: "with shiny scales and small fins.", options: ["fish", "turtle", "crab", "frog"], answer: "fish" },

    // ---------- FILL THE GAP · tier 2 (THE ENDING) — consequence and resolution ----------
    // skill: cause & effect / vocabulary in context (broke a promise)
    { id: "sg3", type: "gap", tier: 2, before: "The fisherman promised his wife never to tell anyone her secret. But one day he became angry and told everyone, so he", after: "his promise, and a great flood came.", options: ["broke", "kept", "made", "remembered"], answer: "broke" },
    // skill: resolution
    { id: "sg4", type: "gap", tier: 2, before: "Roro Jonggrang wanted to stop Bandung Bondowoso from finishing the last temple. She asked the women to pound rice loudly, so the roosters thought it was morning and began to", after: "before he could finish.", options: ["crow", "bark", "meow", "roar"], answer: "crow" },

    // ---------- FILL THE GAP · tier 3 (also used in the FINAL QUEST) — cause & effect, character values ----------
    // skill: cause & effect / moral value
    { id: "sg5", type: "gap", tier: 3, before: "A dog carried a bone across a bridge. In the water, he saw another dog with a bigger bone. He barked, and his bone fell into the river. He lost it because he was too", after: "and wanted the other bone.", options: ["greedy", "tired", "careful", "polite"], answer: "greedy" },
    // skill: inference / moral value
    { id: "sg6", type: "gap", tier: 3, before: "Rina promised to help her friend clean the classroom after school. It started to rain hard, but she still went to help. Rina always", after: "her promises.", options: ["keeps", "breaks", "forgets", "hides"], answer: "keeps" },

    // ---------- STORY ORDER (word order) — narrative sentences ----------
    // skill: character / setting sentence
    { id: "so1", type: "order", tier: 1, answer: "The old woman lived in a small village" },
    // skill: character + event sentence
    { id: "so2", type: "order", tier: 1, answer: "A hungry fox found some grapes" },
    // skill: sequence word (finally)
    { id: "so3", type: "order", tier: 2, answer: "Finally, the villagers found a solution", alt: ["The villagers finally found a solution"] },
    // skill: event sentence
    { id: "so4", type: "order", tier: 2, answer: "The princess carefully opened the old box", alt: ["The princess opened the old box carefully", "Carefully the princess opened the old box"] },
    // skill: sequence + cause & effect (after)
    { id: "so5", type: "order", tier: 3, answer: "After the storm the ship turned into stone", alt: ["The ship turned into stone after the storm"] },
    // skill: sequence (when)
    { id: "so6", type: "order", tier: 3, answer: "When the sun rose the giant disappeared", alt: ["The giant disappeared when the sun rose"] },

    // ---------- QUICK TALE (speed round) — short, one-glance reading skills ----------
    // skill: sequence
    { id: "ss1", type: "speed", q: "Timun Mas threw the seeds. Then a cucumber field grew. Which comes first?", options: ["She threw the seeds.", "A field grew."], answer: "She threw the seeds." },
    // skill: complication vs resolution
    { id: "ss2", type: "speed", q: "The giant chased Timun Mas. Is this the problem or the solution?", options: ["Problem", "Solution"], answer: "Problem" },
    // skill: character role
    { id: "ss3", type: "speed", q: "The giant chased the girl to catch her. Who is the villain?", options: ["The giant", "The girl"], answer: "The giant" },
    // skill: story detail
    { id: "ss4", type: "speed", q: "The girl opened the old box and found a golden key. What did she find?", options: ["A golden key", "A silver ring"], answer: "A golden key" },
    // skill: setting detail
    { id: "ss5", type: "speed", q: "Dimas heard a loud noise and hid behind the big tree. Where did he hide?", options: ["Behind the tree", "Under the bed"], answer: "Behind the tree" },
    // skill: vocabulary in context
    { id: "ss6", type: "speed", q: "The old woman was exhausted after the long walk. 'Exhausted' means:", options: ["very tired", "very happy"], answer: "very tired" },
    // skill: vocabulary in context
    { id: "ss7", type: "speed", q: "The boy was terrified when he saw the huge snake. 'Terrified' means:", options: ["very scared", "very proud"], answer: "very scared" },
    // skill: moral value
    { id: "ss8", type: "speed", q: "The boy returned the money he found. This shows:", options: ["honesty", "greed"], answer: "honesty" },
  ],
};
