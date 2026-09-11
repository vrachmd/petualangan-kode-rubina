import { useEffect, useState } from "preact/hooks";
import { bintangKategori, xpKategori } from "../../utils/progress";

/* ── SVG maskot (raw string import via Vite) ── */
import rubiKelinciSvg from "../../assets/characters/rubi-kelinci.svg?raw";
import binaBeruangSvg from "../../assets/characters/bina-beruang.svg?raw";
import ninaRubahSvg from "../../assets/characters/nina-rubah.svg?raw";
import rinaRobotSvg from "../../assets/characters/rina-robot.svg?raw";
import rubinaAnakSvg from "../../assets/characters/rubina-anak.svg?raw";

const MASKOT_SVG: Record<string, string> = {
  "rubi-kelinci": rubiKelinciSvg,
  "bina-beruang": binaBeruangSvg,
  "nina-rubah": ninaRubahSvg,
  "rina-robot": rinaRobotSvg,
  "rubina-anak": rubinaAnakSvg,
};

const MAX_XP = 300; // 3 bintang × 100 XP

interface Props {
  nama: string;
  maskot: string;
  tint: string;
  ids: string[];
  main: string;
  cetak: string;
  index: number;
  base: string;
}

export default function GameCard({ nama, maskot, tint, ids, main, cetak, index, base }: Props) {
  const [bintang, setBintang] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setBintang(bintangKategori(ids));
    setXp(xpKategori(ids));
  }, []);

  const svgRaw = MASKOT_SVG[maskot] ?? MASKOT_SVG["rubina-anak"];
  const pct = Math.min(1, xp / MAX_XP);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  // Tint → ring stroke colour (rough match)
  const ringColor = tint.includes("pink")
    ? "#E85D75"
    : tint.includes("peach")
      ? "#F97316"
      : tint.includes("sky")
        ? "#38BDF8"
        : tint.includes("lavender")
          ? "#A855F7"
          : tint.includes("mint")
            ? "#22C55E"
            : "#FACC15";

  const stagger = `stagger-${Math.min(index + 1, 11)}`;

  return (
    <div class={`game-card ${tint} ${stagger}`} style={`animation-delay: ${0.06 * index}s`}>
      {/* ── Progress ring ── */}
      <div class="game-card__ring-wrap">
        <svg class="game-card__ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="4" />
          <circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            stroke={ringColor}
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray={circ}
            stroke-dashoffset={offset}
            class="game-card__ring-fill"
          />
        </svg>
        <span class="game-card__ring-label">{Math.round(pct * 100)}%</span>
      </div>

      {/* ── Maskot ── */}
      <div class="game-card__maskot" dangerouslySetInnerHTML={{ __html: svgRaw }} />

      {/* ── Nama kategori ── */}
      <span class="game-card__name">{nama}</span>

      {/* ── Bintang ── */}
      <div class="game-card__stars" aria-label={`${bintang} dari 3 bintang`}>
        {[1, 2, 3].map((i) => (
          <span key={i} class="game-card__star">
            {i <= bintang ? "⭐" : "☆"}
          </span>
        ))}
      </div>

      {/* ── Tombol main ── */}
      <a href={`${base}${main.replace(/^\/+/, "")}`} class="game-tap game-card__btn">
        Main ▶
      </a>

      {/* ── Cetak ── */}
      {cetak ? (
        <a href={`${base}${cetak.replace(/^\/+/, "")}`} class="game-card__cetak">
          🖨 Versi cetak
        </a>
      ) : (
        <span class="game-card__cetak game-card__cetak--spacer" />
      )}
    </div>
  );
}
