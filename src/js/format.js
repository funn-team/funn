/* ======================================================================
   src/js/format.js — SMÅHJELPERE FOR VIEW
   Brukes av skjermene. Ingen state her, bare rene funksjoner.
   ====================================================================== */

/* Gjør tekst trygg å legge inn i HTML.
   Uten denne kan en annonsetittel som inneholder <script> kjøre kode.
   Alt som kommer fra bruker skal gjennom escapeHtml. */
export function escapeHtml(verdi) {
	return String(verdi ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;")
}

/* 3500 -> "3 500 kr" */
export function kroner(beløp) {
	return `${new Intl.NumberFormat("nb-NO").format(beløp)} kr`
}
