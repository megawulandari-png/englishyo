/* SOURCES & CREDITS — list only what is actually used. Never invent a citation.
 * url ''  → the page shows "SOURCE TO BE ADDED".   noLink: true → an original/own asset that needs no external reference.
 * A section with no items shows "SOURCE TO BE ADDED". */
window.THRIVE = window.THRIVE || {};
THRIVE.sources = [
  { key: 'curriculum', name: 'Curriculum References', items: [
    { title: 'Capaian Pembelajaran Bahasa Inggris, Fase D', by: 'Kemendikdasmen', note: 'Used for the Capaian Pembelajaran page and the learning goals.', url: '' },
    { title: 'Dimensi Profil Lulusan (8 dimensions)', by: 'Kemendikdasmen', note: 'Used for the Life Compass and badges.', url: '' }] },
  { key: 'learning', name: 'Learning References', items: [
    { title: 'Common European Framework of Reference for Languages (CEFR), level A2', by: 'Council of Europe', note: 'Reference for the target English level.', url: '' }] },
  { key: 'health', name: 'Health & Safety References', items: [
    { title: 'Screen-break advice used in World 1 (look away, stand up, stretch, blink, drink water)', by: '', note: 'Health reference for the World 1 procedure.', url: '' },
    { title: 'QR code and link safety advice used in World 2', by: '', note: 'Digital safety reference for the World 2 procedure.', url: '' },
    { title: 'Waste-sorting categories used in World 5 (plastic, paper, organic)', by: '', note: 'Environment reference for the World 5 procedure.', url: '' },
    { title: 'Earthquake safety steps used in World 6', by: '', note: 'Disaster-preparedness reference for the World 6 procedure.', url: '' }] },
  { key: 'cultural', name: 'Cultural References', items: [
    { title: 'Klepon: a traditional snack from Java (World 3 recipe and cultural notes)', by: '', note: 'Recipe and cultural information.', url: '' },
    { title: 'Papeda: a sago dish from Papua (World 3 decision)', by: '', note: 'Cultural information.', url: '' },
    { title: 'Fasting in different religions (World 4 context)', by: '', note: 'Cultural and religious context.', url: '' }] },
  { key: 'visual', name: 'Visual Assets', items: [
    { title: 'THRIVE Animal Mascot Avatar Sheet', by: 'AI-assisted original assets for THRIVE', note: '8 animal mascots × 3 states (ready, thinking, happy).', noLink: true },
    { title: 'THRIVE Core Assets sprite sheet', by: 'AI-assisted original assets for THRIVE', note: 'Objects, buttons, audio controls, world icons, badges, feedback icons and panels.', noLink: true },
    { title: 'THRIVE World Map background', by: 'AI-assisted original assets for THRIVE', note: 'World map and blurred app background.', noLink: true },
    { title: 'ENGLISH YO! logo and developer photo', by: 'ENGLISH YO! (Mega Ayu Wulandari)', note: 'Used on the Developer page.', noLink: true }] },
  { key: 'audio', name: 'Audio', items: [
    { title: 'Recorded narration (15 MP3 files: opening, welcome and World 1 mascot lines)', by: '', note: 'Voice / recording credit.', url: '' },
    { title: 'Worlds 2–6, world welcome lines and the final mission', by: 'Browser speech synthesis until recordings are added', note: 'File names are listed in js/data/audio.js.', noLink: true },
    { title: 'Listening clips lc-01 to lc-05 and word audio', by: 'Browser speech synthesis (voice provided by the device)', note: 'Used until recordings are added.', noLink: true },
    { title: 'Music and sound effects', by: 'Generated in the browser with the Web Audio API', note: 'No external audio files.', noLink: true }] },
  { key: 'icons', name: 'Icons & Fonts', items: [
    { title: 'Baloo 2 and Nunito Sans', by: 'Google Fonts (SIL Open Font License)', note: 'Same fonts as the ENGLISH YO! website.', url: 'https://fonts.google.com' },
    { title: 'Icons', by: 'THRIVE Core Assets sheet, plus inline SVG sticker icons drawn for THRIVE in the same style (js/data/icons.js)', note: '', noLink: true }] }
];
THRIVE.aiTextDefault = 'Artificial intelligence was used as a development assistant for selected illustrations, coding support, audio support, and content prototyping.\n\nLearning objectives, curriculum alignment, activity design, content selection, and instructional decisions were reviewed and developed by the teacher.';
