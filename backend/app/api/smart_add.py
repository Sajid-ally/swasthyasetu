from fastapi import APIRouter
from app.services.data_loader import load_family_data, save_family_data

router = APIRouter(prefix="/smart-add", tags=["Smart Add"])


@router.post("/{user_id}")
def smart_add(user_id: str, input_data: dict):
    text = input_data.get("text", "").lower()

    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            # Convert text → structured update
            if "sleep" in text:
                value = int(text.split()[2])
                member["lifestyle"]["sleep_hours"] = value

            elif "bp" in text:
                member["vitals"]["bp"] = text.split()[-1]

            elif "sugar" in text:
                member["vitals"]["sugar_level"] = int(text.split()[-1])

            save_family_data(data)

            return {
                "message": "Smart update successful",
                "updated_data": member
            }

    return {"error": "User not found"}