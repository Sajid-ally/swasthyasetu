from fastapi import APIRouter, Body
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/auth", tags=["Auth"])


def normalize(value):
    return str(value or "").strip().lower()


@router.post("/login")
def login_user(payload: dict = Body(...)):
    identifier = normalize(payload.get("identifier"))

    if not identifier:
        return {
            "success": False,
            "message": "Name, email, or phone number is required."
        }

    data = load_family_data()

    for member in data.get("members", []):
        name = normalize(member.get("name"))
        email = normalize(member.get("email"))
        phone = normalize(member.get("phone_number"))
        user_id = normalize(member.get("id"))

        if identifier in [name, email, phone, user_id]:
            return {
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": member.get("id"),
                    "name": member.get("name"),
                    "email": member.get("email", ""),
                    "phone_number": member.get("phone_number", ""),
                    "age": member.get("age"),
                    "blood_group": member.get("emergency", {}).get("blood_group"),
                }
            }

    return {
        "success": False,
        "message": "No user found with this name, email, or phone number."
    }