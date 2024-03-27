<script lang="ts">
  import type { SuccessCriteria } from "../../types/wcag";
  import { onMount } from "svelte";
  import { sortCritaria, SortKey } from "../utils/sorting.ts";
  import Card from "./Card.svelte";

  let criteria: Array<SuccessCriteria> = [];
  let filteredCriteria: Array<SuccessCriteria> = [];
  let sortedCriteria: Array<SuccessCriteria> = [];
  let selectedLevels: Array<string> = ["A", "AA"];
  let sortKey: SortKey;

  onMount(async function () {
    const response = await fetch("/api/wcag.json");
    criteria = await response.json();
  });

  $: filteredCriteria = selectedLevels
    ? criteria.filter((criterion) => selectedLevels.includes(criterion.level))
    : criteria;

  $: sortedCriteria = sortCritaria(filteredCriteria, sortKey);
</script>

<h1 class="text-lg font-bold">
  WCAG 2.2 Success Criteria ({filteredCriteria.length})
</h1>

<div class="my-3 flex gap-x-5 gap-y-1 gap flex-row flex-wrap">
  <div>
    <span id="levelsLabel">Levels</span>
    <span role="group" aria-labelledby="levelsLabel">
      {#each ["A", "AA", "AAA"] as level}
        <label>
          <input type="checkbox" bind:group={selectedLevels} value={level} />
          {level}
        </label>
      {/each}
    </span>
  </div>

  <div>
    <label for="sort">Sort by</label>
    <select id="sort" bind:value={sortKey} class="border">
      {#each Object.values(SortKey) as sortKey}
        <option value={sortKey}>{sortKey}</option>
      {/each}
    </select>
  </div>
</div>

<div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
  {#each sortedCriteria as criterion}
    <Card
      {criterion}
      backgroundColor={criterion.level === "A"
        ? "lightgreen"
        : criterion.level === "AA"
          ? "yellow"
          : criterion.level === "AAA"
            ? "pink"
            : ""}
    />
  {/each}
</div>
