from typing import Dict, Any


def build_user_friendly_response(
    category: str,
    extracted_data: Dict[str, Any],
    risk_level: str,
    trend_analysis: Dict[str, Any],
    health_features: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Convert structured pipeline output into a user-friendly response.
    """

    summary_parts = []
    reasons = []
    suggestions = []

    # ---------- Summary ----------
    if "symptom" in extracted_data:
        summary_parts.append(f"Detected symptom: {extracted_data['symptom']}.")

    if "condition" in extracted_data:
        summary_parts.append(f"Detected condition-related input: {extracted_data['condition']}.")

    if "activity" in extracted_data:
        summary_parts.append(f"Detected routine/lifestyle factor: {extracted_data['activity']}.")

    if "medicine_name" in extracted_data:
        summary_parts.append(f"Detected medication mention: {extracted_data['medicine_name']}.")

    if not summary_parts:
        summary_parts.append("Your input was processed, but only limited health information could be understood.")

    # ---------- Reasons ----------
    if health_features.get("has_chest_pain", 0) == 1:
        reasons.append("chest pain has been detected in your recent records")

    if health_features.get("has_high_bp", 0) == 1:
        reasons.append("blood pressure-related risk is present")

    if health_features.get("has_poor_sleep", 0) == 1:
        reasons.append("poor sleep pattern is present")

    if health_features.get("has_low_activity", 0) == 1:
        reasons.append("low physical activity is present")

    if health_features.get("has_diabetes", 0) == 1:
        reasons.append("diabetes-related risk is present")

    trend = trend_analysis.get("trend", "stable")
    if trend == "watchlist":
        reasons.append("your recent health pattern suggests early warning signs")
    elif trend == "worsening":
        reasons.append("your recent health pattern appears to be worsening")

    # ---------- Suggestions ----------
    if health_features.get("has_poor_sleep", 0) == 1:
        suggestions.append("Try improving sleep timing and sleep quality.")

    if health_features.get("has_low_activity", 0) == 1:
        suggestions.append("Try increasing daily walking or light physical activity.")

    if health_features.get("has_high_bp", 0) == 1:
        suggestions.append("Keep monitoring blood pressure-related patterns regularly.")

    if health_features.get("has_chest_pain", 0) == 1:
        suggestions.append("Track chest discomfort carefully and avoid ignoring repeated symptoms.")

    if health_features.get("has_diabetes", 0) == 1:
        suggestions.append("Maintain a healthy food routine and keep monitoring sugar-related patterns.")

    if not suggestions:
        suggestions.append("Continue monitoring your health inputs regularly.")

    # ---------- Final explanation ----------
    if reasons:
        risk_explanation = f"Your current risk level is {risk_level} because " + ", ".join(reasons) + "."
    else:
        risk_explanation = f"Your current risk level is {risk_level} based on the available input."

    return {
        "summary": " ".join(summary_parts),
        "risk_explanation": risk_explanation,
        "suggestions": suggestions,
    }