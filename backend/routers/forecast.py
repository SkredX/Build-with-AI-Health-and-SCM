from fastapi import APIRouter
from models.schemas import ForecastResponse
from services.forecast_service import ForecastService

router = APIRouter()
forecast_service = ForecastService()

@router.get("/forecast/{district_id}", response_model=ForecastResponse)
def get_forecast(district_id: str, drug_code: str, horizon: int = 30):
    predicted_demand = forecast_service.forecast_demand(district_id, drug_code, horizon)
    # create dummy confidence intervals
    ci = [[d * 0.8, d * 1.2] for d in predicted_demand]
    
    # naive stockout date prediction for district as a whole (not required but dummy is fine)
    stockout_date = "2025-06-01"
    
    return ForecastResponse(
        district_id=district_id,
        drug_code=drug_code,
        predicted_demand=predicted_demand,
        stockout_date=stockout_date,
        confidence_interval=ci
    )
