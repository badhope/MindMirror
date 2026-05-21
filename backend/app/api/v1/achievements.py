from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.achievement import Achievement, UserAchievement

router = APIRouter()


@router.get("/")
def list_achievements(db: Session = Depends(get_db)):
    achievements = db.query(Achievement).all()
    return {"success": True, "data": achievements}


@router.get("/user/{user_id}")
def get_user_achievements(user_id: str, db: Session = Depends(get_db)):
    user_achievements = db.query(UserAchievement)\
        .filter(UserAchievement.user_id == user_id)\
        .all()
    return {"success": True, "data": user_achievements}


@router.post("/unlock")
def unlock_achievement(
    user_id: str,
    achievement_id: str,
    db: Session = Depends(get_db)
):
    user_achievement = db.query(UserAchievement)\
        .filter(UserAchievement.user_id == user_id)\
        .filter(UserAchievement.achievement_id == achievement_id)\
        .first()
    
    if user_achievement:
        user_achievement.unlocked = True
        user_achievement.unlocked_at = datetime.utcnow()
    else:
        user_achievement = UserAchievement(
            id=str(uuid.uuid4()),
            user_id=user_id,
            achievement_id=achievement_id,
            unlocked=True,
            unlocked_at=datetime.utcnow(),
        )
        db.add(user_achievement)
    
    db.commit()
    db.refresh(user_achievement)
    
    return {"success": True, "data": user_achievement}


@router.put("/{user_id}/progress/{achievement_id}")
def update_progress(
    user_id: str,
    achievement_id: str,
    progress: int,
    db: Session = Depends(get_db)
):
    user_achievement = db.query(UserAchievement)\
        .filter(UserAchievement.user_id == user_id)\
        .filter(UserAchievement.achievement_id == achievement_id)\
        .first()
    
    if not user_achievement:
        achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
        if not achievement:
            raise HTTPException(status_code=404, detail="Achievement not found")
        
        user_achievement = UserAchievement(
            id=str(uuid.uuid4()),
            user_id=user_id,
            achievement_id=achievement_id,
            progress=progress,
        )
        db.add(user_achievement)
    else:
        user_achievement.progress = progress
        
        achievement = db.query(Achievement).filter(Achievement.id == achievement_id).first()
        if achievement and user_achievement.progress >= achievement.target:
            user_achievement.unlocked = True
            user_achievement.unlocked_at = datetime.utcnow()
    
    db.commit()
    db.refresh(user_achievement)
    
    return {"success": True, "data": user_achievement}
