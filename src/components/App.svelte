<script lang="ts">
  import { onMount } from "svelte";
  import Filter from "./Filter.svelte";
  import Card from "./Card.svelte";
  import { criteria, selectedCriteria } from "../stores.ts";
  import { flip } from "svelte/animate";
  import { quadInOut } from "svelte/easing";

  let reducedMotion = false;

  onMount(async function () {
    const response = await fetch("/api/wcag.json");
    $criteria = await response.json();
    reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  });
</script>

<header>
  <h1 class="text-lg font-bold">
    WCAG 2.2 Success Criteria ({$selectedCriteria.length})
  </h1>

  <Filter />
</header>

<main>
  <ul class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
    {#each $selectedCriteria as criterion (criterion.ref_id)}
      <li
        animate:flip={{
          duration: reducedMotion ? 0 : 600,
          easing: quadInOut,
        }}
      >
        <Card
          {criterion}
          backgroundColor={criterion.level === "A"
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
