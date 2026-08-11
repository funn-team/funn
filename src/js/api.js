const BASE_URL = "http://localhost:3000/api/listings";

export async function fetchListings() {
	const res = await fetch(BASE_URL);
	if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
	return res.json();
}

// export async function createListing(input) { ... }   // POST /
// export async function updateListing(id, input) { ... } // PATCH /:id
// export async function deleteListing(id) { ... }       // DELETE /:id
