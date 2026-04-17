from fastapi import APIRouter

router = APIRouter(prefix="/dashboard")

@router.get("/")
def get_dashboard():
    return {
        "message": "Dashboard working ✅"
    }