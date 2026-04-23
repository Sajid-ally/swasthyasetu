def process_health_text(text: str):

    text = text.lower()

    summary = ""
    suggestions = []
    severity = "low"

    # =========================
    # RULE ENGINE (AI LOGIC)
    # =========================

    if "bp" in text or "blood pressure" in text:
        summary = "You may have high blood pressure risk."
        severity = "high"
        suggestions.append({
            "title": "Reduce salt intake",
            "description": "Avoid high sodium food",
            "type": "alert"
        })

    if "sugar" in text or "diabetes" in text:
        summary = "Your glucose levels may be elevated."
        severity = "medium"
        suggestions.append({
            "title": "Control sugar intake",
            "description": "Reduce sweets and refined carbs",
            "type": "recommendation"
        })

    if "sleep" in text:
        suggestions.append({
            "title": "Improve Sleep",
            "description": "Maintain 7-8 hours sleep",
            "type": "insight"
        })

    # fallback
    if not summary:
        summary = "Your health looks stable but can be improved."

    return {
        "summary": summary,
        "suggestions": suggestions,
        "severity": severity
    }