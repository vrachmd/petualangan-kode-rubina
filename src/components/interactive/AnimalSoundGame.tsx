import { useState, useEffect, useCallback, useRef } from "preact/hooks";
import { bunyiTap, bunyiBenar, bunyiCobaLagi, suaraAktif } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

/** Definisi hewan: emoji, label Indonesia, dan path audio MP3. */
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

/** Base URL untuk audio files */
const AUDIO_BASE = import.meta.env.BASE_URL + "audio/hewan/";

/** Cache audio elements untuk performa */
const audioCache: Record<string, HTMLAudioElement> = {};

/** Putar audio MP3 dari file */
function putarAudio(namaFile: string): void {
  if (!suaraAktif()) return;
  try {
    // Ambil dari cache atau buat baru
    if (!audioCache[namaFile]) {
      const audio = new Audio(`${AUDIO_BASE}${namaFile}.mp3`);
      audio.preload = "auto";
      audioCache[namaFile] = audio;
    }
    const audio = audioCache[namaFile];
    audio.currentTime = 0;
    audio.play().catch(() => {
      /* abaikan autoplay error */
    });
  } catch {
    /* abaikan */
  }
}

/** Map key hewan → file audio MP3 */
const SUARA_HEWAN: Record<string, string> = {
  kucing: "kucing",
  anjing: "anjing",
  burung: "burung",
  katak: "katak",
  sapi: "sapi",
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
      const namaFile = SUARA_HEWAN[target];
      if (namaFile) putarAudio(namaFile);
      setSudahMain(true);
    }, 800);
    timerRef.current.push(t);
    return () => {
      clearTimeout(t);
    };
  }, [target]);

  const putarSuara = () => {
    const namaFile = SUARA_HEWAN[target];
    if (namaFile) putarAudio(namaFile);
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
