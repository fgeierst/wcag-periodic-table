<script lang="ts">
  import type { SuccessCriteria } from "../wcag";
  import Badges from "./Badges.svelte";
  export let criterion: SuccessCriteria;
  import * as Dialog from "$lib/components/ui/dialog";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<Dialog.Root>
  <Dialog.Trigger class="text-left">
    <div class="line-clamp-3">
      {criterion.ref_id}
      {criterion.title}
    </div>
  </Dialog.Trigger>
  <Dialog.Content class="gap-0">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2 p-6">
        {criterion.ref_id}
        <a href={criterion.url} class="underline">{criterion.title}</a>
        <Badges {criterion}></Badges>
      </Dialog.Title>
    </Dialog.Header>

    <ScrollArea class="max-h-[70vh]  border-t p-6">
      <div class="flex flex-col gap-6">
        <Dialog.Description>
          <p>{criterion.description}</p>
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
      <!-- <Dialog.Footer></Dialog.Footer> -->
    </ScrollArea>
  </Dialog.Content>
</Dialog.Root>
