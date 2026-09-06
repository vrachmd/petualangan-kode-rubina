/**
 * Progress anak — tersimpan lokal di browser (tanpa akun/server).
 * Key: rubina-progress-v1 → { xp per halaman, bintang per kategori }
 */

export type KategoriGame = "pola" | "sequencing" | "arah" | "sebab-akibat" | "kartu" | "bebas";

const KEY = "rubina-progress-v1";
const XP_PER_BINTANG = 100;
const MAX_BINTANG = 3;

export interface Progress {
  /** xp per id halaman, ex: { "02-pola-ab": 10 } */
  xp: Record<string, number>;
  /** halaman yang sudah dibuka */
  dibuka: string[];
}

function kosong(): Progress {
  return { xp: {}, dibuka: [] };
}

export function muatProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return kosong();
    const p = JSON.parse(raw) as Progress;
    if (typeof p.xp !== "object" || !Array.isArray(p.dibuka)) return kosong();
    return p;
  } catch {
    return kosong();
  }
}

export function simpanProgress(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage penuh/diblokir — main tetap jalan tanpa simpan */
  }
}

/** Tambah XP (10 benar pertama, 5 coba lagi). Return total XP halaman. */
export function tambahXp(idHalaman: string, benarPertama: boolean): number {
  const p = muatProgress();
  const sudah = p.xp[idHalaman] ?? 0;
  p.xp[idHalaman] = sudah + (benarPertama && sudah === 0 ? 10 : 5);
  if (!p.dibuka.includes(idHalaman)) p.dibuka.push(idHalaman);
  simpanProgress(p);
  return p.xp[idHalaman];
}

export function xpHalaman(idHalaman: string): number {
  return muatProgress().xp[idHalaman] ?? 0;
}

/** Total XP satu kategori dari daftar id halamannya. */
export function xpKategori(ids: string[]): number {
  const p = muatProgress();
  return ids.reduce((t, id) => t + (p.xp[id] ?? 0), 0);
}

/** 0–3 bintang dari total XP kategori. */
export function bintangKategori(ids: string[]): number {
  return Math.min(MAX_BINTANG, Math.floor(xpKategori(ids) / XP_PER_BINTANG));
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}
