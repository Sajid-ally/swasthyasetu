from fastapi import APIRouter, Body
from app.services.data_loader import load_family_data, save_family_data
from app.services.ollama_client import parse_with_ollama
import re
import uuid

router = APIRouter(prefix="/assistant-command", tags=["Assistant Command"])


# =========================
# Helpers
# =========================

def clean_text(text: str) -> str:
    return str(text or "").strip()


def lower_text(text: str) -> str:
    return clean_text(text).lower()


def find_user(data, user_id: str):
    for member in data.get("members", []):
        if member.get("id") == user_id:
            return member
    return None


NUMBER_WORDS = {
    "zero": 0,
    "one": 1,
    "won": 1,
    "two": 2,
    "to": 2,
    "too": 2,
    "three": 3,
    "tree": 3,
    "four": 4,
    "for": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "ate": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fourty": 40,
    "fifty": 50,
    "sixty": 60,
    "seventy": 70,
    "eighty": 80,
    "ninety": 90,
}


def words_to_number(words):
    """
    Converts:
    seven -> 7
    forty five -> 45
    one twenty -> 120
    five thousand -> 5000
    nine thousand five hundred -> 9500
    """
    if not words:
        return None

    tokens = re.findall(r"[a-zA-Z]+", words.lower())

    total = 0
    current = 0
    found = False

    for token in tokens:
        if token in NUMBER_WORDS:
            current += NUMBER_WORDS[token]
            found = True

        elif token == "hundred":
            if current == 0:
                current = 1
            current *= 100
            found = True

        elif token == "thousand":
            if current == 0:
                current = 1
            total += current * 1000
            current = 0
            found = True

    if not found:
        return None

    return total + current


def extract_number(text: str):
    text_l = lower_text(text)

    digit_match = re.search(r"\d+(\.\d+)?", text_l)
    if digit_match:
        number = float(digit_match.group())

        if number.is_integer():
            return int(number)

        return number

    return words_to_number(text_l)


def extract_bp_value(text: str):
    text_l = lower_text(text)

    digit_bp = re.search(r"\b(\d{2,3})\s*/\s*(\d{2,3})\b", text_l)
    if digit_bp:
        return f"{digit_bp.group(1)}/{digit_bp.group(2)}"

    digit_by_bp = re.search(r"\b(\d{2,3})\s*(by|over)\s*(\d{2,3})\b", text_l)
    if digit_by_bp:
        return f"{digit_by_bp.group(1)}/{digit_by_bp.group(3)}"

    cleaned = (
        text_l.replace("blood pressure", "")
        .replace("bp", "")
        .replace("b p", "")
        .strip()
    )

    if " by " in cleaned:
        left, right = cleaned.split(" by ", 1)
        systolic = words_to_number(left)
        diastolic = words_to_number(right)

        if systolic and diastolic:
            return f"{systolic}/{diastolic}"

    if " over " in cleaned:
        left, right = cleaned.split(" over ", 1)
        systolic = words_to_number(left)
        diastolic = words_to_number(right)

        if systolic and diastolic:
            return f"{systolic}/{diastolic}"

    return None


def normalize_time(text: str):
    text_l = lower_text(text)

    time_patterns = [
        "after breakfast",
        "before breakfast",
        "after lunch",
        "before lunch",
        "after dinner",
        "before dinner",
        "morning",
        "afternoon",
        "evening",
        "night",
        "bedtime",
        "last night",
        "today morning",
        "today evening",
        "kal raat",
        "raat",
    ]

    for pattern in time_patterns:
        if pattern in text_l:
            if pattern == "raat":
                return "night"
            return pattern

    return "Not specified"


def normalize_access_relation(relation: str):
    relation = lower_text(relation)

    mapping = {
        "father": "Father",
        "dad": "Father",
        "mother": "Mother",
        "mom": "Mother",
        "brother": "Brother",
        "sister": "Sister",
        "grandfather": "Grandfather",
        "grandmother": "Grandmother",
        "uncle": "Uncle",
        "aunt": "Aunt",
        "wife": "Wife",
        "husband": "Husband",
        "son": "Son",
        "daughter": "Daughter",
    }

    return mapping.get(relation, relation.title())


def build_response(intent, module, message, data=None, navigate_to=None, source="rule"):
    return {
        "success": True,
        "intent": intent,
        "module": module,
        "message": message,
        "data": data or {},
        "navigate_to": navigate_to,
        "source": source,
    }


# =========================
# Navigation Parser
# =========================

def parse_navigation(text_l: str):
    routes = {
        "dashboard": "/",
        "home": "/",
        "profile": "/profile",
        "family": "/family",
        "routine": "/routine",
        "analysis": "/analysis",
        "timeline": "/timeline",
        "emergency": "/emergency",
        "privacy": "/privacy",
    }

    navigation_words = [
        "open",
        "go to",
        "show",
        "navigate",
        "move to",
        "take me to",
        "start",
    ]

    if any(word in text_l for word in navigation_words):
        for key, route in routes.items():
            if key in text_l:
                return route, key

    return None, None


# =========================
# Medication Parser
# =========================

def extract_medicine_name(text_l: str):
    blocked_words = {
        "add", "take", "took", "tablet", "medicine", "medication",
        "remove", "delete", "mg", "ml", "g", "after", "before", "morning",
        "evening", "night", "dinner", "lunch", "breakfast", "i",
        "my", "please", "with", "at", "on", "in", "to", "last",
        "today", "yesterday", "kal", "raat", "maine", "li", "kha",
        "khaya", "aur", "tha", "hai", "hua", "headache", "fever",
        "pain", "cough", "sugar", "bp", "blood", "pressure"
    }

    match = re.search(
        r"(?:add|take|took|medicine|medication|li|kha|khaya)\s+([a-zA-Z]+)",
        text_l
    )

    if match:
        name = match.group(1).strip()
        if name not in blocked_words:
            return name

    dosage_near = re.search(r"\b([a-zA-Z]+)\s+\d+\s*(mg|ml|g)\b", text_l)
    if dosage_near:
        name = dosage_near.group(1).strip()
        if name not in blocked_words:
            return name

    words = re.findall(r"[a-zA-Z]+", text_l)

    for word in words:
        if word not in blocked_words and len(word) > 2:
            return word

    return None


def extract_dosage(text_l: str):
    digit_match = re.search(r"(\d+(\.\d+)?)\s*(mg|ml|g|tablet|tablets)", text_l)

    if digit_match:
        return f"{digit_match.group(1)}{digit_match.group(3)}"

    if "mg" in text_l:
        before_mg = text_l.split("mg")[0]
        number = words_to_number(before_mg)

        if number:
            return f"{number}mg"

    if "tablet" in text_l or "tablets" in text_l:
        number = extract_number(text_l)
        if number:
            return f"{number} tablet"

    return "Not specified"


def handle_add_medication(member, text_l: str, source="rule", ollama_data=None):
    medicine_name = None
    dosage = None
    time = None
    symptom = None

    if ollama_data:
        medicine_name = (
            ollama_data.get("medicine_name")
            or ollama_data.get("name")
            or ollama_data.get("medicine")
        )
        dosage = ollama_data.get("dosage")
        time = ollama_data.get("time") or ollama_data.get("timing")
        symptom = ollama_data.get("symptom")

    if not medicine_name:
        medicine_name = extract_medicine_name(text_l)

    if not medicine_name:
        return build_response(
            "add",
            "medication",
            "I could not detect the medicine name.",
            source=source
        )

    medicine_name = lower_text(medicine_name)

    fake_names = {
        "sleep", "slept", "water", "walked", "steps", "workout",
        "bp", "sugar", "cholesterol", "pressure", "headache", "fever",
        "pain", "cough"
    }

    if medicine_name in fake_names:
        return build_response(
            "add",
            "medication",
            "This looks like routine, vitals, or symptom data, not medicine.",
            source=source
        )

    member.setdefault("medications", [])

    new_med = {
        "name": medicine_name,
        "dosage": dosage or extract_dosage(text_l),
        "time": time or normalize_time(text_l),
        "status": "pending",
    }

    if symptom:
        new_med["symptom"] = symptom

    for med in member["medications"]:
        if isinstance(med, dict):
            same_name = lower_text(med.get("name")) == lower_text(new_med["name"])
            same_dosage = lower_text(med.get("dosage")) == lower_text(new_med["dosage"])
            same_time = lower_text(med.get("time")) == lower_text(new_med["time"])

            if same_name and same_dosage and same_time:
                return build_response(
                    "add",
                    "medication",
                    f"{medicine_name.title()} already exists in medication schedule.",
                    new_med,
                    source=source
                )

    member["medications"].append(new_med)

    return build_response(
        "add",
        "medication",
        f"Added {medicine_name.title()} to medication schedule.",
        new_med,
        source=source
    )


def handle_remove_medication(member, text_l: str, source="rule"):
    member.setdefault("medications", [])

    medicine_name = None

    match = re.search(r"(?:remove|delete)\s+([a-zA-Z]+)", text_l)

    if match:
        medicine_name = match.group(1).strip()

    if not medicine_name:
        return build_response(
            "remove",
            "medication",
            "Please mention which medicine to remove.",
            source=source
        )

    old_count = len(member["medications"])

    member["medications"] = [
        med for med in member["medications"]
        if not (
            isinstance(med, dict)
            and lower_text(med.get("name")) == lower_text(medicine_name)
        )
    ]

    new_count = len(member["medications"])

    if old_count == new_count:
        return build_response(
            "remove",
            "medication",
            f"No medicine named {medicine_name.title()} was found.",
            source=source
        )

    return build_response(
        "remove",
        "medication",
        f"Removed {medicine_name.title()} from medication schedule.",
        source=source
    )


# =========================
# Routine Parser
# =========================

def handle_routine(member, text_l: str, source="rule", ollama_data=None):
    member.setdefault("routine", {})

    if ollama_data:
        updated = {}

        allowed_keys = [
            "sleep_hours",
            "water_intake",
            "steps",
            "workout_minutes"
        ]

        for key in allowed_keys:
            value = ollama_data.get(key)
            if value is not None:
                member["routine"][key] = value
                updated[key] = value

        if updated:
            return build_response(
                "update",
                "routine",
                "Updated routine from assistant.",
                updated,
                source=source
            )

    number = extract_number(text_l)

    if number is None:
        return build_response(
            "update",
            "routine",
            "I could not detect a number for routine update.",
            source=source
        )

    if "sleep" in text_l or "slept" in text_l:
        member["routine"]["sleep_hours"] = number
        return build_response(
            "update",
            "routine",
            f"Updated sleep to {number} hours.",
            {"sleep_hours": number},
            source=source
        )

    if "water" in text_l or "drink" in text_l or "drank" in text_l:
        member["routine"]["water_intake"] = number
        return build_response(
            "update",
            "routine",
            f"Updated water intake to {number} L.",
            {"water_intake": number},
            source=source
        )

    if "step" in text_l or "walk" in text_l or "walked" in text_l:
        member["routine"]["steps"] = number
        return build_response(
            "update",
            "routine",
            f"Updated steps to {number}.",
            {"steps": number},
            source=source
        )

    if "workout" in text_l or "exercise" in text_l or "gym" in text_l:
        member["routine"]["workout_minutes"] = number
        return build_response(
            "update",
            "routine",
            f"Updated workout to {number} minutes.",
            {"workout_minutes": number},
            source=source
        )

    return build_response(
        "unknown",
        "routine",
        "Routine command detected but I could not understand what to update.",
        source=source
    )


# =========================
# Vitals Parser
# =========================

def handle_vitals(member, text_l: str, source="rule", ollama_data=None):
    member.setdefault("vitals", {})

    if ollama_data:
        updated = {}

        for key in ["bp", "sugar_level", "cholesterol", "heart_rate"]:
            value = ollama_data.get(key)
            if value is not None:
                member["vitals"][key] = value
                updated[key] = value

        if updated:
            return build_response(
                "update",
                "vitals",
                "Updated vitals from assistant.",
                updated,
                source=source
            )

    bp_value = extract_bp_value(text_l)

    if "bp" in text_l or "b p" in text_l or "blood pressure" in text_l:
        if bp_value:
            member["vitals"]["bp"] = bp_value
            return build_response(
                "update",
                "vitals",
                f"Updated BP to {bp_value}.",
                {"bp": bp_value},
                source=source
            )

        return build_response(
            "update",
            "vitals",
            "BP detected, but value should look like 120/80 or one twenty by eighty.",
            source=source
        )

    number = extract_number(text_l)

    if number is None:
        return build_response(
            "update",
            "vitals",
            "I could not detect the vitals value.",
            source=source
        )

    if "sugar" in text_l or "glucose" in text_l:
        member["vitals"]["sugar_level"] = number
        return build_response(
            "update",
            "vitals",
            f"Updated sugar level to {number}.",
            {"sugar_level": number},
            source=source
        )

    if "cholesterol" in text_l:
        member["vitals"]["cholesterol"] = number
        return build_response(
            "update",
            "vitals",
            f"Updated cholesterol to {number}.",
            {"cholesterol": number},
            source=source
        )

    return build_response(
        "unknown",
        "vitals",
        "Vitals command detected but I could not understand what to update.",
        source=source
    )


# =========================
# Symptom Parser
# =========================

def handle_symptom(member, text_l: str, source="ollama", ollama_data=None):
    member.setdefault("timeline", [])

    symptom = None

    if ollama_data:
        symptom = (
            ollama_data.get("symptom")
            or ollama_data.get("text")
            or ollama_data.get("issue")
        )

    if not symptom:
        for word in ["headache", "fever", "cough", "pain", "vomiting", "weakness", "fatigue"]:
            if word in text_l:
                symptom = word
                break

    if not symptom:
        return build_response(
            "add",
            "symptom",
            "I could not detect the symptom clearly.",
            source=source
        )

    entry = {
        "type": "symptom",
        "text": symptom,
        "source": source,
    }

    member["timeline"].append(entry)

    return build_response(
        "add",
        "symptom",
        f"Added symptom note: {symptom}.",
        entry,
        source=source
    )


# =========================
# Family Parser
# =========================

def handle_family(data, user_id: str, text_l: str, source="rule", ollama_data=None):
    relation_words = [
        "father", "dad", "mother", "mom", "brother", "sister",
        "grandfather", "grandmother", "uncle", "aunt", "wife",
        "husband", "son", "daughter"
    ]

    relation = None
    condition = None

    if ollama_data:
        relation = ollama_data.get("relation")
        condition = (
            ollama_data.get("condition")
            or ollama_data.get("disease")
            or ollama_data.get("health_condition")
        )

    if not relation:
        for word in relation_words:
            if word in text_l:
                relation = normalize_access_relation(word)
                break

    if not condition:
        condition_match = re.search(
            r"(?:has|have|having|suffering from)\s+([a-zA-Z ]+)",
            text_l
        )

        if condition_match:
            condition = condition_match.group(1).strip()

    if not relation:
        return build_response(
            "add",
            "family",
            "Please mention relation, like father, mother, or brother.",
            source=source
        )

    if not condition:
        return build_response(
            "add",
            "family",
            "Please mention health condition, like diabetes or hypertension.",
            source=source
        )

    relation = normalize_access_relation(relation)

    new_member = {
        "id": f"user_{uuid.uuid4().hex[:6]}",
        "name": relation,
        "relation": relation,
        "gender": "Unknown",
        "age": None,
        "diseases": [condition],
        "medications": [],
        "routine": {},
        "vitals": {},
        "timeline": [],
        "access": {
            user_id: "partial"
        },
    }

    data.setdefault("members", []).append(new_member)

    return build_response(
        "add",
        "family",
        f"Added {relation} with condition: {condition}.",
        new_member,
        source=source
    )


# =========================
# Ollama Execution Layer
# =========================

def execute_ollama_result(data, member, user_id: str, text: str, parsed: dict):
    if not parsed:
        return None

    intent = lower_text(parsed.get("intent", "unknown"))
    module = lower_text(parsed.get("module", "unknown"))
    parsed_data = parsed.get("data", {})

    if not isinstance(parsed_data, dict):
        parsed_data = {}

    confidence = parsed.get("confidence", 0)

    try:
        confidence = float(confidence)
    except Exception:
        confidence = 0

    if confidence < 0.55:
        return None

    text_l = lower_text(text)

    if intent == "navigate" or module == "navigation":
        route = parsed_data.get("route")
        page = parsed_data.get("page")

        if not route and page:
            routes = {
                "dashboard": "/",
                "home": "/",
                "profile": "/profile",
                "family": "/family",
                "routine": "/routine",
                "analysis": "/analysis",
                "timeline": "/timeline",
                "emergency": "/emergency",
                "privacy": "/privacy",
            }
            route = routes.get(lower_text(page))

        if route:
            return build_response(
                "navigate",
                "navigation",
                f"Opening {str(page or route).title()} page.",
                data=parsed_data,
                navigate_to=route,
                source="ollama"
            )

    if module == "routine":
        return handle_routine(member, text_l, source="ollama", ollama_data=parsed_data)

    if module == "vitals":
        return handle_vitals(member, text_l, source="ollama", ollama_data=parsed_data)

    if module == "medication":
        return handle_add_medication(member, text_l, source="ollama", ollama_data=parsed_data)

    if module == "symptom":
        return handle_symptom(member, text_l, source="ollama", ollama_data=parsed_data)

    if module == "family":
        return handle_family(data, user_id, text_l, source="ollama", ollama_data=parsed_data)

    return None


# =========================
# Main Assistant Command API
# =========================

@router.post("/{user_id}")
def assistant_command(user_id: str, input_data: dict = Body(...)):
    text = clean_text(input_data.get("text", ""))

    if not text:
        return {
            "success": False,
            "message": "Text input required."
        }

    text_l = lower_text(text)

    # 1. Fast rule-based navigation first
    navigate_to, page_name = parse_navigation(text_l)

    if navigate_to:
        return build_response(
            "navigate",
            "navigation",
            f"Opening {page_name.title()} page.",
            navigate_to=navigate_to,
            source="rule"
        )

    data = load_family_data()
    member = find_user(data, user_id)

    if not member:
        return {
            "success": False,
            "message": "User not found."
        }

    # 2. Rule parser first: stable and fast
    if "remove" in text_l or "delete" in text_l:
        result = handle_remove_medication(member, text_l)
        save_family_data(data)
        return result

    family_words = [
        "father", "dad", "mother", "mom", "brother", "sister",
        "grandfather", "grandmother", "uncle", "aunt"
    ]

    if any(word in text_l for word in family_words) and (
        "has" in text_l or "have" in text_l or "suffering" in text_l
    ):
        result = handle_family(data, user_id, text_l)
        save_family_data(data)
        return result

    if (
        "bp" in text_l
        or "b p" in text_l
        or "blood pressure" in text_l
        or "sugar" in text_l
        or "glucose" in text_l
        or "cholesterol" in text_l
    ):
        result = handle_vitals(member, text_l)
        save_family_data(data)
        return result

    if (
        "sleep" in text_l
        or "slept" in text_l
        or "water" in text_l
        or "drink" in text_l
        or "drank" in text_l
        or "step" in text_l
        or "walk" in text_l
        or "walked" in text_l
        or "workout" in text_l
        or "exercise" in text_l
        or "gym" in text_l
    ):
        result = handle_routine(member, text_l)
        save_family_data(data)
        return result

    if (
        "add" in text_l
        or "take" in text_l
        or "took" in text_l
        or "medicine" in text_l
        or "tablet" in text_l
        or "mg" in text_l
    ):
        result = handle_add_medication(member, text_l)
        save_family_data(data)
        return result

    # 3. Ollama fallback only when rule parser does not understand
    parsed = parse_with_ollama(text)
    ollama_result = execute_ollama_result(data, member, user_id, text, parsed)

    if ollama_result:
        if ollama_result.get("intent") != "navigate":
            save_family_data(data)
        return ollama_result

    # 4. Safe fallback
    return {
        "success": False,
        "intent": "unknown",
        "module": "unknown",
        "message": "I understood the message, but no supported action was detected yet.",
        "source": "fallback",
        "ollama_raw": parsed,
        "examples": [
            "add paracetamol 500mg after dinner",
            "remove paracetamol",
            "sleep seven hours",
            "water three litre",
            "steps five thousand",
            "BP one twenty by eighty",
            "kal raat headache tha aur maine dolo 650 li after dinner",
            "open family",
        ],
    }