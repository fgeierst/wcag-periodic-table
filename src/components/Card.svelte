<script lang="ts">
  import type { SuccessCriteria } from "../wcag";
  import { Badge } from "$lib/components/ui/badge";
  export let criterion: SuccessCriteria;
  export let backgroundColor: string = "#f0f0f0";

  $: roundedPercentage = Math.floor(criterion.percentageOfTotalIssues ?? 0);
</script>

<div
  class="card relative flex aspect-square flex-col justify-between overflow-hidden rounded p-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black"
  style:background-color={backgroundColor}
>
  <a
    href={criterion.url}
    class="line-clamp-3 after:absolute after:inset-0 after:content-[''] focus:outline-none"
  >
    <span class="ref-id">{criterion.ref_id}</span>
    {criterion.title}
  </a>

  <!-- Badges -->
  <div class=" flex flex-wrap-reverse justify-end gap-1">
    {#if roundedPercentage ?? 0 > 0}
      <Badge variant="outline" class="border-black px-1 py-0">
        {roundedPercentage}%
      </Badge>
    {/if}
    {#if criterion.axeCoreRules}
      <Badge variant="outline" class="border-black px-1 py-0">
        <!-- <Robo alt="Has automated tests" /> -->
        Axe
      </Badge>
    {/if}
    <Badge variant="outline" class="border-black px-1 py-0"
      >{criterion.level}</Badge
    >
  </div>

  <!-- Percentage bar -->
  <!-- {#if roundedPercentage ?? 0 > 0}
    <div class="percentage-bar" style:width={`${roundedPercentage}%`}></div>
  {/if} -->
</div>

<style>
  /* .card {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    aspect-ratio: 1;
    overflow: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  } */

  .percentage-bar {
    height: 0.3rem;
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>
