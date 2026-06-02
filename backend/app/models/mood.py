import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Integer, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    mood = Column(String(50), nullable=False)
    mood_score = Column(Integer, nullable=False)
    note = Column(String(1000), nullable=True)
    tags = Column(String(500), nullable=True)
    recorded_at = Column(Date, default=date.today, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="mood_entries")

    def __repr__(self):
        return f"<MoodEntry(id={self.id}, mood={self.mood}, score={self.mood_score})>"


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    achievement_code = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=False)
    icon = Column(String(20), nullable=True)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")

    def __repr__(self):
        return f"<Achievement(code={self.achievement_code}, title={self.title})>"
