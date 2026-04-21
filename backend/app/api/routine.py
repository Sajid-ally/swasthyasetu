from fastapi import APIRouter
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/routine", tags=["Routine"])


# =========================
# GET ROUTINE DATA
# =========================
@router.get("/{user_id}")
def get_routine(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:
            return member.get("routine", {})

    return {"error": "User not found"}


# =========================
# UPDATE ROUTINE
# =========================
@router.post("/{user_id}")
def update_routine(user_id: str, routine_data: dict):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            if "routine" not in member:
                member["routine"] = {}

            member["routine"].update(routine_data)

            save_family_data(data)

            return {
                "message": "Routine updated successfully",
                "updated_data": routine_data
            }

    return {"error": "User not found"}