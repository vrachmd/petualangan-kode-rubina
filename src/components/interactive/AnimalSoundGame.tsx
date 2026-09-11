import { useState, useEffect, useCallback, useRef } from "preact/hooks";
import { bunyiTap, bunyiBenar, bunyiCobaLagi, suaraAktif } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

/** Definisi hewan: emoji, label Indonesia, dan fungsi suara Web Audio API. */
export interface Hewan {
  key: string;
  emoji: string;
  label: string;
}

interface Props {
  idHalaman: string;
  /** Hewan-hewan yang tersedia dipilih (3-4) */
  hewanList: Hewan[];
  /** Hewan target yang harus ditebak */
  target: string;
  pesanMenang?: string;
}

/** Fungsi bunyi hewan via Web Audio API — tanpa file eksternal. */
function getAudioContext(): AudioContext | null {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ac = new AC();
    if (ac.state === "suspended") void ac.resume();
    return ac;
  } catch {
    return null;
  }
}

/** Kucing: meow — freq sweep naik 800→1200Hz, lalu turun. */
function suaraKucing(): void {
  if (!suaraAktif()) return;
  const ac = getAudioContext();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";

    // Sweep naik
    osc.frequency.setValueAtTime(800, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, ac.currentTime + 0.15);
    // Sweep turun
    osc.frequency.linearRampToValueAtTime(900, ac.currentTime + 0.4);
    osc.frequency.linearRampToValueAtTime(1100, ac.currentTime + 0.55);

    gain.gain.setValueAtTime(0.001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ac.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, ac.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);

    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.65);
  } catch {
    /* abaikan */
  }
}

/** Anjing: gonggong — burst pendek 200-400Hz. */
function suaraAnjing(): void {
  if (!suaraAktif()) return;
  const ac = getAudioContext();
  if (!ac) return;
  try {
    // Burst pertama
    const osc1 = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(250, ac.currentTime);
    osc1.frequency.linearRampToValueAtTime(350, ac.currentTime + 0.08);
    gain1.gain.setValueAtTime(0.001, ac.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.18, ac.currentTime + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    osc1.connect(gain1).connect(ac.destination);
    osc1.start();
    osc1.stop(ac.currentTime + 0.18);

    // Burst kedua (sedikit lebih panjang)
    const osc2 = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(220, ac.currentTime + 0.2);
    osc2.frequency.linearRampToValueAtTime(380, ac.currentTime + 0.3);
    gain2.gain.setValueAtTime(0.001, ac.currentTime + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.18, ac.currentTime + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.42);
    osc2.connect(gain2).connect(ac.destination);
    osc2.start(ac.currentTime + 0.2);
    osc2.stop(ac.currentTime + 0.45);
  } catch {
    /* abaikan */
  }
}

/** Burung: kicau — not-not cepat tinggi 1000-2000Hz. */
function suaraBurung(): void {
  if (!suaraAktif()) return;
  const ac = getAudioContext();
  if (!ac) return;
  try {
    const notes = [
      { f: 1400, t: 0, d: 0.06 },
      { f: 1800, t: 0.08, d: 0.05 },
      { f: 1500, t: 0.15, d: 0.06 },
      { f: 2000, t: 0.24, d: 0.07 },
      { f: 1600, t: 0.34, d: 0.05 },
      { f: 1900, t: 0.42, d: 0.08 },
    ];
    for (const n of notes) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = "sine";
      osc.frequency.value = n.f;
      gain.gain.setValueAtTime(0.001, ac.currentTime + n.t);
      gain.gain.exponentialRampToValueAtTime(0.15, ac.currentTime + n.t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + n.t + n.d);
      osc.connect(gain).connect(ac.destination);
      osc.start(ac.currentTime + n.t);
      osc.stop(ac.currentTime + n.t + n.d + 0.02);
    }
  } catch {
    /* abaikan */
  }
}

/** Katak: suara rendah "kwek". */
function suaraKatak(): void {
  if (!suaraAktif()) return;
  const ac = getAudioContext();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(250, ac.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(150, ac.currentTime + 0.3);
    gain.gain.setValueAtTime(0.001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ac.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.35);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.4);
  } catch {
    /* abaikan */
  }
}

/** Sapi: suara "moo" rendah panjang. */
function suaraSapi(): void {
  if (!suaraAktif()) return;
  const ac = getAudioContext();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, ac.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ac.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(110, ac.currentTime + 0.7);
    gain.gain.setValueAtTime(0.001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ac.currentTime + 0.05);
    gain.gain.setValueAtTime(0.18, ac.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.8);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.85);
  } catch {
    /* abaikan */
  }
}

/** Map key hewan → fungsi suara */
const SUARA_HEWAN: Record<string, () => void> = {
  kucing: suaraKucing,
  anjing: suaraAnjing,
  burung: suaraBurung,
  katak: suaraKatak,
  sapi: suaraSapi,
};

export default function AnimalSoundGame({
  idHalaman,
  hewanList,
  target,
  pesanMenang = "Hebat! Kamu tahu suara hewan itu! 🎉",
}: Props) {
  const [goyang, setGoyang] = useState<string | null>(null);
  const [selesai, setSelesai] = useState(false);
  const [sudahMain, setSudahMain] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const bersihkanTimeout = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  useEffect(() => {
    return () => bersihkanTimeout();
  }, [bersihkanTimeout]);

  // Putar suara target saat mount
  useEffect(() => {
    const t = setTimeout(() => {
      const suara = SUARA_HEWAN[target];
      if (suara) suara();
      setSudahMain(true);
    }, 800);
    timerRef.current.push(t);
    return () => {
      clearTimeout(t);
    };
  }, [target]);

  const putarSuara = () => {
    const suara = SUARA_HEWAN[target];
    if (suara) suara();
  };

  const ketukHewan = (key: string) => {
    if (selesai) return;

    bunyiTap();

    if (key === target) {
      // Benar!
      const t = setTimeout(() => {
        bunyiBenar();
        tambahXp(idHalaman, !goyang);
        setSelesai(true);
      }, 300);
      timerRef.current.push(t);
    } else {
      // Salah — goyang card yang salah, putar suara lagi
      setGoyang(key);
      bunyiCobaLagi();
      const t1 = setTimeout(() => setGoyang(null), 400);
      const t2 = setTimeout(() => putarSuara(), 600);
      timerRef.current.push(t1, t2);
    }
  };

  const ulangi = () => {
    bersihkanTimeout();
    setGoyang(null);
    setSelesai(false);
    setSudahMain(false);
    const t = setTimeout(() => {
      putarSuara();
      setSudahMain(true);
    }, 600);
    timerRef.current.push(t);
  };

  return (
    <div class="flex flex-col items-center gap-5">
      {/* Instruksi */}
      <p class="font-sans text-center text-base text-muted">
        {!sudahMain && "Dengarkan suara hewan dulu! 🔊"}
        {sudahMain && !selesai && "Hewan apa yang bersuara? Ketuk gambarnya! 🐾"}
      </p>

      {/* Tombol putar ulang */}
      {sudahMain && !selesai && (
        <button
          type="button"
          onClick={putarSuara}
          class="game-tap flex h-14 items-center gap-2 rounded-full bg-rubina-sunny-100 px-6 font-display text-base font-bold shadow-soft"
          style={{ minWidth: "200px", justifyContent: "center" }}
        >
          🔊 Dengarkan Lagi
        </button>
      )}

      {/* Kartu hewan */}
      <div class="flex flex-wrap justify-center gap-4">
        {hewanList.map((h) => {
          const sedangGoyang = goyang === h.key;
          return (
            <button
              key={h.key}
              type="button"
              onClick={() => ketukHewan(h.key)}
              disabled={selesai}
              aria-label={h.label}
              class={`game-tap relative flex h-28 w-28 flex-col items-center justify-center gap-2 rounded-2xl border-4 border-white bg-surface shadow-card transition-all sm:h-32 sm:w-32 ${
                selesai
                  ? h.key === target
                    ? "border-rubina-mint-500 bg-rubina-mint-50"
                    : "border-line opacity-60"
                  : "hover:scale-105"
              } ${sedangGoyang ? "game-goyang" : ""}`}
            >
              <span class="text-5xl" aria-hidden="true">
                {h.emoji}
              </span>
              <span class="font-display text-sm font-bold text-muted">{h.label}</span>
              {selesai && h.key === target && (
                <span class="absolute -top-1 -right-1 text-xl game-pop">⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hint suara */}
      {!selesai && sudahMain && (
        <button type="button" onClick={putarSuara} class="font-sans text-sm text-muted underline">
          🔊 Putar Suara Lagi
        </button>
      )}

      <Perayaan tampil={selesai} pesan={pesanMenang} onMainLagi={ulangi} />
    </div>
  );
}
