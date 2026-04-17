from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers (we will create these next)
from app.api.dashboard import router as dashboard_router
from app.api.smart_add import router as smart_add_router

# Create FastAPI app
app = FastAPI(
    title="Health AI API",
    version="1.0.0"
)

# Enable CORS (frontend can talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(dashboard_router)
app.include_router(smart_add_router)


# Root test route
@app.get("/")
def root():
    return {"message": "Health AI Backend Running 🚀"}