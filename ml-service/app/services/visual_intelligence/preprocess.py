import cv2

def load_image(image_path: str):
    return cv2.imread(image_path)

def preprocess_for_ocr(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    denoise = cv2.fastNlMeansDenoising(gray)
    thresh = cv2.threshold(denoise, 150, 255, cv2.THRESH_BINARY)[1]
    return thresh