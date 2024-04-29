import os
from pydub import AudioSegment

# Set the directory containing the .wav files
directory = 'polymath/library'

# Loop through all files in the directory
for filename in os.listdir(directory):
    # Check if the file has a .wav extension
    if filename.endswith('.wav'):
        # Construct the full file path
        file_path = os.path.join(directory, filename)
        
        # Load the audio file using pydub
        audio = AudioSegment.from_wav(file_path)
        
        # Get the base filename without the extension
        base_filename = os.path.splitext(filename)[0]
        
        # Construct the output file path for the .aac file
        output_path = os.path.join(directory, f"{base_filename}.aac")
        
        # Export the audio as .aac
        audio.export(output_path, format="adts")
        
        print(f"Converted {filename} to {base_filename}.aac")