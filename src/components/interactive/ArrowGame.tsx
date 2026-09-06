import { useState } from "preact/hooks";
import { narasi } from "../../utils/tts";
import { bunyiTap, bunyiCobaLagi } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";
import type { ArahMata } from "../../types";

interface Props {
  idHalaman: string;
  /** jalur sel per sel (sel terakhir = rumah) */
  jalur: ArahMata[];
  kolom?: number;
  /** SVG maskot pejalan, ex: nina-rubah */
  maskotSvg: string;
  /** SVG tujuan, ex: rumah */
  rumahSvg: string;
  /** label tujuan, ex: "Rumah" / "Wortel" / "Bendera" */
  tujuanLabel?: string;
  audioKey: string;
  audioText: string;
}

const ROTASI: Record<ArahMata, number> = { atas: -90, kanan: 0, bawah: 90, kiri: 180 };

/** Game arah: ketuk kotak berikutnya agar maskot berjalan sampai rumah. */
export default function ArrowGame({ idHalaman, jalur, kolom = 3, maskotSvg, rumahSvg, tujuanLabel = "Rumah", audioKey, audioText }: Props) {
  const [pos, setPos] = useState(0);
  const [salah, setSalah] = useState(0);
  const [goyang, setGoyang] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);
  const terakhir = jalur.length - 1;

  const ketuk = (i: number) => {
    if (selesai) return;
    if (i === pos + 1) {
      // Satu tap = satu suara: narasi panduan saja (tanpa efek dobel)
      setPos(i);
      void narasi(audioKey, audioText);
      if (i === terakhir) {
        tambahXp(idHalaman, salah === 0);
        setSelesai(true);
      }
    } else if (i === pos) {
      bunyiTap();
    } else {
      setSalah((s) => s + 1);
      bunyiCobaLagi();
      setGoyang(i);
      setTimeout(() => setGoyang(null), 400);
    }
  };

  const ulangi = () => {
    setPos(0);
    setSalah(0);
    setSelesai(false);
  };

  return (
    <div class="flex flex-col items-center gap-4">
      <div class="grid w-full max-w-[420px] gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${kolom}, minmax(0, 1fr))` }}>
        {jalur.map((arah, i) => {
          const diSini = i === pos;
          const tujuan = i === terakhir;
          return (
            <button
              key={i}
              type="button"
              onClick={() => ketuk(i)}
              aria-label={tujuan ? tujuanLabel : `Langkah ${i + 1}: ke ${arah}`}
              class={`game-tap relative flex aspect-square w-full items-center justify-center rounded-xl border-2 shadow-card ${
                tujuan ? "border-line bg-rubina-mint-50" : "border-line bg-surface"
              } ${goyang === i ? "game-goyang" : ""}`}
            >
              {tujuan ? (
                <span class="block h-[72%] w-[72%]" dangerouslySetInnerHTML={{ __html: rumahSvg }} />
              ) : (
                <svg viewBox="0 0 48 48" fill="none" class="h-[62%] w-[62%]" style={{ transform: `rotate(${ROTASI[arah]}deg)` }} aria-hidden="true">
                  <path d="M8 24h28M26 14l10 10-10 10" stroke="#0EA5E9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              )}
              {diSini && !selesai && (
                <span
                  class={`game-jalan pointer-events-none absolute block h-[58%] w-[58%] ${tujuan ? "-top-[38%]" : ""}`}
                  dangerouslySetInnerHTML={{ __html: maskotSvg }}
                />
              )}
            </button>
          );
        })}
      </div>
      <p class="font-sans text-base text-muted">Ketuk kotak berikutnya! Antar maskotnya pulang 🏠</p>
      <Perayaan tampil={selesai} pesan="Sampai! Hore! 🎉" onMainLagi={ulangi} />
    </div>
  );
}
