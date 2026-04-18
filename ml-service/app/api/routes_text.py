from fastapi import APIRouter
from app.services.smart_add.pipeline import process_smart_add_text

router = APIRouter()

@router.post("/smart-add")
def smart_add(text: str):
    return process_smart_add_text(text)