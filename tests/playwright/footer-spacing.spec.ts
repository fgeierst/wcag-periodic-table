import { expect, test } from "@playwright/test";

test("Sources preserves spaces around inline WCAG links", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByText("Sources", { exact: true }).click();
  await expect(footer.getByRole("listitem").first()).toHaveText(
    "Success criteria from W3C's WCAG 2.1 and WCAG 2.2, using the official 2.1 JSON and 2.2 JSON. Related techniques: WCAG 2.1 Techniques and WCAG 2.2 Techniques. Used under the W3C Document License. The 2.0 view selects criteria from the 2.1 data, not archival 2.0 text.",
  );
});
