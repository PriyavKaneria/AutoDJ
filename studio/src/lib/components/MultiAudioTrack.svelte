<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
	import ZoomPlugin from 'wavesurfer.js/plugins/zoom';
	import MultiTrack from 'wavesurfer-multitrack';
	import { MicVocal, Pause, Play, StepBack, StepForward } from 'lucide-svelte';
	import type { TrackCue } from '$lib/types';
	import Button from './ui/button/button.svelte';
	import * as Select from './ui/select';
	import { lyrics } from '$lib/utils';

	export let maxTracks: number = 5;
	export let analyzeSong: (trackIndex: number) => void;
	export let multitrack: MultiTrack;
	export let scrollX = 0;
	export let trackCues: TrackCue[] = [];
	export let globalMultitrackTime: number;

	let waveformContainer: HTMLDivElement;

	$: loadingSong = false;
	$: isPlaying = false;

	let currentTimeSpan: HTMLSpanElement;
	let lyricsButton: HTMLDivElement;

	const initTrackConfigs = Array.from({ length: maxTracks }, (_, id) => ({ id, startPosition: 0 }));
	let lyricsButtons: HTMLDivElement[] = Array.from({ length: maxTracks });
	let lyricsSelections: {
		label: string;
		value: string;
	}[] = Array.from({ length: maxTracks });

	const loadSong = async (
		trackIndex: number,
		_songURL: string,
		trackStartFrom: number = 0,
		trackCueFrom: number = 0
	) => {
		const src = _songURL;
		const blob = await fetch(src).then((resp) => resp.blob());
		const blobURL = URL.createObjectURL(blob);
		const audioElement = new Audio(blobURL);
		audioElement.preload = 'metadata';
		audioElement.addEventListener('loadeddata', function () {
			trackCues[trackIndex].duration = audioElement.duration;
			analyzeSong(trackIndex);
		});
		trackCues[trackIndex].audioElement = audioElement;

		console.log('Loading song', _songURL, 'at', trackStartFrom, 'with cue from', trackCueFrom);

		multitrack.addTrack({
			id: trackIndex,
			startPosition: trackStartFrom, // where the track position should start from
			startCue: trackCueFrom, // where the track should start playing from
			// draggable: true,
			options: {
				media: audioElement,
				backend: 'MediaElement',
				waveColor: '#ed738e',
				progressColor: '#e11d48',
				barWidth: 3,
				barGap: 3,
				barRadius: 3,
				barHeight: 0.8,
				// dragToSeek: true,
				splitChannels: [
					{
						height: 100
					},
					{
						height: 0
					}
				],
				plugins: [
					Hover.create({
						labelSize: 16,
						lineColor: 'black',
						lineWidth: 1
					}),
					// ZoomPlugin.create({
					// 	deltaThreshold: 0,
					// 	maxZoom: 100
					// }),
					TimelinePlugin.create({
						primaryLabelInterval: 30,
						secondaryLabelInterval: 5
					})
				]
			}
		});

		// add the lyrics button
		// create copy of the lyrics button and append it to the waveform container
		if (trackIndex < lyricsButtons.length) {
			const lyricsButton = lyricsButtons[trackIndex];
			lyricsButton.style.display = 'block';
			lyricsButton.style.top = `${50 + trackIndex * 120}px`;
			waveformContainer.appendChild(lyricsButton);
		}

		loadingSong = false;
	};

	onMount(() => {
		multitrack = MultiTrack.create(initTrackConfigs, {
			container: waveformContainer,
			cursorColor: '#000',
			cursorWidth: 1,
			rightButtonDrag: true,
			trackBackground: '#fff',
			trackBorderColor: '#000',
			minPxPerSec: 10,
			// dragBounds: true,
			timelineOptions: {
				// height: 0
			}
		});

		// Set sinkId
		multitrack.once('canplay', async () => {
			await multitrack.setSinkId('');
			console.log('Set sinkId to default');
			//  hide the second track
			if (multitrack.wavesurfers.length > 1) {
				for (let i = 1; i < multitrack.wavesurfers.length; i++) {
					multitrack.wavesurfers[i].renderer.parent.style.display = 'none';
				}
			}
		});

		// listen to space key to play/pause the track
		window.addEventListener('keydown', (event) => {
			if (event.code === 'Space') {
				event.preventDefault();
				isPlaying = !isPlaying;
			}
		});

		if (waveformContainer) {
			waveformContainer.childNodes[0].addEventListener('scroll', (event) => {
				scrollX = (event.target as HTMLDivElement).scrollLeft;
				// console.log('Scrolling', scrollX);
			});
		}

		return () => {
			multitrack.destroy();
			loadingSong = false;
		};
	});

	export const loadNextSong = async (trackIndex: number) => {
		console.log('Loading next song', trackIndex, 'from', trackCues.length, 'tracks');

		if (!trackCues.length || trackIndex >= trackCues.length || !multitrack) return;

		// show the second track
		if (multitrack.wavesurfers.length > trackIndex) {
			multitrack.wavesurfers[trackIndex].renderer.parent.style.display = 'block';
		}

		const nextTrackData = trackCues[trackIndex];
		await loadSong(trackIndex, nextTrackData.url, nextTrackData?.startFrom, nextTrackData?.cueFrom);
	};

	$: globalMultitrackTime &&
		currentTimeSpan &&
		(() => {
			currentTimeSpan.innerText = new Date(globalMultitrackTime * 1000).toISOString().substr(14, 5);
		})();

	$: isPlaying && multitrack && multitrack.play();
	$: !isPlaying && multitrack && multitrack.pause();
</script>

<div class="flex flex-col items-start w-full mb-4 relative">
	{#if loadingSong}
		<div class="flex-grow h-32 flex overflow-hidden items-center border border-dashed border-muted">
			<LottiePlayer
				src={'/audio_wave_loader.json'}
				autoplay={true}
				loop={true}
				controls={false}
				background="transparent"
				renderer="svg"
			/>
		</div>
	{/if}
	<!-- Audio Controls -->
	<div class="flex justify-start w-full space-x-3">
		<div
			class="flex items-center bg-gray-200 rounded-t-lg space-x-3 px-3 border border-dashed border-muted-foreground border-b-0"
		>
			<button
				class="flex items-center justify-center w-8 h-8 rounded-full p-1.5"
				on:click={() => multitrack.setTime(multitrack.getCurrentTime() - 5)}
			>
				<StepBack class="w-8 h-8 text-zinc-700 fill-zinc-700" />
			</button>
			<button
				class="flex items-center justify-center w-8 h-8 rounded-full p-1.5"
				on:click={() => {
					if (multitrack.isPlaying()) {
						isPlaying = false;
					} else {
						isPlaying = true;
					}
				}}
			>
				{#if isPlaying}
					<Pause class="w-8 h-8 text-zinc-700 fill-zinc-700" />
				{:else}
					<Play class="w-8 h-8 text-zinc-700 fill-zinc-700" />
				{/if}
			</button>
			<button
				class="flex items-center justify-center w-8 h-8 rounded-full p-1.5"
				on:click={() => multitrack.setTime(multitrack.getCurrentTime() + 5)}
			>
				<StepForward class="w-8 h-8 text-zinc-700 fill-zinc-700" />
			</button>
		</div>
		<span class="text-2xl p-1 rounded-tr-lg font-mono" id="cursor-time" bind:this={currentTimeSpan}>
			00:00
		</span>
	</div>
	<div id="timeline" class="w-full" />
	<div
		class="flex-grow w-full bg-muted border border-dashed border-muted-foreground track"
		bind:this={waveformContainer}
	/>
	<!-- hidden lyrics button elements -->
	{#each initTrackConfigs as trackConfig}
		<div class="hidden absolute top-10 -right-12" bind:this={lyricsButtons[trackConfig.id]}>
			<Select.Root
				bind:selected={lyricsSelections[trackConfig.id]}
				onSelectedChange={async () => {
					await tick();
					// show selected lyrics
				}}
			>
				<Select.Trigger class="w-min p-0">
					<Button class="p-2 bg-primary rounded-lg">
						<MicVocal class="w-5 h-5 text-primary-foreground" />
					</Button>
				</Select.Trigger>
				<Select.Content side="right" sameWidth={false}>
					{#each lyrics.slice(0, 3) as lrc}
						<Select.Item class="w-auto" value={lrc.id}>
							{lrc.trackName} - {lrc.albumName}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	{/each}
</div>

<style lang="postcss">
	.track {
		/* scrollbar-width: none; */
		scroll-behavior: auto;
	}
</style>
