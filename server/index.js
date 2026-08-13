import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import cors from "cors";
import express from "express";
import { listingsRouter } from "./routes/listings.js";

const app = express();
const distDir = path.join(
	path.dirname(fileURLToPath(import.meta.url)),
	"../dist",
);

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api/listings", listingsRouter);

/* The built frontend and its client-side routes. Anything that isn't
   /api/* gets index.html, so a refresh or a shared link on a route like
   /annonse/<id> reaches the router in controller.js instead of 404ing. */
app.use(express.static(distDir));
app.get(/^(?!\/api\/).*/, (_, res) =>
	res.sendFile(path.join(distDir, "index.html")),
);

// Last middleware wins the error. Log the detail, return a generic message —
// the client never needs our stack.
app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(500).json({ error: "Noe gikk galt" });
});

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
	console.log(`funn API listening on http://localhost:${port}`);
});
