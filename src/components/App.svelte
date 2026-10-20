<script lang="ts">
  import { onMount } from "svelte";
  import Filter from "./Filter.svelte";
  import Card from "./Card.svelte";
  import Status from "./Status.svelte";
  import { criteria, selectedCriteria, criteriaLoadState } from "../stores.ts";
  import { flip } from "svelte/animate";
  import { quadInOut } from "svelte/easing";

  let reducedMotion = false;

  onMount(async function () {
    reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    try {
      const response = await fetch("/api/wcag.json");
      if (!response.ok) throw new Error("Unable to load criteria");
      $criteria = await response.json();
      $criteriaLoadState = "ready";
    } catch {
      $criteriaLoadState = "error";
    }
  });
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
        animate:flip={{
          duration: reducedMotion ? 0 : 600,
          easing: quadInOut,
        }}
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
