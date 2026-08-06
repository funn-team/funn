/* ======================================================================
   src/js/controller.js — CONTROLLER
   Kobler model og view sammen. All oppførsel og all event-håndtering
   bor her. Ingen HTML, ingen state.

   Nye funksjoner legges til som nye handlers under. Hold hver handler
   på et par linjer — jobben er å oversette en brukerhandling til ett
   kall inn i modellen.

   Eier: Malin (app-skall) — små, additive endringer fra alle
   ====================================================================== */

export function createController({ model, view }) {
	function init() {
		// View tegner på nytt hver gang modellen sier fra.
		model.subscribe(view.render)

		view.bindActions({
			visListe: () => model.visListe(),

			visNy: () => model.visNy(),

			visDetalj: (_event, element) => model.visDetalj(element.dataset.id),

			søk: (_event, element) => model.settSøk(element.value),

			velgKategori: (_event, element) => model.settKategori(element.value),

			lagreAnnonse: (_event, skjema) => {
				const felter = Object.fromEntries(new FormData(skjema))
				model.leggTilAnnonse(felter)
			},
		})

		// Første tegning.
		model.start()
	}

	return { init }
}
