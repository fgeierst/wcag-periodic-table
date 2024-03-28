<script lang="ts">
  import { onMount } from "svelte";
  import Filter from "./Filter.svelte";
  import Card from "./Card.svelte";
  import { criteria, selectedCriteria } from "../stores.ts";
  import { quadInOut } from "svelte/easing";
  import { flip } from "svelte/animate";

  let reducedMotion = false;

  onMount(async function () {
    const response = await fetch("/api/wcag.json");
    $criteria = await response.json();
    reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  });
</script>

<h1 class="text-lg font-bold">
  WCAG 2.2 Success Criteria ({$selectedCriteria.length})
</h1>

<Filter />

<div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
  {#each $selectedCriteria as criterion (criterion.ref_id)}
    <div
      animate:flip={{
        duration: reducedMotion ? 0 : 600,
        easing: quadInOut,
      }}
    >
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
    </div>
  {/each}
</div>
