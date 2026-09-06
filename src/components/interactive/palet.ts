import type { WarnaPola } from "./PatternGame";

/** Palet warna game (hex inline — selaras token rubina). */
export const WARNA_GAME: WarnaPola[] = [
  { key: "pink", label: "Merah muda", hex: "#E85D75" },
  { key: "sunny", label: "Kuning", hex: "#FACC15" },
  { key: "sky", label: "Biru", hex: "#38BDF8" },
  { key: "mint", label: "Hijau", hex: "#4ADE80" },
  { key: "lavender", label: "Ungu", hex: "#A855F7" },
  { key: "peach", label: "Oranye", hex: "#F97316" },
];

/** Ambil subset palet berdasarkan key. */
export function palet(...keys: string[]): WarnaPola[] {
  return keys.map((k) => WARNA_GAME.find((w) => w.key === k)!).filter(Boolean);
}
