<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import type { LibrarySong } from '$lib/types/LibrarySong';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';
	import MultiTrack from 'wavesurfer-multitrack';
	import { Pause, Play, StepBack, StepForward } from 'lucide-svelte';

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
	// $: currentTime = multitrack && multitrack.getCurrentTime();
	let currentTimeSpan: HTMLSpanElement;

	const loadSong = async () => {
		const src = songURL;
		const blob = await fetch(src).then((resp) => resp.blob());
		const blobURL = URL.createObjectURL(blob);
		multitrack.addTrack({
			id: 0,
			startPosition: 0,
			draggable: false,
			options: {
				media: new Audio(blobURL),
				waveColor: '#ed738e',
				progressColor: '#e11d48',
				dragToSeek: true,
				plugins: []
			}
		});
		loadingSong = false;
		loadedSong = true;
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

	onMount(() => {
		multitrack = MultiTrack.create(
			[
				{
					id: 0,
					startPosition: 0
				}
				// {
				// 	id: 'base',
				// 	startPosition: 1,
				// 	draggable: false,
				// 	url: songURL,
				// 	options: {
				// 		waveColor: '#ed738e',
				// 		progressColor: '#e11d48',
				// 		dragToSeek: true,
				// 		plugins: [
				// 			// Hover.create({
				// 			// 	labelSize: 16
				// 			// })
				// 		]
				// 	}
				// }
			],
			{
				container: waveformContainer,
				cursorColor: '#000',
				trackBackground: '#fff',
				trackBorderColor: '#000'
			}
		);

		// Set sinkId
		multitrack.once('canplay', async () => {
			await multitrack.setSinkId('');
			console.log('Set sinkId to default');
			// load the song
			await loadSong();
			// loadingSong = false;
			// loadedSong = true;
			// analyzeSong();
		});

		// multitrack.on('drop', ({ id }) => {
		// 	console.log('Dropped track', id);
		// 	multitrack.addTrack({
		// 		id,
		// 		url: songURL,
		// 		startPosition: 0,
		// 		draggable: true,
		// 		options: {
		// 			waveColor: 'hsl(25, 87%, 49%)',
		// 			progressColor: 'hsl(25, 87%, 20%)'
		// 		}
		// 	});
		// });

		// wavesurfer.on('timeupdate', () => {
		// 	const cursorTime = document.getElementById('cursor-time');
		// 	if (cursorTime) {
		// 		let timeInSeconds = wavesurfer.getCurrentTime();
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
	<div
		class="flex-grow w-full bg-muted border border-dashed border-muted-foreground"
		bind:this={waveformContainer}
	/>
	<!-- <div class="absolute bottom-0 left-0 flex items-center gap-1 z-10">
		<span class="text-xs text-white bg-black p-1 rounded-tr-lg" id="cursor-time">00:00</span>
	</div> -->
	<!-- Skip back 5 - Play/Pause - Skip next 5 controls -->
	<!-- <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
		<div class="flex items-center bg-black text-white rounded-b-lg">
			<button
				class="flex items-center justify-center w-6 h-6 rounded-full p-1.5"
				on:click={() => wavesurfer.seekTo(wavesurfer.getCurrentTime() - 5)}
			>
				<StepBack class="w-6 h-6 text-white fill-white" />
			</button>
			<button
				class="flex items-center justify-center w-6 h-6 rounded-full p-1.5"
				on:click={() => wavesurfer.playPause()}
			>
				{#if isPlaying}
					<Pause class="w-6 h-6 text-white fill-white" />
				{:else}
					<Play class="w-6 h-6 text-white fill-white" />
				{/if}
			</button>
			<button
				class="flex items-center justify-center w-6 h-6 rounded-full p-1.5"
				on:click={() => wavesurfer.seekTo(wavesurfer.getCurrentTime() + 5)}
			>
				<StepForward class="w-6 h-6 text-white fill-white" />
			</button>
		</div>
	</div> -->
</div>
