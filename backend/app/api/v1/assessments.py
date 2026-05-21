from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime

from app.core.database import get_db
from app.models.assessment import AssessmentRecord
from app.models.result import AssessmentResult
from app.schemas.assessment import (
    Assessment,
    AssessmentSubmission,
    AssessmentResult as AssessmentResultSchema,
    PaginatedResponse,
    AssessmentHistoryItem,
)
from app.services.calculator_factory import CalculatorFactory
from app.services.assessment_data_service import AssessmentDataService
import uuid

router = APIRouter()
data_service = AssessmentDataService()


@router.get("/", response_model=PaginatedResponse)
def list_assessments(
    page: int = 1,
    page_size: int = 20,
    category: str = None,
    difficulty: str = None,
    search: str = None,
    sort: str = "popular"
):
    assessments = data_service.list_assessments()
    
    if category:
        assessments = [a for a in assessments if a["category"] == category]
    if difficulty:
        assessments = [a for a in assessments if a["difficulty"] == difficulty]
    if search:
        search_lower = search.lower()
        assessments = [a for a in assessments 
                       if search_lower in a["title"].lower() or 
                          search_lower in a["description"].lower()]
    
    total = len(assessments)
    total_pages = (total + page_size - 1) // page_size
    start = (page - 1) * page_size
    end = start + page_size
    
    return {
        "items": assessments[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/categories")
def get_categories():
    return {"success": True, "data": data_service.get_categories()}


@router.get("/{assessment_id}", response_model=Assessment)
def get_assessment(assessment_id: str, mode: str = "normal"):
    assessment = data_service.load_assessment_schema(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment


@router.post("/{assessment_id}/submit")
def submit_assessment(
    assessment_id: str,
    submission: AssessmentSubmission,
    user_id: str = "demo-user",
    db: Session = Depends(get_db)
):
    calculator = CalculatorFactory.get_calculator(assessment_id)
    if not calculator:
        raise HTTPException(status_code=400, detail="Assessment calculator not found")
    
    answers = [{"question_id": ans.question_id, "value": ans.value} for ans in submission.answers]
    result = calculator.calculate(answers)
    
    record_id = str(uuid.uuid4())
    
    record = AssessmentRecord(
        id=record_id,
        user_id=user_id,
        assessment_id=assessment_id,
        mode=submission.mode,
        answers=[ans.dict() for ans in submission.answers],
        submitted_at=datetime.utcnow(),
    )
    db.add(record)
    
    result_id = str(uuid.uuid4())
    db_result = AssessmentResult(
        id=result_id,
        record_id=record_id,
        assessment_id=assessment_id,
        user_id=user_id,
        type_code=result.get("type_code", ""),
        type_name=result.get("type_name", ""),
        score=result.get("score", 0),
        dimensions=result.get("dimensions", []),
        title=result.get("title", ""),
        summary=result.get("summary", ""),
        detailed_analysis=result.get("detailed_analysis"),
        strengths=result.get("strengths", []),
        weaknesses=result.get("weaknesses"),
        career_suggestions=result.get("career_suggestions"),
        famous_people=result.get("famous_people"),
        compatibility=result.get("compatibility"),
        result_data=result,
    )
    db.add(db_result)
    
    db.commit()
    db.refresh(db_result)
    
    return {
        "success": True,
        "data": {
            "submission_id": record_id,
            "assessment_id": assessment_id,
            "submitted_at": datetime.utcnow().isoformat(),
            "result": result,
        },
        "message": "测评提交成功",
    }


@router.get("/{assessment_id}/result")
def get_latest_result(assessment_id: str, user_id: str = "demo-user", db: Session = Depends(get_db)):
    result = db.query(AssessmentResult)\
        .filter(AssessmentResult.assessment_id == assessment_id)\
        .filter(AssessmentResult.user_id == user_id)\
        .order_by(AssessmentResult.created_at.desc())\
        .first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return {"success": True, "data": result.result_data}


@router.get("/{assessment_id}/result/{result_id}")
def get_result(assessment_id: str, result_id: str, db: Session = Depends(get_db)):
    result = db.query(AssessmentResult)\
        .filter(AssessmentResult.id == result_id)\
        .filter(AssessmentResult.assessment_id == assessment_id)\
        .first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return {"success": True, "data": result.result_data}


@router.get("/history")
def get_assessment_history(
    user_id: str = "demo-user",
    page: int = 1,
    page_size: int = 20,
    category: str = None,
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(AssessmentResult).filter(AssessmentResult.user_id == user_id)
    
    if start_date:
        query = query.filter(AssessmentResult.created_at >= datetime.fromisoformat(start_date))
    if end_date:
        query = query.filter(AssessmentResult.created_at <= datetime.fromisoformat(end_date))
    
    records = query.order_by(AssessmentResult.created_at.desc()).all()
    
    items = []
    for record in records:
        assessment_info = data_service.load_assessment(record.assessment_id)
        category_name = assessment_info.get("category", "") if assessment_info else ""
        
        if category and category_name != category:
            continue
        
        items.append({
            "id": record.record_id,
            "assessment_id": record.assessment_id,
            "assessment_title": assessment_info.get("title", "") if assessment_info else "",
            "assessment_category": category_name,
            "result_id": record.id,
            "result_summary": f"{record.type_code} - {record.type_name}",
            "score": record.score,
            "submitted_at": record.created_at.isoformat(),
            "duration": 0,
        })
    
    total = len(items)
    total_pages = (total + page_size - 1) // page_size
    start = (page - 1) * page_size
    end = start + page_size
    
    return {
        "success": True,
        "data": {
            "items": items[start:end],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        },
    }


@router.delete("/history/{record_id}")
def delete_assessment_record(record_id: str, user_id: str = "demo-user", db: Session = Depends(get_db)):
    record = db.query(AssessmentRecord)\
        .filter(AssessmentRecord.id == record_id)\
        .filter(AssessmentRecord.user_id == user_id)\
        .first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.query(AssessmentResult)\
        .filter(AssessmentResult.record_id == record_id)\
        .delete()
    
    db.delete(record)
    db.commit()
    
    return {"success": True, "message": "测评记录删除成功"}
