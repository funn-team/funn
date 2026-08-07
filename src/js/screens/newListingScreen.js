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
	const isEdit = viewState.screen === "edit"
	const listing = viewState.selectedListing

	return /*html*/`
		<section class="screen">
			<button class="button button--quiet" type="button" data-action="showList">
				&larr; Alle annonser
			</button>

			<h1 class="page-title">${isEdit ? "Rediger annonse" : "Ny annonse"}</h1>

			<form class="form" data-action="saveListing">
				${isEdit ? `<input type="hidden" name="id" value="${listing.id}">` : ""}
				<fieldset class="form__group">
					<legend class="form__legend">Om varen</legend>

					<p class="form__row">
						<label for="title">Tittel</label>
						<input id="title" class="field" name="title" type="text" required maxlength="80" value="${isEdit ? escapeHtml(listing.title) : ""}">
					</p>

					<p class="form__row">
						<label for="price">Pris i kroner</label>
						<input id="price" class="field" name="price" type="number" min="0" step="1"  value="${isEdit ? listing.price : ""}" required>
					</p>

					<p class="form__row">
						<label for="category">Kategori</label>
						<select id="category" class="field" name="category" required>
							${categories.map((name) => `<option value="${escapeHtml(name)}" ${isEdit && name === listing.category ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						</select>
					</p>

					<p class="form__row">
						<label for="condition">Tilstand</label>
						<select id="condition" class="field" name="condition" required>
							${conditions.map((name) => `<option value="${escapeHtml(name)}" ${isEdit && name === listing.condition ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						</select>
					</p>

					<p class="form__row">
						<label for="description">Beskrivelse</label>
						<textarea id="description" class="field" name="description" rows="4" required maxlength="500">${isEdit ? escapeHtml(listing.description) : ""}</textarea>
					</p>

					<p class="form__row">
						<label for="imageUrl">Bilde-URL <span class="form__hint">(valgfritt)</span></label>
						<input id="imageUrl" class="field" name="imageUrl" type="url" placeholder="https://" value="${isEdit ? escapeHtml(listing.imageUrl) : ""}">
					</p>
				</fieldset>

				<fieldset class="form__group">
					<legend class="form__legend">Kontaktinformasjon</legend>

					<p class="form__row">
						<label for="sellerName">Navn</label>
						<input id="sellerName" class="field" name="sellerName" type="text" required maxlength="60" value="${isEdit ? escapeHtml(listing.seller.name) : ""}">
					</p>

					<p class="form__row">
						<label for="sellerPhone">Telefon</label>
						<input id="sellerPhone" class="field" name="sellerPhone" type="tel" required maxlength="20" value="${isEdit ? escapeHtml(listing.seller.phone) : ""}">
					</p>

					<p class="form__row">
						<label for="sellerEmail">E-post</label>
						<input id="sellerEmail" class="field" name="sellerEmail" type="email" required maxlength="80" value="${isEdit ? escapeHtml(listing.seller.email) : ""}">
					</p>

					<p class="form__row">
						<label for="zip">Postnummer</label>
						<input id="zip" class="field" name="zip" type="text" inputmode="numeric" pattern="[0-9]{4}"  value="${isEdit ? escapeHtml(listing.seller.location.zip) : ""}" required>
					</p>

					<p class="form__row">
						<label for="city">Sted</label>
						<input id="city" class="field" name="city" type="text" required maxlength="60" value="${isEdit ? escapeHtml(listing.seller.location.city) : ""}">
					</p>
				</fieldset>

				<button class="button button--primary" type="submit">${isEdit ? "Lagre endringer" : "Legg ut annonse"}</button>
			</form>
		</section>
	`
}
