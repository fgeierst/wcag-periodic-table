<script lang="ts">
  import { onMount } from "svelte";
  import Card from "./Card.svelte";
  type Criterion = {
    ref_id: number;
    title: string;
    level: string;
    description: string;
    url: string;
  };
  let criteria: Array<Criterion> = [];
  let filteredCriteria: Array<Criterion> = [];
  let level = "";

  onMount(async function () {
    const response = await fetch("/api/wcag.json");
    criteria = await response.json();
  });

  $: filteredCriteria = level
    ? criteria.filter((criterion) => criterion.level === level)
    : criteria;
</script>

<h2>Success Criteria ({filteredCriteria.length})</h2>

<div class="filter">
  <label for="level">Level </label>
  <select id="level" bind:value={level}>
    <option value="">All</option>
    <option value="A">A</option>
    <option value="AA">AA</option>
    <option value="AAA">AAA</option>
  </select>
</div>

<div class="grid">
  {#each filteredCriteria as criterion}
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

<style>
  .filter {
    margin-block: 1rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: 0.7rem;
  }
</style>
