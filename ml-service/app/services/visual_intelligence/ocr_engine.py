import easyocr

reader = easyocr.Reader(['en'])

def run_ocr(image):
    results = reader.readtext(image)
    texts = [item[1] for item in results]
    confidences = [item[2] for item in results]

    avg_conf = sum(confidences) / len(confidences) if confidences else 0.0

    return {
        "texts": texts,
        "confidence": float(avg_conf)
    }