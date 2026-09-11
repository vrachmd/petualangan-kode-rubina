# Petualangan Kode Rubina

Worksheet coding printable untuk anak usia 2 tahun — Bahasa Indonesia, open source (MIT).

Belajar pola, urutan, arah, dan sebab-akibat lewat bermain bersama Rubi 🐰, Bina 🐻, Nina 🦊, Rina 🤖, dan Rubina ✨.

## Isi Paket (20 halaman A4)

| Kategori                                               | Halaman | Karakter  |
| ------------------------------------------------------ | ------- | --------- |
| Cover + Panduan Orang Tua                              | 2       | Rubina ✨ |
| Pola (AB, ABB, ABC, Campuran)                          | 4       | Rubi 🐰   |
| Sequencing 3 langkah (cuci tangan, makan, tidur, main) | 4       | Bina 🐻   |
| Arah (lacak garis, ikuti panah, labirin, misi Nina)    | 4       | Nina 🦊   |
| Sebab-Akibat (tombol-lampu, tarik-mainan, tekan-bunyi) | 3       | Rina 🤖   |
| Kartu Aktivitas (6 kartu, gunting)                     | 1       | Semua 🎪  |
| Free Play (buat pola, gambar robot)                    | 2       | Rubina ✨ |

Detail tiap halaman: lihat `docs/03-KONTEN_WORKSHEET.md`.

## Output

- `output/pdf/` — PDF per halaman + `petualangan-kode-rubina-full.pdf` (A4, margin 15mm)
- `output/png/` — PNG 2480×3508px (300 DPI, untuk tablet/cetak)
- `output/svg/` — SVG source per halaman (viewBox A4)

Target: total PDF < 5MB, elemen sentuh ≥ 32px, terbaca saat dicetak hitam-putih.

## Cara Pakai (Orang Tua)

1. Cetak A4, 100% scale (jangan "fit to page").
2. Mulai dari Panduan Orang Tua (halaman 2).
3. 1 halaman = 3–5 menit. Ikuti instruksi kotak "Bantu anak".
4. Puji proses ("Hebat, kamu coba lagi!"), bukan hasil.
5. Opsional: laminasi + spidol whiteboard agar bisa dipakai ulang.

Panduan lengkap: `docs/05-PANDUAN_ORANG_TUA.md`.

## Kustomisasi Nama Anak

Semua teks nama terpusat di `src/utils/nama.ts` (`NAMA_ANAK = "Rubina"`).
Ganti satu nilai, regenerate — seluruh cover, header, dan instruksi ikut berubah.

## Tech Stack

- **Astro** (static pages, 1 file = 1 halaman worksheet)
- **Tailwind CSS** (design tokens di `tailwind.config.mjs`)
- **Playwright** (render HTML → PDF/PNG/SVG)
- **SVGO + Sharp** (optimasi aset)
- Font self-hosted: **Quicksand** (display) + **Nunito** (body) via `@fontsource`

## Quick Start

```bash
npm install
npm run download-assets   # unduh + optimasi ilustrasi gratis
npm run dev               # astro dev
npm run generate:all      # build → pdf + png + svg
npm run validate          # QA otomatis
npm run package           # zip rilis
```

Perintah lengkap dan konvensi kerja: lihat `AGENTS.md`.

## Struktur Repo

```
src/
  pages/          # 1 file .astro = 1 halaman worksheet
  components/     # base/ + worksheet/ + layout/
  assets/         # characters/ + illustrations/ + patterns/ (SVG)
  scripts/        # download-assets, generate-*, validate-output
  styles/         # global.css + @font-face
docs/
  01-RENCANA.md 02-DESIGN_SYSTEM.md 03-KONTEN_WORKSHEET.md
  04-ASET_ILUSTRASI.md 05-PANDUAN_ORANG_TUA.md
```

## Lisensi & Atribusi

- Kode + maskot karakter: **MIT** (lihat `LICENSE`).
- Ikon/objek ilustrasi: **Twemoji © Twitter, CC-BY 4.0** — lihat `docs/04-ASET_ILUSTRASI.md`.
- Ikon UI: Iconify/SVG Repo (cek lisensi per ikon di file aset).

## Kontribusi

Baca `CONTRIBUTING.md` dan `AGENTS.md` sebelum mengirim PR.
