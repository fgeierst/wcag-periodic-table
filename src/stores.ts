import type { SuccessCriteria } from "./wcag";
import { writable, derived } from "svelte/store";
import { SortKey } from "./utils/sorting";
import { searchCriteria } from "./utils/search";

interface Options {
  sortKey: SortKey;
  selectedLevels: string[];
}

export const options = writable({
  sortKey: SortKey.LEVEL,
  selectedLevels: ["A", "AA"],
} as Options);

export const criteria = writable([] as SuccessCriteria[]);
export const searchQuery = writable("");
export const criteriaLoadState = writable<"loading" | "ready" | "error">(
  "loading",
);

export const searchResult = derived(
  [criteria, options, searchQuery],
  ([$criteria, $options, $searchQuery]) =>
    searchCriteria(
      $criteria,
      $searchQuery,
      $options.selectedLevels,
      $options.sortKey,
    ),
);

export const selectedCriteria = derived(
  searchResult,
  ($result) => $result.criteria,
);
