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

			showEdit: (_event, element) => model.showEdit(element.dataset.id),

			deleteListing: (_event, element) => model.requestDelete(element.dataset.id),

			confirmDelete: () => model.confirmDelete(),

			cancelDelete: () => model.cancelDelete(),

			search: (_event, element) => model.setSearch(element.value),

			selectCategory: (_event, element) => model.setCategory(element.value),

			saveListing: (_event, form) => {
				const fields = Object.fromEntries(new FormData(form));
				if(fields.id) {
					model.updateListing(fields.id, fields)
				}
				else {
					model.addListing(fields)
				}
				model.addListing(fields);
			},
		});

		// First draw.
		model.start();
	}

	return { init };
}
