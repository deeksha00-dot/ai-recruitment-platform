from fastapi import FastAPI

from app.routers.jobs import router as job_router
from app.routers.resumes import router as resume_router

from app.database.database import engine

from app.models.job import Base
from app.models.candidate import Candidate   # <-- Add this

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Recruitment Platform",
    version="1.0.0"
)

# Register routers
app.include_router(job_router)
app.include_router(resume_router)

@app.get("/")
def home():
    return {
        "message": "AI Recruitment Platform API is running"
    }