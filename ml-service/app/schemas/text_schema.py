from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.schemas.common_schema import (
    HealthCategory,
    InputType,
    ProcessingStatus,
    RiskLevel,
)


class TextInputSchema(BaseModel):
    text: str = Field(..., min_length=1, description="Raw health-related text input from user")
    user_id: Optional[str] = Field(default=None, description="Optional user id for future integration")


class ExtractedFieldSchema(BaseModel):
    key: str
    value: Any


class TextExtractionResultSchema(BaseModel):
    input_type: InputType = Field(default=InputType.TEXT)
    category: HealthCategory = Field(default=HealthCategory.UNKNOWN)
    status: ProcessingStatus = Field(default=ProcessingStatus.SUCCESS)
    original_text: str
    cleaned_text: str
    extracted_data: Dict[str, Any] = Field(default_factory=dict)
    extracted_fields: List[ExtractedFieldSchema] = Field(default_factory=list)
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    score: float = Field(default=0.0, ge=0.0, le=1.0)
    risk_level: RiskLevel = Field(default=RiskLevel.LOW)
    message: str = Field(default="Processed successfully")


class TextRouteResponseSchema(BaseModel):
    success: bool = True
    data: TextExtractionResultSchema