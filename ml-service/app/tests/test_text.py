from app.services.smart_add.pipeline import process_smart_add_text


def test_routine_and_medication():
    text = "I slept 5 hours and forgot medicine"
    result = process_smart_add_text(text)

    assert "routine" in result["detected_modules"]
    assert "medication" in result["detected_modules"]

    assert result["routine"]["sleep_hours"] == 5
    assert result["medication"]["missed_dose"] == True


def test_good_routine():
    text = "I slept 8 hours and drank 3 l water"
    result = process_smart_add_text(text)

    assert result["routine"]["sleep_hours"] == 8
    assert result["health_score_impact"] == 0


def test_bad_sleep():
    text = "I slept 4 hours"
    result = process_smart_add_text(text)

    assert result["routine"]["sleep_hours"] == 4
    assert result["health_score_impact"] < 0
    assert "low_sleep_risk" in result["risk_alerts"]