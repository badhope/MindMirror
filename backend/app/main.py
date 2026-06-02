from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, assessments, results, training, mood, achievements
from app.database import Base, engine


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="心理测评与管理训练系统后端 API",
    docs_url="/docs",
    redoc_url="/redoc"
)


allowed_origins = [o.strip() for o in (settings.CORS_ORIGIN or "").split(",") if o.strip()]
if not allowed_origins:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["认证"])
app.include_router(assessments.router, prefix=f"{settings.API_V1_STR}/assessments", tags=["测评"])
app.include_router(results.router, prefix=f"{settings.API_V1_STR}/results", tags=["结果"])
app.include_router(training.router, prefix=f"{settings.API_V1_STR}/training", tags=["训练计划"])
app.include_router(mood.router, prefix=f"{settings.API_V1_STR}/mood", tags=["心情"])
app.include_router(achievements.router, prefix=f"{settings.API_V1_STR}/achievements", tags=["成就"])


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {
        "message": "欢迎使用 MindMirror API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME
    }
