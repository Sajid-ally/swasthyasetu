from typing import List, Dict, Any


def build_health_features(history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Convert user history into structured health-risk features.
    """

    if not isinstance(history, list):
        history = []

    values = []
    for record in history:
        value = record.get("value")
        if isinstance(value, str) and value.strip():
            values.append(value.strip().lower())

    value_set = set(values)

    features = {
        # binary features
        "has_chest_pain": int("chest pain" in value_set),
        "has_high_bp": int("high bp" in value_set),
        "has_poor_sleep": int("poor sleep" in value_set),
        "has_low_activity": int("low activity" in value_set),
        "has_diabetes": int("diabetes" in value_set),
        "has_headache": int("headache" in value_set),
        "has_fatigue": int("fatigue" in value_set),

        # raw counts
        "count_chest_pain": values.count("chest pain"),
        "count_high_bp": values.count("high bp"),
        "count_poor_sleep": values.count("poor sleep"),
        "count_low_activity": values.count("low activity"),
        "count_diabetes": values.count("diabetes"),
        "count_headache": values.count("headache"),
        "count_fatigue": values.count("fatigue"),
    }

    # grouped risk scores
    features["cardiac_risk_score"] = (
        features["has_chest_pain"] +
        features["has_high_bp"]
    )

    features["lifestyle_risk_score"] = (
        features["has_poor_sleep"] +
        features["has_low_activity"]
    )

    features["metabolic_risk_score"] = (
        features["has_diabetes"]
    )

    features["general_symptom_score"] = (
        features["has_headache"] +
        features["has_fatigue"]
    )

    # total risk factor count
    features["total_risk_factor_score"] = (
        features["cardiac_risk_score"] +
        features["lifestyle_risk_score"] +
        features["metabolic_risk_score"] +
        features["general_symptom_score"]
    )

    return features