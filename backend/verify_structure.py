#!/usr/bin/env python3
"""
后端项目结构验证脚本
"""
import os
from pathlib import Path

def verify_structure():
    """验证项目结构是否完整"""
    base_path = Path(__file__).parent
    backend_path = base_path / "backend"
    
    required_files = [
        "requirements.txt",
        ".env.example",
        ".env",
        "Dockerfile",
        "app/__init__.py",
        "app/main.py",
        "app/config.py",
        "app/database.py",
        "app/dependencies.py",
        "app/models/__init__.py",
        "app/models/user.py",
        "app/models/assessment.py",
        "app/models/result.py",
        "app/models/training.py",
        "app/schemas/__init__.py",
        "app/schemas/user.py",
        "app/schemas/assessment.py",
        "app/schemas/result.py",
        "app/schemas/training.py",
        "app/api/__init__.py",
        "app/api/auth.py",
        "app/api/assessments.py",
        "app/api/results.py",
        "app/api/training.py",
        "app/core/__init__.py",
        "app/core/security.py",
        "app/core/utils.py",
        "app/services/__init__.py",
        "app/algorithms/__init__.py",
        "alembic/env.py",
        "alembic/script.py.mako"
    ]
    
    print("=" * 60)
    print("心测助手 - 后端项目结构验证")
    print("=" * 60)
    
    all_exist = True
    for file in required_files:
        full_path = backend_path / file
        if full_path.exists():
            print(f"✓ {file}")
        else:
            print(f"✗ {file} - 缺失")
            all_exist = False
    
    print("\n" + "=" * 60)
    if all_exist:
        print("✅ 所有文件都已创建！项目结构完整。")
    else:
        print("❌ 部分文件缺失，请检查。")
    print("=" * 60)
    
    # 统计文件数量
    total_py_files = sum(1 for _ in backend_path.rglob("*.py"))
    print(f"\n总计 Python 文件: {total_py_files} 个")
    
    return all_exist

if __name__ == "__main__":
    verify_structure()
