/* ======================================================================
   src/js/screens/newListingScreen.js — SCREEN: POST A LISTING
   Returns HTML as a string. The form carries data-action="saveListing";
   view.js catches the submit and passes the fields to the controller.

   FormData is always flat, so the seller fields are named sellerName,
   sellerPhone and sellerEmail, and the location fields are named city and
   zip. model.addListing assembles them into seller and location, two
   sibling objects on the listing. Renaming a field here means renaming it
   there too.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { escapeHtml } from "../format.js";

export function renderNewListingScreen(viewState) {
	const categories = viewState.categories.filter((name) => name !== "all")
	const { conditions } = viewState
	const isEdit = viewState.screen === "edit"
	const listing = viewState.selectedListing
	const categories = viewState.categories.filter((name) => name !== "all");
	const { conditions } = viewState;
	const { values, errors } = viewState.form;

	return /*html*/`
		<section class="screen">
			<button class="button button--quiet" type="button" data-action="showList">
				&larr; Alle annonser
			</button>

			<h1 class="page-title">${isEdit ? "Rediger annonse" : "Ny annonse"}</h1>

			<form class="form" data-action="saveListing">
				${isEdit ? `<input type="hidden" name="id" value="${listing.id}">` : ""}
			<form class="form" data-action="saveListing" novalidate>

				<fieldset class="form__group">
					<legend class="form__legend">Om varen</legend>

					<div class="form__row">
						<label for="title">Tittel</label>
						<input id="title" class="field" name="title" type="text" required maxlength="80" value="${isEdit ? escapeHtml(listing.title) : ""}">
					</p>
						<input id="title" class="field" name="title" type="text" maxlength="80" data-action="formInput"
							value="${escapeHtml(values.title ?? "")}"
							${errors.title ? `aria-describedby="error-title" aria-invalid="true"` : ""}>
						${errors.title ? `<span class="form__error" id="error-title">${escapeHtml(errors.title)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="price">Pris i kroner</label>
						<input id="price" class="field" name="price" type="number" min="0" step="1"  value="${isEdit ? listing.price : ""}" required>
					</p>
						<input id="price" class="field" name="price" type="number" min="0" step="1" data-action="formInput"
							value="${escapeHtml(values.price ?? "")}"
							${errors.price ? `aria-describedby="error-price" aria-invalid="true"` : ""}>
						${errors.price ? `<span class="form__error" id="error-price">${escapeHtml(errors.price)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="category">Kategori</label>
						<select id="category" class="field" name="category" required>
							${categories.map((name) => `<option value="${escapeHtml(name)}" ${isEdit && name === listing.category ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						<select id="category" class="field" name="category">
							${categories.map((name) => `<option value="${escapeHtml(name)}" ${name === values.category ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						</select>
					</div>

					<div class="form__row">
						<label for="condition">Tilstand</label>
						<select id="condition" class="field" name="condition" required>
							${conditions.map((name) => `<option value="${escapeHtml(name)}" ${isEdit && name === listing.condition ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						<select id="condition" class="field" name="condition">
							${conditions.map((name) => `<option value="${escapeHtml(name)}" ${name === values.condition ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
						</select>
					</div>

					<div class="form__row">
						<label for="description">Beskrivelse</label>
						<textarea id="description" class="field" name="description" rows="4" required maxlength="500">${isEdit ? escapeHtml(listing.description) : ""}</textarea>
					</p>
						<textarea id="description" class="field" name="description" rows="4" maxlength="500" data-action="formInput"
							${errors.description ? `aria-describedby="error-description" aria-invalid="true"` : ""}
							>${escapeHtml(values.description ?? "")}</textarea>
						${errors.description ? `<span class="form__error" id="error-description">${escapeHtml(errors.description)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="imageUrl">Bilde-URL <span class="form__hint">(valgfritt)</span></label>
						<input id="imageUrl" class="field" name="imageUrl" type="url" placeholder="https://" value="${isEdit ? escapeHtml(listing.imageUrl) : ""}">
					</p>
						<input id="imageUrl" class="field" name="imageUrl" type="url" placeholder="https://" data-action="formInput"
							value="${escapeHtml(values.imageUrl ?? "")}"
							${errors.imageUrl ? `aria-describedby="error-imageUrl" aria-invalid="true"` : ""}>
						${errors.imageUrl ? `<span class="form__error" id="error-imageUrl">${escapeHtml(errors.imageUrl)}</span>` : ""}
					</div>
				</fieldset>

				<fieldset class="form__group">
					<legend class="form__legend">Kontaktinformasjon</legend>

					<div class="form__row">
						<label for="sellerName">Navn</label>
						<input id="sellerName" class="field" name="sellerName" type="text" required maxlength="60" value="${isEdit ? escapeHtml(listing.seller.name) : ""}">
					</p>
						<input id="sellerName" class="field" name="sellerName" type="text" maxlength="60" data-action="formInput"
							value="${escapeHtml(values.sellerName ?? "")}"
							${errors.sellerName ? `aria-describedby="error-sellerName" aria-invalid="true"` : ""}>
						${errors.sellerName ? `<span class="form__error" id="error-sellerName">${escapeHtml(errors.sellerName)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="sellerPhone">Telefon</label>
						<input id="sellerPhone" class="field" name="sellerPhone" type="tel" required maxlength="20" value="${isEdit ? escapeHtml(listing.seller.phone) : ""}">
					</p>
						<input id="sellerPhone" class="field" name="sellerPhone" type="tel" maxlength="20" data-action="formInput"
							value="${escapeHtml(values.sellerPhone ?? "")}"
							${errors.sellerPhone ? `aria-describedby="error-sellerPhone" aria-invalid="true"` : ""}>
						${errors.sellerPhone ? `<span class="form__error" id="error-sellerPhone">${escapeHtml(errors.sellerPhone)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="sellerEmail">E-post</label>
						<input id="sellerEmail" class="field" name="sellerEmail" type="email" required maxlength="80" value="${isEdit ? escapeHtml(listing.seller.email) : ""}">
					</p>
						<input id="sellerEmail" class="field" name="sellerEmail" type="email" maxlength="80" data-action="formInput"
							value="${escapeHtml(values.sellerEmail ?? "")}"
							${errors.sellerEmail ? `aria-describedby="error-sellerEmail" aria-invalid="true"` : ""}>
						${errors.sellerEmail ? `<span class="form__error" id="error-sellerEmail">${escapeHtml(errors.sellerEmail)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="zip">Postnummer</label>
						<input id="zip" class="field" name="zip" type="text" inputmode="numeric" pattern="[0-9]{4}"  value="${isEdit ? escapeHtml(listing.seller.location.zip) : ""}" required>
					</p>
						<input id="zip" class="field" name="zip" type="text" inputmode="numeric" pattern="[0-9]{4}" data-action="formInput"
							value="${escapeHtml(values.zip ?? "")}"
							${errors.zip ? `aria-describedby="error-zip" aria-invalid="true"` : ""}>
						${errors.zip ? `<span class="form__error" id="error-zip">${escapeHtml(errors.zip)}</span>` : ""}
					</div>

					<div class="form__row">
						<label for="city">Sted</label>
						<input id="city" class="field" name="city" type="text" required maxlength="60" value="${isEdit ? escapeHtml(listing.seller.location.city) : ""}">
					</p>
						<input id="city" class="field" name="city" type="text" maxlength="60" data-action="formInput"
							value="${escapeHtml(values.city ?? "")}"
							${errors.city ? `aria-describedby="error-city" aria-invalid="true"` : ""}>
						${errors.city ? `<span class="form__error" id="error-city">${escapeHtml(errors.city)}</span>` : ""}
					</div>
				</fieldset>

				<button class="button button--primary" type="submit">${isEdit ? "Lagre endringer" : "Legg ut annonse"}</button>
			</form>
		</section>
	`;
}
