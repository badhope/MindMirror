"""Config + CORS startup-validation tests."""
from __future__ import annotations

import pytest

from app.core import cors
from app.core.cors import resolve_origins


def test_dev_defaults_when_unset(monkeypatch):
    monkeypatch.setattr("app.core.cors.settings.CORS_ORIGIN", "", raising=False)
    monkeypatch.setattr("app.core.cors.settings.ENVIRONMENT", "development", raising=False)
    origins = resolve_origins()
    assert "http://localhost:5173" in origins


def test_wildcard_rejected_in_dev(monkeypatch):
    monkeypatch.setattr("app.core.cors.settings.CORS_ORIGIN", "*", raising=False)
    monkeypatch.setattr("app.core.cors.settings.ENVIRONMENT", "development", raising=False)
    with pytest.raises(RuntimeError):
        resolve_origins()


def test_production_requires_explicit_origin(monkeypatch):
    monkeypatch.setattr("app.core.cors.settings.CORS_ORIGIN", "", raising=False)
    monkeypatch.setattr("app.core.cors.settings.ENVIRONMENT", "production", raising=False)
    with pytest.raises(RuntimeError):
        resolve_origins()


def test_production_parses_comma_separated(monkeypatch):
    monkeypatch.setattr(
        "app.core.cors.settings.CORS_ORIGIN",
        "https://a.com, https://b.com",
        raising=False,
    )
    monkeypatch.setattr("app.core.cors.settings.ENVIRONMENT", "production", raising=False)
    assert resolve_origins() == ["https://a.com", "https://b.com"]
