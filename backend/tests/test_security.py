"""Tests for the security primitives that don't depend on FastAPI."""
from __future__ import annotations

import base64
import json

import pytest

from app.config import settings
from app.core.security import (
    create_access_token,
    get_password_hash,
    verify_password,
    verify_token,
)


def test_password_roundtrip():
    h = get_password_hash("hunter22")
    assert verify_password("hunter22", h) is True
    assert verify_password("wrong", h) is False


def test_bcrypt_72_byte_truncation():
    # bcrypt silently truncates beyond 72 bytes; verify_password uses
    # the same _truncate helper, so a long input must still match a
    # hash of its first 72 bytes.
    long_pw = "a" * 80 + "tail"
    h = get_password_hash(long_pw)
    assert verify_password(long_pw, h) is True
    # A different 73+ byte password with the same first 72 chars is
    # by design treated as a match — that's a bcrypt property, not ours.
    assert verify_password("a" * 72, h) is True


def test_token_decode_roundtrip():
    tok = create_access_token({"sub": "user-123"})
    assert verify_token(tok)["sub"] == "user-123"


def _b64url(data: dict) -> str:
    return base64.urlsafe_b64encode(json.dumps(data).encode()).rstrip(b"=").decode()


def test_token_rejects_alg_none():
    """A token with alg=none must be rejected. We hand-roll the JWS
    because jose refuses to *encode* with alg=none (which is good — but
    means we have to forge it to test the decode side)."""
    header = _b64url({"alg": "none", "typ": "JWT"})
    payload = _b64url({"sub": "evil", "exp": 9999999999})
    # Unsecured JWS: signature segment is empty.
    forged = f"{header}.{payload}."
    assert verify_token(forged) is None


def test_token_rejects_wrong_secret():
    """A token signed with a different HS256 secret must be rejected."""
    from jose import jwt

    other = jwt.encode({"sub": "x"}, "different-secret-also-long-enough", algorithm="HS256")
    assert verify_token(other) is None


def test_token_rejects_garbage():
    assert verify_token("not-a-jwt") is None
    assert verify_token("") is None
    assert verify_token("a.b") is None
    assert verify_token("a.b.c.d") is None
