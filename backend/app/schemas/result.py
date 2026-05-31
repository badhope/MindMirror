from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from uuid import UUID


class UserAnswerCreate(BaseModel):
    question_id: UUID
    selected_option_ids: List[UUID]


class ResultCreate(BaseModel):
    assessment_id: UUID
    answers: List[UserAnswerCreate]


class OptionAnswerResponse(BaseModel):
    id: UUID
    option_text: str
    score_value: int
    dimension: Optional[str] = None


class UserAnswerResponse(BaseModel):
    id: UUID
    question_id: UUID
    selected_options: List[OptionAnswerResponse]
    created_at: datetime

    class Config:
        from_attributes = True


class ResultResponse(BaseModel):
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


class ResultListResponse(BaseModel):
    results: List[ResultResponse]
    total: int


class AnswerSubmission(BaseModel):
    answers: List[UserAnswerCreate]
