from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_scenarios_list_and_detail():
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 1
    assert items[0]["id"] == "takapay-support"

    detail = client.get("/api/scenarios/takapay-support")
    assert detail.status_code == 200
    assert "step_1_urgency" in detail.json()["steps"]


def test_classify_blocks_pin():
    res = client.post(
        "/api/classify",
        json={
            "scenario_id": "takapay-support",
            "step_id": "step_2_otp",
            "user_reply": "My pin is 4589",
            "language": "en",
        },
    )
    assert res.status_code == 422


def test_classify_valid_reply():
    res = client.post(
        "/api/classify",
        json={
            "scenario_id": "takapay-support",
            "step_id": "step_1_urgency",
            "user_reply": "Why will it close?",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["label"] == "safe"
    assert data["provider"] == "rules"
    assert data["next_step_id"] == "step_2_otp"
