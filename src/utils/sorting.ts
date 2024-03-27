import type { SuccessCriteria } from "../../types/wcag";

export enum SortKey {
  LEVEL = "Level",
  ID = "Id",
  MOSTCOMMON = "Most common issues",
  AUTOMATEDTESTS = "Has automated tests",
}

export function sortCritaria(items: Array<SuccessCriteria>, sortKey: SortKey) {
  if (sortKey === SortKey.LEVEL) {
    return sortByLevel(items);
  }
  if (sortKey === SortKey.MOSTCOMMON) {
    return sortByMostCommon(items);
  }
  if (sortKey === SortKey.AUTOMATEDTESTS) {
    return sortByAutomatedTests(items);
  }
  return sortByRefId(items);
}

export function sortByRefId(items: Array<SuccessCriteria>) {
  return [...items].sort((a, b) => {
    return Number(a.ref_id) - Number(b.ref_id);
  });
}

export function sortByLevel(items: Array<SuccessCriteria>) {
  const levelRank: { [key: string]: number } = {
    AAA: 3,
    AA: 2,
    A: 1,
  };

  return [...items].sort((a, b) => {
    const rankA = levelRank[a.level] || 0;
    const rankB = levelRank[b.level] || 0;
    return rankA - rankB;
  });
}

export function sortByMostCommon(items: Array<SuccessCriteria>) {
  return [...items].sort((a, b) => {
    if (
      a.percentageOfTotalIssues === undefined ||
      b.percentageOfTotalIssues === undefined
    ) {
      return 0;
    }
    return b.percentageOfTotalIssues - a.percentageOfTotalIssues;
  });
}

export function sortByAutomatedTests(items: Array<SuccessCriteria>) {
  return [...items].sort((a, b) => {
    return b.axeCoreRules?.length || 0 - a.axeCoreRules?.length || 0;
  });
}
