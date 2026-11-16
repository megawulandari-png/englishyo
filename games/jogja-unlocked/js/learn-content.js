/* JOGJA UNLOCKED: Learn Before You Play module — CONTENT ONLY (teachers: edit text here).
   Answer keys live in this file (the `correct` fields) and are never written into the page before a student checks. */
(function () {
  const A = 'assets/derived/';

  const META = {
    title: 'DESCRIPTIVE TEXT',
    subtitle: 'Exploring Tourism Places in Yogyakarta',
    academy: 'Travel Agent Training Academy',
    element: 'Membaca–Memirsa (Reading–Viewing)',
    level: 'SMP, Fase D · English about CEFR A2–B1'
  };

  /* Curriculum wording: keep exactly as written (do not replace "murid"). */
  const CURRICULUM = {
    cpTitle: 'Capaian Pembelajaran (CP), Membaca - Memirsa (Reading - Viewing)',
    cp: 'Memahami alur informasi, informasi tersurat dan tersirat dari berbagai jenis teks tertulis atau teks multimodal tentang topik sehari-hari atau yang sesuai dengan minat dan meresponnya sesuai konteks',
    tpTitle: 'Tujuan Pembelajaran (TP)',
    tp: 'Pada akhir rangkaian pembelajaran ini, murid mampu: Memahami alur informasi, informasi tersurat dan tersirat dari berbagai jenis teks tertulis atau teks multimodal tentang topik sehari-hari atau yang sesuai dengan minat dan meresponnya sesuai konteks',
    iktpTitle: 'Indikator Ketercapaian Tujuan Pembelajaran (IKTP)',
    iktp: [
      'Murid mampu mengidentifikasi gagasan utama, informasi tersurat, serta struktur teks (Identification dan Description) dalam teks deskriptif tentang tempat wisata di Yogyakarta.',
      'Murid mampu menganalisis unsur kebahasaan (simple present tense, adjectives, dan descriptive expressions) serta menafsirkan informasi tersirat berdasarkan petunjuk dalam teks.',
      'Murid mampu memberikan tanggapan terhadap informasi dalam teks dengan menentukan kesesuaian suatu tempat wisata berdasarkan kebutuhan atau minat tertentu, disertai alasan yang relevan.'
    ]
  };

  /* Simplified goals shown by default (English + short Indonesian support) */
  const GOALS = [
    { en: 'Find the main idea and facts in a text about a tourist place.', id: 'Menemukan gagasan utama dan informasi tersurat dalam teks tentang tempat wisata.' },
    { en: 'See how a descriptive text is organised: Identification and Description.', id: 'Memahami struktur teks deskriptif: Identification dan Description.' },
    { en: 'Notice simple present tense, adjectives and descriptive expressions.', id: 'Mengenali simple present tense, adjectives, dan descriptive expressions.' },
    { en: 'Use clues in a text to understand ideas that are not stated directly.', id: 'Menggunakan petunjuk dalam teks untuk memahami informasi tersirat.' },
    { en: 'Recommend a place for a tourist and give a reason from the text.', id: 'Merekomendasikan tempat wisata dan memberi alasan berdasarkan teks.' }
  ];

  const STEPS = [
    { id: 'goals',     title: 'Learning Goals',          short: 'Goals' },
    { id: 'discover',  title: 'Discover Descriptive Text', short: 'Discover' },
    { id: 'structure', title: 'Explore Text Structure',  short: 'Structure' },
    { id: 'language',  title: 'Language Toolkit',        short: 'Language' },
    { id: 'skills',    title: 'Reading Detective Skills', short: 'Detective' },
    { id: 'read',      title: 'Let’s Read: Prambanan Temple', short: 'Prambanan' },
    { id: 'practice',  title: 'Travel Agent Practice',   short: 'Practice' },
    { id: 'ready',     title: 'Ready to Play',           short: 'Ready' }
  ];

  const DISCOVER = {
    defEn: 'A descriptive text describes a particular person, place, animal, or thing.',
    defId: 'Teks deskriptif adalah teks yang menggambarkan seseorang, tempat, hewan, atau benda tertentu agar pembaca dapat memahami karakteristiknya.',
    focus: 'Tourism places in Yogyakarta.',
    functionEn: 'To describe a particular place by explaining its location, appearance, features, and attractions.',
    functionId: 'Fungsi sosial: menggambarkan tempat tertentu dengan menjelaskan lokasi, tampilan, ciri-ciri, dan daya tariknya.',
    example: 'Prambanan is a famous Hindu temple complex in the Yogyakarta region. It has tall stone towers and beautiful carvings.',
    exampleNote: 'The first sentence introduces the place (its name, type and location). The second sentence gives distinguishing features: tall stone towers and beautiful carvings.',
    exampleNoteId: 'Kalimat pertama memperkenalkan tempat. Kalimat kedua menyebutkan ciri khasnya.'
  };

  const STRUCTURE = {
    sample: {
      identification: 'Taman Sari is a historical water castle in Yogyakarta.',
      description: 'It has beautiful pools, old buildings, and unique architecture.'
    },
    parts: {
      identification: {
        label: 'Identification',
        en: 'Introduces the specific place being described. It may state the place’s name, location, or type.',
        id: 'Memperkenalkan tempat yang digambarkan: nama, lokasi, atau jenisnya.',
        why: 'This sentence names the place (Taman Sari), says what it is (a historical water castle) and where it is (in Yogyakarta).'
      },
      description: {
        label: 'Description',
        en: 'Explains its characteristics, appearance, atmosphere, activities, and attractions.',
        id: 'Menjelaskan ciri, tampilan, suasana, kegiatan, dan daya tarik tempat itu.',
        why: 'This sentence tells us what the place has and what it looks like: beautiful pools, old buildings and unique architecture.'
      }
    },
    checks: [
      { id: 'st1', prompt: 'Which part is this sentence?', context: 'Malioboro is a popular shopping street.',
        options: [{ id: 'identification', text: 'Identification' }, { id: 'description', text: 'Description' }], correct: 'identification',
        right: 'Yes! It names the place (Malioboro) and says what it is (a shopping street).',
        wrong: 'Look again: this sentence introduces the place by name and type. That is Identification.' },
      { id: 'st2', prompt: 'Which part is this sentence?', context: 'The street is also known for its lively atmosphere.',
        options: [{ id: 'identification', text: 'Identification' }, { id: 'description', text: 'Description' }], correct: 'description',
        right: 'Yes! It describes the atmosphere of the place.',
        wrong: 'This sentence does not introduce the place. It describes the atmosphere, so it is Description.' },
      { id: 'st3', prompt: 'Which part is this sentence?', context: 'Taman Sari has beautiful pools and old buildings.',
        options: [{ id: 'identification', text: 'Identification' }, { id: 'description', text: 'Description' }], correct: 'description',
        right: 'Yes! It describes features: pools and old buildings.',
        wrong: 'It lists features of the place (pools, old buildings). Features belong to Description.' }
    ]
  };

  const LANGUAGE = {
    present: {
      intro: 'We use the simple present tense for general facts and typical characteristics of a place.',
      introId: 'Simple present digunakan untuk fakta umum dan ciri khas suatu tempat.',
      rows: [
        ['Subject + am/is/are + complement', 'Malioboro <b>is</b> a popular shopping street.'],
        ['Subject + Verb 1 (s/es)', 'The temple <b>attracts</b> many visitors.'],
        ['Subject + has/have + object', 'Taman Sari <b>has</b> beautiful pools.']
      ],
      note: 'Good to know: descriptive texts may also use the past tense when they describe historical events (for example, “The temple was built in the 9th century”). Present tense is common, but it is not the only tense.'
    },
    adjectives: {
      intro: 'Adjectives describe nouns. They tell us what a place looks or feels like.',
      introId: 'Adjective menjelaskan kata benda (noun).',
      rows: [['ancient', 'kuno'], ['magnificent', 'megah'], ['crowded', 'ramai/padat'], ['peaceful', 'tenang'], ['beautiful', 'indah'],
             ['historical', 'bersejarah'], ['spacious', 'luas'], ['traditional', 'tradisional'], ['popular', 'populer'], ['unique', 'unik']]
    },
    expressions: {
      intro: 'Descriptive expressions are useful phrases for introducing and describing a place.',
      introId: 'Descriptive expressions adalah frasa yang membantu kita menggambarkan tempat.',
      rows: [
        ['is located in', 'Prambanan is located in the Yogyakarta region.'],
        ['is famous for', 'Malioboro is famous for its shopping atmosphere.'],
        ['is known as', 'Taman Sari is known as the Water Castle.'],
        ['is surrounded by', 'The building is surrounded by old walls.'],
        ['offers visitors', 'The area offers visitors beautiful scenery.'],
        ['is suitable for', 'The museum is suitable for history lovers.']
      ]
    },
    checks: [
      { id: 'lg1', display: 'chips', prompt: 'Tap the adjective.', chunks: ['Taman Sari', 'has', 'beautiful', 'pools'], correct: '2',
        right: 'Right! “Beautiful” is an adjective. It describes the pools.',
        wrong: 'An adjective describes a noun. Which word tells us what the pools are like?' },
      { id: 'lg2', display: 'chips', prompt: 'Tap the simple present verb.', chunks: ['The temple', 'attracts', 'many visitors'], correct: '1',
        right: 'Right! “Attracts” is a simple present verb. Notice the -s after the singular subject “the temple”.',
        wrong: 'Look for the action word. “The temple” is the subject and “many visitors” is the object.' },
      { id: 'lg3', display: 'chips', prompt: 'Tap the descriptive expression.', chunks: ['Malioboro', 'is famous for', 'its shopping atmosphere'], correct: '1',
        right: 'Right! “is famous for” tells us what the place is known for.',
        wrong: 'A descriptive expression is a ready-made phrase. Which part tells what Malioboro is known for?' },
      { id: 'lg4', display: 'chips', prompt: 'Tap the descriptive expression.', chunks: ['The museum', 'is suitable for', 'history lovers'], correct: '1',
        right: 'Right! “is suitable for” shows which visitors will enjoy the place.',
        wrong: 'Find the phrase that links the place to the kind of visitor.' }
    ]
  };

  const SKILLS = [
    { id: 'main', en: 'Main idea', idn: 'gagasan utama',
      def: 'The central or most important information in a paragraph or text.',
      text: 'Malioboro is one of the most popular tourist areas in Yogyakarta. Visitors can shop for souvenirs, explore traditional products, and enjoy local food. The street is also known for its lively atmosphere.',
      question: 'What is the main idea?',
      answer: 'Malioboro is a popular tourist area with shopping, food, and local attractions.' },
    { id: 'explicit', en: 'Explicit information', idn: 'informasi tersurat',
      def: 'Information that is stated directly in the text.',
      text: 'Visitors can buy batik clothes and souvenirs in Malioboro.',
      question: 'What can visitors buy?',
      answer: 'Batik clothes and souvenirs.' },
    { id: 'implicit', en: 'Implicit information (inference)', idn: 'informasi tersirat',
      def: 'A conclusion supported by clues in the text, even if it is not directly stated.',
      text: 'The area is filled with souvenir shops, traditional markets, and street performers. Many visitors enjoy walking along the busy street.',
      question: 'Would someone who prefers quiet places likely enjoy this area?',
      answer: 'Probably not, because the text describes a busy and lively atmosphere.' },
    { id: 'evidence', en: 'Responding using evidence', idn: 'menanggapi dengan bukti',
      def: 'Choose a suitable destination and support your choice with details from the text.',
      text: 'Tourist request: “Emma enjoys visiting historical buildings and learning about ancient architecture.”',
      question: 'Which destination would you recommend: Prambanan or Malioboro?',
      answer: 'I would recommend Prambanan because it is famous for its ancient temples and historical architecture.' }
  ];

  const READ = {
    title: 'Prambanan Temple',
    img: A + 'destinations/dest_prambanan.webp',
    alt: 'Illustration of Prambanan, a Hindu temple complex with tall stone towers',
    sections: [
      { key: 'identification', label: 'Identification',
        paragraphs: ['Prambanan is a magnificent Hindu temple complex located in the Yogyakarta region, Indonesia. It is one of the most famous historical attractions in the country.'] },
      { key: 'description', label: 'Description',
        paragraphs: [
          'The temple complex is well known for its tall stone towers and beautiful carvings. The tallest main temple is dedicated to Shiva. Visitors can explore the temple grounds and admire the detailed decorations on its walls.',
          'Some carvings tell stories from the Ramayana, an ancient Hindu epic. These artistic details make Prambanan an interesting place to learn about history, religion, and traditional architecture.',
          'With its impressive buildings and cultural significance, Prambanan is especially suitable for visitors who enjoy historical sites, ancient stories, and photography.'
        ] }
    ],
    questions: [
      { id: 'rq1', skill: 'Main idea', prompt: 'What is the main idea of the text?',
        options: [
          { id: 'a', text: 'Prambanan is a modern shopping center.' },
          { id: 'b', text: 'Prambanan is a historical Hindu temple with unique cultural features.' },
          { id: 'c', text: 'Prambanan is a beach with beautiful scenery.' },
          { id: 'd', text: 'Prambanan is a place for modern entertainment.' }],
        correct: 'b',
        right: 'The passage mainly describes the temple’s historical and cultural characteristics.',
        wrong: 'The main idea covers the whole text. Reread the Identification and Description: what kind of place is Prambanan?',
        optFb: { a: 'Nothing in the text mentions shopping.', c: 'The text is about a temple complex, not a beach.', d: 'The text talks about history and ancient stories, not modern entertainment.' } },
      { id: 'rq2', skill: 'Explicit detail', prompt: 'What can visitors find on the temple walls?',
        options: [
          { id: 'a', text: 'Modern paintings' },
          { id: 'b', text: 'Shopping advertisements' },
          { id: 'c', text: 'Detailed carvings' },
          { id: 'd', text: 'Travel schedules' }],
        correct: 'c',
        right: 'The text explicitly mentions detailed carvings on the walls.',
        wrong: 'This answer is stated directly in the text. Find the sentence about the walls in the Description section.',
        optFb: { a: 'The text says the decorations are ancient carvings, not modern paintings.', b: 'Advertisements are not mentioned anywhere in the text.', d: 'Travel schedules are not mentioned in the text.' } },
      { id: 'rq3', skill: 'Inference', prompt: 'Which visitor would most likely enjoy Prambanan?',
        options: [
          { id: 'a', text: 'Someone interested in ancient architecture' },
          { id: 'b', text: 'Someone looking for beach activities' },
          { id: 'c', text: 'Someone planning to shop for clothes' },
          { id: 'd', text: 'Someone looking for water sports' }],
        correct: 'a',
        right: 'The passage highlights historical sites, ancient stories, and traditional architecture.',
        wrong: 'Use clues: look at the last paragraph. Who is Prambanan “especially suitable” for?',
        optFb: { b: 'Nothing in the text suggests beach activities.', c: 'The text does not mention shopping.', d: 'Water sports are not mentioned in the text.' } }
    ]
  };

  const PRACTICE = {
    tourist: { name: 'Sophia', img: A + 'characters/tourist_photographer.webp', alt: 'Sophia, a smiling tourist taking a photo with a camera' },
    request: 'I love taking pictures of old buildings and learning about local history. I don’t really enjoy shopping. Can you recommend a place for me?',
    clues: ['loves taking pictures of old buildings', 'wants to learn about local history', 'does not really enjoy shopping'],
    instruction: 'Choose the best destination and explain your recommendation using the information from the reading.',
    places: [
      { id: 'malioboro', name: 'Malioboro', note: 'Shopping and local products', img: A + 'destinations/dest_malioboro.webp', alt: 'Illustration of Malioboro shopping street' },
      { id: 'prambanan', name: 'Prambanan', note: 'Temples and historical architecture', img: A + 'destinations/dest_prambanan.webp', alt: 'Illustration of Prambanan temple complex' },
      { id: 'parangtritis', name: 'Parangtritis', note: 'Beach scenery and outdoor activities', img: A + 'destinations/dest_parangtritis.webp', alt: 'Illustration of Parangtritis beach' }
    ],
    correctPlace: 'prambanan',
    placeFb: {
      prambanan: 'Great match! Sophia loves old buildings and local history, and Prambanan is known for temples and historical architecture.',
      malioboro: 'Malioboro is mostly about shopping and local products. Sophia said she does not really enjoy shopping.',
      parangtritis: 'Parangtritis offers beach scenery and outdoor activities. Sophia asked about old buildings and local history.'
    },
    reasons: [
      { id: 'r1', text: 'it has ancient temples and historical architecture, which match her interest in old buildings, local history and photography.' },
      { id: 'r2', text: 'it is the most famous place in Yogyakarta, so every tourist should go there.' },
      { id: 'r3', text: 'it has many shops and local products, so she can buy souvenirs.' },
      { id: 'r4', text: 'it has beautiful beach scenery and outdoor activities.' }
    ],
    correctReason: 'r1',
    reasonFb: {
      r1: 'Strong reason! It uses clues from Sophia’s request (old buildings, local history, photography) and details from the text about Prambanan.',
      r2: 'Being popular is not enough. A good recommendation matches what this tourist wants.',
      r3: 'That reason is about shopping, but Sophia does not really enjoy shopping.',
      r4: 'That reason describes a beach. Sophia asked about old buildings and local history.'
    },
    success: 'Excellent travel-agent thinking: you read the request, matched the place and gave a reason with evidence!'
  };

  const SUMMARY = {
    outcomes: [
      'Identify the main idea, explicit information, and structure of a descriptive text.',
      'Recognize simple present tense, adjectives, and descriptive expressions.',
      'Infer meaning using clues from a text.',
      'Recommend suitable tourism destinations and support your choice with evidence.'
    ],
    flow: ['Find clues', 'Understand the tourist’s needs', 'Recommend a place', 'Explain why'],
    message: 'A good travel agent doesn’t simply choose the most popular destination. A good travel agent reads carefully, understands the tourist’s needs, and gives a recommendation supported by information.',
    cta: 'I’m Ready — Start Mission 1'
  };

  /* ids that count toward the optional lesson score (first try correct = 1 point) */
  const SCORED = [].concat(STRUCTURE.checks.map(x => x.id), LANGUAGE.checks.map(x => x.id), READ.questions.map(x => x.id), ['p_place', 'p_reason']);

  window.JU_LEARN = { META, CURRICULUM, GOALS, STEPS, DISCOVER, STRUCTURE, LANGUAGE, SKILLS, READ, PRACTICE, SUMMARY, SCORED };
})();
