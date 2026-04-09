"""Audit schemas."""
import uuid
from datetime import datetime

from pydantic import BaseModel


class AuditEventResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID | None
    event_type: str
    actor_type: str
    actor_id: str | None
    action: str
    resource_type: str
    resource_id: str | None
    details: dict | None
    trace_id: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class AuditEventListResponse(BaseModel):
    events: list[AuditEventResponse]
    total: int
    page: int
    page_size: int


class AnalystActionCreate(BaseModel):
    action_type: str  # approve, reject, edit, escalate, reassign, reopen
    recommendation_id: uuid.UUID | None = None
    reason: str | None = None
    metadata: dict | None = None


class ToolInvocationResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    tool_name: str
    tool_type: str
    input_params: dict
    output_data: dict | None
    status: str
    error_message: str | None
    duration_ms: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
