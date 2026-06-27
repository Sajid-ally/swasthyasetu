from fastapi import APIRouter
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/routine", tags=["Routine"])


def format_routine(routine: dict):
    sleep = routine.get("sleep_hours", 0)
    water_raw = routine.get("water_intake", "0L")
    steps = routine.get("steps", 0)
    workout = routine.get("workout_minutes", 0)

    try:
        water = float(str(water_raw).lower().replace("l", "").strip())
    except:
        water = 0

    completed = round(
        (
            min(sleep / 8, 1) +
            min(water / 3, 1) +
            min(steps / 10000, 1) +
            min(workout / 60, 1)
        )
        / 4
        * 100
    )

    return {
        "completed": completed,
        "sleepHours": sleep,
        "waterIntake": water,
        "steps": steps,
        "workout": workout,
        "todayRoutine": [
            {
                "id": "sleep",
                "title": "Sleep Goal",
                "description": f"Target 7-8 hours. Current: {sleep} hrs",
                "time": "Daily",
                "category": "Sleep",
                "completed": 7 <= sleep <= 9,
            },
            {
                "id": "water",
                "title": "Hydration Goal",
                "description": f"Target 3L water. Current: {water} L",
                "time": "Daily",
                "category": "Water",
                "completed": water >= 3,
            },
            {
                "id": "steps",
                "title": "Steps Goal",
                "description": f"Target 8000+ steps. Current: {steps}",
                "time": "Daily",
                "category": "Activity",
                "completed": steps >= 8000,
            },
            {
                "id": "workout",
                "title": "Workout Goal",
                "description": f"Target 30+ minutes. Current: {workout} min",
                "time": "Daily",
                "category": "Fitness",
                "completed": workout >= 30,
            },
        ],
        "weeklyOverview": [
            {"day": "Monday", "label": "Routine progress", "progress": completed, "completedTasks": 3, "totalTasks": 4},
            {"day": "Tuesday", "label": "Routine progress", "progress": 70, "completedTasks": 3, "totalTasks": 4},
            {"day": "Wednesday", "label": "Routine progress", "progress": 55, "completedTasks": 2, "totalTasks": 4},
            {"day": "Thursday", "label": "Routine progress", "progress": 85, "completedTasks": 4, "totalTasks": 4},
            {"day": "Friday", "label": "Routine progress", "progress": 60, "completedTasks": 2, "totalTasks": 4},
        ],
    }


@router.get("/{user_id}")
def get_routine(user_id: str):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:
            return format_routine(member.get("routine", {}))

    return {"error": "User not found"}


@router.post("/{user_id}")
def update_routine(user_id: str, routine_data: dict):
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:
            member.setdefault("routine", {})
            member["routine"].update(routine_data)
            save_family_data(data)

            return {
                "message": "Routine updated successfully",
                "data": format_routine(member["routine"]),
            }

    return {"error": "User not found"}