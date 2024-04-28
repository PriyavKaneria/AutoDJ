from librosa import frames_to_time
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

    
def milliseconds_to_readable(milliseconds):
    hours = milliseconds // 3600000
    milliseconds %= 3600000
    minutes = milliseconds // 60000
    milliseconds %= 60000
    seconds = milliseconds // 1000
    milliseconds %= 1000
    
    if hours > 0:
        return f"{hours} hour{'s' if hours > 1 else ''}, {minutes} minute{'s' if minutes > 1 else ''}, {milliseconds} second{'s' if milliseconds > 1 else ''}"
    elif minutes > 0:
        return f"{minutes} minute{'s' if minutes > 1 else ''}, {milliseconds} second{'s' if milliseconds > 1 else ''}, {milliseconds:.2f} ms"
    else:
        return f"{milliseconds} second{'s' if milliseconds > 1 else ''}, {milliseconds:.2f} ms"

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