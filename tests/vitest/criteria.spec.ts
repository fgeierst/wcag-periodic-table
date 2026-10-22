import { describe, expect, it } from "vitest";
import { getCriteria } from "../../src/data/criteria";
import { GET } from "../../src/pages/api/wcag.json";

describe("shared criterion data", () => {
  it("includes every criterion once with its detail content", () => {
    const criteria = getCriteria();
    expect(criteria).toHaveLength(86);
    expect(new Set(criteria.map((criterion) => criterion.ref_id)).size).toBe(
      86,
    );
    expect(
      criteria.find((criterion) => criterion.ref_id === "1.1.1"),
    ).toMatchObject({
      title: "Non-text Content",
      level: "A",
      url: "https://www.w3.org/TR/WCAG22/#non-text-content",
      special_cases: expect.arrayContaining([
        expect.objectContaining({ title: "Controls, Input" }),
      ]),
      references: expect.arrayContaining([
        expect.objectContaining({
          title: "Understanding 1.1.1",
          url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
        }),
      ]),
    });
    expect(
      criteria.find((criterion) => criterion.ref_id === "3.3.9"),
    ).toMatchObject({
      title: "Accessible Authentication (Enhanced)",
      level: "AAA",
    });
  });

  it.each([
    ["2.0", 61],
    ["2.1", 78],
    ["2.2", 86],
  ] as const)("returns the criteria included in WCAG %s", (version, count) => {
    const criteria = getCriteria(version);
    expect(criteria).toHaveLength(count);
    expect(
      criteria.every((criterion) => criterion.versions?.includes(version)),
    ).toBe(true);
    expect(criteria.every((criterion) => criterion.version === version)).toBe(
      true,
    );
  });

  it("preserves Parsing and historical names only in the appropriate versions", () => {
    expect(
      getCriteria("2.0").find((criterion) => criterion.ref_id === "4.1.1"),
    ).toMatchObject({
      title: "Parsing",
      level: "A",
      description: expect.stringContaining("complete start and end tags"),
    });
    expect(
      getCriteria("2.1").find((criterion) => criterion.ref_id === "2.5.5"),
    ).toMatchObject({
      title: "Target Size",
      url: "https://www.w3.org/TR/WCAG21/#target-size",
    });
    expect(
      getCriteria().find((criterion) => criterion.ref_id === "4.1.1"),
    ).toBeUndefined();
    expect(
      getCriteria().find((criterion) => criterion.ref_id === "2.5.5"),
    ).toMatchObject({ title: "Target Size (Enhanced)" });
  });

  it("retains full official content, including linked definitions and notes", () => {
    const criterion = getCriteria().find(
      (criterion) => criterion.ref_id === "1.1.1",
    )!;
    expect(criterion.content).toContain(
      'href="https://www.w3.org/TR/WCAG22/#dfn-non-text-content"',
    );
    expect(criterion.content).toContain("<dt>Controls, Input</dt>");
    expect(
      getCriteria("2.1").find((criterion) => criterion.ref_id === "4.1.1")!
        .content,
    ).toContain(
      "This success criterion should be considered as always satisfied",
    );
  });

  it("preserves audit results and matching axe rules", () => {
    const contrast = getCriteria().find(
      (criterion) => criterion.ref_id === "1.4.3",
    );
    expect(contrast).toMatchObject({
      automatedIssues: 73733,
      manualIssues: 14981,
      percentageOfTotalIssues: 29.91,
      axeCoreRules: [expect.objectContaining({ ruleId: "color-contrast" })],
    });
    const authentication = getCriteria().find(
      (criterion) => criterion.ref_id === "3.3.9",
    );
    expect(authentication).toMatchObject({
      automatedIssues: 0,
      manualIssues: 0,
      percentageOfTotalIssues: 0,
    });
    expect(authentication?.axeCoreRules).toBeUndefined();
  });

  it("keeps the JSON endpoint consistent with the detail page data", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(await response.json()).toEqual(getCriteria());
  });

  it("associates unique ACT rules with each matching criterion, not testcases", () => {
    const criteria = getCriteria();
    const contrast = criteria.find((criterion) => criterion.ref_id === "1.4.3");
    expect(contrast?.actRules).toEqual([
      expect.objectContaining({
        ruleId: "09o5cg",
        ruleName: "Text has enhanced contrast",
        status: "approved",
      }),
      expect.objectContaining({
        ruleId: "afw4f7",
        ruleName: "Text has minimum contrast",
        rulePage:
          "https://www.w3.org/WAI/standards-guidelines/act/rules/afw4f7/",
      }),
    ]);
    expect(
      criteria.find((criterion) => criterion.ref_id === "1.3.5")?.actRules,
    ).toEqual([expect.objectContaining({ ruleId: "73f2c2" })]);
    expect(
      criteria.find((criterion) => criterion.ref_id === "3.3.9")?.actRules,
    ).toBeUndefined();
    expect(
      criteria.find((criterion) => criterion.ref_id === "1.3.1")?.actRules,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ ruleId: "674b10" })]),
    );
    for (const criterion of criteria) {
      const rules = criterion.actRules ?? [];
      expect(new Set(rules.map((rule) => rule.ruleId)).size).toBe(rules.length);
      for (const rule of rules) {
        expect(rule.rulePage).not.toContain("testcases");
        expect(rule).not.toHaveProperty("testcaseId");
        expect(rule).not.toHaveProperty("expected");
        expect(rule.successCriteria).not.toEqual([]);
      }
    }
  });

  it("returns fresh ACT rule metadata on repeated calls", () => {
    const first = getCriteria().find(
      (criterion) => criterion.ref_id === "1.4.3",
    )!;
    expect(first.actRules).toBeDefined();
    first.actRules![0].ruleName = "Changed";
    first.actRules![0].successCriteria.push("changed");
    const next = getCriteria().find(
      (criterion) => criterion.ref_id === "1.4.3",
    )!;
    expect(next.actRules![0].ruleName).toBe("Text has enhanced contrast");
    expect(next.actRules![0].successCriteria).not.toContain("changed");
  });

  it("returns fresh criterion records on repeated calls", () => {
    const first = getCriteria();
    first[0].title = "Changed";
    first[0].manualIssues = -1;
    expect(getCriteria()[0]).toMatchObject({
      title: "Non-text Content",
      manualIssues: 7687,
    });
  });
});
