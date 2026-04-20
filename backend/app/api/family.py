from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/family", tags=["Family"])


# =========================
# EXISTING API (KEEP THIS)
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
            "age": target_user["age"]
        }

    elif access_level == "limited":
        return {
            "id": target_user["id"],
            "name": target_user["name"]
        }

    else:
        return {"error": "No access"}


# =========================
# NEW FAMILY UI API
# =========================
@router.get("/{user_id}")
def get_family_dashboard(user_id: str):
    data = load_family_data()

    members = data["members"]

    user = None
    for m in members:
        if m["id"] == user_id:
            user = m
            break

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
            "relation": member.get("relation", "Unknown"),
            "age": member.get("age"),
            "gender": member.get("gender", "Unknown"),
            "healthConditions": member.get("diseases", []),
            "accessLevel": access_mapping.get(access_level, "NO_ACCESS")
        })

    return {
        "familyNetwork": {
            "title": "Connected Family Network",
            "description": "Track linked members, shared health history, and controlled access.",
            "accessStatus": "Controlled permissions",
            "insights": "Inherited risk tracking"
        },
        "familyTree": {
            "title": "Family Tree",
            "description": "View family-linked members, relationship details, access level, and recorded conditions.",
            "members": family_members
        },
        "accessLevels": [
            {
                "type": "FULL_ACCESS",
                "description": "Can view and manage complete health records"
            },
            {
                "type": "LIMITED_ACCESS",
                "description": "Can view selected health information only"
            },
            {
                "type": "EMERGENCY_ONLY",
                "description": "Accessible only during emergencies"
            }
        ]
    }