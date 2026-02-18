"""
Application configuration using Pydantic Settings
"""

from typing import List

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Stogra API"

    ALLOWED_ORIGINS_STR: str = "http://localhost:5173,http://localhost:3000,http://localhost:8000,https://*.pages.dev"

    ENV: str = "development"
    DEBUG: bool = True

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS_STR.split(",")]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
