import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import cors from "cors";
import express from "express";
import { listingsRouter } from "./routes/listings.js";

const app = express();
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../dist");

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api/listings", listingsRouter);

/* The built frontend and its client-side routes. Anything that isn't
   /api/* gets index.html, so a refresh or a shared link on a route like
   /annonse/<id> reaches the router in controller.js instead of 404ing. */
app.use(express.static(distDir));
app.get(/^(?!\/api\/).*/, (_, res) => res.sendFile(path.join(distDir, "index.html")));

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
	console.log(`funn API listening on http://localhost:${port}`);
});
