import { bunyiBintang } from "../../utils/audio";
import { useEffect } from "preact/hooks";

interface Props {
  tampil: boolean;
  pesan?: string;
  onMainLagi: () => void;
}

/** Overlay reward: bintang besar + pujian + tombol main lagi. */
export default function Perayaan({ tampil, pesan = "Hebat!", onMainLagi }: Props) {
  useEffect(() => {
    if (tampil) bunyiBintang();
  }, [tampil]);

  if (!tampil) return null;
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
      <div class="flex flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center shadow-card">
        <span class="game-bintang text-6xl" aria-hidden="true">⭐</span>
        <p class="font-display text-2xl font-bold">{pesan}</p>
        <button
          type="button"
          onClick={onMainLagi}
          class="game-tap rounded-full bg-rubina-pink-500 px-8 font-display text-xl font-bold text-white shadow-card"
        >
          Main Lagi 🔄
        </button>
      </div>
    </div>
  );
}
