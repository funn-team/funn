/* ======================================================================
   src/js/controller.js — CONTROLLER
   Connects model and view. All behaviour and all event handling lives
   here. No HTML, no state.

   New features are added as new handlers below. Keep each handler to a
   couple of lines — its job is to translate one user action into one call
   into the model.

   ROUTING. The URL is the single source of truth for which screen is
   shown. Handlers never call the model's screen actions directly: they
   write a hash, and the hashchange listener reads it back and tells the
   model. One direction only, so the address bar and the screen can never
   disagree, and the browser's back button works for free.

     #/                  all listings
     #/annonse/<id>      one listing
     #/ny                new listing form
     #/rediger/<id>      edit an existing listing

   location and history are browser APIs, which is why routing sits in the
   controller and not in the model.

   Maintainer: see README. Expect small, additive changes from everyone.
   ====================================================================== */

/* A hand-typed or truncated link can contain a broken percent-escape, and
   decodeURIComponent throws on those. An id that matches nothing is
   harmless — the detail screen already says "Fant ikke annonsen" — so fall
   back to the raw text rather than letting the router crash. */
function decodeSegment(value) {
	if (!value) return "";
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function parseHash(hash) {
	const [name, value] = hash.replace(/^#\/?/, "").split("/");

	switch (name) {
		case "annonse":
			return { screen: "detail", id: decodeSegment(value) };
		case "ny":
			return { screen: "new" };
		case "rediger":
			return { screen: "edit", id: decodeSegment(value) };
		default:
			return { screen: "list" };
	}
}

function listingHash(prefix, id) {
	return `#/${prefix}/${encodeURIComponent(id)}`;
}

export function createController({ model, view }) {
	/* The user asked to go somewhere. Changing the hash fires hashchange,
	   which is what actually draws the screen, and leaves a history entry so
	   the back button has something to go back to. */
	function navigate(hash) {
		window.location.hash = hash;
	}

	/* The model moved screen on its own after saving or deleting. Rewriting
	   the URL this way makes it agree without firing hashchange, so the
	   screen is not drawn a second time, and it replaces the form we just
	   left instead of stacking it in the history — going back from a saved
	   listing should not return to the form that created it. */
	function syncUrl(hash) {
		window.history.replaceState(null, "", hash);
	}

	function applyRoute() {
		const route = parseHash(window.location.hash);

		switch (route.screen) {
			case "detail":
				model.showDetail(route.id);
				break;
			case "new":
				model.showNew();
				break;
			case "edit":
				model.showEdit(route.id);
				break;
			default:
				model.showList();
		}
	}

	function saveListing(_event, form) {
		const fields = Object.fromEntries(new FormData(form));

		if (fields.id) {
			model.updateListing(fields.id, fields);
			syncUrl(listingHash("annonse", fields.id));
			return;
		}

		// addListing returns nothing when validation fails and the form is
		// redrawn with its errors. The URL has to stay on #/ny in that case.
		const created = model.addListing(fields);
		if (created) syncUrl(listingHash("annonse", created.id));
	}

	function init() {
		// The view redraws every time the model says something changed.
		model.subscribe(view.render);

		view.bindActions({
			formInput: (_event, element) =>
				model.setFormValue(element.name, element.value),

			showList: () => navigate("#/"),

			showNew: () => navigate("#/ny"),

			showDetail: (_event, element) =>
				navigate(listingHash("annonse", element.dataset.id)),

			showEdit: (_event, element) =>
				navigate(listingHash("rediger", element.dataset.id)),

			deleteListing: (_event, element) =>
				model.requestDelete(element.dataset.id),

			confirmDelete: () => {
				model.confirmDelete();
				// The listing behind the current URL no longer exists, so the
				// address is replaced rather than added to.
				syncUrl("#/");
			},

			cancelDelete: () => model.cancelDelete(),

			search: (_event, element) => model.setSearch(element.value),

			selectCategory: (_event, element) => model.setCategory(element.value),

			setSort: (_event, element) => model.setSort(element.value),

			toggleFavorite: (_event, element) =>
				model.toggleFavorite(element.dataset.id),

			toggleFavoritesFilter: () => model.toggleFavoritesFilter(),

			saveListing,
		});

		window.addEventListener("hashchange", applyRoute);

		// First draw comes from the URL, so a refresh or a shared link lands
		// on the listing it names instead of always on the list.
		applyRoute();
	}

	return { init };
}
