/* worlds + mission index. Playable mission content lives in js/data/missions/*.js
 * pos = node position on the world map, as % of the map image (centre of each path pad, measured from the art).
 * desc / welcome = world intro page text (welcome is the mascot line; audio key 'w<N>-world', speech synthesis until recorded).
 * Journey: World 1 is open; each world unlocks when the previous world's main mission is complete. */
window.THRIVE = window.THRIVE || {};
THRIVE.worlds = [
  { id: 1, name: 'Take Care of Me', theme: 'Health and Well-being', color: '#e2445c', pos: [11.8, 69.3],
    quote: '“Taking care of yourself helps you take care of others.”',
    desc: 'Learn healthy procedures for your body and mind.',
    welcome: 'Welcome to World 1! Here we learn how to take care of ourselves.',
    missions: [
      { id: 'screen-break', title: 'How to Take a Healthy Screen Break', type: 'How-to procedure', ready: true },
      { id: 'w1-hands', title: 'How to Wash Your Hands Properly' }, { id: 'w1-lunch', title: 'How to Prepare a Healthy Lunch' }] },
  { id: 2, name: 'Think Before You Click', theme: 'Digital Safety and Smart Choices', color: '#2f78d6', pos: [31.5, 50.4],
    quote: '“Smart choices begin with one simple step: think first.”',
    desc: 'Learn safe procedures for phones, links and messages.',
    welcome: 'Welcome to World 2! Online, we always think before we click.',
    missions: [
      { id: 'qr-code', title: 'How to Scan a QR Code Safely', type: 'Digital safety procedure', ready: true },
      { id: 'w2-pass', title: 'How to Create a Strong Password' }, { id: 'w2-msg', title: 'How to Respond to an Unsafe Message' }] },
  { id: 3, name: 'Taste of Nusantara', theme: 'Indonesian Traditional Food', color: '#e07a1f', pos: [50.0, 71.2],
    quote: '“Every recipe tells a story about people, places, and culture.”',
    desc: 'Read and follow Indonesian recipes, and respect food from every region.',
    welcome: 'Welcome to World 3! Let’s cook and learn about Indonesian food.',
    missions: [
      { id: 'klepon', title: 'How to Make Klepon', type: 'Recipe procedure', ready: true },
      { id: 'w3-wedang', title: 'How to Make Wedang Uwuh' }, { id: 'w3-gado', title: 'How to Make Gado-Gado' }] },
  { id: 4, name: 'Better Together', theme: 'Tolerance, Empathy and Friendship', color: '#d63e86', pos: [65.8, 50.7],
    quote: '“Respect makes differences beautiful.”',
    desc: 'Learn kind procedures for friends who are different from you.',
    welcome: 'Welcome to World 4! Kind words and actions make us better together.',
    missions: [
      { id: 'fasting-friend', title: 'How to Respect a Friend Who Is Fasting', type: 'Social procedure', ready: true },
      { id: 'w4-new', title: 'How to Welcome a New Student' }, { id: 'w4-listen', title: 'How to Be a Good Listener' }] },
  { id: 5, name: 'Care for Our Place', theme: 'School Life and Environment', color: '#2f9a3a', pos: [85.3, 66.8],
    quote: '“Small actions can make a big difference.”',
    desc: 'Learn responsible procedures for a clean school and a healthy planet.',
    welcome: 'Welcome to World 5! Let’s take care of our school together.',
    missions: [
      { id: 'sort-waste', title: 'How to Sort Waste at School', type: 'School procedure', ready: true },
      { id: 'w5-library', title: 'How to Borrow and Return a Library Book' }, { id: 'w5-water', title: 'How to Save Water at School' }] },
  { id: 6, name: 'Ready for Real Life', theme: 'Safety and Emergency Readiness', color: '#7b4fd0', pos: [90.4, 34.4],
    quote: '“Being prepared helps us stay calm and make better decisions.”',
    desc: 'Learn calm, clear safety procedures for real life.',
    welcome: 'Welcome to World 6! When we practise, we stay calm and safe.',
    missions: [
      { id: 'earthquake', title: 'What to Do During an Earthquake', type: 'Safety procedure', ready: true },
      { id: 'w6-bag', title: 'How to Prepare an Emergency Bag' }] }
];
THRIVE.finalMission = { id: 'life-guide', title: 'Create Your Life Guide', pos: [76, 17], dims: ['creative', 'communication', 'independence'],
  topics: ['Health', 'Digital Life', 'Food', 'Friendship', 'Environment', 'School Life', 'Safety'] };
