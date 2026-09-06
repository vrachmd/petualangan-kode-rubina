/**
 * Nama anak — SINGLE SOURCE OF TRUTH.
 * Ganti satu nilai di sini, seluruh cover/header/instruksi ikut berubah
 * setelah regenerate (npm run generate:all).
 */
export const NAMA_ANAK = "Rubina";

/** Sapaan akrab untuk instruksi, ex: "Bantu Rubi bersama Rubina!" */
export function sapaan(nama: string = NAMA_ANAK): string {
  return nama;
}
