/** Render dist/ → output/png/{id}.png (±300 DPI). */
import { chromium } from "playwright";
import { join } from "node:path";
import { PAGES } from "./pages.js";
import { withPreview, ensureDir } from "./lib.js";

const OUT = join(process.cwd(), "output", "png");
// A4 @96dpi CSS px × 3.125 ≈ 2480×3508 (300 DPI)
const W = 794;
const H = 1123;

async function main() {
  ensureDir(OUT);
  await withPreview(4322, async (base) => {
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({
        viewport: { width: W, height: H },
        deviceScaleFactor: 3.125,
      });
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(String(e)));
      for (const h of PAGES) {
        await page.goto(base + h.route, { waitUntil: "networkidle" });
        await page.evaluateHandle("document.fonts.ready");
        const overflow = await page.evaluate(
          () => document.documentElement.scrollHeight - window.innerHeight,
        );
        if (overflow > 2) {
          console.warn(
            `PERINGATAN ${h.id}: konten melebihi 1 halaman A4 (+${Math.round(overflow)}px)`,
          );
        }
        await page.screenshot({
          path: join(OUT, `${h.id}.png`),
          type: "png",
          clip: { x: 0, y: 0, width: W, height: H },
        });
        console.log(`PNG  ${h.id}`);
      }
      if (errors.length > 0) {
        console.error("CONSOLE ERROR:", errors);
        process.exitCode = 1;
      }
    } finally {
      await browser.close();
    }
  });
}

main();
