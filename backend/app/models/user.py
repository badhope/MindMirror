import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from app.config import settings


# 兼容 SQLite 和 PostgreSQL 的 UUID 处理
if settings.DATABASE_URL.startswith("sqlite"):
    from sqlalchemy import String as UUIDColumn
else:
    from sqlalchemy.dialects.postgresql import UUID as PG_UUID
    UUIDColumn = PG_UUID(as_uuid=True)


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    is_guest = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    assessment_results = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    training_plans = relationship("TrainingPlan", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"
