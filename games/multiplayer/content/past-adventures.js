// ENGLISH YO! — CLASS CLASH content pack: PAST ADVENTURES  (CEFR A1–A2, junior high)
// Focus: Simple Past (regular + common irregular verbs), affirmative / negative / Did-questions,
// past time expressions, and short past-event contexts.
//
// Same schema and round shape as content/family-friends.js:
//   quick  { q, options[4], answer }               multiple choice
//   gap    { before, after, options[4], answer }   sentence = before + [blank] + after
//   order  { answer, alt?, question? }             tap the words into the right order
//   speed  { q, options[2], answer }               short two-option challenge (SPEED ROUND)
// `tier` (1 easy → 2 medium → 3 challenge) lets a session get harder round by round while the
// 30-question bank still varies between players and replays.
//
// Grammar reminders used throughout:  Affirmative = S + V2 · Negative = S + didn't + BASE · Question = Did + S + BASE?
// Every question has exactly one defensible answer; distractors are real learner errors, not nonsense words.

const CC_PACK_PAST = {
  // 10 rounds — identical structure to the other packs. Each player sees 12 of the 30 questions per session.
  rounds: [
    { pool: "quick", tier: 1, label: "QUICK CHOICE", icon: "🎯", seconds: 20 },
    { pool: "order", tier: 1, label: "BUILD A SENTENCE", icon: "🧩", seconds: 30 },
    { pool: "gap", tier: 1, label: "FILL THE GAP", icon: "✏️", seconds: 20 },
    { pool: "quick", tier: 2, label: "QUICK CHOICE", icon: "🎯", seconds: 20 },
    { pool: "gap", tier: 2, label: "FILL THE GAP", icon: "✏️", seconds: 20 },
    { pool: "order", tier: 2, label: "BUILD A SENTENCE", icon: "🧩", seconds: 30 },
    { pool: "quick", tier: 3, label: "PAST DETECTIVE", icon: "🔎", seconds: 25 },
    { pool: "order", tier: 3, label: "BUILD A SENTENCE", icon: "🧩", seconds: 30 },
    { pool: "speed", label: "SPEED ROUND", icon: "⚡", seconds: 20, count: 3 },
    { pool: "gap", tier: 3, label: "FINAL ROUND", icon: "🏆", seconds: 25, final: true },
  ],

  questions: [
    // ---------- QUICK CHOICE · tier 1 — recognising past forms in a simple context ----------
    { id: "pq1", type: "quick", tier: 1, q: "Yesterday, Nita ____ her grandmother and listened to her stories.", options: ["visited", "visit", "visits", "visiting"], answer: "visited" },
    { id: "pq2", type: "quick", tier: 1, q: "Raka played football after school. He was hungry, so he ____ two sandwiches.", options: ["ate", "eat", "eats", "eating"], answer: "ate" },
    { id: "pq3", type: "quick", tier: 1, q: "Dimas ran in the school race. After the race, he got thirsty and ____ a glass of water.", options: ["drank", "drink", "drinks", "drinking"], answer: "drank" },

    // ---------- QUICK CHOICE · tier 2 — negatives, Did-questions, regular vs irregular ----------
    { id: "pq4", type: "quick", tier: 2, q: "Dina was sick yesterday, so she ____ to school.", options: ["didn't go", "didn't went", "doesn't go", "not went"], answer: "didn't go" },
    { id: "pq5", type: "quick", tier: 2, q: "____ you watch the football match last night?", options: ["Did", "Do", "Does", "Were"], answer: "Did" },
    { id: "pq6", type: "quick", tier: 2, q: "Which sentence is correct?", options: ["Nina practiced the piano last night.", "Nina practice the piano last night.", "Nina practices the piano last night.", "Nina practicing the piano last night."], answer: "Nina practiced the piano last night." },

    // ---------- QUICK CHOICE · tier 3 — short contextual reasoning (PAST DETECTIVE) ----------
    { id: "pq7", type: "quick", tier: 3, q: "Arga left home at 6:30 a.m. He took the bus at 6:45 a.m. What did Arga do first?", options: ["He left home.", "He took the bus.", "He went to school.", "He came home."], answer: "He left home." },
    { id: "pq8", type: "quick", tier: 3, q: "Sinta woke up at 5 a.m. She ate breakfast, and then she walked to school. What did Sinta do after breakfast?", options: ["She walked to school.", "She woke up.", "She ate breakfast.", "She stayed at home."], answer: "She walked to school." },
    { id: "pq9", type: "quick", tier: 3, q: "Today is Friday. Budi visited Borobudur on Wednesday and wrote a report about it. When did Budi visit Borobudur?", options: ["Two days ago.", "Yesterday.", "Last week.", "This morning."], answer: "Two days ago." },
    { id: "pq10", type: "quick", tier: 3, q: "Which sentence is about the past?", options: ["We visited Malioboro last Sunday.", "We visit Malioboro every Sunday.", "We are visiting Malioboro now.", "We will visit Malioboro next Sunday."], answer: "We visited Malioboro last Sunday." },

    // ---------- FILL THE GAP · tier 1 ----------
    { id: "pg1", type: "gap", tier: 1, before: "Yesterday morning, I", after: "my mother in the kitchen while she cooked dinner, and then I studied for my English test.", options: ["helped", "help", "helps", "helping"], answer: "helped" },
    { id: "pg2", type: "gap", tier: 1, before: "Last Sunday, my brother", after: "to the market with my mother and bought some fruit.", options: ["went", "go", "goes", "going"], answer: "went" },

    // ---------- FILL THE GAP · tier 2 ----------
    { id: "pg3", type: "gap", tier: 2, before: "Did your sister", after: "the cake for your birthday?", options: ["make", "made", "makes", "making"], answer: "make" },
    { id: "pg4", type: "gap", tier: 2, before: "The shop was closed, so Dad", after: "a new bag.", options: ["didn't buy", "didn't bought", "doesn't buy", "not bought"], answer: "didn't buy" },

    // ---------- FILL THE GAP · tier 3 (also used in the FINAL ROUND) ----------
    { id: "pg5", type: "gap", tier: 3, before: "I lost my pen yesterday, but my friend", after: "it under the desk this morning and gave it back to me.", options: ["found", "find", "finds", "finding"], answer: "found" },
    { id: "pg6", type: "gap", tier: 3, before: "Sari finished class and went to the library, but she", after: "the book she wanted.", options: ["didn't find", "didn't found", "doesn't find", "not found"], answer: "didn't find" },

    // ---------- BUILD A SENTENCE ----------
    { id: "po1", type: "order", tier: 1, answer: "My family visited Prambanan Temple last weekend", alt: ["Last weekend my family visited Prambanan Temple"] },
    { id: "po2", type: "order", tier: 1, answer: "I watched a movie last night", alt: ["Last night I watched a movie"] },
    { id: "po3", type: "order", tier: 2, answer: "We didn't take the bus yesterday", alt: ["Yesterday we didn't take the bus"] },
    { id: "po4", type: "order", tier: 2, answer: "Did you visit Malioboro last Sunday", question: true },
    { id: "po5", type: "order", tier: 3, answer: "After school we cleaned the classroom together", alt: ["We cleaned the classroom together after school"] },
    { id: "po6", type: "order", tier: 3, answer: "Did they read the book about Borobudur", question: true },

    // ---------- SPEED ROUND (two options, answer fast) ----------
    { id: "ps1", type: "speed", q: "Rio ____ around the school field this morning.", options: ["ran", "run"], answer: "ran" },
    { id: "ps2", type: "speed", q: "They ____ to Yogyakarta three weeks ago.", options: ["came", "come"], answer: "came" },
    { id: "ps3", type: "speed", q: "We ____ lunch at a small warung yesterday.", options: ["had", "have"], answer: "had" },
    { id: "ps4", type: "speed", q: "We ____ a beautiful sunset at Parangtritis last weekend.", options: ["saw", "see"], answer: "saw" },
    { id: "ps5", type: "speed", q: "We ____ a story about Borobudur two days ago.", options: ["read", "reads"], answer: "read" },
    { id: "ps6", type: "speed", q: "Our team ____ the game last Saturday.", options: ["won", "win"], answer: "won" },
    { id: "ps7", type: "speed", q: "Which is a time expression for the past?", options: ["last night", "next week"], answer: "last night" },
    { id: "ps8", type: "speed", q: "I ____ my aunt at the station yesterday.", options: ["met", "meet"], answer: "met" },
  ],
};
