/** QA otomatis output/. Exit 1 bila ada cek gagal. */
import { existsSync, readFileSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { PAGES } from "./pages.js";

const OUT = process.cwd() + "/output";
let gagal = 0;

function cek(nama: string, lolos: boolean, detail = "") {
  console.log(`${lolos ? "OK  " : "GAGAL"} ${nama}${detail ? ` — ${detail}` : ""}`);
  if (!lolos) gagal++;
}

async function main() {
  // 1) Kelengkapan file
  for (const h of PAGES) {
    cek(`pdf/${h.id}.pdf ada`, existsSync(join(OUT, "pdf", `${h.id}.pdf`)));
    cek(`png/${h.id}.png ada`, existsSync(join(OUT, "png", `${h.id}.png`)));
    cek(`svg/${h.id}.svg ada`, existsSync(join(OUT, "svg", `${h.id}.svg`)));
  }
  const fullPdf = join(OUT, "pdf", "petualangan-kode-rubina-full.pdf");
  cek("full PDF ada", existsSync(fullPdf));

  // 2) Ukuran PDF
  if (existsSync(fullPdf)) {
    const total = statSync(fullPdf).size;
    cek("total PDF < 5MB", total < 5_000_000, `${(total / 1e6).toFixed(2)}MB`);
  }
  for (const h of PAGES) {
    const p = join(OUT, "pdf", `${h.id}.pdf`);
    if (existsSync(p)) {
      cek(`pdf ${h.id} < 500KB`, statSync(p).size < 500_000, `${(statSync(p).size / 1e3).toFixed(0)}KB`);
    }
  }

  // 3) Dimensi PNG
  for (const h of PAGES) {
    const p = join(OUT, "png", `${h.id}.png`);
    if (!existsSync(p)) continue;
    const meta = await sharp(p).metadata();
    cek(
      `png ${h.id} ≥2400×3300`,
      (meta.width ?? 0) >= 2400 && (meta.height ?? 0) >= 3300,
      `${meta.width}×${meta.height}`
    );
  }

  // 4) Struktur SVG
  for (const h of PAGES) {
    const p = join(OUT, "svg", `${h.id}.svg`);
    if (!existsSync(p)) continue;
    const s = readFileSync(p, "utf8");
    cek(
      `svg ${h.id} valid`,
      s.startsWith("<svg") && s.includes('viewBox="0 0 794 1123"') && s.trimEnd().endsWith("</svg>"),
      `${(statSync(p).size / 1e3).toFixed(0)}KB`
    );
    cek(`svg ${h.id} < 200KB`, statSync(p).size < 200_000);
  }

  // 5) Konten wajib di HTML (instruksi ortu + footer nomor)
  const dist = join(process.cwd(), "dist");
  const htmlFiles: string[] = [];
  const kumpul = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) kumpul(full);
      else if (e.name.endsWith(".html")) htmlFiles.push(full);
    }
  };
  kumpul(dist);
  cek("20 halaman HTML", htmlFiles.length === 20, `${htmlFiles.length} file`);
  for (const f of htmlFiles) {
    const s = readFileSync(f, "utf8");
    const pendek = f.replace(process.cwd(), "");
    cek(`${pendek} ada worksheet`, s.includes("worksheet"));
    cek(`${pendek} ada ParentNote`, s.includes("Bantu anak:"));
  }

  console.log(gagal === 0 ? "\nSEMUA CEK LOLOS" : `\n${gagal} CEK GAGAL`);
  process.exitCode = gagal === 0 ? 0 : 1;
}

main();
