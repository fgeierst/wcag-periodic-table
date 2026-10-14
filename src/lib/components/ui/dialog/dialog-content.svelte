<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { X } from "@lucide/svelte";
  import * as Dialog from "./index.js";
  import { cn, flyAndScale } from "$lib/utils.js";

  type $$Props = DialogPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<Dialog.Portal>
  <Dialog.Overlay />
  <DialogPrimitive.Content {...$$restProps}>
    {#snippet child({ props, open })}
      <div
        {...props}
        class={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg sm:rounded-lg md:w-full",
          className,
        )}
        transition:flyAndScale={{ duration: open ? 150 : 100 }}
      >
        <slot />
        <DialogPrimitive.Close
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
    {/snippet}
  </DialogPrimitive.Content>
</Dialog.Portal>
