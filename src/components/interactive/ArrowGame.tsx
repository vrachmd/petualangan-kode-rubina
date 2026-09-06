import { useState } from "preact/hooks";
import { narasi } from "../../utils/tts";
import { bunyiTap, bunyiBenar, bunyiCobaLagi } from "../../utils/audio";
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
      bunyiBenar();
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
      <div class="grid gap-2" style={{ gridTemplateColumns: `repeat(${kolom}, 72px)` }}>
        {jalur.map((arah, i) => {
          const diSini = i === pos;
          const tujuan = i === terakhir;
          return (
            <button
              key={i}
              type="button"
              onClick={() => ketuk(i)}
              aria-label={tujuan ? tujuanLabel : `Langkah ${i + 1}: ke ${arah}`}
              class={`game-tap relative flex items-center justify-center rounded-xl border-2 shadow-card ${
                tujuan ? "border-line bg-rubina-mint-50" : "border-line bg-surface"
              } ${goyang === i ? "game-goyang" : ""}`}
              style={{ width: 72, height: 72 }}
            >
              {tujuan ? (
                <span class="inline-block h-14 w-14" dangerouslySetInnerHTML={{ __html: rumahSvg }} />
              ) : (
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" style={{ transform: `rotate(${ROTASI[arah]}deg)` }} aria-hidden="true">
                  <path d="M8 24h28M26 14l10 10-10 10" stroke="#0EA5E9" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              )}
              {diSini && !selesai && (
                <span
                  class={`game-jalan pointer-events-none absolute inline-block h-12 w-12 ${tujuan ? "-top-10" : ""}`}
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
