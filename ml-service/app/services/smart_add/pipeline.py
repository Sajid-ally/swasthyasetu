from typing import Any, Dict, List

from app.schemas.common_schema import HealthCategory, ProcessingStatus, RiskLevel
from app.schemas.text_schema import (
    ExtractedFieldSchema,
    TextExtractionResultSchema,
    TextRouteResponseSchema,
)
from app.services.smart_add.cleaner import clean_text
from app.services.smart_add.extractor import extract_fields
from app.services.smart_add.risk_engine import get_risk_level
from app.services.smart_add.router import route_text
from app.services.smart_add.scorer import score_extraction


def _dict_to_extracted_fields(extracted_data: Dict[str, Any]) -> List[ExtractedFieldSchema]:
    fields = []
    for key, value in extracted_data.items():
        if value is None:
            continue
        if isinstance(value, str) and not value.strip():
            continue
        fields.append(ExtractedFieldSchema(key=key, value=value))
    return fields


def _build_failed_response(original_text: str, cleaned_text: str, message: str) -> TextRouteResponseSchema:
    result = TextExtractionResultSchema(
        category=HealthCategory.UNKNOWN,
        status=ProcessingStatus.FAILED,
        original_text=original_text,
        cleaned_text=cleaned_text,
        extracted_data={},
        extracted_fields=[],
        confidence=0.0,
        score=0.0,
        risk_level=RiskLevel.LOW,
        message=message,
    )
    return TextRouteResponseSchema(success=False, data=result)


def process_health_text(text: str) -> TextRouteResponseSchema:
    """
    Main end-to-end pipeline for text health input.
    """
    original_text = text if text is not None else ""

    if text is None:
        return _build_failed_response(
            original_text="",
            cleaned_text="",
            message="Input text is missing",
        )

    cleaned_text = clean_text(text)

    if not cleaned_text:
        return _build_failed_response(
            original_text=original_text,
            cleaned_text="",
            message="Input text is empty after cleaning",
        )

    try:
        category = route_text(cleaned_text)
        extracted_data = extract_fields(cleaned_text, category)
        score, confidence, status, message = score_extraction(category, extracted_data)
        risk_level = get_risk_level(category, extracted_data)
        extracted_fields = _dict_to_extracted_fields(extracted_data)

        result = TextExtractionResultSchema(
            category=category,
            status=status,
            original_text=original_text,
            cleaned_text=cleaned_text,
            extracted_data=extracted_data,
            extracted_fields=extracted_fields,
            confidence=confidence,
            score=score,
            risk_level=risk_level,
            message=message,
        )

        return TextRouteResponseSchema(success=True, data=result)

    except Exception as exc:
        return _build_failed_response(
            original_text=original_text,
            cleaned_text=cleaned_text,
            message=f"Pipeline processing failed: {str(exc)}",
        )
