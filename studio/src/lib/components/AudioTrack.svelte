<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import type { LibrarySong } from '$lib/types/LibrarySong';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';

	export let songData: LibrarySong = {
		id: '',
		url: '',
		name: '',
		video: '',
		audio: ''
	};
	export let songURL: string = '';
	export let analyzeSong: () => void;
	export let wavesurfer: WaveSurfer;

	let waveformContainer: HTMLDivElement;

	$: loadingSong = false;
	$: loadedSong = false;

	// $: () => {
	// 	console.log(audioFeatures);
	// };

	onMount(() => {
		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: '#ed738e',
			progressColor: '#e11d48',
			dragToSeek: true,
			plugins: [
				Hover.create({
					labelSize: 16
				})
			]
		});

		wavesurfer.once('load', () => {
			if (!loadingSong) loadingSong = true;
		});

		wavesurfer.on('ready', () => {
			loadingSong = false;
			loadedSong = true;
			analyzeSong();
		});

		wavesurfer.on('timeupdate', () => {
			const cursorTime = document.getElementById('cursor-time');
			if (cursorTime) {
				let timeInSeconds = wavesurfer.getCurrentTime();
				const minutes = Math.floor(timeInSeconds / 60);
				const seconds = Math.floor(timeInSeconds % 60);
				cursorTime.innerHTML = `<span class="text-xs text-white bg-black p-1 rounded-tr-lg">${minutes
					.toString()
					.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>`;
			}
		});

		// Load the audio file or waveform data for the track
		wavesurfer.load(songURL);

		// listen to space key to play/pause the track
		window.addEventListener('keydown', (event) => {
			if (event.code === 'Space') {
				event.preventDefault();
				wavesurfer.playPause();
			}
		});

		return () => {
			wavesurfer.destroy();
			loadingSong = false;
			loadedSong = false;
		};
	});
</script>

<div class="flex flex-col items-start w-full mb-4 gap-3 relative">
	<span class="text-sm text-gray-400">Youtube link : {songData.url}</span>
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
	<div
		class="flex-grow w-full bg-muted {loadingSong
			? 'hidden'
			: 'block'} border border-dashed border-muted-foreground"
		bind:this={waveformContainer}
	/>
	<div class="absolute bottom-0 left-0 flex items-center gap-1 z-10">
		<span class="text-xs text-white bg-black p-1 rounded-tr-lg" id="cursor-time">00:00</span>
	</div>
</div>
