from typing import Dict, Any
from app.schemas.common_schema import RiskLevel


def get_enhanced_risk_level(
    category,
    extracted_data: Dict[str, Any],
    health_features: Dict[str, Any],
    trend_analysis: Dict[str, Any],
) -> RiskLevel:
    """
    Advanced risk calculation using:
    - current extracted data
    - historical features
    - trend analysis
    """

    # Base risk from current input
    base_risk = RiskLevel.LOW

    value = extracted_data.get("symptom") or extracted_data.get("condition")

    if value == "chest pain":
        base_risk = RiskLevel.HIGH
    elif value in ["high bp", "diabetes"]:
        base_risk = RiskLevel.MEDIUM
    elif value in ["poor sleep", "low activity"]:
        base_risk = RiskLevel.LOW

    # Feature-based scoring
    risk_score = 0

    risk_score += health_features.get("cardiac_risk_score", 0) * 2
    risk_score += health_features.get("lifestyle_risk_score", 0)
    risk_score += health_features.get("metabolic_risk_score", 0)

    # Trend influence
    trend = trend_analysis.get("trend", "stable")

    if trend == "worsening":
        risk_score += 3
    elif trend == "watchlist":
        risk_score += 1

    # Final risk decision
    if risk_score >= 5:
        return RiskLevel.HIGH
    elif risk_score >= 2:
        return RiskLevel.MEDIUM
    else:
        return base_risk