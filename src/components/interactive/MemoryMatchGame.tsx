import { useState, useCallback, useEffect, useRef } from "preact/hooks";
import { bunyiTap, bunyiBenar, bunyiCobaLagi } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

interface Card {
  id: number;
  emoji: string;
  faceUp: boolean;
  matched: boolean;
}

interface Props {
  idHalaman: string;
  /** Array of emoji pairs — e.g. ["🍎","🍊"] for 2 pairs */
  emojis: string[];
  /** Number of grid columns */
  gridCols?: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCards(emojis: string[]): Card[] {
  const pairs = emojis.flatMap((emoji, idx) => [
    { id: idx * 2, emoji, faceUp: false, matched: false },
    { id: idx * 2 + 1, emoji, faceUp: false, matched: false },
  ]);
  return shuffle(pairs);
}

/**
 * Memory Match Game — Find matching pairs of cards.
 * Flip two cards at a time; match stays face-up, mismatch flips back.
 */
export default function MemoryMatchGame({ idHalaman, emojis, gridCols = 4 }: Props) {
  const [cards, setCards] = useState<Card[]>(() => buildCards(emojis));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [goyangIdx, setGoyangIdx] = useState<number | null>(null);
  const [popIdx, setPopIdx] = useState<number | null>(null);
  const lockRef = useRef(false);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && !selesai) {
      // Give XP: fewer moves = better (10 if moves <= pairs, 5 otherwise)
      const pairs = emojis.length;
      tambahXp(idHalaman, moves <= pairs + 2);
      setSelesai(true);
    }
  }, [allMatched, selesai, idHalaman, emojis.length, moves]);

  const handleTap = useCallback(
    (idx: number) => {
      if (lockRef.current) return;
      const card = cards[idx];
      if (card.faceUp || card.matched) return;
      if (flipped.length >= 2) return;

      bunyiTap();

      // Flip this card
      const next = [...cards];
      next[idx] = { ...next[idx], faceUp: true };
      setCards(next);

      const newFlipped = [...flipped, idx];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [i1, i2] = newFlipped;

        if (next[i1].emoji === next[i2].emoji) {
          // Match!
          lockRef.current = true;
          setTimeout(() => {
            bunyiBenar();
            setCards((prev) =>
              prev.map((c, i) => (i === i1 || i === i2 ? { ...c, matched: true } : c)),
            );
            setPopIdx(i1);
            setTimeout(() => setPopIdx(null), 500);
            setFlipped([]);
            lockRef.current = false;
          }, 400);
        } else {
          // No match — shake then flip back
          lockRef.current = true;
          setTimeout(() => {
            bunyiCobaLagi();
            setGoyangIdx(i1);
            setGoyangIdx(i2);
            setTimeout(() => {
              setCards((prev) =>
                prev.map((c, i) => (i === i1 || i === i2 ? { ...c, faceUp: false } : c)),
              );
              setGoyangIdx(null);
              setFlipped([]);
              lockRef.current = false;
            }, 400);
          }, 500);
        }
      }
    },
    [cards, flipped],
  );

  const ulangi = () => {
    setCards(buildCards(emojis));
    setFlipped([]);
    setMoves(0);
    setSelesai(false);
    setGoyangIdx(null);
    setPopIdx(null);
  };

  return (
    <div class="flex flex-col items-center gap-5">
      <p class="font-sans text-base text-muted">Cari pasangan yang sama! 🃏</p>
      <p class="font-sans text-base text-ink">
        Gerakan: <span class="font-bold">{moves}</span>
      </p>

      <div
        class="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
      >
        {cards.map((card, idx) => {
          const isFlipped = card.faceUp || card.matched;
          const isGoyang = goyangIdx === idx;
          const isPop = popIdx === idx || (card.matched && popIdx === null && flipped.length === 0);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleTap(idx)}
              aria-label={isFlipped ? card.emoji : "Kartu tertutup"}
              class={`game-tap perspective-500 relative ${isGoyang ? "game-goyang" : ""}`}
              style={{ width: "min(100px, 20vw)", height: "min(100px, 20vw)" }}
            >
              <div
                class={`card-inner ${isFlipped ? "card-flipped" : ""} ${isPop ? "game-pop" : ""}`}
              >
                {/* Front face (emoji) */}
                <div class="card-face card-front flex items-center justify-center rounded-xl bg-rubina-pink-100 shadow-card">
                  <span class="text-4xl select-none">{card.emoji}</span>
                </div>
                {/* Back face (hidden side) */}
                <div class="card-face card-back flex items-center justify-center rounded-xl bg-rubina-lavender-200 shadow-card">
                  <span class="text-3xl opacity-50 select-none">❓</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Perayaan tampil={selesai} pesan={`Hebat! Semua pasangan ketemu! 🎉`} onMainLagi={ulangi} />
    </div>
  );
}
