from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import users, assessments, achievements, training, moods
from app.core.database import engine, Base

Base.metadata.create_all(bind=engine)

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


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
