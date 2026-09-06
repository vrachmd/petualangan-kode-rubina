/** Render dist/ → output/pdf/{id}.pdf + gabungan full PDF A4. */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { PAGES } from "./pages.js";
import { withPreview, ensureDir } from "./lib.js";

const OUT = join(process.cwd(), "output", "pdf");

async function main() {
  ensureDir(OUT);
  const files: string[] = [];
  await withPreview(4321, async (base) => {
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
        const target = join(OUT, `${h.id}.pdf`);
        await page.pdf({
          path: target,
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
        });
        files.push(target);
        console.log(`PDF  ${h.id}`);
      }
      if (errors.length > 0) {
        console.error("CONSOLE ERROR:", errors);
        process.exitCode = 1;
      }
    } finally {
      await browser.close();
    }
  });

  // Gabung jadi satu file
  const merged = await PDFDocument.create();
  for (const f of files) {
    const doc = await PDFDocument.load(readFileSync(f));
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    for (const p of pages) merged.addPage(p);
  }
  const fullPath = join(OUT, "petualangan-kode-rubina-full.pdf");
  writeFileSync(fullPath, await merged.save());
  console.log(`PDF full → ${fullPath}`);
}

main();
