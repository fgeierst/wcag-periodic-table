import { expect, it } from "vitest";
import {
  sortByAutomatedTests,
  sortByLevel,
  sortByMostCommon,
  sortByRefId,
} from "./sorting";
import type { SuccessCriteria } from "../wcag";

const testCriteria: Array<SuccessCriteria> = [
  {
    ref_id: "1.1.1",
    title: "Non-text Content",
    description:
      "All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for the situations listed below.",
    url: "https://www.w3.org/TR/WCAG22/#non-text-content",
    level: "A",
    automatedIssues: 16014,
    manualIssues: 7687,
    percentageOfTotalIssues: 7.99,
    axeCoreRules: [
      {
        ruleId: "aria-meter-name",
        description: "Ensures every ARIA meter node has an accessible name",
        help: "ARIA meter nodes must have an accessible name",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.9/aria-meter-name?application=axeAPI",
        tags: ["cat.aria", "wcag2a", "wcag111", "EN-301-549", "EN-9.1.1.1"],
      },
      {
        ruleId: "aria-progressbar-name",
        description:
          "Ensures every ARIA progressbar node has an accessible name",
        help: "ARIA progressbar nodes must have an accessible name",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.9/aria-progressbar-name?application=axeAPI",
        tags: ["cat.aria", "wcag2a", "wcag111", "EN-301-549", "EN-9.1.1.1"],
      },
    ],
  },
  {
    ref_id: "1.4.6",
    title: "Contrast (Enhanced)",
    description:
      "The visual presentation of text and images of text has a contrast ratio of at least 7:1, except for the following: ",
    url: "https://www.w3.org/TR/WCAG22/#contrast-enhanced",
    level: "AAA",
    automatedIssues: 0,
    manualIssues: 0,
    percentageOfTotalIssues: 0,
    axeCoreRules: [
      {
        ruleId: "color-contrast-enhanced",
        description:
          "Ensures the contrast between foreground and background colors meets WCAG 2 AAA enhanced contrast ratio thresholds",
        help: "Elements must meet enhanced color contrast ratio thresholds",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.9/color-contrast-enhanced?application=axeAPI",
        tags: ["cat.color", "wcag2aaa", "wcag146", "ACT"],
        actIds: ["09o5cg"],
      },
    ],
  },
  {
    ref_id: "1.4.10",
    title: "Reflow",
    description:
      "Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for:",
    url: "https://www.w3.org/TR/WCAG22/#reflow",
    level: "AA",
    automatedIssues: 0,
    manualIssues: 1181,
    percentageOfTotalIssues: 0.4,
  },
];

it("should sort by ref id", () => {
  expect(sortByRefId(testCriteria)).toEqual([
    testCriteria[0],
    testCriteria[1],
    testCriteria[2],
  ]);
});

it("should sort by level", () => {
  expect(sortByLevel(testCriteria)).toEqual([
    testCriteria[0],
    testCriteria[2],
    testCriteria[1],
  ]);
});

it("should sort by most common", () => {
  expect(sortByMostCommon(testCriteria)).toEqual([
    testCriteria[0],
    testCriteria[2],
    testCriteria[1],
  ]);
});

it("should sort by automated tests", () => {
  expect(sortByAutomatedTests(testCriteria)).toEqual([
    testCriteria[0],
    testCriteria[1],
    testCriteria[2],
  ]);
});
