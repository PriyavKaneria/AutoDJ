import os
from fastapi import APIRouter, WebSocket
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.get("/stream/{audio_id}")
def stream_audio(audio_id: str):
    audio_file = f"server/audio_files/{audio_id}.mp3"
    if not os.path.exists(audio_file):
        return {"error": "Audio file not found"}

    def iterfile():
        with open(audio_file, "rb") as fwav:
            data = fwav.read(1024)
            while data:
                yield data
                data = fwav.read(1024)

    return StreamingResponse(iterfile(), media_type="audio/mpeg")