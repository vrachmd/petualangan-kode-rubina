import type { ComponentChildren } from "preact";
import "../styles/game.css";

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
        <h1 class="font-display text-xl font-bold">{judul}</h1>
      </header>
      <main class="flex flex-1 flex-col px-4 pb-6">{children}</main>
    </div>
  );
}
