# Kontribusi

Bahasa: Bahasa Indonesia untuk konten worksheet; boleh campuran ID/EN untuk diskusi teknis.

## Sebelum Mulai

1. Baca `AGENTS.md` (wajib untuk AI agent maupun manusia).
2. Baca spec halaman di `docs/03-KONTEN_WORKSHEET.md`.
3. Cek komponen existing di `src/components/` — reuse, jangan duplikasi.

## Alur PR

1. Fork/branch: `feat/<kategori>-<slug>` (ex: `feat/pola-ab`).
2. Kerjakan 1 halaman per PR agar review visual mudah.
3. Sertakan screenshot hasil `npm run dev` (atau PNG output) di deskripsi PR.
4. Pastikan lolos: `npm run build`, `npm run generate:all`, `npm run validate`.
5. Jika tambah aset: update tabel di `docs/04-ASET_ILUSTRASI.md` (sumber + lisensi).

## Standar Review

- Teks Bahasa Indonesia pendek & aktif; ada `ParentNote`.
- Token desain dipatuhi (tidak ada hex/font hardcode).
- Karakter kategori benar; elemen ≥ 32px; lolos B&W.
- Tidak commit `output/`, `dist/`, ZIP.

## Menambah Dependency

Tulis alasan di deskripsi PR (masalah → alternatif → kenapa pilih ini). Jaga total PDF < 5MB.
