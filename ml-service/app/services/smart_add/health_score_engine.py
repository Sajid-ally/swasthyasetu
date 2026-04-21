from typing import Dict, Any


def calculate_health_score(
    health_features: Dict[str, Any],
    current_risk_level: str,
    future_risk_predictions: Dict[str, Any],
    trend_analysis: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Calculate a user-friendly health score out of 100
    using current risk, features, future risk predictions, and trend.
    """

    score = 100
    deductions = []
    trend = trend_analysis.get("trend", "stable")

    # -----------------------------
    # Feature-based deductions
    # -----------------------------
    if health_features.get("has_chest_pain", 0) == 1:
        score -= 15
        deductions.append("chest pain pattern detected")

    if health_features.get("has_high_bp", 0) == 1:
        score -= 10
        deductions.append("blood pressure-related risk detected")

    if health_features.get("has_poor_sleep", 0) == 1:
        score -= 8
        deductions.append("poor sleep pattern detected")

    if health_features.get("has_low_activity", 0) == 1:
        score -= 8
        deductions.append("low activity pattern detected")

    if health_features.get("has_diabetes", 0) == 1:
        score -= 12
        deductions.append("diabetes-related pattern detected")

    # -----------------------------
    # Current risk deductions
    # -----------------------------
    if current_risk_level == "high":
        score -= 10
        deductions.append("current risk level is high")
    elif current_risk_level == "medium":
        score -= 6
        deductions.append("current risk level is medium")

    # -----------------------------
    # Future risk deductions
    # -----------------------------
    cardio_level = future_risk_predictions.get("cardiovascular_future_risk", {}).get("level", "low")
    lifestyle_level = future_risk_predictions.get("lifestyle_future_risk", {}).get("level", "low")
    metabolic_level = future_risk_predictions.get("metabolic_future_risk", {}).get("level", "low")

    if cardio_level == "high":
        score -= 8
        deductions.append("future cardiovascular risk is high")
    elif cardio_level == "medium":
        score -= 4
        deductions.append("future cardiovascular risk is medium")

    if lifestyle_level == "high":
        score -= 6
        deductions.append("future lifestyle risk is high")
    elif lifestyle_level == "medium":
        score -= 3
        deductions.append("future lifestyle risk is medium")

    if metabolic_level == "high":
        score -= 6
        deductions.append("future metabolic risk is high")
    elif metabolic_level == "medium":
        score -= 3
        deductions.append("future metabolic risk is medium")

    # -----------------------------
    # Trend deductions
    # -----------------------------
    if trend == "worsening":
        score -= 8
        deductions.append("recent health trend is worsening")
    elif trend == "watchlist":
        score -= 4
        deductions.append("recent health trend shows warning signs")

    # -----------------------------
    # Clamp score to 0–100
    # -----------------------------
    score = max(0, min(100, score))

    # -----------------------------
    # Labeling
    # -----------------------------
    if score >= 85:
        level = "good"
    elif score >= 70:
        level = "watchlist"
    elif score >= 50:
        level = "moderate_concern"
    else:
        level = "high_concern"

    # -----------------------------
    # Explanation
    # -----------------------------
    if deductions:
        explanation = "Health score reduced because " + ", ".join(deductions) + "."
    else:
        explanation = "Health score is strong based on current available information."

    return {
        "score": score,
        "level": level,
        "explanation": explanation,
        "deductions": deductions,
    }