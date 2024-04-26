from playlist_data import data1, data2, data3, data4

def get_ids(data):
    return [d['contentDetails']['videoId'] for d in data["items"]]

data = get_ids(data1) + get_ids(data2) + get_ids(data3) + get_ids(data4)

# print(data)
# print commands for every ten videos
for i in range(0, len(data), 10):
    print("python polymath/polymath.py -a " + ",".join(data[i:i+10]))

print("python polymath/polymath.py -v " + ",".join(data))