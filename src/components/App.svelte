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
          selectedLevels: saved.selectedLevels,
          sortKey: saved.sortKey,
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
    void loadCriteria();
    return unsubscribe;
  });

  async function loadCriteria() {
    try {
      const response = await fetch("/api/wcag.json");
      if (!response.ok) throw new Error("Unable to load criteria");
      $criteria = await response.json();
      $criteriaLoadState = "ready";
    } catch {
      $criteriaLoadState = "error";
    }
  }
</script>

<header>
  <h1 class="text-lg font-bold">WCAG 2.2 Success Criteria</h1>

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
