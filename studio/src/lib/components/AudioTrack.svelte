<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import type { LibrarySong } from '$lib/types/LibrarySong';

	export let songData: LibrarySong = {
		id: '',
		url: '',
		name: '',
		video: '',
		audio: ''
	}
	export let songURL: string = '';

	let waveformContainer: HTMLDivElement;
	let wavesurfer: WaveSurfer;

	onMount(() => {
		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: 'violet',
			progressColor: 'purple',
			dragToSeek: true
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
	});
</script>

<div class="flex items-center w-full mb-4">
	<div class="flex-grow bg-transparent" bind:this={waveformContainer} />
</div>