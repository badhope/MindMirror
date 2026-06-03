from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.api import auth, assessments, results, training, mood, achievements
from app.database import Base, engine
from app.core.cors import install_cors
from app.core.logging import configure_logging
from app.core.middleware import RequestContextMiddleware
from app.core.ratelimit import limiter


configure_logging(settings.ENVIRONMENT)


@asynccontextmanager
async def lifespan(_: FastAPI):
    # create_all is fine for the demo; switch to Alembic before going big.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="心理测评与管理训练系统后端 API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter


# Middleware runs in reverse registration order, so this wraps the CORS
# response with the request-id header.
install_cors(app)
app.add_middleware(RequestContextMiddleware)
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(request: Request, exc: RateLimitExceeded):
    from fastapi.responses import JSONResponse

    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests, slow down."},
        headers={"Retry-After": str(getattr(exc, "retry_after", 60))},
    )

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["认证"])
app.include_router(assessments.router, prefix=f"{settings.API_V1_STR}/assessments", tags=["测评"])
app.include_router(results.router, prefix=f"{settings.API_V1_STR}/results", tags=["结果"])
app.include_router(training.router, prefix=f"{settings.API_V1_STR}/training", tags=["训练计划"])
app.include_router(mood.router, prefix=f"{settings.API_V1_STR}/mood", tags=["心情"])
app.include_router(achievements.router, prefix=f"{settings.API_V1_STR}/achievements", tags=["成就"])


@app.get("/")
async def root():
    return {
        "message": "欢迎使用 MindMirror API",
        "version": settings.VERSION,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME}
