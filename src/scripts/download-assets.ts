/**
 * Unduh ilustrasi Twemoji (CC-BY 4.0) → optimasi SVGO → src/assets/illustrations/
 *
 * Pakai: npm run download-assets
 * Atribusi wajib: lihat docs/04-ASET_ILUSTRASI.md (sudah dicantumkan).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(ROOT, "src", "assets", "illustrations");
const TWEMOJI = "https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg";

interface Aset {
  file: string;
  code: string; // hex Twemoji tanpa FE0F, ex: "1f9fc"
  guna: string;
  /** subfolder di src/assets (default "illustrations") */
  dir?: string;
}

const MANIFEST: Aset[] = [
  // Sequencing — cuci tangan
  { file: "keran.svg", code: "1f6b0", guna: "cuci tangan langkah 1" },
  { file: "sabun.svg", code: "1f9fc", guna: "cuci tangan langkah 2" },
  { file: "tetes-air.svg", code: "1f4a7", guna: "bilas" },
  // Sequencing — makan
  { file: "sendok.svg", code: "1f944", guna: "makan langkah 1" },
  { file: "nasi.svg", code: "1f35a", guna: "makan langkah 2" },
  { file: "senyum-makan.svg", code: "1f60b", guna: "makan langkah 3" },
  // Sequencing — tidur
  { file: "baju.svg", code: "1f455", guna: "tidur langkah 1" },
  { file: "sikat-gigi.svg", code: "1faa5", guna: "tidur langkah 2" },
  { file: "tempat-tidur.svg", code: "1f6cf", guna: "tidur langkah 3" },
  { file: "bulan.svg", code: "1f319", guna: "dekorasi tidur" },
  // Sequencing — beres mainan
  { file: "bola.svg", code: "26bd", guna: "mainan" },
  { file: "boneka.svg", code: "1f9f8", guna: "mainan" },
  { file: "kotak.svg", code: "1f4e6", guna: "kotak beres" },
  // Arah
  { file: "bendera-finish.svg", code: "1f3c1", guna: "finish labirin" },
  { file: "lingkaran-hijau.svg", code: "1f7e2", guna: "titik start" },
  { file: "rumah.svg", code: "1f3e0", guna: "tujuan Nina" },
  { file: "wortel.svg", code: "1f955", guna: "misi kelinci" },
  // Sebab-akibat
  { file: "lampu.svg", code: "1f4a1", guna: "hasil tombol" },
  { file: "mobil.svg", code: "1f697", guna: "hasil tarik tali" },
  { file: "bel.svg", code: "1f514", guna: "hasil tekan" },
  { file: "tepuk.svg", code: "1f44f", guna: "aksi tepuk" },
  { file: "speaker.svg", code: "1f50a", guna: "simbol bunyi" },
  // Kartu aktivitas
  { file: "lompat.svg", code: "1f407", guna: "kartu lompat" },
  { file: "putar.svg", code: "1f504", guna: "kartu putar" },
  { file: "hidung.svg", code: "1f443", guna: "kartu sentuh hidung" },
  { file: "kursi.svg", code: "1fa91", guna: "kartu duduk" },
  { file: "lari.svg", code: "1f3c3", guna: "kartu berlari" },
  // Dekorasi + pola
  { file: "bintang.svg", code: "2b50", guna: "pola bentuk kedua (lolos B&W)" },
  { file: "matahari.svg", code: "2600", guna: "dekorasi cover" },
  { file: "bunga.svg", code: "1f338", guna: "dekorasi" },
  { file: "awan.svg", code: "2601", guna: "dekorasi" },
  // Maskot hewan — Twemoji (profesional, langsung dikenali anak).
  // Custom Rina (robot) + Rubina (anak) tetap buatan sendiri.
  { file: "rubi-kelinci.svg", code: "1f430", guna: "maskot Rubi", dir: "characters" },
  { file: "bina-beruang.svg", code: "1f43b", guna: "maskot Bina", dir: "characters" },
  { file: "nina-rubah.svg", code: "1f98a", guna: "maskot Nina", dir: "characters" },
];

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  const gagal: string[] = [];

  for (const aset of MANIFEST) {
    const url = `${TWEMOJI}/${aset.code}.svg`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.text();
      const { data } = optimize(raw, {
        multipass: true,
        plugins: [
          {
            name: "preset-default",
            params: { overrides: { removeViewBox: false } },
          },
          "removeDimensions",
        ],
      });
      writeFileSync(join(ROOT, "src", "assets", aset.dir ?? "illustrations", aset.file), data);
      ok++;
      console.log(`OK  ${aset.file} (${aset.guna})`);
    } catch (err) {
      gagal.push(aset.file);
      console.warn(`GAGAL ${aset.file} dari ${url}: ${err}`);
    }
  }

  console.log(`\nSelesai: ${ok}/${MANIFEST.length} berhasil → ${OUT_DIR}`);
  if (gagal.length > 0) {
    console.warn(`Perlu perhatian manual: ${gagal.join(", ")}`);
    process.exitCode = 1;
  }
}

main();
