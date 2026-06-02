import numpy as np
import logging
from typing import Dict, List, Optional
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


class ComplianceRiskScorer:
    """AI-powered compliance risk scoring for tourism operators."""

    def __init__(self):
        self.risk_weights = {
            "levy_compliance": 0.25,
            "payment_timeliness": 0.20,
            "booking_patterns": 0.15,
            "bsp_connectivity": 0.15,
            "agent_trust": 0.15,
            "documentation": 0.10,
        }

    def calculate_risk_score(self, operator_data: dict) -> dict:
        """Calculate comprehensive risk score for an operator."""
        factors = {}

        # Levy compliance (0-100, higher = more risk)
        levy_rate = operator_data.get("levy_compliance_rate", 100)
        factors["levy_compliance"] = max(0, 100 - levy_rate)

        # Payment timeliness
        late_payments = operator_data.get("late_payments_90d", 0)
        factors["payment_timeliness"] = min(100, late_payments * 15)

        # Booking patterns
        booking_velocity = operator_data.get("avg_booking_velocity", 5)
        unusual_hours_pct = operator_data.get("unusual_hours_percentage", 0)
        factors["booking_patterns"] = min(100, (booking_velocity * 2) + (unusual_hours_pct * 50))

        # BSP connectivity
        bsp_connected = operator_data.get("bsp_connected", True)
        bsp_mismatches = operator_data.get("bsp_reference_mismatches", 0)
        factors["bsp_connectivity"] = (0 if bsp_connected else 40) + min(60, bsp_mismatches * 20)

        # Agent trust
        avg_agent_trust = operator_data.get("avg_agent_trust_score", 80)
        factors["agent_trust"] = max(0, 100 - avg_agent_trust)

        # Documentation
        missing_docs = operator_data.get("missing_documents", 0)
        factors["documentation"] = min(100, missing_docs * 25)

        # Weighted risk score
        risk_score = sum(
            factors[k] * self.risk_weights[k] for k in self.risk_weights
        )
        risk_score = round(min(100, max(0, risk_score)), 1)

        # Determine risk level
        if risk_score >= 85:
            risk_level = "critical"
        elif risk_score >= 70:
            risk_level = "high"
        elif risk_score >= 50:
            risk_level = "medium"
        else:
            risk_level = "low"

        # Generate recommendations
        recommendations = self._generate_recommendations(factors, risk_level)

        # Estimate potential leakage
        annual_revenue = operator_data.get("annual_revenue", 0)
        leakage_rate = risk_score / 100 * 0.3  # Max 30% leakage for critical
        predicted_leakage = round(annual_revenue * leakage_rate, 2)

        return {
            "operator_id": operator_data.get("operator_id", "unknown"),
            "risk_score": risk_score,
            "risk_level": risk_level,
            "factors": {k: round(v, 1) for k, v in factors.items()},
            "predicted_leakage": predicted_leakage,
            "recommendations": recommendations,
            "confidence": round(95.0 - (risk_score * 0.1), 1),
            "scored_at": datetime.now(timezone.utc).isoformat(),
        }

    def _generate_recommendations(self, factors: dict, risk_level: str) -> List[str]:
        """Generate actionable recommendations based on risk factors."""
        recs = []

        if factors["levy_compliance"] > 30:
            recs.append("Review levy remittance history and enforce timely payments")
        if factors["payment_timeliness"] > 40:
            recs.append("Schedule payment compliance audit within 14 days")
        if factors["booking_patterns"] > 50:
            recs.append("Investigate unusual booking velocity patterns")
        if factors["bsp_connectivity"] > 30:
            recs.append("Verify BSP connection and reconcile references")
        if factors["agent_trust"] > 40:
            recs.append("Review agent profiles and consider enhanced verification")
        if factors["documentation"] > 20:
            recs.append("Request updated compliance documentation")

        if risk_level == "critical":
            recs.insert(0, "IMMEDIATE ACTION: Suspend new bookings pending audit")
        elif risk_level == "high":
            recs.insert(0, "Schedule compliance audit within 14 days")

        return recs

    def batch_score(self, operators: List[dict]) -> dict:
        """Score multiple operators and return summary."""
        results = [self.calculate_risk_score(op) for op in operators]

        critical = [r for r in results if r["risk_level"] == "critical"]
        high = [r for r in results if r["risk_level"] == "high"]
        medium = [r for r in results if r["risk_level"] == "medium"]
        low = [r for r in results if r["risk_level"] == "low"]

        total_leakage = sum(r["predicted_leakage"] for r in results)

        return {
            "total_scored": len(results),
            "distribution": {
                "critical": len(critical),
                "high": len(high),
                "medium": len(medium),
                "low": len(low),
            },
            "total_predicted_leakage": round(total_leakage, 2),
            "avg_risk_score": round(np.mean([r["risk_score"] for r in results]), 1) if results else 0,
            "results": results,
            "scored_at": datetime.now(timezone.utc).isoformat(),
        }


compliance_scorer = ComplianceRiskScorer()
