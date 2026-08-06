/* ======================================================================
   src/js/screens/detailScreen.js — SCREEN: ONE LISTING
   Returns HTML as a string. No state, no event listening.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { escapeHtml, formatPrice } from "../format.js"

export function renderDetailScreen(viewState) {
	const listing = viewState.selectedListing

	if (!listing) {
		return `
			<section class="screen">
				<p class="empty">Fant ikke annonsen.</p>
				<button class="button" type="button" data-action="showList">Til alle annonser</button>
			</section>
		`
	}

	return `
		<section class="screen">
			<button class="button button--quiet" type="button" data-action="showList">
				&larr; Alle annonser
			</button>

			<article class="detail">
				<h1 class="detail__title">${escapeHtml(listing.title)}</h1>
				<p class="detail__price">${formatPrice(listing.price)}</p>

				<dl class="detail__facts">
					<dt>Kategori</dt>
					<dd>${escapeHtml(listing.category)}</dd>
					<dt>Sted</dt>
					<dd>${escapeHtml(listing.location)}</dd>
					<dt>Lagt ut</dt>
					<dd>${escapeHtml(listing.createdAt)}</dd>
				</dl>

				<p class="detail__description">${escapeHtml(listing.description)}</p>
			</article>
		</section>
	`
}
