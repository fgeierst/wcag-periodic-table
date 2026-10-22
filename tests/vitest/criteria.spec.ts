import { describe, expect, it } from "vitest";
import { getCriteria } from "../../src/data/criteria";
import { GET } from "../../src/pages/api/wcag.json";

describe("shared criterion data", () => {
  it("includes every criterion once with its detail content", () => {
    const criteria = getCriteria();
    expect(criteria).toHaveLength(87);
    expect(new Set(criteria.map((criterion) => criterion.ref_id)).size).toBe(
      87,
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
        {
          title: "Understanding 1.1.1",
          url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
        },
      ]),
    });
    expect(
      criteria.find((criterion) => criterion.ref_id === "3.3.9"),
    ).toMatchObject({
      title: "Accessible Authentication (Enhanced)",
      level: "AAA",
    });
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
