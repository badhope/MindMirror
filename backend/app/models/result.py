from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.sqlite import JSON
from datetime import datetime
from app.core.database import Base


class Result(Base):
    __tablename__ = "results"

    id = Column(String, primary_key=True, index=True)
    record_id = Column(String, ForeignKey("assessment_records.id"))
    user_id = Column(String, ForeignKey("users.id"))
    assessment_id = Column(String, index=True)
    raw_scores = Column(JSON)
    normalized_scores = Column(JSON)
    interpretation = Column(JSON)
    recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String, primary_key=True, index=True)
    record_id = Column(String, ForeignKey("assessment_records.id"))
    user_id = Column(String, ForeignKey("users.id"))
    assessment_id = Column(String, index=True)
    type_code = Column(String, nullable=True)
    type_name = Column(String, nullable=True)
    score = Column(Integer, default=0)
    dimensions = Column(JSON)
    title = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    detailed_analysis = Column(JSON)
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    career_suggestions = Column(JSON)
    famous_people = Column(JSON)
    compatibility = Column(JSON)
    result_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
