from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/vitals", tags=["Vitals"])


@router.get("/{user_id}")
def get_vitals(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:
            return member.get("vitals", {})

    return {"error": "User not found"}