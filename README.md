# AIDJ

database
    - id : str
    - url : str
    - name : str
    - video : str
    - audio : str
    - video_features : list
    - audio_features : list

audio_features
    - id : str
    - tempo : float
    - duration : float
    - timbre : np.float32
    - timbre_frames : np.matrix[beats]
    - pitch : np.float32
    - pitch_frames : np.matrix[beats]
    - intensity : float
    - intensity_frames : np.matrix[beats]
    - volume : np.ndarray
    - avg_volume : np.float32
    - loudness : float
    - beats : np.ndarray[beats]
    - segments_boundaries : np.ndarray of frames
    - segments_labels : np.ndarray
    - frequency_frames : list[duration*100]
    - frequency : float
    - key : str