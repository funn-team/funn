import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	root: "./src",
	/* envDir defaults to root, which is ./src, so Vite would look for .env
	   inside src/ and never see the one at the repo root that the server
	   already reads. A relative path here would resolve against root and
	   land in src/ again — hence the absolute one. One .env, both
	   processes. */
	envDir: import.meta.dirname,
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
