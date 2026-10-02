/* How THRIVE supports the CP + curriculum map.
 * The OFFICIAL CP text is in js/data/cp-official.js (kept separate so it can be replaced word for word).
 * World rows of the curriculum map are generated from each stage's `align` data in js/data/missions/*.js. */
window.THRIVE = window.THRIVE || {};
THRIVE.curriculum = {
  facts: [
    { k: 'Phase', v: 'Fase D (SMP)' },
    { k: 'Level', v: 'approximately CEFR A2' },
    { k: 'Vocabulary', v: 'approximately 2,000 high-frequency words' }
  ],
  contextNote: 'Vocabulary should be learned in context, not as isolated word lists.',
  supports: [
    { skill: 'Listening – Speaking', items: ['Listen & Do in every world: follow oral instructions in the right order.', 'Screen Break Coach, Kindness Coach and Earthquake Drill: hear one step, then do or say it.', 'Tell Your Procedure and the Final Mission: present a procedure aloud.'] },
    { skill: 'Reading – Viewing', items: ['Observe: find the goal, materials and steps in multimodal procedure cards (how-to, recipe, social, safety).', 'Tool / Ingredient / Safe Spot Check, Missing Step, What Comes Next?: read for explicit and implicit information.', 'Safe or Unsafe, Link Check, Kind or Unkind, Responsible or Not: evaluate instructions.'] },
    { skill: 'Writing – Presenting', items: ['Instruction Error: correct the imperative form.', 'Build the Procedure in every world: goal, 3–5 steps and sequence markers.', 'Final Mission: write an original life guide (own goal, materials and steps) and present it.'] }
  ],
  goals: [
    'Identify the goal of a procedure.',
    'Identify tools or materials when they are needed, and know they are not always needed.',
    'Understand and use sequence markers: first, next, then, after that, finally.',
    'Recognise and use imperative verbs.',
    'Follow oral and written instructions.',
    'Detect incorrect or unsafe steps.',
    'Arrange steps logically and complete missing steps.',
    'Create a short procedure and present it aloud.'
  ],
  /* Final Mission rows (World rows are generated from each mission's stage data) */
  finalMap: [
    { activity: 'Choose a Topic', purpose: 'Choose a real-life area for your guide.', skill: 'Reading – Viewing', competency: 'Identify the purpose of a procedure', feature: 'Topic vocabulary', dims: ['independence'] },
    { activity: 'Write the Goal', purpose: 'Choose or write your own goal.', skill: 'Writing', competency: 'State the goal of a procedure', feature: 'How to + base verb', dims: ['creative'] },
    { activity: 'Materials (if needed)', purpose: 'Decide which materials are needed, or none.', skill: 'Writing', competency: 'Identify materials / tools when needed', feature: 'Nouns for materials', dims: ['critical'] },
    { activity: 'Write 3–5 Steps', purpose: 'Choose or write your own steps; each starts with an action word.', skill: 'Writing', competency: 'Create the steps of a procedure', feature: 'Imperative verbs (checked automatically)', dims: ['creative', 'independence'] },
    { activity: 'Add Sequence Markers', purpose: 'Order the steps with First … Finally.', skill: 'Writing', competency: 'Sequence a procedure', feature: 'Sequence markers', dims: ['critical'] },
    { activity: 'Present My Life Guide', purpose: 'Read the guide aloud and present it to someone.', skill: 'Speaking', competency: 'Present instructions orally', feature: 'Simple and compound sentences', dims: ['communication'] }
  ]
};
