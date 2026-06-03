"""Smoke tests for the global exception handlers added in main.py.

Covers the four handlers:

* ``RateLimitExceeded``        — 429 + Retry-After (already covered by
                                  test_rate_limit.py; kept here for the
                                  "all handlers respond" contract)
* ``RequestValidationError``   — 422 with sanitised error list
* ``StarletteHTTPException``   — 404/405 normalised shape
* generic ``Exception``         — 500 with no internal details leaked
"""
from __future__ import annotations

import pytest
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def anon_client():
    with TestClient(app) as c:
        yield c


def test_validation_422_includes_field_path(anon_client):
    # Login with a malformed body — missing required fields.
    resp = anon_client.post("/api/v1/auth/login", json={})
    assert resp.status_code == 422
    body = resp.json()
    assert body["detail"] == "Validation error"
    assert isinstance(body["errors"], list) and body["errors"], "errors list should be present"
    # Each error entry exposes the JSON pointer (loc) so the SPA can
    # highlight the offending form field.
    for entry in body["errors"]:
        assert "loc" in entry
        assert "msg" in entry
        assert "type" in entry


def test_validation_422_omits_input_in_production(monkeypatch):
    # In production the default Pydantic handler echoes the original
    # input back to the caller, which can leak passwords / tokens
    # submitted in the failing payload. The custom handler must strip
    # that.
    from app import config as cfg

    class _FakeSettings:
        ENVIRONMENT = "production"
        API_V1_STR = cfg.settings.API_V1_STR
        PROJECT_NAME = cfg.settings.PROJECT_NAME
        VERSION = cfg.settings.VERSION
        SECRET_KEY = "x" * 64
        ALGORITHM = cfg.settings.ALGORITHM
        ACCESS_TOKEN_EXPIRE_MINUTES = cfg.settings.ACCESS_TOKEN_EXPIRE_MINUTES
        CORS_ORIGIN = "https://mindmirror.app"
        DATABASE_URL = cfg.settings.DATABASE_URL

    monkeypatch.setattr(cfg, "settings", _FakeSettings(), raising=True)
    # The handler closes over the real settings module, so patch where
    # the symbol is read.
    import app.main as main_mod

    monkeypatch.setattr(main_mod, "settings", _FakeSettings(), raising=True)

    with TestClient(app) as c:
        # Submit something that *will* fail validation AND carries
        # something secret in the body.
        resp = c.post(
            "/api/v1/auth/login",
            json={"username": "alice", "password": "SUPER-SECRET-PASSWORD-12345"},
        )
        assert resp.status_code == 422
        body = resp.json()
        # No entry should echo back "SUPER-SECRET-PASSWORD-12345"
        raw = str(body)
        assert "SUPER-SECRET-PASSWORD-12345" not in raw


def test_http_exception_normalised_shape(anon_client):
    # 404 from a route the app doesn't have.
    resp = anon_client.get("/api/v1/this-route-does-not-exist")
    assert resp.status_code == 404
    body = resp.json()
    assert "detail" in body
    assert isinstance(body["detail"], str)


def test_unhandled_exception_returns_500(monkeypatch):
    # Register a temporary route that raises a bare Exception to make
    # sure the global handler kicks in.
    @app.get("/__boom__")
    def _boom():
        raise RuntimeError("super-secret-internal-detail-must-not-leak")

    try:
        with TestClient(app, raise_server_exceptions=False) as c:
            resp = c.get("/__boom__")
            assert resp.status_code == 500
            body = resp.json()
            assert body["detail"] == "Internal server error"
            # The internal exception message must not be echoed to the
            # client. (In dev mode, only the type is included — never
            # the message.)
            assert "super-secret-internal-detail-must-not-leak" not in str(body)
    finally:
        # Tear down the route so other tests are not affected.
        app.router.routes = [
            r for r in app.router.routes if getattr(r, "path", "") != "/__boom__"
        ]


def test_unhandled_exception_includes_request_id_header(monkeypatch):
    @app.get("/__boom2__")
    def _boom2():
        raise ValueError("internal detail")

    try:
        with TestClient(app, raise_server_exceptions=False) as c:
            resp = c.get("/__boom2__", headers={"X-Request-ID": "test-req-12345"})
            assert resp.status_code == 500
            # The middleware echoes the request id back so an operator
            # can grep their logs for the same id.
            assert resp.headers.get("X-Request-ID") == "test-req-12345"
    finally:
        app.router.routes = [
            r for r in app.router.routes if getattr(r, "path", "") != "/__boom2__"
        ]


def test_http_exception_with_custom_status(anon_client):
    # A handler that explicitly raises 409 should still flow through
    # the custom HTTPException handler and keep the original status.
    from app.main import app

    @app.get("/__conflict__")
    def _conflict():
        raise HTTPException(status_code=409, detail="duplicate entry")

    try:
        with TestClient(app) as c:
            resp = c.get("/__conflict__")
            assert resp.status_code == 409
            assert resp.json() == {"detail": "duplicate entry"}
    finally:
        app.router.routes = [
            r for r in app.router.routes if getattr(r, "path", "") != "/__conflict__"
        ]
