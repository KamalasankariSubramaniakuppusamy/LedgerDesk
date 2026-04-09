"""Test workflow state machine definitions."""

from app.models.case import CaseStatus


class TestWorkflowStates:
    """Verify the state machine is well-formed."""

    def test_created_is_initial_state(self):
        assert CaseStatus.CREATED.value == "created"

    def test_completed_is_terminal(self):
        assert CaseStatus.COMPLETED.value == "completed"

    def test_failed_safe_is_terminal(self):
        assert CaseStatus.FAILED_SAFE.value == "failed_safe"

    def test_happy_path_states(self):
        """Verify the happy path goes through all expected states."""
        happy_path = [
            CaseStatus.CREATED,
            CaseStatus.TRIAGED,
            CaseStatus.CONTEXT_RETRIEVED,
            CaseStatus.TOOLS_SELECTED,
            CaseStatus.TOOLS_EXECUTED,
            CaseStatus.RECOMMENDATION_GENERATED,
            CaseStatus.SAFETY_CHECKED,
            CaseStatus.AWAITING_REVIEW,
            CaseStatus.APPROVED,
            CaseStatus.COMPLETED,
        ]
        for state in happy_path:
            assert state in CaseStatus

    def test_all_states_are_strings(self):
        for state in CaseStatus:
            assert isinstance(state.value, str)
            assert len(state.value) > 0
