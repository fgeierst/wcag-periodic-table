<script lang="ts">
  import type { SuccessCriteria } from "../wcag";
  import { Badge } from "$lib/components/ui/badge";

  export let criterion: SuccessCriteria;
  import * as Dialog from "$lib/components/ui/dialog";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  import { Button } from "$lib/components/ui/button";

  $: roundedPercentage = Math.floor(criterion.percentageOfTotalIssues ?? 0);
</script>

<Dialog.Root>
  <Dialog.Trigger class="text-left">
    <div class="line-clamp-3">
      {criterion.ref_id}
      {criterion.title}
    </div>
  </Dialog.Trigger>
  <Dialog.Content class="gap-0">
    <Dialog.Header class="pr-6">
      <Dialog.Title class="flex items-center gap-2 px-6 py-4">
        <span>
          {criterion.ref_id}
          <a href={criterion.url} class="underline">{criterion.title}</a>
        </span>
        <div class="flex gap-1">
          {#if roundedPercentage ?? 0 > 0}
            <Badge variant="outline">
              {roundedPercentage}%
            </Badge>
          {/if}

          <Badge variant="outline">{criterion.level}</Badge>
        </div>
      </Dialog.Title>
    </Dialog.Header>

    <ScrollArea class="max-h-[70vh] border-t px-6">
      <div class="flex flex-col gap-6 py-3">
        <Dialog.Description>
          <p class="pb-2">{criterion.description}</p>
          {#if criterion.special_cases}
            <ul class="list-outside list-disc pl-5">
              {#each criterion.special_cases as specialCase}
                <li class="pb-1">
                  {specialCase.title}: {specialCase.description}
                </li>
              {/each}
            </ul>
          {/if}
        </Dialog.Description>
        {#if criterion.axeCoreRules}
          <div>
            <h3 class="mb-3 font-bold">
              {#if criterion.axeCoreRules.length > 1}
                axe-core Rules ({criterion.axeCoreRules.length})
              {:else}
                axe-core Rule
              {/if}
            </h3>
            <ul class="list-outside list-disc pl-5">
              {#each criterion.axeCoreRules as rule}
                <li class="pb-1">
                  <a href={rule.helpUrl} class="text-gray-600 underline"
                    >{rule.ruleId}</a
                  >
                  <span>{rule.description}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    </ScrollArea>
    <Dialog.Footer class="flex gap-2 border-t px-6 py-3">
      {#each criterion.references as reference}
        <Button variant="outline" href={reference.url} class="h-8">
          {reference.title.replace(/[\d.]+/g, "")}
        </Button>
      {/each}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
