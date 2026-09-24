# Narrative Quest — adding a new story

The game engine (`js/engine.js`) contains no story content. Every story lives in `stories/`.

## Turn a "Coming soon" card into a playable story

1. Copy `stories/putri-serindang-bulan.js` to, for example, `stories/malin-kundang.js`.
2. Change `id` so it matches the catalog id in `stories/library.js` (for example `"malin-kundang"`).
   The card then switches from COMING SOON to PLAY automatically.
3. Fill in the story data: `pages` (4–6 pages with `text`, `vocab` and a `scene`), `vocabulary`,
   `characters`, `traitWords`, `structure`, `mainConflict`, `sequence`, `grammarExamples`, `pastVerbs`,
   plus the question banks `challenges.word`, `challenges.structure`, `challenges.character`,
   `challenges.grammar` and `final`.
4. Add one line to `index.html`, under the other story scripts:
   `<script src="stories/malin-kundang.js"></script>`

## Adding a completely new story

Use the same steps, then set `genre` (`legends`, `fables`, `fairy`, `myths`) and `origin`
(`indonesia` or `world`). A story that is not listed in `library.js` is added to the library automatically.

## Pictures

- Original game art: `img/` (portals, gems, badges, Putri Serindang Bulan characters).
- Story art from the second asset sheet: `img/covers/` (16:10 card covers, plus `-portrait` versions for question pictures),
  `img/characters/`, `img/backgrounds/`, `img/icons/`.
- Story-specific art cut from the master sheets in `img/source-assets/`: `img/stories/<story-id>/`
  (characters, objects, scenes and covers). A page scene can use `{ art: "…", fit: "contain" }` so a wide
  illustration is shown whole, with a soft blurred copy filling the frame. Never point the game at a master sheet.

## Check a story before playing

Run `node tools/validate.js` (or `node tools/validate.js my-story-id`) in this folder.
It checks page length, vocabulary highlighting, task counts, answer indexes, sort/order/fix data and every image path.

## Question types

| type    | what students do                                    | key fields                                   |
|---------|-----------------------------------------------------|----------------------------------------------|
| `mcq`   | choose one answer (text, pictures, or structure cards) | `options`, `answer`, `layout:"portraits"`, `structureOptions:true` |
| `multi` | choose TWO                                          | `options`, `answer:[i,j]`, `pick:2`           |
| `sort`  | drag or tap cards into boxes                        | `bins`, `cards[{text,bin}]`, `capacity:1`, `layout:"match"/"change"` |
| `order` | put events or words in order                        | `items` (in the correct order), `extras` (distractor words), `inline:true` for sentences |
| `fix`   | tap the wrong word, then choose the correct form     | `sentence`, `wrong` (word index), `options`, `answer` |
| `verbs` | type the past forms                                  | `verbs[{base,past}]`                          |

Every task can also have `skill`, `quote`, `image`, `hint`, `explain`, `ref` (the story page shown
in the hint) and `feedback` (a message for a particular wrong option).
