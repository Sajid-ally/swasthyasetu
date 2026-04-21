from typing import List, Dict, Any
from collections import Counter


IMPORTANT_VALUES = {
    "chest pain": "cardiac",
    "high bp": "cardiac",
    "hypertension": "cardiac",
    "low activity": "lifestyle",
    "poor sleep": "lifestyle",
    "sleep issue": "lifestyle",
    "diabetes": "metabolic",
    "high sugar": "metabolic"
}


def extract_values(history: List[Dict[str, Any]]) -> List[str]:
    """
    Extract normalized 'value' field from user history.
    """
    values = []

    for record in history:
        value = record.get("value", "")
        if isinstance(value, str) and value.strip():
            values.append(value.strip().lower())

    return values


def count_repeated_issues(history: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Count how many times each issue/value appears in history.
    """
    values = extract_values(history)
    return dict(Counter(values))


def detect_worsening_patterns(issue_counts: Dict[str, int]) -> List[str]:
    """
    Detect repeated important issues and return alert messages.
    """
    alerts = []

    for issue, count in issue_counts.items():
        if count >= 2:
            if issue in ["chest pain", "high bp", "hypertension"]:
                alerts.append(f"Repeated cardiovascular-related issue detected: {issue} ({count} times)")
            elif issue in ["poor sleep", "sleep issue"]:
                alerts.append(f"Repeated sleep-related issue detected: {issue} ({count} times)")
            elif issue in ["low activity"]:
                alerts.append(f"Repeated low activity pattern detected: {issue} ({count} times)")
            elif issue in ["diabetes", "high sugar"]:
                alerts.append(f"Repeated metabolic issue detected: {issue} ({count} times)")

    return alerts


def detect_combined_risk(issue_counts: Dict[str, int]) -> List[str]:
    """
    Detect if multiple related risk factors are present together.
    """
    alerts = []

    cardiac_flags = 0
    lifestyle_flags = 0
    metabolic_flags = 0

    for issue, count in issue_counts.items():
        if count >= 1:
            category = IMPORTANT_VALUES.get(issue)

            if category == "cardiac":
                cardiac_flags += 1
            elif category == "lifestyle":
                lifestyle_flags += 1
            elif category == "metabolic":
                metabolic_flags += 1

    if cardiac_flags >= 2:
        alerts.append("Multiple cardiovascular-related factors detected together")

    if lifestyle_flags >= 2:
        alerts.append("Multiple lifestyle-related risk factors detected together")

    if cardiac_flags >= 1 and lifestyle_flags >= 1:
        alerts.append("Cardiovascular and lifestyle risks are appearing together")

    if cardiac_flags >= 1 and metabolic_flags >= 1:
        alerts.append("Cardiovascular and metabolic risks are appearing together")

    return alerts


def analyze_trend(history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Main trend analysis function.
    """
    issue_counts = count_repeated_issues(history)
    repeated_alerts = detect_worsening_patterns(issue_counts)
    combined_alerts = detect_combined_risk(issue_counts)

    all_alerts = repeated_alerts + combined_alerts

    if len(all_alerts) >= 3:
        trend = "worsening"
    elif len(all_alerts) >= 1:
        trend = "watchlist"
    else:
        trend = "stable"

    return {
        "trend": trend,
        "issue_counts": issue_counts,
        "alerts": all_alerts
    }