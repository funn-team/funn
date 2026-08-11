const BASE_URL = "http://localhost:3000/api/listings";

export async function fetchGetListings() {
	const res = await fetch(BASE_URL);

	if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

	return res.json();
}

export async function fetchCreateListing(input) {
	const res = await fetch(BASE_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

	return res.json();
}

export async function fetchUpdateListing(id, input) {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

	return res.json();
}

export async function fetchDeleteListing(id) {
	const res = await fetch(`${BASE_URL}/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

	return res.json();
}
