# loop through the songs.txt file in /polymath directory
# for each line, get the artist and title
# and a title field to the database.json file and save it

import json
import os

os.chdir('polymath')

database_file = open('library/database.json','r', encoding="utf-8")
database = json.load(database_file)
database_file.close()

with open('songs.txt','r') as file:
    i = 0
    for s in file.readlines():
        s = s.strip()
        print(s)
        artist, title = s.split(',')
        artist = artist.strip()
        title = title.strip()
        database[i]['title'] = title
        database[i]['artist'] = artist
        i += 1

database_file = open('library/database.json','w')
json.dump(database,database_file)
database_file.close()