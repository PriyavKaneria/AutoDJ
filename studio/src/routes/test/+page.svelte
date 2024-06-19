<script lang="ts">
	import { onMount } from 'svelte';
	import MultiTrack from 'wavesurfer-multitrack';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
	import { parsedLyrics } from '$lib/utils';

	let waveformContainer: HTMLDivElement;
	let multitrack: MultiTrack;

	const loadTrack = async () => {
		const src = 'http://localhost:8000/stream/rW9_-dVCmrM';
		const blob = await fetch(src).then((resp) => resp.blob());
		const blobURL = URL.createObjectURL(blob);
		const audioElement = new Audio(blobURL);
		audioElement.preload = 'metadata';
		multitrack.addTrack({
			id: 0,
			startPosition: 0,
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
	};

	onMount(() => {
		multitrack = MultiTrack.create(
			[
				{
					id: 0,
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
			}
		});

		loadTrack();

		return () => {
			multitrack.destroy();
		};
	});

	$: currentLyricCarouselIndex = 0;
	$: direction = 'down';
	const handleCarouselNext = () => {
		if (currentLyricCarouselIndex < parsedLyrics.length - 1) {
			direction = 'down';
			currentLyricCarouselIndex += 1;
		}
	};
	const handleCarouselPrev = () => {
		if (currentLyricCarouselIndex > 0) {
			direction = 'up';
			currentLyricCarouselIndex -= 1;
		}
	};
</script>

<div
	class="flex-grow w-full bg-muted border border-dashed border-muted-foreground track"
	bind:this={waveformContainer}
/>

<div class="w-full h-full bg-black">
	<br />
	<br />
	<br />
	<div class="relative w-96 text-sm text-center flex justify-center align-middle">
		{#each parsedLyrics as lyric, index}
			<span
				class={'absolute bg-white rounded-md px-3 w-full truncate ' +
					(currentLyricCarouselIndex == index
						? 'block scale-100 z-20'
						: 'scale-75 text-sm z-10 ' +
							(index == currentLyricCarouselIndex + 1
								? 'opacity-50 translate-y-full'
								: index == currentLyricCarouselIndex - 1
									? 'opacity-50 -translate-y-full'
									: 'hidden'))}
				class:animate-fade-zoom-in-bottom={direction === 'down' &&
					index === currentLyricCarouselIndex}
				class:animate-fade-zoom-in-top={direction === 'up' && index === currentLyricCarouselIndex}
				class:animate-fade-zoom-out-bottom={direction === 'up' &&
					index === currentLyricCarouselIndex + 1}
				class:animate-fade-zoom-out-top={direction === 'down' &&
					index === currentLyricCarouselIndex - 1}
			>
				{lyric[1]}
			</span>
		{/each}
	</div>
	<br />
	<br />
	<br />
</div>
{currentLyricCarouselIndex}
<button on:click={handleCarouselPrev}> Prev </button>
<button on:click={handleCarouselNext}> Next </button>
