import uuid
from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.core.utils import utcnow
from app.database import Base


user_answer_options = Table(
    'user_answer_options',
    Base.metadata,
    Column('user_answer_id', String(36), ForeignKey('user_answers.id', ondelete='CASCADE'), primary_key=True),
    Column('option_id', String(36), ForeignKey('options.id', ondelete='CASCADE'), primary_key=True)
)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    version = Column(String(20), default="1.0")
    total_questions = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    questions = relationship(
        "Question",
        back_populates="assessment",
        cascade="all, delete-orphan",
        order_by="Question.sort_order"
    )

    def __repr__(self):
        return f"<Assessment(id={self.id}, title={self.title}, category={self.category})>"


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    assessment_id = Column(String(36), ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(20), nullable=False, default="single")
    sort_order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    assessment = relationship("Assessment", back_populates="questions")
    options = relationship(
        "Option",
        back_populates="question",
        cascade="all, delete-orphan",
        order_by="Option.sort_order"
    )
    user_answers = relationship("UserAnswer", back_populates="question")

    def __repr__(self):
        return f"<Question(id={self.id}, text={self.question_text[:50]})>"


class Option(Base):
    __tablename__ = "options"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    option_text = Column(Text, nullable=False)
    score_value = Column(Integer, nullable=False)
    dimension = Column(String(50), nullable=True)
    sort_order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    question = relationship("Question", back_populates="options")
    user_answers = relationship(
        "UserAnswer",
        secondary="user_answer_options",
        back_populates="selected_options"
    )

    def __repr__(self):
        return f"<Option(id={self.id}, text={self.option_text[:30]}, score={self.score_value})>"


class UserAnswer(Base):
    """保留旧版 API 用的中间表：用于后端管理测评题库时的用户答案"""
    __tablename__ = "user_answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    result_id = Column(String(36), ForeignKey("assessment_results.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    result = relationship("AssessmentResult", back_populates="user_answers")
    question = relationship("Question", back_populates="user_answers")
    selected_options = relationship(
        "Option",
        secondary="user_answer_options",
        back_populates="user_answers"
    )

    def __repr__(self):
        return f"<UserAnswer(id={self.id}, result_id={self.result_id})>"
