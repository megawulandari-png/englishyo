// ENGLISH YO! — CLASS CLASH content: avatars, teams, round plan, question bank.
// Theme: Daily Routine Adventure · Grade 7 SMP · CEFR A1–A2.
// Answers are stored as the correct option TEXT; options are shuffled per player at runtime.

const CC_AVATARS = [
  "koala", "corgi", "deer", "raccoon", "sloth", "axolotl", "red-panda", "snowy-owl",
  "otter", "hedgehog", "penguin", "turtle", "alpaca", "monkey", "dolphin", "frog",
  "polar-bear", "panda", "cat", "husky", "rabbit", "fox", "bear", "elephant", "bird",
  "lion", "giraffe", "hippo", "rhino", "cow", "antelope", "koala-2", "flamingo", "peacock", "sea-otter",
];
const ccAvatarUrl = (key) => "assets/avatars/" + (CC_AVATARS.includes(key) ? key : CC_AVATARS[0]) + ".webp";

const CC_TEAMS = {
  fire: { name: "FIRE TEAM", short: "FIRE", emoji: "🔥", color: "#ff5a36", soft: "#ffe3d9", badge: "assets/ui/team-fire.webp" },
  bolt: { name: "BOLT TEAM", short: "BOLT", emoji: "⚡", color: "#f5b400", soft: "#fff3c4", badge: "assets/ui/team-bolt.webp" },
  wave: { name: "WAVE TEAM", short: "WAVE", emoji: "🌊", color: "#1f8fff", soft: "#dcefff", badge: "assets/ui/team-wave.webp" },
  leaf: { name: "LEAF TEAM", short: "LEAF", emoji: "🌿", color: "#22b35e", soft: "#dbf5e4", badge: "assets/ui/team-leaf.webp" },
};
const CC_TEAM_KEYS = ["fire", "bolt", "wave", "leaf"];

// pool = which question type is drawn; seconds = round timer.
const CC_ROUNDS = [
  { pool: "quick", label: "QUICK CHOICE", icon: "🎯", seconds: 20 },
  { pool: "order", label: "WORD ORDER", icon: "🧩", seconds: 30 },
  { pool: "gap", label: "FILL THE GAP", icon: "✏️", seconds: 20 },
  { pool: "time", label: "TIME CHALLENGE", icon: "⏰", seconds: 20 },
  { pool: "quick", label: "QUICK CHOICE", icon: "🎯", seconds: 20 },
  { pool: "order", label: "WORD ORDER", icon: "🧩", seconds: 30 },
  { pool: "gap", label: "FILL THE GAP", icon: "✏️", seconds: 20 },
  { pool: "time", label: "TIME CHALLENGE", icon: "⏰", seconds: 20 },
  { pool: "speed", label: "SPEED ROUND", icon: "⚡", seconds: 20, count: 3 },
  { pool: "gap", label: "FINAL ROUND", icon: "🏆", seconds: 25, final: true },
];

const CC_QUESTIONS = [
  // ---------- QUICK CHOICE ----------
  { id: "q1", type: "quick", q: "Which activity do we usually do in the bathroom?", options: ["take a shower", "cook dinner", "do homework", "catch the bus"], answer: "take a shower" },
  { id: "q2", type: "quick", q: "Choose the correct sentence.", options: ["He brushes his teeth every morning.", "He brush his teeth every morning.", "He brushing his teeth every morning.", "He are brush his teeth every morning."], answer: "He brushes his teeth every morning." },
  { id: "q3", type: "quick", q: "\"I ALWAYS eat breakfast.\" How often do I eat breakfast?", options: ["every day", "never", "only on Sunday", "once a month"], answer: "every day" },
  { id: "q4", type: "quick", q: "Which adverb of frequency means 0%?", options: ["never", "often", "usually", "sometimes"], answer: "never" },
  { id: "q5", type: "quick", q: "What do you use to brush your teeth?", options: ["a toothbrush", "a towel", "a comb", "a pillow"], answer: "a toothbrush" },
  { id: "q6", type: "quick", q: "Choose the correct question.", options: ["Does she go to school by bus?", "Do she go to school by bus?", "Does she goes to school by bus?", "Is she go to school by bus?"], answer: "Does she go to school by bus?" },
  { id: "q7", type: "quick", q: "Andi is tired. What is the healthiest thing to do at 9 p.m.?", options: ["go to bed", "play games until midnight", "drink three cups of coffee", "watch TV all night"], answer: "go to bed" },
  { id: "q8", type: "quick", q: "Which is the best order for a school morning?", options: ["wake up → take a bath → have breakfast", "have breakfast → wake up → take a bath", "take a bath → wake up → have breakfast", "have breakfast → take a bath → wake up"], answer: "wake up → take a bath → have breakfast" },
  { id: "q9", type: "quick", q: "Make it negative: \"She reads a book every night.\"", options: ["She doesn't read a book every night.", "She don't read a book every night.", "She doesn't reads a book every night.", "She not read a book every night."], answer: "She doesn't read a book every night." },
  { id: "q10", type: "quick", q: "Which one is a GOOD daily habit?", options: ["helping parents clean the house", "skipping breakfast", "sleeping in class", "coming to school late"], answer: "helping parents clean the house" },
  { id: "q11", type: "quick", q: "\"Usually\" means about ___ of the time.", options: ["90%", "0%", "10%", "50%"], answer: "90%" },
  { id: "q12", type: "quick", q: "It's 7 a.m. What do you say to your teacher?", options: ["Good morning!", "Good night!", "Good evening!", "Good afternoon!"], answer: "Good morning!" },
  { id: "q13", type: "quick", q: "\"Do you go to school on Sunday?\" — Choose the correct answer.", options: ["No, I don't.", "No, I doesn't.", "No, I am not go.", "No, I not."], answer: "No, I don't." },
  { id: "q14", type: "quick", q: "Which sentence is correct?", options: ["I often read books.", "I read often books.", "Often I books read.", "I often books read."], answer: "I often read books." },
  { id: "q15", type: "quick", q: "Which one is a daily routine?", options: ["wake up", "beautiful", "yesterday", "kitchen"], answer: "wake up" },

  // ---------- FILL THE GAP ----------
  { id: "g1", type: "gap", before: "My sister", after: "her teeth twice a day.", options: ["brushes", "brush", "brushing", "to brush"], answer: "brushes" },
  { id: "g2", type: "gap", before: "We", after: "to school at 6:45 a.m.", options: ["go", "goes", "going", "is go"], answer: "go" },
  { id: "g3", type: "gap", before: "Dimas", after: "his room every Saturday.", options: ["cleans", "clean", "cleaning", "is clean"], answer: "cleans" },
  { id: "g4", type: "gap", before: "Vegetables are healthy, so I", after: "eat them.", options: ["always", "never", "rarely", "don't"], answer: "always" },
  { id: "g5", type: "gap", before: "My father", after: "coffee every morning.", options: ["drinks", "drink", "drinking", "to drink"], answer: "drinks" },
  { id: "g6", type: "gap", before: "They", after: "football in the afternoon.", options: ["play", "plays", "playing", "is play"], answer: "play" },
  { id: "g7", type: "gap", before: "School", after: "at seven o'clock.", options: ["starts", "start", "starting", "is start"], answer: "starts" },
  { id: "g8", type: "gap", before: "", after: "you have breakfast every day?", options: ["Do", "Does", "Are", "Is"], answer: "Do" },
  { id: "g9", type: "gap", before: "", after: "Siti help her mother at home?", options: ["Does", "Do", "Is", "Are"], answer: "Does" },
  { id: "g10", type: "gap", before: "He doesn't", after: "TV before school.", options: ["watch", "watches", "watching", "watched"], answer: "watch" },
  { id: "g11", type: "gap", before: "I go to bed", after: "9 p.m.", options: ["at", "on", "in", "of"], answer: "at" },
  { id: "g12", type: "gap", before: "We have lunch", after: "noon.", options: ["at", "in", "on", "for"], answer: "at" },
  { id: "g13", type: "gap", before: "I do my homework", after: "the evening.", options: ["in", "at", "on", "to"], answer: "in" },
  { id: "g14", type: "gap", before: "Nisa is on time every day. She", after: "late for school.", options: ["is never", "never is", "is always", "always is"], answer: "is never" },

  // ---------- WORD ORDER ----------
  { id: "o1", type: "order", answer: "I get up at six o'clock", alt: ["At six o'clock I get up"] },
  { id: "o2", type: "order", answer: "She always helps her mother" },
  { id: "o3", type: "order", answer: "They go to school by bike" },
  { id: "o4", type: "order", answer: "My brother never skips breakfast" },
  { id: "o5", type: "order", answer: "We usually read books after dinner", alt: ["After dinner we usually read books"] },
  { id: "o6", type: "order", answer: "Does he take a shower every morning", question: true },
  { id: "o7", type: "order", answer: "I sometimes cook fried rice", alt: ["Sometimes I cook fried rice"] },
  { id: "o8", type: "order", answer: "Rudi brushes his teeth before bed" },
  { id: "o9", type: "order", answer: "The class starts at seven fifteen" },
  { id: "o10", type: "order", answer: "I am never late for school" },

  // ---------- TIME CHALLENGE ----------
  { id: "t1", type: "time", h: 7, m: 0, mode: "analog", ctx: "🏫 School starts!", options: ["It's seven o'clock.", "It's eight o'clock.", "It's half past seven.", "It's twelve o'clock."], answer: "It's seven o'clock." },
  { id: "t2", type: "time", h: 6, m: 30, mode: "analog", ctx: "🍳 Breakfast time!", options: ["It's half past six.", "It's half past seven.", "It's six o'clock.", "It's a quarter past six."], answer: "It's half past six." },
  { id: "t3", type: "time", h: 7, m: 15, mode: "analog", ctx: "🚌 The bus comes.", options: ["It's a quarter past seven.", "It's a quarter to seven.", "It's a quarter past three.", "It's half past seven."], answer: "It's a quarter past seven." },
  { id: "t4", type: "time", h: 7, m: 45, mode: "analog", ctx: "📚 First lesson.", options: ["It's a quarter to eight.", "It's a quarter past eight.", "It's a quarter to seven.", "It's half past seven."], answer: "It's a quarter to eight." },
  { id: "t5", type: "time", h: 5, m: 10, mode: "digital", ctx: "⏰ Wake-up alarm!", options: ["It's ten past five.", "It's ten to five.", "It's five past ten.", "It's ten past six."], answer: "It's ten past five." },
  { id: "t6", type: "time", h: 9, m: 50, mode: "analog", ctx: "🛌 Almost bedtime.", options: ["It's ten to ten.", "It's ten past nine.", "It's ten to nine.", "It's ten past ten."], answer: "It's ten to ten." },
  { id: "t7", type: "time", h: 12, m: 0, mode: "digital", ctx: "🍱 Lunch break!", options: ["It's twelve o'clock.", "It's two o'clock.", "It's half past twelve.", "It's a quarter to twelve."], answer: "It's twelve o'clock." },
  { id: "t8", type: "time", h: 6, m: 20, mode: "analog", ctx: "🚿 Shower time.", options: ["It's twenty past six.", "It's twenty to six.", "It's twenty past seven.", "It's twenty to seven."], answer: "It's twenty past six." },
  { id: "t9", type: "time", h: 3, m: 40, mode: "digital", ctx: "⚽ Football practice.", options: ["It's twenty to four.", "It's twenty past three.", "It's twenty to three.", "It's twenty past four."], answer: "It's twenty to four." },
  { id: "t10", type: "time", h: 8, m: 5, mode: "analog", ctx: "🧹 Clean the classroom.", options: ["It's five past eight.", "It's five to eight.", "It's five past nine.", "It's five to nine."], answer: "It's five past eight." },

  // ---------- SPEED ROUND (short, 2 options) ----------
  { id: "s1", type: "speed", q: "I ___ up at 5 a.m.", options: ["get", "gets"], answer: "get" },
  { id: "s2", type: "speed", q: "She ___ to school.", options: ["walks", "walk"], answer: "walks" },
  { id: "s3", type: "speed", q: "The opposite of \"always\"?", options: ["never", "often"], answer: "never" },
  { id: "s4", type: "speed", q: "The morning meal is…", options: ["breakfast", "dinner"], answer: "breakfast" },
  { id: "s5", type: "speed", q: "We ___ dinner at 7 p.m.", options: ["have", "has"], answer: "have" },
  { id: "s6", type: "speed", q: "He ___ his hands.", options: ["washes", "wash"], answer: "washes" },
  { id: "s7", type: "speed", q: "More often: \"usually\" or \"rarely\"?", options: ["usually", "rarely"], answer: "usually" },
  { id: "s8", type: "speed", q: "Do you like milk? — Yes, I ___.", options: ["do", "does"], answer: "do" },
  { id: "s9", type: "speed", q: "12:00 in the day is…", options: ["noon", "midnight"], answer: "noon" },
  { id: "s10", type: "speed", q: "My mom ___ lunch.", options: ["cooks", "cook"], answer: "cooks" },
  { id: "s11", type: "speed", q: "Bedtime: \"Good ___!\"", options: ["night", "morning"], answer: "night" },
  { id: "s12", type: "speed", q: "Ben ___ play games on school nights.", options: ["doesn't", "don't"], answer: "doesn't" },
  { id: "s13", type: "speed", q: "I ___ my homework after school.", options: ["do", "does"], answer: "do" },
];
