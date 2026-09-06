/**
 * Efek suara kecil (pop/benar/coba-lagi) via Web Audio API.
 * Tanpa file eksternal — nada disintesis langsung, gratis + offline.
 */

let ctx: AudioContext | null = null;

function dapatkanCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function nada(freq: number, mulai: number, durasi: number, tipe: OscillatorType = "sine", volume = 0.15): void {
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

/** Bunyi dapat bintang (fanfare mini). */
export function bunyiBintang(): void {
  nada(523, 0, 0.12);
  nada(659, 0.1, 0.12);
  nada(784, 0.2, 0.12);
  nada(1047, 0.3, 0.35);
}
