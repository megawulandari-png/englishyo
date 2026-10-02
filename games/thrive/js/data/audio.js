/* AUDIO MANIFEST — one entry per clip: id → { src, text }
 *  - src  : file name inside games/thrive/audio/ (lower-case, .mp3). The file is used when it exists.
 *           src: null = not recorded yet → browser speech synthesis straight away (no file request).
 *           If a src file is missing (404) the engine remembers it and uses speech synthesis with `text` instead.
 *  - text : what the recording says. The mascot's speech bubble and transcripts show this text, so keep it identical to the recording.
 *  - Stages name their clips EXPLICITLY in js/data/missions/*.js (never by position):
 *      narration: ['w2-intro', 'w2-observe']   clips played in this order when the stage opens (also the bubble text + Replay/Slow)
 *      clip: 'w1-do-03'  or  clip: ['w1-do-01', 'w1-do-02']   audio for PLAY AUDIO / REPLAY / SLOW in that stage
 *  - Recorded (78 files, Oct 2026): thrive-opening-01/02, thrive-ready, ui-welcome, w1…w6-{intro,observe,understand,fix,do-01…05,create,complete},
 *    final-{intro,choose,goal,materials,steps,check,present,complete}.
 *  - Not recorded yet (speech synthesis): decision / tip clips below (tip-*, sit-*), world welcome lines (w1-world … w6-world), word audio.
 *  - Texts below were taken from an automatic transcript of the recordings — please re-read them once against the recordings.
 *  - To reuse an ENGLISH YO! Listening clip, set src to a relative path such as '../../../assets/money-01.mp3'.
 */
window.THRIVE = window.THRIVE || {};
THRIVE.audioConfig = { basePath: 'audio/', slowFile: 0.8, slowSpeech: 0.7, normalSpeech: 0.92, gapMs: 750, clipGapMs: 350 };
THRIVE.audioMap = {
  // opening + UI
  'thrive-opening-01': { src: 'thrive-opening-01.mp3', text: 'Life gives us many challenges. Knowing what to do is a superpower.' },
  'thrive-opening-02': { src: 'thrive-opening-02.mp3', text: 'Read carefully. Think wisely. Help others. Take care of yourself. And keep moving forward.' },
  'thrive-ready': { src: 'thrive-ready.mp3', text: 'Ready to thrive?' },
  // opening + UI
  'ui-welcome': { src: 'ui-welcome.mp3', text: 'Welcome to THRIVE! Choose a world and start your mission.' },
  // World 1 · Take Care of Me
  'w1-intro': { src: 'w1-intro.mp3', text: 'Today’s mission: How to take a healthy screen break!' },
  'w1-observe': { src: 'w1-observe.mp3', text: 'Look at the picture. What’s the problem?' },
  'w1-understand': { src: 'w1-understand.mp3', text: 'Spending too much time on a screen can tire your eyes and body. A short break helps you feel better and stay healthy.' },
  'w1-fix': { src: 'w1-fix.mp3', text: 'Let’s put the steps in the correct order!' },
  'w1-do-01': { src: 'w1-do-01.mp3', text: 'First, look away from the screen.' },
  'w1-do-02': { src: 'w1-do-02.mp3', text: 'Next, stand up.' },
  'w1-do-03': { src: 'w1-do-03.mp3', text: 'Then, stretch your arms.' },
  'w1-do-04': { src: 'w1-do-04.mp3', text: 'After that, blink your eyes slowly.' },
  'w1-do-05': { src: 'w1-do-05.mp3', text: 'Finally, drink some water.' },
  'w1-create': { src: 'w1-create.mp3', text: 'Now, create your own screen break procedure. What will you do?' },
  'w1-complete': { src: 'w1-complete.mp3', text: 'Great job! You completed World 1. You’re one step closer to thriving.' },
  // World 2 · Think Before You Click
  'w2-intro': { src: 'w2-intro.mp3', text: 'Hi, welcome to Think Before You Click. Today, you will learn how to scan a QR code safely.' },
  'w2-observe': { src: 'w2-observe.mp3', text: 'Look at the poster carefully. What looks strange?' },
  'w2-understand': { src: 'w2-understand.mp3', text: 'Not every QR code is safe. Check where it comes from before you scan it.' },
  'w2-fix': { src: 'w2-fix.mp3', text: 'Put the safe steps in the correct order.' },
  'w2-do-01': { src: 'w2-do-01.mp3', text: 'First, look at the QR code carefully.' },
  'w2-do-02': { src: 'w2-do-02.mp3', text: 'Next, check where it comes from.' },
  'w2-do-03': { src: 'w2-do-03.mp3', text: 'Then, scan it with your device.' },
  'w2-do-04': { src: 'w2-do-04.mp3', text: 'After that, check the link before opening it.' },
  'w2-do-05': { src: 'w2-do-05.mp3', text: 'Finally, close it if it looks unsafe.' },
  'w2-create': { src: 'w2-create.mp3', text: 'Now, build your own safe QR code procedure.' },
  'w2-complete': { src: 'w2-complete.mp3', text: 'Great thinking! You completed Think Before You Click.' },
  // World 3 · Taste of Nusantara
  'w3-intro': { src: 'w3-intro.mp3', text: 'Welcome to Taste of Nusantara. Let’s learn how to make klepon.' },
  'w3-observe': { src: 'w3-observe.mp3', text: 'Look at the ingredients. What do you think we need?' },
  'w3-understand': { src: 'w3-understand.mp3', text: 'Klepon is a traditional Indonesian snack with palm sugar inside and grated coconut outside.' },
  'w3-fix': { src: 'w3-fix.mp3', text: 'The recipe steps are mixed up. Put them in the correct order.' },
  'w3-do-01': { src: 'w3-do-01.mp3', text: 'First, prepare the ingredients.' },
  'w3-do-02': { src: 'w3-do-02.mp3', text: 'Next, mix the flour with water.' },
  'w3-do-03': { src: 'w3-do-03.mp3', text: 'Then, shape the dough and put palm sugar inside.' },
  'w3-do-04': { src: 'w3-do-04.mp3', text: 'After that, boil the balls until they float.' },
  'w3-do-05': { src: 'w3-do-05.mp3', text: 'Finally, roll them in grated coconut and serve.' },
  'w3-create': { src: 'w3-create.mp3', text: 'Now, complete the klepon recipe using clear steps.' },
  'w3-complete': { src: 'w3-complete.mp3', text: 'Well done! You completed Taste of Nusantara.' },
  // World 4 · Better Together
  'w4-intro': { src: 'w4-intro.mp3', text: 'Hi, welcome to Better Together. Today, we will learn how to respect a friend who is fasting.' },
  'w4-observe': { src: 'w4-observe.mp3', text: 'Look at the situation. How can you be a respectful friend?' },
  'w4-understand': { src: 'w4-understand.mp3', text: 'Respect means understanding that people may have different needs, beliefs, and habits.' },
  'w4-fix': { src: 'w4-fix.mp3', text: 'Which actions show respect? Put the helpful steps in order.' },
  'w4-do-01': { src: 'w4-do-01.mp3', text: 'First, speak politely.' },
  'w4-do-02': { src: 'w4-do-02.mp3', text: 'Next, respect your friend’s choice.' },
  'w4-do-03': { src: 'w4-do-03.mp3', text: 'Then, do not tease or force your friend.' },
  'w4-do-04': { src: 'w4-do-04.mp3', text: 'After that, ask if your friend needs support.' },
  'w4-do-05': { src: 'w4-do-05.mp3', text: 'Finally, keep being kind and respectful.' },
  'w4-create': { src: 'w4-create.mp3', text: 'Now, create a simple guide for being a respectful friend.' },
  'w4-complete': { src: 'w4-complete.mp3', text: 'Wonderful! You completed Better Together.' },
  // World 5 · Care for Our Place
  'w5-intro': { src: 'w5-intro.mp3', text: 'Hi, welcome to Care for Our Place. Let’s learn how to sort waste at school.' },
  'w5-observe': { src: 'w5-observe.mp3', text: 'Look around. What problem can you see?' },
  'w5-understand': { src: 'w5-understand.mp3', text: 'Sorting waste helps keep our school clean and makes recycling easier.' },
  'w5-fix': { src: 'w5-fix.mp3', text: 'The waste sorting steps are mixed up. Fix the order.' },
  'w5-do-01': { src: 'w5-do-01.mp3', text: 'First, look at the rubbish.' },
  'w5-do-02': { src: 'w5-do-02.mp3', text: 'Next, decide what type it is.' },
  'w5-do-03': { src: 'w5-do-03.mp3', text: 'Then, put plastic in the correct bin.' },
  'w5-do-04': { src: 'w5-do-04.mp3', text: 'After that, put paper in the correct bin.' },
  'w5-do-05': { src: 'w5-do-05.mp3', text: 'Finally, keep the area clean.' },
  'w5-create': { src: 'w5-create.mp3', text: 'Now, build a simple procedure for sorting waste at school.' },
  'w5-complete': { src: 'w5-complete.mp3', text: 'Great work! You completed Care for Our Place.' },
  // World 6 · Ready for Real Life
  'w6-intro': { src: 'w6-intro.mp3', text: 'Hi, welcome to Ready for Real Life. Today, you will learn what to do during an earthquake.' },
  'w6-observe': { src: 'w6-observe.mp3', text: 'Look at the situation. What should you do first?' },
  'w6-understand': { src: 'w6-understand.mp3', text: 'During an earthquake, staying calm and following safe steps can help protect you.' },
  'w6-fix': { src: 'w6-fix.mp3', text: 'Put the safety steps in the correct order.' },
  'w6-do-01': { src: 'w6-do-01.mp3', text: 'First, stay calm.' },
  'w6-do-02': { src: 'w6-do-02.mp3', text: 'Next, protect your head.' },
  'w6-do-03': { src: 'w6-do-03.mp3', text: 'Then, move away from windows.' },
  'w6-do-04': { src: 'w6-do-04.mp3', text: 'After that, go to a safe place when it is safe to move.' },
  'w6-do-05': { src: 'w6-do-05.mp3', text: 'Finally, follow instructions from your teacher or another trusted adult.' },
  'w6-create': { src: 'w6-create.mp3', text: 'Now, create a clear earthquake safety procedure.' },
  'w6-complete': { src: 'w6-complete.mp3', text: 'Excellent! You completed Ready for Real Life.' },
  // Final mission · Create Your Life Guide
  'final-intro': { src: 'final-intro.mp3', text: 'You have completed your journey. Now it is time to create your own life guide.' },
  'final-choose': { src: 'final-choose.mp3', text: 'Choose a topic that is useful in real life.' },
  'final-goal': { src: 'final-goal.mp3', text: 'First, choose or write your goal.' },
  'final-materials': { src: 'final-materials.mp3', text: 'Next, add tools or materials if you need them.' },
  'final-steps': { src: 'final-steps.mp3', text: 'Then, create three to five clear steps.' },
  'final-check': { src: 'final-check.mp3', text: 'Check your sequence words and imperative verbs.' },
  'final-present': { src: 'final-present.mp3', text: 'Great. Now read your procedure aloud.' },
  'final-complete': { src: 'final-complete.mp3', text: 'You did not just finish a game. You learned how to thrive.' },
  // not recorded yet → speech synthesis (src: null)
  'tip-w1-safe': { src: null, text: 'Stretch your arms slowly and gently. Do not stretch too fast.' },
  'sit-w1-eyes': { src: null, text: 'You have studied on your tablet for one hour. Your eyes feel tired and dry. What do you do first?' },
  'sit-w1-friend': { src: null, text: 'Your friend has played a game for two hours. Your friend looks tired. What do you say?' },
  'sit-w2-message': { src: null, text: 'A message from an unknown number says: Scan this QR code to get free data! What do you do?' },
  'sit-w3-papeda': { src: null, text: 'A new friend from Papua brings papeda to class. Papeda is a sago porridge. It looks different from your food. What do you say?' },
  'sit-w4-lunch': { src: null, text: 'It is lunchtime. Your friend is fasting and sits alone. What do you do?' },
  'sit-w5-cleanup': { src: null, text: 'Your class has a clean-up day. Some friends just play and do not help. What do you say?' },
  'sit-w6-scared': { src: null, text: 'The shaking has stopped. Your friend is scared and crying. What do you do?' },
};

/* world welcome lines (w1-world … w6-world) come from js/data/worlds.js so the text lives in one place; not recorded yet → speech synthesis */
THRIVE.worlds.forEach(w => { THRIVE.audioMap['w' + w.id + '-world'] = { src: null, text: w.welcome }; });
