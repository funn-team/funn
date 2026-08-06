# funn

A small marketplace app: list an item for sale, browse the listings, and open one for details. Team project at GET Academy.

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
| Model | `src/js/model.js` | All state and data. No DOM, no timers. Tells the view about changes through `subscribe`/`notify`. |
| Model | `src/js/seed.js` | Starting listings, so the app is never empty. |
| View | `src/js/view.js` | Routes to the right screen and forwards user actions. Renders nothing itself. |
| View | `src/js/screens/*.js` | One file per screen. Each returns HTML as a string. |
| Controller | `src/js/controller.js` | Behaviour and event handling. Translates a user action into one call into the model. |

The view never calculates anything. The model hands it a finished `viewState` with the filtered listings, the selected listing, and the category list already worked out.

Interactive elements are marked with `data-action` in the screen files. `bindActions` in `view.js` routes them to the controller by name.

## Ownership

| Area | Files | Owner |
|---|---|---|
| Model and storage | `model.js`, `seed.js` | Person B |
| Listing screen | `screens/listeSkjerm.js` | Person C |
| Detail screen | `screens/detaljSkjerm.js` | Person D |
| New listing form | `screens/nyAnnonseSkjerm.js` | Person E |
| Search and filter | `model.js` + `screens/listeSkjerm.js` | Person B and C |
| App shell, styling, docs | `index.html`, `view.js`, `controller.js`, `style.css` | Malin |

## Conventions

- Domain names are Norwegian (`annonse`, `tittel`, `pris`), structural names are English.
- Anything a user typed goes through `escapeHtml` before it reaches `innerHTML`.
- CSS is mobile-first. Breakpoints: `768px` for tablet, `1024px` for desktop.

## License

MIT
