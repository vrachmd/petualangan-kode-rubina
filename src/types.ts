/** Tipe bersama untuk komponen worksheet. */

export type Kategori =
  "pola" | "sequencing" | "arah" | "sebab-akibat" | "kartu" | "bebas" | "sampul";

export interface PageMeta {
  /** ex: "pola-01-ab" — dipakai untuk nama file output */
  id: string;
  /** Judul tampil di header, ex: "Pola Merah-Kuning" */
  judul: string;
  kategori: Kategori;
  /** Nomor halaman tampil di footer */
  nomor: number;
}

export type WarnaPola = "pink" | "peach" | "sky" | "lavender" | "mint" | "sunny";

export type ArahMata = "atas" | "kanan" | "bawah" | "kiri";
