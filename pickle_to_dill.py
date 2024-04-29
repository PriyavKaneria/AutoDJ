import os
import pickle
import dill
from polymath.polymath import Video
import sys

def unpickle_and_repickle(file_path):
    # Unpickle the file using pickle
    with open(file_path, 'rb') as file:
        data = pickle.load(file)

    # Repickle the data using dill
    with open(file_path, 'wb') as file:
        dill.dump(data, file)

# Example usage
# file_path = sys.argv[1]
for file_path in os.listdir('polymath/library'):
    if file_path.endswith('.a'):
        path = os.path.join('polymath/library', file_path)
        unpickle_and_repickle(path)
        print(f"Successfully repickled {file_path}")