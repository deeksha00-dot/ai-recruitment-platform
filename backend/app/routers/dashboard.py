from collections import Counter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.job import Job
from app.models.candidate import Candidate

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def recruiter_dashboard(db: Session = Depends(get_db)):

    jobs = db.query(Job).all()
    candidates = db.query(Candidate).all()

    total_jobs = len(jobs)
    total_candidates = len(candidates)

    latest_jobs = jobs[-5:]
    latest_candidates = candidates[-5:]

    skill_counter = Counter()

    for candidate in candidates:
        if candidate.skills:
            skills = [
                skill.strip()
                for skill in candidate.skills.split(",")
                if skill.strip()
            ]
            skill_counter.update(skills)

    top_skills = [
        {
            "skill": skill,
            "count": count
        }
        for skill, count in skill_counter.most_common(10)
    ]

    return {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "top_skills": top_skills,
        "latest_jobs": latest_jobs,
        "latest_candidates": latest_candidates,
    }