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

        # ✅ RETURN ONLY FINAL DATA
        return data.get("data", {})

    except Exception as e:
        print("ML ERROR:", e)
        return {}