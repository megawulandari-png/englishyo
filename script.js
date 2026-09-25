/* ===== SEARCH INDEX =====
   This is the site's single, hand-maintained search index. There is no
   build step and no server, so nothing keeps this in sync automatically --
   whenever a new game, lesson, story, or listening episode is added to the
   site, add a matching entry below too, or it will not show up in search.

   Tip for games specifically: each game's <article class="game-card"> in
   games.html already carries a data-title and data-category attribute
   (used for the in-page game filter) -- reuse that same text here so the
   two stay consistent. A safety check right below this array runs
   automatically on games.html and logs a console.warn() for any game card
   that isn't matched in this list yet, so a forgotten game is easy to spot:
   open games.html, open the browser console (F12 or Cmd+Opt+J), reload,
   and look for a warning starting with "[ENGLISH YO! search]".
*/
const searchIndex = [
  // Learning YO! - Pronouns
  { title: "Subject & Object Pronouns", category: "Learning YO!", description: "Understand the difference between subject and object pronouns.", keywords: ["pronouns", "subject", "object", "grammar"], page: "learning.html", lessonId: "pronouns" },

  // Learning YO! - Prepositions
  { title: "Prepositions", category: "Learning YO!", description: "Master prepositions of place, time, and direction.", keywords: ["prepositions", "place", "time", "direction"], page: "learning.html", lessonId: "prepositions" },

  // Learning YO! - Descriptive Text
  { title: "Descriptive Text", category: "Learning YO!", description: "Learn to describe people, places, and things in detail.", keywords: ["descriptive", "text", "description", "detail"], page: "learning.html", lessonId: "descriptive" },

  // Learning YO! - Narrative Text
  { title: "Narrative Text", category: "Learning YO!", description: "Tell stories with a clear beginning, middle, and end.", keywords: ["narrative", "text", "story", "storytelling", "events"], page: "learning.html", lessonId: "narrative" },

  // Learning YO! - Recount Text
  { title: "Recount Text", category: "Learning YO!", description: "Retell past events and experiences clearly.", keywords: ["recount", "text", "past", "events", "experience"], page: "learning.html", lessonId: "recount" },

  // Learning YO! - Procedure Text
  { title: "Procedure Text", category: "Learning YO!", description: "Learn to write step-by-step instructions and procedures.", keywords: ["procedure", "text", "instructions", "steps", "how-to"], page: "learning.html", lessonId: "procedure" },

  // Learning YO! - Report Text
  { title: "Report Text", category: "Learning YO!", description: "Master the structure of factual reports and presentations.", keywords: ["report", "text", "fact", "informative", "structure"], page: "learning.html", lessonId: "report" },

  // Learning YO! - Simple Present Tense
  { title: "Simple Present Tense", category: "Learning YO!", description: "Use the simple present tense for habits, facts, and general truths.", keywords: ["simple", "present", "tense", "grammar", "habits"], page: "learning.html", lessonId: "simple-present" },

  // Learning YO! - Simple Past Tense
  { title: "Simple Past Tense", category: "Learning YO!", description: "Talk about completed actions and events in the past.", keywords: ["simple", "past", "tense", "grammar", "past events"], page: "learning.html", lessonId: "simple-past" },

  // Learning YO! - Passive Voice
  { title: "Passive Voice", category: "Learning YO!", description: "Learn when and how to use the passive voice effectively.", keywords: ["passive", "voice", "grammar", "sentence structure"], page: "learning.html", lessonId: "passive" },

  // Learning YO! - Vocabulary
  { title: "Vocabulary", category: "Learning YO!", description: "Expand your vocabulary with new words and phrases.", keywords: ["vocabulary", "words", "phrases", "expressions"], page: "learning.html", lessonId: "vocabulary" },

  // Play Games YO! - Games (same order as the cards in games.html)
  { title: "Word Tug of War", category: "Play Games YO!", description: "Build correct English sentences and pull your way to victory.", keywords: ["game", "word tug", "grammar", "sentence building", "tenses", "past tense", "simple past", "tug of war"], page: "games.html" },
  { title: "Emberfall", category: "Play Games YO!", description: "An English-learning adventure game about Kip the lantern sprite.", keywords: ["game", "emberfall", "adventure", "english learning", "platformer", "present tense", "simple present"], page: "games.html" },
  { title: "Detective Eyes", category: "Play Games YO!", description: "Investigate rumors, evaluate sources, and write evidence-based conclusions.", keywords: ["game", "detective", "critical thinking", "investigation", "reasoning", "reading"], page: "games.html" },
  { title: "Scrabble YO!", category: "Play Games YO!", description: "Build real English words on the board and learn what every word means.", keywords: ["game", "scrabble", "vocabulary", "word building", "spelling", "board game", "multiplayer"], page: "games.html" },
  { title: "Crossword Adventure", category: "Play Games YO!", description: "Solve English crossword puzzles from A1 to B2. Challenge yourself or play together in Class Mode!", keywords: ["game", "crossword", "vocabulary", "words", "clues", "class mode", "puzzle"], page: "games.html" },
  { title: "Sort It Out!", category: "Play Games YO!", description: "Learn the words. Sort the waste.", keywords: ["game", "sort it out", "waste", "trash", "rubbish", "recycling", "vocabulary", "listening", "bins", "environment"], page: "games.html" },
  { title: "Telling the Time!", category: "Play Games YO!", description: "Move the hands, listen, choose and match.", keywords: ["game", "telling the time", "clock", "time", "numbers", "speaking", "listening"], page: "games.html" },
  { title: "Pattern Quest", category: "Play Games YO!", description: "Read the picture pattern, choose what comes next, and collect English words.", keywords: ["game", "pattern quest", "patterns", "logic", "vocabulary", "listening"], page: "games.html" },
  { title: "Who's In My Family?", category: "Play Games YO!", description: "Solve family logic missions using the family tree, his, her, their and possessive \u2019s.", keywords: ["game", "family", "possessive", "possessives", "grammar", "vocabulary", "logic", "critical thinking"], page: "games.html" },
  { title: "Animal Kingdom", category: "Play Games YO!", description: "Learn the field guide, then match, drag, listen and classify: vertebrates vs invertebrates.", keywords: ["game", "animal", "animals", "vertebrates", "invertebrates", "science", "vocabulary", "listening", "classification"], page: "games.html" },
  { title: "Narrative Quest", category: "Play Games YO!", description: "Enter a story world, read an illustrated folktale, then hunt words and master the simple past.", keywords: ["game", "narrative", "narrative text", "story", "folktale", "reading", "simple past", "past tense", "critical thinking"], page: "games.html" },

  // Reading YO! - Stories
  { title: "Yogyakarta", category: "Reading YO!", description: "A simple text about Yogyakarta, its places, culture, food, and people.", keywords: ["reading", "yogyakarta", "jogja", "story", "comprehension"], page: "reading.html" },
  { title: "R.A. Kartini", category: "Reading YO!", description: "A story about R.A. Kartini.", keywords: ["reading", "kartini", "story", "comprehension"], page: "reading.html" },
  { title: "Malin Kundang", category: "Reading YO!", description: "The Indonesian folktale of Malin Kundang.", keywords: ["reading", "malin kundang", "folktale", "story", "comprehension"], page: "reading.html" },
  { title: "Putri Serindang Bulan", category: "Reading YO!", description: "The Indonesian folktale of Putri Serindang Bulan.", keywords: ["reading", "putri serindang bulan", "folktale", "story", "comprehension"], page: "reading.html" },
  { title: "My Cat Miko", category: "Reading YO!", description: "A short story about a cat named Miko.", keywords: ["reading", "my cat miko", "cat", "story", "comprehension"], page: "reading.html" },
  { title: "B.J. Habibie", category: "Reading YO!", description: "A story about B.J. Habibie.", keywords: ["reading", "habibie", "story", "comprehension"], page: "reading.html" },

  // Listening YO! - Episodes
  { title: "Managing Money and Saving", category: "Listening YO!", description: "A friendly look at everyday spending and where our money really goes.", keywords: ["listening", "money", "saving", "budgeting", "money matters"], page: "listening.html" },
  { title: "Need It or Want It?", category: "Listening YO!", description: "Learning the difference between things we need and things we want.", keywords: ["listening", "money", "need", "want", "money matters"], page: "listening.html" },
  { title: "How Was Money Created", category: "Listening YO!", description: "A small change, a big story of money.", keywords: ["listening", "money", "history", "money matters"], page: "listening.html" },
  { title: "The Good, the Bad, and the Roblox", category: "Listening YO!", description: "Exploring the fun side of gaming and the things to watch out for.", keywords: ["listening", "gaming", "games", "roblox", "behind the screen"], page: "listening.html" },
  { title: "When Gaming Becomes Too Much", category: "Listening YO!", description: "A conversation about balance and knowing when to take a break.", keywords: ["listening", "gaming", "screen time", "balance", "behind the screen"], page: "listening.html" },
  { title: "Who Are You Talking to Online?", category: "Listening YO!", description: "Thinking about online friends, strangers, and staying safe.", keywords: ["listening", "online safety", "internet", "behind the screen"], page: "listening.html" },
  { title: "Why Do I Feel So Worried?", category: "Listening YO!", description: "Understanding worry and where those nervous feelings come from.", keywords: ["listening", "feelings", "worry", "emotions", "mind matters"], page: "listening.html" },
  { title: "Before the Test: Why Am I So Nervous?", category: "Listening YO!", description: "A calm chat about test-day nerves and how to feel a little better.", keywords: ["listening", "test", "nerves", "anxiety", "mind matters"], page: "listening.html" },
  { title: "Take a Breath", category: "Listening YO!", description: "Simple breathing and calming ideas for busy, worried minds.", keywords: ["listening", "breathing", "calm", "mind matters"], page: "listening.html" },

  // Main sections
  { title: "Play Games YO!", category: "Main", description: "Play interactive games to practice English.", keywords: ["games", "play", "interactive", "learn"], page: "games.html" },
  { title: "Learning YO!", category: "Main", description: "Interactive lessons covering grammar, vocabulary, and text types.", keywords: ["learning", "lessons", "grammar", "lessons", "study"], page: "learning.html" },
  { title: "Reading YO!", category: "Main", description: "Read stories and improve your reading comprehension.", keywords: ["reading", "stories", "comprehension", "texts"], page: "reading.html" },
  { title: "Listening YO!", category: "Main", description: "Listen to English and practice comprehension.", keywords: ["listening", "audio", "comprehension"], page: "listening.html" }
];

/* ===== SEARCH INDEX MAINTENANCE CHECK =====
   Runs only on games.html (the only page with every game card already in
   its own DOM). Compares the real game cards against searchIndex above and
   warns in the console if any game is missing -- a lightweight safety net
   so a newly added game that was forgotten from the list above doesn't go
   unnoticed. Purely a console diagnostic: it never changes anything a
   visitor sees. */
(function checkSearchIndexCoversAllGames() {
  var cards = document.querySelectorAll(".game-card[data-game-id]");
  if (!cards.length) return; // not on games.html

  function normalize(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  var indexedTitles = searchIndex
    .filter(function (item) { return item.page === "games.html" && item.category === "Play Games YO!"; })
    .map(function (item) { return normalize(item.title); });

  var missing = [];
  cards.forEach(function (card) {
    var cardTitle = normalize(card.getAttribute("data-title"));
    if (!cardTitle) return;
    var found = indexedTitles.some(function (t) {
      return t === cardTitle || t.indexOf(cardTitle) !== -1 || cardTitle.indexOf(t) !== -1;
    });
    if (!found) missing.push(card.getAttribute("data-title"));
  });

  if (missing.length) {
    console.warn(
      "[ENGLISH YO! search] " + missing.length + " game(s) on this page aren't in searchIndex (script.js) and won't be findable from search: " +
      missing.join(", ") + ". Add a matching entry to searchIndex -- see the comment at the top of script.js."
    );
  }
})();

/* ===== SEARCH FUNCTION ===== */
function performSearch(query) {
  if (!query.trim()) {
    document.getElementById("search-results").innerHTML = "";
    return;
  }

  var queryLower = query.toLowerCase();
  var results = [];

  searchIndex.forEach(function(item) {
    var titleMatch = item.title.toLowerCase().includes(queryLower);
    var descMatch = item.description.toLowerCase().includes(queryLower);
    var keywordMatch = item.keywords.some(function(kw) {
      return kw.toLowerCase().includes(queryLower);
    });

    if (titleMatch || descMatch || keywordMatch) {
      results.push(item);
    }
  });

  displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
  var resultsContainer = document.getElementById("search-results");

  if (results.length === 0) {
    resultsContainer.innerHTML = '<div class="search-no-results">Oops! We couldn\'t find that. Try another word.</div>';
    return;
  }

  var html = "";
  results.forEach(function(result) {
    html += '<div class="search-result-item" data-page="' + result.page + '" data-lesson="' + (result.lessonId || "") + '">' +
      '<span class="search-result-category">' + result.category + '</span>' +
      '<h3 class="search-result-title">' + result.title + '</h3>' +
      '<p class="search-result-description">' + result.description + '</p>' +
      '</div>';
  });

  resultsContainer.innerHTML = html;

  // Add click handlers to results
  resultsContainer.querySelectorAll(".search-result-item").forEach(function(item) {
    item.addEventListener("click", function() {
      navigateToResult(this.dataset.page, this.dataset.lesson);
    });
  });
}

function navigateToResult(page, lessonId) {
  if (page === "learning.html" && lessonId) {
    // Navigate to learning page with lesson
    window.location.href = page + "#" + lessonId;
  } else {
    // Navigate to page
    window.location.href = page;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Mobile menu toggle ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var mainNav = document.getElementById("main-menu");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mainNav.classList.toggle("open", !isOpen);
    });

    // Close the menu after clicking a nav link (mobile UX)
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("open");
      });
    });

    // Close menu when clicking outside of it
    document.addEventListener("click", function (e) {
      var clickedInsideNav = mainNav.contains(e.target);
      var clickedToggle = menuToggle.contains(e.target);
      if (!clickedInsideNav && !clickedToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("open");
      }
    });
  }

  /* ---------- Search panel ---------- */
  var searchTrigger = document.querySelector("[data-search-trigger]");
  var searchPanel = document.querySelector("[data-search-panel]");
  var searchClose = document.querySelector("[data-search-close]");
  var searchInput = document.getElementById("site-search");

  function openSearch() {
    if (!searchPanel) return;
    searchPanel.hidden = false;
    if (searchInput) searchInput.focus();
    document.addEventListener("keydown", handleSearchKeydown);
  }

  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.hidden = true;
    searchInput.value = "";
    document.getElementById("search-results").innerHTML = "";
    document.removeEventListener("keydown", handleSearchKeydown);
    if (searchTrigger) searchTrigger.focus();
  }

  function handleSearchKeydown(e) {
    if (e.key === "Escape") closeSearch();
  }

  if (searchTrigger && searchPanel) {
    searchTrigger.addEventListener("click", openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener("click", closeSearch);
  }

  // Close search panel when clicking the dark overlay (outside the dialog)
  if (searchPanel) {
    searchPanel.addEventListener("click", function (e) {
      if (e.target === searchPanel) closeSearch();
    });
  }

  // Handle live search input
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      performSearch(this.value);
    });

    // Prevent form submission, just perform search
    var searchForm = searchInput.closest("form");
    if (searchForm) {
      searchForm.addEventListener("submit", function(e) {
        e.preventDefault();
      });
    }
  }
});
