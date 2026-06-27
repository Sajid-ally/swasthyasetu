import re


def safe_float(value, default=0.0):
    """
    Convert numbers like:
    3, 3.5, "3", "3L", "3 L", "120 min", "9000"
    into float safely.
    """
    if value is None:
        return default

    if isinstance(value, (int, float)):
        return float(value)

    if isinstance(value, str):
        match = re.search(r"\d+(\.\d+)?", value)
        if match:
            return float(match.group())

    return default


def format_dashboard_response(raw_data):
    print("🔥 FORMATTER RUNNING")

    member = raw_data

    name = member.get("name", "User")

    routine = member.get("routine", {}) or {}
    vitals = member.get("vitals", {}) or {}
    emergency = member.get("emergency", {}) or {}

    diseases = member.get("diseases", []) or []
    medications_raw = member.get("medications", []) or []
    family_history_raw = raw_data.get("family_history", []) if isinstance(raw_data, dict) else []

    # -------------------------
    # Routine values
    # -------------------------
    sleep = safe_float(routine.get("sleep_hours", 0))
    water = safe_float(routine.get("water_intake", 0))
    steps = safe_float(routine.get("steps", 0))
    workout = safe_float(routine.get("workout_minutes", 0))

    # progress caps
    sleep_progress = min((sleep / 8) * 100, 100) if sleep > 0 else 0
    water_progress = min((water / 3) * 100, 100) if water > 0 else 0
    steps_progress = min((steps / 8000) * 100, 100) if steps > 0 else 0
    workout_progress = min((workout / 60) * 100, 100) if workout > 0 else 0

    completion = int(
        (
            min((sleep / 8) * 25, 25) +
            min((water / 3) * 25, 25) +
            min((steps / 8000) * 25, 25) +
            min((workout / 60) * 25, 25)
        )
    )

    # -------------------------
    # Health score
    # -------------------------
    health_score_value = 80
    health_status = "Moderate"
    health_message = "Overall health based on vitals & lifestyle"

    # -------------------------
    # Risk alerts
    # -------------------------
    bp = str(vitals.get("bp", "120/80"))
    sugar = safe_float(vitals.get("sugar_level", 0))
    cholesterol = safe_float(vitals.get("cholesterol", 0))

    risk_alerts = [
        {
            "label": "Blood Pressure",
            "level": "high" if bp not in ["120/80", "110/70", "normal"] else "normal"
        },
        {
            "label": "Glucose",
            "level": "high" if sugar > 140 else ("low" if 0 < sugar < 70 else "normal")
        },
        {
            "label": "Cholesterol",
            "level": "high" if cholesterol > 200 else "normal"
        }
    ]

    # -------------------------
    # Weekly activity
    # -------------------------
    weekly_activity = [
        {"day": "monday", "value": 83.33},
        {"day": "tuesday", "value": 66.66},
        {"day": "wednesday", "value": 33.33},
        {"day": "thursday", "value": 100.0},
        {"day": "friday", "value": 50.0},
    ]

    # -------------------------
    # Recent activity
    # -------------------------
    recent_activity = [
        {
            "title": "dentist",
            "time": "11:00",
            "type": "checkup",
            "subtitle": "Dr. Nishant • India • "
        },
        {
            "title": "Back pain",
            "time": "11:00",
            "type": "checkup",
            "subtitle": "Dr. Yadav • India • "
        },
        {
            "title": "Kidney checkup",
            "time": "04:00",
            "type": "checkup",
            "subtitle": "Dr. Nishant • India • "
        }
    ]

    # -------------------------
    # Medications
    # -------------------------
    medications = []
    for med in medications_raw:
        if isinstance(med, dict):
            medications.append({
                "name": med.get("name", "Unknown medicine"),
                "dosage": med.get("dosage", "Not specified"),
                "time": med.get("time", "Not specified"),
                "status": med.get("status", "pending")
            })
        elif isinstance(med, str):
            medications.append({
                "name": med,
                "dosage": "1 tablet",
                "time": "After meal",
                "status": "pending"
            })

    # -------------------------
    # Family history
    # -------------------------
    family_history = []

    # If family_history already provided separately
    if isinstance(family_history_raw, list) and family_history_raw:
        for item in family_history_raw:
            if isinstance(item, dict):
                family_history.append({
                    "member": item.get("member", "Unknown"),
                    "disease": item.get("disease", "Not specified")
                })

    # fallback: build from members if available
    if not family_history and "members" in raw_data:
        for person in raw_data.get("members", []):
            if person.get("id") != member.get("id"):
                for disease in person.get("diseases", []):
                    family_history.append({
                        "member": person.get("name", "Unknown"),
                        "disease": disease
                    })

    # -------------------------
    # AI Summary
    # -------------------------
    ai_summary = {
        "headline": "AI Health Insight",
        "overview": "Health issues detected: oversleep, high cholesterol",
        "priority": "medium",
        "suggestions": [
            {
                "title": "Reduce Sleep Duration",
                "description": "Avoid oversleeping, maintain balanced routine"
            },
            {
                "title": "Reduce Cholesterol",
                "description": "Avoid fried food, eat oats, nuts, exercise daily"
            }
        ]
    }

    return {
        "name": name,
        "healthScore": {
            "value": health_score_value,
            "status": health_status,
            "message": health_message
        },
        "dailyRoutine": {
            "completion": completion,
            "sleep": {
                "value": f"{int(sleep) if sleep.is_integer() else sleep} hrs",
                "progress": round(sleep_progress)
            },
            "water": {
                "value": f"{int(water) if water.is_integer() else water} L",
                "progress": round(water_progress)
            },
            "steps": {
                "value": f"{int(steps)}",
                "progress": round(steps_progress)
            },
            "workout": {
                "value": f"{int(workout)} min",
                "progress": round(workout_progress)
            }
        },
        "riskAlerts": risk_alerts,
        "weeklyActivity": weekly_activity,
        "recentActivity": recent_activity,
        "medications": medications,
        "familyHistory": family_history,
        "aiSummary": ai_summary
    }