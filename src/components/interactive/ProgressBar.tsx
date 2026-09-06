import { useEffect, useState } from "preact/hooks";
import { bintangKategori, xpKategori } from "../../utils/progress";

interface Props {
  /** id halaman dalam kategori ini, ex: ["02-pola-ab", ...] */
  ids: string[];
  kompak?: boolean;
}

/** Bar bintang 0–3 + total XP kategori. Dibaca dari localStorage saat tampil. */
export default function ProgressBar({ ids, kompak = false }: Props) {
  const [bintang, setBintang] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setBintang(bintangKategori(ids));
    setXp(xpKategori(ids));
  }, []);

  return (
    <div class="flex items-center gap-1" aria-label={`${bintang} dari 3 bintang`}>
      {[1, 2, 3].map((i) => (
        <span key={i} class={kompak ? "text-xl" : "text-2xl"} aria-hidden="true">
          {i <= bintang ? "⭐" : "☆"}
        </span>
      ))}
      {!kompak && <span class="ml-1 font-sans text-base text-muted">{xp} XP</span>}
    </div>
  );
}
