from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from datetime import datetime
from app.core.database import Base


class MoodRecord(Base):
    __tablename__ = "mood_records"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    mood = Column(Integer)
    date = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    note = Column(String, nullable=True)
