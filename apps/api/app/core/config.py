from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    civicos_env: str = "development"
    civicos_database_url: str = "sqlite:///./civicos.db"
    civicos_cors_origins: str = "http://localhost:3000"
    civicos_upload_dir: Path = Path("./uploads")
    civicos_max_upload_mb: int = 15
    civicos_allow_demo_auth: bool = True
    firebase_project_id: str | None = None
    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"
    civicos_yolo_weights: str | None = None

    @property
    def is_production(self) -> bool:
        return self.civicos_env.lower() == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.civicos_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

