from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from uuid import UUID


class UserAnswerCreate(BaseModel):
    question_id: UUID
    selected_option_ids: List[UUID]


class OptionAnswerResponse(BaseModel):
    id: UUID
    option_text: str
    score_value: int
    dimension: Optional[str] = None


class UserAnswerResponse(BaseModel):
    id: UUID
    question_id: UUID
    selected_options: List[OptionAnswerResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class AssessmentResultCreate(BaseModel):
    """前端预先计算好分数后，提交到后端保存"""
    assessment_id: str = Field(..., min_length=1, max_length=100)
    assessment_title: str = Field(..., min_length=1, max_length=200)
    total_score: float
    traits: List[Dict[str, Any]] = []
    dimension_scores: Optional[Dict[str, float]] = None
    raw_answers: Optional[Dict[str, int]] = None
    completed_at: Optional[datetime] = None


class AssessmentResultResponse(BaseModel):
    id: UUID
    user_id: UUID
    assessment_id: str
    assessment_title: str
    total_score: float
    traits: List[Dict[str, Any]]
    dimension_scores: Optional[Dict[str, float]] = None
    raw_answers: Optional[Dict[str, int]] = None
    completed_at: datetime

    class Config:
        from_attributes = True


class AssessmentResultListResponse(BaseModel):
    results: List[AssessmentResultResponse]
    total: int


class LegacyAnswerSubmission(BaseModel):
    """保留旧版 API：使用后端数据库中的测评题库"""
    answers: List[UserAnswerCreate]


class LegacyResultResponse(BaseModel):
    id: UUID
    user_id: UUID
    assessment_id: UUID
    total_score: float
    score_percentage: float
    dimension_scores: Dict[str, float]
    result_summary: str
    detailed_analysis: str
    recommendations: List[str]
    completed_at: datetime
    user_answers: List[UserAnswerResponse] = []

    class Config:
        from_attributes = True


class LegacyResultListResponse(BaseModel):
    results: List[LegacyResultResponse]
    total: int
