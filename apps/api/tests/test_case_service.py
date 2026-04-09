"""Test case service business logic."""

from app.models.case import CaseStatus
from app.services.case_service import STATUS_TRANSITIONS


class TestStatusTransitions:
    def test_approve_from_awaiting_review(self):
        transitions = STATUS_TRANSITIONS["approve"]
        assert transitions[CaseStatus.AWAITING_REVIEW] == CaseStatus.APPROVED

    def test_reject_from_awaiting_review(self):
        transitions = STATUS_TRANSITIONS["reject"]
        assert transitions[CaseStatus.AWAITING_REVIEW] == CaseStatus.REJECTED

    def test_escalate_from_created(self):
        transitions = STATUS_TRANSITIONS["escalate"]
        assert transitions[CaseStatus.CREATED] == CaseStatus.ESCALATED

    def test_reopen_from_completed(self):
        transitions = STATUS_TRANSITIONS["reopen"]
        assert transitions[CaseStatus.COMPLETED] == CaseStatus.CREATED

    def test_no_approve_from_created(self):
        transitions = STATUS_TRANSITIONS["approve"]
        assert CaseStatus.CREATED not in transitions

    def test_all_action_types_defined(self):
        assert "approve" in STATUS_TRANSITIONS
        assert "reject" in STATUS_TRANSITIONS
        assert "escalate" in STATUS_TRANSITIONS
        assert "reopen" in STATUS_TRANSITIONS


class TestCaseStatusEnum:
    def test_all_statuses_exist(self):
        expected = [
            "created",
            "triaged",
            "context_retrieved",
            "tools_selected",
            "tools_executed",
            "recommendation_generated",
            "safety_checked",
            "awaiting_review",
            "approved",
            "rejected",
            "escalated",
            "completed",
            "failed_safe",
        ]
        actual = [s.value for s in CaseStatus]
        assert set(expected) == set(actual)
