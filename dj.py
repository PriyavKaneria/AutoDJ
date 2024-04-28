import pickle
import os
from typing import TypedDict
import numpy as np
from polymath.polymath import Video
import warnings
import argparse
from collections import Counter
warnings.filterwarnings("ignore", category=np.VisibleDeprecationWarning) 

from song_mixer import mix_audio_with_transition
from utils import *

# Create the parser
parser = argparse.ArgumentParser()
# Add the --force option
parser.add_argument('--force', '-f', action='store_true', help='Force the feature extraction process')
# Parse the arguments
args = parser.parse_args()

class Database(TypedDict):
    id: str
    song: Video

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

song_database : Database = {}

# Load the song database
with open(r'polymath/library/database.p', 'rb') as f:
    raw_song_database = pickle.load(f)
    for song in raw_song_database:
        song_database[song.id] = song

# Function to load audio features for a given song
def load_audio_features(song_id: str) -> AudioFeatures:
    file_path = r'polymath/library/' + f"{song_id}.a"
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
def load_feature_vectors():
    if not os.path.exists('feature_vectors.pkl') or not os.path.exists('vector_mapping.pkl') or args.force:
        generate_feature_vectors(song_database)
    with open('feature_vectors.pkl', 'rb') as f:
        feature_vectors = pickle.load(f)
    with open('vector_mapping.pkl', 'rb') as f:
        vector_mapping = pickle.load(f)
    return feature_vectors, vector_mapping


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

# Function to find the best next song after a segment
def find_next_song(current_song_id: str, current_segment_end: int):
    '''
    Find the best next song to play after a given segment in the current song.
    
    Args:
        current_song_id (str): The ID of the current song.
        current_segment_end (int): The end time (in milliseconds) of the current segment.
    
    Returns:
        list: A list of tuples containing the ID, name, and start timestamp of the best next songs.
    '''
    current_audio_features = load_audio_features(current_song_id)
    if current_audio_features is None:
        return []

    # Calulate the beat index for the current segment end
    beat_idx = np.where(np.insert(current_audio_features.beats, 0, 0.) <= current_segment_end / 1000)[0][-1] - 1

    # Calculate tempo, pitch, timbre, and intensity at the end of the current segment
    current_segment_end_features = {
        'tempo': [current_audio_features.tempo],
        'pitch': current_audio_features.pitch_frames[beat_idx],
        'timbre': current_audio_features.timbre_frames[beat_idx],
        'intensity': current_audio_features.intensity_frames[beat_idx]
    }

    # Load feature vectors
    feature_vectors, vector_mapping = load_feature_vectors()
    # feature_vectors = np.array(feature_vectors)

    skip_idxs = []
    for idx, mapping in enumerate(vector_mapping):
        if mapping[0] == current_song_id:
            skip_idxs.append(idx)

    # Find the nearest neighbors to the current segment end features
    nearest_neighbors_indices = find_nearest_neighbors(skip_idxs, feature_vectors, list(current_segment_end_features.values()))

    # Get the best next songs with timestamps
    best_next_songs = []
    for idx in nearest_neighbors_indices:
        next_song, beat_offset = vector_mapping[idx]
        song_metadata = song_database[next_song]
        audio_features = load_audio_features(next_song)
        beats = audio_features.beats
        start_timestamp = float(beats[beat_offset]) * 1000
        best_next_songs.append((next_song, song_metadata.name, start_timestamp))

    return best_next_songs

def main():
    # Example usage
    current_song_id : str = '2uUmHTgT65I'
    song_features = load_audio_features(current_song_id)
    print("------------------------------------------------------------")
    print("------------------------- AI DJ ----------------------------")
    print("------------------------------------------------------------")
    print("------------------------------------------------------------")
    print(f"Suggesting for song: {song_database[current_song_id].name}")
    print("------------------------------------------------------------")
    # loop through all segments and find the best next song for each segment
    for i, boundary in enumerate(song_features.segments_boundaries[1:-1]):
        current_segment_end = custom_frame_to_time(boundary) * 1000
        print(f"Segment {i + 1} at {current_segment_end / 1000} seconds")
        best_next_songs = find_next_song(current_song_id, current_segment_end)
        for song_id, song_name, start_timestamp in best_next_songs:
            readable_seconds = milliseconds_to_readable(start_timestamp)
            print(f"Id: {song_id}, Name: {song_name}, Start Timestamp: {readable_seconds}")
        print()
        # mix the first best next song with the current segment
        song_id, song_name, start_timestamp = best_next_songs[0]
        mixed_audio_path = mix_audio_with_transition(f"polymath/library/{current_song_id}.wav", f"polymath/library/{song_id}.wav", current_segment_end, start_timestamp, "crossfade", 2000)
        print(f"Mixed audio path: {mixed_audio_path}")
        print("------------------------------------------------------------")

if __name__ == "__main__":
    main()