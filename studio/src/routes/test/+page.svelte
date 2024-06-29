<script lang="ts">
	import { onMount } from 'svelte';
	import MultiTrack from 'wavesurfer-multitrack';
	import Hover from 'wavesurfer.js/dist/plugins/hover.js';
	import TimelinePlugin from 'wavesurfer.js/plugins/timeline';
	import { parsedLyrics } from '$lib/utils';
	import type HoverPlugin from 'wavesurfer.js/dist/plugins/hover.js';
	import ScrollLyrics from '$lib/components/ScrollLyrics.svelte';

	let waveformContainer: HTMLDivElement;
	let multitrack: MultiTrack;
	let scrollX = 0;
	let hoverPlugin: HoverPlugin;
	let clientWidth = 0;

	const loadTrack = async () => {
		const src = 'http://localhost:8000/stream/rW9_-dVCmrM';
		const blob = await fetch(src).then((resp) => resp.blob());
		const blobURL = URL.createObjectURL(blob);
		const audioElement = new Audio(blobURL);
		audioElement.preload = 'metadata';
		hoverPlugin = Hover.create({
			labelSize: 16,
			lineColor: 'black',
			lineWidth: 1
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
			clientWidth = waveformContainer.clientWidth;
		}
		loadTrack();

		return () => {
			multitrack.destroy();
		};
	});

	let lyricsBox: HTMLDivElement;
	let zoom = 10;
</script>

<div
	class="flex-grow w-full bg-muted border border-dashed border-muted-foreground track"
	bind:this={waveformContainer}
/>

<div class="w-full h-full flex justify-center align-middle pt-16 pb-5 bg-white">
	<ScrollLyrics
		hoverPluginInstance={hoverPlugin}
		{parsedLyrics}
		{multitrack}
		{clientWidth}
		{zoom}
		{scrollX}
	/>
</div>
