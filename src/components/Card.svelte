<script lang="ts">
  import type { SuccessCriteria } from "../wcag";
  import { Badge } from "$lib/components/ui/badge";
  export let criterion: SuccessCriteria;
  export let backgroundColor: string = "#f0f0f0";
  import * as Dialog from "$lib/components/ui/dialog";

  $: roundedPercentage = Math.floor(criterion.percentageOfTotalIssues ?? 0);
</script>

<div
  class="card relative flex aspect-square flex-col justify-between overflow-hidden rounded p-1"
  style:background-color={backgroundColor}
>
  <!-- <a href={criterion.url} class="line-clamp-3">
    <span class="ref-id">{criterion.ref_id}</span>
    {criterion.title}
  </a> -->

  <Dialog.Root>
    <Dialog.Trigger class="text-left">
      <div class="line-clamp-3">
        {criterion.ref_id}
        {criterion.title}
      </div>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>
          {criterion.ref_id}
          {criterion.title}
          <Badge variant="outline" class="border-black px-1 py-0">
            {criterion.level}
          </Badge>
        </Dialog.Title>
        <Dialog.Description>
          <p>{criterion.description}</p>
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>

  <!-- Badges -->
  <div class=" flex flex-wrap-reverse justify-end gap-1">
    {#if roundedPercentage ?? 0 > 0}
      <Badge variant="outline" class="border-black px-1 py-0">
        {roundedPercentage}%
      </Badge>
    {/if}
    {#if criterion.axeCoreRules}
      <Badge variant="outline" class="border-black px-1 py-0">Axe</Badge>
    {/if}
    <Badge variant="outline" class="border-black px-1 py-0"
      >{criterion.level}</Badge
    >
  </div>
</div>
