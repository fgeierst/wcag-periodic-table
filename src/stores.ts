import type { SuccessCriteria } from "./wcag";
import { writable, derived } from "svelte/store";
import { sortCritaria, SortKey } from "./utils/sorting";

interface Options {
  sortKey: SortKey;
  selectedLevels: string[];
}

export const options = writable({
  sortKey: SortKey.LEVEL,
  selectedLevels: ["A", "AA"],
} as Options);

export const criteria = writable([] as SuccessCriteria[]);

export const selectedCriteria = derived(
  [criteria, options],
  ([$criteria, $options]) => {
    const filteredCriteria = $options.selectedLevels
      ? $criteria.filter((criterion) =>
          $options.selectedLevels.includes(criterion.level),
        )
      : $criteria;
    return sortCritaria(filteredCriteria, $options.sortKey);
  },
);
