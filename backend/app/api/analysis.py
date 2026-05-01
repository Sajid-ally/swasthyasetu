from fastapi import APIRouter
from app.services.data_loader import load_family_data

router = APIRouter(prefix="/analysis", tags=["Analysis"])


def safe_int(value, default=0):
    try:
        return int(float(str(value).strip()))
    except Exception:
        return default


def parse_bp_systolic(bp_value):
    try:
        return int(str(bp_value).split("/")[0])
    except Exception:
        return 0


def get_medical_reports(timeline):
    reports = []

    for event in timeline:
        if event.get("type") in ["medical_report", "report"]:
            reports.append(event)

    reports.sort(key=lambda x: x.get("created_at", x.get("date", "")), reverse=True)
    return reports


def collect_report_attention(reports):
    attention_points = []
    abnormal_findings = []

    for report in reports:
        for point in report.get("possible_attention_points", []):
            if point not in attention_points:
                attention_points.append(point)

        for finding in report.get("key_findings", []):
            status = str(finding.get("status", "")).lower()

            if status and status not in ["normal", "unknown"]:
                abnormal_findings.append({
                    "report_id": report.get("id"),
                    "report_type": report.get("report_type", "medical_report"),
                    "name": finding.get("name", "Finding"),
                    "value": finding.get("value", ""),
                    "unit": finding.get("unit", ""),
                    "status": finding.get("status", "attention_needed"),
                    "note": finding.get("note", ""),
                    "created_at": report.get("created_at", ""),
                })

    return attention_points, abnormal_findings


@router.get("/{user_id}")
def get_analysis(user_id: str):
    data = load_family_data()

    user = next((m for m in data.get("members", []) if m.get("id") == user_id), None)

    if not user:
        return {"error": "User not found"}

    diseases = user.get("diseases", [])
    routine = user.get("routine", {})
    vitals = user.get("vitals", {})
    medications = user.get("medications", [])
    timeline = user.get("timeline", [])

    sleep = safe_int(routine.get("sleep_hours", 0))
    steps = safe_int(routine.get("steps", 0))
    workout = safe_int(routine.get("workout_minutes", 0))
    water = safe_int(routine.get("water_intake", 0))

    bp = vitals.get("bp", "0/0")
    sugar = vitals.get("sugar_level", None)

    systolic = parse_bp_systolic(bp)

    medical_reports = get_medical_reports(timeline)
    report_attention_points, abnormal_report_findings = collect_report_attention(medical_reports)

    score = 100
    issues = []

    if sleep > 10 or (sleep > 0 and sleep < 6):
        score -= 10
        issues.append("Sleep pattern needs attention")

    if steps and steps < 5000:
        score -= 10
        issues.append("Low activity level")

    if systolic > 130:
        score -= 10
        issues.append("High blood pressure")

    if sugar is not None:
        sugar_value = safe_int(sugar)
        if sugar_value > 140:
            score -= 10
            issues.append("High sugar level")
        elif sugar_value and sugar_value < 70:
            score -= 8
            issues.append("Low sugar level")

    if len(diseases) > 1:
        score -= 8
        issues.append("Multiple health conditions")

    if abnormal_report_findings:
        score -= min(len(abnormal_report_findings) * 3, 15)
        issues.append("Medical report findings need attention")

    score = max(0, min(score, 100))

    if score >= 80:
        status = "Good"
    elif score >= 60:
        status = "Moderate"
    else:
        status = "Critical"

    metrics = [
        {"label": "Sleep", "value": f"{sleep} hrs"},
        {"label": "Water", "value": f"{water} L"},
        {"label": "Steps", "value": f"{steps}"},
        {"label": "Workout", "value": f"{workout} min"},
        {"label": "Blood Pressure", "value": bp},
    ]

    if sugar is not None:
        metrics.append({"label": "Sugar Level", "value": str(sugar)})

    recommendations = []

    if sleep > 10 or (sleep > 0 and sleep < 6):
        recommendations.append("Keep sleep close to a regular 7–8 hour routine")

    if steps and steps < 5000:
        recommendations.append("Increase daily movement gradually toward 8k–10k steps")

    if systolic > 130:
        recommendations.append("Monitor blood pressure regularly and verify readings")

    if sugar is not None:
        sugar_value = safe_int(sugar)
        if sugar_value > 140 or (sugar_value and sugar_value < 70):
            recommendations.append("Track sugar readings and verify abnormal values")

    if report_attention_points:
        recommendations.append("Review report attention points with a qualified doctor")

    if len(diseases) > 1:
        recommendations.append("Schedule regular health checkups for existing conditions")

    if not recommendations:
        recommendations.append("Maintain your current healthy routine and monitoring habits")

    latest_report = medical_reports[0] if medical_reports else None

    if abnormal_report_findings:
        report_summary_text = (
            f"{len(abnormal_report_findings)} report finding(s) may need attention: "
            + ", ".join([item["name"] for item in abnormal_report_findings[:4]])
        )
    else:
        report_summary_text = "No report-based attention points detected yet."

    summary = {
        "title": "AI Health Summary",
        "text": user.get("last_ai_summary", "No major issues detected"),
        "report_summary": report_summary_text,
    }

    condition_card = {
        "title": "Health Focus",
        "description": ", ".join(diseases) if diseases else "No major conditions",
    }

    report_cards = []

    for report in medical_reports:
        report_cards.append({
            "id": report.get("id"),
            "type": report.get("type", "medical_report"),
            "report_type": report.get("report_type", "Medical Report"),
            "summary": report.get("summary", "No report summary available."),
            "suggestion": report.get("suggestion", ""),
            "key_findings": report.get("key_findings", []),
            "possible_attention_points": report.get("possible_attention_points", []),
            "disclaimer": report.get(
                "disclaimer",
                "This is not a diagnosis. Please consult a qualified doctor."
            ),
            "source": report.get("source", "report_ai"),
            "created_at": report.get("created_at", report.get("date", "")),
        })

    return {
        "user": {
            "id": user.get("id"),
            "name": user.get("name"),
            "age": user.get("age"),
        },
        "score": {
            "value": score,
            "status": status,
            "note": "Calculated based on routine, vitals, conditions, and saved report findings",
        },
        "metrics": metrics,
        "recommendations": recommendations,
        "summary": summary,
        "condition": condition_card,
        "issues": issues,
        "reports": report_cards,
        "report_insights": {
            "total_reports": len(medical_reports),
            "latest_report": latest_report,
            "attention_points": report_attention_points,
            "abnormal_findings": abnormal_report_findings,
        },
    }