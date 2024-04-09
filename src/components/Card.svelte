<script lang="ts">
  import Badges from "./Badges.svelte";
  import Details from "./Details.svelte";
  import type { SuccessCriteria } from "../wcag";
  export let criterion: SuccessCriteria;
</script>

<div
  class="card relative flex aspect-square flex-col justify-between overflow-hidden rounded p-1"
>
  <Details {criterion}></Details>
  <Badges {criterion} small></Badges>
</div>

<style>
  .card {
    background-color: var(--background-color, #f0f0f0);
  }
</style>
