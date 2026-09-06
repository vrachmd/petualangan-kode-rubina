import { narasi } from "../../utils/tts";
import { bunyiTap } from "../../utils/audio";

interface Props {
  /** path audio tanpa .mp3, ex: "pola/ab-1" */
  audioKey: string;
  /** teks untuk fallback Web Speech */
  text: string;
  label?: string;
}

/** Tombol speaker besar: putar narasi Bahasa Indonesia saat diketuk. */
export default function AudioButton({ audioKey, text, label = "Dengarkan" }: Props) {
  const putar = () => {
    bunyiTap();
    void narasi(audioKey, text);
  };
  return (
    <button
      type="button"
      onClick={putar}
      aria-label={label}
      class="game-tap flex h-16 w-16 items-center justify-center rounded-full bg-rubina-sunny-100 text-3xl shadow-card"
    >
      🔊
    </button>
  );
}
