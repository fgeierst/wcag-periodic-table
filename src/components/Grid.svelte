<script lang="ts">
  import { onMount } from "svelte";
  import { SortKey } from "../utils/sorting.ts";
  import Card from "./Card.svelte";
  import { criteria, options, selectedCriteria } from "../stores.ts";

  onMount(async function () {
    const response = await fetch("/api/wcag.json");
    $criteria = await response.json();
  });
</script>

<h1 class="text-lg font-bold">
  WCAG 2.2 Success Criteria ({$selectedCriteria.length})
</h1>

<div class="my-3 flex gap-x-5 gap-y-1 gap flex-row flex-wrap">
  <div>
    <span id="levelsLabel">Levels</span>
    <span role="group" aria-labelledby="levelsLabel">
      {#each ["A", "AA", "AAA"] as level}
        <label>
          <input
            type="checkbox"
            bind:group={$options.selectedLevels}
            value={level}
          />
          {level}
        </label>
      {/each}
    </span>
  </div>

  <div>
    <label for="sort">Sort by</label>
    <select id="sort" bind:value={$options.sortKey} class="border">
      {#each Object.values(SortKey) as sortKey}
        <option value={sortKey}>{sortKey}</option>
      {/each}
    </select>
  </div>
</div>

<div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
  {#each $selectedCriteria as criterion}
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
