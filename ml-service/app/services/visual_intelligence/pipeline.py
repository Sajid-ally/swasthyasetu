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
            "error": "Invalid image",
            "manual_input_required": True,
            "missing_fields": ["medicine_name", "dosage"],
            "message": "Image could not be loaded. Please enter medicine details manually."
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
            "error": "No text detected",
            "manual_input_required": True,
            "missing_fields": ["medicine_name", "dosage"],
            "message": "No readable text was found. Please enter medicine details manually."
        }

    parsed = parse_medicine_fields(ocr_output)

    missing_fields = []

    if not parsed["medicine_name"]:
        missing_fields.append("medicine_name")

    if not parsed["dosage"]:
        missing_fields.append("dosage")

    manual_input_required = len(missing_fields) > 0

    if manual_input_required:
        message = "Some medicine details could not be detected. Please ask the user to enter: " + ", ".join(missing_fields)
    else:
        message = "Medicine details extracted successfully."

    return {
        "type": "medication",
        "medicine_name": parsed["medicine_name"],
        "dosage": parsed["dosage"],
        "confidence": parsed["confidence"],
        "detected_text": parsed["detected_text"],
        "error": None,
        "manual_input_required": manual_input_required,
        "missing_fields": missing_fields,
        "message": message
    }