from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =========================
# HEALTH SCORE FUNCTION
# =========================
def calculate_health_score(member):
    score = 100

    sleep = member.get("lifestyle", {}).get("sleep_hours", 0)
    if sleep < 6:
        score -= 15
    elif sleep < 7:
        score -= 5

    height = member.get("height_cm")
    weight = member.get("weight_kg")

    if height and weight:
        bmi = weight / ((height / 100) ** 2)
        if bmi < 18.5 or bmi > 25:
            score -= 15

    sugar = member.get("vitals", {}).get("sugar_level")
    if sugar and sugar > 140:
        score -= 10

    bp = member.get("vitals", {}).get("bp", "")
    if bp and "140" in bp:
        score -= 10

    return max(score, 0)


# =========================
# RISK ALERTS FUNCTION
# =========================
def get_risk_alerts(member):
    vitals = member.get("vitals", {})

    bp = vitals.get("bp", "")
    sugar = vitals.get("sugar_level", 0)

    # BP logic
    bp_status = "normal"
    if "140" in bp:
        bp_status = "high"

    # Sugar logic
    sugar_status = "low"
    if sugar > 180:
        sugar_status = "high"
    elif sugar > 140:
        sugar_status = "medium"

    return {
        "blood_pressure": bp_status,
        "glucose": sugar_status,
        "cholesterol": "low"  # static for now
    }


# =========================
# DASHBOARD API
# =========================
@router.get("/{user_id}")
def get_dashboard(user_id: str):
    data = load_family_data()

    user = None
    for member in data["members"]:
        if member["id"] == user_id:
            user = member
            break

    if not user:
        return {"error": "User not found"}

    # BMI
    height = user.get("height_cm")
    weight = user.get("weight_kg")

    bmi = None
    if height and weight:
        bmi = round(weight / ((height / 100) ** 2), 2)

    # Health Score
    health_score = calculate_health_score(user)

    # Routine Data
    routine = user.get("routine", {})

    # Recent Timeline (last 3)
    timeline = user.get("timeline", [])[-3:]

    # Family History
    family_history = []
    for member in data["members"]:
        if member["id"] != user_id:
            for disease in member.get("diseases", []):
                family_history.append({
                    "member": member["name"],
                    "disease": disease
                })

    return {
        "id": user["id"],
        "name": user["name"],
        "age": user.get("age"),

        # HEALTH
        "bmi": bmi,
        "health_score": health_score,

        # DAILY ROUTINE
        "daily_routine": {
            "sleep": routine.get("sleep_hours"),
            "water": routine.get("water_intake"),
            "steps": routine.get("steps"),
            "workout": routine.get("workout_minutes")
        },

        # RISK ALERTS
        "risk_alerts": get_risk_alerts(user),

        # WEEKLY GRAPH
        "weekly_activity": routine.get("weekly_progress", {}),

        # RECENT ACTIVITY
        "recent_activity": timeline,

        # MEDICATIONS
        "medications": user.get("medications", []),

        # AI SUMMARY (TEMP STATIC)
        "ai_summary": [
            "Your routine is stable but hydration needs attention",
            "Sleep consistency is improving",
            "Consider increasing water intake"
        ],

        # FAMILY HISTORY
        "family_history": family_history
    }