<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import type { LibrarySong } from '$lib/types/LibrarySong';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
	import ZoomPlugin from 'wavesurfer.js/plugins/zoom';
	import MultiTrack from 'wavesurfer-multitrack';
	import { Pause, Play, StepBack, StepForward } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';

	export let songData: LibrarySong = {
		id: '',
		url: '',
		name: '',
		video: '',
		audio: ''
	};
	export let songURL: string = '';
	export let analyzeSong: () => void;
	export let multitrack: MultiTrack;

	let waveformContainer: HTMLDivElement;

	$: loadingSong = false;
	$: loadedSong = false;

	$: isPlaying = multitrack && multitrack.isPlaying();
	$: currentTime = multitrack && multitrack.getCurrentTime();
	let currentTimeSpan: HTMLSpanElement;

	let audioElement: HTMLAudioElement;

	const loadSong = async () => {
		const src = songURL;
		const blob = await fetch(src).then((resp) => resp.blob());
		const blobURL = URL.createObjectURL(blob);
		const elem = new Audio(blobURL);
		elem.preload = 'metadata';
		audioElement = elem;
		elem.addEventListener('loadeddata', function () {
			console.log('Audio data loaded');
			console.log('Audio duration: ' + this.duration);
			// audioElement = elem;
		});

		multitrack.addTrack({
			id: 0,
			startPosition: 0,
			draggable: false,
			options: {
				media: audioElement,
				backend: 'MediaElement',
				waveColor: '#ed738e',
				progressColor: '#e11d48',
				barWidth: 3,
				barGap: 3,
				barRadius: 3,
				barHeight: 0.8,
				dragToSeek: true,
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
					ZoomPlugin.create({
						deltaThreshold: 0,
						maxZoom: 100
					}),
					TimelinePlugin.create({
						primaryLabelInterval: 30,
						secondaryLabelInterval: 5
					})
				]
			}
		});

		loadingSong = false;
		loadedSong = true;
		analyzeSong();
	};

	// $: () => {
	// 	if (currentTimeSpan) {
	// 		const minutes = Math.floor(currentTime / 60);
	// 		const seconds = Math.floor(currentTime % 60);
	// 		currentTimeSpan.innerHTML = `<span class="text-xs text-white bg-black p-1 rounded-tr-lg">${minutes
	// 			.toString()
	// 			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>`;
	// 	}
	// };

	// const loadSegmentMarkers = () => {
	// 	if (!analyzingSong && audioFeatures) {
	// 		wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());
	// 		audioFeatures.segments_boundaries.forEach((boundary) => {
	// 			wsRegions.addRegion({
	// 				start: boundary,
	// 				color: 'black',
	// 				drag: false,
	// 				resize: false
	// 			});
	// 		});
	// 		wsRegions.on('region-clicked', (region, e) => {
	// 			e.stopPropagation();
	// 			// region.play();
	// 			wavesurfer.setTime(region.start);
	// 			currentSegmentEnd = region.start;
	// 		});
	// 		wavesurfer.on('timeupdate', () => {
	// 			const currentTime = wavesurfer.getCurrentTime();
	// 			const currentSegment =
	// 				audioFeatures.segments_boundaries.find((boundary) => {
	// 					return currentTime < boundary;
	// 				}) || 0;
	// 			if (currentSegmentEnd !== currentSegment) {
	// 				currentSegmentEnd = currentSegment;
	// 			}
	// 		});
	// 	}
	// };

	onMount(() => {
		multitrack = MultiTrack.create(
			[
				{
					id: 0,
					startPosition: 0
				}
				// {
				// 	id: 1,
				// 	startPosition: 0,
				// },
			],
			{
				container: waveformContainer,
				cursorColor: '#000',
				cursorWidth: 1,
				rightButtonDrag: true,
				trackBackground: '#fff',
				trackBorderColor: '#000',
				minPxPerSec: 10,
				timelineOptions: {
					duration: 100
				}
			}
		);

		// Set sinkId
		multitrack.once('canplay', async () => {
			await multitrack.setSinkId('');
			console.log('Set sinkId to default');
			// load the song
			await loadSong();
		});

		// multitrack.on('', () => {
		// 	const cursorTime = document.getElementById('cursor-time');
		// 	if (cursorTime) {
		// 		let timeInSeconds = multitrack.getCurrentTime();
		// 		currentTime = timeInSeconds;
		// 		const minutes = Math.floor(timeInSeconds / 60);
		// 		const seconds = Math.floor(timeInSeconds % 60);
		// 		cursorTime.innerHTML = `<span class="text-xs text-white bg-black p-1 rounded-tr-lg">${minutes
		// 			.toString()
		// 			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>`;
		// 	}
		// });

		// listen to space key to play/pause the track
		window.addEventListener('keydown', (event) => {
			if (event.code === 'Space') {
				event.preventDefault();
				multitrack.isPlaying() ? multitrack.pause() : multitrack.play();
				isPlaying = multitrack.isPlaying();
			}
		});

		return () => {
			multitrack.destroy();
			loadingSong = false;
			loadedSong = false;
		};
	});
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
