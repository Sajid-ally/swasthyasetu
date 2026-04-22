def build_final_response(extracted_data: dict) -> dict:
    print("🔥 FULL DATA 👉", extracted_data)

    # =========================
    # CASE 1 → FULL STRUCTURE
    # =========================
    if "data" in extracted_data:
        final = (
            extracted_data.get("data", {})
            .get("extracted_data", {})
            .get("final_output")
        )

        if final:
            print("✅ USING FINAL OUTPUT (FULL STRUCTURE)")
            return final

    # =========================
    # CASE 2 → FLATTENED STRUCTURE
    # =========================
    if "user_friendly_response" in extracted_data:
        print("✅ USING FLATTENED ML OUTPUT")

        response = extracted_data.get("user_friendly_response", {})
        severity = extracted_data.get("severity_analysis", {})

        return {
            "health_score": extracted_data.get("health_score", {}).get("score", 0),
            "health_level": extracted_data.get("health_score", {}).get("level", "unknown"),

            "severity": severity.get("severity_level", "low"),
            "priority_score": severity.get("priority_score", 0),
            "alerts": severity.get("priority_tags", []),

            "summary": response.get("summary", "No summary available."),
            "risk_explanation": response.get("risk_explanation", ""),

            "timeline_summary": extracted_data.get("timeline_insights", {}).get(
                "timeline_summary", ""
            ),
            "pattern_notes": extracted_data.get("timeline_insights", {}).get(
                "pattern_notes", []
            ),

            "suggestions": [
                {"title": s, "description": ""} if isinstance(s, str) else s
                for s in response.get("suggestions", [])
            ],

            "followups": extracted_data.get("followup_questions", [])
        }

    # =========================
    # FALLBACK
    # =========================
    print("❌ FINAL OUTPUT NOT FOUND → FALLBACK")

    return {
        "health_score": 0,
        "health_level": "unknown",
        "severity": "low",
        "priority_score": 0,
        "alerts": [],
        "summary": "No summary available.",
        "risk_explanation": "No risk explanation available.",
        "timeline_summary": "No timeline insights available.",
        "pattern_notes": [],
        "suggestions": [],
        "followups": []
    }