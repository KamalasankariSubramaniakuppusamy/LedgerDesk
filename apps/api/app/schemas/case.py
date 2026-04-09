"""Case request/response schemas."""

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class CaseCreate(BaseModel):
    title: str = Field(..., max_length=500)
    description: str
    priority: str = "medium"
    issue_type: str | None = None
    transaction_id: str | None = None
    account_id: str | None = None
    merchant_name: str | None = None
    merchant_ref: str | None = None
    amount: Decimal | None = None
    currency: str = "USD"


class CaseUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: str | None = None
    issue_type: str | None = None
    assigned_to: uuid.UUID | None = None


class CaseResponse(BaseModel):
    id: uuid.UUID
    case_number: str
    title: str
    description: str
    status: str
    priority: str
    issue_type: str | None
    transaction_id: str | None
    account_id: str | None
    merchant_name: str | None
    merchant_ref: str | None
    amount: Decimal | None
    currency: str
    assigned_to: uuid.UUID | None
    confidence_score: float | None
    requires_human_review: bool
    trace_id: str | None
    extracted_entities: dict | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CaseListResponse(BaseModel):
    cases: list[CaseResponse]
    total: int
    page: int
    page_size: int


class CaseNoteCreate(BaseModel):
    content: str
    note_type: str = "general"


class CaseNoteResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    author_id: uuid.UUID
    content: str
    note_type: str
    created_at: datetime

    model_config = {"from_attributes": True}


class StatusHistoryResponse(BaseModel):
    id: uuid.UUID
    from_status: str | None
    to_status: str
    changed_by: str | None
    reason: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
