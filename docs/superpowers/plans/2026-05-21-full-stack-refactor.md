# MindMirror 完整前后端分离重构实施计划

> **最后更新**: 2026-05-21
> **版本**: v1.0.0
> **目标**: 完成从单页应用到前后端分离架构的完整重构

---

## 📋 概述

### 重构目标

根据之前的讨论，本次重构的核心目标是：

1. **架构转型**: 从混合架构重构为标准前后端分离
2. **后端现代化**: 使用 Python 构建 RESTful API 后端
3. **前端优化**: 强化前端视图展示和交互逻辑
4. **数据迁移**: 完整迁移现有数据和主要功能
5. **向后兼容**: 保持本地数据 fallback 机制

### 核心原则

- ✅ **只迁移不修复**: 不修复旧代码中的错误，保持现有功能逻辑
- ✅ **职责分离**: 后端专注数据和业务，前端专注视图和交互
- ✅ **渐进迁移**: 分阶段实施，每阶段独立验证
- ✅ **预留扩展**: 为未来功能预留足够的扩展空间

---

## 🗂️ 项目结构规划

### 重构后目录结构

```
mindmirror/
├── frontend/                    # 现有前端项目（保持）
│   ├── src/
│   │   ├── api/               # API 客户端（已存在，需要增强）
│   │   ├── app/               # 应用页面
│   │   ├── components/        # 组件库
│   │   ├── store/             # 状态管理
│   │   └── utils/             # 工具函数
│   └── package.json
│
├── backend/                     # 新增 Python 后端
│   ├── app/
│   │   ├── api/               # API 路由
│   │   │   ├── v1/
│   │   │   │   ├── users.py
│   │   │   │   ├── assessments.py
│   │   │   │   ├── achievements.py
│   │   │   │   ├── training.py
│   │   │   │   └── moods.py
│   │   │   └── deps.py
│   │   ├── core/              # 核心配置
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/            # 数据模型
│   │   │   ├── user.py
│   │   │   ├── assessment.py
│   │   │   └── result.py
│   │   ├── schemas/           # Pydantic 模式
│   │   │   ├── user.py
│   │   │   ├── assessment.py
│   │   │   └── common.py
│   │   ├── services/          # 业务逻辑
│   │   │   ├── user_service.py
│   │   │   ├── assessment_service.py
│   │   │   └── calculation_service.py
│   │   └── data/              # 静态数据（从前端迁移）
│   │       ├── assessments/
│   │       └── entertainment/
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── main.py
│
├── docker-compose.yml          # 本地开发环境
└── docs/
    └── superpowers/plans/     # 本文件所在位置
```

---

## 🚀 阶段一：拆解分析与架构设计（2-3天）

### 目标

分析现有代码结构，明确前后端职责边界，制定详细技术方案。

### Task 1.1: 现有代码依赖分析

**步骤**:

1. **分析数据结构**
   ```bash
   # 列出所有数据文件
   ls -la src/data/
   
   # 检查数据文件大小和复杂度
   find src/data -name "*.ts" -exec wc -l {} \; | sort -n
   ```

2. **分析计算器逻辑**
   ```bash
   # 查看所有计算器
   ls -la src/utils/calculators/
   
   # 分析核心计算引擎
   cat src/utils/calculators/CalculatorEngine.ts
   ```

3. **分析状态管理**
   ```bash
   # 检查现有 store 结构
   cat src/store/index.ts
   ```

4. **创建依赖分析报告**
   - 记录所有数据结构
   - 记录所有计算器算法
   - 记录状态管理依赖
   - 识别需要迁移到后端的业务逻辑

**交付物**: `docs/analysis/dependency-report.md`

---

### Task 1.2: 定义前后端职责边界

#### 后端负责（Python）

| 模块 | 职责 |
|:-----|:-----|
| 数据存储 | 用户数据、测评记录、结果持久化 |
| 业务逻辑 | 测评计算、数据验证、权限控制 |
| API 接口 | RESTful API 提供数据服务 |
| 数据管理 | 测评元数据、知识库管理 |

#### 前端负责（React）

| 模块 | 职责 |
|:-----|:-----|
| 视图展示 | 页面渲染、组件交互 |
| 用户交互 | 事件处理、表单验证 |
| 状态管理 | 本地状态、UI 状态 |
| 离线支持 | IndexedDB 本地数据缓存 |
| 本地 fallback | 无网络时使用本地数据 |

**交付物**: `docs/architecture/responsibility-boundary.md`

---

### Task 1.3: 设计 API 接口规范

基于已有 `docs/API.md`，完善详细接口规范：

```
├── docs/api/
│   ├── users.md
│   ├── assessments.md
│   ├── achievements.md
│   ├── training.md
│   └── moods.md
```

**每个 API 文档包含**:
- 端点定义
- 请求/响应示例
- 错误码说明
- 数据格式定义

---

## 🚀 阶段二：Python 后端基础架构（3-5天）

### Task 2.1: 创建后端项目脚手架

**步骤**:

1. **创建项目结构**
   ```bash
   mkdir -p backend/app/{api/v1,core,models,schemas,services,data}
   mkdir -p backend/tests
   ```

2. **创建依赖管理文件**
   ```bash
   # backend/requirements.txt
   cat > backend/requirements.txt << 'EOF'
   fastapi==0.104.1
   uvicorn[standard]==0.24.0
   sqlalchemy==2.0.23
   pydantic==2.5.0
   python-jose[cryptography]==3.3.0
   passlib[bcrypt]==1.7.4
   python-multipart==0.0.6
   aiosqlite==0.19.0
   EOF
   ```

3. **创建 FastAPI 应用入口**
   ```python
   # backend/main.py
   from fastapi import FastAPI
   from fastapi.middleware.cors import CORSMiddleware
   from app.api.v1 import users, assessments, achievements, training, moods
   
   app = FastAPI(title="MindMirror API", version="1.0.0")
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
   app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["assessments"])
   app.include_router(achievements.router, prefix="/api/v1/achievements", tags=["achievements"])
   app.include_router(training.router, prefix="/api/v1/training", tags=["training"])
   app.include_router(moods.router, prefix="/api/v1/moods", tags=["moods"])
   
   @app.get("/")
   async def root():
       return {"message": "MindMirror API v1.0.0"}
   ```

4. **创建配置管理**
   ```python
   # backend/app/core/config.py
   from pydantic_settings import BaseSettings
   
   class Settings(BaseSettings):
       API_V1_STR: str = "/api/v1"
       SECRET_KEY: str = "your-secret-key-here-change-in-production"
       ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
       DATABASE_URL: str = "sqlite:///./mindmirror.db"
       
       class Config:
           env_file = ".env"
   
   settings = Settings()
   ```

5. **创建数据库配置**
   ```python
   # backend/app/core/database.py
   from sqlalchemy import create_engine
   from sqlalchemy.ext.declarative import declarative_base
   from sqlalchemy.orm import sessionmaker
   from app.core.config import settings
   
   engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
   SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
   Base = declarative_base()
   
   def get_db():
       db = SessionLocal()
       try:
           yield db
       finally:
           db.close()
   ```

6. **创建基础数据模型**
   ```python
   # backend/app/models/user.py
   from sqlalchemy import Column, String, DateTime, Boolean
   from sqlalchemy.dialects.sqlite import JSON
   from datetime import datetime
   from app.core.database import Base
   
   class User(Base):
       __tablename__ = "users"
       
       id = Column(String, primary_key=True, index=True)
       username = Column(String, unique=True, index=True)
       email = Column(String, unique=True, index=True)
       hashed_password = Column(String)
       avatar = Column(String, nullable=True)
       settings = Column(JSON, default=dict)
       created_at = Column(DateTime, default=datetime.utcnow)
       updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
       is_active = Column(Boolean, default=True)
   ```

**验证**:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# 访问 http://localhost:8000/docs 验证
```

---

### Task 2.2: 迁移测评数据到后端

**步骤**:

1. **创建数据迁移脚本**
   ```python
   # backend/scripts/migrate_data.py
   import json
   from pathlib import Path
   
   def migrate_assessments():
       frontend_data = Path("../../src/data/assessments/")
       backend_data = Path("../app/data/assessments/")
       backend_data.mkdir(parents=True, exist_ok=True)
       
       for ts_file in frontend_data.glob("*.ts"):
           # 解析 TypeScript 文件，提取数据
           # 转换为 JSON 格式
           pass
   ```

2. **创建数据加载服务**
   ```python
   # backend/app/services/assessment_data_service.py
   import json
   from pathlib import Path
   from typing import Dict, Any
   
   class AssessmentDataService:
       def __init__(self, data_dir: Path):
           self.data_dir = data_dir
           self._cache: Dict[str, Any] = {}
       
       def load_assessment(self, assessment_id: str) -> Dict[str, Any]:
           if assessment_id in self._cache:
               return self._cache[assessment_id]
           
           file_path = self.data_dir / f"{assessment_id}.json"
           if file_path.exists():
               with open(file_path, 'r', encoding='utf-8') as f:
                   data = json.load(f)
                   self._cache[assessment_id] = data
                   return data
           return {}
   ```

3. **创建数据初始化脚本**
   ```python
   # backend/scripts/init_data.py
   from app.core.database import SessionLocal, engine, Base
   from app.models.user import User
   # 导入其他模型
   
   def init_db():
       Base.metadata.create_all(bind=engine)
       # 初始化基础数据
   ```

---

### Task 2.3: 实现测评计算引擎

**步骤**:

1. **创建计算器基类**
   ```python
   # backend/app/services/calculators/base.py
   from abc import ABC, abstractmethod
   from typing import Dict, Any, List
   
   class BaseCalculator(ABC):
       @abstractmethod
       def calculate(self, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
           pass
   ```

2. **从前端迁移计算器算法**
   ```python
   # backend/app/services/calculators/mbti_calculator.py
   from .base import BaseCalculator
   
   class MBTICalculator(BaseCalculator):
       def calculate(self, answers):
           # 从 src/utils/calculators/mbti-calculator.ts 迁移逻辑
           pass
   ```

3. **创建计算器工厂**
   ```python
   # backend/app/services/calculator_factory.py
   from typing import Dict, Type
   from .base import BaseCalculator
   from .mbti_calculator import MBTICalculator
   from .bigfive_calculator import BigFiveCalculator
   # 导入其他计算器
   
   class CalculatorFactory:
       _calculators: Dict[str, Type[BaseCalculator]] = {
           "sbti-personality": MBTICalculator,
           "ocean-bigfive": BigFiveCalculator,
           # 其他映射
       }
       
       @classmethod
       def get_calculator(cls, assessment_id: str) -> BaseCalculator:
           return cls._calculators.get(assessment_id, BaseCalculator)()
   ```

---

## 🚀 阶段三：API 实现与集成（3-5天）

### Task 3.1: 实现用户 API

**步骤**:

1. **创建用户 schema**
   ```python
   # backend/app/schemas/user.py
   from pydantic import BaseModel, EmailStr
   from datetime import datetime
   from typing import Optional, Dict, Any
   
   class UserBase(BaseModel):
       username: str
       email: EmailStr
       avatar: Optional[str] = None
   
   class UserCreate(UserBase):
       password: str
   
   class UserUpdate(BaseModel):
       username: Optional[str] = None
       email: Optional[EmailStr] = None
       avatar: Optional[str] = None
       settings: Optional[Dict[str, Any]] = None
   
   class UserResponse(UserBase):
       id: str
       created_at: datetime
       updated_at: datetime
       
       class Config:
           from_attributes = True
   ```

2. **创建用户服务**
   ```python
   # backend/app/services/user_service.py
   from sqlalchemy.orm import Session
   from app.models.user import User
   from app.schemas.user import UserCreate, UserUpdate
   from app.core.security import get_password_hash, verify_password
   import uuid
   
   class UserService:
       def __init__(self, db: Session):
           self.db = db
       
       def get_user(self, user_id: str):
           return self.db.query(User).filter(User.id == user_id).first()
       
       def create_user(self, user_in: UserCreate):
           db_user = User(
               id=str(uuid.uuid4()),
               username=user_in.username,
               email=user_in.email,
               hashed_password=get_password_hash(user_in.password),
           )
           self.db.add(db_user)
           self.db.commit()
           self.db.refresh(db_user)
           return db_user
   ```

3. **创建用户 API 路由**
   ```python
   # backend/app/api/v1/users.py
   from fastapi import APIRouter, Depends, HTTPException
   from sqlalchemy.orm import Session
   from app.core.database import get_db
   from app.schemas.user import UserCreate, UserUpdate, UserResponse
   from app.services.user_service import UserService
   
   router = APIRouter()
   
   @router.post("/", response_model=UserResponse)
   def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
       service = UserService(db)
       return service.create_user(user_in)
   
   @router.get("/{user_id}", response_model=UserResponse)
   def get_user(user_id: str, db: Session = Depends(get_db)):
       service = UserService(db)
       user = service.get_user(user_id)
       if not user:
           raise HTTPException(status_code=404, detail="User not found")
       return user
   ```

---

### Task 3.2: 实现测评 API

**步骤**:

1. **创建测评 schema**
   ```python
   # backend/app/schemas/assessment.py
   from pydantic import BaseModel
   from typing import List, Dict, Any, Optional
   from datetime import datetime
   
   class Answer(BaseModel):
       questionId: str
       selectedOption: str
       value: int
       trait: Optional[str] = None
   
   class AssessmentSubmission(BaseModel):
       assessmentId: str
       answers: List[Answer]
   
   class AssessmentResult(BaseModel):
       id: str
       assessmentId: str
       result: Dict[str, Any]
       submittedAt: datetime
   ```

2. **创建测评服务**
   ```python
   # backend/app/services/assessment_service.py
   from sqlalchemy.orm import Session
   from app.models.assessment import AssessmentRecord
   from app.schemas.assessment import AssessmentSubmission
   from app.services.calculator_factory import CalculatorFactory
   from app.data.assessment_data_service import AssessmentDataService
   import uuid
   from datetime import datetime
   from pathlib import Path
   
   class AssessmentService:
       def __init__(self, db: Session):
           self.db = db
           self.data_service = AssessmentDataService(Path("app/data/assessments"))
       
       def get_assessment(self, assessment_id: str):
           return self.data_service.load_assessment(assessment_id)
       
       def submit_assessment(self, user_id: str, submission: AssessmentSubmission):
           calculator = CalculatorFactory.get_calculator(submission.assessmentId)
           result = calculator.calculate(submission.answers)
           
           record = AssessmentRecord(
               id=str(uuid.uuid4()),
               user_id=user_id,
               assessment_id=submission.assessmentId,
               answers=[a.dict() for a in submission.answers],
               result=result,
               submitted_at=datetime.utcnow(),
           )
           self.db.add(record)
           self.db.commit()
           self.db.refresh(record)
           
           return record
   ```

3. **创建测评 API 路由**
   ```python
   # backend/app/api/v1/assessments.py
   from fastapi import APIRouter, Depends, HTTPException
   from sqlalchemy.orm import Session
   from app.core.database import get_db
   from app.schemas.assessment import AssessmentSubmission, AssessmentResult
   from app.services.assessment_service import AssessmentService
   
   router = APIRouter()
   
   @router.get("/")
   def list_assessments():
       # 返回所有可用测评列表
       pass
   
   @router.get("/{assessment_id}")
   def get_assessment(assessment_id: str):
       # 返回单个测评详情
       pass
   
   @router.post("/submit", response_model=AssessmentResult)
   def submit_assessment(
       submission: AssessmentSubmission,
       user_id: str = "demo-user",  # 临时，后续加认证
       db: Session = Depends(get_db)
   ):
       service = AssessmentService(db)
       return service.submit_assessment(user_id, submission)
   ```

---

## 🚀 阶段四：前端 API 适配与本地 fallback（3-4天）

### Task 4.1: 增强前端 API 客户端

**步骤**:

1. **更新 API 客户端支持本地 fallback**
   ```typescript
   // src/api/base/client.ts
   import { getStandardAssessment } from '@/data/assessments'
   
   class ApiClient {
     private baseUrl: string
     private useFallback: boolean = false
     
     constructor(baseUrl: string = BASE_URL) {
       this.baseUrl = baseUrl
       // 检测 API 可用性
       this.checkApiAvailability()
     }
     
     private async checkApiAvailability() {
       try {
         const response = await fetch(`${this.baseUrl}/`, { method: 'HEAD' })
         this.useFallback = !response.ok
       } catch {
         this.useFallback = true
       }
     }
     
     async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
       if (this.useFallback) {
         return this.getFallbackData(endpoint)
       }
       // 正常 API 调用
     }
     
     private getFallbackData(endpoint: string): ApiResponse<any> {
       // 从本地数据加载
       if (endpoint.includes('/assessments/')) {
         const id = endpoint.split('/').pop()
         if (id) {
           const assessment = getStandardAssessment(id as any)
           return { success: true, data: assessment }
         }
       }
       return { success: false, data: null }
     }
   }
   ```

2. **实现本地数据缓存层**
   ```typescript
   // src/utils/cache/local-cache.ts
   export class LocalCache {
     private db: Promise<IDBDatabase>
     
     constructor() {
       this.db = this.initDB()
     }
     
     private async initDB(): Promise<IDBDatabase> {
       return new Promise((resolve, reject) => {
         const request = indexedDB.open('mindmirror-cache', 1)
         request.onupgradeneeded = (e) => {
           const db = (e.target as IDBOpenDBRequest).result
           db.createObjectStore('assessments', { keyPath: 'id' })
           db.createObjectStore('results', { keyPath: 'id' })
         }
         request.onsuccess = () => resolve(request.result)
         request.onerror = () => reject(request.error)
       })
     }
     
     async get(key: string, store: string): Promise<any> {
       // 实现获取逻辑
     }
     
     async set(key: string, value: any, store: string): Promise<void> {
       // 实现设置逻辑
     }
   }
   ```

---

### Task 4.2: 迁移前端业务逻辑到服务端调用

**步骤**:

1. **更新测评流程**
   ```typescript
   // src/hooks/useAssessment.ts
   import { assessmentApi } from '@api'
   
   export function useAssessment() {
     const submitAnswers = async (assessmentId: string, answers: Answer[]) => {
       try {
         // 优先尝试后端 API
         const response = await assessmentApi.submit(assessmentId, answers)
         if (response.success) {
           return response.data
         }
       } catch {
         // Fallback 到本地计算
         return calculateLocally(assessmentId, answers)
       }
     }
     
     const calculateLocally = (assessmentId: string, answers: Answer[]) => {
       // 使用原有的本地计算器
       // 保持向后兼容
     }
   }
   ```

2. **创建混合数据层**
   ```typescript
   // src/services/hybrid-data-service.ts
   export class HybridDataService {
     private cache = new LocalCache()
     
     async getAssessment(id: string) {
       // 1. 尝试从缓存获取
       // 2. 尝试从 API 获取
       // 3. 回退到本地数据
     }
     
     async submitResult(assessmentId: string, answers: Answer[]) {
       // 1. 尝试提交到 API
       // 2. 缓存到本地
       // 3. 后台同步
     }
   }
   ```

---

## 🚀 阶段五：路由优化与模块迁移（3-4天）

### Task 5.1: 优化前端路由结构

**步骤**:

1. **重构路由配置**
   ```typescript
   // src/routes/index.tsx
   import { createBrowserRouter } from 'react-router-dom'
   import { AppLayout } from '@/app/layout/AppLayout'
   
   const router = createBrowserRouter([
     {
       path: '/',
       element: <AppLayout />,
       children: [
         {
           path: 'app',
           children: [
             { path: 'home', element: <HomePage /> },
             { path: 'assessments', element: <AssessmentsPage /> },
             { path: 'assessment/:id', element: <AssessmentPage /> },
             { path: 'assessment/:id/mode-select', element: <ModeSelectPage /> },
             { path: 'assessment/:id/results', element: <ResultsPage /> },
             // 其他路由
           ],
         },
       ],
     },
   ])
   ```

2. **清理旧路由引用**

---

### Task 5.2: 优先迁移最近更新的模块

**步骤**:

1. **识别最近更新的文件**
   ```bash
   git log --name-only --since="30 days ago" --pretty=format: | sort | uniq
   ```

2. **按优先级迁移**
   - 人格类测评（已存在于 AssessmentsPage）
   - 关系类测评
   - 心理类测评
   - 职业类测评
   - 价值观类测评
   - 趣味类测评

3. **每个模块迁移步骤**
   - 验证本地数据完整性
   - 确保后端 API 支持
   - 更新前端组件
   - 测试前后端交互
   - 验证 fallback 机制

---

## 🚀 阶段六：测试与优化（2-3天）

### Task 6.1: 后端测试

**步骤**:

1. **创建单元测试**
   ```python
   # backend/tests/test_calculators.py
   import pytest
   from app.services.calculators.mbti_calculator import MBTICalculator
   
   def test_mbti_calculation():
       calculator = MBTICalculator()
       answers = [...]  # 测试数据
       result = calculator.calculate(answers)
       assert result is not None
   ```

2. **创建 API 集成测试**
   ```python
   # backend/tests/test_api.py
   from fastapi.testclient import TestClient
   from main import app
   
   client = TestClient(app)
   
   def test_list_assessments():
       response = client.get("/api/v1/assessments")
       assert response.status_code == 200
   ```

3. **运行测试**
   ```bash
   cd backend
   pytest tests/ -v
   ```

---

### Task 6.2: 前端测试

**步骤**:

1. **创建 API fallback 测试**
2. **创建端到端测试**
3. **性能测试**
   - 首屏加载
   - API 响应
   - 离线模式

---

### Task 6.3: 性能优化

**步骤**:

1. **后端优化**
   - 数据缓存（Redis 可选）
   - 数据库索引
   - 响应压缩

2. **前端优化**
   - 代码分割
   - 懒加载
   - 预取策略

---

## 🚀 阶段七：部署与文档（2天）

### Task 7.1: 容器化部署

**步骤**:

1. **创建 Docker Compose**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     backend:
       build:
         context: ./backend
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=sqlite:///./data/mindmirror.db
       volumes:
         - ./backend/data:/app/data
     
     frontend:
       build:
         context: ./
       ports:
         - "3000:80"
       depends_on:
         - backend
   ```

2. **创建后端 Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8000
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **创建前端 Dockerfile**
   ```dockerfile
   # Dockerfile (前端)
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   ```

---

### Task 7.2: 文档更新

**步骤**:

1. **更新 README**
2. **创建部署指南**
3. **创建 API 文档**
4. **创建架构文档**

---

## 📊 验收标准

### 功能完整性

- [ ] 所有现有测评可正常使用
- [ ] 计算结果与原版本一致
- [ ] 离线 fallback 机制正常工作
- [ ] 用户数据持久化正常

### 代码质量

- [ ] TypeScript 编译无错误
- [ ] Python 代码符合 PEP 8
- [ ] 测试覆盖率 > 70%
- [ ] 无循环依赖

### 性能指标

- [ ] 首屏加载 < 2s
- [ ] API 响应 < 500ms
- [ ] 离线模式可用

---

## 🔄 风险与缓解

| 风险 | 可能性 | 影响 | 缓解措施 |
|:-----|:-------|:-----|:---------|
| 计算器算法迁移出错 | 中 | 高 | 保留本地 fallback，编写全面测试 |
| 后端开发延期 | 中 | 中 | 优先实现核心 API，渐进式推进 |
| 数据格式不兼容 | 中 | 中 | 设计数据迁移脚本，验证转换结果 |
| 前端重构影响用户体验 | 低 | 中 | 保持 UI 不变，只改动底层逻辑 |

---

## 📅 时间规划

| 阶段 | 预估时间 | 关键里程碑 |
|:-----|:---------|:-----------|
| 阶段一：分析设计 | 2-3天 | 完成架构文档 |
| 阶段二：后端基础 | 3-5天 | API 脚手架完成 |
| 阶段三：API 实现 | 3-5天 | 核心 API 可用 |
| 阶段四：前端适配 | 3-4天 | 混合数据层完成 |
| 阶段五：路由迁移 | 3-4天 | 所有模块迁移完成 |
| 阶段六：测试优化 | 2-3天 | 测试通过，性能达标 |
| 阶段七：部署文档 | 2天 | 生产环境可用 |

**总计**: 18-26天

---

## 📚 参考资料

- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [React Router 6](https://reactrouter.com/)
- [现有 API 文档](../API.md)
- [架构优化文档](../../ARCHITECTURE-OPTIMIZATION.md)

---

**计划制定**: 2026-05-21
**状态**: 待执行
