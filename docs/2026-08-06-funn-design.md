# funn — design document

**Written:** 2026-08-06 · **Presentation:** Friday 2026-08-14, after lunch
**Team:** Kristian ([@CozREV](https://github.com/CozREV)), Rune Smedhaugen ([@RuneSmedhaugen](https://github.com/RuneSmedhaugen)), Kasper Haugestøl ([@shift-primal](https://github.com/shift-primal)), Malin Fossum ([@malinfossum](https://github.com/malinfossum)), and one member to be added.

A team project at GET Academy: build our own finn.no. This document is what we agreed on, so nobody has to guess mid-week.

---

## 1. Why the scope is small

The assignment spans two workshop days plus the daily project slot next week:

| When | What | Hours |
|---|---|---|
| Thu 6 Aug – Fri 7 Aug | Workshop days | ~2 full days |
| Mon 10 – Thu 13 Aug | Project slot 12.15–15.15 | 12 |
| Fri 14 Aug | Morning, then presentation | ~3 |

That is roughly 20–25 hours of team time, running alongside the first week of the backend course. finn.no has listings, search, maps, messaging, bidding, payment, sign-in and image upload. We have room for four things.

Everything below follows from that number.

## 2. Scope

**In scope — this is the presentation:**

1. See all listings in a list
2. Open one listing and see its details
3. Post a new listing through a form
4. Search and filter by title or category

**Possible, only if time is left over:** image by URL, sorting by price, "my listings", favourites.

**Explicitly out of scope:** sign-in, messaging, bidding, payment, maps, image upload.

The out-of-scope list is the important one. It is what stops scope creep on Wednesday, when everything feels possible because the skeleton already works.

**One category only:** used goods. One user journey: post → find → view.

## 3. Architecture

Vanilla JavaScript in an MVC structure. No build step and no dependencies, so all five of us can run it with one command and nobody loses an afternoon to tooling.

| Layer | Responsibility |
|---|---|
| **Model** | All state and data. No DOM, no timers. Announces changes through `subscribe`/`notify`. |
| **View** | Renders HTML from state and forwards user actions. Changes no state. |
| **Controller** | Behaviour and event handling. Wires model and view together. |

**Data flow, one direction:**

```
user action
  -> data-action attribute in a screen file
  -> bindActions in view.js
  -> handler in controller.js
  -> one call into model.js
  -> model updates state, calls notify()
  -> view.render draws the new viewState
```

Two decisions make this work with five people:

**The view never calculates anything.** The model hands it a finished `viewState` with the filtered listings, the selected listing and the category list already worked out. Nobody has to duplicate filter logic in a screen file.

**The view layer is split by screen.** `view.js` is only a router that picks a screen based on `viewState.screen`. Each screen lives in its own file under `src/js/screens/` and returns HTML as a string. Two people can build two screens at the same time without touching the same file.

## 4. Data model

One listing. This is the contract all four features share — change it only by agreement.

```js
{
  id: "a1",
  title: "Brukt terrengsykkel",
  price: 3500,
  category: "Sport og friluft",
  description: "Lite brukt, ny kjede.",
  location: "Lillehammer",
  imageUrl: "",              // empty = placeholder, no upload in the MVP
  createdAt: "2026-08-03"
}
```

The `name` attributes in the form must match these field names — the controller builds the object straight from `FormData`.

**Storage:** `localStorage` under the key `funn:listings`, seeded from `src/js/seed.js` on first load so the demo is never empty. A corrupt or blocked `localStorage` falls back to the seed rather than crashing.

**Navigation:** the model holds `screen` (`"list"` | `"detail"` | `"new"`) and `selectedId`. No router and no library — the view renders whatever the model says. Ten lines of code.

## 5. Files and maintainers

```
src/
  index.html          app shell, header, <main id="main">
  style.css           project styles, mobile-first
  js/
    app.js            wiring
    model.js          state, storage, filtering
    view.js           screen router, bindActions
    controller.js     handlers
    format.js         escapeHtml, formatPrice
    seed.js           starting listings
    screens/
      listScreen.js
      detailScreen.js
      newListingScreen.js
docs/
  2026-08-06-funn-design.md
```

| Area | Maintainer |
|---|---|
| Model and storage | *assigned at kickoff* |
| List screen | *assigned at kickoff* |
| Detail screen | *assigned at kickoff* |
| New listing form | *assigned at kickoff* |
| Search and filter | *pair* |
| App shell, styling, docs | *assigned at kickoff* |

A maintainer is a first responder, not an owner. Everyone has write access to everything; the split exists so five people do not edit the same file at the same time. Anyone may work anywhere — tell the maintainer first.

Search and filter is deliberately built by a pair, because it touches both the model and a screen. That gives at least two people who understand both layers.

## 6. Conventions

**Language.** All code is English: function names, variables, data fields, file names, CSS classes, `data-action` names and commit messages. Norwegian appears only inside quotes, as text shown to the user. The rule to remember: *if it is not in quotes, it is English.*

**Security.** Anything a user typed goes through `escapeHtml` before it reaches `innerHTML`. A listing title containing `<script>` must not be able to run code.

**CSS.** Mobile-first. Base styles target the smallest screen, and we layer up with `min-width`. Breakpoints: `768px` tablet, `1024px` desktop. Never `max-width`.

**Git.** One branch and one pull request per card on the board. Someone else on the team reviews before merge.

```
git switch -c list-screen
git push -u origin list-screen
```

## 7. Board and progress

Trello. Columns are workflow states only; category goes on labels.

```
Columns:  Backlog -> To do -> In progress -> Review -> Done
Labels:   Model · View · Controller · Skeleton · Docs
```

Cards are written as user stories: *"As a user I want to search by title, so that I find what I am looking for."* Every card has one name on it. Nobody works on anything that is not on the board — the board is the progress overview the assignment asks for.

**Definition of Done.** A card is Done when:

- the code is merged to `main`
- the feature works when the app is running locally
- someone else on the team has seen it run

## 8. Plan, day by day

**Fri 7 Aug — everyone together.** All five clone the repo and get it running. Read the code and answer four questions: do you understand what your own file does; can you follow a click from the screen through `bindActions` to the model; is anything in the wrong place; is anything missing for your part? Assign maintainers, lock the scope, fill the board.

**Mon 10 Aug.** Each maintainer builds out their screen. The app must still run at the end of the day.

**Tue 11 Aug.** Search and filter as a pair. First styling pass.

**Wed 12 Aug.** Integration and bug fixing. **Feature freeze at the end of the day** — anything not merged by then is cut, not carried.

**Thu 13 Aug.** Polish, README, and a full run-through of the demo. Decide who says what.

**Fri 14 Aug.** Dry run in the morning. Present after lunch.

The feature freeze is the part that usually gets skipped and usually causes the problem. A demo that breaks during the presentation costs more than a fourth feature is worth.

## 9. Risks

**Four finished parts that do not fit together.** Handled by building the walking skeleton first: the app runs end to end from day one, and each person fills in their screen without ever breaking it.

**Someone is away or falls behind.** Because the skeleton already renders every screen, a missing feature degrades to a plain screen rather than a broken app. There is always something to present.

**Uncertainty about the stack.** The model layer is our database. `model.js` plus `localStorage` is the data layer, and there is no backend and no SQL in this project. If anyone is planning against a different picture, resolve it at the kickoff, not on Wednesday.

**Full redraw on every change.** The whole screen re-renders whenever state changes, which is simple to reason about but drops focus from input fields. `view.js` restores focus and caret position after each render. Do not remove that without testing the search field.
