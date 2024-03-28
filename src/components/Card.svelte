<script lang="ts">
  import type { SuccessCriteria } from "../../types/wcag";
  import Robot from "./icons/Robot.svelte";
  export let criterion: SuccessCriteria;
  export let backgroundColor: string = "#f0f0f0";
</script>

<div
  class="card relative focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black"
  style:background-color={backgroundColor}
>
  <a
    href={criterion.url}
    class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
  >
    <span class="ref-id">{criterion.ref_id}</span>
    {criterion.title}
  </a>
  {#if criterion.axeCoreRules}
    <div class="absolute bottom-1 right-1">
      <Robot alt="Has automated tests" />
    </div>
  {/if}
  {#if criterion.percentageOfTotalIssues ?? 0 > 0}
    <div>{criterion.percentageOfTotalIssues}%</div>
    <div
      class="percentage-bar"
      style:width={`${criterion.percentageOfTotalIssues}%`}
    ></div>
  {/if}
</div>

<style>
  .card {
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
  }

  .percentage-bar {
    height: 0.3rem;
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>
