# Changelog

Format: Keep a Changelog (ID ringkas). Tanggal: YYYY-MM-DD.

## [Unreleased]

### Ditambahkan
- Dokumentasi awal: README, AGENTS.md, docs/01–05, CONTRIBUTING.
- Spesifikasi 20 halaman + design system "Rubina" + panduan orang tua.
- Scaffold Astro 5 + Tailwind token rubina + 8 komponen dasar + halaman contoh.
- Aset: 5 maskot custom (Rubi, Bina, Nina, Rina, Rubina) + 31 ikon Twemoji via `npm run download-assets`.
- 6 komponen worksheet: PatternRow, SequenceCard, ArrowPath, IfThenPair, ActivityCard, FreePlayArea.
- Halaman sementara `contoh-komponen` untuk QA visual (dihapus di Minggu 3).
- Redesain maskot Nina si Rubah: warna Kurama (oranye + krem), versi lucu selaras maskot lain (mata bulat, pipi merona).
- Ganti 3 maskot hewan ke Twemoji (Rubi 🐰, Bina 🐻, Nina 🦊) — langsung dikenali anak; Rina + Rubina tetap custom.
- 20 halaman worksheet asli (sampul, panduan, pola ×4, sequencing ×4, arah ×4, sebab-akibat ×3, kartu, bebas ×2).
- Pipeline generate: PDF (A4 + merge) + PNG (±300 DPI) + SVG (standalone) + `npm run validate` (SEMUA LOLOS).
- Perbaikan pipeline: spawn preview tanpa shell + kill tree proses (anti yatim), SVG tulis mentah (SVGO crash pseudo-element).
- Perbaikan cetak: background abu-abu hilang di PDF (reset main saat print), footer fix di bawah via min-height 267mm, cover tanpa footer, ParentNote cover nempel bawah, cek PDF tepat 1 halaman.
- Game interaktif Sprint 0-2: Preact + base GitHub Pages + deploy workflow, utils TTS/progress/audio, galeri /game/, 7 komponen (Perayaan, Pattern, Sequence, Arrow, IfThen, Spinner, Canvas) — lolos uji tap Playwright + XP tersimpan.
- Sprint 3: 18 level game asli (/game/pola, sequencing, arah, sebab-akibat, kartu, bebas) + galeri tombol Main/Versi cetak + mode bebas pola + label tujuan ArrowGame.
- Sprint 4: 30 narasi MP3 Bahasa Indonesia (edge-tts, di-commit untuk offline) + service worker precache 113 file (teruji offline) + Mode Ortu (triple-tap: statistik, suara, reset).
- Fix deploy: build.format directory agar /game/ resolve di Pages (file → game.html hanya dimengerti preview lokal) + guard src-dist di validate + nama script audio + install browser di CI.
- Landing website di `/`: hero + pilih aktivitas (Main/Cetak per kategori) + download PDF + panduan. Cover cetak pindah ke `/sampul/`.
- SEO share (WhatsApp): OG/Twitter Card + canonical + theme-color; favicon Rubina (SVG/PNG/apple-touch); og-cover.jpg 1200×630.
- Auto-narasi: bunyi sendiri saat layar pertama disentuh (18 level); tombol 🔊 tetap untuk ulang.
- Revert auto-narasi: narasi hanya via tombol 🔊 (keputusan produk).

## [0.1.0] — TBD (Setup Repo)
- Rencana: init Astro + Tailwind + Playwright, design tokens, base components.
