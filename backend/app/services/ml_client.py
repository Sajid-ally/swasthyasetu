import requests

def call_ml(payload):
    try:
        res = requests.post(
            "http://127.0.0.1:8001/smart-add/text",
            json=payload,
            timeout=5
        )

        data = res.json()
        print("ML RESPONSE 👉", data)

        # ✅ STEP 1: Go deep into structure
        extracted = data.get("data", {}).get("extracted_data", {})

        # ✅ STEP 2: PRIORITY → final_output
        if "final_output" in extracted:
            return extracted["final_output"]

        # ✅ STEP 3: fallback → user_friendly_response
        if "user_friendly_response" in extracted:
            return {
                "summary": extracted["user_friendly_response"].get("summary"),
                "severity": extracted.get("severity_analysis", {}).get("severity_level"),
                "suggestions": [
                    {"title": s, "description": ""} 
                    for s in extracted["user_friendly_response"].get("suggestions", [])
                ]
            }

        return {}

    except Exception as e:
        print("ML ERROR:", e)
        return {}