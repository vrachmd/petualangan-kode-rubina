# AGENTS.md — Panduan Kerja AI Agent

File ini adalah sumber kebenaran untuk agen AI (atau kontributor) yang mengerjakan repo ini.
Baca sebelum menulis kode apa pun.

## 1. Konteks Proyek

- Printable worksheet coding untuk anak **usia 2 tahun**, Bahasa Indonesia.
- Judul: **Petualangan Kode Rubina**. Nama anak terpusat di `src/utils/nama.ts` (`NAMA_ANAK`).
- 20 halaman A4, 5 kategori, tiap kategori punya karakter sendiri (lihat `docs/03-KONTEN_WORKSHEET.md`).
- Prinsip usia 2th: instruksi 1–2 langkah, elemen ≥ 32px, font ≥ 20px, durasi 3–5 mnt/halaman, puji proses.

## 2. Tech Stack (Jangan Ganti Tanpa Diskusi)

- **Astro** — 1 file `src/pages/**/*.astro` = 1 halaman worksheet. Gunakan komponen, bukan HTML mentah berulang.
- **Tailwind CSS** — semua styling via utility + token di `tailwind.config.mjs`. Jangan hardcode hex di komponen; pakai token `rubina.*`.
- **Playwright (chromium)** — render `dist/*.html` → PDF/PNG/SVG via `src/scripts/generate-*.ts`.
- **SVGO + Sharp** — optimasi SVG/PNG. Jangan commit aset > 200KB tanpa optimasi.
- Font self-hosted `@fontsource/quicksand` + `@fontsource/nunito`. Jangan pakai Google Fonts CDN.

## 3. Perintah Standar

```bash
npm install
npm run download-assets   # fetch + SVGO + recolor → src/assets/
npm run dev               # astro dev (preview visual)
npm run build             # astro build → dist/
npm run generate:all      # build + pdf + png + svg → output/
npm run validate          # QA otomatis (ukuran, kontras, viewBox, margin)
npm run package           # zip rilis
npm run clean             # hapus dist/ output/ .astro/
```

- Jangan menambah dependency baru tanpa mencatat alasan di PR.
- Jangan edit file di `output/` atau `dist/` manual — selalu regenerate.

## 4. Struktur & Konvensi File

```
src/pages/<kategori>/<nn>-<slug>.astro   # ex: src/pages/pola/01-ab.astro
src/components/base/        # Box, Text, Icon, Arrow — generik, tanpa konten worksheet
src/components/worksheet/   # PatternRow, SequenceCard, ArrowPath, IfThenPair, ActivityCard, FreePlayArea
src/components/layout/      # PageWrapper, Header, Footer, ParentNote
src/layouts/WorksheetLayout.astro  # dipakai semua pages
src/assets/characters/*.svg  # Rubi, Bina, Nina, Rina, Rubina — sudah direcolor
src/assets/illustrations/*.svg
src/utils/nama.ts           # NAMA_ANAK, sapaan
```

Aturan:
- Setiap page **wajib** pakai `WorksheetLayout` + `PageWrapper` (margin cetak 15mm) + `Header` (judul + karakter kategori) + `ParentNote` (instruksi ortu Bahasa Indonesia). `Footer` kecil (14px) wajib di semua halaman **kecuali cover**.
- Cover (`src/pages/index.astro`) tanpa `Footer` dan tanpa `Header` standar (desain khusus).
- Root visual tiap halaman: `<div class="worksheet" ...>` — dipakai script SVG extractor. Jangan ganti class ini.
- Props komponen wajib di-type (TypeScript interface di atas file `.astro`).
- Teks UI Bahasa Indonesia, kalimat aktif pendek ("Ayo warnai...", "Bantu Rubi..."). Tidak ada istilah Inggris tanpa penjelasan.
- Nama anak jangan hardcode "Rubina" di halaman — import dari `src/utils/nama.ts`.

## 5. Design Tokens (Ringkas — Detail di docs/02-DESIGN_SYSTEM.md)

- Warna: `rubina.pink|peach|mint|sky|lavender|sunny` (50/100/200/500/600). Background `#FAFAFA`, surface `#FFFFFF`, teks `#171717`, border `#E5E5E5`.
- Font: `font-display` (Quicksand, heading) / `font-sans` (Nunito, body). Ukuran min `text-base` (20px).
- Radius: 8/16/24/32px. Shadow hanya `shadow-soft` / `shadow-card`.
- Ikon/panah: stroke 2.5pt, round caps, ukuran ≥ 32px.
- Harus lolos cetak B&W: jangan sampaikan info hanya lewat warna — tambah bentuk/label.

## 6. Karakter per Kategori (Jangan Tertukar)

| Kategori | Karakter | Warna | Folder aset |
|----------|----------|-------|-------------|
| pola | Rubi 🐰 | rubina.pink | characters/rubi-*.svg |
| sequencing | Bina 🐻 | rubina.peach | characters/bina-*.svg |
| arah | Nina 🦊 | rubina.sky | characters/nina-*.svg |
| sebab-akibat | Rina 🤖 | rubina.lavender | characters/rina-*.svg |
| kartu/free/cover | Rubina ✨ + semua | multi | characters/rubina-*.svg |

## 7. Definition of Done (Wajib Cek)

Per halaman:
- [ ] Render `astro build` tanpa error; tidak ada console error di Playwright.
- [ ] PDF A4 margin 15mm, font embedded, < 500KB.
- [ ] PNG 2480×3508, tajam, tidak terpotong.
- [ ] SVG valid, `viewBox="0 0 2480 3508"`, < 200KB.
- [ ] `npm run validate` lolos (kontras WCAG AA teks, target ≥ 32px, margin).
- [ ] Uji logika: cetak B&W masih terbaca; instruksi ortu jelas.

Global:
- [ ] Total merged PDF < 5MB. Semua 20 halaman sukses generate.

## 8. Alur Kerja yang Diharapkan

1. Baca `docs/03-KONTEN_WORKSHEET.md` untuk spec halaman yang dikerjakan.
2. Cek komponen existing di `src/components/` — reuse, jangan duplikasi.
3. Tulis/edit 1 halaman → `npm run dev` → screenshot visual → perbaiki.
4. `npm run generate:all` + `npm run validate` sebelum klaim selesai.
5. Jika tambah aset: catat sumber + lisensi di `docs/04-ASET_ILUSTRASI.md`.

## 9. Larangan

- Hanya pakai aset yang tercatat di `docs/04-ASET_ILUSTRASI.md`: maskot buatan sendiri (MIT) + Twemoji (CC-BY 4.0, atribusi wajib). unDraw (MIT) hanya bila perlu, manual.
- Jangan menambah sumber ilustrasi baru tanpa mencatat lisensi + alasan di `docs/04-ASET_ILUSTRASI.md`.
- Jangan hardcode warna/font di luar token.
- Jangan buat halaman tanpa `ParentNote`.
- Jangan commit `output/`, `dist/`, file ZIP ke git.
