import pytest
from app.models.revenue_forecaster import RevenueForecaster


def test_default_forecast():
    forecaster = RevenueForecaster()
    result = forecaster.forecast_revenue([], 3)
    assert len(result["forecasts"]) == 3
    assert result["predicted_leakage"] > 0
    assert result["leakage_rate"] > 0


def test_forecast_with_history():
    forecaster = RevenueForecaster()
    history = [{"revenue": 500000 + i * 10000} for i in range(12)]
    result = forecaster.forecast_revenue(history, 6)
    assert len(result["forecasts"]) == 6
    assert result["confidence_interval"]["lower"] < result["confidence_interval"]["upper"]


def test_risk_operators():
    forecaster = RevenueForecaster()
    result = forecaster.forecast_revenue([], 1)
    assert len(result["risk_operators"]) > 0
    for op in result["risk_operators"]:
        assert "operator_name" in op
        assert "risk_score" in op
