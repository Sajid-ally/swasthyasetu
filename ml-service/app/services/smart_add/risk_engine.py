from app.schemas.common_schema import HealthCategory, RiskLevel
from app.utils.constants import (
    HIGH_RISK_SYMPTOMS,
    MEDIUM_RISK_SYMPTOMS,
    HIGH_RISK_CONDITIONS,
    MEDIUM_RISK_CONDITIONS,
)


def get_risk_level(category: HealthCategory, extracted_data: dict) -> RiskLevel:
    if category == HealthCategory.SYMPTOM:
        symptom = extracted_data.get("symptom", "")
        frequency = extracted_data.get("frequency", "")

        if symptom in HIGH_RISK_SYMPTOMS:
            return RiskLevel.HIGH

        if symptom in MEDIUM_RISK_SYMPTOMS:
            if frequency in ["often", "daily"]:
                return RiskLevel.MEDIUM
            return RiskLevel.LOW

        return RiskLevel.LOW

    if category == HealthCategory.CONDITION:
        condition = extracted_data.get("condition", "")

        if condition in HIGH_RISK_CONDITIONS:
            return RiskLevel.HIGH

        if condition in MEDIUM_RISK_CONDITIONS:
            return RiskLevel.MEDIUM

        return RiskLevel.LOW

    if category == HealthCategory.FAMILY_HISTORY:
        if extracted_data.get("condition"):
            return RiskLevel.MEDIUM
        return RiskLevel.LOW

    if category == HealthCategory.MEDICATION:
        if extracted_data.get("medicine_name") and extracted_data.get("dosage"):
            return RiskLevel.LOW
        return RiskLevel.MEDIUM

    if category == HealthCategory.ROUTINE:
        return RiskLevel.LOW

    return RiskLevel.LOW