# 04 — Aset Ilustrasi

Hanya pakai sumber bebas komersial. Setiap file di `src/assets/` wajib tercatat di tabel bawah.

## Sumber Diizinkan

| Sumber | Lisensi | Cakupan | Catatan |
|--------|---------|---------|---------|
| OpenDoodles | CC0 | Karakter (Rubi, Bina, Nina, Rubina) | Bebas modifikasi tanpa atribusi |
| unDraw | MIT | Objek/aktivitas (makan, tidur, main, lampu) | Boleh recolor; simpan lisensi |
| Humaaans | MIT | Campuran figur (kartu aktivitas, cover) | Boleh mix-and-match |
| Iconify / SVG Repo | Cek per ikon | Ikon UI (panah, ceklis, bintang) | Catat lisensi tiap file |

Dilarang: aset "free for personal use", tanpa lisensi jelas, hasil scrape Pinterest/Google Images.

## Workflow (`npm run download-assets`)

1. Fetch SVG mentah → `tmp/`.
2. SVGO: hapus metadata, minify path, pertahankan `viewBox`, buang `width/height`.
3. Recolor: ganti hex asli → `currentColor` + class token (`text-rubina-pink-500` dst).
4. Simpan ke `src/assets/characters/` atau `illustrations/` dengan nama semantik (`rubi-senyum.svg`, `sabun.svg`).
5. Tambah baris ke tabel inventaris + commit.

## Inventaris Aset

| File | Sumber | Lisensi | Modifikasi |
|------|--------|---------|------------|
| `characters/rubi-*.svg` | OpenDoodles | CC0 | Recolor pink, sederhanakan path |
| `characters/bina-*.svg` | OpenDoodles | CC0 | Recolor peach |
| `characters/nina-*.svg` | OpenDoodles | CC0 | Recolor sky |
| `characters/rina-*.svg` | unDraw (robot) | MIT | Recolor lavender |
| `characters/rubina-*.svg` | OpenDoodles/Humaaans | CC0/MIT | Figur anak, multi-warna |
| `illustrations/*` | unDraw | MIT | Objek rutinitas + benda |
| `icons/*` | Iconify | Tercatat per file | Stroke 2.5pt, round caps |

> Agent: saat menambah aset baru, tambah baris tabel di atas + pastikan file < 200KB.

## Batas Teknis

- SVG < 200KB, PNG tidak dicommit ke `src/assets` (hanya output).
- Jangan commit `output/` atau `dist/`.
- Karakter per kategori konsisten (lihat `AGENTS.md` §6).
