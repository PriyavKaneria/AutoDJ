from aioredis import Redis
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
import numpy as np
from pydantic import BaseModel

from server.redis_cache import get_redis
from server.utils import find_nearest_neighbors, load_audio_features, load_feature_vectors, milliseconds_to_readable
from server.routers.library import song_database, library_path

router = APIRouter()

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
    current_audio_features = load_audio_features(f"{library_path}/{current_song_id}.a")
    if current_audio_features is None:
        print(f"Audio features not found for song ID: {current_song_id}")
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
    feature_vectors, vector_mapping = load_feature_vectors(song_database)
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
        audio_features = load_audio_features(f"{library_path}/{next_song}.a")
        beats = audio_features.beats
        start_timestamp = float(beats[beat_offset]) * 1000
        best_next_songs.append((next_song, song_metadata["title"], start_timestamp))

    return best_next_songs

class SearchRequest(BaseModel):
    current_song_id: str
    current_segment_end: int

@router.post("/search")
async def search(request: SearchRequest, redis: Redis = Depends(get_redis)):
    '''
    Find the best next songs to play after a given segment in the current song.
    
    Args:
        request (SearchRequest): The request containing the ID of the current song
                                  and the end time of the current segment.
    
    Returns:
        list: A list of tuples containing the ID, name, and start timestamp of the best next songs.
    '''
    current_song_id = request.current_song_id
    current_segment_end = request.current_segment_end
    current_segment_end_milliseconds = current_segment_end * 1000

    # check cache for the recommended songs
    cache_key = f"recommended_songs:{current_song_id}:{current_segment_end}"
    cache_data = await redis.get(cache_key)

    best_next_songs = []

    # print(f"Current Song ID: {current_song_id}, Current Segment End: {current_segment_end_milliseconds}")
    if cache_data:
        best_next_songs = eval(cache_data)
    else:
        best_next_songs = find_next_song(current_song_id, current_segment_end_milliseconds)
        # Cache the recommended songs
        await redis.set(cache_key, str(best_next_songs))

    response = []
    for song_id, song_title, start_timestamp in best_next_songs:
        readable_seconds = milliseconds_to_readable(start_timestamp)
        # print(f"Id: {song_id}, Name: {song_name}, Start Timestamp: {readable_seconds}")
        response.append({
            "id": song_id,
            "title": song_title,
            "start_timestamp": readable_seconds,
            "start_milliseconds": start_timestamp
        })
    return JSONResponse({
        "status": status.HTTP_200_OK,
        "message": "Best next songs found.",
        "data": response
    })

@router.get("/clear-cache")
async def clear_cache(redis: Redis = Depends(get_redis)):
    '''
    Clear the cache of recommended songs.
    '''
    await redis.flushdb()
    return JSONResponse({
        "status": status.HTTP_200_OK,
        "message": "Cache cleared."
    })