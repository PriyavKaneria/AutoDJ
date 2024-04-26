import sys
import ffmpeg

# Open the video or audio file
probe = ffmpeg.probe(sys.argv[1])
# Get the stream information
video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
audio_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'audio'), None)

if video_stream:
    # Get video information
    width = video_stream['width']
    height = video_stream['height']
    frame_rate = video_stream['avg_frame_rate']  # e.g., '30/1'
    duration = float(video_stream['duration'])   # in seconds
    num_frames = int(duration * eval(frame_rate))
    video_codec = video_stream['codec_name']
    video_bitrate = int(video_stream['bit_rate'])  # in bits/s

    print(f"Video Information:")
    print(f"Width: {width}")
    print(f"Height: {height}")
    print(f"Frame Rate: {frame_rate}")
    print(f"Number of Frames: {num_frames}")
    print(f"Duration: {duration:.2f} seconds")
    print(f"Video Codec: {video_codec}")
    print(f"Video Bitrate: {video_bitrate / 1000} kbps")

if audio_stream:
    # Get audio information
    sample_rate = int(audio_stream['sample_rate'])
    audio_codec = audio_stream['codec_name']
    audio_bitrate = int(audio_stream['bit_rate'])  # in bits/s
    channels = audio_stream['channels']
    duration = float(audio_stream['duration'])   # in seconds
    num_audio_frames = int(duration * sample_rate)  # Calculate number of audio frames

    print(f"\nAudio Information:")
    print(f"Duration: {duration:.2f} seconds")
    print(f"Sample Rate: {sample_rate} Hz")
    print(f"Audio Codec: {audio_codec}")
    print(f"Audio Bitrate: {audio_bitrate / 1000} kbps")
    print(f"Channels: {channels}")
    print(f"Number of Audio Frames: {num_audio_frames}")