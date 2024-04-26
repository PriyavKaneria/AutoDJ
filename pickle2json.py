"""
Pickle2JSON is a simple Python Command Line program for converting Pickle file to JSON file.
Arguments: Only one (1) argument is expected which is the pickle file.
Usage: python pickle2json.py myfile.pkl
Output: The output is a JSON file bearing the same filename containing the JSON document of the converted Pickle file.
"""

# import libraries
import pickle
import json
import sys
import os
import numpy as np
from polymath.polymath import Video

# open pickle file
with open(sys.argv[1], 'rb') as infile:
    obj = pickle.load(infile)

def serialize(obj):
    if isinstance(obj, Video):
        return obj.__dict__
    elif isinstance(obj, dict):
        return {k: serialize(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [serialize(i) for i in obj]
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.int64):
        return int(obj)
    elif isinstance(obj, np.float64):
        return float(obj)
    elif isinstance(obj, np.float32):
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.matrix):
        return obj.tolist()
    return str(obj)

# convert pickle object to json object
json_obj = json.loads(json.dumps(obj, default=lambda o: serialize(o)))
# json_obj = json.loads(json.dumps(obj, default=lambda o: str(type(o))))

# write the json file
with open(
        os.path.splitext(sys.argv[1])[0] + '.json',
        'w',
        encoding='utf-8'
    ) as outfile:
    json.dump(json_obj, outfile, ensure_ascii=False, indent=4)