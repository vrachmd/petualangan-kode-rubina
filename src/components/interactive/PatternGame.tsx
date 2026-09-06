import { useState } from "preact/hooks";
import { narasi } from "../../utils/tts";
import { bunyiTap, bunyiBenar, bunyiCobaLagi } from "../../utils/audio";
import { tambahXp } from "../../utils/progress";
import Perayaan from "./Perayaan";

export interface WarnaPola {
  key: string;
  label: string;
  hex: string;
}

interface Props {
  idHalaman: string;
  /** palet warna tersedia */
  warna: WarnaPola[];
  /** urutan tampil; null = kosong (diisi anak) */
  pola: (string | null)[];
  /** kunci jawaban lengkap (tanpa null), ex: ["pink","sunny","pink","sunny"] */
  jawaban: string[];
  /** mode bebas: warna apa pun diterima (untuk halaman kreasi) */
  bebas?: boolean;
  audioKey: string;
  audioText: string;
}

/**
 * Game pola: ketuk warna di palet, lalu ketuk lingkaran kosong.
 * Benar → pop + XP. Salah → goyang lembut + "coba lagi".
 */
export default function PatternGame({ idHalaman, warna, pola, jawaban, bebas = false, audioKey, audioText }: Props) {
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [isian, setIsian] = useState<(string | null)[]>(() => pola.map((p) => (p === null ? null : p)));
  const [salah, setSalah] = useState(0);
  const [goyang, setGoyang] = useState<number | null>(null);
  const [selesai, setSelesai] = useState(false);

  const hexOf = (key: string) => warna.find((w) => w.key === key)?.hex ?? "#E5E5E5";

  const ketukWarna = (key: string) => {
    bunyiTap();
    setPilihan(key);
  };

  const ketukSlot = (i: number) => {
    if (selesai || pola[i] !== null || isian[i] !== null) return;
    if (pilihan === null) {
      void narasi(audioKey, audioText);
      return;
    }
    // Kunci jawaban = dari props (ditentukan pembuat level).
    // Mode bebas: warna apa pun yang dipilih diterima.
    const kunci = bebas ? pilihan : jawaban[i];
    if (pilihan === kunci) {
      const next = [...isian];
      next[i] = pilihan;
      setIsian(next);
      bunyiBenar();
      if (next.every((v) => v !== null)) {
        tambahXp(idHalaman, salah === 0);
        setSelesai(true);
      }
    } else {
      setSalah((s) => s + 1);
      bunyiCobaLagi();
      setGoyang(i);
      setTimeout(() => setGoyang(null), 400);
    }
  };

  const ulangi = () => {
    setIsian(pola.map((p) => (p === null ? null : p)));
    setPilihan(null);
    setSalah(0);
    setSelesai(false);
  };

  return (
    <div class="flex flex-col items-center gap-5">
      <div class="flex flex-wrap justify-center gap-3">
        {isian.map((v, i) =>
          pola[i] === null && v === null ? (
            <button
              key={i}
              type="button"
              onClick={() => ketukSlot(i)}
              aria-label={`Lingkaran kosong ${i + 1}`}
              class={`game-tap h-16 w-16 rounded-full border-4 border-dashed border-line bg-background ${goyang === i ? "game-goyang" : ""}`}
            />
          ) : (
            <span
              key={i}
              class="game-pop inline-block h-16 w-16 rounded-full border-2 border-white shadow-card"
              style={{ background: hexOf(v ?? "") }}
            />
          )
        )}
      </div>

      <p class="font-sans text-base text-muted">Ketuk warna, lalu ketuk lingkaran kosong!</p>
      <div class="flex flex-wrap justify-center gap-4">
        {warna.map((w) => (
          <button
            key={w.key}
            type="button"
            onClick={() => ketukWarna(w.key)}
            aria-label={w.label}
            title={w.label}
            class={`game-tap h-20 w-20 rounded-full border-4 shadow-card ${pilihan === w.key ? "border-ink" : "border-white"}`}
            style={{ background: w.hex }}
          />
        ))}
      </div>

      <Perayaan tampil={selesai} pesan="Hebat! Polanya benar! 🎉" onMainLagi={ulangi} />
    </div>
  );
}
