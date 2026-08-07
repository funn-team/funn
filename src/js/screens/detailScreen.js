/* ======================================================================
   src/js/screens/detailScreen.js — SCREEN: ONE LISTING
   Returns HTML as a string. No state, no event listening.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { escapeHtml, formatPrice, safeImageUrl } from "../format.js";

export function renderDetailScreen(viewState) {
	const listing = viewState.selectedListing;
	const favoriteIds = viewState.favoriteIds;

	if (!listing) {
		return `
			<section class="screen">
				<p class="empty">Fant ikke annonsen.</p>
				<button class="button" type="button" data-action="showList">Til alle annonser</button>
			</section>
		`;
	}

	const isFavorite = favoriteIds.includes(listing.id);

	return `
		<section class="screen">
			<button class="button button--quiet" type="button" data-action="showList">
				&larr; Alle annonser
			</button>

				<article class="detail">
					${renderImage(listing)}

				<button
					class="card__favorite"
					type="button"
					data-action="toggleFavorite"
					data-id="${escapeHtml(listing.id)}"
					aria-pressed="${isFavorite}"
					aria-label="Favoritt: ${escapeHtml(listing.title)}">
					${isFavorite ? "★" : "☆"}
				</button>

					<h1 class="detail__title">${escapeHtml(listing.title)}</h1>
					<p class="detail__price">${formatPrice(listing.price)}</p>


				<dl class="detail__facts">
					<dt>Kategori</dt>
					<dd>${escapeHtml(listing.category)}</dd>
					<dt>Tilstand</dt>
					<dd>${escapeHtml(listing.condition)}</dd>
					<dt>Sted</dt>
					<dd>${renderLocation(listing)}</dd>
					<dt>Lagt ut</dt>
					<dd>${escapeHtml(listing.createdAt)}</dd>
				</dl>

				<p class="detail__description">${escapeHtml(listing.description)}</p>

				${renderSeller(listing)}
			</article>
		</section>
	`;
}

function renderImage(listing) {
	const url = safeImageUrl(listing.imageUrl);
	if (!url) return "";

	return `<img class="detail__image" src="${escapeHtml(url)}" alt="${escapeHtml(listing.title)}">`;
}

function renderLocation(listing) {
	const { zip = "", city = "" } = listing.location ?? {};
	return escapeHtml([zip, city].filter(Boolean).join(" "));
}

function renderSeller(listing) {
	const seller = listing.seller;
	if (!seller) return "";

	return `
		<section class="seller">
			<h2 class="seller__heading">Selger</h2>
			<p class="seller__name">${escapeHtml(seller.name)}</p>
			<ul class="seller__contact">
				<li><a href="tel:${escapeHtml(seller.phone)}">${escapeHtml(seller.phone)}</a></li>
				<li><a href="mailto:${escapeHtml(seller.email)}">${escapeHtml(seller.email)}</a></li>
			</ul>
		</section>
	`;
}
