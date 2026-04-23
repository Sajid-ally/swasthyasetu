from fastapi import APIRouter, Body
from app.services.data_loader import load_family_data, save_family_data
import uuid

router = APIRouter(prefix="/family", tags=["Family"])


# =========================
# EXISTING API (DO NOT TOUCH)
# =========================
@router.get("/view/{user_id}")
def get_user_data(user_id: str, viewer_id: str):
    data = load_family_data()

    target_user = None
    for member in data["members"]:
        if member["id"] == user_id:
            target_user = member
            break

    if not target_user:
        return {"error": "User not found"}

    if user_id == viewer_id:
        return target_user

    access_level = target_user.get("access", {}).get(viewer_id, "none")

    if access_level == "full":
        return target_user

    elif access_level == "partial":
        return {
            "id": target_user["id"],
            "name": target_user["name"],
            "age": target_user.get("age")
        }

    elif access_level == "limited":
        return {
            "id": target_user["id"],
            "name": target_user["name"]
        }

    else:
        return {"error": "No access"}


# =========================
# FAMILY TREE DASHBOARD API
# =========================
@router.get("/{user_id}")
def get_family_dashboard(user_id: str):
    data = load_family_data()
    members = data["members"]

    user = next((m for m in members if m["id"] == user_id), None)

    if not user:
        return {"error": "User not found"}

    family_members = []

    for member in members:
        access_map = member.get("access", {})
        access_level = access_map.get(user_id, "none")

        access_mapping = {
            "full": "FULL_ACCESS",
            "partial": "LIMITED_ACCESS",
            "limited": "EMERGENCY_ONLY",
            "none": "NO_ACCESS"
        }

        family_members.append({
            "id": member["id"],
            "name": member.get("name"),
            "relation": member.get("relation", "Family"),
            "age": member.get("age"),
            "gender": member.get("gender", "Unknown"),
            "healthConditions": member.get("diseases", []),
            "accessLevel": access_mapping.get(access_level, "NO_ACCESS")
        })

    return {
        "familyTree": {
            "members": family_members
        }
    }


# =========================
# ✅ ADD MEMBER API (NEW)
# =========================
@router.post("/add/{user_id}")
def add_family_member(user_id: str, member: dict = Body(...)):
    data = load_family_data()

    new_member = {
        "id": f"user_{uuid.uuid4().hex[:6]}",
        "name": member.get("name"),
        "relation": member.get("relation", "Family"),
        "gender": member.get("gender", "Unknown"),
        "age": member.get("age"),
        "diseases": member.get("conditions", []),
        "access": {
            user_id: member.get("access", "limited")
        }
    }

    data["members"].append(new_member)
    save_family_data(data)

    return {"message": "Member added", "member": new_member}