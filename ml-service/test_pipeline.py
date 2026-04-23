from app.services.smart_add.pipeline import process_health_text
import json


def pretty_print(title, response):
    print("\n" + "=" * 120)
    print(title)
    print("=" * 120)

    # Convert response safely (Pydantic v1 / v2)
    if hasattr(response, "model_dump"):
        data = response.model_dump()
    else:
        data = response.dict()

    extracted = data.get("data", {}).get("extracted_data", {})

    # -----------------------------
    # FULL DEBUG OUTPUT
    # -----------------------------
    print("\n--- FULL PIPELINE OUTPUT ---")
    print(json.dumps(data, indent=2, default=str))

    # -----------------------------
    # FINAL DASHBOARD OUTPUT (MAIN)
    # -----------------------------
    print("\n🔥 --- FINAL DASHBOARD OUTPUT --- 🔥")
    final_output = extracted.get("final_output", {})
    print(json.dumps(final_output, indent=2))

    # -----------------------------
    # QUICK VIEW (IMPORTANT)
    # -----------------------------
    print("\n--- QUICK INSIGHTS ---")
    print("Health Score:", final_output.get("health_score"))
    print("Severity:", final_output.get("severity"))
    print("Alerts:", final_output.get("alerts"))
    print("Summary:", final_output.get("summary"))
    print("Timeline:", final_output.get("timeline_summary"))


if __name__ == "__main__":
    user_id = "raghav_step14_test"

    test_inputs = [
        "mera bp high hai",
        "main bahut kam chalta hu",
        "raat ko neend nahi aayi",
        "mujhe chest pain ho raha hai",
    ]

    for i, text in enumerate(test_inputs, start=1):
        response = process_health_text(text, user_id=user_id)
        pretty_print(f"TEST {i}: {text}", response)