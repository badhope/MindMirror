"""Auth + account lifecycle tests."""
from __future__ import annotations


def test_register_then_login(client):
    r = client.post(
        "/api/v1/auth/register",
        json={"email": "a@b.com", "username": "alice", "password": "hunter22"},
    )
    assert r.status_code == 201
    body = r.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "a@b.com"
    assert body["user"]["is_guest"] is False

    r2 = client.post(
        "/api/v1/auth/login",
        data={"username": "a@b.com", "password": "hunter22"},
    )
    assert r2.status_code == 200
    assert r2.json()["access_token"]


def test_register_rejects_short_username(client):
    # username has min_length=3 in the schema
    r = client.post(
        "/api/v1/auth/register",
        json={"email": "a@b.com", "username": "al", "password": "hunter22"},
    )
    assert r.status_code == 422


def test_register_rejects_short_password(client):
    r = client.post(
        "/api/v1/auth/register",
        json={"email": "x@x.com", "username": "xxx", "password": "1"},
    )
    assert r.status_code == 422


def test_register_rejects_bad_email(client):
    r = client.post(
        "/api/v1/auth/register",
        json={"email": "not-an-email", "username": "xxx", "password": "hunter22"},
    )
    assert r.status_code == 422


def test_username_uniqueness(client):
    a = client.post(
        "/api/v1/auth/register",
        json={"email": "one@x.com", "username": "samename", "password": "hunter22"},
    )
    assert a.status_code == 201
    b = client.post(
        "/api/v1/auth/register",
        json={"email": "two@x.com", "username": "samename", "password": "hunter22"},
    )
    assert b.status_code == 400
    assert "taken" in b.json()["detail"].lower()


def test_email_uniqueness(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "dup@x.com", "username": "first", "password": "hunter22"},
    )
    r = client.post(
        "/api/v1/auth/register",
        json={"email": "dup@x.com", "username": "second", "password": "hunter22"},
    )
    assert r.status_code == 400


def test_login_wrong_password(client, registered_user):
    r = client.post(
        "/api/v1/auth/login",
        data={"username": "alice@example.com", "password": "wrong"},
    )
    assert r.status_code == 401


def test_delete_account_requires_password(client, registered_user):
    token = registered_user["access_token"]
    r = client.request("DELETE", "/api/v1/auth/account", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 400


def test_delete_account_rejects_wrong_password(client, registered_user):
    token = registered_user["access_token"]
    r = client.request(
        "DELETE",
        "/api/v1/auth/account",
        json={"password": "wrong"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 401


def test_delete_account_with_correct_password(client, registered_user):
    token = registered_user["access_token"]
    r = client.request(
        "DELETE",
        "/api/v1/auth/account",
        json={"password": "supersecret"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 204


def test_guest_can_self_delete_without_password(client):
    r = client.post("/api/v1/auth/guest")
    assert r.status_code == 200
    token = r.json()["access_token"]
    r = client.request(
        "DELETE", "/api/v1/auth/account", headers={"Authorization": f"Bearer {token}"}
    )
    assert r.status_code == 204


def test_avatar_url_rejects_javascript(client, registered_user):
    token = registered_user["access_token"]
    r = client.patch(
        "/api/v1/auth/me",
        json={"avatar_url": "javascript:alert(1)"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 422


def test_avatar_url_rejects_data_and_file(client, registered_user):
    token = registered_user["access_token"]
    for url in ("data:text/html,hi", "file:///etc/passwd"):
        r = client.patch(
            "/api/v1/auth/me",
            json={"avatar_url": url},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert r.status_code == 422, url


def test_avatar_url_accepts_https(client, registered_user):
    token = registered_user["access_token"]
    r = client.patch(
        "/api/v1/auth/me",
        json={"avatar_url": "https://cdn.example.com/me.png"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 200
    assert r.json()["avatar_url"] == "https://cdn.example.com/me.png"


def test_protected_endpoint_requires_token(client):
    r = client.get("/api/v1/auth/me")
    assert r.status_code == 401
