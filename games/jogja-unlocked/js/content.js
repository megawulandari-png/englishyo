/* JOGJA UNLOCKED — game content (data only, no UI logic).
   Passages verified against public sources (see README.md "Fact check").
   Scoring is defined in SCORING and used by app.js. */
(function () {
  const A = 'assets/derived/';

  const AGENTS = [
    { id: 'f',  label: 'Sari',   desc: 'Cheerful and curious',    img: A + 'characters/agent-sari.webp',   a11y: 'Sari, a smiling female travel agent with a hair bun and a white flower, in a beige and navy uniform' },
    { id: 'fh', label: 'Aisyah', desc: 'Calm and well-organised', img: A + 'characters/agent-aisyah.webp', a11y: 'Aisyah, a cheerful female travel agent in a navy hijab with her arms open wide, in a beige and navy uniform' },
    { id: 'm',  label: 'Raka',   desc: 'Friendly and energetic',  img: A + 'characters/agent-raka.webp',   a11y: 'Raka, a friendly male travel agent with wavy dark hair and a yellow tie, in a beige and navy uniform' }
  ];

  const PLACES = {
    prambanan: {
      id: 'prambanan', name: 'Prambanan', pin: { x: 82, y: 25 },
      img: A + 'destinations/dest_prambanan.webp',
      alt: 'Illustration of Prambanan, a Hindu temple complex with tall stone towers',
      tags: ['Temple complex', 'History', 'Architecture'],
      teaser: 'A huge temple complex with tall stone towers.',
      passage: [
        'Prambanan is a large Hindu temple complex near Yogyakarta. It was built in the 9th century, so it is more than one thousand years old.',
        'The complex has many stone temples. The tallest one is about 47 metres high and honours the god Shiva. Two other main temples stand beside it, for the gods Vishnu and Brahma.',
        'Visitors can walk around the courtyards and look closely at the stone walls. The walls have detailed carvings that show scenes from the Ramayana, an old and famous story.',
        'Because of its history and beautiful architecture, Prambanan is a UNESCO World Heritage Site. Many visitors walk slowly here because there is so much to see and learn. It is a good place for people who enjoy the past.'
      ],
      glossary: {
        complex: 'kompleks (sekelompok bangunan)',
        honours: 'menghormati / dipersembahkan untuk',
        carvings: 'ukiran',
        architecture: 'arsitektur (gaya bangunan)'
      }
    },
    malioboro: {
      id: 'malioboro', name: 'Malioboro', pin: { x: 19, y: 30 },
      img: A + 'destinations/dest_malioboro.webp',
      alt: 'Illustration of Malioboro, a busy shopping street with colourful shops',
      tags: ['Shopping street', 'Food', 'City life'],
      teaser: 'A busy street full of shops, snacks and music.',
      passage: [
        'Malioboro is the most famous street in the centre of Yogyakarta. It is long, busy and full of life. It is not far from the main train station.',
        'On both sides of the street, there are small shops and stalls. Visitors can buy batik clothes, bags, key rings and many other souvenirs. Bargaining is common, so shoppers often smile and talk with the sellers.',
        'When people feel hungry, they can try local food, such as gudeg, a sweet dish made from young jackfruit. Becak, the local pedicabs, and horse carts called andong wait along the road.',
        'In the evening, street musicians play and the street becomes even more lively. Malioboro is perfect for people who love shopping, snacks and the city atmosphere.'
      ],
      glossary: {
        stalls: 'lapak / kios kecil',
        souvenirs: 'suvenir / oleh-oleh',
        bargaining: 'menawar harga',
        jackfruit: 'nangka',
        atmosphere: 'suasana'
      }
    }
  };

  // Places shown on the map but locked in this prototype
  const LOCKED_PLACES = [
    { id: 'keraton',     name: 'Keraton Yogyakarta', x: 19, y: 68 },
    { id: 'tamansari',   name: 'Taman Sari',         x: 79, y: 60 },
    { id: 'parangtritis',name: 'Parangtritis',       x: 46, y: 85 },
    { id: 'merapi',      name: 'Merapi / Kaliurang', x: 53, y: 22 }
  ];

  const MISSION = {
    id: 'm1',
    title: 'Mission 1: The History Lover',
    tourist: {
      name: 'Emma',
      sprite: A + 'characters/tourist_sunny_woman.webp',
      alt: 'Emma, a smiling tourist in a pink flowered shirt, sunglasses on her head',
      loves: ['History', 'Impressive old buildings'],
      dislikes: ['Shopping'],
      goal: 'Choose ONE place to visit tomorrow.',
      options: ['prambanan', 'malioboro']
    },
    manager: {
      name: 'Pak Wijaya',
      sprite: A + 'characters/tourist_batik_grandpa.webp',
      alt: 'Pak Wijaya, the friendly agency manager in a batik shirt'
    },
    introLines: [
      'Selamat datang! Welcome to Jogja Travel Agency, {name}. I am Pak Wijaya, the manager.',
      'Today is your first day. Our travelers come from all over the world, and each one wants something different.',
      'Your job is simple: read about each place carefully, then find the one that fits the traveler best.',
      'Do not guess! A good travel agent always has a reason from the text. Ah, our first customer has just arrived!'
    ],
    arriveLines: [
      'Hi! I am Emma. This is my first time in Yogyakarta!',
      'I love history, and I really enjoy seeing big, old, impressive buildings.',
      'I am not interested in shopping this time. Can you help me choose a place to visit?'
    ],
    // ---- Reading tasks (each is submitted once; reading is unlimited) ----
    tasks: [
      {
        id: 't1', skill: 'Find a detail', needs: ['prambanan'], focus: 'prambanan',
        prompt: 'Look at the Prambanan text. What do the carvings on the stone walls show?',
        options: [
          { id: 'a', text: 'Local food and drinks' },
          { id: 'b', text: 'Scenes from the Ramayana' },
          { id: 'c', text: 'The kings of Yogyakarta' },
          { id: 'd', text: 'The sea and the mountains' }
        ],
        correct: 'b',
        right: 'Yes! The text says the walls have carvings that show scenes from the Ramayana.',
        wrong: 'Reread paragraph 3: the walls have carvings that show scenes from the Ramayana.',
        clue: 'Prambanan has detailed stone carvings that show scenes from the Ramayana.'
      },
      {
        id: 't2', skill: 'Compare two places', needs: ['prambanan', 'malioboro'], focus: 'both',
        prompt: 'Emma loves history and does not want to shop. Which sentence compares the two places correctly?',
        options: [
          { id: 'a', text: 'Both places are more than one thousand years old.' },
          { id: 'b', text: 'Malioboro is a historic temple complex, but Prambanan is a shopping street.' },
          { id: 'c', text: 'Prambanan is famous for its history and old stone temples, but Malioboro is famous for shops, food and souvenirs.' },
          { id: 'd', text: 'Malioboro has detailed stone carvings, and Prambanan has street musicians.' }
        ],
        correct: 'c',
        right: 'Correct! Prambanan is about history and old temples. Malioboro is about shopping, food and souvenirs.',
        wrong: 'Compare the two texts again. Prambanan is an old temple complex (9th century). Malioboro is a busy street with shops, food and souvenirs.',
        clue: 'Prambanan is a place for history. Malioboro is a place for shopping, food and city life.'
      },
      {
        id: 't3', skill: 'Choose the best evidence', needs: ['prambanan', 'malioboro'], focus: 'both',
        prompt: 'Which sentence from the texts is the BEST evidence that a place fits Emma\'s love of history and impressive buildings?',
        options: [
          { id: 'a', text: '"Visitors can walk around the courtyards and look closely at the stone walls."' },
          { id: 'b', text: '"Malioboro is perfect for people who love shopping, snacks and the city atmosphere."' },
          { id: 'c', text: '"Because of its history and beautiful architecture, Prambanan is a UNESCO World Heritage Site."' },
          { id: 'd', text: '"In the evening, street musicians play and the street becomes even more lively."' }
        ],
        correct: 'c',
        right: 'Great choice! This sentence mentions both history and beautiful architecture, the two things Emma loves.',
        wrong: 'Look for a sentence about history AND impressive buildings. Only "Because of its history and beautiful architecture, Prambanan is a UNESCO World Heritage Site" mentions both.',
        clue: 'Prambanan is a UNESCO World Heritage Site because of its history and beautiful architecture.'
      }
    ],
    // ---- Final recommendation ----
    final: {
      correctPlace: 'prambanan',
      correctReason: 'r2',
      reasons: [
        { id: 'r1', text: 'It has lively stalls and street food, so Emma can try local dishes.',
          fb: 'That detail is about Malioboro, and Emma wants history and old buildings, not food and shopping.' },
        { id: 'r2', text: 'It is a temple complex more than one thousand years old, with tall stone towers and detailed carvings.',
          fb: '' },
        { id: 'r3', text: 'It is famous for batik clothes and souvenirs that Emma can take home.',
          fb: 'Souvenirs and batik are in the Malioboro text. Emma said she does not want to go shopping.' },
        { id: 'r4', text: 'Street musicians play there in the evening, so Emma can enjoy the city atmosphere.',
          fb: 'Street musicians are part of Malioboro. That does not match Emma\'s love of history and old buildings.' }
      ],
      placeWrong: {
        malioboro: 'Hmm... Malioboro sounds fun, but I said I do not want to go shopping. I want to see history and old buildings. Check your notes again!'
      },
      reasonWrongButPlaceRight: 'Prambanan, yes! But that is not the best reason.',
      success: 'Prambanan is perfect! A temple complex more than a thousand years old, with amazing carvings, exactly what I love. Thank you, {name}. You are a great travel agent!'
    }
  };

  const SCORING = {
    taskPoint: 1,        // per correct reading task (3 tasks)
    firstTryPoints: 2,   // place / reason correct on the first submit
    laterPoints: 1,      // place / reason correct after a retry
    maxPoints: 7,
    starsFor: [ [6, 3], [4, 2], [0, 1] ],   // points >= x -> stars
    coinsPerPoint: 10,
    completionCoins: 10
  };

  const RANKS = [
    { name: 'Travel Intern',     stars: 0 },
    { name: 'Junior Agent',      stars: 2 },
    { name: 'Travel Consultant', stars: 5 },
    { name: 'Senior Agent',      stars: 9 },
    { name: 'Jogja Expert',      stars: 14 }
  ];

  const PASSPORT_SLOTS = [
    { id: 'prambanan', name: 'Prambanan', stamp: A + 'ui/stamp_prambanan.webp' },
    { id: 'malioboro', name: 'Malioboro' }, { id: 'keraton', name: 'Keraton' },
    { id: 'tamansari', name: 'Taman Sari' }, { id: 'parangtritis', name: 'Parangtritis' },
    { id: 'merapi', name: 'Merapi' }
  ];

  const ASSETS = {
    map: A + 'background/map_jogja.webp',
    mapSmall: A + 'background/map_jogja_small.webp',
    ui: n => A + 'ui/' + n + '.webp',
    nextTeaser: A + 'characters/tourist_photographer.webp'
  };

  window.JU_CONTENT = { AGENTS, PLACES, LOCKED_PLACES, MISSION, SCORING, RANKS, PASSPORT_SLOTS, ASSETS };
})();
