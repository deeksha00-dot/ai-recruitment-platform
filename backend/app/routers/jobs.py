from fastapi import APIRouter

router = APIRouter()

# Temporary storage (we'll replace this with PostgreSQL later)
jobs = []

# Get all jobs
@router.get("/jobs")
def get_jobs():
    return jobs

# Create a new job
@router.post("/jobs")
def create_job(job: dict):
    jobs.append(job)
    return {
        "message": "Job Created Successfully",
        "job": job
    }