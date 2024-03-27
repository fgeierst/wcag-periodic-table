<script lang="ts">
  import type { SuccessCriteria } from "../../types/wcag";
  import { onMount } from "svelte";
  import { sortCritaria, SortKey } from "../utils/sorting.ts";
  import Card from "./Card.svelte";

  let criteria: Array<SuccessCriteria> = [];
  let filteredCriteria: Array<SuccessCriteria> = [];
  let sortedCriteria: Array<SuccessCriteria> = [];
  let level = "";
  let sortKey: SortKey;

  onMount(async function () {
    const response = await fetch("/api/wcag.json");
    criteria = await response.json();
  });

  $: filteredCriteria = level
    ? criteria.filter((criterion) => criterion.level === level)
    : criteria;

  $: sortedCriteria = sortCritaria(filteredCriteria, sortKey);
</script>

<h1 class="text-lg font-bold">Success Criteria ({filteredCriteria.length})</h1>

<div class="my-3">
  <label for="level">Level </label>
  <select id="level" bind:value={level} class="border">
    <option value="" selected>All</option>
    <option value="A">A</option>
    <option value="AA">AA</option>
    <option value="AAA">AAA</option>
  </select>

  <label for="sort">Sort by </label>
  <select id="sort" bind:value={sortKey} class="border">
    <option value="id" selected>Id</option>
    <option value="level">Level</option>
    <option value="mostcommon">Most common issues</option>
  </select>
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
