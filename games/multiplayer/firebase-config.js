// ENGLISH YO! Multiplayer — Firebase configuration
//
// 1. Go to https://console.firebase.google.com/ and create a project (or use an existing one).
// 2. In the project, click "Build > Realtime Database" and create a database (Spark/free plan is fine).
// 3. In Project settings > General > "Your apps", add a Web app and copy the config object it gives you.
// 4. Paste the values below, replacing every "PASTE_..." placeholder.
// 5. In Realtime Database > Rules, set the rules shown in README-MULTIPLAYER.md so rooms can be
//    read/written without signing in (this is a prototype, not production-hardened).
//
// This file is safe to keep in the repo: a Firebase web config is a client identifier, not a
// secret. Access is controlled by the Realtime Database Rules, not by hiding this file.

const firebaseConfig = {
  apiKey: "AIzaSyDfqhyUe2HVSre3-gJYGpC4s0THwaHYbVI",
  authDomain: "english-yo-multiplayer.firebaseapp.com",
  databaseURL: "https://english-yo-multiplayer-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "english-yo-multiplayer",
  storageBucket: "english-yo-multiplayer.firebasestorage.app",
  messagingSenderId: "227453844686",
  appId: "1:227453844686:web:fe420600863686c196249f",
};
