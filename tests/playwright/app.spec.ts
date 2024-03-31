import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("displays all A and AA criteria", async ({ page }) => {
  const items = page.getByRole("main").getByRole("listitem");
  await expect(items).toHaveCount(56);
});

test("select only A levels", async ({ page }) => {
  await page.getByLabel("AA", { exact: true }).uncheck();
  const items = page.getByRole("main").getByRole("listitem");
  await expect(items).toHaveCount(32);
});
