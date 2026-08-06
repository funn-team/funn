/* ======================================================================
   src/js/model.js — MODEL
   All state and all data. No DOM, no timers.

   Other layers talk to the model through the functions returned here, and
   hear about changes through subscribe/notify.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { seedListings } from "./seed.js"

const STORAGE_KEY = "funn:listings"

export function createModel() {
	const listeners = new Set()

	const state = {
		listings: readFromStorage(),
		screen: "list", // "list" | "detail" | "new"
		selectedId: null,
		search: "",
		category: "all",
	}

	/* ---------- storage ------------------------------------------------ */

	function readFromStorage() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			return stored ? JSON.parse(stored) : [...seedListings]
		} catch {
			// Corrupt or blocked localStorage must not crash the app.
			return [...seedListings]
		}
	}

	function writeToStorage() {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state.listings))
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

	function filterListings(listings, search, category) {
		const text = search.trim().toLowerCase()
		return listings.filter((listing) => {
			const matchesText = text === "" || listing.title.toLowerCase().includes(text)
			const matchesCategory = category === "all" || listing.category === category
			return matchesText && matchesCategory
		})
	}

	function buildViewState() {
		return {
			screen: state.screen,
			search: state.search,
			category: state.category,
			visibleListings: filterListings(state.listings, state.search, state.category),
			totalCount: state.listings.length,
			selectedListing: state.listings.find((l) => l.id === state.selectedId) ?? null,
			categories: ["all", ...new Set(state.listings.map((l) => l.category))],
		}
	}

	/* ---------- subscribe / notify -------------------------------------- */

	function subscribe(listener) {
		listeners.add(listener)
		return () => listeners.delete(listener)
	}

	function notify() {
		const viewState = buildViewState()
		for (const listener of listeners) listener(viewState)
	}

	/* ---------- actions -------------------------------------------------- */

	function showList() {
		state.screen = "list"
		state.selectedId = null
		notify()
	}

	function showDetail(id) {
		state.screen = "detail"
		state.selectedId = id
		notify()
	}

	function showNew() {
		state.screen = "new"
		notify()
	}

	function setSearch(text) {
		state.search = text
		notify()
	}

	function setCategory(category) {
		state.category = category
		notify()
	}

	function addListing(input) {
		const listing = {
			id: crypto.randomUUID(),
			title: input.title,
			price: Number(input.price),
			category: input.category,
			description: input.description,
			location: input.location,
			imageUrl: input.imageUrl ?? "",
			createdAt: new Date().toISOString().slice(0, 10),
		}
		state.listings = [listing, ...state.listings]
		writeToStorage()
		showDetail(listing.id)
		return listing
	}

	// Called once by the controller to draw the first screen.
	function start() {
		notify()
	}

	return {
		subscribe,
		start,
		showList,
		showDetail,
		showNew,
		setSearch,
		setCategory,
		addListing,
	}
}
