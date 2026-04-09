"""Application configuration."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://ledgerdesk:ledgerdesk_dev@localhost:5433/ledgerdesk"
    database_url_sync: str = "postgresql://ledgerdesk:ledgerdesk_dev@localhost:5433/ledgerdesk"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # LLM
    openai_api_key: str = ""
    openai_base_url: str = "https://api.openai.com/v1"
    llm_model: str = "gpt-4o"

    # App
    environment: str = "development"
    log_level: str = "INFO"
    secret_key: str = "dev-secret-change-in-production"

    # Agent settings
    confidence_threshold: float = 0.7
    grounding_threshold: float = 0.5
    max_tool_calls: int = 10
    tool_timeout_seconds: int = 30

    model_config = {"env_file": ".env", "extra": "allow"}


settings = Settings()
