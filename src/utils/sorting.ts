import type { SuccessCriteria } from "../../types/wcag";

export enum SortKey {
  LEVEL = "level",
  MOSTCOMMON = "mostcommon",
  ID = "id",
}

export function sortCritaria(items: Array<SuccessCriteria>, sortKey: SortKey) {
  if (sortKey === SortKey.LEVEL) {
    return sortByLevel(items);
  }
  if (sortKey === SortKey.MOSTCOMMON) {
    return sortByMostCommon(items);
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
