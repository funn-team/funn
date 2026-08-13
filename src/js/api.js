/* VITE_API_URL has to be an absolute http(s) URL. A bare host such as
   "localhost" is not one: fetch would resolve it against the current page
   and every request would 404 with nothing in the console to explain why.
   Anything unusable is ignored in favour of the default. */
function resolveBaseUrl(value) {
	try {
		const { protocol, href } = new URL(value);
		return protocol === "http:" || protocol === "https:" ? href : null;
	} catch {
		return null;
	}
}

const BASE_URL =
	resolveBaseUrl(import.meta.env.VITE_API_URL) ??
	"http://localhost:3000/api/listings";

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
