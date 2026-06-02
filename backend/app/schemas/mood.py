from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID


class MoodEntryBase(BaseModel):
    mood: str = Field(..., min_length=1, max_length=50)
    mood_score: int = Field(..., ge=0, le=100)
    note: Optional[str] = Field(None, max_length=1000)
    tags: Optional[str] = Field(None, max_length=500)


class MoodEntryCreate(MoodEntryBase):
    recorded_at: Optional[date] = None


class MoodEntryUpdate(BaseModel):
    mood: Optional[str] = Field(None, min_length=1, max_length=50)
    mood_score: Optional[int] = Field(None, ge=0, le=100)
    note: Optional[str] = Field(None, max_length=1000)
    tags: Optional[str] = Field(None, max_length=500)


class MoodEntryResponse(MoodEntryBase):
    id: UUID
    user_id: UUID
    recorded_at: date
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MoodEntryListResponse(BaseModel):
    entries: List[MoodEntryResponse]
    total: int


class AchievementResponse(BaseModel):
    id: UUID
    user_id: UUID
    achievement_code: str
    title: str
    description: str
    icon: Optional[str] = None
    unlocked_at: datetime

    class Config:
        from_attributes = True


class AchievementCreate(BaseModel):
    achievement_code: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=1000)
    icon: Optional[str] = Field(None, max_length=20)


class AchievementListResponse(BaseModel):
    achievements: List[AchievementResponse]
    total: int
