from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID
from app.core.utils import utcnow
from app.database import get_db
from app.models.result import AssessmentResult
from app.models.user import User
from app.schemas.result import (
    AssessmentResultCreate,
    AssessmentResultResponse,
    AssessmentResultListResponse,
)
from app.dependencies import get_current_user


router = APIRouter()


@router.get("/", response_model=AssessmentResultListResponse)
async def list_results(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=200, description="Max items to return (1-200)"),
    assessment_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AssessmentResult).filter(AssessmentResult.user_id == current_user.id)
    if assessment_id:
        query = query.filter(AssessmentResult.assessment_id == assessment_id)
    total = query.count()
    results = query.order_by(AssessmentResult.completed_at.desc()).offset(skip).limit(limit).all()
    return {"results": results, "total": total}


@router.post("/", response_model=AssessmentResultResponse, status_code=status.HTTP_201_CREATED)
async def create_result(
    payload: AssessmentResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = AssessmentResult(
        user_id=current_user.id,
        assessment_id=payload.assessment_id,
        assessment_title=payload.assessment_title,
        total_score=payload.total_score,
        traits=payload.traits or [],
        dimension_scores=payload.dimension_scores,
        raw_answers=payload.raw_answers,
        completed_at=payload.completed_at or utcnow()
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


@router.get("/{result_id}", response_model=AssessmentResultResponse)
async def get_result(
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.query(AssessmentResult).filter(
        AssessmentResult.id == result_id,
        AssessmentResult.user_id == current_user.id
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return result


@router.delete("/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_result(
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.query(AssessmentResult).filter(
        AssessmentResult.id == result_id,
        AssessmentResult.user_id == current_user.id
    ).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    db.delete(result)
    db.commit()
    return None
