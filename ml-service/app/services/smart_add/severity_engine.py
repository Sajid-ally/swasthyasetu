from typing import Dict, Any, List


def calculate_severity_and_priority(
    health_features: Dict[str, Any],
    current_risk_level: str,
    future_risk_predictions: Dict[str, Any],
    health_score: Dict[str, Any],
    trend_analysis: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Calculate severity, priority score, reason, and tags
    based on current risk, future risk, trend, health score, and features.
    """

    priority_score = 0
    priority_tags: List[str] = []
    reasons: List[str] = []

    trend = trend_analysis.get("trend", "stable")
    score_value = health_score.get("score", 100)

    has_chest_pain = health_features.get("has_chest_pain", 0) == 1
    has_high_bp = health_features.get("has_high_bp", 0) == 1
    has_poor_sleep = health_features.get("has_poor_sleep", 0) == 1
    has_low_activity = health_features.get("has_low_activity", 0) == 1
    has_diabetes = health_features.get("has_diabetes", 0) == 1

    cardio_future = future_risk_predictions.get("cardiovascular_future_risk", {}).get("level", "low")
    lifestyle_future = future_risk_predictions.get("lifestyle_future_risk", {}).get("level", "low")
    metabolic_future = future_risk_predictions.get("metabolic_future_risk", {}).get("level", "low")

    # -----------------------------
    # Current risk contribution
    # -----------------------------
    if current_risk_level == "high":
        priority_score += 3
        reasons.append("current risk is high")
    elif current_risk_level == "medium":
        priority_score += 2
        reasons.append("current risk is medium")

    # -----------------------------
    # Feature contribution
    # -----------------------------
    if has_chest_pain:
        priority_score += 3
        priority_tags.append("cardio_alert")
        reasons.append("chest pain is present")

    if has_high_bp:
        priority_score += 2
        priority_tags.append("bp_alert")
        reasons.append("blood pressure-related issue is present")

    if has_poor_sleep:
        priority_score += 1
        priority_tags.append("sleep_risk")
        reasons.append("poor sleep pattern is present")

    if has_low_activity:
        priority_score += 1
        priority_tags.append("low_activity_risk")
        reasons.append("low activity pattern is present")

    if has_diabetes:
        priority_score += 2
        priority_tags.append("metabolic_alert")
        reasons.append("diabetes-related issue is present")

    # -----------------------------
    # Future risk contribution
    # -----------------------------
    if cardio_future == "high":
        priority_score += 2
        priority_tags.append("future_cardio_risk")
        reasons.append("future cardiovascular risk is high")
    elif cardio_future == "medium":
        priority_score += 1
        reasons.append("future cardiovascular risk is medium")

    if lifestyle_future == "high":
        priority_score += 1
        priority_tags.append("future_lifestyle_risk")
        reasons.append("future lifestyle risk is high")

    if metabolic_future == "high":
        priority_score += 1
        priority_tags.append("future_metabolic_risk")
        reasons.append("future metabolic risk is high")

    # -----------------------------
    # Trend contribution
    # -----------------------------
    if trend == "worsening":
        priority_score += 2
        priority_tags.append("worsening_trend")
        reasons.append("recent trend is worsening")
    elif trend == "watchlist":
        priority_score += 1
        priority_tags.append("watchlist_trend")
        reasons.append("recent trend shows warning signs")

    # -----------------------------
    # Health score contribution
    # -----------------------------
    if score_value < 40:
        priority_score += 2
        priority_tags.append("low_health_score")
        reasons.append("health score is critically low")
    elif score_value < 60:
        priority_score += 1
        priority_tags.append("reduced_health_score")
        reasons.append("health score is reduced")

    # -----------------------------
    # Combined risk bonus
    # -----------------------------
    if has_chest_pain and has_high_bp:
        priority_score += 1
        priority_tags.append("combined_cardio_risk")
        reasons.append("chest pain and high BP are appearing together")

    if has_poor_sleep and has_low_activity:
        priority_tags.append("combined_lifestyle_risk")

    if (has_chest_pain or has_high_bp) and (has_poor_sleep or has_low_activity):
        priority_score += 1
        priority_tags.append("combined_risk_alert")
        reasons.append("cardiovascular and lifestyle risks are appearing together")

    # -----------------------------
    # Severity labeling
    # -----------------------------
    if priority_score >= 9:
        severity_level = "urgent"
        priority_tags.append("urgent_attention")
    elif priority_score >= 6:
        severity_level = "high"
        priority_tags.append("high_priority")
    elif priority_score >= 3:
        severity_level = "moderate"
        priority_tags.append("moderate_priority")
    else:
        severity_level = "low"
        priority_tags.append("low_priority")

    # Remove duplicates while preserving order
    unique_tags = []
    seen = set()
    for tag in priority_tags:
        if tag not in seen:
            unique_tags.append(tag)
            seen.add(tag)

    # Build reason
    if reasons:
        priority_reason = "Priority increased because " + ", ".join(reasons) + "."
    else:
        priority_reason = "No strong priority concerns detected from current data."

    return {
        "severity_level": severity_level,
        "priority_score": priority_score,
        "priority_reason": priority_reason,
        "priority_tags": unique_tags,
    }