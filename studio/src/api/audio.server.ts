import { BACKEND_URL } from '$env/static/private';
import type { AudioFeatures, LibrarySong } from '$lib/types';
// import { handleFetchError } from '$lib/utils';

const makeUrl = (path: string): string => `${BACKEND_URL}${path}`;

export async function fetchSongLibrary(): Promise<LibrarySong[]> {
	const url = makeUrl(`/library`);
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
	// .catch((err) => handleFetchError(err, 'Error fetching song library'));
	return res.data as LibrarySong[];
}

export async function fetchSongURL(songId: string): Promise<string> {
	const url = makeUrl(`/stream/${songId}`);
	return url;
}

export async function fetchSongAudioFeatures(songId: string): Promise<AudioFeatures> {
	const url = makeUrl(`/analyze/${songId}`);
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
	// .catch((err) => handleFetchError(err, 'Error fetching song audio features'));
	return res.data;
}
