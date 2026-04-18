from app.services.smart_add.pipeline import process_health_text


def test_medication_pipeline():
    result = process_health_text("I take Crocin 500 mg after dinner")
    data = result.data

    assert result.success is True
    assert data.category.value == "medication"
    assert data.status.value == "success"
    assert data.extracted_data["medicine_name"] == "crocin"
    assert data.extracted_data["dosage"] == "500 mg"
    assert data.extracted_data["timing"] == "after dinner"
    assert data.risk_level.value == "low"


def test_family_history_pipeline():
    result = process_health_text("My father has diabetes")
    data = result.data

    assert result.success is True
    assert data.category.value == "family_history"
    assert data.extracted_data["relation"] == "father"
    assert data.extracted_data["condition"] == "diabetes"
    assert data.risk_level.value == "medium"


def test_routine_pipeline():
    result = process_health_text("I walk 30 minutes daily")
    data = result.data

    assert result.success is True
    assert data.category.value == "routine"
    assert data.extracted_data["activity"] == "walk"
    assert data.extracted_data["duration"] == "30 minutes"
    assert data.extracted_data["frequency"] == "daily"
    assert data.risk_level.value == "low"


def test_water_routine_pipeline():
    result = process_health_text("I drink 2 liters water daily")
    data = result.data

    assert result.success is True
    assert data.category.value == "routine"
    assert data.extracted_data["activity"] in ["drink water", "drink"]
    assert data.extracted_data["quantity"] == "2 liters"
    assert data.extracted_data["frequency"] == "daily"
    assert data.risk_level.value == "low"


def test_symptom_pipeline():
    result = process_health_text("I have chest pain sometimes")
    data = result.data

    assert result.success is True
    assert data.category.value == "symptom"
    assert data.extracted_data["symptom"] == "chest pain"
    assert data.extracted_data["frequency"] == "sometimes"
    assert data.risk_level.value == "high"


def test_condition_pipeline():
    result = process_health_text("I have hypertension")
    data = result.data

    assert result.success is True
    assert data.category.value == "condition"
    assert data.extracted_data["condition"] == "hypertension"
    assert data.risk_level.value == "medium"


def test_unknown_pipeline():
    result = process_health_text("Hello how are you")
    data = result.data

    assert result.success is True
    assert data.category.value == "unknown"
    assert "raw_text" in data.extracted_data


def test_empty_text_pipeline():
    result = process_health_text("   ")
    data = result.data

    assert result.success is False
    assert data.status.value == "failed"
    assert data.message == "Input text is empty after cleaning"


def test_none_text_pipeline():
    result = process_health_text(None)
    data = result.data

    assert result.success is False
    assert data.status.value == "failed"
    assert data.message == "Input text is missing"

def test_run_routine_pipeline():
    result = process_health_text("I run 20 minutes daily")
    data = result.data

    assert result.success is True
    assert data.category.value == "routine"
    assert data.extracted_data["activity"] == "run"
    assert data.extracted_data["duration"] == "20 minutes"
    assert data.extracted_data["frequency"] == "daily"


def test_condition_diabetes_pipeline():
    result = process_health_text("I have diabetes")
    data = result.data

    assert result.success is True
    assert data.category.value == "condition"
    assert data.extracted_data["condition"] == "diabetes"
    assert data.risk_level.value == "medium"


def test_medication_without_dosage_pipeline():
    result = process_health_text("I take insulin")
    data = result.data

    assert result.success is True
    assert data.category.value == "medication"
    assert data.extracted_data["medicine_name"] == "insulin"

def test_insulin_medication_pipeline():
    result = process_health_text("Taking insulin twice daily")
    data = result.data

    assert result.success is True
    assert data.category.value == "medication"
    assert data.extracted_data["medicine_name"] == "insulin"
    assert data.extracted_data["timing"] == "twice daily"


def test_grandfather_family_history_pipeline():
    result = process_health_text("My grandfather had stroke")
    data = result.data

    assert result.success is True
    assert data.category.value == "family_history"
    assert data.extracted_data["relation"] == "grandfather"
    assert data.extracted_data["condition"] == "stroke"


def test_sleep_routine_pipeline():
    result = process_health_text("I sleep 6 hours daily")
    data = result.data

    assert result.success is True
    assert data.category.value == "routine"
    assert data.extracted_data["activity"] == "sleep"
    assert data.extracted_data["duration"] == "6 hours"
    assert data.extracted_data["frequency"] == "daily"


def test_yoga_routine_pipeline():
    result = process_health_text("I do yoga everyday")
    data = result.data

    assert result.success is True
    assert data.category.value == "routine"
    assert data.extracted_data["activity"] == "yoga"
    assert data.extracted_data["frequency"] == "everyday"


def test_dizziness_symptom_pipeline():
    result = process_health_text("I often feel dizzy")
    data = result.data

    assert result.success is True
    assert data.category.value == "symptom"
    assert data.extracted_data["symptom"] == "dizziness"
    assert data.extracted_data["frequency"] == "often"


def test_diabetes_condition_pipeline():
    result = process_health_text("I am suffering from diabetes")
    data = result.data

    assert result.success is True
    assert data.category.value == "condition"
    assert data.extracted_data["condition"] == "diabetes"


def test_running_distance_routine_pipeline():
    result = process_health_text("I run 5 km daily")
    data = result.data

    assert result.success is True
    assert data.category.value == "routine"
    assert data.extracted_data["activity"] == "run"
    assert data.extracted_data["distance"] == "5 km"
    assert data.extracted_data["frequency"] == "daily"
