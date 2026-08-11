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
};

export function createView(rootEl) {
	const output = rootEl.querySelector("#main");
	if (!output) throw new Error('Missing <main id="main"> inside #app');

	function render(viewState) {
		const draw = screens[viewState.screen] ?? renderListScreen;
		const focus = readFocus();
		output.innerHTML = draw(viewState);
		restoreFocus(focus);
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

			if (
				element.dataset.action === "setMinPrice" ||
				element.dataset.action === "setMaxPrice"
			) {
				return;
			}

			handlers[element.dataset.action]?.(event, element);
		});

		rootEl.addEventListener("keydown", (event) => {
			if (event.key !== "Enter") return;

			const element = event.target.closest("[data-action]");
			if (!element) return;

			if (
				element.dataset.action === "setMinPrice" ||
				element.dataset.action === "setMaxPrice"
			) {
				handlers[element.dataset.action]?.(event, element);
			}
		});

		rootEl.addEventListener("submit", (event) => {
			const form = event.target.closest("form[data-action]");
			if (!form) return;
			event.preventDefault();
			handlers[form.dataset.action]?.(event, form);
		});

		
	}

	return { render, bindActions };
}
