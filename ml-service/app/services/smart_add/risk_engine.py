def generate_risks(routine):
    risks = []

    if routine:
        sleep = routine.get("sleep_hours")

        if sleep and sleep < 5:
            risks.append("low_sleep_risk")

    return risks