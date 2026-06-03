from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class OptionBase(BaseModel):
    option_text: str
    score_value: int
    dimension: Optional[str] = None


class OptionCreate(OptionBase):
    sort_order: int


class OptionResponse(OptionBase):
    id: UUID
    question_id: UUID
    sort_order: int

    class Config:
        from_attributes = True


class QuestionBase(BaseModel):
    question_text: str
    question_type: str = "single"


class QuestionCreate(QuestionBase):
    options: List[OptionCreate]
    sort_order: int


class QuestionResponse(QuestionBase):
    id: UUID
    # assessment_id is a string slug (e.g. "big-five") rather than a
    # UUID — see app/api/assessments.py for the rationale.
    assessment_id: str
    trait: Optional[str] = None
    is_reverse: bool = False
    sort_order: int
    options: List[OptionResponse] = []

    class Config:
        from_attributes = True


class AssessmentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str
    category: str = Field(..., min_length=1, max_length=50)


class AssessmentCreate(AssessmentBase):
    questions: List[QuestionCreate]


class AssessmentResponse(AssessmentBase):
    # `id` is a free-form string slug ("big-five", "stress-test",
    # "anxiety-gad7") in the seeded catalog, not a UUID.
    id: str
    version: str
    total_questions: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AssessmentListResponse(BaseModel):
    assessments: List[AssessmentResponse]
    total: int


class AssessmentDetailResponse(AssessmentResponse):
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True
