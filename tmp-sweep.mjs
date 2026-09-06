import { chromium } from "playwright";

const T = "C:/Users/HP/AppData/Local/Temp/opencode";
const B = "http://localhost:4323/petualangan-kode-rubina";
const ROUTES = [
  "/",
  "/sampul/",
  "/panduan-orang-tua/",
  "/game/",
  "/pola/01-ab/",
  "/pola/03-abc/",
  "/sequencing/01-cuci-tangan/",
  "/arah/03-labirin/",
  "/arah/04-nina-cari-jalan/",
  "/sebab-akibat/01-tombol-lampu/",
  "/kartu-aktivitas/",
  "/bebas/01-buat-pola/",
  "/game/pola/01-ab/",
  "/game/sequencing/01-cuci-tangan/",
  "/game/arah/03-labirin/",
  "/game/sebab-akibat/01-tombol-lampu/",
  "/game/kartu-aktivitas/",
  "/game/bebas/02-gambar-robot/",
];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 375, height: 667 } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));
const hasil = [];
for (const r of ROUTES) {
  await p.goto(B + r, { waitUntil: "networkidle" });
  await p.evaluateHandle("document.fonts.ready");
  const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  hasil.push(`${over > 1 ? "LUBER " + over + "px" : "ok      "} ${r}`);
}
console.log(hasil.join("\n"));
console.log("errs:", JSON.stringify(errs));

// Alur Lanjut: selesaikan pola-01 → tutup → klik Lanjut → harusnya 02-abb
await p.goto(`${B}/game/pola/01-ab/`, { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Merah muda" }).click();
await p.getByRole("button", { name: "Lingkaran kosong 5" }).click();
await p.getByRole("button", { name: "Kuning" }).click();
await p.getByRole("button", { name: "Lingkaran kosong 6" }).click();
await p.waitForTimeout(600);
await p.getByRole("button", { name: /Main Lagi/ }).click();
await p.getByRole("link", { name: /Lanjut/ }).click();
await p.waitForTimeout(800);
console.log("lanjut-url:", p.url());
await p.screenshot({ path: `${T}/hp-landing-fix.png` });
await b.close();
