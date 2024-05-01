import json
import dill as pickle
import os

from librosa import frames_to_time
import numpy as np

from server.models.AudioFeatures import AudioFeatures

# Function to load audio features for a given song
def load_audio_features(file_path: str) -> AudioFeatures:
    if os.path.exists(file_path):
        audio_features : AudioFeatures = None
        with open(file_path, 'rb') as f:
            raw_audio_features = pickle.load(f)
            audio_features = AudioFeatures(
                raw_audio_features['id'],
                raw_audio_features['tempo'],
                raw_audio_features['duration'],
                raw_audio_features['timbre'],
                raw_audio_features['timbre_frames'],
                raw_audio_features['pitch'],
                raw_audio_features['pitch_frames'],
                raw_audio_features['intensity'],
                raw_audio_features['intensity_frames'],
                raw_audio_features['volume'],
                raw_audio_features['avg_volume'],
                raw_audio_features['loudness'],
                raw_audio_features['beats'],
                raw_audio_features['segments_boundaries'],
                raw_audio_features['segments_labels'],
                raw_audio_features['frequency_frames'],
                raw_audio_features['frequency'],
                raw_audio_features['key']
            )
        return audio_features
    else:
        return None

class NumpyValuesEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.float32):
            return float(obj)
        if isinstance(obj, np.float64):
            return float(obj)
        if isinstance(obj, np.int32):
            return int(obj)
        if isinstance(obj, np.int64):
            return int(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)
    

def milliseconds_to_readable(milliseconds):
    hours = milliseconds // 3600000
    milliseconds %= 3600000
    minutes = milliseconds // 60000
    milliseconds %= 60000
    seconds = milliseconds // 1000
    milliseconds %= 1000
    
    if hours > 0:
        return f"{hours} hour{'s' if hours > 1 else ''}, {minutes} minute{'s' if minutes > 1 else ''}, {seconds} second{'s' if milliseconds > 1 else ''}"
    elif minutes > 0:
        return f"{minutes} minute{'s' if minutes > 1 else ''}, {seconds} second{'s' if milliseconds > 1 else ''}, {milliseconds:.2f} ms"
    else:
        return f"{seconds} second{'s' if milliseconds > 1 else ''}, {milliseconds:.2f} ms"

def custom_frame_to_time(frame: int) -> float:
    """
    Converts a frame number to a timestamp in seconds.

    Args:
        frame (int): The frame number.

    Returns:
        float: The timestamp in seconds.
    """
    # Hop length and sampling rate
    hop_length = int(4096 * 0.75)
    sr = 22050
    
    # # Convert indices to time frames
    # segment_boundaries_frames = segment_boundaries_indices * hop_length
    
    # # Convert time frames to timestamps
    # segment_boundaries_timestamps = segment_boundaries_frames / sr

    return frames_to_time(frame, sr=sr, hop_length=hop_length)