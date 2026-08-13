import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
	root: "./src",
	/* envDir defaults to root, which is ./src — so without this Vite would
	   look for .env inside src/ and never see the one at the repo root that
	   the server already reads. One .env, both processes. */
	envDir: ".",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			"#": path.join(import.meta.dirname, "./"),
		},
	},
});
