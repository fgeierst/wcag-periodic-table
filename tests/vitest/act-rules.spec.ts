import { describe, expect, it } from "vitest";
import {
  normalizeActRules,
  updateActRules,
} from "../../scripts/update-act-rules.mjs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

function rule(overrides = {}) {
  return {
    title: "Text has minimum contrast",
    permalink: "/standards-guidelines/act/rules/afw4f7/",
    successCriteria: ["contrast-minimum", "contrast-enhanced"],
    wcagTechniques: ["G18"],
    deprecated: false,
    proposed: false,
    frontmatter: {
      id: "afw4f7",
      description: "This rule checks text contrast.\n",
    },
    ...overrides,
  };
}

describe("ACT rule catalogue normalization", () => {
  it("keeps one rule per ID, preferring approved metadata regardless of order", () => {
    const approved = rule();
    const proposed = rule({
      proposed: true,
      title: "Proposed contrast title",
      permalink: "/standards-guidelines/act/rules/afw4f7/proposed/",
      successCriteria: ["contrast-minimum", "resize-text"],
    });
    const expected = [
      {
        ruleId: "afw4f7",
        ruleName: "Text has minimum contrast",
        description: "This rule checks text contrast.",
        rulePage:
          "https://www.w3.org/WAI/standards-guidelines/act/rules/afw4f7/",
        successCriteria: [
          "contrast-enhanced",
          "contrast-minimum",
          "resize-text",
        ],
        status: "approved",
      },
    ];
    expect(normalizeActRules({ "act-rules": [proposed, approved] })).toEqual(
      expected,
    );
    expect(normalizeActRules({ "act-rules": [approved, proposed] })).toEqual(
      expected,
    );
  });

  it("preserves proposed and deprecated status without testcase data", () => {
    const result = normalizeActRules({
      "act-rules": [
        rule({
          proposed: true,
          permalink: "/standards-guidelines/act/rules/afw4f7/proposed/",
        }),
        rule({
          deprecated: true,
          proposed: true,
          title: "Old rule",
          frontmatter: { id: "9eb3f6", description: "Deprecated rule." },
          permalink: "/standards-guidelines/act/rules/9eb3f6/proposed/",
        }),
      ],
    });
    expect(result).toEqual([
      expect.objectContaining({ ruleId: "9eb3f6", status: "deprecated" }),
      expect.objectContaining({ ruleId: "afw4f7", status: "proposed" }),
    ]);
    expect(result[0]).not.toHaveProperty("testcases");
  });

  it("preserves ARIA-only rules with empty criterion associations", () => {
    expect(
      normalizeActRules({ "act-rules": [rule({ successCriteria: [] })] })[0]
        .successCriteria,
    ).toEqual([]);
  });

  it.each([
    null,
    {},
    { "act-rules": [] },
    { testcases: [rule()] },
    { "act-rules": [rule({ frontmatter: {} })] },
    { "act-rules": [rule({ successCriteria: [null] })] },
    { "act-rules": [rule({ proposed: "false" })] },
  ])("rejects malformed catalogues: %j", (data) => {
    expect(() => normalizeActRules(data)).toThrow(/Invalid ACT/);
  });

  it.each([
    "javascript:alert(1)",
    "https://example.com/rule",
    "//example.com/rule",
    "/standards-guidelines/act/rules/afw4f7/../../testcases/",
    "/standards-guidelines/act/rules/wrong1/",
  ])("rejects unsafe or mismatched rule permalinks: %s", (permalink) => {
    expect(() =>
      normalizeActRules({ "act-rules": [rule({ permalink })] }),
    ).toThrow(/Invalid ACT/);
  });

  it("does not mutate the upstream catalogue", () => {
    const data = { "act-rules": [rule()] };
    const before = structuredClone(data);
    normalizeActRules(data);
    expect(data).toEqual(before);
  });

  it.each([
    rule({ permalink: "/standards-guidelines/act/rules/afw4f7/proposed/" }),
    rule({ proposed: true }),
  ])("rejects contradictory status and permalink metadata", (contradictory) => {
    expect(() =>
      normalizeActRules({ "act-rules": [contradictory, rule()] }),
    ).toThrow(/Invalid ACT/);
    expect(() =>
      normalizeActRules({ "act-rules": [rule(), contradictory] }),
    ).toThrow(/Invalid ACT/);
  });
});

describe("ACT rule snapshot update", () => {
  async function withSnapshot(run: (path: string) => Promise<void>) {
    const directory = await mkdtemp(join(tmpdir(), "act-rules-"));
    try {
      const path = join(directory, "actRules.json");
      await writeFile(path, "original snapshot");
      await run(path);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }

  it("writes normalized rules rather than testcases", async () => {
    await withSnapshot(async (path) => {
      await updateActRules({
        outputPath: path,
        fetcher: async () => Response.json({ "act-rules": [rule()] }),
      });
      const data = JSON.parse(await readFile(path, "utf8"));
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject({
        ruleId: "afw4f7",
        description: "This rule checks text contrast.",
      });
      expect(data[0]).not.toHaveProperty("frontmatter");
    });
  });

  it.each([
    ["HTTP error", async () => new Response("Unavailable", { status: 503 })],
    ["invalid JSON", async () => new Response("not json")],
    ["invalid catalogue", async () => Response.json({ testcases: [] })],
    [
      "contradictory status",
      async () => Response.json({ "act-rules": [rule({ proposed: true })] }),
    ],
  ])("preserves the existing snapshot after %s", async (_name, fetcher) => {
    await withSnapshot(async (path) => {
      await expect(
        updateActRules({ outputPath: path, fetcher }),
      ).rejects.toThrow();
      expect(await readFile(path, "utf8")).toBe("original snapshot");
    });
  });
});
