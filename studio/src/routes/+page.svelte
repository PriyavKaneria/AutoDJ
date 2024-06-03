<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Actions, Save, Share } from '$lib/components/navbar';
	import SongSelector from '$lib/components/SongSelector.svelte';
	import type { PageData } from './$types';
	import type { LibrarySong, AudioFeatures, RecommendedSong } from '$lib/types';
	import MultiAudioTrack from '$lib/components/MultiAudioTrack.svelte';
	import DynamicBracket from '$lib/components/DynamicBracket.svelte';
	import { enhance } from '$app/forms';
	import { type ActionResult } from '@sveltejs/kit';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
	import type MultiTrack from 'wavesurfer-multitrack';
	import { goto, invalidateAll } from '$app/navigation';

	let baseSong = '';
	$: selectedSong = '';

	$: songData = (data.songLibrary.find((song) => song.id === baseSong) || {}) as LibrarySong;
	$: nextSongData = (data.songLibrary.find((song) => song.id === nextSongURL) || {}) as LibrarySong;
	$: formLoading = false;

	$: songURL = '';
	$: analyzingSong = false;

	const handleSongURL = (result: ActionResult) => {
		if (result.type === 'success' && result.data) {
			if (result.data.songURL) {
				songURL = result.data.songURL;
			}
		}
	};

	let analyzeFormButton: HTMLButtonElement;

	const analyzeSong = async () => {
		analyzeFormButton.click();
		analyzingSong = true;
	};

	$: audioFeatures = {} as AudioFeatures;
	// let wavesurfer: WaveSurfer;
	// let nextWaveSurfer: WaveSurfer;
	let multitrack: MultiTrack;
	let baseAudioElement: HTMLAudioElement;
	$: baseAudioCurrentTime = 0;
	let wsRegions: RegionsPlugin;

	const loadSegmentMarkers = () => {
		if (!analyzingSong && audioFeatures) {
			wsRegions = multitrack.wavesurfers[0].registerPlugin(RegionsPlugin.create());
			audioFeatures.segments_boundaries.forEach((boundary) => {
				wsRegions.addRegion({
					start: boundary,
					color: 'black',
					drag: false,
					resize: false
				});
			});
			wsRegions.on('region-clicked', (region, e) => {
				e.stopPropagation();
				// region.play();
				multitrack.setTime(region.start);
				currentSegmentEnd = region.start;
			});
			if (baseAudioElement) {
				baseAudioElement.addEventListener('timeupdate', () => {
					const currentTime = multitrack.getCurrentTime();
					baseAudioCurrentTime = currentTime;
					const currentSegment =
						audioFeatures.segments_boundaries.find((boundary) => {
							return currentTime < boundary;
						}) || 0;
					if (currentSegmentEnd !== currentSegment) {
						currentSegmentEnd = currentSegment;
					}
				});
			}
		}
	};

	const handleSongSegments = (result: ActionResult) => {
		if (result.type === 'success' && result.data) {
			if (result.data.audioFeatures) {
				// setTimeout(() => {
				analyzingSong = false;
				audioFeatures = result?.data?.audioFeatures;
				loadSegmentMarkers();
				// }, 2000);
			}
		}
	};

	let fetchRecommendationsButton: HTMLButtonElement;
	$: currentSegmentEnd = 0;
	$: trackWidth = 0;
	$: scrollX = 0;
	$: fetchingRecommendations = false;

	$: if (currentSegmentEnd !== 0) {
		fetchRecommendationsButton.click();
		fetchingRecommendations = true;
	}

	let zoom = 10; // minPxPerSec

	$: segmentProgress = ((currentSegmentEnd * zoom - scrollX) / trackWidth) * 100 || 0;
	$: console.log(segmentProgress, scrollX, trackWidth, currentSegmentEnd);

	let nextBestSongs: RecommendedSong[] = [];

	const handleSongRecommendation = (result: ActionResult) => {
		if (result.type === 'success' && result.data) {
			if (result.data.nextBestSongs) {
				nextBestSongs = result.data.nextBestSongs;
				fetchingRecommendations = false;
			}
		}
	};

	$: nextSongURL = '';

	const handleNextSong = (result: ActionResult) => {
		if (result.type === 'success' && result.data) {
			if (result.data.songURL) {
				console.log(result.data.songURL);
				nextSongURL = result.data.songURL;
			}
		}
	};

	export let data: PageData;
</script>

<div class="hidden h-full flex-col md:flex">
	<div
		class="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16"
	>
		<h2 class="text-lg font-semibold text-nowrap">AutoDJ</h2>
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
		<!-- <div class="hidden flex-col space-y-4 sm:flex md:order-2">
				<div class="grid gap-2">
					<span
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Audio settings
					</span>

					<span class="text-xs text-muted-foreground">Coming soon</span>
				</div>
			</div> -->
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
										// update();
										handleSongURL(result);
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
					<span class="text-sm text-gray-400">Youtube link : {songData.url}</span>
					<div class="flex flex-col items-center space-y-2">
						<div class="w-full" bind:clientWidth={trackWidth}>
							{#if baseSong != ''}
								<Button
									class=""
									on:click={async () => {
										baseSong = '';
										await invalidateAll();
									}}>Change base song</Button
								>
							{/if}
							<!-- <AudioTrack {songData} {songURL} {analyzeSong} bind:wavesurfer /> -->
							<MultiAudioTrack
								{songData}
								{songURL}
								{analyzeSong}
								bind:multitrack
								bind:audioElement={baseAudioElement}
								bind:scrollX
							/>
						</div>
						<!-- {#if nextSongURL != ''}
								<div class="w-full">
									<AudioTrack
										songData={nextSongData}
										songURL={nextSongURL}
										analyzeSong={() => {}}
										bind:wavesurfer={nextWaveSurfer}
									/>
								</div>
							{/if} -->
					</div>
					<form
						method="post"
						action="?/analyzeSong"
						class="hidden"
						use:enhance={() => {
							return async ({ update, result }) => {
								handleSongSegments(result);
							};
						}}
					>
						<input type="hidden" name="songId" value={baseSong} />
						<button type="submit" class="hidden" bind:this={analyzeFormButton}>Analyze</button>
					</form>
					<form
						method="post"
						action="?/getNextBestSongs"
						class="hidden"
						use:enhance={() => {
							return async ({ update, result }) => {
								handleSongRecommendation(result);
							};
						}}
					>
						<input name="songId" class="hidden" value={baseSong} />
						<input name="currentSegmentEnd" class="hidden" value={currentSegmentEnd} />
						<button type="submit" class="hidden" bind:this={fetchRecommendationsButton}>
							Fetch Recommendations
						</button>
					</form>
					<div class="relative flex flex-col">
						{#if analyzingSong || fetchingRecommendations}
							<div class="w-full absolute h-full flex backdrop-blur-sm">
								<div class="flex items-center justify-center space-x-2 h-48 overflow-hidden">
									<LottiePlayer
										src={'/audio_wave_loader.json'}
										autoplay={true}
										loop={true}
										controls={false}
										background="transparent"
										renderer="svg"
									/>
									<span
										class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-secondary-foreground"
									>
										{analyzingSong ? 'Analyzing song...' : 'Fetching recommendations...'}
									</span>
								</div>
							</div>
						{/if}
						{#if nextBestSongs.length !== 0}
							<div class="flex flex-col space-y-2">
								<DynamicBracket progress={segmentProgress} />
							</div>
						{/if}
						<ul role="list" class="space-y-1">
							{#each nextBestSongs as song, index}
								<li class="overflow-hidden rounded-md bg-white px-6 py-3 shadow cursor-pointer">
									<form
										method="post"
										action="?/getSongURL"
										use:enhance={() => {
											nextSongURL = '';
											return async ({ update, result }) => {
												handleNextSong(result);
											};
										}}
									>
										<button type="submit">
											<div class="min-w-0 flex-auto">
												<div class="flex items-center gap-x-3">
													<div class="flex-none rounded-full p-1 text-rose-400 bg-rose-400/10">
														<div class="h-2 w-2 rounded-full bg-current"></div>
													</div>
													<h2 class="min-w-0 text-sm font-semibold leading-6 text-black">
														<span class="truncate">{index + 1}. {song.name}</span>
														<input class="hidden" type="text" name="songId" value={song.id} />
													</h2>
												</div>
												<div
													class="mt-1 flex items-center gap-x-2.5 text-xs leading-5 text-gray-700"
												>
													<p class="truncate">Artist</p>
													<svg viewBox="0 0 2 2" class="h-0.5 w-0.5 flex-none fill-gray-300">
														<circle cx="1" cy="1" r="1" />
													</svg>
													<p class="whitespace-nowrap">
														<!-- trim everythig after the word seconds -->
														Starting from {song.start_timestamp.split('seconds')[0]} seconds
														<input
															class="hidden"
															type="text"
															name="startFrom"
															value={song.start_milliseconds}
														/>
													</p>
												</div>
											</div>
										</button>
									</form>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
