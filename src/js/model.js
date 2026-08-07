/* ======================================================================
   src/js/model.js — MODEL
   All state and all data. No DOM, no timers.

   Other layers talk to the model through the functions returned here, and
   hear about changes through subscribe/notify.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { CONDITIONS, seedListings } from "./seed.js";

const STORAGE_KEY = "funn:listings"
const FAVORITES_KEY = "funn:favorites"

/* Fixed list rather than derived from the data, so the form offers the
   same options even when no listing uses a given condition yet. */

export function createModel() {
	const listeners = new Set();

	const state = {
		listings: readFromStorage(),
		screen: "list", // "list" | "detail" | "new"
		selectedId: null,
		search: "",
		category: "all",
		favoriteIds: readFavoritesFromStorage(),
		showOnlyFavorites: false,
	}

	/* ---------- storage ------------------------------------------------ */

	function readFromStorage() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) return [...seedListings];

			const parsed = JSON.parse(stored);
			// Data saved under an older shape is discarded rather than
			// rendered as undefined. Cheap insurance while the model is
			// still changing.
			if (
				!Array.isArray(parsed) ||
				parsed.some((listing) => !listing?.seller)
			) {
				return [...seedListings];
			}
			return parsed;
		} catch {
			// Corrupt or blocked localStorage must not crash the app.
			return [...seedListings];
		}
	}

	function writeToStorage() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state.listings));
		} catch {
			// Storage full or denied: the app keeps working, the data just
			// does not survive a refresh. Better than crashing mid-demo.
		}
	}

	function readFavoritesFromStorage() {
		try {
			const stored = localStorage.getItem(FAVORITES_KEY)
			if (!stored) return new Set()

			const parsed = JSON.parse(stored)
			
			if (!Array.isArray(parsed)) {
				return new Set()
			}
			return new Set(parsed)
		} catch {
			return new Set()
		}
	}

	function writeFavoritesToStorage() {
		try {
			localStorage.setItem(
				FAVORITES_KEY,
				JSON.stringify(Array.from(state.favorites)),
			)
		} catch {
			// Storage full or denied: the app keeps working, the data just
			// does not survive a refresh. Better than crashing mid-demo.
		}
	}

	/* ---------- derived data -------------------------------------------
	   The view never calculates anything. buildViewState collects
	   everything the view needs, already filtered, and is sent along with
	   every notify.
	   -------------------------------------------------------------------- */

	function filterListings(listings, search, category, showOnlyFavorites, favorites) {
		const text = search.trim().toLowerCase()
		return listings.filter((listing) => {
			const matchesText = text === "" || listing.title.toLowerCase().includes(text)
			const matchesCategory = category === "all" || listing.category === category
			const matchesFavorites = !showOnlyFavorites || favorites.has(listing.id)
			return matchesText && matchesCategory && matchesFavorites
		})
	}

	function buildViewState() {
	return {
		screen: state.screen,
		search: state.search,
		category: state.category,

		visibleListings: filterListings(
			state.listings,
			state.search,
			state.category,
			state.showOnlyFavorites,
			state.favoriteIds
		),

		totalCount: state.listings.length,

		favoriteIds: [...state.favoriteIds],
		favoriteCount: state.favoriteIds.size,
		showOnlyFavorites: state.showOnlyFavorites,

		selectedListing: state.listings.find((l) => l.id === state.selectedId) ?? null,

		categories: ["all", ...new Set(state.listings.map((l) => l.category))],
		conditions: CONDITIONS,
	}
}

	/* ---------- subscribe / notify -------------------------------------- */

	function subscribe(listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	}

	function notify() {
		const viewState = buildViewState();
		for (const listener of listeners) listener(viewState);
	}

	/* ---------- actions -------------------------------------------------- */

	function showList() {
		state.screen = "list";
		state.selectedId = null;
		notify();
	}

	function showDetail(id) {
		state.screen = "detail";
		state.selectedId = id;
		notify();
	}

	function showNew() {
		state.screen = "new";
		notify();
	}

	function setSearch(text) {
		state.search = text;
		notify();
	}

	function setCategory(category) {
		state.category = category;
		notify();
	}

	function setSort(sortKey) {
		state.sort = sortKey
		notify()
	}

	function toggleFavorite(id) {
		if (state.favoriteIds.has(id)) {
			state.favoriteIds.delete(id)
		} else {
			state.favoriteIds.add(id)
		}
		writeFavoritesToStorage()
		notify()
	}

	function toggleFavoritesFilter() {
		state.showOnlyFavorites = !state.showOnlyFavorites
		notify()
	}

	/* input comes from FormData, which is always flat. The seller fields are
	   named sellerName, sellerPhone, sellerEmail, city and zip in the form,
	   and are assembled into the nested seller object here. */
	function addListing(input) {
		const listing = {
			id: crypto.randomUUID(),
			title: input.title,
			price: Number(input.price),
			category: input.category,
			description: input.description,
			condition: input.condition,
			imageUrl: input.imageUrl ?? "",
			createdAt: new Date().toISOString().slice(0, 10),
			seller: {
				name: input.sellerName,
				phone: input.sellerPhone,
				email: input.sellerEmail,
				location: {
					city: input.city,
					zip: input.zip,
				},
			},
		};
		state.listings = [listing, ...state.listings];
		writeToStorage();
		showDetail(listing.id);
		return listing;
	}

	// Called once by the controller to draw the first screen.
	function start() {
		notify();
	}

	return {
		subscribe,
		start,
		showList,
		showDetail,
		showNew,
		setSearch,
		setCategory,
		setSort,
		addListing,
		toggleFavorite,
		toggleFavoritesFilter,
	}
}
