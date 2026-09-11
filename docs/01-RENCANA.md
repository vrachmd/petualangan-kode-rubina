# 01 — Rencana Implementasi

Sumber kebenaran timeline dan scope. Stack: Astro + Tailwind + Playwright. Bahasa: TypeScript.

## Scope (20 halaman)

1. `index` (cover) + `panduan-orang-tua`
2. Pola ×4: AB, ABB, ABC, campuran
3. Sequencing ×4: cuci tangan, makan, tidur, main
4. Arah ×4: lacak garis, ikuti panah, labirin, misi Nina
5. Sebab-akibat ×3: tombol-lampu, tarik-mainan, tekan-bunyi
6. Kartu aktivitas ×1 (6 kartu potong)
7. Free play ×2: buat pola, gambar robot

Spec konten: `03-KONTEN_WORKSHEET.md`.

## Timeline 4 Minggu

### Minggu 1 — Foundation

- Init Astro + Tailwind + TS + Playwright + SVGO + Sharp + `@fontsource/*`.
- `tailwind.config.mjs` (token rubina), `global.css` + `@font-face`, `WorksheetLayout`, `PageWrapper`, `Header`, `Footer`, `ParentNote`, base `Box/Text/Icon/Arrow`.
- `src/utils/nama.ts` (`NAMA_ANAK = "Rubina"`).
- DoD: `npm run dev` jalan, 1 halaman dummy render A4 margin 15mm.

### Minggu 2 — Aset + Komponen Worksheet

- `scripts/download-assets.ts`: fetch unDraw/OpenDoodles/Humaaans → SVGO → recolor palet rubina → `src/assets/`.
- Karakter: Rubi 🐰, Bina 🐻, Nina 🦊, Rina 🤖, Rubina ✨ (catat lisensi di `04-ASET_ILUSTRASI.md`).
- Komponen: `PatternRow`, `SequenceCard`, `ArrowPath`, `IfThenPair`, `ActivityCard`, `FreePlayArea`.
- DoD: 1 halaman sample per kategori lolos render + cetak uji.

### Minggu 3 — Komposisi 20 Halaman

- Urutan: pola → sequencing → arah → sebab-akibat → kartu → free play → cover + panduan.
- Setiap page: `WorksheetLayout` + `.worksheet` root + `ParentNote`.
- Paralel: tulis `scripts/generate-*.ts` + `validate-output.ts`.
- DoD: `npm run generate:all` sukses 20 halaman.

### Minggu 4 — QA + Rilis

- Validasi otomatis + uji cetak fisik (inkjet/laser/fotokopi): warna, B&W, margin, ketajaman.
- Perbaiki kontras, ukuran target, instruksi.
- `package` → ZIP, GitHub Release v1.0, update `CHANGELOG.md`.

## Risiko & Mitigasi

| Risiko                     | Mitigasi                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| Ilustrasi tidak konsisten  | Recolor via script ke token rubina; batasi 1 gaya garis (round, 2.5pt) |
| Font tidak embed di PDF    | Self-host woff2 + `document.fonts.ready` sebelum `page.pdf()`          |
| PDF bengkak > 5MB          | SVGO agresif, PNG terkompresi, hindari gambar raster besar             |
| Instruksi ambigu untuk 2th | Wajib `ParentNote`; review bahasa tiap PR                              |

## Kriteria Rilis v1.0

- 20 halaman generate sukses; merged PDF < 5MB.
- `npm run validate` hijau.
- README + panduan ortu + lisensi aset lengkap.
