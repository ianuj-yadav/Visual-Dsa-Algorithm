from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "AlgoJudge API"
    DATABASE_URL: str = "postgresql://algojudge:newpass123@127.0.0.1:5434/algojudge_db"
    SECRET_KEY: str = "supersecretkey_algojudge"  # In production, change this
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days in minutes
    CORS_ORIGINS: List[str] = ["*"] # List of origins for CORS. e.g. ["http://localhost", "http://localhost:8080"]

    class Config:
        env_file = ".env"

settings = Settings()
