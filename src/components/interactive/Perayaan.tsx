import { bunyiBintang } from "../../utils/audio";
import { useEffect, useState } from "preact/hooks";
import { ORDER } from "./level";

interface Props {
  tampil: boolean;
  pesan?: string;
  onMainLagi: () => void;
}

const base = import.meta.env.BASE_URL;
const trimBase = (r: string) => (r.startsWith("/") ? r.slice(1) : r);

/** Overlay reward: bintang besar + pujian + tombol main lagi + tombol lanjut. */
export default function Perayaan({ tampil, pesan = "Hebat!", onMainLagi }: Props) {
  const [urlLanjut, setUrlLanjut] = useState<string | null>(null);

  useEffect(() => {
    if (!tampil) return;
    bunyiBintang();

    // Hitung URL level berikutnya otomatis
    const b = base.endsWith("/") ? base.slice(0, -1) : base;
    let rel = window.location.pathname;
    if (rel.startsWith(b)) rel = rel.slice(b.length);
    rel = rel.replace(/\/$/, "") || "/";
    const i = ORDER.indexOf(rel);
    if (i >= 0 && i < ORDER.length - 1) {
      setUrlLanjut(`${base}${trimBase(ORDER[i + 1])}`);
    } else {
      // Level terakhir → kembali ke galeri
      setUrlLanjut(`${base}game/`);
    }
  }, [tampil]);

  if (!tampil) return null;
  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-6">
      <div class="flex flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center shadow-card">
        <span class="game-bintang text-6xl" aria-hidden="true">
          ⭐
        </span>
        <p class="font-display text-2xl font-bold">{pesan}</p>
        <div class="flex flex-col gap-3 w-full">
          {urlLanjut && (
            <a
              href={urlLanjut}
              class="game-tap flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-rubina-mint-500 px-8 font-display text-xl font-bold text-white shadow-card"
            >
              Lanjut → 🎮
            </a>
          )}
          <button
            type="button"
            onClick={onMainLagi}
            class="game-tap flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-rubina-pink-500 px-8 font-display text-xl font-bold text-white shadow-card"
          >
            Main Lagi 🔄
          </button>
        </div>
      </div>
    </div>
  );
}
