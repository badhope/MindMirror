from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID
from app.core.utils import utcnow
from app.database import get_db
from app.models.training import TrainingPlan, TrainingTask
from app.models.result import AssessmentResult
from app.models.user import User
from app.schemas.training import (
    TrainingPlanCreate, TrainingPlanResponse, TrainingPlanListResponse,
    TrainingTaskUpdate, TrainingTaskResponse
)
from app.dependencies import get_current_user


router = APIRouter()


@router.get("/", response_model=TrainingPlanListResponse)
async def get_training_plans(
    is_active: bool = True,
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(50, ge=1, le=100, description="Max items to return (1-100)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(TrainingPlan).filter(
        TrainingPlan.user_id == current_user.id,
        TrainingPlan.is_active == is_active
    ).options(
        joinedload(TrainingPlan.tasks)
    )
    
    total = query.count()
    plans = query.order_by(TrainingPlan.created_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "plans": plans,
        "total": total
    }


@router.post("/", response_model=TrainingPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_training_plan(
    plan_data: TrainingPlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If a result_id is supplied, it must belong to the caller. We could
    # rely on the FK + ondelete=SET NULL to clean up if the result
    # vanishes, but accepting a foreign result_id would let user A attach
    # a plan to user B's assessment result (cross-user data pollution).
    if plan_data.result_id is not None:
        # The column is String(36); Pydantic turns the incoming UUID into
        # a uuid.UUID instance, so compare against str(...) on both sides.
        result_id = str(plan_data.result_id)
        owner = (
            db.query(AssessmentResult.user_id)
            .filter(AssessmentResult.id == result_id)
            .first()
        )
        if owner is None or owner[0] != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Training plan not found",
            )

    new_plan = TrainingPlan(
        user_id=current_user.id,
        result_id=str(plan_data.result_id) if plan_data.result_id else None,
        plan_name=plan_data.plan_name,
        description=plan_data.description,
        start_date=plan_data.start_date,
        end_date=plan_data.end_date
    )
    
    db.add(new_plan)
    db.flush()
    
    for task_data in plan_data.tasks:
        task = TrainingTask(
            plan_id=new_plan.id,
            task_title=task_data.task_title,
            task_description=task_data.task_description,
            task_date=task_data.task_date
        )
        db.add(task)
    
    db.commit()
    db.refresh(new_plan)
    
    return new_plan


@router.get("/{plan_id}", response_model=TrainingPlanResponse)
async def get_training_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(TrainingPlan).filter(
        TrainingPlan.id == plan_id,
        TrainingPlan.user_id == current_user.id
    ).options(
        joinedload(TrainingPlan.tasks)
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training plan not found"
        )
    
    return plan


@router.patch("/{plan_id}/tasks/{task_id}", response_model=TrainingTaskResponse)
async def update_task(
    plan_id: UUID,
    task_id: UUID,
    task_update: TrainingTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(TrainingPlan).filter(
        TrainingPlan.id == plan_id,
        TrainingPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training plan not found"
        )
    
    task = db.query(TrainingTask).filter(
        TrainingTask.id == task_id,
        TrainingTask.plan_id == plan_id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    if task_update.is_completed is not None:
        task.is_completed = task_update.is_completed
        if task_update.is_completed:
            task.completed_at = utcnow()
        else:
            task.completed_at = None
    
    if task_update.task_title is not None:
        task.task_title = task_update.task_title
    
    if task_update.task_description is not None:
        task.task_description = task_update.task_description
    
    db.commit()
    db.refresh(task)
    
    return task


@router.delete("/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_training_plan(
    plan_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(TrainingPlan).filter(
        TrainingPlan.id == plan_id,
        TrainingPlan.user_id == current_user.id
    ).first()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training plan not found"
        )
    
    db.delete(plan)
    db.commit()
    
    return None
