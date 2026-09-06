import type { ComponentChildren } from "preact";
import { useRef, useState } from "preact/hooks";
import ModeOrtu from "./ModeOrtu";
import "../../styles/game.css";

interface Props {
  /** Judul level, ex: "Pola Merah-Kuning" */
  judul: string;
  /** URL kembali (biasanya /game/) */
  kembali?: string;
  children: ComponentChildren;
}

/** Layar penuh game: tombol kembali besar + judul + area main. */
export default function GameLayout({ judul, kembali, children }: Props) {
  const base = import.meta.env.BASE_URL;
  const [ortu, setOrtu] = useState(false);
  const ketuk = useRef<number[]>([]);

  /** Triple-tap judul < 1,5 detik → panel orang tua (aman dari tap acak anak). */
  const cekOrtu = () => {
    const kini = Date.now();
    ketuk.current = [...ketuk.current, kini].filter((t) => kini - t < 1500);
    if (ketuk.current.length >= 3) {
      ketuk.current = [];
      setOrtu(true);
    }
  };

  return (
    <div class="game-layar flex min-h-screen flex-col bg-background font-sans text-ink">
      <header class="flex items-center gap-3 px-4 py-3">
        {kembali !== undefined && (
          <a
            href={`${base}${kembali.replace(/^\//, "")}`}
            class="game-tap flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl shadow-card"
            aria-label="Kembali"
          >
            ←
          </a>
        )}
        <h1 class="font-display text-xl font-bold" onClick={cekOrtu}>
          {judul}
        </h1>
      </header>
      <main class="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 pb-6">{children}</main>
      <ModeOrtu terbuka={ortu} onTutup={() => setOrtu(false)} />
    </div>
  );
}
