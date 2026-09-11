/**
 * Efek suara — sinthesi Web Audio API + file MP3 untuk suara khusus.
 *
 * Suara sinthesi (gratis, offline): tap, benar, coba-lagi.
 * Suara file (public/audio/sfx/): perayaan, bintang, notifikasi.
 */

let ctx: AudioContext | null = null;

const SUARA_KEY = "rubina-suara";

/** Cache Audio element per path supaya tidak re-create setiap kali. */
const audioCache = new Map<string, HTMLAudioElement>();

/** Preferensi suara ortu (default nyala). */
export function suaraAktif(): boolean {
  try {
    return localStorage.getItem(SUARA_KEY) !== "mati";
  } catch {
    return true;
  }
}

export function setSuaraAktif(aktif: boolean): void {
  try {
    localStorage.setItem(SUARA_KEY, aktif ? "nyala" : "mati");
  } catch {
    /* abaikan */
  }
}

function dapatkanCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function nada(
  freq: number,
  mulai: number,
  durasi: number,
  tipe: OscillatorType = "sine",
  volume = 0.15,
): void {
  if (!suaraAktif()) return;
  const ac = dapatkanCtx();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = tipe;
    osc.frequency.value = freq;
    const t = ac.currentTime + mulai;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + durasi);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + durasi + 0.05);
  } catch {
    /* abaikan */
  }
}

/** Mainkan file audio dari public/audio/. Path relatif, ex: "sfx/celebration.mp3". */
function mainkanFile(path: string): void {
  if (!suaraAktif()) return;
  try {
    let audio = audioCache.get(path);
    if (!audio) {
      audio = new Audio(`/${path}`);
      audio.preload = "auto";
      audio.volume = 0.8;
      audioCache.set(path, audio);
    }
    audio.currentTime = 0;
    void audio.play();
  } catch {
    /* abaikan — fallback ke sinthesi */
  }
}

// ─── Suara sinthesi (offline, gratis) ───

/** Bunyi tap tombol. */
export function bunyiTap(): void {
  nada(600, 0, 0.12);
}

/** Bunyi jawaban benar (nada naik ceria). */
export function bunyiBenar(): void {
  nada(523, 0, 0.15);
  nada(659, 0.12, 0.15);
  nada(784, 0.24, 0.25);
}

/** Bunyi coba lagi (nada lembut, tidak menghukum). */
export function bunyiCobaLagi(): void {
  nada(392, 0, 0.2, "sine", 0.12);
  nada(330, 0.18, 0.25, "sine", 0.12);
}

// ─── Suara file (public/audio/sfx/) ───

/** Bunyi perayaan level selesai (fanfare). */
export function bunyiPerayaan(): void {
  mainkanFile("audio/sfx/celebration.mp3");
}

/** Bunyi dapat bintang (sparkle). */
export function bunyiBintang(): void {
  mainkanFile("audio/sfx/star.mp3");
}

/** Bunyi notifikasi (ding). */
export function bunyiNotifikasi(): void {
  mainkanFile("audio/sfx/ding.mp3");
}
