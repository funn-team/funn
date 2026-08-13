# funn

A small marketplace app: post an item for sale, browse the listings, and open one for details.

Built by [funn-team](https://github.com/funn-team), five developers-in-training on GET Prepared.

## Features

- Browse all listings, with search by title and filter by category — each category shows how many listings it holds
- Narrow the list to a price range
- Sort by price or date, ascending or descending
- Open a listing for full details and seller contact information
- Post a new listing, with validation on every field
- Edit or delete a listing
- Mark a listing as sold; it stays visible with a *Solgt* badge rather than disappearing
- Mark listings as favourites and filter down to them — favourites survive a refresh
- Every screen has its own address, so a listing can be refreshed, bookmarked or shared, and the browser's back button works

All five filters compose: a search, a category, a price range, a sort order and the favourites toggle apply at the same time.

Everything is kept in `localStorage`. There is no sign-in, no messaging, no bidding and no payment; those were deliberately left out to keep the scope landable.

## Stack

Vanilla JavaScript with an MVC structure. No build step, no dependencies. Listings are stored in `localStorage`, seeded from `src/js/seed.js` on first load.

## Running it

The app uses ES modules, so it needs a local server — opening `index.html` straight from the file system will not work.

Pick whichever you have:

- **VS Code** — install the Live Server extension, then right-click `src/index.html` and choose *Open with Live Server*
- **Node** — `npx --yes serve src`
- **Python** — `python -m http.server` from inside the `src` folder

## Structure

| Layer | File | Responsibility |
|---|---|---|
| Model | `src/js/model.js` | All state and data. No DOM, no timers. Announces changes through `subscribe`/`notify`. |
| Model | `src/js/seed.js` | Starting listings, so the app is never empty. |
| View | `src/js/view.js` | Routes to the right screen and forwards user actions. Renders no HTML itself. |
| View | `src/js/screens/*.js` | One file per screen. Each returns HTML as a string. |
| Controller | `src/js/controller.js` | Behaviour and event handling. Translates one user action into one call into the model. |

The view never calculates anything. The model hands it a finished `viewState` containing the listings already filtered and sorted, the selected listing, the category and condition lists, the favourite ids and any form errors.

Interactive elements are marked with `data-action` in the screen files. `bindActions` in `view.js` routes them to the controller by name.

The whole screen is redrawn on every change, which has two consequences worth knowing before you touch `view.js`:

- Focus would be lost on every keystroke, so `render` saves and restores the focused field and its caret position. On a screen change it moves focus to that screen's `<h1>` instead.
- A live region inside `#main` would be destroyed at the same moment its text changed, and never announce. `#status` therefore lives outside `#main` in `index.html`, and `view.js` writes into it.

## Routing

The URL decides which screen is shown. `controller.js` listens for `hashchange`, reads the hash and calls the matching model action.

| Hash | Screen |
|---|---|
| `#/` | All listings |
| `#/annonse/<id>` | One listing |
| `#/ny` | New listing form |
| `#/rediger/<id>` | Edit an existing listing |

An unknown route falls back to the list, and an id that matches no listing renders "Fant ikke annonsen" rather than an empty screen.

This is the third thing worth knowing before you add a handler: **a handler that changes screen must write a hash, never call `model.showDetail`, `model.showList`, `model.showNew` or `model.showEdit` directly.** Calling the model straight would change the screen while the address bar kept pointing at the old one, and nothing would warn you — the app would look right until someone refreshed. Where the model moves screen by itself, after saving or deleting, the controller rewrites the address with `history.replaceState` so the form or the deleted listing does not stay in the back history.

## Team

The repository belongs to the [funn-team](https://github.com/funn-team) organization. Every member is an owner with equal access and an equal say.

- Kristian ([@CozREV](https://github.com/CozREV))
- Rune Smedhaugen ([@RuneSmedhaugen](https://github.com/RuneSmedhaugen))
- Kasper Haugestøl ([@shift-primal](https://github.com/shift-primal))
- Malin Fossum ([@malinfossum](https://github.com/malinfossum))
- Rolf Olsen ([@Wasteoidz](https://github.com/Wasteoidz))

## Who built what

The work was split into vertical slices rather than by layer, so everyone wrote model, view and controller code for their own feature.

| Feature | Owner | Mainly touches |
|---|---|---|
| Sorting by price and date | Rolf Olsen | `model.js`, `screens/listScreen.js`, `controller.js` |
| Favourites | Rune Smedhaugen | `model.js`, `screens/listScreen.js`, `screens/detailScreen.js` |
| Price range filter and category counts | Rune Smedhaugen | `model.js`, `screens/listScreen.js`, `style.css` |
| Edit and delete a listing | Kristian | `model.js`, `screens/newListingScreen.js`, `screens/detailScreen.js` |
| Sold status | Kristian | `model.js`, `screens/listScreen.js`, `screens/detailScreen.js` |
| Form validation | Kasper Haugestøl | `model.js`, `screens/newListingScreen.js` |
| App shell, accessibility, docs | Malin Fossum | `index.html`, `view.js`, `style.css`, `seed.js`, `README.md` |
| Hash routing | Malin Fossum | `controller.js`, `index.html` |
| Seed data and date formatting | Malin Fossum | `seed.js`, `format.js` |

Search and category filter were built as part of the walking skeleton before the slices were handed out.

A REST API on Neon Postgres, with Express and Vite, is built and working on a branch. It is deliberately not merged: it arrived too close to the deadline to verify properly, and a demo that runs beats a demo with a backend. It is the first thing to land next.

`model.js` and `controller.js` are shared by every slice. Merge to `main` the same day you finish a layer, and pull `main` before starting the next one — that is what keeps the conflicts small.

## Conventions

- **All code is English** — function names, variables, data fields, file names, CSS classes, `data-action` names and commit messages. Norwegian appears only inside quotes, as text shown to the user. If it is not in quotes, it is English.
- Anything a user typed goes through `escapeHtml` before it reaches `innerHTML`, and image URLs go through `safeImageUrl`.
- A listing nests contact details under `seller` and the place under `location`, but `FormData` is flat — the form uses `sellerName`, `sellerPhone`, `sellerEmail`, `city` and `zip`, and `model.addListing` assembles both objects. Rename a field in one place and you must rename it in the other; nothing will warn you.
- Seed sellers must never look like real people. Phone numbers run `+47 400 00 00X` and emails use `example.com`, which RFC 2606 reserves for documentation. The repository is public.
- Accessibility is part of done, not a pass at the end: every screen has one `<h1>`, every field has a label, every icon button has an `aria-label`, and `#status` in `index.html` announces result counts.
- CSS is mobile-first. Breakpoints: `768px` for tablet, `1024px` for desktop.
- One branch and one pull request per card on the board.

The design document is in [docs/2026-08-06-funn-design.md](docs/2026-08-06-funn-design.md).

## License

MIT
