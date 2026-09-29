// ENGLISH YO! — CLASS CLASH content pack: FAMILY & FRIENDS  (CEFR A1–A2, junior high)
// Focus: family vocabulary, extended family, possessive adjectives, possessive 's, relationship reasoning.
//
// A pack is { rounds, questions } and uses the SAME schema as the Daily Routine pack:
//   quick  { q, options[4], answer }               multiple choice
//   gap    { before, after, options[4], answer }   sentence = before + [blank] + after
//   order  { answer, alt?, question? }             tap the words into the right order
//   speed  { q, options[2], answer }               short two-option challenge (SPEED ROUND)
// `answer` is the exact text of the correct option. Options are shuffled per player at runtime.
//
// This pack adds one OPTIONAL field the engine understands: `tier` (1 easy → 3 extended family).
// A round with `tier: n` only draws questions with the same tier, so a session progresses naturally
// while the 30-question bank still varies between players and replays (the shuffle seed is new each game).
//
// Every question has exactly one defensible answer; distractors are wrong by meaning, not by trickery.

const CC_PACK_FAMILY = {
  // 10 rounds — same shape as Daily Routine. Per player one session uses 12 of the 30 questions.
  rounds: [
    { pool: "quick", tier: 1, label: "QUICK CHOICE", icon: "🎯", seconds: 20 },
    { pool: "order", tier: 1, label: "BUILD A SENTENCE", icon: "🧩", seconds: 30 },
    { pool: "gap", tier: 1, label: "FILL THE GAP", icon: "✏️", seconds: 20 },
    { pool: "quick", tier: 2, label: "QUICK CHOICE", icon: "🎯", seconds: 20 },
    { pool: "gap", tier: 2, label: "FILL THE GAP", icon: "✏️", seconds: 20 },
    { pool: "order", tier: 2, label: "BUILD A SENTENCE", icon: "🧩", seconds: 30 },
    { pool: "quick", tier: 3, label: "RELATIONSHIP CHALLENGE", icon: "👨‍👩‍👧", seconds: 25 },
    { pool: "order", tier: 3, label: "BUILD A SENTENCE", icon: "🧩", seconds: 30 },
    { pool: "speed", label: "SPEED ROUND", icon: "⚡", seconds: 20, count: 3 },
    { pool: "gap", tier: 3, label: "FINAL ROUND", icon: "🏆", seconds: 25, final: true },
  ],

  questions: [
    // ---------- QUICK CHOICE · tier 1 — easy vocabulary and relationships ----------
    { id: "fq1", type: "quick", tier: 1, q: "Your father's father is your ____.", options: ["grandfather", "uncle", "cousin", "nephew"], answer: "grandfather" },
    { id: "fq2", type: "quick", tier: 1, q: "Your brothers and sisters are your ____.", options: ["siblings", "cousins", "parents", "uncles"], answer: "siblings" },
    { id: "fq3", type: "quick", tier: 1, q: "Rina is Budi's daughter. Budi is Rina's ____.", options: ["father", "son", "brother", "uncle"], answer: "father" },

    // ---------- QUICK CHOICE · tier 2 — possessive 's and possessive adjectives ----------
    { id: "fq4", type: "quick", tier: 2, q: "Which sentence is correct?", options: ["Tom's brother is tall.", "Toms brother is tall.", "Tom brother's is tall.", "Tom is brother's tall."], answer: "Tom's brother is tall." },
    { id: "fq5", type: "quick", tier: 2, q: "Tom has a sister. ____ name is Sarah.", options: ["Her", "His", "Their", "Our"], answer: "Her" },
    { id: "fq6", type: "quick", tier: 2, q: "My mother's sister is my ____.", options: ["aunt", "cousin", "niece", "grandmother"], answer: "aunt" },

    // ---------- QUICK CHOICE · tier 3 — relationship reasoning (RELATIONSHIP CHALLENGE) ----------
    { id: "fq7", type: "quick", tier: 3, q: "Mr. Ali has two sons. Their names are Rafi and Dimas. Rafi is Dimas's ____.", options: ["brother", "cousin", "uncle", "father"], answer: "brother" },
    { id: "fq8", type: "quick", tier: 3, q: "My father's brother has a son. The boy is my ____.", options: ["cousin", "nephew", "uncle", "brother"], answer: "cousin" },
    { id: "fq9", type: "quick", tier: 3, q: "My sister has a son. He is my ____.", options: ["nephew", "niece", "cousin", "uncle"], answer: "nephew" },
    { id: "fq10", type: "quick", tier: 3, q: "Mrs. Sari is Mr. Tono's wife. Mrs. Sari's mother is Mr. Tono's ____.", options: ["mother-in-law", "stepmother", "grandmother", "aunt"], answer: "mother-in-law" },

    // ---------- FILL THE GAP · tier 1 ----------
    { id: "fg1", type: "gap", tier: 1, before: "", after: "are your mother and father.", options: ["Parents", "Cousins", "Sons", "Uncles"], answer: "Parents" },
    { id: "fg2", type: "gap", tier: 1, before: "My mother's", after: "is my grandfather.", options: ["father", "brother", "son", "husband"], answer: "father" },

    // ---------- FILL THE GAP · tier 2 ----------
    { id: "fg3", type: "gap", tier: 2, before: "This is my", after: "sister.", options: ["father's", "fathers", "father", "fathers'"], answer: "father's" },
    { id: "fg4", type: "gap", tier: 2, before: "My brother and I love", after: "grandmother.", options: ["our", "their", "his", "her"], answer: "our" },

    // ---------- FILL THE GAP · tier 3 (also used in the FINAL ROUND) ----------
    { id: "fg5", type: "gap", tier: 3, before: "Anna is my aunt.", after: "daughter is my cousin.", options: ["Her", "His", "Their", "Our"], answer: "Her" },
    { id: "fg6", type: "gap", tier: 3, before: "My mother has a new husband. My", after: "is very kind to me.", options: ["stepfather", "stepmother", "stepbrother", "half-brother"], answer: "stepfather" },

    // ---------- BUILD A SENTENCE ----------
    { id: "fo1", type: "order", tier: 1, answer: "This is my grandmother" },
    { id: "fo2", type: "order", tier: 1, answer: "I have two sisters and one brother", alt: ["I have one brother and two sisters"] },
    { id: "fo3", type: "order", tier: 2, answer: "Rina's mother is a doctor" },
    { id: "fo4", type: "order", tier: 2, answer: "Sinta's grandparents live in Bali" },
    { id: "fo5", type: "order", tier: 3, answer: "My uncle's daughter is my cousin" },
    { id: "fo6", type: "order", tier: 3, answer: "Does your aunt live with your grandparents", question: true },

    // ---------- SPEED ROUND (two options, answer fast) ----------
    { id: "fs1", type: "speed", q: "My father's grandfather is my ____.", options: ["great-grandfather", "grandfather"], answer: "great-grandfather" },
    { id: "fs2", type: "speed", q: "Sarah is Tom's sister. So Sarah is ____ sister.", options: ["his", "her"], answer: "his" },
    { id: "fs3", type: "speed", q: "My uncle's wife is my ____.", options: ["aunt", "mother"], answer: "aunt" },
    { id: "fs4", type: "speed", q: "My sister's daughter is my ____.", options: ["niece", "cousin"], answer: "niece" },
    { id: "fs5", type: "speed", q: "The oldest child in a family is the ____ child.", options: ["eldest", "youngest"], answer: "eldest" },
    { id: "fs6", type: "speed", q: "A child with no brothers or sisters is an ____ child.", options: ["only", "eldest"], answer: "only" },
    { id: "fs7", type: "speed", q: "Mr. and Mrs. Hadi have one son. ____ son is Ali.", options: ["Their", "Her"], answer: "Their" },
    { id: "fs8", type: "speed", q: "A family with only parents and children is a ____ family.", options: ["nuclear", "extended"], answer: "nuclear" },
  ],
};
