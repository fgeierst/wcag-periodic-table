<script lang="ts">
  import Badges from "./Badges.svelte";
  import type { SuccessCriteria } from "../wcag";
  import { criterionPath } from "../utils/criterion-url";
  export let criterion: SuccessCriteria;
</script>

<a
  href={criterionPath(criterion.title)}
  aria-label={`${criterion.ref_id} ${criterion.title}`}
  class="card relative flex aspect-square flex-col justify-between overflow-hidden rounded p-1 text-left hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
>
  <div class="line-clamp-3">{criterion.ref_id} {criterion.title}</div>
  <Badges {criterion} small></Badges>
</a>

<style>
  .card {
    background-color: var(--background-color, #f0f0f0);
  }
</style>
