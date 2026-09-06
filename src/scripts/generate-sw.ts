/** Bangun service worker offline (precache seluruh dist/). Jalan SETELAH astro build. */
import { generateSW } from "workbox-build";
import { SITE_BASE } from "./pages.js";

async function main() {
  const { count, size, warnings } = await generateSW({
    globDirectory: "dist",
    globPatterns: ["**/*.{html,js,css,svg,png,woff2,mp3}"],
    swDest: "dist/sw.js",
    // dist/ di-serve di bawah base path saat deploy.
    // Penting: trailing slash agar "audio/x.mp3" → "/base/audio/x.mp3"
    // (tanpa slash jadi "/baseaudio/x.mp3" → precache 404 → SW mati).
    modifyURLPrefix: { "": `${SITE_BASE}/` },
    clientsClaim: true,
    skipWaiting: true,
  });
  for (const w of warnings) console.warn("SW:", w);
  console.log(`SW OK: ${count} file (${(size / 1024).toFixed(0)}KB) → dist/sw.js`);
}

main();
