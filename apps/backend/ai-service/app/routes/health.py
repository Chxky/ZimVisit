from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "zimvisit-ai-engine",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "models": {
            "agent_fingerprinting": "active",
            "revenue_forecaster": "active",
            "compliance_engine": "active",
        },
    }


@router.get("/health/models")
async def model_status():
    return {
        "fingerprinting_engine": {
            "status": "ready",
            "profiles_loaded": len(__import__('app.models.agent_fingerprinting', fromlist=['fingerprinting_engine']).fingerprinting_engine.agent_profiles),
            "anomaly_threshold": 0.25,
        },
        "forecaster": {
            "status": "ready",
            "seasonal_factors_loaded": True,
            "model_type": "polynomial_regression",
        },
    }
