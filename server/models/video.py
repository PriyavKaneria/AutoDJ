class Video:
    def __init__(self,name,video,audio):
        self.id : str = ""
        self.url : str = ""
        self.name : str = name
        self.video : str = video
        self.audio : str = audio
        self.video_features = []
        self.audio_features = []