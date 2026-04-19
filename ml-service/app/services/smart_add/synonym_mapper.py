from typing import Dict, Any


SYNONYM_MAP = {
    # BP / hypertension
    "bp": "high bp",
    "blood pressure": "high bp",
    "high bp": "high bp",
    "bp high": "high bp",
    "hypertension": "high bp",

    # diabetes / sugar
    "sugar": "diabetes",
    "high sugar": "diabetes",
    "diabetes": "diabetes",
    "diabetic": "diabetes",

    # sleep
    "sleep": "poor sleep",
    "not sleeping well": "poor sleep",
    "sleep issue": "poor sleep",
    "poor sleep": "poor sleep",
    "lack of sleep": "poor sleep",

    # low activity
    "walk": "low activity",
    "walking less": "low activity",
    "little walking": "low activity",
    "low activity": "low activity",
    "inactive": "low activity",

    # symptom
    "chest pain": "chest pain",
    "chest discomfort": "chest pain",
}


def normalize_value(value: str) -> str:
    if not isinstance(value, str):
        return value

    cleaned = value.strip().lower()
    return SYNONYM_MAP.get(cleaned, cleaned)


def normalize_extracted_data(extracted_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize important extracted fields so history/trend logic stays consistent.
    """
    if not isinstance(extracted_data, dict):
        return {}

    normalized = dict(extracted_data)

    for key in ["symptom", "condition", "activity", "issue", "disease", "value"]:
        if key in normalized and isinstance(normalized[key], str):
            normalized[key] = normalize_value(normalized[key])

    return normalized