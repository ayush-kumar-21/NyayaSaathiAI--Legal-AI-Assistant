from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",          # Silently ignore unknown env vars
        env_file_encoding="utf-8",
    )

    PROJECT_NAME: str = "LegalOS 4.0"
    VERSION: str = "4.0.0"
    DESCRIPTION: str = "AI-powered judicial case management system"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GOOGLE_CLIENT_ID: str = "your-google-client-id"
    
    # AI Keys
    OPENAI_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # Database
    DATABASE_URL: str = "sqlite:///./legalos.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Judicial Settings
    MAX_DAILY_MINUTES: int = 330  # 5.5 hours
    LUNCH_BREAK_MINUTES: int = 60


settings = Settings()
