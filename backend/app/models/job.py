from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(String)
    company = Column(String)
    skills_required = Column(String)