// @ts-check

/* ======================================================================
   src/js/model.js — MODEL
   All state and all data. No DOM, no timers.

   Other layers talk to the model through the functions returned here, and
   hear about changes through subscribe/notify.

   Maintainer: see README. Anyone may work here — say so first.
   ====================================================================== */

import { CONDITIONS } from "#/data/seed.data";
import {
	fetchCreateListing,
	fetchDeleteListing,
	fetchGetListings,
	fetchUpdateListing,
} from "./api";

const FAVORITES_KEY = "funn:favorites";

/* Fixed list rather than derived from the data, so the form offers the
   same options even when no listing uses a given condition yet. */

export function createModel() {
	const listeners = new Set();

	const state = {
		listings: [],

		//options: "list" | "detail" | "new"
		screen: "list",

		selectedId: null,
		search: "",
		category: "all",

		confirmDeleteId: null,

		favoriteIds: readFavoritesFromStorage(),
		showOnlyFavorites: false,
		minPrice: "",
		maxPrice: "",
		// options: 'price-asc', 'price-desc', 'date-desc', 'date-asc'
		sort: "date-desc",

		form: {
			values: {},
			errors: {},
		},

		loading: true,
		loadError: false,
		actionError: false,
	};

	function readFavoritesFromStorage() {
		try {
			const stored = localStorage.getItem(FAVORITES_KEY);
			if (!stored) return new Set();

			const parsed = JSON.parse(stored);

			if (!Array.isArray(parsed)) {
				return new Set();
			}
			return new Set(parsed);
		} catch {
			return new Set();
		}
	}

	function writeFavoritesToStorage() {
		try {
			localStorage.setItem(
				FAVORITES_KEY,
				JSON.stringify(Array.from(state.favoriteIds)),
			);
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

	function filterListings(
		listings,
		search,
		category,
		showOnlyFavorites,
		favorites,
		minPrice,
		maxPrice,
	) {
		const text = search.trim().toLowerCase();
		return listings.filter((listing) => {
			const matchesText =
				text === "" || listing.title.toLowerCase().includes(text);
			const matchesCategory =
				category === "all" || listing.category === category;
			const matchesFavorites = !showOnlyFavorites || favorites.has(listing.id);
			const matchesMinPrice =
				minPrice === "" || Number(listing.price) >= Number(minPrice);
			const matchesMaxPrice =
				maxPrice === "" || Number(listing.price) <= Number(maxPrice);
			return (
				matchesText &&
				matchesCategory &&
				matchesFavorites &&
				matchesMinPrice &&
				matchesMaxPrice
			);
		});
	}

	function sortListings(listings, sortKey) {
		// Operate on a shallow copy so original state is never mutated.
		const copy = [...listings];
		switch (sortKey) {
			case "price-asc":
				return copy.sort(
					(a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
				);
			case "price-desc":
				return copy.sort(
					(a, b) => (Number(b.price) || 0) - (Number(a.price) || 0),
				);
			case "date-asc":
				// createdAt is stored as ISO YYYY-MM-DD so lexicographic compare works
				return copy.sort((a, b) =>
					(a.createdAt || "").localeCompare(b.createdAt || ""),
				);
			default:
				return copy.sort((a, b) =>
					(b.createdAt || "").localeCompare(a.createdAt || ""),
				);
		}
	}

	function buildViewState() {
		const categoryCounts = {};

		state.listings.forEach((listing) => {
			categoryCounts[listing.category] =
				(categoryCounts[listing.category] || 0) + 1;
		});

		const filtered = filterListings(
			state.listings,
			state.search,
			state.category,
			state.showOnlyFavorites,
			state.favoriteIds,
			state.minPrice,
			state.maxPrice,
		);

		return {
			screen: state.screen,
			search: state.search,
			category: state.category,
			categoryCounts: categoryCounts,

			visibleListings: sortListings(filtered, state.sort),

			totalCount: state.listings.length,

			sort: state.sort,
			minPrice: state.minPrice,
			maxPrice: state.maxPrice,

			favoriteIds: [...state.favoriteIds],
			favoriteCount: state.favoriteIds.size,
			showOnlyFavorites: state.showOnlyFavorites,

			selectedListing:
				state.listings.find((l) => l.id === state.selectedId) ?? null,

			categories: ["all", ...new Set(state.listings.map((l) => l.category))],
			conditions: CONDITIONS,
			confirmDeleteId: state.confirmDeleteId,

			form: {
				values: state.form.values,
				errors: state.form.errors,
			},

			loading: state.loading,
			loadError: state.loadError,
			actionError: state.actionError,
		};
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
		state.actionError = false;
		notify();
	}

	function showDetail(id) {
		state.screen = "detail";
		state.selectedId = id;
		state.actionError = false;
		notify();
	}

	function showNew() {
		state.screen = "new";
		state.actionError = false;
		notify();
	}

	function showEdit(id) {
		state.screen = "edit";
		state.selectedId = id;
		state.actionError = false;
		notify();
	}

	function requestDelete(id) {
		state.confirmDeleteId = id;
		notify();
	}

	function cancelDelete() {
		state.confirmDeleteId = null;
		notify();
	}

	async function withActionError(fn) {
		state.actionError = false;
		try {
			return await fn();
		} catch {
			state.actionError = true;
			notify();
		}
	}

	async function confirmDelete() {
		return await withActionError(async () => {
			await fetchDeleteListing(state.confirmDeleteId);

			state.listings = state.listings.filter(
				(listing) => listing.id !== state.confirmDeleteId,
			);

			showList();
			return true;
		});
	}

	async function updateListing(id, input) {
		const listing = state.listings.find((item) => item.id === id);
		if (!listing) return;

		const updated = {
			...listing,
			title: input.title,
			price: Number(input.price),
			category: input.category,
			description: input.description,
			condition: input.condition,
			imageUrl: input.imageUrl ?? "",
			seller: {
				name: input.sellerName,
				phone: input.sellerPhone,
				email: input.sellerEmail,
			},
			location: { city: input.city, zip: input.zip },
		};

		const errors = validateListing(updated);
		if (Object.keys(errors).length > 0) {
			state.form.errors = errors;
			notify();
			return;
		}

		state.form.errors = {};

		return await withActionError(async () => {
			await fetchUpdateListing(id, updated);

			state.listings = state.listings.map((item) =>
				item.id === id ? updated : item,
			);

			showDetail(id);
			return updated;
		});
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
		state.sort = sortKey;
		notify();
	}

	function toggleFavorite(id) {
		if (state.favoriteIds.has(id)) {
			state.favoriteIds.delete(id);
		} else {
			state.favoriteIds.add(id);
		}
		writeFavoritesToStorage();
		notify();
	}

	function toggleFavoritesFilter() {
		state.showOnlyFavorites = !state.showOnlyFavorites;
		notify();
	}

	function setFormValue(name, value) {
		state.form.values[name] = value;
	}

	function clearFormValues() {
		state.form.values = {};
		state.form.errors = {};
	}

	async function toggleSold(id) {
		const listing = state.listings.find((item) => item.id === id);
		if (!listing) return;

		const updated = { ...listing, sold: !listing.sold };

		await withActionError(async () => {
			await fetchUpdateListing(id, updated);

			state.listings = state.listings.map((item) =>
				item.id === id ? updated : item,
			);

			notify();
		});
	}

	/* input comes from FormData, which is always flat. The seller fields are
	   named sellerName, sellerPhone and sellerEmail, and the location fields
	   are named city and zip. They are assembled into seller and location,
	   two sibling objects on the listing. Renaming a field in the form means
	   renaming it here too. */

	async function addListing(input) {
		const listing = {
			title: input.title,
			price: Number(input.price),
			category: input.category,
			description: input.description,
			condition: input.condition,
			imageUrl: input.imageUrl ?? "",
			sold: false,
			seller: {
				name: input.sellerName,
				phone: input.sellerPhone,
				email: input.sellerEmail,
			},
			location: {
				city: input.city,
				zip: input.zip,
			},
		};

		const errors = validateListing(listing);
		if (Object.keys(errors).length > 0) {
			state.form.errors = errors;
			notify();
			return;
		}

		return await withActionError(async () => {
			const created = await fetchCreateListing(listing);

			clearFormValues();
			state.listings = [created, ...state.listings];
			showDetail(created.id);
			return created;
		});
	}

	/* The price fields are type="text", so anything can be typed into them.
	   Number("1 200") is NaN, and every comparison against NaN is false, so
	   an unfiltered value would empty the list instead of filtering it.
	   Stripping to digits means "1 200 kr" narrows to 1200 as you type. */
	function onlyDigits(value) {
		return String(value ?? "").replace(/\D/g, "");
	}

	function setMinPrice(value) {
		state.minPrice = onlyDigits(value);
		notify();
	}

	function setMaxPrice(value) {
		state.maxPrice = onlyDigits(value);
		notify();
	}

	function validateListing(listing) {
		const isValidLength = (text, min = 3, max = 80) =>
			text.length >= min && text.length <= max;

		const isValidPrice = (price, min = 0, max = 999999) =>
			Number.isFinite(price) && price >= min && price <= max;

		const isValidEmail = (email) =>
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

		const isValidPhone = (phone) =>
			/^\+?\d{8,}$/.test(phone.replace(/\s/g, ""));

		const isValidZip = (zip) => /^\d{4}$/.test(zip);

		const isValidUrl = (url) => URL.canParse(url);

		const errors = {};

		if (!isValidLength(listing.title, 3, 80))
			errors.title = "Tittel må være 3–80 tegn";
		if (!isValidLength(listing.description, 10, 500))
			errors.description = "Beskrivelse må være minst 10 tegn";
		if (!isValidPrice(Number(listing.price)))
			errors.price = "Prisen må være et positivt tall";
		if (!isValidZip(listing.location.zip))
			errors.zip = "Postnummer må være 4 sifre";
		if (!isValidLength(listing.location.city))
			errors.city = "Sted må være minst 2 tegn";
		if (!isValidLength(listing.seller.name))
			errors.sellerName = "Navnet ditt må være minst 3 tegn";
		if (!isValidEmail(listing.seller.email))
			errors.sellerEmail = "Ugyldig e-postadresse";
		if (!isValidPhone(listing.seller.phone))
			errors.sellerPhone = "Telefonnummer må ha minst 8 sifre";
		if (listing.imageUrl && !isValidUrl(listing.imageUrl))
			errors.imageUrl = "Ugyldig URL";

		return errors;
	}

	// Called once by the controller to draw the first screen.
	async function start() {
		notify();

		try {
			state.listings = await fetchGetListings();
		} catch {
			state.loadError = true;
		} finally {
			state.loading = false;
		}

		notify();
	}

	return {
		subscribe,
		start,
		showList,
		showDetail,
		showNew,
		showEdit,
		requestDelete,
		cancelDelete,
		confirmDelete,
		updateListing,
		setSearch,
		setCategory,
		setSort,
		setFormValue,
		addListing,
		toggleSold,
		toggleFavorite,
		toggleFavoritesFilter,
		setMinPrice,
		setMaxPrice,
	};
}
