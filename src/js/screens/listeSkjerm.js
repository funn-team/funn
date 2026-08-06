/* ======================================================================
   src/js/screens/listeSkjerm.js — SKJERM: ALLE ANNONSER
   Tar imot viewState og returnerer HTML som tekst. Ingen state, ingen
   event-lytting — interaktive elementer merkes med data-action, og
   view.js sender dem videre til controlleren.

   Eier: Person C   ·   Søk og filter: Person B + C sammen
   ====================================================================== */

import { escapeHtml, kroner } from "../format.js"

export function renderListe(viewState) {
	const { synligeAnnonser, kategorier, søk, kategori, antallTotalt } = viewState

	return `
		<section class="skjerm">
			<div class="sokelinje" role="search">
				<label class="visuelt-skjult" for="sokefelt">Søk i annonser</label>
				<input
					id="sokefelt"
					class="felt"
					type="search"
					placeholder="Søk etter tittel"
					value="${escapeHtml(søk)}"
					data-action="søk">

				<label class="visuelt-skjult" for="kategorifelt">Kategori</label>
				<select id="kategorifelt" class="felt" data-action="velgKategori">
					${kategorier
						.map(
							(navn) => `
						<option value="${escapeHtml(navn)}" ${navn === kategori ? "selected" : ""}>
							${navn === "alle" ? "Alle kategorier" : escapeHtml(navn)}
						</option>`,
						)
						.join("")}
				</select>
			</div>

			<p class="tellerlinje">
				Viser ${synligeAnnonser.length} av ${antallTotalt} annonser
			</p>

			${synligeAnnonser.length === 0 ? tomtResultat() : annonseListe(synligeAnnonser)}
		</section>
	`
}

function annonseListe(annonser) {
	return `
		<ul class="annonseliste">
			${annonser.map(annonseKort).join("")}
		</ul>
	`
}

function annonseKort(annonse) {
	return `
		<li class="kort">
			<button class="kort__knapp" type="button" data-action="visDetalj" data-id="${escapeHtml(annonse.id)}">
				<span class="kort__tittel">${escapeHtml(annonse.tittel)}</span>
				<span class="kort__pris">${kroner(annonse.pris)}</span>
				<span class="kort__meta">${escapeHtml(annonse.sted)} · ${escapeHtml(annonse.kategori)}</span>
			</button>
		</li>
	`
}

function tomtResultat() {
	return `<p class="tom">Ingen annonser passer søket.</p>`
}
