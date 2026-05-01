import requests


def call_ml(payload):
    try:
        res = requests.post(
            "http://127.0.0.1:8001/smart-add/text",
            json=payload,
            timeout=10
        )

        res.raise_for_status()
        data = res.json()

        print("ML RESPONSE 👉", data)

        return data.get("data", {})

    except Exception as e:
        print("ML ERROR:", e)
        return {}