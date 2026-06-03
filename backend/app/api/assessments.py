from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.database import get_db
from app.models.assessment import Assessment, Question, Option
from app.schemas.assessment import AssessmentResponse, AssessmentListResponse, QuestionResponse
from app.dependencies import get_current_user
from app.models.user import User


router = APIRouter()


@router.get("/", response_model=AssessmentListResponse)
async def get_assessments(
    category: Optional[str] = None,
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=200, description="Max items to return (1-200)"),
    db: Session = Depends(get_db)
):
    query = db.query(Assessment).filter(Assessment.is_active == True)

    if category:
        query = query.filter(Assessment.category == category)

    total = query.count()
    assessments = query.offset(skip).limit(limit).all()

    return {
        "assessments": assessments,
        "total": total
    }


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    # assessment_id is a string slug ("big-five", "stress-test",
    # "anxiety-gad7") rather than a UUID — that's what the frontend
    # hardcodes in the result payload, and forcing operators to look
    # up the UUID just to GET one record would be needless friction.
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).filter(
        Assessment.id == assessment_id,
        Assessment.is_active == True
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    return assessment


@router.get("/{assessment_id}/questions", response_model=List[QuestionResponse])
async def get_assessment_questions(
    assessment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessment = db.query(Assessment).filter(
        Assessment.id == assessment_id,
        Assessment.is_active == True
    ).first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )

    questions = db.query(Question).filter(
        Question.assessment_id == assessment_id
    ).options(
        joinedload(Question.options)
    ).order_by(Question.sort_order).all()

    return questions
