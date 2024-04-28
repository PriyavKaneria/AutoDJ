from pydub import AudioSegment
from pydub.utils import make_chunks

# Define transition functions
def crossfade(start, end, duration):
    return start.append(end, crossfade=duration/2)

def fade_in(segment, duration):
    return segment.fade_in(duration)

def fade_out(segment, duration):
    return segment.fade_out(duration)

def mix_audio_with_transition(audio1_path, audio2_path, audio1_endtime, audio2_starttime, transition, transition_duration):
    """
    Mixes two audio files with a specified transition between them.

    Args:
        audio1_path (str): Path to the first audio file.
        audio2_path (str): Path to the second audio file.
        audio1_endtime (int): End time (in milliseconds) of the first audio file.
        audio2_starttime (int): Start time (in milliseconds) of the second audio file.
        transition (str): Type of transition to apply ("crossfade", "fade_out", or "fade_in").
        transition_duration (int): Duration of the transition (in milliseconds).

    Returns:
        str: Path to the resulting mixed audio file.
    """
    # Load audio files
    audio1 = AudioSegment.from_file(audio1_path, format="wav")
    audio1_id = audio1_path.split("/")[-1].split(".")[0]
    audio2 = AudioSegment.from_file(audio2_path, format="wav")
    audio2_id = audio2_path.split("/")[-1].split(".")[0]

    # Combine audio files with transition
    start_segment = audio1[:audio1_endtime]
    end_segment = audio2[audio2_starttime:]

    if transition == "crossfade":
        # check if transition duration is less than half of the shortest segment
        if transition_duration > len(start_segment) / 2 or transition_duration > len(end_segment) / 2:
            transition_duration = min(len(start_segment), len(end_segment)) // 2
        # a1[0:-t/2] + crossfade(a1[-t/2:], a2[:t/2], t) + a2[t/2:]
        combined = start_segment[:-transition_duration/2] + crossfade(start_segment[-transition_duration/2:], end_segment[:transition_duration/2], transition_duration) + end_segment[transition_duration/2:]
    elif transition == "fade_out":
        combined = start_segment + fade_out(start_segment[-transition_duration:], transition_duration) + end_segment
    elif transition == "fade_in":
        combined = start_segment + fade_in(end_segment[:transition_duration], transition_duration) + end_segment[transition_duration:]
    else:
        raise ValueError("Invalid transition type. Allowed values are 'crossfade', 'fade_out', and 'fade_in'.")

    # Export the combined audio
    output_path = f"djs/mixed_{audio1_id}_{audio2_id}.mp3"
    combined.export(output_path, format="mp3")

    return output_path