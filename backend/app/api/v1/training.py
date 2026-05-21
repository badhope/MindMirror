from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict, Any
import uuid

from app.core.database import get_db
from app.models.training import TrainingRecord

router = APIRouter()


@router.get("/")
def list_training_records(
    user_id: str = "demo-user",
    category: str = None,
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(TrainingRecord).filter(TrainingRecord.user_id == user_id)
    
    if category:
        query = query.filter(TrainingRecord.category == category)
    if start_date:
        query = query.filter(TrainingRecord.completed_at >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(TrainingRecord.completed_at <= datetime.fromisoformat(end_date))
    
    records = query.order_by(TrainingRecord.completed_at.desc()).all()
    return {"success": True, "data": records}


@router.post("/")
def create_training_record(
    user_id: str,
    type: str,
    category: str,
    duration: int,
    notes: str = None,
    extra_data: Dict[str, Any] = None,
    db: Session = Depends(get_db)
):
    record = TrainingRecord(
        id=str(uuid.uuid4()),
        user_id=user_id,
        type=type,
        category=category,
        duration=duration,
        notes=notes,
        extra_data=extra_data or {},
        completed_at=datetime.utcnow(),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {"success": True, "data": record}


@router.get("/{record_id}")
def get_training_record(record_id: str, db: Session = Depends(get_db)):
    record = db.query(TrainingRecord).filter(TrainingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Training record not found")
    return {"success": True, "data": record}


@router.put("/{record_id}")
def update_training_record(
    record_id: str,
    type: str = None,
    category: str = None,
    duration: int = None,
    notes: str = None,
    db: Session = Depends(get_db)
):
    record = db.query(TrainingRecord).filter(TrainingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Training record not found")
    
    if type:
        record.type = type
    if category:
        record.category = category
    if duration:
        record.duration = duration
    if notes:
        record.notes = notes
    
    db.commit()
    db.refresh(record)
    
    return {"success": True, "data": record}


@router.delete("/{record_id}")
def delete_training_record(record_id: str, db: Session = Depends(get_db)):
    record = db.query(TrainingRecord).filter(TrainingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Training record not found")
    
    db.delete(record)
    db.commit()
    
    return {"success": True, "message": "Training record deleted"}


@router.get("/stats/{user_id}")
def get_training_stats(user_id: str, db: Session = Depends(get_db)):
    records = db.query(TrainingRecord).filter(TrainingRecord.user_id == user_id).all()
    
    total_duration = sum(r.duration for r in records)
    total_records = len(records)
    
    category_stats = {}
    for record in records:
        if record.category not in category_stats:
            category_stats[record.category] = {"count": 0, "duration": 0}
        category_stats[record.category]["count"] += 1
        category_stats[record.category]["duration"] += record.duration
    
    return {
        "success": True,
        "data": {
            "total_duration": total_duration,
            "total_records": total_records,
            "category_stats": category_stats,
        },
    }
