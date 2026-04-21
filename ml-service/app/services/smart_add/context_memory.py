from pathlib import Path
import json
from datetime import datetime
from typing import List, Dict, Any


# Base folder: ml-service/data/user_history/
BASE_DIR = Path(__file__).resolve().parents[3]
HISTORY_DIR = BASE_DIR / "data" / "user_history"

# Ensure folder exists
HISTORY_DIR.mkdir(parents=True, exist_ok=True)


def get_user_file(user_id: str) -> Path:
    """
    Return the file path for a given user's history JSON.
    """
    safe_user_id = str(user_id).strip().replace(" ", "_")
    return HISTORY_DIR / f"{safe_user_id}.json"


def load_user_history(user_id: str) -> List[Dict[str, Any]]:
    """
    Load all history records for a user.
    Returns an empty list if file does not exist or is invalid.
    """
    user_file = get_user_file(user_id)

    if not user_file.exists():
        return []

    try:
        with open(user_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, list):
            return data
        return []

    except json.JSONDecodeError:
        return []
    except Exception as e:
        print(f"[context_memory] Error loading history for {user_id}: {e}")
        return []


def save_user_record(user_id: str, record: Dict[str, Any]) -> bool:
    """
    Save a new structured record to user's history.
    Returns True if saved successfully, else False.
    """
    try:
        history = load_user_history(user_id)

        record_copy = dict(record)
        if "timestamp" not in record_copy:
            record_copy["timestamp"] = datetime.now().isoformat()

        history.append(record_copy)

        user_file = get_user_file(user_id)
        with open(user_file, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)

        return True

    except Exception as e:
        print(f"[context_memory] Error saving record for {user_id}: {e}")
        return False


def clear_user_history(user_id: str) -> bool:
    """
    Clear all history for a user.
    Useful for testing.
    """
    try:
        user_file = get_user_file(user_id)
        if user_file.exists():
            user_file.unlink()
        return True
    except Exception as e:
        print(f"[context_memory] Error clearing history for {user_id}: {e}")
        return False