from typing import Dict, Any, List
from collections import Counter


def build_timeline_insights(user_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Build recent timeline insights from saved user history.
    """

    if not user_history:
        return {
            "recent_issue_counts": {},
            "top_repeated_issues": [],
            "timeline_summary": "No timeline history available yet.",
            "pattern_notes": [],
        }

    issue_counter = Counter()
    pattern_notes = []

    for record in user_history:
        category = record.get("category", "")
        extracted_data = record.get("extracted_data", {})

        if category == "symptom":
            symptom = extracted_data.get("symptom")
            if symptom:
                issue_counter[symptom] += 1

        elif category == "condition":
            condition = extracted_data.get("condition")
            if condition:
                issue_counter[condition] += 1

        elif category == "routine":
            activity = extracted_data.get("activity")
            if activity:
                issue_counter[activity] += 1

        elif category == "family_history":
            relation = extracted_data.get("relation")
            if relation:
                issue_counter[f"family_history:{relation}"] += 1

    recent_issue_counts = dict(issue_counter)
    top_repeated_issues = issue_counter.most_common(3)

    # -----------------------------
    # Pattern notes
    # -----------------------------
    if issue_counter.get("chest pain", 0) >= 2:
        pattern_notes.append("Chest pain has appeared multiple times in recent history.")

    if issue_counter.get("high bp", 0) >= 2:
        pattern_notes.append("Blood pressure-related issue has repeated in recent history.")

    if issue_counter.get("poor sleep", 0) >= 2:
        pattern_notes.append("Poor sleep has been repeating in recent history.")

    if issue_counter.get("low activity", 0) >= 2:
        pattern_notes.append("Low activity pattern is appearing repeatedly.")

    if issue_counter.get("diabetes", 0) >= 2:
        pattern_notes.append("Diabetes-related pattern is recurring in history.")

    if issue_counter.get("chest pain", 0) >= 1 and issue_counter.get("high bp", 0) >= 1:
        pattern_notes.append("Cardiovascular-related issues are appearing together.")

    if issue_counter.get("poor sleep", 0) >= 1 and issue_counter.get("low activity", 0) >= 1:
        pattern_notes.append("Lifestyle-related risk factors are appearing together.")

    # -----------------------------
    # Timeline summary
    # -----------------------------
    if top_repeated_issues:
        summary_parts = [f"{issue} ({count} times)" for issue, count in top_repeated_issues]
        timeline_summary = "Recent timeline shows repeated issues: " + ", ".join(summary_parts) + "."
    else:
        timeline_summary = "No strong repeated issues found in recent history."

    return {
        "recent_issue_counts": recent_issue_counts,
        "top_repeated_issues": top_repeated_issues,
        "timeline_summary": timeline_summary,
        "pattern_notes": pattern_notes,
    }