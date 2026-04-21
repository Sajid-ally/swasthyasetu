from typing import Dict, Any


def predict_future_risks(
    health_features: Dict[str, Any],
    trend_analysis: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Predict possible future health risk directions
    based on current history-derived features and trends.
    """

    cardiovascular_score = 0
    lifestyle_score = 0
    metabolic_score = 0

    trend = trend_analysis.get("trend", "stable")

    # -----------------------------
    # Cardiovascular risk scoring
    # -----------------------------
    if health_features.get("has_chest_pain", 0) == 1:
        cardiovascular_score += 3

    if health_features.get("has_high_bp", 0) == 1:
        cardiovascular_score += 2

    if trend == "worsening":
        cardiovascular_score += 2
    elif trend == "watchlist":
        cardiovascular_score += 1

    # -----------------------------
    # Lifestyle deterioration scoring
    # -----------------------------
    if health_features.get("has_poor_sleep", 0) == 1:
        lifestyle_score += 2

    if health_features.get("has_low_activity", 0) == 1:
        lifestyle_score += 2

    if trend == "worsening":
        lifestyle_score += 2
    elif trend == "watchlist":
        lifestyle_score += 1

    # -----------------------------
    # Metabolic risk scoring
    # -----------------------------
    if health_features.get("has_diabetes", 0) == 1:
        metabolic_score += 3

    if health_features.get("has_low_activity", 0) == 1:
        metabolic_score += 1

    if health_features.get("has_poor_sleep", 0) == 1:
        metabolic_score += 1

    # -----------------------------
    # Risk label helper
    # -----------------------------
    def get_risk_label(score: int) -> str:
        if score >= 5:
            return "high"
        elif score >= 3:
            return "medium"
        else:
            return "low"

    predictions = {
        "cardiovascular_future_risk": {
            "score": cardiovascular_score,
            "level": get_risk_label(cardiovascular_score),
            "reason": _build_cardio_reason(health_features, trend),
        },
        "lifestyle_future_risk": {
            "score": lifestyle_score,
            "level": get_risk_label(lifestyle_score),
            "reason": _build_lifestyle_reason(health_features, trend),
        },
        "metabolic_future_risk": {
            "score": metabolic_score,
            "level": get_risk_label(metabolic_score),
            "reason": _build_metabolic_reason(health_features, trend),
        },
    }

    return predictions


def _build_cardio_reason(health_features: Dict[str, Any], trend: str) -> str:
    reasons = []

    if health_features.get("has_chest_pain", 0) == 1:
        reasons.append("chest pain pattern is present")

    if health_features.get("has_high_bp", 0) == 1:
        reasons.append("blood pressure-related risk is present")

    if trend == "worsening":
        reasons.append("recent trend is worsening")
    elif trend == "watchlist":
        reasons.append("recent trend shows early warning signs")

    if reasons:
        return "Future cardiovascular risk may increase because " + ", ".join(reasons) + "."
    return "No strong cardiovascular risk pattern detected from current data."


def _build_lifestyle_reason(health_features: Dict[str, Any], trend: str) -> str:
    reasons = []

    if health_features.get("has_poor_sleep", 0) == 1:
        reasons.append("poor sleep pattern is present")

    if health_features.get("has_low_activity", 0) == 1:
        reasons.append("low activity pattern is present")

    if trend == "worsening":
        reasons.append("recent trend is worsening")
    elif trend == "watchlist":
        reasons.append("recent trend shows early warning signs")

    if reasons:
        return "Future lifestyle-related risk may increase because " + ", ".join(reasons) + "."
    return "No strong lifestyle deterioration pattern detected from current data."


def _build_metabolic_reason(health_features: Dict[str, Any], trend: str) -> str:
    reasons = []

    if health_features.get("has_diabetes", 0) == 1:
        reasons.append("diabetes-related pattern is present")

    if health_features.get("has_low_activity", 0) == 1:
        reasons.append("low activity is present")

    if health_features.get("has_poor_sleep", 0) == 1:
        reasons.append("poor sleep pattern is present")

    if reasons:
        return "Future metabolic risk may increase because " + ", ".join(reasons) + "."
    return "No strong metabolic risk pattern detected from current data."