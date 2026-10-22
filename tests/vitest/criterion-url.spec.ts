import { expect, it } from "vitest";
import { criterionPath } from "../../src/utils/criterion-url";
import { getCriteria } from "../../src/data/criteria";

it.each([
  ["Non-text Content", "/criteria/non-text-content/"],
  ["Keyboard (No Exception)", "/criteria/keyboard-no-exception/"],
  ["Name, Role, Value", "/criteria/name-role-value/"],
  ["Contrast (Minimum)", "/criteria/contrast-minimum/"],
])("uses the criterion name in the URL for %s", (title, expected) => {
  expect(criterionPath(title)).toBe(expected);
});

it("gives every criterion a unique name-based URL", () => {
  const paths = getCriteria().map((criterion) =>
    criterionPath(criterion.title),
  );
  expect(new Set(paths).size).toBe(87);
  expect(
    paths.every((path) => /^\/criteria\/[a-z]+(?:-[a-z]+)*\/$/.test(path)),
  ).toBe(true);
});
