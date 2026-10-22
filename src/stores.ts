import type { SuccessCriteria, WcagVersion } from "./wcag";
import { writable, derived } from "svelte/store";
import { SortKey } from "./utils/sorting";
import { searchCriteria } from "./utils/search";

interface Options {
  sortKey: SortKey;
  selectedLevels: string[];
  selectedVersion: WcagVersion;
  onlyAdded: boolean;
}

export const options = writable({
  sortKey: SortKey.LEVEL,
  selectedLevels: ["A", "AA"],
  selectedVersion: "2.2",
  onlyAdded: false,
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
      $options.selectedVersion,
      $options.onlyAdded,
    ),
);

export const selectedCriteria = derived(
  searchResult,
  ($result) => $result.criteria,
);
