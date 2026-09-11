import { useState, useRef, useCallback, useEffect } from "preact/hooks";
import { tambahXp } from "../../utils/progress";
import { bunyiTap, bunyiBenar, bunyiCobaLagi, suaraAktif } from "../../utils/audio";
import Perayaan from "./Perayaan";

/** Frekuensi nada musik (Hz) — nada-nada C4 sampai G4. */
export const NADA: { key: string; freq: number; label: string; color: string }[] = [
  { key: "C4", freq: 261.63, label: "Do", color: "#E85D75" },
  { key: "D4", freq: 293.66, label: "Re", color: "#FACC15" },
  { key: "E4", freq: 329.63, label: "Mi", color: "#38BDF8" },
  { key: "F4", freq: 349.23, label: "Fa", color: "#4ADE80" },
  { key: "G4", freq: 392.0, label: "Sol", color: "#A855F7" },
];

interface Props {
  idHalaman: string;
  /** Panjang urutan yang harus diulang (2, 3, 4, atau 5) */
  panjang: number;
}

/**
 * Bunyi nada via Web Audio API — nada drum-like dengan attack tajam.
 */
function bunyiNada(freq: number): void {
  if (!suaraAktif()) return;
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    if (ac.state === "suspended") void ac.resume();

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.25, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.45);
  } catch {
    /* abaikan */
  }
}

/**
 * Game pola audio: putar urutan nada → anak ulangi → menang bila cocok.
 */
export default function AudioPatternGame({ idHalaman, panjang }: Props) {
  const [status, setStatus] = useState<"demo" | "main" | "selesai" | "salah">("demo");
  const [urutan, setUrutan] = useState<number[]>([]);
  const [indexAnak, setIndexAnak] = useState(0);
  const [aktif, setAktif] = useState<number | null>(null);
  const [goyang, setGoyang] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Bersihkan semua timeout
  const bersihkanTimeout = useCallback(() => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  }, []);

  useEffect(() => {
    return () => bersihkanTimeout();
  }, [bersihkanTimeout]);

  // Generate urutan acak
  const buatUrutan = useCallback((): number[] => {
    const u: number[] = [];
    for (let i = 0; i < panjang; i++) {
      u.push(Math.floor(Math.random() * NADA.length));
    }
    return u;
  }, [panjang]);

  // Putar urutan demo
  const putarDemo = useCallback(
    (seq: number[]) => {
      setStatus("demo");
      setIndexAnak(0);
      bersihkanTimeout();
      const durasiNada = 500; // ms per nada
      const jedaAwal = 800; // jeda sebelum mulai

      seq.forEach((nadaIdx, i) => {
        // Nyalakan
        const tOn = setTimeout(
          () => {
            setAktif(nadaIdx);
            bunyiNada(NADA[nadaIdx].freq);
          },
          jedaAwal + i * durasiNada,
        );

        // Matikan
        const tOff = setTimeout(
          () => {
            setAktif(null);
          },
          jedaAwal + i * durasiNada + 350,
        );

        timeoutRef.current.push(tOn, tOff);
      });

      // Setelah demo selesai → mode main
      const tSelesai = setTimeout(
        () => {
          setStatus("main");
        },
        jedaAwal + seq.length * durasiNada + 200,
      );

      timeoutRef.current.push(tSelesai);
    },
    [bersihkanTimeout],
  );

  // Mulai game baru
  const mulaiGame = useCallback(() => {
    bersihkanTimeout();
    const seq = buatUrutan();
    setUrutan(seq);
    setSelesai(false);
    setGoyang(null);
    putarDemo(seq);
  }, [buatUrutan, putarDemo, bersihkanTimeout]);

  // Mulai saat mount
  useEffect(() => {
    mulaiGame();
  }, []);

  // Ketuk nada oleh anak
  const ketukNada = (nadaIdx: number) => {
    if (status !== "main") return;

    bunyiNada(NADA[nadaIdx].freq);
    setAktif(nadaIdx);
    setTimeout(() => setAktif(null), 300);

    if (nadaIdx === urutan[indexAnak]) {
      bunyiBenar();
      const next = indexAnak + 1;
      setIndexAnak(next);

      if (next >= urutan.length) {
        // Semua benar!
        setTimeout(() => {
          tambahXp(idHalaman, true);
          setSelesai(true);
          setStatus("selesai");
        }, 400);
      }
    } else {
      // Salah
      bunyiCobaLagi();
      setGoyang(nadaIdx);
      setTimeout(() => setGoyang(null), 400);
      // Setelah sedikit jeda, putar demo ulang
      setTimeout(() => {
        putarDemo(urutan);
      }, 800);
    }
  };

  return (
    <div class="flex flex-col items-center gap-5">
      {/* Instruksi */}
      <p class="font-sans text-center text-base text-muted">
        {status === "demo" && "Dengarkan dulu, ya! 🔊"}
        {status === "main" && "Sekarang giliran kamu! Ulangi nada yang sama! 🎵"}
        {status === "salah" && "Coba lagi, ya! 😊"}
        {status === "selesai" && ""}
      </p>

      {/*进度 indicator */}
      {status === "main" && (
        <div class="flex gap-2">
          {urutan.map((_, i) => (
            <div
              key={i}
              class={`h-3 w-3 rounded-full transition-colors ${
                i < indexAnak ? "bg-rubina-mint-500" : "bg-rubina-pink-100"
              }`}
            />
          ))}
        </div>
      )}

      {/* Tombol nada */}
      <div class="flex flex-wrap justify-center gap-4">
        {NADA.map((n, i) => {
          const sedangMenyala = aktif === i;
          const sedangGoyang = goyang === i;
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => ketukNada(i)}
              disabled={status !== "main"}
              aria-label={`Nada ${n.label} (${n.key})`}
              class={`game-tap relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-4 shadow-card transition-all sm:h-28 sm:w-28 ${
                sedangMenyala
                  ? "scale-110 border-white shadow-lg"
                  : status === "main"
                    ? "border-white hover:scale-105"
                    : "border-white/50 opacity-70"
              } ${sedangGoyang ? "game-goyang" : ""}`}
              style={{
                background: sedangMenyala ? n.color : `color-mix(in srgb, ${n.color} 40%, white)`,
              }}
            >
              <span class="font-display text-2xl font-bold text-white drop-shadow">{n.label}</span>
              <span class="font-sans text-xs text-white/80">{n.key}</span>
              {sedangMenyala && (
                <span class="absolute -top-1 -right-1 text-lg" aria-hidden="true">
                  ♪
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tombol putar ulang demo */}
      {status === "main" && (
        <button
          type="button"
          onClick={() => putarDemo(urutan)}
          class="game-tap flex h-14 items-center rounded-full bg-rubina-sunny-100 px-6 font-display text-base font-bold shadow-soft"
        >
          🔊 Dengarkan Lagi
        </button>
      )}

      <Perayaan tampil={selesai} pesan="Hebat! Pola nadinya benar! 🎶" onMainLagi={mulaiGame} />
    </div>
  );
}
