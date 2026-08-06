/* ======================================================================
   src/js/screens/listScreen.js — SCREEN: ALL LISTINGS
   Takes a viewState and returns HTML as a string. No state, no event
   listening — interactive elements are marked with data-action, and
   view.js forwards them to the controller.

   Maintainer: see README. Search and filter is built as a pair.
   ====================================================================== */

import { escapeHtml, formatPrice } from "../format.js"

export function renderListScreen(viewState) {
	const { visibleListings, categories, search, category, totalCount } = viewState

	return `
		<section class="screen">
			<div class="search-bar" role="search">
				<label class="visually-hidden" for="search-field">Søk i annonser</label>
				<input
					id="search-field"
					class="field"
					type="search"
					placeholder="Søk etter tittel"
					value="${escapeHtml(search)}"
					data-action="search">

				<label class="visually-hidden" for="category-field">Kategori</label>
				<select id="category-field" class="field" data-action="selectCategory">
					${categories
						.map(
							(name) => `
						<option value="${escapeHtml(name)}" ${name === category ? "selected" : ""}>
							${name === "all" ? "Alle kategorier" : escapeHtml(name)}
						</option>`,
						)
						.join("")}
				</select>
			</div>

			<p class="result-count">
				Viser ${visibleListings.length} av ${totalCount} annonser
			</p>

			${visibleListings.length === 0 ? renderEmptyState() : renderListingGrid(visibleListings)}
		</section>
	`
}

function renderListingGrid(listings) {
	return `
		<ul class="listing-grid">
			${listings.map(renderCard).join("")}
		</ul>
	`
}

function renderCard(listing) {
	return `
		<li class="card">
			<button class="card__button" type="button" data-action="showDetail" data-id="${escapeHtml(listing.id)}">
				<span class="card__title">${escapeHtml(listing.title)}</span>
				<span class="card__price">${formatPrice(listing.price)}</span>
				<span class="card__meta">${escapeHtml(listing.location)} · ${escapeHtml(listing.category)}</span>
			</button>
		</li>
	`
}

function renderEmptyState() {
	return `<p class="empty">Ingen annonser passer søket.</p>`
}
