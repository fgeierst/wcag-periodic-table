<script lang="ts">
  import type { SuccessCriteria } from "../wcag";
  import { Badge } from "$lib/components/ui/badge";

  export let criterion: SuccessCriteria;
  import { Button } from "$lib/components/ui/button";

  $: roundedPercentage = Math.floor(criterion.percentageOfTotalIssues ?? 0);
</script>

<article class="space-y-6 [overflow-wrap:anywhere]">
  <header class="space-y-3">
    <h1 class="text-lg font-bold">
      <a
        href="/"
        class="underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >WCAG 2.2</a
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

  <section aria-labelledby="references-heading" class="space-y-3">
    <h2 id="references-heading" class="font-bold">References</h2>
    <a
      href={criterion.url}
      class="inline-block underline focus-visible:outline-2 focus-visible:outline-offset-2"
      >WCAG 2.2 specification</a
    >
    {#if criterion.references?.length}
      <div class="flex flex-wrap gap-2">
        {#each criterion.references as reference}
          <Button variant="outline" href={reference.url}>
            {reference.title.replace(/[\d.]+/g, "").trim()}
          </Button>
        {/each}
      </div>
    {/if}
  </section>
</article>
