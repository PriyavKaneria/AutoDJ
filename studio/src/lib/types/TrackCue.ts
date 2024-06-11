export interface TrackCue {
	url: string; // URL of the audio file
	startFrom: number; // Where the track position should start from
	cueFrom: number; // Where the track should start playing from
	cueTo?: number; // Where the track should stop playing
	duration?: number; // Duration of the track
	audioElement?: HTMLAudioElement; // Reference to the audio element
	scrollX?: number; // Scroll position on the X-axis
}
