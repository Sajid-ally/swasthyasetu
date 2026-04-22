def format_dashboard_response(raw):
    print("🔥 FORMATTER RUNNING")

    routine = raw.get("daily_routine", {})
    risk_raw = raw.get("risk_alerts", {})
    ml = raw.get("ml_insights", {}) or {}

    sleep = routine.get("sleep", 0)
    steps = routine.get("steps", 0)
    water = routine.get("water", 0)
    workout = routine.get("workout", 0)

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
    # DAILY ROUTINE (FIXED MAX 100)
    # =========================
    completion = int(
        (sleep / 8 * 25) +
        (water / 3 * 25) +
        (steps / 8000 * 25) +
        (workout / 45 * 25)
    )

    completion = min(completion, 100)

    daily_routine = {
        "completion": completion,
        "sleep": {"value": f"{sleep} hrs", "progress": min(sleep * 12, 100)},
        "water": {"value": f"{water} L", "progress": min(water * 30, 100)},
        "steps": {"value": f"{steps}", "progress": min(steps / 80, 100)},
        "workout": {"value": f"{workout} min", "progress": min(workout * 2, 100)}
    }

    # =========================
    # RISK ALERTS
    # =========================
    risk_alerts = [
        {"label": "Blood Pressure", "level": risk_raw.get("blood_pressure")},
        {"label": "Glucose", "level": risk_raw.get("glucose")},
        {"label": "Cholesterol", "level": risk_raw.get("cholesterol")},
    ]

    # =========================
    # SMART AI SUMMARY (FINAL)
    # =========================
    issues = []
    suggestions = []

    if sleep < 6:
        issues.append("poor sleep")
        suggestions.append({
            "title": "Improve Sleep",
            "description": "Sleep 7–8 hours and maintain fixed bedtime"
        })

    if sleep > 10:
        issues.append("oversleep")
        suggestions.append({
            "title": "Reduce Sleep Duration",
            "description": "Avoid oversleeping, maintain balanced routine"
        })

    if steps < 4000:
        issues.append("low activity")
        suggestions.append({
            "title": "Increase Activity",
            "description": "Walk 7000–10000 steps daily"
        })

    if workout > 120:
        issues.append("over workout")
        suggestions.append({
            "title": "Avoid Overtraining",
            "description": "Give body proper rest days"
        })

    if risk_raw.get("blood_pressure") == "high":
        issues.append("high BP")
        suggestions.append({
            "title": "Control BP",
            "description": "Reduce salt, avoid stress, monitor regularly"
        })

    if risk_raw.get("glucose") in ["medium", "high"]:
        issues.append("high glucose")
        suggestions.append({
            "title": "Control Sugar",
            "description": "Avoid sweets and refined carbs"
        })

    if risk_raw.get("cholesterol") == "high":
        issues.append("high cholesterol")
        suggestions.append({
            "title": "Reduce Cholesterol",
            "description": "Avoid fried food, eat oats, nuts, exercise daily"
        })

    # =========================
    # FINAL SUMMARY
    # =========================
    if issues:
        overview = "Health issues detected: " + ", ".join(issues)
        severity = "high" if len(issues) >= 3 else "medium"
    else:
        overview = "Your health is stable and well maintained."
        severity = "low"
        suggestions = [{
            "title": "Healthy Lifestyle",
            "description": "Maintain good habits"
        }]

    # =========================
    # RECENT ACTIVITY FIX
    # =========================
    recent_activity = []
    for item in raw.get("recent_activity", []):
        recent_activity.append({
            "title": item.get("title"),
            "time": item.get("time"),
            "type": item.get("type"),
            "subtitle": f"{item.get('doctor','')} • {item.get('location','')} • {item.get('notes','')}"
        })

    # =========================
    # MEDICATION
    # =========================
    medications = [
        {
            "name": m,
            "dosage": "1 tablet",
            "time": "After meal",
            "status": "pending"
        }
        for m in raw.get("medications", [])
    ]

    # =========================
    # WEEKLY
    # =========================
    weekly_activity = [
        {"day": k, "value": min((v / 6) * 100, 100)}
        for k, v in raw.get("weekly_activity", {}).items()
    ]

    # =========================
    # FINAL
    # =========================
    return {
        "name": raw.get("name"),
        "healthScore": health_score,
        "dailyRoutine": daily_routine,
        "riskAlerts": risk_alerts,
        "weeklyActivity": weekly_activity,
        "recentActivity": recent_activity,
        "medications": medications,
        "familyHistory": raw.get("family_history", []),
        "aiSummary": {
            "headline": "AI Health Insight",
            "overview": overview,
            "priority": severity,
            "suggestions": suggestions
        }
    }