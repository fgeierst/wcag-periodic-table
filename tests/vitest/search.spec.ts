import { describe, expect, it } from "vitest";
import { matchesCriterion, searchCriteria } from "../../src/utils/search";
import { SortKey } from "../../src/utils/sorting";
import type { SuccessCriteria } from "../../src/wcag";

const keyboard: SuccessCriteria = {
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
    {
      title: "Understanding",
      url: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
    },
  ],
  axeCoreRules: [
    {
      ruleId: "keyboard-rule",
      description: "Interactive widgets",
      helpUrl: "https://example.com/rule",
    },
  ],
};
const focus: SuccessCriteria = {
  ref_id: "2.4.7",
  title: "Focus Visible",
  level: "AA",
  description: "Keyboard focus has a visible indicator.",
  url: "https://example.com/focus",
};
const strict: SuccessCriteria = {
  ref_id: "2.1.3",
  title: "Keyboard (No Exception)",
  level: "AAA",
  description: "Keyboard access",
  url: "https://example.com/strict",
};
const fixtures = [strict, focus, keyboard];

describe("criterion text matching", () => {
  it.each([
    " KEYBOARD ",
    "2.1.1",
    "functionality",
    "Path dependent",
    "Drawing",
    "Interactive widgets",
    "keyboard Drawing widgets",
  ])("matches approved fields for %s", (query) => {
    expect(matchesCriterion(keyboard, query)).toBe(true);
  });
  it.each(["keyboard nonexistent", "[", "keyboard-rule", "https://"])(
    "does not match absent or excluded text for %s",
    (query) => {
      expect(matchesCriterion(keyboard, query)).toBe(false);
    },
  );
  it.each(["", " \n\t "])("matches everything for an empty query", (query) => {
    expect(matchesCriterion(focus, query)).toBe(true);
  });
  it("handles absent optional fields", () => {
    expect(matchesCriterion(focus, "drawing")).toBe(false);
  });
});

describe("shared search results", () => {
  it("combines tokens and levels, normalizes whitespace, and sorts without mutation", () => {
    const original = [...fixtures];
    const result = searchCriteria(
      fixtures,
      "  KEYBOARD \n ",
      ["A", "AA"],
      SortKey.LEVEL,
    );
    expect(result).toEqual({
      query: "KEYBOARD",
      selectedLevels: ["A", "AA"],
      sortKey: SortKey.LEVEL,
      visibleCount: 2,
      excludedByLevelCount: 1,
      criteria: [keyboard, focus],
    });
    expect(fixtures).toEqual(original);
  });
  it("counts all text matches as excluded when no levels are selected", () => {
    expect(
      searchCriteria(fixtures, "keyboard", [], SortKey.LEVEL),
    ).toMatchObject({ visibleCount: 0, excludedByLevelCount: 3, criteria: [] });
  });
  it("empty submission restores all selected-level criteria", () => {
    expect(searchCriteria(fixtures, " ", ["AA"], SortKey.LEVEL)).toMatchObject({
      query: "",
      criteria: [focus],
      visibleCount: 1,
      excludedByLevelCount: 2,
    });
  });
  it("reports no textual matches separately from excluded matches", () => {
    expect(
      searchCriteria(fixtures, "nonexistent", ["A"], SortKey.LEVEL),
    ).toMatchObject({ visibleCount: 0, excludedByLevelCount: 0 });
  });
});
