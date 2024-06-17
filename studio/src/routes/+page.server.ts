import {
	fetchLrclibLyrics,
	fetchNextBestSongs,
	fetchSongAudioFeatures,
	fetchSongLibrary,
	fetchSongURL
} from '../api/audio.server';

export async function load() {
	return {
		songLibrary: await fetchSongLibrary()
	};
}

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	getSongURL: async ({ request }) => {
		const form = await request.formData();
		const songId = (form.get('songId') as string) || '';
		const songTitle = (form.get('songTitle') as string) || '';
		// const startFrom = Math.floor(Number(form.get('startFrom'))) || 0;
		if (songId === '') {
			return {
				songURL: '',
				lrcLyrics: []
			};
		}
		return {
			songURL: await fetchSongURL(songId),
			lrcLyrics: await fetchLrclibLyrics(songTitle)
		};
	},

	analyzeSong: async ({ request }) => {
		const form = await request.formData();
		const songId = (form.get('songId') as string) || '';
		return {
			audioFeatures: await fetchSongAudioFeatures(songId)
		};
	},

	getNextBestSongs: async ({ request }) => {
		const form = await request.formData();
		const songId = (form.get('songId') as string) || '';
		if (songId === '') {
			return {
				nextBestSongs: []
			};
		}
		const currentSegmentEnd = Math.floor(Number(form.get('currentSegmentEnd'))) || 0;
		const nextSegmentPrefetch = Math.floor(Number(form.get('nextSegmentPrefetch'))) || 0;
		return {
			nextBestSongs: await fetchNextBestSongs(songId, currentSegmentEnd, nextSegmentPrefetch)
		};
	}
};
