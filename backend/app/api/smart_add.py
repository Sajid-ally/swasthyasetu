from fastapi import APIRouter
from app.services.data_loader import load_family_data, save_family_data
from app.services.ml_client import call_ml

router = APIRouter(prefix="/smart-add", tags=["Smart Add"])


def safe_lower(value):
    return str(value or "").strip().lower()


@router.post("/{user_id}")
def smart_add(user_id: str, input_data: dict):
    text = input_data.get("text", "").strip()

    if not text:
        return {"error": "Text input required"}

    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:
            ml_result = call_ml({"text": text, "user_id": user_id})

            extracted = (
                ml_result.get("extracted_data", {})
                if isinstance(ml_result, dict)
                else {}
            )

            member.setdefault("routine", {})
            member.setdefault("vitals", {})
            member.setdefault("diseases", [])
            member.setdefault("medications", [])

            # ROUTINE
            if "sleep_hours" in extracted:
                member["routine"]["sleep_hours"] = extracted["sleep_hours"]

            if "water_intake" in extracted:
                member["routine"]["water_intake"] = extracted["water_intake"]

            if "steps" in extracted:
                member["routine"]["steps"] = extracted["steps"]

            if "workout_minutes" in extracted:
                member["routine"]["workout_minutes"] = extracted["workout_minutes"]

            # VITALS
            if "bp" in extracted:
                member["vitals"]["bp"] = extracted["bp"]

            if "sugar_level" in extracted:
                member["vitals"]["sugar_level"] = extracted["sugar_level"]

            # CONDITION
            condition = extracted.get("condition")
            if condition and safe_lower(condition) not in [
                safe_lower(d) for d in member["diseases"]
            ]:
                member["diseases"].append(condition)

            # MEDICATION
            medicine_name = extracted.get("medicine_name")
            if medicine_name:
                new_med = {
                    "name": medicine_name,
                    "dosage": extracted.get("dosage", "Not specified"),
                    "time": extracted.get("timing", "Not specified"),
                    "status": "pending",
                }

                already_exists = False

                for med in member["medications"]:
                    if isinstance(med, dict):
                        if (
                            safe_lower(med.get("name")) == safe_lower(new_med["name"])
                            and safe_lower(med.get("dosage")) == safe_lower(new_med["dosage"])
                            and safe_lower(med.get("time")) == safe_lower(new_med["time"])
                        ):
                            already_exists = True
                            break

                    elif isinstance(med, str):
                        if safe_lower(med) == safe_lower(new_med["name"]):
                            already_exists = True
                            break

                if not already_exists:
                    member["medications"].append(new_med)

            # AI SUMMARY
            final_output = extracted.get("final_output", {})
            if final_output:
                member["last_ai_summary"] = final_output.get("summary", "")

            save_family_data(data)

            return {
                "message": "Smart update + AI analysis successful",
                "updated_data": member,
                "ml_output": ml_result,
            }

    return {"error": "User not found"}