from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)