
import numpy as np

class AudioFeatures:
    def __init__(self, id, tempo, duration, timbre, timbre_frames, pitch, pitch_frames, intensity, intensity_frames, volume, avg_volume, loudness, beats, segments_boundaries, segments_labels, frequency_frames, frequency, key):
        self.id : str = id
        self.tempo : float = tempo
        self.duration : float = duration
        self.timbre : np.float32 = timbre
        self.timbre_frames : np.matrix = timbre_frames
        self.pitch : np.float32 = pitch
        self.pitch_frames : np.matrix = pitch_frames
        self.intensity : float = intensity
        self.intensity_frames : np.matrix = intensity_frames
        self.volume : np.ndarray = volume
        self.avg_volume : np.float32 = avg_volume
        self.loudness : float = loudness
        self.beats : np.ndarray = beats
        self.segments_boundaries : np.ndarray = segments_boundaries
        self.segments_labels : np.ndarray = segments_labels
        self.frequency_frames : list = frequency_frames
        self.frequency : float = frequency
        self.key : str = key