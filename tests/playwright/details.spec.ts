import { expect, test } from "@playwright/test";
import type { SuccessCriteria } from "../../src/wcag";
import axe from "axe-core";

test("criterion cards navigate to full pages instead of dialogs", async ({
  page,
}) => {
  await page.goto("/");
  const link = page
    .getByRole("main")
    .getByRole("link", { name: "1.1.1 Non-text Content", exact: true });
  await expect(link).toHaveAttribute("href", "/criteria/non-text-content/");
  await link.click();
  await expect(page).toHaveURL("/criteria/non-text-content/");
  await expect(
    page.getByRole("main").getByRole("heading", { level: 1 }),
  ).toHaveText("WCAG 2.2 / 1.1.1 Non-text Content");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveTitle("WCAG 2.2 / 1.1.1 Non-text Content");
  await page.getByRole("link", { name: "WCAG 2.2", exact: true }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(56);
});

test("card links support visible keyboard focus and Enter", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "2.1.1 Keyboard", exact: true });
  await link.focus();
  await expect(link).toBeFocused();
  expect(
    await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return (
        style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0
      );
    }),
  ).toBe(true);
  await link.press("Enter");
  await expect(page).toHaveURL("/criteria/keyboard/");
});

test("detail pages can be opened directly and reloaded without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("/criteria/keyboard-no-exception/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "WCAG 2.2 / 2.1.3 Keyboard (No Exception)",
    );
    await expect(page.getByRole("main")).toContainText(
      "without requiring specific timings",
    );
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("main")).toContainText("AAA");
    await expect(
      page.getByRole("link", { name: "WCAG 2.2", exact: true }),
    ).toHaveAttribute("href", "/");
  } finally {
    await context.close();
  }
});

test("detail pages preserve exceptions, statistics, rules, and references", async ({
  page,
}) => {
  await page.goto("/criteria/contrast-minimum/");
  const main = page.getByRole("main");
  await expect(main).toContainText("contrast ratio of at least 4.5:1");
  await expect(main).toContainText("29%");
  await expect(main).toContainText("AA");
  await expect(main).toContainText("Large Text");
  await expect(main).toContainText("Logotypes");
  await expect(
    main.getByRole("heading", { name: "axe-core Rule", exact: true }),
  ).toBeVisible();
  await expect(
    main.getByRole("link", { name: "color-contrast", exact: true }),
  ).toHaveAttribute(
    "href",
    /dequeuniversity\.com\/rules\/axe\/.*\/color-contrast/,
  );
  await expect(
    main.getByRole("link", { name: "WCAG 2.2 specification" }),
  ).toHaveAttribute("href", "https://www.w3.org/TR/WCAG22/#contrast-minimum");
  await expect(
    main.getByRole("link", { name: "How to Meet", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.w3.org/WAI/WCAG22/quickref/#contrast-minimum",
  );
  await expect(
    main.getByRole("link", { name: "Understanding", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
  );
});

test("criteria without rules or exceptions omit empty sections", async ({
  page,
}) => {
  await page.goto("/criteria/accessible-authentication-enhanced/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WCAG 2.2 / 3.3.9 Accessible Authentication (Enhanced)",
  );
  await expect(page.getByRole("heading", { name: /axe-core/ })).toHaveCount(0);
  await page.goto("/criteria/keyboard-no-exception/");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(1);
});

test("all criterion links including AAA resolve to the corresponding static page", async ({
  page,
  request,
}) => {
  test.setTimeout(60000);
  const criteria: SuccessCriteria[] = await (
    await request.get("/api/wcag.json")
  ).json();
  await page.goto("/");
  await page.getByLabel("AAA", { exact: true }).check();
  const links = page.getByRole("main").getByRole("link");
  await expect(links).toHaveCount(87);
  for (const criterion of criteria) {
    const slug = criterion.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const href = `/criteria/${slug}/`;
    await expect(
      links.filter({ hasText: `${criterion.ref_id} ${criterion.title}` }),
    ).toHaveAttribute("href", href);
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    expect(await response.text(), href).toContain(
      `<title>WCAG 2.2 / ${criterion.ref_id} ${criterion.title}</title>`,
    );
  }
});

test("long details use document scrolling and fit narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/criteria/non-text-content/");
  const main = page.getByRole("main");
  await expect(main).toContainText("Decoration, Formatting, Invisible");
  await expect(
    main.getByRole("link", { name: "Understanding", exact: true }),
  ).toBeVisible();
  const layout = await main.evaluate((element) => ({
    fits: document.documentElement.scrollWidth <= window.innerWidth,
    scrolls: document.documentElement.scrollHeight > window.innerHeight,
    nestedScroll: [element, ...element.querySelectorAll("*")].some(
      (node) =>
        ["auto", "scroll"].includes(getComputedStyle(node).overflowY) &&
        node.scrollHeight > node.clientHeight,
    ),
  }));
  expect(layout).toEqual({ fits: true, scrolls: true, nestedScroll: false });
  await page.goto("/criteria/accessible-authentication-enhanced/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("detail pages have no detectable WCAG A/AA accessibility violations", async ({
  page,
}) => {
  await page.goto("/criteria/non-text-content/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WCAG 2.2 / 1.1.1 Non-text Content",
  );
  await page.addScriptTag({ content: axe.source });
  const violations = await page.evaluate(
    async () =>
      (
        await (window as unknown as { axe: typeof axe }).axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
          },
        })
      ).violations,
  );
  expect(violations).toEqual([]);
});

test("unknown criterion IDs return 404", async ({ request }) => {
  expect((await request.get("/criteria/9.9.9/")).status()).toBe(404);
});

for (const returnMethod of ["back link", "browser Back"] as const) {
  test(`returning via ${returnMethod} preserves the table search, filters, and sort`, async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Search", exact: true }),
    ).toBeEnabled();
    await page.getByLabel("AAA", { exact: true }).check();
    await page.getByLabel("AA", { exact: true }).uncheck();
    await page.getByRole("searchbox").fill("keyboard");
    await page.getByRole("searchbox").press("Enter");
    await page
      .getByRole("combobox", { name: "Sort by" })
      .selectOption("Most common issues");
    const items = page.getByRole("main").getByRole("listitem");
    await expect(items).toHaveCount(6);
    const before = await items.allTextContents();
    await page
      .getByRole("link", { name: "2.1.3 Keyboard (No Exception)", exact: true })
      .click();
    await expect(page).toHaveURL("/criteria/keyboard-no-exception/");
    if (returnMethod === "back link") {
      await page.getByRole("link", { name: "WCAG 2.2", exact: true }).click();
    } else {
      await page.goBack();
    }
    await expect(page.getByRole("searchbox")).toHaveValue("keyboard");
    await expect(page.getByLabel("AAA", { exact: true })).toBeChecked();
    await expect(page.getByLabel("AA", { exact: true })).not.toBeChecked();
    await expect(page.getByRole("combobox", { name: "Sort by" })).toHaveValue(
      "Most common issues",
    );
    await expect(items).toHaveCount(6);
    expect(await items.allTextContents()).toEqual(before);
  });
}

test("details match the index alignment and heading size with an 80ch text limit and no separators", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const indexHeading = await page
    .getByRole("heading", { level: 1 })
    .evaluate((element) => ({
      x: element.getBoundingClientRect().x,
      y: element.getBoundingClientRect().y,
      size: getComputedStyle(element).fontSize,
    }));
  await page.goto("/criteria/non-text-content/");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveText("WCAG 2.2 / 1.1.1 Non-text Content");
  await expect(
    heading.getByRole("link", { name: "WCAG 2.2", exact: true }),
  ).toHaveAttribute("href", "/");
  const details = await heading.evaluate((element) => ({
    x: element.getBoundingClientRect().x,
    y: element.getBoundingClientRect().y,
    size: getComputedStyle(element).fontSize,
  }));
  expect(details).toEqual(indexHeading);
  await expect(page.getByRole("separator")).toHaveCount(0);
  const widthAndBorders = await page.getByRole("main").evaluate((main) => {
    const measure = document.createElement("div");
    measure.style.width = "80ch";
    main.appendChild(measure);
    const maxWidth = measure.getBoundingClientRect().width;
    measure.remove();
    return {
      width: main.getBoundingClientRect().width,
      maxWidth,
      borders: [main, ...main.querySelectorAll("header, section")].some(
        (element) => {
          const style = getComputedStyle(element);
          return (
            parseFloat(style.borderTopWidth) > 0 ||
            parseFloat(style.borderBottomWidth) > 0
          );
        },
      ),
    };
  });
  expect(widthAndBorders.width).toBeLessThanOrEqual(widthAndBorders.maxWidth);
  expect(widthAndBorders.borders).toBe(false);
});
