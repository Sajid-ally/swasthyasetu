from fastapi import APIRouter
from app.services.data_loader import load_family_data
from app.utils.dashboard_formatter import format_dashboard_response

# 🔥 USE LOCAL ML PIPELINE INSTEAD
from app.services.smart_add.pipeline import process_health_text
print("🔥 DASHBOARD FILE LOADED")
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =========================
# HEALTH SCORE
# =========================
def calculate_health_score(member):
    score = 100

    # ✅ FIX: use routine instead of lifestyle
    sleep = member.get("routine", {}).get("sleep_hours", 0)

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
# RISK ALERTS
# =========================
def get_risk_alerts(member):
    vitals = member.get("vitals", {})

    bp = vitals.get("bp", "")
    sugar = vitals.get("sugar_level", 0)

    bp_status = "normal"
    if "140" in bp:
        bp_status = "high"

    sugar_status = "low"
    if sugar > 180:
        sugar_status = "high"
    elif sugar > 140:
        sugar_status = "medium"

    return {
        "blood_pressure": bp_status,
        "glucose": sugar_status,
        "cholesterol": "low"
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

    # BMI
    height = user.get("height_cm")
    weight = user.get("weight_kg")
    bmi = round(weight / ((height / 100) ** 2), 2) if height and weight else None

    # Health score
    health_score = calculate_health_score(user)

    # Routine + timeline
    routine = user.get("routine", {})
    timeline = user.get("timeline", [])[-3:]

    # Family history
    family_history = []
    for m in data["members"]:
        if m["id"] != user_id:
            for d in m.get("diseases", []):
                family_history.append({
                    "member": m["name"],
                    "disease": d
                })

    # =========================
    # ML INPUT (FIXED)
    # =========================
    ml_input_text = " ".join([
        *user.get("diseases", []),
        f"sleep {routine.get('sleep_hours', 0)} hours",   # ✅ FIX
        f"bp {user.get('vitals', {}).get('bp', '')}",
        f"sugar {user.get('vitals', {}).get('sugar_level', 0)}"
    ])

    # =========================
    # CALL LOCAL ML (FIXED)
    # =========================
    ml_result = process_health_text(
        text=ml_input_text,
        user_id=user_id
    )
    if ml_result.success:
       ml_data = ml_result.data.extracted_data.get("final_output", {})
    else:
      ml_data = {}
    print("ML DATA 👉", ml_data)
    ml_data = ml_result.data if ml_result.success else {}

    print("ML DATA 👉", ml_data)

    # =========================
    # FINAL RESPONSE
    # =========================
    raw_response = {
        "id": user["id"],
        "name": user["name"],
        "age": user.get("age"),
        "bmi": bmi,
        "health_score": health_score,

        "daily_routine": {
            "sleep": routine.get("sleep_hours"),
            "water": routine.get("water_intake"),
            "steps": routine.get("steps"),
            "workout": routine.get("workout_minutes")
        },

        "risk_alerts": get_risk_alerts(user),
        "weekly_activity": routine.get("weekly_progress", {}),
        "recent_activity": timeline,
        "medications": user.get("medications", []),
        "family_history": family_history,

        "ml_insights": ml_data
    }

    return format_dashboard_response(raw_response)