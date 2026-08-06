/* ======================================================================
   src/js/model.js — MODEL
   All state og alle data. Ingen DOM, ingen timere.
   Andre lag snakker med modellen gjennom funksjonene som returneres her,
   og får beskjed om endringer via subscribe/notify.

   Eier: Person B
   ====================================================================== */

import { seedAnnonser } from "./seed.js"

const LAGRINGSNØKKEL = "funn:annonser"

export function createModel() {
	const lyttere = new Set()

	const state = {
		annonser: lesFraLagring(),
		skjerm: "liste", // "liste" | "detalj" | "ny"
		valgtId: null,
		søk: "",
		kategori: "alle",
	}

	/* ---------- lagring ---------------------------------------------- */

	function lesFraLagring() {
		try {
			const lagret = localStorage.getItem(LAGRINGSNØKKEL)
			return lagret ? JSON.parse(lagret) : [...seedAnnonser]
		} catch {
			// Ødelagt eller blokkert localStorage skal ikke krasje appen.
			return [...seedAnnonser]
		}
	}

	function skrivTilLagring() {
		try {
			localStorage.setItem(LAGRINGSNØKKEL, JSON.stringify(state.annonser))
		} catch {
			// Full eller avslått lagring: appen fungerer, dataene overlever
			// bare ikke en refresh. Bedre enn å krasje under demoen.
		}
	}

	/* ---------- utledet data ------------------------------------------
	   View skal aldri regne selv. byggViewState samler alt view trenger,
	   ferdig filtrert, og sendes med hver notify.
	   ------------------------------------------------------------------ */

	function filtrer(annonser, søk, kategori) {
		const tekst = søk.trim().toLowerCase()
		return annonser.filter((annonse) => {
			const treffPåTekst = tekst === "" || annonse.tittel.toLowerCase().includes(tekst)
			const treffPåKategori = kategori === "alle" || annonse.kategori === kategori
			return treffPåTekst && treffPåKategori
		})
	}

	function byggViewState() {
		return {
			skjerm: state.skjerm,
			søk: state.søk,
			kategori: state.kategori,
			synligeAnnonser: filtrer(state.annonser, state.søk, state.kategori),
			antallTotalt: state.annonser.length,
			valgtAnnonse: state.annonser.find((a) => a.id === state.valgtId) ?? null,
			kategorier: ["alle", ...new Set(state.annonser.map((a) => a.kategori))],
		}
	}

	/* ---------- subscribe / notify ------------------------------------ */

	function subscribe(lytter) {
		lyttere.add(lytter)
		return () => lyttere.delete(lytter)
	}

	function notify() {
		const viewState = byggViewState()
		for (const lytter of lyttere) lytter(viewState)
	}

	/* ---------- handlinger -------------------------------------------- */

	function visListe() {
		state.skjerm = "liste"
		state.valgtId = null
		notify()
	}

	function visDetalj(id) {
		state.skjerm = "detalj"
		state.valgtId = id
		notify()
	}

	function visNy() {
		state.skjerm = "ny"
		notify()
	}

	function settSøk(tekst) {
		state.søk = tekst
		notify()
	}

	function settKategori(kategori) {
		state.kategori = kategori
		notify()
	}

	function leggTilAnnonse(data) {
		const annonse = {
			id: crypto.randomUUID(),
			tittel: data.tittel,
			pris: Number(data.pris),
			kategori: data.kategori,
			beskrivelse: data.beskrivelse,
			sted: data.sted,
			bildeUrl: data.bildeUrl ?? "",
			opprettet: new Date().toISOString().slice(0, 10),
		}
		state.annonser = [annonse, ...state.annonser]
		skrivTilLagring()
		visDetalj(annonse.id)
		return annonse
	}

	// Kalles én gang av controlleren for å tegne første skjerm.
	function start() {
		notify()
	}

	return {
		subscribe,
		start,
		visListe,
		visDetalj,
		visNy,
		settSøk,
		settKategori,
		leggTilAnnonse,
	}
}
