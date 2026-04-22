def format_dashboard_response(raw):
    print("🔥 NEW FORMATTER RUNNING 🔥")

    # =========================
    # HEALTH SCORE
    # =========================
    score_value = raw.get("health_score", 0)

    health_score = {
        "value": score_value,
        "status": "Good" if score_value > 80 else "Moderate",
        "message": "Overall health based on vitals & lifestyle"
    }

    # =========================
    # DAILY ROUTINE
    # =========================
    routine = raw.get("daily_routine", {})

    daily_routine = {
        "completion": 75,
        "sleep": {
            "value": f"{routine.get('sleep', 0)} hrs",
            "progress": min((routine.get("sleep") or 0) * 10, 100)
        },
        "water": {
            "value": f"{routine.get('water', 0)} L",
            "progress": min((routine.get("water") or 0) * 25, 100)
        },
        "steps": {
            "value": f"{routine.get('steps', 0)}",
            "progress": min((routine.get("steps") or 0) / 100, 100)
        },
        "workout": {
            "value": f"{routine.get('workout', 0)} min",
            "progress": min((routine.get("workout") or 0), 100)
        }
    }

    # =========================
    # RISK ALERTS
    # =========================
    risk_raw = raw.get("risk_alerts", {})

    risk_alerts = [
        {"label": "Blood Pressure", "level": risk_raw.get("blood_pressure")},
        {"label": "Glucose", "level": risk_raw.get("glucose")},
        {"label": "Cholesterol", "level": risk_raw.get("cholesterol")},
    ]

    # =========================
    # ML DATA (FINAL FIX)
    # =========================
    ml = raw.get("ml_insights", {}) or {}
    print("ML DATA 👉", ml)

    # ✅ IMPORTANT: ML already flattened
    overview = ml.get("summary")

    # =========================
    # OVERVIEW FALLBACK
    # =========================
    if not overview:
        if risk_raw.get("blood_pressure") == "high":
            overview = "Your blood pressure needs attention."
        elif risk_raw.get("glucose") in ["medium", "high"]:
            overview = "Your glucose levels need monitoring."
        else:
            overview = "Your health is stable but can be improved."

    # =========================
    # SUGGESTIONS
    # =========================
    suggestions = [
        {
            "title": s.get("title", "Health Tip"),
            "description": s.get("description", ""),
            "type": s.get("type", "recommendation")
        }
        for s in (ml.get("suggestions") or [])
    ]

    # fallback suggestions
    if not suggestions:
        suggestions = [
            {
                "title": "Improve Sleep",
                "description": "Maintain 7-8 hours sleep daily",
                "type": "recommendation"
            },
            {
                "title": "Monitor Health",
                "description": "Track BP and sugar regularly",
                "type": "insight"
            }
        ]

    # =========================
    # PRIORITY (FINAL FIX)
    # =========================
    severity = ml.get("severity")

    if not severity:
        if risk_raw.get("blood_pressure") == "high":
            severity = "high"
        elif risk_raw.get("glucose") in ["medium", "high"]:
            severity = "medium"
        else:
            severity = "low"

    # =========================
    # AI SUMMARY
    # =========================
    ai_summary = {
        "headline": "AI Health Insight",
        "overview": overview,
        "priority": severity,
        "suggestions": suggestions
    }

    # =========================
    # FAMILY HISTORY
    # =========================
    family_history = [
        {
            "condition": item.get("disease"),
            "relation": item.get("member"),
            "risk": "medium"
        }
        for item in raw.get("family_history", [])
    ]

    # =========================
    # WEEKLY ACTIVITY
    # =========================
    weekly = raw.get("weekly_activity", {})

    weekly_activity = [
        {"day": k, "value": v * 10}
        for k, v in weekly.items()
    ]

    # =========================
    # FINAL RESPONSE
    # =========================
    return {
        "healthScore": health_score,
        "dailyRoutine": daily_routine,
        "riskAlerts": risk_alerts,
        "weeklyActivity": weekly_activity,
        "recentActivity": raw.get("recent_activity", []),
        "medications": raw.get("medications", []),
        "familyHistory": family_history,
        "aiSummary": ai_summary
    }