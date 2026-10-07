/* RECOUNT QUEST — core content data (ENGLISH YO!)
   Stories live in story-personal.js, story-factual.js and story-imaginative.js.
   Assets: add a file name to RQ.assets ONLY after the PNG exists in /img.
   Audio: Recount Quest uses the browser's built-in text-to-speech. No audio files are needed. */
window.RQ = window.RQ || {};

/* key -> file inside /img (empty on purpose; CSS illustrations are used until a PNG is listed)
   keys: 'world-personal', 'world-factual', 'world-imaginative', '<episodeId>-card', 'visual-<episodeId>' */
RQ.assets = {
  "world-personal": "worlds/personal.png", "world-factual": "worlds/factual.png", "world-imaginative": "worlds/imaginative.png",
  "race-card": "scenes/race.png", "message-card": "scenes/message.png", "stage-card": "scenes/stage.png",
  "habibie-card": "scenes/habibie.png", "kartini-card": "scenes/kartini.png", "drill-card": "scenes/drill.png",
  "y2050-card": "scenes/y2050.png", "mars-card": "scenes/mars.png", "invisible-card": "scenes/invisible.png"
};
RQ.audio = {};
/* interface artwork (cropped from the Recount Quest asset sheet); paths are relative to /img */
RQ.ui = {
  logo: "logo/recount-quest-logo.png",
  boy: "avatars/boy.png", girl: "avatars/girl.png", investigator: "avatars/investigator.png", explorer: "avatars/explorer.png",
  passport: "icons/passport.png", trophy: "icons/trophy.png", medal: "icons/medal.png", lock: "icons/lock.png", check: "icons/check.png", cross: "icons/cross.png",
  book: "icons/book.png", clock: "icons/clock.png", magnifier: "icons/magnifier.png", binoculars: "icons/binoculars.png", bulb: "icons/bulb.png", pencil: "icons/pencil.png",
  chat: "icons/chat.png", chat2: "icons/chat2.png", signpost: "icons/signpost.png", pin: "icons/pin.png", marker: "icons/marker.png", photo: "icons/photo.png", globe: "icons/globe.png",
  play: "icons/play.png", pause: "icons/pause.png", stop: "icons/stop.png", checklist: "icons/checklist.png", star: "icons/star.png", warning: "icons/warning.png",
  "w-personal": "worlds/personal.png", "w-factual": "worlds/factual.png", "w-imaginative": "worlds/imaginative.png",
  "bg-personal": "backgrounds/stage.png", "bg-factual": "backgrounds/school.png", "bg-imaginative": "backgrounds/mars-city.png"
};

/* question builders (keep the story files short and consistent) */
RQ.q = {
  mcq: function (tag, q, o, a, why, x) { var r = { k: "mcq", tag: tag, q: q, o: o, a: a, why: why }; if (x) for (var p in x) r[p] = x[p]; return r; },
  tf: function (q, a, why, x) { var r = { k: "tf", tag: "tf", q: q, a: a, why: why }; if (x) for (var p in x) r[p] = x[p]; return r; },
  ma: function (tag, q, o, a, why) { return { k: "mcma", tag: tag, q: q, o: o, a: a, why: why }; },
  match: function (q, pairs, why) { return { k: "match", tag: "match", q: q, pairs: pairs, why: why }; },
  sort: function (s, a) { return { k: "sort3", tag: "structure", s: s, a: a }; },
  order: function (tag, q, events, why) { return { k: "order", tag: tag, q: q, events: events, why: why }; },
  para: function (label, n, opts, why) {
    return { k: "mcq", tag: "structure", q: "Which paragraph is the " + label + "?", o: opts.map(function (p) { return "Paragraph " + p; }), a: opts.indexOf(n), why: why, fix: true, hint: "Think about what each paragraph does: sets the scene, tells what happened, or looks back." };
  }
};

RQ.data = {
  worlds: [
    { id: "personal", icon: "👤", name: "MY STORIES", kind: "Personal Recount",
      blurb: "Real moments from a writer’s own life.",
      what: "A personal recount tells about something that happened to the writer.",
      clues: ["Uses I, my, we", "Real experience", "Feelings and reflection"] },
    { id: "factual", icon: "🌍", name: "REAL STORIES", kind: "Factual Recount",
      blurb: "Real people and real events, told in order.",
      what: "A factual recount reports events that really happened. The writer does not have to be in the story.",
      clues: ["Real people, dates and places", "Often uses he, she, they", "Events in time order"] },
    { id: "imaginative", icon: "✨", name: "IMAGINE IT!", kind: "Imaginative Recount",
      blurb: "Impossible adventures, told as if they happened.",
      what: "An imaginative recount tells an imaginary experience as if it really happened to the writer.",
      clues: ["Impossible or dream-like events", "Still told in the past, in order", "Orientation, Events, Reorientation"] }
  ],

  steps: [
    { id: "story", img: "book", icon: "📖", name: "Story", desc: "Read & listen to the recount" },
    { id: "timetrack", img: "clock", icon: "🕐", name: "Time Track", desc: "Follow the sequence of events", intro: "Put the events in the order they happened. Tap a card to place it, then check your order." },
    { id: "details", img: "magnifier", icon: "🔎", name: "Find the Details", desc: "Find explicit information", intro: "Go back to the text and find the information that is clearly stated." },
    { id: "detective", img: "binoculars", icon: "🧩", name: "Text Detective", desc: "Explore structure and evidence", intro: "Investigate how the text is built: its parts, its references, its words and its evidence." },
    { id: "deeper", img: "bulb", icon: "🧠", name: "Think Deeper", desc: "Make inferences", intro: "The answers are not always written in the text. Use clues and evidence to work them out." },
    { id: "challenge", img: "trophy", icon: "🏆", name: "Reading Challenge", desc: "Complete the final reading mission", intro: "Show everything you know about this recount." },
    { id: "complete", img: "medal", icon: "🏅", name: "Story Complete", desc: "Stars and badge" }
  ],

  /* Learn page content */
  learn: {
    cp: "Peserta didik mampu memahami dan merespons berbagai teks tulis dan multimodal, khususnya recount text, untuk menemukan informasi tersurat, memahami urutan peristiwa, menghubungkan informasi, serta menyimpulkan informasi tersirat dengan memperhatikan tujuan, struktur, dan unsur kebahasaan teks.",
    tp: [
      { im: "magnifier", i: "🔍", t: "Find explicit information", d: "Identify explicit information in recount texts." },
      { im: "bulb", i: "💡", t: "Main idea and details", d: "Identify the main idea and important details." },
      { im: "clock", i: "🕐", t: "Sequence of events", d: "Arrange events in chronological order." },
      { im: "book", i: "🧩", t: "Text structure", d: "Identify Orientation, Events and Reorientation." },
      { im: "photo", i: "👁️", t: "Text and visuals", d: "Interpret information presented through text and visual elements." },
      { im: "chat", i: "💭", t: "Feelings and evidence", d: "Infer characters’ or writers’ feelings based on textual evidence." },
      { im: "signpost", i: "🔗", t: "Cause and effect", d: "Identify cause-and-effect relationships." },
      { im: "binoculars", i: "🧠", t: "Inference", d: "Make reasonable inferences from information in the text." },
      { im: "marker", i: "🎯", t: "Communicative purpose", d: "Identify the communicative purpose of a recount text." },
      { im: "globe", i: "🗂️", t: "Three kinds of recount", d: "Distinguish Personal, Factual and Imaginative Recount." }
    ]
  },

  episodes: [],  /* filled by the story files */

  /* =============================================================== MASTER QUEST (Reading–Viewing) */
  master: [
    /* ---- Identify the type */
    { cat: "Identify the type", tag: "type", k: "mcq", q: "What type of recount is this text?",
      quote: "On Saturday, my cousin and I cooked fried rice for the first time. I burnt the first batch, and my cousin laughed at me. In the end, we ate the second batch happily.",
      o: ["Personal recount", "Factual recount", "Imaginative recount"], a: 0, fix: true, why: "The writer (I) tells a real experience from his or her own life." },
    { cat: "Identify the type", tag: "type", k: "mcq", q: "What type of recount is this text?",
      quote: "Mount Merapi erupted on 26 October 2010. Thousands of people left their villages, and rescue teams helped them move to safe places. The eruption continued for several weeks.",
      o: ["Personal recount", "Factual recount", "Imaginative recount"], a: 1, fix: true, why: "It reports a real event with a date, a place and real actions. The writer is not part of the story." },
    { cat: "Identify the type", tag: "type", k: "mcq", q: "What type of recount is this text?",
      quote: "Last night, my school bag started to talk. It said that it was tired of carrying heavy books, so we walked to the beach together and watched the sunrise.",
      o: ["Personal recount", "Factual recount", "Imaginative recount"], a: 2, fix: true, why: "A talking bag is impossible, but the events are told as a past experience in order. That is an imaginative recount." },

    /* ---- Compare texts */
    { cat: "Compare texts", tag: "compare", k: "mcq", q: "How are Text A and Text B different?",
      ext: [{ h: "Text A", t: "When I was ten, I got lost in a market in Yogyakarta. I cried until a kind seller helped me find my father." }, { h: "Text B", t: "In 1928, young people from many parts of Indonesia met in Jakarta. They promised to support one homeland, one nation and one language of unity." }],
      o: ["Text A tells a personal experience, but Text B tells a real historical event.", "Text A tells a real historical event, but Text B tells a personal experience.", "Text A is imaginative, but Text B is personal.", "Both texts tell imaginary experiences."], a: 0, why: "Text A uses “I” for the writer’s own experience. Text B reports a real event with a date and real people." },
    { cat: "Compare texts", tag: "compare", k: "mcq", q: "Which statement about the two texts is correct?",
      ext: [{ h: "Text A", t: "Yesterday, I flew above the clouds on a giant kite and met a friendly star." }, { h: "Text B", t: "Last week, I flew to Bali with my family. I felt nervous when the plane took off." }],
      o: ["Both texts tell about the past, but only Text A is imaginary.", "Both texts are factual recounts.", "Text B is imaginary, and Text A is personal.", "Neither text tells about the past."], a: 0, why: "Both use past events. A giant kite and a friendly star are impossible, so Text A is imaginative. Text B is a personal recount." },

    /* ---- Find evidence */
    { cat: "Find evidence", tag: "evidence", k: "mcq", q: "Which detail shows that Tina felt happy about her result?",
      quote: "Tina studied every evening for the English test. When she saw the result, she smiled and hugged her friend.",
      o: ["She smiled and hugged her friend.", "She studied every evening.", "She saw the result.", "She took the English test."], a: 0, why: "Smiling and hugging show happiness. The other details tell what she did, not how she felt." },
    { cat: "Find evidence", tag: "evidence", k: "mcq", q: "Which sentence best shows that the driver acted responsibly?",
      quote: "The bus stopped suddenly. Many passengers fell forward, and a baby began to cry. The driver quickly turned on the lights and checked everyone.",
      o: ["The driver quickly turned on the lights and checked everyone.", "The bus stopped suddenly.", "Many passengers fell forward.", "A baby began to cry."], a: 0, why: "Checking everyone is a responsible action. The other sentences describe the problem." },

    /* ---- Make inferences */
    { cat: "Make inferences", tag: "inference", k: "mcq", q: "What can we infer from the text?",
      quote: "A chocolate cake was on the table when Rina left for school. When she came home, the plate was empty, and her little sister was wiping chocolate from her mouth.",
      o: ["Her little sister probably ate the cake.", "Nobody baked a cake that day.", "Rina ate the cake at school.", "The cake was too small to see."], a: 0, why: "The empty plate and the chocolate on the sister’s mouth are clues. The text does not say it directly." },
    { cat: "Make inferences", tag: "inference", k: "mcq", q: "How was Leo probably feeling before the match?",
      quote: "Before the match, Leo checked his shoes three times and could not sit still. His coach put a hand on his shoulder and said, “Just play like you practise.”",
      o: ["Nervous", "Bored", "Angry", "Sleepy"], a: 0, fix: true, why: "Checking his shoes again and again, not sitting still, and the coach’s calm words are clues that he was nervous." },
    { cat: "Make inferences", tag: "inference", k: "mcq", q: "What can we infer about how Mr Anto felt?",
      quote: "Mr Anto closed his old shop on the last day. He stood at the door for a long time before he turned off the light.",
      o: ["He felt sad to say goodbye to the shop.", "He wanted to open the shop earlier.", "He was angry with the customers.", "He was waiting for a friend."], a: 0, why: "Standing at the door for a long time suggests that it was hard for him to leave." },

    /* ---- Writer's purpose */
    { cat: "Writer’s purpose", tag: "purpose", k: "mcq", q: "What is the writer’s main purpose?",
      quote: "Last Sunday, I planted a mango tree with my grandfather. Although my hands were dirty and tired, I felt proud. Now I know that small actions can help the Earth.",
      o: ["To share a personal experience and what the writer learned from it", "To explain how to plant a mango tree step by step", "To persuade readers to buy a tree", "To describe what a mango tree looks like"], a: 0, why: "The writer tells what happened and ends with a reflection. It is a personal recount, not instructions or an advertisement." },
    { cat: "Writer’s purpose", tag: "purpose", k: "mcq", q: "Why was this text written?",
      quote: "In 1955, the Asian-African Conference was held in Bandung. Leaders from 29 countries met to discuss peace and cooperation.",
      o: ["To inform readers about a real event in the past", "To entertain readers with an imaginary adventure", "To describe the writer’s feelings", "To persuade readers to visit Bandung"], a: 0, why: "It reports a real event with a year, a place and facts." },

    /* ---- Text structure */
    { cat: "Text structure", tag: "structure", k: "mcq", q: "Which sentence is the Reorientation?",
      quote: "(1) Last holiday, my family visited Lake Toba. (2) We took a boat to Samosir Island and ate grilled fish. (3) I will never forget how beautiful the lake was.",
      o: ["Sentence 1", "Sentence 2", "Sentence 3"], a: 2, fix: true, why: "The Reorientation looks back at the experience. Sentence 3 gives the writer’s final thought." },
    { cat: "Text structure", tag: "structure", k: "mcq", q: "Which sentence is the Orientation?",
      quote: "(1) Last Friday, our class went to the museum with Mr Dedi. (2) We watched a short film and tried an old traditional game. (3) After the trip, I understood our history better.",
      o: ["Sentence 1", "Sentence 2", "Sentence 3"], a: 0, fix: true, why: "The Orientation sets the scene: when, who and where. Sentence 1 does this." },
    { cat: "Text structure", tag: "structure", k: "mcq", q: "What is the job of the Events part of a recount?",
      o: ["To tell what happened, usually in time order", "To say who, when and where at the beginning only", "To give the writer’s final opinion", "To give instructions to the reader"], a: 0, why: "The Events are the main body. They tell what happened step by step." },

    /* ---- Arrange events */
    { cat: "Arrange events", tag: "sequence", k: "order", q: "Put the events in the order they happened.",
      events: [{ t: "Rani woke up late.", clue: "This happened first, in the morning." }, { t: "She missed the school bus.", clue: "Because she woke up late." }, { t: "She ran to school.", clue: "After she missed the bus." }, { t: "The teacher smiled and let her enter.", clue: "This happened when she arrived." }],
      why: "Each event is the result of the one before it." },
    { cat: "Arrange events", tag: "sequence", k: "order", q: "Put the events of this flood report in order.",
      events: [{ t: "Heavy rain fell all night.", clue: "This is the cause, so it came first." }, { t: "The river overflowed into the village.", clue: "It happened because of the rain." }, { t: "People moved to the community hall.", clue: "They left because the water rose." }, { t: "Volunteers brought food and blankets.", clue: "They helped after people were safe." }],
      why: "The events follow cause and effect." },

    /* ---- Read the picture (visual + text) */
    { cat: "Read the picture", tag: "visual", k: "mcq", q: "Look at the message. Which detail shows that it may be a scam?",
      vis: { type: "phone", from: "Unknown number", time: "Today 4.15 p.m.", text: "Congratulations! You won a new phone. Send your bank PIN today to get your prize!", link: "" },
      o: ["It asks for a bank PIN.", "It uses an exclamation mark.", "It was sent in the afternoon.", "It is a short message."], a: 0, why: "A real prize never needs your PIN. Asking for private information is a warning sign." },
    { cat: "Read the picture", tag: "visual", k: "mcq", q: "Read the text and look at the timeline. What happened after Dina won the school prize?",
      quote: "Dina loved writing. She joined the English club at the beginning of the year, and her stories became better and better.",
      vis: { type: "timeline", title: "Dina’s year", items: [{ e: "✏️", y: "January", l: "Joins the English club" }, { e: "📖", y: "March", l: "Writes her first story" }, { e: "🏅", y: "June", l: "Wins the school prize" }, { e: "📰", y: "December", l: "Stories appear in the school magazine" }] },
      o: ["Her stories appeared in the school magazine.", "She joined the English club.", "She wrote her first story.", "She stopped writing."], a: 0, why: "On the timeline, the school magazine comes after June, when she won the prize." },
    { cat: "Read the picture", tag: "visual", k: "mcq", q: "Look at the timeline of the class trip. What happened after the heavy rain?",
      vis: { type: "timeline", title: "Our class trip", items: [{ e: "☀️", y: "8 a.m.", l: "Sunny at the bus stop" }, { e: "☁️", y: "11 a.m.", l: "Clouds over the park" }, { e: "🌧️", y: "1 p.m.", l: "Heavy rain" }, { e: "🌈", y: "4 p.m.", l: "A rainbow in the sky" }] },
      o: ["A rainbow appeared in the sky.", "The sun was shining at the bus stop.", "Clouds covered the park.", "The class went home early."], a: 0, why: "The picture shows the rainbow at 4 p.m., after the rain at 1 p.m." }
  ]
};
