/* ======================================================================
   src/js/view.js — VIEW
   Renders HTML from state and forwards user actions. Never changes state
   itself, and has no timers.

   view.js is only a router: it picks the right screen based on
   viewState.screen. The HTML itself lives in src/js/screens/, one file per
   screen, so several people can work at once without touching the same
   file.

   Interactive elements are marked with data-action in the screen files,
   and bindActions routes them to the controller by name.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { renderDetailScreen } from "./screens/detailScreen.js";
import { renderListScreen } from "./screens/listScreen.js";
import { renderNewListingScreen } from "./screens/newListingScreen.js";

const screens = {
	list: renderListScreen,
	detail: renderDetailScreen,
	new: renderNewListingScreen,
	edit: renderNewListingScreen,
};

export function createView(rootEl) {
	const output = rootEl.querySelector("#main");
	if (!output) throw new Error('Missing <main id="main"> inside #app');

	const status = rootEl.querySelector("#status");

	// null until the first render, so the first screen does not steal focus
	// from wherever the user actually is when the page loads.
	let lastScreen = null;

	function render(viewState) {
		const draw = screens[viewState.screen] ?? renderListScreen;
		const screenChanged =
			lastScreen !== null && lastScreen !== viewState.screen;
		const focus = readFocus();

		output.innerHTML = draw(viewState);
		lastScreen = viewState.screen;
		announce(viewState);

		// On a screen change the element that had focus no longer exists, so
		// restoring it is meaningless — move to the new heading instead.
		if (screenChanged) {
			focusHeading();
			return;
		}
		restoreFocus(focus);
	}

	/* Sends focus to the heading of the screen we just drew. A screen reader
	   then reads out where it landed, and a keyboard user starts at the top
	   of the new content rather than back at the top of the document. */
	function focusHeading() {
		const heading = output.querySelector("h1");
		if (!heading) return;
		heading.setAttribute("tabindex", "-1");
		heading.focus();
	}

	/* The visible result count is inside #main and is destroyed on every
	   render, which stops it working as a live region. #status lives outside
	   #main and only ever has its text replaced, so the announcement fires. */
	function announce(viewState) {
		if (!status) return;
		status.textContent =
			viewState.screen === "list"
				? `Viser ${viewState.visibleListings.length} av ${viewState.totalCount} annonser`
				: "";
	}

	/* The whole screen is redrawn on every change. Without this, the search
	   field would lose focus on every keystroke. */
	function readFocus() {
		const active = document.activeElement;
		if (!active || !output.contains(active) || !active.dataset.action)
			return null;
		let caret = null;
		try {
			caret = active.selectionStart;
		} catch {
			// Some input types do not support selectionStart. Skip it.
		}
		return { action: active.dataset.action, caret };
	}

	function restoreFocus(focus) {
		if (!focus) return;
		const field = output.querySelector(`[data-action="${focus.action}"]`);
		if (!field) return;
		field.focus();
		if (focus.caret === null) return;
		try {
			field.setSelectionRange(focus.caret, focus.caret);
		} catch {
			// See above.
		}
	}

	/* Three delegated listeners on the root.
	   handlers = { actionName: (event, element) => {} }
	   Because they sit on #app and not on the content, they survive the
	   content being replaced on every render. */
function bindActions(handlers) {
	rootEl.addEventListener("click", (event) => {
		const element = event.target.closest("[data-action]");
		if (!element) return;

		// Form fields are handled by the input listener below.
		if (element.matches("input, select, textarea, form")) return;

		if (element.tagName === "A") event.preventDefault();

		handlers[element.dataset.action]?.(event, element);
	});

	rootEl.addEventListener("input", (event) => {
		const element = event.target.closest("[data-action]");
		if (!element || !element.matches("input, select, textarea")) return;

		handlers[element.dataset.action]?.(event, element);
	});

	rootEl.addEventListener("submit", (event) => {
		const form = event.target.closest("form[data-action]");
		if (!form) return;

		event.preventDefault();
		handlers[form.dataset.action]?.(event, form);
	});
}

return { render, bindActions };
};
