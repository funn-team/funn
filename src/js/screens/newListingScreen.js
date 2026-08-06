/* ======================================================================
   src/js/screens/newListingScreen.js — SCREEN: POST A LISTING
   Returns HTML as a string. The form carries data-action="saveListing";
   view.js catches the submit and passes the fields to the controller.

   FormData is always flat, so the seller fields are named sellerName,
   sellerPhone, sellerEmail, city and zip. model.addListing assembles them
   into the nested seller object. Renaming a field here means renaming it
   there too.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { escapeHtml } from "../format.js"

export function renderNewListingScreen(viewState) {
	const categories = viewState.categories.filter((name) => name !== "all")
	const { conditions } = viewState

	return `
		<section class="screen">
			<button class="button button--quiet" type="button" data-action="showList">
				&larr; Alle annonser
			</button>

			<h1 class="page-title">Ny annonse</h1>

			<form class="form" data-action="saveListing">
				<fieldset class="form__group">
					<legend class="form__legend">Om varen</legend>

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
						<label for="condition">Tilstand</label>
						<select id="condition" class="field" name="condition" required>
							${conditions.map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}
						</select>
					</p>

					<p class="form__row">
						<label for="description">Beskrivelse</label>
						<textarea id="description" class="field" name="description" rows="4" required maxlength="500"></textarea>
					</p>

					<p class="form__row">
						<label for="imageUrl">Bilde-URL <span class="form__hint">(valgfritt)</span></label>
						<input id="imageUrl" class="field" name="imageUrl" type="url" placeholder="https://">
					</p>
				</fieldset>

				<fieldset class="form__group">
					<legend class="form__legend">Kontaktinformasjon</legend>

					<p class="form__row">
						<label for="sellerName">Navn</label>
						<input id="sellerName" class="field" name="sellerName" type="text" required maxlength="60">
					</p>

					<p class="form__row">
						<label for="sellerPhone">Telefon</label>
						<input id="sellerPhone" class="field" name="sellerPhone" type="tel" required maxlength="20">
					</p>

					<p class="form__row">
						<label for="sellerEmail">E-post</label>
						<input id="sellerEmail" class="field" name="sellerEmail" type="email" required maxlength="80">
					</p>

					<p class="form__row">
						<label for="zip">Postnummer</label>
						<input id="zip" class="field" name="zip" type="text" inputmode="numeric" pattern="[0-9]{4}" required>
					</p>

					<p class="form__row">
						<label for="city">Sted</label>
						<input id="city" class="field" name="city" type="text" required maxlength="60">
					</p>
				</fieldset>

				<button class="button button--primary" type="submit">Legg ut annonse</button>
			</form>
		</section>
	`
}
