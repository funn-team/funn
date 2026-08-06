/* ======================================================================
   src/js/view.js — VIEW
   Rendrer HTML fra state og sender brukerhandlinger videre. Endrer aldri
   state selv, og har ingen timere.

   view.js er bare en ruter: den velger riktig skjerm ut fra
   viewState.skjerm. Selve HTML-en ligger i src/js/screens/, én fil per
   skjerm, så flere kan jobbe samtidig uten å tråkke i samme fil.

   Interaktive elementer merkes med data-action i skjermfilene, og
   bindActions ruter dem til controlleren etter navn.

   Eier: Malin (app-skall)
   ====================================================================== */

import { renderDetalj } from "./screens/detaljSkjerm.js"
import { renderListe } from "./screens/listeSkjerm.js"
import { renderNyAnnonse } from "./screens/nyAnnonseSkjerm.js"

const skjermer = {
	liste: renderListe,
	detalj: renderDetalj,
	ny: renderNyAnnonse,
}

export function createView(rootEl) {
	const utgang = rootEl.querySelector("#main")
	if (!utgang) throw new Error("Mangler <main id=\"main\"> inne i #app")

	function render(viewState) {
		const tegn = skjermer[viewState.skjerm] ?? renderListe
		const fokus = lesFokus()
		utgang.innerHTML = tegn(viewState)
		gjenopprettFokus(fokus)
	}

	/* Hele skjermen tegnes på nytt ved hver endring. Uten dette ville
	   søkefeltet mistet fokus for hvert tastetrykk. */
	function lesFokus() {
		const aktiv = document.activeElement
		if (!aktiv || !utgang.contains(aktiv) || !aktiv.dataset.action) return null
		let markør = null
		try {
			markør = aktiv.selectionStart
		} catch {
			// Noen felttyper støtter ikke selectionStart. Da hopper vi over.
		}
		return { handling: aktiv.dataset.action, markør }
	}

	function gjenopprettFokus(fokus) {
		if (!fokus) return
		const felt = utgang.querySelector(`[data-action="${fokus.handling}"]`)
		if (!felt) return
		felt.focus()
		if (fokus.markør === null) return
		try {
			felt.setSelectionRange(fokus.markør, fokus.markør)
		} catch {
			// Se over.
		}
	}

	/* Tre delegerte lyttere på rota. handlers = { handlingsnavn: (event, element) => {} }
	   Fordi de ligger på #app og ikke på innholdet, overlever de at
	   innholdet byttes ut ved hver render. */
	function bindActions(handlers) {
		rootEl.addEventListener("click", (event) => {
			const element = event.target.closest("[data-action]")
			if (!element) return
			// Skjemafelt håndteres av input-lytteren under.
			if (element.matches("input, select, textarea, form")) return
			if (element.tagName === "A") event.preventDefault()
			handlers[element.dataset.action]?.(event, element)
		})

		rootEl.addEventListener("input", (event) => {
			const element = event.target.closest("[data-action]")
			if (!element || !element.matches("input, select, textarea")) return
			handlers[element.dataset.action]?.(event, element)
		})

		rootEl.addEventListener("submit", (event) => {
			const skjema = event.target.closest("form[data-action]")
			if (!skjema) return
			event.preventDefault()
			handlers[skjema.dataset.action]?.(event, skjema)
		})
	}

	return { render, bindActions }
}
