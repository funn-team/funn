import "dotenv/config";
import cors from "cors";
import express from "express";
import { listingsRouter } from "./routes/listings.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true }));
app.use("/api/listings", listingsRouter);

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
	console.log(`funn API listening on http://localhost:${port}`);
});
