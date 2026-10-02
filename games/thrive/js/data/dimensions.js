/* 8 Dimensi Profil Lulusan (Graduate Profile Dimensions) — profileDimensions
 * id = Indonesian official name, en = English display name. Badge art: assets/badges/<key>.png */
window.THRIVE = window.THRIVE || {};
THRIVE.MILESTONES = [3, 6, 12];          // points needed for ★, ★★, ★★★
THRIVE.DIM_MAX = 12;                     // points that fill a bar (whole-game goal)
THRIVE.dimensions = [
  { key: 'faith', id: 'Keimanan & Ketakwaan', en: 'Faith & Piety', color: '#7b4fd0',
    badge: 'Kind Heart', what: 'Respect, gratitude, care for others, harmony with people and nature.' },
  { key: 'citizenship', id: 'Kewargaan', en: 'Citizenship', color: '#f08a12',
    badge: 'Proud Citizen', what: 'Indonesian culture, responsibility, rules and respect for diversity.' },
  { key: 'critical', id: 'Penalaran Kritis', en: 'Critical Thinking', color: '#2f9a3a',
    badge: 'Critical Thinker', what: 'Spot wrong or unsafe steps, compare options, solve problems.' },
  { key: 'creative', id: 'Kreativitas', en: 'Creativity', color: '#e8a10c',
    badge: 'Idea Maker', what: 'Create procedures and develop simple, original solutions.' },
  { key: 'collab', id: 'Kolaborasi', en: 'Collaboration', color: '#1f6fd6',
    badge: 'Team Player', what: 'Teamwork, sharing roles, helping others and respecting ideas.' },
  { key: 'independence', id: 'Kemandirian', en: 'Independence', color: '#d9342b',
    badge: 'Self-Manager', what: 'Finish tasks yourself, make responsible decisions, manage yourself.' },
  { key: 'health', id: 'Kesehatan', en: 'Health', color: '#1f8a4c',
    badge: 'Well-being Keeper', what: 'Physical and mental well-being, healthy digital habits, safety.' },
  { key: 'communication', id: 'Komunikasi', en: 'Communication', color: '#d63e86',
    badge: 'Clear Communicator', what: 'Listening, giving instructions, explaining steps, presenting clearly.' }
];
THRIVE.dimByKey = Object.fromEntries(THRIVE.dimensions.map(d => [d.key, d]));
THRIVE.badgeSrc = key => 'badges/' + key + '.png';
