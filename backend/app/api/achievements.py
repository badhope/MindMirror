from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.database import get_db
from app.models.mood import Achievement
from app.models.user import User
from app.schemas.mood import AchievementCreate, AchievementResponse, AchievementListResponse
from app.dependencies import get_current_user


router = APIRouter()


@router.get("/", response_model=AchievementListResponse)
async def list_achievements(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Achievement).filter(Achievement.user_id == current_user.id)
    total = query.count()
    achievements = query.order_by(Achievement.unlocked_at.desc()).offset(skip).limit(limit).all()
    return {"achievements": achievements, "total": total}


@router.post("/", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
async def unlock_achievement(
    payload: AchievementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(Achievement).filter(
        Achievement.user_id == current_user.id,
        Achievement.achievement_code == payload.achievement_code
    ).first()
    if existing:
        return existing

    achievement = Achievement(
        user_id=current_user.id,
        achievement_code=payload.achievement_code,
        title=payload.title,
        description=payload.description,
        icon=payload.icon
    )
    db.add(achievement)
    db.commit()
    db.refresh(achievement)
    return achievement


@router.delete("/{achievement_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_achievement(
    achievement_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    achievement = db.query(Achievement).filter(
        Achievement.id == achievement_id,
        Achievement.user_id == current_user.id
    ).first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(achievement)
    db.commit()
    return None
