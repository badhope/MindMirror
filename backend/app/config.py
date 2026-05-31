from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "心测助手 API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # 默认使用 SQLite，简单方便无需额外安装
    DATABASE_URL: str = "sqlite:///./mental_health.db"
    DATABASE_URL_POSTGRES: str = "postgresql://mental_user:mental_password@postgres:5432/mental_health_db"
    
    SECRET_KEY: str = "your-super-secret-key-change-in-production-!@#$%^&*()"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        # 确保 .env 没有覆盖我们的数据库设置
        extra = "ignore"


settings = Settings()
