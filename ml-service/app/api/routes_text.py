from fastapi import APIRouter, HTTPException

from app.schemas.text_schema import TextInputSchema
from app.services.smart_add.pipeline import process_health_text

router = APIRouter(prefix="/smart-add", tags=["Smart Add Text"])


@router.post("/text")
def smart_add_text(payload: TextInputSchema):
    try:
        result = process_health_text(
            text=payload.text,
            user_id=payload.user_id or "default_user"
        )

        return result.dict()

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Text processing failed: {str(exc)}"
        )