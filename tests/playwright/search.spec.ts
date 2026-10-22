import { test, expect, type Page } from "@playwright/test";
import type { SuccessCriteria } from "../../src/wcag";
import type { CriterionSearchResult } from "../../src/utils/search";

const fixtures: SuccessCriteria[] = [
  {
    ref_id: "2.1.3",
    title: "Keyboard (No Exception)",
    level: "AAA",
    description: "All functionality is keyboard operable.",
    url: "https://example.com/strict",
    references: [],
  },
  {
    ref_id: "2.4.7",
    title: "Focus Visible",
    level: "AA",
    description: "Keyboard focus has a visible indicator.",
    url: "https://example.com/focus",
    references: [],
  },
  {
    ref_id: "2.1.1",
    title: "Keyboard",
    level: "A",
    description: "All functionality is operable through a keyboard interface.",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
    special_cases: [
      {
        type: "exception",
        title: "Path dependent",
        description: "Drawing movements",
      },
    ],
    references: [
      { title: "Understanding", url: "https://example.com/understanding" },
    ],
    axeCoreRules: [
      {
        ruleId: "test-rule",
        description: "Interactive widgets",
        helpUrl: "https://example.com/rule",
      },
    ],
  },
  {
    ref_id: "4.1.2",
    title: "Name, Role, Value",
    level: "A",
    description: "Components expose states and properties.",
    url: "https://example.com/name",
    references: [],
  },
];

async function loadFixture(page: Page) {
  await page.route("**/api/wcag.json", (route) =>
    route.fulfill({ json: fixtures }),
  );
  await page.goto("/");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(3);
}

test("search controls are compact and inline without placeholder or help text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await loadFixture(page);
  const input = page.getByRole("searchbox", { name: "Search criteria" });
  await expect(input).not.toHaveAttribute("placeholder");
  await expect(input).not.toHaveAttribute("aria-describedby");
  await expect(page.locator("#search-help")).toHaveCount(0);
  const labelBox = await page
    .locator('label[for="criteria-search"]')
    .boundingBox();
  const inputBox = await input.boundingBox();
  expect(inputBox!.width).toBeLessThanOrEqual(256);
  expect(labelBox!.x + labelBox!.width).toBeLessThan(inputBox!.x);
  expect(
    Math.abs(
      labelBox!.y + labelBox!.height / 2 - inputBox!.y - inputBox!.height / 2,
    ),
  ).toBeLessThan(2);
});

test("status inherits body text size and color", async ({ page }) => {
  await loadFixture(page);
  const typography = await page.getByRole("status").evaluate((status) => {
    const body = getComputedStyle(document.body);
    const text = getComputedStyle(status);
    return {
      bodySize: body.fontSize,
      size: text.fontSize,
      bodyColor: body.color,
      color: text.color,
    };
  });
  expect(typography.size).toBe(typography.bodySize);
  expect(typography.color).toBe(typography.bodyColor);
});

test("submits keyword searches with button and Enter, not draft typing", async ({
  page,
}) => {
  await loadFixture(page);
  const field = page.getByRole("searchbox", { name: "Search criteria" });
  const cards = page.getByRole("main").getByRole("listitem");
  await field.fill("  KEYBOARD  ");
  await expect(cards).toHaveCount(3);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(cards).toHaveCount(2);
  await expect(cards.nth(0)).toContainText("2.1.1");
  await expect(cards.nth(1)).toContainText("2.4.7");
  await expect(page.getByRole("status")).toContainText(
    "1 more hidden by level filters",
  );
  await field.fill("keyboard drawing widgets");
  await field.press("Enter");
  await expect(cards).toHaveCount(1);
  await expect(
    cards.getByRole("link", { name: "2.1.1 Keyboard", exact: true }),
  ).toHaveAttribute("href", "/criteria/2.1.1/");
  await expect(
    page.getByRole("button", { name: "Clear", exact: true }),
  ).toHaveCount(0);
});

test("empty search preserves filters and no matches offer recovery", async ({
  page,
}) => {
  await loadFixture(page);
  await page.getByLabel("A", { exact: true }).uncheck();
  const field = page.getByRole("searchbox", { name: "Search criteria" });
  await field.fill("nonexistent");
  await field.press("Enter");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Try another keyword");
  await field.fill(" \t ");
  await field.press("Enter");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(1);
  await expect(page.getByLabel("A", { exact: true })).not.toBeChecked();
  await page.getByLabel("AAA", { exact: true }).check();
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(2);
});

test("agent submission reads DOM values and returns the same ordered references", async ({
  page,
}) => {
  await loadFixture(page);
  const output = (await page.locator("form").evaluate((form) => {
    const input = form.querySelector<HTMLInputElement>('input[name="query"]')!;
    input.value = " keyboard ";
    return new Promise<CriterionSearchResult>((resolve) => {
      const event = new SubmitEvent("submit", {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperties(event, {
        agentInvoked: { value: true },
        respondWith: {
          value: (response: Promise<CriterionSearchResult>) =>
            response.then(resolve),
        },
      });
      form.dispatchEvent(event);
    });
  })) as CriterionSearchResult;
  expect(output).toMatchObject({
    query: "keyboard",
    selectedLevels: ["A", "AA"],
    sortKey: "Level",
    visibleCount: 2,
    excludedByLevelCount: 1,
  });
  expect(output.criteria).toEqual([fixtures[2], fixtures[1]]);
  const cards = page.getByRole("main").getByRole("listitem");
  await expect(cards).toHaveCount(2);
  await expect(cards.nth(0)).toContainText(output.criteria[0].ref_id);
  await expect(cards.nth(1)).toContainText(output.criteria[1].ref_id);
  await expect(page.getByRole("searchbox")).toHaveValue(" keyboard ");
});

test("normal submission works without WebMCP extensions and does not navigate", async ({
  page,
}) => {
  await loadFixture(page);
  const prevented = await page.locator("form").evaluate((form) => {
    form.querySelector<HTMLInputElement>("input")!.value = "2.1.1";
    const event = new SubmitEvent("submit", {
      bubbles: true,
      cancelable: true,
    });
    return !form.dispatchEvent(event);
  });
  expect(prevented).toBe(true);
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(1);
  await expect(page).toHaveURL("/");
});

test("loading and failed data are distinct from valid zero matches", async ({
  page,
}) => {
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/wcag.json", async (route) => {
    await waiting;
    await route.fulfill({ status: 503, body: "Unavailable" });
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Search", exact: true }),
  ).toBeDisabled();
  await expect(page.locator("form[toolname]")).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Loading");
  release();
  await expect(page.getByRole("status")).toContainText(
    "WCAG criteria could not be loaded",
  );
  await expect(page.getByRole("status")).not.toContainText(
    "Try another keyword",
  );
  await expect(
    page.getByRole("button", { name: "Search", exact: true }),
  ).toBeDisabled();
  await expect(page.locator("form[toolname]")).toHaveCount(0);
});

test("toolbar fits narrow screens and supports keyboard submission", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await loadFixture(page);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("keyboard");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Search", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("long unbroken searches do not overflow narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await loadFixture(page);
  await page.getByRole("searchbox").fill("keyboard".repeat(8));
  await page.getByRole("searchbox").press("Enter");
  await expect(page.getByRole("status")).toContainText("Try another keyword");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
