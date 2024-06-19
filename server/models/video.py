class Video:
    def __init__(self,name,video,audio,title,artist,offset=0):
        self.id : str = ""
        self.url : str = ""
        self.name : str = name
        self.video : str = video
        self.audio : str = audio
        self.title : str = title
        self.artist : str = artist
        self.lrcOffset : int = offset