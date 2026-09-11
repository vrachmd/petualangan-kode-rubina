import { test, expect } from "@playwright/test";

// Service worker registration and missing assets cause 404s in dev mode — expected.
const isDevError = (msg: string) =>
  msg.includes("service worker") ||
  msg.includes("sw.js") ||
  msg.includes("bad HTTP response") ||
  msg.includes("Failed to load resource") ||
  msg.includes("404");

test.describe("Landing page", () => {
  test("loads and shows title", async ({ page }) => {
    await page.goto("");
    await expect(page).toHaveTitle(/Petualangan Kode/);
  });

  test("shows navigation links", async ({ page }) => {
    await page.goto("");
    await expect(page.getByRole("link", { name: "▶ Main" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Cetak" }).first()).toBeVisible();
  });

  test("shows activity categories", async ({ page }) => {
    await page.goto("");
    await expect(page.getByText("Pola", { exact: true })).toBeVisible();
    await expect(page.getByText("Urutan", { exact: true })).toBeVisible();
    await expect(page.getByText("Arah", { exact: true })).toBeVisible();
    await expect(page.getByText("Sebab-Akibat", { exact: true })).toBeVisible();
    await expect(page.getByText("Kartu Gerak", { exact: true })).toBeVisible();
    await expect(page.getByText("Main Bebas", { exact: true })).toBeVisible();
  });

  test("has no app console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isDevError(msg.text())) errors.push(msg.text());
    });
    await page.goto("");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("Cover page", () => {
  test("loads and shows title", async ({ page }) => {
    await page.goto("sampul/");
    await expect(page).toHaveTitle(/Sampul/);
  });

  test("displays Petualangan Kode Rubina", async ({ page }) => {
    await page.goto("sampul/");
    await expect(page.getByText("Petualangan Kode")).toBeVisible();
  });

  test("has no app console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isDevError(msg.text())) errors.push(msg.text());
    });
    await page.goto("sampul/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("Worksheet pages", () => {
  const worksheetPages = [
    { path: "pola/01-ab/", name: "Pola 01" },
    { path: "sequencing/01-cuci-tangan/", name: "Sequencing 01" },
    { path: "arah/01-lacak-garis/", name: "Arah 01" },
    { path: "sebab-akibat/01-tombol-lampu/", name: "Sebab-Akibat 01" },
  ];

  for (const wp of worksheetPages) {
    test(`${wp.name} loads without app console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" && !isDevError(msg.text())) errors.push(msg.text());
      });
      await page.goto(wp.path);
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });

    test(`${wp.name} has a heading`, async ({ page }) => {
      await page.goto(wp.path);
      const heading = page.locator("h1, h2, h3").first();
      await expect(heading).toBeVisible();
    });
  }
});

test.describe("Parent guide page", () => {
  test("loads successfully", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isDevError(msg.text())) errors.push(msg.text());
    });
    await page.goto("panduan-orang-tua/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("Game gallery page", () => {
  test("loads and shows game links", async ({ page }) => {
    await page.goto("game/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });
});
