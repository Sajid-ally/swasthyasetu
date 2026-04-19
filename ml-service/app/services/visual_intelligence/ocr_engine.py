import easyocr

reader = easyocr.Reader(['en'])

def run_ocr(image):
    results = reader.readtext(image)

    texts = []
    confidences = []

    for item in results:
        if len(item) >= 3:
            texts.append(item[1])
            confidences.append(item[2])

    avg_conf = sum(confidences) / len(confidences) if confidences else 0.0

    return {
        "texts": texts,
        "confidence": float(avg_conf),
        "raw_results": results
    }