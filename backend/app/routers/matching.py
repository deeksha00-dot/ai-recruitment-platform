from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.job import Job
from app.models.candidate import Candidate

from app.services.resume_service import extract_text
from app.services.matching_service import calculate_final_score

from app.auth.roles import require_recruiter

router = APIRouter(
    prefix="/matching",
    tags=["AI Matching"]
)


@router.get("/job/{job_id}")
def match_candidates(
    job_id: int,
    current_user=Depends(require_recruiter),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    candidates = db.query(Candidate).all()

    results = []

    job_skills = [
        skill.strip().lower()
        for skill in job.skills_required.split(",")
        if skill.strip()
    ]

    for candidate in candidates:

        candidate_skills = [
            skill.strip().lower()
            for skill in candidate.skills.split(",")
            if skill.strip()
        ]

        resume_text = extract_text(candidate.resume_path)

        score = calculate_final_score(
            job_skills=job_skills,
            candidate_skills=candidate_skills,
            job_description=job.description,
            resume_text=resume_text
        )

        results.append(
            {
                "candidate_id": candidate.id,
                "candidate_name": candidate.name,
                **score
            }
        )

    results.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return {
        "job_id": job.id,
        "job_title": job.title,
        "total_candidates": len(results),
        "matches": results
    }