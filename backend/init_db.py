#!/usr/bin/env python3
"""
数据库初始化脚本
- 创建所有表（基于 SQLAlchemy 模型）
- 创建一个演示用户（可选）
- 创建一个示例测评模板（可选）

使用：
    python init_db.py            # 仅创建表
    python init_db.py --seed     # 创建表 + 种子数据
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


def create_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created.")


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

    if "--seed" in sys.argv:
        db = SessionLocal()
        try:
            seed_demo(db)
        finally:
            db.close()
    else:
        print("Skipping seed (use --seed to insert demo data).")

    print("\n🎉 Done!")


if __name__ == "__main__":
    main()
