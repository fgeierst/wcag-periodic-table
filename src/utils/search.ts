import type { SuccessCriteria, WcagVersion } from "../wcag";
import { sortCritaria, SortKey } from "./sorting";

export interface CriterionSearchResult {
  query: string;
  selectedLevels: string[];
  sortKey: SortKey;
  selectedVersion: WcagVersion;
  onlyAdded: boolean;
  visibleCount: number;
  excludedByLevelCount: number;
  criteria: SuccessCriteria[];
}

export function matchesCriterion(
  criterion: SuccessCriteria,
  query: string,
): boolean {
  const text = [
    criterion.ref_id,
    criterion.title,
    criterion.description,
    ...(criterion.special_cases ?? []).flatMap((item) => [
      item.title,
      item.description,
    ]),
    ...(criterion.axeCoreRules ?? []).map(
      (rule: { description?: string }) => rule.description,
    ),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .every((token) => text.includes(token));
}

export function searchCriteria(
  items: SuccessCriteria[],
  query: string,
  levels: string[],
  sortKey: SortKey,
  selectedVersion: WcagVersion = "2.2",
  onlyAdded = false,
): CriterionSearchResult {
  const addedOnly = onlyAdded && selectedVersion !== "2.0";
  const normalizedQuery = query.trim().replace(/\s+/g, " ");
  const matches = items.filter(
    (criterion) =>
      (!criterion.versions || criterion.versions.includes(selectedVersion)) &&
      (!addedOnly || criterion.versions?.[0] === selectedVersion) &&
      matchesCriterion(criterion, normalizedQuery),
  );
  const visible = matches.filter((criterion) =>
    levels.includes(criterion.level),
  );
  return {
    query: normalizedQuery,
    selectedLevels: [...levels],
    sortKey,
    selectedVersion,
    onlyAdded: addedOnly,
    visibleCount: visible.length,
    excludedByLevelCount: matches.length - visible.length,
    criteria: sortCritaria(visible, sortKey),
  };
}
