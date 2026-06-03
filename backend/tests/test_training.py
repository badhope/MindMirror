"""Tests for training-plan creation guards."""
from __future__ import annotations

import pytest
import uuid


def _auth(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _register(client, email, username, password="hunter22"):
    r = client.post(
        "/api/v1/auth/register",
        json={"email": email, "username": username, "password": password},
    )
    assert r.status_code == 201
    return r.json()["access_token"]


def _make_result(client, token, assessment_id="big-five", total_score=50.0):
    r = client.post(
        "/api/v1/results/",
        json={
            "assessment_id": assessment_id,
            "assessment_title": "Big Five",
            "total_score": total_score,
            "traits": [],
        },
        headers=_auth(token),
    )
    assert r.status_code == 201
    return r.json()["id"]


def test_create_training_plan_with_own_result_succeeds(client):
    token = _register(client, "owner@x.com", "owner")
    result_id = _make_result(client, token)

    r = client.post(
        "/api/v1/training/",
        json={
            "plan_name": "My plan",
            "description": "personalised",
            "start_date": "2026-01-01",
            "end_date": "2026-01-30",
            "result_id": result_id,
            "tasks": [],
        },
        headers=_auth(token),
    )
    assert r.status_code == 201
    assert r.json()["result_id"] == result_id


def test_create_training_plan_with_other_users_result_is_rejected(client):
    """A user must not be able to attach a training plan to somebody
    else's assessment result. The response is intentionally 404 (not
    403) so we don't leak whether the result_id exists at all."""
    token_a = _register(client, "a@x.com", "alice")
    token_b = _register(client, "b@x.com", "bob")
    result_id = _make_result(client, token_a)

    r = client.post(
        "/api/v1/training/",
        json={
            "plan_name": "Sneaky plan",
            "description": "attaching to alice's result",
            "start_date": "2026-01-01",
            "end_date": "2026-01-30",
            "result_id": result_id,
            "tasks": [],
        },
        headers=_auth(token_b),
    )
    assert r.status_code == 404


def test_create_training_plan_with_nonexistent_result_is_rejected(client):
    token = _register(client, "c@x.com", "carol")
    r = client.post(
        "/api/v1/training/",
        json={
            "plan_name": "Phantom plan",
            "description": "no such result",
            "start_date": "2026-01-01",
            "end_date": "2026-01-30",
            "result_id": str(uuid.uuid4()),
            "tasks": [],
        },
        headers=_auth(token),
    )
    assert r.status_code == 404


def test_create_training_plan_without_result_id_still_works(client):
    """The new ownership check must not break plans that don't tie back
    to a result (the common offline case)."""
    token = _register(client, "d@x.com", "dave")
    r = client.post(
        "/api/v1/training/",
        json={
            "plan_name": "Standalone plan",
            "description": "no result",
            "start_date": "2026-01-01",
            "end_date": "2026-01-30",
            "tasks": [],
        },
        headers=_auth(token),
    )
    assert r.status_code == 201
    assert r.json()["result_id"] is None
