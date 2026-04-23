from fastapi import APIRouter, HTTPException

from app.schemas.text_schema import TextInputSchema, TextRouteResponseSchema
from app.services.smart_add.pipeline import process_health_text
from app.schemas.text_schema import TextInputSchema
from app.services.smart_add.pipeline import process_health_text
from app.services.smart_add.final_response_builder import build_final_response

router = APIRouter(prefix="/smart-add", tags=["Smart Add Text"])


@router.post("/text", response_model=TextRouteResponseSchema)
def smart_add_text(payload: TextInputSchema) -> TextRouteResponseSchema:
    """
    Accepts raw health-related text input and returns structured ML output.
    """
    try:
        result = process_health_text(payload.text)
        return result
@router.post("/text")
def smart_add_text(payload: TextInputSchema):
    try:
        # STEP 1: pipeline
        result = process_health_text(payload.text)

        extracted_data = result.dict()   # ✅ FULL STRUCTURE

        print("PIPELINE OUTPUT 👉", extracted_data)

        # STEP 2: build final
        final_output = build_final_response(extracted_data)

        print("FINAL ML OUTPUT 👉", final_output)

        return {
            "status": "success",
            "data": final_output
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Text processing failed: {str(exc)}"
        )
        )
