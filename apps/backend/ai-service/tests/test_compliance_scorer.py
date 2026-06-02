import pytest
from app.models.compliance_scorer import ComplianceRiskScorer


@pytest.fixture
def scorer():
    return ComplianceRiskScorer()


# ---------------------------------------------------------------------------
# 1. Perfect operator -- all metrics ideal, should be low risk
# ---------------------------------------------------------------------------
def test_perfect_operator(scorer):
    result = scorer.calculate_risk_score({
        "operator_id": "OP-PERFECT",
        "levy_compliance_rate": 100,
        "late_payments_90d": 0,
        "avg_booking_velocity": 5,
        "unusual_hours_percentage": 0,
        "bsp_connected": True,
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 95,
        "missing_documents": 0,
        "annual_revenue": 500000,
    })
    assert result["risk_score"] < 50, "Perfect operator should be low risk"
    assert result["risk_level"] == "low"
    assert result["operator_id"] == "OP-PERFECT"


# ---------------------------------------------------------------------------
# 2. Critical operator -- all metrics terrible
# ---------------------------------------------------------------------------
def test_critical_operator(scorer):
    result = scorer.calculate_risk_score({
        "operator_id": "OP-CRITICAL",
        "levy_compliance_rate": 0,
        "late_payments_90d": 7,
        "avg_booking_velocity": 20,
        "unusual_hours_percentage": 1.0,
        "bsp_connected": False,
        "bsp_reference_mismatches": 3,
        "avg_agent_trust_score": 10,
        "missing_documents": 4,
        "annual_revenue": 1000000,
    })
    assert result["risk_score"] >= 85
    assert result["risk_level"] == "critical"
    assert any("Suspend" in r for r in result["recommendations"]), \
        "Critical operator should have suspension recommendation"


# ---------------------------------------------------------------------------
# 3. High risk operator -- multiple bad factors (score 70-84)
# ---------------------------------------------------------------------------
def test_high_risk_operator(scorer):
    result = scorer.calculate_risk_score({
        "operator_id": "OP-HIGH",
        "levy_compliance_rate": 15,        # 85*0.25 = 21.25
        "late_payments_90d": 5,            # 75*0.20 = 15
        "avg_booking_velocity": 15,        # 30+unusual
        "unusual_hours_percentage": 0.6,   # (30+30)=60*0.15 = 9
        "bsp_connected": True,
        "bsp_reference_mismatches": 3,     # 60*0.15 = 9
        "avg_agent_trust_score": 30,       # 70*0.15 = 10.5
        "missing_documents": 3,            # 75*0.10 = 7.5
        "annual_revenue": 300000,
    })
    assert result["risk_level"] == "high"
    assert 70 <= result["risk_score"] < 85


# ---------------------------------------------------------------------------
# 4. Medium risk operator -- moderate issues (score 50-69)
# ---------------------------------------------------------------------------
def test_medium_risk_operator(scorer):
    result = scorer.calculate_risk_score({
        "operator_id": "OP-MEDIUM",
        "levy_compliance_rate": 40,        # 60*0.25 = 15
        "late_payments_90d": 4,            # 60*0.20 = 12
        "avg_booking_velocity": 10,        # 20+unusual
        "unusual_hours_percentage": 0.5,   # (20+25)=45*0.15 = 6.75
        "bsp_connected": False,            # 40*0.15 = 6
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 40,       # 60*0.15 = 9
        "missing_documents": 3,            # 75*0.10 = 7.5
        "annual_revenue": 200000,
    })
    assert result["risk_level"] == "medium"
    assert 50 <= result["risk_score"] < 70


# ---------------------------------------------------------------------------
# 5. Risk score always between 0 and 100
# ---------------------------------------------------------------------------
def test_risk_score_bounds(scorer):
    # Minimum-risk input (everything perfect)
    low = scorer.calculate_risk_score({
        "operator_id": "OP-BOUND-LOW",
        "levy_compliance_rate": 100,
        "late_payments_90d": 0,
        "avg_booking_velocity": 0,
        "unusual_hours_percentage": 0,
        "bsp_connected": True,
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 100,
        "missing_documents": 0,
    })
    assert 0 <= low["risk_score"] <= 100

    # Maximum-risk input (everything terrible)
    high = scorer.calculate_risk_score({
        "operator_id": "OP-BOUND-HIGH",
        "levy_compliance_rate": 0,
        "late_payments_90d": 100,
        "avg_booking_velocity": 100,
        "unusual_hours_percentage": 2.0,
        "bsp_connected": False,
        "bsp_reference_mismatches": 100,
        "avg_agent_trust_score": 0,
        "missing_documents": 100,
    })
    assert 0 <= high["risk_score"] <= 100


# ---------------------------------------------------------------------------
# 6. Risk level thresholds -- verify critical>=85, high>=70, medium>=50, low<50
# ---------------------------------------------------------------------------
def test_risk_level_thresholds(scorer):
    # We can test thresholds indirectly by verifying the mapping in code.
    # Build inputs that land at each level and assert.
    # Critical: levy=0(100*0.25=25), late=7(105capped@100*0.20=20),
    #           velocity=20(40*0.15=6)+unusual=1.0(50)=9.6combined -> booking=50*0.15=7.5,
    #           bsp_disconnected=40+mismatch3=60capped@60 -> 60*0.15=9,
    #           trust=10->90*0.15=13.5, docs=4->100*0.10=10
    # Total = 25+20+7.5+9+13.5+10 = 85 -> critical boundary
    critical = scorer.calculate_risk_score({
        "levy_compliance_rate": 0,
        "late_payments_90d": 7,
        "avg_booking_velocity": 20,
        "unusual_hours_percentage": 1.0,
        "bsp_connected": False,
        "bsp_reference_mismatches": 3,
        "avg_agent_trust_score": 10,
        "missing_documents": 4,
    })
    assert critical["risk_score"] >= 85
    assert critical["risk_level"] == "critical"

    # Medium boundary: target ~50-69
    medium = scorer.calculate_risk_score({
        "levy_compliance_rate": 40,        # 60*0.25=15
        "late_payments_90d": 4,            # 60*0.20=12
        "avg_booking_velocity": 10,        # 20+unusual
        "unusual_hours_percentage": 0.5,   # (20+25)=45*0.15=6.75
        "bsp_connected": False,            # 40*0.15=6
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 40,       # 60*0.15=9
        "missing_documents": 3,            # 75*0.10=7.5
    })
    assert 50 <= medium["risk_score"] < 70
    assert medium["risk_level"] == "medium"

    # Low boundary: target <50
    low = scorer.calculate_risk_score({
        "levy_compliance_rate": 95,
        "late_payments_90d": 0,
        "avg_booking_velocity": 3,
        "unusual_hours_percentage": 0,
        "bsp_connected": True,
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 90,
        "missing_documents": 0,
    })
    assert low["risk_score"] < 50
    assert low["risk_level"] == "low"


# ---------------------------------------------------------------------------
# 7. Recommendations generated -- critical gets suspension, high gets audit
# ---------------------------------------------------------------------------
def test_recommendations_generated(scorer):
    critical = scorer.calculate_risk_score({
        "levy_compliance_rate": 0,
        "late_payments_90d": 7,
        "avg_booking_velocity": 20,
        "unusual_hours_percentage": 1.0,
        "bsp_connected": False,
        "bsp_reference_mismatches": 3,
        "avg_agent_trust_score": 10,
        "missing_documents": 4,
    })
    assert len(critical["recommendations"]) > 0
    assert critical["recommendations"][0] == "IMMEDIATE ACTION: Suspend new bookings pending audit"

    high = scorer.calculate_risk_score({
        "levy_compliance_rate": 15,        # high risk factors
        "late_payments_90d": 5,
        "avg_booking_velocity": 15,
        "unusual_hours_percentage": 0.6,
        "bsp_connected": True,
        "bsp_reference_mismatches": 3,
        "avg_agent_trust_score": 30,
        "missing_documents": 3,
    })
    assert len(high["recommendations"]) > 0
    assert high["recommendations"][0] == "Schedule compliance audit within 14 days"


# ---------------------------------------------------------------------------
# 8. Levy compliance factor -- 0% compliance = 100 risk for that factor
# ---------------------------------------------------------------------------
def test_levy_compliance_factor(scorer):
    result = scorer.calculate_risk_score({
        "levy_compliance_rate": 0,
        "late_payments_90d": 0,
        "avg_booking_velocity": 5,
        "unusual_hours_percentage": 0,
        "bsp_connected": True,
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 80,
        "missing_documents": 0,
    })
    assert result["factors"]["levy_compliance"] == 100, \
        "0% levy compliance should produce 100 risk for that factor"

    # Also verify 100% compliance = 0 risk for that factor
    good = scorer.calculate_risk_score({
        "levy_compliance_rate": 100,
        "late_payments_90d": 0,
        "avg_booking_velocity": 5,
        "unusual_hours_percentage": 0,
        "bsp_connected": True,
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 80,
        "missing_documents": 0,
    })
    assert good["factors"]["levy_compliance"] == 0


# ---------------------------------------------------------------------------
# 9. BSP disconnected -- not connected adds 40 risk
# ---------------------------------------------------------------------------
def test_bsp_disconnected(scorer):
    disconnected = scorer.calculate_risk_score({
        "bsp_connected": False,
        "bsp_reference_mismatches": 0,
        "levy_compliance_rate": 100,
        "late_payments_90d": 0,
        "avg_booking_velocity": 5,
        "unusual_hours_percentage": 0,
        "avg_agent_trust_score": 80,
        "missing_documents": 0,
    })
    assert disconnected["factors"]["bsp_connectivity"] == 40, \
        "Disconnected BSP with no mismatches should add exactly 40 risk"

    connected = scorer.calculate_risk_score({
        "bsp_connected": True,
        "bsp_reference_mismatches": 0,
        "levy_compliance_rate": 100,
        "late_payments_90d": 0,
        "avg_booking_velocity": 5,
        "unusual_hours_percentage": 0,
        "avg_agent_trust_score": 80,
        "missing_documents": 0,
    })
    assert connected["factors"]["bsp_connectivity"] == 0, \
        "Connected BSP with no mismatches should have 0 risk"


# ---------------------------------------------------------------------------
# 10. Batch score -- scores multiple operators, returns correct distribution
# ---------------------------------------------------------------------------
def test_batch_score(scorer):
    operators = [
        {  # critical
            "operator_id": "OP-B1",
            "levy_compliance_rate": 0,
            "late_payments_90d": 7,
            "avg_booking_velocity": 20,
            "unusual_hours_percentage": 1.0,
            "bsp_connected": False,
            "bsp_reference_mismatches": 3,
            "avg_agent_trust_score": 10,
            "missing_documents": 4,
            "annual_revenue": 500000,
        },
        {  # low risk
            "operator_id": "OP-B2",
            "levy_compliance_rate": 100,
            "late_payments_90d": 0,
            "avg_booking_velocity": 3,
            "unusual_hours_percentage": 0,
            "bsp_connected": True,
            "bsp_reference_mismatches": 0,
            "avg_agent_trust_score": 95,
            "missing_documents": 0,
            "annual_revenue": 300000,
        },
    ]
    result = scorer.batch_score(operators)

    assert result["total_scored"] == 2
    assert result["distribution"]["critical"] == 1
    assert result["distribution"]["low"] == 1
    assert result["distribution"]["high"] == 0
    assert result["distribution"]["medium"] == 0
    assert len(result["results"]) == 2
    assert result["total_predicted_leakage"] >= 0
    assert result["avg_risk_score"] > 0


# ---------------------------------------------------------------------------
# 11. Batch score empty -- empty list returns zeros
# ---------------------------------------------------------------------------
def test_batch_score_empty(scorer):
    result = scorer.batch_score([])

    assert result["total_scored"] == 0
    assert result["distribution"] == {
        "critical": 0, "high": 0, "medium": 0, "low": 0,
    }
    assert result["total_predicted_leakage"] == 0
    assert result["avg_risk_score"] == 0
    assert result["results"] == []


# ---------------------------------------------------------------------------
# 12. Predicted leakage -- critical operator with revenue should have leakage
# ---------------------------------------------------------------------------
def test_predicted_leakage(scorer):
    revenue = 2000000
    result = scorer.calculate_risk_score({
        "operator_id": "OP-LEAK",
        "levy_compliance_rate": 0,
        "late_payments_90d": 7,
        "avg_booking_velocity": 20,
        "unusual_hours_percentage": 1.0,
        "bsp_connected": False,
        "bsp_reference_mismatches": 3,
        "avg_agent_trust_score": 10,
        "missing_documents": 4,
        "annual_revenue": revenue,
    })

    assert result["predicted_leakage"] > 0, \
        "Critical operator with revenue should have predicted leakage"

    # Verify the formula: leakage = revenue * (risk_score/100 * 0.3)
    expected = round(revenue * (result["risk_score"] / 100 * 0.3), 2)
    assert result["predicted_leakage"] == expected

    # Zero revenue should yield zero leakage
    zero_rev = scorer.calculate_risk_score({
        "operator_id": "OP-NO-REV",
        "levy_compliance_rate": 0,
        "late_payments_90d": 7,
        "avg_booking_velocity": 20,
        "unusual_hours_percentage": 1.0,
        "bsp_connected": False,
        "bsp_reference_mismatches": 3,
        "avg_agent_trust_score": 10,
        "missing_documents": 4,
        "annual_revenue": 0,
    })
    assert zero_rev["predicted_leakage"] == 0


# ---------------------------------------------------------------------------
# 13. Confidence calculation -- higher risk = lower confidence
# ---------------------------------------------------------------------------
def test_confidence_calculation(scorer):
    low_risk = scorer.calculate_risk_score({
        "levy_compliance_rate": 100,
        "late_payments_90d": 0,
        "avg_booking_velocity": 3,
        "unusual_hours_percentage": 0,
        "bsp_connected": True,
        "bsp_reference_mismatches": 0,
        "avg_agent_trust_score": 95,
        "missing_documents": 0,
    })
    high_risk = scorer.calculate_risk_score({
        "levy_compliance_rate": 0,
        "late_payments_90d": 7,
        "avg_booking_velocity": 20,
        "unusual_hours_percentage": 1.0,
        "bsp_connected": False,
        "bsp_reference_mismatches": 3,
        "avg_agent_trust_score": 10,
        "missing_documents": 4,
    })

    assert low_risk["confidence"] > high_risk["confidence"], \
        "Low-risk operator should have higher confidence than high-risk"

    # Verify the formula: confidence = 95.0 - (risk_score * 0.1)
    expected_low = round(95.0 - (low_risk["risk_score"] * 0.1), 1)
    assert low_risk["confidence"] == expected_low

    expected_high = round(95.0 - (high_risk["risk_score"] * 0.1), 1)
    assert high_risk["confidence"] == expected_high
