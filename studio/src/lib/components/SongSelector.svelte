<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { LibrarySong } from '$lib/types/LibrarySong';

	export let songLibrary: LibrarySong[];
	export let selectedValue: string;

	let open = false;

	let value = '';

	const library = songLibrary.reduce((acc: any, song) => {
		acc[song.id.toLowerCase()] = song.title;
		return acc;
	}, {});
	$: selectedValueName = library[value.toLowerCase()] ?? '';
	$: selectedValue = value;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
		>
			<span class="text-ellipsis block w-full whitespace-nowrap overflow-hidden">
				{selectedValueName}
			</span>
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full p-0 md:w-[200px] lg:w-[300px]">
		<Command.Root
			filter={(value, search) => {
				if (String(library[value.toLowerCase()]).toLowerCase().includes(search)) return 1;
				return 0;
			}}
		>
			<Command.Input placeholder="Search songs..." />
			<Command.List>
				<Command.Empty>No songs found.</Command.Empty>
				<Command.Group heading="Examples">
					{#each songLibrary as song}
						<Command.Item
							value={song.id}
							class="aria-selected:bg-primary aria-selected:text-primary-foreground text-ellipsis group flex space-x-3 justify-between"
							onSelect={(currentValue) => {
								value = currentValue;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							<div class="flex flex-col w-full">
								<span class="text-left w-full">
									{song.title}
								</span>
								<span
									class="text-muted-foreground group-hover:text-muted group-aria-selected:text-muted text-xs truncate max-w-52"
								>
									{song.artist}
								</span>
							</div>
							<Check
								class={cn('ml-auto h-4 w-4', value === song.id ? 'opacity-100' : 'opacity-0')}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
