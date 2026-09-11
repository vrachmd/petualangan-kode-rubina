import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import ModeOrtu from "./ModeOrtu";
import { ORDER } from "./level";
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
  const [nav, setNav] = useState<{ sebelum: string | null; lanjut: string | null }>({
    sebelum: null,
    lanjut: null,
  });

  // Navigasi level otomatis dari posisi URL saat ini (tanpa edit tiap halaman)
  useEffect(() => {
    const b = base.endsWith("/") ? base.slice(0, -1) : base;
    let rel = window.location.pathname;
    if (rel.startsWith(b)) rel = rel.slice(b.length);
    rel = rel.replace(/\/$/, "") || "/";
    const i = ORDER.indexOf(rel);
    if (i >= 0) {
      setNav({
        sebelum: i > 0 ? ORDER[i - 1] : null,
        lanjut: i < ORDER.length - 1 ? ORDER[i + 1] : null,
      });
    }
  }, []);

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
      <main class="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 pb-4">{children}</main>
      <nav
        class="mx-auto flex w-full max-w-[560px] items-center justify-between gap-2 px-4 pb-6"
        aria-label="Pindah level"
      >
        {nav.sebelum ? (
          <a
            href={`${base}${nav.sebelum.replace(/^\//, "")}`}
            class="game-tap flex min-h-[56px] items-center rounded-full bg-surface px-5 font-display text-base font-bold shadow-card"
          >
            ← Sebelum
          </a>
        ) : (
          <span />
        )}
        <a
          href={`${base}game/`}
          class="game-tap flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl shadow-card"
          aria-label="Galeri permainan"
        >
          🏠
        </a>
        {nav.lanjut ? (
          <a
            href={`${base}${nav.lanjut.replace(/^\//, "")}`}
            class="game-tap flex min-h-[56px] items-center rounded-full bg-rubina-pink-500 px-5 font-display text-base font-bold text-white shadow-card"
          >
            Lanjut →
          </a>
        ) : (
          <span />
        )}
      </nav>
      <ModeOrtu terbuka={ortu} onTutup={() => setOrtu(false)} />
    </div>
  );
}
