from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =========================
# HEALTH SCORE FUNCTION
# =========================
def calculate_health_score(member):
    score = 100

    # Sleep factor
    sleep = member.get("lifestyle", {}).get("sleep_hours", 0)
    if sleep < 6:
        score -= 15
    elif sleep < 7:
        score -= 5

    # BMI factor
    height = member.get("height_cm")
    weight = member.get("weight_kg")

    if height and weight:
        bmi = weight / ((height / 100) ** 2)

        if bmi < 18.5 or bmi > 25:
            score -= 15

    # Sugar level
    sugar = member.get("vitals", {}).get("sugar_level")
    if sugar and sugar > 140:
        score -= 10

    # BP factor (simple check)
    bp = member.get("vitals", {}).get("bp", "")
    if bp and "140" in bp:
        score -= 10

    return max(score, 0)


# =========================
# DASHBOARD API
# =========================
@router.get("/{user_id}")
def get_dashboard(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            height = member.get("height_cm")
            weight = member.get("weight_kg")

            bmi = None
            if height and weight:
                height_m = height / 100
                bmi = round(weight / (height_m ** 2), 2)

            # ✅ NEW: health score
            health_score = calculate_health_score(member)

            return {
                "id": member["id"],
                "name": member["name"],
                "age": member["age"],
                "bmi": bmi,
                "health_score": health_score,   # 🔥 NEW FIELD
                "diseases": member.get("diseases", []),
                "lifestyle": member.get("lifestyle", {}),
                "vitals": member.get("vitals", {})
            }

    return {"error": "User not found"}