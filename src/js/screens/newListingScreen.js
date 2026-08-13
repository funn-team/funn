/* ======================================================================
   src/js/screens/newListingScreen.js — SCREEN: POST A LISTING
   Returns HTML as a string. The form carries data-action="saveListing";
   view.js catches the submit and passes the fields to the controller.

   Doubles as the edit screen (viewState.screen === "edit"): a hidden id
   field tells the controller to update instead of add. Each field prefers
   a draft value from form.values (what the user has typed this session)
   and falls back to the listing's stored value in edit mode, or blank for
   a new listing.

   FormData is always flat, so the seller fields are named sellerName,
   sellerPhone and sellerEmail, and the location fields are named city and
   zip. model.addListing/updateListing assemble them into seller and
   location, two sibling objects on the listing. Renaming a field here
   means renaming it there too.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { escapeHtml } from "../format.js";

export function renderNewListingScreen(viewState) {
	const categories = viewState.categories.filter((name) => name !== "all");
	const { conditions } = viewState;
	const { values, errors } = viewState.form;
	const isEdit = viewState.screen === "edit";
	const listing = viewState.selectedListing;

	return `
		<section class="screen">
			<button class="button button--quiet" type="button" data-action="showList">
				&larr; Alle annonser
			</button>

			<h1 class="page-title">${isEdit ? "Rediger annonse" : "Ny annonse"}</h1>

			<form class="form" data-action="saveListing" novalidate>
				${isEdit ? `<input type="hidden" name="id" value="${escapeHtml(listing.id)}">` : ""}

				<fieldset class="form__group">
					<legend class="form__legend">Om varen</legend>

					<div class="form__row">
						<label for="title">Tittel</label>
						<input id="title" class="field" name="title" type="text" maxlength="80" data-action="formInput"
							value="${escapeHtml(values.title ?? (isEdit ? listing.title : ""))}"
							${errors.title ? `aria-describedby="error-title" aria-invalid="true"` : ""}>
						${errors.title ? `<span class="form__error" id="error-title">${escapeHtml(errors.title)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="price">Pris i kroner</label>
						<input id="price" class="field" name="price" type="number" min="0" step="1" data-action="formInput"
							value="${escapeHtml(values.price ?? (isEdit ? listing.price : ""))}"
							${errors.price ? `aria-describedby="error-price" aria-invalid="true"` : ""}>
						${errors.price ? `<span class="form__error" id="error-price">${escapeHtml(errors.price)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="category">Kategori</label>
						<select id="category" class="field" name="category" data-action="formInput">
							${categories.map((name) => `<option value="${escapeHtml(name)}" ${name === (values.category ?? (isEdit ? listing.category : "")) ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						</select>
					</div>

					<div class="form__row">
						<label for="condition">Tilstand</label>
						<select id="condition" class="field" name="condition" data-action="formInput">
							${conditions.map((name) => `<option value="${escapeHtml(name)}" ${name === (values.condition ?? (isEdit ? listing.condition : "")) ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						</select>
					</div>

					<div class="form__row">
						<label for="description">Beskrivelse</label>
						<textarea id="description" class="field" name="description" rows="4" maxlength="500" data-action="formInput"
							${errors.description ? `aria-describedby="error-description" aria-invalid="true"` : ""}
							>${escapeHtml(values.description ?? (isEdit ? listing.description : ""))}</textarea>
						${errors.description ? `<span class="form__error" id="error-description">${escapeHtml(errors.description)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="imageUrl">Bilde-URL <span class="form__hint">(valgfritt)</span></label>
						<input id="imageUrl" class="field" name="imageUrl" type="url" placeholder="https://" data-action="formInput"
							value="${escapeHtml(values.imageUrl ?? (isEdit ? listing.imageUrl : ""))}"
							${errors.imageUrl ? `aria-describedby="error-imageUrl" aria-invalid="true"` : ""}>
						${errors.imageUrl ? `<span class="form__error" id="error-imageUrl">${escapeHtml(errors.imageUrl)}</span>` : ""}
					</div>
				</fieldset>

				<fieldset class="form__group">
					<legend class="form__legend">Kontaktinformasjon</legend>

					<div class="form__row">
						<label for="sellerName">Navn</label>
						<input id="sellerName" class="field" name="sellerName" type="text" maxlength="60" data-action="formInput"
							value="${escapeHtml(values.sellerName ?? (isEdit ? listing.seller.name : ""))}"
							${errors.sellerName ? `aria-describedby="error-sellerName" aria-invalid="true"` : ""}>
						${errors.sellerName ? `<span class="form__error" id="error-sellerName">${escapeHtml(errors.sellerName)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="sellerPhone">Telefon</label>
						<input id="sellerPhone" class="field" name="sellerPhone" type="tel" maxlength="20" data-action="formInput"
							value="${escapeHtml(values.sellerPhone ?? (isEdit ? listing.seller.phone : ""))}"
							${errors.sellerPhone ? `aria-describedby="error-sellerPhone" aria-invalid="true"` : ""}>
						${errors.sellerPhone ? `<span class="form__error" id="error-sellerPhone">${escapeHtml(errors.sellerPhone)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="sellerEmail">E-post</label>
						<input id="sellerEmail" class="field" name="sellerEmail" type="email" maxlength="80" data-action="formInput"
							value="${escapeHtml(values.sellerEmail ?? (isEdit ? listing.seller.email : ""))}"
							${errors.sellerEmail ? `aria-describedby="error-sellerEmail" aria-invalid="true"` : ""}>
						${errors.sellerEmail ? `<span class="form__error" id="error-sellerEmail">${escapeHtml(errors.sellerEmail)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="zip">Postnummer</label>
						<input id="zip" class="field" name="zip" type="text" inputmode="numeric" pattern="[0-9]{4}" data-action="formInput"
							value="${escapeHtml(values.zip ?? (isEdit ? listing.location.zip : ""))}"
							${errors.zip ? `aria-describedby="error-zip" aria-invalid="true"` : ""}>
						${errors.zip ? `<span class="form__error" id="error-zip">${escapeHtml(errors.zip)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="city">Sted</label>
						<input id="city" class="field" name="city" type="text" maxlength="60" data-action="formInput"
							value="${escapeHtml(values.city ?? (isEdit ? listing.location.city : ""))}"
							${errors.city ? `aria-describedby="error-city" aria-invalid="true"` : ""}>
						${errors.city ? `<span class="form__error" id="error-city">${escapeHtml(errors.city)}</span>` : ""}
					</div>
				</fieldset>

				<button class="button button--primary" type="submit">${isEdit ? "Lagre endringer" : "Legg ut annonse"}</button>
			</form>
		</section>
	`;
}
