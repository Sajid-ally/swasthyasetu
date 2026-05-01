from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/timeline", tags=["Timeline"])


def parse_event_datetime(event: dict):
    raw_value = event.get("created_at") or event.get("date")

    if not raw_value:
        return None

    try:
        return datetime.fromisoformat(str(raw_value).replace("Z", ""))
    except Exception:
        pass

    try:
        return datetime.strptime(str(raw_value), "%Y-%m-%d")
    except Exception:
        return None


def normalize_manual_event(event: dict):
    now = datetime.now()

    return {
        "id": event.get("id") or f"event_{now.strftime('%Y%m%d%H%M%S')}",
        "title": event.get("title") or "Health Event",
        "type": event.get("type") or "general",
        "date": event.get("date") or str(now.date()),
        "time": event.get("time", ""),
        "notes": event.get("description") or event.get("notes") or "",
        "doctor": event.get("doctor", ""),
        "location": event.get("location", ""),
        "source": event.get("source", "manual"),
        "created_at": event.get("created_at") or now.isoformat(),
    }


@router.post("/{user_id}")
def add_timeline_event(user_id: str, event: dict):
    data = load_family_data()

    for member in data.get("members", []):
        if member.get("id") == user_id:
            if "timeline" not in member:
                member["timeline"] = []

            new_event = normalize_manual_event(event)

            member["timeline"].append(new_event)
            save_family_data(data)

            return {
                "success": True,
                "message": "Event added successfully",
                "added_event": new_event,
            }

    return {
        "success": False,
        "error": "User not found",
    }


@router.get("/{user_id}")
def get_timeline(
    user_id: str,
    event_type: str = Query(default="all"),
    time_range: str = Query(default="all"),
):
    data = load_family_data()

    for member in data.get("members", []):
        if member.get("id") == user_id:
            raw_events = member.get("timeline", [])

            # Attach original index so delete works even for old events without id
            events = []
            for index, event in enumerate(raw_events):
                copied_event = dict(event)
                copied_event["_timeline_index"] = index

                if not copied_event.get("id"):
                    copied_event["id"] = f"legacy_event_{index}"

                events.append(copied_event)

            if event_type != "all":
                events = [
                    event
                    for event in events
                    if event.get("type") == event_type
                ]

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
                    filtered_events = []

                    for event in events:
                        event_dt = parse_event_datetime(event)

                        if event_dt and event_dt >= cutoff:
                            filtered_events.append(event)

                    events = filtered_events

            events = sorted(
                events,
                key=lambda event: parse_event_datetime(event) or datetime.min,
                reverse=True,
            )

            return {
                "success": True,
                "user_id": member.get("id"),
                "total_events": len(events),
                "timeline": events,
            }

    return {
        "success": False,
        "error": "User not found",
        "timeline": [],
        "total_events": 0,
    }


@router.delete("/{user_id}/{event_id}")
def delete_timeline_event(user_id: str, event_id: str):
    data = load_family_data()

    for member in data.get("members", []):
        if member.get("id") == user_id:
            timeline = member.get("timeline", [])

            if not timeline:
                return {
                    "success": False,
                    "message": "Timeline is empty",
                }

            delete_index = None

            # Case 1: delete normal event by id
            for index, event in enumerate(timeline):
                if str(event.get("id")) == str(event_id):
                    delete_index = index
                    break

            # Case 2: delete old event without id using legacy index
            if delete_index is None and event_id.startswith("legacy_event_"):
                try:
                    legacy_index = int(event_id.replace("legacy_event_", ""))
                    if 0 <= legacy_index < len(timeline):
                        delete_index = legacy_index
                except Exception:
                    delete_index = None

            if delete_index is None:
                return {
                    "success": False,
                    "message": "Event not found",
                }

            deleted_event = timeline.pop(delete_index)
            member["timeline"] = timeline

            save_family_data(data)

            return {
                "success": True,
                "message": "Timeline event deleted successfully",
                "deleted_event": deleted_event,
            }

    return {
        "success": False,
        "message": "User not found",
    }