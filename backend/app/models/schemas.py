from pydantic import BaseModel
from typing import List, Optional


# =========================
# NESTED MODELS
# =========================

class Lifestyle(BaseModel):
    sleep_hours: Optional[int] = None
    exercise: Optional[str] = None
    smoking: Optional[bool] = None


class Vitals(BaseModel):
    bp: Optional[str] = None
    sugar_level: Optional[int] = None


class Emergency(BaseModel):
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    contact: Optional[str] = None


# =========================
# MAIN USER MODEL
# =========================

class User(BaseModel):
    # Basic Info
    id: Optional[str] = None
    name: Optional[str] = None
    age: Optional[int] = None

    # 🔥 NEW PROFILE FIELDS (IMPORTANT)
    email: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None

    # Health Info
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None

    diseases: Optional[List[str]] = None
    medications: Optional[List[str]] = None

    # Nested Data
    lifestyle: Optional[Lifestyle] = None
    vitals: Optional[Vitals] = None
    emergency: Optional[Emergency] = None