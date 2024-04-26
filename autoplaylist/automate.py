from selenium import webdriver
from selenium.webdriver.chrome.service import Service

chromedriver = "./chromedriver-win64/chromedriver.exe"

option = webdriver.ChromeOptions()

option.binary_location = "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe"
option.add_argument("--disable-extensions")
option.add_argument("--enable-chrome-browser-cloud-management")

s = Service(chromedriver)

driver = webdriver.Chrome(service=s, options=option)

driver.get("https://www.youtube.com/results?search_query=+Dhoom+Machale")

try:
    # Get the song (not the full song)
    videoRenderer = driver.find_elements("tagName", "ytd-video-renderer")

    if len(videoRenderer) == 0:
        raise "No video found"
    
    renderer = videoRenderer[0]
    if  "full song" in  str(renderer.find_element("id", "video-title").get_attribute("aria-label")).lower():
        renderer = videoRenderer[1]

    print("Fuond video - ", renderer.find_element("id", "video-title").get_attribute("aria-label"))

    # Get the three dots
    threeDots = renderer.find_element("id", "button")
    threeDots.click()

    # Click on save to playlist
    saveToPlaylist = driver.find_elements("tagName", "ytd-menu-service-item-renderer")
    saveToPlaylist[2].click()

    print("Clicked on save to playlist")

    # Click on the 2nd playlist
    playlist = driver.find_elements("tagName", "ytd-playlist-add-to-option-renderer")
    playlist[1].click()

    # Click on the cross button
    crossButton = driver.find_element("id", "dismiss-button")
    crossButton.click()

    print("Added to playlist")


except Exception as e:
    print(e)

driver.close()