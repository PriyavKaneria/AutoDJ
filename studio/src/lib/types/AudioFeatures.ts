export interface AudioFeatures {
	id: string;
	tempo: number;
	duration: number;
	timbre: number;
	pitch: number;
	intensity: number;
	avg_volume: number;
	loudness: number;
	segments_boundaries: number[];
	segments_labels: number[];
	frequency: number;
	key: string;
}
