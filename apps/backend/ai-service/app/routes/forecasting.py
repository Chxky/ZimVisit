from fastapi import APIRouter, HTTPException, Query
from app.schemas.models import RevenueForecastRequest, RevenueForecastResponse, RevenueLeakageRequest, RevenueLeakageResponse
from app.models.revenue_forecaster import forecaster
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/revenue", response_model=RevenueForecastResponse)
async def forecast_revenue(request: RevenueForecastRequest):
    try:
        result = forecaster.forecast_revenue(
            historical_data=request.historical_data,
            months_ahead=request.months_ahead,
        )
        return RevenueForecastResponse(**result)
    except Exception as e:
        logger.error(f"Revenue forecast failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/revenue/default")
async def default_forecast(months_ahead: int = Query(3, ge=1, le=12)):
    result = forecaster.forecast_revenue([], months_ahead)
    return result


@router.post("/leakage", response_model=RevenueLeakageResponse)
async def assess_revenue_leakage(request: RevenueLeakageRequest):
    try:
        result = forecaster.assess_revenue_leakage(
            operator_ids=request.operator_ids,
            start_date=request.start_date,
            end_date=request.end_date,
        )
        return RevenueLeakageResponse(**result)
    except Exception as e:
        logger.error(f"Leakage assessment failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/leakage/summary")
async def get_leakage_summary():
    return {
        "total_estimated_annual_leakage": 150000000,
        "current_capture_rate": 68.2,
        "target_capture_rate": 95.0,
        "potential_recovery": 120000000,
        "non_compliant_agencies_estimate": "72%",
        "top_sectors_for_leakage": [
            {"sector": "Tour Packages", "estimated_leakage": 45000000},
            {"sector": "Flight Bookings", "estimated_leakage": 52000000},
            {"sector": "Hotel Bookings", "estimated_leakage": 38000000},
            {"sector": "Car Rentals", "estimated_leakage": 15000000},
        ],
    }
