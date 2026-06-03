from pydantic_settings import BaseSettings, SettingsConfigDict
import secrets


# Marker string. We can detect it later to decide whether the operator
# actually set SECRET_KEY or just let the default fall through.
_INSECURE_DEV_SECRET = "mindmirror-dev-secret-do-not-use-in-production"

# Anything shorter than this is brute-forceable in seconds with a GPU farm.
_MIN_SECRET_LEN = 32

_PROD_ENVS = {"production", "prod"}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
        env_file_encoding="utf-8",
    )

    PROJECT_NAME: str = "MindMirror API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = "postgresql://mental_user:mental_password@postgres:5432/mental_health_db"

    SECRET_KEY: str = _INSECURE_DEV_SECRET
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    CORS_ORIGIN: str = ""

    ENVIRONMENT: str = "development"


def _is_production(env: str) -> bool:
    return env.strip().lower() in _PROD_ENVS


def _validate_secret(settings: Settings) -> None:
    """Fail fast in production. In dev, generate an ephemeral key so we
    never silently sign tokens with a value that's checked into git."""
    is_prod = _is_production(settings.ENVIRONMENT)
    is_default = settings.SECRET_KEY == _INSECURE_DEV_SECRET
    too_short = len(settings.SECRET_KEY) < _MIN_SECRET_LEN

    if is_prod and (is_default or too_short):
        raise RuntimeError(
            "SECRET_KEY must be set to a random string of at least "
            f"{_MIN_SECRET_LEN} characters in production. Try: "
            'python -c "import secrets; print(secrets.token_urlsafe(64))"'
        )

    if is_default and not is_prod:
        # Loud warning + ephemeral replacement. Sessions won't survive a
        # restart, which is the right behaviour for a dev box.
        import logging

        logging.getLogger("mindmirror.config").warning(
            "SECRET_KEY is unset; generated an ephemeral key for this process."
        )
        object.__setattr__(settings, "SECRET_KEY", secrets.token_urlsafe(64))


settings = Settings()
_validate_secret(settings)
