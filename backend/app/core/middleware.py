"""Request-id + access-log middleware.

Every request gets a short id; if the client sent ``X-Request-ID`` we
reuse it, otherwise we mint one. The id is echoed in the response and
attached to the access-log line so traces across services stay joined.
"""
from __future__ import annotations

import logging
import secrets
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


REQUEST_ID_HEADER = "X-Request-ID"

_access_log = logging.getLogger("mindmirror.access")


def _new_request_id() -> str:
    # 12 hex chars is enough to avoid collisions in any single process
    # while staying easy to grep for in logs.
    return secrets.token_hex(6)


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get(REQUEST_ID_HEADER) or _new_request_id()
        # Stash on the request so handlers can read it if they want to.
        request.state.request_id = request_id

        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            duration = (time.perf_counter() - start) * 1000
            _access_log.exception(
                "request failed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "duration_ms": round(duration, 1),
                },
            )
            raise

        duration = (time.perf_counter() - start) * 1000
        response.headers[REQUEST_ID_HEADER] = request_id
        _access_log.info(
            "%s %s -> %d (%.1fms)",
            request.method,
            request.url.path,
            response.status_code,
            duration,
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "duration_ms": round(duration, 1),
            },
        )
        return response
