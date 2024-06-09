<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Actions, Save, Share } from '$lib/components/navbar';
	import SongSelector from '$lib/components/SongSelector.svelte';
	import type { PageData } from './$types';
	import type { LibrarySong, AudioFeatures, RecommendedSong, TrackCue } from '$lib/types';
	import MultiAudioTrack from '$lib/components/MultiAudioTrack.svelte';
	import { enhance } from '$app/forms';
	import { type ActionResult } from '@sveltejs/kit';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
	import EnvelopePlugin from 'wavesurfer.js/dist/plugins/envelope.js';
	import type MultiTrack from 'wavesurfer-multitrack';
	import { invalidateAll } from '$app/navigation';
	import { tick } from 'svelte';
	import RecommendationBox from './RecommendationBox.svelte';

	$: tracks = [] as LibrarySong[];
	$: trackCues = [] as TrackCue[];
	$: selectedBaseSong = '';
	$: baseSongData = (data.songLibrary.find((song) => song.id === selectedBaseSong) ||
		{}) as LibrarySong;

	const getSongData = (songId: string) => {
		return data.songLibrary.find((song) => song.id === songId) || ({} as LibrarySong);
	};

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
	let analyzeSongTrackIndex = 0;
	$: analyzeSongId = tracks.length ? tracks[analyzeSongTrackIndex]?.id : ''; // songId for analyzing the analyzeSongTrackIndex track
	$: lastTrackSongId = tracks.length ? tracks[tracks.length - 1]?.id : ''; // songId for fetching recommendations for the last track

	const analyzeSong = async (trackIndex: number) => {
		if (!analyzeFormButton) return;
		// set songId for correct track
		analyzeSongTrackIndex = trackIndex;
		console.log('Analyzing song', trackIndex);
		await tick();
		analyzeFormButton.click();
		analyzingSong = true;
	};

	$: audioFeatures = {} as AudioFeatures;
	// let wavesurfer: WaveSurfer;
	// let nextWaveSurfer: WaveSurfer;
	let multitrack: MultiTrack;
	let wsRegions: RegionsPlugin;
	let wsEnvelopes: EnvelopePlugin[] = [];
	let multiAudioTrackComponent: MultiAudioTrack;
	let prevAudioElementEventAbortController: AbortController;

	const loadSegmentMarkers = (trackIndex: number) => {
		if (!analyzingSong && audioFeatures) {
			wsRegions = multitrack.wavesurfers[trackIndex].registerPlugin(RegionsPlugin.create());
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
			});

			const timeUpdateListener = () => {
				const currentTime = multitrack.wavesurfers[trackIndex].getCurrentTime();
				const currentSegment =
					audioFeatures.segments_boundaries.find((boundary) => {
						return currentTime < boundary;
					}) || 0;
				if (currentSegmentEnd !== currentSegment) {
					currentSegmentEnd = currentSegment;
					console.log('Current segment end', currentSegmentEnd);
				}
			};

			if (trackIndex > 0) {
				// remove event listener from previous track
				const prevAudioElement = trackCues[trackIndex - 1].audioElement;
				if (prevAudioElement) {
					console.log(prevAudioElement.ontimeupdate);
					prevAudioElementEventAbortController.abort(); // this genius works
				}
				console.log('Removed timeupdate listener from track', trackIndex - 1);
				console.log(prevAudioElement);
			}
			if (trackIndex < trackCues.length) {
				// add event listener to current track
				const audioElement = trackCues[trackIndex].audioElement;
				if (audioElement) {
					prevAudioElementEventAbortController = new AbortController();
					audioElement.addEventListener('timeupdate', timeUpdateListener, {
						signal: prevAudioElementEventAbortController.signal
					});
				}
			}
		}
	};

	const loadEnvelope = (trackIndex: number) => {
		if (wsEnvelopes.length > trackIndex && wsEnvelopes[trackIndex]) {
			wsEnvelopes[trackIndex].destroy();
		}
		if (multitrack.wavesurfers.length <= trackIndex) {
			console.log(`Track ${trackIndex} not found for envelope plugin`);
			return;
		}
		// disable direct interaction
		// multitrack.wavesurfers[trackIndex].setDisabledEventEmissions(['interaction']);
		const _envelope: EnvelopePlugin = multitrack.wavesurfers[trackIndex].registerPlugin(
			EnvelopePlugin.create({
				// options
				lineColor: 'rgba(255, 0, 0, 0.6)',
				lineWidth: '4',
				dragPointSize: window.innerWidth < 600 ? 20 : 10,
				dragPointFill: 'rgba(255, 255, 255, 0.8)',
				dragPointStroke: 'rgba(255, 0, 87, 0.8)',
				dragLine: true
			})
		);
		_envelope.addPoint({
			time: 0,
			volume: 1
		});
		_envelope.addPoint({
			time: multitrack.wavesurfers[trackIndex].getDuration(),
			volume: 1
		});
		if (wsEnvelopes.length <= trackIndex) {
			wsEnvelopes.push(_envelope);
		} else {
			wsEnvelopes[trackIndex] = _envelope;
		}
		console.log('Envelope loaded for track', trackIndex);

		// set envelope points for mixing tracks
		if (trackIndex > 0) {
			const prevEnvelope = wsEnvelopes[trackIndex - 1];
			// clear all points after the current segment end
			prevEnvelope.getPoints().map((point) => {
				if (point.time > currentSegmentEnd) {
					prevEnvelope.removePoint(point);
				}
			});
			// set the fade out points for the previous track
			prevEnvelope.addPoint({
				time: currentSegmentEnd - 1,
				volume: 1
			});
			prevEnvelope.addPoint({
				time: currentSegmentEnd + 1,
				volume: 0
			});
			const currentEnvelope = wsEnvelopes[trackIndex];

			const nextTrackData = trackCues[trackIndex];

			// clear all points before the current segment end
			// because the current segment end of the previous track is aligned with next track data start from
			const currentSegmentEquivalentForNextTrack = nextTrackData.cueFrom + 1;
			currentEnvelope.getPoints().map((point) => {
				if (point.time < currentSegmentEquivalentForNextTrack) {
					currentEnvelope.removePoint(point);
				}
			});
			// set the fade in points for the current track
			currentEnvelope.addPoint({
				time: currentSegmentEquivalentForNextTrack - 1,
				volume: 0
			});
			currentEnvelope.addPoint({
				time: currentSegmentEquivalentForNextTrack + 1,
				volume: 1
			});
		}
	};

	const handleSongSegments = (result: ActionResult) => {
		if (result.type === 'success' && result.data) {
			if (result.data.audioFeatures) {
				// setTimeout(() => {
				analyzingSong = false;
				audioFeatures = result?.data?.audioFeatures;
				loadSegmentMarkers(analyzeSongTrackIndex);
				loadEnvelope(analyzeSongTrackIndex);
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
	// $: console.log(segmentProgress, scrollX, trackWidth, currentSegmentEnd);

	let nextBestSongs: RecommendedSong[] = [];

	const handleSongRecommendation = (result: ActionResult) => {
		if (result.type === 'success' && result.data) {
			if (result.data.nextBestSongs) {
				nextBestSongs = result.data.nextBestSongs;
				fetchingRecommendations = false;
			}
		}
	};

	const nextSongSelectedEvent = async (trackIndex: number) => {
		multitrack.pause();
		await tick();
		await multiAudioTrackComponent.loadNextSong(trackIndex);
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
				{#if tracks.length == 0}
					<!-- Search song from library -->
					<span class="text-sm font-medium leading-none">
						Select a base song from the library
					</span>
					{#if data.songLibrary.length === 0}
						<span class="text-xs text-muted-foreground">No songs found.</span>
					{:else}
						<div class="flex items-center space-x-2">
							<SongSelector songLibrary={data.songLibrary} bind:selectedValue={selectedBaseSong} />
							<form
								method="post"
								action="?/getSongURL"
								use:enhance={() => {
									formLoading = true;
									return async ({ update, result }) => {
										// update();
										handleSongURL(result);
										await tick();
										tracks = [...tracks, baseSongData];
										trackCues = [
											...trackCues,
											{
												url: songURL,
												startFrom: 0,
												cueFrom: 0
											}
										];
										console.log(tracks, trackCues);
										await tick();

										await multiAudioTrackComponent.loadNextSong(0);
										formLoading = false;
									};
								}}
							>
								<input type="hidden" name="songId" value={selectedBaseSong} />
								<Button type="submit">Load</Button>
							</form>
						</div>
					{/if}
				{/if}
				<!-- {#if tracks.length != 0 && !formLoading} -->
				<div hidden={formLoading || !tracks.length}>
					<!-- Display base song -->
					<span class="text-md font-medium leading-none">Song - {baseSongData.name}</span>
					<span class="text-sm text-gray-400">Youtube link : {baseSongData.url}</span>
					<div class="flex flex-col items-center space-y-2">
						<div class="w-full" bind:clientWidth={trackWidth}>
							{#if tracks.length != 0}
								<a href="/" data-sveltekit-reload>
									<Button class="">Change base song</Button>
								</a>
							{/if}
							<MultiAudioTrack
								{analyzeSong}
								bind:trackCues
								bind:multitrack
								bind:scrollX
								bind:this={multiAudioTrackComponent}
							/>
						</div>
					</div>
					<!-- analyzeSong -->
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
						<input type="hidden" name="songId" value={analyzeSongId} />
						<button type="submit" class="hidden" bind:this={analyzeFormButton}>Analyze</button>
					</form>
					<!-- getNextBestSongs -->
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
						<input name="songId" class="hidden" value={lastTrackSongId} />
						<input name="currentSegmentEnd" class="hidden" value={currentSegmentEnd} />
						<button type="submit" class="hidden" bind:this={fetchRecommendationsButton}>
							Fetch Recommendations
						</button>
					</form>
					<!-- Loader for fetching next best songs -->
					{#if analyzingSong}
						<div class="w-full absolute h-full flex backdrop-blur-sm z-10 min-h-96">
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
									Analyzing song...
								</span>
							</div>
						</div>
					{/if}
					<div class="relative flex flex-col w-full z-0">
						{#if nextBestSongs.length !== 0}
							<RecommendationBox
								bind:tracks
								bind:trackCues
								bind:nextBestSongs
								{fetchingRecommendations}
								{segmentProgress}
								{analyzeSongTrackIndex}
								{getSongData}
								{currentSegmentEnd}
								{nextSongSelectedEvent}
							/>
						{/if}
					</div>
					<!-- {/if} -->
				</div>
			</div>
		</div>
	</div>
</div>
