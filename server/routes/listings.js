import { randomUUID } from "node:crypto";
import { Router } from "express";
import { CATEGORIES, CONDITIONS } from "#/data/seed.data.js";
import { pool } from "../db.js";

export const listingsRouter = Router();

/* pg parses a DATE column as local midnight, not UTC. toISOString() would
   convert that to UTC and can shift the day in either direction depending
   on the server's timezone offset, so read the local components back
   instead — they match what was actually stored. */
const toIsoDate = (date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/* Server-side mirror of validateListing in model.js — that one is UX only,
   this is the actual gate, since the API is reachable directly. Keep the
   rules in sync; they must not drift. */
const isValidLength = (text, min = 3, max = 80) =>
	typeof text === "string" && text.trim().length >= min && text.length <= max;
const isValidPrice = (price, min = 0, max = 999999) =>
	Number.isFinite(price) && price >= min && price <= max;
const isValidEmail = (email) =>
	typeof email === "string" &&
	/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const isValidPhone = (phone) =>
	typeof phone === "string" && /^\+?\d{8,}$/.test(phone.replace(/\s/g, ""));
const isValidZip = (zip) => typeof zip === "string" && /^\d{4}$/.test(zip);

function validateListingBody(body) {
	const { title, description, price, category, condition, seller, location } =
		body;
	const errors = {};

	if (!isValidLength(title, 3, 80)) errors.title = "Tittel må være 3–80 tegn";
	if (!isValidLength(description, 10, 500))
		errors.description = "Beskrivelse må være minst 10 tegn";
	if (!isValidPrice(Number(price)))
		errors.price = "Prisen må være et positivt tall";
	if (!CATEGORIES.includes(category)) errors.category = "Ugyldig kategori";
	if (!CONDITIONS.includes(condition)) errors.condition = "Ugyldig tilstand";
	if (!seller || !isValidLength(seller.name))
		errors.sellerName = "Navnet må være minst 3 tegn";
	if (!seller || !isValidEmail(seller.email))
		errors.sellerEmail = "Ugyldig e-postadresse";
	if (!seller || !isValidPhone(seller.phone))
		errors.sellerPhone = "Telefonnummer må ha minst 8 sifre";
	if (!location || !isValidZip(location.zip))
		errors.zip = "Postnummer må være 4 sifre";
	if (!location || !isValidLength(location.city, 2))
		errors.city = "Sted må være minst 2 tegn";

	return errors;
}

const rowToListing = (row) => ({
	id: row.id,
	title: row.title,
	description: row.description,
	price: row.price,
	category: row.category,
	condition: row.condition,
	imageUrl: row.image_url,
	createdAt: toIsoDate(row.created_at),
	sold: row.sold,
	seller: {
		name: row.seller_name,
		phone: row.seller_phone,
		email: row.seller_email,
	},
	location: {
		city: row.city,
		zip: row.zip,
	},
});

listingsRouter.get("/", async (_, res) => {
	const { rows } = await pool.query(
		"SELECT * FROM listings ORDER BY created_at DESC",
	);

	res.json(rows.map(rowToListing));
});

listingsRouter.get("/:id", async (req, res) => {
	const { rows } = await pool.query("SELECT * FROM listings WHERE id = $1", [
		req.params.id,
	]);

	if (rows.length === 0) return res.status(404).json({ error: "Not found" });

	res.json(rowToListing(rows[0]));
});

listingsRouter.post("/", async (req, res) => {
	const {
		title,
		description,
		price,
		category,
		condition,
		imageUrl,
		seller,
		location,
	} = req.body;

	const errors = validateListingBody(req.body);
	if (Object.keys(errors).length > 0) {
		return res.status(400).json({ error: "Valideringsfeil", errors });
	}

	const { rows } = await pool.query(
		`INSERT INTO listings
				(id, title, description, price, category, condition, image_url, seller_name, seller_phone, seller_email, city, zip)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)

		RETURNING *`,

		[
			randomUUID(),
			title,
			description,
			price,
			category,
			condition,
			imageUrl ?? "",
			seller.name,
			seller.phone,
			seller.email,
			location.city,
			location.zip,
		],
	);

	res.status(201).json(rowToListing(rows[0]));
});

listingsRouter.patch("/:id", async (req, res) => {
	const {
		title,
		description,
		price,
		category,
		condition,
		imageUrl,
		sold,
		seller,
		location,
	} = req.body;

	const errors = validateListingBody(req.body);
	if (Object.keys(errors).length > 0) {
		return res.status(400).json({ error: "Valideringsfeil", errors });
	}

	const { rows } = await pool.query(
		`UPDATE listings SET
				title = $1, description = $2, price = $3, category = $4, condition = $5,
				image_url = $6, seller_name = $7, seller_phone = $8, seller_email = $9,
				city = $10, zip = $11, sold = $12
		WHERE id = $13

		RETURNING *`,

		[
			title,
			description,
			price,
			category,
			condition,
			imageUrl ?? "",
			seller.name,
			seller.phone,
			seller.email,
			location.city,
			location.zip,
			sold ?? false,
			req.params.id,
		],
	);

	if (rows.length === 0) return res.status(404).json({ error: "Not found" });

	res.json(rowToListing(rows[0]));
});

listingsRouter.delete("/:id", async (req, res) => {
	const { rowCount } = await pool.query("DELETE FROM listings WHERE id = $1", [
		req.params.id,
	]);

	if (rowCount === 0) return res.status(404).json({ error: "Not found" });

	res.status(200).json({ message: "Listing deleted" });
});
