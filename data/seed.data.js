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

	/** @type {{name: string, phone: string, email: string}} **/
	seller: {
		name: "Ola Nordmann",
		phone: "+47 400 00 001",
		email: "ola.nordmann@example.com",
	},

	/** @type {{city: string, zip: string}} **/
	location: {
		city: "Lillehammer",
		zip: "2609",
	},

	/** @type {boolean} **/
	sold: false,
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
		sold: false,
		seller: {
			name: "Ola Nordmann",
			phone: "+47 400 00 001",
			email: "ola.nordmann@example.com",
		},
		location: {
			city: "Lillehammer",
			zip: "2609",
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
		sold: false,
		seller: {
			name: "Kari Haugen",
			phone: "+47 400 00 002",
			email: "kari.haugen@example.com",
		},
		location: {
			city: "Gjøvik",
			zip: "2815",
		},
	},
	{
		id: "d41126e3-528a-4259-80b5-952f5f599251",
		title: "Skrivebord med hev og senk",
		price: 1800,
		category: "Møbler og interiør",
		description: "Elektrisk. Fungerer som det skal, hentes selv.",
		imageUrl:
			"https://images.pexels.com/photos/8001034/pexels-photo-8001034.jpeg",
		createdAt: "2026-08-04",
		condition: "Brukt",
		sold: false,
		seller: {
			name: "Per Solberg",
			phone: "+47 400 00 003",
			email: "per.solberg@example.com",
		},
		location: {
			city: "Hamar",
			zip: "2317",
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
		sold: false,
		seller: {
			name: "Mona Iversen",
			phone: "+47 400 00 004",
			email: "mona.iversen@example.com",
		},
		location: {
			city: "Lillehammer",
			zip: "2609",
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
		sold: false,
		seller: {
			name: "Erik Fjeld",
			phone: "+47 400 00 005",
			email: "erik.fjeld@example.com",
		},
		location: {
			city: "Ringsaker",
			zip: "2380",
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
		sold: true,
		seller: {
			name: "Silje Berg",
			phone: "+47 400 00 006",
			email: "silje.berg@example.com",
		},
		location: {
			city: "Gjøvik",
			zip: "2815",
		},
	},
	{
		id: "acd0e610-3edb-4b0b-b73c-57af460bd1e8",
		title: "El-gitar med forsterker",
		price: 5500,
		category: "Fritid, hobby og underholdning",
		description: "Selges samlet med liten øvingsforsterker og kabel.",
		imageUrl:
			"https://images.pexels.com/photos/375893/pexels-photo-375893.jpeg",
		createdAt: "2026-07-28",
		condition: "Pent brukt",
		sold: false,
		seller: {
			name: "Jonas Lien",
			phone: "+47 400 00 007",
			email: "jonas.lien@example.com",
		},
		location: {
			city: "Elverum",
			zip: "2406",
		},
	},
	{
		id: "1dfa41e4-1530-46d2-8112-163b4697b27f",
		title: "Kattetre i lys eik",
		price: 350,
		category: "Dyr og utstyr",
		description: "Halvannen meter høyt. Vasket, litt slitt på toppen.",
		imageUrl:
			"https://images.pexels.com/photos/2083940/pexels-photo-2083940.jpeg",
		createdAt: "2026-07-30",
		condition: "Brukt",
		sold: false,
		seller: {
			name: "Ingrid Moen",
			phone: "+47 400 00 008",
			email: "ingrid.moen@example.com",
		},
		location: {
			city: "Brumunddal",
			zip: "2380",
		},
	},
	{
		id: "84c4bd7b-0211-4128-a858-94aa059c9f55",
		title: "Ullkåpe, str. M",
		price: 900,
		category: "Klær og kosmetikk",
		description: "Mørk grå, 80 prosent ull. Brukt en sesong.",
		imageUrl:
			"https://images.pexels.com/photos/19129082/pexels-photo-19129082.jpeg",
		createdAt: "2026-08-01",
		condition: "Pent brukt",
		sold: false,
		seller: {
			name: "Hanne Dahl",
			phone: "+47 400 00 009",
			email: "hanne.dahl@example.com",
		},
		location: {
			city: "Hamar",
			zip: "2317",
		},
	},
	{
		id: "0c48486c-f214-4464-a367-d82cca8a9190",
		title: "Bokhylle i heltre furu",
		price: 1500,
		category: "Møbler og interiør",
		description:
			"Fem hyller, 180 cm høy. Må hentes, tas ikke fra hverandre.",
		imageUrl:
			"https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg",
		createdAt: "2026-08-02",
		condition: "Brukt",
		sold: false,
		seller: {
			name: "Trond Aasen",
			phone: "+47 400 00 010",
			email: "trond.aasen@example.com",
		},
		location: {
			city: "Moelv",
			zip: "2390",
		},
	},
	{
		id: "cc58b604-18eb-4394-ba71-204af523f205",
		title: "Speilreflekskamera med zoomobjektiv",
		price: 2900,
		category: "Elektronikk og hvitevarer",
		description: "Lite brukt. Veske, lader og to batterier følger med.",
		imageUrl:
			"https://images.pexels.com/photos/6598820/pexels-photo-6598820.jpeg",
		createdAt: "2026-08-06",
		condition: "Pent brukt",
		sold: false,
		seller: {
			name: "Camilla Rud",
			phone: "+47 400 00 011",
			email: "camilla.rud@example.com",
		},
		location: {
			city: "Lillehammer",
			zip: "2609",
		},
	},
	{
		id: "447d3a54-a7b3-4266-94a9-d509bdc816b6",
		title: "Firemannstelt",
		price: 1200,
		category: "Sport og friluft",
		description: "To rom, brukt tre turer. Alle plugger og barduner med.",
		imageUrl:
			"https://images.pexels.com/photos/4268094/pexels-photo-4268094.jpeg",
		createdAt: "2026-08-07",
		condition: "Pent brukt",
		sold: true,
		seller: {
			name: "Marius Strand",
			phone: "+47 400 00 012",
			email: "marius.strand@example.com",
		},
		location: {
			city: "Otta",
			zip: "2670",
		},
	},
];
