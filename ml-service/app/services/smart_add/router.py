from app.schemas.common_schema import HealthCategory


def route_text(text: str) -> HealthCategory:
    """
    Decide which health category the text belongs to.
    """

    if not isinstance(text, str):
        return HealthCategory.UNKNOWN

    text = text.lower().strip()

    medication_keywords = [
        "take",
        "taking",
        "tablet",
        "tablets",
        "medicine",
        "medication",
        "capsule",
        "capsules",
        "syrup",
        "dose",
        "dosage",
        "mg",
        "ml",
        "paracetamol",
        "ibuprofen",
        "aspirin",
        "metformin",
        "after dinner",
        "before dinner",
        "after lunch",
        "before lunch",
        "after breakfast",
        "before breakfast",
        "morning",
        "evening",
        "night",
    ]

    family_keywords = [
        "family history",
        "father",
        "mother",
        "papa",
        "mummy",
        "dad",
        "mom",
        "runs in family",
    ]

    symptom_keywords = [
        "chest pain",
        "chest discomfort",
        "headache",
        "fatigue",
        "fever",
        "pain",
        "dizziness",
        "weakness",
    ]

    routine_keywords = [
        "poor sleep",
        "low activity",
        "sleep",
        "walk",
        "walking",
        "exercise",
        "inactive",
        "routine",
        "daily",
    ]

    condition_keywords = [
        "high bp",
        "blood pressure",
        "bp",
        "diabetes",
        "sugar",
        "hypertension",
    ]

    for keyword in family_keywords:
        if keyword in text:
            return HealthCategory.FAMILY_HISTORY

    for keyword in medication_keywords:
        if keyword in text:
            return HealthCategory.MEDICATION

    for keyword in symptom_keywords:
        if keyword in text:
            return HealthCategory.SYMPTOM

    for keyword in routine_keywords:
        if keyword in text:
            return HealthCategory.ROUTINE

    for keyword in condition_keywords:
        if keyword in text:
            return HealthCategory.CONDITION

    return HealthCategory.UNKNOWN