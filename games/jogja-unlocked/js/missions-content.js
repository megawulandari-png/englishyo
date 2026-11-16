/* JOGJA UNLOCKED — Missions 2-5 and the four extra place texts (data only).
   Mission 1 and the shared constants stay in content.js. Teachers: edit passages, questions and answers here.
   No prices, opening hours or travel times are stated on purpose. */
(function () {
  const C = window.JU_CONTENT, A = 'assets/derived/';
  const loc = {}; C.LOCKED_PLACES.forEach(p => { loc[p.id] = p; });

  /* ---------- place texts (110-160 words each) ---------- */
  Object.assign(C.PLACES, {
    keraton: {
      id: 'keraton', name: 'Keraton Yogyakarta', pin: { x: loc.keraton.x, y: loc.keraton.y },
      img: A + 'destinations/dest_keraton.webp',
      alt: 'Illustration of Keraton Yogyakarta, the royal palace, with open halls and courtyards',
      tags: ['Royal palace', 'Javanese culture', 'History'],
      teaser: 'The Sultan’s palace, full of Javanese tradition.',
      passage: [
        'Keraton Yogyakarta is the royal palace of the Sultan of Yogyakarta. It was built in the 18th century, and it is still the home of the Sultan’s family today.',
        'The palace has open halls called pavilions, wide courtyards and old wooden buildings in traditional Javanese style. In the museum rooms, visitors can see royal objects and old photographs, and learn about the history of the palace and the Sultans of Yogyakarta.',
        'Palace workers, called abdi dalem, wear traditional Javanese clothes. On some days, visitors can listen to gamelan music or watch traditional dance.',
        'Keraton is a living centre of Javanese tradition. It is a good place for people who want to learn about culture and royal history.'
      ],
      glossary: { royal: 'kerajaan / milik raja', pavilions: 'bangunan terbuka (pendopo)', courtyards: 'halaman', traditional: 'tradisional', gamelan: 'gamelan (musik tradisional Jawa)', 'abdi dalem': 'pegawai keraton' }
    },
    tamansari: {
      id: 'tamansari', name: 'Taman Sari', pin: { x: loc.tamansari.x, y: loc.tamansari.y },
      img: A + 'destinations/dest_taman_sari.webp',
      alt: 'Illustration of Taman Sari, a water castle with pools, walls and gates',
      tags: ['Water castle', 'Pools and gardens', 'Architecture'],
      teaser: 'An old royal garden with pools, walls and gates.',
      passage: [
        'Taman Sari is a historic water castle in Yogyakarta. It was built in the 18th century as a royal garden for the Sultan’s family, and it is close to the palace.',
        'The site has old bathing pools, high walls and gates with elegant architecture. Long ago, the royal family relaxed here, so the pools and gardens were made to be calm and beautiful.',
        'Visitors can walk along narrow passages and through quiet courtyards. One famous place is Sumur Gumuling, a circular underground building with stairs.',
        'Many visitors take photos of the old walls, the gates and the stairs. Taman Sari is a good place for people who like history, water and interesting buildings.'
      ],
      glossary: { 'water castle': 'istana air', 'bathing pools': 'kolam pemandian', passages: 'lorong / jalan sempit', courtyards: 'halaman', underground: 'bawah tanah', relaxed: 'bersantai' }
    },
    parangtritis: {
      id: 'parangtritis', name: 'Parangtritis', pin: { x: loc.parangtritis.x, y: loc.parangtritis.y },
      img: A + 'destinations/dest_parangtritis.webp',
      alt: 'Illustration of Parangtritis, a wide beach with palm trees and a pavilion',
      tags: ['Beach', 'Sunset', 'Sea views'],
      teaser: 'A wide beach on the south coast with big waves.',
      passage: [
        'Parangtritis is a famous beach on the south coast of Yogyakarta. It faces the Indian Ocean, and the sea there is wide and blue.',
        'The beach is wide and open, with dark sand and big waves. Visitors can walk along the shore, feel the sea breeze and watch the sunset in the evening.',
        'The waves and sea currents can be very strong. Visitors should not swim in the sea. They should follow warning signs and instructions from safety officers. Families can enjoy the beach by walking on the sand and watching the sea from a safe area.',
        'Parangtritis is a great place for people who love sea views and sunsets, as long as they follow the safety rules.'
      ],
      glossary: { shore: 'tepi pantai', breeze: 'angin sepoi-sepoi', waves: 'ombak', currents: 'arus laut', 'safety officers': 'petugas keselamatan' }
    },
    merapi: {
      id: 'merapi', name: 'Merapi / Kaliurang', pin: { x: loc.merapi.x, y: loc.merapi.y },
      img: A + 'destinations/dest_merapi_kaliurang.webp',
      alt: 'Illustration of Mount Merapi and the green hills of Kaliurang',
      tags: ['Mountain', 'Nature', 'Fresh air'],
      teaser: 'A famous volcano and a cool mountain town.',
      passage: [
        'Mount Merapi is a famous volcano north of Yogyakarta. It is one of the most active volcanoes in Indonesia, so people respect it and follow official safety news.',
        'On its slopes is Kaliurang, a small mountain town. The air there is cool and fresh, and the views of the green hills are beautiful. Visitors can enjoy forests, walks and viewpoints.',
        'Kaliurang is also known for a local snack called jadah tempe, which is made from sticky rice and tempeh. Visitors who like local food can try it during their trip.',
        'Some areas may be closed when the volcano is active. Merapi and Kaliurang are great for people who love nature, mountain views and fresh air.'
      ],
      glossary: { volcano: 'gunung berapi', slopes: 'lereng', viewpoints: 'tempat melihat pemandangan', active: 'aktif (bisa meletus)', 'sticky rice': 'beras ketan' }
    }
  });

  /* ---------- shared bits ---------- */
  const M1 = C.MISSION;
  const base = { manager: M1.manager };
  const reasonsFb = (list) => list;
  const wrongDefault = 'That is not the best reason. Check the texts and the traveler’s interests again.';

  /* ---------- missions ---------- */
  const m2 = Object.assign({}, base, {
    id: 'm2', num: 2, stamp: 'keraton', title: 'Mission 2: The Culture Seeker',
    tourist: {
      name: 'Arthur', sprite: A + 'characters/tourist_explorer.webp',
      alt: 'Arthur, a tourist in a straw hat and glasses, holding a red book',
      loves: ['Javanese culture', 'Royal history'], dislikes: ['Shopping', 'Busy streets'],
      goal: 'Choose ONE place to visit tomorrow.', options: ['keraton', 'malioboro']
    },
    mgrLine: 'Our next customer is Arthur. He loves culture and history. Read the texts carefully, {name}!',
    arriveLines: [
      'Hello! I am Arthur. I love reading and learning about other cultures.',
      'I am very interested in Javanese traditions and royal history.',
      'I do not enjoy shopping or very busy streets. Which place should I visit?'
    ],
    meLine: 'Nice to meet you, Arthur! Let me read about some places for you.',
    tasks: [
      { id: 't1', skill: 'Find the main idea', needs: ['keraton'], focus: 'keraton',
        prompt: 'What is the main idea of the Keraton text?',
        options: [
          { id: 'a', text: 'Keraton is a modern place for shopping and snacks.' },
          { id: 'b', text: 'Keraton is a beach where visitors can watch the sunset.' },
          { id: 'c', text: 'Keraton is a royal palace that keeps Javanese traditions alive.' },
          { id: 'd', text: 'Keraton is a temple complex with tall stone towers.' }
        ], correct: 'c',
        right: 'Yes! The whole text is about the Sultan’s palace and its living Javanese traditions.',
        wrong: 'Read the first and last paragraphs again. Keraton is the Sultan’s palace and a living centre of Javanese tradition.',
        clue: 'Keraton is the Sultan’s royal palace and a living centre of Javanese tradition.' },
      { id: 't2', skill: 'Compare two places', needs: ['keraton', 'malioboro'], focus: 'both',
        prompt: 'Arthur likes culture and does not enjoy shopping. Which sentence compares the two places correctly?',
        options: [
          { id: 'a', text: 'Keraton is a busy shopping street, and Malioboro is a royal palace.' },
          { id: 'b', text: 'Keraton is a royal palace with Javanese traditions, but Malioboro is a busy street for shops, food and music.' },
          { id: 'c', text: 'Both places are the home of the Sultan’s family.' },
          { id: 'd', text: 'Malioboro has museum rooms, and Keraton has street stalls.' }
        ], correct: 'b',
        right: 'Correct! Keraton is about royal history and tradition. Malioboro is about shops, food and city life.',
        wrong: 'Compare the texts again. Keraton is a palace with Javanese traditions. Malioboro is a busy street with shops, food and music.',
        clue: 'Keraton is a palace for culture and royal history. Malioboro is a busy street for shopping and food.' },
      { id: 't3', skill: 'Choose evidence for two interests', needs: ['keraton', 'malioboro'], focus: 'both',
        prompt: 'Arthur wants to learn about BOTH Javanese culture and royal history. Which quotation gives the most complete evidence that Keraton suits him?',
        options: [
          { id: 'a', text: '"Bargaining is common, so shoppers often smile and talk with the sellers."' },
          { id: 'b', text: '"The palace has open halls called pavilions, wide courtyards and old wooden buildings in traditional Javanese style."' },
          { id: 'c', text: '"In the evening, street musicians play and the street becomes even more lively."' },
          { id: 'd', text: '"Keraton is a living centre of Javanese tradition. It is a good place for people who want to learn about culture and royal history."' }
        ], correct: 'd',
        right: 'Exactly! Option D directly mentions both Javanese culture and royal history. Option B describes traditional buildings, but it does not explain both interests as completely.',
        wrong: 'Find the quotation that directly supports BOTH of Arthur’s interests: Javanese culture and royal history.',
        clue: 'The strongest evidence directly connects Keraton with both culture and royal history.' }
    ],
    final: {
      correctPlace: 'keraton', correctReason: 'r3',
      reasons: [
        { id: 'r1', text: 'It has small shops and stalls where Arthur can buy batik and souvenirs.', fb: 'Shops and souvenirs are in the Malioboro text, and Arthur does not enjoy shopping.' },
        { id: 'r2', text: 'Becak and andong wait along the road, so Arthur can enjoy the city atmosphere.', fb: 'That is Malioboro. Arthur wants culture and royal history, not a busy street.' },
        { id: 'r3', text: 'It is the Sultan’s royal palace, with traditional buildings, museum rooms and Javanese culture.', fb: '' },
        { id: 'r4', text: 'It is the most popular place in Yogyakarta, so every visitor should go there.', fb: 'The text does not say that. A strong reason comes from the text and matches Arthur’s interests.' }
      ],
      placeWrong: { malioboro: 'Hmm... Malioboro sounds lively, but I do not enjoy shopping or very busy streets. I want to learn about Javanese culture and royal history. Check your notes again!' },
      reasonWrongButPlaceRight: 'Keraton, yes! But that is not the best reason.',
      success: 'Keraton is perfect! I can learn about royal history and Javanese traditions in one place. Thank you, {name}. You are a great travel agent!'
    }
  });

  const m3 = Object.assign({}, base, {
    id: 'm3', num: 3, stamp: 'tamansari', title: 'Mission 3: The Photographer',
    tourist: {
      name: 'Mia', sprite: A + 'characters/tourist_photographer.webp',
      alt: 'Mia, a cheerful photographer with a camera and sunglasses in her hair',
      loves: ['Photography', 'Pools and gardens'], dislikes: ['Noisy markets'],
      goal: 'Choose ONE place to visit tomorrow.', options: ['tamansari', 'prambanan']
    },
    mgrLine: 'Our next customer is Mia, a photographer. Read the texts carefully, {name}, and watch the new words!',
    arriveLines: [
      'Hi! I am Mia, and I take photos wherever I travel.',
      'I love old buildings with water and gardens. Pools and unusual walls make beautiful pictures!',
      'I do not want a noisy market this time. Where should I take my camera tomorrow?'
    ],
    meLine: 'Nice to meet you, Mia! Let me read about some places for your camera.',
    tasks: [
      { id: 't1', skill: 'Find a detail', needs: ['tamansari'], focus: 'tamansari',
        prompt: 'Look at the Taman Sari text. Why was Taman Sari built?',
        options: [
          { id: 'a', text: 'As a royal garden for the Sultan’s family' },
          { id: 'b', text: 'As a shopping street for visitors' },
          { id: 'c', text: 'As a hotel near the beach' },
          { id: 'd', text: 'As a temple for the god Shiva' }
        ], correct: 'a',
        right: 'Yes! The text says it was built as a royal garden for the Sultan’s family.',
        wrong: 'Reread paragraph 1: Taman Sari was built in the 18th century as a royal garden for the Sultan’s family.',
        clue: 'Taman Sari is a water castle that was built as a royal garden, with old pools and gates.' },
      { id: 't2', skill: 'Vocabulary in context', needs: ['tamansari'], focus: 'tamansari',
        prompt: 'In paragraph 2, the gates have "elegant architecture". What does "elegant" mean here?',
        options: [
          { id: 'a', text: 'Old and broken' },
          { id: 'b', text: 'Noisy and crowded' },
          { id: 'c', text: 'New and modern' },
          { id: 'd', text: 'Beautiful in a graceful way' }
        ], correct: 'd',
        right: 'Right! "Elegant" means beautiful and graceful. It matches "calm and beautiful" in the same paragraph.',
        wrong: 'Use the clues around the word. The same paragraph says the pools and gardens are "calm and beautiful", so "elegant" is a positive word.',
        clue: 'The gates and walls have elegant (beautiful, graceful) architecture, good for photos.' },
      { id: 't3', skill: 'Make an inference', needs: ['tamansari', 'prambanan'], focus: 'both',
        prompt: 'Mia can photograph old buildings at both places. Why is Taman Sari likely to suit her better?',
        options: [
          { id: 'a', text: 'It has newer buildings and a large modern shopping area.' },
          { id: 'b', text: 'It offers the pools, garden features and unusual architecture she wants to photograph.' },
          { id: 'c', text: 'It has taller Hindu temple towers than Prambanan.' },
          { id: 'd', text: 'It has no historical buildings, so Mia can take nature photos only.' }
        ], correct: 'b',
        right: 'Good inference! Both sites have interesting architecture, but Taman Sari also matches Mia’s special interest in water, pools and gardens.',
        wrong: 'Both places are historical. Look for the extra features that Mia specifically requested: water, pools and gardens.',
        clue: 'Mia wants a historic photo location that also includes water and gardens.' }
    ],
    final: {
      correctPlace: 'tamansari', correctReason: 'r1',
      reasons: [
        { id: 'r1', text: 'It has old bathing pools, a royal garden, high walls and gates, and a circular underground building with stairs.', fb: '' },
        { id: 'r2', text: 'It is a Hindu temple complex with carvings from the Ramayana.', fb: 'That is Prambanan. It is beautiful, but Mia asked for pools and gardens.' },
        { id: 'r3', text: 'It is a UNESCO World Heritage Site, so many visitors walk slowly there.', fb: 'That sentence is about Prambanan, and it does not mention water or gardens.' },
        { id: 'r4', text: 'It is close to the royal palace, so Mia can go shopping there.', fb: 'Being close to the palace does not match Mia’s request. She wants pools, gardens and photo spots.' }
      ],
      placeWrong: { prambanan: 'Hmm... Prambanan looks amazing, but I would love to photograph water and gardens. Please check the texts for pools!' },
      reasonWrongButPlaceRight: 'Taman Sari, yes! But that is not the best reason.',
      success: 'Taman Sari is perfect! Pools, gardens and old walls: my camera is ready. Thank you, {name}!'
    }
  });

  const m4 = Object.assign({}, base, {
    id: 'm4', num: 4, stamp: 'parangtritis', title: 'Mission 4: The Family Day Out',
    tourist: {
      name: 'The Miller family', plural: true, sprite: A + 'characters/tourist_family.webp',
      alt: 'The Miller family: a father with a backpack, a mother in a straw hat and a little boy',
      loves: ['Sea views', 'Sunsets', 'Open space'], dislikes: ['Small, closed places'],
      goal: 'Choose ONE place for a safe, relaxing day.', options: ['parangtritis', 'tamansari']
    },
    mgrLine: 'A family has just arrived, {name}! This time, think about safety, too.',
    arriveLines: [
      'Hello! We are the Miller family: two parents and one little boy.',
      'We love the sea and beautiful sunsets, and our son likes big open spaces.',
      'We want a relaxing day outdoors, but we also want to be safe. Which place do you recommend?'
    ],
    meLine: 'Welcome to Yogyakarta! Let me read about some places for your family.',
    tasks: [
      { id: 't1', skill: 'Identify text structure', needs: ['parangtritis'], focus: 'parangtritis',
        prompt: 'Which sentence from the Parangtritis text belongs to the Identification section because it introduces the place?',
        options: [
          { id: 'a', text: 'Visitors can walk along the shore, feel the sea breeze and watch the sunset in the evening.' },
          { id: 'b', text: 'The waves and sea currents can be very strong.' },
          { id: 'c', text: 'Parangtritis is a famous beach on the south coast of Yogyakarta.' },
          { id: 'd', text: 'Visitors should not swim in the sea.' }
        ], correct: 'c',
        right: 'Correct! The Identification introduces the specific place. The other sentences describe features, activities or safety information.',
        wrong: 'Identification names and introduces the place. Description explains what it is like or what people can do there.',
        clue: 'The opening sentence identifies Parangtritis and tells where it is.' },
      { id: 't2', skill: 'Safe visitor choices', needs: ['parangtritis'], focus: 'parangtritis',
        prompt: 'The Miller family wants to enjoy Parangtritis safely. Which plan follows the advice in the text?',
        options: [
          { id: 'a', text: 'Swim in the sea as long as the family stays close to the shore.' },
          { id: 'b', text: 'Walk on the sand, stay in safe areas and follow signs and safety officers.' },
          { id: 'c', text: 'Ignore warning signs when the waves look small.' },
          { id: 'd', text: 'Let the child play in the sea without an adult.' }
        ], correct: 'b',
        right: 'Correct! The passage says visitors should not swim and should follow warning signs and safety officers.',
        wrong: 'Strong waves and currents can be dangerous. Choose the plan that avoids swimming and respects official safety guidance.',
        clue: 'Do not swim; enjoy the beach from safe areas and obey warnings.' },
      { id: 't3', skill: 'Choose the best evidence', needs: ['parangtritis', 'tamansari'], focus: 'both',
        prompt: 'Which sentence is the BEST evidence that Parangtritis fits the family’s love of the sea and sunsets?',
        options: [
          { id: 'a', text: '"Visitors can walk along the shore, feel the sea breeze and watch the sunset in the evening."' },
          { id: 'b', text: '"The site has old bathing pools, high walls and gates with elegant architecture."' },
          { id: 'c', text: '"Visitors can walk along narrow passages and through quiet courtyards."' },
          { id: 'd', text: '"The waves and sea currents can be very strong."' }
        ], correct: 'a',
        right: 'Great choice! This sentence mentions the shore, the sea breeze and the sunset, exactly what the family wants.',
        wrong: 'Look for a sentence about the sea AND the sunset. Only the sentence about walking along the shore mentions both.',
        clue: 'At Parangtritis, visitors can walk along the shore, feel the sea breeze and watch the sunset.' }
    ],
    final: {
      correctPlace: 'parangtritis', correctReason: 'r3',
      reasons: [
        { id: 'r1', text: 'It has old pools, high walls and narrow passages.', fb: 'Those are details from Taman Sari. The family wants sea views and a sunset.' },
        { id: 'r2', text: 'It is a royal garden, so the family can learn about the Sultan.', fb: 'That is Taman Sari. The family wants the sea, open space and a sunset.' },
        { id: 'r3', text: 'It has an open beach, sea views and sunsets. The family can enjoy the shore without swimming and follow safety instructions.', fb: '' },
        { id: 'r4', text: 'The sea is perfect for swimming, so the family can spend the whole day in the water.', fb: 'No. Swimming is not recommended. Strong currents can be dangerous; the text tells visitors not to swim.' }
      ],
      placeWrong: { tamansari: 'Hmm... Taman Sari sounds interesting, but we want the sea and a sunset. Please check the texts again!' },
      reasonWrongButPlaceRight: 'Parangtritis, yes! But that is not the best reason.',
      success: 'Parangtritis sounds perfect! We can enjoy the sea breeze and the sunset from the sand, and we will follow the safety signs and not swim. Thank you, {name}!'
    }
  });

  const m5 = Object.assign({}, base, {
    id: 'm5', num: 5, stamp: 'merapi', title: 'Mission 5: The Mountain Backpacker',
    tourist: {
      name: 'Leo', sprite: A + 'characters/tourist_backpacker.webp',
      alt: 'Leo, a young backpacker with a green backpack and headphones around his neck',
      loves: ['Mountains', 'Fresh air', 'Nature walks'], dislikes: ['Beaches'],
      goal: 'Choose ONE place to visit tomorrow.', options: ['merapi', 'parangtritis']
    },
    mgrLine: 'Our next customer is Leo, a backpacker. This one needs careful reading, {name}!',
    arriveLines: [
      'Hey! I am Leo. I travel with my backpack and I love nature.',
      'Mountains, forests and fresh air make me happy. I am not a beach person.',
      'I want somewhere with great views for tomorrow. Can you help me choose?'
    ],
    meLine: 'Nice to meet you, Leo! I will read about some places for you.',
    tasks: [
      { id: 't1', skill: 'Descriptive vocabulary', needs: ['merapi'], focus: 'merapi',
        prompt: 'Which adjectives does the text use to describe the air in Kaliurang?',
        options: [
          { id: 'a', text: 'Hot and dry' },
          { id: 'b', text: 'Cool and fresh' },
          { id: 'c', text: 'Salty and warm' },
          { id: 'd', text: 'Smoky and heavy' }
        ], correct: 'b',
        right: 'Yes! The text says the air in Kaliurang is cool and fresh.',
        wrong: 'Reread paragraph 2: "The air there is cool and fresh."',
        clue: 'Kaliurang has cool, fresh air, green hills, forests and viewpoints.' },
      { id: 't2', skill: 'Compare two places', needs: ['merapi', 'parangtritis'], focus: 'both',
        prompt: 'Leo loves mountains and fresh air. Which sentence compares the two places correctly?',
        options: [
          { id: 'a', text: 'Parangtritis is a mountain town, and Kaliurang is a long beach.' },
          { id: 'b', text: 'Both places are on the south coast.' },
          { id: 'c', text: 'Kaliurang is known for dark sand, and Parangtritis is known for jadah tempe.' },
          { id: 'd', text: 'Merapi and Kaliurang offer mountain views and cool air, but Parangtritis offers sea views and sunsets.' }
        ], correct: 'd',
        right: 'Correct! Merapi and Kaliurang are about mountains. Parangtritis is about the sea and sunsets.',
        wrong: 'Compare the texts again. Merapi and Kaliurang are in the mountains. Parangtritis is a beach on the south coast.',
        clue: 'Merapi and Kaliurang are for mountains and fresh air. Parangtritis is for the sea and sunsets.' },
      { id: 't3', skill: 'Apply an inference', needs: ['merapi'], focus: 'merapi',
        prompt: 'Leo finds out that the viewpoint he planned to visit is in an area that is currently restricted. What should his travel agent recommend?',
        options: [
          { id: 'a', text: 'Go anyway because the mountain scenery looks beautiful.' },
          { id: 'b', text: 'Enter the restricted area early before other tourists arrive.' },
          { id: 'c', text: 'Check official updates and choose an area that is permitted for visitors.' },
          { id: 'd', text: 'Ignore the restriction because Kaliurang is a popular destination.' }
        ], correct: 'c',
        right: 'Exactly! The passage explains that Merapi is active and some areas may close. A responsible agent checks current official guidance and recommends only permitted places.',
        wrong: 'Apply the passage to Leo’s new situation: if an area is restricted, a travel agent should respect the restriction and check official advice.',
        clue: 'A good recommendation considers both Leo’s interests and current safety restrictions.' }
    ],
    final: {
      correctPlace: 'merapi', correctReason: 'r2',
      reasons: [
        { id: 'r1', text: 'It has a wide beach with big waves and a beautiful sunset.', fb: 'That is Parangtritis. Leo is not a beach person.' },
        { id: 'r2', text: 'It has mountain views, cool and fresh air, forests and walks.', fb: '' },
        { id: 'r3', text: 'It has dark sand, so Leo can walk along the shore.', fb: 'Dark sand is part of the Parangtritis text, and Leo prefers mountains.' },
        { id: 'r4', text: 'Visitors can watch the sunset in the evening, so Leo can take sunset photos.', fb: 'Sunsets are described in the Parangtritis text. Leo wants mountains and fresh air.' }
      ],
      placeWrong: { parangtritis: 'Hmm... a beach is not for me. I love mountains, forests and fresh air. Check the texts again!' },
      reasonWrongButPlaceRight: 'Merapi and Kaliurang, yes! But that is not the best reason.',
      success: 'Kaliurang’s mountain scenery sounds wonderful! I’ll check the latest official safety information and choose a permitted viewpoint. Thank you, {name}!'
    }
  });

  C.MISSIONS = [M1, m2, m3, m4, m5];
  M1.num = 1; M1.stamp = 'prambanan';
  /* Malioboro has no mission of its own (it is the "wrong answer" in Missions 1 and 2), so the passport holds five stamps. */
  C.PASSPORT_SLOTS = [
    { id: 'prambanan', name: 'Prambanan', stamp: A + 'ui/stamp_prambanan.webp' },
    { id: 'keraton', name: 'Keraton', stamp: A + 'ui/stamp_keraton.webp' },
    { id: 'tamansari', name: 'Taman Sari', stamp: A + 'ui/stamp_tamansari.webp' },
    { id: 'parangtritis', name: 'Parangtritis', stamp: A + 'ui/stamp_parangtritis.webp' },
    { id: 'merapi', name: 'Merapi', stamp: A + 'ui/stamp_merapi.webp' }
  ];
})();
