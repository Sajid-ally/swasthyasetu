from fastapi import APIRouter

router = APIRouter(prefix="/smart-add")

@router.post("/")
def smart_add():
    return {
        "message": "Smart Add working ✅"
    }