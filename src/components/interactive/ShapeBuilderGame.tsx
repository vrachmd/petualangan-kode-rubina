import { useState, useCallback } from "preact/hooks";
import { bunyiTap, bunyiBenar, bunyiCobaLagi } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

export type ShapeType = "lingkaran" | "segitiga" | "kotak";

export interface ShapeData {
  type: ShapeType;
  color: string;
  label: string;
}

export interface TargetCell {
  row: number;
  col: number;
  shape: ShapeData;
}

interface Props {
  idHalaman: string;
  /** Ukuran grid NxN */
  gridSize: number;
  /** Sel target yang harus diisi */
  targets: TargetCell[];
  /** Bentuk tersedia di palet */
  palette: ShapeData[];
}

/** SVG bentuk kecil untuk icon palet & preview */
function ShapeIcon({ shape, size = 48 }: { shape: ShapeData; size?: number }) {
  const pad = size * 0.12;
  const inner = size - pad * 2;

  if (shape.type === "lingkaran") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={inner / 2} fill={shape.color} />
      </svg>
    );
  }
  if (shape.type === "segitiga") {
    const cx = size / 2;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={`${cx},${pad} ${size - pad},${size - pad} ${pad},${size - pad}`}
          fill={shape.color}
        />
      </svg>
    );
  }
  // kotak
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={pad} y={pad} width={inner} height={inner} fill={shape.color} rx={4} />
    </svg>
  );
}

/**
 * Shape Builder Game — Anak membangun gambar dari bentuk geometri.
 *
 * 1. Lihat gambar referensi di atas.
 * 2. Pilih bentuk dari palet bawah.
 * 3. Ketuk kotak yang benar di grid kerja.
 * 4. Menang jika semua bentuk terpasang dengan benar!
 */
export default function ShapeBuilderGame({ idHalaman, gridSize, targets, palette }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [placed, setPlaced] = useState<Record<string, ShapeData>>({});
  const [salah, setSalah] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [goyang, setGoyang] = useState<string | null>(null);
  const [popCell, setPopCell] = useState<string | null>(null);

  const cellKey = (r: number, c: number) => `${r}-${c}`;

  const getTarget = useCallback(
    (r: number, c: number): TargetCell | undefined =>
      targets.find((t) => t.row === r && t.col === c),
    [targets],
  );

  const checkWin = useCallback(
    (next: Record<string, ShapeData>): boolean =>
      targets.every((t) => {
        const k = cellKey(t.row, t.col);
        const p = next[k];
        return p && p.type === t.shape.type && p.color === t.shape.color;
      }),
    [targets],
  );

  /* ── Pilih bentuk dari palet ── */
  const pilihBentuk = (idx: number) => {
    if (selesai) return;
    bunyiTap();
    setSelectedIdx((prev) => (prev === idx ? null : idx));
  };

  /* ── Ketuk sel grid ── */
  const ketukSel = (r: number, c: number) => {
    if (selesai) return;
    const key = cellKey(r, c);
    const existing = placed[key];

    // Sudah ada → hapus (undo)
    if (existing) {
      bunyiTap();
      const next = { ...placed };
      delete next[key];
      setPlaced(next);
      return;
    }

    // Belum pilih bentuk
    if (selectedIdx === null) return;
    const shape = palette[selectedIdx];
    const target = getTarget(r, c);

    // Cek apakah benar
    if (
      target &&
      selectedIdx !== null &&
      shape.type === target.shape.type &&
      shape.color === target.shape.color
    ) {
      bunyiTap();
      const next = { ...placed, [key]: shape };
      setPlaced(next);
      setSelectedIdx(null);

      // Efek pop
      setPopCell(key);
      setTimeout(() => setPopCell(null), 450);

      if (checkWin(next)) {
        setTimeout(() => {
          tambahXp(idHalaman, salah === 0);
          bunyiBenar();
          setSelesai(true);
        }, 350);
      }
    } else {
      // Salah!
      bunyiCobaLagi();
      setSalah((s) => s + 1);
      setGoyang(key);
      setTimeout(() => setGoyang(null), 400);
    }
  };

  const ulangi = () => {
    setPlaced({});
    setSelectedIdx(null);
    setSalah(0);
    setSelesai(false);
    setGoyang(null);
    setPopCell(null);
  };

  const cellPx = Math.min(72, Math.floor(440 / gridSize));

  return (
    <div class="flex flex-col items-center gap-4">
      {/* ── Gambar referensi ── */}
      <div class="flex flex-col items-center gap-1">
        <p class="font-display text-base font-bold text-muted">✨ Gambar ini:</p>
        <div
          class="rounded-xl border-2 border-line bg-surface p-2 shadow-card"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${Math.round(cellPx * 0.55)}px)`,
            gap: "3px",
          }}
        >
          {Array.from({ length: gridSize }, (_, r) =>
            Array.from({ length: gridSize }, (_, c) => {
              const t = getTarget(r, c);
              return (
                <div
                  key={cellKey(r, c)}
                  class="flex items-center justify-center rounded"
                  style={{
                    width: Math.round(cellPx * 0.55),
                    height: Math.round(cellPx * 0.55),
                    background: t ? "#f0f0f0" : "#fafafa",
                  }}
                >
                  {t && <ShapeIcon shape={t.shape} size={Math.round(cellPx * 0.42)} />}
                </div>
              );
            }),
          )}
        </div>
      </div>

      {/* ── Grid kerja ── */}
      <div class="flex flex-col items-center gap-1">
        <p class="font-display text-base font-bold">Kerjakan di sini 👇</p>
        <div
          class="rounded-xl border-2 border-rubina-pink-200 bg-white p-2 shadow-card"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${cellPx}px)`,
            gap: "4px",
          }}
        >
          {Array.from({ length: gridSize }, (_, r) =>
            Array.from({ length: gridSize }, (_, c) => {
              const key = cellKey(r, c);
              const ps = placed[key];
              const target = getTarget(r, c);
              const isGoyang = goyang === key;
              const isPop = popCell === key;
              const isEmpty = !ps;
              const isTarget = !!target;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => ketukSel(r, c)}
                  class={[
                    "game-tap flex items-center justify-center rounded-lg border-2 transition-all",
                    isGoyang ? "game-goyang" : "",
                    isPop ? "game-pop" : "",
                    ps
                      ? "border-rubina-pink-400 bg-rubina-pink-50"
                      : isTarget
                        ? "border-dashed border-rubina-pink-300 bg-rubina-pink-50/50"
                        : "border-line bg-surface",
                    isEmpty && selectedIdx !== null && isTarget ? "hover:bg-rubina-pink-100" : "",
                  ].join(" ")}
                  style={{ width: cellPx, height: cellPx }}
                  aria-label={ps ? `${ps.label} di ${r + 1},${c + 1}` : `Sel ${r + 1},${c + 1}`}
                >
                  {ps ? (
                    <ShapeIcon shape={ps} size={cellPx - 14} />
                  ) : isTarget ? (
                    <span class="font-sans text-xs text-rubina-pink-300">?</span>
                  ) : null}
                </button>
              );
            }),
          )}
        </div>
      </div>

      {/* ── Palet bentuk ── */}
      <div class="flex flex-col items-center gap-1">
        <p class="font-display text-base font-bold text-muted">
          {selectedIdx !== null
            ? `Terpilih: ${palette[selectedIdx].label} ✋`
            : "Pilih bentuk dulu:"}
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          {palette.map((shape, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pilihBentuk(i)}
              class={[
                "game-tap flex h-20 w-20 items-center justify-center rounded-2xl border-4 shadow-card transition-all",
                selectedIdx === i
                  ? "border-rubina-pink-500 bg-rubina-pink-50 scale-110 shadow-card"
                  : "border-white bg-surface hover:scale-105",
              ].join(" ")}
              aria-label={shape.label}
            >
              <ShapeIcon shape={shape} size={52} />
            </button>
          ))}
        </div>
      </div>

      <p class="font-sans text-base text-muted">Pilih bentuk, lalu ketuk kotak yang benar! 🧩</p>

      <Perayaan tampil={selesai} pesan="Hebat! Gambar sudah jadi! 🎉" onMainLagi={ulangi} />
    </div>
  );
}
