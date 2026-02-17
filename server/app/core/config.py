"""
Application configuration using Pydantic Settings
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Stogra API"

    # CORS - Allow all origins in development
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
        "http://localhost:8000",
        # Production URLs (Cloudflare Pages)
        "https://*.pages.dev",
    ]

    # Environment
    ENV: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
