from typing import Dict


HINGLISH_MAP: Dict[str, str] = {
    # chest pain
    "chest pain ho raha hai": "chest pain",
    "seene mein dard": "chest pain",
    "chhati mein dard": "chest pain",

    # BP
    "bp high hai": "high bp",
    "mera bp high hai": "high bp",
    "blood pressure high hai": "high bp",

    # diabetes / sugar
    "sugar hai": "diabetes",
    "papa ko sugar hai": "family history diabetes",
    "mujhe sugar hai": "diabetes",

    # sleep
    "neend nahi aayi": "poor sleep",
    "raat ko neend nahi aayi": "poor sleep",
    "theek se neend nahi aayi": "poor sleep",

    # low activity
    "kam chalta hu": "low activity",
    "bahut kam walking": "low activity",
    "main inactive hu": "low activity",

    # headache
    "sar dard": "headache",
    "sir dard": "headache",

    # weakness
    "kamzori lag rahi hai": "fatigue",
    "weakness ho rahi hai": "fatigue",
}


def normalize_hinglish_text(text: str) -> str:
    """
    Replace known Hinglish phrases with normalized English phrases.
    """
    if not isinstance(text, str):
        return ""

    normalized_text = text.lower().strip()

    for hinglish_phrase, english_phrase in HINGLISH_MAP.items():
        if hinglish_phrase in normalized_text:
            normalized_text = normalized_text.replace(hinglish_phrase, english_phrase)

    return normalized_text