def build_final_response(extracted_data: dict) -> dict:
    print("🔥 FULL DATA 👉", extracted_data)

    # =========================
    # SAFE FETCH
    # =========================
    response = extracted_data.get("user_friendly_response", {})
    severity_data = extracted_data.get("severity_analysis", {})
    health_features = extracted_data.get("health_features", {})
    vitals = extracted_data.get("extracted_data", {})

    # =========================
    # BASE SUMMARY (ML)
    # =========================
    summary = response.get("summary", "")
    suggestions = response.get("suggestions", [])

    dynamic_summary_parts = []
    dynamic_suggestions = []

    # =========================
    # 🔥 MULTI CONDITION LOGIC
    # =========================

    # -------- Sleep --------
    sleep_flag = health_features.get("has_poor_sleep", 0)
    if sleep_flag:
        dynamic_summary_parts.append("Poor sleep pattern detected")
        dynamic_suggestions.append({
            "title": "Improve Sleep",
            "description": "Maintain 7-8 hours sleep",
            "type": "recommendation"
        })

    # -------- Activity --------
    activity_flag = health_features.get("has_low_activity", 0)
    if activity_flag:
        dynamic_summary_parts.append("Low physical activity detected")
        dynamic_suggestions.append({
            "title": "Increase Activity",
            "description": "Walk at least 7-8k steps daily",
            "type": "recommendation"
        })

    # -------- BP --------
    if health_features.get("has_high_bp", 0):
        dynamic_summary_parts.append("High blood pressure detected")
        dynamic_suggestions.append({
            "title": "Control BP",
            "description": "Reduce salt & monitor BP",
            "type": "alert"
        })

    # -------- Diabetes --------
    if health_features.get("has_diabetes", 0):
        dynamic_summary_parts.append("High sugar level detected")
        dynamic_suggestions.append({
            "title": "Control Sugar",
            "description": "Reduce sugar intake",
            "type": "alert"
        })

    # -------- Symptoms --------
    if health_features.get("has_chest_pain", 0):
        dynamic_summary_parts.append("Chest discomfort detected")

    if health_features.get("has_headache", 0):
        dynamic_summary_parts.append("Frequent headaches detected")

    # =========================
    # FINAL SUMMARY OVERRIDE
    # =========================
    if dynamic_summary_parts:
        summary = " | ".join(dynamic_summary_parts)
        suggestions = dynamic_suggestions

    # =========================
    # SEVERITY FIX
    # =========================
    severity = severity_data.get("severity_level", "low")

    # override based on conditions
    if health_features.get("has_high_bp", 0) or health_features.get("has_diabetes", 0):
        severity = "high"
    elif health_features.get("has_poor_sleep", 0) or health_features.get("has_low_activity", 0):
        severity = "medium"

    # =========================
    # FINAL OUTPUT
    # =========================
    return {
        "summary": summary or "Your health looks stable.",
        "severity": severity,
        "suggestions": suggestions or []
    }