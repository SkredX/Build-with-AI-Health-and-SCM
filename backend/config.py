from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str = ""
    CORS_ORIGINS: list[str] = ["*"]
    MODEL_NAME: str = "gemini-1.5-flash"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
