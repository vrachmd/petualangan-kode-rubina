# 03 — Spesifikasi Konten Worksheet (20 Halaman)

Setiap halaman: judul, tujuan coding, komponen, instruksi anak, ParentNote, karakter, kriteria lolos.
Teks final Bahasa Indonesia, kalimat aktif pendek. Nama anak via `NAMA_ANAK` (default "Rubina"), jangan hardcode.

## Konvensi Umum

- Header: judul + karakter kategori. Footer: `Petualangan Kode {NAMA_ANAK} • Halaman {n}`.
- ParentNote format: "Bantu anak: ..." (1–2 langkah) + contoh pertanyaan ("Mana yang berikutnya?") + pujian proses.
- Elemen interaktif ≥ 32px. Font konten ≥ 20px.

---

## Cover + Panduan (2 hal)

### 00 — Cover (`src/pages/index.astro` → pindah ke `src/pages/sampul.astro`, route `/sampul/`)

- Judul: **Petualangan Kode Rubina** (pakai `NAMA_ANAK`). Subtitle: _Worksheet Coding untuk Anak 2 Tahun_.
- Visual: Rubina + Rubi/Bina/Nina/Rina mengelilingi laptop mainan. 3 badge: Pola • Urutan • Arah.
- Lolos: judul terbaca dari jarak 1m saat print; nama ganti otomatis via `nama.ts`.

### 01 — Panduan Orang Tua (`src/pages/panduan-orang-tua.astro`)

- Isi ringkas dari `docs/05-PANDUAN_ORANG_TUA.md`: cara pakai, 3–5 menit/halaman, puji proses, tips laminasi.
- Wajib ada kredit kecil: `Ikon: Twemoji © Twitter (CC-BY 4.0)`.
- Lolos: muat 1 halaman A4, font ≥ 20px.

---

## Pola — Rubi 🐰 (4 hal)

| File                     | Pola                      | Aktivitas                                                                | ParentNote                                                                         |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `pola/01-ab.astro`       | 🔴🟡🔴🟡⬜⬜              | Warnai 2 lingkaran kosong (krayon tebal)                                 | "Bantu anak: sebut 'merah, kuning, merah, kuning...' lalu tanya 'berikutnya apa?'" |
| `pola/02-abb.astro`      | 🟢🟢🔵🟢🟢⬜              | Warnai 1 lingkaran; bedakan bentuk (lingkaran vs bintang) agar lolos B&W | "Tunjuk pasangannya: 'dua sama, satu beda'"                                        |
| `pola/03-abc.astro`      | 🟠🟣🟡🟠🟣⬜              | Warnai 1; label huruf A-B-C di bawah tiap bentuk                         | "Sebut A-B-C sambil tunjuk"                                                        |
| `pola/04-campuran.astro` | 2 baris pendek (AB + ABB) | Lingkari pola yang sama dengan contoh                                    | "Minta anak menunjuk, bukan menjelaskan"                                           |

Lolos: lingkaran ≥ 40px; urutan contoh tidak terpotong; ada label bentuk selain warna.

## Sequencing — Bina 🐻 (4 hal)

Komponen: `SequenceCard` 3 langkah bernomor 1-2-3 + panah antar kartu.

| File                              | Tema         | Langkah                                 |
| --------------------------------- | ------------ | --------------------------------------- |
| `sequencing/01-cuci-tangan.astro` | Cuci tangan  | 1 Buka keran → 2 Sabun → 3 Bilas        |
| `sequencing/02-makan.astro`       | Makan        | 1 Ambil sendok → 2 Ambil nasi → 3 Makan |
| `sequencing/03-tidur.astro`       | Tidur        | 1 Ganti baju → 2 Sikat gigi → 3 Bobo    |
| `sequencing/04-main.astro`        | Beres mainan | 1 Ambil → 2 Masukkan kotak → 3 Tutup    |

ParentNote (semua): "Ceritakan gambar 1-2-3. Minta anak menunjuk 'pertama / lalu / terakhir'. Praktikkan langsung setelahnya."
Lolos: tiap kartu ada angka + gambar + label 1 kata; panah arah jelas.

## Arah — Nina 🦊 (4 hal)

| File                            | Aktivitas                    | Detail                                                                          |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------------- |
| `arah/01-lacak-garis.astro`     | Lacak garis lurus & lengkung | 3 jalur (lurus, zigzag landai, lengkung), tebal ≥ 3pt, titik start 🟢 finish 🏁 |
| `arah/02-ikuti-panah.astro`     | Warnai panah ↑ → ↓           | 6 panah besar (≥ 48px), instruksi "warnai yang menunjuk ke atas"                |
| `arah/03-labirin.astro`         | Labirin 3 jalur, 1 benar     | Jalur lebar (jari bisa lewat), tanpa jalan buntu menakutkan                     |
| `arah/04-nina-cari-jalan.astro` | Bantu Nina 🦊 ke 🏠          | Grid 3×3 sederhana, 3 langkah: → → ↓ (contoh terisi, 1 varian kosong)           |

ParentNote: "Gerakkan jari dulu sebelum krayon. Sebut arah dengan gerakan tangan."
Lolos: start/finish jelas; jalur tidak terlalu sempit untuk krayon tebal.

## Sebab-Akibat — Rina 🤖 (3 hal)

Komponen: `IfThenPair` (kiri aksi → panah → kanan hasil). Anak: tarik garis / tempel stiker / lingkari pasangan.

| File                                 | Pasangan                                            |
| ------------------------------------ | --------------------------------------------------- |
| `sebab-akibat/01-tombol-lampu.astro` | Tekan tombol merah → lampu nyala; tekan biru → mati |
| `sebab-akibat/02-tarik-mainan.astro` | Tarik tali → mobil jalan; dorong → berhenti         |
| `sebab-akibat/03-tekan-bunyi.astro`  | Tekan bel → bunyi "ting!"; tepuk → bunyi "plok!"    |

ParentNote: "Mainkan dulu dengan benda nyata (lampu/saklar). Lalu kerjakan kertas."
Lolos: tiap pasangan ada ikon aksi + hasil yang berbeda bentuk (tidak hanya warna).

## Kartu Aktivitas (1 hal)

- File: `src/pages/kartu-aktivitas.astro`. 6 kartu: Lompat 2× 🐇, Putar 🔄, Sentuh hidung 👃, Duduk 🪑, Tepuk tangan 👏, Berlari di tempat 🏃.
- Tiap kartu: gambar besar + 1 perintah + garis gunting putus-putus.
- ParentNote: "Gunting kartunya. Acak. Bacakan satu per satu. Ikut bergerak bersama anak."
- Ukuran: default 6/halaman (±70×100mm). Jika uji motorik sulit digunting, pecah jadi 2 halaman (3/halaman).
- Lolos: garis potong tidak memotong gambar; perintah ≤ 3 kata.

## Free Play — Rubina ✨ (2 hal)

| File                          | Aktivitas                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `bebas/01-buat-pola.astro`    | Baris lingkaran kosong 6 buah + contoh mini AB. Instruksi: "Buat pola kesukaanmu!"                  |
| `bebas/02-gambar-robot.astro` | Wajah robot kosong (lingkaran + mata kosong) + stiker bentuk opsional. Instruksi: "Gambar robotmu!" |

ParentNote: "Biarkan anak bebas. Tidak ada salah. Tanya 'ceritakan gambarmu!'."
Lolos: area gambar besar (≥ 50% halaman); tidak ada jawaban benar/salah.
