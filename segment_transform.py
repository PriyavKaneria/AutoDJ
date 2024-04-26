import numpy as np
import librosa

# Segment boundaries in sample indices
segment_boundaries_indices = np.array([0, 17, 94, 135, 203, 233, 268, 399, 428, 459, 592, 654, 759, 831, 866, 1015, 1031])

# Hop length and sampling rate
hop_length = int(4096 * 0.75)
sr = 22050

# Convert indices to time frames
segment_boundaries_frames = segment_boundaries_indices * hop_length

# Convert time frames to timestamps
segment_boundaries_timestamps = segment_boundaries_frames / sr

print("Segment boundaries in timestamps (seconds): \n", segment_boundaries_timestamps)

librosa_timestamps = librosa.frames_to_time(segment_boundaries_indices, sr=sr, hop_length=hop_length)
print("\nSegment boundaries in timestamps using librosa (seconds): \n", librosa_timestamps)