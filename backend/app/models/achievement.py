from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer
from datetime import datetime
from app.core.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    icon = Column(String, nullable=True)
    target = Column(Integer, default=1)
    type = Column(String)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    achievement_id = Column(String, ForeignKey("achievements.id"))
    progress = Column(Integer, default=0)
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
