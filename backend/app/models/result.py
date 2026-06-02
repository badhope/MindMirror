import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, ForeignKey, TypeDecorator, Integer
from sqlalchemy.orm import relationship
from app.database import Base
import json


class JSONB(TypeDecorator):
    """跨 SQLite/PostgreSQL 兼容的 JSON 字段"""
    impl = Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(value, ensure_ascii=False)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, (dict, list)):
            return value
        return json.loads(value)


class AssessmentResult(Base):
    """前端提交的结果（前端负责评分，后端负责存储和跨设备同步）"""
    __tablename__ = "assessment_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id = Column(String(100), nullable=False, index=True)
    assessment_title = Column(String(200), nullable=False)
    total_score = Column(Float, nullable=False, default=0.0)
    traits = Column(JSONB, nullable=False, default=list)
    dimension_scores = Column(JSONB, nullable=True)
    raw_answers = Column(JSONB, nullable=True)
    completed_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="assessment_results")
    user_answers = relationship(
        "UserAnswer",
        back_populates="result",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<AssessmentResult(id={self.id}, assessment_id={self.assessment_id}, score={self.total_score})>"
