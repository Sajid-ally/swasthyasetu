from fastapi import APIRouter, UploadFile, File, Body
from app.services.ocr_service import extract_text_from_image_bytes
from app.services.ollama_client import parse_with_ollama
from app.services.data_loader import load_family_data, save_family_data
import re

router = APIRouter(prefix="/image-command", tags=["Image Command"])


# =========================
# Basic Helpers
# =========================

def clean_text(text: str) -> str:
    return str(text or "").strip()


def lower_text(text: str) -> str:
    return clean_text(text).lower()


def find_user(data, user_id: str):
    for member in data.get("members", []):
        if member.get("id") == user_id:
            return member
    return None


# =========================
# OCR Cleanup Helpers
# =========================

def clean_medicine_name(name: str, ocr_text: str = "") -> str:
    """
    Cleans OCR/Ollama medicine name.

    Example:
    PARACETAMOL & KAPLET -> paracetamol
    PARACETAMOL KAPLET 500 mg ES -> paracetamol
    """
    raw = clean_text(name)

    # If Ollama gives empty name, try extracting from OCR text.
    if not raw:
        raw = clean_text(ocr_text)

    raw = raw.lower()

    # Remove dosage-like parts
    raw = re.sub(r"\b\d+(?:\.\d+)?\s*(mg|ml|g|mcg)\b", " ", raw)

    # Remove common packaging/type/noise words
    remove_words = {
        "tablet", "tablets", "tab", "tabs",
        "kaplet", "caplet", "capsule", "capsules",
        "strip", "strips", "syrup", "injection",
        "oral", "solution", "dose", "dosage",
        "mg", "ml", "g", "mcg",
        "es", "ip", "bp", "usp",
        "10", "k", "kopet", "kaplet",
        "pharmaceuticals", "limited", "ltd",
        "batch", "mfg", "exp", "mrp"
    }

    raw = raw.replace("&", " ")

    # Keep only alphabets and spaces
    raw = re.sub(r"[^a-zA-Z\s]", " ", raw)
    words = [word for word in raw.split() if word not in remove_words and len(word) > 2]

    if not words:
        return ""

    # For demo: first clean medicine-like word is usually enough
    return words[0]


def clean_dosage(dosage: str, ocr_text: str = "") -> str:
    """
    Cleans dosage.

    Example:
    500 mg ES -> 500mg
    """
    combined = f"{dosage} {ocr_text}".lower()

    match = re.search(r"\b(\d+(?:\.\d+)?)\s*(mg|ml|g|mcg)\b", combined)

    if match:
        return f"{match.group(1)}{match.group(2)}"

    return clean_text(dosage) or "Not specified"


def normalize_ocr_medicine_result(parsed: dict, ocr_text: str):
    """
    Converts Ollama output into clean medicine preview shape.
    """
    if not isinstance(parsed, dict):
        parsed = {}

    parsed_data = parsed.get("data", {})
    if not isinstance(parsed_data, dict):
        parsed_data = {}

    raw_medicine_name = (
        parsed_data.get("medicine_name")
        or parsed_data.get("name")
        or parsed_data.get("medicine")
        or ""
    )

    raw_dosage = parsed_data.get("dosage") or ""
    raw_time = parsed_data.get("time") or parsed_data.get("timing") or "Not specified"
    symptom = parsed_data.get("symptom") or ""

    medicine_name = clean_medicine_name(raw_medicine_name, ocr_text)
    dosage = clean_dosage(raw_dosage, ocr_text)

    return {
        "medicine_name": medicine_name,
        "dosage": dosage,
        "time": clean_text(raw_time) or "Not specified",
        "symptom": clean_text(symptom),
        "ocr_text": ocr_text,
    }


def parse_medicine_from_ocr_text(ocr_text: str):
    """
    Uses Ollama to parse OCR text into medicine fields.
    """
    prompt_text = f"""
Medicine image OCR text:
{ocr_text}

Task:
Extract medicine name, dosage, and timing if present.

Rules:
- Return only JSON.
- This is OCR text from a medicine strip or medicine box.
- Extract only what is visible.
- Do not add medical advice.
- Do not invent timing.
- If timing is not visible, use "Not specified".
- Remove packaging words like tablet, strip, kaplet, capsule from medicine name.

Expected JSON:
{{
  "intent": "add",
  "module": "medication",
  "confidence": 0.9,
  "data": {{
    "medicine_name": "paracetamol",
    "dosage": "500mg",
    "time": "Not specified",
    "symptom": ""
  }}
}}
"""

    return parse_with_ollama(prompt_text)


# =========================
# Preview Route
# =========================

@router.post("/preview/{user_id}")
async def preview_medicine_image(
    user_id: str,
    image: UploadFile = File(...)
):
    """
    OCR preview only.
    Does NOT save medicine automatically.
    """
    if not image:
        return {
            "success": False,
            "message": "No image received."
        }

    file_name = image.filename or ""
    suffix = ".png"

    if "." in file_name:
        suffix = "." + file_name.split(".")[-1].lower()

    image_bytes = await image.read()

    if not image_bytes:
        return {
            "success": False,
            "message": "Empty image received."
        }

    data = load_family_data()
    member = find_user(data, user_id)

    if not member:
        return {
            "success": False,
            "message": "User not found."
        }

    ocr_result = extract_text_from_image_bytes(image_bytes, suffix=suffix)

    if not ocr_result.get("success"):
        return {
            "success": False,
            "message": ocr_result.get("message", "OCR failed."),
            "ocr_text": ocr_result.get("ocr_text", ""),
            "requires_confirmation": False
        }

    ocr_text = ocr_result.get("ocr_text", "")

    parsed = parse_medicine_from_ocr_text(ocr_text)
    medicine_preview = normalize_ocr_medicine_result(parsed, ocr_text)

    # If medicine name is still empty, return preview but ask user to edit manually.
    if not medicine_preview.get("medicine_name"):
        return {
            "success": True,
            "message": "OCR text extracted, but medicine name needs manual correction.",
            "ocr_text": ocr_text,
            "parsed": medicine_preview,
            "ollama_raw": parsed,
            "requires_confirmation": True
        }

    return {
        "success": True,
        "message": "Medicine image parsed. Please confirm before saving.",
        "ocr_text": ocr_text,
        "parsed": medicine_preview,
        "ollama_raw": parsed,
        "requires_confirmation": True
    }


# =========================
# Confirm Route
# =========================

@router.post("/confirm/{user_id}")
def confirm_medicine_image(
    user_id: str,
    input_data: dict = Body(...)
):
    """
    Saves medicine only after user confirmation.
    """
    data = load_family_data()
    member = find_user(data, user_id)

    if not member:
        return {
            "success": False,
            "message": "User not found."
        }

    medicine_name = clean_medicine_name(
        input_data.get("medicine_name") or input_data.get("name") or ""
    )

    dosage = clean_dosage(input_data.get("dosage") or "")
    time = clean_text(input_data.get("time") or "Not specified")
    symptom = clean_text(input_data.get("symptom") or "")

    if not medicine_name:
        return {
            "success": False,
            "message": "Medicine name is required before saving."
        }

    fake_names = {
        "sleep", "slept", "water", "walked", "steps", "workout",
        "bp", "sugar", "cholesterol", "pressure", "headache", "fever",
        "pain", "cough", "tablet", "kaplet", "capsule"
    }

    if lower_text(medicine_name) in fake_names:
        return {
            "success": False,
            "message": "Detected name does not look like a medicine. Please edit before saving."
        }

    member.setdefault("medications", [])

    new_med = {
        "name": lower_text(medicine_name),
        "dosage": dosage,
        "time": time or "Not specified",
        "status": "pending",
        "source": "image_ocr"
    }

    if symptom:
        new_med["symptom"] = symptom

    for med in member["medications"]:
        if isinstance(med, dict):
            same_name = lower_text(med.get("name")) == lower_text(new_med["name"])
            same_dosage = lower_text(med.get("dosage")) == lower_text(new_med["dosage"])
            same_time = lower_text(med.get("time")) == lower_text(new_med["time"])

            if same_name and same_dosage and same_time:
                return {
                    "success": True,
                    "intent": "add",
                    "module": "medication",
                    "message": f"{medicine_name.title()} already exists in medication schedule.",
                    "data": new_med,
                    "source": "image_ocr"
                }

    member["medications"].append(new_med)
    save_family_data(data)

    return {
        "success": True,
        "intent": "add",
        "module": "medication",
        "message": f"Added {medicine_name.title()} from image after confirmation.",
        "data": new_med,
        "source": "image_ocr"
    }