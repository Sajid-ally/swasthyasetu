from fastapi import APIRouter, UploadFile, File, Body
from datetime import datetime

from app.services.ocr_service import extract_text_from_upload_bytes
from app.services.report_parser import parse_report_with_ollama
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/report-command", tags=["Report Command"])


def clean_text(text: str) -> str:
    return str(text or "").strip()


def find_user(data, user_id: str):
    for member in data.get("members", []):
        if member.get("id") == user_id:
            return member
    return None


@router.post("/preview/{user_id}")
async def preview_report(
    user_id: str,
    file: UploadFile = File(...)
):
    """
    Preview medical report image/PDF.
    Does NOT save automatically.
    """
    if not file:
        return {
            "success": False,
            "message": "No report file received."
        }

    filename = file.filename or ""

    allowed = (
        filename.lower().endswith(".pdf")
        or filename.lower().endswith(".png")
        or filename.lower().endswith(".jpg")
        or filename.lower().endswith(".jpeg")
        or filename.lower().endswith(".webp")
    )

    if not allowed:
        return {
            "success": False,
            "message": "Only PDF or image report files are supported."
        }

    data = load_family_data()
    member = find_user(data, user_id)

    if not member:
        return {
            "success": False,
            "message": "User not found."
        }

    file_bytes = await file.read()

    if not file_bytes:
        return {
            "success": False,
            "message": "Empty report file received."
        }

    extracted = extract_text_from_upload_bytes(file_bytes, filename)

    if not extracted.get("success"):
        return {
            "success": False,
            "message": extracted.get("message", "Could not read report."),
            "report_text": "",
            "requires_confirmation": False
        }

    report_text = extracted.get("text") or extracted.get("ocr_text") or ""

    parsed = parse_report_with_ollama(report_text)

    return {
        "success": True,
        "message": "Report parsed. Please review before saving.",
        "file_name": filename,
        "file_type": "pdf" if filename.lower().endswith(".pdf") else "image",
        "report_text": report_text,
        "parsed": parsed,
        "requires_confirmation": True
    }


@router.post("/confirm/{user_id}")
def confirm_report(
    user_id: str,
    input_data: dict = Body(...)
):
    """
    Saves reviewed report summary into user's timeline.
    """
    data = load_family_data()
    member = find_user(data, user_id)

    if not member:
        return {
            "success": False,
            "message": "User not found."
        }

    parsed = input_data.get("parsed", input_data)

    if not isinstance(parsed, dict):
        return {
            "success": False,
            "message": "Invalid report data."
        }

    report_type = clean_text(parsed.get("report_type") or "general_report")
    summary = clean_text(parsed.get("summary") or "Medical report summary saved.")
    suggestion = clean_text(
        parsed.get("suggestion") or "Please consult a doctor for proper interpretation."
    )
    key_findings = parsed.get("key_findings", [])

    if not isinstance(key_findings, list):
        key_findings = []

    timeline_entry = {
        "id": f"report_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "type": "medical_report",
        "report_type": report_type,
        "summary": summary,
        "suggestion": suggestion,
        "key_findings": key_findings,
        "possible_attention_points": parsed.get("possible_attention_points", []),
        "disclaimer": "This is not a diagnosis. Please consult a qualified doctor.",
        "source": "report_ai",
        "created_at": datetime.now().isoformat()
    }

    member.setdefault("timeline", [])
    member["timeline"].append(timeline_entry)

    save_family_data(data)

    return {
        "success": True,
        "intent": "add",
        "module": "medical_report",
        "message": "Medical report summary saved to timeline.",
        "data": timeline_entry,
        "source": "report_ai"
    }