import pytest
from app.models.agent_fingerprinting import AgentFingerprintingEngine


def test_normal_agent():
    engine = AgentFingerprintingEngine()
    result = engine.analyze_behavior({
        "agent_id": "AGT-001",
        "booking_velocity": 3.0,
        "avg_booking_value": 250.0,
        "destinations": ["VFA", "HRE", "BUQ"],
        "booking_hours": [9, 10, 11, 14, 15],
    })
    assert result["status"] == "normal"
    assert result["trust_score"] > 70


def test_flagged_agent():
    engine = AgentFingerprintingEngine()
    result = engine.analyze_behavior({
        "agent_id": "AGT-002",
        "booking_velocity": 89.0,
        "avg_booking_value": 12000.0,
        "destinations": ["XYZ-UNREG", "NOC", "HKG"],
        "booking_hours": [2, 3, 4, 22, 23],
    })
    assert result["status"] in ("flagged", "suspicious")
    assert result["anomaly_score"] > 30


def test_trust_score_bounds():
    engine = AgentFingerprintingEngine()
    result = engine.analyze_behavior({
        "agent_id": "AGT-003",
        "booking_velocity": 1.0,
        "avg_booking_value": 100.0,
        "destinations": ["VFA"],
        "booking_hours": [10],
    })
    assert 0 <= result["trust_score"] <= 100
    assert 0 <= result["anomaly_score"] <= 100
