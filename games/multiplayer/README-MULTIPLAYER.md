# ENGLISH YO! Multiplayer — setup & testing

Prototype only: room create/join + realtime player list. No gameplay/race yet.

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
