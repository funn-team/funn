CREATE TABLE IF NOT EXISTS listings(
	id UUID PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	price INTEGER NOT NULL CHECK(price >= 0),
	category TEXT NOT NULL,
	condition TEXT NOT NULL,
	image_url TEXT NOT NULL DEFAULT '',
	created_at DATE NOT NULL DEFAULT CURRENT_DATE,
	sold BOOLEAN NOT NULL DEFAULT false,
	seller_name TEXT NOT NULL,
	seller_phone TEXT NOT NULL,
	seller_email TEXT NOT NULL,
	city TEXT NOT NULL,
	zip TEXT NOT NULL
);
