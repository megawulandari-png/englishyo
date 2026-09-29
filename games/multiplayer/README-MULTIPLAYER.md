# ENGLISH YO! Multiplayer — setup & testing

Realtime classroom lobby (2–40 players) + the first game, **CLASS CLASH** (Daily Routine Adventure,
4 teams, 10 rounds). Game logic lives in `class-clash.js`, questions/avatars/round plan in
`class-clash-content.js`, styles in `class-clash.css`.

### Topics
The host picks a topic on the **CHOOSE YOUR CHALLENGE!** screen (shown after entering a nickname and tapping
CREATE ROOM). Only the short id is stored in Firebase (`rooms/{code}/topicId`); every device already has the
questions. Students never choose — the lobby shows `TOPIC …` from the room. Rooms without a `topicId` play Daily Routine.

| Topic | Status | Content |
|---|---|---|
| 🌅 Daily Routine | playable (original content, unchanged) | `class-clash-content.js` |
| 👨‍👩‍👧 Family & Friends | playable (30 questions, 10 rounds) | `content/family-friends.js` |
| ⏳ Past Adventures | playable (30 questions, 10 rounds) | `content/past-adventures.js` |
| 📖 Story Quest | playable (30 questions, 10 rounds) | `content/story-quest.js` |
| 🌍 Describe It! · 📢 Ads & Notices | COMING SOON | — |

**Adding a topic** (no engine / Firebase / gameplay changes): (1) create `content/<topic>.js` declaring a pack
`{ rounds: [...], questions: [...] }` in the same format as `content/family-friends.js`; (2) load it in
`index.html` before `topics.js`; (3) add `"<topic-id>": <pack>` to `CC_TOPIC_PACKS` in `topics.js`. Its card
switches from COMING SOON to playable automatically. Questions may carry an optional `tier` (1–3) and rounds a
matching `tier` so a session gets harder as it goes.

### Classroom tips (CLASS CLASH)
- Show the host/teacher screen on the IFD and keep that browser tab in front — it ends rounds early
  once everyone has answered. If it is hidden or the laptop sleeps, students' phones keep the game
  moving on the round timers.
- A student whose phone refreshed or whose tab was closed can rejoin mid-game: open the page, type the
  **same nickname** and room code, tap JOIN ROOM — their team and score are kept. The teacher can do
  the same to get the host screen back.
- PLAY AGAIN keeps everyone in the room, clears scores and teams, and drops students who left.
- To add a question, append it to `CC_QUESTIONS` (answers are the exact option text).

## 1. Firebase project (Spark/free plan)

1. Go to https://console.firebase.google.com/ → **Add project** (Google Analytics not needed).
2. In the project: **Build → Realtime Database → Create Database**. Pick a region close to
   Indonesia (e.g. Singapore) and start in **test mode** for now.
3. **Project settings (gear icon) → General → Your apps → Add app → Web (`</>`)**. Register
   any nickname (e.g. "english-yo-web"), skip hosting.
4. Copy the `firebaseConfig` object it shows you and paste the values into
   [`firebase-config.js`](firebase-config.js) in this folder, replacing every `PASTE_...`.

## 2. Realtime Database rules

Go to **Realtime Database → Rules** and use this for the prototype:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

This allows anyone with the project's Firebase config to read/write room data — fine for a
prototype on the free tier, but do not put anything sensitive in the database. Before a public
launch, tighten this (e.g. require Firebase Anonymous Auth and validate payload shape).

## 3. Testing with two devices

1. Open `games/multiplayer/index.html` on your laptop (serve it with any static server, or open
   the file directly — both work since this uses the Firebase compat SDK).
2. Enter a nickname and click **Create Room**. Note the room code shown (e.g. `YO4821`).
3. On your phone, open the same page (same URL — it must be reachable from the phone, e.g. via
   your laptop's local IP + a simple static server, or once the site is deployed).
4. Enter a different nickname, type the room code, click **Join Room**.
5. The phone's name should appear on the laptop's player list within a second or two, and vice
   versa — no page refresh needed.
6. Toggle "I'm Ready" on the phone and confirm the badge updates live on the laptop.
7. On the laptop (host), click **START GAME** — both devices should switch to the "Game is
   starting!" placeholder screen at the same time.

If nothing syncs: check the small status dot top-right of the page ("Realtime connected" vs
"Offline" vs "Firebase not configured") and check the browser console for errors — the most
common cause is `firebase-config.js` still containing placeholder values, or `databaseURL`
pointing at the wrong region.
