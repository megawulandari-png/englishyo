// ENGLISH YO! — CLASS CLASH topics: registry + topic-selection screen.
//
// HOW TO ADD A NEW TOPIC (no engine, Firebase or gameplay changes needed):
//   1. Create content/<topic>.js that declares a pack:  const CC_PACK_XYZ = { rounds: [...], questions: [...] }
//      (same schema as content/family-friends.js).
//   2. Load it in index.html before this file.
//   3. Register it below:  add  "<topic-id>": CC_PACK_XYZ  to CC_TOPIC_PACKS.
// The topic's card (already listed in CC_TOPICS) switches from COMING SOON to playable automatically.
//
// Firebase only ever stores the short topic id (rooms/{code}/topicId). All question content stays local.

const CC_DEFAULT_TOPIC = "daily-routine";

// Playable packs. Daily Routine is the ORIGINAL content, referenced as-is (never copied or edited).
const CC_TOPIC_PACKS = {
  "daily-routine": { rounds: CC_ROUNDS, questions: CC_QUESTIONS },
  "family-friends": CC_PACK_FAMILY,
  "past-adventures": CC_PACK_PAST,
  "story-quest": CC_PACK_STORY,
};

// Cards shown on the topic screen, in display order. A topic without a pack is shown as COMING SOON.
const CC_TOPICS = [
  { id: "daily-routine", emoji: "🌅", title: "DAILY ROUTINE", focus: "Simple Present • Daily Activities • Telling Time", level: "A1–A2", c1: "#ffd84a", c2: "#ff9f43" },
  { id: "family-friends", emoji: "👨‍👩‍👧", title: "FAMILY & FRIENDS", focus: "Family Vocabulary • Possessive Adjectives • Possessive 's", level: "A1–A2", c1: "#ff86ae", c2: "#ff3e79" },
  { id: "past-adventures", emoji: "⏳", title: "PAST ADVENTURES", focus: "Simple Past • Past Activities • Time Expressions", level: "A1–A2", c1: "#6db6ff", c2: "#2f74e0" },
  { id: "story-quest", emoji: "📖", title: "STORY QUEST", focus: "Narrative Text • Story Elements • Vocabulary", level: "A2–B1", c1: "#b39bff", c2: "#7550e6" },
  { id: "describe-it", emoji: "🌍", title: "DESCRIBE IT!", focus: "Descriptive Text • Adjectives • People • Places • Animals", level: "A1–A2", c1: "#62dc98", c2: "#1fa864" },
  { id: "ads-notices", emoji: "📢", title: "ADS & NOTICES", focus: "Advertisements • Notices • Warnings • Labels", level: "A2–B1", c1: "#55d6de", c2: "#1698a6" },
];

const ccTopicMeta = (id) => CC_TOPICS.find((t) => t.id === id) || CC_TOPICS[0];
const ccTopicPlayable = (id) => !!CC_TOPIC_PACKS[id];

// Small label in the lobby ("TOPIC 👨‍👩‍👧 FAMILY & FRIENDS"). Called by the engine when the room's topic is known.
window.TopicUI = {
  renderLobbyTopic(id) {
    const el = document.getElementById("lobby-topic");
    if (!el) return;
    const t = ccTopicMeta(id);
    el.style.setProperty("--c1", t.c1);
    el.style.setProperty("--c2", t.c2);
    el.innerHTML = `<small>TOPIC</small><b>${t.emoji} ${t.title.replace(/&/g, "&amp;")}</b>`;
    el.hidden = false;
  },
};

// Topic-selection screen (host only — students never see it; they receive the topic from the room).
window.TopicSelect = (function () {
  let chosenId = null;
  let toastTimer = null;
  let built = false;

  const grid = () => document.getElementById("topic-grid");
  const toast = () => document.getElementById("topic-toast");

  function build() {
    if (built) return;
    built = true;
    grid().innerHTML = CC_TOPICS.map((t) => {
      const ready = ccTopicPlayable(t.id);
      return `<button type="button" class="topic-card${ready ? "" : " is-soon"}" data-topic="${t.id}" aria-disabled="${ready ? "false" : "true"}" style="--c1:${t.c1};--c2:${t.c2}">
        <span class="topic-emoji" aria-hidden="true">${t.emoji}</span>
        <span class="topic-title">${t.title.replace(/&/g, "&amp;")}</span>
        <span class="topic-focus">${t.focus.replace(/'/g, "&#39;")}</span>
        <span class="topic-foot"><span class="topic-level">${t.level}</span>${ready ? `<span class="topic-play">▶ PLAY</span>` : `<span class="topic-soon">COMING SOON</span>`}</span>
      </button>`;
    }).join("");
    grid().addEventListener("click", (e) => {
      const card = e.target.closest(".topic-card");
      if (card) pick(card);
    });
    document.getElementById("btn-topic-back").addEventListener("click", back);
  }

  function pick(card) {
    const id = card.dataset.topic;
    if (!ccTopicPlayable(id)) {
      // Coming soon: purely cosmetic feedback. No room, no content load, no Firebase.
      card.classList.remove("nudge");
      void card.offsetWidth;
      card.classList.add("nudge");
      const t = toast();
      t.textContent = "🚧 Coming soon — this challenge is still being prepared!";
      t.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
      return;
    }
    chosenId = id;
    // Re-runs the (unchanged) create-room handler, which now finds a chosen topic.
    document.getElementById("btn-create-room").click();
  }

  function back() {
    chosenId = null;
    document.body.classList.remove("cc-wide");
    showScreen("landing");
  }

  return {
    chosen: () => chosenId,
    open() {
      build();
      toast().classList.remove("show");
      const who = document.getElementById("topic-host");
      const name = document.getElementById("nickname-input").value.trim();
      who.innerHTML = `<img src="${ccAvatarUrl(chosenAvatar)}" alt="" /><span>Hosting as <b></b></span>`;
      who.querySelector("b").textContent = name;
      document.body.classList.add("cc-wide");
      showScreen("topics");
    },
    reset() {
      chosenId = null;
      document.body.classList.remove("cc-wide");
    },
  };
})();
