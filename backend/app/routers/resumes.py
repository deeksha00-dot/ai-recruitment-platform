from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import shutil

from app.database.database import get_db
from app.models.candidate import Candidate

from app.services.resume_service import extract_text

from app.services.extractor_service import (
    extract_name,
    extract_email,
    extract_phone,
    extract_skills
)

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Save uploaded PDF
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    text = extract_text(file_path)

    # Extract candidate information
    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)

    # Create candidate object
    candidate = Candidate(
        name=name,
        email=email,
        phone=phone,
        skills=", ".join(skills),
        resume_path=file_path
    )

    # Save candidate to PostgreSQL
    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return {
        "message": "Resume uploaded successfully",
        "candidate_id": candidate.id,
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills
    }