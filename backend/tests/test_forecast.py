import pytest
from services.forecast_service import ForecastService

def test_forecast_demand():
    service = ForecastService()
    forecast = service.forecast_demand("D1", "ORS", 30)
    
    assert len(forecast) == 30
    assert all(isinstance(x, float) for x in forecast)
    assert all(x >= 0 for x in forecast)

def test_predict_stockout():
    service = ForecastService()
    # Assuming P1 has 100 ORS
    days = service.predict_stockout("P1", "ORS")
    assert days == 20.0 # 100 / 5.0
    
    # Missing drug
    days = service.predict_stockout("P1", "UNKNOWN")
    assert days == 0.0

def test_detect_anomaly():
    service = ForecastService()
    score = service.detect_anomaly("D1")
    assert isinstance(score, float)
