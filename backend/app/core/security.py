from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import HTTPException, status
import bcrypt
import logging
from app.config import settings

logger = logging.getLogger("mindmirror.security")


def _truncate(password: str) -> bytes:
    # bcrypt silently truncates inputs past 72 bytes; doing it ourselves
    # means we can audit the length difference if we ever care to.
    return password.encode("utf-8")[:72]


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return False
    try:
        return bcrypt.checkpw(_truncate(plain_password), hashed_password.encode("utf-8"))
    except (ValueError, TypeError) as exc:
        # Malformed hash from an old version of the schema, etc. Treat as
        # "no match" rather than 500 — never leak which one it was.
        logger.warning("bcrypt verify raised %s: treating as mismatch", exc.__class__.__name__)
        return False


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(_truncate(password), bcrypt.gensalt()).decode("utf-8")


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    # algorithms=[...] is what stops an attacker from setting alg=none or
    # swapping HS256 -> RS256 to confuse the verifier.
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        logger.info("token rejected (%s): %s", exc.__class__.__name__, exc)
        return None


def decode_token(token: str) -> Dict[str, Any]:
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload
