"""Metrics and dashboard endpoints."""

import structlog
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.case import Case
from app.models.audit import AnalystAction
from app.models.agent import ToolInvocation, Recommendation

logger = structlog.get_logger()
router = APIRouter()


@router.get("/dashboard")
async def dashboard_metrics(db: AsyncSession = Depends(get_db)):
    # Case counts by status
    status_result = await db.execute(
        select(Case.status, func.count(Case.id)).group_by(Case.status)
    )
    status_counts = {
        row[0].value if hasattr(row[0], "value") else row[0]: row[1]
        for row in status_result.all()
    }

    # Priority distribution
    priority_result = await db.execute(
        select(Case.priority, func.count(Case.id)).group_by(Case.priority)
    )
    priority_counts = {
        row[0].value if hasattr(row[0], "value") else row[0]: row[1]
        for row in priority_result.all()
    }

    # Total cases
    total = (await db.execute(select(func.count(Case.id)))).scalar() or 0

    # Action counts
    action_result = await db.execute(
        select(AnalystAction.action_type, func.count(AnalystAction.id)).group_by(
            AnalystAction.action_type
        )
    )
    action_counts = dict(action_result.all())

    # Average confidence
    avg_confidence = (
        await db.execute(select(func.avg(Recommendation.confidence_score)))
    ).scalar()

    # Tool invocation stats
    tool_count = (await db.execute(select(func.count(ToolInvocation.id)))).scalar() or 0
    avg_tool_latency = (
        await db.execute(select(func.avg(ToolInvocation.duration_ms)))
    ).scalar()

    return {
        "total_cases": total,
        "cases_by_status": status_counts,
        "cases_by_priority": priority_counts,
        "analyst_actions": action_counts,
        "average_confidence": round(avg_confidence, 3) if avg_confidence else None,
        "total_tool_invocations": tool_count,
        "average_tool_latency_ms": round(avg_tool_latency, 1)
        if avg_tool_latency
        else None,
        "approval_rate": _calc_rate(
            action_counts.get("approve", 0), action_counts.get("reject", 0)
        ),
    }


def _calc_rate(approved: int, rejected: int) -> float | None:
    total = approved + rejected
    if total == 0:
        return None
    return round(approved / total, 3)


@router.get("/workflow")
async def workflow_metrics(db: AsyncSession = Depends(get_db)):
    return {
        "message": "Workflow metrics available after cases are processed",
        "tracked_metrics": [
            "workflow_step_timing",
            "tool_call_latency",
            "retrieval_quality",
            "fallback_frequency",
            "confidence_distribution",
            "override_rate",
            "recommendation_acceptance_rate",
        ],
    }
