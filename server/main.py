from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routers import audio

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(audio.router)

@app.get("/")
async def root():
    return {"message": "Server is running 🚀"}