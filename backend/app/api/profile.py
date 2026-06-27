from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/users/all")
def get_all_users():
    data = load_family_data()

    users = []

    for member in data.get("members", []):
        users.append({
            "id": member.get("id"),
            "name": member.get("name", "Unknown User"),
            "email": member.get("email", ""),
            "phone_number": member.get("phone_number", ""),
            "relation": member.get("relation", "Self"),
            "age": member.get("age"),
        })

    return {
        "users": users
    }


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
                "bmi": bmi,

                "diseases": member.get("diseases", []),
                "medications": member.get("medications", []),
                "lifestyle": member.get("lifestyle", {}),
                "vitals": member.get("vitals", {})
            }

    return {"error": "User not found"}

# =========================
# DELETE HEALTH CONDITION
# =========================
@router.delete("/{user_id}/condition/{condition_index}")
def delete_health_condition(user_id: str, condition_index: int):
    data = load_family_data()

    for member in data.get("members", []):
        if member.get("id") == user_id:
            diseases = member.get("diseases", [])

            if condition_index < 0 or condition_index >= len(diseases):
                return {
                    "success": False,
                    "message": "Condition not found"
                }

            deleted_condition = diseases.pop(condition_index)
            member["diseases"] = diseases

            from app.services.data_loader import save_family_data
            save_family_data(data)

            return {
                "success": True,
                "message": "Condition removed successfully",
                "deleted_condition": deleted_condition
            }

    return {
        "success": False,
        "message": "User not found"
    }


# =========================
# DELETE MEDICATION
# =========================
@router.delete("/{user_id}/medication/{medication_index}")
def delete_profile_medication(user_id: str, medication_index: int):
    data = load_family_data()

    for member in data.get("members", []):
        if member.get("id") == user_id:
            medications = member.get("medications", [])

            if medication_index < 0 or medication_index >= len(medications):
                return {
                    "success": False,
                    "message": "Medication not found"
                }

            deleted_medication = medications.pop(medication_index)
            member["medications"] = medications

            from app.services.data_loader import save_family_data
            save_family_data(data)

            return {
                "success": True,
                "message": "Medication removed successfully",
                "deleted_medication": deleted_medication
            }

    return {
        "success": False,
        "message": "User not found"
    }