from pydantic import BaseModel
from typing import List, Optional


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


class User(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    age: Optional[int] = None
    diseases: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    lifestyle: Optional[Lifestyle] = None
    vitals: Optional[Vitals] = None
    emergency: Optional[Emergency] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None