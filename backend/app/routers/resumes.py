from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil
import os

from app.database.database import get_db
from app.models.candidate import Candidate
from app.services.resume_service import extract_text
from app.services.extractor_service import (
    extract_name,
    extract_email,
    extract_phone,
    extract_skills,
)

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Allow only PDF files
    if file.content_type != "application/pdf":
        return {
            "error": "Only PDF resumes are allowed."
        }

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text(file_path)

    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)

    # Check for duplicate email
    existing_candidate = (
        db.query(Candidate)
        .filter(Candidate.email == email)
        .first()
    )

    if existing_candidate:
        return {
            "message": "Candidate already exists.",
            "candidate_id": existing_candidate.id,
        }

    candidate = Candidate(
        name=name,
        email=email,
        phone=phone,
        skills=",".join(skills),
        resume_path=file_path,
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return {
        "message": "Resume uploaded successfully!",
        "candidate": {
            "id": candidate.id,
            "name": candidate.name,
            "email": candidate.email,
            "phone": candidate.phone,
            "skills": skills,
        },
    }