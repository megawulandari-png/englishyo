/* ENGLISH YO! deep links from the homepage "Featured Activities".
   Usage: page.html?open=<item>. It only clicks the page's own existing
   buttons after they are rendered, so no content or logic is changed. */
(function () {
  var open = new URLSearchParams(location.search).get("open");
  if (!open) return;
  function byText(selector, text) {
    var list = document.querySelectorAll(selector);
    for (var i = 0; i < list.length; i++) if ((list[i].textContent || "").indexOf(text) !== -1) return list[i];
    return null;
  }
  var ROUTES = {
    // Reading YO!: A2 level, then the B.J. Habibie story
    "bj-habibie": function () {
      var level = document.querySelector('.level-card[data-level="A2"]');
      if (!level) return false;
      level.click();
      var card = byText("#story-grid > *, .story-grid > *", "Habibie");
      var btn = card && card.querySelector(".story-link");
      if (!btn) { var links = document.querySelectorAll(".story-link"); for (var i = 0; i < links.length; i++) { var p = links[i].parentElement; if (p && /Habibie/.test(p.textContent)) { btn = links[i]; break; } } }
      if (!btn) return false;
      btn.click(); return true;
    },
    // Listening YO!: episode "Who Are You Talking to Online?"
    "screen-03": function () {
      var ep = document.querySelector('.episode-card[data-series="screen"][data-index="2"]') || byText(".episode-card", "Who Are You Talking");
      if (!ep) return false;
      ep.click(); return true;
    },
    // Learning YO!: Prepositions lesson
    "prepositions": function () {
      var t = document.querySelector('.topic-card[data-topic="prepositions"]');
      if (!t) return false;
      t.click(); return true;
    }
  };
  var route = ROUTES[open];
  if (!route) return;
  var tries = 0;
  function attempt() {
    if (route()) return;
    if (++tries < 20) setTimeout(attempt, 150);
  }
  // wait until every page script (including DOMContentLoaded handlers) has run
  if (document.readyState === "complete") setTimeout(attempt, 50);
  else window.addEventListener("load", function () { setTimeout(attempt, 50); });
})();
