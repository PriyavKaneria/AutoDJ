# AutoDJ

```
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
```

## AutoDJ Features -
- [x] Show segmentations
- [x] Show song recommendations
- [x] Make recommendation box floating
- [x] Mix songs
- [x] Show lyrics on track hover
  - [-] Show lyrics while in recommendation box (cancelled : too much data fetching with little benefit)
- [.] Load mp3 audio file (later)
- [.] Direct load from youtube (later)
- [.] Extract audio features on server (later)
- [.] Allow song search and add track (other than base track) (later)
- [ ] Multiple cursors for independent mixing and playing
- [ ] Actual indian dj recommendation
  - [ ] Collect dataset
  - [ ] Identify tracks and timings
  - [ ] Research on best model architecture
  - [ ] Train model
- [ ] Algorithmic faster impl for recommendation