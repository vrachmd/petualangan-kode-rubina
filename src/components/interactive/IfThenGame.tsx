import { useState } from "preact/hooks";
import { narasi } from "../../utils/tts";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

export interface PasanganGame {
  aksiSvg: string;
  aksiLabel: string;
  hasilSvg: string;
  hasilLabel: string;
  /** kalimat narasi saat terbuka, ex: "Tekan bel... ting!" */
  suara: string;
}

interface Props {
  idHalaman: string;
  pasangan: PasanganGame[];
  audioKey: string;
  audioText: string;
}

/** Game sebab-akibat: ketuk aksi → hasilnya muncul + bunyi. */
export default function IfThenGame({ idHalaman, pasangan, audioKey, audioText }: Props) {
  const [buka, setBuka] = useState<boolean[]>(() => pasangan.map(() => false));
  const [selesai, setSelesai] = useState(false);

  const ketuk = (i: number) => {
    if (selesai || buka[i]) return;
    // Satu tap = satu suara: narasi hasil saja
    void narasi(`${audioKey}-${i + 1}`, pasangan[i].suara);
    const next = [...buka];
    next[i] = true;
    setBuka(next);
    if (next.every(Boolean)) {
      tambahXp(idHalaman, true);
      setSelesai(true);
    }
  };

  const ulangi = () => {
    setBuka(pasangan.map(() => false));
    setSelesai(false);
    void narasi(audioKey, audioText);
  };

  return (
    <div class="flex flex-col items-center gap-4">
      {pasangan.map((p, i) => (
        <div key={i} class="flex w-full items-stretch justify-center gap-2">
          <button
            type="button"
            onClick={() => ketuk(i)}
            aria-label={p.aksiLabel}
            class="game-tap flex flex-1 flex-col items-center gap-1 rounded-xl border-2 border-rubina-lavender-200 bg-rubina-lavender-50 p-3 text-center shadow-card"
          >
            <span class="inline-block h-16 w-16 sm:h-20 sm:w-20" dangerouslySetInnerHTML={{ __html: p.aksiSvg }} />
            <span class="font-sans text-base font-bold">{p.aksiLabel}</span>
          </button>
          <div class="flex items-center" aria-hidden="true">
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <path d="M8 24h28M26 14l10 10-10 10" stroke="#9333EA" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div class="flex flex-1 flex-col items-center gap-1 rounded-xl border-2 border-rubina-sunny-200 bg-rubina-sunny-50 p-3 text-center shadow-card">
            {buka[i] ? (
              <>
                <span class="game-pop inline-block h-16 w-16 sm:h-20 sm:w-20" dangerouslySetInnerHTML={{ __html: p.hasilSvg }} />
                <span class="font-sans text-base font-bold">{p.hasilLabel}</span>
              </>
            ) : (
              <>
                <span class="flex h-16 w-16 items-center justify-center text-3xl sm:h-20 sm:w-20" aria-hidden="true">❓</span>
                <span class="font-sans text-base text-muted">Ketuk kiri!</span>
              </>
            )}
          </div>
        </div>
      ))}
      <Perayaan tampil={selesai} pesan="Wah, ternyata begitu! 🎉" onMainLagi={ulangi} />
    </div>
  );
}
