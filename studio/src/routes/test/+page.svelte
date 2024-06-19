<script lang="ts">
	import { onMount } from 'svelte';
	import MultiTrack from 'wavesurfer-multitrack';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
	import { parsedLyrics } from '$lib/utils';

	let waveformContainer: HTMLDivElement;
	let multitrack: MultiTrack;
	let scrollX = 0;

	const loadTrack = async () => {
		const src = 'http://localhost:8000/stream/rW9_-dVCmrM';
		const blob = await fetch(src).then((resp) => resp.blob());
		const blobURL = URL.createObjectURL(blob);
		const audioElement = new Audio(blobURL);
		audioElement.preload = 'metadata';
		const hoverPlugin = Hover.create({
			labelSize: 16,
			lineColor: 'black',
			lineWidth: 1
		});
		hoverPlugin.on('hover', (time) => {
			const audioDuration = multitrack.wavesurfers[0].getDuration();
			// position the lyrics component to hover position
			const clientWidth = waveformContainer.clientWidth;
			const zoom = 10;
			const visibleDuration = clientWidth / zoom;
			// subtract scroll %
			const scrollPercentage = scrollX / zoom / visibleDuration;
			console.log('Scroll percentage', scrollPercentage, scrollX);
			const visibleTimePercentage = (time * audioDuration) / visibleDuration - scrollPercentage;
			if (visibleTimePercentage > 0.5) {
				lyricsBox.style.left = `calc( ${visibleTimePercentage * 100}% - 384px )`;
			} else {
				lyricsBox.style.left = `${visibleTimePercentage * 100}%`;
			}
			lyricsBox.style.top = `${40 + 0 * 120}px`;
			// get the current lyric index
			const timeInSeconds = time * audioDuration;
			const currentLyricIndex = parsedLyrics.findIndex((lyric) => Number(lyric[0]) > timeInSeconds);
			if (currentLyricIndex > 0) {
				currentLyricCarouselIndex = currentLyricIndex - 1;
			}
		});
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
					hoverPlugin,
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

		if (waveformContainer) {
			waveformContainer.childNodes[0].addEventListener('scroll', (event) => {
				scrollX = (event.target as HTMLDivElement).scrollLeft;
				// console.log('Scrolling', scrollX);
			});
		}
		loadTrack();

		return () => {
			multitrack.destroy();
		};
	});

	$: currentLyricCarouselIndex = 0;
	const handleCarouselNext = () => {
		if (currentLyricCarouselIndex < parsedLyrics.length - 1) {
			currentLyricCarouselIndex += 1;
		}
	};
	const handleCarouselPrev = () => {
		if (currentLyricCarouselIndex > 0) {
			currentLyricCarouselIndex -= 1;
		}
	};

	let lyricsBox: HTMLDivElement;
</script>

<div
	class="flex-grow w-full bg-muted border border-dashed border-muted-foreground track"
	bind:this={waveformContainer}
/>

<div class="w-full h-full flex justify-center align-middle pt-16 pb-5 bg-white">
	<div
		class="absolute w-96 text-sm text-center flex justify-center align-middle pointer-events-none"
		bind:this={lyricsBox}
	>
		{#each parsedLyrics as lyric, index}
			<span
				class={'absolute bg-white rounded-sm px-3 w-full truncate transition-all duration-300 ease-out ' +
					(currentLyricCarouselIndex == index
						? 'block scale-100 z-20'
						: 'scale-75 text-sm z-10 ' +
							(index == currentLyricCarouselIndex + 1
								? 'opacity-75 translate-y-full'
								: index == currentLyricCarouselIndex - 1
									? 'opacity-75 -translate-y-full'
									: 'opacity-0 ' +
										(index > currentLyricCarouselIndex
											? 'translate-y-[200%]'
											: '-translate-y-[200%]')))}
			>
				{lyric[1]}
			</span>
		{/each}
	</div>
</div>
&nbsp;
{currentLyricCarouselIndex}
<button on:click={handleCarouselPrev}> Prev </button>
<button on:click={handleCarouselNext}> Next </button>
