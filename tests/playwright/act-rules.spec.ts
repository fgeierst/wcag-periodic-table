import { expect, test } from "@playwright/test";

test("ACT section lists unique rules and summaries, not testcases", async ({
  page,
}) => {
  await page.goto("/criteria/contrast-minimum/");
  const section = page.getByRole("region", {
    name: "ACT Rules (2)",
    exact: true,
  });
  await expect(section.getByRole("listitem")).toHaveCount(2);
  await expect(section).toContainText("Text has enhanced contrast");
  await expect(section).toContainText("Text has minimum contrast");
  await expect(section).toContainText(
    "This rule checks that the highest possible contrast",
  );
  await expect(
    section.getByRole("link", { name: "09o5cg", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.w3.org/WAI/standards-guidelines/act/rules/09o5cg/",
  );
  await expect(
    section.getByRole("link", { name: "afw4f7", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.w3.org/WAI/standards-guidelines/act/rules/afw4f7/",
  );
  await expect(section.locator('a[href*="testcases"]')).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "axe-core Rule", exact: true }),
  ).toBeVisible();
});

test("one ACT rule uses a singular heading and its approved link", async ({
  page,
}) => {
  await page.goto("/criteria/identify-input-purpose/");
  const section = page.getByRole("region", { name: "ACT Rule", exact: true });
  await expect(section.getByRole("listitem")).toHaveCount(1);
  await expect(section).toContainText("Autocomplete attribute has valid value");
  await expect(section).not.toContainText("Proposed");
  await expect(
    section.getByRole("link", { name: "73f2c2", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.w3.org/WAI/standards-guidelines/act/rules/73f2c2/",
  );
});

test("proposed ACT rules are explicitly labeled", async ({ page }) => {
  await page.goto("/criteria/sensory-characteristics/");
  const section = page.getByRole("region", { name: "ACT Rule", exact: true });
  await expect(section).toContainText("Proposed");
  await expect(
    section.getByRole("link", { name: "9bd38c", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.w3.org/WAI/standards-guidelines/act/rules/9bd38c/proposed/",
  );
});

test("criteria with no ACT rules omit the section", async ({ page }) => {
  await page.goto("/criteria/accessible-authentication-enhanced/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("3.3.9");
  await expect(page.getByRole("heading", { name: /^ACT Rule/ })).toHaveCount(0);
});

test("deprecated ACT rules are explicitly labeled", async ({ page }) => {
  await page.goto("/criteria/non-text-content/");
  const section = page.getByRole("region", { name: /^ACT Rules/ });
  const deprecatedRule = section
    .getByRole("listitem")
    .filter({ has: page.getByRole("link", { name: "9eb3f6", exact: true }) });
  await expect(deprecatedRule).toContainText(
    "Image filename is accessible name for image",
  );
  await expect(deprecatedRule).toContainText("Deprecated");
});

test("ACT links are underlined, visibly focusable, and fit a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/criteria/non-text-content/");
  const section = page.getByRole("region", { name: /^ACT Rules/ });
  const link = section.getByRole("link", { name: "23a2a8", exact: true });
  await link.focus();
  await expect(link).toBeFocused();
  const style = await link.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      underline: style.textDecorationLine,
      outline: style.outlineStyle,
      width: parseFloat(style.outlineWidth),
    };
  });
  expect(style.underline).toContain("underline");
  expect(style.outline).not.toBe("none");
  expect(style.width).toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("ACT rules are present without JavaScript and after reload", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("/criteria/contrast-minimum/");
    const section = page.getByRole("region", {
      name: "ACT Rules (2)",
      exact: true,
    });
    await expect(section.getByRole("link")).toHaveCount(2);
    await page.reload();
    await expect(section).toContainText("Text has minimum contrast");
  } finally {
    await context.close();
  }
});

test("Sources credits the ACT rule catalogue", async ({ page }) => {
  await page.goto("/criteria/contrast-minimum/");
  const footer = page.getByRole("contentinfo");
  await footer.getByText("Sources", { exact: true }).click();
  await expect(
    footer.getByRole("link", { name: "ACT Rules", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.w3.org/WAI/standards-guidelines/act/rules/",
  );
});
