<script lang="ts">
  import type { SuccessCriteria } from "../../types/wcag";
  import { onMount } from "svelte";
  import Card from "./Card.svelte";

  let criteria: Array<SuccessCriteria> = [];
  let filteredCriteria: Array<SuccessCriteria> = [];
  let sortedCriteria: Array<SuccessCriteria> = [];
  let level = "";
  let sort = "id";

  onMount(async function () {
    const response = await fetch("/api/wcag.json");
    criteria = await response.json();
  });

  $: filteredCriteria = level
    ? criteria.filter((criterion) => criterion.level === level)
    : criteria;

  $: sortedCriteria = [...filteredCriteria].sort((a, b) => {
    if (sort === "id") {
      return Number(a.ref_id) - Number(b.ref_id);
    } else {
      return b.percentageOfTotalIssues - a.percentageOfTotalIssues;
    }
  });
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
  <select id="sort" bind:value={sort} class="border">
    <option value="id" selected>Id</option>
    <option value="percentage">Most common issues</option>
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
