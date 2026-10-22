import { expect, test } from "@playwright/test";

test("published legacy detail URLs still resolve without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("/criteria/target-size/");
    await expect(page).toHaveURL("/criteria/target-size-enhanced/");
    await expect(page).toHaveTitle("WCAG 2.2 / 2.5.5 Target Size (Enhanced)");
    await page.goto("/criteria/parsing/");
    await expect(page).toHaveURL("/wcag/2.1/criteria/parsing/");
    await expect(page).toHaveTitle("WCAG 2.1 / 4.1.1 Parsing");
  } finally {
    await context.close();
  }
});

test("version and added-only controls sit between search and levels and filter the table", async ({
  page,
}) => {
  await page.goto("/");
  const version = page.getByRole("combobox", { name: "Version", exact: true });
  const added = page.getByRole("checkbox", {
    name: "Only added in this version",
  });
  const cards = page.getByRole("main").getByRole("listitem");
  await expect(version).toHaveValue("2.2");
  await expect(added).not.toBeChecked();
  const order = await page
    .locator("form, #version, #only-added, fieldset, #sort")
    .evaluateAll((elements) =>
      elements.map((element) =>
        element.tagName === "FORM"
          ? "search"
          : element.tagName === "FIELDSET"
            ? "levels"
            : element.id,
      ),
    );
  expect(order).toEqual(["search", "version", "only-added", "levels", "sort"]);
  await expect(cards).toHaveCount(55);
  await page.getByLabel("AAA", { exact: true }).check();
  await expect(cards).toHaveCount(86);
  await added.check();
  await expect(cards).toHaveCount(9);
  await version.selectOption("2.1");
  await expect(cards).toHaveCount(17);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WCAG 2.1 Success Criteria",
  );
  await added.uncheck();
  await expect(cards).toHaveCount(78);
  await expect(
    page.getByRole("link", { name: "4.1.1 Parsing", exact: true }),
  ).toHaveAttribute("href", "/wcag/2.1/criteria/parsing/");
  await added.check();
  await version.selectOption("2.0");
  await expect(added).toBeDisabled();
  await expect(added).not.toBeChecked();
  await expect(cards).toHaveCount(61);
  await version.selectOption("2.2");
  await expect(added).toBeEnabled();
  await expect(cards).toHaveCount(86);
});

test("added-only and version survive detail navigation and reload", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("combobox", { name: "Version", exact: true })
    .selectOption("2.1");
  await page.getByLabel("Only added in this version").check();
  await page
    .getByRole("link", { name: "1.3.4 Orientation", exact: true })
    .click();
  await expect(page).toHaveURL("/wcag/2.1/criteria/orientation/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WCAG 2.1 / 1.3.4 Orientation",
  );
  await page.getByRole("link", { name: "WCAG 2.1", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: "Version", exact: true }),
  ).toHaveValue("2.1");
  await expect(page.getByLabel("Only added in this version")).toBeChecked();
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(12);
  await page.reload();
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(12);
});

test("old session state restores search and levels while defaulting the version", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem(
      "wcag-table-state",
      JSON.stringify({
        query: "keyboard",
        selectedLevels: ["AAA"],
        sortKey: "Level",
      }),
    ),
  );
  await page.goto("/");
  await expect(page.getByRole("searchbox")).toHaveValue("keyboard");
  await expect(
    page.getByRole("combobox", { name: "Version", exact: true }),
  ).toHaveValue("2.2");
  await expect(page.getByLabel("AAA", { exact: true })).toBeChecked();
  await expect(
    page.getByRole("link", {
      name: "2.1.3 Keyboard (No Exception)",
      exact: true,
    }),
  ).toBeVisible();
});

test("rapid version changes cannot be overwritten by an older response", async ({
  page,
  request,
}) => {
  const older = await (await request.get("/api/wcag/2.1.json")).json();
  let release!: () => void;
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/wcag/2.1.json", async (route) => {
    await waiting;
    await route.fulfill({ json: older });
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Search", exact: true }),
  ).toBeEnabled();
  const version = page.getByRole("combobox", { name: "Version", exact: true });
  await version.selectOption("2.1");
  await version.selectOption("2.2");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(55);
  release();
  await expect(
    page.getByRole("link", { name: "4.1.1 Parsing", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "WCAG 2.2 Success Criteria",
  );
});

test("older version detail pages preserve Parsing text, names and references without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const version of ["2.0", "2.1"]) {
      await page.goto(`/wcag/${version}/criteria/parsing/`);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        `WCAG ${version} / 4.1.1 Parsing`,
      );
      await expect(page.getByRole("main")).toContainText(
        "complete start and end tags",
      );
      await expect(page.getByRole("main")).toContainText(
        "This success criterion should be considered as always satisfied",
      );
      await expect(
        page.getByRole("link", { name: `WCAG ${version} specification` }),
      ).toHaveAttribute("href", "https://www.w3.org/TR/WCAG21/#parsing");
    }
    await page.goto("/wcag/2.1/criteria/target-size/");
    await expect(page).toHaveTitle("WCAG 2.1 / 2.5.5 Target Size");
    await page.goto("/criteria/target-size-enhanced/");
    await expect(page).toHaveTitle("WCAG 2.2 / 2.5.5 Target Size (Enhanced)");
  } finally {
    await context.close();
  }
});

test("new controls wrap without overflowing at 320px and are keyboard accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Search", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Search", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("combobox", { name: "Version", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Only added in this version")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
