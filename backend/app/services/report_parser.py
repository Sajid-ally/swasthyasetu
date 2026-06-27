import json
import re
from app.services.ollama_client import parse_with_ollama


def clean_text(text: str) -> str:
    return str(text or "").strip()


def normalize_report_ocr_text(text: str) -> str:
    """
    Fix common OCR mistakes seen in report screenshots.
    """
    text = clean_text(text)

    replacements = {
        "opm": "bpm",
        "Opm": "bpm",
        "Bpm": "bpm",
        "mgd": "mg/dL",
        "maid": "mg/dL",
        "mgdl": "mg/dL",
        "mg/d": "mg/dL",
        "Cholestere!": "Cholesterol",
        "Cholestere": "Cholesterol",
        "Cholestero!": "Cholesterol",
        "Hemogiobin": "Hemoglobin",
        "HemogioBin": "Hemoglobin",
        "Hemoglobin Ate": "Hemoglobin A1c",
        "Hemogiobin Ate": "Hemoglobin A1c",
        "Hemoglobin Alc": "Hemoglobin A1c",
        "Ate": "A1c",
        "Diabates": "Diabetes",
        "Diabetes.": "Diabetes",
        "exacerberation": "exacerbation",
        "Lisinoprotinb": "Lisinopril",
        "Lisinoprotin": "Lisinopril",
        "metformin": "Metformin",
    }

    for wrong, right in replacements.items():
        text = text.replace(wrong, right)

    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_json_from_text(text: str):
    if not text:
        return None

    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{[\s\S]*\}", text)

    if not match:
        return None

    try:
        return json.loads(match.group())
    except Exception:
        return None


def normalize_bp_value(raw_value: str):
    """
    Fix OCR BP values:
    13036 -> 130/86 or 130/36 depending OCR.
    Since medical BP normally has systolic 2-3 digits and diastolic 2 digits,
    try to infer safely.
    """
    value = clean_text(raw_value)
    digits = re.sub(r"\D", "", value)

    if "/" in value:
        match = re.search(r"(\d{2,3})\s*/\s*(\d{2,3})", value)
        if match:
            return f"{match.group(1)}/{match.group(2)} mmHg"

    # Common OCR for 130/86 becomes 13086 or 13036
    if len(digits) == 5:
        systolic = digits[:3]
        diastolic = digits[3:]

        # If OCR makes 86 look like 36, this still needs user review.
        return f"{systolic}/{diastolic} mmHg"

    if len(digits) == 4:
        systolic = digits[:2]
        diastolic = digits[2:]
        return f"{systolic}/{diastolic} mmHg"

    return value


def get_status_for_finding(name: str, numeric_value):
    """
    Demo-level common range flags. Not diagnosis.
    """
    name_l = name.lower()

    try:
        value = float(numeric_value)
    except Exception:
        return "unknown"

    if "heart rate" in name_l:
        if value < 60:
            return "low"
        if value > 100:
            return "high"
        return "normal"

    if "bmi" in name_l or "body mass" in name_l:
        if value < 18.5:
            return "low"
        if value >= 25:
            return "attention_needed"
        return "normal"

    if "cholesterol" in name_l:
        if value >= 200:
            return "attention_needed"
        return "normal"

    if "a1c" in name_l:
        if value >= 6.5:
            return "high"
        if value >= 5.7:
            return "attention_needed"
        return "normal"

    return "unknown"


def extract_structured_findings(report_text: str):
    """
    Regex-first extraction for common report fields.
    This improves accuracy before/after Ollama.
    """
    text = normalize_report_ocr_text(report_text)
    findings = []

    # Blood pressure
    bp_match = re.search(
        r"blood pressure[^0-9]{0,30}(\d{2,5}\s*(?:/)?\s*\d{0,3})\s*mmhg",
        text,
        re.IGNORECASE,
    )
    if bp_match:
        bp_value = normalize_bp_value(bp_match.group(1))
        findings.append({
            "name": "Blood Pressure",
            "value": bp_value,
            "unit": "mmHg",
            "status": "attention_needed",
            "note": "Blood pressure value extracted from report. Please verify because OCR may confuse '/' or digits."
        })

    # Heart rate
    hr_match = re.search(
        r"heart rate[^0-9]{0,30}(\d{2,3})\s*(bpm|opm)?",
        text,
        re.IGNORECASE,
    )
    if hr_match:
        value = hr_match.group(1)
        findings.append({
            "name": "Heart Rate",
            "value": f"{value} bpm",
            "unit": "bpm",
            "status": get_status_for_finding("Heart Rate", value),
            "note": ""
        })

    # BMI
    bmi_match = re.search(
        r"(body mass index|bmi)[^0-9]{0,30}(\d{2,3}(?:\.\d+)?)",
        text,
        re.IGNORECASE,
    )
    if bmi_match:
        raw = bmi_match.group(2)

        # If OCR reads 27.5 as 275 or 278 sometimes.
        if "." not in raw and len(raw) == 3:
            value = f"{raw[:2]}.{raw[2:]}"
        else:
            value = raw

        findings.append({
            "name": "Body Mass Index",
            "value": value,
            "unit": "",
            "status": get_status_for_finding("BMI", value),
            "note": "BMI value extracted from report."
        })

    # Cholesterol
    chol_match = re.search(
        r"cholesterol[^0-9]{0,30}(\d{2,4})\s*(mg/dl|mg/dL)?",
        text,
        re.IGNORECASE,
    )
    if chol_match:
        value = chol_match.group(1)
        findings.append({
            "name": "Cholesterol",
            "value": f"{value} mg/dL",
            "unit": "mg/dL",
            "status": get_status_for_finding("Cholesterol", value),
            "note": "Cholesterol value extracted from report."
        })

    # Hemoglobin A1c
    a1c_match = re.search(
        r"(hemoglobin\s*a1c|a1c)[^0-9]{0,30}(\d+(?:\.\d+)?)\s*%?",
        text,
        re.IGNORECASE,
    )
    if a1c_match:
        value = a1c_match.group(2)
        findings.append({
            "name": "Hemoglobin A1c",
            "value": f"{value}%",
            "unit": "%",
            "status": get_status_for_finding("A1c", value),
            "note": "A1c value extracted from report."
        })

    return findings


def merge_findings(regex_findings, ollama_findings):
    """
    Prefer regex findings for known numeric fields, add Ollama findings if unique.
    """
    merged = []
    seen = set()

    for item in regex_findings:
        name_key = clean_text(item.get("name")).lower()
        if name_key and name_key not in seen:
            merged.append(item)
            seen.add(name_key)

    for item in ollama_findings:
        if not isinstance(item, dict):
            continue

        name_key = clean_text(item.get("name")).lower()
        if name_key and name_key not in seen:
            merged.append({
                "name": clean_text(item.get("name")),
                "value": clean_text(item.get("value")),
                "unit": clean_text(item.get("unit")),
                "status": clean_text(item.get("status") or "unknown"),
                "note": clean_text(item.get("note")),
            })
            seen.add(name_key)

    return merged


def build_report_prompt(report_text: str) -> str:
    normalized_text = normalize_report_ocr_text(report_text)

    return f"""
You are SwasthyaSetu Medical Report Parser.

Your task:
Convert medical report text into safe structured JSON for a health dashboard.

VERY IMPORTANT SAFETY RULES:
- Do NOT diagnose disease.
- Do NOT prescribe medicine.
- Do NOT give treatment.
- Only summarize visible report values.
- Use cautious wording like "may need attention".
- Always suggest consulting a doctor for interpretation.
- Return ONLY valid JSON.
- No markdown.
- No explanation outside JSON.

Common OCR corrections:
- Blood pressure like 13086 may mean 130/86 mmHg.
- opm likely means bpm.
- Cholestere or Cholestere! likely means Cholesterol.
- Hemogiobin Ate likely means Hemoglobin A1c.

Allowed status values:
- normal
- low
- high
- attention_needed
- unknown

Required JSON format:
{{
  "report_type": "annual_health_summary | blood_test | urine_test | thyroid_test | lipid_profile | liver_function | kidney_function | general_report | unknown",
  "confidence": 0.0,
  "key_findings": [
    {{
      "name": "Hemoglobin A1c",
      "value": "6.2%",
      "unit": "%",
      "status": "attention_needed",
      "note": "Value may need attention."
    }}
  ],
  "summary": "Short non-diagnostic summary.",
  "suggestion": "Please consult a doctor for proper interpretation.",
  "possible_attention_points": []
}}

Report text:
{normalized_text}
""".strip()


def parse_report_with_ollama(report_text: str):
    """
    Uses regex + Ollama for report parsing.
    Regex improves important numeric extraction; Ollama improves summary.
    """
    normalized_text = normalize_report_ocr_text(report_text)

    regex_findings = extract_structured_findings(normalized_text)

    prompt = build_report_prompt(normalized_text)
    parsed = parse_with_ollama(prompt)

    if isinstance(parsed, dict):
        normalized = normalize_report_result(parsed)
        normalized["key_findings"] = merge_findings(
            regex_findings,
            normalized.get("key_findings", [])
        )

        if regex_findings:
            attention_names = [
                item["name"]
                for item in normalized["key_findings"]
                if item.get("status") in ["high", "low", "attention_needed"]
            ]

            normalized["possible_attention_points"] = list(set(
                normalized.get("possible_attention_points", []) + attention_names
            ))

        return normalized

    fallback = fallback_report_parse(normalized_text)
    fallback["key_findings"] = merge_findings(
        regex_findings,
        fallback.get("key_findings", [])
    )

    return fallback


def normalize_report_result(parsed: dict):
    if not isinstance(parsed, dict):
        parsed = {}

    report_type = clean_text(parsed.get("report_type") or "general_report")
    confidence = parsed.get("confidence", 0.5)

    try:
        confidence = float(confidence)
    except Exception:
        confidence = 0.5

    key_findings = parsed.get("key_findings", [])
    if not isinstance(key_findings, list):
        key_findings = []

    cleaned_findings = []

    for item in key_findings:
        if not isinstance(item, dict):
            continue

        cleaned_findings.append({
            "name": clean_text(item.get("name")),
            "value": clean_text(item.get("value")),
            "unit": clean_text(item.get("unit")),
            "status": clean_text(item.get("status") or "unknown"),
            "note": clean_text(item.get("note")),
        })

    summary = clean_text(parsed.get("summary"))
    suggestion = clean_text(parsed.get("suggestion"))

    attention_points = parsed.get("possible_attention_points", [])
    if not isinstance(attention_points, list):
        attention_points = []

    if not summary:
        summary = "Report values were extracted. Some values may need attention if outside reference range."

    if not suggestion:
        suggestion = "Please consult a doctor for proper interpretation."

    return {
        "report_type": report_type or "general_report",
        "confidence": confidence,
        "key_findings": cleaned_findings,
        "summary": summary,
        "suggestion": suggestion,
        "possible_attention_points": attention_points,
        "disclaimer": "This is not a diagnosis. Please consult a qualified doctor."
    }


def fallback_report_parse(report_text: str):
    text = normalize_report_ocr_text(report_text)

    regex_findings = extract_structured_findings(text)

    return {
        "report_type": "general_report",
        "confidence": 0.4,
        "key_findings": regex_findings,
        "summary": "Report text was extracted. Some values were detected, but interpretation needs review.",
        "suggestion": "Please consult a doctor for proper interpretation.",
        "possible_attention_points": [
            item["name"]
            for item in regex_findings
            if item.get("status") in ["high", "low", "attention_needed"]
        ],
        "disclaimer": "This is not a diagnosis. Please consult a qualified doctor."
    }