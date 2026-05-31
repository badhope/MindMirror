from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Tuple
from uuid import UUID
from app.database import get_db
from app.models.assessment import Assessment, Question, Option
from app.models.result import AssessmentResult, UserAnswer
from app.models.user import User
from app.schemas.result import ResultCreate, ResultResponse, ResultListResponse, AnswerSubmission
from app.dependencies import get_current_user
from app.services.scoring_service import (
    calculate_big5_scores,
    generate_big5_report
)


router = APIRouter()


@router.post("/submit/{assessment_id}", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
async def submit_assessment(
    assessment_id: UUID,
    submission: AnswerSubmission,
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
    
    # 收集所有答案并加载完整数据
    answers_data: List[Tuple[Question, List[Option]]] = []
    total_score = 0
    
    for answer in submission.answers:
        question = db.query(Question).filter(Question.id == answer.question_id).first()
        if not question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question {answer.question_id} not found"
            )
        
        selected_options = db.query(Option).filter(
            Option.id.in_(answer.selected_option_ids)
        ).all()
        
        for option in selected_options:
            total_score += option.score_value
        
        answers_data.append((question, selected_options))
    
    # 智能评分和分析
    if assessment.title == "完整大五人格测评":
        percentage_scores = calculate_big5_scores(answers_data)
        report = generate_big5_report(percentage_scores)
        score_percentage = report.get("total_score", 0)
        dimension_scores = report.get("dimension_scores", {})
        result_summary = report.get("result_summary", "")
        detailed_analysis = report.get("detailed_analysis", "")
        recommendations = report.get("recommendations", [])
    else:
        # 简单评分
        max_possible_score = len(submission.answers) * 5
        score_percentage = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0
        
        # 简单维度统计
        dimension_scores = {}
        for answer in submission.answers:
            selected_options = db.query(Option).filter(
                Option.id.in_(answer.selected_option_ids)
            ).all()
            for option in selected_options:
                if option.dimension:
                    if option.dimension not in dimension_scores:
                        dimension_scores[option.dimension] = 0
                    dimension_scores[option.dimension] += option.score_value
        
        result_summary = f"您完成了「{assessment.title}」，总得分为 {total_score} 分（{score_percentage:.1f}%）"
        detailed_analysis = f"您在{assessment.category}测评中表现良好，继续保持！"
        recommendations = [
            "建议每天进行10分钟的自我反思",
            "保持良好的作息习惯",
            "定期进行心理测评，了解自己的变化"
        ]
    
    new_result = AssessmentResult(
        user_id=current_user.id,
        assessment_id=assessment_id,
        total_score=total_score,
        score_percentage=score_percentage,
        dimension_scores=dimension_scores,
        result_summary=result_summary,
        detailed_analysis=detailed_analysis,
        recommendations=recommendations
    )
    
    db.add(new_result)
    db.flush()
    
    for answer in submission.answers:
        user_answer = UserAnswer(
            result_id=new_result.id,
            question_id=answer.question_id
        )
        db.add(user_answer)
        db.flush()
        
        selected_options = db.query(Option).filter(
            Option.id.in_(answer.selected_option_ids)
        ).all()
        user_answer.selected_options = selected_options
    
    db.commit()
    db.refresh(new_result)
    
    return new_result


@router.get("/my-results", response_model=ResultListResponse)
async def get_my_results(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AssessmentResult).filter(
        AssessmentResult.user_id == current_user.id
    ).options(
        joinedload(AssessmentResult.user_answers).joinedload(UserAnswer.selected_options)
    )
    
    total = query.count()
    results = query.order_by(AssessmentResult.completed_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "results": results,
        "total": total
    }


@router.get("/{result_id}", response_model=ResultResponse)
async def get_result(
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.query(AssessmentResult).filter(
        AssessmentResult.id == result_id,
        AssessmentResult.user_id == current_user.id
    ).options(
        joinedload(AssessmentResult.user_answers).joinedload(UserAnswer.selected_options)
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Result not found"
        )
    
    return result
