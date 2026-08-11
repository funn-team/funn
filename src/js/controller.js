/* ======================================================================
   src/js/controller.js — CONTROLLER
   Connects model and view. All behaviour and all event handling lives
   here. No HTML, no state.

   New features are added as new handlers below. Keep each handler to a
   couple of lines — its job is to translate one user action into one call
   into the model.

   Maintainer: see README. Expect small, additive changes from everyone.
   ====================================================================== */

export function createController({ model, view }) {
	function init() {
		// The view redraws every time the model says something changed.
		model.subscribe(view.render);

		view.bindActions({
			showList: () => model.showList(),

			showNew: () => model.showNew(),

			showDetail: (_event, element) => model.showDetail(element.dataset.id),

			search: (_event, element) => model.setSearch(element.value),

			selectCategory: (_event, element) => model.setCategory(element.value),

			toggleFavorite: (_event, element) => model.toggleFavorite(element.dataset.id),

			toggleFavoritesFilter: () => model.toggleFavoritesFilter(),

			setMinPrice: (_event, element) => model.setMinPrice(element.value),
			setMaxPrice: (_event, element) => model.setMaxPrice(element.value),

			saveListing: (_event, form) => {
				const fields = Object.fromEntries(new FormData(form));
				model.addListing(fields);
			},


		})

		// First draw.
		model.start();
	}

	return { init };
}
