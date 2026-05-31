#!/usr/bin/env python3
"""
数据库初始化脚本 - 加载初始测试数据
"""
import sys
import os
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.assessment import Assessment, Question, Option
from app.core.security import get_password_hash
import uuid


def init_db(db: Session):
    """初始化数据库数据"""
    # 检查是否已有数据
    existing_assessment = db.query(Assessment).first()
    if existing_assessment:
        print("数据库中已有数据，跳过初始化")
        return

    print("开始初始化数据库...")

    # 创建初始用户
    demo_user = User(
        id=str(uuid.uuid4()),
        email="demo@example.com",
        hashed_password=get_password_hash("demo123"),
        name="演示用户"
    )
    db.add(demo_user)
    db.flush()
    print("✅ 创建演示用户")

    # 测评 1: 性格类型测评
    assessment1_id = str(uuid.uuid4())
    assessment1 = Assessment(
        id=assessment1_id,
        title="性格类型测评",
        description="探索你的性格特点，了解自己的行为模式",
        category="性格",
        version="1.0",
        total_questions=3,
        is_active=True
    )
    db.add(assessment1)
    db.flush()

    # 测评1的问题
    q1 = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment1_id,
        question_text="在社交场合中，你通常：",
        question_type="single",
        sort_order=1
    )
    db.add(q1)
    db.flush()
    
    # 问题1选项
    options_q1 = [
        Option(id=str(uuid.uuid4()), question_id=q1.id, option_text="主动与很多人交谈，包括陌生人", score_value=5, dimension="EI", sort_order=1),
        Option(id=str(uuid.uuid4()), question_id=q1.id, option_text="只与少数熟悉的人交谈", score_value=3, dimension="EI", sort_order=2),
        Option(id=str(uuid.uuid4()), question_id=q1.id, option_text="更喜欢安静地观察，不太主动交流", score_value=1, dimension="EI", sort_order=3),
    ]
    db.add_all(options_q1)

    q2 = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment1_id,
        question_text="做决定时，你更倾向于：",
        question_type="single",
        sort_order=2
    )
    db.add(q2)
    db.flush()
    
    options_q2 = [
        Option(id=str(uuid.uuid4()), question_id=q2.id, option_text="依据逻辑和事实", score_value=5, dimension="TF", sort_order=1),
        Option(id=str(uuid.uuid4()), question_id=q2.id, option_text="考虑他人的感受", score_value=3, dimension="TF", sort_order=2),
        Option(id=str(uuid.uuid4()), question_id=q2.id, option_text="凭直觉决定", score_value=1, dimension="TF", sort_order=3),
    ]
    db.add_all(options_q2)

    q3 = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment1_id,
        question_text="面对新的挑战，你通常：",
        question_type="single",
        sort_order=3
    )
    db.add(q3)
    db.flush()
    
    options_q3 = [
        Option(id=str(uuid.uuid4()), question_id=q3.id, option_text="兴奋并立即开始行动", score_value=5, dimension="JP", sort_order=1),
        Option(id=str(uuid.uuid4()), question_id=q3.id, option_text="仔细规划后再开始", score_value=3, dimension="JP", sort_order=2),
        Option(id=str(uuid.uuid4()), question_id=q3.id, option_text="有些担心，需要时间准备", score_value=1, dimension="JP", sort_order=3),
    ]
    db.add_all(options_q3)

    # 测评 2: 压力水平测试
    assessment2_id = str(uuid.uuid4())
    assessment2 = Assessment(
        id=assessment2_id,
        title="压力水平测试",
        description="了解你目前的压力状况，学习有效的应对方法",
        category="健康",
        version="1.0",
        total_questions=2,
        is_active=True
    )
    db.add(assessment2)
    db.flush()

    q4 = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment2_id,
        question_text="最近一个月，你感到紧张或焦虑的频率：",
        question_type="single",
        sort_order=1
    )
    db.add(q4)
    db.flush()
    
    options_q4 = [
        Option(id=str(uuid.uuid4()), question_id=q4.id, option_text="几乎没有", score_value=5, dimension="stress", sort_order=1),
        Option(id=str(uuid.uuid4()), question_id=q4.id, option_text="偶尔", score_value=3, dimension="stress", sort_order=2),
        Option(id=str(uuid.uuid4()), question_id=q4.id, option_text="经常", score_value=1, dimension="stress", sort_order=3),
    ]
    db.add_all(options_q4)

    q5 = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment2_id,
        question_text="你是否有足够的放松时间？",
        question_type="single",
        sort_order=2
    )
    db.add(q5)
    db.flush()
    
    options_q5 = [
        Option(id=str(uuid.uuid4()), question_id=q5.id, option_text="是的，很充足", score_value=5, dimension="stress", sort_order=1),
        Option(id=str(uuid.uuid4()), question_id=q5.id, option_text="还可以", score_value=3, dimension="stress", sort_order=2),
        Option(id=str(uuid.uuid4()), question_id=q5.id, option_text="几乎没有", score_value=1, dimension="stress", sort_order=3),
    ]
    db.add_all(options_q5)

    # 测评 3: 沟通能力评估
    assessment3_id = str(uuid.uuid4())
    assessment3 = Assessment(
        id=assessment3_id,
        title="沟通能力评估",
        description="评估你的沟通技巧，提升人际关系质量",
        category="社交",
        version="1.0",
        total_questions=2,
        is_active=True
    )
    db.add(assessment3)
    db.flush()

    q6 = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment3_id,
        question_text="你认为自己是一个好的倾听者吗？",
        question_type="single",
        sort_order=1
    )
    db.add(q6)
    db.flush()
    
    options_q6 = [
        Option(id=str(uuid.uuid4()), question_id=q6.id, option_text="是的，我很擅长倾听", score_value=5, dimension="listening", sort_order=1),
        Option(id=str(uuid.uuid4()), question_id=q6.id, option_text="一般，有时会分心", score_value=3, dimension="listening", sort_order=2),
        Option(id=str(uuid.uuid4()), question_id=q6.id, option_text="不太擅长，容易打断别人", score_value=1, dimension="listening", sort_order=3),
    ]
    db.add_all(options_q6)

    q7 = Question(
        id=str(uuid.uuid4()),
        assessment_id=assessment3_id,
        question_text="表达自己的想法时，你通常：",
        question_type="single",
        sort_order=2
    )
    db.add(q7)
    db.flush()
    
    options_q7 = [
        Option(id=str(uuid.uuid4()), question_id=q7.id, option_text="清晰直接，容易让人理解", score_value=5, dimension="expression", sort_order=1),
        Option(id=str(uuid.uuid4()), question_id=q7.id, option_text="还可以，但有时会让人困惑", score_value=3, dimension="expression", sort_order=2),
        Option(id=str(uuid.uuid4()), question_id=q7.id, option_text="觉得难以表达清楚", score_value=1, dimension="expression", sort_order=3),
    ]
    db.add_all(options_q7)

    db.commit()
    print("\n✅ 数据库初始化完成！")
    print("📊 已创建: 3个测评，7道题目，21个选项")
    print("👤 演示账户: demo@example.com / demo123")


def main():
    """主函数"""
    print("=" * 60)
    print("心测助手 - 数据库初始化")
    print("=" * 60)

    # 创建所有表
    Base.metadata.create_all(bind=engine)

    # 初始化数据
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

    print("\n🎉 初始化完成！")


if __name__ == "__main__":
    main()
