/* ALPHABET ANIMAL RESCUE! — prerecorded audio clips (optional)
 *
 * Recorded clips sound far better than browser speech, so the game plays a
 * clip first when one is listed here, and only falls back to the device's
 * speech synthesis when the clip is missing or cannot play.
 *
 * HOW TO ADD CLIPS
 * 1. Record short MP3 files (a friendly, clear voice; about 0.9× normal speed).
 * 2. Put them in  assets/audio/
 * 3. List each one below as  'key': 'file-name.mp3'
 *
 * Keys the game asks for (lowercase letter or animal name):
 *   letter-a … letter-z        "A." (the letter name only, said once)
 *   find-a … find-z            "Find the animal that begins with the letter A."
 *   correct-find-a … -z        "Great job! Ant begins with A!"
 *   find-x-in-fox              "Find the letter X in the word fox."
 *   animal-ant … animal-zebra  "Ant", "Bear" … (also animal-urchin, animal-fox)
 *   try-again                  "Try again!"
 *   try-again-letter           "Try again! Listen to the letter."
 *
 * Example:
 *   AAR.AUDIO_CLIPS = { 'letter-a': 'letter-a.mp3', 'animal-ant': 'animal-ant.mp3' };
 */
window.AAR = window.AAR || {};
AAR.AUDIO_CLIPS = {
};
