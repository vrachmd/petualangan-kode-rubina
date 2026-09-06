import { useState } from "preact/hooks";
import { narasi } from "../../utils/tts";
import { bunyiTap, bunyiBenar, bunyiCobaLagi } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

export interface LangkahGame {
  /** SVG mentah (import ?raw di halaman .astro) */
  svg: string;
  label: string;
}

interface Props {
  idHalaman: string;
  langkah: [LangkahGame, LangkahGame, LangkahGame];
  audioKey: string;
  audioText: string;
  aksen?: string;
}

/** Game urutan: ketuk kartu 1 → 2 → 3 sesuai nomor. */
export default function SequenceGame({ idHalaman, langkah, audioKey, audioText, aksen = "#F97316" }: Props) {
  const [lanjut, setLanjut] = useState(0);
  const [salah, setSalah] = useState(0);
  const [goyang, setGoyang] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);

  const ketuk = (i: number) => {
    if (selesai) return;
    if (i === lanjut) {
      bunyiBenar();
      const n = lanjut + 1;
      setLanjut(n);
      if (n >= langkah.length) {
        tambahXp(idHalaman, salah === 0);
        setSelesai(true);
      }
    } else if (i > lanjut) {
      setSalah((s) => s + 1);
      bunyiCobaLagi();
      setGoyang(i);
      setTimeout(() => setGoyang(null), 400);
    } else {
      bunyiTap();
      void narasi(audioKey, audioText);
    }
  };

  const ulangi = () => {
    setLanjut(0);
    setSalah(0);
    setSelesai(false);
  };

  return (
    <div class="flex flex-col items-center gap-4">
      <ol class="flex w-full items-stretch justify-center gap-2">
        {langkah.map((s, i) => {
          const aktif = i < lanjut;
          const berikut = i === lanjut;
          return (
            <li key={i} class="flex flex-1">
              <button
                type="button"
                onClick={() => ketuk(i)}
                aria-label={`Langkah ${i + 1}: ${s.label}`}
                class={`game-tap flex flex-1 flex-col items-center gap-2 rounded-xl border-2 p-3 text-center shadow-card ${
                  berikut ? "border-ink bg-rubina-sunny-50" : "border-line bg-surface"
                } ${goyang === i ? "game-goyang" : ""}`}
              >
                <span
                  class="flex h-10 w-10 items-center justify-center rounded-full font-display text-xl font-bold text-white"
                  style={{ background: aksen, opacity: aktif || berikut ? 1 : 0.45 }}
                >
                  {i + 1}
                </span>
                <span
                  class="inline-block h-16 w-16 sm:h-20 sm:w-20"
                  style={{ opacity: aktif || berikut ? 1 : 0.45 }}
                  dangerouslySetInnerHTML={{ __html: s.svg }}
                />
                <span class="font-sans text-base font-bold">{s.label}</span>
                {aktif && <span aria-hidden="true">✅</span>}
              </button>
            </li>
          );
        })}
      </ol>
      <p class="font-sans text-base text-muted">Ketuk gambar nomor 1, lalu 2, lalu 3!</p>
      <Perayaan tampil={selesai} pesan="Hebat! Urutannya benar! 🎉" onMainLagi={ulangi} />
    </div>
  );
}
