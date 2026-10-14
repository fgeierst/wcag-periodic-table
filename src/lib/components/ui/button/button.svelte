<script lang="ts">
	import { type Props, buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";

	type $$Props = Props;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export { className as class };
</script>

{#if $$restProps.href}
	<a
		href={$$restProps.href}
		class={cn(buttonVariants({ variant, size, className }))}
		{...$$restProps}
	>
		<slot />
	</a>
{:else}
	<button
		class={cn(buttonVariants({ variant, size, className }))}
		type="button"
		{...$$restProps}
		on:click
		on:keydown
	>
		<slot />
	</button>
{/if}
