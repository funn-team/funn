/* ======================================================================
   src/js/format.js — VIEW HELPERS
   Used by the screens. Pure functions, no state.
   ====================================================================== */

/* Makes text safe to put into HTML.
   Without this, a listing title containing <script> would run as code.
   Everything that came from a user goes through escapeHtml. */
export function escapeHtml(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/* 3500 -> "3 500 kr" */
export function formatPrice(amount) {
	return `${new Intl.NumberFormat("nb-NO").format(amount)} kr`;
}

/* Image URLs come from the form, so they are user input going straight
   into a src attribute. Only http and https are allowed through —
   anything else returns an empty string and the screen shows a
   placeholder instead. */
export function safeImageUrl(value) {
	if (!value) return "";
	try {
		const url = new URL(value, window.location.href);
		return url.protocol === "http:" || url.protocol === "https:"
			? url.href
			: "";
	} catch {
		return "";
	}
}
