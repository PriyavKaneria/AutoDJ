import json
import dill as pickle
import os

from librosa import frames_to_time
import numpy as np

from server.models.AudioFeatures import AudioFeatures
from server.models.database import Database

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

# Function to generate and save feature vectors if not exists
def generate_feature_vectors(song_database: Database):
    feature_vectors = []
    vector_mapping = []
    # Iterate over all songs in the database	
    for song_id in song_database:
        # Load audio features
        audio_features = load_audio_features(song_id)
        if audio_features is not None:
            # For every segment in the song, extract the tempo, pitch, timbre, and intensity
            # and create a feature vector mapped to the song id and segment index
            for frame in audio_features.segments_boundaries:
                segment_timestamp = custom_frame_to_time(frame)
                # find the floor beat index for the segment
                # beats need to be converted to floats for comparison
                beat_idx = np.where(np.insert(audio_features.beats, 0, 0.) <= segment_timestamp)[0][-1] - 1
                feature_vector = [
                    [audio_features.tempo],
                    audio_features.pitch_frames[beat_idx].tolist()[0],
                    audio_features.timbre_frames[beat_idx].tolist()[0],
                    audio_features.intensity_frames[beat_idx].tolist()[0]
                ]
                feature_vectors.append(feature_vector)
                vector_mapping.append((song_id, beat_idx))
    with open('feature_vectors.pkl', 'wb') as f:
        pickle.dump(feature_vectors, f)
    with open('vector_mapping.pkl', 'wb') as f:
        pickle.dump(vector_mapping, f)

# Function to load feature vectors
def load_feature_vectors(song_database: Database, force = False):
    if not os.path.exists('feature_vectors.pkl') or not os.path.exists('vector_mapping.pkl') or force:
        generate_feature_vectors(song_database)
    with open('feature_vectors.pkl', 'rb') as f:
        feature_vectors = pickle.load(f)
    with open('vector_mapping.pkl', 'rb') as f:
        vector_mapping = pickle.load(f)
    return feature_vectors, vector_mapping

# Function to find the nearest neighbors to a query feature
def find_nearest_neighbors(skip_idxs, features, query_feature, k=5):
    """
    Find the k nearest neighbors to a query feature in an array of features.
    
    Args:
        features (list): A list of features, where each feature is represented
                         by a list of 4 numpy arrays of varying lengths.
        query_feature (list): The query feature, represented as a list of 4
                              numpy arrays.
        k (int): The number of nearest neighbors to return (default: 5).
        
    Returns:
        list: A list of the indices of the k nearest neighbors in the features array.
    """
    distances = []
    for idx, feature in enumerate(features):
        if idx in skip_idxs:
            distances.append((float('inf'), idx))
            continue
        total_distance = 0
        for arr1, arr2 in zip(feature, query_feature):
            total_distance += np.sum((np.array(arr1) - np.array(arr2)) ** 2)
        distances.append((float(np.sqrt(total_distance)), idx))

    # sort the distances and indices based on distances
    distances.sort(key=lambda x: x[0])

    # # print top 10 distances
    # for i in range(10):
    #     print(distances[i])
    
    # extract the indices of the k nearest neighbors
    nearest_indices = [index for distance, index in distances[:k]]

    return nearest_indices

# Custom JSON encoder for numpy values in the audio features
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
    
# Convert milliseconds to a readable format
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

# Wrapper function to convert frame to time
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