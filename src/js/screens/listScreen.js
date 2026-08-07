/* ======================================================================
   src/js/screens/listScreen.js — SCREEN: ALL LISTINGS
   Takes a viewState and returns HTML as a string. No state, no event
   listening — interactive elements are marked with data-action, and
   view.js forwards them to the controller.

   Maintainer: see README. Search and filter is built as a pair.
   ====================================================================== */

import { escapeHtml, formatPrice, safeImageUrl } from "../format.js";

export function renderListScreen(viewState) {
	const {
		visibleListings,
		categories,
		search,
		category,
		totalCount,
		favoriteIds,
		favoriteCount,
		showOnlyFavorites,
	} = viewState

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

			<label>
				<input
					type="checkbox"
					data-action="toggleFavoritesFilter"
					${showOnlyFavorites ? "checked" : ""}>
				Vis kun favoritter (${favoriteCount})
			</label>
		</div>

		<p class="result-count">
			Viser ${visibleListings.length} av ${totalCount} annonser
		</p>

		${
			visibleListings.length === 0
				? renderEmptyState()
				: renderListingGrid(visibleListings, favoriteIds)
		}
	</section>
	`
}

function renderListingGrid(listings, favoriteIds) {
	return `
		<ul class="listing-grid">
			${listings.map((listing) => renderCard(listing, favoriteIds)).join("")}
		</ul>
	`;
}

function renderCard(listing, favoriteIds) {
	const city = listing.location?.city ?? ""
	const isFavorite = favoriteIds.includes(listing.id)

	return `
	<li class="card">
		<button
			class="card__favorite"
			type="button"
			data-action="toggleFavorite"
			data-id="${escapeHtml(listing.id)}"
			aria-pressed="${isFavorite}"
			aria-label="Favoritt: ${escapeHtml(listing.title)}">
			${isFavorite ? "★" : "☆"}
		</button>

		<button
			class="card__button"
			type="button"
			data-action="showDetail"
			data-id="${escapeHtml(listing.id)}">

			${renderThumbnail(listing)}

			<span class="card__title">${escapeHtml(listing.title)}</span>
			<span class="card__price">${formatPrice(listing.price)}</span>
			<span class="card__meta">
				${escapeHtml(city)} · ${escapeHtml(listing.category)}
			</span>
		</button>
	</li>
	`
}

function renderThumbnail(listing) {
	const url = safeImageUrl(listing.imageUrl);
	if (!url)
		return `<span class="thumbnail thumbnail--empty" aria-hidden="true"></span>`;

	return `
		<img class="thumbnail" src="${escapeHtml(url)}" alt="" loading="lazy">
	`;
}

function renderEmptyState() {
	return `<p class="empty">Ingen annonser passer søket.</p>`;
}
