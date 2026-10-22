<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import type { SuccessCriteria } from "../wcag";

  export let criterion: SuccessCriteria;

  $: roundedPercentage = Math.floor(criterion.percentageOfTotalIssues ?? 0);
  $: version = criterion.version ?? "2.2";
</script>

<article class="space-y-6 [overflow-wrap:anywhere]">
  <header class="space-y-3">
    <h1 class="text-lg font-bold">
      <a
        href="/"
        class="underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >WCAG {version}</a
      >
      /
      {criterion.ref_id}
      {criterion.title}
    </h1>
    <div class="flex flex-wrap gap-1">
      {#if roundedPercentage > 0}
        <Badge
          variant="outline"
          title="Percentage of total issues in the Deque 2021 audit results"
        >
          {roundedPercentage}%
        </Badge>
      {/if}
      <Badge variant="outline">{criterion.level}</Badge>
    </div>
  </header>

  {#if criterion.content}
    <div class="wcag-content space-y-3">
      <!-- Trusted, repository-reviewed W3C snapshot HTML; never user-supplied content. -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html criterion.content}
    </div>
  {:else}
    <div class="space-y-3">
      <p>{criterion.description}</p>
      {#if criterion.special_cases?.length}
        <ul class="list-outside list-disc space-y-2 pl-5">
          {#each criterion.special_cases as specialCase}
            <li>
              <span class="font-semibold">{specialCase.title}</span
              >{#if specialCase.description}: {specialCase.description}{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  <section aria-labelledby="references-heading" class="space-y-3">
    <h2 id="references-heading" class="font-bold">References</h2>
    <ul class="list-outside list-disc space-y-2 pl-5">
      <li>
        <a
          href={criterion.url}
          class="underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >WCAG {version} specification</a
        >
      </li>
      {#each criterion.references ?? [] as reference}
        <li>
          <a
            href={reference.url}
            class="underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {reference.title.replace(/[\d.]+/g, "").trim()}
          </a>
        </li>
      {/each}
    </ul>
  </section>

  {#if criterion.axeCoreRules?.length}
    <section aria-labelledby="axe-rules-heading">
      <h2 id="axe-rules-heading" class="mb-3 font-bold">
        {#if criterion.axeCoreRules.length > 1}
          axe-core Rules ({criterion.axeCoreRules.length})
        {:else}
          axe-core Rule
        {/if}
      </h2>
      <ul class="list-outside list-disc space-y-2 pl-5">
        {#each criterion.axeCoreRules as rule}
          <li>
            <a
              href={rule.helpUrl}
              class="text-gray-600 underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >{rule.ruleId}</a
            >
            <span>{rule.description}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if criterion.actRules?.length}
    <section aria-labelledby="act-rules-heading">
      <h2 id="act-rules-heading" class="mb-3 font-bold">
        {#if criterion.actRules.length > 1}
          ACT Rules ({criterion.actRules.length})
        {:else}
          ACT Rule
        {/if}
      </h2>
      <ul class="list-outside list-disc space-y-2 pl-5">
        {#each criterion.actRules as rule}
          <li>
            <a
              href={rule.rulePage}
              class="text-gray-600 underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >{rule.ruleId}</a
            >
            <span>{rule.ruleName}</span>
            {#if rule.status !== "approved"}
              <span class="text-gray-600">
                ({rule.status === "proposed" ? "Proposed" : "Deprecated"})
              </span>
            {/if}
            <p>{rule.description}</p>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</article>

<style>
  .wcag-content :global(a) {
    text-decoration: underline;
  }
  .wcag-content :global(a:focus-visible) {
    outline: 2px solid;
    outline-offset: 2px;
  }
  .wcag-content :global(dt),
  .wcag-content :global(.note-title) {
    font-weight: 600;
  }
  .wcag-content :global(dd) {
    margin-bottom: 0.75rem;
  }
  .wcag-content :global(ul) {
    list-style: disc outside;
    padding-left: 1.25rem;
  }
  .wcag-content :global(li + li),
  .wcag-content :global(.note),
  .wcag-content :global(p + p) {
    margin-top: 0.75rem;
  }
</style>
