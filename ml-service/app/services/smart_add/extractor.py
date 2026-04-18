import re

def extract_routine(text):
    sleep = re.search(r"(\d+)\s*hours", text)
    water = re.search(r"(\d+)\s*l", text)

    return {
        "sleep_hours": int(sleep.group(1)) if sleep else None,
        "water_liters": int(water.group(1)) if water else None
    }


def extract_medication(text):
    missed = "forgot" in text or "missed" in text

    return {
        "missed_dose": missed
    }