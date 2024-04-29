<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Actions, Save, Share } from '$lib/components/navbar';
	import SongSelector from '$lib/components/SongSelector.svelte';
	import type { PageData } from './$types';
	import type { LibrarySong } from '$lib/types/LibrarySong';
	import AudioTrack from '$lib/components/AudioTrack.svelte';
	import { enhance } from '$app/forms';
	import { json, type ActionResult } from '@sveltejs/kit';

	let baseSong = '';
	$: selectedSong = '';

	$: songData = (data.songLibrary.find((song) => song.id === baseSong) || {}) as LibrarySong;
	$: formLoading = false;

	$: songURL = '';

	function handleForm(result: ActionResult) {
		if (result.type === 'success' && result.data) {
			if (result.data.songURL) {
				songURL = result.data.songURL;
			}
		}
	}

	export let data: PageData;
</script>

<div class="hidden h-full flex-col md:flex">
	<div
		class="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16"
	>
		<h2 class="text-lg font-semibold text-nowrap">AI DJ</h2>
		<div class="ml-auto flex w-full space-x-2 sm:justify-end">
			<Save />
			<div class="hidden space-x-2 md:flex">
				<Share />
			</div>
			<Actions />
		</div>
	</div>
	<Separator />
	<div class="container h-full py-6">
		<div class="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
			<div class="hidden flex-col space-y-4 sm:flex md:order-2">
				<div class="grid gap-2">
					<span
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Audio settings
					</span>
					<span class="text-xs text-muted-foreground">Coming soon</span>
				</div>
			</div>
			<div class="md:order-1">
				<div class="flex h-full flex-col space-y-4">
					{#if baseSong == ''}
						<!-- Search song from library -->
						<span class="text-sm font-medium leading-none">
							Select a base song from the library
						</span>
						{#if data.songLibrary.length === 0}
							<span class="text-xs text-muted-foreground">No songs found.</span>
						{:else}
							<div class="flex items-center space-x-2">
								<SongSelector songLibrary={data.songLibrary} bind:selectedValue={selectedSong} />
								<form
									method="post"
									action="?/getSongURL"
									use:enhance={() => {
										formLoading = true;
										return async ({ update, result }) => {
											update();
											handleForm(result);
											baseSong = selectedSong;
											formLoading = false;
										};
									}}
								>
									<input type="hidden" name="songId" value={selectedSong} />
									<Button type="submit">Load</Button>
								</form>
							</div>
						{/if}
					{/if}
					{#if baseSong != '' && !formLoading}
						<!-- Display base song -->
						<span class="text-md font-medium leading-none">Song - {songData.name}</span>
						<div class="flex items-center space-x-2">
							<AudioTrack {songData} {songURL} />
							<Button on:click={() => (baseSong = '')}>Change</Button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
