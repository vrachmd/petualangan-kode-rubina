import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import preact from "@astrojs/preact";

// Base path untuk GitHub Pages project site:
// https://vrachmd.github.io/petualangan-kode-rubina/
// Override via env SITE_BASE="" untuk custom domain.
const base = process.env.SITE_BASE ?? "/petualangan-kode-rubina/";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  base,
  prefetch: true,
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
      applyBaseStyles: false,
    }),
    preact({ compat: false }),
  ],
  build: {
    format: "file",
  },
});
