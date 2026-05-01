from fastapi import APIRouter, Body
from app.services.data_loader import load_family_data, save_family_data
import uuid

router = APIRouter(prefix="/family", tags=["Family"])


# =========================
# EXISTING API
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

    if access_level == "partial":
        return {
            "id": target_user["id"],
            "name": target_user["name"],
            "age": target_user.get("age"),
        }

    if access_level == "limited":
        return {
            "id": target_user["id"],
            "name": target_user["name"],
        }

    return {"error": "No access"}


# =========================
# HELPERS
# =========================
def backend_access_to_frontend(access_level: str):
    mapping = {
        "full": "FULL_ACCESS",
        "partial": "LIMITED_ACCESS",
        "limited": "EMERGENCY_ONLY",
        "emergency": "EMERGENCY_ONLY",
        "none": "NO_ACCESS",
    }

    return mapping.get(access_level, "NO_ACCESS")


def frontend_access_to_backend(access_level: str):
    mapping = {
        "full": "full",
        "limited": "partial",
        "emergency": "limited",
        "FULL_ACCESS": "full",
        "LIMITED_ACCESS": "partial",
        "EMERGENCY_ONLY": "limited",
    }

    return mapping.get(access_level, "limited")


# =========================
# FAMILY TREE PAGE API
# =========================
@router.get("/{user_id}")
def get_family_dashboard(user_id: str):
    data = load_family_data()
    members = data.get("members", [])

    user = next((member for member in members if member.get("id") == user_id), None)

    if not user:
        return {"error": "User not found"}

    family_members = []

    for member in members:
        # Show current user also, but mark as full access
        if member.get("id") == user_id:
            access_level = "full"
        else:
            access_map = member.get("access", {})
            access_level = access_map.get(user_id, "none")

        family_members.append(
            {
                "id": member.get("id"),
                "name": member.get("name", "Unknown Member"),
                "relation": member.get("relation", "Self" if member.get("id") == user_id else "Family"),
                "age": member.get("age"),
                "gender": member.get("gender", "Unknown"),
                "healthConditions": member.get("diseases", []),
                "accessLevel": backend_access_to_frontend(access_level),
            }
        )

    return {
        "familyTree": {
            "members": family_members
        }
    }


# =========================
# ADD FAMILY MEMBER API
# =========================
@router.post("/add/{user_id}")
def add_family_member(user_id: str, member: dict = Body(...)):
    data = load_family_data()

    members = data.get("members", [])

    user_exists = any(existing_member.get("id") == user_id for existing_member in members)

    if not user_exists:
        return {"error": "User not found"}

    name = (member.get("name") or "").strip()
    relation = (member.get("relation") or "Family").strip()
    gender = member.get("gender") or "Unknown"
    age = member.get("age")
    conditions = member.get("conditions", [])

    access_level = (
        member.get("accessLevel")
        or member.get("access")
        or "limited"
    )

    backend_access = frontend_access_to_backend(access_level)

    if not name:
        return {"error": "Name is required"}

    if not isinstance(conditions, list):
        conditions = []

    new_member = {
        "id": f"user_{uuid.uuid4().hex[:6]}",
        "name": name,
        "relation": relation,
        "gender": gender,
        "age": age,
        "diseases": conditions,
        "medications": [],
        "routine": {},
        "vitals": {},
        "timeline": [],
        "access": {
            user_id: backend_access
        },
    }

    members.append(new_member)
    data["members"] = members

    save_family_data(data)

    return {
        "message": "Member added successfully",
        "member": new_member
    }

# =========================
# DELETE FAMILY MEMBER API
# =========================
@router.delete("/{user_id}/member/{member_id}")
def delete_family_member(user_id: str, member_id: str):
    data = load_family_data()
    members = data.get("members", [])

    if user_id == member_id:
        return {
            "success": False,
            "message": "You cannot delete the currently active user profile from family page."
        }

    user_exists = any(member.get("id") == user_id for member in members)

    if not user_exists:
        return {
            "success": False,
            "message": "User not found"
        }

    member_to_delete = next(
        (member for member in members if member.get("id") == member_id),
        None
    )

    if not member_to_delete:
        return {
            "success": False,
            "message": "Family member not found"
        }

    updated_members = [
        member for member in members if member.get("id") != member_id
    ]

    # Clean access references from remaining members
    for member in updated_members:
        access_map = member.get("access", {})
        if isinstance(access_map, dict):
            access_map.pop(member_id, None)
            member["access"] = access_map

    data["members"] = updated_members
    save_family_data(data)

    return {
        "success": True,
        "message": "Family member deleted successfully",
        "deleted_member": member_to_delete
    }