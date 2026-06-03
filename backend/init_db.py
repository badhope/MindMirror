#!/usr/bin/env python3
"""
数据库初始化脚本
- 创建所有表（基于 SQLAlchemy 模型）
- 灌入测评题库（Big Five / PSS-30 / GAD-7+）— 默认开
- 创建一个演示用户（仅在非 production 环境）— 需要 --seed

使用：
    python init_db.py            # 仅创建表 + 测评题库
    python init_db.py --seed     # 创建表 + 题库 + 演示用户
    python init_db.py --no-assessments   # 只建表,跳过题库(自定义场景)
"""
import os
import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine, Base
from app.models import (
    User, Assessment, Question, Option,
    AssessmentResult, MoodEntry, Achievement
)
from app.core.security import get_password_hash
from app.seed_data import ASSESSMENT_CATALOG


def create_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created.")


def seed_assessments(db) -> int:
    """Insert the assessment catalog (Big Five / PSS-30 / GAD-7+).
    Idempotent: skips an assessment that already exists under the same
    slug, so re-running the script is safe.
    Returns the number of NEW assessments inserted."""
    inserted = 0
    for spec in ASSESSMENT_CATALOG:
        existing = db.query(Assessment).filter(Assessment.id == spec["id"]).first()
        if existing is not None:
            print(f"  · Assessment '{spec['id']}' already present, skipping.")
            continue

        assessment = Assessment(
            id=spec["id"],
            title=spec["title"],
            description=spec["description"],
            category=spec["category"],
            version=spec["version"],
            total_questions=len(spec["questions"]),
            is_active=True,
        )
        for sort_order, q in enumerate(spec["questions"]):
            question = Question(
                assessment_id=spec["id"],
                question_text=q["text"],
                trait=q["trait"],
                is_reverse=q["reverse"],
                sort_order=sort_order,
            )
            for opt_sort, opt in enumerate(spec["options"]):
                question.options.append(
                    Option(
                        option_text=opt["label"],
                        score_value=opt["value"],
                        # dimension on each option lets a future
                        # server-side scorer bucket by trait without
                        # having to walk up to the Question row.
                        dimension=q["trait"],
                        sort_order=opt_sort,
                    )
                )
            assessment.questions.append(question)
        db.add(assessment)
        inserted += 1
        print(f"  · Seeded '{spec['id']}' with {len(spec['questions'])} questions, "
              f"{len(spec['options'])} options each.")

    db.commit()
    return inserted


def seed_demo(db):
    demo_email = "demo@mindmirror.app"
    existing = db.query(User).filter(User.email == demo_email).first()
    if existing:
        print("Demo user already exists, skipping seed.")
        return

    # The demo password is a known public string — only safe to seed in
    # non-production environments. Operators pointed at a real database
    # get a clear error instead of a surprise account with a guessable
    # password.
    if os.environ.get("ENVIRONMENT", "development").lower() in {"production", "prod"}:
        print(
            "⚠️  Refusing to seed the demo user: ENVIRONMENT=production.\n"
            "   Create real accounts via /api/v1/auth/register instead."
        )
        return

    demo = User(
        id=str(uuid.uuid4()),
        email=demo_email,
        username="demo",
        hashed_password=get_password_hash("demo123"),
        avatar_url="https://ui-avatars.com/api/?name=Demo&background=4F46E5&color=fff",
    )
    db.add(demo)
    db.commit()
    print(f"✅ Demo user: {demo_email} / demo123")


def main():
    create_tables()

    skip_assessments = "--no-assessments" in sys.argv
    db = SessionLocal()
    try:
        if skip_assessments:
            print("Skipping assessment catalog (--no-assessments).")
        else:
            n = seed_assessments(db)
            if n == 0:
                print("Assessment catalog already up to date.")
            else:
                print(f"✅ Seeded {n} new assessment(s).")
    finally:
        db.close()

    if "--seed" in sys.argv:
        db = SessionLocal()
        try:
            seed_demo(db)
        finally:
            db.close()
    else:
        print("Skipping demo user (use --seed to insert it).")

    print("\n🎉 Done!")


if __name__ == "__main__":
    main()
