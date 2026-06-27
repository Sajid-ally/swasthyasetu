from pydantic import BaseModel
from typing import Optional, List

class MedicationImageOutput(BaseModel):
    type: str
    medicine_name: Optional[str]
    dosage: Optional[str]
    confidence: float
    detected_text: str
    error: Optional[str] = None
    manual_input_required: bool = False
    missing_fields: List[str] = []
    message: Optional[str] = None