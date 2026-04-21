from app.schemas.common_schema import HealthCategory
from app.services.smart_add.risk_engine import get_risk_level


def test_symptom_high_risk():
    extracted_data = {
        "symptom": "chest pain",
        "frequency": "sometimes"
    }
    risk = get_risk_level(HealthCategory.SYMPTOM, extracted_data)
    assert risk.value == "high"


def test_symptom_medium_or_low_risk():
    extracted_data = {
        "symptom": "headache",
        "frequency": "daily"
    }
    risk = get_risk_level(HealthCategory.SYMPTOM, extracted_data)
    assert risk.value == "medium"


def test_family_history_medium_risk():
    extracted_data = {
        "relation": "father",
        "condition": "diabetes"
    }
    risk = get_risk_level(HealthCategory.FAMILY_HISTORY, extracted_data)
    assert risk.value == "medium"


def test_routine_low_risk():
    extracted_data = {
        "activity": "walk",
        "duration": "30 minutes",
        "frequency": "daily"
    }
    risk = get_risk_level(HealthCategory.ROUTINE, extracted_data)
    assert risk.value == "low"


def test_condition_medium_risk():
    extracted_data = {
        "condition": "hypertension"
    }
    risk = get_risk_level(HealthCategory.CONDITION, extracted_data)
    assert risk.value == "medium"


def test_condition_high_risk():
    extracted_data = {
        "condition": "heart disease"
    }
    risk = get_risk_level(HealthCategory.CONDITION, extracted_data)
    assert risk.value == "high"


def test_medication_low_risk():
    extracted_data = {
        "medicine_name": "crocin",
        "dosage": "500 mg"
    }
    risk = get_risk_level(HealthCategory.MEDICATION, extracted_data)
    assert risk.value == "low"


def test_medication_medium_risk_when_dosage_missing():
    extracted_data = {
        "medicine_name": "insulin"
    }
    risk = get_risk_level(HealthCategory.MEDICATION, extracted_data)
    assert risk.value == "medium"