# 04 — Aset Ilustrasi

Setiap file di `src/assets/` wajib tercatat di tabel bawah.

## Sumber Dipakai

| Sumber | Lisensi | Cakupan | Catatan |
|--------|---------|---------|---------|
| **Buatan sendiri** (`characters/`) | MIT (bagian repo ini) | 5 maskot: Rubi, Bina, Nina, Rina, Rubina | Geometris sederhana, palet rubina, outline ink (terbaca B&W) |
| **Twemoji** (`illustrations/`) | CC-BY 4.0 © Twitter | 31 objek/ikon (sabun, bola, bel, ... ) | **Wajib atribusi** (lihat bawah). Diambil via `npm run download-assets` |
| unDraw | MIT | Cadangan scene cover/panduan | API lama mati (404); hanya manual bila perlu |
| OpenDoodles | CC0 | Tidak dipakai | Gaya manusia-sketsa tidak cocok untuk usia 2th |
| Humaaans | MIT | Tidak dipakai | Butuh Figma manual; ditunda |

> Keputusan: maskot digambar sendiri agar konsisten per kategori + bentuk besar
> sederhana (optimal motorik 2th). Objek kecil pakai Twemoji (konsisten, bold,
> mudah dikenali anak).

## Workflow (`npm run download-assets`)

1. Fetch SVG Twemoji dari `raw.githubusercontent.com/twitter/twemoji` → `tmp/` (memory).
2. SVGO multipass: hapus metadata, minify path, pertahankan `viewBox`.
3. Simpan ke `src/assets/illustrations/<nama>.svg` (total ~36KB).
4. File gagal → warning + exit code 1 (tidak fatal untuk file lain).

## Atribusi Twemoji (WAJIB tampil di produk)

- README bagian Lisensi + footer halaman cetak: `Ilustrasi ikon: Twemoji © Twitter, CC-BY 4.0`.
- Jangan hapus atribusi ini.

## Inventaris Aset

| File | Sumber | Lisensi |
|------|--------|---------|
| `characters/rubi-kelinci.svg` | Buatan sendiri | MIT |
| `characters/bina-beruang.svg` | Buatan sendiri | MIT |
| `characters/nina-rubah.svg` | Buatan sendiri (terinspirasi warna Kurama: oranye + krem; gaya lucu selaras maskot lain) | MIT |
| `characters/rina-robot.svg` | Buatan sendiri | MIT |
| `characters/rubina-anak.svg` | Buatan sendiri | MIT |
| `illustrations/*.svg` (31 file, lihat `src/scripts/download-assets.ts` MANIFEST) | Twemoji © Twitter | CC-BY 4.0 |

## Batas Teknis

- Tiap SVG < 200KB (aktual: maks ~6KB, total ~36KB).
- Jangan commit `output/` atau `dist/`.
- Karakter per kategori konsisten (lihat `AGENTS.md` §6).
