<script lang="ts">
  import type { SuccessCriteria } from "../../types/wcag";
  export let criterion: SuccessCriteria;
  export let backgroundColor: string = "#f0f0f0";
  import RobotIcon from "./icons/Robot.svelte";
</script>

<div class="card relative" style:background-color={backgroundColor}>
  <a href={criterion.url} class="absolute inset-0 after:content-['']">
    <span class="ref-id">{criterion.ref_id}</span>
    {criterion.title}
  </a>
  {#if criterion.axeCoreRules}
    <div class="absolute bottom-1 right-1">
      <RobotIcon alt="Has automated tests" />
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
    position: relative;
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
