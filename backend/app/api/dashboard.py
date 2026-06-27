from fastapi import APIRouter
from app.services.data_loader import load_family_data
from app.utils.dashboard_formatter import format_dashboard_response
from app.services.ml_client import call_ml

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =========================
# HELPER: BP CHECK
# =========================
def is_bp_high(bp: str) -> bool:
    try:
        sys, dia = map(int, bp.split("/"))
        return sys >= 140 or dia >= 90
    except:
        return False


# =========================
# HEALTH SCORE (FINAL FIXED)
# =========================
def calculate_health_score(member):
    score = 100

    routine = member.get("routine", {})
    vitals = member.get("vitals", {})
    lifestyle = member.get("lifestyle", {})

    sleep = routine.get("sleep_hours", 0)
    steps = routine.get("steps", 0)
    workout = routine.get("workout_minutes", 0)

    sugar = vitals.get("sugar_level", 0)
    bp = vitals.get("bp", "")
    cholesterol = vitals.get("cholesterol", 0)

    smoking = lifestyle.get("smoking", False)
    penalty=0
    # Sleep
    if sleep < 5:
        penalty +=15
    elif sleep < 6:
        penalty -= 10
    elif sleep < 7:
        penalty -= 5
    elif sleep > 10:
        penalty += 5  # oversleep

    # Steps
    if steps < 3000:
        penalty += 15
    elif steps < 6000:
        penalty -= 8

    # Workout
    if workout < 20:
        penalty += 10
    elif workout < 40:
        penalty += 5
    elif workout > 120:
        penalty += 5  # overtraining

    # BMI
    height = member.get("height_cm")
    weight = member.get("weight_kg")

    if height and weight:
        bmi = weight / ((height / 100) ** 2)
        if bmi < 18.5 or bmi > 25:
            penalty += 10

    # Sugar
    if sugar > 180:
        penalty += 15
    elif sugar > 140:
        penalty += 10

    # BP
    if is_bp_high(bp):
        penalty += 10

    # Cholesterol
    if cholesterol >= 240:
        penalty += 15
    elif cholesterol >= 200:
        penalty += 8

    # Smoking
    if smoking:
        penalty += 15
    penalty=min(penalty, 70 )  # cap max penalty
    final_score =100 - penalty
    return max(final_score, 0)


# =========================
# RISK ALERTS
# =========================
def get_risk_alerts(member):
    vitals = member.get("vitals", {})

    bp = vitals.get("bp", "")
    sugar = vitals.get("sugar_level", 0)
    cholesterol = vitals.get("cholesterol", 0)

    return {
        "blood_pressure": "high" if is_bp_high(bp) else "normal",

        "glucose": (
            "high" if sugar > 180
            else "medium" if sugar > 140
            else "low"
        ),

        "cholesterol": (
            "high" if cholesterol >= 240
            else "medium" if cholesterol >= 200
            else "low"
        )
    }


# =========================
# DASHBOARD API
# =========================
@router.get("/{user_id}")
def get_dashboard(user_id: str):
    data = load_family_data()

    user = next((m for m in data["members"] if m["id"] == user_id), None)
    if not user:
        return {"error": "User not found"}

    routine = user.get("routine", {})
    vitals = user.get("vitals", {})

    health_score = calculate_health_score(user)

    # FAMILY HISTORY
    family_history = []
    for m in data["members"]:
        if m["id"] != user_id:
            for d in m.get("diseases", []):
                family_history.append({
                    "member": m["name"],
                    "disease": d
                })

    # =========================
    # ML INPUT
    # =========================
    ml_text = f"""
    sleep {routine.get("sleep_hours", 0)} hours
    steps {routine.get("steps", 0)}
    workout {routine.get("workout_minutes", 0)}
    blood pressure {vitals.get("bp", "")}
    sugar level {vitals.get("sugar_level", 0)}
    cholesterol {vitals.get("cholesterol", 0)}
    """

    # =========================
    # ML CALL
    # =========================
    try:
        ml_data = call_ml({
            "text": ml_text,
            "user_id": user_id
        })
        print("ML DATA 👉", ml_data)
    except Exception as e:
        print("ML ERROR:", e)
        ml_data = {}

    # =========================
    # FINAL RESPONSE
    # =========================
    raw_response = {
        "name": user.get("name"),

        "health_score": health_score,

        "daily_routine": {
            "sleep": routine.get("sleep_hours", 0),
            "water": routine.get("water_intake", 0),
            "steps": routine.get("steps", 0),
            "workout": routine.get("workout_minutes", 0)
        },

        "risk_alerts": get_risk_alerts(user),
        "weekly_activity": routine.get("weekly_progress", {}),
        "recent_activity": user.get("timeline", [])[-3:],
        "medications": user.get("medications", []),
        "family_history": family_history,

        "ml_insights": ml_data
    }

    return format_dashboard_response(raw_response)