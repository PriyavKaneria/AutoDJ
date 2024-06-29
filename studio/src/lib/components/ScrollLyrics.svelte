<script lang="ts">
	import MultiTrack from 'wavesurfer-multitrack';
	import type HoverPlugin from 'wavesurfer.js/dist/plugins/hover.js';

	export let parsedLyrics: [number, string][];
	export let trackIndex: number = 0;
	export let hoverPluginInstance: HoverPlugin;
	export let multitrack: MultiTrack;
	export let clientWidth: number;
	export let zoom: number;
	export let scrollX: number;
	export let trackStartFrom: number;

	let lyricsBox: HTMLDivElement;

	$: hoverPluginInstance &&
		parsedLyrics &&
		parsedLyrics.length != 0 &&
		hoverPluginInstance.on('hover', (time) => {
			const audioDuration = multitrack.wavesurfers[trackIndex].getDuration();
			// position the lyrics component to hover position
			const visibleDuration = clientWidth / zoom;
			// subtract scroll %
			const scrollPercentage = scrollX / zoom / visibleDuration;
			const visibleTimePercentage =
				(time * audioDuration) / visibleDuration -
				scrollPercentage +
				trackStartFrom / audioDuration;

			if (visibleTimePercentage > 0.5) {
				lyricsBox.style.left = `calc( ${visibleTimePercentage * 100}% - 384px )`;
			} else {
				lyricsBox.style.left = `${visibleTimePercentage * 100}%`;
			}
			lyricsBox.style.top = `${80 + trackIndex * 120}px`;
			// get the current lyric index
			const timeInSeconds = time * audioDuration;
			const currentLyricIndex = parsedLyrics.findIndex((lyric) => Number(lyric[0]) > timeInSeconds);
			currentLyricCarouselIndex = currentLyricIndex - 1;
		});

	$: currentLyricCarouselIndex = 0;
</script>

<div
	class="absolute w-96 text-sm text-center flex justify-center align-middle pointer-events-none -top-40 -left-40"
	bind:this={lyricsBox}
>
	{#if parsedLyrics && parsedLyrics.length != 0}
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
				{lyric[1] || '🎶'}
			</span>
		{/each}
	{/if}
</div>
