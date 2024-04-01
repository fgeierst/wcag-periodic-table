<script lang="ts">
  import type { SuccessCriteria } from "../wcag";
  import { Badge } from "$lib/components/ui/badge";

  export let criterion: SuccessCriteria;
  export let small: boolean = false;

  let className = `border-black ${small ? "px-1 py-0" : ""} `;

  $: roundedPercentage = Math.floor(criterion.percentageOfTotalIssues ?? 0);
</script>

<div class=" flex flex-wrap-reverse justify-end gap-1">
  {#if roundedPercentage ?? 0 > 0}
    <Badge variant="outline" class={className}>
      {roundedPercentage}%
    </Badge>
  {/if}
  {#if criterion.axeCoreRules}
    <Badge variant="outline" class={className}>axe</Badge>
  {/if}
  <Badge variant="outline" class={className}>{criterion.level}</Badge>
</div>
