from fastapi import APIRouter
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/privacy", tags=["Privacy"])


# =========================
# GET PRIVACY DATA
# =========================
@router.get("/{user_id}")
def get_privacy(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            privacy = member.get("privacy", {})

            return {
                "data_protection": "Your health data is encrypted and securely stored.",
                "permissions": {
                    "doctor_access": privacy.get("doctor_access", False),
                    "family_access": privacy.get("family_access", False)
                },
                "access_logs": privacy.get("access_logs", [])
            }

    return {"error": "User not found"}


# =========================
# UPDATE PERMISSIONS
# =========================
@router.post("/{user_id}/permissions")
def update_permissions(user_id: str, body: dict):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            if "privacy" not in member:
                member["privacy"] = {}

            member["privacy"]["doctor_access"] = body.get("doctor_access", False)
            member["privacy"]["family_access"] = body.get("family_access", False)

            save_family_data(data)

            return {"message": "Permissions updated"}

    return {"error": "User not found"}


# =========================
# ADD ACCESS LOG
# =========================
@router.post("/{user_id}/log")
def add_log(user_id: str, body: dict):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            if "privacy" not in member:
                member["privacy"] = {}

            if "access_logs" not in member["privacy"]:
                member["privacy"]["access_logs"] = []

            member["privacy"]["access_logs"].append({
                "action": body.get("action"),
                "time": body.get("time")
            })

            save_family_data(data)

            return {"message": "Log added"}

    return {"error": "User not found"}


# =========================
# DELETE USER DATA
# =========================
@router.delete("/{user_id}")
def delete_user(user_id: str):
    data = load_family_data()

    data["members"] = [
        member for member in data["members"]
        if member["id"] != user_id
    ]

    save_family_data(data)

    return {"message": "User deleted successfully"}