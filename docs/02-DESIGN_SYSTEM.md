# 02 — Design System "Rubina"

Token resmi. Implementasi di `tailwind.config.mjs`. Jangan hardcode nilai di komponen.

## Warna

| Token             | 50      | 100     | 200     | 500     | 600     | Pakai                  |
| ----------------- | ------- | ------- | ------- | ------- | ------- | ---------------------- |
| `rubina.pink`     | #FFF0F3 | #FFD6DC | #FFADB8 | #E85D75 | #D64963 | Pola / Rubi 🐰         |
| `rubina.peach`    | #FFF7ED | #FFEDD5 | #FED7AA | #F97316 | #EA580C | Sequencing / Bina 🐻   |
| `rubina.sky`      | #F0F9FF | #E0F2FE | #BAE6FD | #38BDF8 | #0EA5E9 | Arah / Nina 🦊         |
| `rubina.lavender` | #FAF5FF | #F3E8FF | #E9D5FF | #A855F7 | #9333EA | Sebab-akibat / Rina 🤖 |
| `rubina.mint`     | #F0FDF4 | #DCFCE7 | #BBF7D0 | #4ADE80 | #22C55E | Sukses / centang       |
| `rubina.sunny`    | #FEFCE8 | #FEF9C3 | #FDE047 | #FACC15 | #EAB308 | Aksen / bintang        |

Netral: background `#FAFAFA`, surface `#FFFFFF`, teks `#171717`, muted `#737373`, border `#E5E5E5`.

Aturan:

- Teks di atas warna 500/600 harus kontras WCAG AA (putih `#FFFFFF` atau teks `#171717` — cek via `npm run validate`).
- Jangan sampaikan info hanya lewat warna. Selalu tambah bentuk/label (ex: pola lingkaran vs bintang, bukan merah vs hijau saja).

## Tipografi

- Display: **Quicksand** 500/600/700 — judul halaman, angka langkah.
- Body: **Nunito** 400/600/700 — instruksi, ParentNote.
- Skala: `base` 20px/1.6 (minimum), `lg` 24px, `xl` 32px, `2xl` 40px, `3xl` 48px.
- Self-hosted via `@fontsource`. Dilarang Google Fonts CDN.

## Spacing, Radius, Shadow

- Spacing basis 4px; pakai `1,2,3,4,5,6,8,10,12` (4–48px).
- Radius: `sm` 8px, `md` 16px, `lg` 24px, `xl` 32px, `full` lingkaran.
- Shadow: `soft` (0 2px 8px rgba(0,0,0,.06)), `card` (0 4px 16px rgba(0,0,0,.08)). Tanpa shadow keras.

## Elemen Sentuh & Garis

- Target warnai/tempel/garis: diameter/sisi **≥ 32px** (ideal 40px).
- Ketebalan garis lacak: **≥ 3pt**, ujung bulat (round caps).
- Panah: stroke 2.5pt, round caps/joins, ukuran ≥ 32px.
- Margin cetak: **15mm** semua sisi (via `PageWrapper`). Jangan taruh konten interaktif di margin.

## Komponen & Varian

- `Box`: `card` (surface + border + shadow-card + rounded-lg), `soft` (tint 50 + rounded-md), `dashed` (area anak: border dashed + neutral bg).
- `Text`: `title` (display 2xl), `heading` (display xl), `body` (sans base), `note` (sans base muted, untuk ParentNote).
- `PatternRow`: props `pattern`, `emptyCount`, `size` (sm 24 / md 32 / lg 40 — default `lg` untuk 2th).
- `SequenceCard`: `steps[3]` (`image`, `label`, `number`), nomor lingkaran 40px.
- `ArrowPath`: `cells[]` (arah ↑→↓←), sel ≥ 48px, garis putus-putus untuk dilacak.
- `IfThenPair`: dua kolom `aksi → hasil` dengan ikon panah besar di tengah.
- `ActivityCard`: 70×100mm (6/halaman) atau 100×140mm (3/halaman — dipilih saat komposisi).
- `ParentNote`: kotak bawah halaman, ikon 💡 + "Bantu anak:" + 1–2 kalimat + contoh pujian proses.

## Cetak

- A4 portrait, `printBackground: true` di Playwright.
- Uji B&W wajib: fotokopi 1 halaman sample sebelum batch.
- Hindari teks < 20px dan garis < 2pt — tidak terbaca anak 2th dan pecah saat cetak.
