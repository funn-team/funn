/* ======================================================================
   src/js/seed.js — SEED DATA
   The listings the app starts with, so the demo is never empty. After the
   first load the data lives in localStorage.

   Norwegian text here is content shown to the user, not identifiers.

   Maintainer: see README. Anyone may add more listings.
   ====================================================================== */

export const CATEGORIES = [
	"Sport og friluft",
	"Møbler og interiør",
	"Elektronikk og hvitevarer",
	"Bil, båt, MC og utstyr",
	"Foreldre og barn",
	"Dyr og utstyr",
	"Klær og kosmetikk",
	"Fritid, hobby og underholdning",
];

export const CONDITIONS = [
	"Ny / ubrukt",
	"Pent brukt",
	"Brukt",
	"Synlig brukt",
	"Ødelagt / trenger reparasjon",
];

const listingExample = {
	/** @type {string} **/
	// UUID
	id: "bd2a38ca-22e9-4c8e-a647-2d6aaf7a837b",

	/** @type {string} **/
	// Title for the listing
	title: "Brukt terrengsykkel",

	/** @type {string} **/
	// Description
	description: "Lite brukt, ny kjede. Passer høyde 170–185 cm.",

	/** @type {number} **/
	// Price for the listing
	price: 3500,

	/** @type {typeof CATEGORIES[number]} **/
	// Must be one of CATEGORIES
	category: "Sport og friluft",

	/** @type {string} **/
	// Image URL
	imageUrl:
		"https://images.pexels.com/photos/7614428/pexels-photo-7614428.jpeg",

	/** @type {string} **/
	// ISO date (YYYY-MM-DD)
	createdAt: "2026-08-03",

	/** @type {typeof CONDITIONS[number]} **/
	// Must be one of CONDITIONS
	condition: "Pent brukt",

	/** @type {{name: string, phone: string, email: string, location: {city: string, zip: string}}} **/
	seller: {
		name: "Ola Nordmann",
		phone: "+47 924 51 067",
		email: "ola.nordmann@gmail.com",
		location: {
			city: "Lillehammer",
			zip: "2609",
		},
	},
};

/** @type {typeof listingExample[]} **/
export const seedListings = [
	{
		id: "bd2a38ca-22e9-4c8e-a647-2d6aaf7a837b",
		title: "Brukt terrengsykkel",
		price: 3500,
		category: "Sport og friluft",
		description: "Lite brukt, ny kjede. Passer høyde 170–185 cm.",
		imageUrl:
			"https://images.pexels.com/photos/7614428/pexels-photo-7614428.jpeg",
		createdAt: "2026-08-03",
		condition: "Pent brukt",
		seller: {
			name: "Ola Nordmann",
			phone: "+47 924 51 067",
			email: "ola.nordmann@gmail.com",
			location: {
				city: "Lillehammer",
				zip: "2609",
			},
		},
	},
	{
		id: "845cf98b-e50b-4700-babb-f015b628ea11",
		title: "Sofa i mørk grønn velur",
		price: 2200,
		category: "Møbler og interiør",
		description: "Tresitter. Noen bruksmerker på venstre armlene.",
		imageUrl:
			"https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg",
		createdAt: "2026-08-04",
		condition: "Synlig brukt",
		seller: {
			name: "Kari Haugen",
			phone: "+47 456 12 345",
			email: "kari.haugen@outlook.com",
			location: {
				city: "Gjøvik",
				zip: "2815",
			},
		},
	},
	{
		id: "d41126e3-528a-4259-80b5-952f5f599251",
		title: "Skrivebord med hev og senk",
		price: 1800,
		category: "Møbler og interiør",
		description: "Elektrisk. Fungerer som det skal, hentes selv.",
		imageUrl:
			"https://images.pexels.com/photos/36181031/pexels-photo-36181031.jpeg",
		createdAt: "2026-08-04",
		condition: "Brukt",
		seller: {
			name: "Per Solberg",
			phone: "+47 908 77 234",
			email: "per.solberg@hotmail.com",
			location: {
				city: "Hamar",
				zip: "2317",
			},
		},
	},
	{
		id: "d8d45ac5-e7f3-4d3c-a47d-f70c8d840021",
		title: "Spillkonsoll med to spill",
		price: 2400,
		category: "Elektronikk og hvitevarer",
		description: "Alt originalt tilbehør følger med.",
		imageUrl:
			"https://images.pexels.com/photos/9281230/pexels-photo-9281230.jpeg",
		createdAt: "2026-08-05",
		condition: "Ny / ubrukt",
		seller: {
			name: "Mona Iversen",
			phone: "+47 991 23 456",
			email: "mona.iversen@gmail.com",
			location: {
				city: "Lillehammer",
				zip: "2609",
			},
		},
	},
	{
		id: "2d4eb8a7-5fd6-4fe4-b950-dac3a5c2dafd",
		title: "Vinterdekk 205/55 R16",
		price: 1200,
		category: "Bil, båt, MC og utstyr",
		description: "Fire stk, piggfrie. Cirka 60 prosent mønsterdybde igjen.",
		imageUrl:
			"https://images.pexels.com/photos/37002235/pexels-photo-37002235.jpeg",
		createdAt: "2026-08-05",
		condition: "Brukt",
		seller: {
			name: "Erik Fjeld",
			phone: "+47 402 88 123",
			email: "erik.fjeld@yahoo.com",
			location: {
				city: "Ringsaker",
				zip: "2380",
			},
		},
	},
	{
		id: "9ce77f8c-8e98-4722-9b9f-26f05602fbfb",
		title: "Barnevogn, komplett sett",
		price: 4000,
		category: "Foreldre og barn",
		description: "Bag, sportsdel og bilstol. Røykfritt hjem.",
		imageUrl:
			"https://images.pexels.com/photos/5094359/pexels-photo-5094359.jpeg",
		createdAt: "2026-08-06",
		condition: "Ødelagt / trenger reparasjon",
		seller: {
			name: "Silje Berg",
			phone: "+47 967 45 210",
			email: "silje.berg@gmail.com",
			location: {
				city: "Gjøvik",
				zip: "2815",
			},
		},
	},
];
