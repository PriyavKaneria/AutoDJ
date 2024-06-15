<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import DynamicBracket from '$lib/components/DynamicBracket.svelte';
	import type { LibrarySong, AudioFeatures, RecommendedSong, TrackCue } from '$lib/types';
	import { tick } from 'svelte';
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';

	export let segmentProgress = 0;
	export let fetchingRecommendations = false;
	export let nextBestSongs: RecommendedSong[] = [];
	export let currentSegmentEnd = 0;
	export let currentSegmentOffset = 0;
	export let analyzeSongTrackIndex = 0;
	export let tracks: LibrarySong[] = [];
	export let trackCues: TrackCue[] = [];
	export let getSongData: (songId: string) => LibrarySong;
	export let nextSongSelectedEvent: (trackIndex: number) => void;

	const handleNextRecommendedSong = async (result: ActionResult, song: RecommendedSong) => {
		if (result.type === 'success' && result.data) {
			if (result.data.songURL) {
				const nextSongURL = result.data.songURL;
				const songStartSeconds = song.start_milliseconds / 1000;
				// at currentSegmentEnd the song_start_seconds should be there
				const nextSongStartFrom =
					-1 * (songStartSeconds - currentSegmentEnd + currentSegmentOffset);
				const nextSongCueFrom = songStartSeconds - 1; // cue from 1 second before the song starts for fade in
				console.log('song start seconds', songStartSeconds);
				console.log(
					'Next song start from',
					nextSongStartFrom,
					'due to current segment end',
					currentSegmentEnd,
					'and offset',
					currentSegmentOffset
				);
				console.log(
					'Next song cue from',
					nextSongCueFrom,
					'due to current segment offset',
					currentSegmentOffset
				);

				const nextTrackData = {
					url: nextSongURL,
					startFrom: nextSongStartFrom,
					cueFrom: nextSongCueFrom
				};
				trackCues = [...trackCues, nextTrackData];
				nextSongSelectedEvent(analyzeSongTrackIndex + 1);
				const songData = getSongData(song.id);
				// replace the analyzeSongTrackIndex + 1 track with the new song
				// clear all tracks after analyzeSongTrackIndex + 1
				if (analyzeSongTrackIndex >= tracks.length) {
					tracks = [...tracks, songData];
				} else {
					tracks[analyzeSongTrackIndex + 1] = songData;
					tracks = tracks.slice(0, analyzeSongTrackIndex + 2);
				}
			}
		}
	};
</script>

<div class="absolute -top-12 left-[2px] w-full">
	<!-- Loader for fetching next best songs -->
	{#if fetchingRecommendations}
		<div class="w-full absolute h-full flex backdrop-blur-sm z-20 min-h-96">
			<div class="flex items-center justify-center space-x-2 h-48 overflow-hidden">
				<LottiePlayer
					src={'/audio_wave_loader.json'}
					autoplay={true}
					loop={true}
					controls={false}
					background="transparent"
					renderer="svg"
				/>
				<span
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-secondary-foreground"
				>
					Fetching recommendations...
				</span>
			</div>
		</div>
	{/if}
	<div class="flex flex-col space-y-2">
		<DynamicBracket progress={segmentProgress} />
	</div>
	<ul role="list" class="space-y-1 z-10 relative">
		{#each nextBestSongs as song, index}
			<li class="overflow-hidden rounded-md bg-white px-6 py-3 shadow cursor-pointer">
				<form
					method="post"
					action="?/getSongURL"
					use:enhance={() => {
						return async ({ update, result }) => {
							await handleNextRecommendedSong(result, song);
						};
					}}
				>
					<button type="submit">
						<div class="min-w-0 flex-auto">
							<div class="flex items-center gap-x-3">
								<div class="flex-none rounded-full p-1 text-rose-400 bg-rose-400/10">
									<div class="h-2 w-2 rounded-full bg-current"></div>
								</div>
								<h2 class="min-w-0 text-sm font-semibold leading-6 text-black">
									<span class="truncate">{index + 1}. {song.title}</span>
									<input class="hidden" type="text" name="songId" value={song.id} />
								</h2>
							</div>
							<div class="mt-1 flex items-center gap-x-2.5 text-xs leading-5 text-gray-700">
								<p class="truncate">Artist</p>
								<svg viewBox="0 0 2 2" class="h-0.5 w-0.5 flex-none fill-gray-300">
									<circle cx="1" cy="1" r="1" />
								</svg>
								<p class="whitespace-nowrap">
									<!-- trim everythig after the word seconds -->
									Starting from {song.start_timestamp.split('seconds')[0]} seconds
									<input
										class="hidden"
										type="text"
										name="startFrom"
										value={song.start_milliseconds}
									/>
								</p>
							</div>
						</div>
					</button>
				</form>
			</li>
		{/each}
	</ul>
</div>
