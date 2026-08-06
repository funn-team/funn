/* ======================================================================
   src/js/screens/detaljSkjerm.js — SKJERM: ÉN ANNONSE
   Returnerer HTML som tekst. Ingen state, ingen event-lytting.

   Eier: Person D
   ====================================================================== */

import { escapeHtml, kroner } from "../format.js"

export function renderDetalj(viewState) {
	const annonse = viewState.valgtAnnonse

	if (!annonse) {
		return `
			<section class="skjerm">
				<p class="tom">Fant ikke annonsen.</p>
				<button class="knapp" type="button" data-action="visListe">Til alle annonser</button>
			</section>
		`
	}

	return `
		<section class="skjerm">
			<button class="knapp knapp--diskret" type="button" data-action="visListe">
				&larr; Alle annonser
			</button>

			<article class="detalj">
				<h1 class="detalj__tittel">${escapeHtml(annonse.tittel)}</h1>
				<p class="detalj__pris">${kroner(annonse.pris)}</p>

				<dl class="detalj__fakta">
					<dt>Kategori</dt>
					<dd>${escapeHtml(annonse.kategori)}</dd>
					<dt>Sted</dt>
					<dd>${escapeHtml(annonse.sted)}</dd>
					<dt>Lagt ut</dt>
					<dd>${escapeHtml(annonse.opprettet)}</dd>
				</dl>

				<p class="detalj__beskrivelse">${escapeHtml(annonse.beskrivelse)}</p>
			</article>
		</section>
	`
}
