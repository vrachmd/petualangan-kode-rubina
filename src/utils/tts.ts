/**
 * Narasi Bahasa Indonesia — strategi hybrid:
 * 1) Putar MP3 pre-generated (public/audio/, dibuat via scripts/generate-audio.py)
 * 2) Fallback ke Web Speech API browser bila file tidak ada / gagal
 */

const AUDIO_BASE = `${import.meta.env.BASE_URL}audio`;

export function audioUrl(key: string): string {
  return `${AUDIO_BASE}/${key}.mp3`;
}

/** Coba putar MP3; resolve false bila tidak ada/gagal (panggil fallback). */
export function playMp3(key: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const el = new Audio(audioUrl(key));
      el.onended = () => resolve(true);
      el.onerror = () => resolve(false);
      const pr = el.play();
      if (pr !== undefined) {
        pr.then(() => undefined).catch(() => resolve(false));
      }
    } catch {
      resolve(false);
    }
  });
}

/** Fallback: suara bawaan browser (gratis, tanpa file). */
export function speakWeb(text: string): void {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.rate = 0.9;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  } catch {
    /* abaikan — mode senyap */
  }
}

/**
 * Narasi utama game: MP3 dulu, fallback Web Speech.
 * @param key path audio tanpa .mp3, ex: "pola/ab-1"
 * @param text teks fallback untuk Web Speech, ex: "Ayo warnai lingkaran merah!"
 */
export async function narasi(key: string, text: string): Promise<void> {
  try {
    if (localStorage.getItem("rubina-suara") === "mati") return;
  } catch {
    /* lanjut */
  }
  const ok = await playMp3(key);
  if (!ok) speakWeb(text);
}

export function hentikanNarasi(): void {
  try {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  } catch {
    /* abaikan */
  }
}
