from typing import Dict, Any, List


def generate_followup_questions(
    category: str,
    extracted_data: Dict[str, Any],
    risk_level: str,
) -> List[str]:
    """
    Generate useful follow-up questions based on category,
    extracted information, and risk level.
    """

    questions = []

    # -----------------------------
    # Symptom follow-ups
    # -----------------------------
    if category == "symptom":
        symptom = extracted_data.get("symptom")

        if symptom == "chest pain":
            questions.append("How long have you been experiencing chest pain?")
            questions.append("Is the chest pain frequent or occasional?")
            if risk_level in ["high", "medium"]:
                questions.append("Does the chest pain happen during activity, rest, or both?")

        elif symptom == "headache":
            questions.append("How often are you experiencing headaches?")
            questions.append("Is the headache mild, moderate, or severe?")

        elif symptom == "fatigue":
            questions.append("How long have you been feeling fatigue?")
            questions.append("Is the fatigue affecting your daily routine?")

        else:
            questions.append("How long have you been experiencing this symptom?")
            questions.append("Is this symptom happening regularly or occasionally?")

    # -----------------------------
    # Condition follow-ups
    # -----------------------------
    elif category == "condition":
        condition = extracted_data.get("condition")

        if condition == "high bp":
            questions.append("Is your BP issue regular or occasional?")
            questions.append("Have you been tracking your blood pressure recently?")
            if risk_level in ["high", "medium"]:
                questions.append("Are you also noticing symptoms like headache, dizziness, or chest discomfort?")

        elif condition == "diabetes":
            questions.append("Is your sugar level being monitored regularly?")
            questions.append("Do you also notice fatigue, thirst, or low activity patterns?")

        else:
            questions.append("How long has this condition-related issue been present?")
            questions.append("Are you monitoring this condition regularly?")

    # -----------------------------
    # Routine follow-ups
    # -----------------------------
    elif category == "routine":
        activity = extracted_data.get("activity")

        if activity == "poor sleep":
            questions.append("Is poor sleep happening daily or only sometimes?")
            questions.append("For how many days have you been having sleep issues?")
            questions.append("Are you sleeping less, waking up often, or not feeling rested?")

        elif activity == "low activity":
            questions.append("Has your physical activity reduced recently?")
            questions.append("How much walking or exercise do you usually do in a day?")
            questions.append("Is low activity happening because of tiredness, busy schedule, or discomfort?")

        else:
            questions.append("How often is this routine issue happening?")
            questions.append("Has this routine changed recently?")

    # -----------------------------
    # Family history follow-ups
    # -----------------------------
    elif category == "family_history":
        questions.append("Which family member has this health condition?")
        questions.append("Do you know how long this family history has been present?")
        questions.append("Are there multiple family members with similar health issues?")

    # -----------------------------
    # Unknown / fallback
    # -----------------------------
    else:
        questions.append("Can you tell me a little more about this health issue?")
        questions.append("Is this related to a symptom, routine, condition, or family history?")

    # -----------------------------
    # Risk-based follow-up boost
    # -----------------------------
    if risk_level == "high":
        questions.append("Has this issue become more frequent or more serious recently?")
    elif risk_level == "medium":
        questions.append("Are you noticing this issue repeatedly over the last few days?")

    # Remove duplicates while preserving order
    unique_questions = []
    seen = set()

    for q in questions:
        if q not in seen:
            unique_questions.append(q)
            seen.add(q)

    return unique_questions