from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.sqlite import JSON
from datetime import datetime
from app.core.database import Base


class TrainingRecord(Base):
    __tablename__ = "training_records"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String)
    category = Column(String)
    duration = Column(Integer)
    completed_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)
    extra_data = Column(JSON)
