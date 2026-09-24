/* ==========================================================
   NARRATIVE QUEST — Story Library
   ----------------------------------------------------------
   1. GENRES  – the four story worlds (fixed).
   2. CATALOG – every story card shown in the library.
      Cards with status "coming-soon" are shown but locked.
   3. NQ.registerStory(data) – a full story file calls this.
      It adds (or upgrades) the catalog card to "playable".

   To add a new playable story: copy
   stories/putri-serindang-bulan.js, change the data, and add
   one <script> tag in index.html. No engine changes needed.
   ========================================================== */
(function () {
  const NQ = (window.NQ = window.NQ || {});
  NQ.stories = NQ.stories || {};

  NQ.GENRES = [
    {
      id: "legends",
      name: "Legends",
      icon: "🏔️",
      portal: "img/portal-legends.webp",
      tagline: "The Mountain Kingdom",
      desc: "Stories connected to places, people, or events that are believed to have happened long ago.",
      theme: { a: "#1f4d3a", b: "#0f2a22", glow: "#f3c969" },
    },
    {
      id: "fables",
      name: "Fables",
      icon: "🦊",
      portal: "img/portal-fables.webp",
      tagline: "The Whispering Forest",
      desc: "Stories featuring animals or other characters that teach a moral lesson.",
      theme: { a: "#2f6b2a", b: "#132f16", glow: "#9fe07a" },
    },
    {
      id: "fairy",
      name: "Fairy Tales",
      icon: "🏰",
      portal: "img/portal-fairy.webp",
      tagline: "The Cloud Castle",
      desc: "Imaginative stories involving magical events, unusual characters, or extraordinary situations.",
      theme: { a: "#5b3a8f", b: "#2a1850", glow: "#e7b8ff" },
    },
    {
      id: "myths",
      name: "Myths & Folktales",
      icon: "🌌",
      portal: "img/portal-myths.webp",
      tagline: "The Moonlit Waterfall",
      desc: "Traditional stories passed from generation to generation, often involving beliefs, cultural values, supernatural events, or local traditions.",
      theme: { a: "#1c3a7a", b: "#0b1638", glow: "#9cc8ff" },
    },
  ];

  /* Coming-soon cards. `art` draws a simple illustrated cover when
     there is no picture yet. When a full story file for the same id is
     loaded, the card automatically becomes playable. */
  NQ.CATALOG = [
    // LEGENDS
    { id: "malin-kundang", title: "Malin Kundang", genre: "legends", origin: "indonesia", region: "West Sumatra, Indonesia", level: "A2", minutes: 25, cover: "img/cover-malin-kundang.webp", status: "coming-soon" },
    { id: "roro-jonggrang", title: "Roro Jonggrang", genre: "legends", origin: "indonesia", region: "Central Java, Indonesia", level: "A2", minutes: 25, art: { emoji: "🛕", from: "#6b3f1d", to: "#e0a458" }, status: "coming-soon" },
    { id: "tangkuban-perahu", title: "Tangkuban Perahu", genre: "legends", origin: "indonesia", region: "West Java, Indonesia", level: "B1", minutes: 25, art: { emoji: "⛰️", from: "#24476b", to: "#7fb2c9" }, status: "coming-soon" },
    { id: "king-arthur", title: "King Arthur and the Sword in the Stone", genre: "legends", origin: "world", region: "Britain", level: "B1", minutes: 25, art: { emoji: "🗡️", from: "#2d3b55", to: "#8fa3bf" }, status: "coming-soon" },
    // FABLES
    { id: "mouse-deer-crocodiles", title: "The Mouse Deer and the Crocodiles", genre: "fables", origin: "indonesia", region: "Indonesia (Kancil stories)", level: "A2", minutes: 20, art: { emoji: "🦌", from: "#1f5a3a", to: "#7cc47f" }, status: "coming-soon" },
    { id: "lion-and-mouse", title: "The Lion and the Mouse", genre: "fables", origin: "world", region: "Ancient Greece (Aesop)", level: "A1", minutes: 15, art: { emoji: "🦁", from: "#7a4a12", to: "#f0c060" }, status: "coming-soon" },
    { id: "tortoise-and-hare", title: "The Tortoise and the Hare", genre: "fables", origin: "world", region: "Ancient Greece (Aesop)", level: "A1", minutes: 15, art: { emoji: "🐢", from: "#2c5e2e", to: "#a7d67c" }, status: "coming-soon" },
    // FAIRY TALES
    { id: "timun-mas", title: "Timun Mas", genre: "fairy", origin: "indonesia", region: "Central Java, Indonesia", level: "A2", minutes: 25, art: { emoji: "🥒", from: "#5a3a12", to: "#f2c14e" }, status: "coming-soon" },
    { id: "selfish-giant", title: "The Selfish Giant", genre: "fairy", origin: "world", region: "Oscar Wilde · Ireland / UK", level: "B1", minutes: 25, art: { emoji: "🌸", from: "#40306b", to: "#c9a3e8" }, status: "coming-soon" },
    { id: "elves-shoemaker", title: "The Elves and the Shoemaker", genre: "fairy", origin: "world", region: "Brothers Grimm · Germany", level: "A2", minutes: 20, art: { emoji: "👞", from: "#4a2a1a", to: "#c98b5a" }, status: "coming-soon" },
    // MYTHS & FOLKTALES
    { id: "aji-saka", title: "Aji Saka", genre: "myths", origin: "indonesia", region: "Java, Indonesia", level: "B1", minutes: 25, art: { emoji: "📜", from: "#3b2a14", to: "#d9b36c" }, status: "coming-soon" },
    { id: "momotaro", title: "Momotaro, the Peach Boy", genre: "myths", origin: "world", region: "Japan", level: "A2", minutes: 20, art: { emoji: "🍑", from: "#6b2140", to: "#f2a3b8" }, status: "coming-soon" },
    { id: "anansi", title: "Anansi the Spider", genre: "myths", origin: "world", region: "West Africa · Ghana", level: "A2", minutes: 20, art: { emoji: "🕷️", from: "#3a2412", to: "#d08a3e" }, status: "coming-soon" },
  ];

  /* Called by each full story file. */
  NQ.registerStory = function (story) {
    NQ.stories[story.id] = story;
    const card = {
      id: story.id,
      title: story.title,
      genre: story.genre,
      origin: story.origin,
      region: story.region,
      level: story.level,
      minutes: story.minutes,
      cover: story.cover,
      status: "playable",
    };
    const i = NQ.CATALOG.findIndex((c) => c.id === story.id);
    if (i >= 0) NQ.CATALOG[i] = card;
    else NQ.CATALOG.unshift(card);
  };
})();
