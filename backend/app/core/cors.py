"""CORS allow-list resolution.

Kept in its own module because the rules are non-obvious and the test
suite (and any future ``pre-start`` script) needs to import them.
"""
from __future__ import annotations

from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings


# Common Vite/CRACO/CRA dev ports. Anything else needs to be added here
# or, preferably, set via CORS_ORIGIN in the environment.
_DEV_DEFAULT_ORIGINS = (
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:3000",
)


def _is_production(env: str) -> bool:
    return env.strip().lower() in {"production", "prod"}


def _split_origins(raw: str) -> List[str]:
    return [o.strip() for o in raw.split(",") if o.strip()]


def resolve_origins() -> List[str]:
    """Return the CORS allow-list, validating it against the deployment env."""
    if _is_production(settings.ENVIRONMENT):
        if not settings.CORS_ORIGIN:
            raise RuntimeError(
                "CORS_ORIGIN is required in production "
                "(e.g. 'https://mindmirror.app,https://www.mindmirror.app')."
            )
        origins = _split_origins(settings.CORS_ORIGIN)
    else:
        origins = _split_origins(settings.CORS_ORIGIN) or list(_DEV_DEFAULT_ORIGINS)

    if "*" in origins:
        # Browsers reject this combination, but failing here is friendlier
        # than waiting for a confusing 401 in the SPA console.
        raise RuntimeError("CORS_ORIGIN cannot be '*' when credentials are enabled.")

    return origins


def install_cors(app: FastAPI) -> None:
    origins = resolve_origins()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
        max_age=600,
    )
