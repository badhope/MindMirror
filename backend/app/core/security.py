from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import HTTPException, status
from app.config import settings
import hashlib


def get_simple_hash(text: str) -> str:
    """简单的哈希函数（用于演示/开发环境）"""
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码（支持演示模式）"""
    # 两种验证方式：
    # 1. 简单哈希（演示用）
    # 2. 如果有bcrypt库则支持bcrypt
    if hashed_password.startswith('$2'):
        try:
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            return pwd_context.verify(plain_password, hashed_password)
        except:
            pass
    
    return get_simple_hash(plain_password) == hashed_password


def get_password_hash(password: str) -> str:
    """获取密码哈希（演示模式使用简单哈希）"""
    # 截断到72字节
    safe_password = password[:72]
    return get_simple_hash(safe_password)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
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
