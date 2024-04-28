<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';

	export let track;
	export let index;

	let waveformContainer : HTMLDivElement;
	let wavesurfer: WaveSurfer;

	onMount(() => {
		wavesurfer = WaveSurfer.create({
			container: waveformContainer,
			waveColor: 'violet',
			progressColor: 'purple',
			dragToSeek: true,
		});

		// Load the audio file or waveform data for the track
		wavesurfer.load("http://localhost:8000/stream/" + track.id);

		// listen to space key to play/pause the track
		window.addEventListener('keydown', (event) => {
			if (event.code === 'Space') {
				event.preventDefault();
				wavesurfer.playPause();
			}
		});
	});
</script>

<div class="track">
	<div class="track-info">
		<span>{index + 1}. {track.name}</span>
		<!-- Add any additional track controls or options here -->
	</div>
	<div class="waveform" bind:this={waveformContainer} />
</div>

<style>
	.track {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.track-info {
		margin-right: 1rem;
		font-weight: bold;
	}

	.waveform {
		flex-grow: 1;
		background-color: #f0f0f0;
	}
</style>
