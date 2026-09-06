/** Ekstrak .worksheet → output/svg/{id}.svg (standalone via foreignObject + CSS). */
import { chromium } from "playwright";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PAGES } from "./pages.js";
import { withPreview, ensureDir } from "./lib.js";

const OUT = join(process.cwd(), "output", "svg");

function compiledCss(): string {
  const astroDir = join(process.cwd(), "dist", "_astro");
  const cssFile = readdirSync(astroDir).find((f) => f.endsWith(".css"));
  if (!cssFile) throw new Error("CSS hasil build tidak ditemukan di dist/_astro/");
  return readFileSync(join(astroDir, cssFile), "utf8");
}

async function main() {
  ensureDir(OUT);
  const css = compiledCss();
  await withPreview(4323, async (base) => {
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(String(e)));
      for (const h of PAGES) {
        await page.goto(base + h.route, { waitUntil: "networkidle" });
        await page.evaluateHandle("document.fonts.ready");
        const inner = await page.$eval(".worksheet", (el) => el.outerHTML);
        const doc =
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 794 1123" width="794" height="1123">` +
          `<foreignObject x="0" y="0" width="794" height="1123">` +
          `<div xmlns="http://www.w3.org/1999/xhtml" style="width:794px;height:1123px;background:#FAFAFA;">` +
          `<style>${css}</style>${inner}</div></foreignObject></svg>`;
        // Tulis mentah (tanpa SVGO): SVGO crash pada pseudo-element Tailwind,
        // dan ukurannya tetap kecil (CSS ~20KB). outerHTML browser sudah well-formed.
        writeFileSync(join(OUT, `${h.id}.svg`), doc);
        console.log(`SVG  ${h.id}`);
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
