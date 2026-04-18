from app.services.smart_add.pipeline import process_health_text

samples = [
    "I take Crocin 500 mg after dinner",
    "My father has diabetes",
    "I walk 30 minutes daily",
    "I drink 2 liters water daily",
    "I have chest pain sometimes",
    "I have hypertension",
    "Hello how are you",
    "",
    None,
]

for text in samples:
    result = process_health_text(text)
    print("INPUT :", text)
    print(result.model_dump())
    print("-" * 80)