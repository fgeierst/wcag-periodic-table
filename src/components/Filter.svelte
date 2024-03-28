<script lang="ts">
  import { SortKey } from "../utils/sorting.ts";
  import { options } from "../stores.ts";
</script>

<div class="my-3 flex gap-x-5 gap-y-1 gap flex-row flex-wrap">
  <div>
    <span id="levelsLabel">Levels</span>
    <span role="group" aria-labelledby="levelsLabel">
      {#each ["A", "AA", "AAA"] as level}
        <label>
          <input
            type="checkbox"
            bind:group={$options.selectedLevels}
            value={level}
          />
          {level}
        </label>
      {/each}
    </span>
  </div>

  <div>
    <label for="sort">Sort by</label>
    <select id="sort" bind:value={$options.sortKey} class="border">
      {#each Object.values(SortKey) as sortKey}
        <option value={sortKey}>{sortKey}</option>
      {/each}
    </select>
  </div>
</div>
