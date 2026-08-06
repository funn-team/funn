/* ======================================================================
   src/js/screens/nyAnnonseSkjerm.js — SKJERM: LEGG UT ANNONSE
   Returnerer HTML som tekst. Skjemaet har data-action="lagreAnnonse";
   view.js fanger submit og sender feltene videre til controlleren.

   Eier: Person E
   ====================================================================== */

import { escapeHtml } from "../format.js"

export function renderNyAnnonse(viewState) {
	const kategorier = viewState.kategorier.filter((navn) => navn !== "alle")

	return `
		<section class="skjerm">
			<button class="knapp knapp--diskret" type="button" data-action="visListe">
				&larr; Alle annonser
			</button>

			<h1 class="sidetittel">Ny annonse</h1>

			<form class="skjema" data-action="lagreAnnonse">
				<p class="skjema__rad">
					<label for="tittel">Tittel</label>
					<input id="tittel" class="felt" name="tittel" type="text" required maxlength="80">
				</p>

				<p class="skjema__rad">
					<label for="pris">Pris i kroner</label>
					<input id="pris" class="felt" name="pris" type="number" min="0" step="1" required>
				</p>

				<p class="skjema__rad">
					<label for="kategori">Kategori</label>
					<select id="kategori" class="felt" name="kategori" required>
						${kategorier.map((navn) => `<option value="${escapeHtml(navn)}">${escapeHtml(navn)}</option>`).join("")}
					</select>
				</p>

				<p class="skjema__rad">
					<label for="sted">Sted</label>
					<input id="sted" class="felt" name="sted" type="text" required maxlength="60">
				</p>

				<p class="skjema__rad">
					<label for="beskrivelse">Beskrivelse</label>
					<textarea id="beskrivelse" class="felt" name="beskrivelse" rows="4" required maxlength="500"></textarea>
				</p>

				<button class="knapp knapp--primar" type="submit">Legg ut annonse</button>
			</form>
		</section>
	`
}
