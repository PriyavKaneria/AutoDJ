import numpy as np
from collections import Sequence
from scipy.spatial.distance import euclidean

def print_type_structure(obj, indent=0, depth=None):
    """
    Prints the complete nested type structure of an object up to a specified depth.
    
    Args:
        obj: The object whose type structure needs to be printed.
        indent (int): The initial indentation level (default is 0).
        depth (int or None): The maximum depth to print the type structure (default is None, which means no depth limit).
    """
    # Check if the maximum depth has been reached
    if depth == 0:
        print(" " * indent + "...")
        return
    
    # Print the type of the current object
    type_str = type(obj).__name__
    
    # Handle collections and numpy arrays
    if isinstance(obj, Sequence) and not isinstance(obj, str):
        if len(obj) > 0:
            type_str += f"[{print_type_structure(obj[0], indent, depth - 1 if depth is not None else None)}]"
        else:
            type_str += "[]"
    elif isinstance(obj, np.ndarray):
        if obj.size > 0:
            type_str += f"[{print_type_structure(obj.flat[0], indent, depth - 1 if depth is not None else None)}]"
        else:
            type_str += "[]"
    
    print(" " * indent + type_str)
    
    # Recursively print the type structure of any nested objects
    if depth is None or depth > 1:
        if isinstance(obj, Sequence) and not isinstance(obj, str):
            for item in obj:
                print_type_structure(item, indent + 2, depth - 1 if depth is not None else None)
        elif isinstance(obj, np.ndarray):
            for item in obj.flat:
                print_type_structure(item, indent + 2, depth - 1 if depth is not None else None)

    
def seconds_to_readable(seconds):
    hours = seconds // 3600
    remaining_seconds = seconds % 3600
    minutes = remaining_seconds // 60
    seconds = remaining_seconds % 60
    
    if hours > 0:
        return f"{hours} hour{'s' if hours > 1 else ''}, {minutes} minute{'s' if minutes > 1 else ''}, {seconds} second{'s' if seconds > 1 else ''}"
    elif minutes > 0:
        return f"{minutes} minute{'s' if minutes > 1 else ''}, {seconds} second{'s' if seconds > 1 else ''}"
    else:
        return f"{seconds} second{'s' if seconds > 1 else ''}"
    
# Not used as replaced by librosa's frames_to_time function
def transform_segment_boundaries_to_seconds(segment_boundaries_indices: np.array):
    """
    Transform segment boundaries from sample indices to seconds.
    
    Args:
        segment_boundaries_indices (np.array): An array of segment boundaries in sample indices.
        
    Returns:
        np.array: An array of segment boundaries in seconds.
    """
    # Hop length and sampling rate
    hop_length = int(4096 * 0.75)
    sr = 22050
    
    # Convert indices to time frames
    segment_boundaries_frames = segment_boundaries_indices * hop_length
    
    # Convert time frames to timestamps
    segment_boundaries_timestamps = segment_boundaries_frames / sr
    
    return segment_boundaries_timestamps