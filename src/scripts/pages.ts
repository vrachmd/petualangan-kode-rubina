/** Daftar 20 halaman — single source of truth untuk generate + validate. */
export interface Halaman {
  /** nama file output, ex: "02-pola-ab" */
  id: string;
  /** route preview server, ex: "/pola/01-ab" */
  route: string;
}

export const PAGES: Halaman[] = [
  { id: "00-sampul", route: "/" },
  { id: "01-panduan-orang-tua", route: "/panduan-orang-tua" },
  { id: "02-pola-ab", route: "/pola/01-ab" },
  { id: "03-pola-abb", route: "/pola/02-abb" },
  { id: "04-pola-abc", route: "/pola/03-abc" },
  { id: "05-pola-campuran", route: "/pola/04-campuran" },
  { id: "06-sequencing-cuci-tangan", route: "/sequencing/01-cuci-tangan" },
  { id: "07-sequencing-makan", route: "/sequencing/02-makan" },
  { id: "08-sequencing-tidur", route: "/sequencing/03-tidur" },
  { id: "09-sequencing-main", route: "/sequencing/04-main" },
  { id: "10-arah-lacak-garis", route: "/arah/01-lacak-garis" },
  { id: "11-arah-ikuti-panah", route: "/arah/02-ikuti-panah" },
  { id: "12-arah-labirin", route: "/arah/03-labirin" },
  { id: "13-arah-nina-pulang", route: "/arah/04-nina-cari-jalan" },
  { id: "14-sebab-tombol-lampu", route: "/sebab-akibat/01-tombol-lampu" },
  { id: "15-sebab-tarik-mainan", route: "/sebab-akibat/02-tarik-mainan" },
  { id: "16-sebab-tekan-bunyi", route: "/sebab-akibat/03-tekan-bunyi" },
  { id: "17-kartu-aktivitas", route: "/kartu-aktivitas" },
  { id: "18-bebas-buat-pola", route: "/bebas/01-buat-pola" },
  { id: "19-bebas-gambar-robot", route: "/bebas/02-gambar-robot" },
];
