/** Helper bersama: jalankan `astro preview` atas folder dist/ lalu matikan lagi. */
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { SITE_BASE } from "./pages.js";

export async function withPreview<T>(
  port: number,
  fn: (baseUrl: string) => Promise<T>
): Promise<T> {
  // Spawn node langsung ke CLI astro (tanpa shell/npm) supaya:
  // 1) tidak ada warning DEP0190, 2) PID yang dipegang = proses aslinya.
  const astroBin = join(process.cwd(), "node_modules", "astro", "astro.js");
  const proc: ChildProcess = spawn(process.execPath, [astroBin, "preview", "--port", String(port)], {
    cwd: process.cwd(),
    stdio: "ignore",
    shell: false,
  });
  const baseUrl = `http://localhost:${port}${SITE_BASE}`;
  const deadline = Date.now() + 60_000;
  for (;;) {
    try {
      const res = await fetch(baseUrl);
      if (res.ok) break;
    } catch {
      /* belum siap */
    }
    if (Date.now() > deadline) {
      killTree(proc);
      throw new Error(`preview server tidak siap di ${baseUrl}`);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  try {
    return await fn(baseUrl);
  } finally {
    killTree(proc);
  }
}

/** Matikan proses + seluruh anaknya (penting di Windows agar port bebas). */
function killTree(proc: ChildProcess) {
  if (proc.pid === undefined) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(proc.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    proc.kill();
  }
}

export function ensureDir(path: string) {
  mkdirSync(path, { recursive: true });
}
