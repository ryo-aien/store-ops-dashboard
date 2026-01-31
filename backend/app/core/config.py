from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/branch_dashboard"
    API_SECRET_KEY: str = "dev-secret-key-change-in-production"

    class Config:
        env_file = ".env"


settings = Settings()
