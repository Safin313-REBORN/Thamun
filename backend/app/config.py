from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    cors_allow_origins: str = "http://localhost:3000"
    session_secret: str = "dev-only-secret-change-in-prod"
    database_path: str = "./thamun.db"
    rate_limit_per_minute: int = 30
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_allow_origins.split(",") if o.strip()]


settings = Settings()
