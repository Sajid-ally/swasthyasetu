import re
from typing import List, Optional


def normalize_spaces(text: str) -> str:
    return " ".join(text.split())


def to_lower(text: str) -> str:
    return text.lower().strip()


def contains_any_keyword(text: str, keywords: List[str]) -> bool:
    text = text.lower()
    return any(keyword.lower() in text for keyword in keywords)


def find_first_match(text: str, pattern: str) -> Optional[str]:
    match = re.search(pattern, text, flags=re.IGNORECASE)
    if match:
        return match.group(0)
    return None


def find_all_matches(text: str, pattern: str) -> List[str]:
    matches = re.findall(pattern, text, flags=re.IGNORECASE)
    cleaned_matches = []

    for match in matches:
        if isinstance(match, tuple):
            cleaned_matches.append("".join(str(part) for part in match if part))
        else:
            cleaned_matches.append(match)

    return cleaned_matches