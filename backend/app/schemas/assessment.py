from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime


class QuestionOption(BaseModel):
    value: int
    label: str


class Question(BaseModel):
    id: str
    text: str
    type: str
    options: List[QuestionOption]
    dimension: Optional[str] = None
    reverse_scored: Optional[bool] = False


class AssessmentMetadata(BaseModel):
    theory: Optional[str] = None
    author: Optional[str] = None
    created_at: Optional[str] = None


class Assessment(BaseModel):
    id: str
    title: str
    description: str
    category: str
    subcategory: str
    difficulty: str
    duration: int
    question_count: int
    instructions: Optional[str] = None
    warnings: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    questions: List[Question]
    metadata: Optional[AssessmentMetadata] = None


class Answer(BaseModel):
    question_id: str
    value: int
    selected_option: str


class AssessmentSubmission(BaseModel):
    mode: str = "normal"
    answers: List[Answer]
    start_time: Optional[str] = None
    end_time: Optional[str] = None


class Dimension(BaseModel):
    name: str
    score: int
    preference: Optional[str] = None
    preference_name: Optional[str] = None
    description: Optional[str] = None


class AssessmentResult(BaseModel):
    id: str
    assessment_id: str
    type_code: str
    type_name: str
    score: float
    accuracy: Optional[float] = None
    dimensions: List[Dimension]
    title: str
    summary: str
    detailed_analysis: Optional[str] = None
    strengths: List[str]
    weaknesses: Optional[List[str]] = None
    career_suggestions: Optional[List[str]] = None
    famous_people: Optional[List[str]] = None
    compatibility: Optional[str] = None
    submitted_at: Optional[str] = None


class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int


class AssessmentHistoryItem(BaseModel):
    id: str
    assessment_id: str
    assessment_title: str
    assessment_category: str
    result_id: str
    result_summary: str
    score: float
    submitted_at: str
    duration: int
