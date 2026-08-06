/* ======================================================================
   src/js/screens/newListingScreen.js — SCREEN: POST A LISTING
   Returns HTML as a string. The form carries data-action="saveListing";
   view.js catches the submit and passes the fields to the controller.

   The name attributes must match the field names on a listing — the
   controller builds the object straight from FormData.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { escapeHtml } from "../format.js"

export function renderNewListingScreen(viewState) {
	const categories = viewState.categories.filter((name) => name !== "all")

	return `
		<section class="screen">
			<button class="button button--quiet" type="button" data-action="showList">
				&larr; Alle annonser
			</button>

			<h1 class="page-title">Ny annonse</h1>

			<form class="form" data-action="saveListing">
				<p class="form__row">
					<label for="title">Tittel</label>
					<input id="title" class="field" name="title" type="text" required maxlength="80">
				</p>

				<p class="form__row">
					<label for="price">Pris i kroner</label>
					<input id="price" class="field" name="price" type="number" min="0" step="1" required>
				</p>

				<p class="form__row">
					<label for="category">Kategori</label>
					<select id="category" class="field" name="category" required>
						${categories.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}
					</select>
				</p>

				<p class="form__row">
					<label for="location">Sted</label>
					<input id="location" class="field" name="location" type="text" required maxlength="60">
				</p>

				<p class="form__row">
					<label for="description">Beskrivelse</label>
					<textarea id="description" class="field" name="description" rows="4" required maxlength="500"></textarea>
				</p>

				<button class="button button--primary" type="submit">Legg ut annonse</button>
			</form>
		</section>
	`
}
