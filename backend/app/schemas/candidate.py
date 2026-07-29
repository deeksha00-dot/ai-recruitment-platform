from pydantic import BaseModel, EmailStr, ConfigDict


class CandidateCreate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    skills: str | None = None
    resume_path: str


class CandidateUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    skills: str | None = None


class CandidateResponse(BaseModel):
    id: int
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    skills: str | None = None
    resume_path: str

    model_config = ConfigDict(from_attributes=True)