<script lang="ts">
  import { get } from "svelte/store";
  import { criteriaLoadState, searchQuery, searchResult } from "../stores";
  import type { CriterionSearchResult } from "../utils/search";

  type ToolSubmitEvent = SubmitEvent & {
    agentInvoked?: boolean;
    respondWith?: (response: Promise<CriterionSearchResult>) => void;
  };

  function submit(event: ToolSubmitEvent) {
    event.preventDefault();
    if ($criteriaLoadState !== "ready") return;
    const form = event.currentTarget as HTMLFormElement;
    $searchQuery = String(new FormData(form).get("query") ?? "");
    if (event.agentInvoked && typeof event.respondWith === "function") {
      event.respondWith(Promise.resolve(get(searchResult)));
    }
  }
</script>

<form
  aria-labelledby="criteria-search"
  class="flex max-w-full min-w-0 items-center gap-2"
  toolname={$criteriaLoadState === "ready" ? "search_wcag_criteria" : undefined}
  tooldescription={$criteriaLoadState === "ready"
    ? "Search WCAG criterion references by literal keywords, title, or ID. Every word must match criterion text or related axe-core rule descriptions. Updates visible cards using current level filters and sort order; reports matches hidden by level filters. Returns references, not a diagnosis or conformance verdict. Submit an empty query to remove the search without resetting filters."
    : undefined}
  toolautosubmit={$criteriaLoadState === "ready" ? true : undefined}
  on:submit={submit}
>
  <label for="criteria-search" class="shrink-0">Search criteria</label>
  <input
    id="criteria-search"
    type="search"
    name="query"
    class="w-64 min-w-0 rounded border border-gray-500 bg-transparent px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2"
  />
  <button
    type="submit"
    disabled={$criteriaLoadState !== "ready"}
    class="shrink-0 rounded border border-gray-500 px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
    >Search</button
  >
</form>
