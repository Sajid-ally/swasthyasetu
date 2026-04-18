from app.services.visual_intelligence.preprocess import load_image, preprocess_for_ocr
from app.services.visual_intelligence.ocr_engine import run_ocr
from app.services.visual_intelligence.parser import parse_medicine_fields

def process_medicine_image(image_path: str) -> dict:
    image = load_image(image_path)

    if image is None:
        return {
            "type": "medication",
            "medicine_name": None,
            "dosage": None,
            "confidence": 0.0,
            "detected_text": "",
            "error": "Invalid image"
        }

    processed = preprocess_for_ocr(image)
    ocr_output = run_ocr(processed)

    if not ocr_output["texts"]:
        return {
            "type": "medication",
            "medicine_name": None,
            "dosage": None,
            "confidence": 0.0,
            "detected_text": "",
            "error": "No text detected"
        }

    parsed = parse_medicine_fields(ocr_output)

    return {
        "type": "medication",
        **parsed,
        "error": None
    }