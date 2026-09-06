import { useEffect, useRef, useState } from "preact/hooks";
import { bunyiTap } from "../../utils/audio";
import { tambahXp, xpHalaman } from "../../utils/progress";

interface Props {
  idHalaman: string;
}

const PALET = [
  { key: "pink", hex: "#E85D75", label: "Merah muda" },
  { key: "sunny", hex: "#FACC15", label: "Kuning" },
  { key: "sky", hex: "#38BDF8", label: "Biru" },
  { key: "mint", hex: "#4ADE80", label: "Hijau" },
  { key: "lavender", hex: "#A855F7", label: "Ungu" },
];

const GALERI_KEY = "rubina-gambar-v1";

/** Kanvas gambar bebas: coret dengan jari + palet + simpan ke galeri lokal. */
export default function FreePlayCanvas({ idHalaman }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [warna, setWarna] = useState(PALET[0].hex);
  const [tersimpan, setTersimpan] = useState(false);
  const menggambar = useRef(false);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    // Kanvas putih + garis tepi halus
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const posisi = (e: PointerEvent, cv: HTMLCanvasElement) => {
    const r = cv.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * cv.width,
      y: ((e.clientY - r.top) / r.height) * cv.height,
    };
  };

  const mulai = (e: PointerEvent) => {
    const cv = ref.current;
    if (!cv) return;
    menggambar.current = true;
    cv.setPointerCapture(e.pointerId);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const p = posisi(e, cv);
    ctx.strokeStyle = warna;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.1, p.y + 0.1);
    ctx.stroke();
  };

  const gerak = (e: PointerEvent) => {
    if (!menggambar.current) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const p = posisi(e, cv);
    ctx.strokeStyle = warna;
    ctx.lineWidth = 14;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const selesai = () => {
    menggambar.current = false;
  };

  const hapus = () => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    bunyiTap();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, cv.width, cv.height);
  };

  const simpan = () => {
    const cv = ref.current;
    if (!cv) return;
    try {
      // Kecilkan agar hemat storage
      const mini = document.createElement("canvas");
      mini.width = 200;
      mini.height = 150;
      mini.getContext("2d")?.drawImage(cv, 0, 0, 200, 150);
      const data = mini.toDataURL("image/png");
      const raw = localStorage.getItem(GALERI_KEY);
      const galeri: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      galeri.unshift(data);
      localStorage.setItem(GALERI_KEY, JSON.stringify(galeri.slice(0, 6)));
      setTersimpan(true);
      setTimeout(() => setTersimpan(false), 2000);
      if (xpHalaman(idHalaman) < 10) tambahXp(idHalaman, false);
    } catch {
      /* storage penuh — abaikan */
    }
  };

  return (
    <div class="flex flex-col items-center gap-4">
      <canvas
        ref={ref}
        width={640}
        height={420}
        onPointerDown={mulai}
        onPointerMove={gerak}
        onPointerUp={selesai}
        onPointerCancel={selesai}
        onPointerLeave={selesai}
        class="game-tap w-full rounded-xl border-2 border-line bg-white shadow-card"
        style={{ touchAction: "none", aspectRatio: "640 / 420" }}
        aria-label="Kanvas gambar, coret dengan jari"
      />
      <div class="flex flex-wrap justify-center gap-3">
        {PALET.map((w) => (
          <button
            key={w.key}
            type="button"
            onClick={() => { bunyiTap(); setWarna(w.hex); }}
            aria-label={w.label}
            title={w.label}
            class={`game-tap h-14 w-14 rounded-full border-4 shadow-card sm:h-16 sm:w-16 ${warna === w.hex ? "border-ink" : "border-white"}`}
            style={{ background: w.hex }}
          />
        ))}
      </div>
      <div class="flex gap-3">
        <button
          type="button"
          onClick={hapus}
          class="game-tap rounded-full bg-surface px-6 font-display text-lg font-bold shadow-card"
        >
          Hapus 🗑
        </button>
        <button
          type="button"
          onClick={simpan}
          class="game-tap rounded-full bg-rubina-sky-500 px-6 font-display text-lg font-bold text-white shadow-card"
        >
          Simpan 💾
        </button>
      </div>
      {tersimpan && <p class="game-pop font-sans text-base font-bold text-rubina-mint-600">Tersimpan! Bagus! ✅</p>}
    </div>
  );
}
