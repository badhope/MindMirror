"""Rate-limit / 429 behaviour for the auth router."""
from __future__ import annotations


def test_auth_rate_limit_triggers_429(client):
    # AUTH_LIMIT is 20/minute/IP. The shared in-memory limiter was reset
    # by the client fixture, so we have the whole budget to burn.
    last = None
    for _ in range(25):
        last = client.post(
            "/api/v1/auth/login",
            data={"username": "nobody@nowhere.invalid", "password": "x"},
        )
    assert last is not None
    # The 21st through 25th requests should be 429.
    assert last.status_code == 429
    assert "Retry-After" in last.headers
