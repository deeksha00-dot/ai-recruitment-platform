from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Import models
from app.models.user import User
from app.models.job import Job
from app.models.candidate import Candidate

# Import routers
from app.routers.auth import router as auth_router
from app.routers.jobs import router as jobs_router
from app.routers.resumes import router as resumes_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Recruitment Platform API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():
    return {
        "message": "AI Recruitment Platform API is running successfully 🚀"
    }

# Include Routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(resumes_router)