<script lang="ts">
  import { SortKey } from "../utils/sorting.ts";
  import { options } from "../stores.ts";
  import Search from "./Search.svelte";
</script>

<div class="my-3 flex flex-row flex-wrap items-center gap-x-5 gap-y-3">
  <Search />
  <fieldset class="inline-block border-0 p-0 align-middle">
    <legend class="float-left mr-2">Levels</legend>
    <div class="inline-flex items-center gap-1">
      {#each ["A", "AA", "AAA"] as level}
        <label class="inline-flex items-center gap-1">
          <input
            type="checkbox"
            bind:group={$options.selectedLevels}
            value={level}
          />
          {level}
        </label>
      {/each}
    </div>
  </fieldset>

  <div>
    <label for="sort">Sort by</label>
    <select id="sort" bind:value={$options.sortKey} class="border">
      {#each Object.values(SortKey) as sortKey}
        <option value={sortKey}>{sortKey}</option>
      {/each}
    </select>
  </div>
</div>
