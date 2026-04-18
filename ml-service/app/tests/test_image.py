import os
import csv
from app.services.visual_intelligence.pipeline import process_medicine_image

image_folder = "data/sample_images"
label_file = os.path.join(image_folder, "labels.csv")

expected_data = {}

with open(label_file, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        expected_data[row["filename"]] = {
            "expected_medicine": row["expected_medicine"].strip().lower(),
            "expected_dosage": row["expected_dosage"].strip().lower()
        }

for file_name in os.listdir(image_folder):
    if file_name.lower().endswith((".jpg", ".jpeg", ".png")):
        image_path = os.path.join(image_folder, file_name)
        result = process_medicine_image(image_path)

        expected = expected_data.get(file_name, {})
        expected_medicine = expected.get("expected_medicine", "")
        predicted_medicine = (result.get("medicine_name") or "").strip().lower()

        print("\n-----------------------------------")
        print("FILE:", file_name)
        print("EXPECTED MEDICINE:", expected_medicine)
        print("PREDICTED MEDICINE:", predicted_medicine)
        print("FULL RESULT:", result)