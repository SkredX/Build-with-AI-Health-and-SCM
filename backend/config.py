import json
from typing import Union

from pydantic import AliasChoices, Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from typing_extensions import Annotated


class Settings(BaseSettings):
    """Runtime settings, read from environment variables (or a local .env file)."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    GEMINI_API_KEY: str = ""

    # Accepts either MODEL_NAME or GEMINI_MODEL (the name used in .env.example).
    # Check https://ai.google.dev/gemini-api/docs/models for currently live models.
    MODEL_NAME: str = Field(
        default="gemini-2.0-flash",
        validation_alias=AliasChoices("MODEL_NAME", "GEMINI_MODEL"),
    )

    # Accepts a comma-separated list ("https://a.app,https://b.app"),
    # a JSON array, or "*". NoDecode stops pydantic from forcing JSON parsing.
    CORS_ORIGINS: Annotated[list[str], NoDecode] = ["*"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _parse_origins(cls, v: Union[str, list]):
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                return json.loads(v)
            return [o.strip().rstrip("/") for o in v.split(",") if o.strip()]
        return v


settings = Settings()
