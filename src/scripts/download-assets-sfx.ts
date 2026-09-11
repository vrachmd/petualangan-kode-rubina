/**
 * Unduh efek suara CC0 + ikon hewan SVG → public/audio/
 *
 * Pakai: npx tsx src/scripts/download-assets-sfx.ts
 *
 * Sumber & Lisensi:
 * - Efek suara: Dibuat dengan ffmpeg (sinthesi). CC0.
 * - Ikon hewan: Buatan sendiri (MIT). Gaya bulat, ramah anak usia 2.
 *
 * Atribusi: Lihat docs/04-ASET_ILUSTRASI.md
 */
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SFX_DIR = join(ROOT, "public", "audio", "sfx");
const HEWAN_DIR = join(ROOT, "public", "audio", "hewan");

// ─── Sound effects (sudah di-download sebelumnya oleh generate-sfx) ───
const SOUNDS = ["celebration.mp3", "star.mp3", "ding.mp3"];

// ─── Animal SVG icons (buatan sendiri, MIT) ───
// SVG sederhana untuk game suara hewan
const ANIMAL_SVGS: Record<string, string> = {
  kucing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <title>Kucing</title>
  <circle cx="60" cy="68" r="40" fill="#F9A825" stroke="#5D4037" stroke-width="3"/>
  <polygon points="28,38 18,8 48,28" fill="#F9A825" stroke="#5D4037" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="30,36 22,14 44,30" fill="#FFCC80"/>
  <polygon points="92,38 102,8 72,28" fill="#F9A825" stroke="#5D4037" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="90,36 98,14 76,30" fill="#FFCC80"/>
  <circle cx="44" cy="60" r="7" fill="white"/>
  <circle cx="44" cy="60" r="4" fill="#171717"/>
  <circle cx="42" cy="58" r="1.5" fill="white"/>
  <circle cx="76" cy="60" r="7" fill="white"/>
  <circle cx="76" cy="60" r="4" fill="#171717"/>
  <circle cx="74" cy="58" r="1.5" fill="white"/>
  <ellipse cx="60" cy="72" rx="4" ry="3" fill="#E91E63"/>
  <path d="M54,78 Q60,84 66,78" fill="none" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/>
  <line x1="20" y1="68" x2="40" y2="72" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="20" y1="76" x2="40" y2="76" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="80" y1="72" x2="100" y2="68" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="80" y1="76" x2="100" y2="76" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
  anjing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <title>Anjing</title>
  <circle cx="60" cy="65" r="42" fill="#8D6E63" stroke="#4E342E" stroke-width="3"/>
  <ellipse cx="22" cy="55" rx="14" ry="22" fill="#6D4C41" stroke="#4E342E" stroke-width="3" transform="rotate(-15,22,55)"/>
  <ellipse cx="98" cy="55" rx="14" ry="22" fill="#6D4C41" stroke="#4E342E" stroke-width="3" transform="rotate(15,98,55)"/>
  <ellipse cx="60" cy="75" rx="24" ry="20" fill="#D7CCC8"/>
  <circle cx="46" cy="58" r="6" fill="white"/>
  <circle cx="46" cy="58" r="3.5" fill="#171717"/>
  <circle cx="44.5" cy="56.5" r="1.2" fill="white"/>
  <circle cx="74" cy="58" r="6" fill="white"/>
  <circle cx="74" cy="58" r="3.5" fill="#171717"/>
  <circle cx="72.5" cy="56.5" r="1.2" fill="white"/>
  <ellipse cx="60" cy="70" rx="6" ry="4.5" fill="#3E2723"/>
  <ellipse cx="58.5" cy="69" rx="1.5" ry="1" fill="#6D4C41"/>
  <path d="M54,77 Q60,84 66,77" fill="none" stroke="#4E342E" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="60" cy="82" rx="4" ry="3" fill="#E91E63"/>
</svg>`,
  burung: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <title>Burung</title>
  <circle cx="60" cy="68" r="38" fill="#42A5F5" stroke="#1565C0" stroke-width="3"/>
  <ellipse cx="60" cy="78" rx="22" ry="20" fill="#E3F2FD"/>
  <ellipse cx="60" cy="26" rx="4" ry="8" fill="#FDD835" stroke="#F9A825" stroke-width="1.5"/>
  <ellipse cx="54" cy="28" rx="3" ry="6" fill="#FDD835" stroke="#F9A825" stroke-width="1.5" transform="rotate(-15,54,28)"/>
  <ellipse cx="66" cy="28" rx="3" ry="6" fill="#FDD835" stroke="#F9A825" stroke-width="1.5" transform="rotate(15,66,28)"/>
  <circle cx="48" cy="58" r="6" fill="white"/>
  <circle cx="48" cy="58" r="3.5" fill="#171717"/>
  <circle cx="46.5" cy="56.5" r="1.2" fill="white"/>
  <circle cx="72" cy="58" r="6" fill="white"/>
  <circle cx="72" cy="58" r="3.5" fill="#171717"/>
  <circle cx="70.5" cy="56.5" r="1.2" fill="white"/>
  <polygon points="56,70 64,70 60,78" fill="#FF8F00" stroke="#E65100" stroke-width="1.5" stroke-linejoin="round"/>
  <ellipse cx="26" cy="68" rx="12" ry="8" fill="#2196F3" stroke="#1565C0" stroke-width="2" transform="rotate(-20,26,68)"/>
  <ellipse cx="94" cy="68" rx="12" ry="8" fill="#2196F3" stroke="#1565C0" stroke-width="2" transform="rotate(20,94,68)"/>
</svg>`,
  katak: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <title>Katak</title>
  <circle cx="60" cy="65" r="40" fill="#66BB6A" stroke="#2E7D32" stroke-width="3"/>
  <circle cx="35" cy="50" r="4" fill="#43A047"/>
  <circle cx="85" cy="50" r="4" fill="#43A047"/>
  <circle cx="42" cy="85" r="3" fill="#43A047"/>
  <circle cx="78" cy="85" r="3" fill="#43A047"/>
  <circle cx="40" cy="42" r="14" fill="#66BB6A" stroke="#2E7D32" stroke-width="3"/>
  <circle cx="40" cy="42" r="10" fill="white"/>
  <circle cx="40" cy="42" r="6" fill="#171717"/>
  <circle cx="37" cy="39" r="2" fill="white"/>
  <circle cx="80" cy="42" r="14" fill="#66BB6A" stroke="#2E7D32" stroke-width="3"/>
  <circle cx="80" cy="42" r="10" fill="white"/>
  <circle cx="80" cy="42" r="6" fill="#171717"/>
  <circle cx="77" cy="39" r="2" fill="white"/>
  <path d="M30,75 Q45,88 60,75 Q75,88 90,75" fill="none" stroke="#2E7D32" stroke-width="3" stroke-linecap="round"/>
  <circle cx="34" cy="72" r="5" fill="#F48FB1" opacity="0.5"/>
  <circle cx="86" cy="72" r="5" fill="#F48FB1" opacity="0.5"/>
</svg>`,
  sapi: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <title>Sapi</title>
  <circle cx="60" cy="65" r="40" fill="#FAFAFA" stroke="#757575" stroke-width="3"/>
  <ellipse cx="22" cy="45" rx="10" ry="16" fill="#FAFAFA" stroke="#757575" stroke-width="3" transform="rotate(-20,22,45)"/>
  <ellipse cx="22" cy="45" rx="6" ry="11" fill="#F48FB1"/>
  <ellipse cx="98" cy="45" rx="10" ry="16" fill="#FAFAFA" stroke="#757575" stroke-width="3" transform="rotate(20,98,45)"/>
  <ellipse cx="98" cy="45" rx="6" ry="11" fill="#F48FB1"/>
  <circle cx="38" cy="42" r="8" fill="#424242"/>
  <circle cx="78" cy="50" r="6" fill="#424242"/>
  <circle cx="50" cy="82" r="5" fill="#424242"/>
  <ellipse cx="60" cy="76" rx="22" ry="16" fill="#FFE0B2" stroke="#757575" stroke-width="2"/>
  <circle cx="44" cy="56" r="6" fill="white"/>
  <circle cx="44" cy="56" r="3.5" fill="#171717"/>
  <circle cx="42.5" cy="54.5" r="1.2" fill="white"/>
  <circle cx="76" cy="56" r="6" fill="white"/>
  <circle cx="76" cy="56" r="3.5" fill="#171717"/>
  <circle cx="74.5" cy="54.5" r="1.2" fill="white"/>
  <ellipse cx="54" cy="74" rx="4" ry="3" fill="#795548"/>
  <ellipse cx="66" cy="74" rx="4" ry="3" fill="#795548"/>
  <path d="M52,82 Q60,88 68,82" fill="none" stroke="#757575" stroke-width="2" stroke-linecap="round"/>
  <path d="M35,30 Q30,18 38,22" fill="none" stroke="#757575" stroke-width="3" stroke-linecap="round"/>
  <path d="M85,30 Q90,18 82,22" fill="none" stroke="#757575" stroke-width="3" stroke-linecap="round"/>
</svg>`,
};

async function main() {
  mkdirSync(SFX_DIR, { recursive: true });
  mkdirSync(HEWAN_DIR, { recursive: true });

  let ok = 0;
  const gagal: string[] = [];

  // ─── Check SFX files exist ───
  console.log("📁 Memeriksa efek suara...");
  for (const sound of SOUNDS) {
    const path = join(SFX_DIR, sound);
    if (existsSync(path)) {
      const size = statSync(path).size;
      console.log(`  ✓ ${sound} (${(size / 1024).toFixed(1)}KB)`);
      ok++;
    } else {
      console.warn(`  ✗ ${sound} — file tidak ditemukan!`);
      gagal.push(`sfx/${sound}`);
    }
  }

  // ─── Write animal SVGs ───
  console.log("\n🐾 Menulis ikon hewan SVG...");
  for (const [nama, svg] of Object.entries(ANIMAL_SVGS)) {
    const path = join(HEWAN_DIR, `${nama}.svg`);
    try {
      writeFileSync(path, svg);
      const size = statSync(path).size;
      console.log(`  ✓ ${nama}.svg (${(size / 1024).toFixed(1)}KB)`);
      ok++;
    } catch (err) {
      gagal.push(`hewan/${nama}.svg`);
      console.warn(`  ✗ ${nama}.svg — ${err}`);
    }
  }

  console.log(`\nSelesai: ${ok} aset OK`);
  if (gagal.length > 0) {
    console.warn(`Perlu perhatian: ${gagal.join(", ")}`);
    process.exitCode = 1;
  }
}

main();
