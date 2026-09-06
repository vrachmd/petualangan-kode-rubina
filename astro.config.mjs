import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
      applyBaseStyles: false,
    }),
  ],
  build: {
    format: "file",
  },
});
