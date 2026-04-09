"""Integration tests for the API."""
import pytest
import httpx

API_BASE = "http://localhost:8000"


@pytest.fixture
def api_client():
    return httpx.Client(base_url=API_BASE, timeout=30)


class TestHealthEndpoints:
    def test_health(self, api_client):
        resp = api_client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "healthy"
        assert data["service"] == "ledgerdesk-api"

    def test_health_ready(self, api_client):
        resp = api_client.get("/health/ready")
        assert resp.status_code == 200


class TestCaseEndpoints:
    def test_list_cases(self, api_client):
        resp = api_client.get("/api/v1/cases")
        assert resp.status_code == 200
        data = resp.json()
        assert "cases" in data
        assert "total" in data
        assert data["total"] >= 0

    def test_list_cases_with_filter(self, api_client):
        resp = api_client.get("/api/v1/cases", params={"priority": "critical"})
        assert resp.status_code == 200

    def test_list_cases_with_search(self, api_client):
        resp = api_client.get("/api/v1/cases", params={"search": "duplicate"})
        assert resp.status_code == 200

    def test_create_case(self, api_client):
        resp = api_client.post("/api/v1/cases", json={
            "title": "Integration Test Case",
            "description": "Created by integration test",
            "priority": "low",
        })
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Integration Test Case"
        assert "id" in data
        assert "case_number" in data

    def test_get_case(self, api_client):
        # Create first
        create_resp = api_client.post("/api/v1/cases", json={
            "title": "Get Test Case",
            "description": "For get test",
        })
        case_id = create_resp.json()["id"]

        # Get
        resp = api_client.get(f"/api/v1/cases/{case_id}")
        assert resp.status_code == 200
        assert resp.json()["id"] == case_id

    def test_get_nonexistent_case(self, api_client):
        resp = api_client.get("/api/v1/cases/00000000-0000-0000-0000-999999999999")
        assert resp.status_code == 404


class TestPolicyEndpoints:
    def test_list_policies(self, api_client):
        resp = api_client.get("/api/v1/policies")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


class TestMetricsEndpoints:
    def test_dashboard_metrics(self, api_client):
        resp = api_client.get("/api/v1/metrics/dashboard")
        assert resp.status_code == 200
        data = resp.json()
        assert "total_cases" in data
        assert "cases_by_status" in data
        assert "cases_by_priority" in data


class TestToolEndpoints:
    def test_execute_tool(self, api_client):
        resp = api_client.post("/api/v1/tools/execute", json={
            "tool_name": "get_transaction_timeline",
            "params": {"transaction_id": "TXN-9382741"},
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert "data" in data

    def test_execute_unknown_tool(self, api_client):
        resp = api_client.post("/api/v1/tools/execute", json={
            "tool_name": "nonexistent_tool",
            "params": {},
        })
        assert resp.status_code == 400


class TestAuditEndpoints:
    def test_list_audit_events(self, api_client):
        resp = api_client.get("/api/v1/audit")
        assert resp.status_code == 200
        data = resp.json()
        assert "events" in data
        assert "total" in data


class TestWorkflowEndpoints:
    def test_get_workflow_states(self, api_client):
        resp = api_client.get("/api/v1/workflow/states")
        assert resp.status_code == 200
        data = resp.json()
        assert "states" in data
        assert "transitions" in data
        assert "created" in data["states"]
        assert "completed" in data["states"]
