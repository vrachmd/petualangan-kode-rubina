# 06 — Character Style Guide

> Panduan gaya ilustrasi maskot Petualangan Kode Rubina.

## 1. Prinsip Kawaii

Semua karakter mengikuti gaya **kawaii** — lucu, mudah dikenali, ramah anak usia 2 tahun.

| Aspek                  | Spesifikasi                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| **Rasio kepala:badan** | 40:60 — kepala besar, badan kecil                                    |
| **Mata**               | Besar oval/bulat, highlight putih 1.5–2px                            |
| **Stroke**             | 2.5px konsisten, `stroke-linecap="round"`, `stroke-linejoin="round"` |
| **Bentuk**             | Bulat, tidak ada sudut tajam                                         |
| **Pipi**               | Transparan 0.7, warna lembut                                         |
| **Aksesibilitas**      | Warna bukan satu-satunya pembeda — bentuk/label wajib                |

## 2. Paleta Warna

| Karakter      | Utama                                | Terang            | Elemen                       |
| ------------- | ------------------------------------ | ----------------- | ---------------------------- |
| **Rubi** 🐰   | `#E85D75`                            | `#FFB3C1`         | Pipi pink, telinga pink      |
| **Bina** 🐻   | `#F97316`                            | `#FDBA74`         | Pipi peach, perut terang     |
| **Nina** 🦊   | `#F97316` (bulu) / `#38BDF8` (aksen) | `#BAE6FD`         | Pipi sky, moncong putih      |
| **Rina** 🤖   | `#A855F7`                            | `#E9D5FF`         | Mata lavender, antena kuning |
| **Rubina** ✨ | `#E85D75` (rambut)                   | `#FFEDD5` (kulit) | Jepit bintang `#FACC15`      |

Warna umum:

- **Stroke/garis**: `#171717`
- **Background**: transparan (bekerja di white + light backgrounds)
- **Bintang dekoratif**: `#FACC15`

## 3. Format File

```
src/assets/characters/<nama>-<ekspresi>.svg
```

| File                   | Ukuran                       |
| ---------------------- | ---------------------------- |
| `rubi-default.svg`     | Standing/waving              |
| `rubi-happy.svg`       | Senyum, mata tertutup        |
| `rubi-thinking.svg`    | Tangan di dagu, mata ke atas |
| `rubi-celebrate.svg`   | Tangan di atas, bintang      |
| `bina-default.svg`     | Standing                     |
| `bina-happy.svg`       | Senyum lebar                 |
| `bina-thinking.svg`    | Tangan di dagu               |
| `bina-celebrate.svg`   | Tangan di atas, bintang      |
| `nina-default.svg`     | Standing                     |
| `nina-happy.svg`       | Senyum lebar                 |
| `nina-thinking.svg`    | Tangan di dagu               |
| `nina-celebrate.svg`   | Tangan di atas, bintang      |
| `rina-default.svg`     | Standing                     |
| `rina-happy.svg`       | Mata garis senyum            |
| `rina-thinking.svg`    | Tangan di dagu               |
| `rina-celebrate.svg`   | Tangan di atas, bintang      |
| `rubina-default.svg`   | Standing/waving              |
| `rubina-happy.svg`     | Senyum lebar                 |
| `rubina-thinking.svg`  | Tangan di dagu               |
| `rubina-celebrate.svg` | Tangan di atas, bintang      |

## 4. Teknis SVG

- **viewBox**: `0 0 100 100`
- **Ukuran file**: < 5KB per SVG
- **Optimizer**: SVGO (otomatis via build script)
- **Naming**: `<nama>-<ekspresi>.svg` (lowercase, hyphen-separated)
- **Attributes**: `role="img"` + `aria-label` untuk aksesibilitas
- **Tidak ada**: `style` inline, `id` attribute, gradient (kecuali perlu)

## 5. Skalabilitas

Semua karakter harus jelas di 3 ukuran:

| Ukuran | Kegunaan                 |
| ------ | ------------------------ |
| 32px   | Icon/emoji kecil         |
| 64px   | Header worksheet         |
| 128px  | Halaman cover/prominence |

Karakter dirancang di viewBox 100×100 sehingga skalabel ke ukuran apa pun.

## 6. Ekspresi

| Ekspresi      | Mata                    | Mulut        | Tangan           | Elemen Tambahan   |
| ------------- | ----------------------- | ------------ | ---------------- | ----------------- |
| **default**   | Bulat besar + highlight | Senyum kecil | Di samping/bawah | —                 |
| **happy**     | Tertutup (arc atas)     | Senyum lebar | Di samping       | —                 |
| **thinking**  | Bulat + ke atas         | Garis lurus  | Satu ke dagu     | 3 titik pikir     |
| **celebrate** | Bulat besar             | Senyum besar | Di atas          | Bintang dekoratif |

## 7. Referensi

- Gaya dasar: Open Peeps (CC0) — lebih kawaii untuk anak 2 tahun
- Kawaii ratio:/head-to-body 40-60 (chibi/kawaii standard)
- Line weight 2.5px: konsisten di semua karakter
- Semua maskot dibuat sendiri, lisensi MIT
