from fastapi import APIRouter

from app.api.routes_text import router as text_router

api_router = APIRouter()
api_router.include_router(text_router)
