from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.mood import MoodRecord

router = APIRouter()


@router.get("/")
def list_mood_records(
    user_id: str = "demo-user",
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(MoodRecord).filter(MoodRecord.user_id == user_id)
    
    if start_date:
        query = query.filter(MoodRecord.timestamp >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(MoodRecord.timestamp <= datetime.fromisoformat(end_date))
    
    records = query.order_by(MoodRecord.timestamp.desc()).all()
    return {"success": True, "data": records}


@router.post("/")
def create_mood_record(
    user_id: str,
    mood: int,
    date: str,
    note: str = None,
    db: Session = Depends(get_db)
):
    record = MoodRecord(
        id=str(uuid.uuid4()),
        user_id=user_id,
        mood=mood,
        date=date,
        note=note,
        timestamp=datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {"success": True, "data": record}


@router.get("/today/{user_id}")
def get_today_mood(user_id: str, db: Session = Depends(get_db)):
    today = datetime.now().strftime("%Y-%m-%d")
    record = db.query(MoodRecord)\
        .filter(MoodRecord.user_id == user_id)\
        .filter(MoodRecord.date == today)\
        .order_by(MoodRecord.timestamp.desc())\
        .first()
    
    if not record:
        return {"success": False, "message": "No mood record for today"}
    
    return {"success": True, "data": record}


@router.get("/{record_id}")
def get_mood_record(record_id: str, db: Session = Depends(get_db)):
    record = db.query(MoodRecord).filter(MoodRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Mood record not found")
    return {"success": True, "data": record}


@router.put("/{record_id}")
def update_mood_record(
    record_id: str,
    mood: int = None,
    note: str = None,
    db: Session = Depends(get_db)
):
    record = db.query(MoodRecord).filter(MoodRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Mood record not found")
    
    if mood is not None:
        record.mood = mood
    if note:
        record.note = note
    
    db.commit()
    db.refresh(record)
    
    return {"success": True, "data": record}


@router.delete("/{record_id}")
def delete_mood_record(record_id: str, db: Session = Depends(get_db)):
    record = db.query(MoodRecord).filter(MoodRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Mood record not found")
    
    db.delete(record)
    db.commit()
    
    return {"success": True, "message": "Mood record deleted"}


@router.get("/stats/{user_id}")
def get_mood_stats(user_id: str, days: int = 7, db: Session = Depends(get_db)):
    records = db.query(MoodRecord).filter(MoodRecord.user_id == user_id).all()
    
    recent_records = []
    if days > 0:
        cutoff_date = (datetime.now() - datetime.timedelta(days=days)).strftime("%Y-%m-%d")
        recent_records = [r for r in records if r.date >= cutoff_date]
    else:
        recent_records = records
    
    if not recent_records:
        return {"success": True, "data": {"average_mood": 0, "trend": "stable"}}
    
    average_mood = sum(r.mood for r in recent_records) / len(recent_records)
    
    sorted_records = sorted(recent_records, key=lambda r: r.date)
    trend = "stable"
    if len(sorted_records) >= 3:
        first_avg = sum(r.mood for r in sorted_records[:len(sorted_records)//3]) / (len(sorted_records)//3)
        last_avg = sum(r.mood for r in sorted_records[-len(sorted_records)//3:]) / (len(sorted_records)//3)
        if last_avg > first_avg + 0.5:
            trend = "up"
        elif last_avg < first_avg - 0.5:
            trend = "down"
    
    return {
        "success": True,
        "data": {
            "average_mood": round(average_mood, 2),
            "trend": trend,
            "record_count": len(recent_records),
        },
    }
