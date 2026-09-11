import { useEffect, useState } from "preact/hooks";
import { muatProgress, resetProgress, xpKategori } from "../../utils/progress";
import { suaraAktif, setSuaraAktif, bunyiTap } from "../../utils/audio";
import { PAGES } from "../../scripts/pages";

interface Props {
  terbuka: boolean;
  onTutup: () => void;
}

/** Panel khusus orang tua: statistik, suara, reset. Dibuka via triple-tap judul. */
export default function ModeOrtu({ terbuka, onTutup }: Props) {
  const [suara, setSuara] = useState(true);
  const [totalXp, setTotalXp] = useState(0);
  const [dibuka, setDibuka] = useState(0);
  const [direset, setDireset] = useState(false);

  useEffect(() => {
    if (!terbuka) return;
    setSuara(suaraAktif());
    const p = muatProgress();
    setTotalXp(xpKategori(PAGES.map((h) => h.id)));
    setDibuka(p.dibuka.length);
    setDireset(false);
  }, [terbuka]);

  if (!terbuka) return null;

  const gantiSuara = () => {
    const next = !suara;
    setSuara(next);
    setSuaraAktif(next);
    bunyiTap();
  };

  const reset = () => {
    if (!direset) {
      setDireset(true);
      return;
    }
    resetProgress();
    onTutup();
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-6">
      <div class="w-full max-w-md rounded-2xl bg-surface p-6 shadow-card">
        <h2 class="font-display text-xl font-bold">Mode Orang Tua 👪</h2>
        <p class="mt-2 font-sans text-base text-muted">
          {dibuka} dari {PAGES.length} halaman dibuka • {totalXp} XP terkumpul
        </p>

        <button
          type="button"
          onClick={gantiSuara}
          class="game-tap mt-4 flex w-full items-center justify-between rounded-xl border border-line px-4 font-sans text-base font-bold"
        >
          <span>🔊 Suara narasi</span>
          <span>{suara ? "NYALA" : "MATI"}</span>
        </button>

        <button
          type="button"
          onClick={reset}
          class="game-tap mt-3 w-full rounded-xl border border-rubina-pink-200 bg-rubina-pink-50 px-4 font-sans text-base font-bold text-rubina-pink-600"
        >
          {direset ? "Ketuk lagi untuk reset semua progress!" : "🔄 Ulangi dari awal"}
        </button>

        <button
          type="button"
          onClick={onTutup}
          class="game-tap mt-4 w-full rounded-full bg-ink px-4 font-display text-lg font-bold text-white"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
