from fastapi import APIRouter
from app.services.data_loader import load_family_data, save_family_data
from app.models.schemas import User   # ✅ NEW

router = APIRouter(prefix="/update", tags=["Update"])


@router.post("/{user_id}")
def update_user(user_id: str, updated_data: User):   # ✅ CHANGED
    data = load_family_data()

    for member in data["members"]:
        if member["id"] == user_id:

            # Update fields (convert Pydantic → dict)
            for key, value in updated_data.dict(exclude_unset=True).items():
                member[key] = value

            save_family_data(data)

            return {"message": "User updated successfully"}

    return {"error": "User not found"}