<script lang="ts">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import Filter from "./Filter.svelte";
  import Card from "./Card.svelte";
  import Status from "./Status.svelte";
  import {
    criteria,
    selectedCriteria,
    criteriaLoadState,
    options,
    searchQuery,
  } from "../stores.ts";
  import { SortKey } from "../utils/sorting.ts";
  import type { WcagVersion } from "../wcag";

  onMount(function () {
    const storageKey = "wcag-table-state";
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null");
      if (
        saved &&
        typeof saved.query === "string" &&
        Array.isArray(saved.selectedLevels) &&
        saved.selectedLevels.every((level: unknown) =>
          ["A", "AA", "AAA"].includes(String(level)),
        ) &&
        Object.values(SortKey).includes(saved.sortKey)
      ) {
        $options = {
          ...$options,
          selectedLevels: saved.selectedLevels,
          sortKey: saved.sortKey,
          selectedVersion: ["2.0", "2.1", "2.2"].includes(saved.selectedVersion)
            ? saved.selectedVersion
            : "2.2",
          onlyAdded:
            saved.onlyAdded === true && saved.selectedVersion !== "2.0",
        };
        $searchQuery = saved.query;
      }
    } catch {
      // Storage may be unavailable or contain stale data; use the defaults.
    }
    const unsubscribe = derived(
      [options, searchQuery],
      ([$options, query]) => ({
        ...$options,
        query,
      }),
    ).subscribe((state) => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // Browsing and search still work when storage is unavailable.
      }
    });
    let loadedVersion: WcagVersion | undefined;
    const unsubscribeVersion = options.subscribe(({ selectedVersion }) => {
      if (selectedVersion !== loadedVersion) {
        loadedVersion = selectedVersion;
        void loadCriteria(selectedVersion);
      }
    });
    return () => {
      unsubscribe();
      unsubscribeVersion();
      requestId++;
    };
  });

  let requestId = 0;
  async function loadCriteria(version: WcagVersion) {
    const currentRequest = ++requestId;
    $criteria = [];
    $criteriaLoadState = "loading";
    try {
      const response = await fetch(
        version === "2.2" ? "/api/wcag.json" : `/api/wcag/${version}.json`,
      );
      if (!response.ok) throw new Error("Unable to load criteria");
      const data = await response.json();
      if (currentRequest !== requestId) return;
      $criteria = data;
      $criteriaLoadState = "ready";
    } catch {
      if (currentRequest !== requestId) return;
      $criteriaLoadState = "error";
    }
  }
</script>

<header>
  <h1 class="text-lg font-bold">
    WCAG {$options.selectedVersion} Success Criteria
  </h1>

  <Filter />
  <Status />
</header>

<main>
  <ul class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
    {#each $selectedCriteria as criterion (criterion.ref_id)}
      <li
        class="rounded focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-current focus-within:outline-solid"
      >
        <Card
          {criterion}
          --background-color={criterion.level === "A"
            ? "#E9ECE9"
            : criterion.level === "AA"
              ? "#DBDBE6"
              : criterion.level === "AAA"
                ? "#C8D9E4"
                : ""}
        />
      </li>
    {/each}
  </ul>
</main>
