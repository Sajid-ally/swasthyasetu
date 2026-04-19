from fastapi import APIRouter
from datetime import datetime
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/timeline", tags=["Timeline"])


# =========================
# ADD TIMELINE EVENT
# =========================
@router.post("/{user_id}")
def add_timeline_event(user_id: str, event: dict):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            if "timeline" not in member:
                member["timeline"] = []

            new_event = {
                "type": event.get("type"),
                "date": event.get("date", str(datetime.now().date())),
                "notes": event.get("notes", "")
            }

            member["timeline"].append(new_event)

            save_family_data(data)

            return {
                "message": "Event added successfully",
                "added_event": new_event
            }

    return {"error": "User not found"}


# =========================
# GET TIMELINE (FRONTEND USE)
# =========================
@router.get("/{user_id}")
def get_timeline(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            return {
                "user_id": member["id"],
                "total_events": len(member.get("timeline", [])),
                "timeline": member.get("timeline", [])
            }

    return {"error": "User not found"}