from typing import Any, Dict, Tuple

from app.schemas.common_schema import HealthCategory, ProcessingStatus


def _count_non_empty_fields(extracted_data: Dict[str, Any]) -> int:
    count = 0
    for value in extracted_data.values():
        if value is None:
            continue
        if isinstance(value, str) and not value.strip():
            continue
        count += 1
    return count


def _clamp_score(value: float) -> float:
    if value < 0.0:
        return 0.0
    if value > 1.0:
        return 1.0
    return round(value, 2)


def _get_expected_fields(category: HealthCategory) -> list[str]:
    if category == HealthCategory.MEDICATION:
        return ["medicine_name", "dosage", "timing", "frequency"]

    if category == HealthCategory.FAMILY_HISTORY:
        return ["relation", "condition", "symptom"]

    if category == HealthCategory.ROUTINE:
        return ["activity", "duration", "frequency", "quantity"]

    if category == HealthCategory.SYMPTOM:
        return ["symptom", "frequency"]

    if category == HealthCategory.CONDITION:
        return ["condition"]

    return []


def _get_category_base_confidence(category: HealthCategory) -> float:
    if category == HealthCategory.MEDICATION:
        return 0.70
    if category == HealthCategory.FAMILY_HISTORY:
        return 0.80
    if category == HealthCategory.ROUTINE:
        return 0.72
    if category == HealthCategory.SYMPTOM:
        return 0.78
    if category == HealthCategory.CONDITION:
        return 0.82
    return 0.20


def calculate_score(category: HealthCategory, extracted_data: Dict[str, Any]) -> float:
    if category == HealthCategory.UNKNOWN:
        return 0.10 if extracted_data else 0.0

    expected_fields = _get_expected_fields(category)
    if not expected_fields:
        return 0.0

    filled_fields = 0
    for field in expected_fields:
        value = extracted_data.get(field)
        if value is None:
            continue
        if isinstance(value, str) and not value.strip():
            continue
        filled_fields += 1

    score = filled_fields / len(expected_fields)
    return _clamp_score(score)


def calculate_confidence(category: HealthCategory, extracted_data: Dict[str, Any]) -> float:
    base_confidence = _get_category_base_confidence(category)

    if category == HealthCategory.UNKNOWN:
        return 0.15 if extracted_data else 0.05

    non_empty_fields = _count_non_empty_fields(extracted_data)
    boost = min(non_empty_fields * 0.08, 0.25)

    confidence = base_confidence + boost
    return _clamp_score(confidence)


def get_processing_status(score: float, extracted_data: Dict[str, Any]) -> ProcessingStatus:
    non_empty_fields = _count_non_empty_fields(extracted_data)

    if non_empty_fields == 0:
        return ProcessingStatus.FAILED

    if score >= 0.6:
        return ProcessingStatus.SUCCESS

    return ProcessingStatus.PARTIAL


def generate_message(category: HealthCategory, status: ProcessingStatus, extracted_data: Dict[str, Any]) -> str:
    non_empty_fields = _count_non_empty_fields(extracted_data)

    if status == ProcessingStatus.FAILED:
        return "Could not extract meaningful health information"

    if category == HealthCategory.MEDICATION:
        if status == ProcessingStatus.SUCCESS:
            return "Medication information extracted successfully"
        return f"Partial medication information extracted ({non_empty_fields} field(s) found)"

    if category == HealthCategory.FAMILY_HISTORY:
        if status == ProcessingStatus.SUCCESS:
            return "Family history information extracted successfully"
        return f"Partial family history information extracted ({non_empty_fields} field(s) found)"

    if category == HealthCategory.ROUTINE:
        if status == ProcessingStatus.SUCCESS:
            return "Routine information extracted successfully"
        return f"Partial routine information extracted ({non_empty_fields} field(s) found)"

    if category == HealthCategory.SYMPTOM:
        if status == ProcessingStatus.SUCCESS:
            return "Symptom information extracted successfully"
        return f"Partial symptom information extracted ({non_empty_fields} field(s) found)"

    if category == HealthCategory.CONDITION:
        if status == ProcessingStatus.SUCCESS:
            return "Condition information extracted successfully"
        return f"Partial condition information extracted ({non_empty_fields} field(s) found)"

    return "Input processed with limited understanding"


def score_extraction(category: HealthCategory, extracted_data: Dict[str, Any]) -> Tuple[float, float, ProcessingStatus, str]:
    score = calculate_score(category, extracted_data)
    confidence = calculate_confidence(category, extracted_data)
    status = get_processing_status(score, extracted_data)
    message = generate_message(category, status, extracted_data)

    return score, confidence, status, message