import { randomUUID } from "node:crypto";
import { Router } from "express";
import { pool } from "../db.js";

export const listingsRouter = Router();

/* pg parses a DATE column as local midnight, not UTC. toISOString() would
   convert that to UTC and can shift the day in either direction depending
   on the server's timezone offset, so read the local components back
   instead — they match what was actually stored. */
const toIsoDate = (date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

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

	if (!seller || !location) {
		return res.status(400).json({ error: "Selger og sted er nødvendig" });
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

	if (!seller || !location) {
		return res.status(400).json({ error: "Selger og sted er nødvendig" });
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
