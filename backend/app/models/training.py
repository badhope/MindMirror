import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class TrainingPlan(Base):
    __tablename__ = "training_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    result_id = Column(String(36), ForeignKey("assessment_results.id", ondelete="SET NULL"), nullable=True)
    plan_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="training_plans")
    tasks = relationship("TrainingTask", back_populates="plan", cascade="all, delete-orphan", order_by="TrainingTask.task_date")

    def __repr__(self):
        return f"<TrainingPlan(id={self.id}, plan_name={self.plan_name}, user_id={self.user_id})>"


class TrainingTask(Base):
    __tablename__ = "training_tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id = Column(String(36), ForeignKey("training_plans.id", ondelete="CASCADE"), nullable=False)
    task_title = Column(String(200), nullable=False)
    task_description = Column(Text, nullable=False)
    task_date = Column(Date, nullable=False)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    plan = relationship("TrainingPlan", back_populates="tasks")

    def __repr__(self):
        return f"<TrainingTask(id={self.id}, task_title={self.task_title}, is_completed={self.is_completed})>"
