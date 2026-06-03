"""Tests for the pagination/validation guards on list endpoints."""
from __future__ import annotations

import pytest


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _register(client, email="p@p.com", username="pageuser", password="hunter22"):
    r = client.post(
        "/api/v1/auth/register",
        json={"email": email, "username": username, "password": password},
    )
    assert r.status_code == 201
    return r.json()["access_token"]


@pytest.mark.parametrize(
    "path",
    [
        "/api/v1/results/",
        "/api/v1/mood/",
        "/api/v1/training/",
        "/api/v1/achievements/",
    ],
)
def test_list_rejects_negative_skip(client, path, registered_user):
    r = client.get(f"{path}?skip=-1", headers=_auth(registered_user["access_token"]))
    assert r.status_code == 422


@pytest.mark.parametrize(
    "path,ceiling",
    [
        ("/api/v1/results/", 201),
        ("/api/v1/mood/", 201),
        ("/api/v1/training/", 101),
        ("/api/v1/achievements/", 201),
    ],
)
def test_list_rejects_oversized_limit(client, path, ceiling, registered_user):
    r = client.get(
        f"{path}?limit={ceiling}", headers=_auth(registered_user["access_token"])
    )
    assert r.status_code == 422


@pytest.mark.parametrize(
    "path",
    [
        "/api/v1/results/",
        "/api/v1/mood/",
        "/api/v1/training/",
        "/api/v1/achievements/",
    ],
)
def test_list_accepts_default_pagination(client, path, registered_user):
    r = client.get(path, headers=_auth(registered_user["access_token"]))
    assert r.status_code == 200
