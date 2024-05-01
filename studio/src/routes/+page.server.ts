import { fetchSongAudioFeatures, fetchSongLibrary, fetchSongURL } from '../api/audio.server';

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
		return {
			songURL: await fetchSongURL(songId)
		};
	},

	analyzeSong: async ({ request }) => {
		const form = await request.formData();
		const songId = (form.get('songId') as string) || '';
		return {
			audioFeatures: await fetchSongAudioFeatures(songId)
		};
	}
};
