from pydantic import BaseModel
from typing import Optional

class MedicationImageOutput(BaseModel):
    type: str
    medicine_name: Optional[str]
    dosage: Optional[str]
    confidence: float
    detected_text: str
    error: Optional[str] = None