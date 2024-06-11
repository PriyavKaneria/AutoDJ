<script lang="ts">
	import { onMount } from 'svelte';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
	import ZoomPlugin from 'wavesurfer.js/plugins/zoom';
	import MultiTrack from 'wavesurfer-multitrack';
	import { Pause, Play, StepBack, StepForward } from 'lucide-svelte';
	import type { TrackCue } from '$lib/types';

	export let analyzeSong: (trackIndex: number) => void;
	export let multitrack: MultiTrack;
	export let scrollX = 0;
	export let trackCues: TrackCue[] = [];

	let waveformContainer: HTMLDivElement;

	$: loadingSong = false;

	$: isPlaying = multitrack && multitrack.isPlaying();
	let currentTimeSpan: HTMLSpanElement;

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

		loadingSong = false;
	};

	onMount(() => {
		multitrack = MultiTrack.create(
			[
				{
					id: 0,
					startPosition: 0
				},
				{
					id: 1,
					startPosition: 0
				},
				{
					id: 2,
					startPosition: 0
				},
				{
					id: 3,
					startPosition: 0
				},
				{
					id: 4,
					startPosition: 0
				}
			],
			{
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
			}
		);

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
				multitrack.isPlaying() ? multitrack.pause() : multitrack.play();
				isPlaying = multitrack.isPlaying();
			}
		});

		if (waveformContainer) {
			waveformContainer.childNodes[0].addEventListener('scroll', (event) => {
				scrollX = (event.target as HTMLDivElement).scrollLeft;
				console.log('Scrolling', scrollX);
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
</script>

<div class="flex flex-col items-start w-full mb-4 gap-3 relative">
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
	<div class="flex justify-evenly w-full">
		<span
			class="text-xl text-white bg-black p-1 rounded-tr-lg"
			id="cursor-time"
			bind:this={currentTimeSpan}>00:00</span
		>
		<div class="flex items-center bg-black text-white rounded-b-lg">
			<button
				class="flex items-center justify-center w-6 h-6 rounded-full p-1.5"
				on:click={() => multitrack.setTime(multitrack.getCurrentTime() - 5)}
			>
				<StepBack class="w-6 h-6 text-white fill-white" />
			</button>
			<button
				class="flex items-center justify-center w-6 h-6 rounded-full p-1.5"
				on:click={() => (multitrack.isPlaying() ? multitrack.pause() : multitrack.play())}
			>
				{#if isPlaying}
					<Pause class="w-6 h-6 text-white fill-white" />
				{:else}
					<Play class="w-6 h-6 text-white fill-white" />
				{/if}
			</button>
			<button
				class="flex items-center justify-center w-6 h-6 rounded-full p-1.5"
				on:click={() => multitrack.setTime(multitrack.getCurrentTime() + 5)}
			>
				<StepForward class="w-6 h-6 text-white fill-white" />
			</button>
		</div>
	</div>
	<div id="timeline" class="w-full" />
	<div
		class="flex-grow w-full bg-muted border border-dashed border-muted-foreground track"
		bind:this={waveformContainer}
	/>
</div>

<style lang="postcss">
	.track {
		/* scrollbar-width: none; */
		scroll-behavior: auto;
	}
</style>
