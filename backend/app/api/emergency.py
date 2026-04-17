from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/emergency", tags=["Emergency"])


@router.get("/{user_id}")
def get_emergency(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:
            return {
                "name": member["name"],
                "blood_group": member.get("emergency", {}).get("blood_group"),
                "allergies": member.get("emergency", {}).get("allergies", []),
                "contact": member.get("emergency", {}).get("contact"),
                "diseases": member.get("diseases", [])
            }

    return {"error": "User not found"}