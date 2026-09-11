import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

// Base path untuk GitHub Pages project site:
// https://vrachmd.github.io/petualangan-kode-rubina/
// Override via env SITE_BASE="" untuk custom domain.
const base = process.env.SITE_BASE ?? "/petualangan-kode-rubina/";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  base,
  prefetch: true,
  integrations: [preact({ compat: false })],
  build: {
    // "directory" (default Astro): pola/01-ab → pola/01-ab/index.html.
    // WAJIB untuk GitHub Pages agar URL /game/ ter-resolve.
    // ("file" memetakan /game/ → game.html yang hanya dimengerti preview lokal.)
    format: "directory",
  },
});
