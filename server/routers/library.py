import json
import os
import dill as pickle
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from server.models.database import Database
from server.models.video import Video

router = APIRouter()

@router.get("/library")
def get_song_library():
    # Folder path for polymath library
    library_path = "server/../polymath/library"
    # check if the folder exists
    if not os.path.exists(library_path):
        return JSONResponse({
            "status": status.HTTP_404_NOT_FOUND,
            "message": "Song library not found"
        })
    # list all the files that have been analyzed (files with ext .a)
    # Load the song database
    song_database : Database = {}
    with open(rf'{library_path}/database.p', 'rb') as f:
        raw_song_database = pickle.load(f)
        library_files = [f for f in os.listdir(library_path) if f.endswith(".a")]
        for key in raw_song_database:
            if f"{key.id}.a" in library_files:
                song_database[key.id] = key.__dict__
    return JSONResponse({
        "status": status.HTTP_200_OK,
        "message": "Song library successfully loaded",
        "data": list(song_database.values()),
    })
