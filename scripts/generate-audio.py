#!/usr/bin/env python3
"""Generate narasi MP3 Bahasa Indonesia via edge-tts (gratis, Microsoft).

Pakai : npm run generate-audio   (butuh: pip install edge-tts)
Output: public/audio/<key>.mp3  (di-commit agar offline + stabil)
File yang sudah ada dilewati (inkremental).
"""
import asyncio
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("ERROR: modul edge-tts belum ada. Jalankan: pip install edge-tts")
    sys.exit(1)

SUARA = "id-ID-GadisNeural"  # suara perempuan, cocok untuk konten balita
RATE = "-5%"  # sedikit lebih lambat agar jelas

# key -> teks. HARUS sinkron dengan audioKey di src/pages/game/**/*.astro
# dan pasangan `suara` di IfThenGame / ActivitySpinner.
FRASE = {
    # Pola
    "game/pola-ab": "Ketuk warna merah muda, lalu ketuk lingkaran kosong!",
    "game/pola-abb": "Dua hijau, satu biru! Ketuk warnanya!",
    "game/pola-abc": "A, B, C! Ketuk warnanya bergantian!",
    "game/pola-campuran": "Lengkapi polanya! Kamu pasti bisa!",
    # Sequencing
    "game/seq-cuci": "Ketuk gambar nomor satu, dua, tiga!",
    "game/seq-makan": "Ketuk gambar nomor satu, dua, tiga!",
    "game/seq-tidur": "Ketuk gambar nomor satu, dua, tiga!",
    "game/seq-main": "Ketuk gambar nomor satu, dua, tiga!",
    # Arah
    "game/arah-lurus": "Ketuk kotak berikutnya! Maju terus!",
    "game/arah-belok": "Ikuti panahnya! Belok kanan, turun!",
    "game/arah-wortel": "Antar Nina ke wortel! Ikuti panahnya!",
    "game/arah-pulang": "Bantu Nina pulang! Kanan, kanan, turun!",
    # Sebab-akibat
    "game/sebab-tombol": "Ketuk tombolnya! Apa yang terjadi?",
    "game/sebab-tombol-1": "Tekan merah, lampu nyala!",
    "game/sebab-tombol-2": "Tekan biru, gelap, bobo!",
    "game/sebab-tali": "Tarik talinya! Apa yang terjadi?",
    "game/sebab-tali-1": "Tarik tali, mobil jalan!",
    "game/sebab-tali-2": "Tahan, mobil berhenti!",
    "game/sebab-bunyi": "Ketuk gambarnya! Bunyi apa?",
    "game/sebab-bunyi-1": "Tekan bel, ting!",
    "game/sebab-bunyi-2": "Tepuk tangan, plok!",
    # Kartu gerak
    "game/kartu": "Ketuk putar, ikuti gerakannya!",
    "game/kartu-1": "Lompat dua kali!",
    "game/kartu-2": "Putar badanmu!",
    "game/kartu-3": "Sentuh hidungmu!",
    "game/kartu-4": "Duduk manis!",
    "game/kartu-5": "Tepuk tangan!",
    "game/kartu-6": "Lari di tempat!",
    # Bebas
    "game/bebas-pola": "Buat pola kesukaanmu! Bebas!",
    "game/bebas-robot": "Gambar robotmu! Coret dengan jari!",
}

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"


async def buat(key: str, teks: str) -> bool:
    target = OUT / f"{key}.mp3"
    if target.exists():
        print(f"LEWAT {key} (sudah ada)")
        return True
    target.parent.mkdir(parents=True, exist_ok=True)
    try:
        tts = edge_tts.Communicate(teks, SUARA, rate=RATE)
        await tts.save(str(target))
        print(f"OK   {key}")
        return True
    except Exception as e:  # network error dsb — jangan gagalkan build
        print(f"GAGAL {key}: {e}")
        return False


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    hasil = [await buat(k, t) for k, t in FRASE.items()]
    ok = sum(hasil)
    print(f"\nSelesai: {ok}/{len(FRASE)} -> {OUT}")
    if ok < len(FRASE):
        print("Sebagian gagal (biasanya jaringan). Game tetap jalan via fallback Web Speech.")
        sys.exit(2)


if __name__ == "__main__":
    asyncio.run(main())
