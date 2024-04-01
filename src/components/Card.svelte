<script lang="ts">
  import Badges from "./Badges.svelte";
  import Details from "./Details.svelte";
  import type { SuccessCriteria } from "../wcag";
  export let criterion: SuccessCriteria;
  export let backgroundColor: string = "#f0f0f0";
</script>

<div
  class="card relative flex aspect-square flex-col justify-between overflow-hidden rounded p-1"
  style:background-color={backgroundColor}
>
  <Details {criterion}></Details>
  <Badges {criterion} small></Badges>
</div>
