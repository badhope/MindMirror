import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, ForeignKey, Table, TypeDecorator
from sqlalchemy.orm import relationship
from app.database import Base
from app.config import settings
import json


# JSONB 兼容 SQLite 的类型
class JSONB(TypeDecorator):
    impl = Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return json.loads(value)


user_answer_options = Table(
    'user_answer_options',
    Base.metadata,
    Column('user_answer_id', String(36), ForeignKey('user_answers.id', ondelete='CASCADE'), primary_key=True),
    Column('option_id', String(36), ForeignKey('options.id', ondelete='CASCADE'), primary_key=True)
)


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    total_score = Column(Float, nullable=False)
    score_percentage = Column(Float, nullable=False)
    dimension_scores = Column(JSONB, nullable=False, default=dict)
    result_summary = Column(Text, nullable=False)
    detailed_analysis = Column(Text, nullable=False)
    recommendations = Column(JSONB, nullable=False, default=list)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="assessment_results")
    assessment = relationship("Assessment", back_populates="results")
    user_answers = relationship("UserAnswer", back_populates="result", cascade="all, delete-orphan")
    training_plans = relationship("TrainingPlan", back_populates="result", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<AssessmentResult(id={self.id}, user_id={self.user_id}, score_percentage={self.score_percentage})>"


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    result_id = Column(String(36), ForeignKey("assessment_results.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    result = relationship("AssessmentResult", back_populates="user_answers")
    question = relationship("Question", back_populates="user_answers")
    selected_options = relationship("Option", secondary=user_answer_options, back_populates="user_answers")

    def __repr__(self):
        return f"<UserAnswer(id={self.id}, result_id={self.result_id}, question_id={self.question_id})>"
