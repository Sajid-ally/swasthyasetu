from .cleaner import clean_text
from .extractor import extract_routine, extract_medication
from .scorer import compute_score
from .risk_engine import generate_risks

def detect_modules(text: str):
    modules = []

    if "sleep" in text or "water" in text:
        modules.append("routine")

    if "medicine" in text or "pill" in text or "forgot" in text:
        modules.append("medication")

    return modules
def process_smart_add_text(text: str):
    text = clean_text(text)

    modules = detect_modules(text)

    routine = extract_routine(text) if "routine" in modules else None
    medication = extract_medication(text) if "medication" in modules else None

    score = compute_score(routine, medication)
    risks = generate_risks(routine)

    return {
        "detected_modules": modules,
        "routine": routine,
        "medication": medication,
        "health_score_impact": score,
        "risk_alerts": risks
    }