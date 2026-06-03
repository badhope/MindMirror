"""Shared pytest fixtures.

We point at a fresh in-memory SQLite per test so the suite is
hermetic — no need to spin up Postgres in CI. Models are imported for
their side effect of registering them on ``Base.metadata``.
"""
from __future__ import annotations

import os

# Set test-only env *before* the app reads settings.
os.environ.setdefault("SECRET_KEY", "test-secret-not-used-in-prod-12345678")
os.environ.setdefault("CORS_ORIGIN", "http://localhost:5173")
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("ENVIRONMENT", "development")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Importing the models registers them on Base.metadata.
from app.models import user, assessment, result, training, mood  # noqa: F401


@pytest.fixture()
def engine():
    eng = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=eng)
    yield eng
    eng.dispose()


@pytest.fixture()
def db_session(engine):
    Session = sessionmaker(bind=engine)
    s = Session()
    try:
        yield s
    finally:
        s.close()


@pytest.fixture()
def client(engine):
    """A TestClient with the get_db dependency overridden to use the
    per-test in-memory engine."""
    Session = sessionmaker(bind=engine)

    def _override_get_db():
        s = Session()
        try:
            yield s
        finally:
            s.close()

    app.dependency_overrides[get_db] = _override_get_db
    # Reset the slowapi in-memory counters so one test can't rate-limit
    # the next one.
    from app.core.ratelimit import limiter

    limiter.reset()
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def registered_user(client):
    resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "alice@example.com",
            "username": "alice",
            "password": "supersecret",
        },
    )
    assert resp.status_code == 201, resp.text
    return resp.json()
