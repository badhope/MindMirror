import uuid
from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.utils import utcnow
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    is_guest = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    assessment_results = relationship(
        "AssessmentResult",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    training_plans = relationship(
        "TrainingPlan",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    mood_entries = relationship(
        "MoodEntry",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    achievements = relationship(
        "Achievement",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
