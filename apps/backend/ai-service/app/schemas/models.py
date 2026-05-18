from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class AgentBehavior(BaseModel):
    agent_id: str
    booking_velocity: float = Field(..., description="Bookings per hour")
    avg_booking_value: float
    destinations: List[str]
    booking_hours: List[int]
    device_fingerprint: Optional[str] = None
    ip_address: Optional[str] = None
    session_duration_avg: Optional[float] = None
    fail_rate: Optional[float] = None


class AgentFingerprintResponse(BaseModel):
    agent_id: str
    trust_score: float = Field(..., ge=0, le=100)
    anomaly_score: float = Field(..., ge=0, le=100)
    risk_factors: List[str]
    status: str  # normal, suspicious, flagged
    confidence: float = Field(..., ge=0, le=100)
    analyzed_at: str


class BookingComplianceRequest(BaseModel):
    booking_id: str
    operator_id: str
    amount: float
    currency: str = "USD"
    items: List[dict] = []


class ComplianceCheckResponse(BaseModel):
    booking_id: str
    is_compliant: bool
    levy_amount: float
    vat_amount: float
    bsp_fee: float
    flags: List[str]
    confidence: float


class RevenueForecastRequest(BaseModel):
    historical_data: List[dict] = []
    months_ahead: int = 3


class RevenueForecastResponse(BaseModel):
    forecasts: List[dict]
    predicted_leakage: float
    confidence_interval: dict
    leakage_rate: float
    risk_operators: List[dict]


class RevenueLeakageRequest(BaseModel):
    operator_ids: List[str]
    start_date: str
    end_date: str


class RevenueLeakageResponse(BaseModel):
    total_estimated_leakage: float
    breakdown_by_operator: List[dict]
    top_risk_factors: List[str]
    recommended_actions: List[str]
