import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import ModeOrtu from "./ModeOrtu";
import { ORDER } from "./level";
import "../../styles/game.css";

interface Props {
  judul: string;
  kembali?: string;
  children: ComponentChildren;
}

const base = import.meta.env.BASE_URL;
const trimBase = (r: string) => r.startsWith('/') ? r.slice(1) : r;

export default function GameLayout({ judul, kembali, children }: Props) {
  const [ortu, setOrtu] = useState(false);
  const ketuk = useRef<number[]>([]);
  const [nav, setNav] = useState<{ sebelum: string | null; lanjut: string | null }>({
    sebelum: null,
    lanjut: null,
  });

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

  const cekOrtu = () => {
    const kini = Date.now();
    ketuk.current = [...ketuk.current, kini].filter((t) => kini - t < 1500);
    if (ketuk.current.length >= 3) {
      ketuk.current = [];
      setOrtu(true);
    }
  };

  const url = (r: string) => `${base}${trimBase(r)}`;

  return (
    <div class="game-layar flex min-h-screen flex-col bg-background font-sans text-ink">
      {/* Header */}
      <header class="flex items-center gap-3 px-4 py-3">
        {kembali !== undefined && (
          <a href={url(kembali)} class="game-tap flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl shadow-card" aria-label="Kembali">←</a>
        )}
        <h1 class="font-display text-xl font-bold" onClick={cekOrtu}>{judul}</h1>
      </header>

      {/* Main — padding bawah ekstra agar tidak tertutup nav fixed */}
      <main class="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-4 pb-24">{children}</main>

      {/* Fixed bottom navigation */}
      <nav class="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-background/95 px-4 py-3 backdrop-blur-sm" aria-label="Navigasi level">
        <div class="mx-auto flex max-w-[560px] items-center justify-between gap-2">
          {nav.sebelum ? (
            <a href={url(nav.sebelum)} class="game-tap flex min-h-[56px] items-center rounded-full bg-surface px-5 font-display text-base font-bold shadow-card">← Sebelum</a>
          ) : <span />}
          <a href={`${base}game/`} class="game-tap flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl shadow-card" aria-label="Galeri permainan">🏠</a>
          {nav.lanjut ? (
            <a href={url(nav.lanjut)} class="game-tap flex min-h-[56px] items-center rounded-full bg-rubina-pink-500 px-5 font-display text-base font-bold text-white shadow-card">Lanjut →</a>
          ) : <span />}
        </div>
      </nav>

      <ModeOrtu terbuka={ortu} onTutup={() => setOrtu(false)} />
    </div>
  );
}
