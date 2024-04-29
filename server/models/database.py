
from typing import TypedDict
from server.models.video import Video

class Database(TypedDict):
    id: str
    song: Video
