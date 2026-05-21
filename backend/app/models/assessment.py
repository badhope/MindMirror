from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.sqlite import JSON
from datetime import datetime
from app.core.database import Base


class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    assessment_id = Column(String, index=True)
    mode = Column(String, default="normal")
    answers = Column(JSON)
    result = Column(JSON)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    duration = Column(Integer, nullable=True)


class AssessmentMetadata(Base):
    __tablename__ = "assessment_metadata"

    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    category = Column(String)
    subcategory = Column(String)
    difficulty = Column(String)
    question_count = Column(Integer)
    estimated_time = Column(Integer)
    tags = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
