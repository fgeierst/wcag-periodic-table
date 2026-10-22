<script lang="ts">
  import Badges from "./Badges.svelte";
  import type { SuccessCriteria } from "../wcag";
  import { criterionPath } from "../utils/criterion-url";
  export let criterion: SuccessCriteria;
</script>

<div
  class="card relative flex aspect-square flex-col justify-between overflow-hidden rounded p-1 text-left"
>
  <a href={criterionPath(criterion.title, criterion.version)} class="title">
    <span class="line-clamp-3">{criterion.ref_id} {criterion.title}</span>
  </a>
  <Badges {criterion} small></Badges>
</div>

<style>
  .card {
    background-color: var(--background-color, #f0f0f0);
  }

  .title::after {
    content: "";
    position: absolute;
    inset: 0;
    cursor: pointer;
  }

  .card:hover .title {
    text-decoration: underline;
  }

  .title:focus-visible {
    outline: none;
  }

  .card:has(.title:focus-visible) {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
</style>
