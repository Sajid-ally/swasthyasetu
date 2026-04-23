from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🔥 CREATE APP FIRST
app = FastAPI(
    title="Health AI API",
    version="1.0.0"
)

# 🔥 ADD CORS IMMEDIATELY AFTER APP
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # frontend
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 THEN IMPORT ROUTERS
from app.api.dashboard import router as dashboard_router
from app.api.smart_add import router as smart_add_router
from app.api.family import router as family_router
from app.api.profile import router as profile_router
from app.api.vitals import router as vitals_router
from app.api.emergency import router as emergency_router
from app.api.update import router as update_router
from app.api.timeline import router as timeline_router
from app.api.routine import router as routine_router
from app.api.privacy import router as privacy_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# CORS FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# IMPORT AFTER APP
from app.api.dashboard import router as dashboard_router
from app.api.smart_add import router as smart_add_router
from app.api.profile import router as profile_router
# 🔥 REGISTER ROUTES
app.include_router(dashboard_router)
app.include_router(smart_add_router)
app.include_router(profile_router)

app.include_router(dashboard_router)
app.include_router(smart_add_router)
app.include_router(family_router)
app.include_router(profile_router)
app.include_router(vitals_router)
app.include_router(emergency_router)
app.include_router(update_router)
app.include_router(timeline_router)
app.include_router(routine_router)
app.include_router(privacy_router)

@app.get("/")
def root():
    return {"message": "Health AI Backend Running 🚀"}