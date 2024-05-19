import asyncio
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

router = APIRouter()

@router.get("/stream/{audio_id}")
def stream_audio(audio_id: str):
    audio_file = f"server/../polymath/library/{audio_id}.aac"
    if not os.path.exists(audio_file):
        return {"error": "Audio file not found"}

    async def iterfile():
        try:
            with open(audio_file, mode="rb") as aacfile:
                #### This is the code to stream from a specific point in the audio file 
                #### NOT WORKING because of the way aac files are encoded, there is no direct mapping between time and bytes
                # sample_rate = 44100
                # channels = 2
                # sample_width = 2
                # # skip bytes to start streaming from a specific point
                # bytes_to_skip = int((start_from / 1000) * sample_rate * channels * sample_width)
                # print(f"Skipping {bytes_to_skip} bytes out of {os.path.getsize(audio_file)} bytes")
                # aacfile.read(bytes_to_skip)
                # data = aacfile.read(1024)
                while data:
                    yield data
                    data = aacfile.read(1024)
                    await asyncio.sleep(0)
        except asyncio.CancelledError:
            raise GeneratorExit

    return StreamingResponse(iterfile(), media_type="audio/mpeg")