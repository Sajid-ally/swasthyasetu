from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/timeline", tags=["Timeline"])


# =========================
# ADD TIMELINE EVENT (UPDATED)
# =========================
@router.post("/{user_id}")
def add_timeline_event(user_id: str, event: dict):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            if "timeline" not in member:
                member["timeline"] = []

            new_event = {
                "title": event.get("title"),
                "type": event.get("type"),  # checkup, report, medication, alert, routine
                "date": event.get("date", str(datetime.now().date())),
                "time": event.get("time", ""),
                "notes": event.get("description", ""),
                "doctor": event.get("doctor", ""),
                "location": event.get("location", "")
            }

            member["timeline"].append(new_event)
            save_family_data(data)

            return {
                "message": "Event added successfully",
                "added_event": new_event
            }

    return {"error": "User not found"}


# =========================
# GET TIMELINE WITH FILTERS
# =========================
@router.get("/{user_id}")
def get_timeline(
    user_id: str,
    event_type: str = Query(default="all"),
    time_range: str = Query(default="all")
):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            events = member.get("timeline", [])

            # 🔹 FILTER BY TYPE
            if event_type != "all":
                events = [e for e in events if e.get("type") == event_type]

            # 🔹 FILTER BY TIME RANGE
            if time_range != "all":
                now = datetime.now()

                if time_range == "7d":
                    cutoff = now - timedelta(days=7)
                elif time_range == "30d":
                    cutoff = now - timedelta(days=30)
                elif time_range == "6m":
                    cutoff = now - timedelta(days=180)
                elif time_range == "1y":
                    cutoff = now - timedelta(days=365)
                else:
                    cutoff = None

                if cutoff:
                    events = [
                        e for e in events
                        if datetime.strptime(e["date"], "%Y-%m-%d") >= cutoff
                    ]

            return {
                "user_id": member["id"],
                "total_events": len(events),
                "timeline": events
            }

    return {"error": "User not found"}