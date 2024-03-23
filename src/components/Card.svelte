<script lang="ts">
  import type { SuccessCriteria } from "../../types/wcag";
  export let criterion: SuccessCriteria;
  export let backgroundColor: string = "#f0f0f0";
</script>

<div class="card" style:background-color={backgroundColor}>
  <div class="ref-id">{criterion.ref_id}</div>
  <h3>
    <a href={criterion.url} target="_blank">
      {criterion.title}
    </a>
  </h3>
  {#if criterion.percentageOfTotalIssues > 0}
    <div>{criterion.percentageOfTotalIssues}%</div>
    <div
      class="percentage-bar"
      style:width={`${criterion.percentageOfTotalIssues}%`}
    ></div>
  {/if}
  <!-- <div>{criterion.level}</div> -->
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

  h3 {
    margin: 0;
    font-weight: normal;
    font-size: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }

  .ref-id {
    font-size: 0.8rem;
    margin-block-end: 0.3rem;
  }

  .percentage-bar {
    height: 0.3rem;
    background-color: black;
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>
