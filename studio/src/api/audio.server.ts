import { BACKEND_URL } from '$env/static/private';
import type { AudioFeatures, LibrarySong, LrcLibLyrics, RecommendedSong } from '$lib/types';
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

export async function fetchLrclibLyrics(songTitle: string): Promise<LrcLibLyrics[]> {
	const url = `https://lrclib.net/api/search?q=${songTitle}`;
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json());
	// .catch((err) => handleFetchError(err, 'Error fetching song lyrics'));
	let lyrics = res as LrcLibLyrics[];
	if (!lyrics || lyrics.length === 0) return [];
	// sort the lyrics with those having synced lyrics first
	lyrics = lyrics.sort((a, b) => {
		if (a.syncedLyrics && !b.syncedLyrics) return -1;
		if (!a.syncedLyrics && b.syncedLyrics) return 1;
		return 0;
	});
	return lyrics;
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

export async function fetchNextBestSongs(
	songId: string,
	currentSegmentEnd: number,
	nextSegmentPrefetch: number
): Promise<RecommendedSong[]> {
	const url = makeUrl(`/search`);
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ current_song_id: songId, current_segment_end: currentSegmentEnd })
	}).then((res) => res.json());
	// .catch((err) => handleFetchError(err, 'Error fetching next best songs'));

	// prefetch next segment so it get's cached
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ current_song_id: songId, current_segment_end: nextSegmentPrefetch })
	});

	return res.data as RecommendedSong[];
}
