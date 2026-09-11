import { useState, useEffect, useRef } from "preact/hooks";
import { bunyiTap, bunyiBenar, bunyiCobaLagi } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

export interface WarnaBase {
  key: string;
  label: string;
  hex: string;
}

interface Props {
  idHalaman: string;
  /** Warna-warna dasar yang tersedia (2 atau 3) */
  warna: WarnaBase[];
  /** Warna campuran target */
  targetHex: string;
  /** Label warna target, ex: "Oranye" */
  targetLabel: string;
  /** Kunci jawaban: semua warna yang harus dipilih, ex: ["merah", "kuning"] */
  jawaban: string[];
  audioKey: string;
  audioText: string;
}

/**
 * Color Mixing Game — Ajar teori warna interaktif.
 *
 * Anak ketuk warna untuk menuang ke baskom.
 * Baskom menampilkan hasil campuran.
 * Menang saat kombinasi benar tercapai.
 */
export default function ColorMixingGame({
  idHalaman,
  warna,
  targetHex,
  targetLabel,
  jawaban,
  audioKey,
  audioText,
}: Props) {
  const [tercampur, setTercampur] = useState<string[]>([]);
  const [salah, setSalah] = useState(0);
  const [selesai, setSelesai] = useState(false);
  const [menuang, setMenuang] = useState<string | null>(null);
  const [goyang, setGoyang] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getBowlColor = (): string => {
    if (tercampur.length === 0) return "#E5E5E5";
    if (tercampur.length === 1) {
      const w = warna.find((w) => w.key === tercampur[0]);
      return w?.hex ?? "#E5E5E5";
    }
    return targetHex;
  };

  const sudahDitambah = (warnaKey: string): boolean => {
    return tercampur.includes(warnaKey);
  };

  const ketukWarna = (warnaKey: string) => {
    if (selesai) return;
    if (sudahDitambah(warnaKey)) return;

    bunyiTap();
    setMenuang(warnaKey);

    setTimeout(() => {
      const next = [...tercampur, warnaKey];
      setTercampur(next);
      setMenuang(null);

      if (next.length >= jawaban.length) {
        const benar = jawaban.every((j) => next.includes(j));
        if (benar) {
          tambahXp(idHalaman, salah === 0);
          bunyiBenar();
          setSelesai(true);
        } else {
          setSalah((s) => s + 1);
          bunyiCobaLagi();
          setGoyang(true);
          timerRef.current = setTimeout(() => setGoyang(false), 400);
          setTimeout(() => setTercampur([]), 600);
        }
      } else {
        bunyiTap();
      }
    }, 400);
  };

  const ulangi = () => {
    setTercampur([]);
    setSalah(0);
    setSelesai(false);
    setMenuang(null);
  };

  return (
    <div class="flex flex-col items-center gap-5">
      {/* Target color */}
      <div class="flex flex-col items-center gap-2">
        <p class="font-display text-lg font-bold text-muted">Campuran yang dibuat:</p>
        <div
          class="game-pop flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white shadow-card"
          style={{ background: targetHex }}
          aria-label={`Target: ${targetLabel}`}
        >
          <span class="text-3xl" aria-hidden="true">
            🎯
          </span>
        </div>
        <p class="font-display text-xl font-bold">{targetLabel}</p>
      </div>

      {/* Mixing bowl */}
      <div class="relative flex flex-col items-center gap-2">
        <div
          class={`game-layar relative flex h-32 w-40 items-end justify-center overflow-hidden rounded-b-[40px] rounded-t-xl border-4 border-line bg-surface shadow-card transition-colors duration-500 ${goyang ? "game-goyang" : ""}`}
          aria-label="Baskom"
        >
          <div
            class="absolute bottom-0 left-0 right-0 transition-all duration-500"
            style={{
              height: tercampur.length > 0 ? "70%" : "0%",
              background: getBowlColor(),
              borderRadius: "0 0 36px 36px",
              opacity: 0.9,
            }}
          />
          {menuang && (
            <div
              class="game-pour absolute top-0 left-1/2 h-4 w-8 -translate-x-1/2 rounded-full"
              style={{
                background: warna.find((w) => w.key === menuang)?.hex ?? "#ccc",
              }}
            />
          )}
          {tercampur.length === 0 && !menuang && (
            <p class="relative z-10 pb-4 font-sans text-base text-muted">Kosong</p>
          )}
          {tercampur.length > 0 && (
            <div class="relative z-10 mb-2 flex gap-1">
              {tercampur.map((wKey, i) => {
                const wData = warna.find((w) => w.key === wKey);
                return (
                  <span
                    key={i}
                    class="game-pop inline-block h-6 w-6 rounded-full border-2 border-white shadow-soft"
                    style={{ background: wData?.hex ?? "#ccc" }}
                  />
                );
              })}
            </div>
          )}
        </div>
        <p class="font-sans text-base text-muted">
          {tercampur.length === 0
            ? "Ketuk warna untuk menuang!"
            : tercampur.length >= jawaban.length
              ? "Sudah penuh!"
              : `(${tercampur.length}/${jawaban.length} ditambah)`}
        </p>
      </div>

      {/* Color buttons */}
      <div class="flex flex-wrap justify-center gap-4">
        {warna.map((w) => {
          const disabled = sudahDitambah(w.key) || selesai;
          return (
            <button
              key={w.key}
              type="button"
              onClick={() => ketukWarna(w.key)}
              disabled={disabled}
              aria-label={w.label}
              title={w.label}
              class={`game-tap relative flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-2xl border-4 shadow-card transition-all sm:h-28 sm:w-28 ${
                disabled ? "border-line opacity-50" : "border-white hover:scale-105"
              } ${menuang === w.key ? "game-pour-source" : ""}`}
              style={{ background: w.hex }}
            >
              <span class="font-display text-base font-bold text-white drop-shadow-md">
                {w.label}
              </span>
              {disabled && <span class="absolute top-1 right-1 text-lg">✓</span>}
            </button>
          );
        })}
      </div>

      <p class="font-sans text-base text-muted">Ketuk warna untuk membuat {targetLabel}! 🎨</p>

      <Perayaan
        tampil={selesai}
        pesan={`Hebat! ${targetLabel} sudah jadi! 🎉`}
        onMainLagi={ulangi}
      />
    </div>
  );
}
