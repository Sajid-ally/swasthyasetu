from fastapi import APIRouter
from app.services.data_loader import load_family_data, save_family_data

# 🔥 IMPORT YOUR ML PIPELINE
from app.services.smart_add.pipeline import process_health_text

router = APIRouter(prefix="/smart-add", tags=["Smart Add"])


@router.post("/{user_id}")
def smart_add(user_id: str, input_data: dict):
    text = input_data.get("text", "")

    if not text:
        return {"error": "Text input required"}

    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            # 🔥 STEP 1: RUN ML PIPELINE
            ml_result = process_health_text(text=text, user_id=user_id)

            # 🔥 STEP 2: EXTRACT AI OUTPUT
            if ml_result.success:
             extracted = ml_result.data.extracted_data
            else:
             extracted = {}

            # 🔥 STEP 3: UPDATE USER DATA (SMART)
            # Example updates (you can expand later)

            # Sleep
            if "sleep_hours" in extracted:
                member.setdefault("routine", {})
                member["routine"]["sleep_hours"] = extracted["sleep_hours"]
            # BP
            if "bp" in extracted:
                member.setdefault("vitals", {})
                member["vitals"]["bp"] = extracted["bp"]

            # Sugar
            if "sugar_level" in extracted:
                member.setdefault("vitals", {})
                member["vitals"]["sugar_level"] = extracted["sugar_level"]

            # Diseases
            if "condition" in extracted:
                member.setdefault("diseases", [])
                if extracted["condition"] not in member["diseases"]:
                    member["diseases"].append(extracted["condition"])

            # Medications
            if "medicine_name" in extracted:
                member.setdefault("medications", [])
                if extracted["medicine_name"] not in member["medications"]:
                    member["medications"].append(extracted["medicine_name"])

            # 🔥 STEP 4: SAVE DATA
            save_family_data(data)

            # 🔥 STEP 5: RETURN FULL AI RESPONSE
            return {
                "message": "Smart update + AI analysis successful",
                "updated_data": member,
                "ai_output": ml_result.data
            }

    return {"error": "User not found"}