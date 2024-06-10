import cv2
import numpy as np
import argparse
from cv2.typing import MatLike
import time

def process_image(image_path):
    # Read the image
    img = cv2.imread(image_path)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # no need to apply GaussianBlur as we don't care about noise due to high threshold
    
    # Apply adaptive thresholding
    thresh = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY_INV)[1]
    cv2.imshow("Thresholded", thresh)

    # Invert the thresholded image (black background, white flashlights)
    thresh_inv = cv2.bitwise_not(thresh)
    
    # Find contours
    contours, _ = cv2.findContours(thresh_inv, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter contours by area to remove small noise
    min_area = 5
    max_area = 100
    flashlights = [cnt for cnt in contours if min_area <= cv2.contourArea(cnt) <= max_area]
    flashlights = sorted(flashlights, key=cv2.contourArea, reverse=True)
    # flashlights.reverse()
    
    return img, thresh_inv, flashlights

def draw_flashlights_and_count(img, flashlights, delay=0.001):
    # draw and show blank image with count
    count_img = np.zeros((100,300,3), np.uint8)
    cv2.putText(count_img, f"Count: 0", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    cv2.imshow("Count", count_img)
    for idx, cnt in enumerate(flashlights):
        x, y, w, h = cv2.boundingRect(cnt)
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        # clear count image
        count_img.fill(0)
        cv2.putText(count_img, f"Count: {idx+1}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.imshow("Count", count_img)
        cv2.imshow("Flashlights", img)
        cv2.waitKey(1)
        # time.sleep(delay)  # Staggered animation delay - not needed for cv2.waitKey
    return img

def draw_flashlights_and_count_left_right(img, flashlights, mid, delay=0.001) -> tuple[MatLike, (int, int)]:
    # draw and show blank images with counts for left and right
    cv2.namedWindow("Left Count", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Left Count", 200, 100)
    cv2.resizeWindow("Left Count", 300, 100)
    count_img_left = np.zeros((100,300,3), np.uint8)
    cv2.putText(count_img_left, f"Left: 0", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    cv2.imshow("Left Count", count_img_left)

    cv2.namedWindow("Right Count", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Right Count", 1000, 100)
    cv2.resizeWindow("Left Count", 300, 100)
    count_img_right = np.zeros((100,300,3), np.uint8)
    cv2.putText(count_img_right, f"Right: 0", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    cv2.imshow("Right Count", count_img_right)

    left_count = 0
    right_count = 0

    for idx, cnt in enumerate(flashlights):
        x, y, w, h = cv2.boundingRect(cnt)
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)
        if x < mid:
            left_count += 1
            # clear count image
            count_img_left.fill(0)
            cv2.putText(count_img_left, f"Left: {left_count}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.imshow("Left Count", count_img_left)
        else:
            right_count += 1
            # clear count image
            count_img_right.fill(0)
            cv2.putText(count_img_right, f"Right: {right_count}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.imshow("Right Count", count_img_right)

        cv2.imshow("Battle", img)
        cv2.waitKey(1)
        # time.sleep(delay)  # Staggered animation delay - not needed for cv2.waitKey
    return (img, (left_count, right_count))

def opinion_count(image_path):
    img, thresh_inv, flashlights = process_image(image_path)
    cv2.imshow("Original", img)
    cv2.imshow("Processed", thresh_inv)
    
    # Draw flashlights with staggered animation
    cv2.namedWindow("Flashlights", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Flashlights", 300, 200)
    img_with_boxes = draw_flashlights_and_count(img.copy(), flashlights)
    cv2.imshow("Flashlights", img_with_boxes)
    
    # Display images
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def battle_opinion(image_path):
    img, thresh_inv, flashlights = process_image(image_path)
    cv2.imshow("Original", img)
    cv2.imshow("Processed", thresh_inv)
    
    # Split image vertically
    h, w = img.shape[:2]
    mid = w // 2
    
    # Draw flashlights with staggered animation
    cv2.namedWindow("Battle", cv2.WINDOW_NORMAL)
    cv2.moveWindow("Battle", 300, 200)
    img_with_boxes, (left_count, right_count) = draw_flashlights_and_count_left_right(img.copy(), flashlights, mid)
    cv2.imshow("Battle", img_with_boxes)
    
    # Highlight winning side
    winner_overlay = np.zeros_like(img)
    if left_count > right_count:
        winner_overlay[:, :mid] = [0, 0, 255]  # Red for left side
    elif right_count > left_count:
        winner_overlay[:, mid:] = [0, 255, 0]  # Green for right side
    
    cv2.addWeighted(img_with_boxes, 1, winner_overlay, 0.5, 0, img_with_boxes)
    cv2.imshow("Battle", img_with_boxes)
    
    # Display images
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    parser = argparse.ArgumentParser(description="DJ Audience Flashlight Counter")
    parser.add_argument("--mode", choices=["opinion_count", "battle_opinion"], required=True)
    parser.add_argument("--image", required=True, help="Path to the input image")
    args = parser.parse_args()

    if args.mode == "opinion_count":
        opinion_count(args.image)
    else:
        battle_opinion(args.image)

if __name__ == "__main__":
    main()