from fastapi import APIRouter
from pydantic import BaseModel
from app.services.visual_intelligence.pipeline import process_medicine_image

router = APIRouter()

class ImageRequest(BaseModel):
    image_path: str

@router.post("/process-image")
def process_image(req: ImageRequest):
    return process_medicine_image(req.image_path)


@router.get("/test-image")
def test_image():
    return process_medicine_image("data/sample_images/amlodipine.jpeg")