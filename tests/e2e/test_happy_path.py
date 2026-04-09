"""End-to-end happy path test.

Tests the complete workflow:
1. List seeded cases
2. Run agent workflow on a case
3. Verify recommendation generated
4. Approve the recommendation
5. Verify case completed
6. Verify audit trail
"""
import pytest
import httpx

API_BASE = "http://localhost:8000"


@pytest.fixture
def api_client():
    return httpx.Client(base_url=API_BASE, timeout=120)


class TestHappyPath:
    def test_full_workflow_cycle(self, api_client):
        """End-to-end: create -> workflow -> review -> approve -> complete."""

        # Step 1: Create a case
        create_resp = api_client.post("/api/v1/cases", json={
            "title": "E2E Test - Suspected Duplicate Charge",
            "description": "Cardholder reports two charges of $50.00 from the same merchant on the same day. Only one purchase was made.",
            "priority": "medium",
            "issue_type": "duplicate_charge",
            "transaction_id": "TXN-9382741",
            "account_id": "ACCT-4421889",
            "merchant_name": "Test Merchant",
            "amount": 50.00,
        })
        assert create_resp.status_code == 201
        case = create_resp.json()
        case_id = case["id"]
        assert case["status"] == "created"

        # Step 2: Run the agent workflow
        wf_resp = api_client.post("/api/v1/workflow/run", json={"case_id": case_id})
        assert wf_resp.status_code == 200
        wf_data = wf_resp.json()
        assert wf_data["status"] == "awaiting_review"
        assert len(wf_data.get("steps", [])) >= 7

        # Step 3: Verify case updated
        case_resp = api_client.get(f"/api/v1/cases/{case_id}")
        assert case_resp.status_code == 200
        updated_case = case_resp.json()
        assert updated_case["status"] == "awaiting_review"
        assert updated_case["confidence_score"] is not None

        # Step 4: Verify recommendation exists
        rec_resp = api_client.get(f"/api/v1/cases/{case_id}/recommendations")
        assert rec_resp.status_code == 200
        recs = rec_resp.json()
        assert len(recs) >= 1
        rec = recs[0]
        assert rec["confidence_score"] > 0
        assert rec["recommended_action"] != ""

        # Step 5: Approve the recommendation
        action_resp = api_client.post(f"/api/v1/cases/{case_id}/actions", json={
            "action_type": "approve",
            "recommendation_id": rec["id"],
            "reason": "Evidence supports recommendation",
        })
        assert action_resp.status_code == 201
        action_data = action_resp.json()
        assert action_data["success"] is True

        # Step 6: Verify case is completed
        final_resp = api_client.get(f"/api/v1/cases/{case_id}")
        assert final_resp.status_code == 200
        final_case = final_resp.json()
        assert final_case["status"] == "completed"

        # Step 7: Verify audit trail
        audit_resp = api_client.get("/api/v1/audit", params={"case_id": case_id})
        assert audit_resp.status_code == 200
        audit_data = audit_resp.json()
        assert audit_data["total"] >= 3  # At least: created, workflow steps, status changes

        # Step 8: Verify status history
        history_resp = api_client.get(f"/api/v1/cases/{case_id}/history")
        assert history_resp.status_code == 200
        history = history_resp.json()
        assert len(history) >= 5  # Multiple state transitions
