from pydantic import BaseModel

class CandidateCreate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    skills: str | None = None
    resume_path: str