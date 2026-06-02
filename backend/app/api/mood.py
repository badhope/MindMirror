from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import date
from app.database import get_db
from app.models.mood import MoodEntry
from app.models.user import User
from app.schemas.mood import MoodEntryCreate, MoodEntryUpdate, MoodEntryResponse, MoodEntryListResponse
from app.dependencies import get_current_user


router = APIRouter()


@router.get("/", response_model=MoodEntryListResponse)
async def list_mood_entries(
    skip: int = 0,
    limit: int = 100,
    start_date: date = None,
    end_date: date = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(MoodEntry).filter(MoodEntry.user_id == current_user.id)
    if start_date:
        query = query.filter(MoodEntry.recorded_at >= start_date)
    if end_date:
        query = query.filter(MoodEntry.recorded_at <= end_date)
    total = query.count()
    entries = query.order_by(MoodEntry.recorded_at.desc()).offset(skip).limit(limit).all()
    return {"entries": entries, "total": total}


@router.post("/", response_model=MoodEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_mood_entry(
    payload: MoodEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = MoodEntry(
        user_id=current_user.id,
        mood=payload.mood,
        mood_score=payload.mood_score,
        note=payload.note,
        tags=payload.tags,
        recorded_at=payload.recorded_at or date.today()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.patch("/{entry_id}", response_model=MoodEntryResponse)
async def update_mood_entry(
    entry_id: UUID,
    payload: MoodEntryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(MoodEntry).filter(
        MoodEntry.id == entry_id,
        MoodEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Mood entry not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mood_entry(
    entry_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(MoodEntry).filter(
        MoodEntry.id == entry_id,
        MoodEntry.user_id == current_user.id
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Mood entry not found")
    db.delete(entry)
    db.commit()
    return None
