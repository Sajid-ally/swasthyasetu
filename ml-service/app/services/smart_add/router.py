from app.schemas.common_schema import HealthCategory
from app.utils.constants import (
    FAMILY_RELATIONS,
    HEALTH_CONDITIONS,
    ROUTINE_ACTIVITIES,
    COMMON_SYMPTOMS,
)


def route_text(text: str) -> HealthCategory:
    text = text.lower()

    medication_keywords = [
        "take", "taking", "tablet", "medicine", "medication",
        "dose", "dosage", "mg", "ml", "insulin", "metformin", "crocin", "dolo"
    ]
    if any(keyword in text for keyword in medication_keywords):
        return HealthCategory.MEDICATION

    if any(relation in text for relation in FAMILY_RELATIONS):
        return HealthCategory.FAMILY_HISTORY

    if any(activity in text for activity in ROUTINE_ACTIVITIES):
        return HealthCategory.ROUTINE

    if any(symptom in text for symptom in COMMON_SYMPTOMS):
        return HealthCategory.SYMPTOM

    condition_phrases = [
        "i have", "i am suffering from", "diagnosed with", "have"
    ]
    if any(condition in text for condition in HEALTH_CONDITIONS):
        if any(phrase in text for phrase in condition_phrases):
            return HealthCategory.CONDITION
        return HealthCategory.CONDITION

    return HealthCategory.UNKNOWN