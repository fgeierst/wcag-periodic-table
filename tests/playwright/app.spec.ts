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

test("heading stays count-free when filters change", async ({ page }) => {
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(56);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WCAG 2.2 Success Criteria",
  );
  await page.getByLabel("AA", { exact: true }).uncheck();
  await expect(page.getByRole("status")).toContainText("32 criteria");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WCAG 2.2 Success Criteria",
  );
});

test("footer is separated from the criteria grid", async ({ page }) => {
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(56);
  const grid = await page.getByRole("main").getByRole("list").boundingBox();
  const footer = await page.getByRole("contentinfo").boundingBox();
  expect(footer!.y - grid!.y - grid!.height).toBeGreaterThanOrEqual(32);
});
