import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE_PATH = os.path.join(BASE_DIR, "data", "family.json")


def load_family_data():
    with open(FILE_PATH) as f:
        return json.load(f)


def save_family_data(data):
    with open(FILE_PATH, "w") as f:
        json.dump(data, f, indent=4)