def compute_score(routine, medication):
    score = 0

    if routine:
        sleep = routine.get("sleep_hours")
        water = routine.get("water_liters")

        if sleep and sleep < 6:
            score -= 5

        if water and water < 2:
            score -= 3

    if medication:
        if medication.get("missed_dose"):
            score -= 10

    return score