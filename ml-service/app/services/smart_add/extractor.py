import re

from app.utils.constants import (
    MEDICATION_TIMINGS,
    FAMILY_RELATIONS,
    HEALTH_CONDITIONS,
    ROUTINE_ACTIVITIES,
    FREQUENCY_WORDS,
    COMMON_SYMPTOMS,
    MEDICATION_STOPWORDS,
)


def extract_medication_data(text: str) -> dict:
    result = {}

    dosage_match = re.search(r"\b\d+\s?(mg|ml|g|mcg)\b", text)
    if dosage_match:
        result["dosage"] = dosage_match.group()

    for timing in sorted(MEDICATION_TIMINGS, key=len, reverse=True):
        if timing in text:
            result["timing"] = timing
            break

    medicine_match = re.search(
        r"(take|taking|tablet|medicine|medication)\s+([a-zA-Z]+)",
        text
    )
    if medicine_match:
        result["medicine_name"] = medicine_match.group(2).lower()
    else:
        words = text.split()
        for word in words:
            clean_word = re.sub(r"[^a-zA-Z]", "", word).lower()
            if clean_word and clean_word not in MEDICATION_STOPWORDS:
                if clean_word not in {
                    "after", "before", "dinner", "lunch", "breakfast",
                    "morning", "evening", "night"
                }:
                    result["medicine_name"] = clean_word
                    break

    return result


def extract_family_history_data(text: str) -> dict:
    result = {}

    # Longer words first, so "grandfather" matches before "father"
    for relation in sorted(FAMILY_RELATIONS, key=len, reverse=True):
        pattern = rf"\b{re.escape(relation)}\b"
        if re.search(pattern, text):
            result["relation"] = relation
            break

    for condition in HEALTH_CONDITIONS:
        pattern = rf"\b{re.escape(condition)}\b"
        if re.search(pattern, text):
            result["condition"] = condition
            break

    return result


def extract_routine_data(text: str) -> dict:
    result = {}

    detected_activity = None
    for activity in sorted(ROUTINE_ACTIVITIES, key=len, reverse=True):
        pattern = rf"\b{re.escape(activity)}\b"
        if re.search(pattern, text):
            detected_activity = activity
            break

    if detected_activity:
        if ("drink" in text or "drinking" in text) and "water" in text:
            result["activity"] = "drink water"
        elif detected_activity in ["walking", "walk"]:
            result["activity"] = "walk"
        elif detected_activity in ["running", "run"]:
            result["activity"] = "run"
        elif detected_activity in ["sleeping", "sleep"]:
            result["activity"] = "sleep"
        elif detected_activity in ["drinking", "drink"]:
            result["activity"] = "drink"
        else:
            result["activity"] = detected_activity

    duration_match = re.search(r"\b\d+\s?(minutes|minute|hours|hour|hrs|hr)\b", text)
    if duration_match:
        result["duration"] = duration_match.group()

    quantity_match = re.search(r"\b\d+(\.\d+)?\s?(liters|liter|l|glasses|glass|km)\b", text)
    if quantity_match:
        quantity = quantity_match.group()
        if "km" in quantity:
            result["distance"] = quantity
        else:
            result["quantity"] = quantity

    for freq in sorted(FREQUENCY_WORDS, key=len, reverse=True):
        if freq in text:
            result["frequency"] = freq
            break

    return result


def extract_symptom_data(text: str) -> dict:
    result = {}

    for symptom in sorted(COMMON_SYMPTOMS, key=len, reverse=True):
        pattern = rf"\b{re.escape(symptom)}\b"
        if re.search(pattern, text):
            if symptom == "dizzy":
                result["symptom"] = "dizziness"
            else:
                result["symptom"] = symptom
            break

    if "feel dizzy" in text and "symptom" not in result:
        result["symptom"] = "dizziness"

    for freq in sorted(FREQUENCY_WORDS, key=len, reverse=True):
        if freq in text:
            result["frequency"] = freq
            break

    return result


def extract_condition_data(text: str) -> dict:
    result = {}

    for condition in sorted(HEALTH_CONDITIONS, key=len, reverse=True):
        pattern = rf"\b{re.escape(condition)}\b"
        if re.search(pattern, text):
            result["condition"] = condition
            break

    return result


def extract_unknown_data(text: str) -> dict:
    return {"raw_text": text}


def extract_fields(text: str, category) -> dict:
    category_value = category.value if hasattr(category, "value") else str(category)

    if category_value == "medication":
        return extract_medication_data(text)
    elif category_value == "family_history":
        return extract_family_history_data(text)
    elif category_value == "routine":
        return extract_routine_data(text)
    elif category_value == "symptom":
        return extract_symptom_data(text)
    elif category_value == "condition":
        return extract_condition_data(text)
    else:
        return extract_unknown_data(text)