"""Lightweight IP-based rate limiting for the auth router.

Kept here (not in main.py) because the limits are an authentication
concern, not a global one. Limits are intentionally generous — this is
defense in depth, not a substitute for a proper WAF.
"""
from __future__ import annotations

from slowapi import Limiter
from slowapi.util import get_remote_address

# We use the default in-memory storage. For multi-worker prod, swap to
# Redis: Limiter(key_func=..., storage_uri="redis://...").
limiter = Limiter(key_func=get_remote_address)

# 20 attempts / minute / IP is plenty for a real human, painful for a
# script. The same limit covers register + login + guest combined.
AUTH_LIMIT = "20/minute"
