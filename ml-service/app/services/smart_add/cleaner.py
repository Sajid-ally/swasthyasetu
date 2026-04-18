import re

from app.utils.helpers import normalize_spaces, to_lower
from app.utils.regex_patterns import NON_ALPHANUM_KEEP_BASIC_PATTERN


def clean_text(raw_text: str) -> str:
    """
    Cleans user health text while preserving medically useful values
    like numbers, units, dots, and hyphens.
    """
    if raw_text is None:
        return ""

    text = raw_text.strip()

    if not text:
        return ""

    text = to_lower(text)

    # Remove unwanted special characters but keep letters, numbers, spaces, dots, hyphens
    text = re.sub(NON_ALPHANUM_KEEP_BASIC_PATTERN, " ", text)

    # Normalize spaces
    text = normalize_spaces(text)

    return text