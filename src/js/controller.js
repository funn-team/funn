/* ======================================================================
   src/js/controller.js — CONTROLLER
   Connects model and view. All behaviour and all event handling lives
   here. No HTML, no state.

   New features are added as new handlers below. Keep each handler to a
   couple of lines — its job is to translate one user action into one call
   into the model.

   ROUTING. The URL is the single source of truth for which screen is
   shown. Handlers never call the model's screen actions directly: they
   push a path, and the popstate listener reads it back and tells the
   model. One direction only, so the address bar and the screen can never
   disagree, and the browser's back button works for free.

     /                  all listings
     /annonse/<id>      one listing
     /ny                new listing form
     /rediger/<id>      edit an existing listing

   These are real paths, not hash fragments, so the server has to answer
   every one of them with index.html (see server/index.js) — otherwise a
   refresh or a shared link 404s instead of reaching this router.

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

function parsePath(pathname) {
	const [name, value] = pathname.replace(/^\/?/, "").split("/");

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

function listingPath(prefix, id) {
	return `/${prefix}/${encodeURIComponent(id)}`;
}

export function createController({ model, view }) {
	/* The user asked to go somewhere. Pushing a path leaves a history entry
	   so the back button has something to go back to, and popstate (fired
	   on back/forward, not on pushState itself) is what actually draws the
	   screen — so draw it here too, since pushState doesn't fire popstate. */
	function navigate(path) {
		window.history.pushState(null, "", path);
		applyRoute();
	}

	/* The model moved screen on its own after saving or deleting. Replacing
	   the URL this way makes it agree without adding a history entry, so it
	   replaces the form we just left instead of stacking it in the history —
	   going back from a saved listing should not return to the form that
	   created it. */
	function syncUrl(path) {
		window.history.replaceState(null, "", path);
	}

	function applyRoute() {
		const route = parsePath(window.location.pathname);

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

	async function saveListing(_event, form) {
		const fields = Object.fromEntries(new FormData(form));

		if (fields.id) {
			const updated = await model.updateListing(fields.id, fields);
			if (updated) syncUrl(listingPath("annonse", fields.id));
			return;
		}

		// addListing returns nothing when validation fails and the form is
		// redrawn with its errors. The URL has to stay on /ny in that case.
		const created = await model.addListing(fields);
		if (created) syncUrl(listingPath("annonse", created.id));
	}

	function init() {
		// The view redraws every time the model says something changed.
		model.subscribe(view.render);

		view.bindActions({
			formInput: (_event, element) =>
				model.setFormValue(element.name, element.value),

			showList: () => navigate("/"),

			showNew: () => navigate("/ny"),

			showDetail: (_event, element) =>
				navigate(listingPath("annonse", element.dataset.id)),

			showEdit: (_event, element) =>
				navigate(listingPath("rediger", element.dataset.id)),

			deleteListing: (_event, element) =>
				model.requestDelete(element.dataset.id),

			toggleSold: (_event, element) => model.toggleSold(element.dataset.id),

			confirmDelete: () => {
				model.confirmDelete();
				// The listing behind the current URL no longer exists, so the
				// address is replaced rather than added to.
				syncUrl("/");
			},

			cancelDelete: () => model.cancelDelete(),

			search: (_event, element) => model.setSearch(element.value),

			selectCategory: (_event, element) =>
				model.setCategory(element.value),

			setSort: (_event, element) => model.setSort(element.value),

			toggleFavorite: (_event, element) =>
				model.toggleFavorite(element.dataset.id),

			toggleFavoritesFilter: () => model.toggleFavoritesFilter(),

			setMinPrice: (_event, element) => model.setMinPrice(element.value),
			setMaxPrice: (_event, element) => model.setMaxPrice(element.value),

			saveListing,
		});

		window.addEventListener("popstate", applyRoute);

		// First draw comes from the URL, so a refresh or a shared link lands
		// on the listing it names instead of always on the list.
		applyRoute();
	}

	return { init };
}
