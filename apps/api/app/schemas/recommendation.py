"""Recommendation schemas."""
import uuid
from datetime import datetime

from pydantic import BaseModel


class RecommendationResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    recommended_action: str
    rationale: str
    confidence_score: float
    policy_citations: list | None
    evidence_summary: dict | None
    structured_decision: dict | None
    required_approval_level: str
    safety_gate_passed: bool | None
    safety_gate_details: dict | None
    created_at: datetime

    model_config = {"from_attributes": True}
