from enum import Enum


class InputType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class HealthCategory(str, Enum):
    MEDICATION = "medication"
    FAMILY_HISTORY = "family_history"
    ROUTINE = "routine"
    SYMPTOM = "symptom"
    CONDITION = "condition"
    UNKNOWN = "unknown"


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class ProcessingStatus(str, Enum):
    SUCCESS = "success"
    PARTIAL = "partial"
    FAILED = "failed"