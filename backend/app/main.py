from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, assessments, results, training
from app.database import Base, engine


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="心理测评与管理训练系统后端 API",
    docs_url="/docs",
    redoc_url="/redoc"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["认证"])
app.include_router(assessments.router, prefix=f"{settings.API_V1_STR}/assessments", tags=["测评"])
app.include_router(results.router, prefix=f"{settings.API_V1_STR}/results", tags=["结果"])
app.include_router(training.router, prefix=f"{settings.API_V1_STR}/training", tags=["训练计划"])


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {
        "message": "欢迎使用心测助手 API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME
    }
