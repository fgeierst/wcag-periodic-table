<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { fade } from "svelte/transition";
  import { cn } from "$lib/utils.js";

  type $$Props = DialogPrimitive.OverlayProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DialogPrimitive.Overlay {...$$restProps}>
  {#snippet child({ props, open })}
    <div
      {...props}
      class={cn("backdrop-blur-xs fixed inset-0 z-50 bg-background/80", className)}
      transition:fade={{ duration: open ? 120 : 80 }}
    />
  {/snippet}
</DialogPrimitive.Overlay>
