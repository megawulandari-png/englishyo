/* ===== SEARCH INDEX ===== */
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

  // Play Games YO! - Games
  { title: "Emberfall", category: "Play Games YO!", description: "An English-learning adventure game about Kip the lantern sprite.", keywords: ["game", "emberfall", "adventure", "english learning", "platformer"], page: "games.html" },
  { title: "Word Tug of War", category: "Play Games YO!", description: "Build correct English sentences and pull your way to victory.", keywords: ["game", "word tug", "grammar", "sentence building", "tenses"], page: "games.html" },
  { title: "Detective Eyes", category: "Play Games YO!", description: "Investigate rumors, evaluate sources, and write evidence-based conclusions.", keywords: ["game", "detective", "critical thinking", "investigation", "reasoning", "reading"], page: "games.html" },
  { title: "Crossword Adventure", category: "Play Games YO!", description: "Solve English crossword puzzles from A1 to B2. Challenge yourself or play together in Class Mode!", keywords: ["game", "crossword", "vocabulary", "words", "clues", "class mode", "puzzle"], page: "games.html" },
  { title: "Sort It Out!", category: "Play Games YO!", description: "Learn the words. Sort the waste.", keywords: ["game", "sort it out", "waste", "recycling", "rubbish", "vocabulary", "listening", "bins", "environment"], page: "games.html" },

  // Featured Activities
  { title: "Word Match", category: "Play Games YO!", description: "Match words with pictures to build vocabulary.", keywords: ["game", "word match", "vocabulary", "words"], page: "games.html" },
  { title: "Tense Race", category: "Play Games YO!", description: "Choose the correct tense before time runs out.", keywords: ["game", "tense", "race", "grammar"], page: "games.html" },
  { title: "A Day in Yogyakarta", category: "Reading YO!", description: "Read and answer comprehension questions about a city adventure.", keywords: ["reading", "yogyakarta", "story", "comprehension"], page: "reading.html" },
  { title: "Listening Quest", category: "Listening YO!", description: "Listen carefully and complete the challenges.", keywords: ["listening", "quest", "audio", "comprehension"], page: "listening.html" },

  // Main sections
  { title: "Play Games YO!", category: "Main", description: "Play interactive games to practice English.", keywords: ["games", "play", "interactive", "learn"], page: "games.html" },
  { title: "Learning YO!", category: "Main", description: "Interactive lessons covering grammar, vocabulary, and text types.", keywords: ["learning", "lessons", "grammar", "lessons", "study"], page: "learning.html" },
  { title: "Reading YO!", category: "Main", description: "Read stories and improve your reading comprehension.", keywords: ["reading", "stories", "comprehension", "texts"], page: "reading.html" },
  { title: "Listening YO!", category: "Main", description: "Listen to English and practice comprehension.", keywords: ["listening", "audio", "comprehension"], page: "listening.html" }
];

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
