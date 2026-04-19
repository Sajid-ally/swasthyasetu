import cv2

def load_image(image_path: str):
    return cv2.imread(image_path)

def preprocess_for_ocr(image):
    h, w = image.shape[:2]
    resized = cv2.resize(image, (w * 2, h * 2))
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    denoise = cv2.fastNlMeansDenoising(gray)
    thresh = cv2.adaptiveThreshold(
        denoise,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )
    return thresh