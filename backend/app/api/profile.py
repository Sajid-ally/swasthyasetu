from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/{user_id}")
def get_profile(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            height = member.get("height_cm")
            weight = member.get("weight_kg")

            bmi = None
            if height and weight:
                height_m = height / 100
                bmi = round(weight / (height_m ** 2), 2)

            return {
                "id": member["id"],
                "name": member.get("name"),
                "email": member.get("email"),
                "phone_number": member.get("phone_number"),
                "date_of_birth": member.get("date_of_birth"),
                "age": member.get("age"),
                "blood_group": member.get("emergency", {}).get("blood_group"),
                "address": member.get("address"),

                "height_cm": height,
                "weight_kg": weight,
                "bmi": bmi,   # ✅ IMPORTANT

                "diseases": member.get("diseases", []),
                "medications": member.get("medications", []),
                "lifestyle": member.get("lifestyle", {}),
                "vitals": member.get("vitals", {})
            }

    return {"error": "User not found"}