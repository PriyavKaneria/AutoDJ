export interface TrackCue {
	url: string;
	startFrom: number;
	cueFrom: number;
	cueTo?: number;
	duration?: number;
	audioElement?: HTMLAudioElement;
	scrollX?: number;
}
