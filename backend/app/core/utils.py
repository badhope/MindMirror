import uuid
from typing import Any, Dict


def generate_uuid() -> str:
    return str(uuid.uuid4())


def format_response(success: bool, message: str, data: Any = None) -> Dict[str, Any]:
    return {
        "success": success,
        "message": message,
        "data": data
    }


def validate_uuid(uuid_string: str) -> bool:
    try:
        uuid.UUID(uuid_string)
        return True
    except ValueError:
        return False
