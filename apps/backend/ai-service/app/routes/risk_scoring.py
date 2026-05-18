from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional
from app.models.compliance_scorer import compliance_scorer
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class OperatorRiskInput(BaseModel):
    operator_id: str
    annual_revenue: float = 0
    levy_compliance_rate: float = Field(100, ge=0, le=100)
    late_payments_90d: int = Field(0, ge=0)
    avg_booking_velocity: float = Field(5, ge=0)
    unusual_hours_percentage: float = Field(0, ge=0, le=1)
    bsp_connected: bool = True
    bsp_reference_mismatches: int = Field(0, ge=0)
    avg_agent_trust_score: float = Field(80, ge=0, le=100)
    missing_documents: int = Field(0, ge=0)


class RiskScoreResponse(BaseModel):
    operator_id: str
    risk_score: float
    risk_level: str
    factors: dict
    predicted_leakage: float
    recommendations: List[str]
    confidence: float
    scored_at: str


@router.post("/score", response_model=RiskScoreResponse)
async def score_operator_risk(operator_data: OperatorRiskInput):
    """Calculate AI-powered risk score for a single operator."""
    try:
        result = compliance_scorer.calculate_risk_score(operator_data.dict())
        return RiskScoreResponse(**result)
    except Exception as e:
        logger.error(f"Risk scoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-score")
async def batch_score_operators(operators: List[OperatorRiskInput]):
    """Score multiple operators and return risk distribution."""
    try:
        result = compliance_scorer.batch_score([op.dict() for op in operators])
        return result
    except Exception as e:
        logger.error(f"Batch scoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/thresholds")
async def get_risk_thresholds():
    """Get current risk level thresholds and their meanings."""
    return {
        "thresholds": {
            "low": {"min": 0, "max": 49, "color": "green", "action": "Standard monitoring"},
            "medium": {"min": 50, "max": 69, "color": "orange", "action": "Enhanced monitoring"},
            "high": {"min": 70, "max": 84, "color": "red", "action": "Compliance audit required"},
            "critical": {"min": 85, "max": 100, "color": "darkred", "action": "Immediate suspension"},
        },
        "weights": {
            "levy_compliance": "25%",
            "payment_timeliness": "20%",
            "booking_patterns": "15%",
            "bsp_connectivity": "15%",
            "agent_trust": "15%",
            "documentation": "10%",
        },
    }
