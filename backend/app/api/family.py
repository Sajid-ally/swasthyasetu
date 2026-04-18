from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/family", tags=["Family"])


@router.get("/{user_id}")
def get_user_data(user_id: str, viewer_id: str):
    data = load_family_data()

    # Find target user
    target_user = None
    for member in data["members"]:
        if member["id"] == user_id:
            target_user = member
            break

    if not target_user:
        return {"error": "User not found"}

    # If same user → full access
    if user_id == viewer_id:
        return target_user

    # Check access level
    access_level = target_user.get("access", {}).get(viewer_id, "none")

    if access_level == "full":
        return target_user

    elif access_level == "partial":
        return {
            "id": target_user["id"],
            "name": target_user["name"],
            "age": target_user["age"]
        }

    elif access_level == "limited":
        return {
            "id": target_user["id"],
            "name": target_user["name"]
        }

    else:
        return {"error": "No access"}