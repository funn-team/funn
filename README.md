# funn

A small marketplace app: post an item for sale, browse the listings, and open one for details. Team project at GET Academy.

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

The view never calculates anything. The model hands it a finished `viewState` containing the filtered listings, the selected listing and the category list.

Interactive elements are marked with `data-action` in the screen files. `bindActions` in `view.js` routes them to the controller by name.

## Team

Built by five people at GET Academy. Everyone has write access and an equal say in the project.

- Kristian ([@CozREV](https://github.com/CozREV))
- Rune Smedhaugen ([@RuneSmedhaugen](https://github.com/RuneSmedhaugen))
- Kasper Haugestøl ([@shift-primal](https://github.com/shift-primal))
- Malin Fossum ([@malinfossum](https://github.com/malinfossum))
- *(fifth member to be added)*

## Who maintains what

Each area has a first responder. This is about avoiding merge conflicts and knowing who to ask — not about permission. Anyone may work anywhere; just tell the maintainer first.

| Area | Files | Maintainer |
|---|---|---|
| Model and storage | `model.js`, `seed.js` | *assigned at kickoff* |
| List screen | `screens/listScreen.js` | *assigned at kickoff* |
| Detail screen | `screens/detailScreen.js` | *assigned at kickoff* |
| New listing form | `screens/newListingScreen.js` | *assigned at kickoff* |
| Search and filter | `model.js` + `screens/listScreen.js` | *pair, assigned at kickoff* |
| App shell, styling, docs | `index.html`, `view.js`, `controller.js`, `style.css` | *assigned at kickoff* |

## Conventions

- **All code is English** — function names, variables, data fields, file names, CSS classes, `data-action` names and commit messages. Norwegian appears only inside quotes, as text shown to the user. If it is not in quotes, it is English.
- Anything a user typed goes through `escapeHtml` before it reaches `innerHTML`.
- CSS is mobile-first. Breakpoints: `768px` for tablet, `1024px` for desktop.
- One branch and one pull request per card on the board.

The design document is in [docs/2026-08-06-funn-design.md](docs/2026-08-06-funn-design.md).

## License

MIT
