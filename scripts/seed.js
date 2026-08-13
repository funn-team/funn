// @ts-check

import { seedListings } from "#/data/seed.data.js";
import { pool } from "#/server/db.js";

await pool.query("DELETE FROM listings");

for (const listing of seedListings) {
	await pool.query(
		`INSERT INTO listings
                      (id, title, description, price, category, condition, image_url, created_at, sold, seller_name, seller_phone, seller_email, city, zip)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
		[
			listing.id,
			listing.title,
			listing.description,
			listing.price,
			listing.category,
			listing.condition,
			listing.imageUrl,
			listing.createdAt,
			listing.sold,
			listing.seller.name,
			listing.seller.phone,
			listing.seller.email,
			listing.location.city,
			listing.location.zip,
		],
	);
}

console.log(`Seeded ${seedListings.length} listings.`);
await pool.end();
