import json
import os
import dill as pickle
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from server.models.database import Database
from server.models.video import Video
from server.utils import NumpyValuesEncoder, custom_frame_to_time, load_audio_features

router = APIRouter()

# Folder path for polymath library
library_path = "server/../polymath/library"
if not os.path.exists(library_path):
    raise Exception("Song library not found")

song_database : Database = {}
with open(rf'{library_path}/database.p', 'rb') as f:
    raw_song_database = pickle.load(f)
    library_files = [f for f in os.listdir(library_path) if f.endswith(".a")]
    for key in raw_song_database:
        if f"{key.id}.a" in library_files:
            song_database[key.id] = key.__dict__

@router.get("/library")
def get_song_library():
    # list all the files that have been analyzed (files with ext .a)
    return JSONResponse({
        "status": status.HTTP_200_OK,
        "message": "Song library successfully loaded",
        "data": list(song_database.values()),
    })

@router.get("/analyze/{video_id}")
def analyze_video(video_id: str):
    # check if the video exists in the database
    if video_id not in song_database:
        return JSONResponse({
            "status": status.HTTP_404_NOT_FOUND,
            "message": "Video not found in the library"
        })
    # get the analyzed data for the video
    analyzed_file = f"{library_path}/{video_id}.a"
    if not os.path.exists(analyzed_file):
        return JSONResponse({
            "status": status.HTTP_404_NOT_FOUND,
            "message": "Analyzed data not found"
        })
    # load the analyzed data
    audio_features = load_audio_features(analyzed_file)
    # convert segment boundaries to time
    audio_features.segments_boundaries = [custom_frame_to_time(frame) for frame in audio_features.segments_boundaries]
    return JSONResponse({
        "status": status.HTTP_200_OK,
        "message": "Analyzed data loaded successfully",
        "data": json.loads(json.dumps({
            "id": audio_features.id,
            "tempo": audio_features.tempo,
            "duration": audio_features.duration,
            "timbre": audio_features.timbre,
            "pitch": audio_features.pitch,
            "intensity": audio_features.intensity,
            "avg_volume": audio_features.avg_volume,
            "loudness": audio_features.loudness,
            "segments_boundaries": audio_features.segments_boundaries,
            "segments_labels": audio_features.segments_labels,
            "frequency": audio_features.frequency,
            "key": audio_features.key,
        }, cls=NumpyValuesEncoder))
    })