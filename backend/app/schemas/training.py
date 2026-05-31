from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date
from uuid import UUID


class TrainingTaskBase(BaseModel):
    task_title: str = Field(..., min_length=1, max_length=200)
    task_description: str
    task_date: date


class TrainingTaskCreate(TrainingTaskBase):
    pass


class TrainingTaskUpdate(BaseModel):
    is_completed: Optional[bool] = None
    task_title: Optional[str] = Field(None, min_length=1, max_length=200)
    task_description: Optional[str] = None


class TrainingTaskResponse(TrainingTaskBase):
    id: UUID
    plan_id: UUID
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TrainingPlanBase(BaseModel):
    plan_name: str = Field(..., min_length=1, max_length=200)
    description: str
    start_date: date
    end_date: date


class TrainingPlanCreate(TrainingPlanBase):
    result_id: Optional[UUID] = None
    tasks: List[TrainingTaskCreate] = []


class TrainingPlanUpdate(BaseModel):
    plan_name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class TrainingPlanResponse(TrainingPlanBase):
    id: UUID
    user_id: UUID
    result_id: Optional[UUID] = None
    is_active: bool
    created_at: datetime
    tasks: List[TrainingTaskResponse] = []

    class Config:
        from_attributes = True


class TrainingPlanListResponse(BaseModel):
    plans: List[TrainingPlanResponse]
    total: int
