import { useState } from "preact/hooks";
import { narasi } from "../../utils/tts";
import { bunyiTap } from "../../utils/audio";
import { tambahXp, xpHalaman } from "../../utils/progress";

export interface AktivitasGame {
  svg: string;
  perintah: string;
  /** teks narasi (default = perintah) */
  suara?: string;
}

interface Props {
  idHalaman: string;
  aktivitas: AktivitasGame[];
  audioKey: string;
  audioText: string;
}

/** Kartu gerak: ketuk PUTAR → muncul perintah acak + narasi. */
export default function ActivitySpinner({ idHalaman, aktivitas, audioKey, audioText }: Props) {
  const [jalan, setJalan] = useState<number | null>(null);
  const [pop, setPop] = useState(false);

  const putar = () => {
    bunyiTap();
    let n = Math.floor(Math.random() * aktivitas.length);
    if (aktivitas.length > 1) {
      while (n === jalan) n = Math.floor(Math.random() * aktivitas.length);
    }
    setJalan(n);
    setPop(false);
    requestAnimationFrame(() => setPop(true));
    const a = aktivitas[n];
    void narasi(`${audioKey}-${n + 1}`, a.suara ?? a.perintah);
    // XP kecil, dibatasi agar tidak di-farming
    if (xpHalaman(idHalaman) < 10) tambahXp(idHalaman, false);
  };

  return (
    <div class="flex flex-col items-center gap-5">
      <div class="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-surface p-5 text-center shadow-card">
        {jalan === null ? (
          <p class="font-sans text-base text-muted">Ketuk PUTAR!</p>
        ) : (
          <>
            <span
              key={jalan}
              class={`inline-block h-28 w-28 ${pop ? "game-pop" : ""}`}
              dangerouslySetInnerHTML={{ __html: aktivitas[jalan].svg }}
            />
            <p class="font-display text-2xl font-bold">{aktivitas[jalan].perintah}</p>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={putar}
        class="game-tap rounded-full bg-rubina-mint-500 px-10 font-display text-2xl font-bold text-white shadow-card"
      >
        PUTAR 🎲
      </button>
      <p class="font-sans text-base text-muted">{audioText}</p>
    </div>
  );
}
