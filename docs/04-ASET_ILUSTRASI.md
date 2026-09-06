# 04 — Aset Ilustrasi

Setiap file di `src/assets/` wajib tercatat di tabel bawah.

## Sumber Dipakai

| Sumber | Lisensi | Cakupan | Catatan |
|--------|---------|---------|---------|
| **Buatan sendiri** (`characters/` rina, rubina) | MIT (bagian repo ini) | Robot Rina + Rubina | Geometris sederhana, palet rubina, outline ink (terbaca B&W) |
| **Twemoji** (`characters/` hewan + `illustrations/`) | CC-BY 4.0 © Twitter | 3 maskot hewan + 31 objek/ikon | **Wajib atribusi**. Maskot hewan pakai Twemoji karena langsung dikenali anak |
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
| `characters/rubi-kelinci.svg` | Twemoji © Twitter 🐰 | CC-BY 4.0 |
| `characters/bina-beruang.svg` | Twemoji © Twitter 🐻 | CC-BY 4.0 |
| `characters/nina-rubah.svg` | Twemoji © Twitter 🦊 | CC-BY 4.0 |
| `characters/rina-robot.svg` | Buatan sendiri | MIT |
| `characters/rubina-anak.svg` | Buatan sendiri | MIT |
| `illustrations/*.svg` (31 file, lihat `src/scripts/download-assets.ts` MANIFEST) | Twemoji © Twitter | CC-BY 4.0 |

## Batas Teknis

- Tiap SVG < 200KB (aktual: maks ~6KB, total ~36KB).
- Jangan commit `output/` atau `dist/`.
- Karakter per kategori konsisten (lihat `AGENTS.md` §6).
