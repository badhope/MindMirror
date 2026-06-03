from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

import logging as _logging

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


# Middleware execution order in Starlette is "last added, first executed".
# CORS must sit on the outside so OPTIONS preflight short-circuits before
# rate-limiting or request-id stamping has a chance to reject the call.
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(RequestContextMiddleware)
install_cors(app)


@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests, slow down."},
        headers={"Retry-After": str(getattr(exc, "retry_after", 60))},
    )


@app.exception_handler(RequestValidationError)
async def _validation_handler(request: Request, exc: RequestValidationError):
    # Pydantic's default 422 echoes every field path & input back to the
    # caller. In production we hide the input values to avoid leaking
    # sensitive payloads, but keep the field path so the client can fix
    # the request.
    is_prod = settings.ENVIRONMENT.strip().lower() in {"production", "prod"}

    def _stringify(value):
        # Pydantic sometimes attaches a non-JSON-serialisable value
        # under 'ctx' (e.g. an exception instance). JSONResponse will
        # crash on those, so coerce aggressively.
        if isinstance(value, (str, int, float, bool, type(None))):
            return value
        if isinstance(value, (list, tuple)):
            return [_stringify(v) for v in value]
        if isinstance(value, dict):
            return {str(k): _stringify(v) for k, v in value.items()}
        return str(value)

    raw_errors = exc.errors()
    if is_prod:
        # Strip the 'input' / 'ctx' fields — they often echo back the
        # caller's submitted payload (potentially containing passwords
        # or other secrets) and we don't need them in the SPA anyway.
        sanitized = [
            {"loc": list(e.get("loc", [])), "msg": e.get("msg"), "type": e.get("type")}
            for e in raw_errors
        ]
    else:
        sanitized = [_stringify(e) for e in raw_errors]
    return JSONResponse(status_code=422, content={"detail": "Validation error", "errors": sanitized})


@app.exception_handler(StarletteHTTPException)
async def _http_exception_handler(request: Request, exc: StarletteHTTPException):
    # Default FastAPI handler already returns {detail: ...}; we just
    # normalise 404 / 405 to a consistent shape so the SPA doesn't have
    # to special-case missing endpoints.
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail if exc.detail is not None else "Error"},
        headers=getattr(exc, "headers", None) or {},
    )


@app.exception_handler(Exception)
async def _unhandled_exception_handler(request: Request, exc: Exception):
    # Last-resort handler. Log with the request id (set by
    # RequestContextMiddleware) so an operator can correlate the trace
    # to a specific call. Never echo the message to the client in
    # production — it can leak SQL fragments, file paths, etc.
    request_id = getattr(request.state, "request_id", None)
    _logging.getLogger("mindmirror.unhandled").exception(
        "unhandled exception in %s %s", request.method, request.url.path,
        extra={"request_id": request_id, "path": request.url.path},
    )
    is_prod = settings.ENVIRONMENT.strip().lower() in {"production", "prod"}
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"} if is_prod
                  else {"detail": "Internal server error", "type": exc.__class__.__name__},
        headers={"X-Request-ID": request_id} if request_id else {},
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
