import json
import re
import urllib.request
import urllib.error


OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:3b"


def extract_json_from_text(text: str):
    """
    Ollama sometimes returns extra text.
    This function safely extracts the first JSON object from response.
    """
    if not text:
        return None

    text = text.strip()

    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{[\s\S]*\}", text)

    if not match:
        return None

    try:
        return json.loads(match.group())
    except Exception:
        return None


def build_health_parser_prompt(user_text: str) -> str:
    return f"""
You are SwasthyaSetu Health Parser.

Your job:
Convert user health input into structured JSON for a health dashboard.

VERY IMPORTANT RULES:
- Return ONLY valid JSON.
- Do not explain anything.
- Do not use markdown.
- Do not add extra text.
- Do not invent medical diagnosis.
- Do not give medicine advice.
- Only extract what the user said.
- If unsure, use intent "unknown" and module "unknown".

Allowed intent values:
- add
- update
- remove
- navigate
- unknown

Allowed module values:
- medication
- symptom
- routine
- vitals
- family
- navigation
- unknown

Routing rules:
- sleep, slept, water, drink, steps, walked, workout, exercise, gym => routine
- BP, blood pressure, sugar, glucose, cholesterol, heart rate => vitals
- medicine, tablet, capsule, dose, mg, ml, took, take, li, kha, khaya => medication
- headache, fever, cough, pain, vomiting, weakness, fatigue => symptom
- father, mother, dad, mom, brother, sister + disease/condition => family
- open, go to, show, navigate, dashboard, profile, family, routine, analysis, timeline, emergency, privacy => navigation

Required JSON format:
{{
  "intent": "add",
  "module": "routine",
  "confidence": 0.0,
  "data": {{}}
}}

Data examples:
Medication:
{{
  "intent": "add",
  "module": "medication",
  "confidence": 0.9,
  "data": {{
    "medicine_name": "dolo",
    "dosage": "650mg",
    "time": "after dinner",
    "symptom": "headache"
  }}
}}

Routine:
{{
  "intent": "update",
  "module": "routine",
  "confidence": 0.9,
  "data": {{
    "sleep_hours": 7,
    "water_intake": 3,
    "steps": 5000,
    "workout_minutes": 40
  }}
}}

Vitals:
{{
  "intent": "update",
  "module": "vitals",
  "confidence": 0.9,
  "data": {{
    "bp": "120/80",
    "sugar_level": 160,
    "cholesterol": 190
  }}
}}

Navigation:
{{
  "intent": "navigate",
  "module": "navigation",
  "confidence": 0.95,
  "data": {{
    "page": "family",
    "route": "/family"
  }}
}}

User input:
{user_text}
""".strip()


def parse_with_ollama(user_text: str):
    """
    Sends user text to local Ollama and returns parsed JSON dict.
    Returns None if Ollama is not running or response is invalid.
    """
    prompt = build_health_parser_prompt(user_text)

    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 300
        }
    }

    try:
        req = urllib.request.Request(
            OLLAMA_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            result = json.loads(raw)

        response_text = result.get("response", "")
        parsed = extract_json_from_text(response_text)

        if not isinstance(parsed, dict):
            return None

        return parsed

    except urllib.error.URLError:
        return None
    except TimeoutError:
        return None
    except Exception:
        return None