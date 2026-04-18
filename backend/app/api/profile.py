from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/{user_id}")
def get_profile(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:
            return member

    return {"error": "User not found"}