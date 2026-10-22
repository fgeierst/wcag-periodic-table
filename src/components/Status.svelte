<script lang="ts">
  import { criteriaLoadState, searchResult } from "../stores";
</script>

<p role="status" class="mb-3 [overflow-wrap:anywhere]">
  {#if $criteriaLoadState === "loading"}
    Loading WCAG criteria…
  {:else if $criteriaLoadState === "error"}
    WCAG criteria could not be loaded.
  {:else}
    {$searchResult.visibleCount} criteria{#if $searchResult.query}
      &nbsp;matching "{$searchResult.query}"{/if}.
    {#if $searchResult.excludedByLevelCount}
      {$searchResult.excludedByLevelCount} more hidden by level filters.
    {/if}
    {#if !$searchResult.visibleCount}
      Try another keyword or change the level filters.
    {/if}
  {/if}
</p>
