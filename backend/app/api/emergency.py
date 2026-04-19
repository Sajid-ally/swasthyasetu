from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/emergency", tags=["Emergency"])


@router.get("/{user_id}")
def get_emergency(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            emergency = member.get("emergency", {})

            return {
                "name": member.get("name"),

                # Basic info
                "blood_group": emergency.get("blood_group"),
                "allergies": emergency.get("allergies", []),

                # Doctor info (NEW)
                "primary_doctor": emergency.get("primary_doctor", {}),

                # Emergency contacts (NEW)
                "emergency_contacts": emergency.get("emergency_contacts", []),

                # Extra useful info
                "contact": emergency.get("contact"),
                "diseases": member.get("diseases", [])
            }

    return {"error": "User not found"}