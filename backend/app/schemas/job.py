from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    description: str
    location: str
    company: str
    skills_required: str


class JobUpdate(BaseModel):
    title: str
    description: str
    location: str
    company: str
    skills_required: str


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    company: str
    skills_required: str

    class Config:
        from_attributes = True